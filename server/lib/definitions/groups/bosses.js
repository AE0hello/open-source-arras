const { combineStats, skillSet, makeAuto, makeAura, LayeredBoss, makeDeco, weaponArray, weaponMirror, setTurretProjectileRecoil } = require('../facilitators.js');
const { base, statnames, smshskl } = require('../constants.js');
const g = require('../gunvals.js');
require('./generics.js');
require('./tanks.js');
require('./turrets.js');
const { makeTurret, addDevAura } = require("../facilitators");

Class.miniboss = {
    PARENT: "genericBoss",
    RENDER_ON_LEADERBOARD: true,
    CONTROLLERS: ["nearestDifferentMaster", ["minion", {turnwiserange: 360}], "canRepel"],
    AI: { NO_LEAD: true },
}
Class.ramMiniboss = {
    PARENT: "genericBoss",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal"],
}

// ELITE CRASHERS
Class.elite = {
    PARENT: "miniboss",
    LABEL: "Elite Crasher",
    COLOR: "pink",
    SHAPE: 3,
    SIZE: 27,
    VALUE: 15e4,
    SKILL: [5, 9, 9, 9, 5, 1, 0, 9, 1, 0],
    BODY: {
        FOV: 1.25,
        SPEED: 0.15 * base.SPEED,
        HEALTH: 9 * base.HEALTH,
        DAMAGE: 4.5 * base.DAMAGE,
        REGEN: 0.5 * base.REGEN,
    },
}
Class.eliteDestroyer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray({
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 3),
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "crasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.eliteGunner = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    NAME: "Elite Gunner",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                NO_LIMITATIONS: true,
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "auto4gun",
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "auto4gun",
        },
    ],
}
Class.eliteSprayer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    NAME: "Elite Sprayer",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["machineTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            }, {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            }, 
        ], 3)
    ],
}
Class.eliteBattleship = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    NAME: "Elite Battleship",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.eliteSpawner = {
    PARENT: "elite",
    NAME: "Elite Spawner",
    DISPLAY_NAME: false,
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 9,
    AI: { STRAFE: false },
    SKILL_CAP: Array(10).fill(15),
    SKILL: [15, 8, 8, 8, 5, 1, 0, 9, 1, 0],
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentrySwarmMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryTrapMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryGunMinion",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
Class.eliteTrapGuard = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    NAME: "Elite Trap Guard",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [10.5, 6, 1, 0, 0, 60, 0],
        }, {
            POSITION: [3, 6, 1.7, 10.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [5, 8, -7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            }, {
                POSITION: [5, 8, 7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.eliteSpinner = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    NAME: "Elite Spinner",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9.5, 2, 1, 3.5, 6.5, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9.5, 2, 1, 8.5, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["eliteSpinnerCyclone", {COLOR: -1}],
        },
    ],
}
// DELTA CRASHERS
Class.delta = {
    PARENT: "elite",
    LABEL: "Delta Crasher",
    COLOR: "pink",
    UPGRADE_COLOR: "pink",
    SIZE: 34,
    VALUE: 5e5,
    BODY: {
        FOV: 1.25,
        SPEED: 0.15 * base.SPEED,
        HEALTH: 14 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
        REGEN: 0.5 * base.REGEN,
    },
}
Class.deltaDestroyer = {
    PARENT: "delta",
    UPGRADE_LABEL: "Delta Destroyer",
    NAME: "Delta Destroyer",
    DISPLAY_NAME: false,
    GUNS: [
        ...weaponArray({
            POSITION: [ 7, 10.5, -1.4, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.launcher, g.fake, {damage: 1.1, speed: 1.05}]),
                TYPE: "minimissile",
                LABEL: "Devastator",
                NO_LIMITATIONS: true,
                AUTOFIRE: true
            },
        }, 3),
        ...weaponArray({
            POSITION: [5, 16, 1, 6, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.launcher, {damage: 1.1, speed: 1.05}]),
                TYPE: "minimissile",
                LABEL: "Devastator",
                NO_LIMITATIONS: true,
            },
        }, 3),
    ],
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawner", {GUN_STAT_SCALE: {health: 1.1, damage: 1.2, size: 1.1}}],
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1, GUN_STAT_SCALE: {health: 1.2, damage: 1.1} } ],
        },
    ],
}
Class.deltaGunner = {
    PARENT: "delta",
    UPGRADE_LABEL: "Delta Gunner",
    NAME: "Delta Gunner",
    DISPLAY_NAME: false,
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [14, 6, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3, size: 0.6}]),
                TYPE: "legionaryPillbox",
                STAT_CALCULATOR: "trap",
                NO_LIMITATIONS: true,
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 180, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["bigauto4gun", {GUN_STAT_SCALE: {damage:1.05}}],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["bigauto4gun", {GUN_STAT_SCALE: {damage:1.05}}],
        },
    ],
}
Class.scatterer = {
    PARENT: "genericTank",
    LABEL: "Scatterer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 11, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.deltaSprayer = {
    PARENT: "delta",
    UPGRADE_LABEL: "Delta Sprayer",
    NAME: "Delta Sprayer",
    DISPLAY_NAME: false,
    SKILL: [3, 5, 5, 5, 3, 1, 0, 9, 1, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["gadgetGunTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [7.75, 6, 8, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey" }],
            },{
                POSITION: [7.75, 6, -8, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey" }],
            }, {
                POSITION: [9, 6, 0, 60, 130, 0],
                TYPE: ["scatterer", { COLOR: "grey" }], // what? (it didn't work on scatterer_AR)
            },
        ], 3)
    ],
}
Class.deltaBattleship = {
    PARENT: "delta",
    UPGRADE_LABEL: "Delta Battleship",
    NAME: "Delta Battleship",
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, 3.5, 60, 1/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, -3.5, 60, 2/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, -10, 60, 3/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 10, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "bigAutoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}

// OLD ELITE
Class.oldEliteSprayer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer (Old)",
    NAME: "Elite Sprayer (Old)",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: [ "sprayer", { COLOR: -1 } ],
    }, 3)
};

// Legions
Class.destroyerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Destroyer Legion",
    NAME: "Destroyer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: weaponArray({
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, {health: 1.1}]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 3),
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawner", {GUN_STAT_SCALE: {health: 1.1}}],
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { GUN_STAT_SCALE: {health: 1.1}, INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.gunnerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Gunner Legion",
    NAME: "Gunner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {health: 1.1, speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.15}}],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.15}}],
        },
    ],
}
Class.sprayerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Sprayer Legion",
    NAME: "Sprayer Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["machineGun", {GUN_STAT_SCALE: {health: 1.1, damage: 1.2, speed: 1.2, resist: 1.05}, COLOR: -1}],
    }, 3)
}
Class.battleshipLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Battleship Legion",
    NAME: "Battleship Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { GUN_STAT_SCALE: {health: 1.1}, INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.spawnerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Spawner Legion",
    NAME: "Spawner Legion",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentrySwarmMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentryTrapMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentryGunMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { GUN_STAT_SCALE: {health: 1.15}, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}

// Legionary Crasher
Class.legionaryCrasherTop = {
    PARENT: "elite",
    AI: { STRAFE: false, NO_LEAD: false },
    CONTROLLERS: [ ["spin", { independent: true, speed: -0.005 }] ],
    INDEPENDENT: true,
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [4, 9.5, 0.7, 7, 5, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                TYPE: [ "swarm", { INDEPENDENT: true } ],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
                
            },
        }, {
            POSITION: [4, 9.5, 0.7, 7, -5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                TYPE: [ "swarm", { INDEPENDENT: true } ],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["auto4gun", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
    }, 3),
}
Class.legionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'destroyerLegion',
            SHOOT_SETTINGS: combineStats([{reload: 0.1}]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 3,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["destroyerLegion", "gunnerLegion", "sprayerLegion", "battleshipLegion", "spawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.legionaryCrasher = {
    PARENT: "elite",
    LABEL: "Legionary Crasher",
    NAME: "Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e6,
    SIZE: 75,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 2000,
        DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, { reload: 2, speed: 2, size: 0.65, maxSpeed: 2, range: 0.65 }]),
                    TYPE: "legionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "legionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: [ "sprayer", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'legionaryCrasherSpawner'
        }
    ],
}
Class.legionaryCrasherSpawnerFix = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'destroyerLegion',
            SHOOT_SETTINGS: combineStats([{reload: 0.1, size: 0.75}]),
            NO_LIMITATIONS: true,
            INDEPENDENT_CHILDREN: false,
            MAX_CHILDREN: 3,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["destroyerLegion", "gunnerLegion", "sprayerLegion", "battleshipLegion", "spawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.legionaryCrasherFix = {
    PARENT: "elite",
    LABEL: "Legionary Crasher",
    NAME: "Legionary Crasher",
    DISPLAY_NAME: false,
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e6,
    SIZE: 75,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 2000,
        DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, { reload: 2, speed: 2, size: 0.65, maxSpeed: 2, range: 0.65 }]),
                    TYPE: "legionaryPillbox",
                    NO_LIMITATIONS: true,
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "legionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: [ "sprayer", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'legionaryCrasherSpawnerFix'
        }
    ],
}

// STRANGE BOSSES
Class.sorcerer = {
    PARENT: "miniboss",
    LABEL: "Sorcerer",
    NAME: "Sorcerer",
    DISPLAY_NAME: false,
    DANGER: 7,
    SHAPE: 0,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 26,
    MAX_CHILDREN: 50,
    VALUE: 2e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 2)
};
Class.summoner = {
    PARENT: "miniboss",
    LABEL: "Summoner",
    NAME: "Summoner",
    //DISPLAY_NAME: false,
    DANGER: 8,
    SHAPE: 4,
    COLOR: "gold",
    UPGRADE_COLOR: "gold",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 3e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 7 * base.HEALTH,
        DAMAGE: 2.6 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 4)
};
Class.enchantress = {
    PARENT: "miniboss",
    LABEL: "Enchantress",
    NAME: "Enchantress",
    DISPLAY_NAME: false,
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 4e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3)
};
Class.exorcistor = {
    PARENT: "miniboss",
    LABEL: "Exorcistor",
    NAME: "Exorcistor",
    DISPLAY_NAME: false,
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 15 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { maxSpeed: 1.2, reload: 5, size: 1.15, damage: 4 }]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 5, 1/5)
};
Class.shaman = {
    PARENT: "miniboss",
    LABEL: "Shaman",
    NAME: "Shaman",
    DISPLAY_NAME: false,
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 6e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { size: 1.25, maxSpeed: 1.2, damage: 1.1, reload: 3, damage: 4 }]),
            TYPE: "realchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 6, 1/6)
};
Class.witch = {
    PARENT: "miniboss",
    LABEL: "Witch",
    NAME: "Witch",
    DISPLAY_NAME: false,
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "pink",
    UPGRADE_COLOR: "pink",
    SIZE: 26,
    MAX_CHILDREN: 40,
    VALUE: 2.5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.11 * base.SPEED,
        HEALTH: 6.5 * base.HEALTH,
        DAMAGE: 2.3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.4, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3)
};
Class.eliteSkimmer = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    NAME: "Elite Skimmer",
    DISPLAY_NAME: false,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    TURRETS: weaponArray({
            POSITION: [15, 5, 0, 60, 170, 0],
            TYPE: "skimmerTurret",
        }, 3)
};
Class.thaumaturge = {
    PARENT: "miniboss",
    LABEL: "Thaumaturge",
    NAME: "Elite Skimmer",
    DISPLAY_NAME: false,
    DANGER: 11,
    SHAPE: 4,
    COLOR: "gold",
    UPGRADE_COLOR: "gold",
    SIZE: 35,
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3.4 * base.DAMAGE,
    },
    GUNS: [...weaponArray({
            POSITION: [3, 5, 1.2, 8, -4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.55, spray: 150, speed: 2, shudder: 1.75 }]),
                TYPE: "minichip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            },
        }, 4),
        ...weaponArray({
            POSITION: [3, 5, 1.2, 8, 4, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.55, spray: 150, speed: 2, shudder: 1.75 }]),
                TYPE: "minichip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            },
        }, 4),
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
    }, 4)]
};

