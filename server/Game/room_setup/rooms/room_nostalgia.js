const teams = require("../../gamemodeconfigs/nostalgia.js").teams,
  room = Array(Config.roomHeight).fill(() => Array(Config.roomWidth).fill(tileClass.normal)).map(x => x()),
  spacing = 0;

if (teams === 2 && !spacing) {
  // Set bases on left and right sides
  for (let y = 0; y < Config.roomHeight; y++) {
    for (let x = 0; x < 12; x++) {
      room[y][x] = tileClass.base1;
    }
    for (let x = Config.roomWidth - 12; x < Config.roomWidth; x++) {
      room[y][x] = tileClass.base2;
    }
  }
  // Add dispersed rock obstacles with random sizes
  const rockPositions = [
    [50, 2], [100, 4], [150, 6], [200, 8],
    [75, 1], [125, 3], [175, 7], [225, 9],
    [25, 5], [175, 2], [225, 6]
  ];
  for (const [x, y] of rockPositions) {
    if (y < Config.roomHeight && x < Config.roomWidth) {
      // Randomly choose between rock (bigger) and roid (smaller)
      room[y][x] = ran.choose([tileClass.rock, tileClass.roid]);
    }
  }
} else {
  // For other team counts, use the standard locations without protectors
  for (let i = 1; i <= teams; i++) {
    const [spawns] = locations[i - 1];
    for (const [y, x] of spawns) {
      room[y][x] = tileClass[`base${i}`];
    }
    // Note: No base protectors added
  }
}

module.exports = room;
