const {base, statnames, smshskl} = require("../constants");
const {combineStats, menu, weaponArray, makeDeco} = require("../facilitators");
const g = require("../gunvals");

function init() {

// SHINY MENU & YOUTUBER TANK
    Class.youtuber = {
        PARENT: "genericTank",
        LABEL: "YouTuber",
        DANGER: 4,
        COLOR: "#FF0000",
        BODY: {
            SPEED: 20,
            HEALTH: 1e6,
            DAMAGE: 10,
            SHIELD: 1e4,
            REGEN: 10,
            FOV: base.FOV * 3,
        },
        PROPS: [
            {
                POSITION: [7, 0, 0, 360, 1],
                TYPE: ["mendersymbol", {COLOR: "#ffffff"}],
            }
        ],
        GUNS: [
            {
                POSITION: {LENGTH: 18, WIDTH: 8, ASPECT: 1},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic]),
                    TYPE: ["bullet", {COLOR: "#ffffff"}],
                }
            }
        ]
    }
// SPECIAL MENU UPGRADES AND TANKS
    Class.specialMenu = menu("Special Menu")
    Class.specialMenu.UPGRADES_TIER_0 = [
        "basic",
        "eggGenerator",
        "specialTanks",
        "bosses",
        "nostalgia",
        "scrapped",
        "memes",
        "dreadOfficialV1",
        "shinyMenu"
    ]
// MEMES TANKS
    Class.memes = menu("Memes");
    Class.memesAdminTanks = menu("Admin Tanks");
    Class.memes_fakedeveloper = {
        PARENT: "developer",
        UPGRADES_TIER_0: [],
        UPGRADES_TIER_1: [],
        UPGRADES_TIER_2: [],
        UPGRADES_TIER_3: [],
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
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.06, damage: 2, health: 1, speed: 8, maxSpeed: 7, recoil: 4}]),
                    TYPE: "developerBullet"
                }
            }
        ]
    }
    Class.memes_fat456 = {
        PARENT: "genericTank",
        SIZE: 30,
        LABEL: "Fat456",
        COLOR: "brown",
        FACING_TYPE: "spin",
        BODY: {
            SPEED: base.SPEED * 4
        },
        TURRETS: [
            {
                POSITION: [12, 8, 0, 0, 190, 0],
                TYPE: "architectGun",
            },
            {
                POSITION: [12, 8, 0, 120, 190, 0],
                TYPE: "architectGun",
            },
            {
                POSITION: [12, 8, 0, 240, 190, 0],
                TYPE: "architectGun",
            },
        ],
    }

    Class.memes_wifebeater = {
        PARENT: "overlord",
        LABEL: 'Wife Beater',
        DANGER: 8,
        STAT_NAMES: statnames.drone,
        BODY: {
            ACCELERATION: base.ACCEL * 0.75,
            SPEED: base.SPEED * 0.8,
            FOV: base.FOV * 1.1,
        },
        MAX_CHILDREN: 16,
        GUNS: weaponArray({
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.op]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 4)
    }

// MEMES UPGRADES
    Class.memes.UPGRADES_TIER_0 = ["memesAdminTanks"];
    Class.memesAdminTanks.UPGRADES_TIER_0 = ["memes_fakedeveloper", "cx_antiTankMachineGun", "damoclone", "machineShot", "memes_fat456", "memes_wifebeater"];

// SHINY MEMBER UPGRADES AND TANKS

    Class.shinyMenu = menu("Shiny Member Menu")

// SPECIAL TANKS MENU
    Class.specialTanks = menu("Special Tanks Menu")
    Class.specialTanksDominator = menu("Dominator Menu");
    Class.specialTanksDominator.UPGRADES_TIER_0 = [
        "specialTanks",
        "dominator",
        "destroyerDominator",
        "gunnerDominator",
        "trapperDominator",
        "antiTankMachineGun",
        "baseProtector",
    ]
    Class.specialTanksSanctuary = menu("Sanctuary Tier Menu");
    Class.specialTanksSanctuary.UPGRADES_TIER_0 = [
        "specialTanks",
        "sanctuaryTier1",
        "sanctuaryTier2",
        "sanctuaryTier3",
        "sanctuaryTier4",
        "sanctuaryTier5",
        "sanctuaryTier6",
    ]
    Class.healerMenu = menu("Healer Menu", -1, 0, overrideGuns = [
        {
            POSITION: [18, 10, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: ["bullet", {
                    TURRETS: [
                        {
                            POSITION: [13, 0, 0, 0, 360, 1],
                            TYPE: "healerSymbol",
                        }
                    ]
                }],
                NO_LIMITATIONS: true,
            },
        }
    ])
    Class.healerMenu.TURRETS = [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        }
    ]
