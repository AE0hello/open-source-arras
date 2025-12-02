const http = require("http");
const ws = require("ws");
const fs = require("fs");
const path = require("path");

let { socketManager } = require("./Game/network/sockets.js");
let { LagLogger } = require("./Game/debug/lagLogger.js");
let { speedcheckloop } = require("./Game/debug/speedLoop.js");
let { gameHandler } = require("./Game/index.js");
let { gamemodeManager } = require("./Game/gamemodeManager.js");

// Gamemode names
const getName = (name, gamemodeData) => {
    const nameMap = {
        tdm: `${gamemodeData.teams}TDM`,
        ffa: "FFA",
        tag: "Tag",
        opentdm: `Open ${gamemodeData.teams}TDM`,
        clanwars: "Clan Wars",
        trainwars: "Train Wars",
        old_dreadnoughts: `Old Dreadnoughts ${gamemodeData.teams}TDM`,
        nexus: "Nexus",
        blackout: "Blackout",
        outbreak: "Outbreak",
        space: "Space",
        classic: "Classic",
        armsRace: "Arms Race",
        siege_blitz: "Siege Blitz",
        siege_citadel: "Siege Citadel",
        siege_fortress: "Siege Fortress",
        siege_og: "OG Siege",
        siege_legacy: "Siege Legacy",
        assault_bunker: "Assault Bunker",
        assault_booster: "Assault Booster",
        assault_trenches: "Assault Trenches",
        assault_line: "Assault Line",
        assault_eye: "Assault Eye",
        assault_yinyang: "Assault Yin Yang",
        assault_acropolis: "Assault Acropolis",
    };
    return nameMap[name]; 
}

// Here is our actual game server
class gameServer {
    constructor(host, port, gamemode, region, webProperties, serverProperties, isfeatured, parentPort, loaderGlobal) {
        // Override the default settings in Config.js.
        Object.keys(serverProperties).forEach(key => {
            Config[key] = serverProperties[key];
        })
        // Define host, port, gamemode, region, and publicly define webProperties, and serverProperties.
        this.host = host;
        this.port = port;
        this.gamemode = gamemode;
        this.region = region;
        this.webProperties = webProperties;
        this.serverProperties = serverProperties;
        this.name = "Unknown";
        this.featured = isfeatured;
        this.parentPort = parentPort;
        this.definitionsCombiner = new definitionCombiner({ groups: fs.readdirSync(path.join(__dirname, './lib/definitions/groups')), addonsFolder: path.join(__dirname, './lib/definitions/entityAddons') });
        this.loaderGlobal = loaderGlobal;
        // Initalize.
        this.roomSpeed = Config.game_speed;
        this.runSpeed = Config.run_speed;
        this.clients = [];
        this.views = [];
        this.minimap = [];
        this.walls = [];
        this.room = {};
        this.arenaClosed = false;
        this.importedRoom = [];
        this.importRoom = [];
        this.currentRoom = null;
        this.lagLogger = new LagLogger();
        this.socketManager = new socketManager(this);
        this.gameHandler = new gameHandler(this);
        this.gameSpeedCheckHandler = new speedcheckloop(this);

        // Make it public
        global.gameManager = this;

        // Don't forget to bind our manager!
        this.gamemodeManager = new gamemodeManager(this);

        // Start the party
        this.startServer();
    }

    // Get the game info
    getInfo(includegameManager = false) {
        return {
            hidden: this.serverProperties.hidden ?? false,
            ip: this.host === "localhost" ? `${this.host}:${this.port}` : this.host,
            port: this.port,
            players: this.socketManager.clients.length,
            maxPlayers: this.webProperties.maxPlayers,
            id: this.webProperties.id,
            featured: this.featured,
            region: this.region,
            gameMode: this.name,
            gameManager: includegameManager ? this : false,
        }
    }

