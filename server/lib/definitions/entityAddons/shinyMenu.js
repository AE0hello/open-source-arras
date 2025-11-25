const {base, statnames, smshskl} = require("../constants")
const {combineStats, makeMenu, weaponArray, makeDeco} = require("../facilitators")
const g = require("../gunvals")

// todo-ing: fix shit code
function init() {

const better_upgrade_labels = true // Shortens pretty much all menu names in the upgrade menu to minimize overlapping
const fancy_menus = true // Makes certain menus look more thematic

// Menus
Class.specialMenu = makeMenu("Special Menu")
Class.specialTanksMenu = makeMenu("Special Tanks Menu")
Class.healerMenu = makeMenu("Healer Menu", "mirror", 0, overrideGuns = [
    {
        POSITION: {
            LENGTH: 18,
            WIDTH: 10,
            ASPECT: -1.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: ["bullet", {
                TURRETS: [
                    {
                        POSITION: {
                            SIZE: 13,
                            ARC: 360,
                            LAYER: 1
                        },
                        TYPE: "healerSymbol"
                    }
                ]
            }],
            NO_LIMITATIONS: true
        }
    }
])
Class.healerMenu.TURRETS = [
    {
        POSITION: {
            SIZE: 13,
            ARC: 360,
            LAYER: 1
        },
        TYPE: "healerSymbol"
    }
]
Class.sanctuaryTierMenu = makeMenu("Sanctuary Tier Menu")
Class.dominatorMenu = makeMenu("Dominator Menu")
Class.bossesMenu = makeMenu("Bosses Menu"), Class.bossesMenu.REROOT_UPGRADE_TREE = "bossesMenu"
Class.nostalgiaMenu = makeMenu("Nostalgia Menu")
Class.scrappedMenu = makeMenu("Scrapped Menu")
Class.scrappedMenu2 = makeMenu("Srapped Menu 2")
Class.memes = makeMenu("Memes")
Class.diepTanks = makeMenu("Diep Tanks")
Class.diep2Menu = makeMenu("Diep2 Menu")
Class.adminTanks = makeMenu("Admin Tanks")
Class.misc = makeMenu("Misc")
Class.digdig = makeMenu("DigDig")
Class.shinyMemberMenu = makeMenu("Shiny Member Menu")
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
            POSITION: {
                SIZE: 7,
                ARC: 360,
                LAYER: 1
            },
            TYPE: "deco_trianglePureWhite",
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ASPECT: 1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: ["bullet", {COLOR: "#ffffff"}],
            }
        }
    ]
}

Class.gameAdminMenu = makeMenu("Game Admin Menu") // (BT 3)
Class.gameModMenu = makeMenu("Game Mod Menu") // (BT 2)
Class.betaTesterMenu = makeMenu("Beta Tester Menu") // (BT 1)

Class.betaTesterB = makeMenu("Beta Tester B") // (Trial BT?) documented, though likely no longer exists

