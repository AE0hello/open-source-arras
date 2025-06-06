tileClass.outBorder = new Tile({
     COLOR: "white",
     TICK: tile => {
        for (let i = 0; i < tile.entities.length; i++) {
            let entity = tile.entities[i];
            if (!entity.isBoss && 
                !entity.master.master.isBoss && 
                !entity.isArenaCloser && 
                !entity.master.master.isArenaCloser &&
                !entity.godmode &&
                 entity.type !== "wall"
            ) entity.kill();
        }
     }
});

let addTileToBossSpawnTile = (tile, room) => {
    if (!room.spawnable["bossSpawnTile"]) room.spawnable["bossSpawnTile"] = [];
    room.spawnable["bossSpawnTile"].push(tile);
}
let bossTick = (tile, pushTo, allow, gameManager) => {
    for (let i = 0; i < tile.entities.length; i++) {
        let entity = tile.entities[i];
        if (!entity.isBoss && 
            !entity.master.master.isBoss && 
            !entity.isArenaCloser && 
            !entity.master.master.isArenaCloser &&
            !entity.godmode &&
             entity.type !== "wall"
        ) entity.kill();
        if (pushTo == "right" && 
            allow == "blitz" && 
            gameManager.gameSettings.BLITZ &&
            entity.isBoss && 
            !entity.control.fire
            ) {
            entity.x += 2 / 0.9;
        }
    }
}

tileClass.bossSpawn = new Tile({
    COLOR: "red",
    NAME: "Boss Spawn",
    INIT: (tile, room, gameManager) => {
        if (!gameManager.gameSettings.BLITZ && !gameManager.gameSettings.FORTRESS && !gameManager.gameSettings.CITADEL) addTileToBossSpawnTile(tile, room);
    },
    TICK: (tile, room, gameManager) => bossTick(tile, "right", "blitz", gameManager)
});
tileClass.bossSpawnVoid = new Tile({
    COLOR: "white",
    NAME: "Boss Spawn",
    INIT: (tile, room, gameManager) => {
        if (gameManager.gameSettings.BLITZ || gameManager.gameSettings.FORTRESS || gameManager.gameSettings.CITADEL) addTileToBossSpawnTile(tile, room);
    },
    TICK: (tile, room, gameManager) => bossTick(tile, "right", "blitz", gameManager)
})

tileClass.sbase1 = new Tile({
    COLOR: "blue",
    NAME: "Sanctuary Tile",
    INIT: (tile, room) => {
        if (!room.spawnable[TEAM_BLUE]) room.spawnable[TEAM_BLUE] = [];
        room.spawnable[TEAM_BLUE].push(tile);
    },
})

tileClass.stopAI = new Tile({
    COLOR: "white",
    NAME: "stopAI"
})