module.exports = {
    MODE: "tdm",
    TEAMS: 2,
    ASSAULT: true,
    TILE_WIDTH: 440,
    TILE_HEIGHT: 440,
    DO_NOT_OVERRIDE_ROOM: false,
    ROOM_SETUP: ["room_assault_eye"],
    MAZE_TYPE: 18,
    BOT_MOVE: [{
        TEAM: TEAM_GREEN,
        RANGE: 70,
        MOVEMENT: [
            [4.62, 56.14],
            [7.46, 62.44],
            [18.33, 59.60],
            [18.03, 34.27]
        ]
    }, {
        TEAM: TEAM_BLUE,
        RANGE: 20,
        MOVEMENT: [
            [-17.81, -68.63],
            [-18.11, -11.70],
        ]
    }],
    TEAM_WEIGHTS: {
        [TEAM_BLUE]: 1.1
    }
}