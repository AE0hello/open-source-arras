class tileEntity {
    constructor(tile, loc, gameManager) {
        // Lets check if the gameManager is defined properly by calling this function.
        gameManager = ensureIsManager(gameManager);
        // Lets check if an tile is an definition. If not tell them about it.
        if (!(tile instanceof Tile)) {
            console.error(`Tile Class definition ${loc.x},${loc.y} is attempted to be gotton but does not exist! wich you means need to update your room setup!`);
            throw new Error("Undefined tile class detected!");
        };
        // Now lets add their locations to the public.
        let gridLoc = this.gridLoc = { x: parseFloat(loc.x), y: parseFloat(loc.y) };
        this.loc = {
            get x() { return gameManager.room.tileWidth * (gridLoc.x + 0.5) - gameManager.room.width / 2; },
            get y() { return gameManager.room.tileHeight * (gridLoc.y + 0.5) - gameManager.room.height / 2; }
        };

        // Now lets add stuff.
        this.gameManager = gameManager;
        this.bluePrint = tile.args;
        this.color = tile.color;
        this.name = tile.name;
        this.image = tile.image ?? undefined;
        this.init = tile.init;
        this.tick = tile.tick;
        this.entities = [];
        this.data = JSON.parse(JSON.stringify(tile.data));
    }
    randomInside() { // What this does is it spawns an entity in a random location inside that tile.
        return {
            x: this.gameManager.room.tileWidth * (this.gridLoc.x + Math.random()) - this.gameManager.room.width / 2,
            y: this.gameManager.room.tileHeight * (this.gridLoc.y + Math.random()) - this.gameManager.room.height / 2
        }
    }
};

module.exports = { tileEntity };