// Nesters
Class.nester = {
    PARENT: "miniboss",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    VALUE: 3e5,
}
Class.nestKeeper = {
    PARENT: "nester",
    LABEL: "Nest Keeper",
    NAME: "Nest Keeper",
    DISPLAY_NAME: false,
    MAX_CHILDREN: 15,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: "purple" } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
};
Class.nestWarden = {
    PARENT: "nester",
    LABEL: "Nest Warden",
    NAME: "Nest Warden",
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.nestGuardian = {
    PARENT: "nester",
    LABEL: "Nest Guardian",
    NAME: "Nest Guardian",
    DISPLAY_NAME: false,
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
// Arms Race
Class.arNester = {
    PARENT: "miniboss",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 60,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 18,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    VALUE: 8e5,
}
Class.nestCurator = {
    PARENT: "arNester",
    LABEL: "Nest Curator",
    NAME: "Nest Curator",
    DISPLAY_NAME: false,
    MAX_CHILDREN: 15,
    GUNS: weaponArray([{
            POSITION: [ 4.5, 1.5, -1.4, 8, 3.75, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                AUTOFIRE: true,
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [ 4.5, 1.5, -1.4, 8, -3.75, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                AUTOFIRE: true,
                STAT_CALCULATOR: "swarm",
            },
        },
        {
        POSITION: [3.5, 8.25, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }], 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1, GUN_STAT_SCALE: {reload: 0.4, damage: 0.4} } ],
        }, 5),
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "ultraBoomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
};
Class.nestDeacon = {
    PARENT: "arNester",
    LABEL: "Nest Deacon",
    NAME: "Nest Deacon",
    DISPLAY_NAME: false,
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor, g.pounder]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "ultraBarricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "carrierTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.nestChampion = {
    PARENT: "arNester",
    LABEL: "Nest Champion",
    NAME: "Nest Champion",
    DISPLAY_NAME: false,
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.launcher]),
            TYPE: "minimissile",
            LABEL: "Ravager",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "hyperTwisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "hyperSwarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}

// Rogues
Class.roguePalisade = {
    PARENT: "miniboss",
    LABEL: "Rogue Palisade",
    NAME: "Rogue Palisade",
    DISPLAY_NAME: false,
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -1.6, 8, 0, 0, 0], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.factory, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ["minion", {INDEPENDENT: true}],
            STAT_CALCULATOR: "drone",
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ["baseTrapTurret", {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
};
Class.rogueArmada = {
    PARENT: "miniboss",
    LABEL: 'Rogue Armada',
    NAME: 'Rogue Armada',
    DISPLAY_NAME: false,
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 7,
    SIZE: 28,
    VALUE: 500000,
    SKILL: [2, 6, 6, 6, 2, 0, 0, 9, 0, 0],
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8.5, 6, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2}, g.fake]),
                TYPE: "casing"
            }
        }, {
            POSITION: [7, 6, -1.6, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: "shottrapTurret"
    }, 7),
}
Class.rogueAlcazar = {
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
            SHOOT_SETTINGS: combineStats([ g.factory, g.pounder, { reload: 2, density: 0.8 }]),
            TYPE: ["autoMinion", {INDEPENDENT: true}],
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
};

// Bob.
Class.bob = {
    PARENT: "ramMiniboss",
    LABEL: "Bob",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 18,
    BODY: {
        SPEED: 2 * base.SPEED,
        HEALTH: 5 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.5 * base.FOV,
        DENSITY: 6 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody",
        }, {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: "landmineBody",
        }, {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: "spikeBody",
        },
    ],
};
Class.nemesis = {
    PARENT: "bob",
    LABEL: "Nemesis",
    COLOR: "red",
    UPGRADE_COLOR: "red",
    BODY: {
        REGEN: 1e5,
        HEALTH: 1e6,
        DENSITY: 30,
        DAMAGE: 1e5,
        FOV: 5,
    },
};

// DIEP BOSSES
Class.guardian = {
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
};
Class.defenderAutoTankGun = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
                TYPE: ["bullet", {COLOR: "yellow"}],
            },
        },
    ],
};
Class.defender = {
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
        TYPE: "defenderAutoTankGun",
    }, 3),
    AI: { NO_LEAD: false },
};

// CELESTIALS
Class.terrestrial = {
    PARENT: "miniboss",
    LABEL: "Terrestrial",
    SKILL: [6, 9, 9, 9, 1, 9, 9, 9, 4, 0],
    VALUE: 5e5,
    SHAPE: 7,
    SIZE: 35,
    CONTROLLERS: [["minion", {turnwiserange: 360}]],
    BODY: {
        FOV: 1,
        HEALTH: 1000,
        SHIELD: 50,
        REGEN: base.REGEN * 0.3,
        SPEED: base.SPEED * 0.7,
        DAMAGE: 9,
    },
};
Class.celestial = {
    PARENT: "miniboss",
    LABEL: "Celestial",
    SKILL: [6, 9, 9, 9, 1, 9, 9, 9, 4, 0],
    VALUE: 1e6,
    SHAPE: 9,
    SIZE: 45,
    CONTROLLERS: [["minion", {turnwiserange: 360}]],
    BODY: {
        FOV: 1,
        HEALTH: 1500,
        SHIELD: 75,
        REGEN: base.REGEN * 0.3,
        SPEED: base.SPEED * 0.5,
        DAMAGE: 12,
    },
};
Class.rogueCelestial = {
    PARENT: "celestial",
    LABEL: "Rogue Celestial",
    COLOR: "darkGrey",
};
Class.eternal = {
    PARENT: "miniboss",
    LABEL: "Eternal",
    SKILL: [5, 9, 9, 9, 1, 0, 9, 9, 0, 0],
    VALUE: 4e6,
    SHAPE: 11,
    SIZE: 90,
    CONTROLLERS: [["minion", {orbit: 240}]],
    BODY: {
        FOV: 1,
        HEALTH: 3000,
        SHIELD: 150,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.15,
        DAMAGE: 18,
    },
};

// Terrestrials
let ares = new LayeredBoss(null, "Ares", "terrestrial", 7, "purple", "terrestrialTrapTurret", 7, 5.5);
ares.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["demonchip", { INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, false, null, 18);
ares.addLayer({turret: {
    POSITION: [10, 8.5, 0, null, 160, 0],
    TYPE: ["protoSwarmerTurret", { INDEPENDENT: true }],
}}, true, 6.5);

let gersemi = new LayeredBoss(null, "Gersemi", "terrestrial", 7, "lightGreen", "terrestrialTrapTurret", 7, 5.5);
gersemi.addLayer({turret: {
    POSITION: [9, 8, 0, null, 160, 0],
    TYPE: ["swarmTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.7, damage: 1.2} }],
}});
gersemi.addLayer({turret: {
    POSITION: [9.5, 7.5, 0, null, 160, 0],
    TYPE: ["basicTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.8, damage: 1.3} }],
}}, true, 6.5);

let ezekiel = new LayeredBoss(null, "Ezekiel", "terrestrial", 7, "orange", "terrestrialTrapTurret", 7, 5.5);
ezekiel.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["dorito", { COLOR: "orange", INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 18);
ezekiel.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("skimmerTurret", 0.5), { COLOR: "grey", INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.5} }],
}}, true, 6.5)

let eris = new LayeredBoss(null, "Eris", "terrestrial", 7, "pink", "terrestrialTrapTurret", 7, 5.5);
eris.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
        TYPE: ["minion", { INDEPENDENT: true, COLOR: "pink" }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, false, null, 14);
eris.addLayer({turret: {
    POSITION: [10, 8.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("rocketeerTurret", 0.43), { INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.43} }],
}}, true, 6.5);

let selene = new LayeredBoss(null, "Selene", "terrestrial", 7, "gold", "terrestrialTrapTurret", 7, 5.5);
selene.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["summonerDrone", { COLOR: "gold", INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 18);
selene.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["hyperTwisterTurret", { INDEPENDENT: true }],
}}, true, 6.5);

// PALADIN
let paladin = new LayeredBoss(null, "Paladin", "celestial", 9, "purple", "baseTrapTurret", 6.5, 5.5);
paladin.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["demonchip", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 16);
paladin.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["swarmerTurret", {GUN_STAT_SCALE: {speed: 1.45, maxSpeed: 0.5, health: 1.3, range: 1.3}}],
}}, true, 6);

// FREYJA
let freyja = new LayeredBoss(null, "Freyja", "celestial", 9, "lightGreen", "baseTrapTurret", 6.5, 5.5);
freyja.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: ["cruiserTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05}}],
}});
freyja.addLayer({turret: {
    POSITION: [10.6, 7.5, 0, null, 160, 0],
    TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
}}, true, 6);

// ZAPHKIEL
let zaphkiel = new LayeredBoss(null, "Zaphkiel", "celestial", 9, "orange", "baseTrapTurret", 6.5, 5.5);
zaphkiel.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["dorito", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
zaphkiel.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("skimmerTurret", 0.65), {COLOR: "grey", INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.65}}],
}}, true, 6);

// NYX
let nyx = new LayeredBoss(null, "Nyx", "celestial", 9, "pink", "baseTrapTurret", 6.5, 5.5);
nyx.addLayer({gun: {
    POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
        TYPE: ["minion", {INDEPENDENT: true,}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
nyx.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("rocketeerTurret", 0.5), { INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.5} }],
}}, true, 6);

// THEIA
let theia = new LayeredBoss(null, "Theia", "celestial", 9, "gold", "baseTrapTurret", 6.5, 5.5);
theia.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 1],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["summonerDrone", {INDEPENDENT: true}],
        AUTOFIRE: true,
        WAIT_TO_CYCLE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 35);
theia.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["twisterTurret", {INDEPENDENT: true, COLOR: "grey", GUN_STAT_SCALE: {health: 1.3, damage: 1.1, resist: 1.2, speed: 1.1, maxSpeed: 0.8}}],
}}, true, 6);

// ATLAS
let atlas = new LayeredBoss(null, "Atlas", "celestial", 9, "#EDB854", "baseTrapTurret", 6.5, 5.5);
atlas.addLayer({turret: {
    POSITION: [7, 9, 0, null, 180, 0],
    TYPE: "artilleryTurret",
}});
atlas.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: ["nailgunTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
}}, true, 6);

// RHEA
let rhea = new LayeredBoss(null, "Rhea", "celestial", 9, "#D7B070", "baseTrapTurret", 6.5, 5.5);
rhea.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "wrenchTurret",
}});
rhea.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "crowbarTurret",
}}, true, 6);

// HYPERION
let hyperion = new LayeredBoss(null, "Hyperion", "celestial", 9, "#aec996", "baseTrapTurret", 6.5, 5.5);
hyperion.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "destroyerTurret",
}});
hyperion.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "skimmerTurret", // should be old sidewinder
}}, true, 6);
// color: light - #aec996, dark - #36A5B3, natural - #a0b36e, solarized dark - #399c9e, lyric - #8c3131

//AETHER
let aether = new LayeredBoss(null, "Aether", "celestial", 9, "#dca171", "baseTrapTurret", 6.5, 5.5);
aether.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "rifleTurret",
}});
aether.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "streamlinerTurret",
}}, true, 6);

// STYX
let styx = new LayeredBoss(null, "Styx", "celestial", 9, "#EFA5A5", "baseTrapTurret", 6.5, 5.5);
styx.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "gunnerTurret",
}});
styx.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "hunterTurret",
}}, true, 6);

// EROS
let eros = new LayeredBoss(null, "Eros", "celestial", 9, "#D1818A", "baseTrapTurret", 6.5, 5.5);
eros.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "sprayerTurret",
}});
eros.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "singleTurret",
}}, true, 6);

//TETHYS
let tethys = new LayeredBoss(null, "Tethys", "celestial", 9, "#E2CF58", "baseTrapTurret", 6.5, 5.5);
tethys.addLayer({turret: {
    POSITION: [7.5, 9, 0, null, 180, 0],
    TYPE: ["bentBuilderTurret", {GUN_STAT_SCALE: {reload: 1.1, health: 0.91}}],
}});
tethys.addLayer({turret: {
    POSITION: [11.5, 8, 0, null, 160, 0],
    TYPE: ["boomerTurret", {COLOR: "grey"}],
}}, true, 6);

//IAPETUS
let iapetus = new LayeredBoss(null, "Iapetus", "celestial", 9, "#ED95AE", "baseTrapTurret", 6.5, 5.5);
iapetus.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "volleyTurret",
}});
iapetus.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "rimflakTurret",
}}, true, 6);

