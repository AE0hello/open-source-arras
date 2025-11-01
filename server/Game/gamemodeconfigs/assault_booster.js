module.exports = {
    MODE: "tdm",
    TEAMS: 2,
    ASSAULT: true,
    TILE_WIDTH: 440,
    TILE_HEIGHT: 440,
    DO_NOT_OVERRIDE_ROOM: false,
    ROOM_SETUP: ["room_assault_booster"],
    MAZE_TYPE: 15,
    BOT_MOVE: [{
        TEAM: TEAM_BLUE,
        RANGE: 20,
        MOVEMENT: [
            [107.43, 0.46],
            [76.66, 0.46],
        ]
    }],
    TEAM_WEIGHTS: {
		[TEAM_BLUE]: 1.1
	}
}