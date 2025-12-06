const { combineStats, makeDeco, weaponArray, makeTurret, weaponMirror } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// Radial Auto Guns
Class.autoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.bigAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, {damage: 1.05}]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.bansheegun = makeTurret({
    GUNS: [
        {
            POSITION: [26, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, { reload: 1.5 }]),
                TYPE: "bullet",
            },
        },
    ],
}, {limitFov: true, independent: true})
Class.auto4gun = makeTurret({
    GUNS: [
        {
            POSITION: [16, 4, 1, 0, -3.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 4, 1, 0, 3.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true})
Class.bigauto4gun = makeTurret({
    GUNS: [
        {
            POSITION: [14, 5, 1, 0, -4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 5, 1, 0, 4.5, 0, 0.33],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 5, 1, 0, 0, 0, 0.67],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.twin, g.twin, g.power, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.megaAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true})
Class.ultraAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 20, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true})
Class.sniper3gun = makeTurret({
    GUNS: [
        {
            POSITION: [27, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.autoTurret, g.assassin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 9, -1.5, 8, 0, 0, 0],
        },
    ],
}, {canRepel: true, limitFov: true, fov: 5})
Class.architectGun = makeTurret({
    GUNS: [
        {
            POSITION: [20, 16, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 16, 1.1, 20, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})

// NPC turrets
Class.trapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [16, 14, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 14, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, { shudder: 0.4, speed: 0.9, reload: 2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}, {limitFov: true, aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.megaTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [16, 18, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 18, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.lowPower, { shudder: 0.4, speed: 0.9, reload: 2 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}, {limitFov: true, aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.baseTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [16, 14, 1, 0, 0, 0, 0],
        }, {
            POSITION: [4, 14, 1.8, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ],
}, {independent: true, hasAI: false, extraStats: []})
Class.baseMechTurret = makeTurret({
    GUNS: [
        {
            POSITION: [14, 14, 1, 0, 0, 0, 0],
        },{
            POSITION: [4, 12, 1, 15, 0, 0, 0],
        }, {
            POSITION: [4, 14, 1.8, 19, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}]),
                TYPE: "autotrap",
                STAT_CALCULATOR: "trap",
                NO_LIMITATIONS: true,
                AUTOFIRE: true,
            },
        },
    ],
}, {independent: true, hasAI: false, extraStats: []})
Class.terrestrialTrapTurret = makeTurret({
    GUNS: [
        {
            POSITION: [13, 14, 1, 0, 0, 0, 0],
        }, {
            POSITION: [4, 14, 1.8, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.pounder, g.hexaTrapper, {reload: 1.3, size: 1.2, health: 1.35, damage: 1.4, speed: 0.9, shudder: 0.1}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true,
            },
        },
    ],
}, {independent: true, hasAI: false, extraStats: []})
const shottrapTurretProperties = {
    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.shotgun, g.machineGun, { reload: 0.65, speed: 0.7, maxSpeed: 0.1, damage: 0.7, range: 0.5 }]),
    AUTOFIRE: true,
    TYPE: "shotTrapBox",
    STAT_CALCULATOR: "block",
}
Class.shottrapTurret = makeTurret({
    GUNS: [{
        POSITION: [ 4, 1.5, 1, 11, -3, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 4, 2,   1, 11,  3, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 4, 1.5, 1, 13,  0, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 11,  1, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 12, -1, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 1.5, 1, 11,  1, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 13, -1, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2.5, 1, 13,  1, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 13,  2, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 13, -2, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2.5, 1, 13, -2, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2.5, 1, 13,  2, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 1, 2,   1, 13, -2, 0, 0 ], PROPERTIES: shottrapTurretProperties,
    }, {
        POSITION: [ 16, 14, -1.4,  0, 0, 0, 0 ], 
    }, {
        POSITION: [  6, 14,  1.6, 16, 0, 0, 0 ], PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.shotgun, g.machineGun, {reload: 0.65}, g.fake]),
            AUTOFIRE: true,
            TYPE: "bullet"
        }
    }]
}, {limitFov: true, aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.machineTripleTurret = {
    PARENT: "genericTank",
    FACING_TYPE: ["spin", {speed: 0.06}],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: weaponArray({
        POSITION: [12, 10, 1.4, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
            TYPE: "bullet",
            AUTOFIRE: true,
        },
    }, 3)
}
Class.launcherTurret = makeTurret('launcher', {canRepel: true, limitFov: true, extraStats: []})
Class.skimmerTurret = makeTurret('skimmer', {canRepel: true, limitFov: true, extraStats: [], color: 'mirror'})
Class.kronosSkimmerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [8, 20, -0.25, 11, 0, 0, 0],
        }, {
            POSITION: [15, 18, -0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 3, health: 1.7, damage: 1.4, resist: 1.2 }]),
                TYPE: "kronosMissile",
                NO_LIMITATIONS: true,
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 10, independent: true, extraStats: []})
Class.autoSmasherLauncherTurret = makeTurret({
    GUNS: [
        {
            POSITION: [4, 12, 1.2, 16, 0, 0, 0],
        }, {
            POSITION: [18, 20, -0.7, 0, 0, 0, 1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 3.1, health: 1.9, damage: 1.2, resist: 1.2, speed: 1.3, maxSpeed: 1.3, range: 2.5 }]),
                TYPE: "autoSmasherMissile",
                NO_LIMITATIONS: true,
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 10, independent: true, extraStats: []})
Class.twisterTurret = makeTurret('twister', {canRepel: true, limitFov: true, color: 'mirror', extraStats: [{speed: 1.3, maxSpeed: 1.3}]})
Class.hyperTwisterTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 9, 0, 0, 0],
        }, {
            POSITION: [17, 14, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { speed: 1.3, maxSpeed: 1.3 }, { reload: 4/3 }]),
                TYPE: "hyperspinmissile",
                STAT_CALCULATOR: "sustained",
            },
        },
    ],
}, {canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.rocketeerTurret = makeTurret('rocketeer', {canRepel: true, limitFov: true})
Class.boomerTurret = makeTurret('boomer', {canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.ultraBoomerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [5, 12, 1, 11, 0, 0, 0],
        },
        {
            POSITION: [6, 12, -1.5, 5, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.3, 16, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang, g.pounder, g.destroyer, {maxSpeed: 1.25, speed: 1.25}]),
                TYPE: "boomerang",
                STAT_CALCULATOR: "block"
            },
        },
    ],
},{canRepel: true, limitFov: true, color: 'mirror', extraStats: []})
Class.triTrapGuardTurret = {
    PARENT: "genericTank",
    COLOR: -1,
    FACING_TYPE: ["spin", { independent: true }],
    GUNS: weaponArray([
        {
            POSITION: [17, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [13, 8, 1, 0, 0, 60, 0],
        }, {
            POSITION: [4, 8, 1.7, 13, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
}
Class.eliteSpinnerCyclone = {
    PARENT: "genericTank",
    COLOR: -1,
    FACING_TYPE: ["spin", { speed: -0.1, independent: true }],
    GUNS: weaponArray([
        {
            POSITION: [15, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 60, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 90, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.barricadeTurret = makeTurret('barricade', {aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.ultraBarricadeTurret = makeTurret({
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 26, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 1/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 2/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 3/4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, g.barricade]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}, {aiSettings: {SKYNET: true, FULL_VIEW: true, independent: true, extraStats: []}})
Class.artilleryTurret = makeTurret('artillery', {canRepel: true, limitFov: true, extraStats: []})
Class.nailgunTurret = makeTurret('nailgun', {canRepel: true, limitFov: true, extraStats: []})
Class.crowbarTurret = makeTurret({
    GUNS: [
        {
            POSITION: [37, 6.5, 1, 0, 0, 0, 0],
        }, {
            POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [6, 38, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 28, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 18, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.wrenchTurret = makeTurret({
    GUNS: [
        {
            POSITION: [67, 6.5, 1, 0, 0, 0, 0],
        }, {
            POSITION: [5, 8.5, -1.5, 8, 0, 0, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [6, 68, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 58, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        }, {
            POSITION: [6, 48, 0, 0, 360, 1],
            TYPE: [ "autoTankGun", { GUN_STAT_SCALE: g.flankGuard, INDEPENDENT: true, HAS_NO_RECOIL: true } ],
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.protoSwarmerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 14, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                TYPE: "protoHive",
            },
        }, {
            POSITION: [11, 12, 1, 5, 0, 0, 0],
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.hyperSwarmerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [10, 14, -1.2, 5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.hive, {speed: 1.3, maxSpeed: 0.5, health: 1.3, range: 1.3}]),
                TYPE: "hyperHive",
            },
        }, {
            POSITION: [11, 12, 1, 5, 0, 0, 0],
        },{
            POSITION: [8, 8, 1, 5, 0, 0, 0],
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.swarmTurret = makeTurret({
    GUNS: [
        {
            POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: 'autoswarm',
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.crasherSpawner = makeTurret({
    MAX_CHILDREN: 4,
    GUNS: [
        {
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, {health: 1.1}]),
                TYPE: [
                    "drone",
                    {
                        LABEL: "Crasher",
                        DRAW_HEALTH: true,
                    },
                ],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
}, {independent: true, aiSettings: {chase: true}, label: 'Spawned', color: 'pink'})
Class.genghisLowerTurret = makeTurret({
    MAX_CHILDREN: 4,
    GUNS: [
        {
            POSITION: [7, 11, 0.6, 6, 0, 0, 0.5],
        }, {
            POSITION: [2, 12, 1, 13, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { reload: 1.5, health: 2, damage: 2, range: 2 }]),
                TYPE: ["tinyMinion", {INDEPENDENT: true}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.cruiserTurret = makeTurret('cruiser', {canRepel: true, limitFov: true})
Class.carrierTurret = makeTurret('carrier', {canRepel: true, limitFov: true})
Class.napoleonLowerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [8, 8, 0.6, 6, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [8, 8, 0.6, 6, 0, -30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bee, g.pounder]),
                TYPE: ["bee", { INDEPENDENT: true }],
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.gunnerCruiserTurret = makeTurret({
    GUNS: [
        {
            POSITION: [4, 7.5, 0.6, 6, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {maxSpeed: 1.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 7.5, 0.6, 6, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {maxSpeed: 1.1}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [16, 3, 1, 0, -3, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, {health: 1.2, damage: 1.2, speed: 1.2, maxSpeed: 0.9}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [16, 3, 1, 0, 3, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, {health: 1.2, damage: 1.2, speed: 1.2, maxSpeed: 0.9}]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, independent: true, fov: 10, extraStats: []})
Class.juliusLowerTurret = makeTurret({
    MAX_CHILDREN: 3,
    GUNS: [
        {
            POSITION: [8.5, 11, 0.6, 6, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {size: 0.8, health: 1.5, damage: 1.5, density: 1.2, maxSpeed: 0.8}]),
                TYPE: "minichip",
                STAT_CALCULATOR: "drone",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.swarmerTurret = makeTurret('swarmer', {canRepel: true, limitFov: true, extraStats: []})
Class.basicTurret = makeTurret({
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.pelleter, g.twin, g.power, { speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.kronosTripletTurret = makeTurret({
    GUNS: [
        {
            POSITION: [18, 10, 1, 0, 5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [18, 10, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [21, 10, 1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.napoleonUpperTurret = makeTurret({
    GUNS: [
        {
            POSITION: [12, 17, -0.6, 0, 0, 0, 0],
        }, {
            POSITION: [16, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, { reload: 1.2, health: 1.2, damage: 1.2, speed: 0.93, maxSpeed: 0.93, range: 1.5 }]),
                TYPE: ["turretedBullet", {COLOR: "veryLightGrey"}],
            },
        },
    ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.gadgetGunTripleTurret = {
    PARENT: "genericTank",
    FACING_TYPE: ["spin", {speed: 0.06}],
    INDEPENDENT: true,
    COLOR: -1,
    GUNS: weaponArray([{
        POSITION: [7.25, 12, 1.4, 12.75, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.single]),
            TYPE: "bullet",
            AUTOFIRE: true,
        },
    },
    {
        POSITION: [11, 12, -1.2, 1.75, 0, 0, 0],
    }
    ], 3)
}

// Mounted Turrets
Class.autoTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.megaAutoTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.droneAutoTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, g.overdrive]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.bulletAutoTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, {speed: 0.8, maxSpeed: 0.8, reload: 1.2, health: 1.4}]),
                TYPE: "bullet",
            },
        },
    ]
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.autoSmasherTurret = makeTurret({
    GUNS: [
        {
            POSITION: [20, 6, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, { speed: 1.2 }, g.machineGun, g.pounder, { reload: 0.75 }, { reload: 0.75 }]),
                TYPE: "bullet",
                STAT_CALCULATOR: "fixedReload",
            },
        },
        {
            POSITION: [20, 6, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret, { speed: 1.2 }, g.machineGun, g.pounder, { reload: 0.75 }, { reload: 0.75 }]),
                TYPE: "bullet",
                STAT_CALCULATOR: "fixedReload",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.pillboxTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [22, 11, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                TYPE: "bullet",
                WAIT_TO_CYCLE: true
            },
        },
    ],
}, {independent: true, extraStats: []})
Class.autoSmasherMissileTurret = makeTurret({
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: [19, 6, 1, 0, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pelleter, g.power, g.turret]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 6, 1, 0, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pelleter, g.power, g.turret]),
                TYPE: "bullet"
            }
        }
    ],
}, {fov: 5, independent: true, aiSettings: {SKYNET: true, BLIND: true}, extraStats: []})
Class.legionaryTwin = makeTurret({
    GUNS: [
        {
            POSITION: [18, 7, 1, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pelleter, g.power, g.turret, {reload: 0.85}]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 7, 1, 0, -5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.pelleter, g.power, g.turret, {reload: 0.85}]),
                TYPE: "bullet"
            }
        }
    ],
}, {fov: 5, independent: true, extraStats: []})

// Healer turrets
Class.sanctuaryHealer = {
    PARENT: "genericTank",
    LABEL: "",
    COLOR: "grey",
    BODY: {
        FOV: base.FOV * 1.2,
    },
    FACING_TYPE: ["spin", { speed: -0.05 }],
    TURRETS: [{ 
        POSITION: { SIZE: 13, LAYER: 1 },
        TYPE: ['healerSymbol', { FACING_TYPE: ["noFacing", { angle: Math.PI / 2 }] }]
    }],
}
Class.medkitTurret = {
    PARENT: "genericTank",
    LABEL: "",
    COLOR: "grey",
    HAS_NO_RECOIL: true,
    FACING_TYPE: ["spin", { speed: 0.23 }],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "healerSymbol",
        },
    ],
    GUNS: weaponArray({
        POSITION: [17, 11, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.healer, g.minionGun, g.turret, g.power, g.autoTurret, { density: 0.1, reload: 0.5 }]),
            TYPE: "healerBullet",
            AUTOFIRE: true,
        },
    }, 2)
}

// Miscellaneous
Class.baseSwarmTurret = makeTurret({
    GUNS: [
        {
            POSITION: [5, 4.5, 0.6, 7, 2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.baseProtector, {speed: 0.5}]),
                TYPE: "baseSwarmTurret_swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 4.5, 0.6, 7, -2, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.baseProtector, {speed: 0.5}]),
                TYPE: "baseSwarmTurret_swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 4.5, 0.6, 7.5, 0, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.baseProtector, {speed: 0.4}]),
                TYPE: "baseSwarmTurret_swarm",
            },
        },
    ],
}, {label: "Protector", independent: true, fov: 0.8, aiSettings: { NO_LEAD: true, CHASE: true, IGNORE_SHAPES: true, }})
Class.antiTankMachineGunArm = {
    PARENT: "genericTank",
    COLOR: "grey",
    CONTROLLERS: ["mapTargetToGoal"],
    SKILL_CAP: Array(10).fill(15),
    SKILL: Array(10).fill(15),
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [1, 2.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [16.5, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [5.5, 6.5, -1.8, 6.5, 0, 0, 0]
        }
    ],
}
Class.cxATMGArm = {
    PARENT: "genericTank",
    COLOR: "white",
    SHAPE: [[0.1,0],[0.6,-0.8660254037844386],[1.1,0],[0.6,0.8660254037844386],[0.1,0],[-0.05,0.08660254037844387],[0.45,0.9526279441628825],[-0.55,0.9526279441628825],[-1.05,0.08660254037844387],[-0.05,0.08660254037844387],[0.1,0],[-0.05,-0.08660254037844387],[-1.05,-0.08660254037844387],[-0.55,-0.9526279441628825],[0.45,-0.9526279441628825],[-0.05,-0.08660254037844387]],
    SKILL_CAP: Array(10).fill(15),
    SKILL: Array(10).fill(15),
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [1, 2.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [16.5, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [5.5, 6.5, -1.8, 6.5, 0, 0, 0]
        }
    ],
}
Class.flagshipTurret = {
    MAX_CHILDREN: 16,
    SHAPE: 8,
    INDEPENDENT: true,
    GUNS: [
        { // DRONES
            POSITION: [12, 7, 1.2, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }, 
        },
        {
            POSITION: [12, 7, 1.2, 0, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }, 
        },
        {
            POSITION: [12, 7, 1.2, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }, 
        },
        {
            POSITION: [12, 7, 1.2, 0, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer,g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        },
        {  // MINIONS
            POSITION: [2.5, 5, 1, 10.5, 0, 45, 0.5],
        }, 
        {
            POSITION: [1, 7, 1, 13, 0, 45, 0.5],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 
        {                        
            POSITION: [3.5, 7, 1, 8, 0, 45, 0.5],
        },
        {
            POSITION: [2.5, 5, 1, 10.5, 0, -45, 0.5],
        }, 
        {
            POSITION: [1, 7, 1, 13, 0, -45, 0.5],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }, 
        }, 
        {
            POSITION: [3.5, 7, 1, 8, 0, -45, 0.5],
        },
        {
            POSITION: [2.5, 5, 1, 10.5, 0, 135, 0.5],
        },
        {
            POSITION: [1, 7, 1, 13, 0, 135, 0.5],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            },
        }, 
        {
            POSITION: [3.5, 7, 1, 8, 0, 135, 0.5], 
        },
        {
            POSITION: [2.5, 5, 1, 10.5, 0, -135, 0.5], 
        },
        {
            POSITION: [1, 7, 1, 13, 0, -135, 0.5],
            PROPERTIES: {          
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }, 
        },
        {
            POSITION: [3.5, 7, 1, 8, 0, -135, 0.5],
        }
    ],
}
Class.tracker3gun = makeTurret({
    GUNS: [
        {
            POSITION: [24, 10, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [12, 10, -2, 20, 0, 0, 0]
        }
    ]
}, {canRepel: true, limitFov: true, fov: 3, color: "#1AFF00"})

    Class.oldCommanderGun = {
        PARENT: "genericTank",
        LABEL: "",
        BODY: {
            FOV: 3,
        },
        CONTROLLERS: ["nearestDifferentMaster"],
        COLOR: 16,
        MAX_CHILDREN: 6,
        AI: {
            NO_LEAD: true,
            SKYNET: true,
            FULL_VIEW: true,
        },
        GUNS: [
            {
                POSITION: [8, 14, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.commander]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                },
            },
        ],
    }

// Decorations
Class.deco_trianglePureWhite = makeDeco(3, "pureWhite")
Class.mendersymbol = makeDeco(3)
Class.overdriveDeco = makeDeco(4)
Class.vortexBody = makeDeco(5)
Class.vortexBody.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.assemblerEffect = {
    PARENT: "bullet",
    MOTION_TYPE: 'assembler',
    LABEL: '',
    BODY: {
        DAMAGE: 0,
        RANGE: 10
    },
    ALPHA: 0.8
}
Class.assemblerDot = {
    LABEL: '',
    SHAPE: -4,
    COLOR: "darkGrey",
    INDEPENDENT: true
}
Class.healerSymbol = {
    SHAPE: [[0.3, -0.3],[1,-0.3],[1,0.3],[0.3,0.3],[0.3,1],[-0.3,1],[-0.3,0.3],[-1,0.3],[-1,-0.3],[-0.3,-0.3],[-0.3,-1],[0.3,-1]],
    SIZE: 13,
    COLOR: "red",
}

// Bodies
Class.smasherBody = {
    LABEL: "",
    FACING_TYPE: ["spin", { speed: 0.16 }],
    COLOR: "black",
    SHAPE: 6,
    SIZE: 12,
    INDEPENDENT: true
}
Class.landmineBody = {
    LABEL: "",
    FACING_TYPE: ["spin", { speed: 0.3 }],
    COLOR: 9,
    SHAPE: 6,
    INDEPENDENT: true
}
Class.spikeBody = {
    PARENT: "smasherBody",
    SHAPE: 3
}
Class.weirdSpikeBody1 = {
    PARENT: "spikeBody",
    FACING_TYPE: ["spin", { speed: 0.20 }]
}
Class.weirdSpikeBody2 = {
    PARENT: "spikeBody",
    FACING_TYPE: ["spin", { speed: -0.17 }]
};
Class.dominationBody = {
    LABEL: "",
    FACING_TYPE: ["noFacing", { angle: Math.PI / 2 }],
    COLOR: "black",
    SHAPE: 6,
    INDEPENDENT: true,
}
Class.cocciPart1 = {
    PARENT: "genericSmasher",
    LABEL: "",
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        {
            POSITION: [20, -22, 0, 0, 90/4, 0],
            TYPE: "smasher",
            VULNERABLE: true
        },
    ]
}
Class.cocciPart2 = {
    PARENT: "genericSmasher",
    LABEL: "",
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        {
            POSITION: [20, -22, 0, 0, 90/3, 0],
            TYPE: "cocciPart1",
            VULNERABLE: true
        },
    ]
}
Class.cocciPart3 = {
    PARENT: "genericSmasher",
    LABEL: "",
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody"
        },
        {
            POSITION: [20, -22, 0, 0, 90/2, 0],
            TYPE: "cocciPart2",
            VULNERABLE: true
        },
    ]
}

// Whirlwind
Class.whirlwindDeco = makeDeco(6)
Class.whirlwindDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.tornadoDeco = makeDeco(4)
Class.tornadoDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.megaTornadoDeco = makeDeco([[0,-1],[0.5,0],[0,1],[-0.5,0]])
Class.megaTornadoDeco.CONTROLLERS = [["spin", { independent: true }]]
Class.thunderboltDeco = makeDeco(4)
Class.thunderboltDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.16 }]]
Class.hurricaneDeco = makeDeco(8)
Class.hurricaneDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.typhoonDeco = makeDeco(10)
Class.typhoonDeco.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.tempestDeco1 = makeDeco(3)
Class.tempestDeco1.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.tempestDeco2 = makeDeco(3)
Class.tempestDeco2.CONTROLLERS = [["spin", { independent: true, speed: -0.128 }]]
Class.blizzardDeco1 = makeDeco(5)
Class.blizzardDeco1.CONTROLLERS = [["spin", { independent: true, speed: 0.128 }]]
Class.blizzardDeco2 = makeDeco(5)
Class.blizzardDeco2.CONTROLLERS = [["spin", { independent: true, speed: -0.128 }]]

// FLAIL!!!
Class.flailBallSpike = {
    PARENT: "genericTank",
    COLOR: "black",
    SHAPE: 6,
    INDEPENDENT: true,
}
Class.flailBall = {
    PARENT: "genericTank",
    COLOR: "grey",
    HITS_OWN_TYPE: 'hard',
    INDEPENDENT: true,
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: "flailBallSpike",
    }],
    GUNS: [
        { 
            POSITION: {WIDTH: 10, LENGTH: -10},
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    range: 0.1,
                    speed: 0,
                    maxSpeed: 0,
                    recoil: 0,
                    reload: 0.1,
                    damage: 4,
                    size: 2,
                    health: 1,
                }]),
                TYPE: ["bullet", {
                    ALPHA: 0,
                    ON: [{
                        event: 'tick',
                        handler: ({body}) => {
                            body.DAMAGE -= 1;
                            body.SIZE -= 0.6;
                            if (body.SIZE < 1) body.kill();
                        }
                    }],
                }], 
                AUTOFIRE: true,
                BORDERLESS: true,
                DRAW_FILL: false,
            }
        }
    ]
}
Class.flailBolt1 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [40, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [48, 56, 0, 0, 360, 1],
        TYPE: "flailBall"
    }],
}
Class.flailBolt2 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [30, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [20, 36, 0, 0, 360, 1],
        TYPE: "flailBolt1"
    }],
}
Class.flailBolt3 = {
    PARENT: "genericTank",
    COLOR: "grey",
    GUNS: [{
        POSITION: [30, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [18, 36, 0, 0, 360, 1],
        TYPE: "flailBolt2"
    }],
}

Class.maceBallSpike = {
    PARENT: "genericTank",
    COLOR: 9,
    SHAPE: 3,
    INDEPENDENT: true,
}
Class.maceBall = {
    PARENT: "genericTank",
    COLOR: "grey",
    HITS_OWN_TYPE: 'hard',
    INDEPENDENT: true,
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: ["maceBallSpike", { SHAPE: 3 }]
    }, ],
    GUNS: [
        { 
            POSITION: {WIDTH: 10, LENGTH: -10},
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    range: 0.1,
                    speed: 0,
                    maxSpeed: 0,
                    recoil: 0,
                    reload: 0.1,
                    damage: 4,
                    size: 2,
                    health: 1,
                }]),
                TYPE: ["bullet", {
                    ALPHA: 0,
                    ON: [{
                        event: 'tick',
                        handler: ({body}) => {
                            body.DAMAGE -= 1;
                            body.SIZE -= 0.6;
                            if (body.SIZE < 1) body.kill();
                        }
                    }],
                }], 
                AUTOFIRE: true,
                BORDERLESS: true,
                DRAW_FILL: false,
            }
        }
    ]
}
Class.maceBolt1 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [48, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [76, 56, 0, 0, 190, 1],
        TYPE: "maceBall",
    }],
}
Class.maceBolt2 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [24, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [20, 28, 0, 0, 190, 1],
        TYPE: "maceBolt1"
        },
    ],
}
Class.maceBolt3 = {
    PARENT: "genericTank",
    COLOR: "grey",
    GUNS: [{
        POSITION: [24, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [18, 28, 0, 0, 190, 1],
        TYPE: "maceBolt2",
    }],
}
Class.mamaBolt1 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [48, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [104, 56, 0, 0, 190, 1],
        TYPE: "maceBall"
        },
    ],
}
Class.mamaBolt2 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [18, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [20, 20, 0, 0, 190, 1],
        TYPE: "mamaBolt1"
        },
    ],
}
Class.mamaBolt3 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [18, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [18, 20, 0, 0, 190, 1],
        TYPE: "mamaBolt2"
        },
    ],
}
Class.ihdtiBall = {
    PARENT: "genericTank",
    COLOR: "grey",
    HITS_OWN_TYPE: 'hard',
    INDEPENDENT: true,
    TURRETS: [{
        POSITION: [21.5, 0, 0, 0, 360, 0],
        TYPE: "maceBallSpike"
    }, {
        POSITION: [21.5, 0, 0, 180, 360, 0],
        TYPE: "maceBallSpike"
    }],
    GUNS: [
        { 
            POSITION: {WIDTH: 10, LENGTH: -10},
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {
                    range: 0.1,
                    speed: 0,
                    maxSpeed: 0,
                    recoil: 0,
                    reload: 0.1,
                    damage: 6,
                    size: 2,
                    health: 1,
                }]),
                TYPE: ["bullet", {
                    ALPHA: 0,
                    ON: [{
                        event: 'tick',
                        handler: ({body}) => {
                            body.DAMAGE -= 1;
                            body.SIZE -= 0.6;
                            if (body.SIZE < 1) body.kill();
                        }
                    }],
                }], 
                AUTOFIRE: true,
                BORDERLESS: true,
                DRAW_FILL: false,
            }
        }
    ]
}
Class.ihdtiBolt1 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [48, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [76, 56, 0, 0, 190, 1],
        TYPE: "ihdtiBall"
        }
    ]
}
Class.ihdtiBolt2 = {
    PARENT: "genericTank",
    COLOR: "grey",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [24, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [20, 28, 0, 0, 190, 1],
        TYPE: "ihdtiBolt1"
        }
    ]
}
Class.ihdtiBolt3 = {
    PARENT: "genericTank",
    COLOR: "grey",
    GUNS: [{
        POSITION: [24, 5, 1, 8, 0, 0, 0]
    }],
    TURRETS: [{
        POSITION: [18, 28, 0, 0, 190, 1],
        TYPE: "ihdtiBolt2"
        }
    ]
}

