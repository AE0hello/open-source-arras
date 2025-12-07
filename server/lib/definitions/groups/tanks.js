const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, weaponMirror, makeTurret } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
require('./generics.js')
const g = require('../gunvals.js')

// Presets
const hybridTankOptions = {count: 1, independent: true, cycle: false}

// Basic Tank
Class.basic = {
    PARENT: "genericTank",
    LABEL: "Basic",
    DANGER: 4,
    BODY: {
        ACCELERATION: base.ACCEL * 1,
        SPEED: base.SPEED * 1,
        HEALTH: base.HEALTH * 1,
        DAMAGE: base.DAMAGE * 1,
        PENETRATION: base.PENETRATION * 1,
        SHIELD: base.SHIELD * 1,
        REGEN: base.REGEN * 1,
        FOV: base.FOV * 1,
        DENSITY: base.DENSITY * 1,
        PUSHABILITY: 1,
        HETERO: 3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ASPECT: 1,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet",
                COLOR: 16,
                LABEL: "",
                STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                NEGATIVE_RECOIL: false
            }
        }
    ],
    UPGRADES_TIER_3: []
}

// Tier 1
Class.desmos = {
    PARENT: "genericTank",
    LABEL: "Desmos",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 1.5, -6.25, 90, 0]
        })
    ]
}
Class.director = {
    PARENT: "genericTank",
    LABEL: "Director",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 7
            },
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}
Class.flail = {
    PARENT: "genericFlail",
    LABEL: "Flail",
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }],
    UPGRADES_TIER_2: [
        "doubleFlail",
        "mace",
        "flangle",
    ]
}
Class.flankGuard = {
    PARENT: "genericTank",
    LABEL: "Flank Guard",
    BODY: {
        SPEED: 1.1 * base.SPEED
    },
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 18,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3)
}
Class.machineGun = {
    PARENT: "genericTank",
    LABEL: "Machine Gun",
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
                TYPE: "bullet"
            }
        }
    ]
}
Class.pounder = {
    PARENT: "genericTank",
    LABEL: "Pounder",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sniper = {
    PARENT: "genericTank",
    LABEL: "Sniper",
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.trapper = {
    PARENT: "genericTank",
    LABEL: "Trapper",
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.twin = {
    PARENT: "genericTank",
    LABEL: "Twin",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: "bullet"
        }
    })
}
Class.whirlwind = {
    PARENT: "genericTank",
    LABEL: "Whirlwind",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "whirlwindDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 60}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })(),
    UPGRADES_TIER_2: [
        "tornado",
        "hurricane",
    ],
    UPGRADES_TIER_3: [
        "hexaWhirl",
        "munition",
        "whirl3",
        "whirlGuard",
        "prophet",
        "vortex",
    ]
}
Class.whirlwind_bent = {
    PARENT: "genericTank",
    LABEL: "Whirlwind",
    UPGRADE_LABEL: "Bent Whirlwind",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 4.5,
                ANGLE: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: "satelliteBullet",
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                ASPECT: -1.5,
                Y: 4.5,
                ANGLE: 15
            }
        }
    ]),
    UPGRADES_TIER_2: [
        "maelstrom_bent",
        "hurricane_bent",
        "monsoon_bent",
        "typhoon_bent",
        "tempest_bent",
    ]
}

