tileClass.abase2 = new Tile({
    COLOR: "green",
    NAME: "Green Tile",
    INIT: (tile, room) => {
        if (!room.spawnable["assaultDominators"]) room.spawnable["assaultDominators"] = [];
        room.spawnable["assaultDominators"].push(tile);
        tile.isSanctuary = false;
    },
});
tileClass.sabase2 = new Tile({
    COLOR: "green",
    NAME: "Green Tile",
    INIT: (tile, room) => {
        if (!room.spawnable["assaultDominators"]) room.spawnable["assaultDominators"] = [];
        room.spawnable["assaultDominators"].push(tile);
        tile.isSanctuary = true;
    },
});
tileClass.assaultNest = new Tile({
    COLOR: "white",
    NAME: "Assault Nest Tile",
    INIT: (tile, room) => {
        if (!room.spawnable[TEAM_ENEMIES]) room.spawnable[TEAM_ENEMIES] = [];
        room.spawnable[TEAM_ENEMIES].push(tile);
    },
});