// APOLLO
let apollo = new LayeredBoss(null, "Apollo", "celestial", 9, "#D4C1A1", "baseTrapTurret", 6.5, 5.5);
apollo.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: ["blunderbussTurret", {GUN_STAT_SCALE: {reload: 1.1, health: 1.1}}],
}});
apollo.addLayer({turret: {
    POSITION: [11, 9, 0, null, 180, 0],
    TYPE: "heavyTurret", // https://discord.com/channels/1004907608018264094/1051533268861857863/1445496968406368266
}});

// HERA
let hera = new LayeredBoss(null, "Hera", "celestial", 9, "#A472C3", "baseTrapTurret", 6.5, 5.5);
hera.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "barricadeTurret",
}});
hera.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "engineerTurret",
}});

// SIF
let sif = new LayeredBoss(null, "Sif", "celestial", 9, "#C7E071", "baseTrapTurret", 6.5, 5.5);
sif.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "warkTurret",
}});
sif.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "crossbowTurret",
}});

// FREYR
let freyr = new LayeredBoss(null, "Freyr", "celestial", 9, "#E98D83", "baseTrapTurret", 6.5, 5.5);
freyr.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["dorito", {INDEPENDENT: true}], // up to devs discussion or just waiting until we see it officially to determine what this'll be
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
freyr.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "carrierTurret",
}});

// TYR
let tyr = new LayeredBoss(null, "Tyr", "celestial", 9, "#D78DCA", "baseTrapTurret", 6.5, 5.5);
tyr.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "machineGunTurret",
}});
tyr.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "musketTurret",
}});

// "GERSEMI" - renaming to Hjordis
let hjordis = new LayeredBoss(null, "Hjordis", "celestial", 9, "#988AC7", "baseTrapTurret", 6.5, 5.5);
hjordis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "tripleShotTurret",
}});
hjordis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "constructorTurret",
}});

// VOR
let vor = new LayeredBoss(null, "Vor", "celestial", 9, "#C5D07A", "baseTrapTurret", 6.5, 5.5);
vor.addLayer({turret: {
    POSITION: [7.5, 9, 0, null, 180, 0],
    TYPE: "tripletTurret",
}});
vor.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "builderTurret",
}});

// ALCIS
let alcis = new LayeredBoss(null, "Alcis", "celestial", 9, "#E99965", "baseTrapTurret", 6.5, 5.5);
alcis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "trapperTurret",
}});
alcis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "spreadshotTurret",
}});

// BALDR
let baldr = new LayeredBoss(null, "Baldr", "celestial", 9, "#EFBC69", "baseTrapTurret", 6.5, 5.5);
baldr.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "minigunTurret",
}});
baldr.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "rangerTurret",
}});

// DELLINGR
let dellingr = new LayeredBoss(null, "Dellingr", "celestial", 9, "#BE82D1", "baseTrapTurret", 6.5, 5.5);
dellingr.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "sniperTurret",
}});
dellingr.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "pentaShotTurret",
}});

// ULLR
let ullr = new LayeredBoss(null, "Ullr", "celestial", 9, "#CB4969", "baseTrapTurret", 6.5, 5.5);
ullr.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "ullrLowerTurret",
}}, true, null, 32);
ullr.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "dualTurret",
}});

// ISIS
let isis = new LayeredBoss(null, "Isis", "celestial", 9, "#C78795", "baseTrapTurret", 6.5, 5.5);
isis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "isisLowerTurret",
}});
isis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "predatorTurret",
}});

// NEPHTHYS
let nephthys = new LayeredBoss(null, "Nephthys", "celestial", 9, "#679DB4", "baseTrapTurret", 6.5, 5.5);
nephthys.addLayer({gun: {
    POSITION: [4.6, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["demonchip", {INDEPENDENT: true}], // up to devs discussion or just waiting until we see it officially to determine what this'll be
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
nephthys.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "rangerTurret",
}});

// OSIRIS
let osiris = new LayeredBoss(null, "Osiris", "celestial", 9, "#A3BF42", "baseTrapTurret", 6.5, 5.5);
osiris.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "fieldGunTurret",
}});
osiris.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "beekeeperTurret",
}});

// HORUS
let horus = new LayeredBoss(null, "Horus", "celestial", 9, "#8BA867", "baseTrapTurret", 6.5, 5.5);
horus.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: ["basicTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.8, damage: 1.3} }],
}});
horus.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: ["basicTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.8, damage: 1.3} }],
}});

// ANUBIS
let anubis = new LayeredBoss(null, "Anubis", "celestial", 9, "#D66950", "baseTrapTurret", 6.5, 5.5);
anubis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: ["basicTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.8, damage: 1.3} }],
}});
anubis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "annihilatorTurret"
}});

// KHONSU
let khonsu = new LayeredBoss(null, "Khonsu", "celestial", 9, "#D36F90", "baseTrapTurret", 6.5, 5.5);
khonsu.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "sprayerTurret"
}});
khonsu.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "mortarTurret"
}});

// PTAH
let ptah = new LayeredBoss(null, "Ptah", "celestial", 9, "#69A1C9", "baseTrapTurret", 6.5, 5.5);
ptah.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "ordnanceTurret"
}});
ptah.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "focalTurret"
}});

// JULIUS
let julius = new LayeredBoss(null, "Julius", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
julius.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "juliusLowerTurret",
}});
julius.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("launcherTurret", 0.82), {GUN_STAT_SCALE: {health: 1.3, damage: 1.3, maxSpeed: 0.82}}],
}}, true, 6);

// GENGHIS
let genghis = new LayeredBoss(null, "Genghis", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
genghis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "genghisLowerTurret",
}});
genghis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: ["auto4gun", {GUN_STAT_SCALE: {speed: 1.2, maxSpeed: 0.85, health: 1.15, damage: 1.2, resist: 1.2}}],
}}, true, 6);

// NAPOLEON
let napoleon = new LayeredBoss(null, "Napoleon", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
napoleon.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "napoleonLowerTurret",
}});
napoleon.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "napoleonUpperTurret",
}}, true, 6)

// Eternals
let kronos = new LayeredBoss(null, "Kronos", "eternal", 11, "veryLightGrey", "baseTrapTurret", 6, 5.5);
kronos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: "kronosSkimmerTurret",
}});
kronos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: ["carrierTurret", {GUN_STAT_SCALE: g.battleship}],
}}, true, 4);
kronos.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 160, 0],
    TYPE: ["kronosTripletTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
}}, true, 4);

let ragnarok = new LayeredBoss(null, "Ragnarok", "eternal", 11, "aqua", "baseTrapTurret", 4.5, 3.5);
ragnarok.addLayer({gun: {
    POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
        TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 18);
ragnarok.addLayer({turret: {
    POSITION: [7, 8, 0, null, 160, 0],
    TYPE: "autoSmasherLauncherTurret",
}}, true, 5.5);
ragnarok.addLayer({turret: {
    POSITION: [8, 9, 0, null, 160, 0],
    TYPE: "gunnerCruiserTurret",
}}, true, 4.5);

let amun = new LayeredBoss(null, "Amun", "eternal", 11, "darkGrey", "baseTrapTurret", 6, 5.5);
amun.addLayer({turret: {
    POSITION: [6, 9, 0, null, 160, 0],
    TYPE: "desmosTurret",
}});
amun.addLayer({turret: {
    POSITION: [7.5, 9, 0, null, 160, 0],
    TYPE: "undertowTurret",
}}, true, 4);
amun.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 160, 0],
    TYPE: "forkTurret",
}}, true, 4);
Class.amun.ALPHA = 0.3

// Developer Bosses
Class.taureonCoreBase = {
    SHAPE: 4,
    COLOR: '#00A2E8'
};
Class.taureonCore = {
    PARENT: "genericTank",
    LABEL: "Core Turret",
    SHAPE: 4.5,
    COLOR: '#99D9EA',
    CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc"],
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [10, 14, -0.5, 14, 0, 0, 0]
    },{
        POSITION: [21, 15, -1.1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.destroyer, g.sniper]),
            TYPE: "snakeOld",
            STAT_CALCULATOR: "sustained"
        }
    }],
    TURRETS: [{
        POSITION: [20 * Math.SQRT2, 0, 0, 0, 0, 0],
        TYPE: "taureonCoreBase"
    }]
};
Class.taureonBase = {
    SHAPE: 4.5,
    COLOR: '#161B54',
    MIRROR_MASTER_ANGLE: true
};
let d = 1/4;
Class.taureonStar = {
    SHAPE: [[0,1],[d,d],[1,0],[d,-d],[0,-1],[-d,-d],[-1,0],[-d,d]],
    COLOR: '#3F48CC',
    MIRROR_MASTER_ANGLE: true
};
Class.taureonRailgunTurret = {
    PARENT: "genericTank",
    COLOR: "grey",
    LABEL: "Railgun Turret",
    CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc"],
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [20, 7, 1, 0, 0, 0, 0]
    },{
        POSITION: [24, 5, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.destroyer, { speed: 5, penetration: 0.8 }]),
            TYPE: "bullet"
        }
    },{
        POSITION: [5, 7.5, -1.6, 8, 0, 0, 0],
    }]
};
Class.taureonThruster = {
    PARENT: "genericTank",
    COLOR: "grey",
    LABEL: "Thruster",
    CONTROLLERS: ["onlyAcceptInArc"],
    GUNS: [{
        POSITION: [14, 12, 1, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.175, reload: 0.25, recoil: 0.25 }]),
            TYPE: ["bullet", { ALPHA: 0.5 }]
        }
    }, {
        POSITION: [12, 12, 1.4, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.175, reload: 0.25, recoil: 0.25 }]),
            TYPE: ["bullet", { ALPHA: 0.5 }]
        },
    }]
};
Class.taureonMissile = {
    PARENT: "bullet",
    LABEL: "Missile",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        ACCELERATION: 10,
        FOV: base.FOV * 2
    },
    TURRETS: [{
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: ["genericTank", {COLOR: "grey"}],
    }],
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: "thruster",
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { reload: 0.25, range: 0.075 }]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true, ALPHA: 0.5 }]
        }
    },{
        POSITION: [10, 12, 0.8, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: "thruster",
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { reload: 0.25, range: 0.075 }]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true, ALPHA: 0.5 }]
        }
    },...Array(32).fill().map((_, i)=>({
        POSITION: [0, (i % 4) + 1, 0, 0, 0, 0, 9999],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, { spray: 1e6, range: 0.5, shudder: 1.5, damage: 1 + (i % 4) }]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            SHOOT_ON_DEATH: true
        },
    }))]
};
Class.taureonBoss = {
    PARENT: "miniboss",
    LABEL: "Diamond Marauder",
    NAME: "Taureon",
    COLOR: '#2B339B',
    UPGRADE_COLOR: "spaceGem",
    DANGER: 10,
    SHAPE: 4.5,
    SIZE: 50,
    FACING_TYPE: "smoothToTarget",
    UPGRADE_TOOLTIP: "With a powerful Gatling Gun on the front, Rocket Launchers as wings, movable Thrusters on the back, " +
                    "and equipped with Railgun Turrets, it perfectly excells at terminating those who feel its Wrath.\n" +
                    "An octahedral carbon robot, exclusively designed to eradicate opponents with sheer brutality alone.\n" +
                    '"NOW YOU FACE MY ULTIMATE CREATION."',
    VALUE: 9e6,
    BODY: {
        FOV: 1,
        SPEED: 0.5 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
    TURRETS: [{
        POSITION: [23.3, 0, 0, 0, 0, 0],
        TYPE: "taureonBase"
    },{
        POSITION: [5, 10, 0, -45, 180, 0],
        TYPE: "taureonRailgunTurret"
    },{
        POSITION: [5, 10, 0, 45, 180, 0],
        TYPE: "taureonRailgunTurret"
    },{
        POSITION: [5, -10, -2, -45, 90, 0],
        TYPE: "taureonThruster"
    },{
        POSITION: [5, -10, 2, 45, 90, 0],
        TYPE: "taureonThruster"
    },{
        POSITION: [25, 0, 0, 0, 0, 1],
        TYPE: "taureonStar"
    },{
        POSITION: [5, 0, 0, 0, 360, 1],
        TYPE: "taureonCore"
    }],
    GUNS: [...Array(6).fill().map((_, i) => ({
        POSITION: [18, 1.75, 1, 0, Math.cos(Math.PI * i / 3) * 2, 0, i / 6],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, { speed: 2, maxSpeed: 2, damage: 0.75, size: 0.8 }]),
            TYPE: "bullet"
        }
    })),{
        POSITION: [4, 5, -0.5, 12, 0, -90, 0]
    },{
        POSITION: [10, 5, -1.2, 5, 0, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, g.destroyer, { shudder: 0.1, reload: 0.6, speed: 5, range: 2 }]),
            TYPE: "taureonMissile",
            STAT_CALCULATOR: "sustained"
        }
    },{
        POSITION: [4, 5, -0.5, 12, 0, 90, 0]
    },{
        POSITION: [10, 5, -1.2, 5, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, g.destroyer, { shudder: 0.1, reload: 0.6, speed: 5, range: 2 }]),
            TYPE: "taureonMissile",
            STAT_CALCULATOR: "sustained"
        }
    },{
        POSITION: [5.5, 5, -1.5, 5, 0, -45, 0]
    },{
        POSITION: [5.5, 5, -1.5, 5, 0, 45, 0]
    },{
        POSITION: [2, 7, 1, 8, 0, 0, 0]
    },{
        POSITION: [2, 7, 1, 14.5, 0, 0, 0]
    }]
};

