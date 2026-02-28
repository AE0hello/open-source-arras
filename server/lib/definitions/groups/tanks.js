const {combineStats, deleteUpgrades, makeAuto, makeAutoArray, makeBird, makeDrive, makeFlank, makeGuard, makeOver, makeRadialAuto, makeSnake, makeGunner, makeWhirlwind, weaponArray, weaponMirror, weaponStack} = require('../facilitators.js')
const {base, dfltskl, smshskl, statnames} = require('../constants.js')
const g = require('../gunvals.js')
const preset = require('../presets.js')

// Basic Tank
Class.basic = {
    PARENT: 'genericTank',
    LABEL: "Basic", // Tank Label
    DANGER: 4, // AI priority target level
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
                SHOOT_SETTINGS: combineStats([g.basic]), // Gun/projectile stats
                TYPE: 'bullet', // What the gun shoots
                COLOR: 'grey', // Gun colour
                LABEL: "", // Gun label (shows up in death messages)
                STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false, // Whether the gun waits a full reload cycle before firing
                AUTOFIRE: false, // Whether the gun fires on its own
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0, // Number of projectiles from this gun that can be alive at once
                ALT_FIRE: false, // Whether the gun requires RMB/Shift to fire instead of LMB/Space
                NEGATIVE_RECOIL: false // Whether the gun pulls instead of pushes when firing
            }
        }
    ]
}

// Tier 1
Class.desmos = {
    PARENT: 'genericTank',
    LABEL: "Desmos",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.director = {
    PARENT: 'genericTank',
    LABEL: "Director",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}
Class.flail = {
    PARENT: 'genericFlail',
    LABEL: "Flail",
    TURRETS: [{
        TYPE: ['flailBolt3', {
            INDEPENDENT: true
        }],
        POSITION: {
            SIZE: 6,
            X: 10,
            ARC: 190
        }
    }]
}
Class.flankGuard = makeFlank('basic', 3, "Flank Guard", {extraStats: [g.flankGuard]})
Class.flankGuard.BODY = {SPEED: 1.1 * base.SPEED}
Class.machineGun = {
    PARENT: 'genericTank',
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
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, {size: 0.92}]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.pounder = {
    PARENT: 'genericTank',
    LABEL: "Pounder",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.sniper = {
    PARENT: 'genericTank',
    LABEL: "Sniper",
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.trapper = {
    PARENT: 'genericTank',
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
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ]
}
Class.twin = {
    PARENT: 'genericTank',
    LABEL: "Twin",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: 'bullet'
        }
    }, {delayIncrement: 0.5})
}
Class.whirlwind = makeWhirlwind('genericTank', {label: "Whirlwind", satellites: 6, hat: 'hexagonHat_spin', danger: 5})
Class.whirlwind_bent = {
    PARENT: 'genericTank',
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
                TYPE: 'satelliteBullet',
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
    ], {delayIncrement: 0.5}),
    UPGRADES_TIER_2: [
        'maelstrom',
        'hurricane',
        'monsoon',
        'typhoon',
        'tempest',
    ].map(x => x + '_bent')
}

