// Log startup messages
console.log("Starting up...");
console.log("Importing modules...\n");

const path = require("path");
const fs = require("fs");

const { Worker } = require("worker_threads");
const userDB = require("./lib/userDatabase.js");

// Increase the stack trace limit for better debugging
Error.stackTraceLimit = Infinity;

// Load environment variables from .env using a custom dotenv loader
const dotenv = require("./lib/dotenv.js");
const envContent = fs.readFileSync(path.join(__dirname, "./.env")).toString();
const environment = dotenv(envContent);

// Set each environment variable in process.env
for (const key in environment) {
    process.env[key] = environment[key];
}

// Load all necessary modules and files via the loader
const GLOBAL = require("./loaders/loader.js");

// Load definitions and tile definitions
new definitionCombiner({ groups: fs.readdirSync(path.join(__dirname, './lib/definitions/groups')), addonsFolder: path.join(__dirname, './lib/definitions/entityAddons') }).loadDefinitions();
GLOBAL.loadRooms(true);

// Optionally load all mockups if enabled in configuration
if (Config.load_all_mockups) global.loadAllMockups();

// Log loader information including creation date and time
console.log(`Loader successfully loaded all files. Info: [ Created Date: ${GLOBAL.creationDate} Created Time: ${GLOBAL.creationTime} ]`);

// Define the public directory for static files
const publicRoot = path.join(__dirname, "../public/"),
mimeSet = {
    js: "application/javascript",
    json: "application/json",
    css: "text/css",
    html: "text/html",
    md: "text/markdown",
    //"png": "image/png",
};

let wsServer; // WebSocket server instance
let server; // HTTP server instance

// Attempt to create a WebSocket server instance using the 'ws' package
try {
    const WebSocketServer = require("ws").WebSocketServer;
    wsServer = new WebSocketServer({ noServer: true });
} catch (err) {
    throw new Error(
        "Package 'ws' is not installed! To install it, run 'npm install ws' in the terminal."
    );
}

// Log a warning if Access-Control-Allow-Origin is enabled
if (Config.allow_ACAO && Config.startup_logs) {
    util.warn("Access-Control-Allow-Origin is enabled, which allows any server/client to access data from the WebServer.");
}

