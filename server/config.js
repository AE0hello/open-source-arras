module.exports = {
    // Main Menu
    host: "localhost:3000", // Game server domain. If the host is 'localhost:NUMBER', the NUMBER must be the port setting.
    port: 3000, // Which port to run the web server on.

    // Servers
    visibleListInterval: 250, // How often to update the list of the entities that players can see. Has effects of when entities are activated.
    LOGS: true, // Enable startup logs and log speed loop warnings in terminal
    LOAD_ALL_MOCKUPS: false, // Set to true if you want every mockup to be loaded when the server starts. May noticeably slow down server startup.

    SERVERS: [ // Make sure to change the HOST, PORT and SERVER_ID between servers!
        {
            LOAD_ON_MAINSERVER: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            HOST: "localhost:3001", // Server host location.
            PORT: 3001, // The port on the server.
            SERVER_ID: "loc", // (<HOST>/#<SERVER_ID>)
            FEATURED: false, // Mark the server as featured in the server selector.

            REGION: "local", // The region the server is on.
            GAMEMODE: ["opentdm"], // The selected gamemode.
            MAX_PLAYERS: 80, // Not including bots.

            PROPERTIES: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                TEAMS: 3,
                BOTS: 45,
                DAILY_TANK: { tank: "whirlwind", TIER: 3 },
            }
        },
        {
            LOAD_ON_MAINSERVER: false, // Only one server at a time can have this enabled.
            // The above is required if your VM (the machine that hosts the website stuff) doesn't support multi-ports and forces everything through the main server.
            // This also overrides the below HOST and PORT settings to be identical to the main server's HOST/PORT (by default, 3000).

            HOST: "localhost:3002", // Server host location.
            PORT: 3002, // The port on the server.
            SERVER_ID: "lod", // (<HOST>/#<SERVER_ID>)
            FEATURED: false, // Mark the server as featured in the server selector.

            REGION: "local", // The region the server is on.
            GAMEMODE: ["tdm"], // The selected gamemode.
            MAX_PLAYERS: 80, // Not including bots.

            PROPERTIES: { // This overrides settings in the config.js file, providing the selected gamemode doesn't also override it.
                TEAMS: 4,
                BOTS: 45,
            }
        },
    ],

    // Web Server
    allowAccessControlAllowOrigin: false, // Allow other servers to get data from this server.

    // Map Tiles
    TILE_WIDTH: 420,
    TILE_HEIGHT: 420,

    // How long a chat message lasts in milliseconds.
    // Includes the fade-out period.
    CHAT_MESSAGE_DURATION: 15_000,

    // If you don't want your players to color their messages.
    // They get sanitized after addons interpret them, but before they're added to the chat message dictionary.
    SANITIZE_CHAT_MESSAGE_COLORS: true,

    // Welcome message once a player spawns.
    /*WELCOME_MESSAGE: "You have spawned! Welcome to the game.\n"
        + "You will be invulnerable until you move or shoot.\n"
        + "Please report any bugs you encounter!",*/
    WELCOME_MESSAGE: "You have spawned! Welcome to the game.\n"
            + "You will be invulnerable until you move or shoot.\n"
            + "This is an unstable build, please report any bugs you see!",

    MESSAGE_DISPLAY_TIME: 10_000, // How long (in milliseconds) a popup message lasts before fading out.
    RESPAWN_TIMEOUT: 0, // How long you have to wait to respawn in seconds. Set to 0 to disable.

    // Toggles the seasonal halloween theme (adds eyes to walls and replaces rocks to pumpkins)
    HALLOWEEN_THEME: false,

    // Gameplay
    gameSpeed: 1, // General game speed.
    runSpeed: 1.5, // General multiplier for acceleration and max speeds.
    maxHeartbeatInterval: 300_000, // How long (in milliseconds) a socket can be disconnected before their tank self-destructs.

    bulletSpawnOffset: 1, // Where the bullet spawns, where 1 is fully outside the barrel and -1 is fully inside the barrel, and 0 is halfway between.
    DAMAGE_CONSTANT: 1, // General damage multiplier everytime damage is dealt.
    KNOCKBACK_CONSTANT: 1.1, // General knockback multiplier everytime knockback is applied.
    GLASS_HEALTH_FACTOR: 2, // TODO: Figure out how the math behind this works.
    ROOM_BOUND_FORCE: 0.01,// How strong the force is that confines entities to the map and portals apply to entities.
    SOFT_MAX_SKILL: 0.59, // TODO: Find out what the intention behind the implementation of this configuration is.

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

    INDEX_HTML: "index.html", // Where the main menu is located.

    // Bots
    BOTS: 0, // Maximum number of bots that can be on the server. Set to 0 to disable bots.
    BOT_XP: 60, // How much XP player-bots get until they reach LEVEL_CAP.
    BOT_START_LEVEL: 45, // How much XP player-bots will receive when first created.
    BOT_SKILL_UPGRADE_CHANCES: [1, 1, 3, 4, 4, 4, 4, 2, 1, 1], // The chances of a player-bot upgrading a specific skill when skill upgrades are available.
    BOT_CLASS_UPGRADE_CHANCES: [1, 5, 20, 37, 37], // The chances of a player-bot upgrading a specific amount of times before it stops upgrading.
    BOT_NAME_PREFIX: '[AI] ', // The prefix of the player-bots names.

    // The class that players and player-bots spawn as.
    SPAWN_CLASS: "basic",

    // How every entity regenerates their health.
    REGENERATE_TICK: 100,

    // Food
    FOOD_TYPES: [ // Possible food types outside the nest
        [1, [
            [65, 'egg'], [64, 'triangle'], [45, 'square'], [7, 'pentagon'], [1, 'hexagon']
        ]],
        [1/50000, [
            [625, 'gem'], [125, 'shinyTriangle'], [25, 'shinySquare'], [5, 'shinyPentagon'], [1, 'shinyHexagon']
        ]],
        [1/1000000, [
            [1296, 'jewel'], [216, 'legendaryTriangle'], [36, 'legendarySquare'], [6, 'legendaryPentagon'], [1, 'legendaryHexagon']
        ]]
    ],
    FOOD_TYPES_NEST: [ // Possible food types in the nest
        [1, [
            [16, 'pentagon'], [ 4, 'betaPentagon'], [ 1, 'alphaPentagon']
        ]]
    ],
    ENEMY_TYPES_NEST: [ // Possible enemy food types in the nest
        [19, [
            [1, 'crasher']
        ]],
        [1, [
            [1, 'sentryGun'], [1, 'sentrySwarm'], [1, 'sentryTrap']
        ]]
    ],

    FOOD_CAP: 70, // Maximum number of regular food at any time.
    FOOD_CAP_NEST: 15, // Maximum number of nest food at any time.
    ENEMY_CAP_NEST: 10, // Maximum number of enemy nest food at any time.
    FOOD_MAX_GROUP_TOTAL: 6, // Number of foods that random food groups spawn with

    // Bosses
    ENABLE_BOSS_SPAWN: true,
    BOSS_SPAWN_COOLDOWN: 260, // The delay (in seconds) between boss spawns.
    BOSS_SPAWN_DELAY: 6, // The delay (in seconds) between the boss spawn being announced and the boss(es) actually spawning.
    BOSS_TYPES: [{
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
    TEAM_WEIGHTS: {},

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
    ROOM_SETUP: ["room_default"],
}