Class.tgsEggDeco = makeDeco(0, "mirror")
Class.tgsSquareDeco = makeDeco(4, "mirror")
Class.tgsSunchip = {
    PARENT: "drone",
    LABEL: "Omega Sunchip",
    SHAPE: 4,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: 0.5,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: ["tgsSquareDeco", { MIRROR_MASTER_ANGLE: true }]
    },{
        POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 0, 0, 1],
        TYPE: ["tgsSquareDeco", { MIRROR_MASTER_ANGLE: true }]
    },{
        POSITION: [20 * Math.SQRT1_2 ** 3, 0, 0, 45, 0, 1],
        TYPE: ["tgsSquareDeco", { MIRROR_MASTER_ANGLE: true }]
    }]
}
Class.tgsEggchip = {
    PARENT: "drone",
    LABEL: "Beta Sunchip",
    SHAPE: 0,
    HITS_OWN_TYPE: "hard",
    BODY: {
        FOV: 0.5,
    },
    AI: {
        BLIND: true,
        FARMER: true,
    },
    TURRETS: [{
        POSITION: [10, 0, 0, 45, 0, 1],
        TYPE: "tgsEggDeco"
    }]
}
Class.tgsBoss = {
    PARENT: "miniboss",
    LABEL: "Shiny Omega Thaumaturge",
    NAME: "TGS",
    DANGER: 10,
    SHAPE: 4,
    COLOR: "lightGreen",
    UPGRADE_COLOR: "lightGreen",
    SIZE: 50,
    VALUE: 5e6,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1,
        atk: 1,
        hlt: 1,
        shi: 1,
        rgn: 1,
        mob: 1,
    }),
    BODY: {
        FOV: 0.75,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 15 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
    },
    UPGRADE_TOOLTIP: "Someone has taken their love of Shiny Squares one step too far.",
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: [2.5, 3, 1.2, 8, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, { speed: 2.5 }, g.machineGun, { spray: 50, speed: 1.25, shudder: 1.25 }]),
                TYPE: "tgsEggchip",
                MAX_CHILDREN: 8,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                NO_LIMITATIONS: true,
            }
        }, 0),
        {
            POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, g.destroyer, { speed: 2.5 }, { maxSpeed: 3 }]),
                TYPE: "tgsSunchip",
                MAX_CHILDREN: 4,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                NO_LIMITATIONS: true,
            }
        }
    ], 4),
    TURRETS: [{
        POSITION: [20 * Math.SQRT1_2, 0, 0, 45, 0, 1],
        TYPE: "tgsSquareDeco"
    },{
        POSITION: [20 * Math.SQRT1_2 ** 2, 0, 0, 0, 0, 1],
        TYPE: "tgsSquareDeco"
    },{
        POSITION: [20 * Math.SQRT1_2 ** 3, 0, 0, 45, 0, 1],
        TYPE: "tgsSquareDeco"
    }]
};

Class.dogeiscutBody = {
    PARENT: "genericTank",
    COLOR: "grey",
    SHAPE: [[1,0],[-0.7,0.7],[-0.35,0],[-0.7,-0.7]]
}
Class.dogeiscutTurret = {
    PARENT: "genericTank",
    COLOR: "grey",
    GUNS: [ {
            POSITION: [ 50, 5, 2.5, 0, 0, 0, 0, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.minigun, {reload: 0.1}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [ 18, 8, -2, 0, 0, 0, 0, ],
        }, 
    ],
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ["genericTank",  { MIRROR_MASTER_ANGLE: true, COLOR: "#f6c6a2"}],
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ["genericTank",  { MIRROR_MASTER_ANGLE: true, COLOR: "pink"}],
        },
    ]
}
function createDogeiscutMissileTurret(color) {
    return {
        PARENT: "genericTank",
        COLOR: "grey",
        GUNS: [ {
                POSITION: [ 15, 8, 2.5, 0, 0, 180, 0, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.skimmer,
                        { reload: 0.5 },
                        g.lowPower,
                        { recoil: 1.35 },
                        { speed: 1.3, maxSpeed: 1.3 },
                        { speed: 1.3, maxSpeed: 1.3 },
                        {reload: 0.15, recoil: 1, range: 0.1}]),
                    TYPE: ["bullet", 
                        {
                        PERSISTS_AFTER_DEATH: true,
                        COLOR: color
                        },
                    ],
                    AUTOFIRE: true,
                    STAT_CALCULATOR: "thruster",
                },
            },
        ],
    }
}
function createDogeiscutMissile(color) {
    return {
        PARENT: "bullet",
        LABEL: color + " Missile",
        COLOR: color,
        GUNS: [...Array(11).fill().map((_, i)=>({
            POSITION: [0, 8, 0, 0, 0, ((360) / 11)*i, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.noSpread, { recoil: 0, range: 0.4, damage: 2.5, density: 30 }]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true, COLOR: color }],
                SHOOT_ON_DEATH: true,
            },
        }))],
        TURRETS: [
            {
                POSITION: [16, 0, 0, 0, 360, 1],
                TYPE: ["dogeiscutMissileTurret_" + color],
            },
            {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: ["genericTank", {COLOR: "grey"}],
            }
        ]
    }
}
Class.dogeiscutMissileTurret_red = createDogeiscutMissileTurret('red')
Class.dogeiscutMissile_red = createDogeiscutMissile('red')
Class.dogeiscutMissileTurret_orange = createDogeiscutMissileTurret('orange')
Class.dogeiscutMissile_orange = createDogeiscutMissile('orange')
Class.dogeiscutMissileTurret_yellow = createDogeiscutMissileTurret('yellow')
Class.dogeiscutMissile_yellow = createDogeiscutMissile('yellow')
Class.dogeiscutMissileTurret_green = createDogeiscutMissileTurret('green')
Class.dogeiscutMissile_green = createDogeiscutMissile('green')
Class.dogeiscutMissileTurret_cyan = createDogeiscutMissileTurret('cyan')
Class.dogeiscutMissile_cyan = createDogeiscutMissile('cyan')
Class.dogeiscutMissileTurret_blue = createDogeiscutMissileTurret('blue')
Class.dogeiscutMissile_blue = createDogeiscutMissile('blue')
Class.dogeiscutMissileTurret_purple = createDogeiscutMissileTurret('purple')
Class.dogeiscutMissile_purple = createDogeiscutMissile('purple')
Class.dogeiscutBomb = {
        PARENT: "trap",
        LABEL: "Bomb",
        SHAPE: 0,
        GUNS: [...Array(32).fill().map((_, i)=>({
            POSITION: [0, 8, 0, 0, 0, ((360) / 32)*i, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.noSpread, { recoil: 0, range: 0.4, damage: 2.5, size: 0.5}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true,
            },
        })),...Array(10).fill().map((_,i)=>({
            POSITION: [12, 3.5, 1, 0, 0, (360/10)*i, (i%3)/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.twin,
                    g.gunner,
                    g.cyclone,
                    {reload: 3}
                ]),
                TYPE: "bullet",
                AUTOFIRE: true,
            },
            }))
        ],
        TURRETS: [
            {
                POSITION: [8, 0, 0, 0, 360, 1],
                TYPE: ["genericTank", {COLOR: "grey"}],
            }
        ]
    }
