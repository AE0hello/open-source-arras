// Now lets load the files
const requires = [
    "./global.js", // Get the global virables before loading the next files.
    // Debug / other
    "../miscFiles/collisionFunctions.js", // The actual collision functions that make the game work.
    "../miscFiles/color.js", // Manager that manages the entities's color.
    "../game/debug/lagLogger.js", // Lag Logger.
    "../game/debug/logs.js", // Logs.
    "../game/entities/subFunctions.js", // This helps keeping the entities work.
    // Controllers
    "../miscFiles/controllers.js", // The AI of the game.
    // Entities
    "../game/entities/vector.js", // Define a vector. Required By Entity.js.
    "../game/entities/skills.js", // Define skills. Required By Entity.js.
    "../game/entities/bulletEntity.js", // The entity constructor but with heavy limitations. Required By gun.js.
    "../game/entities/gun.js", // Define gun to make guns work. Required By Entity.js.
    "../game/entities/healthType.js", // Define health to make healths work when an entity got hit, or regenerated. Required By Entity.js.
    "../game/entities/antiNaN.js", // This file prevents NaN's of entities. Required By Entity.js.
    "../game/entities/turretEntity.js", // The entity constructor for turrets. Required By Entity.js.
    "../game/entities/entity.js", // The actual entity constructor.
    "../game/entities/propEntity.js", // This file create prop entities, Its actually a turret entity but a decorative only.
    // Definitions
    "../lib/definitions/combined.js", // Get the definitions loader.
    // Room setup
    "../miscFiles/tileEntity.js", // The tile constructor for room setup.
    // Mockups
    "../miscFiles/mockups.js", // This file loads the mockups.
];

for (let file of requires) {
    const module = require(file);
    for (let key in module) if (module.hasOwnProperty(key)) global[key] = module[key];
}

let fs = require('fs'),
	path = require('path'),
	groups = fs.readdirSync(path.resolve(__dirname, '../game/roomSetup/tiles/')),
    loadRooms = (log = false) => {
        // Now we need to define every tile.
        if (Config.startup_logs && log) console.log(`Importing tile definitions...`);
        for (let filename of groups) {
            if (Config.startup_logs && log) console.log(`Loading tile file: ${filename}`);
            require('../game/roomSetup/tiles/' + filename);
        }

        if (log) console.log("Successfully imported tile definitions.\n");
    };

module.exports = {
    loadRooms,
    creationDate: new Date(),
    creationTime: new Date().getTime()
};
