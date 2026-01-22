const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '../data/users.json');
const SESSIONS_PATH = path.join(__dirname, '../data/sessions.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database files if they don't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));
}
if (!fs.existsSync(SESSIONS_PATH)) {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify({ sessions: {} }, null, 2));
}

// Load database
function loadDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
        return { users: {} };
    }
}

// Save database
function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Load sessions
function loadSessions() {
    try {
        return JSON.parse(fs.readFileSync(SESSIONS_PATH, 'utf8'));
    } catch (e) {
        return { sessions: {} };
    }
}

// Save sessions
function saveSessions(sessions) {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2));
}

// Hash password with salt
function hashPassword(password, salt = null) {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

// Generate session token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// User database operations
const userDB = {
    // Register a new user
    register(username, password) {
        const db = loadDB();

        // Validate username
        if (!username || username.length < 3 || username.length > 20) {
            return { success: false, error: 'Username must be 3-20 characters' };
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return { success: false, error: 'Username can only contain letters, numbers, and underscores' };
        }

        // Check if username exists (case-insensitive)
        const usernameLower = username.toLowerCase();
        if (Object.keys(db.users).some(u => u.toLowerCase() === usernameLower)) {
            return { success: false, error: 'Username already exists' };
        }

        // Validate password
        if (!password || password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        // Create user
        const { hash, salt } = hashPassword(password);
        db.users[username] = {
            passwordHash: hash,
            salt: salt,
            created: Date.now(),
            lastLogin: Date.now(),
            friends: [],
            friendRequests: [],
            xp: 0,
            level: 1,
            stats: {
                totalKills: 0,
                totalDeaths: 0,
                totalScore: 0,
                gamesPlayed: 0,
                highestScore: 0
            }
        };

        saveDB(db);

        // Create session
        const token = this.createSession(username);

        return { success: true, token, username };
    },

    // Login user
    login(username, password) {
        const db = loadDB();

        // Find user (case-insensitive search, but return actual username)
        const actualUsername = Object.keys(db.users).find(u => u.toLowerCase() === username.toLowerCase());
        if (!actualUsername) {
            return { success: false, error: 'Invalid username or password' };
        }

        const user = db.users[actualUsername];
        const { hash } = hashPassword(password, user.salt);

        if (hash !== user.passwordHash) {
            return { success: false, error: 'Invalid username or password' };
        }

        // Update last login
        user.lastLogin = Date.now();
        saveDB(db);

        // Create session
        const token = this.createSession(actualUsername);

        return { success: true, token, username: actualUsername };
    },

    // Create session
    createSession(username) {
        const sessions = loadSessions();
        const token = generateToken();

        // Remove old sessions for this user
        for (const t in sessions.sessions) {
            if (sessions.sessions[t].username === username) {
                delete sessions.sessions[t];
            }
        }

        sessions.sessions[token] = {
            username,
            created: Date.now(),
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };

        saveSessions(sessions);
        return token;
    },

    // Validate session token
    validateToken(token) {
        if (!token) return null;

        const sessions = loadSessions();
        const session = sessions.sessions[token];

        if (!session) return null;
        if (Date.now() > session.expires) {
            delete sessions.sessions[token];
            saveSessions(sessions);
            return null;
        }

        return session.username;
    },

    // Logout (invalidate token)
    logout(token) {
        const sessions = loadSessions();
        if (sessions.sessions[token]) {
            delete sessions.sessions[token];
            saveSessions(sessions);
        }
        return { success: true };
    },

    // Calculate XP needed for a level
    xpForLevel(level) {
        // XP curve: each level requires more XP
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },

    // Calculate total XP for all levels up to a given level
    totalXpForLevel(level) {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.xpForLevel(i);
        }
        return total;
    },

    // Get user profile (public info)
    getProfile(username) {
        const db = loadDB();
        const actualUsername = Object.keys(db.users).find(u => u.toLowerCase() === username.toLowerCase());
        if (!actualUsername) return null;

        const user = db.users[actualUsername];
        const xpForCurrentLevel = this.xpForLevel(user.level || 1);
        const xpInCurrentLevel = (user.xp || 0) - this.totalXpForLevel(user.level || 1);

        return {
            username: actualUsername,
            created: user.created,
            lastLogin: user.lastLogin,
            level: user.level || 1,
            xp: user.xp || 0,
            xpForNextLevel: xpForCurrentLevel,
            xpProgress: xpInCurrentLevel,
            xpProgressPercent: Math.min(100, Math.floor((xpInCurrentLevel / xpForCurrentLevel) * 100)),
            stats: user.stats
        };
    },

    // Send friend request
    sendFriendRequest(fromUsername, toUsername) {
        const db = loadDB();

        const fromUser = db.users[fromUsername];
        const toUserKey = Object.keys(db.users).find(u => u.toLowerCase() === toUsername.toLowerCase());

        if (!toUserKey) {
            return { success: false, error: 'User not found' };
        }
        if (fromUsername.toLowerCase() === toUsername.toLowerCase()) {
            return { success: false, error: 'Cannot add yourself as a friend' };
        }

        const toUser = db.users[toUserKey];

        // Check if already friends
        if (fromUser.friends.some(f => f.toLowerCase() === toUserKey.toLowerCase())) {
            return { success: false, error: 'Already friends with this user' };
        }

        // Check if request already sent
        if (toUser.friendRequests.some(f => f.toLowerCase() === fromUsername.toLowerCase())) {
            return { success: false, error: 'Friend request already sent' };
        }

        // Check if they sent us a request (auto-accept)
        if (fromUser.friendRequests.some(f => f.toLowerCase() === toUserKey.toLowerCase())) {
            // Remove from requests and add as friends
            fromUser.friendRequests = fromUser.friendRequests.filter(f => f.toLowerCase() !== toUserKey.toLowerCase());
            fromUser.friends.push(toUserKey);
            toUser.friends.push(fromUsername);
            saveDB(db);
            return { success: true, message: 'Friend request accepted!' };
        }

        // Add friend request
        toUser.friendRequests.push(fromUsername);
        saveDB(db);

        return { success: true, message: 'Friend request sent!' };
    },

    // Accept friend request
    acceptFriendRequest(username, fromUsername) {
        const db = loadDB();

        const user = db.users[username];
        const fromUserKey = Object.keys(db.users).find(u => u.toLowerCase() === fromUsername.toLowerCase());

        if (!fromUserKey) {
            return { success: false, error: 'User not found' };
        }

        const fromUser = db.users[fromUserKey];

        // Check if request exists
        const requestIndex = user.friendRequests.findIndex(f => f.toLowerCase() === fromUserKey.toLowerCase());
        if (requestIndex === -1) {
            return { success: false, error: 'No friend request from this user' };
        }

        // Remove request and add as friends
        user.friendRequests.splice(requestIndex, 1);
        user.friends.push(fromUserKey);
        fromUser.friends.push(username);
        saveDB(db);

        return { success: true };
    },

    // Decline friend request
    declineFriendRequest(username, fromUsername) {
        const db = loadDB();

        const user = db.users[username];
        const requestIndex = user.friendRequests.findIndex(f => f.toLowerCase() === fromUsername.toLowerCase());

        if (requestIndex === -1) {
            return { success: false, error: 'No friend request from this user' };
        }

        user.friendRequests.splice(requestIndex, 1);
        saveDB(db);

        return { success: true };
    },

    // Remove friend
    removeFriend(username, friendUsername) {
        const db = loadDB();

        const user = db.users[username];
        const friendKey = Object.keys(db.users).find(u => u.toLowerCase() === friendUsername.toLowerCase());

        if (!friendKey) {
            return { success: false, error: 'User not found' };
        }

        const friend = db.users[friendKey];

        user.friends = user.friends.filter(f => f.toLowerCase() !== friendKey.toLowerCase());
        friend.friends = friend.friends.filter(f => f.toLowerCase() !== username.toLowerCase());
        saveDB(db);

        return { success: true };
    },

    // Get friends list with online status
    getFriends(username, onlinePlayers = []) {
        const db = loadDB();
        const user = db.users[username];
        if (!user) return { friends: [], requests: [] };

        const friends = user.friends.map(friendName => {
            const friend = db.users[friendName];
            return {
                username: friendName,
                online: onlinePlayers.some(p => p.toLowerCase() === friendName.toLowerCase()),
                lastLogin: friend ? friend.lastLogin : 0
            };
        });

        return {
            friends,
            requests: user.friendRequests
        };
    },

    // Update user stats and add XP
    updateStats(username, stats) {
        const db = loadDB();
        const user = db.users[username];
        if (!user) return;

        // Initialize xp and level if missing (for existing users)
        if (user.xp === undefined) user.xp = 0;
        if (user.level === undefined) user.level = 1;

        let kills = 0;
        if (typeof stats.kills === 'number') {
            kills = stats.kills;
        } else if (stats.kills) {
            kills =
                (stats.kills.solo || 0) +
                (stats.kills.assists || 0) +
                (stats.kills.bosses || 0) +
                (stats.kills.polygons || 0);
        }
        if (kills) user.stats.totalKills += kills;
        if (stats.deaths) user.stats.totalDeaths += stats.deaths;
        if (stats.score) {
            user.stats.totalScore += stats.score;
            if (stats.score > user.stats.highestScore) {
                user.stats.highestScore = stats.score;
            }
        }
        user.stats.gamesPlayed++;

        // Calculate XP earned this game
        // XP formula: playtime only (1 XP per 10 seconds)
        const playtimeSeconds = Math.max(0, stats.playtimeSeconds || 0);
        let xpEarned = Math.floor(playtimeSeconds / 10);

        user.xp += xpEarned;

        // Check for level ups
        let levelsGained = 0;
        while (user.xp >= this.totalXpForLevel(user.level + 1)) {
            user.level++;
            levelsGained++;
        }

        saveDB(db);

        return { xpEarned, levelsGained, newLevel: user.level };
    }
};

module.exports = userDB;