Class.dogeiscutBoss = {
    PARENT: "miniboss",
    LABEL: "DOG",
    NAME: "DogeisCut",
    DANGER: 10,
    FACING_TYPE: "smoothToTarget",
    UPGRADE_TOOLTIP: "Huh? You want a cool and edgy boss tooltip? Too bad!", 
    SYNC_WITH_TANK: true,
    SHAPE: [[1,0],[-0.7,0.7],[-0.35,0],[-0.7,-0.7]],
    COLOR: "yellow",
    UPGRADE_COLOR: "yellow",
    SIZE: 50,
    NO_SIZE_ANIMATION: true,
    VALUE: 5e6,
    BODY: {
        FOV: 0.75,
        SPEED: 0.25 * base.SPEED,
        HEALTH: 14 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    GUNS: [ {
            POSITION: [ 6, 8, 1.5, 3, 0, 180, 0, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, {size: 1, reload: 3, recoil: 5}]),
                TYPE: ["dogeiscutBomb"],
                STAT_CALCULATOR: "sustained",
            }
        }, {
            POSITION: [ 4, 4, 1.5, 3, 0, 180, 0, ],
            PROPERTIES: {
                COLOR: "black"
            }
        }, 
        
        {
            POSITION: [ 1, 2, 1, 4, -8, 68, 0, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_red"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'red'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, -5.333, 68, 1/7, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_orange"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'orange'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, -2.666, 68, (1/7)*2, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_yellow"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'yellow'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 0, 68, (1/7)*3, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_green"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'green'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 2.666, 68, (1/7)*4, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_cyan"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'cyan'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 5.333, 68, (1/7)*5, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_blue"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'blue'
            }
        }, {
        POSITION: [ 1, 2, 1, 4, 8, 68, (1/7)*6, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_purple"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'purple'
            }
        }, 
        
        
        {
        POSITION: [ 1, 2, 1, 4, 8, -68, 0, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_red"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'red'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 5.333, -68, 1/7, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_orange"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'orange'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 2.666, -68, (1/7)*2, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_yellow"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'yellow'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, 0, -68, (1/7)*3, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_green"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'green'
            }
        }, {
        POSITION: [ 1, 2, 1, 4, -2.666, -68, (1/7)*4, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_cyan"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'cyan'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, -5.333, -68, (1/7)*5, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_blue"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'blue'
            }
        }, {
            POSITION: [ 1, 2, 1, 4, -8, -68, (1/7)*6, ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder, {speed: 3, range: 0.8, reload: 4}]),
                TYPE: ["dogeiscutMissile_purple"],
                STAT_CALCULATOR: "sustained",
                COLOR: 'purple'
            }
        },
    ],
    TURRETS: [
        {
            POSITION: [16, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutBody",  { MIRROR_MASTER_ANGLE: true, COLOR: "#f6c6a2"}],
        },
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutBody",  { MIRROR_MASTER_ANGLE: true, COLOR: "pink"}],
        },
        {
            POSITION: [5, 0, 0, 0, 360, 1],
            TYPE: ["dogeiscutTurret",  { INDEPENDENT: true, CONTROLLERS: ["nearestDifferentMaster"], COLOR: "yellow" }],
        },
        {
            POSITION: [1, 10.5, 0, 0, 360, 0],
            TYPE: ["genericTank",  {COLOR: "black"}],
        },
    ]
}
Class.trplnrBossAuraBulletAura = makeAura(1, 0.8)
Class.trplnrBossAuraBullet = {
    PARENT: 'genericTank',
    LABEL: 'Nest',
    SHAPE: -4,
    PERSISTS_AFTER_DEATH: true,
    BODY: {
        HEALTH: 100,
    },
    SIZE: 25,
    COLOR: '#F49EFF',
    GLOW: {
        STRENGTH: 25,
        COLOR: 'mirror',
        ALPHA: 1
    },
    DRAW_HEALTH: true,
    GUNS: weaponArray({
        POSITION: { ASPECT: -0.35, X: -5 },
        PROPERTIES: {
            COLOR: 'white',
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, { size: 0.8 }, {reload: 1.6, damage: 1.5}]),
            TYPE: 'autoswarm',
            AUTOFIRE: true,
        },
    }, 4),
    TURRETS: [
        {
            POSITION: {SIZE: 10, LAYER: 1},
            TYPE: "trplnrBossAuraBulletAura"
        }
    ]
}
const trplnrBossDecor = {
    COLOR: '#F49EFF',
    UPGRADE_COLOR: "lavender",
    LABEL: 'Lavender',
    NAME: 'Trioplane',
    SHAPE: 3,
    SIZE: 25,
    VALUE: 5e7,
    DANGER: 10,
    GLOW: {
        RADIUS: 15,
        COLOR: 'mirror',
        ALPHA: 1,
        RECURSION: 5
    },
    PROPS: [{
        POSITION: { SIZE: 25 ** Math.SQRT1_2, ANGLE: 180, LAYER: 1 },
        TYPE: ['triangle', { COLOR: 'black', MIRROR_MASTER_ANGLE: true }]
    }, {
        POSITION: { SIZE: 25 ** Math.SQRT1_2, LAYER: 1 },
        TYPE: ['triangle', { COLOR: -1, MIRROR_MASTER_ANGLE: true }]
    }, {
        POSITION: { SIZE: 25 },
        TYPE: ['triangle', { COLOR: 'black', MIRROR_MASTER_ANGLE: true }]
    }],
}
Class.trplnrBoss = {
    PARENT: "miniboss",
    ...trplnrBossDecor,
    NO_SIZE_ANIMATION: true,
    UPGRADE_TOOLTIP: "\"Heck, even The Guardians are afraid of him, \n" + 
                     "They usually call him the The Light, Victory, Death and Ruler of the Pentagon Race a.k.a Lvndr. \n" +
                     "We don't know where his teleportation powers came from, \n" +
                     "He was secretive of it. \n" +
                     "Though some say there was an old script found at the Neutrality Point \n" +
                     "at the middle of the nest when it still existed, It had some \n" +
                     "sort of drawing of a tank going through walls, and this thing that said '6@D M0|)3 \n" +
                     "Nest Reseachers still haven't been able to decipher it though. \n" +
                     "One day, The Neutrality Point left and on that same day, \n" +
                     "A sentry's child went missing, \n" +
                     "Coincidence? I think not.\"", 
    BODY: {
        HEALTH: 500,
    },
    ON: [
        {
            event: 'fire',
            handler: ({ body, gun }) => {
                if (gun.identifier != 'onHandler') return
                const messages = [
                    'Attack my little swarms!',
                    'Deploying, Attack swarms',
                    'You really think you can defeat me? Heres a little challenge for you.',
                    'This thing is really gonna annoy you HAHA!',
                    'I don\'t know what to say uhhh, die i guess.'
                ]
                sockets.broadcast(messages[Math.floor(Math.random() * messages.length)])
                sockets.broadcast('Lavender will turn into `BULL3T HELL F0rM`, Run!')
                for (let i = 0; i < 24; i++) {
                    i < 12 ?
                        setTimeout(() => { body.SIZE /= 1.1; body.alpha /= 1.2 }, i * 50)
                        :
                        setTimeout(() => { body.SIZE *= 1.1; body.alpha *= 1.2 }, i * 50)
                }
                setTimeout(() => {
                    let range = 500
                    let whereToGoX = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
                    let whereToGoY = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
                    body.x += whereToGoX
                    body.y += whereToGoY
                }, 12 * 50);
                setTimeout(() => body.define('trplnrBossBulletHellForm'), 24 * 50)
            }
        }
    ],
    GUNS: [
        ...weaponArray({
            POSITION: { WIDTH: 10, X: -5, ASPECT: -0.7, ANGLE: 180 },
            PROPERTIES: {
                COLOR: 'white',
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 100}]),
                TYPE: "trplnrBossAuraBullet",
                INDEPENDENT_CHILDREN: true,
            }
        }, 2),
        {
            POSITION: { WIDTH: 10, X: -5, ASPECT: -0.7, ANGLE: 60 },
            PROPERTIES: {
                COLOR: 'white',
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 100}]),
                TYPE: "trplnrBossAuraBullet",
                INDEPENDENT_CHILDREN: true,
                IDENTIFIER: 'onHandler',
                ALPHA: 0,
            }
        },
        ...weaponArray({
            POSITION: { WIDTH: 5, ASPECT: -0.7, ANGLE: 60 },
            PROPERTIES: {
                COLOR: 'black'
            }
        }, 3),
        ...weaponArray([
            {
                POSITION: { WIDTH: 5, HEIGHT: 5, X: -30, ASPECT: 0, ANGLE: 60 },
                PROPERTIES: {
                    COLOR: 'black'
                }
            }, {
                POSITION: { WIDTH: 5, HEIGHT: 5, X: -25, ASPECT: 0, ANGLE: 60 },
                PROPERTIES: {
                    COLOR: 'white'
                }
            }
        ], 3)
    ]
}

Class.trplnrBossBulletHellFormPentagonsAuraBullet = {
    PARENT: 'bullet',
    PERSISTS_AFTER_DEATH: true,
    TURRETS: [{
        POSITION: {SIZE: 13, LAYER: 1},
        TYPE: "trplnrBossAuraBulletAura"
    }]
} 

Class.trplnrBossBulletHellFormPentagons = {
    PARENT: 'bullet',
    LABEL: 'Pentagon',
    SHAPE: -5,
    PROPS: [{
        POSITION: { SIZE: 40 ** Math.SQRT1_2, ANGLE: 180, LAYER: 1 },
        TYPE: ['pentagon', {COLOR: 'black', MIRROR_MASTER_ANGLE: true}]
    }],
    GUNS: weaponArray({
        POSITION: { WIDTH: 10, HEIGHT: 10, ANGLE: 180, DELAY: 11.5 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, {reload: 0.4}]),
            TYPE: 'trplnrBossBulletHellFormPentagonsAuraBullet',
            AUTOFIRE: true,
            COLOR: 'white',
        }
    }, 5)
}
Class.trplnrBossBulletHellForm = {
    PARENT: "miniboss",
    ...trplnrBossDecor,
    LABEL: 'Lavender - Bullet Hell Form',
    BODY: {
        HEALTH: 500,
    },
    ON: [
        {
            event: "fire",
            handler: ({ body, masterStore, gun }) => {
                if (gun.identifier != 'onHandler') return
                masterStore.shotsFired ??= 0
                masterStore.shotsFired++

                for (let i = 0; i < 24; i++) {
                    i < 12 ?
                        setTimeout(() => { body.SIZE /= 1.1; body.alpha /= 1.2 }, i * 50)
                        :
                        setTimeout(() => { body.SIZE *= 1.1; body.alpha *= 1.2 }, i * 50)
                }
                setTimeout(() => {
                    let range = 500
                    let whereToGoX = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
                    let whereToGoY = Math.random() > 0.5 ? Math.floor(Math.random() * -range) : Math.floor(Math.random() * range)
                    body.x += whereToGoX
                    body.y += whereToGoY
                }, 12 * 50)

                if (masterStore.shotsFired > 5) {
                    body.define('trplnrBossVulnerableForm')
                    const messages = [
                        'I\'m a little tired right now',
                        'Ouch my leg!',
                        'i sleep',
                        'Bruh my keyboard isn\'t working',
                        'Omg bruh I chose the wrong form'
                    ]
                    sockets.broadcast(messages[Math.floor(Math.random() * messages.length)])
                    sockets.broadcast('Lavender is in its `VULN3RABLE F0RM`, Attack!')
                }
            }
        }
    ],
    GUNS: [
        ...weaponArray([
            {
                POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: 180, ASPECT: 0, X: -25 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 1 }]),
                    TYPE: 'trplnrBossBulletHellFormPentagonsAuraBullet',
                    COLOR: 'black'
                }
            }, {
                POSITION: { WIDTH: 15, HEIGHT: 5, ANGLE: 180, ASPECT: 0, X: -20 },
                PROPERTIES: {
                    COLOR: 'white'
                }
            }, {
                POSITION: { WIDTH: 10, HEIGHT: 5, ASPECT: 1.5, ANGLE: 180 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 3 }]),
                    TYPE: 'trplnrBossBulletHellFormPentagons',
                    COLOR: 'white'
                }
            }, {
                POSITION: { WIDTH: 8, HEIGHT: 3, X: -1, ASPECT: 1.5, ANGLE: 180 },
                PROPERTIES: {
                    COLOR: 'pureWhite',
                }
            }, {
                POSITION: { WIDTH: 5, HEIGHT: 10, X: 5, ASPECT: 0.2, ANGLE: 180 },
                PROPERTIES: {
                    COLOR: -1,
                }
            }
        ], 3),
        {
            POSITION: { WIDTH: 0, HEIGHT: 0 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 2 }, g.fake]),
                TYPE: 'bullet',
                IDENTIFIER: 'onHandler',
                ALPHA: 0
            }
        }
    ],
}
Class.trplnrBossVulnerableForm = {
    PARENT: "miniboss",
    ...trplnrBossDecor,
    LABEL: 'Lavender - Vulnerable Form',
    BODY: {
        HEALTH: 500,
        SPEED: 0.1
    },
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                body.store.ticks ??= 0
                body.store.ticks++
                const spawnCrashers = body.store.ticks % 3 == 0
                const spawnSentries = body.store.ticks % 60 == 0
                const sentries = ["sentrySwarm", "sentryGun", "sentryTrap"]
                if (spawnCrashers) new Entity(body, body).define("crasher")
                if (spawnSentries) new Entity(body, body).define(sentries[Math.floor(Math.random() * sentries.length)])
            }
        },
        {
            event: "fire",
            handler: ({ body, gun }) => {
                if (gun.identifier != 'onHandler') return
                setTimeout(() => {
                    body.define('trplnrBoss')
                    sockets.broadcast('im awake')
                }, 15000)
                setTimeout(() => sockets.broadcast('Lavender will activate in 10 seconds and turn into S4nctuary F0rM'), 5000)
            }
        }
    ],
    GUNS: [{
        POSITION: {LENGTH: 0, WIDTH: 0},
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, {reload: 500}]),
            TYPE: 'bullet',
            AUTOFIRE: true,
            IDENTIFIER: 'onHandler',
            ALPHA: 0
        }
    }]
}
// ZYRAFAQ DEV TANK (as a boss)
Class.zyrafaqBoss = {
    PARENT: "bot",
    SHAPE: [
        [-1, -0.8],
        [-0.8, -1],
        [0.8, -1],
        [1, -0.8],
        [0.2, 0],
        [1, 0.8],
        [0.8, 1],
        [-0.8, 1],
        [-1, 0.8],
    ],
    LABEL: "Developer",
    UPGRADE_LABEL: "Zyrafaq BOSS WIP",
    BROADCAST_MESSAGE: "A visitor has left!",
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10,
                ASPECT: -1.4,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op]),
                TYPE: "developerBullet",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [28, 0, 0, 0, 360, 0],
            TYPE: ["TheDeveloperShapeNoGlow", { COLOR: "mirror", CONTROLLERS: [["spin", {speed: 0.04, independent: true}]] }],
            INDEPENDENT: true,
        },
        // {
        //     POSITION: [21, 0, 0, 0, 360, 1],
        //     TYPE: ["starturret",{CONTROLLERS: [ ["spin", {speed: 0.04, independent: true}] ], COLOR: "#ffffff", BORDERLESS: true}],
        // },
    ]
};
for (let i = 1; i < 5; i++) {
    Class.zyrafaqBoss.TURRETS.push({
        POSITION: {
            LENGTH: (43 * i) / 25,
            WIDTH: 0,
            ASPECT: 0,
            X: 0,
            Y: 0,
            ANGLE: 360,
            DELAY: 0,
        },
        TYPE: "zyrafaqAura",
        COLOR: 31,
        INDEPENDENT: false,
    });
}

