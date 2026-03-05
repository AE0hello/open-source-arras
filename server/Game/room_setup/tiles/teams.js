const spawnPermanentBaseProtector = (loc, team) => {
    const o = new Entity(loc);
    o.define("baseProtector");
    o.team = team;
    o.color.base = getTeamColor(team);
    o.on("dead", () => spawnPermanentBaseProtector(loc, team));
  },
  teamCheck = (tile, team) => {
    for (let i = 0; i < tile.entities.length; i++) {
      const entity = tile.entities[i];
      if (entity.team !== team && !entity.ac && !entity.master.master.ac && !entity.isArenaCloser && !entity.master.master.isArenaCloser) {
        entity.kill();
      };
    }
  },
  teamRoomCheck = (tile, team, room) => {
    if (!room.spawnable[team]) {
      room.spawnable[team] = [];
    }
    room.spawnable[team].push(tile);
  };

// Team -1 (blue)
tileClass.base1 = new Tile({
  COLOR: "blue",
  INIT: (tile, room) => teamRoomCheck(tile, TEAM_BLUE, room),
  TICK: tile => teamCheck(tile, TEAM_BLUE)
});
tileClass.baseprotected1 = new Tile({
  COLOR: "blue",
  VISIBLE_FROM_BLACKOUT: true,
  INIT: (tile, room) => {
    teamRoomCheck(tile, TEAM_BLUE, room),
    spawnPermanentBaseProtector(tile.loc, TEAM_BLUE);
  },
  TICK: tile => teamCheck(tile, TEAM_BLUE)
});

// Team -2 (Green)
tileClass.base2 = new Tile({
  COLOR: "green",
  INIT: (tile, room) => teamRoomCheck(tile, TEAM_GREEN, room),
  TICK: tile => teamCheck(tile, TEAM_GREEN)
});
tileClass.baseprotected2 = new Tile({
  COLOR: "green",
  VISIBLE_FROM_BLACKOUT: true,
  INIT: (tile, room) => {
    teamRoomCheck(tile, TEAM_GREEN, room),
    spawnPermanentBaseProtector(tile.loc, TEAM_GREEN);
  },
  TICK: tile => teamCheck(tile, TEAM_GREEN)
});

// Team -3 (Red)
tileClass.base3 = new Tile({
  COLOR: "red",
  INIT: (tile, room) => teamRoomCheck(tile, TEAM_RED, room),
  TICK: tile => teamCheck(tile, TEAM_RED)
});
tileClass.baseprotected3 = new Tile({
  COLOR: "red",
  VISIBLE_FROM_BLACKOUT: true,
  INIT: (tile, room) => {
    teamRoomCheck(tile, TEAM_RED, room),
    spawnPermanentBaseProtector(tile.loc, TEAM_RED);
  },
  TICK: tile => teamCheck(tile, TEAM_RED)
});

// Team -4 (Purple)
tileClass.base4 = new Tile({
  COLOR: "magenta",
  INIT: (tile, room) => teamRoomCheck(tile, TEAM_PURPLE, room),
  TICK: tile => teamCheck(tile, TEAM_PURPLE)
});
tileClass.baseprotected4 = new Tile({
  COLOR: "magenta",
  VISIBLE_FROM_BLACKOUT: true,
  INIT: (tile, room) => {
    teamRoomCheck(tile, TEAM_PURPLE, room),
    spawnPermanentBaseProtector(tile.loc, TEAM_PURPLE);
  },
  TICK: tile => teamCheck(tile, TEAM_PURPLE)
});