// Create an HTTP server to handle both API and static file requests
server = require("http").createServer((req, res) => {
    let readString = ""; // Response content for API endpoints
    let ok = true; // Flag to indicate whether we use default API response
    let serversIP = [];
    let clientHeaders = ["/ext/custom-shape"];
    let selectedHeader = null;

    // Set CORS headers if enabled in the configuration or allow only the children servers.
    for (let server of global.servers) if (server.ip !== Config.host && server.ip) {
        let http = server.ip.startsWith("localhost") ? `http://${server.ip}` : `https://${server.ip}`;
        serversIP.push(http);
    };
    if (Config.allow_ACAO || serversIP.includes(req.headers.origin)) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    }
    for (let i = 0; i < clientHeaders.length; i++) {
        if (clientHeaders[i] == req.url) {
            selectedHeader = clientHeaders[i];
        }
    }
    // Handle specific API endpoints based on the request URL
    switch (req.url) {
        case "/getServers.json": {
            const forwardedHost = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
            const hostOnly = forwardedHost ? forwardedHost.split(":")[0] : "";
            // Serve a list of active servers (excluding hidden ones)
            readString = JSON.stringify(servers.filter((s) => s && !s.hidden).map((server) => ({
                    ip: (!server.ip || ["localhost", "127.0.0.1", "::1"].includes(server.ip)) && hostOnly ? hostOnly : server.ip,
                    players: server.players,
                    maxPlayers: server.maxPlayers,
                    id: server.id,
                    featured: server.featured,
                    region: server.region,
                    gameMode: server.gameMode,
                }))
            );
        } break;
        case "/getTotalPlayers": {
            let countPlayers = 0;
            servers.forEach((s) => {
                countPlayers += s.players;
            });
            readString = JSON.stringify(countPlayers);
        } break;
        case "/api/sendPlayer": {
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                let json = null;
                try {
                    json = JSON.parse(body);
              } catch { }
                  if (json) {
                      if (json.key === process.env.API_KEY) {
                            let { id, name, definition, score, level, skillcap, skill, points, killCount } = json;
                            global.travellingPlayers.push({ id, name, definition, score, level, skillcap, skill, points, killCount });
                            res.writeHead(200);
                            res.end("OK");
                        } else {
                            res.writeHead(403);
                            res.end("Access Denied");
                        }
                    } else {
                        res.writeHead(400);
                        res.end("Invalid JSON body");
                    }
            });
        } break;
        case "/portalPermission": {
            ok = false;
            let sserver = [];
            if (Config.ALLOW_SERVER_TRAVEL && global.launchedOnMainServer) {
                for (let i = 0; i < global.servers.length; i++) {
                    let server = global.servers[i];
                    if (server.gameManager) sserver.push(server);
                }
                res.writeHead(200);
                res.end(JSON.stringify(sserver.map((server) => ({
                    ip: server.ip,
                    players: server.players,
                    gameMode: server.gameMode,
                }))));
            } else {
                res.writeHead(404);
                res.end("Denied.");
            }
        } break;
        case "/isOnline": {
            readString = "true";
        } break;

        case "/api/config": {
            readString = JSON.stringify({ account: Config.account });
        } break;

        // User Account API Routes (only enabled if Config.account is true)
        case "/api/register": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { username, password } = JSON.parse(body);
                    const result = userDB.register(username, password);
                    res.writeHead(result.success ? 200 : 400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/login": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { username, password } = JSON.parse(body);
                    const result = userDB.login(username, password);
                    res.writeHead(result.success ? 200 : 401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/logout": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token } = JSON.parse(body);
                    const result = userDB.logout(token);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/validate": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (username) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: true, username }));
                    } else {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Invalid or expired token" }));
                    }
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/profile": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { username } = JSON.parse(body);
                    const profile = userDB.getProfile(username);
                    if (profile) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: true, profile }));
                    } else {
                        res.writeHead(404, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "User not found" }));
                    }
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/friends": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (!username) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Not logged in" }));
                        return;
                    }
                    // Get online players from all servers
                    const onlinePlayers = [];
                    for (const server of global.servers) {
                        if (server.gameManager && server.gameManager.players) {
                            for (const player of server.gameManager.players) {
                                if (player.accountUsername) onlinePlayers.push(player.accountUsername);
                            }
                        }
                    }
                    const friends = userDB.getFriends(username, onlinePlayers);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, ...friends }));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/friends/add": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token, username: friendUsername } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (!username) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Not logged in" }));
                        return;
                    }
                    const result = userDB.sendFriendRequest(username, friendUsername);
                    res.writeHead(result.success ? 200 : 400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/friends/accept": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token, username: fromUsername } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (!username) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Not logged in" }));
                        return;
                    }
                    const result = userDB.acceptFriendRequest(username, fromUsername);
                    res.writeHead(result.success ? 200 : 400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/friends/decline": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token, username: fromUsername } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (!username) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Not logged in" }));
                        return;
                    }
                    const result = userDB.declineFriendRequest(username, fromUsername);
                    res.writeHead(result.success ? 200 : 400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case "/api/friends/remove": {
            if (!Config.account) {
                ok = false;
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Accounts are disabled" }));
                break;
            }
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const { token, username: friendUsername } = JSON.parse(body);
                    const username = userDB.validateToken(token);
                    if (!username) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ success: false, error: "Not logged in" }));
                        return;
                    }
                    const result = userDB.removeFriend(username, friendUsername);
                    res.writeHead(result.success ? 200 : 400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, error: "Invalid request" }));
                }
            });
        } break;

        case selectedHeader: {
            // For all other routes, serve static files from the public directory
            ok = false;
            let fileToGet = path.join(publicRoot, req.url);

            // If the requested file doesn't exist or isn't a file, default to the INDEX_HTML file
            if (!fs.existsSync(fileToGet) || !fs.lstatSync(fileToGet).isFile()) {
                fileToGet = path.join(publicRoot, `${selectedHeader}/index.html`);
            }

            // Determine the file's MIME type based on its extension and serve the file stream
            const extension = fileToGet.split(".").pop();
            res.writeHead(200, { "Content-Type": mimeSet[extension] || "text/html" });
            fs.createReadStream(fileToGet).pipe(res);
        } break;

        default: {
            // For all other routes, serve static files from the public directory
            ok = false;
            let fileToGet = path.join(publicRoot, req.url);

            // If the requested file doesn't exist or isn't a file, default to the main_menu file
            if (!fs.existsSync(fileToGet) || !fs.lstatSync(fileToGet).isFile()) {
                fileToGet = path.join(publicRoot, Config.main_menu);
            }

            // Determine the file's MIME type based on its extension and serve the file stream
            const extension = fileToGet.split(".").pop();
            res.writeHead(200, { "Content-Type": mimeSet[extension] || "text/html" });
            fs.createReadStream(fileToGet).pipe(res);
        } break;
    }

    // If an API endpoint was handled, send the JSON response
    if (ok) {
        res.writeHead(200);
        res.end(readString);
    }
});

