const { combineStats, makeMenu, makeAura, makeDeco, LayeredBoss, weaponArray, makeRadialAuto, makeTurret, makeAuto } = require('../facilitators.js')
const { base, basePolygonDamage, basePolygonHealth, dfltskl, statnames } = require('../constants.js')
const g = require('../gunvals.js')
require('./tanks.js')
require('./food.js')

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

// Guillotine + Ban Hammer
Class.guillotine = {
    PARENT: "spectator",
    LABEL: "Guillotine",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to kill the selected entity.",
    GUNS: [ {
        POSITION: [5, 13, 1, 8.5, 2, -15, 0], }, {
        POSITION: [8, 10, 1, 30, 0, 0, 0], }, {
        POSITION: [40, 2, 1, 0, 7, 0, 0], }, {
        POSITION: [40, 2, 1, 0, -7, 0, 0], }, 
    ],
    TURRETS: [
        {
            POSITION: [2, 34, 0, 0, 0, 1],
            TYPE: "genericEntity"
        }
    ],
    ON: [
        {
            event: "mousedown",
            handler: ({ body, button }) => {
                if (body == null) return;
                switch (button) {
                    case "left":
                        let target = {
                            x: body.x + body.control.target.x,
                            y: body.y + body.control.target.y
                        };
                        let selected = null;
                        for (let entity of entities) {
                            if (((entity.x - target.x) ** 2 + (entity.y - target.y) ** 2) < entity.size ** 2) {
                                selected = entity;
                                break;
                            }
                        }
                        if (selected) {
                            body.store.guillotineSelection = selected;
                            body.socket.talk("m", `Selected ${selected.name ? `${selected.name}'s` : "an unnamed"} ${selected.label} (ID #${selected.id}). Score: ${Math.floor(selected.skill.score)}; Build: ${selected.skill.raw.join("/")};`);
                        } else {
                            delete body.store.guillotineSelection;
                            body.socket.talk("m", "Cleared selection.");
                        }
                        break;
                    case "right":
                        body.x += body.control.target.x;
                        body.y += body.control.target.y;
                        break;
                }
            }
        },
        {
            event: "action",
            handler: ({ body }) => {
                if (body == null) return;
                    if (body.store.guillotineSelection && !body.store.guillotineSelection.isDead()) {
                    body.store.guillotineSelection.kill();
                    body.socket.talk("m", "Killed selection!");
                } else body.socket.talk("m", "Nothing was selected!");
            }
        }
    ]
}
Class.banHammer = {
    PARENT: "spectator",
    LABEL: "Ban Hammer",
    CAN_GO_OUTSIDE_ROOM: true,
    TOOLTIP: "Use left click to inspect and right click to teleport. Press F to ban the selected player.",
    GUNS: [
        {POSITION: [30, 7, 1.3, 0, 0, 0, 0]},
        {POSITION: [3, 11, 0.75, 7.5, -36, 90, 0]},
        {POSITION: [3, 11, 0.75, 7.5, 36, -90, 0]},
        {POSITION: [11, 14, 1, 30.5, 0, 0, 0]},
        {POSITION: [13, 10.5, -1.2, 0, 0, 0, 0]},
    ]
}

// Tank Menu(s)
Class.menu_tanks = makeMenu("Tanks")
//Class.menu_tanks.UPGRADE_TOOLTIP = "Every tank. Need I say more?"
Class.menu_tanks.UPGRADES_TIER_0 = [
    Config.spawn_class,
    "menu_unused",
    "arenaCloser",
    "menu_mapEntities",
    "menu_motherships",
    "undercoverCop",
]

Class.menu_unused = makeMenu("Unused")
Class.menu_unused.UPGRADE_TOOLTIP = "Tanks that aren't used by the game, for whatever reason."
Class.menu_unused.UPGRADES_TIER_0 = [
    "healer",
    "menu_unreleased",
    "menu_removed",
    "menu_fun",
    "spiral",
    "repeater",
]

Class.menu_unreleased = makeMenu("Unreleased")
Class.menu_unreleased.UPGRADE_TOOLTIP = "Tanks that were fully created and likely intended to be added, but never were."
Class.menu_unreleased.UPGRADES_TIER_0 = [
    "menu_unreleased_T1",
    "menu_unreleased_T2",
    "menu_unreleased_T3",
]

Class.menu_unreleased_T1 = makeMenu("Unreleased (Tier 1)")
Class.menu_unreleased_T1.UPGRADE_LABEL = "Tier 1 (Lv.15)"
Class.menu_unreleased_T1.UPGRADES_TIER_0 = [
    "flail",
    "whirlwind_bent",
]

Class.menu_unreleased_T2 = makeMenu("Unreleased (Tier 2)")
Class.menu_unreleased_T2.UPGRADE_LABEL = "Tier 2 (Lv.30)"
Class.menu_unreleased_T2.UPGRADES_TIER_0 = [
    "autoTrapper",
    "volute",
    "whirlwind_old",
]

Class.menu_unreleased_T3 = makeMenu("Unreleased (Tier 3)")
Class.menu_unreleased_T3.UPGRADE_LABEL = "Tier 3 (Lv.45)"
Class.menu_unreleased_T3.UPGRADES_TIER_0 = [
    "blunderbuss",
    "cocci",
    "dreadnought_old",
    "mender",
    "oroboros",
    "prodigy",
    "quadBuilder",
    "rimfire_old",
    "rocket",
    "wrangler",
]

Class.menu_removed = makeMenu("Removed")
Class.menu_removed.UPGRADE_TOOLTIP = "Tanks that were previously accessible in-game in some form before being removed."
Class.menu_removed.UPGRADES_TIER_0 = [
    "menu_dailyTanks",
    "boomer_old",
    "auto4_old",
    "spike_old",
    "spreadshot_old",
]

Class.menu_dailyTanks = makeMenu("Daily Tanks")
Class.menu_dailyTanks.UPGRADE_COLOR = "rainbow"
Class.menu_dailyTanks.UPGRADE_TOOLTIP = "Tanks that were part of arras.io's December 2023 Daily Tanks event, in the order they were first made available. \n" +
                                        "The Daily Tank for a server can be added or changed in config."
Class.menu_dailyTanks.UPGRADES_TIER_0 = [
    "whirlwind", // dec 13/21
    "master", // dec 14/22
    "undertow", // dec 15/23
    "literallyAMachineGun", // dec 16/24
    "literallyATank", // dec 17
    "rocketeer", // dec 18
    "jumpSmasher", // dec 19/20
    "rapture" // dec 25
]

Class.menu_fun = makeMenu("Fun")
Class.menu_fun.UPGRADE_TOOLTIP = "Tanks that, let's be honest, aren't used for a good reason.\n" +
                                 //"\n" +
                                 "DISCLAIMER: Some of the content in here may be in poor taste. Blame the arras.io devs, not us."
Class.menu_fun.UPGRADES_TIER_0 = [
    //"alas",
    //"average4tdmScore",
    //"averageL39Hunt",
    //"beeman",
    "bigBalls",
    "cxATMG",
    "damoclone",
    "fat456",
    //"heptaAutoBasic",
    "machineShot",
    "meDoingYourMom",
    "momwtdym",
    //"quadCyclone",
    "rapture",
    "riptide",
    //"schoolShooter",
    //"smasher3",
    "tetraGunner",
    //"theAmalgamation",
    //"theConglomerate",
    "tracker3",
    "wifeBeater",
    "worstTank",
]

Class.menu_mapEntities = makeMenu("Map Entities")
Class.menu_mapEntities.UPGRADE_TOOLTIP = "Tanks that spawn as part of the map layout."
Class.menu_mapEntities.PROPS = [
    {
        POSITION: [22, 0, 0, 360, 0],
        TYPE: "dominationBody"
    }
]
Class.menu_mapEntities.UPGRADES_TIER_0 = [
    "menu_dominators",
    "baseProtector",
    "antiTankMachineGun",
    "menu_sanctuaries",
]

Class.menu_dominators = makeMenu("Dominators")
Class.menu_dominators.PROPS = [
    {
        POSITION: [22, 0, 0, 360, 0],
        TYPE: "dominationBody"
    }
]
Class.menu_dominators.UPGRADES_TIER_0 = [
    "destroyerDominator",
    "gunnerDominator",
    "trapperDominator",
]

Class.menu_sanctuaries = makeMenu("Sanctuaries")
Class.menu_sanctuaries.PROPS = [
    {
        POSITION: [22, 0, 0, 360, 0],
        TYPE: "dominationBody"
    },
    {
        POSITION: [13, 0, 0, 360, 1],
        TYPE: "healerSymbol"
    }
]
Class.menu_sanctuaries.UPGRADES_TIER_0 = [
    "sanctuaryTier1",
    "sanctuaryTier2",
    "sanctuaryTier3",
    "sanctuaryTier4",
    "sanctuaryTier5",
    "sanctuaryTier6",
]

Class.menu_motherships = makeMenu("Motherships", "mirror", 16)
Class.menu_motherships.UPGRADE_TOOLTIP = "Giant Enemy Tanks that you attack the weak points of for massive damage."
Class.menu_motherships.UPGRADES_TIER_0 = [
    "mothership",
    "flagship",
    "turkey",
]

// Boss Menu(s)
Class.menu_bosses = makeMenu("Bosses")
Class.menu_bosses.REROOT_UPGRADE_TREE = "menu_bosses"
Class.menu_bosses.UPGRADES_TIER_0 = [
    "menu_sentries",
    "menu_elites",
    "menu_mysticals",
    "menu_nesters",
    "menu_rogues",
    "menu_rammers",
    "menu_terrestrials",
    "menu_celestials",
    "menu_eternals",
    "menu_devBosses",
]

Class.menu_sentries = makeMenu("Sentries", "pink", 3.5)
Class.menu_sentries.PROPS = [
    {
        POSITION: [12, 0, 0, 0, 360, 1],
        TYPE: "genericEntity"
    }
]
Class.menu_sentries.UPGRADES_TIER_0 = [
    "sentrySwarm",
    "sentryGun",
    "sentryTrap",
    "sentinelSwarm",
    "sentinelGun",
    "sentinelTrap",
    "shinySentrySwarm",
    "shinySentryGun",
    "shinySentryTrap",
    "sentinelMinigun",
    "sentinelLauncher",
    "sentinelCrossbow",
]

Class.menu_elites = makeMenu("Elites", "pink", 3.5)
Class.menu_elites.UPGRADES_TIER_0 = [
    "eliteDestroyer",
    "eliteGunner",
    "eliteSprayer",
    "eliteBattleship",
    "eliteSpawner",
    "eliteTrapGuard",
    "eliteSpinner",
    "eliteSkimmer",
    "legionaryCrasher",
    "guardian",
    "defender",
    "sprayerLegion",
    "menu_deltas",
]

Class.menu_deltas = makeMenu("Deltas", "pink", 3)
Class.menu_deltas.UPGRADES_TIER_0 = [
    "deltaDestroyer",
    "deltaGunner",
    "deltaSprayer",
    "deltaBattleship",
]

Class.menu_mysticals = makeMenu("Mysticals", "gold", 4)
Class.menu_mysticals.UPGRADES_TIER_0 = [
    "sorcerer",
    "summoner",
    //"thaumaturge",
    "enchantress",
    "exorcistor",
    "shaman",
    "witch",
]

Class.menu_nesters = makeMenu("Nesters", "purple", 5.5)
Class.menu_nesters.UPGRADES_TIER_0 = [
    "nestKeeper",
    "nestWarden",
    "nestGuardian",
    "nestCurator",
    "nestDeacon",
    "nestChampion",
]

Class.menu_rogues = makeMenu("Rogues", "darkGrey", 6)
Class.menu_rogues.UPGRADES_TIER_0 = [
    "roguePalisade",
    "rogueAlcazar",
    "rogueArmada",
    "julius",
    "genghis",
    "napoleon",
]

Class.menu_rammers = makeMenu("Rammers", "aqua")
Class.menu_rammers.PROPS = [
    {
        POSITION: [21.5, 0, 0, 360, 0],
        TYPE: "smasherBody",
    }
]
Class.menu_rammers.UPGRADES_TIER_0 = [
    "bob",
    "nemesis",
]

Class.menu_terrestrials = makeMenu("Terrestrials", "orange", 7)
Class.menu_terrestrials.UPGRADES_TIER_0 = [
    "ares",
    "gersemi",
    "ezekiel",
    "eris",
    "selene",
]

Class.menu_celestials = makeMenu("Celestials", "lightGreen", 9)
Class.menu_celestials.UPGRADE_TOOLTIP = "WARNING: There are a lot of tanks in here and having this menu open may cause noticeable frame drops!"
Class.menu_celestials.UPGRADES_TIER_0 = [
    "paladin",
    "freyja",
    "zaphkiel",
    "nyx",
    "theia",
    "atlas",
    "hera",
    "horus",
    "anubis",
    "isis",
    "tethys",
    "ullr",
    "dellingr",
    "osiris",
    "alcis",
    "khonsu",
    "baldr",
    "nephthys",
    "tyr",
    "vor",
    "aether",
    "iapetus",
    "apollo",
    "eros",
    "hjordis",
    "sif",
    "freyr",
    "styx",
    "hyperion",
    "ptah",
    "rhea",
    "julius",
    "genghis",
    "napoleon"
]

Class.menu_eternals = makeMenu("Eternals", "veryLightGrey", 11)
Class.menu_eternals.UPGRADES_TIER_0 = [
    "ragnarok",
    "kronos",
    "amun",
]

Class.menu_devBosses = makeMenu("Developers", "lightGreen", 4)
Class.menu_devBosses.UPGRADE_COLOR = "rainbow"
Class.menu_devBosses.UPGRADES_TIER_0 = [
    "AEMKShipBoss",
    "dogeiscutBoss",
    "helenaBoss",
    "toothlessBoss",
    "tgsBoss",
    "menu_retiredDevBosses",
    "zyrafaqBoss"
]

Class.menu_retiredDevBosses = makeMenu("Retired Developers", "pureBlack", 4)
Class.menu_retiredDevBosses.UPGRADES_TIER_0 = [
    "frostBoss",
    "taureonBoss",
    "trplnrBoss",
]

// Addons Menu
Class.menu_addons = makeMenu("Addons")
Class.menu_addons.UPGRADE_TOOLTIP = "Content that is (usually) not part of Open Source Arras but was added by someone else."
Class.menu_addons.UPGRADES_TIER_0 = [] // Empty by default, gets filled up with all the addons you add

// Testing Menu
Class.menu_testing = makeMenu("Testing")
Class.menu_testing.UPGRADE_TOOLTIP = "A large selection of tanks that use many of the features of Open Source Arras. \n" +
                                     "WARNING: There are a lot of tanks in here and having this menu open may cause noticeable frame drops!"
Class.menu_testing.UPGRADES_TIER_0 = [
    "diamondShape",
    "miscTest",
    "mmaTest",
    "vulnturrettest",
    "onTest",
    "alphaGunTest",
    "strokeWidthTest",
    "testLayeredBoss",
    "tooltipTank",
    "turretLayerTesting",
    "bulletSpawnTest",
    "propTest",
    "weaponArrayTest",
    "radialAutoTest",
    "makeAutoTest",
    "imageShapeTest",
    "screenShakeTest",
    "turretStatScaleTest",
    "auraBasic",
    "auraHealer",
    "ghoster",
    "gunBenchmark",
    "switcheroo",
    "armyOfOne",
    "vanquisher",
    "mummifier",
    "syncWithTankTest",
    "airblast",
    "angleseer",
    "backwardsexports",
]

// airblast testing
Class.airblast = {
    PARENT: "genericTank",
    LABEL: "Airblast",
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]),
                TYPE: "airblastBullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                ASPECT: 1.4,
                X: 8
            }
        }
    ]
}
Class.trichip = {
    PARENT: "sunchip",
    NECRO: [3],
    SHAPE: 3
}
Class.angleseer = {
    PARENT: "genericTank",
    LABEL: "Angleseer",
    DANGER: 7,
    NECRO: true,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 3.5,
    MAX_CHILDREN: 12,
    GUNS: weaponArray({
        POSITION: [5, 11, 1.3, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: "trichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
        }
    }, 3)
}

