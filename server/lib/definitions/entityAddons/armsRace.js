const { combineStats, makeAuto, makeBird, makeOver, makeRearGunner, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames } = require('../constants.js')
const g = require('../gunvals.js')

// Settings
const enable_addon = true

// Presets
const hybridTankOptions = {count: 1, independent: true, cycle: false}

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
Class.autoTripleShot_AR = makeAuto("tripleShot")
Class.autoWark_AR = makeAuto("wark_AR")
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
Class.coalesce_AR = makeOver("wark_AR", "Coalesce", hybridTankOptions)
Class.defect_AR = makeBird("tripleShot", "Defect")
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

if (!enable_addon) {
    return
}

// Class Tree
//Class.basic.UPGRADES_TIER_1
    //Class.basic.UPGRADES_TIER_2
        //Class.basic.UPGRADES_TIER_3

    Class.twin.UPGRADES_TIER_2.push("wark_AR")
        Class.twin.UPGRADES_TIER_3.splice(1, 1) //remove bulwark
        Class.doubleTwin.UPGRADES_TIER_3.push("doubleFlankTwin_AR", "doubleGunner_AR", "warkwark_AR")
        Class.tripleShot.UPGRADES_TIER_3.push("splitShot_AR", "autoTripleShot_AR", "bentGunner_AR", "bentMinigun_AR", "defect_AR", "waarrk_AR")

    //Class.sniper.UPGRADES_TIER_2

    Class.machineGun.UPGRADES_TIER_2.push("diesel_AR", "machineTrapper_AR")

    //Class.flankGuard.UPGRADES_TIER_2

    Class.director.UPGRADES_TIER_2.push("directordrive_AR", "honcho_AR", "doper_AR")
        Class.director.UPGRADES_TIER_3.splice(1, 1) //remove bigCheese
        Class.directordrive_AR.UPGRADES_TIER_3 = ["overdrive"]
        Class.honcho_AR.UPGRADES_TIER_3 = ["bigCheese"]

    //Class.pounder.UPGRADES_TIER_2

    Class.trapper.UPGRADES_TIER_2.push("pen_AR", "mech_AR", "machineTrapper_AR", "wark_AR")
        Class.trapper.UPGRADES_TIER_3.splice(0, 1) //remove barricade
        Class.pen_AR.UPGRADES_TIER_3 = []
        Class.mech_AR.UPGRADES_TIER_3 = ["engineer"]
        Class.machineTrapper_AR.UPGRADES_TIER_3 = ["barricade"]
        Class.wark_AR.UPGRADES_TIER_3 = ["warkwark_AR", "waarrk_AR", "hexaTrapper", "bulwark", "coalesce_AR", "autoWark_AR"]
