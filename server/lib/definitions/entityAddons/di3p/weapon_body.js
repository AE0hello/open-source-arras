const { combineStats, makeAuto } = require('../../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../../constants.js')
const g = require('../../gunvals.js')

// Tier 0
Class.body_basic = {
    PARENT: "generic_body",
    LABEL: "Basic",
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
    TURRETS: [
    	{
    	    POSITION: {
                SIZE: 10,
                X: 0,
                Y: 0,
                ANGLE: 0,
                ARC: 0,
                LAYER: 1
            },
    	    TYPE: "genericEntity"
    	}
    ]
}

// Tier 1
Class.body_auto = makeAuto("generic_body", "Auto", {type: "turret_tank"})
Class.body_whirlwind = {
    PARENT: "generic_body",
    LABEL: "Whirlwind",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
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
    })()
}

// Tier 2
Class.body_maelstrom = {
    PARENT: "generic_body",
    LABEL: "Maelstrom",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    TURRETS: [
        {
            POSITION: [10, 0, 0, 180, 360, 1],
            TYPE: "turret_tank_invis"
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
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
    })()
}
Class.body_tripleAuto = makeAuto("generic_body", "Triple Auto", {type: "turret_tank", total: 3})

// Tier 3
Class.body_pentaAuto = makeAuto("generic_body", "Penta Auto", {type: "turret_tank", total: 5})

// Upgrade Tree
Class.body_basic.UPGRADES_TIER_1 = ["body_auto", "body_whirlwind"]
    Class.body_auto.UPGRADES_TIER_2 = ["body_tripleAuto", "body_maelstrom"]
        Class.body_tripleAuto.UPGRADES_TIER_3 = ["body_pentaAuto"]
    Class.body_whirlwind.UPGRADES_TIER_2 = ["body_maelstrom"]

