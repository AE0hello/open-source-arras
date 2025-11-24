const { combineStats, skillSet, addAura, makeDeco, makeAuto, makeHybrid, makeOver, makeMulti } = require('../facilitators.js');
const { base, gunCalcNames, basePolygonDamage, basePolygonHealth, dfltskl, smshskl, statnames } = require('../constants.js');
const g = require('../gunvals.js');

// Generators

const shapeGeneratorUpgrades = [
	["eggGenerator", "gemGen", "gravelGen", "stoneGen", "rockGen", "wallGen"],
	["squareGen", "shinySquareGen", "legSquareGen", "shadowSquareGen", "rainbowSquareGen", "transSquareGen"],
	["triangleGen", "shinyTriangleGen", "legTriangleGen", "shadowTriangleGen", "rainbowTriangleGen", "transTriangleGen"],
	["pentagonGen", "shinyPentagonGen", "legPentagonGen", "shadowPentagonGen", "rainbowPentagonGen", "transPentagonGen"],
	["betaPentagonGen", "shinyBetaPentagonGen", "legBetaPentagonGen", "shadowBetaPentagonGen", "rainbowBetaPentagonGen", "transBetaPentagonGen"],
	["alphaPentagonGen", "shinyAlphaPentagonGen", "legAlphaPentagonGen", "shadowAlphaPentagonGen", "rainbowAlphaPentagonGen", "transAlphaPentagonGen"],
];
const hostileShapeGeneratorUpgrades = [
	["crasherGen", "sentrySwarmGen", "sentryGunGen", "sentryTrapGen"],
	["shinyCrasherGen", "shinySentrySwarmGen", "shinySentryGunGen", "shinySentryTrapGen"],
];

const sentinelsShapeGeneratorUpgrades = [
	["sentinelLauncherGen", "sentinelCrossbowGen", "sentinelMinigunGen"]
]

const eliteBossGeneratorUpgrades = [
	["eliteDestroyerGen", "eliteGunnerGen", "eliteSprayerGen", "eliteBattleshipGen", "eliteSpawnerGen"],
	["eliteTrapGuardGen", "eliteSpinnerGen", "oldEliteSprayerGen", "eliteSkimmerGen", "legionaryCrasherGen"],
];

const mysticalBossGeneratorUpgrades = [
	["sorcererGen", "summonerGen", "enchantressGen", "exorcistorGen", "shamanGen"],
];

const nesterBossGeneratorUpgrades = [
	["nestKeeperGen", "nestWardenGen", "nestGuardianGen"],
];

const rogueBossGeneratorUpgrades = [
	["roguePalisadeGen", "rogueArmadaGen"],
];

Class.genBody = {
	PARENT: "spectator",
	BODY: {
		SPEED: 25,
		FOV: 1,
	},
	SKILL_CAP: [15, 0, 0, 0, 0, 0, 0, 0, 0, 15],
	LAYER: 1e99,
	ON: [],
	RESET_EVENTS: true,
};

const makeGenerator = (entity, entityLabel, displayEntity, displayEntitySize, shape, color, entitySize, maxChildren = 100, launchSpeed = 1) => {
	const config = {
		PARENT: "genBody",
		LABEL: `${entityLabel} Generator`,
		SHAPE: shape,
		COLOR: color,
		MAX_CHILDREN: maxChildren,
		UPGRADES_TIER_0: [],

		TURRETS: [{
			POSITION: [displayEntitySize, 0, 0, 0, 0, 1],
			TYPE: [displayEntity, { INDEPENDENT: true }]
		}],

		GUNS: [
			{
				POSITION: [2, 10.5, 1, 15, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([{
						shudder: 0.1,
						speed: launchSpeed,
						recoil: 0.1,
						reload: 6,
						size: entitySize / 13
					}]),
					NO_LIMITATIONS: true,
					SPAWN_OFFSET: 0,
					TYPE: [entity, { INDEPENDENT: true }]
				}
			},
			{
				POSITION: [11, 10.5, 1.4, 4, 0, 0, 0]
			}
		]
	};

	return config;
};

