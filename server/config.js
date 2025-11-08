module.exports = {
    // Server host

    // Game server domain.
    // If the host is 'localhost:NUMBER', the NUMBER must be the port setting.
    host: "localhost:3000",

    // Which port to run the web server on.
    port: 3000,

    // Server

    // How often to update the list of the entities that players can see.
    // Has effects of when entities are activated.
    visibleListInterval: 250,

    // Start up logs and Log speed loop warnings
    LOGS: true,

    // If set to true, it loads all mockups and doesn't needs to generate while ingame. If set to false, does require need to generate mockups ingame but starts the main server instantly.
    LOAD_ALL_MOCKUPS: false,

    // Servers
    // This is where your server's settings are stored.
    SERVERS: [
        {
            // This is important and usefull,
            // if your VM (Your machine that hosts the website stuff) doesn't support multi ports,
            // you are forced to set this to true because it will load via through the main server.
            LOAD_ON_MAINSERVER: false,
            // This is very important where the host is actually being hosted. Keep in mind that the ports gets changed to 3000, to 3001, and it repeats with the other servers.
            // Keep in mind that if "LOAD_ON_MAINSERVER" is set to true then this code will be replaced with the main server's host instead.
            HOST: "localhost:3001",
            // The port where to host from.
            // Keep in mind that if "LOAD_ON_MAINSERVER" is set to true then this code will be replaced with the main server's port instead.
            PORT: 3001,
            // Get the gamemode you want to select with.
            GAMEMODE: ["maze"],
            // The region, can be anything.
            REGION: "local",
            // How many players can join until it's full.
            MAX_PLAYERS: 15,
            // The server ID. Example: (<Yourwebsitename>/#<ServerID>)
            // Important! You cannot make the same server id with a other one or else the server selector will get confused.
            SERVER_ID: "loc",
            // Make the server featured by turning the text yellow in the server selector.
            FEATURED: false,
            // This is where you can override settings in the config.js file, and as long the gamemode's config doesn't override it.
            PROPERTIES: {
                // Amount of bots.
                BOTS: 5,
            }
        },
    ],

    // Web Server

    // Allow other servers to get data from this server.
    allowAccessControlAllowOrigin: false,

    // Miscellaneous

    // The dimensions of a single tile on the map.
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
            + "This is an unstable build of OSA, expect many upcoming bugs.",

    // How long a popup message lasts before fading out in milliseconds.
    MESSAGE_DISPLAY_TIME: 10_000,

    // How long you have to wait to respawn in seconds.
    RESPAWN_TIMEOUT: 0,

    // Gameplay

    // General game speed.
    gameSpeed: 1,

    // General multiplier for acceleration and max speeds.
    runSpeed: 1.5,

    // How long (in ms) a socket can be disconnected without their player dying.
    maxHeartbeatInterval: 300000,

    // Set halloween theme by adding the eye entities to the walls and replacing rocks to pumpkins
    HALLOWEEN_THEME: false,

    // Where the bullet spawns, where 1 is fully outside the barrel and -1 is fully inside the barrel, and 0 is halfway between.
    bulletSpawnOffset: 1,

    // General damage multiplier everytime damage is dealt.
    DAMAGE_CONSTANT: 1,

    // General knockback multiplier everytime knockback is applied.
    KNOCKBACK_CONSTANT: 1.1,

    // TODO: Figure out how the math behind this works.
    GLASS_HEALTH_FACTOR: 2,

    // How strong the force is that confines entities to the map and portals apply to entities.
    ROOM_BOUND_FORCE: 0.01,

    // TODO: Find out what the intention behind the implementation of this configuration is.
    SOFT_MAX_SKILL: 0.59,

    // When an entity reaches a level, this function is called and returns how many points that entity gets for reaching that level.
    LEVEL_SKILL_POINT_FUNCTION: level => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level & 1 === 1) return 1;
        return 0;
    },

    // Maximum normally achievable level.
    LEVEL_CAP: 45,

    // Maximum level via the level-up key and auto-level-up.
    LEVEL_CHEAT_CAP: 45,

    // Default skill caps.
    MAX_SKILL: 9,

    // Amount of tank tiers.
    MAX_UPGRADE_TIER: 9,

    // Level difference between each tier.
    TIER_MULTIPLIER: 15,

    // Where the client's html is located.
    INDEX_HTML: "index.html",

    // How many bots can be spawned.
    BOTS: 0,

    // How much XP player-bots get until they reach LEVEL_CAP.
    BOT_XP: 60,

    // How much XP player-bots will receive when first created.
    BOT_START_LEVEL: 45,

    // The chances of a player-bot upgrading a specific skill when skill upgrades are available.
    BOT_SKILL_UPGRADE_CHANCES: [1, 1, 3, 4, 4, 4, 4, 2, 1, 1],

    // The chances of a player-bot upgrading a specific amount of times before it stops upgrading.
    BOT_CLASS_UPGRADE_CHANCES: [1, 5, 20, 37, 37],

    // The prefix of the player-bots names.
    BOT_NAME_PREFIX: '[AI] ',

    // The class that players and player-bots spawn as.
    SPAWN_CLASS: 'basic',

    // How every entity regenerates their health.
    REGENERATE_TICK: 100,

    // How many members a team can have in comparison to an unweighed team.
    // Example: Lets say we have team A and B. If the weigh of A is 2 and B is 1, then the game will try to give A twice as many members as B.
    TEAM_WEIGHTS: {},

    // Natural Spawns

    // The possible food types that can spawn.
    FOOD_TYPES: [
        [2000, [
            [65, 'egg'], [64, 'triangle'], [45, 'square'], [7, 'pentagon'], [1, 'hexagon']
        ]],
        [1, [
            [625, 'gem'], [125, 'shinyTriangle'], [25, 'shinySquare'], [5, 'shinyPentagon'], [1, 'shinyHexagon']
        ]],
        [0.1, [
            [1296, 'jewel'], [216, 'legendaryTriangle'], [36, 'legendarySquare'], [6, 'legendaryPentagon'], [1, 'legendaryHexagon']
        ]]
    ],

    // The possible nest food types that can spawn.
    FOOD_TYPES_NEST: [
        [1, [
            [16, 'pentagon'], [ 4, 'betaPentagon'], [ 1, 'alphaPentagon']
        ]]
    ],

    // The possible nest enemy types that can spawn.
    ENEMY_TYPES_NEST: [
        [19, [
            [1, 'crasher']
        ]],
        [1, [
            [1, 'sentryGun'], [1, 'sentrySwarm'], [1, 'sentryTrap']
        ]]
    ],

    // Enable boss spawn.
    ENABLE_BOSS_SPAWN: true,
    // Cooldown (in seconds) of boss spawns being announced.
    BOSS_SPAWN_COOLDOWN: 260,
    // The delay (in seconds) between the boss spawns being announced and the bosses actually spawning.
    // NOTE: The spawn message (ex. "A strange trembling...") takes half as long to appear than the boss.
    BOSS_SPAWN_DURATION: 6,
    // The possible boss types that can spawn.
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

    // How much regular foods can spawn.
    FOOD_CAP: 70,

    // How much nest foods can spawn.
    FOOD_CAP_NEST: 15,

    // How much enemy foods can spawn.
    ENEMY_CAP_NEST: 10,

    // What this does is there a chance that it will spawn food with a group, and the value makes it how much.
    FOOD_MAX_GROUP_TOTAL: 6,

    // Default values for gamemode related things.
    // Do not change these, you'll likely break stuff!
    // Change GAME_MODES instead.
    ENABLE_FOOD: true,
    GAMEMODE_NAME_PREFIXES: [],
    SPECIAL_BOSS_SPAWNS: false,
    CLASSIC_SIEGE: false,
    MOTHERSHIP: false,
    DOMINATION: false,
    RANDOM_COLORS: false,
    SPACE_PHYSICS: false,
    LABY_FOOD: false,
    ARENA_TYPE: "rect",
    BLACKOUT: false,
    SPACE_MODE: false,
    CLAN_WARS: false,
    GROWTH: false,
    GROUPS: false,
    TRAIN: false,
    MAZE: false,
    HUNT: false,
    MODE: "ffa",
    TAG: false,
    SPAWN_CONFINEMENT: {},

    // Room setup
    ROOM_SETUP: ["room_default"],
}
