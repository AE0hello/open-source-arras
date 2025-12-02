module.exports = {
    mode: "tdm",
    TEAMS: 2,
    ASSAULT: true,
    map_tile_width: 440,
    map_tile_height: 440,
    do_not_override_room: false,
    room_setup: ["room_assault_acropolis"],
    MAZE_TYPE: 19,
	team_weights: {
		[TEAM_BLUE]: 1.1
	}
}