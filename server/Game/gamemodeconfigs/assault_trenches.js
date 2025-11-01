module.exports = {
    MODE: "tdm",
    TEAMS: 2,
    ASSAULT: true,
    TILE_WIDTH: 440,
    TILE_HEIGHT: 440,
    DO_NOT_OVERRIDE_ROOM: false,
    ROOM_SETUP: ["room_assault_trenches"],
    MAZE_TYPE: 16,
    BOT_MOVE: [{
        TEAM: TEAM_GREEN,
        RANGE: 70,
        MOVEMENT: [
            [76.72, 54.80],
            [69.62, 58.57],
            [67.33, 62.54],
            [32.85, 62.04],
            [33.55, 40.62],
            [39.52, 38.86],
            [39.52, 25.52]
        ]
    }, {
        TEAM: TEAM_BLUE,
        RANGE: 20,
        MOVEMENT: [
            [12.09, -53.01],
            [0, -33.10],
            [-33.07, -30.56],
            [-40.41, -22.86],
            [-38.66, 3.48],
            [-22.50, 3.48],
        ]
    }],
    TEAM_WEIGHTS: {
        [TEAM_BLUE]: 1.1
    }
}