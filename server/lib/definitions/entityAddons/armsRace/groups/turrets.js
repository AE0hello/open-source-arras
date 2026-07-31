const {weaponArray, weaponMirror} = require('../../../facilitators.js')

Class.driveAutoTurret_AR = {PARENT: 'autoTurret', SHAPE: 4}
Class.stormSquare_AR = {
    PARENT: "squareHat",
    LABEL: "Storm Square",
    COLOR: "grey",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 90
        }
    })
}
Class.stormTriangle_AR = {
    PARENT: "stormSquare_AR",
    SHAPE: 3,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 60
        }
    })
}
Class.downpourerSquare_AR = {
    PARENT: "stormSquare_AR",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 7,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 9,
                ASPECT: -1.2,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 9,
                X: 15.5,
                ANGLE: 90
            }
        }
    ])
}
Class.vortexSquare_AR = {
    PARENT: "stormSquare_AR",
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5
        }
    }, 4)
}
Class.stormAutoTurret_AR = {
    PARENT: "driveAutoTurret_AR",
    GUNS: [
        ...Class.autoTurret.GUNS,
        ...Class.stormSquare_AR.GUNS
    ]
}
