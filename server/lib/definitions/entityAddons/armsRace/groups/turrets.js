const {combineStats, makeTurret} = require('../../../facilitators.js')
const g = require('../../../gunvals.js')

Class.healerAutoTankGun_AR = makeTurret({
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