Class.zyrafaqAura = makeAura(2, 0.7, 0.08, "blue");
Class.theDeveloperShape = {
    PARENT: "genericEntity",
    LABEL: "The Developer Shape",
    SHAPE: 6,
    DAMAGE_CLASS: 1,
    GLOW: {
        RADIUS: 2,
        COLOR: 43,
        ALPHA: 1.9,
        RECURSION: 6,
    },
    COLOR: 12,
    BODY: {
        SPEED: 0,
        HEALTH: base.HEALTH * 25000000000,
        DAMAGE: base.DAMAGE * 10,
        SHIELD: base.SHIELD * 50000,
        REGEN: base.REGEN * 2500000,
        FOV: base.FOV * 5,
        SIZE: 1,
    },
};
Class.TheDeveloperShapeNoGlow = {
    PARENT: "theDeveloperShape",
    LABEL: "The Developer Shape (No glow)",
    GLOW: null,
};
Class.frostAuraSmall = {
	PARENT: "aura",
	LAYER: 30,
	FACING_TYPE: ["spin", {speed: -0.04}],
    BORDERLESS: true,
	SHAPE: "M 1 0 L 0.715 0.519 L 0.309 0.951 L -0.273 0.84 L -0.809 0.588 L -0.883 0 L -0.809 -0.588 L -0.273 -0.84 L 0.309 -0.951 L 0.715 -0.519 L 1 0",
    TURRETS: [{
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: 'frostAuraSmallOutline'
    }]
}
Class.frostAuraSmallOutline = {
    PARENT: "aura",
	MIRROR_MASTER_ANGLE: true,
    DRAW_FILL: false,
	SHAPE: "M 1 0 L 0.715 0.519 L 0.309 0.951 L -0.273 0.84 L -0.809 0.588 L -0.883 0 L -0.809 -0.588 L -0.273 -0.84 L 0.309 -0.951 L 0.715 -0.519 L 1 0" + 
		"L 0.309 0.951 L -0.809 0.588 L -0.809 -0.588 L 0.309 -0.951 L 1 0" + 
		"L 0 0 L 0.309 0.951 M 0 0 L -0.809 0.588 M 0 0 L -0.809 -0.588 M 0 0 L 0.309 -0.951",
}
Class.frostAuraLarge = {
	PARENT: "aura",
	LAYER: 30,
	FACING_TYPE: ["spin", {speed: -0.04}],
	BORDERLESS: true,
	SHAPE: "M 1 0 L 0.988 0.156 L 0.951 0.309 L 0.891 0.454 L 0.809 0.588 L 0.707 0.707 L 0.588 0.809 L 0.454 0.891 L 0.309 0.951 L 0.156 0.988 L 0 1 L -0.156 0.988 L -0.309 0.951 L -0.454 0.891 L -0.588 0.809 L -0.707 0.707 L -0.809 0.588 L -0.891 0.454 L -0.951 0.309 L -0.988 0.156 L -1 0 L -0.988 -0.156 L -0.951 -0.309 L -0.891 -0.454 L -0.809 -0.588 L -0.707 -0.707 L -0.588 -0.809 L -0.454 -0.891 L -0.309 -0.951 L -0.156 -0.988 L 0 -1 L 0.156 -0.988 L 0.309 -0.951 L 0.454 -0.891 L 0.588 -0.809 L 0.707 -0.707 L 0.809 -0.588 L 0.891 -0.454 L 0.951 -0.309 L 0.988 -0.156 L 1 0",
    TURRETS: [{
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: 'frostAuraLargeOutline'
    }]
}
Class.frostAuraLargeOutline = {
    PARENT: "aura",
	MIRROR_MASTER_ANGLE: true,
    DRAW_FILL: false,
	SHAPE: "M 1 0 L 0.988 0.156 L 0.951 0.309 L 0.891 0.454 L 0.809 0.588 L 0.707 0.707 L 0.588 0.809 L 0.454 0.891 L 0.309 0.951 L 0.156 0.988 L 0 1 L -0.156 0.988 L -0.309 0.951 L -0.454 0.891 L -0.588 0.809 L -0.707 0.707 L -0.809 0.588 L -0.891 0.454 L -0.951 0.309 L -0.988 0.156 L -1 0 L -0.988 -0.156 L -0.951 -0.309 L -0.891 -0.454 L -0.809 -0.588 L -0.707 -0.707 L -0.588 -0.809 L -0.454 -0.891 L -0.309 -0.951 L -0.156 -0.988 L 0 -1 L 0.156 -0.988 L 0.309 -0.951 L 0.454 -0.891 L 0.588 -0.809 L 0.707 -0.707 L 0.809 -0.588 L 0.891 -0.454 L 0.951 -0.309 L 0.988 -0.156 L 1 0" + 
        "M 0.988 -0.156 L 0.988 0.156 L 0.891 0.454 L 0.707 0.707 L 0.454 0.891 L 0.156 0.988 L -0.156 0.988 L -0.454 0.891 L -0.707 0.707 L -0.891 0.454 L -0.988 0.156 L -0.988 -0.156 L -0.891 -0.454 L -0.707 -0.707 L -0.454 -0.891 L -0.156 -0.988 L 0.156 -0.988 L 0.454 -0.891 L 0.707 -0.707 L 0.891 -0.454 L 0.988 -0.156 L 0.949 0" + 
        "L 0.988 0.156 L 0.891 0.256 L 0.891 0.454 L 0.739 0.537 L 0.707 0.707 L 0.519 0.769 L 0.454 0.891 L 0.293 0.902 L 0.156 0.988 L 0.032 0.927 L -0.156 0.988 L -0.282 0.869 L -0.454 0.891 L -0.571 0.731 L -0.707 0.707 L -0.768 0.558 L -0.891 0.454 L -0.871 0.317 L -0.988 0.156 L -0.914 0 L -0.988 -0.156 L -0.871 -0.317 L -0.891 -0.454 L -0.768 -0.558 L -0.707 -0.707 L -0.571 -0.731 L -0.454 -0.891 L -0.282 -0.869 L -0.156 -0.988 L 0.032 -0.927 L 0.156 -0.988 L 0.293 -0.902 L 0.454 -0.891 L 0.519 -0.769 L 0.707 -0.707 L 0.739 -0.537 L 0.891 -0.454 L 0.891 -0.256 L 0.988 -0.156 L 0.949 0" + 
        "L 0.891 0.256 L 0.739 0.537 L 0.519 0.769 L 0.293 0.902 L 0.032 0.927 L -0.282 0.869 L -0.571 0.731 L -0.768 0.558 L -0.871 0.317 L -0.914 0 L -0.871 -0.317 L -0.768 -0.558 L -0.571 -0.731 L -0.282 -0.869 L 0.032 -0.927 L 0.293 -0.902 L 0.519 -0.769 L 0.739 -0.537 L 0.891 -0.256 L 0.949 0" + 
        "M 0.834 0 L 0.891 0.256 L 0.704 0.291 L 0.739 0.537 L 0.495 0.579 L 0.519 0.769 L 0.258 0.793 L 0.032 0.927 L -0.06 0.759 L -0.282 0.869 L -0.398 0.649 L -0.571 0.731 L -0.674 0.49 L -0.871 0.317 L -0.741 0.178 L -0.914 0 L -0.741 -0.178 L -0.871 -0.317 L -0.674 -0.49 L -0.571 -0.731 L -0.398 -0.649 L -0.282 -0.869 L -0.06 -0.759 L 0.032 -0.927 L 0.258 -0.793 L 0.519 -0.769 L 0.495 -0.579 L 0.739 -0.537 L 0.704 -0.291 L 0.891 -0.256 L 0.834 0" + 
        "L 0.704 0.291 L 0.495 0.579 L 0.258 0.793 L -0.06 0.759 L -0.398 0.649 L -0.674 0.49 L -0.741 0.178 L -0.741 -0.178 L -0.674 -0.49 L -0.398 -0.649 L -0.06 -0.759 L 0.258 -0.793 L 0.495 -0.579 L 0.704 -0.291 L 0.834 0" + 
        "M 0.592 0 L 0.704 0.291 L 0.413 0.3 L 0.495 0.579 L 0.183 0.563 L -0.06 0.759 L -0.158 0.485 L -0.398 0.649 L -0.479 0.348 L -0.741 0.178 L -0.51 0 L -0.741 -0.178 L -0.479 -0.348 L -0.398 -0.649 L -0.158 -0.485 L -0.06 -0.759 L 0.183 -0.563 L 0.495 -0.579 L 0.413 -0.3 L 0.704 -0.291 L 0.592 0" + 
        "L 0.413 0.3 L 0.183 0.563 L -0.158 0.485 L -0.479 0.348 L -0.51 0 L -0.479 -0.348 L -0.158 -0.485 L 0.183 -0.563 L 0.413 -0.3 L 0.592 0" + 
        "M 0.292 0 L 0.413 0.3 L 0.09 0.277 L -0.158 0.485 L -0.236 0.171 L -0.51 0 L -0.236 -0.171 L -0.158 -0.485 L 0.09 -0.277 L 0.413 -0.3 L 0.292 0 L 0.09 0.277" + 
        "L -0.236 0.171 L -0.236 -0.171 L 0.09 -0.277 L 0.292 0 M 0 0 L 0.949 0" + 
        "M 0 0 L 0.293 0.902 M 0 0 L -0.768 0.558 M 0 0 L -0.768 -0.558 M 0 0 L 0.293 -0.902",
}
Class.frostAuraSymbol = {
	PARENT: "genericTank",
	CONTROLLERS: [["spin", { speed: -0.04 }]],
	INDEPENDENT: true,
    BORDERLESS: true,
	COLOR: 'teal',
	SHAPE: "M 1 0 L 0.797 0.46 L 0.5 0.866 L 0 0.92 L -0.5 0.866 L -0.797 0.46 L -1 0 L -0.797 -0.46 L -0.5 -0.866 L 0 -0.92 L 0.5 -0.866 L 0.797 -0.46 L 1 0 Z",
    TURRETS: [{
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: 'frostAuraSymbolOutline'
    }]
}
Class.frostAuraSymbolOutline = {
    PARENT: "genericTank",
	MIRROR_MASTER_ANGLE: true,
    DRAW_FILL: false,
	SHAPE: "M 1 0 L 0.797 0.46 L 0.5 0.866 L 0 0.92 L -0.5 0.866 L -0.797 0.46 L -1 0 L -0.797 -0.46 L -0.5 -0.866 L 0 -0.92 L 0.5 -0.866 L 0.797 -0.46 L 1 0 Z" +
	    "M 0.52 0.3 L 0.52 -0.3 L 0.797 -0.46 M 0.52 -0.3 L 0 -0.6 L 0 -0.92 M 0 -0.6 L -0.52 -0.3 L -0.797 -0.46 M -0.52 -0.3 L -0.52 0.3 L -0.797 0.46 M -0.52 0.3 L 0 0.6 L 0 0.92 M 0 0.6 L 0.52 0.3 L 0.797 0.46"
}