// SPECIAL TANKS MENU UPGRADES
    Class.specialTanks.UPGRADES_TIER_0 = ["specialMenu", "healerMenu", "specialTanksDominator", "specialTanksSanctuary", "arenaCloser", "bacteria", "literallyAMachineGun", "mothership", "flagship", "turkey", "undercovercop"]

    //NOSTALGIA MENU AND UPGRADES
    Class.nostalgia = menu("Nostalgia Menu")

// OLD TANKS
    Class.oldSpreadshot = {
        PARENT: "genericTank",
        LABEL: "Old Spreadshot",
        DANGER: 7,
        GUNS: [
            {
                POSITION: [13, 4, 1, 0, -0.8, -75, 5 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [14.5, 4, 1, 0, -1.0, -60, 4 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [16, 4, 1, 0, -1.6, -45, 3 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [17.5, 4, 1, 0, -2.4, -30, 2 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [19, 4, 1, 0, -3.0, -15, 1 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [13, 4, 1, 0, 0.8, 75, 5 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [14.5, 4, 1, 0, 1.0, 60, 4 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [16, 4, 1, 0, 1.6, 45, 3 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [17.5, 4, 1, 0, 2.4, 30, 2 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [19, 4, 1, 0, 3.0, 15, 1 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [13, 10, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.pounder,
                        g.spreadshot,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Pounder",
                },
            },
        ],
    };
    Class.bentBoomer = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Bent Boomer",
        STAT_NAMES: statnames.trap,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.15 * base.FOV,
        },
        GUNS: [
            {
                POSITION: [8, 10, 1, 8, -2, -35, 0],
            },
            {
                POSITION: [8, 10, 1, 8, 2, 35, 0],
            },
            {
                POSITION: [2, 10, 1.3, 16, -2, -35, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.fast, g.twin]),
                    TYPE: "boomerang",
                },
            },
            {
                POSITION: [2, 10, 1.3, 16, 2, 35, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.fast, g.twin]),
                    TYPE: "boomerang",
                },
            },
        ],
    };
    Class.quadBuilder = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Quad Builder",
        STAT_NAMES: statnames.trap,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.15 * base.FOV,
        },
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, 0, 45, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 45, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 135, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 135, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 225, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 225, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 315, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 315, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
        ],
    };
    Class.weirdSpikeBody1 = {
        LABEL: "",
        FACING_TYPE: ["spin", { speed: 0.20 }],
        COLOR: 9,
        SHAPE: 3,
        INDEPENDENT: true,
    };
    Class.weirdSpikeBody2 = {
        LABEL: "",
        FACING_TYPE: ["spin", { speed: -0.17 }],
        COLOR: 9,
        SHAPE: 3,
        INDEPENDENT: true,
    };
    Class.weirdSpike = {
        PARENT: "genericTank",
        LABEL: "Weird Spike",
        DANGER: 7,
        BODY: {
            DAMAGE: 1.15 * base.DAMAGE,
            FOV: 1.05 * base.FOV,
            DENSITY: 1.5 * base.DENSITY,
        },
        IS_SMASHER: true,
        SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
        STAT_NAMES: statnames.smasher,
        TURRETS: [
            {
                POSITION: [20.5, 0, 0, 0, 360, 0],
                TYPE: "weirdSpikeBody1",
            },
            {
                POSITION: [20.5, 0, 0, 180, 360, 0],
                TYPE: "weirdSpikeBody2",
            },
        ],
    };
    Class.oldCommanderGun = {
        PARENT: "genericTank",
        LABEL: "",
        BODY: {
            FOV: 3,
        },
        CONTROLLERS: ["nearestDifferentMaster"],
        COLOR: 16,
        MAX_CHILDREN: 6,
        AI: {
            NO_LEAD: true,
            SKYNET: true,
            FULL_VIEW: true,
        },
        GUNS: [
            {
                POSITION: [8, 14, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.commander]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                },
            },
        ],
    };
    Class.oldCommander = {
        PARENT: "genericTank",
        LABEL: "Old Commander",
        STAT_NAMES: statnames.drone,
        DANGER: 7,
        BODY: {
            FOV: 1.15 * base.FOV,
        },
        FACING_TYPE: "spin",
        TURRETS: [
            {
                POSITION: [16, 1, 0, 0, 0, 0],
                TYPE: "oldCommanderGun",
            },
            {
                POSITION: [16, 1, 0, 120, 0, 0],
                TYPE: ["oldCommanderGun", { INDEPENDENT: true }],
            },
            {
                POSITION: [16, 1, 0, 240, 0, 0],
                TYPE: ["oldCommanderGun", { INDEPENDENT: true }],
            },
        ],
    };

    Class.blunderbuss = {
        PARENT: "genericTank",
        LABEL: "Blunderbuss",
        DANGER: 7,
        BODY: {
            FOV: base.FOV * 1.225,
        },
        GUNS: [
            {
                POSITION: [13, 4, 1, 0, -3, -9, 0.3],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [15, 4, 1, 0, -2.5, -6, 0.2],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [16, 4, 1, 0, -2, -3, 0.1],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [13, 4, 1, 0, 3, 9, 0.3],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [15, 4, 1, 0, 2.5, 6, 0.2],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [16, 4, 1, 0, 2, 3, 0.1],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [25, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                },
            },
            {
                POSITION: [14, 10.5, 1, 0, 0, 0, 0],
            },
        ],
    };
    Class.oldRimfire = {
        PARENT: "genericTank",
        LABEL: "Rimfire",
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [12, 5, 1, 0, 7.25, 15, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -7.25, -15, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, 3.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, -3.75, -0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
        ],
    };
    Class.vulcan = {
        PARENT: "genericTank",
        LABEL: "Vulcan",
        DANGER: 7,
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [28, 2, 1, 0, 4, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [28, 2, 1, 0, -4, 0, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [28, 2, 1, 0, 2.25, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [28, 2, 1, 0, -2.25, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [28, 2, 1, 0, 0, 0, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 13, 1, 7, 0, 0, 0],
            },
            {
                POSITION: [5, 13, 1, 20, 0, 0, 0],
            },
        ],
    };
    Class.quintuplet = {
        PARENT: "genericTank",
        DANGER: 7,
        BODY: {
            FOV: 1.1 * base.FOV,
        },
        LABEL: "Quintuplet",
        GUNS: [
            {
                POSITION: [16, 10, 1, 0, -5, 0, 0.667],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 10, 1, 0, 5, 0, 0.667],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 10, 1, 0, -3, 0, 0.333],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [19, 10, 1, 0, 3, 0, 0.333],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [22, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                    TYPE: "bullet",
                },
            },
        ],
    };
    Class.sniper3gun = {
        PARENT: "genericTank",
        LABEL: "",
        BODY: {
            FOV: 5,
        },
        CONTROLLERS: [
            "canRepel",
            "onlyAcceptInArc",
            "mapAltToFire",
            "nearestDifferentMaster",
        ],
        COLOR: 16,
        GUNS: [
            {
                POSITION: [27, 9, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([ g.basic, g.sniper, g.autoTurret, g.assassin ]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 9, -1.5, 8, 0, 0, 0],
            },
        ],
    };
    Class.sniper3 = {
        PARENT: "genericTank",
        LABEL: "Sniper-3",
        DANGER: 7,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.25 * base.FOV,
        },
        FACING_TYPE: "spin",
        TURRETS: [
            {
                POSITION: [13, 8, 0, 0, 170, 0],
                TYPE: "sniper3gun",
            },
            {
                POSITION: [13, 8, 0, 120, 170, 0],
                TYPE: "sniper3gun",
            },
            {
                POSITION: [13, 8, 0, 240, 170, 0],
                TYPE: "sniper3gun",
            },
        ],
    };
    Class.oldarmsman = {
        PARENT: "genericTank",
        LABEL: "Old Armsman",
        UPGRADE_TOOLTIP: "Originally called: 'Ransacker'",
        BODY: {
            FOV: base.FOV * 1.225,
        },
        DANGER: 7,
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [20, 12, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [24, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 8.5, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [4, 8.5, 1.7, 13, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ],
    };
    Class.badDreadnought = {
        PARENT: "genericTank",
        LABEL: "Bad Dreadnought",
        DANGER: 7,
        FACING_TYPE: "locksFacing",
        STAT_NAMES: statnames.swarm,
        BODY: {
            FOV: base.FOV * 1.2,
        },
        TURRETS: [
            {
                /*  SIZE     X       Y     ANGLE    ARC */
                POSITION: [20, -4, 0, 0, 0, 0],
                TYPE: "genericEntity",
            },
        ],
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [18, 8, 1, 0, 0, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [6, 16, 1, 16, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.swarm, g.fake]),
                    TYPE: "swarm",
                    STAT_CALCULATOR: "swarm",
                },
            },
            {
                POSITION: [1, 3, 1, 3, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([ g.basic, g.twin, g.gunner, g.machineGun, g.thruster, [0.1, 3, 1, 1, 1, 1, 1, 1, 1, 0.075, 1, 2, 1] ]),
                    TYPE: "bullet",
                },
            },
        ],
    };
    Class.mender = {
        PARENT: "genericTank",
        LABEL: "Mender",
        DANGER: 7,
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [17, 3, 1, 0, -6, -7, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [17, 3, 1, 0, 6, 7, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Secondary",
                },
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                    TYPE: "bullet",
                    LABEL: "Heavy",
                },
            },
            {   POSITION: [17, 10, 1, 0, 0, 180, 0]   },
            {
                POSITION: [5, 18, 1, -19, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.pounder,
                        g.destroyer,
                        [2, 0, 1, 1, 1, -1, 1, 1, 1, 0.1, 1, 1, 1],
                    ]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            },
        ],
        TURRETS: [
            {
                POSITION: [7, 0, 0, 0, 0, 1],
                TYPE: makeDeco(3),
            },
        ],
    };
    Class.productionist = {
        PARENT: "genericTank",
        LABEL: "Productionist",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: {
            SPEED: base.SPEED * 0.75,
            FOV: 1.1,
        },
        GUNS: [
            {
                /**** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [4.5, 6, 1, 10, 4.75, 0, 0],
            },
            {
                POSITION: [1, 7.25, 1, 14.25, 4.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [7.5, 7.25, -1.3, 3.5, 4.75, 0, 0],
            },
            {
                POSITION: [4.5, 6, 1, 10, -4.75, 0, 0.5],
            },
            {
                POSITION: [1, 7.25, 1, 14.25, -4.75, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [7.5, 7.25, -1.3, 3.5, -4.75, 0, 0.5],
            },
        ],
    };
    Class.nostalgia.UPGRADES_TIER_0 = [
        "oldSpreadshot",
        "bentBoomer",
        "quadBuilder",
        "quintuplet",
        "vulcan",
        "sniper3",
        "weirdSpike",
        "master",
        "oldCommander",
        "blunderbuss",
        "oldRimfire",
        "oldarmsman",
    ]
    Class.worstTank = {
        PARENT: "genericTank",
        LABEL: "Worst Tank",
        DANGER: 7,
        BODY: {
            SPEED: 0.9 * base.SPEED,
        },
        GUNS: [
            {
                POSITION: [14, 3, 4, -3, 5, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, -3, -5, 0, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, 2.5, 0, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 3, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.momwtdym = {
        PARENT: "genericTank",
        LABEL: "Me on my way to do your mom",
        DANGER: 7,
        GUNS: [
            {
                POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 0.01, recoil: 10, spray: 1 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.mdym = {
        PARENT: "genericTank",
        LABEL: "Me doing your mom",
        DANGER: 7,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.5 * base.FOV,
        },
        GUNS: [
            {
                POSITION: [128, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { recoil: 0.01, reload: 0.01 }]),
                    FIXED_RELOAD: true,
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 8, -1.4, 8, 0, 0, 0],
            },
        ],
    }
    Class.bigBall = {
        PARENT: "drone",
        SHAPE: 8
    }
    Class.bigBalls = {
        PARENT: "genericTank",
        LABEL: "BIG Balls",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: {
            SPEED: 0.9 * base.SPEED,
            FOV: 1.1 * base.FOV,
        },
        MAX_CHILDREN: 2,
        GUNS: weaponArray({
            POSITION: [8, 18, 1.2, 6, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.bigBalls]),
                TYPE: "bigBall",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 2)
    }
    Class.tetraGunner = {
        PARENT: "genericTank",
        LABEL: "Tetra Gunner",
        DANGER: 7,
        GUNS: weaponArray([
            {
                POSITION: [8, 3.5, 1, 7.25, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [8, 3.5, 1, 7.25, 4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 7.25, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
        ], 4)
    }
    // SCRAPPED MENU & UPGRADES
    Class.scrapped = menu("Scrapped Menu")
    Class.scrapped2 = menu("Srapped Menu 2")

    Class.scrapped.UPGRADES_TIER_0 = [
        "scrapped2",
        "rocketeer",
        "crowbar",
        "peashooter",
        "autoTrapper",
        "megaTrapper",
        "railgun",
        "megaSpawner",
        "badDreadnought"
    ]
    Class.scrapped2.UPGRADES_TIER_0 = [
        "genericEntity", // "gameModMenu" // TODO: ADD GAME MOD MENU
        "scrapped",
        "mender",
        "infestor",
        "prodigy",
        "spawnerdrive",
        "oldRimfire",
        "productionist",
        "vulture",
    ]

// Upgrade Tree
    Class.shinyMenu.UPGRADES_TIER_0 = ["eggGenerator", "specialTanks", "bosses", "nostalgia", "scrapped", "dreadOfficialV2", "tracker3", "momwtdym", "mdym", "rapture", "bigBalls", "tetraGunner", "worstTank", "machineShot"]

}

init();