Class.genCrasher = {
	TYPE: [],
	PARENT: ["crasher"],
};
Class.genShinyCrasher = {
	PARENT: ["genCrasher"],
	COLOR: "lightGreen",
	VALUE: 1e3,
};
Class.genSentrySwarm = {
	TYPE: [],
	PARENT: ["sentrySwarm"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genSentryGun = {
	TYPE: [],
	PARENT: ["sentryGun"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genSentryTrap = {
	TYPE: [],
	PARENT: ["sentryTrap"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genShinySentrySwarm = {
	TYPE: [],
	PARENT: ["shinySentrySwarm"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genShinySentryGun = {
	TYPE: [],
	PARENT: ["shinySentryGun"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genShinySentryTrap = {
	TYPE: [],
	PARENT: ["shinySentryTrap"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genSentinelLauncher = {
	TYPE: [],
	PARENT: ["sentinelLauncher"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genSentinelCrossbow = {
	TYPE: [],
	PARENT: ["sentinelCrossbow"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};
Class.genSentinelMinigun = {
	TYPE: [],
	PARENT: ["sentinelMinigun"],
	CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "hangOutNearMaster"],
};

//EGG GENERATOR
Class.eggGenerator = makeGenerator("egg", "Egg", "egg", 4.25, 0, "veryLightGrey", Class.egg.SIZE)

//SQUARE GENERATORS
Class.squareGen = makeGenerator("square", "Square", "square", 6, 4, "gold", Class.square.SIZE)
Class.shinySquareGen = makeGenerator("shinySquare", "Shiny Square", "square", 6, 4, "lightGreen", Class.square.SIZE)
Class.legSquareGen = makeGenerator("legendarySquare", "Legendary Square", "square", 6, 4, "teal", Class.square.SIZE)
Class.shadowSquareGen = makeGenerator("shadowSquare", "Shadow Square", "square", 6, 4, "pureBlack", Class.square.SIZE)
Class.rainbowSquareGen = makeGenerator("rainbowSquare", "Rainbow Legendary Square", "square", 6, 4, "rainbow", Class.square.SIZE)
Class.transSquareGen = makeGenerator("transSquare", "Trans Legendary Square", "square", 6, 4, 37, Class.square.SIZE)

//TRIANGLE GENERATORS
Class.triangleGen = makeGenerator("triangle", "Triangle", "triangle", 6, 3, "orange", Class.triangle.SIZE)
Class.shinyTriangleGen = makeGenerator("shinyTriangle", "Shiny Triangle", "triangle", 6, 3, "lightGreen", Class.triangle.SIZE)
Class.legTriangleGen = makeGenerator("legendaryTriangle", "Legendary Triangle", "triangle", 6, 3, "teal", Class.triangle.SIZE)
Class.shadowTriangleGen = makeGenerator("shadowTriangle", "Shadow Triangle", "triangle", 6, 3, "pureBlack", Class.triangle.SIZE)
Class.rainbowTriangleGen = makeGenerator("rainbowTriangle", "Rainbow Legendary Triangle", "triangle", 6, 3, "rainbow", Class.triangle.SIZE)
Class.transTriangleGen = makeGenerator("transTriangle", "Trans Legendary Triangle", "triangle", 6, 3, 37, Class.triangle.SIZE)

//PENTAGON GENERATORS
Class.pentagonGen = makeGenerator("pentagon", "Pentagon", "pentagon", 8, 5, "purple", Class.pentagon.SIZE)
Class.shinyPentagonGen = makeGenerator("shinyPentagon", "Shiny Pentagon", "pentagon", 8, 5, "lightGreen", Class.pentagon.SIZE)
Class.legPentagonGen = makeGenerator("legendaryPentagon", "Legendary Pentagon", "pentagon", 8, 5, "teal", Class.pentagon.SIZE)
Class.shadowPentagonGen = makeGenerator("shadowPentagon", "Shadow Pentagon", "pentagon", 8, 5, "pureBlack", Class.pentagon.SIZE)
Class.rainbowPentagonGen = makeGenerator("rainbowPentagon", "Rainbow Legendary Pentagon", "pentagon", 8, 5, "rainbow", Class.pentagon.SIZE)
Class.transPentagonGen = makeGenerator("transPentagon", "Trans Legendary Pentagon", "pentagon", 8, 5, 37, Class.pentagon.SIZE)
//beta
Class.betaPentagonGen = makeGenerator("betaPentagon", "Beta Pentagon", "pentagon", 12, 5, "purple", Class.betaPentagon.SIZE + 15)
Class.shinyBetaPentagonGen = makeGenerator("shinyBetaPentagon", "Shiny Beta Pentagon", "pentagon", 12, 5, "lightGreen", Class.betaPentagon.SIZE + 15)
Class.legBetaPentagonGen = makeGenerator("legendaryBetaPentagon", "Legendary Beta Pentagon", "pentagon", 12, 5, "teal", Class.betaPentagon.SIZE + 15)
Class.shadowBetaPentagonGen = makeGenerator("shadowBetaPentagon", "Shadow Beta Pentagon", "pentagon", 12, 5, "pureBlack", Class.betaPentagon.SIZE + 15)
Class.rainbowBetaPentagonGen = makeGenerator("rainbowBetaPentagon", "Rainbow Legendary Beta Pentagon", "pentagon", 12, 5, "rainbow", Class.betaPentagon.SIZE + 15)
Class.transBetaPentagonGen = makeGenerator("transBetaPentagon", "Trans Legendary Beta Pentagon", "pentagon", 12, 5, 37, Class.betaPentagon.SIZE + 15)
//alpha
Class.alphaPentagonGen = makeGenerator("alphaPentagon", "Alpha Pentagon", "pentagon", 15, 5, "purple", Class.alphaPentagon.SIZE + 25)
Class.shinyAlphaPentagonGen = makeGenerator("shinyAlphaPentagon", "Shiny Alpha Pentagon", "pentagon", 15, 5, "lightGreen", Class.alphaPentagon.SIZE + 30)
Class.legAlphaPentagonGen = makeGenerator("legendaryAlphaPentagon", "Legendary Alpha Pentagon", "pentagon", 15, 5, "teal", Class.alphaPentagon.SIZE + 40)
Class.shadowAlphaPentagonGen = makeGenerator("shadowAlphaPentagon", "Shadow Alpha Pentagon", "pentagon", 15, 5, "pureBlack", Class.alphaPentagon.SIZE + 50)
Class.rainbowAlphaPentagonGen = makeGenerator("rainbowAlphaPentagon", "Rainbow Legendary Alpha Pentagon", "pentagon", 15, 5, "rainbow", Class.alphaPentagon.SIZE + 70)
Class.transAlphaPentagonGen = makeGenerator("transAlphaPentagon", "Trans Legendary Alpha Pentagon", "pentagon", 15, 5, 37, Class.alphaPentagon.SIZE + 90)

//MISC GENERATORS
Class.gemGen = makeGenerator("gem", "Gem", "gem", 4.75, 6, "teal", Class.gem.SIZE, 100, 0)
Class.wallGen = makeGenerator("wall", "Wall", "wall", 15, 4, "grey", Class.wall.SIZE, 100, 0)
Class.gravelGen = makeGenerator("gravel", "Gravel", "gravel", 7, -7, "grey", Class.gravel.SIZE, 100, 0)
Class.stoneGen = makeGenerator("stone", "Stone", "stone", 10, -7, "grey", Class.stone.SIZE, 100, 0)
Class.rockGen = makeGenerator("rock", "Rock", "rock", 15, -9, "grey", Class.rock.SIZE, 100, 0)


//HOSTILE POLYGONS GENERATORS
//crasher
Class.crasherGen = makeGenerator("crasher", "Crasher", "crasher", 4.75, 3, "pink", Class.crasher.SIZE)
Class.shinyCrasherGen = makeGenerator("genShinyCrasher", "Shiny Crasher", "genShinyCrasher", 4.75, 3, "lightGreen", Class.crasher.SIZE)
//sentries
Class.sentrySwarmGen = makeGenerator("genSentrySwarm", "Sentry", "sentrySwarm", 5.75, 3, "pink", Class.sentry.SIZE, 20)
Class.sentryGunGen = makeGenerator("genSentryGun", "Sentry", "sentryGun", 5.75, 3, "pink", Class.sentry.SIZE, 20)
Class.sentryTrapGen = makeGenerator("genSentryTrap", "Sentry", "sentryTrap", 5.75, 3, "pink", Class.sentry.SIZE, 20)
//shiny sentries
Class.shinySentrySwarmGen = makeGenerator("genShinySentrySwarm", "Sentry", "shinySentrySwarm", 5.75, 3, "lightGreen", Class.sentry.SIZE, 20)
Class.shinySentryGunGen = makeGenerator("genShinySentryGun", "Sentry", "shinySentryGun", 5.75, 3, "lightGreen", Class.sentry.SIZE, 20)
Class.shinySentryTrapGen = makeGenerator("genShinySentryTrap", "Sentry", "shinySentryTrap", 5.75, 3, "lightGreen", Class.sentry.SIZE, 20)
//sentinels
Class.sentinelLauncherGen = makeGenerator("genSentinelLauncher", "Sentinel", "sentinelLauncher", 11.75, 5, "purple", Class.sentinel.SIZE, 10)
Class.sentinelCrossbowGen = makeGenerator("genSentinelCrossbow", "Sentinel", "sentinelCrossbow", 11.75, 5, "purple", Class.sentinel.SIZE, 10)
Class.sentinelMinigunGen = makeGenerator("genSentinelMinigun", "Sentinel", "sentinelMinigun", 11.75, 5, "purple", Class.sentinel.SIZE, 10)

// BOSSES GENERATORS
//mysticals
Class.sorcererGen = makeGenerator("sorcerer", "Sorcerer", "sorcerer", 10, 0, "veryLightGrey", Class.sorcerer.SIZE, 5)
Class.summonerGen = makeGenerator("summoner", "Summoner", "summoner", 10, 4, "gold", Class.summoner.SIZE, 5)
Class.enchantressGen = makeGenerator("enchantress", "Enchantress", "enchantress", 10, 3.5, "orange", Class.enchantress.SIZE, 5)
Class.exorcistorGen = makeGenerator("exorcistor", "Exorcistor", "exorcistor", 10, 5.5, "purple", Class.exorcistor.SIZE, 5)
Class.shamanGen = makeGenerator("shaman", "Shaman", "shaman", 10, 6.5, "hexagon", Class.shaman.SIZE, 5)
//elites
Class.eliteDestroyerGen = makeGenerator("eliteDestroyer", "Elite Crasher", "eliteDestroyer", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteGunnerGen = makeGenerator("eliteGunner", "Elite Crasher", "eliteGunner", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteSprayerGen = makeGenerator("eliteSprayer", "Elite Crasher", "eliteSprayer", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteBattleshipGen = makeGenerator("eliteBattleship", "Elite Crasher", "eliteBattleship", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteSpawnerGen = makeGenerator("eliteSpawner", "Elite Crasher", "eliteSpawner", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteTrapGuardGen = makeGenerator("eliteTrapGuard", "Elite Crasher", "eliteTrapGuard", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteSpinnerGen = makeGenerator("eliteSpinner", "Elite Crasher", "eliteSpinner", 10, 3, "pink", Class.elite.SIZE, 5)
Class.oldEliteSprayerGen = makeGenerator("oldEliteSprayer", "Elite Crasher", "oldEliteSprayer", 10, 3, "pink", Class.elite.SIZE, 5)
Class.eliteSkimmerGen = makeGenerator("eliteSkimmer", "Elite Skimmer", "eliteSkimmer", 10, 3, "orange", Class.elite.SIZE, 5)
Class.legionaryCrasherGen = makeGenerator("legionaryCrasher", "Legionary Crasher", "legionaryCrasher", 12, 3, "pink", Class.elite.SIZE, 1)
//nesters
Class.nestKeeperGen = makeGenerator("nestKeeper", "Nest Keeper", "nestKeeper", 10, 5, "purple", Class.nestKeeper.SIZE, 5)
Class.nestWardenGen = makeGenerator("nestWarden", "Nest Warden", "nestWarden", 10, 5, "purple", Class.nestWarden.SIZE, 5)
Class.nestGuardianGen = makeGenerator("nestGuardian", "Nest Guardian", "nestGuardian", 10, 5, "purple", Class.nestGuardian.SIZE, 5)
//rogues
Class.roguePalisadeGen = makeGenerator("roguePalisade", "Rogue Palisade", "roguePalisade", 10, 6, "darkGrey", Class.roguePalisade.SIZE, 5)
Class.rogueArmadaGen = makeGenerator("rogueArmada", "Rogue Armada", "rogueArmada", 10, 7, "darkGrey", Class.rogueArmada.SIZE, 5)

// GENERATOR UPGRADES
/**
 * An identifier that represents a pointer to a `Definition` inside `Class`.
 * @typedef {string} DefinitionReference
 */

/**
 * Assuming a rectangular grid of `DefinitionReference`'s to Generators without upgrades,
 * this function, also assuming the edges are connected (akin to pacman), gives each Generator
 * a "menu" of upgrades, which allows the user to directly "navigate" to a generator's
 * 4 direct neighbors.
 * This function throws an `Error` if the given 2d array is not rectangular.
 * @param {DefinitionReference[][]} matrix 
 * @param {DefinitionReference} previous 
 * @param {DefinitionReference} next 
 */
function generatorMatrix(matrix, previous, next) {
	const height = matrix.length,
		width = matrix[0].length;

	for (let y = 0; y < height; y++) {
		if (matrix[y].length !== width) {
			throw new Error(`The given grid is not rectangular!\nThe row at Y coordinate ${y} has ${matrix[y].length} items instead of the first row which has ${width}!`);
		}

		for (let x = 0; x < width; x++) {
			let top = (y + height - 1) % height,
				bottom = (y + height + 1) % height,
				left = (x + width - 1) % width,
				right = (x + width + 1) % width,

				center = matrix[y][x];
			top = matrix[top][x];
			bottom = matrix[bottom][x];
			left = matrix[y][left];
			right = matrix[y][right];

			let gen = Class[matrix[y][x]];
			if (!gen) {
				throw new Error(`The given grid has an invalid Definition Reference at indexes [${y}][${x}] named "${matrix[y][x]}"`);
			}

			gen.UPGRADES_TIER_0.push(
				"basic", top, previous,
				left, center, right,
				"spectator", bottom, next
			);
		}
	}
}

// SHAPE UPGRADES
generatorMatrix(shapeGeneratorUpgrades, "roguePalisadeGen", "crasherGen");

// HOSTILE UPGRADES
generatorMatrix(hostileShapeGeneratorUpgrades, "eggGenerator", "sentinelLauncherGen");

// SENTINELS UPGRADES
generatorMatrix(sentinelsShapeGeneratorUpgrades, "crasherGen", "eliteDestroyerGen");

// ELITE UPGRADES
generatorMatrix(eliteBossGeneratorUpgrades, "sentinelLauncherGen", "sorcererGen");

// MYSTICAL UPGRADES
generatorMatrix(mysticalBossGeneratorUpgrades, "eliteDestroyerGen", "nestKeeperGen");

// NESTER UPGRADES
generatorMatrix(nesterBossGeneratorUpgrades, "sorcererGen", "roguePalisadeGen");

// ROGUE UPGRADES
generatorMatrix(rogueBossGeneratorUpgrades, "nestKeeperGen", "eggGenerator");
