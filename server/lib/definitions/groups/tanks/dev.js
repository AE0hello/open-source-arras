const {combineStats, LayeredBoss, makeAura, makeAuto, makeMenu, makeRadialAuto, makeTurret, weaponArray, weaponMirror} = require('../../facilitators.js')
const {base, basePolygonDamage, basePolygonHealth, dfltskl, statnames} = require('../../constants.js')
const g = require('../../gunvals.js')

// Main Developer Tank
Class.developer = {
    PARENT: "genericTank",
    LABEL: "Developer",
    BODY: {
        SHIELD: 1000,
        REGEN: 10,
        HEALTH: 100,
        DAMAGE: 10,
        DENSITY: 20,
        FOV: 2,
    },
    //COLOR: "mirror", // todo: make sure mirror colour doesnt grey out your leaderboard
    SKILL_CAP: Array(10).fill(dfltskl),
    IGNORED_BY_AI: true,
    RESET_CHILDREN: true,
    ACCEPTS_SCORE: true,
    CAN_BE_ON_LEADERBOARD: true,
    CAN_GO_OUTSIDE_ROOM: false,
    IS_IMMUNE_TO_TILES: false,
    DRAW_HEALTH: true,
    ARENA_CLOSER: true,
    INVISIBLE: [0, 0],
    ALPHA: [0, 1],
    HITS_OWN_TYPE: "hardOnlyTanks",
    NECRO: false,
    SHAPE: [
        [-1, -0.8],
        [-0.8, -1],
        [0.8, -1],
        [1, -0.8],
        [0.2, 0],
        [1, 0.8],
        [0.8, 1],
        [-0.8, 1],
        [-1, 0.8],
    ],
    GUNS: [
        {
            POSITION: [18, 10, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op]),
                TYPE: "developerBullet"
            }
        }
    ],
    UPGRADES_TIER_0: [
        "menu_tanks",
        "menu_bosses",
        "spectator",
        "menu_addons",
        "menu_testing",
        "eggGen",
    ]
}

// Spectator
Class.spectator = {
    PARENT: "genericTank",
    LABEL: "Spectator",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Left click to teleport, Right click above or below the screen to change FOV",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [{
        POSITION: [0,0,0,0,0,0,0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
            TYPE: "bullet",
            ALPHA: 0
        }
    }, {
        POSITION: [0, 0, 0, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.25 }, g.fake]),
            TYPE: "bullet",
            ALPHA: 0,
            ALT_FIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    }, {
        event: "altFire",
        handler: ({ body }) => body.FOV = body.y + body.control.target.y < body.y ? body.FOV + 0.5 : Math.max(body.FOV - 0.5, 0.2)
    }]
}

// Moderation
Class.guillotine = {
    PARENT: "spectator",
    LABEL: "Guillotine",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to kill the selected entity.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 12,
                X: 31
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 10,
                ASPECT: 1.6,
                X: -5,
                Y: -8,
                ANGLE: 90
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 40,
                WIDTH: 2,
                Y: 7
            }
        })
    ],
    TURRETS: [
        {
            POSITION: {
                SIZE: 2,
                X: 35,
                LAYER: 1
            },
            TYPE: ["circleHat", {COLOR: "grey"}]
        }
    ]
}
Class.banHammer = {
    PARENT: "genericTank",
    LABEL: "Ban Hammer",
    ALPHA: 0,
    CAN_BE_ON_LEADERBOARD: false,
    CAN_GO_OUTSIDE_ROOM: true,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    CAN_SEE_INVISIBLE_ENTITIES: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
        /*{
            POSITION: [0,0,0,0,0,0,0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.25}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0
            }
        },*/
        {
            POSITION: [0, 0, 0, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.2}, g.fake]),
                TYPE: "bullet",
                ALPHA: 0,
                ALT_FIRE: true
            }
        }
    ],
    ON: [{
        event: "altFire",
        handler: ({ body }) => {
            body.x = body.x + body.control.target.x
            body.y = body.y + body.control.target.y
        }
    }]
}

