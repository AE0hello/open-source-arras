const { combineStats, makeAuto, makeBird, makeGuard, makeOver, makeRadialAuto, makeRearGunner, makeTurret, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames } = require('../constants.js')
const g = require('../gunvals.js')

// Settings
const enable_addon = true
const use_original_tree = false // Set to true to enable the original arras.io Arms Race tree and level cap, complete with all the bugs it had.

// Presets
const hybridTankOptions = {count: 1, independent: true, cycle: false}

// Credits
// - u/SkyShredder89: Default Tier 3/4 Sprayer upgrades

// Turrets
Class.healerAutoTankGun = makeTurret({
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
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer]),
                TYPE: "healerBullet",
            }
        }
    ],
    TURRETS: [
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ],
}, {canRepel: true, limitFov: true, fov: 3})

// Tier 2
Class.diesel_AR = {
    PARENT: "genericTank",
    LABEL: "Diesel",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8,
                ANGLE: 0
            }
        }
    ]
}
Class.directordrive_AR = {
    PARENT: "genericTank",
    LABEL: "Directordrive",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    TURRETS: [
        {
            POSITION: {
                SIZE: 9,
                ARC: 360,
                LAYER: 1
            },
            TYPE: "overdriveDeco"
        }
    ],
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
                TYPE: "turretedDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ]
}
Class.doper_AR = {
    PARENT: "genericTank",
    LABEL: "Doper",
    DANGER: 6,
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
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.honcho_AR = {
    PARENT: "genericTank",
    LABEL: "Honcho",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 2,
                ANGLE: 0
            }
        }
    ]
}
Class.machineTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15,
                ANGLE: 0
            }
        }
    ]
}
Class.mech_AR = {
    PARENT: "genericTank",
    LABEL: "Mech",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            }
        }
    ]
}
Class.pen_AR = {
    PARENT: "genericTank",
    LABEL: "Pen",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13
            }
        }
    ]
}
Class.wark_AR = {
    PARENT: "genericTank",
    LABEL: "Wark",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ])
}