// Undercover Cop Headlights
Class.cop_genericHeadlight = {
    LABEL: '',
    SHAPE: 6,
    INDEPENDENT: true,
    MIRROR_MASTER_ANGLE: true
}
Class.hexagonBlue = {
    PARENT: "cop_genericHeadlight",
    COLOR: 21
}
Class.squareBlue = {
    PARENT: "cop_genericHeadlight",
    COLOR: 22,
    SHAPE: 4
}
Class.hexagonRed = {
    PARENT: "cop_genericHeadlight",
    COLOR: 24
}
Class.squareRed = {
    PARENT: "cop_genericHeadlight",
    COLOR: 23,
    SHAPE: 4
}

// thing for later
Class.crowbarTurretTank = {
    PARENT: "genericTank",
    COLOR: 16,
    BODY: {
        FOV: 1,
    },
    TURRETS: [{
        POSITION: [20, 0, 0, 0, 180, 1],
        TYPE: makeTurret({
            PARENT: "genericTank",
            LABEL: "",
            BODY: {
                FOV: 6,
            },
            CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
            COLOR: 16,
            GUNS: [
                {
                    POSITION: [22, 10, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, { recoil: 0, damage: 0.91 }]),
                        TYPE: "bullet",
                    },
                },
            ],
        }),
    }, ],
}

