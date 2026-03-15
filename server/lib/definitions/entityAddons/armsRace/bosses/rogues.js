const {combineStats, makeAuto, makeMenu, weaponArray} = require('../../../facilitators.js')
const {base} = require('../../../constants.js')
const g = require('../../../gunvals.js')

Class.rogueAlcazar_minion_AR = makeAuto("minion")
Class.rogueAlcazar_AR = {
    PARENT: "miniboss",
    LABEL: "Rogue Alcazar",
    NAME: "Rogue Alcazar",
    DISPLAY_NAME: false,
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 6,
    SIZE: 40,
    VALUE: 8e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 32 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3.5 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -1.6, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.minion, g.pounder, { reload: 2, density: 0.8 }]),
            TYPE: ["rogueAlcazar_minion_AR", {INDEPENDENT: true}],
            STAT_CALCULATOR: "drone",
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            NO_LIMITATIONS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: "baseMechTurret"
    }, 6)
}

Class.menu_rogues.UPGRADES_TIER_0.push("menu_rogues_AR")
Class.menu_rogues_AR = makeMenu("Rogues (Arms Race)", {upgrades: ["rogueAlcazar"].map(x => x + "_AR"), color: "darkGrey", boxColor: "darkGrey", shape: 6, boxLabel: "Arms Race"})