// Tier 2
Class.artillery = {
    PARENT: 'genericTank',
    LABEL: "Artillery",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Heavy"
            }
        }
    ]
}
Class.assassin = {
    PARENT: 'genericTank',
    LABEL: "Assassin",
    DANGER: 6,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.auto3 = makeRadialAuto('autoTankGun', {isTurret: true, danger: 6, label: "Auto-3"})
Class.blaster = {
    PARENT: 'genericTank',
    LABEL: "Blaster",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.builder = {
    PARENT: 'genericTank',
    LABEL: "Builder",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            },
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'block'
            }
        }
    ]
}
Class.cruiser = {
    PARENT: 'genericTank',
    LABEL: "Cruiser",
    DANGER: 6,
    FACING_TYPE: 'locksFacing',
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: 1.2 * base.FOV,
    },
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            Y: 4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: 'swarm',
            STAT_CALCULATOR: 'swarm'
        }
    }, {delayIncrement: 0.5})
}
Class.destroyer = {
    PARENT: 'genericTank',
    LABEL: "Destroyer",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.doubleFlail = {
    PARENT: 'genericFlail',
    LABEL: "Double Flail",
    DANGER: 6,
    TURRETS: weaponArray(Class.flail.TURRETS, 2)
}
Class.doubleMachine = makeFlank('machineGun', 2, "Double Machine", {extraStats: [g.flankGuard]})
Class.doubleTwin = makeFlank('twin', 2, "Double Twin", {extraStats: [g.doubleTwin]})
Class.flangle = {
    PARENT: 'genericFlail',
    LABEL: "Flangle",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 16,
            WIDTH: 8,
            ANGLE: 150,
            DELAY: 0.1
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: 'bullet',
            LABEL: "Thruster"
        }
    }),
    TURRETS: Class.flail.TURRETS,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl]
}
Class.gatlingGun = {
    PARENT: 'genericTank',
    LABEL: "Gatling Gun",
    DANGER: 6,
    /*BODY: {
        FOV: base.FOV * 1.25
    },*/
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.gunner = {
    PARENT: 'genericTank',
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ], {delayIncrement: 0.25})
}
Class.healer = {
    PARENT: 'genericHealer',
    LABEL: "Healer",
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
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
                TYPE: 'healerBullet'
            }
        }
    ]
}
Class.helix = {
    PARENT: 'genericTank',
    LABEL: "Helix",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.hexaTank = makeFlank('basic', 6, "Hexa Tank", {extraStats: [g.flankGuard, g.flankGuard], delayIncrement: 0.5, danger: 6})
Class.hunter = {
    PARENT: 'genericTank',
    LABEL: "Hunter",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.hurricane = makeWhirlwind('genericTank', {hat: 'octagonHat_spin', satellites: 8, label: "Hurricane"})
Class.hurricane_bent = {
    PARENT: 'genericTank',
    LABEL: "Hurricane",
    DANGER: 6,
    GUNS: weaponArray([{
        POSITION: {
            LENGTH: 15,
            WIDTH: 8,
            ANGLE: 45
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin]),
            TYPE: 'satelliteBullet',
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
    PARENT: 'genericTank',
    LABEL: "Launcher",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 13,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: 'minimissile',
                STAT_CALCULATOR: 'sustained'
            }
        }
    ]
}
Class.mace = {
    PARENT: 'genericFlail',
    LABEL: "Mace",
    DANGER: 6,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["maceBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.maelstrom_bent = {
    PARENT: 'genericTank',
    LABEL: "Maelstrom",
    DANGER: 6,
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
                TYPE: 'satelliteBullet',
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
        }]),
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'satelliteBullet',
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
    PARENT: 'genericTank',
    LABEL: "Marksman",
    DANGER: 6,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 10
            }
        }, 3, {xPosOffset: 5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.marksman]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.minigun = {
    PARENT: 'genericTank',
    LABEL: "Minigun",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
            TYPE: 'bullet'
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3})
}
Class.monsoon_bent = {
    PARENT: 'genericTank',
    LABEL: "Monsoon",
    DANGER: 6,
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
                STAT_CALCULATOR: 'trap',
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
    ], {delayIncrement: 0.5})
}
Class.overseer = {
    PARENT: 'genericTank',
    LABEL: "Overseer",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 8,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: 'drone',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'drone',
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 4
        }
    })
}
Class.repeater = {
    PARENT: 'genericTank',
    LABEL: "Repeater",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['splitterBullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 5,
                    ASPECT: -3,
                    X: -5.5,
                    Y: -10,
                    ANGLE: 90
                }
            },
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 5,
                    ASPECT: -4,
                    X: -5.25,
                    Y: -5,
                    ANGLE: 82.5
                }
            }
        ])
    ]
}
Class.rifle = {
    PARENT: 'genericTank',
    LABEL: "Rifle",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
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
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.rifle_old = {
    PARENT: 'genericTank',
    LABEL: "Rifle",
    UPGRADE_LABEL: "Old Rifle",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5
            }
        }
    ],
    UPGRADES_TIER_3: [
        "sniperRifle",
        "ransacker_old",
        "spreadRifle",
    ]
}
Class.smasher = {
    PARENT: 'genericSmasher',
    LABEL: "Smasher",
    DANGER: 6,
    TURRETS: [
        {
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}],
            POSITION: {
                SIZE: 21.5
            }
        }
    ]
}
Class.spawner = {
    PARENT: 'genericTank',
    LABEL: "Spawner",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            },
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                TYPE: 'minion',
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 12
            }
        }
    ]
}
Class.spiral = {
    PARENT: 'genericTank',
    LABEL: "Spiral",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['spiralBullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 5,
                ASPECT: -4,
                X: -6.5,
                Y: -5,
                ANGLE: 87.5
            }
        })
    ]
}
Class.sprayer = {
    PARENT: 'genericTank',
    LABEL: "Sprayer",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.tempest_bent = {
    PARENT: 'genericTank',
    LABEL: "Tempest",
    DANGER: 6,
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
                TYPE: 'satelliteBullet',
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
Class.tornado = makeWhirlwind('genericTank', {hat: 'squareHat_spin', hatSize: 10, satellites: 4, satelliteSize: 12, extraStats: [g.pounder], label: "Tornado"})
Class.trapGuard = makeGuard({
    PARENT: 'genericTank',
    DANGER: 4,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'bullet'
            }
        }
    ]
}, "Trap Guard")
Class.triAngle = {
    PARENT: 'genericTank',
    LABEL: "Tri-Angle",
    DANGER: 6,
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: 'bullet',
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
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}
Class.triTrapper = makeFlank('trapper', 3, "Tri-Trapper", {extraStats: [g.flankGuard]})
Class.tripleShot = {
    PARENT: 'genericTank',
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
                ANGLE: 18,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.typhoon_bent = {
    PARENT: 'genericTank',
    LABEL: "Typhoon",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: 'satelliteBullet',
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
    PARENT: 'genericTank',
    LABEL: "Underseer",
    DANGER: 6,
    NECRO: [4],
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 7.4,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
            TYPE: 'sunchip',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'necro',
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false
        }
    }, 2)
}
Class.undertow = {
    PARENT: 'genericTank',
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
    ]
}
Class.volute = {
    PARENT: 'genericTank',
    LABEL: "Volute",
    DANGER: 6,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 11,
                ASPECT: -1.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6.25,
                WIDTH: 5,
                ASPECT: -4,
                X: -6.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.whirlwind_old = makeWhirlwind('genericTank', {hat: 'circleHat', hatSize: 24, hatLayer: 0, satellites: 6, satelliteType: 'satellite_old', label: "Whirlwind"})
Class.whirlwind_old.UPGRADE_LABEL = "Old Whirlwind"
Class.whirlwind_old.UPGRADES_TIER_3 = ['monsoon', 'maelstrom', 'tornado_old', 'typhoon_old', 'vortex_old']
makeAutoArray(['trapper'], {tier: 1})
Class.autoTrapper = makeAuto('trapper')

// Tier 3
Class.accurator = {
    PARENT: 'genericTank',
    LABEL: "Accurator",
    DANGER: 7,
    /*BODY: {
        FOV: 1.5 * base.FOV
    },*/
    GUNS: [
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 8,
                ASPECT: 0.1,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun]),
                TYPE: 'speedBullet'
            }
        }
    ]
}
Class.ambulance = {
    PARENT: 'genericHealer',
    LABEL: "Ambulance",
    BODY: {
        HEALTH: base.HEALTH * 0.8,
        SHIELD: base.SHIELD * 0.8,
        DENSITY: base.DENSITY * 0.6,
    },
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
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }, g.healer]),
                TYPE: 'healerBullet',
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
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}
Class.annihilator = {
    PARENT: 'genericTank',
    LABEL: "Annihilator",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 19.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.armsman = makeOver('rifle', "Armsman", preset.makeOver.hybrid)
Class.architect = makeRadialAuto('architectGun', {isTurret: true, danger: 7, size: 12, label: "Architect", body: {SPEED: 1.1 * base.SPEED}}) // todo: fix this
Class.assembler = {
    PARENT: 'genericTank',
    LABEL: "Assembler",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'assemblent',
                NO_LIMITATIONS: true,
                MAX_CHILDREN: 8,
                STAT_CALCULATOR: 'block',
            }
        }
    ],
    TURRETS: [
        {
            TYPE: ["squareHatCurved", { COLOR: "darkGrey" }],
            POSITION: {
                SIZE: 2,
                X: 14,
                LAYER: 1
            }
        }
    ]
}
Class.atomizer = {
    PARENT: 'genericTank',
    LABEL: "Atomizer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 7,
                ASPECT: 1.4,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.auto4 = makeRadialAuto('auto4gun', {isTurret: true, danger: 7, size: 13, x: 6, angle: 45, label: "Auto-4", count: 4})
Class.auto4_old = makeRadialAuto('auto4gun', {isTurret: true, danger: 7, size: 13, x: 6, label: "Gunner-3", count: 3})
Class.auto5 = makeRadialAuto('autoTankGun', {isTurret: true, danger: 7, label: "Auto-5", count: 5})
Class.autoAssassin = makeAuto('assassin')
Class.autoBuilder = makeAuto('builder')
Class.autoCruiser = makeAuto('cruiser')
Class.autoDouble = makeAuto('doubleTwin', "Auto-Double")
Class.autoGunner = makeAuto('gunner')
Class.autoOverseer = makeAuto('overseer')
Class.autoSmasher = makeAuto({
    PARENT: 'genericSmasher',
    DANGER: 6,
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}]
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
Class.autoSpawner = makeAuto('spawner')
Class.autoTriAngle = makeAuto('triAngle')
Class.banshee = makeRadialAuto('bansheegun', {isTurret: true, danger: 7, size: 10, arc: 80, label: "Banshee", body: {SPEED: 0.8 * base.SPEED, FOV: 1.1 * base.FOV}})
Class.banshee.GUNS = weaponArray({
    POSITION: {
        LENGTH: 6,
        WIDTH: 11,
        ASPECT: 1.2,
        X: 8,
        ANGLE: 180
    },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: 'drone',
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: 'drone',
        WAIT_TO_CYCLE: true,
        MAX_CHILDREN: 2,
    },
}, 3)
Class.barricade = {
    PARENT: 'genericTank',
    LABEL: "Barricade",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: base.FOV * 1.15
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            }
        },
        ...weaponStack({
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.3,
                X: 22
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }, 3, {xPosOffset: 4, delayIncrement: 1/3})
    ]
}
Class.battery = {
    PARENT: 'genericTank',
    LABEL: "Battery",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: 'bullet'
            }
        }], {delayIncrement: 0.2}),
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 3.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.battleship = {
    PARENT: 'genericTank',
    LABEL: "Battleship",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: 'locksFacing',
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 4,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm',
                LABEL: "Guided"
            }
        }, {delayIncrement: 0.5}),
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 4,
                ANGLE: 270
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: 'autoswarm',
                STAT_CALCULATOR: 'swarm',
                LABEL: "Autonomous"
            }
        }, {delayIncrement: 0.5})
    ]
}
Class.beekeeper = {
    PARENT: 'genericTank',
    LABEL: "Beekeeper",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee]),
                TYPE: ['bee', { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Heavy"
            }
        }
    ]
}
Class.bender = {
    PARENT: 'genericTank',
    LABEL: "Bender",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4, // todo: check if this is still 3
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                TYPE: 'desmosMinion',
                STAT_CALCULATOR: 'drone',
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
Class.bentDouble = makeFlank('tripleShot', 2, "Bent Double", {extraStats: [g.doubleTwin]})
Class.bentHybrid = makeOver('tripleShot', "Bent Hybrid", preset.makeOver.hybrid)
Class.bigCheese = {
    PARENT: 'genericTank',
    LABEL: "Big Cheese",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 17,
                ASPECT: 1.3,
                X: 2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 1,
                WAIT_TO_CYCLE: true,
            },
        },
    ],
}
Class.bigMama = {
    PARENT: 'genericFlail',
    LABEL: "BIG MAMA",
    DANGER: 7,
    TURRETS: [{
        POSITION: [6, 10, 0, 0, 190, 0],
        TYPE: ["mamaBolt3", {
            INDEPENDENT: true
        }]
    }]
}
Class.blizzard = makeWhirlwind('genericTank', {dualLayer: true, hat: "pentagonHat_spin", hat2: "pentagonHat_spinReverse", satellites: 5, label: "Blizzard", danger: 7})
Class.blower = makeGunner('destroyer', "Blower", {rear: true})
Class.blunderbuss = {
    PARENT: 'genericTank',
    LABEL: "Blunderbuss",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 4,
                Y: 3,
                ANGLE: 9,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.blunderbuss]),
                TYPE: 'bullet',
                LABEL: "Pellet"
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 4,
                Y: 2.5,
                ANGLE: 6,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.blunderbuss]),
                TYPE: 'bullet',
                LABEL: "Pellet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                Y: 2,
                ANGLE: 3,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.blunderbuss]),
                TYPE: 'bullet',
                LABEL: "Pellet"
            }
        }]),
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 10.5
            }
        }
    ]
}
Class.bomber = {
    PARENT: 'genericTank',
    LABEL: "Bomber",
    DANGER: 7,
    BODY: {
        DENSITY: base.DENSITY * 0.6
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ANGLE: 130,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
                TYPE: 'bullet',
                LABEL: "Wing"
            }
        }),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ]
}
Class.bonker = {
    PARENT: 'genericSmasher',
    LABEL: "Bonker",
    SIZE: Class.genericTank.SIZE * 0.7,
    BODY: {
        FOV: 1.2 * base.FOV,
        HEALTH: 0.95 * base.HEALTH,
        SPEED: 1.1 * base.SPEED,
    },
    TURRETS: Class.smasher.TURRETS
}
Class.boomer = {
    PARENT: 'genericTank',
    LABEL: "Boomer",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    FACING_TYPE: 'locksFacing',
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.15
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 10,
                ASPECT: -1.9
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 10,
                ASPECT: 1.3,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
                TYPE: 'boomerang',
                STAT_CALCULATOR: 'block'
            }
        }
    ]
}
Class.boomer_old = {
    PARENT: 'genericTank',
    LABEL: "Boomer",
    UPGRADE_LABEL: "Bent Boomer",
    DANGER: 7,
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
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.twin, {speed: 1.2}]),
                TYPE: 'boomerang'
            }
        }
    ], {delayIncrement: 0.5})
}
Class.booster = {
    PARENT: 'genericTank',
    LABEL: "Booster",
    DANGER: 7,
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 14,
                    WIDTH: 8,
                    ANGLE: 135,
                    DELAY: 0.6
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                    TYPE: 'bullet',
                    LABEL: "Thruster"
                }
            },
            {
                POSITION: {
                    LENGTH: 16,
                    WIDTH: 8,
                    ANGLE: 150,
                    DELAY: 0.1
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                    TYPE: 'bullet',
                    LABEL: "Thruster"
                }
            }
        ])
    ]
}
Class.bulwark = {
    PARENT: 'genericTank',
    LABEL: "Bulwark",
    STAT_NAMES: statnames.mixed,
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin]),
                TYPE: 'bullet',
            },
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 185
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 185
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ], {delayIncrement: 0.5})
}
Class.bulwark_old = {
    PARENT: 'genericTank',
    LABEL: "Double Trap Guard",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.twin]),
                TYPE: 'bullet',
            },
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 6,
                Y: 6,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 6,
                ASPECT: 1.5,
                X: 13,
                Y: 6,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ], {delayIncrement: 0.5})
}
Class.bushwhacker = makeGuard('sniper', "Bushwhacker")
Class.buttbuttin = makeGunner('assassin', "Buttbuttin", {rear: true})
Class.carrier = {
    PARENT: 'genericTank',
    LABEL: "Carrier",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    FACING_TYPE: 'locksFacing',
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 2,
                ANGLE: 30,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        }),
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        }
    ]
}
Class.cocciSegment = {
    PARENT: 'genericSmasher',
    COLOR: "mirror",
    CAN_BE_ON_LEADERBOARD: false,
    DISPLAY_NAME: false,
    TURRETS: Class.smasher.TURRETS,
    CLEAR_ON_MASTER_UPGRADE: true
}
Class.cocci = makeSnake('smasher', 5, "Cocci")
Class.coil = {
    PARENT: 'genericTank',
    LABEL: "Coil",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['spiralBullet', {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['spiralBullet', {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 21,
                WIDTH: 3,
                ASPECT: -1.5,
                Y: 5
            }
        }),
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.commander = {
    PARENT: 'genericTank',
    LABEL: "Commander",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.15
    },
    GUNS: [
        ...weaponArray({
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 2,
                STAT_CALCULATOR: 'drone'
            }
        }, 3),
        ...weaponArray({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        }, 3, {delayIncrement: 1/3})
    ]
}
Class.commander_old = {
    PARENT: 'genericTank',
    LABEL: "Commander",
    UPGRADE_LABEL: "Old Commander",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.15 * base.FOV,
    },
    FACING_TYPE: 'spin',
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.commander]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 6
            },
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8,
                ANGLE: 120
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.commander]),
                TYPE: ['drone', {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 6
            },
        })
    ]
}
Class.conqueror = {
    PARENT: 'genericTank',
    LABEL: "Conqueror",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: 0.8 * base.SPEED
    },
    REVERSE_TARGET_WITH_TANK: true,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 14,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'block'
            }
        }
    ]
}
Class.construct = { // it's "construct" and not "constructor" because "constructor" breaks things
    PARENT: 'genericTank',
    LABEL: "Constructor",
    STAT_NAMES: statnames.trap,
    DANGER: 7,
    BODY: {
        SPEED: 0.7 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 18
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 18,
                ASPECT: 1.2,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'block'
            }
        }
    ]
}
Class.cropDuster = makeOver('minigun', "Crop Duster", preset.makeOver.hybrid)
Class.crossbow = {
    PARENT: 'genericTank',
    LABEL: "Crossbow",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 3,
                Y: 2,
                ANGLE: 35,
                DELAY: 1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3,
                Y: 3.5,
                ANGLE: 15,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 4,
                Y: 4,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        }], {delayIncrement: 0.5, delayOverflow: true}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { speed: 0.7, maxSpeed: 0.7 }, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.cyclone = {
    PARENT: 'genericTank',
    LABEL: "Cyclone",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                ANGLE: 30,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                ANGLE: 60,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                ANGLE: 90,
                DELAY: 0.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: 'bullet'
            }
        }
    ], 3)
}
Class.deadeye = {
    PARENT: 'genericTank',
    LABEL: "Deadeye",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 7
            }
        }, 2, {xPosOffset: 5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.marksman]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.deathStar = {
    PARENT: 'genericTank',
    LABEL: "Death Star",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
                ANGLE: 180,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: 'bullet'
            }
        }
    ], 3)
}
Class.dreadnought_old = {
    PARENT: 'genericTank',
    LABEL: "Dreadnought",
    UPGRADE_LABEL: "Bad Dreadnought",
    DANGER: 7,
    FACING_TYPE: 'locksFacing',
    STAT_NAMES: statnames.swarm,
    BODY: {
        FOV: base.FOV * 1.2,
    },
    TURRETS: [
        {
            TYPE: ['circleHat', {COLOR: 'grey'}],
            POSITION: {
                SIZE: 19.5,
                X: -4.5,
            }
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 15,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 0.5 }]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: 2.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: -2.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: 2.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: -2.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: 0.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: 2.5,
                ANGLE: 220
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: 2.5,
                ANGLE: 220
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: 2.5,
                ANGLE: 220
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: -2.5,
                ANGLE: -220
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: -2.5,
                ANGLE: -220
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 2,
                ASPECT: 4,
                X: -1,
                Y: -2.5,
                ANGLE: -200
            }
        },
        {
            POSITION: [1, 3, 1, 3, 0, 180, 0], // temporary propeller
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGun, g.thruster, [0.1, 3, 1, 1, 1, 1, 1, 1, 1, 0.075, 1, 2, 1]]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.dual = {
    PARENT: 'genericTank',
    LABEL: "Dual",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual, g.lowPower]),
                TYPE: 'bullet',
                LABEL: "Small"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8.5,
                Y: 5.5,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.dual]),
                TYPE: 'bullet'
            }
        }
    ], {delayIncrement: 0.5})
}
Class.duplicator = {
    PARENT: 'genericTank',
    LABEL: "Duplicator",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: [20, 8, -4/3, 0, 0, 20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['splitterBullet', {CONTROLLERS: [['snake', {invert: false}]]}]
            }
        },
        {
            POSITION: [20, 8, -4/3, 0, 0, -20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos]),
                TYPE: ['splitterBullet', {CONTROLLERS: [['snake', {invert: true}]]}]
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
Class.eagle = makeBird('pounder', "Eagle")
Class.engineer = {
    PARENT: 'genericTank',
    LABEL: "Engineer",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.75 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 14,
                X: 15.5
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'pillbox',
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: 'block',
                MAX_CHILDREN: 6
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 14
            }
        }
    ]
}
Class.factory = {
    PARENT: 'genericTank',
    LABEL: "Factory",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 14,
                X: 15.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion]),
                TYPE: 'minion',
                MAX_CHILDREN: 6,
                STAT_CALCULATOR: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 14
            }
        }
    ]
}
Class.falcon = makeBird('assassin', "Falcon")
Class.fieldGun = {
    PARENT: 'genericTank',
    LABEL: "Field Gun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14.5,
                WIDTH: 3,
                Y: -6,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 13,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery]),
                TYPE: 'minimissile',
                STAT_CALCULATOR: 'sustained'
            }
        }
    ]
}
Class.fighter = {
    PARENT: 'genericTank',
    LABEL: "Fighter",
    DANGER: 7,
    BODY: {
        DENSITY: 0.6 * base.DENSITY,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: -1,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: 'bullet',
                LABEL: "Side"
            }
        }]),
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}
Class.flace = {
    PARENT: 'genericFlail',
    LABEL: "Flace",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 16,
            WIDTH: 8,
            ANGLE: 150,
            DELAY: 0.1
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
            TYPE: 'bullet',
            LABEL: "Thruster"
        }
    }),
    TURRETS: Class.mace.TURRETS,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
}
Class.flamethrower = {
    PARENT: 'genericTank',
    LABEL: "Flamethrower",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 20,
                ASPECT: 0.95,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flamethrower]),
                TYPE: 'growBullet'
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 12,
                ASPECT: 2,
                X: 4
            }
        }
    ]
}
Class.flooster = {
    PARENT: 'genericFlail',
    LABEL: "Flooster",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                ANGLE: 135,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        }
    ]),
    TURRETS: Class.flail.TURRETS,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
}
Class.focal = {
    PARENT: 'genericTank',
    LABEL: "Focal",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.fork = {
    PARENT: 'genericTank',
    LABEL: "Fork",
    DANGER: 7,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 15
            }
        }, 4, {xPosOffset: 5}),
        {
            POSITION: {
                LENGTH: 29,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.marksman]),
                TYPE: 'splitterBullet'
            }
        }
    ]
}
Class.fortress = {
    PARENT: 'genericTank',
    LABEL: "Fortress",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponArray(
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: 'swarm',
                STAT_CALCULATOR: 'swarm'
            }
        }, 3, {delayIncrement: 1/3}),
        ...weaponArray([
            {
                POSITION: {
                    LENGTH: 14,
                    WIDTH: 9
                }
            },
            {
                POSITION: {
                    LENGTH: 4,
                    WIDTH: 9,
                    ASPECT: 1.5,
                    X: 14
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                    TYPE: 'trap',
                    STAT_CALCULATOR: 'trap'
                }
            }
        ], 3)
    ],
}
Class.gunnerTrapper = makeGunner({
    PARENT: 'genericTank',
    LABEL: "Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: 1.25 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 11,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 11,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ]
})
Class.halfNHalf = {
    PARENT: 'genericTank',
    LABEL: "Half 'n Half",
    DANGER: 7,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flankGuard]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun, g.flankGuard]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.hewnDouble = {
    PARENT: 'genericTank',
    LABEL: "Hewn Double",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: -5.5,
                ANGLE: 155
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        }, {delayIncrement: 0.5}),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: 'bullet'
            }
        }, {delayIncrement: 0.5}), 2)
    ]
}
Class.hexaTrapper = makeAuto(makeFlank('trapper', 6, "", {extraStats: [g.hexaTrapper], delayIncrement: 0.5, danger: 6}), "Hexa-Trapper")
Class.hexaWhirl = makeWhirlwind('hexaTank', {label: "Hexa Whirl"})
Class.hybrid = makeOver('destroyer', "Hybrid", preset.makeOver.hybrid)
Class.infestor = {
    PARENT: 'genericTank',
    LABEL: "Infestor",
    DANGER: 7,
    NECRO: [0],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 10,
            WIDTH: 6,
            ASPECT: 1.2,
            X: 3,
            Y: 5,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.5}]),
            TYPE: 'eggchip',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'necro',
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 10
        }
    }), 2)
}
Class.itHurtsDontTouchIt = {
    PARENT: 'genericFlail',
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
    PARENT: 'genericTank',
    LABEL: "Iterator",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: [
        {
            POSITION: [22, 8, -4/3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['superSplitterBullet', {CONTROLLERS: ['snake']}] // nerf supersplitter when
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
    PARENT: 'genericSmasher',
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
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}]
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
                TYPE: ['bullet', { ALPHA: 0 }]
            }
        }
    ]
}
Class.landmine = {
    PARENT: 'genericSmasher',
    LABEL: "Landmine",
    INVISIBLE: [0.06, 0.01],
    TOOLTIP: "Stay still to turn invisible.",
    BODY: {
        SPEED: 1.1 * base.SPEED
    },
    TURRETS: [
        {
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}],
            POSITION: {
                SIZE: 21.5
            }
        },
        {
            TYPE: ['hexagonHat_spinFaster', {COLOR: 'black'}],
            POSITION: {
                SIZE: 21.5,
                ANGLE: 90
            }
        }
    ]
}
Class.machineGunner = {
    PARENT: 'genericTank',
    LABEL: "Machine Gunner",
    DANGER: 7,
    BODY: {
        SPEED: 0.9 * base.SPEED
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                X: -3,
                Y: 5,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                Y: -2.5,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: 'bullet'
            }
        }], {delayIncrement: 0.2}),
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                X: 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.machineGunner]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.maelstrom = makeAuto('whirlwind_old', "Maelstrom")
Class.manager = {
    PARENT: 'genericTank',
    LABEL: "Manager",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { reload: 0.5 }]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            }
        }
    ]
}
Class.maleficitor = {
    PARENT: 'genericTank',
    LABEL: "Maleficitor",
    DANGER: 7,
    NECRO: [4],
    TOOLTIP: "Press R and wait to turn your drones invisible.",
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: base.SPEED * 0.85,
        FOV: base.FOV * 1.1
    },
    SHAPE: 4,
    MAX_CHILDREN: 20,
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 7.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.maleficitor]),
                TYPE: ['sunchip', {INVISIBLE: [0.06, 0.03]}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'necro',
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
            },
        },
    ],
}
Class.master = {
    PARENT: 'genericTank',
    LABEL: "Master",
    DANGER: 7,
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 16
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: 'masterBullet',
                MAX_CHILDREN: 4,
                DESTROY_OLDEST_CHILD: true
            }
        },
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 14,
                    WIDTH: 8,
                    ANGLE: 135,
                    DELAY: 0.6
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                    TYPE: 'bullet',
                    LABEL: "Thruster"
                }
            },
            {
                POSITION: {
                    LENGTH: 16,
                    WIDTH: 8,
                    ANGLE: 150,
                    DELAY: 0.1
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                    TYPE: 'bullet',
                    LABEL: "Thruster"
                }
            }
        ])
    ]
}
Class.medic = {
    PARENT: 'genericHealer',
    LABEL: "Medic",
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.sniper]),
                TYPE: 'healerBullet'
            }
        }
    ]
}
Class.mega3 = makeRadialAuto('megaAutoTankGun', {isTurret: true, danger: 7, size: 14, label: "Mega-3", body: {SPEED: 0.95 * base.SPEED}})
Class.megaAutoTrapper = makeAuto('trapper', "Mega Auto-Trapper", preset.makeAuto.mega)
Class.megaSmasher = {
    PARENT: 'genericSmasher',
    LABEL: "Mega-Smasher",
    BODY: {
        SPEED: 1.05 * base.SPEED,
        FOV: 1.1 * base.FOV,
        DENSITY: 4 * base.DENSITY
    },
    TURRETS: [
        {
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}],
            POSITION: { SIZE: 25 }
        }
    ]
}
Class.megaTornado = makeWhirlwind('genericTank', {hat: "diamondHat_spin", hatSize: 16, satellites: 2, satelliteSize: 16, extraStats: [g.pounder, g.destroyer], label: "Mega-Tornado", danger: 7})
Class.mender = {
    PARENT: 'genericTank',
    LABEL: "Mender",
    DANGER: 7,
    TOOLTIP: "Right click to heal yourself (use sparingly, has a long cooldown once used!)",
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 6,
                Y: -4,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 9.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Heavy"
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 10,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 20,
                X: 15,
                ANGLE: 180 // todo: work out delay/cooldown + make healer bullet work
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                g.basic,
                    g.pounder,
                    g.destroyer,
                    //[2, 0, 1, 1, 1, -1, 1, 1, 1, 0.1, 1, 1, 1],
                    { speed: -4, maxSpeed: -4 },
                    g.healer
                ]),
                TYPE: 'healerBullet',
                ALT_FIRE: true
            }
        }
    ],
    TURRETS: [
        {
            TYPE: ["triangleHat", {COLOR: 'grey'}],
            POSITION: { SIZE: 7, LAYER: 1 }
        }
    ]
}
Class.monsoon = makeWhirlwind({
    PARENT: 'genericTank',
    TURRETS: [
        {
            TYPE: ['hexagonHat_spin', {COLOR: 'black'}],
            POSITION: {SIZE: 26}
        }
    ]
}, {hat: 'circleHat', hatSize: 24, hatLayer: 0, satellites: 6, satelliteType: "satellite_old", label: "Monsoon", danger: 7})
Class.mortar = {
    PARENT: 'genericTank',
    LABEL: "Mortar",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 3,
                Y: -8,
                ANGLE: -3.5,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -3.5,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }], {delayIncrement: 0.2}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Heavy"
            }
        }
    ]
}
Class.munition = makeWhirlwind('artillery', {label: "Munition"})
Class.musket = {
    PARENT: 'genericTank',
    LABEL: "Musket",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 7,
                Y: 6.15
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 4.15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin]),
                TYPE: 'bullet'
            }
        }
    ], {delayIncrement: 0.5})
}
Class.nailgun = {
    PARENT: 'genericTank',
    LABEL: "Nailgun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
        SPEED: base.SPEED * 0.9
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 3,
                Y: -2,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, {size: 2/3}]),
                TYPE: 'bullet'
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 7,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.necromancer = {
    PARENT: 'genericTank',
    LABEL: "Necromancer",
    DANGER: 7,
    NECRO: [4],
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: base.FOV * 1.1
    },
    SHAPE: 4,
    MAX_CHILDREN: 14,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 7.4,
            DELAY: 0.25
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
            TYPE: 'sunchip',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'necro',
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false
        }
    }, 4, {delayIncrement: 0.75})
}
Class.nimrod = {
    PARENT: 'genericTank',
    LABEL: "Nimrod",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.3
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 6.5,
                ASPECT: 2.2
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 6.4,
                ASPECT: 2.2,
                X: 5
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.marksman]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.marksman]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.octoTank = {
    PARENT: 'genericTank',
    LABEL: "Octo Tank",
    DANGER: 7,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: 'bullet'
            }
        }
    ], 4)
}
Class.ordnance = {
    PARENT: 'genericTank',
    LABEL: "Ordnance",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -4.45,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: 'bullet',
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.oroboros = {
    PARENT: 'genericTank',
    LABEL: "Oroboros",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank is a placeholder!",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 14
            },
            PROPERTIES: { // guessing since there's no footage of this tank in action
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.desmos]),
                TYPE: ['spiralBullet', {CONTROLLERS: ['snake']}]
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 14
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 6,
                ASPECT: -4,
                X: -7.5,
                Y: -7,
                ANGLE: 90
            }
        })
    ]
}
Class.overdrive = makeDrive('overseer', {label: "Overdrive"})
Class.overgunner = makeOver({
    PARENT: 'genericTank',
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 2,
                Y: -2.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: 'bullet'
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        }
    ]
})
Class.overlord = {
    PARENT: 'genericTank',
    LABEL: "Overlord",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    MAX_CHILDREN: 8,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: 'drone',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'drone',
            WAIT_TO_CYCLE: true
        }
    }, 4)
}
Class.overtrapper = makeOver({
    PARENT: 'genericTank',
    LABEL: "Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.5,
                X: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }
    ]
})
Class.paramedic = {
    PARENT: 'genericHealer',
    LABEL: "Paramedic",
    BODY: {
        SPEED: base.SPEED * 0.9
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 11,
                WIDTH: 6,
                ASPECT: -0.4,
                X: 8,
                Y: 2,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                Y: 2,
                ANGLE: 18,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                TYPE: 'healerBullet',
            },
        }]),
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 11
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.healer]),
                TYPE: 'healerBullet'
            }
        }
    ]
}
Class.pentaShot = {
    PARENT: 'genericTank',
    LABEL: "Penta Shot",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 3,
                ANGLE: 30,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 15,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.phoenix = makeBird('sprayer', "Phoenix")
Class.poacher = makeOver('hunter', "Poacher", preset.makeOver.hybrid)
Class.predator = {
    PARENT: 'genericTank',
    LABEL: "Predator",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ['zoom'],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.predator]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 14,
                DELAY: 0.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.prodigy = {
    PARENT: 'genericTank',
    LABEL: "Prodigy",
    DANGER: 7,
    STAT_NAMES: {
        ...statnames.mixed,
        RELOAD: "Reload / Max Drone Count"
    },
    SHAPE: 6,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponArray({
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: 1.6,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.5, size: 2, damage: 0.95}]),
                TYPE: 'sunchip',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'necro',
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 2
            },
        }, 3, {delayIncrement: 1/3}),
        ...weaponArray([{
            POSITION: {
                LENGTH: 14,
                WIDTH: 9
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        }], 3)
    ],
}
Class.prophet = makeWhirlwind('underseer', {label: "Prophet", satelliteType: 'squareSatellite'})
Class.python = {
    PARENT: 'genericTank',
    LABEL: "Python", //"Super Spiral",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ['pythonBullet', {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 6,
                ASPECT: -4,
                X: -6.75,
                Y: -6,
                ANGLE: 87.5
            }
        })
    ]
}
Class.quadBuilder = {
    PARENT: 'genericTank',
    LABEL: "Quad Builder",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.15 * base.FOV
    },
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 6,
                ANGLE: 45
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 6,
                ASPECT: 1.1,
                X: 14,
                ANGLE: 45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                TYPE: 'setTrap'
            }
        }
    ], 4)
}
Class.quadruplex = {
    PARENT: 'genericTank',
    LABEL: "Quadruplex",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: -135
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: -45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 135
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: 50}]]}]
            }
        },
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 45
            }
        }, {delayIncrement: 0.5}), 4)
    ]
}
Class.ranger = {
    PARENT: 'genericTank',
    LABEL: "Ranger",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 32,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.redistributor = {
    PARENT: 'genericTank',
    LABEL: "Redistributor",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 7,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 10,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.revolver = {
    PARENT: 'genericTank',
    LABEL: "Revolver",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: 2.2,
                X: 5
            }
        }, 2, {xPosOffset: 5}),
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
                TYPE: 'bullet'
            }
        }
    ]
}
Class.rimfire_old = {
    PARENT: 'genericTank',
    LABEL: "Rimfire",
    UPGRADE_LABEL: "Old Rimfire",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: 7.25,
                ANGLE: 10,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, {speed: 1.2}]),
                TYPE: 'bullet'
            }
        }
    ], {delayIncrement: 0.25})
}
Class.riptide = {
    PARENT: 'genericTank',
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
                TYPE: 'undertowBullet'
            }
        },
        ...weaponMirror({
            POSITION: [17, 16, 0.1, 0.25, 4, 13.5, 0]
        })
    ]
}
Class.rocket = makeSnake({
    PARENT: 'genericTank',
    DANGER: 6,
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                ANGLE: 135,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}, 2, "Rocket", {segmentGuns: weaponMirror({
    POSITION: {
        LENGTH: 14,
        WIDTH: 8,
        ANGLE: 135,
        DELAY: 0.1
    },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
        TYPE: 'bullet',
        LABEL: "Thruster"
    }
})})
Class.rocketeer = {
    PARENT: 'genericTank',
    LABEL: "Rocketeer",
    DANGER: 7,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 7.73,
                ASPECT: 1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.rocketeer]),
                TYPE: 'rocketeerMissile',
                STAT_CALCULATOR: 'sustained',
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 11,
                ASPECT: -1.5
            }
        }
    ]
}
Class.septaTrapper = {
    PARENT: 'genericTank',
    LABEL: "Septa-Trapper",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.8
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
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
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: 'trap',
                STAT_CALCULATOR: 'trap'
            }
        },
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 7,
                    ANGLE: 360/7,
                    DELAY: 1/3
                }
            },
            {
                POSITION: {
                    LENGTH: 3,
                    WIDTH: 7,
                    ASPECT: 1.7,
                    X: 15,
                    ANGLE: 360/7,
                    DELAY: 1/3
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                    TYPE: 'trap',
                    STAT_CALCULATOR: 'trap'
                }
            },
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 7,
                    ANGLE: 360/7 * 2,
                    DELAY: 2/3
                }
            },
            {
                POSITION: {
                    LENGTH: 3,
                    WIDTH: 7,
                    ASPECT: 1.7,
                    X: 15,
                    ANGLE: 360/7 * 2,
                    DELAY: 2/3
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                    TYPE: 'trap',
                    STAT_CALCULATOR: 'trap'
                }
            },
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 7,
                    ANGLE: 360/7 * 3,
                    DELAY: 1
                }
            },
            {
                POSITION: {
                    LENGTH: 3,
                    WIDTH: 7,
                    ASPECT: 1.7,
                    X: 15,
                    ANGLE: 360/7 * 3,
                    DELAY: 1
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                    TYPE: 'trap',
                    STAT_CALCULATOR: 'trap'
                }
            }
        ], {delayOverflow: true})
    ]
}
Class.septaTrapper_old = makeFlank('trapper', 7, "Septa Trapper", {extraStats: [g.hexaTrapper], delayIncrement: 4/7, danger: 7, noRecoil: true})
Class.septaTrapper_old.UPGRADE_LABEL = "Old Septa Trapper"
Class.shotgun = {
    PARENT: 'genericTank',
    LABEL: "Shotgun",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 4,
                WIDTH: 3,
                X: 11,
                Y: 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 4,
                X: 12,
                Y: 1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 3,
                X: 13,
                Y: 1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 2,
                X: 13,
                Y: 2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: 'casing'
            }
        }]),
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 4,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 14,
                X: 6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.fake]),
                TYPE: 'casing'
            }
        },
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 14,
                ASPECT: -1.3,
                X: 4
            }
        }
    ]
}
Class.sidewinder = {
    PARENT: 'genericTank',
    LABEL: "Sidewinder",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.3 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 11,
                ASPECT: -0.5,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 12,
                ASPECT: -1.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder]),
                TYPE: 'snake',
                STAT_CALCULATOR: 'sustained'
            }
        }
    ]
}
Class.single = {
    PARENT: 'genericTank',
    LABEL: "Single",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.skimmer = {
    PARENT: 'genericTank',
    LABEL: "Skimmer",
    DANGER: 7,
    BODY: {
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 14,
                ASPECT: -0.5,
                X: 9
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer]),
                TYPE: 'missile',
                STAT_CALCULATOR: 'sustained',
            },
        },
    ],
}
Class.sniperRifle = {
    PARENT: 'genericTank',
    LABEL: "Sniper Rifle",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.35
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 28,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.rifle]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5
            }
        }
    ]
}
Class.spike = {
    PARENT: 'genericSmasher',
    LABEL: "Spike",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        DAMAGE: base.DAMAGE * 1.1
    },
    TURRETS: weaponArray([{
        TYPE: ['triangleHat_spin', {COLOR: 'black'}],
        POSITION: {SIZE: 18}
    }], 4)
}
Class.spike_old = {
    PARENT: 'genericTank',
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
            TYPE: ['triangleHat_spinFast', {COLOR: 'black'}],
            POSITION: {
                SIZE: 20.5
            }
        },
        {
            TYPE: 'triangleHat_weirdSpike',
            POSITION: {
                SIZE: 20.5,
                ANGLE: 180
            }
        }
    ]
}
Class.splasher = {
    PARENT: 'genericTank',
    LABEL: "Splasher",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.sprayer_old = {
    PARENT: 'genericTank',
    LABEL: "Sprayer",
    UPGRADE_LABEL: "Old Sprayer",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.25
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8,
                ASPECT: 1.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: 1.7,
                X: -1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.gatlingGun]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.spreadRifle = {
    PARENT: 'genericTank',
    LABEL: "Spread Rifle",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 3,
                Y: 3.5,
                ANGLE: 2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                Y: 3.75,
                ANGLE: 4,
                DELAY: 0.08
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3,
                Y: 4,
                ANGLE: 6,
                DELAY: 0.16
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.crossbow, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        }]),
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5
            }
        }
    ]
}
Class.spreadshot = {
    PARENT: 'genericTank',
    LABEL: "Spreadshot",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 4,
                Y: 0.8,
                ANGLE: 71.5,
                DELAY: 5/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 14.5,
                WIDTH: 4,
                Y: 1,
                ANGLE: 56.5,
                DELAY: 4/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                Y: 1.2,
                ANGLE: 41.5,
                DELAY: 3/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 17.5,
                WIDTH: 4,
                Y: 1.4,
                ANGLE: 26.5,
                DELAY: 2/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 4,
                Y: 1,
                ANGLE: 15,
                DELAY: 1/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        }]),
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshotMain, g.spreadshot]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.spreadshot_old = {
    PARENT: 'genericTank',
    LABEL: "Spreadshot",
    UPGRADE_LABEL: "Old Spreadshot",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 4,
                Y: 0.8,
                ANGLE: 75,
                DELAY: 5/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 14.5,
                WIDTH: 4,
                Y: 1,
                ANGLE: 60,
                DELAY: 4/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 4,
                Y: 1.6,
                ANGLE: 45,
                DELAY: 3/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 17.5,
                WIDTH: 4,
                Y: 2.4,
                ANGLE: 30,
                DELAY: 2/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 4,
                Y: 3,
                ANGLE: 15,
                DELAY: 1/6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.artillery, g.twin, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Spread"
            }
        }]),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 10,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.spreadshot, g.spreadshot]),
                TYPE: 'bullet',
                LABEL: "Pounder"
            }
        }
    ]
}
Class.stalker = {
    PARENT: 'genericTank',
    LABEL: "Stalker",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.35 * base.FOV
    },
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8,
                ASPECT: -1.77
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.streamliner = {
    PARENT: 'genericTank',
    LABEL: "Streamliner",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 25,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
            TYPE: 'bullet'
        }
    }, 5, {lengthOffset: 2, delayIncrement: 0.2})
}
Class.subverter = {
    PARENT: 'genericTank',
    LABEL: "Subverter",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 14
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun]),
            TYPE: 'bullet'
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3})
}
Class.surfer = {
    PARENT: 'genericTank',
    LABEL: "Surfer",
    BODY: {
        DENSITY: 0.6 * base.DENSITY
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: 'bullet',
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 7,
                WIDTH: 7.5,
                ASPECT: 0.6,
                X: 7,
                Y: 1,
                ANGLE: -90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: 'autoswarm',
                STAT_CALCULATOR: 'swarm'
            }
        }]),
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: 'bullet',
                LABEL: "Thruster"
            }
        })
    ]
}
Class.surgeon = {
    PARENT: 'genericHealer',
    LABEL: "Surgeon",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: base.SPEED * 0.75,
        FOV: base.FOV * 1.15,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 10,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                X: 14.5
            }
        },
        {
            POSITION: {
                LENGTH: 1.5,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 17
            },
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, { speed: 0.9, maxSpeed: 0.9 }]),
                TYPE: 'medkit',
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'block'
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 13
            }
        }
    ]
}
Class.swarmer = {
    PARENT: 'genericTank',
    LABEL: "Swarmer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 13,
                ASPECT: -1.2,
                X: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive]),
                TYPE: 'hive'
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 12,
                X: 5
            }
        }
    ]
}
Class.tempest = makeWhirlwind('genericTank', {dualLayer: true, hat: "triangleHat_spin", hat2: "triangleHat_spinReverse", hat2Size: 4, satellites: 3, satelliteSize: 12, extraStats: [g.pounder], label: "Tempest", danger: 7})
Class.thunderbolt = makeWhirlwind('genericTank', {hat: "squareHat_spinFast", hatSize: 10, satellites: 4, satelliteSize: 12, satelliteSpeed: 2.5, extraStats: [g.pounder], label: "Thunderbolt", danger: 7})
Class.tornado_old = makeWhirlwind('genericTank', {hat: 'circleHat', hatSize: 30, hatLayer: 0, satellites: 1, satelliteSize: 16, satelliteType: "satellite_old", extraStats: [g.pounder, g.destroyer], label: "Tornado", danger: 7})
Class.triBlaster = {
    PARENT: 'genericTank',
    LABEL: "Tri-Blaster",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 4,
                Y: 2,
                ANGLE: 15,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.lowPower]),
                TYPE: 'bullet'
            }
        }),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.tripleAutoTrapper = makeAuto('trapper', "Triple Auto-Trapper", preset.makeAuto.triple)