// Tier 2
Class.artillery = {
    PARENT: "genericTank",
    LABEL: "Artillery",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.assassin = {
    PARENT: "genericTank",
    DANGER: 6,
    LABEL: "Assassin",
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV
    },
    GUNS: [
        {
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0]
        }
    ]
}
Class.auto3 = makeRadialAuto("autoTankGun", {isTurret: true, danger: 6, label: "Auto-3"})
Class.autoTrapper = makeAuto("trapper")
Class.autoTrapper.UPGRADES_TIER_3 = ["autoBuilder", "hexaTrapper"]
Class.builder = {
    PARENT: "genericTank",
    LABEL: "Builder",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
Class.cruiser = {
    PARENT: "genericTank",
    LABEL: "Cruiser",
    DANGER: 6,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: 1.2 * base.FOV,
    },
    GUNS: weaponMirror({
        POSITION: [7, 7.5, 0.6, 7, 4, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm"
        }
    })
}
Class.destroyer = {
    PARENT: "genericTank",
    LABEL: "Destroyer",
    DANGER: 6,
    GUNS: [
        {
            POSITION: [21, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.doubleFlail = {
    PARENT: "genericFlail",
    LABEL: "Double Flail",
    DANGER: 6,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }, {
        POSITION: [6, 10, 0, 180, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }],
    UPGRADES_TIER_3: [
        "tripleFlail",
    ]
}
Class.doubleTwin = {
    PARENT: "genericTank",
    LABEL: "Double Twin",
    DANGER: 6,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
            TYPE: "bullet"
        }
    }), 2)
}
Class.flangle = {
    PARENT: "genericFlail",
    LABEL: "Flangle",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror({
        POSITION: [16, 8, 1, 0, 0, 150, 0.1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: "bullet",
            LABEL: "thruster"
        }
    }, 0),
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }],
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
    UPGRADES_TIER_3: [
        "flooster",
        "flace",
    ]
}
Class.gunner = {
    PARENT: "genericTank",
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: weaponMirror([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
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
        }
    ], 0.25)
}
Class.healer = {
    PARENT: "genericTank",
    LABEL: "Healer",
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    STAT_NAMES: statnames.heal,
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 9,
                ASPECT: -0.5,
                X: 12.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ],
    UPGRADES_TIER_3: [
        "medic",
        "ambulance",
        "surgeon",
        "paramedic",
    ]
}
Class.helix = {
    PARENT: "genericTank",
    LABEL: "Helix",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [20, 6, -4/3, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [20, 6, -4/3, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: [3.625, 7.5, 2.75, 5.75, -6.75, 90, 0],
        }),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        },
    ],
}
Class.hexaTank = {
    PARENT: "genericTank",
    LABEL: "Hexa Tank",
    DANGER: 6,
    GUNS: weaponArray({
        POSITION: [18, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 6, 0.5)
}
Class.hunter = {
    PARENT: "genericTank",
    LABEL: "Hunter",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.hurricane = {
    PARENT: "genericTank",
    LABEL: "Hurricane",
    DANGER: 6,
    ANGLE: 45,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "hurricaneDeco",
        },
    ],
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 8; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 45}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })(),
    UPGRADES_TIER_3: [
        "typhoon",
        "blizzard",
    ]
}
Class.hurricane_bent = {
    PARENT: "genericTank",
    LABEL: "Hurricane",
    GUNS: weaponArray([{
        POSITION: {
            LENGTH: 15,
            WIDTH: 8,
            ANGLE: 45
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin]),
            TYPE: "satelliteBullet",
            INDEPENDENT_MASTER: true,
        }
    },
    {
        POSITION: {
            LENGTH: 16,
            WIDTH: 4,
            ASPECT: -1.5,
            ANGLE: 45
        }
    }], 4)
}
Class.launcher = {
    PARENT: "genericTank",
    LABEL: "Launcher",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 9, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: "minimissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.mace = {
    PARENT: "genericFlail",
    LABEL: "Mace",
    DANGER: 6,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["maceBolt3", {
            INDEPENDENT: true
        }]
    }],
    UPGRADES_TIER_3: [
        "bigMama",
        "itHurtsDontTouchIt",
        "flace",
    ]
}
Class.maelstrom_bent = {
    PARENT: "genericTank",
    LABEL: "Maelstrom",
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "satelliteBullet",
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                ASPECT: -1.5,
                ANGLE: 45
            }
        }], 0),
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "satelliteBullet",
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 4,
                ASPECT: -1.5
            }
        }
    ]
}
Class.marksman = {
    PARENT: "genericTank",
    LABEL: "Marksman",
    DANGER: 6,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 13
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.marksman]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.minigun = {
    PARENT: "genericTank",
    LABEL: "Minigun",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.monsoon_bent = {
    PARENT: "genericTank",
    LABEL: "Monsoon",
    STAT_NAMES: statnames.trap,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 2,
                ANGLE: 30
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 8,
                ASPECT: 1.25,
                X: 14,
                Y: 2,
                ANGLE: 30
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "satelliteTrap",
                STAT_CALCULATOR: "trap",
                INDEPENDENT_MASTER: true
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 4,
                ASPECT: -1.5,
                Y: 2,
                ANGLE: 30
            }
        }
    ])
}
Class.overseer = {
    PARENT: "genericTank",
    LABEL: "Overseer",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    MAX_CHILDREN: 8,
    GUNS: weaponArray({
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "drone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true
        }
    }, 2)
}
Class.repeater = {
    PARENT: "genericTank",
    LABEL: "Repeater",
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror([{
            POSITION: [4.625, 9.5, 2, 0.375, -8, 91.5, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, 0, -4.75, 50, 0]
        }])
    ],
    UPGRADES_TIER_3: [
        "iterator",
        "duplicator",
    ]
}
Class.rifle = {
    PARENT: "genericTank",
    LABEL: "Rifle",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: [20, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.smasher = {
    PARENT: "genericSmasher",
    LABEL: "Smasher",
    DANGER: 6,
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        }
    ]
}
Class.spawner = {
    PARENT: "genericTank",
    LABEL: "Spawner",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ],
}
Class.spiral = {
    PARENT: "genericTank",
    LABEL: "Spiral",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [17, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [4.25, 11, 2, 2.25, -4.25, 92.5, 0]
        })
    ],
}
Class.sprayer = {
    PARENT: "genericTank",
    LABEL: "Sprayer",
    DANGER: 6,
    GUNS: [
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
    ]
}
Class.tempest_bent = {
    PARENT: "genericTank",
    LABEL: "Tempest",
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }]), // guess, if it turns out to use satelliteDrones i'll change it
                TYPE: "satelliteBullet",
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 6,
                ASPECT: -2
            }
        }
    ]
}
Class.tornado = {
    PARENT: "genericTank",
    LABEL: "Tornado",
    DANGER: 6,
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco",
        },
    ],
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 12, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })(),
    UPGRADES_TIER_3: [
        "megaTornado",
        "tempest",
        "thunderbolt",
    ]
}
Class.trapGuard = makeGuard({
    PARENT: "genericTank",
    LABEL: "Trap",
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ]
})
Class.triAngle = {
    PARENT: "genericTank",
    LABEL: "Tri-Angle",
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    },
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }, 0)
    ]
}
Class.triTrapper = {
    PARENT: "genericTank",
    LABEL: "Tri-Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 3)
}
Class.tripleShot = {
    PARENT: "genericTank",
    LABEL: "Triple Shot",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.9
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 17.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.typhoon_bent = {
    PARENT: "genericTank",
    LABEL: "Typhoon",
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "satelliteBullet",
                INDEPENDENT_MASTER: true,
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ASPECT: -1.5
            }
        }
    ]
}
Class.underseer = {
    PARENT: "genericTank",
    LABEL: "Underseer",
    DANGER: 6,
    NECRO: true,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 14,
    GUNS: weaponArray({
        POSITION: [5.25, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: "sunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
        }
    }, 2)
}
Class.undertow = {
    PARENT: "genericTank",
    LABEL: "Undertow",
    DANGER: 6,
    GUNS: [
        {
           POSITION: [14, 12, 0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { size: 0.8, reload: 1.2 }]),
                TYPE: 'undertowBullet'
            }
        },
        ...weaponMirror({
            POSITION: [11.25, 8, 0.15, 4.25, 4, 13.5, 0]
        })
    ],
    UPGRADES_TIER_3: [
        //"riptide",
    ]
}
Class.volute = {
    PARENT: "genericTank",
    LABEL: "Volute",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    GUNS: [
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
    ],
    UPGRADES_TIER_3: [
        "sidewinder",
    ]
}
Class.whirlwind_old = {
    PARENT: "genericTank",
    LABEL: "Whirlwind",
    UPGRADE_LABEL: "Whirlwind (old)",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: "genericEntity"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite_old", {ANGLE: i * 60}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })(),
    UPGRADES_TIER_3: [
        "monsoon",
        "maelstrom",
        "tornado_old",
        "typhoon_old",
        "vortex_old",
    ]
}

