const { combineStats, makeGuard } = require('../../facilitators.js')
const { makeOver } = require('./facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../../constants.js')
require('../../groups/generics.js')
const g = require('../../gunvals.js')

// Tier 0
Class.rear_plain = {
	PARENT: "generic_rear",
	LABEL: "Plain"
}

// Tier 1
Class.rear_flank = {
	PARENT: "generic_rear",
    LABEL: "Flank",
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet",
            }
        }
    ]
}
Class.rear_guard = {
    PARENT: "generic_rear",
    LABEL: "Guard",
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: -1,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 1,
                ANGLE: -90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.rear_swarmer = {
    PARENT: "generic_rear",
    LABEL: "Swarmer",
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.swarm,
    GUNS: [
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 7.5,
                ASPECT: 0.6,
                X: 7,
                ANGLE: 180,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}
Class.rear_trapper = makeGuard("generic_rear", "Trapper")

// Tier 2
Class.rear_bulwark = {
    PARENT: "generic_rear",
    LABEL: "Bulwark",
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 185
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 14,
                Y: 5.5,
                ANGLE: 185
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                Y: -5.5,
                ANGLE: 175
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 14,
                Y: -5.5,
                ANGLE: 175,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.rear_cross = {
    PARENT: "generic_rear",
    LABEL: "Cross",
    GUNS: [
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
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: -1,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 1,
                ANGLE: -90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.rear_hybrid = makeOver("generic_rear", "Hybrid", { count: 1, independent: true, cycle: false })

// Tier 3
Class.rear_fighter = {
    PARENT: "generic_rear",
    LABEL: "Fighter",
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, -1, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Side"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 1, -90, 0],
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
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }
    ]
}

// Upgrade Tree
Class.rear_plain.UPGRADES_TIER_1 = ["rear_flank", "rear_trapper", "rear_swarmer", "rear_guard"]

	Class.rear_flank.UPGRADES_TIER_2 = ["rear_cross"]

	Class.rear_swarmer.UPGRADES_TIER_2 = ["rear_hybrid"]

	Class.rear_guard.UPGRADES_TIER_2 = ["rear_cross"]
		Class.rear_cross.UPGRADES_TIER_3 = ["rear_fighter"]