function addIcosphereAura(damageFactor = 1, sizeFactor = 1, opacity = 0.3, auraSize = "Medium") {
	let auraType = "frostAura" + auraSize;
	return {
		PARENT: "genericTank",
		INDEPENDENT: true,
		LABEL: "",
		COLOR: 17,
		GUNS: [
			{
				POSITION: [0, 20, 1, 0, 0, 0, 0,],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
					TYPE: [auraType, {ALPHA: opacity}],
					MAX_CHILDREN: 1,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				}, 
			}, 
		],
		TURRETS: [
			{
				POSITION: [20, 0, 0, 0, 360, 1],
				TYPE: "frostAuraSymbol"
			},
		]
	};
}
Class.frostAuraBlockTop = {
	SHAPE: "M -1.3 -0.15 L -1.3 0.15 L -0.3 0.3 L -0.15 1.3 L 0.15 1.3 L 0.3 0.3 L 1.3 0.15 L 1.3 -0.15 L 0.3 -0.3 L 0.15 -1.3 L -0.15 -1.3 L -0.3 -0.3 Z",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	MIRROR_MASTER_ANGLE: true,
}
Class.frostAuraBlockTurret = {
	PARENT: "genericTank",
    INDEPENDENT: true,
	COLOR: 17,
    CONTROLLERS: ["nearestDifferentMaster"],
	LABEL: "",
	BODY: {
		FOV: 2,
	},
	HAS_NO_RECOIL: true,
	GUNS: [
		{
			POSITION: [18, 15, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [23, 11, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, {density: 0.2}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [15, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
}
Class.frostAuraBlockAura = addIcosphereAura(0.25, 1.6, 0.15, "Small");
Class.frostAuraBlock = {
	PARENT: 'unsetTrap',
	TURRETS: [
		{
			POSITION: [20, 0, 0, 45, 0, 1],
			TYPE: 'frostAuraBlockTop'
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: 'frostAuraBlockTurret'
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: 'frostAuraBlockAura'
		}
	]
}
Class.frostBossBigAura = addIcosphereAura(1.5, 1.45, 0.3, "Large");

Class.frostBossAutoTurret = {
	PARENT: "autoTankGun",
	INDEPENDENT: true,
	COLOR: 17,
	GUNS: [
		{
			POSITION: [17, 14, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, {recoil: 0.1}, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, {recoil: 0.1}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [14, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, {recoil: 0.1}, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: -1, BORDERLESS: true}],
		},
	],
}

Class.frostBossBaseDeco = {
	SHAPE: "M -1.1 0 L -0.956 0.292 L -0.669 0.205 L -0.669 -0.205 L -0.956 -0.292 Z" +
		"M -0.55 0.952 L -0.225 0.974 L -0.157 0.682 L -0.512 0.477 L -0.731 0.682 Z" +
		"M -0.55 -0.952 L -0.225 -0.974 L -0.157 -0.682 L -0.512 -0.477 L -0.731 -0.682 Z" +
		"M 0.55 0.952 L 0.225 0.974 L 0.157 0.682 L 0.512 0.477 L 0.731 0.682 Z" +
		"M 0.55 -0.952 L 0.225 -0.974 L 0.157 -0.682 L 0.512 -0.477 L 0.731 -0.682 Z" +
		"M 1.1 0 L 0.956 0.292 L 0.669 0.205 L 0.669 -0.205 L 0.956 -0.292 Z",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: weaponArray([
        {
			POSITION: [1.75, 3, -0.75, 7.5, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 2.5, SATURATION_SHIFT: 0.9 }, DRAW_ABOVE: true },
		}, {
			POSITION: [1, 9, 0, 8.5, 0, 30, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 10, SATURATION_SHIFT: 1.15 } },
		},
    ], 6)
}
Class.frostBossBaseDeco2 = {
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: weaponArray([
		{
			POSITION: [5, 10, 0.001, 9.5, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 10}},
		}, {
			POSITION: [1.6, 9, 0, 8.4, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 10}, DRAW_ABOVE: true},
		},
	], 6),
}

const trebuchetStats = [g.basic, g.sniper, g.predator, g.predator, g.predator, g.predator, {speed: 0.93, maxSpeed: 0.93, reload: 2, health: 1.7, damage: 1.4, size: 2}];
const hielamanStats = [g.trap, g.setTrap, g.hexaTrapper, {reload: 2.85, health: 3.2, range: 1.2}];
Class.frostBoss = {
    PARENT: 'miniboss',
    LABEL: 'Extrasolar',
    NAME: 'Frostbyte',
    CONTROLLERS: [["minion", {orbit: 260, leash: 190, repel: 270}]],
    FACING_TYPE: 'toTarget',
    SHAPE: 6,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 31,
    NO_SIZE_ANIMATION: true,
	DANGER: 12,
    VALUE: 888888,
    UPGRADE_TOOLTIP: "\"When the golden rays of sun shine through this world's\n" +
                    "darkened skies and looming clouds, the legend of the warrior\n" +
                    "and his eternal blade will finally come to fruition.\"",
    BODY: {
        SPEED: base.SPEED * 0.6,
        HEALTH: base.HEALTH * 11,
        SHIELD: base.SHIELD * 7,
        REGEN: base.REGEN * 2.5,
        FOV: base.FOV * 1.4,
        RESIST: base.RESIST * 1.2,
        DENSITY: base.DENSITY * 7.5,
    },
    GUNS: [
        ...weaponArray({
            // Speed
            POSITION: [8, 14.5, 0.001, 9.5, 0, 0, 0],
            PROPERTIES: {COLOR: 9},
        }, 6),
        ...weaponArray([
            { // Heavy Snipers
                POSITION: [26.5, 9.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats(trebuchetStats),
                    TYPE: "bullet",
                    COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 },
                },
            }, {
                POSITION: [24, 6.65, -1.3, 0, 0, 0, 0],
                PROPERTIES: { 
                    SHOOT_SETTINGS: combineStats([...trebuchetStats, g.fake]),
                    TYPE: "bullet",
                    COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.6 }, 
                    BORDERLESS: true
                },
            }, {
                POSITION: [4.25, 9.5, -0.5, 1.425, -8.5, 90, 0],
                PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 } },
            }, {
                POSITION: [4.25, 9.5, -0.5, 1.425, 8.5, -90, 0],
                PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 } },
            }, {
                POSITION: [4.25, 6.65, -0.35, 0.67, -8.5, 90, 0],
                PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 }, BORDERLESS: true },
            }, {
                POSITION: [4.25, 6.65, -0.35, 0.67, 8.5, -90, 0],
                PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 }, BORDERLESS: true },
            }, {
                POSITION: [19.5, 3.8, -1.4, 0, 0, 0, 0],
                PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
            }, {
                POSITION: [4, 11.5, 1, 19.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([...trebuchetStats, g.fake]),
                    TYPE: "bullet",
                    COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.6 },
                },
            }, {
                POSITION: [2, 12, 1, 20.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([...trebuchetStats, g.fake]),
                    TYPE: "bullet",
                    COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 },
                },
            },
            { // Aura Blocks
                POSITION: [15, 8.5, 1, 0, 0, 60, 0],
                PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6}}
            }, {
                POSITION: [4, 7, -1.6, 9, 0, 60, 0],
                PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}
            }, {
                POSITION: [3, 6, -1.55, 9, 0, 60, 0],
                PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}, BORDERLESS: true}
            }, {
                POSITION: [15, 5.4, -0.1, 0, 0, 60, 0],
                PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.75}}
            }, {
                POSITION: [3, 8.5, 1.6, 15, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats(hielamanStats),
                    TYPE: 'frostAuraBlock',
                    STAT_CALCULATOR: "trap",
                    COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6}
                },
            }, {
                POSITION: [2, 6, 1.6, 16, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([...hielamanStats, g.fake]),
                    TYPE: 'bullet',
                    COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
                },
            },
        ], 3),
    ],
    TURRETS: [
		...weaponArray({
            POSITION: [2.95, 8.55, 0, 30, 180, 2],
            TYPE: "frostBossAutoTurret",
        }, 6),
		{
			POSITION: [8.55, 0, 0, 0, 360, 2],
			TYPE: "frostBossBigAura",
		},
    ],
    PROPS: [
        {
			POSITION: [12, 0, 0, 180, 1],
			TYPE: ["hexagon", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
            POSITION: [12, 0, 0, 0, 1],
			TYPE: "frostBossBaseDeco2"
        }, {
			POSITION: [20, 0, 0, 0, 1],
			TYPE: "frostBossBaseDeco",
		}
    ]
}

Class.toothlessBase = {
    PARENT: "genericTank",
    LABEL: "Absolute Solver",
    UPGRADE_TOOLTIP: "Easier to assimilate than explain",
    GLOW: {
        RADIUS: 2,
        COLOR: "#8610e6",
        ALPHA: 1,
        RECURSION: 2,
    },
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
    level_cap: 45,
    EXTRA_SKILL: 78, // 120 - 42
    SHAPE: 3,
    VALUE: 30e3,
    SIZE: 24,
    COLOR: "purple",
    SKILL_CAP: Array(10).fill(smshskl + 3),
    defineLevelSkillPoints: (level) => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level & (1 == 1)) return 1;
        return 0;
    },
};
Class.toothlessBossDeco = {
    PARENT: "genericTank",
    SHAPE: "m-.4239.5982c.009-.0756.0238-.1433.0314-.1504.0071-.0063.028-.0104.0457-.0071.0614.0077.0757-.0071.1363-.1361.0307-.0631.0534-.1204.0512-.1286C-.1611.1691-.1824.1279-.2071.0848l-.0449-.0802.0457-.0891c.0249-.0491.0456-.0949.0447-.1035C-.163-.2177-.2684-.4171-.2878-.4295-.2991-.436-.3262-.4389-.347-.437-.3682-.4343-.389-.4382-.3953-.4453-.4065-.4599-.4424-.7358-.4339-.7505c.006-.0104.0435.0147.169.1172l.0786.0639-.0249.0491c-.0133.027-.0236.0568-.021.0664.0033.0204.1304.2162.1451.2247.0061.0035.0507.0062.1004.006s.0978.0045.1082.0105.0385.0453.0632.0885.0494.0805.0554.084c.0147.0085.2479.0207.2671.0133.0096-.0026.0303-.0264.047-.0514l.0301-.0461.0946.0361c.1704.0649.193.0757.1855.0886-.008.0139-.2498.1167-.2768.1173C.5735.1187.5646.1101.5528.0825.5432.0631.5257.0414.5136.0344.4946.0234.2664.0326.2401.0462.2341.0485.2048.0893.1747.1355l-.0543.0841-.0919.0012c-.0511.0005-.0997.0048-.1077.0106-.0083.0044-.0458.0533-.084.1074C-.2408.451-.2454.4691-.2114.5142c.0121.0151.0202.0371.0181.0486-.0032.0155-.1795.1608-.2253.1863C-.4404.7607-.4418.7253-.4239.5982",
    LABEL: "",
    COLOR: "purple",
};
Class.absoluteSolver = {
    PARENT: "toothlessBossDeco",
    FACING_TYPE: ["manual", { angle: 0 }],
    MOTION_TYPE: "withMaster",
    ON: [
        {
            event: "define",
            handler: ({ body }) => {
                body.TIME_UNTIL = 0;
                body.ABSOLUTE_ANGLE = body.master.facing;
                body.SIZE = body.master.size * 2;
            },
        },
        {
            event: "tick",
            handler: ({ body }) => {
                body.TIME_UNTIL++;

                if (body.TIME_UNTIL == 5 || body.TIME_UNTIL == 10) {
                    body.ABSOLUTE_ANGLE += 60;
                }
                if (body.TIME_UNTIL > 15) {
                    body.ABSOLUTE_ANGLE += 0.2;
                    body.SIZE -= body.SIZE / 4;
                }
                if (body.SIZE <= 4) {
                    let h = body.master.health.amount / 2;
                    body.master.damageReceived += h > 10 ? h : 10;
                    body.kill();
                }

                body.facingTypeArgs.angle = body.ABSOLUTE_ANGLE;
            },
        },
    ],
};
Class.toothlessBossTurret = {
    PARENT: "genericTank",
    LABEL: "",
    BODY: {
        FOV: 3,
    },
    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([
                    g.basic,
                    g.sniper,
                    g.assassin,
                    {
                        pen: 0.8,
                        damage: 0.2,
                        health: 0.6,
                        recoil: 0,
                    },
                ]),
                TYPE: [
                    "bullet",
                    {
                        TICK_HANDLER: (body, instance, other) => {
                            if (
                                (
                                    other.type != "tank" &&
                                    other.type != "food" &&
                                    other.type != "miniboss" &&
                                    other.type != "crasher"
                                ) ||
                                body.team == other.team ||
                                other.SOLVED
                            ) {
                                return;
                            }

                            let o = new Entity(
                                other,
                                other
                            );

                            o.define("absoluteSolver");
                            o.source = other;
                            o.team = body.team;
                            o.noclip = true;
                            o.on("dead", () => {
                                other.SOLVED = false;
                            });
                            other.SOLVED = true;

                            body.kill();
                        },
                    },
                ],
            },
        },
    ],
};
Class.toothlessBoss = {
    PARENT: "toothlessBase",
    UPGRADE_COLOR: "magenta",
    TURRETS: [
        {
            POSITION: { SIZE: 25, LAYER: 1 },
            TYPE: ["toothlessBossDeco", { MIRROR_MASTER_ANGLE: true }],
        },
        ...weaponArray(
            [
                {
                    POSITION: [8, 6, -5.6, 180, 180, 0],
                    TYPE: "toothlessBossTurret",
                },
                {
                    POSITION: [8, 6, 5.6, 180, 180, 0],
                    TYPE: "toothlessBossTurret",
                },
            ],
            3
        ),
    ],
};

