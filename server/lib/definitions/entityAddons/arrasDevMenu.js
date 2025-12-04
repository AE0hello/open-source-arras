const { combineStats, makeMenu, makeAura, makeDeco, LayeredBoss, weaponArray, makeRadialAuto, makeTurret, makeAuto } = require('../facilitators.js')
const { base, basePolygonDamage, basePolygonHealth, dfltskl, statnames } = require('../constants.js')
const g = require('../gunvals.js')

// Developer tank that doesn't upgrade to anything
Class.arrasMenu_developer = { PARENT: "developer", UPGRADES_TIER_0: [] }

// Addon menu (Mainly for developers)
Class.arrasMenu_addonMenu = makeMenu("arras.io Menus")
Class.arrasMenu_addonMenu.UPGRADES_TIER_0 = [
    "arrasMenu_special",
    "arrasMenu_youtuber",
    "arrasMenu_retrograde",
]

// Special Menu
Class.arrasMenu_special = makeMenu("Special Menu")
Class.arrasMenu_special.UPGRADES_TIER_0 = [
    Config.spawn_class,
    "arrasMenu_gameAdmin", // psure its removed but kept here for completeness
    "eggGen",
    "arrasMenu_specialTanks",
    "arrasMenu_bosses",
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
    "arrasMenu_memes",
    "dreadOfficialV1",
    "arrasMenu_shinyMember"
]

// Game Admin/Mod / Beta Tester Menu(s)
Class.arrasMenu_gameAdmin = makeMenu("Game Admin Menu") // (BT 3)
Class.arrasMenu_gameAdmin.UPGRADES_TIER_0 = [
    Config.spawn_class,
    "arrasMenu_gameMod",
    "spectator",
    "guillotine",
    "banHammer", // not sure which order banhammer and guillotine go in, so i'm just using a guess based on gameMod
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
]

Class.arrasMenu_gameMod = makeMenu("Game Mod Menu") // (BT 2)
Class.arrasMenu_gameMod.UPGRADES_TIER_0 = [
    Config.spawn_class,
    "arrasMenu_betaTester",
    "spectator",
    "guillotine",
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
]

Class.arrasMenu_betaTester = makeMenu("Beta Tester Menu") // (BT 1)
Class.arrasMenu_betaTester.UPGRADES_TIER_0 = [
    Config.spawn_class,
    //"arrasMenu_betaTesterB", // todo: check if beta tester b actually existed here
    "spectator",
    "arrasMenu_tankChanges", // existed here at one point
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
]

Class.arrasMenu_tankChanges = makeMenu("Tank Changes Menu") // (Trial BT?)
Class.arrasMenu_betaTesterB = makeMenu("Beta Tester B") // (Trial BT?) documented, though likely no longer exists

// Special Tanks Menu(s)
Class.arrasMenu_specialTanks = makeMenu("Special Tanks Menu")
Class.arrasMenu_specialTanks.UPGRADES_TIER_0 = [
    "arrasMenu_special",
    "arrasMenu_healers",
    "arrasMenu_dominators",
    "arrasMenu_sanctuaries",
    "arenaCloser",
    "bacteria",
    "literallyAMachineGun",
    "mothership",
    "flagship",
    "turkey",
    //"arrasMenu_developer",
    "undercoverCop",
]