// Tier 3
Class.analyzer_AR = {
    PARENT: "genericHealer",
    LABEL: "Analyzer",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 12,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 13
            }
        }
    ]
}
Class.autoArtillery_AR = makeAuto("artillery")
Class.autoAuto3_AR = makeAuto("auto3")
Class.autoDiesel_AR = makeAuto("diesel_AR")
Class.autoDoper_AR = makeAuto("doper_AR")
Class.autoHelix_AR = makeAuto("helix")
Class.autoHexaTank_AR = makeAuto("hexaTank")
Class.autoHoncho_AR = makeAuto("honcho_AR")
Class.autoHunter_AR = makeAuto("hunter")
Class.autoMachineTrapper_AR = makeAuto("machineTrapper_AR")
Class.autoMech_AR = makeAuto("mech_AR")
Class.autoMinigun_AR = makeAuto("minigun")
Class.autoPen_AR = makeAuto("pen_AR")
Class.autoRepeater_AR = makeAuto("repeater")
Class.autoRifle_AR = makeAuto("rifle")
Class.autoSpiral_AR = makeAuto("spiral")
Class.autoSprayer_AR = makeAuto("sprayer")
Class.autoTrapGuard_AR = makeAuto("trapGuard")
Class.autoTripleShot_AR = makeAuto("tripleShot")
Class.autoUnderseer_AR = makeAuto("underseer")
Class.autoVolute_AR = makeAuto("volute")
Class.autoWark_AR = makeAuto("wark_AR")
Class.battery_AR = {
    PARENT: "genericTank",
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
                TYPE: "bullet"
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
                TYPE: "bullet"
            }
        }], 0.2),
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 3.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.bentGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Gunner",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 3.5,
                Y: 8.25,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3.5,
                Y: 4.75,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        }
    ])
}
Class.bentMinigun_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Minigun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                X: -2,
                Y: 2,
                ANGLE: 16
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                X: -2,
                Y: 2,
                ANGLE: 16
            }
        }]),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8
            }
        }
    ]
}
Class.blower_AR = makeRearGunner("destroyer", "Blower")
Class.buttbuttin_AR = makeRearGunner("assassin", "Buttbuttin")
Class.captain_AR = {
    PARENT: "genericTank",
    LABEL: "Captain",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5,
                ANGLE: 90
            },
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 12,
                ANGLE: 90
            }
        }
    ], 2)
}
Class.charger_AR = {
    PARENT: "genericTank",
    LABEL: "Charger",
    DANGER: 7,
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
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 4,
                ASPECT: 0.001,
                X: 18
            }
        }
    ]
}
Class.coalesce_AR = makeOver("wark_AR", "Coalesce", hybridTankOptions)
Class.cobbler_AR = makeOver("mech_AR", "Cobbler", hybridTankOptions)
Class.cog_AR = {
    PARENT: "genericTank",
    LABEL: "Cog",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 4.5,
                ANGLE: 10
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11,
                Y: 4.5,
                ANGLE: 10
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                Y: 4.5,
                ANGLE: 10
            }
        }
    ])
}
Class.cockatiel_AR = makeBird("pen_AR", "Cockatiel")
Class.combo_AR = {
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
            POSITION: {
                SIZE: 11,
                X: 8,
                ANGLE: 180,
                ARC: 190
            },
            TYPE: "autoTankGun",
            INDEPENDENT: true,
        },
    ], 3)
}
Class.courser_AR = {
    PARENT: "genericTank",
    LABEL: "Courser",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 11,
                ASPECT: -1.7
            }
        }
    ]
}
Class.crowbar_AR = {
    PARENT: "genericTank",
    LABEL: "Crowbar",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 40,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: -2
            }
        }
    ],
    TURRETS: [
        {
            POSITION: {
                SIZE: 6,
                X: 40,
                ARC: 180,
                LAYER: 1
            },
            TYPE: [
                "crowbarTurretTank",
                { INDEPENDENT: true }
            ]
        },
        {
            POSITION: {
                SIZE: 6,
                X: 29.75,
                ARC: 180,
                LAYER: 1
            },
            TYPE: [
                "crowbarTurretTank",
                { INDEPENDENT: true }
            ]
        },
        {
            POSITION: {
                SIZE: 6,
                X: 19.5,
                ARC: 180,
                LAYER: 1
            },
            TYPE: [
                "crowbarTurretTank",
                { INDEPENDENT: true }
            ]
        }
    ]
}
Class.deathStar_AR = {
    PARENT: "genericTank",
    LABEL: "Death Star",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.defect_AR = makeBird("tripleShot", "Defect")
Class.deviation_AR = makeOver("machineTrapper_AR", "Deviation", hybridTankOptions)
Class.dieselTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Diesel Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 11,
                ASPECT: 1.6
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 18,
                ASPECT: 1.3,
                X: 17
            }
        }
    ]
}
Class.discharger_AR = {
    PARENT: "genericTank",
    LABEL: "Discharger",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                Y: -5.5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 15,
                Y: -5.5,
                ANGLE: -7
            }
        }]),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            }
        }
    ]
}
Class.doubleFlankTwin_AR = {
    PARENT: "genericTank",
    LABEL: "Double Flank Twin",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                TYPE: "bullet"
            }
        })
    ], 2)
}
Class.doubleGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Double Gunner",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], 0.25), 2)
}
Class.doubleHelix_AR = {
    PARENT: "genericTank",
    LABEL: "Double Helix",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
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
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
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
    ], 2)
}
Class.encircler_AR = {
    PARENT: "genericTank",
    LABEL: "Encircler",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.enforcer_AR = {
    PARENT: "genericTank",
    LABEL: "Enforcer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: -2.2
            }
        }
    ]
}
Class.equalizer_AR = {
    PARENT: "genericTank",
    LABEL: "Equalizer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 12,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 12,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 16,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: -3.75
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 16,
                Y: -3.75
            }
        }
    ],
    TURRETS: []
}
Class.expeller_AR = {
    PARENT: "genericTank",
    LABEL: "Expeller",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ASPECT: 1.4,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            }
        }
    ])
}
Class.fashioner_AR = makeOver("builder", "Fashioner", hybridTankOptions)
Class.faucet_AR = {
    PARENT: "genericTank",
    LABEL: "Faucet",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 1.5,
                ANGLE: 22.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }),
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
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
                TYPE: "bullet"
            }
        }
    ]
}
Class.foamer_AR = {
    PARENT: "genericTank",
    LABEL: "Foamer",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 9
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8
            }
        }
    ]
}
Class.foreman_AR = {
    PARENT: "genericTank",
    LABEL: "Foreman",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    MAX_CHILDREN: 6,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 15,
            ASPECT: 1.3,
            X: 2,
            ANGLE: 90,
        }
    }, 2)
}
Class.foctillery_AR = {
    PARENT: "genericTank",
    LABEL: "Foctillery",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -6,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ],
    TURRETS: []
}
Class.force_AR = makeOver("artillery", "Force", hybridTankOptions)
Class.forger_AR = {
    PARENT: "genericTank",
    LABEL: "Forger",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
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
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 17
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.frother_AR = {
    PARENT: "genericTank",
    LABEL: "Frother",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 5,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.3,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.hitman_AR = makeOver("assassin", "Hitman", hybridTankOptions)
Class.hutch_AR = {
    PARENT: "genericTank",
    LABEL: "Hutch",
    DANGER: 7,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 20.25,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            }
        }
    ])
}
Class.incarcerator_AR = {
    PARENT: "genericTank",
    LABEL: "Incarcerator",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
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
            }
        }
    ]
}
Class.integrator_AR = makeOver("triAngle", "Integrator", hybridTankOptions)
Class.interner_AR = makeOver("pen_AR", "Interner", hybridTankOptions)
Class.jalopy_AR = {
    PARENT: "genericTank",
    LABEL: "Jalopy",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12,
                ASPECT: 1.8,
                X: 6,
                ANGLE: 0
            }
        }
    ]
}
Class.machineGuard_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Guard",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15,
                ANGLE: 180
            }
        }
    ]
}
Class.machineMech_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Mech",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 13,
                ASPECT: 1.2
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.mechGuard_AR = {
    PARENT: "genericTank",
    LABEL: "Mech Guard",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                ANGLE: 180
            }
        }
    ]
}
Class.megaHunter_AR = {
    PARENT: "genericTank",
    LABEL: "Mega Hunter",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 15
            }
        }
    ]
}
Class.megaTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Mega Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.7,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.megaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.mingler_AR = {
    PARENT: "genericTank",
    LABEL: "Mingler",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                ANGLE: 30,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
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
    ], 6, 0.5)
}
Class.nurse_AR = {
    PARENT: "genericHealer",
    LABEL: "Nurse",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9,
                Y: 5.5
            }
        }
    ])
}
Class.operator_AR = {
    PARENT: "genericTank",
    LABEL: "Operator",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            }
        }
    ]
}
Class.peashooter_AR = makeGuard({
    PARENT: "genericTank",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 7.5,
                ASPECT: 0.6,
                X: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}, "Peashooter")