// Menu upgrades
Class.specialMenu.UPGRADES_TIER_0 = [Config.SPAWN_CLASS, "eggGen", "specialTanksMenu", "bossesMenu", "nostalgiaMenu", "scrappedMenu", "memes", "dreadOfficialV1", "shinyMemberMenu"]
    Class.specialTanksMenu.UPGRADES_TIER_0 = ["specialMenu", "healerMenu", "dominatorMenu", "sanctuaryTierMenu", "arenaCloser", "bacteria", "literallyAMachineGun", "mothership", "flagship", "turkey", "undercoverCop"]
        Class.healerMenu.UPGRADES_TIER_0 = ["healer", "medic", "ambulance", "surgeon", "paramedic"/*, "physician", "doctor"*/, "smasher", "underseer"]
        Class.dominatorMenu.UPGRADES_TIER_0 = ["specialTanksMenu", "dominator", "destroyerDominator", "gunnerDominator", "trapperDominator", /*"destroyerDominator_armsRace", "gunnerDominator_armsRace", "trapperDominator_armsRace", */"antiTankMachineGun", "baseProtector"]
        Class.sanctuaryTierMenu.UPGRADES_TIER_0 = ["specialTanksMenu", "sanctuaryTier1", "sanctuaryTier2", "sanctuaryTier3", "sanctuaryTier4", "sanctuaryTier5", "sanctuaryTier6"]
        Class.nostalgiaMenu.UPGRADES_TIER_0 = ["spreadshot_old", "boomer_old", "quadBuilder", "quintuplet", "vulcan", "sniper3", "spike_old", "master", "commander_old", "blunderbuss", "rimfire_old", "armsman_old"]
        Class.scrappedMenu.UPGRADES_TIER_0 = ["scrappedMenu2", "rocketeer", "crowbar", "peashooter", "autoTrapper", "megaTrapper", "railgun", "megaSpawner", "badDreadnought"]
            Class.scrappedMenu2.UPGRADES_TIER_0 = ["gameModMenu", "scrappedMenu", "mender", "infestor", "prodigy", "spawnerdrive", "rimfire_old", "productionist", "vulture"]
    Class.memes.UPGRADES_TIER_0 = ["diepTanks", "adminTanks", "misc", "digdig"]
        Class.diepTanks.UPGRADES_TIER_0 = ["diep2Menu"/*, "diep_tank"*/]
            Class.diep2Menu.UPGRADES_TIER_0 = [/*"blaster", "gatlingGun", "machineFlank", "machineTriple", "rifle_old", "buttbuttin", "blower", "quadTwin", "tornado_old", "subverter", "battery", "deathStar", "bonker", "protector", "doubleTrapGuard*/]
        Class.adminTanks.UPGRADES_TIER_0 = ["fakedeveloper", "cx_antiTankMachineGun", "damoclone", "machineShot", "fat456", "wifebeater"]
        Class.misc.UPGRADES_TIER_0 = [/*"theAmalgamation", "theConglomerate", "america", "average4tdmScore", "averageL39Hunt", */"tracker3", "momwtdym", "mdym", "rapture", "bigBalls", "tetraGunner", "worstTank"/*, "genericEntity", "quadCyclone", "beeman", "heptaAutoBasic", "alas"*/]
        Class.digdig.UPGRADES_TIER_0 = [/*"digSmile", "digSmile_kirk", "digFrown", "digFrown_kirk"*/]
    Class.shinyMemberMenu.UPGRADES_TIER_0 = [Config.SPAWN_CLASS, "eggGen", "specialTanksMenu", "bossesMenu", "nostalgiaMenu", "scrappedMenu", "diepTanks", "dreadOfficialV2", "tracker3", "momwtdym", "mdym", "rapture", "bigBalls", "tetraGunner", "worstTank", "machineShot"]
    Class.youtuber.UPGRADES_TIER_0 = Class.shinyMemberMenu.UPGRADES_TIER_0

    Class.bossesMenu.UPGRADES_TIER_0 = ["sentries", "elites", "mysticals", "nesters", "rogues", "rammers", "terrestrials", "celestials", "eternals", "devBosses"]
        Class.sentries.UPGRADES_TIER_0 = ["sentrySwarm", "sentryGun", "sentryTrap", "shinySentrySwarm", "shinySentryGun", "shinySentryTrap", "sentinelMinigun", "sentinelLauncher", "sentinelCrossbow"]
        Class.elites.UPGRADES_TIER_0 = ["eliteDestroyer", "eliteGunner", "eliteSprayer", "eliteBattleship", "eliteSpawner", "eliteTrapGuard", "eliteSpinner", "eliteSkimmer", "legionaryCrasher", "guardian", "defender", "sprayerLegion", "deltas"]
        Class.deltas.UPGRADES_TIER_0 = ["deltaDestroyer", "deltaGunner", "deltaSprayer", "deltaBattleship"]
        Class.mysticals.UPGRADES_TIER_0 = ["sorcerer", "summoner", "enchantress", "exorcistor", "shaman", "thaumaturge"]
        Class.nesters.UPGRADES_TIER_0 = ["nestKeeper", "nestWarden", "nestGuardian", "nestCurator", "nestDeacon", "nestChampion"]
        Class.rogues.UPGRADES_TIER_0 = ["roguePalisade", "rogueAlcazar", "rogueArmada", "julius", "genghis", "napoleon"]
        Class.rammers.UPGRADES_TIER_0 = ["bob", "nemesis"]
        Class.terrestrials.UPGRADES_TIER_0 = ["ares", "gersemi", "ezekiel", "eris", "selene"]
        Class.celestials.UPGRADES_TIER_0 = ["paladin", "freyja", "zaphkiel", "nyx", "theia", "atlas", "rhea", "julius", "genghis", "napoleon"]
        Class.eternals.UPGRADES_TIER_0 = ["ragnarok", "kronos"]
        Class.devBosses.UPGRADES_TIER_0 = ["retiredDevBosses", "zephiBoss", "dogeiscutBoss", "toothlessBoss", "AEMKShipBoss", "helenaBoss"]
            Class.retiredDevBosses.UPGRADES_TIER_0 = ["taureonBoss", "trplnrBoss", "frostBoss"]