Class.tripleFlail = {
    PARENT: 'genericFlail',
    LABEL: "Triple Flail",
    DANGER: 7,
    TURRETS: weaponArray(Class.flail.TURRETS, 3)
}
Class.tripleMachine = makeFlank('machineGun', 3, "Triple Machine", {extraStats: [g.flankGuard, g.flankGuard], danger: 7})
Class.tripleTwin = makeFlank('twin', 3, "Triple Twin", {extraStats: [g.spam, g.doubleTwin, g.tripleTwin], danger: 7})
Class.triplet = {
    PARENT: 'genericTank',
    LABEL: "Triplet",
    DANGER: 7,
    BODY: {
        FOV: 1.05 * base.FOV
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17.5,
                WIDTH: 8,
                Y: 5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: 'bullet'
            }
        }),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.triplex = {
    PARENT: 'genericTank',
    LABEL: "Triplex",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: 'bullet',
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ['bullet', {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -4.75,
                Y: -5,
                ANGLE: 45
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 22.5
            }
        }], {delayIncrement: 0.5}),
    ]
}
Class.twister = {
    PARENT: 'genericTank',
    LABEL: "Twister",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    TOOLTIP: "Hold right click to reverse missile rotation.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 13,
                ASPECT: -0.5,
                X: 9
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 14,
                ASPECT: -1.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {speed: 0.6, reload: 4/3, shudder: 0.1}]),
                TYPE: 'spinmissile',
                STAT_CALCULATOR: 'sustained+lowspeed'
            }
        }
    ]
}
Class.typhoon = makeWhirlwind('genericTank', {hat: "decagonHat_spin", satellites: 10, label: "Typhoon", danger: 7})
Class.typhoon_old = makeWhirlwind('genericTank', {dualLayer: true, hat: 'circleHat', hatSize: 28, hatLayer: 0, hat2: 'circleHat', hat2Size: 24, hat2Layer: 0, satellites: 6, satelliteType: "satellite_old", label: "Typhoon"})
Class.vortex = makeWhirlwind('launcher', {label: "Vortex"})
Class.vortex_old = makeWhirlwind('genericTank', {enableHat2: true, hat: "pentagonHat_spin", hatSize: 21.5, hatLayer: 0, hat2: "pentagonHat_spin", hat2Size: 21.5, hat2Layer: 0, satellites: 10, satelliteType: "satellite_old", label: "Vortex"})
Class.vulture = makeBird({
    PARENT: 'genericTank',
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 7,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7.5,
                ASPECT: -1.5,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {size: 7/7.5}]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ASPECT: -1.5,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, {size: 7/8}]),
                TYPE: 'bullet'
            }
        }
    ]
}, "Vulture")
Class.whirlGuard = makeWhirlwind('trapGuard', {label: "Whirl Guard"})
Class.whirl3 = makeWhirlwind("auto3", {label: "Whirl-3"})
Class.wrangler = { // old bender, fires train minions with 3 bodies (though only one of them has a gun)
    PARENT: 'genericTank',
    LABEL: "Wrangler", //"Ranch",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0]
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.minion, g.spawner]),
                TYPE: 'wranglerMinion',
                STAT_CALCULATOR: 'drone',
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
    PARENT: 'genericTank',
    LABEL: "X-Hunter",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: [['zoom', {distance: 550}]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 12.5,
                WIDTH: 11,
                ASPECT: -1.65
            }
        }
    ]
}