Class.MKAura = makeAura(5, 0, 0.1, 42);
Class.MKDoneAura = makeAura(2, 1, 0.3, 32);
Class.MKFactoryAura = makeAura(2.6, 1, 0.3, "trans");
Class.MKCarrierAura = makeAura(2.1, 1, 0.3, 1);
Class.MKMinionAura = makeAura(1.1, 1, 0.3, 32);
Class.MKDrone = {
    PARENT: "drone",
    LABEL: "MKShip Drone",
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKDoneAura",
        },
    ]
}
Class.MKMinion = {
    PARENT: "minion",
    LABEL: "MKShip Minion",
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKMinionAura",
        },
    ]
}
Class.MKTurretFactoryWithController = {
    PARENT: "MKTurretFactory",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        FOV: 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKFactoryAura",
        },
    ]
}
Class.MKTurretFactory = {
    PARENT: "genericTank",
    LABEL: "MKTurret factory",
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    COLOR: 16,
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "MKMinion",
                MAX_CHILDREN: 6,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                NO_LIMITATIONS: true,
            },
        },
        {
            POSITION: [12, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.MKTurretCarrier = {
    PARENT: "carrier",
    LABEL: "MKTurret carrier",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [7, 8, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 0.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, 2, 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 0.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 8, 0.6, 7, -2, -30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.carrier, {reload: 0.5}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    COLOR: 16,
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
}
Class.MKTurretCarrierWithController = {
    PARENT: "MKTurretCarrier",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        FOV: 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKCarrierAura",
        },
    ]
}
Class.MKTurretThruster = {
    PARENT: "genericTank",
    LABEL: "MKTurret Thruster",
    FACING_TYPE: "toTarget",
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    COLOR: 16,
    GUNS: [{
        POSITION: [14, 12, 1, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.375, reload: 0.75, recoil: 1.05 }]),
            TYPE: "bullet"
        }
    }, {
        POSITION: [12, 12, 1.4, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.375, reload: 0.75, recoil: 1.05 }]),
            TYPE: "bullet"
        },
    }]
}
Class.MKTurret = {
    PARENT: "genericTank",
    FACING_TYPE: "toTarget",
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    LABEL: "MKTurret",
    COLOR: 16,
    SHAPE: 5,
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKTurretFactory",
        },
        {
            POSITION: [10, 16.1, 2.6, 140, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, 2.6, 203, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, -3.9, 310, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, 2.6, 413, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 10.2, 0, 0, 360, 0],
            TYPE: "MKTurretCarrier",
        },
        {
            POSITION: [10, 10.2, 0, 105.5, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [10, 10.2, 0, 180, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [10, 10.2, 0, 255, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [8, -10, -2, -45, 90, 0],
            TYPE: "MKTurretThruster"
        },
        {
            POSITION: [8, -10, 2, 45, 90, 0],
            TYPE: "MKTurretThruster"
        },
    ],
}
Class.AEMKShipBoss = {
    PARENT: "genericTank",
    LABEL: "MKShip",
    NAME: "Æ🚫Sports",
    SYNC_WITH_TANK: true,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    UPGRADE_TOOLTIP: "Has 4 carrier's, 4 factories, and their own auras. NOW FACE MY DESTRUCTION!",
    NO_SIZE_ANIMATION: true,
    COLOR: 32,
    UPGRADE_COLOR: 32,
    GLOW: {
        RADIUS: 1.5,
        COLOR: 32,
        ALPHA: 0.9,
        RECURSION: 3,
    },
    DANGER: 10,
    level_cap: 45,
    LEVEL: 45,
    SIZE: Class.genericTank.SIZE * (17 / 3),
    SHAPE: 16,
    VALUE: 5e5,
    SKILL: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    BODY: {
        REGEN: 0.4,
        FOV: 1,
        SHIELD: 2,
        ACCEL: 0.2,
        SPEED: 0.6,
        HEALTH: 5000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 4,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    TURRETS: [
        {
            POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: "MKAura",
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "MKTurret",
        },
    ],
    GUNS: (() => {
        let e = [],
            T = [1];
        for (let e = 1; e < 8.5; e += 0.5) {
            let t = e / 16;
            T.push(t);
        }
        for (let t = 0; t < 16; t++) {
            let S = 22.5 * (t + 1),
                E = {
                    MAX_CHILDREN: 2,
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                    TYPE: "MKDrone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                    NO_LIMITATIONS: true,
                };
            t % 2 == 0 &&
            (E.NO_LIMITATIONS = true),
            (E.TYPE = [
                "MKDrone",
                {
                    AI: {
                        skynet: true,
                    },
                    INDEPENDENT: true,
                    LAYER: 10,
                    BODY: {
                        FOV: 2,
                    },
                },
            ]);
            let O = {
                POSITION: [4.3, 3.1, 1.2, 8, 0, S, T[t]],
                PROPERTIES: E,
            };
            e.push(O);
        }
        return e;
    })(),
}

Class.helenaBossBaseAura = makeAura(2, 2, 0)
Class.helenaBossBase = {
    PARENT: "genericTank",
    COLOR: "crasher",
    UPGRADE_COLOR: "crasher",
    UPGRADE_LABEL: "CMX-2048-XX", //CrasherMachinery X 2048-bit Xtra Xtra
    LABEL: "CMX-2048-XX",
    NAME: "Prime Crasher",
    SHAPE: 3.5,
    SIZE: 32,
    NO_SIZE_ANIMATION: true,
    VALUE: 1e16,
    DANGER: 128,
    MAX_CHILDREN: 65536, //memory limit
    GLOW: {
        RADIUS: 9,
        COLOR: "crasher",
        ALPHA: 1,
        RECURSION: 3
    },
    BODY: {
        HEALTH: 2048,
        DAMAGE: 16,
        REGEN: 2 * base.REGEN,
        SHIELD: 4 * base.SHIELD,
        SPEED: 0.32 * base.SPEED,
        FOV: 0.96
    },
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 0],
            TYPE: "helenaBossBaseAura"
        }
    ]
}
Class.helenaDpProp = makeDeco(3.5, "crasher")
Class.helenaBossDpProp2 = makeDeco(3.5, "black")
Class.helenaBossDpPropArmed = {
    PARENT: "genericTank",
    COLOR: "crasher",
    SHAPE: 3,
    GUNS: weaponArray(
        {
            POSITION: [15, 8, 1, 0, 0, 60, 0],
            PROPERTIES: {
                COLOR: "crasher",
            }
        }, 3
    )
}
Class.helenaBossProp = makeDeco(3.5, "darkGrey")
Class.helenaBossPropMiddle = makeDeco(3.5, "white")
Class.helenaBossProp2 = makeDeco(3.5, "crasher")
Class.helenaBossMinionProp = makeDeco(3.5, "black")
Class.helenaBossMinion = {
    PARENT: "minion",
    LABEL: "CMM-64-XX", // CrasherMachinery Minion 64-bit Xtra Xtra
    SHAPE: 3.5,
    DRAW_HEALTH: true,
    PROPS: [
        {
            POSITION: { SIZE: 30, LAYER: 0, ANGLE: 360 },
            TYPE: "helenaBossMinionProp"
        },
        {
            POSITION: { SIZE: 25, LAYER: 0, ANGLE: 360 },
            TYPE: ["helenaBossMinionProp", { COLOR: "white"}]
        },
        {
            POSITION: { SIZE: 11, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossMinionProp"
        }
    ],
    GUNS: [
        ...weaponArray([
                {
                    POSITION: [10.5, 7.5, 1.3, 7, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { reload: 1.15, damage: 4 }]),
                        TYPE: "swarm",
                        STAT_CALCULATOR: "swarm",
                        COLOR: "white"
                    },
                }
            ], 3
        )
    ]
}
Class.helenaBossAuraBulletAura = makeAura(0.32, 1.5, 0.3, "crasher")
Class.helenaBossAuraBullet = {
    PARENT: "swarm",
    SHAPE: 0,
    INDEPENDENT: true,
    LABEL: "CMSB-8-XX", //CrasherMachinery Seeking Bullet 8-bit Xtra Xtra
    AI: {
        FARMER: true
    },
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        DENSITY: 1.25,
        HEALTH: 0.165,
        DAMAGE: 6,
        PUSHABILITY: 0.3,
        RANGE: 256,
        FOV: 8
    },
    TURRETS: [
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: "helenaBossAuraBulletAura"
        }
    ]
}
Class.helenaBossChip = {
    PARENT: "drone",
    LABEL: "CMD-16-XX", //CrasherMachinery Dorito 16-bit Xtra Xtra
    COLOR: "darkGrey",
    SHAPE: 3.5,
    PROPS: [
        {
            POSITION: { SIZE: 10, LAYER: 1, ANGLE: 180 },
            TYPE: "helenaBossPropMiddle",
        }
    ]
}
Class.helenaBoss = {
    PARENT: "helenaBossBase",
    UPGRADE_TOOLTIP: "CrasherMachinery's Top Secret project. A crasher that will return glory to the crasher race.\nEngineered with binary-system weapons for a faster and faultless combat experience.\nProject name: \"Prime Crasher\".\nModel name: \"CrasherMachinery X 2048-bit Xtra Xtra\".\nPlease report all sightings to CrasherMachinery Corp.!",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    PROPS: [
        {
            POSITION: { SIZE: 25, LAYER: 0, ANGLE: 360 },
            TYPE: "helenaBossDpProp2"
        },
        {
            POSITION: { SIZE: 16, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossProp"
        },
        {
            POSITION: { SIZE: 12.5, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossProp2"
        },
        {
            POSITION: { SIZE: 7.75, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossProp"
        },
        {
            POSITION: { SIZE: 5.25, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossPropMiddle",
        },
        {
            POSITION: { SIZE: 3, LAYER: 1, ANGLE: 360 },
            TYPE: "helenaBossProp2"
        }
    ],
    GUNS: [
        ...weaponArray(
            [
                {
                    POSITION: [8.5, 5, 1.25, 8.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.single, { reload: 1.32, size: 1.5, health: 4, speed: 1.32, maxSpeed: 1.32 }]),
                        TYPE: "helenaBossAuraBullet",
                        COLOR: "white"
                    }
                },
                {
                    POSITION: [8.5, 5, 1.25, 8.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.twin, g.pounder, {reload: 1.15, speed: 0.5, maxSpeed: 0.5, range: 0.25, size: 1.5}]),
                        TYPE: "unsetPillbox",
                        STAT_CALCULATOR: "block",
                        ALPHA: 0
                    }
                },
                {
                    POSITION: [8.5, 5, 1.25, 6.5, 5.5, 15, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.single, { reload: 1.32, size: 1.5, health: 4, speed: 1.32, maxSpeed: 1.32 }]),
                        TYPE: "helenaBossAuraBullet",
                        COLOR: "white"
                    }
                },
                {
                    POSITION: [8.5, 5, 1.25, 6.5, -5.5, -15, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.single, { reload: 1.32, size: 1.5, health: 4, speed: 1.32, maxSpeed: 1.32 }]),
                        TYPE: "helenaBossAuraBullet",
                        COLOR: "white"
                    }
                },
                {
                    POSITION: [8.5, 5, 1.25, 6.5, 5.5, 15, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.pounder, { size: 1.75, speed: 1.64, maxSpeed: 1.64, health: 5.02 }]),
                        TYPE: "helenaBossChip",
                        STAT_CALCULATOR: "drone",
                        ALPHA: 0,
                        MAX_CHILDREN: 2
                    }
                },
                {
                    POSITION: [8.5, 5, 1.25, 6.5, -5.5, -15, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.pounder, { size: 1.75, speed: 1.64, maxSpeed: 1.64, health: 5.02 }]),
                        TYPE: "helenaBossChip",
                        STAT_CALCULATOR: "drone",
                        ALPHA: 0,
                        MAX_CHILDREN: 2
                    }
                },
                {
                    POSITION: [5.32, 2.64, 1.25, 8.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.single, g.fake, { reload: 1.32 }]),
                        TYPE: "bullet",
                        COLOR: "black"
                    }
                },
                {
                    POSITION: [3.08, 1.16, 0.16, 8.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.single, g.fake, { reload: 1.32 }]),
                        TYPE: "bullet",
                        COLOR: "crasher"
                    }
                },
            ], 3)
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                body.store.ticks ??= 0
                body.store.ticks++
                const spawnSentries = body.store.ticks % 128 === 0
                const spawnLegions = body.store.ticks % 256 === 0
                const endGame = body.store.ticks % 1024 === 0
                const sentries = ["sentrySwarm", "sentryGun", "sentryTrap", "shinySentrySwarm", "shinySentryGun", "shinySentryTrap"]
                const legions = ["eliteDestroyer", "eliteGunner", "sprayerLegion", "eliteBattleship", "eliteSpawner", "eliteTrapGuard", "eliteSpinner"]
                if (spawnSentries) new Entity(body, body, body.gameManager).define(sentries[Math.floor(Math.random() * sentries.length)])
                if (spawnLegions) new Entity(body, body, body.gameManager).define(legions[Math.floor(Math.random() * legions.length)])
                if (endGame) new Entity(body, body, body.gameManager).define("legionaryCrasher")
            },
        }
    ]
}
