module.exports = {
    MODE: "tdm",
    TEAMS: 2,
    ASSAULT: true,
    TILE_WIDTH: 413,
    TILE_HEIGHT: 412,
    DO_NOT_OVERRIDE_ROOM: false,
    ROOM_SETUP: ["room_assault_line"],
    MAZE_TYPE: 17,
    BOT_MOVE: [{
        TEAM: TEAM_GREEN,
        RANGE: 70,
        MOVEMENT: [
            [-9.53, 93.35],
            [3.59, 91.94],
            [3.35, 57.21]
        ]
    }, {
        TEAM: TEAM_BLUE,
        RANGE: 90,
        MOVEMENT: [
            [5.35, -84.12],
            [2.39, -20.39],
        ]
    }],
    TEAM_WEIGHTS: {
        [TEAM_BLUE]: 1.1
    },
}