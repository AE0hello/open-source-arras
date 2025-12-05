const { combineStats, weaponArray, weaponMirror } = require('../facilitators.js')
const { base } = require('../constants.js')
const g = require('../gunvals.js')

Class.arrasMenu_diep.UPGRADES_TIER_0.push("tank_diep")
Class.diep = { PARENT: "genericTank", REROOT_UPGRADE_TREE: "tank_diep" }

// Basic Tank
Class.tank_diep = {
    PARENT: "diep",
    LABEL: "Tank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet"
            }
        }
    ]
}

// Tier 1
Class.flankGuard_diep = {
    PARENT: "diep",
    LABEL: "Flank Guard",
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sniper_diep = {
    PARENT: "diep",
    LABEL: "Sniper",
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.twin_diep = {
    PARENT: "diep",
    LABEL: "Twin",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8,
            Y: 5.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: "bullet"
        }
    })
}

// Tier 2
Class.quadTank_diep = {
    PARENT: "diep",
    LABEL: "Quad Tank",
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 4)
}
Class.tripleShot_diep = {
    PARENT: "diep",
    LABEL: "Triple Shot",
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ANGLE: 45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        })
    ]
}
Class.twinFlank_diep = {
    PARENT: "diep",
    LABEL: "Twin Flank",
    DANGER: 6,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8,
            Y: 5.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
            TYPE: "bullet"
        }
    }), 2)
}

// Class Tree
Class.tank_diep.UPGRADES_TIER_1 = ["twin_diep", "sniper_diep", "flankGuard_diep"]
    Class.twin_diep.UPGRADES_TIER_2 = ["tripleShot_diep", "quadTank_diep", "twinFlank_diep"]
    Class.flankGuard_diep.UPGRADES_TIER_2 = ["quadTank_diep", "twinFlank_diep"]
