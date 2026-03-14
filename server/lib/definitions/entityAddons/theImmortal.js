const { combineStats, weaponArray } = require("../facilitators.js");
const { base, smshskl } = require("../constants.js");
const g = require("../gunvals.js");

// The Immortal - Combines all dread v2 variants into one
Class.theImmortal = {
  PARENT: "genericTank",
  LABEL: "The Immortal",
  BODY: {
    SPEED: base.SPEED * 0.5,
    HEALTH: base.HEALTH * 8,
    SHIELD: base.SHIELD * 5,
    REGEN: base.REGEN * 2.5,
    FOV: base.FOV * 1.2,
    RESIST: base.RESIST * 1.5,
    DENSITY: base.DENSITY * 5,
    ACCELERATION: base.ACCEL * 0.3
  },
  RECOIL_MULTIPLIER: 0,
  SKILL_CAP: Array(10).fill(smshskl),
  DANGER: 15,
  SIZE: 28,
  COLOR: "hexagon",
  VALUE: 217342,
  EXTRA_SKILL: 18,
  GUNS: [
    // Rapier weapons
    ...weaponArray([
      {
        POSITION: [20, 1, 1, 0, 0, 0, 0]
      }, {
        POSITION: [22, 1, 1, 0, 3, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, { speed: 1.15, maxSpeed: 1.15, health: 1.2, range: 0.7 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [22, 1, 1, 0, -3, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, { speed: 1.15, maxSpeed: 1.15, health: 1.2, range: 0.7 }]),
          TYPE: "bullet"
        }
      }
    ], 6),
    
    // Javelin weapons
    ...weaponArray([
      {
        POSITION: [32, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.assassin, { reload: 1.15, health: 1.15, density: 0.6, range: 0.7 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [5, 7, -1.6, 7, 0, 0, 0]
      }
    ], 6),
    
    // Diplomat weapons
    ...weaponArray([
      {
        POSITION: [15, 7, 1, 0, 3.25, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, { health: 1.15 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [15, 7, 1, 0, -3.25, 0, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, { health: 1.15 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [17, 7, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, { health: 1.15 }]),
          TYPE: "bullet"
        }
      }
    ], 6),
    
    // Arbitrator weapons
    ...weaponArray([
      {
        POSITION: [18, 10.75, 1.33, 5.5, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.triplet, g.spam, g.spam, { size: 0.7, health: 1.05, range: 0.8, reload: 1 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [18, 9.5, 1.33, 7.5, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.triplet, g.spam, g.spam, { size: 0.65, health: 1.05, range: 0.8, reload: 1.05 }]),
          TYPE: "bullet"
        }
      }, {
        POSITION: [18, 7.25, 1.25, 9.5, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.twin, g.triplet, g.spam, g.spam, { size: 0.7, health: 1.05, range: 0.8, reload: 1.1 }]),
          TYPE: "bullet"
        }
      }
    ], 6),
    
    // Retardant weapons
    ...weaponArray([
      {
        POSITION: [20, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, { reload: 1.1, health: 1.26 }]),
          TYPE: "bullet"
        }
      }
    ], 6),
    
    // Tyrant weapons
    ...weaponArray([
      {
        POSITION: [12, 11, -0.75, 7, 0, 0, 0]
      }, {
        POSITION: [17, 12, 1, 0, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 1.2, health: 1.5, speed: 0.7, maxSpeed: 0.7, range: 0.4 }]),
          TYPE: "supermissile",
          STAT_CALCULATOR: "sustained"
        }
      }
    ], 6),
    
    // Gladiator weapons
    ...weaponArray([
      {
        POSITION: [5, 12, 1, 10, 0, 0, 0]
      }, {
        POSITION: [1.5, 13, 1, 15, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.factory, { size: 0.9, reload: 2.2, health: 1.3, damage: 0.6, pen: 0.9, speed: 0.8, maxSpeed: 0.8, density: 1.7 }]),
          TYPE: "minion",
          STAT_CALCULATOR: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          MAX_CHILDREN: 3,
          WAIT_TO_CYCLE: true
        }
      }, {
        POSITION: [12, 13, 1, 0, 0, 0, 0]
      }
    ], 6),
    
    // Cerberus weapons
    ...weaponArray([
      {
        POSITION: [12, 4, 1, 0, 2.5, 10, 0.5]
      }, {
        POSITION: [1.5, 4, 1.6, 12, 2.5, 10, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.pounder, { shudder: 0.6, health: 0.6, reload: 1.3, range: 0.67 }]),
          TYPE: "trap",
          STAT_CALCULATOR: "trap"
        }
      }, {
        POSITION: [12, 4, 1, 0, -2.5, -10, 0.5]
      }, {
        POSITION: [1.5, 4, 1.6, 12, -2.5, -10, 0.5],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.pounder, { shudder: 0.6, health: 0.6, reload: 1.3, range: 0.67 }]),
          TYPE: "trap",
          STAT_CALCULATOR: "trap"
        }
      }, {
        POSITION: [14, 5.5, 1, 0, 0, 0, 0]
      }, {
        POSITION: [2, 5.5, 1.7, 14, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.twin, g.pounder, { reload: 1.2, health: 0.9, speed: 0.75, maxSpeed: 0.75, range: 0.5 }]),
          TYPE: "unsetTrap",
          STAT_CALCULATOR: "block"
        }
      }
    ], 6),
    
    // Lucifer weapons
    ...weaponArray([
      {
        POSITION: [13, 10, 1, 0, 0, 0, 0]
      }, {
        POSITION: [3.5, 10, 1.6, 13, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, { reload: 1.3, speed: 1.2, maxSpeed: 1.2, size: 1.3, health: 1.2, range: 0.37 }]),
          TYPE: "unsetTrap",
          STAT_CALCULATOR: "block"
        }
      }
    ], 6)
  ],
  TURRETS: [
    // Auto turrets from Skynet
    ...weaponArray({
      POSITION: [3.5, 4.5, 0, 0, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.2, health: 0.9, damage: 0.7 } }]
    }, 6),
    ...weaponArray({
      POSITION: [3.5, 8, 0, 30, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.2, health: 0.9, damage: 0.7 } }]
    }, 6),
    
    // Aura turrets from Photosphere
    {
      POSITION: [10, 0, 0, 0, 360, 2],
      TYPE: ["pentanoughtBigAura", { DISTANCE: 400 }]
    },
    ...weaponArray({
      POSITION: [4, 8.5, 0, 30, 360, 2],
      TYPE: ["pentanoughtSmallAura", { DISTANCE: 350 }]
    }, 6),
    
    // Gigabyte turret
    {
      POSITION: [14, 0, 0, 0, 360, 2],
      TYPE: "gigabyteTurretOfficialV2"
    },
    
    // Hexnought variant turrets
    // Skynet Hex
    ...weaponArray({
      POSITION: [4, 10, 0, 0, 180, 2],
      TYPE: "byteTurretOfficialV2"
    }, 6),
    ...weaponArray({
      POSITION: [6, 12, 0, 30, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.1, health: 1.1 } }]
    }, 6),
    
    // Supernova Hex
    ...weaponArray({
      POSITION: [5, 11, 0, 0, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 0.9, health: 1.2 } }]
    }, 6),
    
    // Cipher Hex
    ...weaponArray({
      POSITION: [4.5, 9, 0, 15, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.15, health: 0.85 } }]
    }, 6),
    
    // Interstellar Hex
    ...weaponArray({
      POSITION: [5.5, 10.5, 0, 45, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 1.05, health: 1.05 } }]
    }, 6),
    
    // Malware Hex
    ...weaponArray({
      POSITION: [4, 11, 0, 60, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.1, health: 0.95 } }]
    }, 6),
    
    // Software Hex
    ...weaponArray({
      POSITION: [6, 9.5, 0, 75, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 0.95, health: 1.15 } }]
    }, 6),
    
    // Photosphere Hex
    ...weaponArray({
      POSITION: [4.5, 10, 0, 90, 180, 2],
      TYPE: ["pentanoughtSmallAura", { DISTANCE: 300 }]
    }, 6),
    
    // Astronomic Hex
    ...weaponArray({
      POSITION: [5, 11, 0, 105, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 1.0, health: 1.0 } }]
    }, 6),
    
    // Stratosphere Hex
    ...weaponArray({
      POSITION: [4.5, 9, 0, 120, 180, 2],
      TYPE: ["pentanoughtSmallHealAura", { DISTANCE: 280 }]
    }, 6),
    
    // Grandiose Hex
    ...weaponArray({
      POSITION: [5.5, 10, 0, 135, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 0.9, health: 1.1 } }]
    }, 6),
    
    // Behemoth Hex
    ...weaponArray({
      POSITION: [4, 12, 0, 150, 180, 2],
      TYPE: ["spamAutoTurret", { GUN_STAT_SCALE: { reload: 1.2, health: 0.8 } }]
    }, 6),
    
    // Leviathan Hex
    ...weaponArray({
      POSITION: [6, 8, 0, 165, 180, 2],
      TYPE: "hexagonLeviathanTopOfficialV2"
    }, 6),
    ...weaponArray({
      POSITION: [8, 13, 0, 165, 180, 2],
      TYPE: "hexagonLeviathanBottomOfficialV2"
    }, 6),
    
    // Valrayvn Hex
    ...weaponArray({
      POSITION: [5, 9, 0, 180, 180, 2],
      TYPE: ["autoTurret", { GUN_STAT_SCALE: { reload: 1.05, health: 1.05 } }]
    }, 6),
    
    // Pegasus Hex
    ...weaponArray({
      POSITION: [4.5, 11, 0, 195, 180, 2],
      TYPE: ["pentanoughtSmallHealAura", { DISTANCE: 260 }]
    }, 6)
  ],
  PROPS: [
    {
      POSITION: [14, 0, 0, 180, 1],
      TYPE: "hexagon"
    }, {
      POSITION: [26, 0, 0, 180, 0],
      TYPE: ["hexagon", { COLOR: 9 }]
    }, {
      POSITION: [18, 0, 0, 0, 1],
      TYPE: "hexagonLeviathanTopOfficialV2"
    }, {
      POSITION: [28, 0, 0, 0, 0],
      TYPE: "hexagonLeviathanBottomOfficialV2"
    }
  ]
};