Class.pentaseer_AR = {
    PARENT: "genericTank",
    LABEL: "Pentaseer",
    DANGER: 7,
    NECRO: [4],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 5,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 6,
            WIDTH: 11,
            ASPECT: 1.2,
            X: 7.4,
            ANGLE: 36
        }
    }, 0)
}
Class.polluter_AR = makeOver("diesel_AR", "Polluter", hybridTankOptions)
Class.prober_AR = {
    PARENT: "genericTank",
    LABEL: "Prober",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 5
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 7
            }
        }
    ]
}
Class.psychiatrist_AR = {
    PARENT: "genericHealer",
    LABEL: "Psychiatrist",
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
                WIDTH: 10,
                ASPECT: 1.3
            }
        }
    ]
}
Class.quadAngle_AR = {
    PARENT: "genericTank",
    LABEL: "Quad-Angle",
    DANGER: 7,
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    },
    TURRETS: [
        {
            POSITION: {
                SIZE: 8,
                X: 8,
                ANGLE: 45,
                ARC: 190
            },
            TYPE: "autoTankGun",
        },
        {
            POSITION: {
                SIZE: 8,
                X: 8,
                ANGLE: -45,
                ARC: 190
            },
            TYPE: "autoTankGun",
        },
    ],
    GUNS: weaponMirror({
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
}
Class.queller_AR = {
    PARENT: "genericTank",
    LABEL: "Queller",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -6,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.railgun_AR = {
    PARENT: "genericTank",
    LABEL: "Railgun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7.95
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun]),
                TYPE: "bullet",
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
Class.rimfire_AR = {
    PARENT: "genericTank",
    LABEL: "Rimfire",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 2,
                X: 2,
                Y: -2.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 2,
                X: 2,
                Y: 2.5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 7,
                Y: 5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 7,
                Y: -5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                X: 2
            }
        }
    ]
}
Class.rocketeer_AR = {
    PARENT: "genericTank",
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
                TYPE: "rocketeerMissile",
                STAT_CALCULATOR: "sustained",
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
Class.scientist_AR = {
    PARENT: "genericHealer",
    LABEL: "Scientist",
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            }
        }
    ]
}
Class.shower_AR = makeOver("sprayer", "Shower", hybridTankOptions)
Class.sniper3_AR = makeRadialAuto("sniper3gun", {isTurret: true, danger: 7, size: 13, label: "Sniper-3", body: {SPEED: 0.8 * base.SPEED, FOV: 1.25 * base.FOV}})
Class.soother_AR = {
    PARENT: "genericHealer",
    LABEL: "Soother",
    STAT_NAMES: statnames.drone,
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 10,
                ASPECT: 1.3,
                X: 8
            }
        }
    ]
}
Class.spawnerdrive_AR = {
    PARENT: "genericTank",
    LABEL: "Spawnerdrive",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    TURRETS: [
        {
            POSITION: {
                SIZE: 9,
                ARC: 360,
                LAYER: 1
            },
            TYPE: "overdriveDeco"
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5
            },
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            },
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "turretedMinion",
                STAT_CALCULATOR: "drone",
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
Class.splitShot_AR = {
    PARENT: "genericTank",
    LABEL: "Split Shot",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                X: 8,
                Y: 2,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                X: 4,
                Y: 0.5,
                ANGLE: 15
            }
        }]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            }
        }
    ]
}
Class.stall_AR = {
    PARENT: "genericTank",
    LABEL: "Stall",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 8
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
            }
        }
    ]
}
Class.stormer_AR = {
    PARENT: "genericTank",
    LABEL: "Stormer",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 30,
                WIDTH: 2,
                Y: -2.5,
                ANGLE: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        }),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10
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
                TYPE: "bullet"
            }
        }
    ]
}
Class.subverter_AR = {
    PARENT: "genericTank",
    LABEL: "Subverter",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 14,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 14,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.triHealer_AR = {
    PARENT: "genericHealer",
    LABEL: "Tri-Healer",
    GUNS: weaponArray([
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
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], 3)
}
Class.triMachine_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Machine",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15,
                ANGLE: 0
            }
        }
    ], 3)
}
Class.triMech_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Mech",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            }
        }
    ], 3)
}
Class.triPen_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Pen",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13
            }
        }
    ], 3)
}
Class.triTrapGuard_AR = makeGuard({
    PARENT: "genericTank",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            }
        }], 0)
    ]
}, "Tri-Trap Guard")
Class.underdrive_AR = {
    PARENT: "genericTank",
    LABEL: "Underdrive",
    DANGER: 7,
    NECRO: [4],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 14,
    TURRETS: [
        {
            POSITION: {
                SIZE: 9,
                ARC: 360,
                LAYER: 1
            },
            TYPE: "overdriveDeco"
        }
    ],
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
            TYPE: "turretedSunchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
        }
    }, 2)
}
Class.volley_AR = {
    PARENT: "genericTank",
    LABEL: "Volley",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: -3.75
            }
        }
    ]
}
Class.waarrk_AR = {
    PARENT: "genericTank",
    LABEL: "Waarrk",
    DANGER: 7,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 2,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                Y: 2,
                ANGLE: 18
            }
        }]),
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 17
            }
        }
    ],
    TURRETS: []
}
Class.warkwark_AR = {
    PARENT: "genericTank",
    LABEL: "Warkwark",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]), 2)
}
Class.widget_AR = {
    PARENT: "genericTank",
    LABEL: "Widget",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                ASPECT: 1.4
            }
        }
    ]
}
Class.zipper_AR = {
    PARENT: "genericTank",
    LABEL: "Zipper",
    DANGER: 7,
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
                Y: 1.5,
                ANGLE: 22.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        }
    ]
}