// Arras celestial leaks
Class.desmosTurret = makeTurret("desmos", {canRepel: true, limitFov: true, extraStats: []})
Class.undertowTurret = makeTurret("undertow", {canRepel: true, limitFov: true, extraStats: []})
Class.forkTurret = makeTurret("fork", {canRepel: true, limitFov: true, extraStats: []})
Class.destroyerTurret = makeTurret("destroyer", {canRepel: true, limitFov: true, extraStats: []})
Class.rifleTurret = makeTurret("rifle", {canRepel: true, limitFov: true, extraStats: []})
Class.streamlinerTurret = makeTurret("streamliner", {canRepel: true, limitFov: true, extraStats: []})
Class.gunnerTurret = makeTurret("gunner", {canRepel: true, limitFov: true, extraStats: []})
Class.singleTurret = makeTurret("single", {canRepel: true, limitFov: true, extraStats: []})
Class.sprayerTurret = makeTurret("sprayer", {canRepel: true, limitFov: true, extraStats: []})
Class.crossbowTurret = makeTurret("crossbow", {canRepel: true, limitFov: true, extraStats: []})
Class.machineGunTurret = makeTurret("machineGun", {canRepel: true, limitFov: true, extraStats: []})
Class.tripleShotTurret = makeTurret("tripleShot", {canRepel: true, limitFov: true, extraStats: []})
Class.constructorTurret = makeTurret("construct", {canRepel: true, limitFov: true, extraStats: []})
Class.musketTurret = makeTurret("musket", {canRepel: true, limitFov: true, extraStats: []})
Class.builderTurret = makeTurret("builder", {canRepel: true, limitFov: true, extraStats: []})
Class.trapperTurret = makeTurret("trapper", {canRepel: true, limitFov: true, extraStats: []})
Class.spreadshotTurret = makeTurret("spreadshot", {canRepel: true, limitFov: true, extraStats: []})
Class.minigunTurret = makeTurret("minigun", {canRepel: true, limitFov: true, extraStats: []})
Class.rangerTurret = makeTurret("ranger", {canRepel: true, limitFov: true, extraStats: []})
Class.sniperTurret = makeTurret("sniper", {canRepel: true, limitFov: true, extraStats: []})
Class.pentaShotTurret = makeTurret("pentaShot", {canRepel: true, limitFov: true, extraStats: []})
Class.dualTurret = makeTurret("dual", {canRepel: true, limitFov: true, extraStats: []})
Class.predatorTurret = makeTurret("predator", {canRepel: true, limitFov: true, extraStats: []})
Class.fieldGunTurret = makeTurret("fieldGun", {canRepel: true, limitFov: true, extraStats: []})
Class.beekeeperTurret = makeTurret("beekeeper", {canRepel: true, limitFov: true, extraStats: []})
Class.annihilatorTurret = makeTurret("annihilator", {canRepel: true, limitFov: true, extraStats: []})
Class.mortarTurret = makeTurret("mortar", {canRepel: true, limitFov: true, extraStats: []})
Class.ordnanceTurret = makeTurret("ordnance", {canRepel: true, limitFov: true, extraStats: []})
Class.focalTurret = makeTurret("focal", {canRepel: true, limitFov: true, extraStats: []})
Class.undertowTurret = makeTurret("undertow", {canRepel: true, limitFov: true, extraStats: []})
Class.forkTurret = makeTurret("fork", {canRepel: true, limitFov: true, extraStats: []})
Class.hunterTurret = makeTurret("hunter", {canRepel: true, limitFov: true, extraStats: []})
Class.tripletTurret = makeTurret("triplet", {canRepel: true, limitFov: true, extraStats: []})
Class.heavyTurret = makeTurret({
    GUNS: [
            {
                POSITION: [19, 9, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.single, g.pounder, g.destroyer, g.annihilator]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [5.5, 9, -1.8, 6.5, 0, 0, 0]
            }
        ]
}, {canRepel: true, limitFov: true, color: 'grey', extraStats: [{health: 1.1, damage: 1.1}]})
Class.engineerTurret = makeTurret({
    GUNS: [
            {
                POSITION: [5, 11, 1, 10.5, 0, 0, 0],
            },
            {
                POSITION: [3, 14, 1, 15.5, 0, 0, 0],
            },
            {
                POSITION: [2, 14, 1.3, 18, 0, 0, 0],
                PROPERTIES: {
                    MAX_CHILDREN: 6,
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                    TYPE: "pillbox",
                    NO_LIMITATIONS: true,
                    SYNCS_SKILLS: true,
                    DESTROY_OLDEST_CHILD: true,
                    STAT_CALCULATOR: "block"
                },
            },
            {
                POSITION: [4, 14, 1, 8, 0, 0, 0],
            },
        ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.warkTurret = makeTurret({
    GUNS: weaponMirror([
        {
            POSITION: [14, 7, 1, 0, -5.5, -5, 0]
        },
        {
            POSITION: [3, 8, 1.5, 14, -5.5, -5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
    ])
}, {canRepel: true, limitFov: true, extraStats: []})
Class.ullrLowerTurret = makeTurret({
    GUNS: weaponMirror([
        {
            POSITION: [4.5, 6, 1, 10.5, -5.5, 0, 0],
        },
        {
            POSITION: [1, 8, 1, 15, -5.5, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.swarm, g.babyfactory, { size: 1.2, reload: 1.5 }]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 8, 1, 0, -5.5, 0, 0],
        },
    ])
}, {canRepel: true, limitFov: true, extraStats: []})
Class.isisLowerTurret = makeTurret({
    GUNS: [
        {
            POSITION: [20, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.pounder, g.destroyer]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16.5, 16, 1, 0, 0, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.pounder, g.destroyer]),
                TYPE: "bullet"
            }
        }
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
Class.blunderbussTurret = makeTurret({
    GUNS: [
                {
                    POSITION: [13, 4, 1, 0, -3, -9, 0.3],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [15, 4, 1, 0, -2.5, -6, 0.2],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [16, 4, 1, 0, -2, -3, 0.1],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [13, 4, 1, 0, 3, 9, 0.3],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [15, 4, 1, 0, 2.5, 6, 0.2],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [16, 4, 1, 0, 2, 3, 0.1],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([
                            g.basic,
                            g.sniper,
                            g.rifle,
                            g.blunderbuss,
                        ]),
                    },
                },
                {
                    POSITION: [25, 7, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        TYPE: "bullet",
                        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                    },
                },
                {
                    POSITION: [14, 10.5, 1, 0, 0, 0, 0],
                },
            ],
}, {canRepel: true, limitFov: true, extraStats: []})
Class.bentBuilderTurret = makeTurret({
    GUNS: weaponMirror([
        {
        POSITION: [16, 11, 1, 0, -2, -35, 0],
        },
        {
            POSITION: [2, 11, 1.1, 16, -2, -35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.twin]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]),
}, {canRepel: true, limitFov: true, extraStats: []})
Class.volleyTurret = makeTurret({
    GUNS: [
        {
            POSITION: [12, 5.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.06, health: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 5.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.06, health: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 5.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.06, health: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 5.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
Class.rimflakTurret = makeTurret({
    GUNS: [
        {
            POSITION: [7, 7.5, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, reload: 0.91 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2, reload: 0.91 }]),
                TYPE: "bullet"
            }
        }
    ]
}, {canRepel: true, limitFov: true, extraStats: []})
