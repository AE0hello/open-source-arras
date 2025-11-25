const { combineStats } = require("../../facilitators.js")
const { base, statnames, dfltsky, smshskl } = require("../../constants.js")
require("../../groups/generics.js")

const disable_addon = true

Class.generic_body = {
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
    REROOT_UPGRADE_TREE: "body_basic",
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
Class.generic_rear = {
    COLOR: "mirror",
    REROOT_UPGRADE_TREE: "rear_plain"
}
Class.generic_front = {
    COLOR: "mirror",
    REROOT_UPGRADE_TREE: "front_tank"
}

if (disable_addon) { return }

Config.SPAWN_CLASS = ["body_basic", "rear_plain", "front_tank"]