// Tier 4
Class.accountant_AR = {
    PARENT: "genericHealer",
    LABEL: "Accountant",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 14,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 15
            }
        }
    ]
}
Class.actuary_AR = {
    PARENT: "genericHealer",
    LABEL: "Actuary",
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8
            }
        }
    ]
}
Class.autoCoil_AR = makeAuto("coil")
Class.autoDoubleHelix_AR = makeAuto("doubleHelix_AR")
Class.autoDuplicator_AR = makeAuto("duplicator")
Class.autoIterator_AR = makeAuto("iterator")
Class.autoQuadruplex_AR = makeAuto("quadruplex")
Class.autoSuperSpiral_AR = makeAuto("superSpiral")
Class.autoTriplex_AR = makeAuto("triplex")
Class.butcher_AR = makeGuard("hunter", "Butcher")
Class.chemist_AR = {
    PARENT: "genericHealer",
    LABEL: "Chemist",
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            }
        }
    ], 3)
}
Class.clerk_AR = {
    PARENT: "genericHealer",
    LABEL: "Clerk",
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 12,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        }
    ]
}
Class.clinician_AR = {
    PARENT: "genericHealer",
    LABEL: "Clinician",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9,
                Y: 5.5
            }
        }
    ]), 2)
}
Class.doctor_AR = {
    PARENT: "genericHealer",
    LABEL: "Doctor",
    STAT_NAMES: statnames.drone,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 2
            }
        }
    ]
}
Class.doubleCoil_AR = {
    PARENT: "genericTank",
    LABEL: "Double Coil",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: weaponArray([
        {
            POSITION: [20, 8, 0.75, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            },
        },
        {
            POSITION: [20, 8, 0.75, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
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
    ], 2)
}
Class.doubleDuplicator_AR = {
    PARENT: "genericTank",
    LABEL: "Double Duplicator",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: [20, 8, -1.5, 0, 0, 20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            }
        },
        {
            POSITION: [20, 8, -1.5, 0, 0, -20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
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
    ], 2)
}
Class.doubleTriplex_AR = {
    PARENT: "genericTank",
    LABEL: "Double Triplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: "bullet",
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
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
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
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
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
        }]),
    ], 2)
}
Class.duster_AR = {
    PARENT: "genericTank",
    LABEL: "Duster",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 3
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            }
        }
    ]
}
Class.executor_AR = makeGuard("assassin", "Executor")
Class.guru_AR = {
    PARENT: "genericHealer",
    LABEL: "Guru",
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 4,
                ASPECT: -0.4,
                X: 9.5,
                Y: -5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 4,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5,
                ANGLE: 7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: 5,
                ANGLE: 7
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 12,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 13
            }
        }
    ]
}
Class.healer3_AR = {
    PARENT: "genericHealer",
    LABEL: "Healer-3",
    FACING_TYPE: ["spin", {speed: 0.02}],
    TURRETS: [
        ...weaponArray({
            TYPE: "healerAutoTankGun",
            POSITION: {
                SIZE: 11,
                X: 8,
                ARC: 190
            }
        }, 3),
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ]
}
Class.hexaHealer_AR = {
    PARENT: "genericHealer",
    LABEL: "Hexa-Healer",
    GUNS: weaponArray([
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
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], 6, 0.5)
}
Class.hextuplex_AR = {
    PARENT: "genericTank",
    LABEL: "Hextuplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 60
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 120
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 240
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 300
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: -50}]]}]
            }
        },
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 150
            }
        }), 3),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 90
            }
        }), 3)
    ]
}
Class.intern_AR = {
    PARENT: "genericHealer",
    LABEL: "Intern",
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 10
            }
        }
    ]
}
Class.physician_AR = {
    PARENT: "genericSmasher",
    LABEL: "Physician",
    HEALING_TANK: true,
    FACING_TYPE: ["spin", {speed: 0.05}],
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 0,
            WIDTH: 0
        }
    }, 12),
    TURRETS: [
        ...weaponArray({
            TYPE: "physicianBody",
            POSITION: { SIZE: 20 }
        }, 4),
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 12.999999523162842,
                X: 0,
                Y: 0,
                ANGLE: 0,
                LAYER: 1,
            }
        }
    ]
}
Class.professor_AR = {
    PARENT: "genericHealer",
    LABEL: "Professor",
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 9,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 10,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 16,
                ANGLE: 180
            }
        },
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
            }
        }
    ]
}
Class.quintuplex_AR = {
    PARENT: "genericTank",
    LABEL: "Quintuplex",
    DANGER: 8,
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
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 45,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -45,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 90,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -90,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -4.75,
                Y: -5,
                ANGLE: 0
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 22.5
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 67.5
            }
        }]),
    ]
}
Class.ransacker_AR = makeGuard("rifle", "Ransacker")
Class.renovater_AR = {
    PARENT: "genericHealer",
    LABEL: "Renovater",
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
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: -1.8
            }
        }
    ]
}
Class.scatterer_AR = {
    PARENT: "genericTank",
    LABEL: "Scatterer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 11
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.therapist_AR = {
    PARENT: "genericHealer",
    LABEL: "Therapist",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 2.5,
                ASPECT: -0.4,
                X: 9.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 2.5,
                ASPECT: -0.4,
                X: 9.5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        }
    ])
}
Class.tommy_AR = makeGuard("minigun", "Tommy")
Class.tripleHelix_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Helix",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
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
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
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
    ], 3)
}

