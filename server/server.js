// Log startup messages
console.log("Starting up...");
console.log("Importing modules...\n");

const path = require("path");
const fs = require("fs");

const { Worker } = require("worker_threads");

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

// Initialize Custom Networking System
const {
  initializeCustomNetworking,
  integrateWithExistingSocketManager,
  setupCustomPacketHandlers,
  setupNetworkMonitoring,
  enhanceGameLoop,
  patchSocketManager
} = require("./lib/network/integration.js");

// Initialize the custom networking system
initializeCustomNetworking();

// Load definitions and tile definitions
new definitionCombiner({ groups: fs.readdirSync(path.join(__dirname, "./lib/definitions/groups")), addonsFolder: path.join(__dirname, "./lib/definitions/entityAddons") }).loadDefinitions();
GLOBAL.loadRooms(true);

// Optionally load all mockups if enabled in configuration
if (Config.load_all_mockups) {
  global.loadAllMockups();
}

// Log loader information including creation date and time
console.log(`Loader successfully loaded all files. Info: [ Created Date: ${GLOBAL.creationDate} Created Time: ${GLOBAL.creationTime} ]`);

// Define the public directory for static files
const publicRoot = path.join(__dirname, "../public/"),
  mimeSet = {
    js: "application/javascript",
    json: "application/json",
    css: "text/css",
    html: "text/html",
    md: "text/markdown"
    // "png": "image/png",
  };

let wsServer; // WebSocket server instance
let server; // HTTP server instance

// Attempt to create a WebSocket server instance using the 'ws' package
try {
  const WebSocketServer = require("ws").WebSocketServer;
  wsServer = new WebSocketServer({ noServer: true });
}
// eslint-disable-next-line no-unused-vars
catch (err) {
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
  const serversIP = [];
  const clientHeaders = ["/ext/custom-shape"];
  let selectedHeader = null;

  // Set CORS headers if enabled in the configuration or allow only the children servers.
  for (const server of global.servers) {
    if (server.ip !== Config.host && server.ip) {
      const http = server.ip.startsWith("localhost") ? `http://${server.ip}` : `https://${server.ip}`;
      serversIP.push(http);
    }
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
      // Serve a list of active servers (excluding hidden ones)
      readString = JSON.stringify(servers.filter((s) => s && !s.hidden).map((server) => ({
        ip: server.ip,
        players: server.players,
        maxPlayers: server.maxPlayers,
        id: server.id,
        featured: server.featured,
        region: server.region,
        gameMode: server.gameMode
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
        } catch { /* ignore parse error */ }
        if (json) {
          if (json.key === process.env.API_KEY) {
            const { id, name, definition, score, level, skillcap, skill, points, killCount } = json;
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
      const sserver = [];
      if (Config.ALLOW_SERVER_TRAVEL && global.launchedOnMainServer) {
        for (let i = 0; i < global.servers.length; i++) {
          const server = global.servers[i];
          if (server.gameManager) {
            sserver.push(server);
          }
        }
        res.writeHead(200);
        res.end(JSON.stringify(sserver.map((server) => ({
          ip: server.ip,
          players: server.players,
          gameMode: server.gameMode
        }))));
      } else {
        res.writeHead(404);
        res.end("Denied.");
      }
    } break;
    case "/isOnline": {
      readString = "true";
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

/**
 * Loads a game server with the specified parameters.
 * @param {boolean} loadViaMain - Whether the server is loaded via main process.
 * @param {string} host - The host address for the server.
 * @param {number} port - The port number for the server.
 * @param {string} gamemode - The gamemode for the server.
 * @param {string} region - The region for the server.
 * @param {object} webProperties - Web properties for the server.
 * @param {object} properties - Additional properties for the server.
 * @param {boolean} isFeatured - Whether the server is featured.
 */
function loadGameServer(loadViaMain = false, host, port, gamemode, region, webProperties, properties, isFeatured) {
  // Determine the new server index and initialize an empty object in the global servers array
  if (!loadViaMain) {
    const index = global.servers.length;
    global.servers.push({});

    // Create a new worker thread to load the game server asynchronously
    const worker = new Worker("./server/serverLoader.js", {
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
      if (global.launchedOnMainServer) {
        console.warn("Only one server can be loaded via through the main server!\nProcess terminated.");
        process.exit(1);
      }
      global.launchedOnMainServer = true;
      new (require("./game.js").gameServer)(Config.host, Config.port, gamemode, region, webProperties, properties, isFeatured, false);
    }, 10);
  }
}

// Server Loaded Callback
let loadedServers = 0;
global.onServerLoaded = () => {
  loadedServers++;
  // Once all servers are loaded, log status and routing table
  if (loadedServers >= global.servers.length) {
    util.saveToLog("Servers up", "All servers booted up.", 0x37F554);
    if (Config.startup_logs) {
      util.log("Dumping endpoint -> gamemode routing table");
      for (const game of global.servers) {
        console.log("> " + `${Config.host}/#${game.id}`.padEnd(40, " ") + " -> " + game.gameMode);
      }
      console.log("\n");
    }

    // Setup custom networking for each loaded server
    for (const server of global.servers) {
      if (server.gameManager && server.gameManager.socketManager) {
        console.log(`Setting up custom networking for server: ${server.gameMode}`);

        // Integrate custom networking with existing socket manager
        const socketBridge = integrateWithExistingSocketManager(server.gameManager.socketManager);

        // Setup custom packet handlers
        setupCustomPacketHandlers();

        // Setup network monitoring
        setupNetworkMonitoring();

        // Enhance game loop
        enhanceGameLoop();

        // Patch socket manager with network enhancements
        patchSocketManager();

        // Store the bridge reference for later use
        server.networkBridge = socketBridge;

        console.log(`Custom networking integrated for server: ${server.gameMode}`);
      }
    }

    const serverStartEndTime = performance.now();
    console.log("Server loaded in " + util.rounder(serverStartEndTime, 4) + " milliseconds.");
    console.log("[WEB SERVER] Server listening on port", Config.port);
    console.log("[CUSTOM NETWORK] Custom networking system active on all servers");
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
  });
});

// Upgrade HTTP connections to WebSocket connections if applicable
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (ws) => {
    if (global.launchedOnMainServer) {
      for (let i = 0; i < global.servers.length; i++) {
        const server = global.servers[i];
        if (server.gameManager) {
          server.gameManager.socketManager.connect(ws, req);
        }
      }
    } else {
      ws.close();
    }
  });
});

// Set up a loop to periodically call Bun's garbage collector if available
const bunLoop = setInterval(() => {
  try {
    Bun.gc(true);
  }
  // eslint-disable-next-line no-unused-vars
  catch (err) {
    // If Bun.gc fails, clear the interval
    clearInterval(bunLoop);
  }
}, 1000);

// Log that the web server has been initialized if logging is enabled
if (Config.startup_logs) {
  console.log("Web Server initialized.");
}
