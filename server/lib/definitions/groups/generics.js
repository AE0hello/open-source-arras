const { skillSet } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');

Class.genericEntity = {
    NAME: "",
    LABEL: "",//"Unknown Entity",
    TYPE: "unknown",
    DAMAGE_CLASS: 0,
    DANGER: 0,
    VALUE: 0,
    SHAPE: 0,
    COLOR: {
        BASE: 16, // ID
        HUE_SHIFT: 0, // Additive, degrees
        SATURATION_SHIFT: 1, // Multiplicative
        BRIGHTNESS_SHIFT: 0, // Additive, ranges from -100 to 100
        ALLOW_BRIGHTNESS_INVERT: false, // Toggles offset invert if exceeding normal color bounds
    },
    INDEPENDENT: false,
    CONTROLLERS: [],
    HAS_NO_MASTER: false,
    MOTION_TYPE: "glide",
    FACING_TYPE: "toTarget",
    DRAW_HEALTH: false,
    DRAW_SELF: true,
    IS_IMMUNE_TO_TILES: false,
    DAMAGE_EFFECTS: true,
    RATEFFECTS: true,
    MOTION_EFFECTS: true,
    INTANGIBLE: false,
    CAN_SEE_INVISIBLE_ENTITIES: false,
    ACCEPTS_SCORE: true,
    GIVE_KILL_MESSAGE: false,
    CAN_GO_OUTSIDE_ROOM: false,
    HITS_OWN_TYPE: "normal",
    DIE_AT_LOW_SPEED: false,
    DIE_AT_RANGE: false,
    CLEAR_ON_MASTER_UPGRADE: false,
    PERSISTS_AFTER_DEATH: false,
    VARIES_IN_SIZE: false,
    HEALTH_WITH_LEVEL: true,
    CAN_BE_ON_LEADERBOARD: true,
    HAS_NO_RECOIL: false,
    SYNC_WITH_TANK: false,
    BUFF_VS_FOOD: false,
    OBSTACLE: false,
    CRAVES_ATTENTION: false,
    NECRO: false,
    UPGRADES_TIER_0: [],
    UPGRADES_TIER_1: [],
    UPGRADES_TIER_2: [],
    UPGRADES_TIER_3: [],
    UPGRADES_TIER_4: [],
    UPGRADES_TIER_5: [],
    UPGRADES_TIER_6: [],
    UPGRADES_TIER_7: [],
    UPGRADES_TIER_8: [],
    UPGRADES_TIER_9: [],
    SKILL: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    LEVEL: 0,
    SKILL_CAP: Array(10).fill(dfltskl),
    GUNS: [],
    MAX_CHILDREN: 0,
    BORDERLESS: false,
    DRAW_FILL: true,
    REROOT_UPGRADE_TREE: null,
    DISPLAY_NAME: true,
    ON: [],
    BODY: {
        ACCELERATION: 1,
        SPEED: 0,
        HEALTH: 1,
        RESIST: 1,
        SHIELD: 0,
        REGEN: 0,
        DAMAGE: 1,
        PENETRATION: 1,
        RANGE: 0,
        FOV: 1,
        SHOCK_ABSORB: 1,
        RECOIL_MULTIPLIER: 1,
        DENSITY: 1,
        STEALTH: 1,
        PUSHABILITY: 1,
        HETERO: 2
    },
    FOOD: {
        LEVEL: -1
    }
}
Class.genericTank = {
    LABEL: "Unknown Class",
    TYPE: "tank",
    DAMAGE_CLASS: 2,
    DANGER: 5,
    SHAPE: 0,
    MOTION_TYPE: "motor",
    FACING_TYPE: "toTarget",
    SIZE: 12,
    NO_SIZE_ANIMATION: false,
    MAX_CHILDREN: 0,
    DAMAGE_EFFECTS: false,
    IGNORED_BY_AI: false,
    CAN_SEE_INVISIBLE_ENTITIES: false,
    SYNC_WITH_TANK: false,
    IS_IMMUNE_TO_TILES: false,
    RENDER_ON_LEADERBOARD: true,
    REROOT_UPGRADE_TREE: Config.spawn_class,
    BODY: {
        ACCELERATION: base.ACCEL,
        SPEED: base.SPEED,
        HEALTH: base.HEALTH,
        DAMAGE: base.DAMAGE,
        PENETRATION: base.PENETRATION,
        SHIELD: base.SHIELD,
        REGEN: base.REGEN,
        FOV: base.FOV,
        DENSITY: base.DENSITY,
        PUSHABILITY: 1,
        HETERO: 3,
    },
    GUNS: [],
    TURRETS: [],
    PROPS: [],
    ON: [],
    ARENA_CLOSER: false, // don't remove this, it stops dev basics going through walls
    GIVE_KILL_MESSAGE: true,
    DRAW_HEALTH: true,
    RESET_EVENTS: true,
    HITS_OWN_TYPE: "hardOnlyTanks"
}
Class.genericFlail = {
    PARENT: "genericTank",
    STAT_NAMES: statnames.flail,
    SYNC_WITH_TANK: true,
    SKILL_CAP: [dfltskl, dfltskl, dfltskl, dfltskl, 0, dfltskl, dfltskl, dfltskl, dfltskl, dfltskl],
}
Class.genericSmasher = {
    PARENT: "genericTank",
    DANGER: 7,
    IS_SMASHER: true,
    SKILL_CAP: {
        RELOAD: smshskl,
        PENETRATION: 0,
        BULLET_HEALTH: 0,
        BULLET_DAMAGE: 0,
        BULLET_SPEED: 0,
        SHIELD_CAPACITY: smshskl,
        BODY_DAMAGE: smshskl,
        MAX_HEALTH: smshskl,
        SHIELD_REGENERATION: smshskl,
        MOVEMENT_SPEED: smshskl
    },
    STAT_NAMES: statnames.smasher,
    BODY: {
        FOV: 1.05 * base.FOV,
        DENSITY: 2 * base.DENSITY
    }
}
Class.genericBoss = {
    PARENT: "genericTank",
    TYPE: "miniboss",
    DANGER: 6,
    SKILL: skillSet({
        rld: 0.7,
        dam: 0.5,
        pen: 0.8,
        str: 0.8,
        spd: 0.2,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0.7,
        mob: 0,
    }),
    LEVEL: 45,
    CONTROLLERS: [["nearestDifferentMaster", { lockThroughWalls: true }], "canRepel"],
    FACING_TYPE: ['spin', {speed: 0.02}],
    HITS_OWN_TYPE: "hardOnlyBosses",
    BROADCAST_MESSAGE: "A visitor has left!",
    BODY: { PUSHABILITY: 0.05 }
}