// Tier 3
Class.ambulance = {
    PARENT: "genericTank",
    LABEL: "Ambulance",
    STAT_NAMES: statnames.heal,
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    BODY: {
        HEALTH: base.HEALTH * 0.8,
        SHIELD: base.SHIELD * 0.8,
        DENSITY: base.DENSITY * 0.6,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }, g.healer]),
                TYPE: "healerBullet",
                LABEL: "Front",
            },
        },
        ...weaponMirror({
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }, 0)
    ],
}
Class.annihilator = {
    PARENT: "genericTank",
    LABEL: "Annihilator",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.armsman = makeOver("rifle", "Armsman", hybridTankOptions)
Class.architect = makeRadialAuto("architectGun", {isTurret: true, danger: 7, size: 12, label: "Architect", body: {SPEED: 1.1 * base.SPEED}})
Class.assembler = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: 'Assembler',
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'assemblerTrap',
                NO_LIMITATIONS: true,
                MAX_CHILDREN: 8,
                STAT_CALCULATOR: "block",
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [2.5, 14, 0, 0,    360, 1],
            TYPE: 'assemblerDot'
        }
    ]
}
Class.atomizer = {
    PARENT: "genericTank",
    LABEL: "Atomizer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [5, 7.5, 1.3, 18.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.auto4 = makeRadialAuto("auto4gun", {isTurret: true, danger: 7, size: 13, x: 6, angle: 45, label: "Auto-4", count: 4})
Class.auto4_old = makeRadialAuto("auto4gun", {isTurret: true, danger: 7, size: 13, x: 6, label: "Gunner-3", count: 3})
Class.auto5 = makeRadialAuto("autoTankGun", {isTurret: true, danger: 7, label: "Auto-5", count: 5})
Class.autoAssassin = makeAuto("assassin")
Class.autoBuilder = makeAuto("builder")
Class.autoCruiser = makeAuto("cruiser")
Class.autoDouble = makeAuto("doubleTwin", "Auto-Double")
Class.autoGunner = makeAuto("gunner")
Class.autoOverseer = makeAuto("overseer")
Class.autoSmasher = makeAuto({
    PARENT: "genericSmasher",
    DANGER: 6,
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        }
    ],
    SKILL_CAP: {
        RELOAD: smshskl,
        PENETRATION: smshskl,
        BULLET_HEALTH: smshskl,
        BULLET_DAMAGE: smshskl,
        BULLET_SPEED: smshskl,
        SHIELD_CAPACITY: smshskl,
        BODY_DAMAGE: smshskl,
        MAX_HEALTH: smshskl,
        SHIELD_REGENERATION: smshskl,
        MOVEMENT_SPEED: smshskl
    },
}, "Auto-Smasher", {type: "autoSmasherTurret", size: 11})
Class.autoSpawner = makeAuto("spawner")
Class.autoTriAngle = makeAuto("triAngle")
Class.banshee = makeRadialAuto("bansheegun", {isTurret: true, danger: 7, size: 10, arc: 80, label: "Banshee", body: {SPEED: 0.8 * base.SPEED, FOV: 1.1 * base.FOV}})
Class.banshee.GUNS = weaponArray({
    POSITION: [6, 11, 1.2, 8, 0, 60, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2,
    },
}, 3)
Class.barricade = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Barricade",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15,
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.battleship = {
    PARENT: "genericTank",
    LABEL: "Battleship",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponMirror({
            POSITION: [7, 7.5, 0.6, 7, 4, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
            }
        }),
        ...weaponMirror({
            POSITION: [7, 7.5, 0.6, 7, 4, 270, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Autonomous"
            }
        })
    ]
}
Class.beekeeper = {
    PARENT: "genericTank",
    LABEL: "Beekeeper",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: [14, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        }),
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
Class.bender = {
    PARENT: "genericTank",
    LABEL: "Bender",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4, // todo: check if this is still 3
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "desmosMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0]
        },
        ...weaponMirror({
            POSITION: [5, 7.5, 2.5, 1, -4.5, 95, 0]
        })
    ]
}
Class.bentDouble = {
    PARENT: "genericTank",
    LABEL: "Bent Double",
    DANGER: 7,
    GUNS: weaponArray([
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
Class.bentHybrid = makeOver("tripleShot", "Bent Hybrid", hybridTankOptions)
Class.bigCheese = {
    PARENT: "genericTank",
    LABEL: "Big Cheese",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [16, 16, 1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },
    ],
}
Class.bigMama = {
    PARENT: "genericFlail",
    LABEL: "BIG MAMA",
    DANGER: 7,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["mamaBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.blizzard = {
    PARENT: "genericTank",
    LABEL: "Blizzard",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "blizzardDeco1",
        },
        {
            POSITION: [6, 0, 0, 180, 360, 1],
            TYPE: "blizzardDeco2",
        },
    ],
    ANGLE: 72,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 5; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 72}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        for (let i = 0; i < 5; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", { ANGLE: i * 72, CONTROLLERS: [['orbit', {invert: true}]] }], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.bomber = {
    PARENT: "genericTank",
    LABEL: "Bomber",
    BODY: {
        DENSITY: base.DENSITY * 0.6,
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Front",
            },
        },
        ...weaponMirror({
            POSITION: [18, 8, 1, 0, 0, 130, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
                TYPE: "bullet",
                LABEL: "Wing",
            },
        }, 0),
        {
            POSITION: [13, 8, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 8, 1.7, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.boomer = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Boomer",
    STAT_NAMES: statnames.trap,
    FACING_TYPE: "locksFacing",
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: [5, 10, 1, 13, 0, 0, 0],
        },
        {
            POSITION: [6, 10, -1.5, 7, 0, 0, 0],
        },
        {
            POSITION: [2, 10, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            },
        },
    ],
}
Class.boomer_old = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Boomer",
    UPGRADE_LABEL: "Bent Boomer",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: weaponMirror([
        {
            POSITION: [8, 10, 1, 8, -2, -35, 0]
        },
        {
            POSITION: [2, 10, 1.3, 16, -2, -35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.fast, g.twin]),
                TYPE: "boomerang"
            }
        }
    ])
}
Class.booster = {
    PARENT: "genericTank",
    LABEL: "Booster",
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: [14, 8, 1, 0, -1, 140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }], 0)
    ]
}
Class.bulwark = {
    PARENT: "genericTank",
    LABEL: "Bulwark",
    STAT_NAMES: statnames.mixed,
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin]),
                TYPE: "bullet",
            },
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
Class.bushwhacker = makeGuard("sniper", "Bushwhacker")
Class.carrier = {
    PARENT: "genericTank",
    LABEL: "Carrier",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: "locksFacing",
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        ...weaponMirror({
            POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }, 0)
    ]
}
Class.cocci = {
    PARENT: "genericSmasher",
    LABEL: "Cocci",
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        /*{
            POSITION: [20, -22, 0, 0, 90, 0],
            TYPE: "cocciPart3",
            VULNERABLE: true
        }*/
    ]
}
Class.coil = {
    PARENT: "genericTank",
    LABEL: "Coil",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [20, 8, 0.75, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            },
        },
        {
            POSITION: [20, 8, 0.75, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [["snake", {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: [21, 4, 0.75, 0, 5, 0, 0]
        },
        {
            POSITION: [3.625, 7.5, 2.75, 5.75, 6.75, -90, 0],
        }]),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        }
    ]
}
Class.commander = {
    PARENT: "genericTank",
    LABEL: "Commander",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        ...weaponArray({
            POSITION: [8, 11, 1.3, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: "drone",
            },
        }, 3),
        ...weaponArray({
            POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 3, 1/3),
    ]
}
Class.commander_old = {
    PARENT: "genericTank",
    LABEL: "Commander",
    UPGRADE_LABEL: "Old Commander",
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
            TYPE: ["oldCommanderGun", { INDEPENDENT: true }], // me when i can't use weaponarray :skull:
        },
        {
            POSITION: [16, 1, 0, 240, 0, 0],
            TYPE: ["oldCommanderGun", { INDEPENDENT: true }],
        }
    ]
}
Class.conqueror = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Conqueror",
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: 0.8 * base.SPEED,
    },
    REVERSE_TARGET_WITH_TANK: true,
    GUNS: [
        {
            POSITION: [21, 14, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            },
        },
    ],
}
Class.construct = { // it's "construct" and not "constructor" because "constructor" breaks things
    PARENT: "genericTank",
    LABEL: "Constructor",
    STAT_NAMES: statnames.trap,
    DANGER: 7,
    BODY: {
        SPEED: 0.7 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: [18, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 18, 1.2, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}
Class.cropDuster = makeOver('minigun', "Crop Duster", hybridTankOptions)
Class.crossbow = {
    PARENT: "genericTank",
    LABEL: "Crossbow",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: [12.5, 2.5, 1, 0, 3.5, 35, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }], 0, true),
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.crowbar = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Crowbar",
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [42, 6.5, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [6, 8.5, -1.5, 8, 0, 0, 0]
        }
    ],
    TURRETS: [{
        POSITION: [6, 42, 0, 0, 180, 1],
        TYPE: [
            "crowbarTurretTank",
            { INDEPENDENT: true }
        ],
    },
        {
            POSITION: [6, 32, 0, 0, 180, 1],
            TYPE: [
                "crowbarTurretTank",
                { INDEPENDENT: true }
            ],
        },
        {
            POSITION: [6, 22, 0, 0, 180, 1],
            TYPE: [
                "crowbarTurretTank",
                { INDEPENDENT: true }
            ],
        },
    ],
}
Class.cyclone = {
    PARENT: "genericTank",
    LABEL: "Cyclone",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: [15, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 90, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.deadeye = {
    PARENT: "genericTank",
    LABEL: "Deadeye",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8,
                ASPECT: 1.3,
                X: 10
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8,
                ASPECT: 1.3,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 8,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.marksman]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0]
        }
    ]
}
Class.dreadnought_old = {
    PARENT: "genericTank",
    LABEL: "Dreadnought",
    UPGRADE_LABEL: "Bad Dreadnought",
    DANGER: 7,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    TURRETS: [
        {
            POSITION: [20, -4, 0, 0, 0, 0],
            TYPE: "genericEntity",
        },
    ],
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        {
            POSITION: [6, 16, 1, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.fake]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        {
            POSITION: [1, 3, 1, 3, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([ g.basic, g.twin, g.gunner, g.machineGun, g.thruster, [0.1, 3, 1, 1, 1, 1, 1, 1, 1, 0.075, 1, 2, 1] ]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.dual = {
    PARENT: "genericTank",
    LABEL: "Dual",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponMirror([
        {
            POSITION: [18, 7, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowPower]),
                TYPE: "bullet",
                LABEL: "Small"
            }
        },
        {
            POSITION: [16, 8.5, 1, 0, 5.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
                TYPE: "bullet"
            }
        }
    ])
}
Class.duplicator = {
    PARENT: "genericTank",
    LABEL: "Duplicator",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            }
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, -20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: [["snake", {invert: true}]]}]
            }
        },
        ...weaponMirror([{
            POSITION: [5.625, 9.5, 2, 0.375-1, -8, 111.5, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, 0, 4.75, -30, 0]
        }]),
        {
            POSITION: [17, 8, 0.65, 0, 0, 0, 0]
        },
        {
            POSITION: [18, 8, 0.25, 0, 0, 0, 0]
        },
    ]
}
Class.eagle = makeBird("pounder", "Eagle")
Class.engineer = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Engineer",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.75 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 6,
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "pillbox",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ],
}
Class.factory = {
    PARENT: "genericTank",
    LABEL: "Factory",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "minion",
                MAX_CHILDREN: 6,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.falcon = makeBird("assassin", "Falcon")
Class.fieldGun = {
    PARENT: "genericTank",
    LABEL: "Field Gun",
    BODY: {
        FOV: base.FOV * 1.1,
    },
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: [15, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        }),
        {
            POSITION: [10, 9, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                TYPE: "minimissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.fighter = {
    PARENT: "genericTank",
    LABEL: "Fighter",
    BODY: {
        DENSITY: 0.6 * base.DENSITY,
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: [16, 8, 1, 0, -1, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Side"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }], 0)
    ]
}
Class.flace = {
    PARENT: "genericFlail",
    LABEL: "Flace",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror({
        POSITION: [16, 8, 1, 0, 0, 150, 0.1],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: "bullet",
            LABEL: "thruster"
        }
    }, 0),
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["maceBolt3", {
            INDEPENDENT: true
        }]
    }],
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
}
Class.flooster = {
    PARENT: "genericFlail",
    LABEL: "Flooster",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror([
        {
            POSITION: [13, 8, 1, 0, -1, 140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }
    ], 0),
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }],
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
}
Class.focal = {
    PARENT: "genericTank",
    LABEL: "Focal",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [25, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 10, 1.3, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.fork = {
    PARENT: "genericTank",
    LABEL: "Fork",
    DANGER: 7,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 13
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 8.5,
                ASPECT: 1.3,
                X: 23
            }
        },
        {
            POSITION: {
                LENGTH: 29,
                WIDTH: 8.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.marksman]),
                TYPE: "splitterBullet"
            }
        }
    ]
}
Class.fortress = {
    PARENT: "genericTank",
    LABEL: "Fortress",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.2 * base.FOV,
    },
    GUNS: [
        ...weaponArray(
        {
            POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 3, 1/3),
        ...weaponArray([
            {
                POSITION: [14, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [4, 9, 1.5, 14, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            }
        ], 3)
    ],
}
Class.gunnerTrapper = {
    PARENT: "genericTank",
    LABEL: "Gunner Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: 1.25 * base.FOV,
    },
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        }),
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 11, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 11, 1.7, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
Class.hewnDouble = {
    PARENT: "genericTank",
    LABEL: "Hewn Double",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
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
Class.hexaTrapper = makeAuto({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 6, 0.5),
}, "Hexa-Trapper")
Class.hexaWhirl = {
    PARENT: "genericTank",
    LABEL: "Hexa Whirl",
    DANGER: 7,
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.hexaWhirl.GUNS.push(...weaponArray({
    POSITION: [18, 8, 1, 0, 0, 0, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
        TYPE: "bullet"
    }
}, 6, 0.5))
Class.hybrid = makeOver('destroyer', "Hybrid", hybridTankOptions)
Class.infestor = {
    PARENT: "genericTank",
    LABEL: "Infestor",
    DANGER: 7,
    NECRO: true,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    GUNS: weaponArray(weaponMirror({
        POSITION: [7.25, 6, 1.2, 6, -5, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.5}]),
            TYPE: "eggchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 10
        }
    }, 0), 2)
}
Class.itHurtsDontTouchIt = {
    PARENT: "genericFlail",
    LABEL: "It hurts dont touch it",
    DANGER: 7,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["ihdtiBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.iterator = {
    PARENT: "genericTank",
    LABEL: "Iterator",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [22, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["superSplitterBullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror([{
            POSITION: [4.625, 10.5, 2.75, 0.375, 7, -91.5, 0]
        },
        {
            POSITION: [4, 9, 3, 1.5, 5, -95, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, -1.5, 5.25, -50, 0]
        }])
    ]
}
Class.jumpSmasher = {
    PARENT: "genericSmasher",
    LABEL: "Jump Smasher",
    DANGER: 7,
    BODY: {
        SPEED: 1.15 * base.SPEED,
        DENSITY: 1 * base.DENSITY,
        HEALTH: 1 * base.HEALTH * 1.4,
        SHIELD: 1 * base.SHIELD * 1.4
    },
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 2,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 11, recoil: 9.75 }/*, { reload: 12.5, recoil: 8.2875 }*/]),
                TYPE: ["bullet", { ALPHA: 0 }]
            }
        }
    ]
}
Class.landmine = {
    PARENT: "genericSmasher",
    LABEL: "Landmine",
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: "Stay still to turn invisible.",
    BODY: {
        SPEED: 1.1 * base.SPEED
    },
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: "landmineBody"
        }
    ]
}
Class.machineGunner = {
    PARENT: "genericTank",
    LABEL: "Machine Gunner",
    DANGER: 7,
    BODY: {
        SPEED: 0.9 * base.SPEED
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: [14, 3, 4, -3, 5, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: "bullet"
            }
        }], 0.2),
        {
            POSITION: [14, 3, 4, 3, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.maelstrom = makeAuto("whirlwind_old", "Maelstrom")
Class.manager = {
    PARENT: "genericTank",
    LABEL: "Manager",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    MAX_CHILDREN: 8,
    GUNS: [
        {
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { reload: 0.5 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
}
Class.maleficitor = {
    PARENT: "genericTank",
    LABEL: "Maleficitor",
    DANGER: 7,
    NECRO: true,
    TOOLTIP: "Press R and wait to turn your drones invisible.",
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: base.SPEED * 0.85,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 20,
    GUNS: [
        {
            POSITION: [5.25, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.maleficitor]),
                TYPE: [
                    "sunchip",
                    {
                        INVISIBLE: [0.06, 0.03],
                    },
                ],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
            },
        },
    ],
}
Class.master = {
    PARENT: "genericTank",
    LABEL: "Master",
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3,
    },
    DANGER: 8,
    GUNS: [
        {
            POSITION: [18, 16, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "masterBullet",
                MAX_CHILDREN: 4,
                DESTROY_OLDEST_CHILD: true
            }
        },
        ...weaponMirror([{
            POSITION: [13, 8, 1, 0, -1, 140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }], 0)
    ]
}
Class.medic = {
    PARENT: "genericTank",
    LABEL: "Medic",
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    BODY: {
        FOV: base.FOV * 1.2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [8, 9, -0.5, 16.5, 0, 0, 0],
        },
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
}
Class.mega3 = makeRadialAuto("megaAutoTankGun", {isTurret: true, danger: 7, size: 14, label: "Mega-3", body: {SPEED: 0.95 * base.SPEED}})
Class.megaSmasher = {
    PARENT: "genericSmasher",
    LABEL: "Mega-Smasher",
    BODY: {
        SPEED: 1.05 * base.SPEED,
        FOV: 1.1 * base.FOV,
        DENSITY: 4 * base.DENSITY,
    },
    TURRETS: [
        {
            POSITION: [25, 0, 0, 0, 360, 0],
            TYPE: "smasherBody",
        },
    ],
}
Class.megaSpawner = {
    PARENT: "genericTank",
    LABEL: "Mega-Spawner",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 12, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [4.5, 14, 1, 7, 0, 0, 0],
        },
        {
            POSITION: [1, 14, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {size: 0.833 }]),
                TYPE: "megaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
    ],
}
Class.megaTornado = {
    PARENT: "genericTank",
    LABEL: "Mega-Tornado",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: "megaTornadoDeco",
        },
    ],
    ANGLE: 180,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 2; i++) { 
            output.push({ 
                POSITION: {WIDTH: 16, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder, g.destroyer]), 
                    TYPE: ["satellite", {ANGLE: i * 180}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.megaTrapper = {
    PARENT: "genericTank",
    LABEL: "Mega Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: [ 13, 12, 1, 0, 0, 0, 0, ],
        },
        {
        POSITION: [ 5, 12, 1.7, 13, 0, 0, 0, ],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.megaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.mender = {
    PARENT: "genericTank",
    LABEL: "Mender",
    DANGER: 7,
    TOOLTIP: "Right click to heal yourself (use sparingly, has a long cooldown once used!)",
    GUNS: [
        ...weaponMirror({
            POSITION: [17, 3, 1, 0, -6, -7, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        },
        {
            POSITION: [17, 10, 1, 0, 0, 180, 0]
        },
        {
            POSITION: [5, 18, 1, -19, 0, 0, 0], // todo: work out cooldown time
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                g.basic,
                    g.pounder,
                    g.destroyer,
                    g.healer,
                    //[2, 0, 1, 1, 1, -1, 1, 1, 1, 0.1, 1, 1, 1],
                ]),
                TYPE: "healerBullet",
                ALT_FIRE: true
            }
        }
    ],
    TURRETS: [
        {
            POSITION: [7, 0, 0, 0, 0, 1],
            TYPE: "mendersymbol"
        }
    ]
}
Class.monsoon = {
    PARENT: "genericTank",
    LABEL: "Monsoon",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    IS_SMASHER: true,
    BODY: {
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    },
    STAT_NAMES: statnames.whirlwind,
    SKILL_CAP: Array(10).fill(smshskl),
    TURRETS: [
        {
            POSITION: [26, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        {
            POSITION: { SIZE: 24 },
            TYPE: "genericEntity"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite_old", {ANGLE: i * 60}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.mortar = {
    PARENT: "genericTank",
    LABEL: "Mortar",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: [13.5, 3, 0.5, 0, -8, -7, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [17.3, 3, 0.4, 0, -6, -7, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        }], 0.2),
        {
            POSITION: [19, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
    ],
}
Class.munition = {
    PARENT: "genericTank",
    LABEL: "Munition",
    DANGER: 7,
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.munition.GUNS.push(
    ...weaponMirror({
        POSITION: [17, 3, 1, 0, -6, -7, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
            TYPE: "bullet",
            LABEL: "Secondary"
        }
    }),
    {
        POSITION: [19, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
            TYPE: "bullet",
            LABEL: "Heavy"
        }
    }
)
Class.musket = {
    PARENT: "genericTank",
    LABEL: "Musket",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: [16, 19, 1, 0, 0, 0, 0]
        },
        ...weaponMirror({
            POSITION: [18, 7, 1, 0, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin]),
                TYPE: "bullet"
            }
        })
    ]
}
Class.nailgun = {
    PARENT: "genericTank",
    LABEL: "Nailgun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9
    },
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                TYPE: "bullet",
            },
        }),
        {
            POSITION: [20, 2, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
}
Class.necromancer = {
    PARENT: "genericTank",
    LABEL: "Necromancer",
    DANGER: 7,
    NECRO: true,
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 14,
    GUNS: weaponArray({
        POSITION: [5.25, 12, 1.2, 8, 0, 0, 0.25],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: "sunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
        },
    }, 4, 0.75),
}
Class.nimrod = {
    PARENT: "genericTank",
    LABEL: "Nimrod",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.25,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.25,
                X: 13
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.marksman]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 12,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.marksman]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.octoTank = {
    PARENT: "genericTank",
    LABEL: "Octo Tank",
    DANGER: 7,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: [18, 8, 1, 0, 0, 45, 0.5],
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
    ], 4)
}
Class.ordnance = {
    PARENT: "genericTank",
    LABEL: "Ordnance",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25,
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...weaponMirror({
            POSITION: [17, 3, 1, 0, -5.75, -6, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary",
            },
        }, 0.5),
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 11, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.oroboros = {
    PARENT: "genericTank",
    LABEL: "Oroboros",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank is a placeholder!"
}
Class.overdrive = {
    PARENT: "genericTank",
    LABEL: "Overdrive",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "overdriveDeco",
        },
    ],
    GUNS: weaponArray({
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "turretedDrone",
            AUTOFIRE: true,
            NO_LIMITATIONS: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 4
        }
    }, 2)
}
Class.overgunner = makeOver({
    PARENT: "genericTank",
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: [19, 2, 1, 0, -2.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: [12, 11, 1, 0, 0, 0, 0]
        }
    ]
})
Class.overlord = {
    PARENT: "genericTank",
    LABEL: "Overlord",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    MAX_CHILDREN: 8,
    GUNS: weaponArray({
        POSITION: [6, 12, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "drone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true
        }
    }, 4)
}
Class.overtrapper = makeOver({
    PARENT: "genericTank",
    LABEL: "Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: [14, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.5, 14, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
})
Class.paramedic = {
    PARENT: "genericTank",
    LABEL: "Paramedic",
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    BODY: {
        SPEED: base.SPEED * 0.9
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol"
        }
    ],
    GUNS: [
        ...weaponMirror([{
            POSITION: [8, 9, -0.5, 10, 0, -17.5, 0],
        },
        {
            POSITION: [15.5, 10, 1, 0, 0, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                TYPE: "healerBullet",
            },
        }], 0),
        {
            POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                TYPE: "healerBullet",
            },
        },
    ],
    STAT_NAMES: statnames.heal,
}
Class.peashooter = makeGuard({
    PARENT: "genericTank",
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ]
}, "Peashooter")
Class.pentaShot = {
    PARENT: "genericTank",
    LABEL: "Penta Shot",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: [16, 8, 1, 0, 3, 30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }], 0),
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.phoenix = makeBird("sprayer", "Phoenix")
Class.poacher = makeOver('hunter', "Poacher", hybridTankOptions)
Class.predator = {
    PARENT: "genericTank",
    LABEL: "Predator",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.15],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 16, 1, 0, 0, 0, 0.3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.prodigy = {
    PARENT: "genericTank",
    LABEL: "Prodigy",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    SHAPE: 6,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.2 * base.FOV,
    },
    GUNS: [
        ...weaponArray(
            {
                POSITION: [7, 8, 1.35, 7, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.5, size: 1.3, damage: 0.95}]),
                    TYPE: "sunchip",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "necro",
                    WAIT_TO_CYCLE: true,
                    DELAY_SPAWN: false,
                    MAX_CHILDREN: 2
                },
            }, 3, 1/3),
        ...weaponArray([
            {
                POSITION: [13.5, 9, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [4, 9, 1.4, 13.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap",
                },
            }
        ], 3)
    ],
}
Class.prophet = {
    PARENT: "genericTank",
    LABEL: "Prophet",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    NECRO: true,
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["squareSatellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.prophet.GUNS.push(
    {
        POSITION: [5.25, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: "sunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 7,
        }
    },
    {
        POSITION: [5.25, 12, 1.2, 8, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: "sunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 7,
        }
    }
)
Class.quadruplex = {
    PARENT: "genericTank",
    LABEL: "Quadruplex",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, -135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, -45, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: 50}]]}]
            }
        },
        ...weaponArray(weaponMirror({
            POSITION: [3.75, 10, 2.125, 1.5, 6.25, 45, 0]
        }), 4)
    ]
}
Class.railgun = {
    PARENT: "genericTank",
    LABEL: "Railgun",
    DANGER: 7,
    BODY: {
        FOV: 1.2
    },
    GUNS: [
        {
            POSITION: [12, 8, 1, 8, 0, 0, 0],
        },
        {
            POSITION: [16, 5, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [5, 8, -1.4, 7.75, 0, 0, 0],
        },
    ],
}
Class.ranger = {
    PARENT: "genericTank",
    LABEL: "Ranger",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
Class.redistributor = {
    PARENT: "genericTank",
    LABEL: "Redistributor",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [26, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 10, 1, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.revolver = {
    PARENT: "genericTank",
    LABEL: "Revolver",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.25,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.25,
                X: 13
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.marksman]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.riptide = {
    PARENT: "genericTank",
    LABEL: "Riptide",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [6.5, 23.5, 0.25, 3, 0, 180, 0],
        },
        {
            POSITION: [18, 16, 0.75, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { size: 0.9, reload: 1.2 }]),
                TYPE: "undertowBullet"
            }
        },
        ...weaponMirror({
            POSITION: [17, 16, 0.1, 0.25, 4, 13.5, 0]
        })
    ]
}
Class.rocket = {
    PARENT: "genericTank",
    LABEL: "Rocket",
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    DANGER: 7,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: [14, 8, 1, 0, -1, 140, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }/*,
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }*/], 0)
    ]
}
Class.rocketeer = {
    PARENT: "genericTank",
    LABEL: "Rocketeer",
    BODY: {
        FOV: 1.15 * base.FOV,
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer]),
                TYPE: "rocketeerMissile",
                STAT_CALCULATOR: "sustained",
            },
        },
        {
            POSITION: [17, 18, 0.65, 0, 0, 0, 0],
        },
    ],
}
Class.septaTrapper = {
    PARENT: "genericTank",
    LABEL: "Septa-Trapper",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.8,
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 7, 4/7),
}
Class.shotgun = {
    PARENT: "genericTank",
    LABEL: "Shotgun",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: [4, 3, 1, 11, 3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [1, 4, 1, 12, -1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing"
            }
        },
        {
            POSITION: [1, 3, 1, 13, 1, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [1, 2, 1, 13, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing"
            }
        }], 0),
        {
            POSITION: [4, 4, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: "casing"
            }
        },
        {
            POSITION: [15, 14, 1, 6, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.fake]),
                TYPE: "casing"
            }
        },
        {
            POSITION: [8, 14, -1.3, 4, 0, 0, 0]
        }
    ]
}
Class.sidewinder = {
    PARENT: "genericTank",
    LABEL: "Sidewinder",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.3 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [10, 11, -0.5, 14, 0, 0, 0],
        },
        {
            POSITION: [21, 12, -1.1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder]),
                TYPE: "snake",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.single = {
    PARENT: "genericTank",
    LABEL: "Single",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }
    ]
}
Class.skimmer = {
    PARENT: "genericTank",
    LABEL: "Skimmer",
    DANGER: 7,
    BODY: {
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [10, 14, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                TYPE: "missile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}
Class.sniper3 = makeRadialAuto("sniper3gun", {isTurret: true, danger: 7, size: 13, label: "Sniper-3", body: {SPEED: 0.8 * base.SPEED, FOV: 1.25 * base.FOV}})
Class.spawnerdrive = {
    PARENT: "genericTank",
    LABEL: "Spawnerdrive",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "overdriveDeco",
        },
    ],
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "autoMinion",
                STAT_CALCULATOR: "drone",
                NO_LIMITATIONS: true,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ],
}
Class.spike = {
    PARENT: "genericSmasher",
    LABEL: "Spike",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        DAMAGE: base.DAMAGE * 1.1,
    },
    TURRETS: weaponArray([
        {
            POSITION: [18.5, 0, 0, 0, 360, 0],
            TYPE: "spikeBody",
        }
    ], 4)
}
Class.spike_old = {
    PARENT: "genericTank",
    LABEL: "Spike",
    UPGRADE_LABEL: "Weird Spike",
    DANGER: 7,
    BODY: {
        DAMAGE: 1.15 * base.DAMAGE,
        FOV: 1.05 * base.FOV,
        DENSITY: 1.5 * base.DENSITY
    },
    IS_SMASHER: true,
    SKILL_CAP: [smshskl, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
    STAT_NAMES: statnames.smasher,
    TURRETS: [
        {
            POSITION: [20.5, 0, 0, 0, 360, 0],
            TYPE: "weirdSpikeBody1"
        },
        {
            POSITION: [20.5, 0, 0, 180, 360, 0],
            TYPE: "weirdSpikeBody2"
        }
    ]
}
Class.spreadshot = {
    PARENT: "genericTank",
    LABEL: "Spreadshot",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: [13, 4, 1, 0, 0.5, 75, 5 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [14.5, 4, 1, 0, 0.5, 60, 4 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [16, 4, 1, 0, 0.5, 45, 3 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [17.5, 4, 1, 0, 0.5, 30, 2 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        },
        {
            POSITION: [19, 4, 1, 0, 1, 15, 1 / 6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: "bullet",
                LABEL: "Spread"
            }
        }], 0),
        {
            POSITION: [12, 8, 1, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.stalker = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Stalker",
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.35 * base.FOV
    },
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: [27, 8, -1.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.streamliner = {
    PARENT: "genericTank",
    LABEL: "Streamliner",
    DANGER: 7,
    BODY: {
        FOV: 1.3,
    },
    GUNS: [
        {
            POSITION: [25, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [23, 8, 1, 0, 0, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [21, 8, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 0, 0, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [17, 8, 1, 0, 0, 0, 0.8],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet",
            },
        },
    ],
}
Class.superSpiral = {
    PARENT: "genericTank",
    LABEL: "Super Spiral", //"Python",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [24, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [4.25, 9.5, 2.5, 2.25, -6.25, 92.5, 0]
        })
    ],
}
Class.surfer = {
    PARENT: "genericTank",
    LABEL: "Surfer",
    BODY: {
        DENSITY: 0.6 * base.DENSITY
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: [7, 7.5, 0.6, 7, 1, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }], 0)
    ]
}
Class.surgeon = {
    PARENT: "genericTank",
    LABEL: "Surgeon",
    HEALING_TANK: true, // Mainly for bots to recognize the tank
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: base.SPEED * 0.75,
        FOV: base.FOV * 1.15,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 14, 1, 15.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1.3, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { speed: 0.9, maxSpeed: 0.9 }]),
                TYPE: "medkit",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ],
    STAT_NAMES: statnames.heal,
}
Class.swarmer = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Swarmer",
    GUNS: [
        {
            POSITION: [15, 14, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                TYPE: "hive",
            },
        },
        {
            POSITION: [15, 12, 1, 5, 0, 0, 0],
        },
    ],
}
Class.tempest = {
    PARENT: "genericTank",
    LABEL: "Tempest",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tempestDeco1",
        },
        {
            POSITION: [4, 0, 0, 180, 360, 1],
            TYPE: "tempestDeco2",
        },
    ],
    ANGLE: 120,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 3; i++) { 
            output.push({ 
                POSITION: {WIDTH: 12, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder]), 
                    TYPE: ["satellite", {ANGLE: i * 120}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        for (let i = 0; i < 3; i++) { 
            output.push({ 
                POSITION: {WIDTH: 12, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder]), 
                    TYPE: ["satellite", { ANGLE: i * 120, CONTROLLERS: [['orbit', {invert: true}]] }], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.thunderbolt = {
    PARENT: "genericTank",
    LABEL: "Thunderbolt",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "thunderboltDeco",
        },
    ],
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2.5, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 12, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.tornado_old = {
    PARENT: "genericTank",
    LABEL: "Tornado",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: { SIZE: 30 },
            TYPE: "genericEntity"
        }
    ],
    ANGLE: 360,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 1; i++) { 
            output.push({ 
                POSITION: {WIDTH: 12, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder, g.destroyer, g.annihilator]), 
                    TYPE: ["satellite_old", {ANGLE: i * 360}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.tripleFlail = {
    PARENT: "genericFlail",
    LABEL: "Triple Flail",
    DANGER: 7,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }, {
        POSITION: [6, 10, 0, 120, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }, {
        POSITION: [6, 10, 0, 240, 190, 0],
        TYPE: ["flailBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.tripleTwin = {
    PARENT: "genericTank",
    LABEL: "Triple Twin",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror({
        POSITION: [20, 8, 1, 0, 5.5, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
            TYPE: "bullet"
        }
    }), 3)
}
Class.triplet = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Triplet",
    BODY: {
        FOV: 1.05 * base.FOV
    },
    GUNS: [
        ...weaponMirror({
            POSITION: [18, 10, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: [21, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.triplex = {
    PARENT: "genericTank",
    LABEL: "Triplex",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [18, 7, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 7, -4/3, 0, 0, 45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: [18, 7, -4/3, 0, 0, -45, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: [3.75, 10, 2.125, 1, 4.25, -10, 0]
        },
        {
            POSITION: [5, 6, 0.5, 10.5, 0, 22.5, 0]
        }]),
    ]
}
Class.twister = {
    PARENT: "genericTank",
    LABEL: "Twister",
    TOOLTIP: "Hold right click to reverse missile rotation.",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 14, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { speed: 0.6, reload: 4/3, shudder: 0.1, }]),
                TYPE: "spinmissile",
                STAT_CALCULATOR: "sustained+lowspeed",
            },
        },
    ],
}
Class.typhoon = {
    PARENT: "genericTank",
    LABEL: "Typhoon",
    DANGER: 7,
    ANGLE: 36,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "typhoonDeco",
        },
    ],
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 10; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 36}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.typhoon_old = {
    PARENT: "genericTank",
    LABEL: "Typhoon",
    DANGER: 7,
    TURRETS: [
        {
            POSITION: [28, 0, 0, 0, 360, 0],
            TYPE: "genericEntity"
        },
        {
            POSITION: [24, 0, 0, 0, 360, 0],
            TYPE: "genericEntity"
        }
    ],
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite_old", { ANGLE: i * 60 }], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite_old", { ANGLE: i * 60, CONTROLLERS: [['orbit', {invert: true}]] }], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.vortex = {
    PARENT: "genericTank",
    LABEL: "Vortex",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.mixed,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.vortex.GUNS.push(
    {
        POSITION: [10, 9, 1, 9, 0, 0, 0],
    },
    {
        POSITION: [17, 13, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
            TYPE: "minimissile",
            STAT_CALCULATOR: "sustained",
        },
    }
)
Class.vortex_old = {
    PARENT: "genericTank",
    LABEL: "Vortex",
    ANGLE: 36,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "vortexBody"
        },
        {
            POSITION: [21.5, 0, 0, 180, 360, 0],
            TYPE: "vortexBody"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 10; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite_old", {ANGLE: i * 36}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.vulture = makeBird({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    GUNS: [
        {
            POSITION: [22, 7, -1.5, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 7.5, -1.5, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {size: 7/7.5}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 8, -1.5, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {size: 7/8}]),
                TYPE: "bullet"
            }
        }
    ]
}, "Vulture")
Class.whirlGuard = {
    PARENT: "genericTank",
    LABEL: "Whirl Guard",
    DANGER: 7,
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.whirlGuard.GUNS.push(
    {
        POSITION: [20, 8, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    },
    {
        POSITION: [13, 8, 1, 0, 0, 180, 0]
    },
    {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: "trap"
        }
    }
)
Class.whirl3 = {
    PARENT: "genericTank",
    LABEL: "Whirl-3",
    DANGER: 7,
    ANGLE: 90,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    FACING_TYPE: "spin",
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "tornadoDeco"
        },
        {
            POSITION: [11, 8, 0, 0, 190, 0],
            TYPE: "autoTankGun",
        },
        {
            POSITION: [11, 8, 0, 120, 190, 0],
            TYPE: "autoTankGun",
        },
        {
            POSITION: [11, 8, 0, 240, 190, 0],
            TYPE: "autoTankGun",
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 4; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["satellite", {ANGLE: i * 90}], 
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.wrangler = { // old bender, fires train minions with 3 bodies (though only one of them has a gun)
    PARENT: "genericTank",
    LABEL: "Wrangler", //"Ranch",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0]
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0]
        },
        ...weaponMirror({
            POSITION: [5, 7.5, 2.5, 1, -4.5, 95, 0]
        })
    ]
}
Class.xHunter = {
    PARENT: "genericTank",
    LABEL: "X-Hunter",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: [["zoom", { distance: 550 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 12, -1.2, 7, 0, 0, 0]
        }
    ]
}