// Tier 4
Class.heptaAutoBasic = makeAuto('basic', "Hepta Auto-Basic", preset.makeAuto.hepta)
Class.ransacker_old = makeGuard('rifle_old')

// Tierless / Fun
Class.alas = {
    PARENT: 'genericTank',
    LABEL: "Alas",
    DANGER: 9,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {speed: 5}]),
                TYPE: 'drone',
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: 'drone',
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 0.125,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.bigBalls = {
    PARENT: 'genericTank',
    LABEL: "BIG Balls",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 14,
            WIDTH: 14,
            ASPECT: 1.5,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.bigBalls]),
            TYPE: 'bigBall',
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: 'drone',
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 1
        }
    }, 2)
}
Class.damoclone = {
    PARENT: 'genericTank',
    LABEL: "Damoclone",
    COLOR: 'trans',
    HAS_NO_RECOIL: true,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 16,
            WIDTH: 4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone, g.spam]),
            TYPE: 'bullet'
        }
    }, 24, {delayIncrement: 1/24})
}
Class.literallyAMachineGun = {
    PARENT: 'genericTank',
    LABEL: "Literally a Machine Gun",
    UPGRADE_LABEL: "L.a.M.G.",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    TURRETS: [
        {
            TYPE: 'lamgSpinnerTurret',
            POSITION: {
                SIZE: 10,
                X: 14,
                LAYER: 1
            }
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 2,
                DELAY: 2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([{spray: 0, recoil: 0, shudder: 0, reload: 2, speed: 5, maxSpeed: 5}]),
                TYPE: 'bullet',
                FIXED_RELOAD: true
            }
        },
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            }
        }
    ]
}
Class.machineShot = {
    PARENT: 'genericTank',
    LABEL: "Machine Shot",
    DANGER: 7,
    BODY: Class.pentaShot.BODY,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 3,
                ANGLE: 30,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 15,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: 'bullet'
            }
        }]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.meDoingYourMom = {
    PARENT: 'genericTank',
    LABEL: "Me doing your mom",
    UPGRADE_LABEL: "M.D.Y.M.",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 128,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { recoil: 0.01, reload: 0.01 }]),
                FIXED_RELOAD: true,
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.meOnMyWayToDoYourMom = {
    PARENT: 'genericTank',
    LABEL: "Me on my way to do your mom",
    UPGRADE_LABEL: "MOMWTDYM",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 19.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 0.01, recoil: 10, spray: 1 }]),
                TYPE: 'bullet'
            }
        }
    ]
}
Class.protector = {
    PARENT: 'genericTank',
    LABEL: "Protector",
    DANGER: 8,
    BODY: {
        FOV: 1.25
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pounder]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: 'setTrap',
                STAT_CALCULATOR: 'block'
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 13,
                ASPECT: -1.3,
                X: 6
            }
        }
    ]
}
Class.rapture = {
    PARENT: 'genericTank',
    LABEL: "Rapture",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 22.5,
                WIDTH: 19.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: 'speedBullet'
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 12.78,
                ASPECT: -1.5,
                X: 3
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 13,
                X: 18.5
            }
        }
    ]
}
Class.tetraGunner = {
    PARENT: 'genericTank',
    LABEL: "Tetra Gunner",
    DANGER: 7,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 14,
                WIDTH: 4.5,
                Y: 3,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, size: 0.75 }]),
                TYPE: 'bullet'
            }
        }),
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 3.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: 'bullet'
            }
        },
    ], 4)
}
Class.tracker3 = {
    PARENT: 'genericTank',
    LABEL: "Tracker-3",
    FACING_TYPE: ['spin', {speed: 0.02}],
    SKILL_CAP: [0, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
    TURRETS: weaponArray({
        TYPE: ['tracker3gun', {INDEPENDENT: true}],
        POSITION: {
            SIZE: 11,
            X: 8,
            ARC: 190
        }
    }, 3)
}
Class.undercoverCop = {
    PARENT: "booster",
    LABEL: "Undercover Cop",
    UPGRADE_COLOR: 20,
    UPGRADE_TOOLTIP: "WOOP WOOP! That's the sound of da police!",
    PROPS: [
        {
            TYPE: 'hexagonBlue',
            POSITION: {
                SIZE: 6,
                Y: 8,
                LAYER: 1
            }
        },
        {
            TYPE: 'hexagonRed',
            POSITION: {
                SIZE: 6,
                Y: -8,
                LAYER: 1
            }
        },
        {
            TYPE: 'squareBlue',
            POSITION: {
                SIZE: 6,
                Y: 3,
                LAYER: 1
            }
        },
        {
            TYPE: 'squareRed',
            POSITION: {
                SIZE: 6,
                Y: -3,
                LAYER: 1
            }
        }
    ]
}
Class.worstTank = {
    PARENT: 'genericTank',
    LABEL: "Worst Tank",
    DANGER: 7,
    BODY: Class.machineGunner.BODY,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                X: -3,
                Y: 5,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                TYPE: 'bullet'
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                Y: -2.5,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                TYPE: 'bullet'
            }
        }], {delayIncrement: 0.2}),
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3,
                ASPECT: 4,
                X: 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                TYPE: 'bullet'
            }
        }
    ]
}