    // Create a new web server class to handle incoming requests
    startWebServer(socketManager) {
        // Create the socket
        this.wsServer = new ws.WebSocketServer({ noServer: true });
        // Create the http server
        this.httpServer = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            switch (req.url) {
                case "/api/sendPlayer": {
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
                    if (Config.ALLOW_SERVER_TRAVEL) {
                        res.writeHead(200);
                        res.end(JSON.stringify([{
                            ip: this.host,
                            players: this.socketManager.clients.length,
                            gameMode: this.name,
                        }]));
                    } else {
                        res.writeHead(404);
                        res.end("Denied.");
                    }
                } break;
                case "/isOnline": {
                    res.writeHead(200);
                    res.end("True");
                } break;
                default: {
                    // Return the file
                    res.writeHead(200);
                    res.end("Not found");
                } break;
            }
        }).listen(this.port);
        // Reroute all the upgrade messages to our socket
        this.httpServer.on("upgrade", (req, socket, head) => {
            this.wsServer.handleUpgrade(req, socket, head, ws => socketManager.connect(ws, req))
        });
    }

    // Start our server
    startServer() {
        // This code is for loading through the main server only!
        if (!this.parentPort) {
            // Start the server
            this.start();
            // Send the info to the main server so the client can get the info. (in a expensive way)
            for (let i = 0; i < global.servers.length; i++) {
                let server = global.servers[i];
                if (server.loadedViaMainServer) global.servers[i] = this.getInfo(true);
            }
            console.log(global.servers.length == 1 ? "Your game server has successfully booted." : "Game server " + this.name + " successfully booted up via main server.");
            onServerLoaded();
            return;
        };

        // Start the WS Server
        this.startWebServer(this.socketManager);

        // Get the definitions before we can initalize the server.
        this.definitionsCombiner.loadDefinitions(false);

        // Get the tile definitions
        this.loaderGlobal.loadRooms(false);

        // Also load all mockups if needed.
        if (Config.load_all_mockups) global.loadAllMockups(false);

        // Now start the server and send data!
        this.start();

        // If no errors has accoured then annouce that the game server has succssfully booted up.
        console.log("Game server " + this.name + " successfully booted up. Listening on port", this.port);

        // Send the info to the main server so the client can get the info.
        this.parentPort.postMessage([false, this.getInfo()]);

        // let the main server know that it successfully booted.
        this.parentPort.postMessage(["doneLoading"]);
    }

    // Start our game
    start(softStart = false) {
        // Are we starting for the first time?
        if (!softStart) {
            let overrideRoom = true;
            // Get gamemode
            for (let gamemode of this.gamemode) {
                let mode = require(`./Game/gamemodeconfigs/${gamemode}.js`);
                for (let key in mode) {
                    if (key == "do_not_override_room") {
                        overrideRoom = mode[key];
                    } else if (key == "room_setup") {
                        if (!overrideRoom) Config.room_setup = mode[key]; else Config[key].push(...mode[key]);
                    } else {
                        Config[key] = mode[key];
                    }
                }
            };
            // Update the server gamemode name
            this.name = this.gamemode.map(x => getName(x, Config) || (x[0].toUpperCase() + x.slice(1))).join(' ');
            // Activate laby food if enabled
            if (Config.tiered_food) global.activateTieredFood();
            // Initalize the room
            this.setRoom();
            setTimeout(() => {
                // Set the gamemode manager
                this.gamemodeManager.redefine(this);
                // Wake it up
                this.gamemodeManager.request("start");
            }, 200);

            // Check if we have a server travel properties.
            if (Config.SERVER_TRAVEL) {
                if (!Config.SERVER_TRAVEL_PROPERTIES) {
                    console.warn(this.name + " Config.SERVER_TRAVEL_PROPERTIES is not set up! Please set the properties for the server travel system to work.\nProcess terminated.");
                    process.exit(1);
                }
                this.serverTravelHandler = [];
                for (let i = 0; i < Config.SERVER_TRAVEL.length; i++) {
                    let instance = Config.SERVER_TRAVEL[i];
                    this.serverTravelHandler[i] = new (require("./Game/addons/serverTravel.js").serverTravelHandler)(instance, instance.PORTAL_PROPERTIES.SPAWN_CHANCE, instance.PORTAL_PROPERTIES.COLOR);
                    setInterval(() => {
                        let y = 1;
                        if (Config.SERVER_TRAVEL_PROPERTIES.AMOUNT) y = Config.SERVER_TRAVEL_PROPERTIES.AMOUNT;
                        for (let o = 0; o < y; o++) this.serverTravelHandler[i].spawnRandom();
                    }, Config.SERVER_TRAVEL_PROPERTIES.LOOP_INTERVAL);
                }
            }
        }
        // If not, then...
        if (softStart) {
            // Reset 2 stats so we can respawn.
            this.arenaClosed = false;
            global.cannotRespawn = false;
            // Redefine the room
            this.defineRoom();
            // Log that we are running again
            util.log(`[${this.name}] New game instance is now running`);

            // Init every tile
            for (let y = 0; y < this.room.setup.length; y++) {
                for (let x = 0; x < this.room.setup[y].length; x++) {
                    let tile = this.room.setup[y][x];
                    tile.entities = [];
                    tile.init(tile, this.room, this);
                }
            };


            // Set the gamemode manager again.
            this.gamemodeManager.redefine(this);
            // Wake up gamemode manager
            this.gamemodeManager.request("start");
        }

        // Run the server
        this.gameHandler.run();
    }

    // Define the room itself
    defineRoom() {
        this.room = {
            lastCycle: undefined,
            cycleSpeed: 1000 / this.roomSpeed / 30,
            setup: this.importedRoom,
            roomxgrid: this.importedRoom[0].length,
            roomygrid: this.importedRoom.length,
            xgrid: this.importedRoom[0].length,
            ygrid: this.importedRoom.length,
            spawnableDefault: [],
            center: {},
            spawnable: {},
            settings: {
                sandbox: {
                    do_not_change_arena_size: false
                }
            },
        };
        if (!this.wallGrid) {
            this.room.wallGrid = {
                xgrid: Config.sandbox ? 10 : 15,
                ygrid: Config.sandbox ? 10 : 15,
                width: Config.sandbox ? 600 : 900,
                height: Config.sandbox ? 600 : 900,
                getGrid: (location) => {
                    let x = Math.floor((location.x + this.room.wallGrid.width / 2) * this.room.wallGrid.xgrid / this.room.wallGrid.width);
                    let y = Math.floor((location.y + this.room.wallGrid.height / 2) * this.room.wallGrid.ygrid / this.room.wallGrid.height);
                    return {
                        x: (x + .5) / this.room.wallGrid.xgrid * this.room.wallGrid.width - this.room.wallGrid.width / 2,
                        y: (y + .5) / this.room.wallGrid.ygrid * this.room.wallGrid.height - this.room.wallGrid.height / 2,
                        id: x * this.room.wallGrid.xgrid + y
                    };
                }
            }
        }

        // Set properties.
        this.setRoomProperties();

        // And a bunch of functions to it

        // Are we in the room?
        this.room.isInRoom = location => {
            return location.x >= -this.room.width / 2 && location.x <= this.room.width / 2 && location.y >= -this.room.height / 2 && location.y <= this.room.height / 2
        };

        // Are we near the circle?
        this.room.near = function (position, radius) {
            let point = ran.pointInUnitCircle();
            return {
                x: Math.round(position.x + radius * point.x),
                y: Math.round(position.y + radius * point.y)
            };
        };

        // Get a random position in the room
        this.room.random = () => {
            return {
                x: ran.irandom(this.room.width) - this.room.width / 2,
                y: ran.irandom(this.room.height) - this.room.height / 2
            };
        };

        // Get a tile in the room
        this.room.getAt = location => {
            try {
                if (!this.room.isInRoom(location)) return null;
                let a = Math.floor((location.y + this.room.height / 2) / this.room.tileWidth);
                let b = Math.floor((location.x + this.room.width / 2) / this.room.tileHeight);
                return this.room.setup[a][b];
            } catch (e) {
                return undefined;
            }
        };

        // Tile locator
        this.room.isAt = (location) => {
            if (!this.room.isInRoom(location)) return false;
            let x = Math.floor((location.x + this.room.width / 2) * this.room.xgrid / this.room.width);
            let y = Math.floor((location.y + this.room.height / 2) * this.room.ygrid / this.room.height);
            return {
                x: (x + .5) / this.room.xgrid * this.room.width - this.room.width / 2,
                y: (y + .5) / this.room.ygrid * this.room.height - this.room.height / 2,
                id: x * this.room.xgrid + y
            };
        };
    }

    // Define room properties
    setRoomProperties() {
        // It's size
        Object.defineProperties(this.room, {
            tileWidth: { get: () => Config.map_tile_width, set: v => Config.map_tile_width = v },
            tileHeight: { get: () => Config.map_tile_height, set: v => Config.map_tile_height = v },
            width: { get: () => this.room.xgrid * Config.map_tile_width, set: v => Config.map_tile_width = v / this.room.xgrid },
            height: { get: () => this.room.ygrid * Config.map_tile_height, set: v => Config.map_tile_height = v / this.room.ygrid }
        });

        // And center
        Object.defineProperties(this.room.center, {
            x: { get: () => this.room.xgrid * Config.map_tile_width / 2 - this.room.width / 2, set: v => Config.map_tile_width = v * 2 / this.room.xgrid - this.room.width / 2 },
            y: { get: () => this.room.ygrid * Config.map_tile_height / 2 - this.room.height / 2, set: v => Config.map_tile_height = v * 2 / this.room.ygrid - this.room.height / 2 }
        });
    }

    // Set up the room
    setRoom() {
        // Get the room setup(s)
        for (let filename of Config.room_setup) {
            // ... get the current setup
            this.currentRoom = require(`./Game/room_setup/rooms/${filename}.js`);
            Config.roomHeight = this.currentRoom.length;
            Config.roomWidth = this.currentRoom[0].length;

            // Now we loop for tiles
            for (let y = 0; y < Config.roomHeight; y++) {
                for (let x = 0; x < Config.roomWidth; x++) {
                    if (this.importedRoom[y] == null) {
                        this.importedRoom[y] = this.currentRoom[y];
                    } else if (this.currentRoom[y][x]) {
                        this.importedRoom[y][x] = this.currentRoom[y][x];
                    }
                }
            }
        };

        // Set the room
        this.defineRoom();

        // Now lets make the tiles as TileEntity so they can work properly
        for (let y in this.room.setup) {
            for (let x in this.room.setup[y]) {
                let tile = this.room.setup[y][x] = new tileEntity(this.room.setup[y][x], { x, y }, this);
                // Initialize the tile
                tile.init(tile, this.room, this);
            }
        };
    }

    // Room living loop
    roomLoop() {
        // Update all the entities
        for (let entity of entities.values()) {
            let tile = this.room.getAt(entity);
            if (tile && !entity.godmode && !entity.bond && !entity.immuneToTiles) tile.entities.push(entity);
        }
        // Update all the tiles
        for (let y = 0; y < this.room.setup.length; y++) {
            for (let x = 0; x < this.room.setup[y].length; x++) {
                let tile = this.room.setup[y][x];
                tile.tick(tile, this.room, this);
                // We can clean the tile entities now
                tile.entities = [];
            }
        }

        // If a client doesn't yet know what are we doing, broadcast it to him.
        // But only once
        if (this.room.sendColorsToClient) {
            this.room.sendColorsToClient = false;
            sockets.broadcastRoom();
        }
    }

    // Arena closers here we come
    closeArena() {
        // Check if the arena is closed
        if (this.arenaClosed) return;
        // Log this
        util.saveToLog("Game Instance Ending", "Game running " + this.gamemode + " at `" + this.gamemode + "` is now closing.", 0xEE4132);
        util.log(`[${this.name}] Arena Closing initiated`);
        // And broadcast it
        this.socketManager.broadcast("Arena closed: No players may join!");
        this.arenaClosed = true;
        // Now we actually spawn arena closers
        // But only in 5 seconds...
        let spawnTimeout = setTimeout(() => {
            for (let i = 0; i < 15; i++) {
                // Decide where we are facing
                let angle = ((Math.PI * 2) / 15) * i;
                // Spawn the entity
                let o = new Entity({
                    x: (this.room.width / 2 * this.room.xgrid / this.room.width) + (this.room.width / 0.7) * Math.cos(angle),
                    y: (this.room.width / 2 * this.room.xgrid / this.room.width) + (this.room.width / 0.7) * Math.sin(angle),
                });

                // Define it as arena closer
                o.define('arenaCloser');
                o.define({
                    COLOR: 3,
                    AI: {
                        FULL_VIEW: true,
                        SKYNET: true,
                        BLIND: true,
                        CHASE: true,
                    },
                    CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: true }], "mapTargetToGoal"],
                    SKILL: Array(10).fill(9),
                    ACCEPTS_SCORE: false,
                    CAN_BE_ON_LEADERBOARD: false,
                    VALUE: 100000,
                    LEVEL: 45,
                    CAN_GO_OUTSIDE_ROOM: true,
                });
                // Set it's team, name and minimap color
                o.team = TEAM_ENEMIES;
                o.name = "Arena Closer";
                o.minimapColor = "yellow";
                o.alwaysActive = true;
            }
        }, 500)
        // Every second we check how well arena closers are doing
        let ticks = 0;
        let loop = setInterval(() => {
            ticks++;
            // If they fail, we close anyway
            if (ticks >= 50) return clearInterval(loop), this.close(spawnTimeout);

            let alive = false;
            for (const instance of entities.values()) {
                if (
                    (instance.isPlayer && !instance.invuln && !instance.godmode) || instance.isMothership ||
                    instance.isBot ||
                    (instance.isDominator && instance.team !== TEAM_ENEMIES)
                ) {
                    alive = true;
                }
            }

            // Can we close?
            if (!alive) clearInterval(loop), this.close(spawnTimeout);
        }, 1000);
    }

    // For sandbox mainly
    updateBounds(width, height) {
        // Get room size
        const widthSize = parseInt(width);
        const heightSize = parseInt(height);
        // Update the value
        this.room.width = widthSize;
        this.room.height = heightSize;
        // Rebroadcast the room
        this.socketManager.broadcastRoom();
    }

    close(spawnTimeout) {
        // Log that we are closing
        util.log(`[${this.name}] Ending Game instance`);
        // Clear the timeout if the arena closers did not spawn yet
        if (spawnTimeout) clearTimeout(spawnTimeout);
        // Now broadcast it
        this.socketManager.broadcast("Closing!");
        this.arenaClosed = true;
        for (let entity of entities.values()) if (entity.isPlayer || entity.isBot) entity.kill(); // Kill all players and bots.
        setTimeout(() => {
            // Wipe everyone
            for (let client of this.clients) {
                client.close();
            };
            // Kill the gamemode and the game looper
            this.gamemodeManager.terminate();
            this.gameHandler.stop();

            setTimeout(() => {
                // Wipe everything
                entities.clear();
                targetableEntities.clear();
                this.views = [];
                this.minimap = [];
                this.walls = [];
                this.gameHandler.bots = [];
                this.gameHandler.foods = [];
                this.gameHandler.nestFoods = [];
                global.grid.clear();
                global.spawnPoint = undefined;
                this.onEnd();
            }, 1000)
        }, 1000)
    }

    onEnd() {
        // Log that we are restarting
        util.log(`[${this.name}] Game instance is now over. Soft restarting the server.`);
        // Set this to true to run the softstart code
        this.start(true);
    }

    reloadDefinitions = () => this.definitionsCombiner.loadDefinitions(false, false); 
}

module.exports = { gameServer };
