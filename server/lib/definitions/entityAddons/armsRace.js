const { dereference, combineStats, makeRearGunner, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, weaponMirror, makeTurret } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
const g = require('../gunvals.js')

const hybridTankOptions = {count: 1, independent: true, cycle: false}
const megaAutoOptions = {type: "megaAutoTurret", size: 12}

// CREDITS
// - anguisj, helenadev: general help
// - u/SkyShredder89: tier 3/4 sprayer branch

return

// not too concerned about following actual arms race tiers since they don't make any fucking sense
Config.LEVEL_CAP = 60
Config.LEVEL_CHEAT_CAP = 60

// Extra gunvals
g.diesel = { reload: 0.375, recoil: 0.8, shudder: 1.2, size: 0.625, health: 0.95, damage: 0.9, maxSpeed: 0.8, spray: 1.3 }
g.honcho = { reload: 1.2, size: 1.35, health: 1.75, speed: 1.125 }

// Facilitators
const makeFast = (type, mult = 1.1, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    if (output.BODY.SPEED) output.BODY.SPEED = base.SPEED;
    output.BODY.SPEED *= mult;
    output.LABEL = name == -1 ? output.LABEL : name;
    return output;
}
const makeTripleAuto = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let turret = {
        type: "autoTurret",
        size: 6,
        independent: true,
        color: 16,
        angle: 180,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }
    if (options.color != null) {
        turret.color = options.color;
    }
    let output = dereference(type);
    let autoguns = weaponArray({
        POSITION: [turret.size, 4.5, 0, 180, 360, 1],
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color
            }
        ]
    }, 3)
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [...autoguns];
    } else {
        output.TURRETS = [...type.TURRETS, ...autoguns];
    }
    if (name == -1) {
        output.LABEL = "Triple Auto-" + type.LABEL;
    } else {
        output.LABEL = name;
    }
    output.DANGER = type.DANGER + 2;
    return output;
}

// PLACEHOLDER
Class.PLACEHOLDER = {
    PARENT: "genericTank",
    LABEL: "PLACEHOLDER",
    COLOR: "black",
    UPGRADE_COLOR: "black"
}

// Projectiles
Class.fastDrone = makeFast('drone')
Class.fasterDrone = makeFast('drone', 1.2)
Class.fastestDrone = makeFast('drone', 1.4)
Class.fastSwarm = makeFast('swarm')
Class.fastMinion = makeFast('minion')
Class.turretedTrap = makeAuto("trap", {type: "bulletAutoTurret", size: 14, color: "veryLightGrey", angle: 0})



// Tier 1 (existing)
Class.desmos.UPGRADES_TIER_2.splice(0, 0, "volute")
Class.desmos.UPGRADES_TIER_2.push(
    "spiral",
    //"undertow",
    "repeater",
)
Class.desmos.UPGRADES_TIER_3 = [
    "bender",
]
Class.director.UPGRADES_TIER_2.push(
    "directordrive",
    "honcho",
    "doper",
)
Class.director.UPGRADES_TIER_3.splice(1, 1) // remove big cheese
Class.director.UPGRADES_TIER_4 = [
    "coordinator",
]
Class.flankGuard.UPGRADES_TIER_4 = [
    "ternion",
]
Class.machineGun.UPGRADES_TIER_2.push(
    "diesel",
    "machineTrapper",
)
Class.machineGun.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"gadgetGun",
]
Class.pounder.UPGRADES_TIER_2.push(
    "volute",
)
Class.pounder.UPGRADES_TIER_3.push(
    "PLACEHOLDER",//"subverter",
)
Class.pounder.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"bruiser",
]
Class.sniper.UPGRADES_TIER_3.push(
    "railgun",
)
Class.sniper.UPGRADES_TIER_4 = [
    "sharpshooter",
]
Class.trapper.UPGRADES_TIER_2.push(
    "pen",
    "mech",
    "machineTrapper",
    "wark",
)
Class.trapper.UPGRADES_TIER_3.splice(0, 1) // remove barricade
Class.trapper.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"sawedOff",
    "PLACEHOLDER",//"tricker",
]
Class.trapper.UPGRADES_TIER_3.push(
    "megaTrapper",
)
Class.twin.UPGRADES_TIER_2.push(
    "wark",
)
Class.twin.UPGRADES_TIER_3.splice(1, 1) // remove bulwark
Class.twin.UPGRADES_TIER_4 = [
    "duo",
]