// Tier 4
Class.quintuplet = {
    PARENT: "genericTank",
    LABEL: "Quintuplet",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: [16, 10, 1, 0, 5, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 10, 1, 0, 3, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        }]),
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.vulcan = {
    PARENT: "genericTank",
    LABEL: "Vulcan",
    DANGER: 7,
    GUNS: [
        {
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

// Tierless / Fun
Class.rapture = {
    PARENT: "genericTank",
    LABEL: "Rapture",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [21, 19.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: "speedBullet"
            }
        },
        {
            POSITION: [15, 13, 1, 6, 0, 0, 0]
        },
        {
            POSITION: [12, 13, -1.3, 4, 0, 0, 0]
        }
    ]
}

// Upgrade Paths
Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper", "desmos"]
    Class.basic.UPGRADES_TIER_2 = ["smasher"]
        Class.smasher.UPGRADES_TIER_3 = ["megaSmasher", "spike", "autoSmasher", "landmine"]

    Class.twin.UPGRADES_TIER_2 = ["doubleTwin", "tripleShot", "gunner", "hexaTank", "helix"]
        Class.twin.UPGRADES_TIER_3 = ["dual", "bulwark", "musket"]
        Class.doubleTwin.UPGRADES_TIER_3 = ["tripleTwin", "hewnDouble", "autoDouble", "bentDouble"]
        Class.tripleShot.UPGRADES_TIER_3 = ["pentaShot", "spreadshot", "bentHybrid", "bentDouble", "triplet", "triplex"]
        Class.gunner.UPGRADES_TIER_3 = ["autoGunner", "nailgun", "auto4", "machineGunner", "gunnerTrapper", "cyclone", "overgunner"]

    Class.sniper.UPGRADES_TIER_2 = ["assassin", "hunter", "minigun", "rifle", "marksman"]
        Class.sniper.UPGRADES_TIER_3 = ["bushwhacker"]
        Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin", "single", "deadeye"]
        Class.hunter.UPGRADES_TIER_3 = ["predator", "xHunter", "poacher", "ordnance", "dual", "nimrod"]
        Class.rifle.UPGRADES_TIER_3 = ["musket", "crossbow", "armsman", "revolver"]
        Class.marksman.UPGRADES_TIER_3 = ["deadeye", "nimrod", "revolver", "fork"]

    Class.machineGun.UPGRADES_TIER_2 = ["artillery", "minigun", "gunner", "sprayer"]
        Class.minigun.UPGRADES_TIER_3 = ["streamliner", "nailgun", "cropDuster", "barricade", "vulture"]
        Class.sprayer.UPGRADES_TIER_3 = ["redistributor", "phoenix", "atomizer", "focal"]

    Class.flankGuard.UPGRADES_TIER_2 = ["hexaTank", "triAngle", "auto3", "trapGuard", "triTrapper"]
        Class.flankGuard.UPGRADES_TIER_3 = ["tripleTwin", "quadruplex"]
        Class.hexaTank.UPGRADES_TIER_3 = ["octoTank", "cyclone", "hexaTrapper"]
        Class.triAngle.UPGRADES_TIER_3 = ["fighter", "booster", "falcon", "bomber", "autoTriAngle", "surfer", "eagle", "phoenix", "vulture"]
        Class.auto3.UPGRADES_TIER_3 = ["auto5", "mega3", "auto4", "banshee"]

    Class.director.UPGRADES_TIER_2 = ["overseer", "cruiser", "underseer", "spawner"]
        Class.director.UPGRADES_TIER_3 = ["manager", "bigCheese"]
        Class.overseer.UPGRADES_TIER_3 = ["overlord", "overtrapper", "overgunner", "banshee", "autoOverseer", "overdrive", "commander"]
        Class.cruiser.UPGRADES_TIER_3 = ["carrier", "battleship", "fortress", "autoCruiser", "commander"]
        Class.underseer.UPGRADES_TIER_3 = ["necromancer", "maleficitor", "infestor"]
        Class.spawner.UPGRADES_TIER_3 = ["factory", "autoSpawner"/*, "bender"*/]

    Class.pounder.UPGRADES_TIER_2 = ["destroyer", "builder", "artillery", "launcher"]
        Class.pounder.UPGRADES_TIER_3 = ["shotgun", "eagle"]
        Class.destroyer.UPGRADES_TIER_3 = ["conqueror", "annihilator", "hybrid", "construct"]
        Class.artillery.UPGRADES_TIER_3 = ["mortar", "ordnance", "beekeeper", "fieldGun"]
        Class.launcher.UPGRADES_TIER_3 = ["skimmer", "twister", "swarmer", "sidewinder", "fieldGun"]

    Class.trapper.UPGRADES_TIER_2 = ["builder", "triTrapper", "trapGuard"]
        Class.trapper.UPGRADES_TIER_3 = ["barricade", "overtrapper"]
        Class.builder.UPGRADES_TIER_3 = ["construct", "autoBuilder", "engineer", "boomer", "assembler", "architect", "conqueror"]
        Class.triTrapper.UPGRADES_TIER_3 = ["fortress", "hexaTrapper", "septaTrapper", "architect"]
        Class.trapGuard.UPGRADES_TIER_3 = ["bushwhacker", "gunnerTrapper", "bomber", "conqueror", "bulwark"]

    Class.desmos.UPGRADES_TIER_2 = ["helix"/*, "spiral", "repeater"*/]
        //Class.desmos.UPGRADES_TIER_3 = ["bender"]
        Class.helix.UPGRADES_TIER_3 = ["triplex", "quadruplex"]
        Class.spiral.UPGRADES_TIER_3 = ["coil", "superSpiral"/*, "wrangler", "oroboros", "cocci", "rocket",*/]