Class.arrasMenu_healers = makeMenu("Healer Menu", "mirror", 0, overrideGuns = [
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
Class.arrasMenu_healers.TURRETS = [
    {
        POSITION: {
            SIZE: 13,
            ARC: 360,
            LAYER: 1
        },
        TYPE: "healerSymbol"
    }
]
Class.arrasMenu_healers.UPGRADES_TIER_0 = [
    "healer",
    "medic",
    "ambulance",
    "surgeon",
    "paramedic",
    //"physician",
    //"doctor",
    "smasher",
    "underseer",
]

Class.arrasMenu_dominators = makeMenu("Dominator Menu")
Class.arrasMenu_dominators.UPGRADES_TIER_0 = [
    "arrasMenu_specialTanks",
    "dominator",
    "destroyerDominator",
    "gunnerDominator",
    "trapperDominator",
    //"destroyerDominator_armsRace",
    //"gunnerDominator_armsRace",
    //"trapperDominator_armsRace",
    "antiTankMachineGun",
    "baseProtector",
]

Class.arrasMenu_sanctuaries = makeMenu("Sanctuary Tier Menu")
Class.arrasMenu_sanctuaries.UPGRADES_TIER_0 = [
    "arrasMenu_specialTanks",
    "sanctuaryTier1",
    "sanctuaryTier2",
    "sanctuaryTier3",
    "sanctuaryTier4",
    "sanctuaryTier5",
    "sanctuaryTier6",
]

// Boss Menu(s)
Class.arrasMenu_bosses = makeMenu("Bosses Menu")
Class.arrasMenu_bosses.REROOT_UPGRADE_TREE = "arrasMenu_bosses"
Class.arrasMenu_bosses.UPGRADES_TIER_0 = Class.menu_bosses.UPGRADES_TIER_0

// Nostalgia Menu
Class.arrasMenu_nostalgia = makeMenu("Nostalgia Menu")
Class.arrasMenu_nostalgia.UPGRADES_TIER_0 = [
    "spreadshot_old",
    "boomer_old",
    "quadBuilder",
    "quintuplet",
    "vulcan",
    "sniper3",
    "spike_old",
    "master",
    "commander_old",
    "blunderbuss",
    "rimfire_old",
    "armsman_old",
]

// Scrapped Menu(s)
Class.arrasMenu_scrapped = makeMenu("Scrapped Menu")
Class.arrasMenu_scrapped.UPGRADES_TIER_0 = [
    "arrasMenu_scrapped2",
    "rocketeer",
    "crowbar",
    "peashooter",
    "autoTrapper",
    "megaTrapper",
    "railgun",
    "megaSpawner",
    "dreadnought_old",
]

Class.arrasMenu_scrapped2 = makeMenu("Scrapped Menu 2")
Class.arrasMenu_scrapped2.UPGRADES_TIER_0 = [
    "arrasMenu_gameMod",
    "arrasMenu_scrapped",
    "mender",
    "infestor",
    "prodigy",
    "spawnerdrive",
    //"rimfire",
    "productionist",
    //"taser",
]

// Memes Menu(s)
Class.arrasMenu_memes = makeMenu("Memes")
Class.arrasMenu_memes.UPGRADES_TIER_0 = [
    "arrasMenu_diep",
    "arrasMenu_adminTanks",
    "arrasMenu_misc",
    "arrasMenu_digdig",
]

Class.arrasMenu_diep = makeMenu("Diep Tanks")
Class.arrasMenu_diep.UPGRADES_TIER_0 = [
    "arrasMenu_diep2",
    //"diep_tank",
]

Class.arrasMenu_diep2 = makeMenu("Diep2 Menu")
Class.arrasMenu_diep2.UPGRADES_TIER_0 = [
    //"blaster",
    //"gatlingGun",
    //"machineFlank",
    //"machineTriple",
    //"rifle_old",
    //"buttbuttin",
    //"blower",
    //"quadTwin",
    //"tornado_old",
    //"subverter",
    //"battery",
    //"deathStar",
    //"bonker",
    //"protector",
    //"doubleTrapGuard",
]

Class.arrasMenu_adminTanks = makeMenu("Admin Tanks")
Class.arrasMenu_adminTanks.UPGRADES_TIER_0 = [
    "arrasMenu_developer",
    "cxATMG",
    "damoclone",
    "machineShot",
    "fat456",
    "wifeBeater",
]

Class.arrasMenu_misc = makeMenu("Misc")
Class.arrasMenu_misc.UPGRADES_TIER_0 = [
    //"theAmalgamation",
    //"theConglomerate",
    //"schoolShooter",
    //"average4tdmScore",
    //"averageL39Hunt",
    "tracker3",
    "momwtdym",
    "meDoingYourMom",
    "rapture",
    "bigBalls",
    "tetraGunner",
    "worstTank",
    //"genericEntity",
    //"quadCyclone",
    //"beeman",
    //"heptaAutoBasic",
    //"alas",
]

Class.arrasMenu_digdig = makeMenu("DigDig")
Class.arrasMenu_digdig.UPGRADES_TIER_0 = [
    //"digSmile",
    //"digSmile_kirk",
    //"digFrown",
    //"digFrown_kirk",
]

// Shiny Member Menu
Class.arrasMenu_shinyMember = makeMenu("Shiny Member Menu")
Class.arrasMenu_shinyMember.UPGRADES_TIER_0 = [
    "eggGen",
    "arrasMenu_specialTanks",
    "arrasMenu_bosses",
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
    "arrasMenu_diep",
    "dreadOfficialV2",
    "tracker3",
    "momwtdym",
    "meDoingYourMom",
    "rapture",
    "bigBalls",
    "tetraGunner",
    "worstTank",
    "machineShot",
]

// YouTuber
Class.arrasMenu_youtuber = {
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
                SIZE: 6,
                ARC: 360,
                LAYER: 1
            },
            TYPE: "deco_trianglePureWhite",
            ANGLE: 0,
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
Class.arrasMenu_youtuber.UPGRADES_TIER_0 = Class.arrasMenu_shinyMember.UPGRADES_TIER_0

// Retrograde
Class.arrasMenu_retrograde = makeMenu("Retrograde") // feature-reduced menu for retrograde event
Class.arrasMenu_retrograde.UPGRADES_TIER_0 = [
    "arrasMenu_diep",
    "arrasMenu_digdig",
    "menu_celestials", // placeholder until we get the arras'd version of this menu (celestial bosses, all rigged to self-destruct in 10 seconds)
    "menu_elites", // placeholder until we get the arras'd version of this menu (elite bosses)
    "menu_mysticals", // placeholder until we get the arras'd version of this menu (strange bosses)
    "arrasMenu_nostalgia",
    "arrasMenu_scrapped",
    "arrasMenu_miscRetrograde",
]

Class.arrasMenu_miscRetrograde = makeMenu("Misc Retrograde") // former menu, for retrograde event
Class.arrasMenu_miscRetrograde.UPGRADES_TIER_0 = [
    "tracker3",
    "tetraGunner",
    "worstTank",
]

// Push everything to addons
Class.menu_addons.UPGRADES_TIER_0.push("arrasMenu_addonMenu");