// Tier 2 (existing)
Class.artillery.UPGRADES_TIER_3.push(
    "recharger",
)
Class.assassin.UPGRADES_TIER_3.push(
    "buttbuttin",
    "hitman",
    "sniper3",
    "PLACEHOLDER",//"enforcer",
    "PLACEHOLDER",//"courser",
)
Class.assassin.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"executor",
    "PLACEHOLDER",//"finger",
]
Class.auto3.UPGRADES_TIER_3.push(
    "sniper3",
    "crowbar",
    "autoAuto3",
    "combo",
)
Class.autoTrapper.UPGRADES_TIER_3.splice(0, 0,
    "megaAutoTrapper",
    "tripleAutoTrapper",
)
Class.autoTrapper.UPGRADES_TIER_3.push(
    "autoTrapGuard",
)
Class.autoTrapper.UPGRADES_TIER_4 = [
    "autoOvertrapper",
    "autoMegaTrapper",
]
Class.doubleTwin.UPGRADES_TIER_3.push(
    "doubleFlankTwin",
    "doubleGunner",
    "doubleHelix",
    "warkwark",
)
Class.doubleTwin.UPGRADES_TIER_4 = [
    "doubleDual",
    "doubleMusket",
    "overdoubleTwin",
]
Class.gunner.UPGRADES_TIER_3.push(
    "battery",
    "buttbuttin",
    "blower",
    "rimfire",
    "PLACEHOLDER",//"volley",
    "doubleGunner",
    "bentGunner",
    "PLACEHOLDER",//"equalizer",
)
Class.gunner.UPGRADES_TIER_4 = [
    "dam",
]
Class.helix.UPGRADES_TIER_3.push(
    "coil",
    "duplicator",
    "doubleHelix",
    "autoHelix",
)
Class.hexaTank.UPGRADES_TIER_3.push(
    "deathStar",
    "autoHexaTank",
    "mingler",
    "combo",
)
Class.hunter.UPGRADES_TIER_3.push(
    "autoHunter",
)
Class.smasher.UPGRADES_TIER_3.push(
    "bonker",
    "PLACEHOLDER",//"banger",
    "PLACEHOLDER",//"drifter",
)
Class.spawner.UPGRADES_TIER_3.push(
    "bender",
)
Class.sprayer.UPGRADES_TIER_3.push(
    "frother",
    "foamer",
    "faucet",
    "shower",
    "autoSprayer",
    "stormer",
)
Class.trapGuard.UPGRADES_TIER_3.push(
    "peashooter",
    "PLACEHOLDER",//"incarcerator",
    "PLACEHOLDER",//"mechGuard",
    "autoTrapGuard",
    "PLACEHOLDER",//"machineGuard",
    "PLACEHOLDER",//"triTrapGuard",
)
Class.trapGuard.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"garrison",
    "PLACEHOLDER",//"maw",
    "PLACEHOLDER",//"overtrapGuard",
    "custodian",
]
Class.triAngle.UPGRADES_TIER_3.push(
    "quadAngle",
)
Class.tripleShot.UPGRADES_TIER_3.push(
    "splitShot",
    "autoTripleShot",
    "bentGunner",
    "bentMinigun",
    "defect",
    "waarrk",
)
Class.rifle.UPGRADES_TIER_3.push(
    "autoRifle",
)
Class.volute.UPGRADES_TIER_3.push(
    "recharger",
)



