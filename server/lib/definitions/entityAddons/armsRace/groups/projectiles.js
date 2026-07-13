const {makeAuto} = require('../../../facilitators.js')

// Sunchips
Class.betaSunchip_AR = {
    PARENT: "sunchip",
    PROPS: [
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4),
                ANGLE: 45,
                LAYER: 0.1
            }
        }
    ]
}
Class.alphaSunchip_AR = {
    PARENT: "sunchip",
    PROPS: [
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4),
                ANGLE: 45,
                LAYER: 0.1
            }
        },
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4) ** 2,
                LAYER: 0.1
            }
        }
    ]
}
Class.angleseerSunchip_AR = {
    PARENT: "sunchip",
    NECRO: [3],
    SHAPE: 3
}
Class.pentaseerSunchip_AR = {
    PARENT: "sunchip",
    NECRO: [5],
    SHAPE: 5
}
Class.hexaseerSunchip_AR = {
    PARENT: "sunchip",
    NECRO: [6],
    SHAPE: 6
}

// Traps
Class.mechTrap_AR = makeAuto("trap", {type: 'droneAutoTurret'})