// Class Tree
if (!enable_addon) { return console.log('--- Arms Race addon [armsRace.js] is disabled. See line 6 to enable it. ---') }

if (!use_original_tree) {
Config.level_cap = 60
Config.level_cap_cheat = 60

//Class.basic.UPGRADES_TIER_1
    Class.basic.UPGRADES_TIER_2.push("healer")
        Class.smasher.UPGRADES_TIER_3.push("cocci")
        Class.healer.UPGRADES_TIER_3 = ["medic", "scientist_AR", "nurse_AR", "triHealer_AR", "analyzer_AR", "psychiatrist_AR", "soother_AR"]
            Class.healer.UPGRADES_TIER_4 = ["renovater_AR", "physician_AR"]
            Class.medic.UPGRADES_TIER_4 = ["intern_AR"/*, "ointment_AR", "injection_AR"*/, "actuary_AR"]
            Class.scientist_AR.UPGRADES_TIER_4 = ["surgeon", "professor_AR", "chemist_AR"]
            Class.nurse_AR.UPGRADES_TIER_4 = ["paramedic", "therapist_AR", "clinician_AR"]
            Class.triHealer_AR.UPGRADES_TIER_4 = ["ambulance", "healer3_AR", "hexaHealer_AR", "chemist_AR"]
            Class.analyzer_AR.UPGRADES_TIER_4 = ["accountant_AR", "clerk_AR", "guru_AR"]
            Class.psychiatrist_AR.UPGRADES_TIER_4 = ["therapist_AR", "guru_AR", "actuary_AR"]
            Class.soother_AR.UPGRADES_TIER_4 = ["doctor_AR"/*, "antidote_AR", "medicare_AR"*/]

    Class.twin.UPGRADES_TIER_2.push("wark_AR")
        Class.twin.UPGRADES_TIER_3.splice(1, 1) //remove bulwark
        Class.doubleTwin.UPGRADES_TIER_3.push("doubleFlankTwin_AR", "doubleGunner_AR", "warkwark_AR")
        Class.tripleShot.UPGRADES_TIER_3.push("splitShot_AR", "autoTripleShot_AR", "bentGunner_AR", "bentMinigun_AR", "defect_AR", "waarrk_AR")
        Class.gunner.UPGRADES_TIER_3.push("battery_AR", "buttbuttin_AR", "blower_AR", "rimfire_AR", "volley_AR", "doubleGunner_AR", "bentGunner_AR", "equalizer_AR")

    //Class.sniper.UPGRADES_TIER_2
        Class.sniper.UPGRADES_TIER_3.push("railgun_AR")
        Class.assassin.UPGRADES_TIER_3.push("buttbuttin_AR", "hitman_AR", "sniper3_AR", "enforcer_AR", "courser_AR")
        Class.hunter.UPGRADES_TIER_3.push("autoHunter_AR", "megaHunter_AR", "prober_AR", "courser_AR")
        Class.rifle.UPGRADES_TIER_3.push("autoRifle_AR", "enforcer_AR", "prober_AR")

    Class.machineGun.UPGRADES_TIER_2.push("diesel_AR", "machineTrapper_AR")
        Class.minigun.UPGRADES_TIER_3.push("subverter_AR", "zipper_AR", "bentMinigun_AR", "autoMinigun_AR", "widget_AR")
        Class.sprayer.UPGRADES_TIER_3.push("frother_AR", "foamer_AR", "faucet_AR", "shower_AR", "autoSprayer_AR", "stormer_AR")
        Class.diesel_AR.UPGRADES_TIER_3 = ["jalopy_AR", "machineGunner", "foamer_AR", "dieselTrapper_AR", "polluter_AR", "autoDiesel_AR"]

    //Class.flankGuard.UPGRADES_TIER_2
        Class.hexaTank.UPGRADES_TIER_3.push("deathStar_AR", "autoHexaTank_AR", "mingler_AR", "combo_AR")
        Class.triAngle.UPGRADES_TIER_3.push("cockatiel_AR", "integrator_AR", "defect_AR", "quadAngle_AR")
        Class.auto3.UPGRADES_TIER_3.push("sniper3_AR", "crowbar_AR", "autoAuto3_AR", "combo_AR")

    Class.director.UPGRADES_TIER_2.push("directordrive_AR", "honcho_AR", "doper_AR")
        Class.director.UPGRADES_TIER_3.splice(1, 1) //remove bigCheese
        Class.overseer.UPGRADES_TIER_3.push("captain_AR", "foreman_AR")
        Class.cruiser.UPGRADES_TIER_3.push()
        Class.underseer.UPGRADES_TIER_3.push("autoUnderseer_AR", "underdrive_AR", "pentaseer_AR")
        Class.spawner.UPGRADES_TIER_3.push("spawnerdrive_AR", "captain_AR")
        Class.directordrive_AR.UPGRADES_TIER_3 = ["overdrive", "underdrive_AR", "spawnerdrive_AR"]
        Class.honcho_AR.UPGRADES_TIER_3 = ["foreman_AR", "bigCheese", "autoHoncho_AR"]
        Class.doper_AR.UPGRADES_TIER_3 = ["autoDoper_AR"]

    //Class.pounder.UPGRADES_TIER_2.push("volute")
        Class.pounder.UPGRADES_TIER_3.push("subverter_AR")
        Class.artillery.UPGRADES_TIER_3.push("queller_AR", "forger_AR", "force_AR", "autoArtillery_AR", "foctillery_AR", "discharger_AR")
        Class.launcher.UPGRADES_TIER_3.push("rocketeer_AR")

    Class.trapper.UPGRADES_TIER_2.push("pen_AR", "mech_AR", "machineTrapper_AR", "wark_AR")
        Class.trapper.UPGRADES_TIER_3.splice(0, 1) //remove barricade
        Class.trapper.UPGRADES_TIER_3.push("megaTrapper_AR")
        Class.builder.UPGRADES_TIER_3.push("forger_AR", "stall_AR", "fashioner_AR", "charger_AR")
        Class.triTrapper.UPGRADES_TIER_3.push("triPen_AR", "triMech_AR", "triMachine_AR", "triTrapGuard_AR")
        Class.trapGuard.UPGRADES_TIER_3.push("peashooter_AR", "incarcerator_AR", "mechGuard_AR", "autoTrapGuard_AR", "machineGuard_AR", "triTrapGuard_AR")
        Class.pen_AR.UPGRADES_TIER_3 = ["stall_AR", "triPen_AR", "incarcerator_AR", "operator_AR", "cockatiel_AR", "hutch_AR", "interner_AR", "autoPen_AR"]
        Class.mech_AR.UPGRADES_TIER_3 = ["engineer", "triMech_AR", "machineMech_AR", "mechGuard_AR", "operator_AR", "cog_AR", "cobbler_AR", "autoMech_AR"]
        Class.machineTrapper_AR.UPGRADES_TIER_3 = ["dieselTrapper_AR", "barricade", "equalizer_AR", "frother_AR", "machineGuard_AR", "encircler_AR", "machineMech_AR", "triMachine_AR", "expeller_AR", "autoMachineTrapper_AR", "deviation_AR"]
        Class.wark_AR.UPGRADES_TIER_3 = ["warkwark_AR", "waarrk_AR", "equalizer_AR", "hexaTrapper", "hutch_AR", "cog_AR", "expeller_AR", "bulwark", "coalesce_AR", "autoWark_AR"]

    Class.desmos.UPGRADES_TIER_2.splice(0, 0, "volute")
    Class.desmos.UPGRADES_TIER_2.push("spiral", "repeater")
        Class.volute.UPGRADES_TIER_3.push("oroboros", "autoVolute_AR")
        Class.helix.UPGRADES_TIER_3.push("coil", "duplicator", "doubleHelix_AR", "autoHelix_AR")
            //Class.triplex.UPGRADES_TIER_4 = ["quintuplex_AR", "doubleTriplex_AR", "autoTriplex_AR"]
            //Class.quadruplex.UPGRADES_TIER_4 = ["hextuplex_AR", "autoQuadruplex_AR"]
            //Class.doubleHelix_AR.UPGRADES_TIER_4 = ["tripleHelix_AR", "doubleTriplex_AR", "doubleCoil_AR", "doubleDuplicator_AR", "autoDoubleHelix_AR"]
            //Class.autoHelix_AR.UPGRADES_TIER_4 = ["autoTriplex_AR", "autoQuadruplex_AR", "autoCoil_AR", "autoDuplicator_AR", "autoDoubleHelix_AR"]
        Class.spiral.UPGRADES_TIER_3.push(/*"wrangler", */"oroboros", "cocci", /*"rocket", */"autoSpiral_AR")
            //Class.superSpiral.UPGRADES_TIER_4 = ["autoSuperSpiral_AR"]
            //Class.coil.UPGRADES_TIER_4 = ["doubleCoil_AR", "autoCoil_AR"]
            //Class.autoSpiral_AR.UPGRADES_TIER_4 = ["autoSuperSpiral_AR", "autoCoil_AR"]
        Class.repeater.UPGRADES_TIER_3.push("autoRepeater_AR")
            //Class.iterator.UPGRADES_TIER_4 = ["autoIterator_AR"]
            //Class.duplicator.UPGRADES_TIER_4 = ["doubleDuplicator_AR", "autoDuplicator_AR"]
            //Class.autoRepeater_AR.UPGRADES_TIER_4 = ["autoIterator_AR", "autoDuplicator_AR"]

} else {
Class.infestor.SHAPE = 4
Class.vulture.LABEL = "Taser"

Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper"]
    Class.basic.UPGRADES_TIER_2 = ["smasher"]
        Class.basic.UPGRADES_TIER_3 = ["single"]
            Class.single.UPGRADES_TIER_3 = []
        Class.healer.UPGRADES_TIER_3 = ["medic", "scientist_AR", "nurse_AR", "triHealer_AR", "analyzer_AR", "psychiatrist_AR", "soother_AR"]
            //Class.healer.UPGRADES_TIER_4 = ["renovater_AR", "physician_AR"]
            Class.medic.UPGRADES_TIER_4 = []
            Class.scientist_AR.UPGRADES_TIER_4 = ["surgeon"]
            Class.nurse_AR.UPGRADES_TIER_4 = ["paramedic"]
            Class.triHealer_AR.UPGRADES_TIER_4 = []
            Class.analyzer_AR.UPGRADES_TIER_4 = []
            Class.psychiatrist_AR.UPGRADES_TIER_4 = []
            Class.soother_AR.UPGRADES_TIER_4 = []

    Class.twin.UPGRADES_TIER_2 = ["doubleTwin", "tripleShot", "gunner", "hexaTank", "wark_AR"]
        Class.twin.UPGRADES_TIER_3 = ["dual", "bulwark", "musket"]
        Class.doubleTwin.UPGRADES_TIER_3 = ["tripleTwin", "hewnDouble", "autoDouble", "bentDouble", "doubleFlankTwin_AR", "doubleGunner_AR", "warkwark_AR"]
        Class.tripleShot.UPGRADES_TIER_3 = ["pentaShot", "spreadshot", "bentHybrid", "bentDouble", "triplet", "splitShot_AR", "autoTripleShot_AR", "bentGunner_AR", "bentMinigun_AR", "defect_AR", "waarrk_AR"]
        Class.gunner.UPGRADES_TIER_3 = ["autoGunner", "nailgun", "auto4", "machineGunner", "gunnerTrapper", "cyclone", "overgunner", "battery_AR", "buttbuttin_AR", "blower_AR", "rimfire_AR", "volley_AR", "doubleGunner_AR", "bentGunner_AR", "equalizer_AR"]

    Class.sniper.UPGRADES_TIER_2 = ["assassin", "hunter", "minigun", "rifle"]
        Class.sniper.UPGRADES_TIER_3 = ["bushwhacker"]
        Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin", "buttbuttin_AR", "hitman_AR", "sniper3_AR", "enforcer_AR", "courser_AR"]
        Class.hunter.UPGRADES_TIER_3 = ["predator", "poacher", "ordnance", "dual", "autoHunter_AR", "megaHunter_AR", "prober_AR", "courser_AR"]
        Class.rifle.UPGRADES_TIER_3 = ["musket", "crossbow", "armsman", "autoRifle_AR", "enforcer_AR", "prober_AR"]

    Class.machineGun.UPGRADES_TIER_2 = ["artillery", "minigun", "gunner", "diesel_AR", "machineTrapper_AR"]
        Class.machineGun.UPGRADES_TIER_3 = ["sprayer"]
            Class.sprayer.UPGRADES_TIER_3 = ["duster_AR", "frother_AR", "scatterer_AR", "foamer_AR", "shower_AR", "autoSprayer_AR", "phoenix"]
        Class.minigun.UPGRADES_TIER_3 = ["streamliner", "nailgun", "cropDuster", "barricade", "subverter_AR", "vulture", "zipper_AR", "bentMinigun_AR", "autoMinigun_AR", "widget_AR"]
        Class.diesel_AR.UPGRADES_TIER_3 = ["jalopy_AR", "machineGunner", "dieselTrapper_AR", "polluter_AR", "autoDiesel_AR"]
            Class.diesel_AR.UPGRADES_TIER_3.push("foamer_AR")

    Class.flankGuard.UPGRADES_TIER_2 = ["hexaTank", "triAngle", "auto3", "trapGuard", "triTrapper"]
        Class.flankGuard.UPGRADES_TIER_3 = ["tripleTwin"]
        Class.hexaTank.UPGRADES_TIER_3 = ["octoTank", "cyclone", "hexaTrapper", "deathStar_AR", "autoHexaTank_AR", "mingler_AR", "combo_AR"]
        Class.triAngle.UPGRADES_TIER_3 = ["fighter", "booster", "falcon", "bomber", "autoTriAngle", "surfer", "eagle", "vulture", "cockatiel_AR", "integrator_AR", "defect_AR", "quadAngle_AR"]
        Class.auto3.UPGRADES_TIER_3 = ["auto5", "mega3", "auto4", "banshee", "sniper3_AR", "crowbar_AR", "autoAuto3_AR", "combo_AR"]

    Class.director.UPGRADES_TIER_2 = ["overseer", "cruiser", "underseer", "spawner", "directordrive_AR", "honcho_AR", "doper_AR"]
        Class.director.UPGRADES_TIER_3 = ["manager"]
        Class.overseer.UPGRADES_TIER_3 = ["overlord", "banshee", "autoOverseer", "overdrive", "commander", "captain_AR", "foreman_AR"]
        Class.cruiser.UPGRADES_TIER_3 = ["carrier", "battleship", "fortress", "autoCruiser", "commander"]
        Class.underseer.UPGRADES_TIER_3 = ["necromancer", "maleficitor", "autoUnderseer_AR", "underdrive_AR", "infestor", "pentaseer_AR"]
        Class.spawner.UPGRADES_TIER_3 = ["factory", "autoSpawner", "spawnerdrive_AR", "captain_AR"]
        Class.directordrive_AR.UPGRADES_TIER_3 = ["overdrive", "underdrive_AR", "spawnerdrive_AR"]
        Class.honcho_AR.UPGRADES_TIER_3 = ["foreman_AR", "bigCheese", "autoHoncho_AR"]
        Class.doper_AR.UPGRADES_TIER_3 = ["autoDoper_AR"]

    Class.pounder.UPGRADES_TIER_2 = ["destroyer", "builder", "artillery", "launcher"]
        Class.pounder.UPGRADES_TIER_3 = ["shotgun", "eagle", "subverter_AR"]
        Class.destroyer.UPGRADES_TIER_3 = ["conqueror", "annihilator", "hybrid", "construct"]
        Class.artillery.UPGRADES_TIER_3 = ["mortar", "ordnance", "beekeeper", "fieldGun", "queller_AR", "forger_AR", "fieldGun", "force_AR", "autoArtillery_AR", "foctillery_AR", "discharger_AR"]
        Class.launcher.UPGRADES_TIER_3 = ["skimmer", "twister", "swarmer", "sidewinder", "fieldGun", "rocketeer_AR", "fieldGun"]

    Class.trapper.UPGRADES_TIER_2 = ["builder", "triTrapper", "trapGuard", "pen_AR", "mech_AR", "machineTrapper_AR", "wark_AR"]
        Class.trapper.UPGRADES_TIER_3 = ["barricade", "overtrapper", "megaTrapper_AR"]
        Class.builder.UPGRADES_TIER_3 = ["construct", "autoBuilder", "engineer", "boomer", "architect", "conqueror"]
        Class.triTrapper.UPGRADES_TIER_3 = ["fortress", "hexaTrapper", "septaTrapper", "architect", "triPen_AR", "triMech_AR", "triMachine_AR", "triTrapGuard_AR"]
        Class.trapGuard.UPGRADES_TIER_3 = ["bushwhacker", "gunnerTrapper", "bomber", "conqueror", "bulwark", "autoTrapGuard_AR"]
        Class.pen_AR.UPGRADES_TIER_3 = ["hutch_AR", "interner_AR", "autoPen_AR"]
        Class.mech_AR.UPGRADES_TIER_3 = ["engineer", "cog_AR", "cobbler_AR", "autoMech_AR"]
        Class.machineTrapper_AR.UPGRADES_TIER_3 = ["dieselTrapper_AR", "barricade", "equalizer_AR", "expeller_AR", "autoMachineTrapper_AR", "deviation_AR"]
            Class.machineTrapper_AR.UPGRADES_TIER_3.push("frother_AR")
        Class.wark_AR.UPGRADES_TIER_3 = ["warkwark_AR", "waarrk_AR", "equalizer_AR", "hexaTrapper", "hutch_AR", "cog_AR", "expeller_AR", "bulwark", "coalesce_AR", "autoWark_AR"]

}