// Tier 3 (existing)
Class.atomizer.UPGRADES_TIER_4 = [
    "scatterer",
    "PLACEHOLDER",//"nebulizer",
    "ziz",
    "PLACEHOLDER",//"focus",
    "PLACEHOLDER",//"spewer",
    "PLACEHOLDER",//"bubbler",
    "sprinkler",
    "PLACEHOLDER",//"leak",
    "autoAtomizer",
    "PLACEHOLDER",//"typhoon",
]
Class.autoDouble.UPGRADES_TIER_4 = [
    "megaAutoDouble",
    "tripleAutoDouble",
    "autoTripleTwin",
    "autoHewnDouble",
    "autoBentDouble",
    "autoDoubleFlankTwin",
    "autoDoubleGunner",
    "autoDoubleHelix",
    "autoWarkwark",
]
Class.bentDouble.UPGRADES_TIER_4 = [
    "bentTriple",
    "pentaDouble",
    "autoBentDouble",
    "doubleTriplet",
    "cleft",
    "doubleSpreadshot",
    "bentFlankDouble",
    "PLACEHOLDER",//"bentDoubleGunner",
    "doubleTriplex",
    "PLACEHOLDER",//"bentDoubleMinigun",
    "PLACEHOLDER",//"splitDouble",
    "waarrkwaarrk",
]
Class.bulwark.UPGRADES_TIER_4 = [
    "dam",
]
Class.focal.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"concentrator",
    "PLACEHOLDER",//"scope",
    "alicanto",
    "PLACEHOLDER",//"focus",
    "PLACEHOLDER",//"negentropy",
    "PLACEHOLDER",//"bucket",
    "pressureWasher",
    "PLACEHOLDER",//"tap",
    "autoFocal",
    "PLACEHOLDER",//"leafBlower",
]
Class.hewnDouble.UPGRADES_TIER_4 = [
    "hewnTriple",
    "autoHewnDouble",
    "cleft",
    "skewnDouble",
    "PLACEHOLDER",//"hewnFlankDouble",
    "PLACEHOLDER",//"hewnGunner",
    "hewnHelix",
    "PLACEHOLDER",//"warkwawarkrk",
]
Class.nailgun.UPGRADES_TIER_4 = [
    "vulcan",
    "overnailer",
    "PLACEHOLDER",//"tacker",
    "autoNailgun",
    "PLACEHOLDER",//"stapler",
    "PLACEHOLDER",//"pincer",
    "PLACEHOLDER",//"pinner",
    "PLACEHOLDER",//"fang",
    "PLACEHOLDER",//"licker",
    "PLACEHOLDER",//"jolter",
    "PLACEHOLDER",//"bracer",
    "doubleNailgun",
    "PLACEHOLDER",//"binder",
    "PLACEHOLDER",//"hammer",
]
Class.octoTank.UPGRADES_TIER_4 = [
    "decaTank",
]
Class.phoenix.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"firebird",
    "PLACEHOLDER",//"birdOfPrey",
    "nymph",
    "ziz",
    "alicanto",
    "pamola",
    "aethon",
    "simurgh",
    "autoPhoenix",
    "sirin",
]
Class.quadruplex.UPGRADES_TIER_4 = [
    "autoQuadruplex",
]
Class.redistributor.UPGRADES_TIER_4 = [
    "PLACEHOLDER",//"recentralizer",
    "nymph",
    "PLACEHOLDER",//"nebulizer",
    "PLACEHOLDER",//"scope",
    "PLACEHOLDER",//"eruptor",
    "PLACEHOLDER",//"inflamer",
    "hose",
    "PLACEHOLDER",//"monobloc",
    "autoRedistributor",
    "PLACEHOLDER",//"nova",
]
Class.single.UPGRADES_TIER_4 = [
    "duo",
    "sharpshooter",
    "PLACEHOLDER",//"gadgetGun",
    "ternion",
    "coordinator",
    "PLACEHOLDER",//"bruiser",
    "PLACEHOLDER",//"tricker",
    "PLACEHOLDER",//"mono",
    "avian",
    "custodian",
    "assistant",
    "autoSingle",
]
Class.spreadshot.UPGRADES_TIER_4 = [
    "doubleSpreadshot",
    "smearer",
    "autoSpreadshot",
    "PLACEHOLDER",//"dauber",
    "PLACEHOLDER",//"ballista",
    "bozo",
    "PLACEHOLDER",//"fungus",
]
Class.tripleTwin.UPGRADES_TIER_4 = [
    "quadTwin",
    "autoTripleTwin",
    "bentTriple",
    "hewnTriple",
    "tripleFlankTwin",
    "tripleGunner",
    "tripleHelix",
    "warkwarkwark",
]
Class.triplet.UPGRADES_TIER_4 = [
    "quintuplet",
]
Class.triplex.UPGRADES_TIER_4 = [
    "doubleTriplex",
    "autoTriplex",
]



