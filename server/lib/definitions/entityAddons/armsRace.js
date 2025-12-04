const { combineStats, weaponArray, weaponMirror } = require('../facilitators.js')
const { base } = require('../constants.js')
const g = require('../gunvals.js')

const use_arras_AR_tree = false 

Class.wark_AR = {
    PARENT: "genericTank",
    LABEL: "Wark",
    DANGER: 6,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ASPECT: 1,
                X: 0,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {}
        }
    ])
}

// Class.basic.UPGRADES_TIER_1
    // Class.basic.UPGRADES_TIER_2
        // Class.basic.UPGRADES_TIER_3

    Class.twin.UPGRADES_TIER_2.push("wark_AR")
        Class.twin.UPGRADES_TIER_3.splice(1, 1)
        Class.wark_AR.UPGRADES_TIER_3 = ["bulwark"]

if (use_arras_AR_tree) {
Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper"]
    Class.basic.UPGRADES_TIER_2 = ["smasher"]
        Class.basic.UPGRADES_TIER_3 = ["single"]
        Class.smasher.UPGRADES_TIER_3 = ["megaSmasher", "spike", "autoSmasher", "landmine"]

    Class.twin.UPGRADES_TIER_2 = ["doubleTwin", "tripleShot", "gunner", "hexaTank"]
        Class.twin.UPGRADES_TIER_3 = ["dual", "bulwark", "musket"]
        Class.doubleTwin.UPGRADES_TIER_3 = ["tripleTwin", "hewnDouble", "autoDouble", "bentDouble"]
        Class.tripleShot.UPGRADES_TIER_3 = ["pentaShot", "spreadshot", "bentHybrid", "bentDouble", "triplet", "triplex"]
        Class.gunner.UPGRADES_TIER_3 = ["autoGunner", "nailgun", "auto4", "machineGunner", "gunnerTrapper", "cyclone", "overgunner"]

    Class.sniper.UPGRADES_TIER_2 = ["assassin", "hunter", "minigun", "rifle"]
        Class.sniper.UPGRADES_TIER_3 = ["bushwhacker"]
        Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin"]
        Class.hunter.UPGRADES_TIER_3 = ["predator", "xHunter", "poacher", "ordnance", "dual"]
        Class.rifle.UPGRADES_TIER_3 = ["musket", "crossbow", "armsman"]

    Class.machineGun.UPGRADES_TIER_2 = ["artillery", "minigun", "gunner"]
        Class.machineGun.UPGRADES_TIER_3 = ["sprayer"]
            Class.sprayer.UPGRADES_TIER_3 = []
        Class.minigun.UPGRADES_TIER_3 = ["streamliner", "nailgun", "cropDuster", "barricade", "vulture"]

    Class.flankGuard.UPGRADES_TIER_2 = ["hexaTank", "triAngle", "auto3", "trapGuard", "triTrapper"]
        Class.flankGuard.UPGRADES_TIER_3 = ["tripleTwin"]
        Class.hexaTank.UPGRADES_TIER_3 = ["octoTank", "cyclone", "hexaTrapper"]
        Class.triAngle.UPGRADES_TIER_3 = ["fighter", "booster", "falcon", "bomber", "autoTriAngle", "surfer", "eagle"]
        Class.auto3.UPGRADES_TIER_3 = ["auto5", "mega3", "auto4", "banshee"]

    Class.director.UPGRADES_TIER_2 = ["overseer", "cruiser", "underseer", "spawner"]
        Class.director.UPGRADES_TIER_3 = ["manager", "bigCheese"]
        Class.overseer.UPGRADES_TIER_3 = ["overlord", "overtrapper", "overgunner", "banshee", "autoOverseer", "overdrive", "commander"]
        Class.cruiser.UPGRADES_TIER_3 = ["carrier", "battleship", "fortress", "autoCruiser", "commander"]
        Class.underseer.UPGRADES_TIER_3 = ["necromancer", "maleficitor"]
        Class.spawner.UPGRADES_TIER_3 = ["factory", "autoSpawner"]

    Class.pounder.UPGRADES_TIER_2 = ["destroyer", "builder", "artillery", "launcher"]
        Class.pounder.UPGRADES_TIER_3 = ["shotgun", "eagle"]
        Class.destroyer.UPGRADES_TIER_3 = ["conqueror", "annihilator", "hybrid", "construct"]
        Class.artillery.UPGRADES_TIER_3 = ["mortar", "ordnance", "beekeeper", "fieldGun"]
        Class.launcher.UPGRADES_TIER_3 = ["skimmer", "twister", "swarmer", "sidewinder", "fieldGun"]

    Class.trapper.UPGRADES_TIER_2 = ["builder", "triTrapper", "trapGuard"]
        Class.trapper.UPGRADES_TIER_3 = ["barricade", "overtrapper"]
        Class.builder.UPGRADES_TIER_3 = ["construct", "autoBuilder", "engineer", "boomer", "assembler", "architect", "conqueror"]
        Class.triTrapper.UPGRADES_TIER_3 = ["fortress", "hexaTrapper", "septaTrapper", "architect"]
        Class.trapGuard.UPGRADES_TIER_3 = ["bushwhacker", "gunnerTrapper", "bomber", "conqueror", "bulwark"]
}
