const {combineStats, dereference, makeTurret, weaponArray, weaponMirror} = require('../../facilitators.js')
const {base, smshskl, statnames} = require('../../constants.js')
const g = require('../../gunvals.js')

// LEGAL DISCLAIMER
// - All tank and boss stats were sourced from diepcustom, which is licensed under GNU AGPLv3. (https://github.com/abcxff/diepcustom)
// - This addon DOES NOT use any other code from diepcustom or diep.io.

Class.guardian_diep = {
    PARENT: "elite",
    LABEL: "Guardian of the Pentagons",
    UPGRADE_LABEL: "Guardian",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [4, 12, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 0.5, reload: 0.25 }]),
                TYPE: "swarm",
                AUTOFIRE: true,
            },
        },
    ],
    AI: { NO_LEAD: false },
}
Class.defenderTurret_diep = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
                TYPE: ["bullet", {COLOR: "yellow"}]
            }
        }
    ]
}
Class.defender_diep = {
    PARENT: "elite",
    LABEL: "Defender",
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, -3, 0, 60, 0],
        }, {
            POSITION: [3, 7, 1.7, 12, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, {reload: 1.33, damage: 2.5}]),
                TYPE: ["trap", {COLOR: "yellow"}],
                STAT_CALCULATOR: "trap",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 190, 1],
        TYPE: "defenderTurret_diep",
    }, 3),
    AI: { NO_LEAD: false },
}