// Testing tanks
Class.diamondShape = {
    PARENT: "basic",
    LABEL: "Rotated Body",
    SHAPE: 4.5
}
Class.mummyHat = {
    SHAPE: 4.5,
    COLOR: -1
}
Class.mummy = {
    PARENT: "drone",
    SHAPE: 4,
    NECRO: [4],
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 360, 1],
        TYPE: ["mummyHat"]
    }]
}
Class.mummifier = {
    PARENT: "genericTank",
    LABEL: "Mummifier",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.8 * base.SPEED,
    },
    SHAPE: 4,
    MAX_CHILDREN: 10,
    GUNS: [{
        POSITION: [5.5, 13, 1.1, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: "mummy",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro"
        }
    },{
        POSITION: [5.5, 13, 1.1, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: "mummy",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro"
        }
    }],
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 360, 1],
        TYPE: ["mummyHat"]
    }]
}
Class.miscTestHelper2 = {
    PARENT: "genericTank",
    LABEL: "Turret Reload 3",
    MIRROR_MASTER_ANGLE: true,
    COLOR: -1,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
                TYPE: "bullet",
                COLOR: -1,
            },
        },
    ],
}
Class.miscTestHelper = {
    PARENT: "genericTank",
    LABEL: "Turret Reload 2",
    //MIRROR_MASTER_ANGLE: true,
    COLOR: {
        BASE: -1,
        BRIGHTNESS_SHIFT: 15,
    },
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
                TYPE: "bullet",
                COLOR: -1,
            },
        },
    ],
    TURRETS: [
        {
          POSITION: [20, 0, 20, 30, 0, 1],
          TYPE: "miscTestHelper2",
        }
    ]
}
Class.miscTest = {
    PARENT: "genericTank",
    LABEL: "Turret Reload",
    COLOR: "teal",
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
                TYPE: "bullet",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [20, 0, 20, 30, 0, 1],
            TYPE: "miscTestHelper",
        }
    ]
}
Class.mmaTest2 = {
    PARENT: "genericTank",
    MIRROR_MASTER_ANGLE: true,
    COLOR: "grey",
    GUNS: [{
            POSITION: [40, 4, 1, -20, 0, 0, 0],
        }],
}
Class.mmaTest1 = {
    PARENT: "genericTank",
    COLOR: -1,
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "mmaTest2",
        }
    ]
}
Class.mmaTest = {
    PARENT: "genericTank",
    LABEL: "Mirror Master Angle",
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "mmaTest2",
        },
        {
            POSITION: [20, 0, 20, 0, 360, 1],
            TYPE: "mmaTest1",
        },
    ]
}
Class.vulnturrettest_turret = {
    PARENT: "genericTank",
    COLOR: "grey",
    HITS_OWN_TYPE: 'hard',
    LABEL: 'Shield',
    COLOR: 'teal',
}
Class.vulnturrettest = {
    PARENT: "genericTank",
    LABEL: "Vulnerable Turrets",
    TOOLTIP: "[DEV NOTE] Vulnerable turrets are still being worked on and may not function as intended!",
    BODY: {
        FOV: 2,
    },
    DANGER: 6,
    GUNS: [{
        POSITION: {},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet'
        }
    }],
    TURRETS: weaponArray({
        POSITION: {SIZE: 20, X: 40},
        TYPE: "vulnturrettest_turret",
        VULNERABLE: true
    }, 10)
}
Class.turretLayerTesting = {
    PARENT: 'genericTank',
    LABEL: 'Turret Layer Testing',
    TURRETS: [
        {
            POSITION: [20, 10, 10, 0, 0, 2],
            TYPE: ["basic", {COLOR: "lightGrey", MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [20, 15, 5, 0, 0, 2],
            TYPE: ["basic", {COLOR: "grey", MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [20, 10, -5, 0, 0, 1],
            TYPE: ["basic", {COLOR: "darkGrey", MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [20, -10, -5, 0, 0, -2],
            TYPE: ["basic", {COLOR: "darkGrey", MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: [20, -10, 5, 0, 0, -1],
            TYPE: ["basic", {COLOR: "grey", MIRROR_MASTER_ANGLE: true}]
        },
    ]
}
Class.alphaGunTest = {
    PARENT: "basic",
    LABEL: "Translucent Guns",
    GUNS: [{
        POSITION: {},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            ALPHA: 0.5
        }
    }]
}
Class.radialAutoTest = makeRadialAuto("gunner", {
    count: 5,
    isTurret: false,
    extraStats: {spray: 4, speed: 1.4, maxSpeed: 1.4, recoil: 0.2},
    turretIdentifier: "radialAutoTestTurret",
    size: 8,
    x: 10,
    arc: 220,
    angle: 36,
    label: "Radial Auto Test",
    rotation: 0.04,
    danger: 10,
})
Class.makeAutoTestTurret = makeTurret("ranger", {canRepel: true, limitFov: true, extraStats: {reload: 0.5}});
Class.makeAutoTest = {
    PARENT: 'genericTank',
    LABEL: "Make Auto Test",
    TURRETS: weaponArray({
        POSITION: [8, 10, 0, 0, 180, 0],
        TYPE: 'makeAutoTestTurret'
    }, 3)
}
Class.imageShapeTest = {
    PARENT: 'genericTank',
    LABEL: "Image Shape Test",
    SHAPE: 'image=/round.png',
    GUNS: Class.basic.GUNS
}
Class.screenShakeTest = {
    PARENT: 'genericTank',
    LABEL: "Screen Shake Test",
    COLOR: 36,
    SHAKE: [
        {
            CAMERA_SHAKE: {
                DURATION: 2000,
                AMOUNT: 15,
            },
            GUI_SHAKE: {
                DURATION: 1000,
                AMOUNT: 10,
            },
            APPLY_ON_UPGRADE: true,
        },
        {
            CAMERA_SHAKE: {
                DURATION: 800,
                AMOUNT: 10,
            },
            GUI_SHAKE: {
                DURATION: 600,
                AMOUNT: 6,
            },
            PUSH: true,
            APPLY_ON_SHOOT: true,   
        },
    ],
    GUNS: Class.basic.GUNS
}
Class.strokeWidthTest = {
    PARENT: "basic",
    LABEL: "Stroke Width Test",
    STROKE_WIDTH: 2,
    GUNS: [{
        POSITION: {},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            STROKE_WIDTH: 0.5
        }
    }]
}
Class.onTest = {
    PARENT: 'genericTank',
    LABEL: "ON property test",
    TOOLTIP: "Refer to Class.onTest in dev.js to know more.",
    ON: [{
        event: "fire",
        handler: ({ body, gun }) => {
            switch (gun.identifier) {
                case 'mainGun':
                    body.sendMessage(`I fired my main gun.`)
                    break;
                case 'secondaryGun':
                    body.sendMessage('I fired my secondary gun.')
                    break;
            }
        }
    }, {
        event: "altFire",
        handler: ({ body, gun }) => {
            body.sendMessage(`I fired my alt gun.`)
        }
    }, {
        event: "death",
        handler: ({ body, killers, killTools }) => {
            const killedOrDied = killers.length === 0 ? 'died.' : 'got killed.'
            body.sendMessage(`I ${killedOrDied}`)
        }
    }, {
        event: "collide",
        handler: ({ instance, other }) => {
            instance.sendMessage(`I collided with ${other.label}.`)
        }
    }, {
        event: "damage",
        handler: ({ body, damageInflictor, damageTool }) => { 
            body.sendMessage(`I got hurt.`)
        }
    }],
    GUNS: [{
        POSITION: {},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            IDENTIFIER: 'mainGun'
        }
    }, {
        POSITION: { ANGLE: 90 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            ALT_FIRE: true
        }
    }, {
        POSITION: { ANGLE: 180, DELAY: 0.5 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            IDENTIFIER: 'secondaryGun'
        }
    }]
}
Class.turretStatScaleTest = {
    PARENT: 'genericTank',
    LABEL: 'Turret Stat Test',
    TURRETS: Array(5).fill().map((_, i) => ({
        POSITION: [15, 0, -40 + 20 * i, 0, 360, 1],
        TYPE: ['autoTankGun', {GUN_STAT_SCALE: {speed: 1 + i / 5, maxSpeed: 1 + i / 5, reload: 1 + i / 5, recoil: 0}}]
    }))
}
Class.auraBasicGen = makeAura();
Class.auraBasic = {
    PARENT: "genericTank",
    LABEL: "Aura Basic",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 0, 1],
            TYPE: "auraBasicGen"
        }
    ],
    GUNS: Class.basic.GUNS
}
Class.auraHealerGen = makeAura(-1);
Class.auraHealer = {
    PARENT: "genericTank",
    LABEL: "Aura Healer",
    TURRETS: [
        {
            POSITION: [14, 0, 0, 0, 0, 1],
            TYPE: "auraHealerGen"
        }
    ],
    GUNS: Class.healer.GUNS
}
Class.ghoster_ghosted = {
    PARENT: "genericTank",
    TOOLTIP: 'You are now invisible, roam around and find your next target. You will be visible again in 5 seconds',
    LABEL: 'Ghoster',
    BODY: {
        SPEED: 20,
        ACCELERATION: 10,
        FOV: base.FOV + 1,
    },
    GUNS: [{
        POSITION: { WIDTH: 20, LENGTH: 20 },
    }],
    ALPHA: 0.6,
}
Class.ghoster = {
    PARENT: "genericTank",
    LABEL: 'Ghoster',
    TOOLTIP: 'Shooting will turn you invisible for 5 seconds',
    BODY: {
        SPEED: base.SPEED,
        ACCELERATION: base.ACCEL,
    },
    ON: [
        {
            event: 'fire',
            handler: ({ body }) => {
                body.define("ghoster_ghosted")
                setTimeout(() => {
                    body.SPEED = 1e-99
                    body.ACCEL = 1e-99
                    body.FOV *= 2
                    body.alpha = 1
                }, 2000)
                setTimeout(() => {
                    body.SPEED = base.SPEED
                    body.define("ghoster")
                }, 2500)
            }
        }
    ],
    GUNS: [{
        POSITION: {WIDTH: 20, LENGTH: 20},
        PROPERTIES: {
            TYPE: 'bullet',
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
        }
    }],
    ALPHA: 1,
}
Class.switcheroo = {
    PARENT: "basic",
    LABEL: 'Switcheroo',
    UPGRADES_TIER_0: [],
    RESET_UPGRADE_MENU: true,
    ON: [
        {
            event: "fire",
            handler: ({ body, globalMasterStore: store, gun }) => {
                if (gun.identifier !== 'switcherooGun') return
                store.switcheroo_i ??= 0;
                store.switcheroo_i++;
                store.switcheroo_i %= 6;
                body.define(Class.basic.UPGRADES_TIER_1[store.switcheroo_i]);
                setTimeout(() => body.define("switcheroo"), 6000);
            }
        }
    ],
    GUNS: [{
        POSITION: {},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: 'bullet',
            IDENTIFIER: 'switcherooGun'
        }
    }]
}
Class.vanquisher = {
    PARENT: "genericTank",
    DANGER: 8,
    LABEL: "Vanquisher",
    STAT_NAMES: statnames.generic,
    CONTROLLERS: ['stackGuns'],
    BODY: {
        SPEED: 0.8 * base.SPEED,
    },
    //destroyer
    GUNS: [{
        POSITION: [21, 14, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
            TYPE: "bullet"
        }

    //builder
    },{
        POSITION: [18, 12, 1, 0, 0, 0, 0],
    },{
        POSITION: [2, 12, 1.1, 18, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
            TYPE: "setTrap",
            STAT_CALCULATOR: "block"
        }

    //launcher
    },{
        POSITION: [10, 9, 1, 9, 0, 90, 0],
    },{
        POSITION: [17, 13, 1, 0, 0, 90, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]), TYPE: "minimissile", STAT_CALCULATOR: "sustained" }

    //shotgun
    },{
        POSITION: [4, 3, 1, 11, -3, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "bullet" }
    },{
        POSITION: [4, 3, 1, 11, 3, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "bullet" }
    },{
        POSITION: [4, 4, 1, 13, 0, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "casing" }
    },{
        POSITION: [1, 4, 1, 12, -1, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "casing" }
    },{
        POSITION: [1, 4, 1, 11, 1, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "casing" }
    },{
        POSITION: [1, 3, 1, 13, -1, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "bullet" }
    },{
        POSITION: [1, 3, 1, 13, 1, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "bullet" }
    },{
        POSITION: [1, 2, 1, 13, 2, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "casing" }
    }, {
        POSITION: [1, 2, 1, 13, -2, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]), TYPE: "casing" }
    }, {
        POSITION: [15, 14, 1, 6, 0, 270, 0],
        PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.fake]), TYPE: "casing" }
    }, {
        POSITION: [8, 14, -1.3, 4, 0, 270, 0]
    }]
}
Class.armyOfOneBullet = {
    PARENT: "bullet",
    LABEL: "Unstoppable",
    TURRETS: [
        {
            POSITION: [18.5, 0, 0, 0, 360, 0],
            TYPE: ["spikeBody", { COLOR: null }]
        },
        {
            POSITION: [18.5, 0, 0, 180, 360, 0],
            TYPE: ["spikeBody", { COLOR: null }]
        }
    ]
}
Class.armyOfOne = {
    PARENT: "genericTank",
    LABEL: "Army Of One",
    DANGER: 9,
    SKILL_CAP: [31, 31, 31, 31, 31, 31, 31, 31, 31, 31],
    BODY: {
        SPEED: 0.5 * base.SPEED,
        FOV: 1.8 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [21, 19, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, { reload: 0.5 }, { reload: 0.5 }, { reload: 0.5 }, { reload: 0.5 }]),
                TYPE: "armyOfOneBullet",
            },
        },{
            POSITION: [21, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, g.sniper, { reload: 0.5 }, { reload: 0.5 }, { reload: 0.5 }, { reload: 0.5 }, g.fake]),
                TYPE: "bullet",
            },
        }
    ],
}
Class.tooltipTank = {
    PARENT: 'genericTank',
    LABEL: "Tooltips",
    UPGRADE_TOOLTIP: "Allan please add details"
}
Class.bulletSpawnTest = {
    PARENT: 'genericTank',
    LABEL: "Bullet Spawn Position",
    GUNS: [
        {
            POSITION: [20, 10, 1, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0}]),
                TYPE: ['bullet', {BORDERLESS: true}],
                BORDERLESS: true,
            }
        }, {
            POSITION: [50, 10, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0}]),
                TYPE: ['bullet', {BORDERLESS: true}],
                BORDERLESS: true,
            }
        }
    ]
}
Class.propTestProp = {
    PARENT: 'genericTank',
    SHAPE: 6,
    COLOR: 0,
    GUNS: [
        {
            POSITION: [20, 10, 1, 0, 0, 45, 0],
            PROPERTIES: {COLOR: 13},
        }, {
            POSITION: [20, 10, 1, 0, 0, -45, 0],
            PROPERTIES: {COLOR: 13},
        }
    ]
}
Class.propTest = {
    PARENT: 'genericTank',
    LABEL: 'Deco Prop Test',
    GUNS: Class.basic.GUNS,
    PROPS: [
        {
            POSITION: [10, 0, 0, 0, 1],
            TYPE: 'propTestProp'
        }
    ]
}
Class.weaponArrayTest = {
    PARENT: 'genericTank',
    LABEL: 'Weapon Array Test',
    GUNS: weaponArray([
        {
            POSITION: [20, 8, 1, 0, 0, 25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}]),
                TYPE: 'bullet'
            }
        }, {
            POSITION: [17, 8, 1, 0, 0, 25, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 2}]),
                TYPE: 'bullet'
            }
        }
    ], 5, 0.4, false),
    TURRETS: weaponArray(
        {
            POSITION: [7, 10, 0, -11, 180, 0],
            TYPE: 'autoTankGun'
        }
    , 5),
}
Class.gunBenchmark = {
    PARENT: 'genericTank',
    LABEL: "Gun Benchmark",
    GUNS: weaponArray({
        POSITION: [60, 0.2, 0, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {size: 0, reload: 0.15, range: 0.05}]),
            TYPE: ["bullet", {DRAW_SELF: false}]
        }
    }, 720)
}
Class.syncWithTankTest = {
    PARENT: 'genericTank',
    LABEL: "Sync With Tank Test",
    SHAPE: 6,
    SYNC_WITH_TANK: true,
    FACING_TYPE: ["smoothToTarget", { smoothness: 30 }],
    GUNS: Class.basic.GUNS
}
exports.backwardsexports = {
    PARENT: "genericTank",
    LABEL: "Basic `Exports` exported tank",
    BODY: Class.basic.BODY,
    GUNS: Class.basic.GUNS,
}
let testLayeredBoss = new LayeredBoss("testLayeredBoss", "Test Layered Boss", "terrestrial", 7, 3, "terrestrialTrapTurret", 5, 7, true, {SPEED: 10});
testLayeredBoss.addLayer({gun: {
    POSITION: [3.6, 7, -1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.5 }]),
        TYPE: ["minion", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
testLayeredBoss.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: "crowbarTurret",
}}, true);

global.convertExportsToClass(exports);