// Tier 2 (new)
Class.diesel = {
    PARENT: "genericTank",
    LABEL: "Diesel",
    DANGER: 6,
    GUNS: [
        {
            POSITION: [14, 12, 1.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.directordrive = {
    PARENT: "genericTank",
    LABEL: "Directordrive",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "overdriveDeco",
        },
    ],
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "turretedDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6
            }
        }
    ],
    UPGRADES_TIER_3: [
        "overdrive",
    ]
}
Class.doper = {
    PARENT: "genericTank",
    LABEL: "Doper",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "fastDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: [3, 3, 0.35, 11, 0, 0, 0]
        }
    ],
    UPGRADES_TIER_3: [
        "brisker",
    ]
}
Class.honcho = {
    PARENT: "genericTank",
    LABEL: "Honcho",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [{
        POSITION: [13, 13, 1.4, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.honcho]),
            TYPE: "drone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            MAX_CHILDREN: 3
        }
    }],
    UPGRADES_TIER_3: [
        "bigCheese",
    ]
}
Class.machineTrapper = {
    PARENT: "genericTank",
    LABEL: "Machine Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: [15, 9, 1.4, 0, 0, 0, 0]
        },
        {
            POSITION: [3, 13, 1.3, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ],
    UPGRADES_TIER_3: [
        "barricade",
    ]
}
Class.mech = {
    PARENT: "genericTank",
    LABEL: "Mech",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: [15, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "turretedTrap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0]
        }
    ],
    UPGRADES_TIER_3: [
        "engineer",
    ]
}
Class.pen = {
    PARENT: "genericTank",
    LABEL: "Pen",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        }
    ]
}
Class.wark = {
    PARENT: "genericTank",
    LABEL: "Wark",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: weaponMirror([
        {
            POSITION: [14, 8, 1, 0, -5.5, -5, 0]
        },
        {
            POSITION: [3, 9, 1.5, 14, -5.5, -5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]),
    UPGRADES_TIER_3: [
        "warkwark",
        "waarrk",
        "PLACEHOLDER",//"equalizer",
        "hexaTrapper",
        "PLACEHOLDER",//"hutch",
        "PLACEHOLDER",//"cog",
        "PLACEHOLDER",//"expeller",
        "bulwark",
        "PLACEHOLDER",//"coalesce",
        "autoWark",
    ]
}



// Tier 3 (new, autos)
Class.autoAuto3 = makeAuto("auto3")
Class.autoHelix = makeAuto("helix")
Class.autoHelix.UPGRADES_TIER_4 = [
    "autoTriplex",
    "autoQuadruplex",
    "autoDoubleHelix",
]
Class.autoHexaTank = makeAuto("hexaTank")
Class.autoHunter = makeAuto("hunter")
Class.autoHunter.UPGRADES_TIER_4 = [
    "tripleAutoHunter",
]
Class.autoRifle = makeAuto("rifle")
Class.autoRifle.UPGRADES_TIER_4 = [
    "tripleAutoRifle",
]
Class.autoSprayer = makeAuto("sprayer")
Class.autoSprayer.UPGRADES_TIER_4 = [
    "megaAutoSprayer",
    "tripleAutoSprayer",
    "autoRedistributor",
    "autoPhoenix",
    "autoAtomizer",
    "autoFocal",
    "autoFrother",
    "autoFoamer",
    "autoFaucet",
    "autoShower",
    "autoStormer",
]
Class.autoTripleShot = makeAuto("tripleShot")
Class.autoTripleShot.UPGRADES_TIER_4 = [
    "tripleAutoTripleShot",
]
Class.autoWark = makeAuto("wark")
Class.megaAutoTrapper = makeAuto("trapper", "Mega Auto-Trapper", megaAutoOptions)
Class.tripleAutoTrapper = makeTripleAuto("trapper", "Triple Auto-Trapper")



// Tier 3 (new, birds)
Class.defect = makeBird("tripleShot", "Defect")



// Tier 3 (new, hybrids)
Class.hitman = makeOver("assassin", "Hitman", hybridTankOptions)
Class.shower = makeOver("sprayer", "Shower", hybridTankOptions)
Class.shower.UPGRADES_TIER_4 = [
    "oversprayer",
    "PLACEHOLDER",//"cleaner",
    "PLACEHOLDER",//"showerdrive",
    "PLACEHOLDER",//"extinguisher",
    "hose",
    "sprinkler",
    "pressureWasher",
    "abberation",
    "gusher",
    "raincloud",
    "autoShower",
    "drain",
]



// Tier 3 (new, radials)



// Tier 3 (new, rear gunners)
Class.blower = makeRearGunner("destroyer", "Blower")
Class.buttbuttin = makeRearGunner("assassin", "Buttbuttin")



// Tier 3 (new, everything else)
Class.battery = {
    PARENT: "genericTank",
    LABEL: "Battery",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }], 0.2),
        {
            POSITION: [20, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.bentGunner = {
    PARENT: "genericTank",
    LABEL: "Bent Gunner",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: [8.5, 3.5, 1, 2, 8, 20, 4/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 3.5, 1, 2, 5, 17.5, 2/6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet",
            },
        }
    ], 1/6)
}
Class.bentMinigun = {
    PARENT: "genericTank",
    LABEL: "Bent Minigun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: [17, 8, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 8, 1, 0, 2, 15, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.minigun]),
                TYPE: "bullet"
            }
        }], 0),
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.minigun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.minigun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.minigun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.bonker = {
    PARENT: "genericSmasher",
    LABEL: "Bonker",
    SIZE: 8.5,
    BODY: {
        FOV: 1.2 * base.FOV,
        HEALTH: 0.95 * base.HEALTH,
        SPEED: 1.1 * base.SPEED,
    },
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        }
    ]
}
Class.brisker = {
    PARENT: "genericTank",
    LABEL: "Brisker",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "fasterDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: [4, 2, 0.35, 11, 0, 0, 0]
        }
    ],
    UPGRADES_TIER_4: [
        "adderall",
    ]
}
Class.combo = {
    PARENT: "genericTank",
    LABEL: "Combo",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3),
    TURRETS: weaponArray([
        {
            POSITION: [11, 8, 0, 60, 190, 0],
            TYPE: "autoTankGun",
            INDEPENDENT: true,
        },
    ], 3)
}
Class.deathStar = {
    PARENT: "genericTank",
    LABEL: "Death Star",
    DANGER: 7,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
                ANGLE: 180,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.doubleFlankTwin = {
    PARENT: "genericTank",
    LABEL: "Double Flank Twin",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: [20, 8, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                TYPE: "bullet"
            }
        })
    ], 2),
    UPGRADES_TIER_4: [
        "quadTwin",
        "tripleFlankTwin",
        "PLACEHOLDER",//"hewnFlankDouble",
        "autoDoubleFlankTwin",
        "bentFlankDouble",
        "PLACEHOLDER",//"doubleFlankGunner",
        "PLACEHOLDER",//"doubleFlankHelix",
        "PLACEHOLDER",//"hipwatch",
        "PLACEHOLDER",//"scuffler",
        "PLACEHOLDER",//"warkwawawark",
    ]
}
Class.doubleGunner = {
    PARENT: "genericTank",
    LABEL: "Double Gunner",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 0.25), 2),
    UPGRADES_TIER_4: [
        "tripleGunner",
        "PLACEHOLDER",//"hewnGunner",
        "autoDoubleGunner",
        "PLACEHOLDER",//"bentDoubleGunner",
        "PLACEHOLDER",//"doubleFlankGunner",
        "doubleNailgun",
        "doubleMachineGunner",
        "overdoubleGunner",
        "doubleBattery",
        "PLACEHOLDER",//"doubleRimfire",
        "PLACEHOLDER",//"doubleVolley",
        "PLACEHOLDER",//"doubleEqualizer",
    ]
}
Class.doubleHelix = {
    PARENT: "genericTank",
    LABEL: "Double Helix",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: [20, 6, -4/3, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [20, 6, -4/3, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: [3.625, 7.5, 2.75, 5.75, -6.75, 90, 0],
        }),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        },
    ], 2),
    UPGRADES_TIER_4: [
        "tripleHelix",
        "hewnHelix",
        "autoDoubleHelix",
        "doubleTriplex",
    ]
}
Class.doubleSpreadshot = {
    PARENT: "genericTank",
    LABEL: "Double Spreadshot",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror([/*{
            POSITION: [13, 4, 1, 0, 0.5, 75, 5 / 6], //5/6
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.doubleTwin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },*/
        {
            POSITION: [14.5, 4, 1, 0, 0.5, 60, 0.8], //4/6
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.doubleTwin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, 0.5, 45, 0.6], //3/6
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.doubleTwin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, 0.5, 30, 0.4], //2/6
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.doubleTwin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, 1, 15, 0.2], //1/6
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.doubleTwin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        }], 0),
        {
            POSITION: [12, 8, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.faucet = {
    PARENT: "genericTank",
    LABEL: "Faucet",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: [7, 7.5, 0.6, 7, 1.5, 25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }),
        {
            POSITION: [23, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ],
    UPGRADES_TIER_4: [
        "PLACEHOLDER",//"pipe",
        "PLACEHOLDER",//"faucetdrive",
        "PLACEHOLDER",//"plumber",
        "PLACEHOLDER",//"monobloc",
        "simurgh",
        "PLACEHOLDER",//"leak",
        "PLACEHOLDER",//"tap",
        "PLACEHOLDER",//"stream",
        "PLACEHOLDER",//"pourer",
        "raincloud",
        "autoFaucet",
        "PLACEHOLDER",//"sink",
    ]
}
Class.foamer = {
    PARENT: "genericTank",
    LABEL: "Foamer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [25, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 12, 1.6, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.diesel]),
                TYPE: "bullet",
            },
        }
    ],
    UPGRADES_TIER_4: [
        "PLACEHOLDER",//"splasher",
        "PLACEHOLDER",//"inflamer",
        "aethon",
        "PLACEHOLDER",//"bubbler",
        "PLACEHOLDER",//"bucket",
        "PLACEHOLDER",//"waterfall",
        "PLACEHOLDER",//"pourer",
        "gusher",
        "autoFoamer",
        "PLACEHOLDER",//"whirlpool",
    ]
}
Class.frother = {
    PARENT: "genericTank",
    LABEL: "Frother",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: [3, 7, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, { health: 0.6, damage: 0.6, pen: 0.8, maxSpeed: 0.7, density: 0.3, size: 0.4 }]),
                TYPE: "trap"
            },
        },
        {
            POSITION: [15, 9, 1.4, 0, 0, 0, 0]
        },
        {
            POSITION: [3, 13, 1.3, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ],
    UPGRADES_TIER_4: [
        "PLACEHOLDER",//"frotherGuard",
        "PLACEHOLDER",//"paintbrush",
        "PLACEHOLDER",//"emissary",
        "triFrother",
        "PLACEHOLDER",//"ejector",
        "PLACEHOLDER",//"eruptor",
        "pamola",
        "PLACEHOLDER",//"spewer",
        "PLACEHOLDER",//"negentropy",
        "PLACEHOLDER",//"waterfall",
        "abberation",
        "PLACEHOLDER",//"stream",
        "autoFrother",
        "PLACEHOLDER",//"overflower",
    ]
}
Class.megaTrapper.UPGRADES_TIER_4 = [
    "autoMegaTrapper",
]
Class.mingler = {
    PARENT: "genericTank",
    LABEL: "Mingler",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: [15, 3.5, 1, 0, 0, 30, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 6, 0.5)
}
Class.recharger = {
    PARENT: "genericTank",
    LABEL: "Recharger",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        ...weaponMirror({
            POSITION: [15, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: [20, 13, 0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.pounder]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [5, 10, 2.125, 1, -6.375, 90, 0],
        })
    ]
}
Class.rimfire = {
    PARENT: "genericTank",
    LABEL: "Rimfire",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [12, 3.5, 1, 0, 7, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 2, 1, 0, 2.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 10, 1, 0, 0, 0, 0]
        }
    ]
}
Class.splitShot = {
    PARENT: "genericTank",
    LABEL: "Split Shot",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9
    },
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 8, 1, 0, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 0),
        ...weaponMirror({
            POSITION: [20, 4, 1, 0, -0.5, 17.5, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.pelleter, g.artillery]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.stormer = {
    PARENT: "genericTank",
    LABEL: "Stormer",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: [30, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        }),
        {
            POSITION: [24, 10, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ],
    UPGRADES_TIER_4: [
        "PLACEHOLDER",//"windstorm",
        "PLACEHOLDER",//"hailstorm",
        "PLACEHOLDER",//"derecho",
        "PLACEHOLDER",//"nova",
        "sirin",
        "PLACEHOLDER",//"typhoon",
        "PLACEHOLDER",//"leafBlower",
        "PLACEHOLDER",//"overflower",
        "PLACEHOLDER",//"whirlpool",
        "PLACEHOLDER",//"sink",
        "drain",
        "autoStormer",
    ]
}
Class.quadAngle = {
    PARENT: "genericTank",
    LABEL: "Quad-Angle",
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    },
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: "autoTankGun",
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: "autoTankGun",
        },
    ],
    GUNS: weaponMirror({
        POSITION: [16, 8, 1, 0, 0, 150, 0.1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: "bullet",
            LABEL: "thruster"
        }
    }, 0)
}
Class.waarrk = {
    PARENT: "genericTank",
    LABEL: "Waarrk",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: [16, 8, 1, 0, 2, 17.5, 0.5],
        },
        {
            POSITION: [3.5, 9, 1.6, 16, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        }], 2),
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.5, 9, 1.6, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        }
    ]
}
Class.warkwark = {
    PARENT: "genericTank",
    LABEL: "Warkwark",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [14, 8, 1, 0, -5.5, -5, 0]
        },
        {
            POSITION: [3, 9, 1.5, 14, -5.5, -5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]), 2),
    UPGRADES_TIER_4: [
        "warkwarkwark",
        "PLACEHOLDER",//"warkwawarkrk",
        "autoWarkwark",
        "waarrkwaarrk",
        "PLACEHOLDER",//"warkwawawark",
        "PLACEHOLDER",//"doubleEqualizer",
        "PLACEHOLDER",//"guardrail",
        "PLACEHOLDER",//"sealer",
        "PLACEHOLDER",//"setup",
    ]
}