// Loads a game server
function loadGameServer(loadViaMain = false, host, port, gamemode, region, webProperties, properties, isFeatured) {
    // Determine the new server index and initialize an empty object in the global servers array
    if (!loadViaMain) {
        let index = global.servers.length;
        global.servers.push({});

        // Create a new worker thread to load the game server asynchronously
        let worker = new Worker("./server/serverLoader.js", {
            workerData: {
                host,
                port: port, // Increment port for each server
                gamemode,
                region,
                webProperties,
                properties,
                isFeatured
            }
        });

        // Listen for messages from the worker to update the server's status
        worker.on("message", message => {
            const flag = message.shift();
            switch (flag) {
                case false:
                    // Initial load: store server details
                    global.servers[index] = message.shift();
                    break;
                case true:
                    // Update: change the server's player count
                    global.servers[index].players = message.shift();
                    break;
                case "doneLoading":
                    // Once loading is complete, trigger the server loaded callback
                    onServerLoaded();
                    break;
            }
        });
    } else {
        global.servers.push({ loadedViaMainServer: true });
        setTimeout(() => { // Space it a little out.

            global.launchedOnMainServer = true;
            new (require("./game.js").gameServer)(Config.host, Config.port, gamemode, region, webProperties, properties, isFeatured, false);
        }, 10)
    }
}

// Server Loaded Callback
let loadedServers = 0;
global.onServerLoaded = () => {
    loadedServers++;
    // Once all servers are loaded, log the status and routing table
    if (loadedServers >= global.servers.length) {
        util.saveToLog("Servers up", "All servers booted up.", 0x37F554);
        if (Config.startup_logs) {
            util.log("Dumping endpoint -> gamemode routing table");
            for (const game of global.servers) {
                console.log("> " + `${Config.host}/#${game.id}`.padEnd(40, " ") + " -> " + game.gameMode);
            }
            console.log("\n");
        }
        let serverStartEndTime = performance.now();
        console.log("Server loaded in " + util.rounder(serverStartEndTime, 4) + " milliseconds.");
        console.log("[WEB SERVER] Server listening on port", Config.port);
    }
};

// Start the HTTP Server & Load Game Servers
server.listen(Config.port, () => {
    Config.servers.forEach(server => {
        // Load all of the servers.
        loadGameServer(
            server.share_client_server,
            server.host,
            server.port,
            server.gamemode,
            server.region,
            { id: server.id, maxPlayers: server.player_cap },
            server.properties,
            server.featured
        );
    })
});

// Upgrade HTTP connections to WebSocket connections if applicable
server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (ws) => {
        if (!global.launchedOnMainServer) {
            ws.close();
            return;
        }
        const path = (req.url || "").split("?")[0];
        const serverId = path.replace(/^\/+/, "");
        const target = serverId ? global.servers.find(s => s.id === serverId && s.gameManager) : null;
        if (target) {
            target.gameManager.socketManager.connect(ws, req);
            return;
        }
        const fallback = global.servers.find(s => s.gameManager);
        if (fallback) {
            fallback.gameManager.socketManager.connect(ws, req);
            return;
        }
        ws.close();
    });
});

// Set up a loop to periodically call Bun's garbage collector if available
let bunLoop = setInterval(() => {
    try {
        Bun.gc(true);
    } catch (e) {
        // If Bun.gc fails, clear the interval
        clearInterval(bunLoop);
    }
}, 1000);

// Log that the web server has been initialized if logging is enabled
if (Config.startup_logs) console.log("Web Server initialized.");
