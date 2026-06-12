const team_count = Config.teams ?? Math.floor(Math.random() * 2 + 1) * 2

maze = team_count % 2 !== 0 ? team_count + 1 : team_count
if (maze == 6) {
    maze = 8
}

module.exports = {
    mode: "tdm",
    teams: team_count,
    maze_type: maze,
    do_not_override_room: true,
    room_setup: ["room_tdm"]
}