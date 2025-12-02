module.exports = {
    // Main Menu
    main_menu: "index.html", // Where the main menu is located (in the /public folder).
    host: "localhost:3000", // Game server domain. If the host is 'localhost:NUMBER', the NUMBER must be the port setting.
    port: 3000, // Which port to run the web server on.

    // Server
    visible_list_interval: 250, // How often to update the list of the entities that players can see. Has effects of when entities are activated.
    startup_logs: true, // Enable startup logs and log speed loop warnings in terminal
    load_all_mockups: false, // Set to true if you want every mockup to be loaded when the server starts. May noticeably slow down server startup.

    servers: [ // Make sure to change the HOST, PORT and SERVER_ID between servers!
        {
            use_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            host: "localhost:3001", // Server host location.
            port: 3001, // The port on the server.
            id: "loc", // (<host>/#<id>)
            featured: false,

            region: "local", // The region the server is on.
            gamemode: ["ffa"], // The selected gamemode.
            player_cap: 80, // The maximum number of players that can join the server. Not including bots.

            properties: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                daily_tank: { 
                    tank: "whirlwind",
                    tier: 3,
                    ads: {
                        enabled: true,
                        source: [
                            {
                                file: "testadvideo.mp4",
                                use_regular_ad_size: true,
                            },
                            {
                                file: "testadimage.png",
                                image_wait_time: 3,
                                use_regular_ad_size: true,
                            }
                        ]
                    } 
                }
            }
        },
        {
            use_client_server: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            host: "localhost:3002", // Server host location.
            port: 3002, // The port on the server.
            id: "lod", // (<HOST>/#<SERVER_ID>)
            featured: false,

            region: "local", // The region the server is on.
            gamemode: ["tdm"], // The selected gamemode.
            player_cap: 80, // Not including bots.

            properties: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                TEAMS: 4,
                bot_cap: 45,
                daily_tank: { 
                    tank: "master",
                    tier: 3,
                    ads: {
                        enabled: false
                    } 
                }
            }
        },
    ],

    // Web Server
    allow_ACAO: false, // Access-Control-Allow-Origin, allows any server/client to access data from the WebServer.

    // Map
    map_tile_width: 420,
    map_tile_height: 420,

    // How long a chat message lasts in milliseconds.
    // Includes the fade-out period.
    chat_message_duration: 15_000,

    // If you don't want your players to color their messages.
    // They get sanitized after addons interpret them, but before they're added to the chat message dictionary.
    sanitize_chat_input: true,

    // The message that appears once a player spawns.
    spawn_message: "You have spawned! Welcome to the game.\n"
                 + "You will be invulnerable until you move or shoot.\n"
                 + "Please report any bugs you encounter!",

    popup_message_duration: 10_000, // How long (in milliseconds) a popup message lasts before fading out.
    respawn_delay: 0, // How long you have to wait to respawn in seconds. Set to 0 to disable.

    // Toggles the seasonal halloween theme (adds eyes to walls and replaces rocks to pumpkins)
    spooky_theme: false,

    // Gameplay
    game_speed: 1, // General game speed.
    run_speed: 1.5, // General multiplier for acceleration and max speeds.
    max_heartbeat_interval: 300_000, // How long (in milliseconds) a socket can be disconnected before their tank self-destructs.

    bullet_spawn_offset: 1, // Where the bullet spawns, where 1 is fully outside the barrel and -1 is fully inside the barrel, and 0 is halfway between.
    damage_multiplier: 1, // General damage multiplier everytime damage is dealt.
    knockback_multiplier: 1.1, // General knockback multiplier everytime knockback is applied.
    glass_health_factor: 2, // TODO: Figure out how the math behind this works.
    room_bound_force: 0.01,// How strong the force is that confines entities to the map and portals apply to entities.
    soft_max_skill: 0.59, // TODO: Find out what the intention behind the implementation of this configuration is.

    // When an entity reaches a level, this function is called and returns how many skill points that entity gets for reaching that level.
    LEVEL_SKILL_POINT_FUNCTION: level => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level & 1 === 1) return 1;
        return 0;
    },

    LEVEL_CAP: 45, // Maximum normally achievable level.
    LEVEL_CHEAT_CAP: 45, // Maximum level via the level-up key and auto-level-up.

    MAX_SKILL: 9, // Default skill caps.
    MAX_UPGRADE_TIER: 9, // Amount of tank tiers.
    TIER_MULTIPLIER: 15, // Level difference between each tier.

    // Bots
    bot_cap: 0, // Maximum number of bots that can be on the server. Set to 0 to disable bots.
    bot_xp_gain: 60, // How much XP player-bots get until they reach LEVEL_CAP.
    bot_start_level: 45, // How much XP player-bots will receive when first created.
    bot_skill_upgrade_chances: [1, 1, 3, 4, 4, 4, 4, 2, 1, 1], // The chances of a player-bot upgrading a specific skill when skill upgrades are available.
    bot_class_upgrade_chances: [1, 5, 20, 37, 37], // The chances of a player-bot upgrading a specific amount of times before it stops upgrading.
    bot_name_prefix: "[AI] ", // This is prefixed before the bot's randomly chosen name.

    // The class that players and player-bots spawn as.
    spawn_class: "basic",

    // How every entity regenerates their health.
    regenerate_tick: 100,

    // Food
    food_types: [ // Possible food types outside the nest
        [1, [
            [65, "egg"], [64, "triangle"], [45, "square"], [7, "pentagon"], [1, "hexagon"]
        ]],
        [1/50000, [
            [625, "gem"], [125, "shinyTriangle"], [25, "shinySquare"], [5, "shinyPentagon"], [1, "shinyHexagon"]
        ]],
        [1/1000000, [
            [1296, "jewel"], [216, "legendaryTriangle"], [36, "legendarySquare"], [6, "legendaryPentagon"], [1, "legendaryHexagon"]
        ]]
    ],
    food_types_nest: [ // Possible food types in the nest
        [1, [
            [16, "pentagon"], [ 4, "betaPentagon"], [ 1, "alphaPentagon"]
        ]]
    ],
    enemy_types_nest: [ // Possible enemy food types in the nest
        [1, [
            [1, "crasher"]
        ]],
        [1/20, [
            [1, "sentryGun"], [1, "sentrySwarm"], [1, "sentryTrap"]
        ]]
    ],

    FOOD_CAP: 70, // Maximum number of regular food at any time.
    FOOD_CAP_NEST: 15, // Maximum number of nest food at any time.
    ENEMY_CAP_NEST: 10, // Maximum number of enemy nest food at any time.
    FOOD_MAX_GROUP_TOTAL: 6, // Number of foods that random food groups spawn with

    // Bosses
    bosses_spawn: true,
    boss_spawn_cooldown: 260, // The delay (in seconds) between boss spawns.
    boss_spawn_delay: 6, // The delay (in seconds) between the boss spawn being announced and the boss(es) actually spawning.
    boss_types: [{
        bosses: ["eliteDestroyer", "eliteGunner", "eliteSprayer", "eliteBattleship", "eliteSpawner"],
        amount: [5, 5, 4, 2, 1], chance: 2, nameType: "a",
    },{
        bosses: ["roguePalisade"],
        amount: [4, 1], chance: 1, nameType: "castle",
        message: "A strange trembling...",
    },{
        bosses: ["summoner", "eliteSkimmer", "nestKeeper"],
        amount: [2, 2, 1], chance: 1, nameType: "a",
        message: "A strange trembling...",
    },{
        bosses: ["paladin", "freyja", "zaphkiel", "nyx", "theia"],
        amount: [1], chance: 0.01,
        message: "The world tremors as the celestials are reborn anew!",
    },{
        bosses: ["julius", "genghis", "napoleon"],
        amount: [1], chance: 0.1,
        message: "The darkness arrives as the realms are torn apart!",
    }],

    // How many members a team can have in comparison to an unweighed team.
    // Example: We have team A and B. If the weight of A is 2 and B is 1, then the game will try to give A twice as many members as B.
    // Check gamemodeconfigs to see how this works.
    team_weights: {},

    // These are the default values for gamemode related things. Do not change or remove these, you'll likely break stuff!
    // If you want to change them, copy the values you want to change to the server's PROPERTIES instead.
    ENABLE_FOOD: true,
    GAMEMODE_NAME_PREFIXES: [],
    SPECIAL_BOSS_SPAWNS: false,
    CLASSIC_SIEGE: false,
    MOTHERSHIP: false,
    DOMINATION: false,
    RANDOM_COLORS: false,
    SPACE_PHYSICS: false,
    TIERED_FOOD: false,
    ARENA_TYPE: "rect",
    BLACKOUT: false,
    SPACE_MODE: false,
    ARMS_RACE: false,
    CLAN_WARS: false,
    GROWTH: false,
    GROUPS: false,
    TRAIN: false,
    MAZE: false,
    HUNT: false,
    MODE: "ffa",
    TAG: false,
    TEAMS: 4,
    SPAWN_CONFINEMENT: {},

    // Room setup
    room_setup: ["room_default"],
}