// Tier 4 (new, autos)
Class.autoAtomizer = makeAuto("atomizer")
Class.autoBentDouble = makeAuto("bentDouble")
Class.autoCyclone = makeAuto("cyclone")
Class.autoDoubleFlankTwin = makeAuto("doubleFlankTwin")
Class.autoDoubleGunner = makeAuto("doubleGunner")
Class.autoDoubleHelix = makeAuto("doubleHelix")
Class.autoFaucet = makeAuto("faucet")
Class.autoFoamer = makeAuto("foamer")
Class.autoFocal = makeAuto("focal")
Class.autoFrother = makeAuto("frother")
Class.autoHewnDouble = makeAuto("hewnDouble")
Class.autoMegaTrapper = makeAuto("megaTrapper")
Class.autoNailgun = makeAuto("nailgun")
Class.autoOctoTank = makeAuto("octoTank")
Class.autoOvertrapper = makeAuto("overtrapper")
Class.autoPhoenix = makeAuto("phoenix")
Class.autoQuadruplex = makeAuto("quadruplex")
Class.autoRedistributor = makeAuto("redistributor")
Class.autoShower = makeAuto("shower")
Class.autoSingle = makeAuto("single")
Class.autoSpreadshot = makeAuto("spreadshot")
Class.autoStormer = makeAuto("stormer")
Class.autoTrapGuard = makeAuto("trapGuard")
Class.autoTripleTwin = makeAuto("tripleTwin")
Class.autoTriplex = makeAuto("triplex")
Class.autoWarkwark = makeAuto("warkwark")
Class.megaAutoDouble = makeAuto("doubleTwin", "Mega Auto-Double", megaAutoOptions)
Class.megaAutoSprayer = makeAuto("sprayer", "Mega Auto-Sprayer", megaAutoOptions)
Class.tripleAutoDouble = makeTripleAuto("doubleTwin", "Triple Auto-Double")
Class.tripleAutoHunter = makeTripleAuto("hunter")
Class.tripleAutoTripleShot = makeTripleAuto("tripleShot")
Class.tripleAutoRifle = makeTripleAuto("rifle")
Class.tripleAutoSprayer = makeTripleAuto("sprayer")