// Tank Menu(s)
Class.menu_tanks = makeMenu("Tanks", {upgrades: [Config.spawn_class, "menu_unused", "menu_removed", "menu_mapEntities", "menu_motherships", "menu_fun", "healer", "undercoverCop", "arenaCloser"]})
    Class.menu_unused = makeMenu("Unused", {upgrades: ["1", "2", "3"].map(x => "menu_unused_T" + x), tooltip: "Tanks that were fully created and likely intended to be added, but never were."})
        Class.menu_unused_T1 = makeMenu("Unused (Tier 1)", {upgrades: ["flail", "whirlwind_bent"], boxLabel: "Tier 1 (Lv.15)"})
        Class.menu_unused_T2 = makeMenu("Unused (Tier 2)", {upgrades: ["autoTrapper", "volute", "whirlwind_old"], boxLabel: "Tier 2 (Lv.30)"})
        Class.menu_unused_T3 = makeMenu("Unused (Tier 3)", {upgrades: ["blunderbuss", "cocci", "dreadnought_old", "mender", "oroboros", "prodigy", "quadBuilder", "rimfire_old", "rocket", "wrangler"], boxLabel: "Tier 3 (Lv.45)"})
    Class.menu_removed = makeMenu("Removed", {upgrades: ["menu_dailyTanks", "menu_legacy"], tooltip: "Tanks that were previously accessible in-game in some form before being removed."})
        Class.menu_dailyTanks = makeMenu("Daily Tanks", {upgrades: ["whirlwind", "master", "undertow", "literallyAMachineGun", "literallyATank", "rocketeer", "jumpSmasher", "rapture"], boxColor: "rainbow", tooltip: "Tanks that were part of arras.io's December 2023 Daily Tanks event, in the order they were first made available.\n" + "The Daily Tank for a server can be added or changed in config."})
        Class.menu_legacy = makeMenu("Legacy Tanks", {upgrades: ["boomer_old", "bulwark_old", "auto4_old", "rifle_old", "septaTrapper_old", "spike_old", "sprayer_old", "spreadshot_old"], tooltip: "The original versions of certain tanks."})
    Class.menu_mapEntities = makeMenu("Map Entities", {upgrades: ["menu_dominators", "baseProtector", "antiTankMachineGun", "menu_sanctuaries"], props: [{TYPE: "dominationBody", POSITION: { SIZE: 22 }}], tooltip: "Tanks that spawn as part of the map layout."})
        Class.menu_dominators = makeMenu("Dominators", {upgrades: ["destroyer", "gunner", "trapper"].map(x => x + "Dominator"), props: [{TYPE: "dominationBody", POSITION: { SIZE: 22 }}]})
        Class.menu_sanctuaries = makeMenu("Sanctuaries", {upgrades: ["1", "2", "3", "4", "5", "6"].map(x => "sanctuaryTier" + x), props: [{TYPE: "dominationBody", POSITION: { SIZE: 22 }}, {TYPE: "healerHat", POSITION:  { SIZE: 13, LAYER: 1 }}]})
    Class.menu_motherships = makeMenu("Motherships", {upgrades: ["mothership", "flagship", "turkey"], shape: 16, tooltip: "Giant Enemy Tanks that you attack the weak points of for massive damage."})
    Class.menu_fun = makeMenu("Fun", {upgrades: ["alas"/*, "average4tdmScore", "averageL39Hunt", "beeman"*/, "bigBalls", "cxATMG", "damoclone", "fat456", "heptaAutoBasic", "machineShot", "meDoingYourMom", "meOnMyWayToDoYourMom", "protector"/*, "quadCyclone"*/, "rapture", "riptide"/*, "schoolShooter", "smasher3"*/, "tetraGunner"/*, "theAmalgamation", "theConglomerate"*/, "tracker3", "undercoverCop", "wifeBeater", "worstTank"], tooltip: "Tanks that, let's be honest, aren't used for a good reason.\n" + "DISCLAIMER: Some of the content in here may be in poor taste. Blame the arras.io devs, not us."})
Class.menu_bosses = makeMenu("Bosses", {upgrades: ["sentries", "elites", "mysticals", "nesters", "rogues", "rammers", "terrestrials", "celestials", "eternals", "devBosses"].map(x => "menu_" + x), rerootTree: "menu_bosses"})
Class.menu_addons = makeMenu("Addons", {tooltip: "Content that is (usually) not part of Open Source Arras but was added by someone else."})
if (Config.siege) {
    Class.menu_tanks.UPGRADES_TIER_0 = [Config.spawn_class, "menu_unused", "menu_removed", "menu_mapEntities", "menu_motherships", "menu_fun", "smasher", "undercoverCop", "arenaCloser", "underseer"]
}