Class.food = {
    TYPE: "food",
    DAMAGE_CLASS: 1,
    CONTROLLERS: ["moveInCircles"],
    HITS_OWN_TYPE: "repel",
    MOTION_TYPE: "drift",
    FACING_TYPE: "turnWithSpeed",
    IS_IMMUNE_TO_TILES: false,
    level_cap: 1,
    BODY: {
        STEALTH: 30,
        PUSHABILITY: 1,
        REGEN: 0
    },
    DAMAGE_EFFECTS: false,
    RATEFFECTS: false,
    HEALTH_WITH_LEVEL: false,
};

Class.bullet = {
    LABEL: "Bullet",
    TYPE: "bullet",
    ACCEPTS_SCORE: false,
    BODY: {
        PENETRATION: 1,
        SPEED: 3.75,
        RANGE: 90,
        DENSITY: 1.25,
        HEALTH: 0.165,
        DAMAGE: 6,
        PUSHABILITY: 0.3,
    },
    FACING_TYPE: "smoothWithMotion",
    CAN_GO_OUTSIDE_ROOM: true,
    HITS_OWN_TYPE: "never",
    DIE_AT_RANGE: true,
};

Class.drone = {
    LABEL: "Drone",
    TYPE: "drone",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    CONTROL_RANGE: 0,
    SHAPE: 3,
    MOTION_TYPE: "chase",
    FACING_TYPE: "smoothToTarget",
    CONTROLLERS: [
        "nearestDifferentMaster",
        "canRepel",
        "mapTargetToGoal",
        "hangOutNearMaster",
    ],
    AI: {
        BLIND: true,
    },
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.085,
        HEALTH: 0.3,
        DAMAGE: 3.375,
        SPEED: 3.8,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.5,
    },
    HITS_OWN_TYPE: "droneCollision",
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
};

