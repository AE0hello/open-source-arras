const prefix = "$";

/** COMMANDS **/
let commands = [
  {
        command: ["help"],
        description: "Show this help menu.",
        level: 0,
        run: ({ socket, level }) => {
            let useOldMenu = false;
            let lines = [
            "Help menu:",
            ...commands.filter((c) => level >= c.level && !c.hidden).map((c) => {
                    let cmdData = [c.command];
                    let commandText = cmdData.map((e) => e.map((name) => name).join(` or ${prefix} `)).join(" ")
                    let description = c.description ?? false;
                    let text = `- ${prefix} ${commandText}`;
                    if (description) text += ` - ${description}`;
                    return text;
                }),
            ];
            if (useOldMenu) {
                for (let line of lines.reverse()) {
                    socket.talk("m", 15_000, line);
                }
            } else socket.talk("Em", 15_000, JSON.stringify(lines));
        },
    },
    {
        command: ["leaderboard", "b"],
        description: "Select the leaderboard to display.",
        level: 0,
        run: ({ socket, args }) => {
            let sendAvailableLeaderboardMessage = () => {
                let lines = [
                    "Available leaderboards:",
                    ...leaderboards.map(lb => `- ${lb}`)
                ];
                socket.talk("Em", 10_000, JSON.stringify(lines));
            };

            const leaderboards = [
                "default",
                "players",
                "bosses",
                "global",
            ];
            const choice = args[0];

            if (!choice) {
                sendAvailableLeaderboardMessage(socket);
                return;
            }

            if (leaderboards.includes(choice)) {
                socket.status.selectedLeaderboard = choice;
                socket.status.forceNewBroadcast = true;
                socket.talk("m", 4_000, "Leaderboard changed.");
            } else {
                socket.talk("m", 4_000, "Unknown leaderboard.");
            }
        }
    },
    {
        command: ["toggle", "t"],
        description: "Enable or disable chat",
        level: 0,
        run: ({ socket }) => {
            socket.status.disablechat = socket.status.disablechat ?? false;
            socket.talk("m", 3_000, `In-game chat ${socket.status.disablechat ? "enabled" : "disabled"}`);
        }
    },
    {
        command: ["arena"],
        description: "Manage the arena",
        level: 1,
        hidden: true,
        run: ({ socket, args, gameManager }) => {
            let sendAvailableArenaMessage = () => {
                let lines = [
                    "Help menu:",
                    `- ${prefix} arena size dynamic - Make the size of the arena dynamic, depending on the number of players`,
                    `- ${prefix} arena size <width> <height> - Set the size of the arena`,
                    `- ${prefix} arena team <team> - Set the number of teams, from 0 (FFA) to 4 (4TDM)`,
                    `- ${prefix} arena spawnpoint [x] [y] - Set a location where all players spawn on default`,
                    `- ${prefix} arena close - Close the arena`,
                ];
                if (!Config.sandbox) lines.splice(1, 1)
                socket.talk("Em", 10_000, JSON.stringify(lines));
            }
            if (!args[0]) sendAvailableArenaMessage(); else {
                switch (args[0]) {
                    case "size":
                        if (args[1] === "dynamic") {
                            if (!Config.sandbox) return socket.talk("m", 3_000, "This command is only available on sandbox.");
                            gameManager.room.settings.sandbox.do_not_change_arena_size = false;
                        } else {
                            if (!args[1] || !args[2]) return socket.talk("m", 3_000, "Invalid arguments.");
                            if (args[1] % 2 === 0 && args[2] % 2 === 0) {
                                if (Config.sandbox) gameManager.room.settings.sandbox.do_not_change_arena_size = true;
                                gameManager.updateBounds(args[1] * 30, args[2] * 30);
                            } else {
                                socket.talk("m", 3000, "Arena size must be even.");
                            }
                        }
                        break;
                    case "team":
                        if (!args[1]) return socket.talk("m", 3_000, "Invalid argument.");
                        if (args[1] === "0") {
                            Config.mode = "ffa";
                            Config.teams = null;
                            socket.rememberedTeam = undefined;
                        } else {
                            Config.mode = "tdm";
                            Config.teams = args[1];
                            socket.rememberedTeam = undefined;
                        }
                        break;
                    case "spawnpoint":
                        if (!args[1] || !args[2]) return socket.talk("m", 3_000, "Invalid arguments.");
                        socket.talk("m", 4_000, "Spawnpoint set.");
                        global.spawnPoint = {
                            x: parseInt(args[1] * 30),
                            y: parseInt(args[2] * 30),
                        };
                        break;
                    case "close":
                        util.warn(`${socket.player.body.name === "" ? `An unnamed player (ip: ${socket.ip})` : socket.player.body.name} has closed the arena.`);
                        gameManager.closeArena();
                        break;
                    default:
                        socket.talk("m", 4_000, "Unknown subcommand.");
                }
            }
        }
    },
    {
        command: ["broadcast"],
        description: "Broadcast a message to all players.",
        level: 2,
        hidden: true,
        run: ({ args, socket, gameManager }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No message specified.");
            }
            else {
                gameManager.socketManager.broadcast(args.join(" "));
            }
        }
    },
    {
        command: ["define"],
        description: "Change your level.",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No entity specified.");
            }
            else {
                socket.player.body.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
                socket.player.body.define(args[0]);
                socket.talk("m", 5_000, `Changed to ${socket.player.body.label}`);
            }
        },
    },
    {
        command: ["level"],
        description: "Change your level.",
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No level specified.");
            }
            else {
                socket.player.body.define({ LEVEL: args[0] });
                socket.talk("m", 5_000, `Changed to level ${socket.player.body.level}`);
            }
        },
    },
    {
        command: ["team"],
        description: "Change your team.", // player teams are -1 through -8, dreads are -10, room is -100 and enemies is -101
        level: 2,
        hidden: true,
        run: ({ args, socket }) => {
            if (!args[0]) {
                socket.talk("m", 5_000, "No team specified.");
            }
            else {
                socket.player.body.define({ COLOR: getTeamColor(args[0]), TEAM: args[0] });
                socket.talk("m", 5_000, `Changed to team ${socket.player.body.team}`);
            }
        },
    },
    {
        command: ["developer", "dev"],
        description: "Developer commands, go troll some players or just take a look for yourself.",
        level: 3,
        run: ({ socket, args, gameManager }) => {
            const sendAvailableDevCommandsMessage = () => {
                const lines = [
                    "Dev commands:",
                    "- $ dev god [on|off]",
                    "- $ dev noclip [on|off]",
                    "- $ dev invisible [on|off]",
                    "- $ dev tp <x> <y>",
                    "- $ dev tphere <name|id>",
                    "- $ dev tpall <x> <y>",
                    "- $ dev setlevel <n>",
                    "- $ dev setscore <n>",
                    "- $ dev setskill <stat> <n>",
                    "- $ dev maxskills",
                    "- $ dev heal",
                    "- $ dev killme",
                    "- $ dev kill <name|id>",
                    "- $ dev respawn",
                    "- $ dev resetstats",
                    "- $ dev spawn <entity> [count]",
                    "- $ dev despawn <radius>",
                    "- $ dev clearbots",
                    "- $ dev addbots <n>",
                    "- $ dev freeze [on|off]",
                    "- $ dev restart",
                    "- $ dev closearena",
                    "- $ dev speed <mult>",
                    "- $ dev size <mult>",
                    "- $ dev fov <mult>",
                    "- $ dev recoil [on|off]",
                    "- $ dev autocannon [on|off]",
                    "- $ dev nohit [on|off]",
                    "- $ dev nofire [on|off]",
                    "- $ dev nomove [on|off]",
                    "- $ dev dev",
                    "- $ dev listplayers",
                    "- $ dev info <name|id>",
                    "- $ dev giveop <name|id>",
                    "- $ dev revokeop <name|id>",
                    "- $ dev ban <name|id>",
                    "- $ dev permaban <name|id>",
                    "- $ dev unban <ip>",
                    "- $ dev reloaddefs",
                    "- $ dev reloadroom",
                    "- $ dev mockups",
                    "- $ dev perf",
                    "- $ dev entities",
                    "- $ dev reload <n|inf>",
                    "- $ dev reloadattrs",
                ];
                socket.talk("Em", 10_000, JSON.stringify(lines));
            };
            const command = args[0];
            const body = socket.player?.body;
            const clampToggle = (value) => {
                if (value == null) return null;
                if (["on", "true", "1"].includes(value)) return true;
                if (["off", "false", "0"].includes(value)) return false;
                return null;
            };
            const parseNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
            const findPlayer = (query) => {
                if (!query) return null;
                const lower = query.toLowerCase();
                for (const client of gameManager.clients) {
                    const playerBody = client.player?.body;
                    if (!playerBody) continue;
                    if (String(playerBody.id) === query) return client;
                    if ((playerBody.name || "").toLowerCase() === lower) return client;
                }
                return null;
            };
            const ensureBody = () => {
                if (!body) {
                    socket.talk("m", 5_000, "You must be spawned.");
                    return false;
                }
                return true;
            };
            const setToggle = (value, fallback) => {
                const parsed = clampToggle(value);
                return parsed == null ? !fallback : parsed;
            };
            const statIndex = {
                atk: 6,
                hlt: 7,
                spd: 4,
                str: 2,
                pen: 1,
                dam: 3,
                rld: 0,
                mob: 9,
                rgn: 8,
                shi: 5,
            };

            if (!command) return sendAvailableDevCommandsMessage();

            if (command === "reloaddefs" || command === "redefs") {
                /* IMPORT FROM (defsReloadCommand.js) */
                if (!global.reloadDefinitionsInfo) {
                    global.reloadDefinitionsInfo = {
                        lastReloadTime: 1,
                    };
                }
                // Rate limiter for anti-lag
                let time = performance.now();
                let sinceLastReload = time - global.reloadDefinitionsInfo.lastReloadTime;
                if (sinceLastReload < 5000) {
                    socket.talk('m', Config.popup_message_duration, `Wait ${Math.floor((5000 - sinceLastReload) / 100) / 10} seconds and try again.`);
                    return;
                }
                // Set the timeout timer ---
                global.reloadDefinitionsInfo.lastReloadTime = time;

                // Remove function so all for(let x in arr) loops work
                delete Array.prototype.remove;

                // Before we purge the class, we are going to stop the game interval first
                gameManager.gameHandler.stop();

                // Now we can purge Class
                Class = {};

                // Log it.
                util.warn(`[IMPORTANT] Definitions are going to be reloaded on server ${gameManager.gamemode} (${gameManager.webProperties.id})!`);

                // Purge all cache entries of every file in definitions
                for (let file in require.cache) {
                    if (!file.includes('definitions') || file.includes(__filename)) continue;
                    delete require.cache[file];
                }

                // Load all definitions
                gameManager.reloadDefinitions();

                // Put the removal function back
                Array.prototype.remove = function (index) {
                    if (index === this.length - 1) return this.pop();
                    let r = this[index];
                    this[index] = this.pop();
                    return r;
                };

                // Redefine all tanks and bosses
                for (let entity of entities.values()) {
                    // If it's a valid type, and it's not a turret
                    if (!['tank', 'miniboss', 'food'].includes(entity.type)) continue;
                    if (entity.bond) continue;

                    let entityDefs = JSON.parse(JSON.stringify(entity.defs));
                    // Save color to put it back later
                    let entityColor = entity.color.compiled;

                    // Redefine all properties and update values to match
                    entity.upgrades = [];
                    entity.define(entityDefs);
                    for (let instance of entities.values()) {
                        if (
                            instance.settings.clearOnMasterUpgrade &&
                            instance.master.id === entity.id
                        ) {
                            instance.kill();
                        }
                    }
                    entity.skill.update();
                    entity.syncTurrets();
                    entity.refreshBodyAttributes();
                    entity.color.interpret(entityColor);
                }

                // Tell the command sender
                socket.talk('m', Config.popup_message_duration, "Successfully reloaded all definitions.");


                // Erase mockups so it can rebuild.
                mockupData = [];
                // Load all mockups if enabled in configuration
                if (Config.load_all_mockups) global.loadAllMockups(false);

                setTimeout(() => { // Let it sit for a second.
                    // Erase cached mockups for each connected clients.
                    gameManager.clients.forEach(socket => {
                        socket.status.mockupData = socket.initMockupList();
                        socket.status.selectedLeaderboard2 = socket.status.selectedLeaderboard;
                        socket.status.selectedLeaderboard = "stop";
                        socket.talk("RE"); // Also reset the global.entities in the client so it can refresh.
                        if (Config.load_all_mockups) for (let i = 0; i < mockupData.length; i++) {
                            socket.talk("M", mockupData[i].index, JSON.stringify(mockupData[i]));
                        }
                        socket.status.selectedLeaderboard = socket.status.selectedLeaderboard2;
                        delete socket.status.selectedLeaderboard2;
                        socket.talk("CC"); // Clear cache
                    });
                    // Log it again.
                    util.warn(`[IMPORTANT] Definitions are successfully reloaded on server ${gameManager.gamemode} (${gameManager.webProperties.id})!`);
                    gameManager.gameHandler.run();
                }, 1000)
                return;
            }

            if (command === "reloadroom") {
                gameManager.setRoom();
                gameManager.defineRoom();
                gameManager.socketManager.broadcastRoom();
                socket.talk("m", 5_000, "Room reloaded.");
                return;
            }

            if (command === "mockups") {
                mockupData = [];
                if (Config.load_all_mockups) global.loadAllMockups(false);
                socket.talk("m", 5_000, "Mockups reloaded.");
                return;
            }

            if (command === "perf") {
                socket.talk("m", 5_000, `Lag ${gameManager.lagLogger.totalTime.toFixed(2)}ms, roomSpeed ${gameManager.roomSpeed}.`);
                return;
            }

            if (command === "entities") {
                const counts = {};
                for (const e of entities.values()) {
                    counts[e.type] = (counts[e.type] || 0) + 1;
                }
                const lines = ["Entities:", ...Object.entries(counts).map(([k, v]) => `- ${k}: ${v}`)];
                socket.talk("Em", 10_000, JSON.stringify(lines));
                return;
            }

            if (command === "listplayers") {
                const lines = ["Players:"];
                for (const client of gameManager.clients) {
                    const b = client.player?.body;
                    if (!b) continue;
                    lines.push(`- ${b.name || "unnamed"} (id ${b.id}, team ${b.team})`);
                }
                socket.talk("Em", 10_000, JSON.stringify(lines));
                return;
            }

            if (command === "info") {
                const target = findPlayer(args[1]);
                if (!target?.player?.body) return socket.talk("m", 5_000, "Player not found.");
                const b = target.player.body;
                socket.talk("m", 8_000, `${b.name || "unnamed"} id=${b.id} team=${b.team} score=${b.skill.score} lvl=${b.skill.level}`);
                return;
            }

            if (command === "giveop" || command === "revokeop") {
                const target = findPlayer(args[1]);
                if (!target?.player?.body) return socket.talk("m", 5_000, "Player not found.");
                const enable = command === "giveop";
                target.player.body.hasOperator = enable;
                target.status.hasOperator = enable;
                target.talk("m", 8_000, enable ? "You are now an operator." : "You are no longer an operator.");
                socket.talk("m", 5_000, enable ? "Operator granted." : "Operator revoked.");
                return;
            }

            if (command === "ban" || command === "permaban") {
                const target = findPlayer(args[1]);
                if (!target) return socket.talk("m", 5_000, "Player not found.");
                command === "ban" ? target.ban("Banned by developer.") : target.permaban("Permanently banned by developer.");
                return;
            }

            if (command === "unban") {
                const ip = args[1];
                if (!ip) return socket.talk("m", 5_000, "No IP specified.");
                if (global.bans) global.bans = global.bans.filter(b => b.ip !== ip);
                if (global.permBans) global.permBans = global.permBans.filter(b => b.ip !== ip);
                socket.talk("m", 5_000, `Unbanned ${ip}.`);
                return;
            }

            if (!ensureBody()) return;

            if (command === "god" || command === "invuln") {
                const enable = setToggle(args[1], body.godmode);
                body.godmode = enable;
                socket.talk("m", 4_000, `Invulnerability ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "noclip") {
                const enable = setToggle(args[1], body.store.noWallCollision);
                body.store.noWallCollision = enable;
                socket.talk("m", 4_000, `Noclip ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "invisible") {
                const enable = setToggle(args[1], body.alpha === 0);
                body.invisible = [0, 0];
                body.alpha = enable ? 0 : 1;
                body.allowedOnMinimap = !enable;
                socket.talk("m", 4_000, `Invisibility ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "tp") {
                const x = parseNumber(args[1]);
                const y = parseNumber(args[2]);
                if (x == null || y == null) return socket.talk("m", 5_000, "Invalid coordinates.");
                body.x = x;
                body.y = y;
                socket.talk("m", 4_000, "Teleported.");
                return;
            }

            if (command === "tphere") {
                const target = findPlayer(args[1]);
                if (!target?.player?.body) return socket.talk("m", 5_000, "Player not found.");
                target.player.body.x = body.x;
                target.player.body.y = body.y;
                socket.talk("m", 4_000, "Teleported player.");
                return;
            }

            if (command === "tpall") {
                const x = parseNumber(args[1]);
                const y = parseNumber(args[2]);
                if (x == null || y == null) return socket.talk("m", 5_000, "Invalid coordinates.");
                for (const client of gameManager.clients) {
                    const b = client.player?.body;
                    if (!b) continue;
                    b.x = x;
                    b.y = y;
                }
                socket.talk("m", 4_000, "Teleported all players.");
                return;
            }

            if (command === "setlevel") {
                const level = parseNumber(args[1]);
                if (level == null) return socket.talk("m", 5_000, "Invalid level.");
                body.define({ LEVEL: level });
                socket.talk("m", 4_000, `Level set to ${body.skill.level}.`);
                return;
            }

            if (command === "setscore") {
                const score = parseNumber(args[1]);
                if (score == null) return socket.talk("m", 5_000, "Invalid score.");
                body.skill.score = score;
                while (body.skill.maintain()) {}
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Score updated.");
                return;
            }

            if (command === "setskill") {
                const stat = args[1];
                const value = parseNumber(args[2]);
                if (!stat || value == null || statIndex[stat] == null) return socket.talk("m", 5_000, "Usage: setskill <stat> <n>");
                body.skill.raw[statIndex[stat]] = Math.max(0, value);
                body.skill.update();
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Skill updated.");
                return;
            }

            if (command === "maxskills") {
                body.skill.set(body.skill.caps);
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Skills maxed.");
                return;
            }

            if (command === "heal") {
                body.health.amount = body.health.max;
                if (body.shield?.max) body.shield.amount = body.shield.max;
                socket.talk("m", 4_000, "Healed.");
                return;
            }

            if (command === "killme") {
                body.kill();
                return;
            }

            if (command === "kill") {
                const target = findPlayer(args[1]);
                if (!target?.player?.body) return socket.talk("m", 5_000, "Player not found.");
                target.player.body.kill();
                return;
            }

            if (command === "respawn") {
                socket.status.deceased = true;
                socket.spawn(body.name || "");
                return;
            }

            if (command === "resetstats") {
                body.skill.reset();
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Stats reset.");
                return;
            }

            if (command === "spawn") {
                const entity = args[1];
                const count = parseNumber(args[2]) ?? 1;
                if (!entity) return socket.talk("m", 5_000, "No entity specified.");
                let classDef;
                try {
                    classDef = ensureIsClass(entity);
                } catch (e) {
                    return socket.talk("m", 5_000, "Unknown entity.");
                }
                for (let i = 0; i < Math.min(50, count); i++) {
                    const loc = getSpawnableArea(undefined, gameManager);
                    let o = new Entity({ x: loc.x, y: loc.y });
                    o.define(classDef);
                }
                socket.talk("m", 4_000, `Spawned ${count}.`);
                return;
            }

            if (command === "despawn") {
                const radius = parseNumber(args[1]) ?? 500;
                const radiusSq = radius * radius;
                let removed = 0;
                for (const e of entities.values()) {
                    if (e.isPlayer || e.isBot) continue;
                    const dx = e.x - body.x;
                    const dy = e.y - body.y;
                    if (dx * dx + dy * dy <= radiusSq) {
                        e.kill();
                        removed++;
                    }
                }
                socket.talk("m", 4_000, `Removed ${removed} entities.`);
                return;
            }

            if (command === "clearbots") {
                let removed = 0;
                for (const e of entities.values()) {
                    if (!e.isBot) continue;
                    e.kill();
                    removed++;
                }
                socket.talk("m", 4_000, `Removed ${removed} bots.`);
                return;
            }

            if (command === "addbots") {
                const amount = parseNumber(args[1]) ?? 1;
                for (let i = 0; i < Math.min(50, amount); i++) {
                    const loc = getSpawnableArea(undefined, gameManager);
                    gameManager.gameHandler.spawnBots(loc);
                }
                socket.talk("m", 4_000, `Added ${amount} bots.`);
                return;
            }

            if (command === "freeze") {
                const enable = setToggle(args[1], !gameManager.gameHandler.active);
                if (enable) gameManager.gameHandler.stop();
                else if (!gameManager.gameHandler.active) gameManager.gameHandler.run();
                socket.talk("m", 4_000, enable ? "Game frozen." : "Game resumed.");
                return;
            }

            if (command === "restart") {
                gameManager.closeArena();
                return;
            }

            if (command === "closearena") {
                gameManager.closeArena();
                return;
            }

            if (command === "speed") {
                const value = parseNumber(args[1]);
                if (value == null) return socket.talk("m", 5_000, "Invalid value.");
                body.SPEED = value;
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Speed updated.");
                return;
            }

            if (command === "size") {
                const value = parseNumber(args[1]);
                if (value == null) return socket.talk("m", 5_000, "Invalid value.");
                body.SIZE = value;
                body.coreSize = value;
                socket.talk("m", 4_000, "Size updated.");
                return;
            }

            if (command === "fov") {
                const value = parseNumber(args[1]);
                if (value == null) return socket.talk("m", 5_000, "Invalid value.");
                body.FOV = value;
                socket.talk("m", 4_000, "FOV updated.");
                return;
            }

            if (command === "recoil") {
                const enable = setToggle(args[1], body.settings.hasNoRecoil);
                body.settings.hasNoRecoil = enable;
                socket.talk("m", 4_000, `No recoil ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "autocannon") {
                socket.player.command.autofire = !socket.player.command.autofire;
                socket.talk("m", 4_000, `Autofire ${socket.player.command.autofire ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "nohit") {
                const enable = setToggle(args[1], body.settings.noHit);
                body.settings.noHit = enable;
                socket.talk("m", 4_000, `No-hit ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "nofire") {
                const enable = setToggle(args[1], body.settings.noFire);
                body.settings.noFire = enable;
                socket.talk("m", 4_000, `No-fire ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "nomove") {
                const enable = setToggle(args[1], body.settings.noMove);
                body.settings.noMove = enable;
                socket.talk("m", 4_000, `No-move ${enable ? "enabled" : "disabled"}.`);
                return;
            }

            if (command === "dev") {
                body.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
                body.define("developer");
                socket.talk("m", 4_000, "Switched to Developer.");
                return;
            }

            if (command === "reload") {
                const raw = args[1];
                if (!raw) return socket.talk("m", 5_000, "Usage: reload <n|inf>");
                if (["inf", "infinite", "max"].includes(raw.toLowerCase())) {
                    body.settings.hasNoReloadDelay = true;
                    socket.talk("m", 4_000, "Reload set to infinite.");
                    return;
                }
                const value = parseNumber(raw);
                if (value == null) return socket.talk("m", 5_000, "Usage: reload <n|inf>");
                body.settings.hasNoReloadDelay = false;
                body.skill.raw[statIndex.rld] = Math.max(0, value);
                body.skill.update();
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Reload updated.");
                return;
            }

            if (command === "reloadattrs") {
                const defs = body.defs;
                body.define({ RESET_UPGRADES: true, BATCH_UPGRADES: false });
                body.define(defs);
                body.refreshBodyAttributes();
                socket.talk("m", 4_000, "Attributes reloaded.");
                return;
            }

            sendAvailableDevCommandsMessage();
        },
    },
]

/** COMMANDS RUN FUNCTION **/
function runCommand(socket, message, gameManager) {
    if (!message.startsWith(prefix) || !socket?.player?.body) return;

    let args = message.slice(prefix.length).split(" ");
    let commandName = args.shift();
    let command = commands.find((command) => command.command.includes(commandName));
    if (command) {
        let permissionsLevel = socket.permissions?.level ?? 0;
        let level = command.level;

        if (permissionsLevel >= level) {
            try {
                command.run({ socket, message, args, level: permissionsLevel, gameManager: gameManager });
            } catch (e) {
                console.error("Error while running ", commandName);
                console.error(e);
                socket.talk("m", 5_000, "An error occurred while running this command.");
            }
        } else socket.talk("m", 5_000, "You do not have access to this command.");
    } else socket.talk("m", 5_000, "Unknown command.");

    return true;
}
global.addChatCommand = function (command) {
    if (!command.command || !command.run) {
        throw new Error("Invalid command format. A command must have at least a 'command' and a 'run' property.");
    }
    if (!Array.isArray(command.command)) {
        throw new Error("Invalid command format. The 'command' property must be an array of strings.");
    }
    if (commands.find(c => c.command.some(cmd => command.command.includes(cmd)))) {
        throw new Error("A command with this name already exists.");
    }
    commands.push(command);
}


/** CHAT MESSAGE EVENT **/
module.exports = ({ Events }) => {
    Events.on("chatMessage", ({ socket, message, preventDefault, gameManager }) => {
        if (message.startsWith(prefix)) {
            preventDefault();
            runCommand(socket, message, gameManager);
        }
    });
};