Class.gameAdminMenu.UPGRADES_TIER_0 = [Config.SPAWN_CLASS, "gameModMenu", "spectator"/*, "banHammer", "guillotine"*/, "nostalgiaMenu", "scrappedMenu"] // not sure which order banhammer and guillotine go in, so i'm just using a guess based on gamemod
    Class.gameModMenu.UPGRADES_TIER_0 = [Config.SPAWN_CLASS, "betaTesterMenu", "spectator"/*, "guillotine"*/, "nostalgiaMenu", "scrappedMenu"]
        Class.betaTesterMenu.UPGRADES_TIER_0 = [Config.SPAWN_CLASS/*, "betaTesterB"*/, "spectator", "nostalgiaMenu", "scrappedMenu"] // todo: check if beta tester b actually existed here

if (better_upgrade_labels) {
Class.specialMenu.UPGRADE_LABEL = "Special"
Class.specialTanksMenu.UPGRADE_LABEL = "Special Tanks"
Class.healerMenu.UPGRADE_LABEL = "Healers"
Class.dominatorMenu.UPGRADE_LABEL = "Dominators"
Class.sanctuaryTierMenu.UPGRADE_LABEL = "Sanctuaries"
Class.bossesMenu.UPGRADE_LABEL = "Bosses"
Class.nostalgiaMenu.UPGRADE_LABEL = "Nostalgia"
Class.scrappedMenu.UPGRADE_LABEL = "Scrapped"
Class.scrappedMenu2.UPGRADE_LABEL = "Scrapped"
Class.diep2Menu.UPGRADE_LABEL = "Diep2"
Class.shinyMemberMenu.UPGRADE_LABEL = "Shiny Member"
Class.gameAdminMenu.UPGRADE_LABEL = "Game Admin"
Class.gameModMenu.UPGRADE_LABEL = "Game Mod"
Class.betaTesterMenu.UPGRADE_LABEL = "Beta Tester"
}

if (fancy_menus) {
Class.dominatorMenu.PROPS = [
    {
        POSITION: [22, 0, 0, 360, 0],
        TYPE: "dominationBody"
    }
]
Class.sanctuaryTierMenu.PROPS = [
    {
        POSITION: [22, 0, 0, 360, 0],
        TYPE: "dominationBody"
    },
    {
        POSITION: [13, 0, 0, 360, 1],
        TYPE: "healerSymbol"
    }
]
}

// Shiny Member Menu / YouTuber
// SPECIAL MENU UPGRADES AND TANKS
// MEMES TANKS
    Class.fakedeveloper = {
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
    Class.fat456 = {
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
    Class.wifebeater = {
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

// SHINY MEMBER UPGRADES AND TANKS

// SPECIAL TANKS MENU
// SPECIAL TANKS MENU UPGRADES

    //NOSTALGIA MENU AND UPGRADES

// OLD TANKS
    Class.spreadshot_old = {
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
    }
    Class.boomer_old = {
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
    }
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
    }
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
    }
    Class.commander_old = {
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
    }
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
    }
    Class.rimfire_old = {
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
    }
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
    }
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
    }
    Class.armsman_old = {
        PARENT: "genericTank",
        LABEL: "Old Armsman",
        BODY: {
            FOV: base.FOV * 1.225,
        },
        DANGER: 7,
        GUNS: [
            {
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
    }

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
    }
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
    }
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

// Upgrade Tree

}

init();