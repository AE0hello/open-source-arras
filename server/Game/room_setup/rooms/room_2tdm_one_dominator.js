const room = Array(15).fill(() => Array(15).fill()).map(x => x());

// Place domination tile at center (7,7) for the single dominator
room[7][7] = tileClass.dominationTile;

const room_2tdm_one_dominator = room;

module.exports = room_2tdm_one_dominator;
