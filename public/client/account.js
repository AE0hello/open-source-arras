// Account Management System - Modal Based
const AccountManager = {
    token: localStorage.getItem('authToken'),
    username: localStorage.getItem('username'),
    isLoggedIn: false,
    isEnabled: false,
    level: 1,
    xpProgress: 0,

    async init() {
        // Check if accounts are enabled on the server
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            this.isEnabled = config.account === true;
        } catch (e) {
            this.isEnabled = false;
        }

        // Hide account UI if accounts are disabled
        if (!this.isEnabled) {
            document.getElementById('accountCorner').style.display = 'none';
            return;
        }

        // Show account corner since accounts are enabled
        document.getElementById('accountCorner').style.display = '';

        // Check if we have a stored token and validate it
        if (this.token) {
            const valid = await this.validateToken();
            if (valid) {
                this.showLoggedInState();
                this.loadProfile();
            } else {
                this.clearSession();
                this.showLoggedOutState();
            }
        } else {
            this.showLoggedOutState();
        }
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Account corner button (logged out)
        document.getElementById('accountLoggedOut').addEventListener('click', () => this.openModal());

        // Account menu button (logged in)
        document.getElementById('accountMenuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => this.closeDropdown());

        // Dropdown buttons
        document.getElementById('friendsBtn').addEventListener('click', () => this.openFriendsModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Modal close buttons
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('friendsModalClose').addEventListener('click', () => this.closeFriendsModal());

        // Modal backdrop clicks
        document.querySelectorAll('.modalBackdrop').forEach(backdrop => {
            backdrop.addEventListener('click', () => {
                this.closeModal();
                this.closeFriendsModal();
            });
        });

        // Modal tabs
        document.getElementById('modalLoginTab').addEventListener('click', () => this.showLoginForm());
        document.getElementById('modalRegisterTab').addEventListener('click', () => this.showRegisterForm());

        // Login form
        document.getElementById('modalLoginBtn').addEventListener('click', () => this.login());
        document.getElementById('modalLoginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Register form
        document.getElementById('modalRegisterBtn').addEventListener('click', () => this.register());
        document.getElementById('modalRegisterConfirm').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.register();
        });

        // Friends
        document.getElementById('sendFriendRequest').addEventListener('click', () => this.sendFriendRequest());
        document.getElementById('addFriendInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendFriendRequest();
        });
    },

    openModal() {
        document.getElementById('accountModal').style.display = 'flex';
        document.getElementById('modalLoginUsername').focus();
    },

    closeModal() {
        document.getElementById('accountModal').style.display = 'none';
        // Clear forms
        document.getElementById('modalLoginUsername').value = '';
        document.getElementById('modalLoginPassword').value = '';
        document.getElementById('modalRegisterUsername').value = '';
        document.getElementById('modalRegisterPassword').value = '';
        document.getElementById('modalRegisterConfirm').value = '';
        document.getElementById('modalLoginError').textContent = '';
        document.getElementById('modalRegisterError').textContent = '';
    },

    openFriendsModal() {
        this.closeDropdown();
        document.getElementById('friendsModal').style.display = 'flex';
        this.loadFriends();
    },

    closeFriendsModal() {
        document.getElementById('friendsModal').style.display = 'none';
    },

    toggleDropdown() {
        const dropdown = document.getElementById('accountDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    },

    closeDropdown() {
        document.getElementById('accountDropdown').style.display = 'none';
    },

    showLoginForm() {
        document.getElementById('modalLoginTab').classList.add('active');
        document.getElementById('modalRegisterTab').classList.remove('active');
        document.getElementById('modalLoginForm').style.display = 'block';
        document.getElementById('modalRegisterForm').style.display = 'none';
    },

    showRegisterForm() {
        document.getElementById('modalRegisterTab').classList.add('active');
        document.getElementById('modalLoginTab').classList.remove('active');
        document.getElementById('modalRegisterForm').style.display = 'block';
        document.getElementById('modalLoginForm').style.display = 'none';
    },

    showLoggedInState() {
        this.isLoggedIn = true;
        document.getElementById('accountLoggedOut').style.display = 'none';
        document.getElementById('accountLoggedIn').style.display = 'flex';
        document.getElementById('accountUsername').textContent = this.username;
    },

    showLoggedOutState() {
        this.isLoggedIn = false;
        document.getElementById('accountLoggedOut').style.display = 'block';
        document.getElementById('accountLoggedIn').style.display = 'none';
    },

    updateLevelDisplay(level, xpProgressPercent) {
        document.getElementById('accountLevel').textContent = level;
        document.getElementById('levelProgress').style.width = xpProgressPercent + '%';
    },

    async apiRequest(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Network error' };
        }
    },

    async validateToken() {
        const result = await this.apiRequest('/api/validate', { token: this.token });
        if (result.success) {
            this.username = result.username;
            localStorage.setItem('username', this.username);
            return true;
        }
        return false;
    },

    async login() {
        const username = document.getElementById('modalLoginUsername').value.trim();
        const password = document.getElementById('modalLoginPassword').value;
        const errorDiv = document.getElementById('modalLoginError');

        if (!username || !password) {
            errorDiv.textContent = 'Please enter username and password';
            return;
        }

        const result = await this.apiRequest('/api/login', { username, password });

        if (result.success) {
            this.token = result.token;
            this.username = result.username;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('username', this.username);
            errorDiv.textContent = '';
            this.closeModal();
            this.showLoggedInState();
            this.loadProfile();
        } else {
            errorDiv.textContent = result.error || 'Login failed';
        }
    },

    async register() {
        const username = document.getElementById('modalRegisterUsername').value.trim();
        const password = document.getElementById('modalRegisterPassword').value;
        const confirm = document.getElementById('modalRegisterConfirm').value;
        const errorDiv = document.getElementById('modalRegisterError');

        if (!username || !password) {
            errorDiv.textContent = 'Please fill in all fields';
            return;
        }

        if (password !== confirm) {
            errorDiv.textContent = 'Passwords do not match';
            return;
        }

        const result = await this.apiRequest('/api/register', { username, password });

        if (result.success) {
            this.token = result.token;
            this.username = result.username;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('username', this.username);
            errorDiv.textContent = '';
            this.closeModal();
            this.showLoggedInState();
            this.loadProfile();
        } else {
            errorDiv.textContent = result.error || 'Registration failed';
        }
    },

    async logout() {
        this.closeDropdown();
        await this.apiRequest('/api/logout', { token: this.token });
        this.clearSession();
        this.showLoggedOutState();
    },

    clearSession() {
        this.token = null;
        this.username = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
    },

    async loadProfile() {
        const result = await this.apiRequest('/api/profile', { username: this.username });
        if (result.success && result.profile) {
            const profile = result.profile;
            this.level = profile.level || 1;
            this.xpProgress = profile.xpProgressPercent || 0;

            // Update level display
            this.updateLevelDisplay(this.level, this.xpProgress);

            // Update dropdown stats
            const stats = profile.stats;
            document.getElementById('dropdownKills').textContent = Number(stats.totalKills) || 0;
            document.getElementById('dropdownDeaths').textContent = Number(stats.totalDeaths) || 0;
            document.getElementById('dropdownBest').textContent = this.formatScore(stats.highestScore || 0);
        }
    },

    formatScore(score) {
        if (score >= 1000000) return (score / 1000000).toFixed(1) + 'M';
        if (score >= 1000) return (score / 1000).toFixed(1) + 'K';
        return score.toString();
    },

    async loadFriends() {
        if (!this.token) return;

        const result = await this.apiRequest('/api/friends', { token: this.token });
        if (result.success) {
            this.renderFriendRequests(result.requests || []);
            this.renderFriendsList(result.friends || []);
        }
    },

    renderFriendRequests(requests) {
        const container = document.getElementById('friendRequests');
        if (requests.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = requests.map(username => `
            <div class="friendRequest">
                <span>${this.escapeHtml(username)} wants to be friends</span>
                <div class="actions">
                    <button class="accept" onclick="AccountManager.acceptFriend('${this.escapeHtml(username)}')" title="Accept">&#10003;</button>
                    <button class="decline" onclick="AccountManager.declineFriend('${this.escapeHtml(username)}')" title="Decline">&#10005;</button>
                </div>
            </div>
        `).join('');
    },

    renderFriendsList(friends) {
        const container = document.getElementById('friendsList');
        if (friends.length === 0) {
            container.innerHTML = '<div class="noFriends">No friends yet. Add some!</div>';
            return;
        }

        // Sort: online first, then by name
        friends.sort((a, b) => {
            if (a.online !== b.online) return b.online - a.online;
            return a.username.localeCompare(b.username);
        });

        container.innerHTML = friends.map(friend => `
            <div class="friendItem">
                <div class="friendName">
                    <div class="onlineStatus ${friend.online ? 'online' : ''}"></div>
                    <span>${this.escapeHtml(friend.username)}</span>
                </div>
                <button onclick="AccountManager.removeFriend('${this.escapeHtml(friend.username)}')" title="Remove">&#10005;</button>
            </div>
        `).join('');
    },

    async sendFriendRequest() {
        const input = document.getElementById('addFriendInput');
        const username = input.value.trim();

        if (!username) return;

        const result = await this.apiRequest('/api/friends/add', {
            token: this.token,
            username: username
        });

        if (result.success) {
            input.value = '';
            this.loadFriends();
            alert(result.message || 'Friend request sent!');
        } else {
            alert(result.error || 'Failed to send friend request');
        }
    },

    async acceptFriend(username) {
        const result = await this.apiRequest('/api/friends/accept', {
            token: this.token,
            username: username
        });

        if (result.success) {
            this.loadFriends();
        } else {
            alert(result.error || 'Failed to accept friend request');
        }
    },

    async declineFriend(username) {
        const result = await this.apiRequest('/api/friends/decline', {
            token: this.token,
            username: username
        });

        if (result.success) {
            this.loadFriends();
        } else {
            alert(result.error || 'Failed to decline friend request');
        }
    },

    async removeFriend(username) {
        if (!confirm(`Remove ${username} from friends?`)) return;

        const result = await this.apiRequest('/api/friends/remove', {
            token: this.token,
            username: username
        });

        if (result.success) {
            this.loadFriends();
        } else {
            alert(result.error || 'Failed to remove friend');
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Get account info for game connection
    getAccountInfo() {
        if (this.isLoggedIn) {
            return {
                token: this.token,
                username: this.username
            };
        }
        return null;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AccountManager.init();
});

// Refresh profile periodically when logged in and accounts are enabled
setInterval(() => {
    if (AccountManager.isEnabled && AccountManager.isLoggedIn) {
        AccountManager.loadProfile();
    }
}, 60000);

// Export for use in other modules
window.AccountManager = AccountManager;
