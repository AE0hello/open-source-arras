const { combineStats } = require('../../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../../constants.js')
require('../../groups/generics.js')
const g = require('./gunvals.js')

// Tier 0
Class.front_tank = {
	PARENT: "generic_front",
    LABEL: "Tank",
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
                /*COLOR: "grey",
                LABEL: "",
                STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                NEGATIVE_RECOIL: false*/
            }
        }
    ]
}

// Tier 1
Class.front_deployer = {
    PARENT: "generic_front",
    LABEL: "Deployer",
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 6
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.deployer]),
                TYPE: "minimissile",
                STAT_CALCULATOR: "sustained"
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 8
            }
        }
    ]
}
Class.front_pistol = {
    PARENT: "generic_front",
    LABEL: "Pistol",
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
                LENGTH: 19,
                WIDTH: 8.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.marksman]),
                TYPE: "bullet"
            }
        }
    ],
    UPGRADES_TIER_2: ["marksman"]
}
Class.front_sniper = {
    PARENT: "generic_front",
    LABEL: "Sniper",
    BODY: {
        FOV: 1.2
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
Class.front_twin = {
    PARENT: "generic_front",
    LABEL: "Twin",
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                Y: -5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
                TYPE: "bullet"
            }
        }
    ]
}

// Upgrade Tree
Class.front_tank.UPGRADES_TIER_1 = ["front_twin", "front_sniper", "front_deployer"]
