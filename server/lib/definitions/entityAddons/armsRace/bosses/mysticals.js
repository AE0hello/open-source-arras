const {combineStats, makeMenu, weaponArray, weaponMirror} = require('../../../facilitators.js')
const {base} = require('../../../constants.js')
const g = require('../../../gunvals.js')

Class.thaumaturge_AR = {
    PARENT: "miniboss",
    LABEL: "Thaumaturge",
    DISPLAY_NAME: false,
    DANGER: 11,
    SHAPE: 4,
    COLOR: "square",
    UPGRADE_COLOR: "square",
    SIZE: 35,
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3.4 * base.DAMAGE,
    },
    GUNS: [
        ...weaponMirror(weaponArray({
            POSITION: [3, 5, 1.2, 8, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.55, spray: 150, speed: 2, shudder: 1.75 }]),
                TYPE: "sorcererDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            },
        }, 4)),
        ...weaponArray({
            POSITION: [4.5, 8.65, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }]),
                TYPE: "summonerDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 7
            },
        }, 4)
    ]
}

Class.menu_mysticals.UPGRADES_TIER_0.push("menu_mysticals_AR")
Class.menu_mysticals_AR = makeMenu("Mysticals (Arms Race)", {upgrades: ["thaumaturge"].map(x => x + "_AR"), color: "gold", boxColor: "gold", shape: 4, boxLabel: "Arms Race"})