// Class Tree
Class.basic.UPGRADES_TIER_1 = ['twin', 'sniper', 'machineGun', 'flankGuard', 'director', 'pounder', 'trapper', 'desmos']
    Class.basic.UPGRADES_TIER_2 = ['smasher']
        Class.smasher.UPGRADES_TIER_3 = ['megaSmasher', 'spike', 'autoSmasher', 'landmine']
        Class.healer.UPGRADES_TIER_3 = ['medic', 'ambulance', 'surgeon', 'paramedic']

    Class.twin.UPGRADES_TIER_2 = ['doubleTwin', 'tripleShot', 'gunner', 'hexaTank', 'helix']
        Class.twin.UPGRADES_TIER_3 = ['dual', 'bulwark', 'musket']
        Class.doubleTwin.UPGRADES_TIER_3 = ['tripleTwin', 'hewnDouble', 'autoDouble', 'bentDouble']
        Class.tripleShot.UPGRADES_TIER_3 = ['pentaShot', 'spreadshot', 'bentHybrid', 'bentDouble', 'triplet', 'triplex']
        Class.gunner.UPGRADES_TIER_3 = ['autoGunner', 'nailgun', 'auto4', 'machineGunner', 'gunnerTrapper', 'cyclone', 'overgunner']

    Class.sniper.UPGRADES_TIER_2 = ['assassin', 'hunter', 'minigun', 'rifle', 'marksman']
        Class.sniper.UPGRADES_TIER_3 = ['bushwhacker']
        Class.assassin.UPGRADES_TIER_3 = ['ranger', 'falcon', 'stalker', 'autoAssassin', 'single', 'deadeye']
        Class.hunter.UPGRADES_TIER_3 = ['predator', 'xHunter', 'poacher', 'ordnance', 'dual', 'nimrod']
        Class.rifle.UPGRADES_TIER_3 = ['musket', 'crossbow', 'armsman', 'revolver']
        Class.marksman.UPGRADES_TIER_3 = ['deadeye', 'nimrod', 'revolver', 'fork']

    Class.machineGun.UPGRADES_TIER_2 = ['artillery', 'minigun', 'gunner', 'sprayer']
        Class.minigun.UPGRADES_TIER_3 = ['streamliner', 'nailgun', 'cropDuster', 'barricade', 'vulture']
        Class.sprayer.UPGRADES_TIER_3 = ['redistributor', 'phoenix', 'atomizer', 'focal']
        Class.blaster.UPGRADES_TIER_3 = ['triBlaster', 'splasher', 'flamethrower', 'halfNHalf', 'subverter']
        Class.gatlingGun.UPGRADES_TIER_3 = ['focal', 'accurator', 'halfNHalf']
        Class.doubleMachine.UPGRADES_TIER_3 = ['tripleMachine', 'halfNHalf']

    Class.flankGuard.UPGRADES_TIER_2 = ['hexaTank', 'triAngle', 'auto3', 'trapGuard', 'triTrapper']
        Class.flankGuard.UPGRADES_TIER_3 = ['tripleTwin', 'quadruplex']
        Class.hexaTank.UPGRADES_TIER_3 = ['octoTank', 'cyclone', 'hexaTrapper'/*, 'hexaWhirl'*/]
        Class.triAngle.UPGRADES_TIER_3 = ['fighter', 'booster', 'falcon', 'bomber', 'autoTriAngle', 'surfer', 'eagle', 'phoenix', 'vulture']
        Class.auto3.UPGRADES_TIER_3 = ['auto5', 'mega3', 'auto4', 'banshee'/*, 'whirl3'*/]

    Class.director.UPGRADES_TIER_2 = ['overseer', 'cruiser', 'underseer', 'spawner']
        Class.director.UPGRADES_TIER_3 = ['manager', 'bigCheese']
        Class.overseer.UPGRADES_TIER_3 = ['overlord', 'overtrapper', 'overgunner', 'banshee', 'autoOverseer', 'overdrive', 'commander']
        Class.cruiser.UPGRADES_TIER_3 = ['carrier', 'battleship', 'fortress', 'autoCruiser', 'commander']
        Class.underseer.UPGRADES_TIER_3 = ['necromancer', 'maleficitor', 'infestor'/*, 'prophet'*/]
        Class.spawner.UPGRADES_TIER_3 = ['factory', 'autoSpawner'/*, 'bender'*/]

    Class.pounder.UPGRADES_TIER_2 = ['destroyer', 'builder', 'artillery', 'launcher'/*, 'volute'*/]
        Class.pounder.UPGRADES_TIER_3 = ['shotgun', 'eagle']
        Class.destroyer.UPGRADES_TIER_3 = ['conqueror', 'annihilator', 'hybrid', 'construct']
        Class.artillery.UPGRADES_TIER_3 = ['mortar', 'ordnance', 'beekeeper', 'fieldGun'/*, 'munition'*/]
        Class.launcher.UPGRADES_TIER_3 = ['skimmer', 'twister', 'swarmer', 'sidewinder'/*, 'rocketeer'*/, 'fieldGun'/*, 'vortex'*/]

    Class.trapper.UPGRADES_TIER_2 = ['builder', 'triTrapper', 'trapGuard']
        Class.trapper.UPGRADES_TIER_3 = ['barricade', 'overtrapper']
        Class.builder.UPGRADES_TIER_3 = ['construct', 'autoBuilder', 'engineer', 'boomer', 'assembler', 'architect', 'conqueror']
        Class.triTrapper.UPGRADES_TIER_3 = ['fortress', 'hexaTrapper', 'septaTrapper', 'architect']
        Class.trapGuard.UPGRADES_TIER_3 = ['bushwhacker', 'gunnerTrapper', 'bomber', 'conqueror', 'bulwark'/*, 'whirlGuard'*/]
        Class.autoTrapper.UPGRADES_TIER_3 = ['megaAutoTrapper', 'tripleAutoTrapper', 'autoBuilder', 'hexaTrapper']

    Class.whirlwind.UPGRADES_TIER_2 = ['tornado', 'hurricane']
        Class.whirlwind.UPGRADES_TIER_3 = ['hexaWhirl', 'munition', 'whirl3', 'whirlGuard', 'prophet', 'vortex']
        Class.tornado.UPGRADES_TIER_3 = ['megaTornado', 'tempest', 'thunderbolt']
        Class.hurricane.UPGRADES_TIER_3 = ['typhoon', 'blizzard']

    Class.flail.UPGRADES_TIER_2 = ['doubleFlail', 'mace', 'flangle']
        Class.doubleFlail.UPGRADES_TIER_3 = ['tripleFlail']
        Class.mace.UPGRADES_TIER_3 = ['bigMama', 'itHurtsDontTouchIt', 'flace']
        Class.flangle.UPGRADES_TIER_3 = ['flooster', 'flace']

    Class.desmos.UPGRADES_TIER_2 = [/*'volute', */'helix'/*, 'spiral', 'undertow', 'repeater'*/]
        Class.desmos.UPGRADES_TIER_3 = [/*'bender'*/]
        Class.volute.UPGRADES_TIER_3 = ['sidewinder']
        Class.helix.UPGRADES_TIER_3 = ['triplex', 'quadruplex'/*, 'coil', 'duplicator'*/]
        Class.spiral.UPGRADES_TIER_3 = ['coil', 'python'/*, 'wrangler', 'oroboros', 'cocci', 'rocket'*/]
        Class.undertow.UPGRADES_TIER_3 = [/*'riptide'*/]
        Class.repeater.UPGRADES_TIER_3 = ['iterator', 'duplicator']