Class.swarm = {
    LABEL: "Swarm Drone",
    TYPE: "swarm",
    ACCEPTS_SCORE: false,
    SHAPE: 3,
    MOTION_TYPE: "swarm",
    FACING_TYPE: "smoothWithMotion",
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    CRAVES_ATTENTION: true,
    BODY: {
        ACCELERATION: 3,
        PENETRATION: 1.5,
        HEALTH: 0.175,
        DAMAGE: 2.25,
        SPEED: 4.5,
        RESIST: 1.6,
        RANGE: 225,
        DENSITY: 12,
        PUSHABILITY: 0.6,
        FOV: 1.5,
    },
    DIE_AT_RANGE: true,
    BUFF_VS_FOOD: true,
};
Class.baseSwarmTurret_swarm = {
    PARENT: "swarm",
    MOTION_TYPE: ["swarm", { turnVelocity: 10 }],
    AI: { IGNORE_SHAPES: true },
    BODY: {
        ACCELERATION: Class.swarm.BODY.ACCELERATION,
        PENETRATION: Class.swarm.BODY.PENETRATION,
        HEALTH: Class.swarm.BODY.HEALTH,
        DAMAGE: Class.swarm.BODY.DAMAGE,
        SPEED: Class.swarm.BODY.SPEED,
        RESIST: Class.swarm.BODY.RESIST,
        RANGE: 345,
        DENSITY: Class.swarm.BODY.DENSITY,
        PUSHABILITY: Class.swarm.BODY.PUSHABILITY,
        FOV: 1.7,
        KNOCKBACK: 15,
    },
}
Class.airblastBullet = { PARENT: "bullet", ALPHA: 0.5, BODY: { KNOCKBACK: 30 } }
Class.trap = {
    LABEL: "Thrown Trap",
    TYPE: "trap",
    ACCEPTS_SCORE: false,
    SHAPE: -3,
    MOTION_TYPE: "glide",
    FACING_TYPE: "turnWithSpeed",
    HITS_OWN_TYPE: "push",
    DIE_AT_RANGE: true,
    BODY: {
        HEALTH: 0.5,
        DAMAGE: 3,
        RANGE: 450,
        DENSITY: 2.5,
        RESIST: 2.5,
        SPEED: 0,
    },
};

Class.satellite = { 
    LABEL: "Satellite",
    TYPE: "satellite",
    ACCEPTS_SCORE: false,
    DANGER: 2,
    SHAPE: 0,
    LAYER: 13,
    CONTROLLERS: ['orbit'],
    FACING_TYPE: "spin",
    BODY: {
        PENETRATION: 1.2,
        PUSHABILITY: 0.6,
        ACCELERATION: 0.75,
        HEALTH: 0.3,
        DAMAGE: 3.375,
        SPEED: 10,
        RANGE: 200,
        DENSITY: 0.03,
        RESIST: 1.5,
        FOV: 0.5,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    BUFF_VS_FOOD: true,
    MOTION_TYPE: 'motor'
}
Class.satellite_old = {
    PARENT: "satellite",
    TURRETS: [
        {
            POSITION: [28, 0, 0, 0, 360, 0],
            TYPE: "genericEntity"
        }
    ],
}
Class.squareSatellite = {
    PARENT: "satellite",
    SHAPE: 4
}

Class.auraBase = {
    TYPE: "aura",
    ACCEPTS_SCORE: false,
    FACING_TYPE: "smoothWithMotion",
    MOTION_TYPE: "withMaster",
    HITS_OWN_TYPE: "never",
    DAMAGE_EFFECTS: false,
    DIE_AT_RANGE: false,
    ALPHA: 0.3,
    CLEAR_ON_MASTER_UPGRADE: true,
    CAN_GO_OUTSIDE_ROOM: true,
    CONTROLLERS: ["disableOnOverride", "scaleWithMaster"],
    BODY: {
        SHIELD: 1e9,
        REGEN: 1e6,
        HEALTH: 1e9,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    }
};
Class.aura = {
    PARENT: "auraBase",
    LABEL: "Aura",
    COLOR: "teal",
    BODY: {
        DAMAGE: 0.4,
    },
};
Class.healAura = {
    PARENT: "auraBase",
    LABEL: "Heal Aura",
    HEALER: true,
    COLOR: "red",
    BODY: {
        DAMAGE: 0.4 / 3,
    },
};
Class.auraSymbol = {
    PARENT: "genericTank",
    CONTROLLERS: [["spin", {speed: -0.04}]],
    INDEPENDENT: true,
    COLOR: "teal",
    SHAPE: [[-0.598,-0.7796],[-0.3817,-0.9053],[0.9688,-0.1275],[0.97,0.125],[-0.3732,0.9116],[-0.593,0.785]]
};