// Tier 4 (new, birds)
Class.aethon = makeBird("foamer", "Aethon")
Class.alicanto = makeBird("focal", "Alicanto")
Class.avian = makeBird("single", "Avian")
Class.bozo = makeBird("spreadshot", "Bozo")
Class.nymph = makeBird("redistributor", "Nymph")
Class.pamola = makeBird("frother", "Pamola")
Class.simurgh = makeBird("faucet", "Simurgh")
Class.sirin = makeBird("stormer", "Sirin")
Class.ziz = makeBird("atomizer", "Ziz")



// Tier 4 (new, guards)
Class.custodian = makeGuard("single", "Custodian")



// Tier 4 (new, hybrids)
Class.abberation = makeOver("frother", "Abberation", hybridTankOptions)
Class.assistant = makeOver("single", "Assistant", hybridTankOptions)
Class.drain = makeOver("stormer", "Drain", hybridTankOptions)
Class.flexedHybrid = makeOver("pentaShot", "Flexed Hybrid", hybridTankOptions)
Class.gusher = makeOver("foamer", "Gusher", hybridTankOptions)
Class.hose = makeOver("redistributor", "Hose", hybridTankOptions)
Class.pressureWasher = makeOver("focal", "Pressure Washer", hybridTankOptions)
Class.raincloud = makeOver("faucet", "Raincloud", hybridTankOptions)
Class.smearer = makeOver("spreadshot", "Smearer", hybridTankOptions)
Class.sprinkler = makeOver("atomizer", "Sprinkler", hybridTankOptions)
Class.triprid = makeOver("triplet", "Triprid", hybridTankOptions)