if (Config.arms_race || Config.retrograde) {
    //Class.basic.UPGRADES_TIER_2
        Class.smasher.UPGRADES_TIER_3.push('bonker')

    //Class.sniper.UPGRADES_TIER_2
        Class.assassin.UPGRADES_TIER_3.push('buttbuttin')

    //Class.machineGun.UPGRADES_TIER_2
        Class.minigun.UPGRADES_TIER_3.push('subverter')
        Class.gunner.UPGRADES_TIER_3.push('battery', 'buttbuttin', 'blower')

    //Class.flankGuard.UPGRADES_TIER_2
        Class.hexaTank.UPGRADES_TIER_3.push('deathStar')

    //Class.pounder.UPGRADES_TIER_2
        Class.pounder.UPGRADES_TIER_3.push('subverter')
        Class.destroyer.UPGRADES_TIER_3.push('blower')
}

if (Config.retrograde) {
    //Class.twin.UPGRADES_TIER_2
        Class.tripleShot.UPGRADES_TIER_3.push('triBlaster')

    Class.machineGun.UPGRADES_TIER_2.push('blaster', 'gatlingGun', 'doubleMachine')
        Class.sprayer.UPGRADES_TIER_3.push('splasher')

    //Class.flankGuard.UPGRADES_TIER_2
        Class.flankGuard.UPGRADES_TIER_3.push('tripleMachine')
}

if (Config.siege) {
    Class.basic.UPGRADES_TIER_2 = ['healer']
    deleteUpgrades('director', 2, ['underseer'])
    deleteUpgrades('whirlwind', 3, ['prophet'])
}