// Tier 4 (new, overs)
Class.overangle = makeOver("triAngle", "Overangle", {angle: 90})
Class.overartillery = makeOver("artillery")
Class.overassassin = makeOver("assassin")
Class.overbuilder = makeOver("builder")
Class.overdestroyer = makeOver("destroyer")
Class.overdiesel = makeOver("diesel")
Class.overdoubleGunner = makeOver({
    PARENT: "genericTank",
    DANGER: 7,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0]
        }
    ], 2)
}, "Overdouble Gunner", {angle: 90})
Class.overdoubleTwin = makeOver("doubleTwin", "Overdouble Twin", {angle: 90})
Class.overhunter = makeOver("hunter")
Class.overmach = makeOver("machineTrapper", "Overmach")
Class.overmech = makeOver("mech")
Class.overminigun = makeOver("minigun")
Class.overnailer = makeOver("nailgun", "Overnailer")
Class.overpen = makeOver("pen")
Class.overrifle = makeOver("rifle")
Class.overshot = makeOver("tripleShot", "Overshot")
Class.oversprayer = makeOver("sprayer")
Class.overtrapGuard = makeOver("trapGuard", "Overtrap Guard", {angle: 90})
Class.overwark = makeOver("wark")



// Tier 4 (new, everything else)
Class.adderall = { 
    PARENT: "genericTank",
    LABEL: "Adderall",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "fastestDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: [5, 1, 0.35, 11, 0, 0, 0]
        }
    ]
}
Class.bentFlankDouble = {
    PARENT: "genericTank",
    LABEL: "Bent Flank Double",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: [20, 8, 1, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: [19, 8, 1, 0, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.bentTriple = {
    PARENT: "genericTank",
    LABEL: "Bent Triple",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.cleft = {
    PARENT: "genericTank",
    LABEL: "Cleft",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }
    ]), 2)
}
Class.coordinator = {
    PARENT: "genericTank",
    LABEL: "Coordinator",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 9, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.single]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: [6.5, 13, -1.3, 5.5, 0, 0, 0]
        }
    ]
}
Class.dam = {
    PARENT: "genericTank",
    LABEL: "Dam",
    STAT_NAMES: statnames.mixed,
    DANGER: 8,
    GUNS: weaponMirror([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 8, 1, 0, 5.5, 185, 0],
        },
        {
            POSITION: [3, 9, 1.5, 14, 5.5, 185, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ])
}
Class.decaTank = {
    PARENT: "genericTank",
    LABEL: "Deca Tank",
    DANGER: 8,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: [18, 8, 1, 0, 0, 36, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        }
    ], 5)
}
Class.doubleBattery = {
    PARENT: "genericTank",
    LABEL: "Double Battery",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror([{
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        }], 0.2),
        {
            POSITION: [20, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleDual = {
    PARENT: "genericTank",
    LABEL: "Double Dual",
    DANGER: 8,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [18, 7, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.dual, g.lowPower]),
                TYPE: "bullet",
                LABEL: "Small"
            }
        },
        {
            POSITION: [16, 8.5, 1, 0, 5.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.dual]),
                TYPE: "bullet"
            }
        }
    ]), 2)
}
Class.doubleMusket = {
    PARENT: "genericTank",
    LABEL: "Double Musket",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: weaponArray([
        {
            POSITION: [16, 19, 1, 0, 0, 0, 0]
        },
        ...weaponMirror({
            POSITION: [18, 7, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, g.doubleTwin]),
                TYPE: "bullet"
            }
        })
    ], 2)
}
Class.doubleMachineGunner = {
    PARENT: "genericTank",
    LABEL: "Double Machine Gunner",
    DANGER: 8,
    BODY: {
        SPEED: 0.9 * base.SPEED
    },
    GUNS: weaponArray([
        ...weaponMirror([{
            POSITION: [14, 3, 4, -3, 5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, g.doubleTwin]),
                TYPE: "bullet"
            }
        }], 0.2),
        {
            POSITION: [14, 3, 4, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleNailgun = {
    PARENT: "genericTank",
    LABEL: "Double Nailgun",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9,
    },
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.doubleTwin]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0]
        }
    ], 2)
}
Class.doubleTriplet = {
    PARENT: "genericTank",
    DANGER: 8,
    LABEL: "Double Triplet",
    BODY: {
        FOV: 1.05 * base.FOV
    },
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: [18, 10, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.doubleTwin]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: [21, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleTriplex = {
    PARENT: "genericTank",
    LABEL: "Double Triplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: [18, 7, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 7, -4/3, 0, 0, 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [18, 7, -4/3, 0, 0, -45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: [3.75, 10, 2.125, 1, 4.25, -10, 0]
        },
        {
            POSITION: [5, 6, 0.5, 10.5, 0, 22.5, 0]
        }])
    ], 2)
}
Class.duo = {
    PARENT: "genericTank",
    DANGER: 8,
    LABEL: "Duo",
    GUNS: [
        ...weaponMirror({
            POSITION: [20, 8, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: [12, 20, 0.9, 0, 0, 0, 0]
        }
    ]
}
Class.hewnHelix = {
    PARENT: "genericTank",
    LABEL: "Hewn Helix",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [18, 7, -4/3, 0, 0, 45+180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [18, 7, -4/3, 0, 0, -45+180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 1, 4.25, -10+180, 0]
        }),
        ...weaponArray([{
            POSITION: [20, 6, -4/3, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [20, 6, -4/3, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: [3.625, 7.5, 2.75, 5.75, -6.75, 90, 0],
        }),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        }], 2)
    ]
}
Class.hewnTriple = {
    PARENT: "genericTank",
    LABEL: "Hewn Triple",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 8, 1, 0, -5.5, -25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }),
        ...weaponArray(weaponMirror({
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }), 3)
    ]
}
Class.pentaDouble = {
    PARENT: "genericTank",
    LABEL: "Penta Double",
    DANGER: 8,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: weaponArray([
        ...weaponMirror([{
            POSITION: [16, 8, 1, 0, 3, 30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }], 0),
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.quadTwin = {
    PARENT: "genericTank",
    LABEL: "Quad Twin",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror({
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
            TYPE: "bullet"
        }
    }), 4)
}
Class.scatterer = {
    PARENT: "genericTank",
    LABEL: "Scatterer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 11, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sharpshooter = {
    PARENT: "genericTank",
    LABEL: "Sharpshooter",
    DANGER: 8,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: [25, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }
    ]
}
Class.skewnDouble = {
    PARENT: "genericTank",
    LABEL: "Skewn Double",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: [17, 8, 1, 0, -5.5, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }),
        ...weaponMirror({
            POSITION: [19, 8, 1, 0, -5.5, 155, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }),
        ...weaponArray(weaponMirror({
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }), 2)
    ]
}
Class.ternion = {
    PARENT: "genericTank",
    LABEL: "Ternion",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }
    ], 3)
}
Class.triFrother = {
    PARENT: "genericTank",
    LABEL: "Tri-Frother",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: [3, 7, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, g.machineGun, { health: 0.6, damage: 0.6, pen: 0.8, maxSpeed: 0.7, density: 0.3, size: 0.4 }]),
                TYPE: "trap"
            },
        },
        {
            POSITION: [15, 9, 1.4, 0, 0, 0, 0]
        },
        {
            POSITION: [3, 13, 1.3, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 3)
}
Class.tripleFlankTwin = {
    PARENT: "genericTank",
    LABEL: "Triple Flank Twin",
    DANGER: 8,
    GUNS: [
        ...weaponArray({
            POSITION: [20, 8, 1, 0, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }, 3),
        ...weaponArray(weaponMirror({
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        }), 3)
    ]
}
Class.tripleGunner = {
    PARENT: "genericTank",
    LABEL: "Triple Gunner",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 0.25), 3)
}
Class.tripleHelix = {
    PARENT: "genericTank",
    LABEL: "Triple Helix",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: [20, 6, -4/3, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [20, 6, -4/3, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: [3.625, 7.5, 2.75, 5.75, -6.75, 90, 0],
        }),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        },
    ], 3)
}
Class.waarrkwaarrk = {
    PARENT: "genericTank",
    LABEL: "Waarrkwaarrk",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror([{
            POSITION: [16, 8, 1, 0, 2, 17.5, 0.5],
        },
        {
            POSITION: [3.5, 9, 1.6, 16, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        }], 2),
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3.5, 9, 1.6, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        }
    ], 2)
}
Class.warkwarkwark = {
    PARENT: "genericTank",
    LABEL: "Warkwarkwark",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: [14, 8, 1, 0, -5.5, -5, 0]
        },
        {
            POSITION: [3, 9, 1.5, 14, -5.5, -5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.spam, g.doubleTwin, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]), 3)
}
