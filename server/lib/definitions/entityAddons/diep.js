const { combineStats, dereference, makeAuto, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames } = require('../constants.js')
const g = require('../gunvals.js')

Class.arrasMenu_diep.UPGRADES_TIER_0.push("tank_diep", "guardian_diep", "defender_diep")
Class.diep = { PARENT: "genericTank", REROOT_UPGRADE_TREE: "tank_diep" }
Class.diepSmasher = { PARENT: "genericSmasher", REROOT_UPGRADE_TREE: "tank_diep" }

// Functions
const makeRadialAuto = (type, options = {}) => {

    /*
    - type: what turret (or regular Class) to use as the radial auto

    Available options:
    - count: number of turrets
    - isTurret: whether or not the `type` is a turret already (if this option is `false`, the `type` is assumed to
        not be a turret and the faciliator will create a new turret modeled after the `type`)
    - extraStats: extra stats to append to all turret barrels, on top of g.autoTurret
    - turretIdentifier: Class[turretIdentifier] to refer to the turret in other uses if necessary
    - size: turret size
    - x: turret X
    - arc: turret FOV arc
    - angle: turret ring offset angle
    - label: label of the final tank
    - rotation: rotation speed of the final tank
    - danger: danger value of the final tank
    - body: body stats of the final tank
    */

    let count = options.count ?? 3;
    let isTurret = options.isTurret ?? false;
    let turretIdentifier = type;
    let noRecoil = options.noRecoil ?? false;

    if (!isTurret) {
        type = dereference(type);

        let extraStats = options.extraStats ?? [];
        if (!Array.isArray(extraStats)) {
            extraStats = [extraStats];
        }
        turretIdentifier = options.turretIdentifier ?? `auto${type.LABEL}Gun`;

        Class[turretIdentifier] = {
            PARENT: 'diep',
            LABEL: "",
            BODY: {
                FOV: 2,
            },
            CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"],
            COLOR: "grey",
            GUNS: type.GUNS,
            TURRETS: type.TURRETS,
            PROPS: type.PROPS,
        }

        for (let gun of Class[turretIdentifier].GUNS) {
            if (!gun.PROPERTIES) continue;
            if (!gun.PROPERTIES.SHOOT_SETTINGS) continue;

            gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.autoTurret, ...extraStats])
        }
    }

    let LABEL = options.label ?? (type.LABEL + "-" + count);
    let HAS_NO_RECOIL = options.noRecoil ?? false;
    let turretSize = options.size ?? 10;
    let turretX = options.x ?? 8;
    let turretArc = options.arc ?? 190;
    let turretAngle = options.angle ?? 0;

    return {
        PARENT: 'diep',
        LABEL,
        HAS_NO_RECOIL,
        FACING_TYPE: ["spin", {speed: options.rotation ?? 0.02}],
        DANGER: options.danger ?? (type.DANGER + 2),
        BODY: options.body ?? undefined,
        TURRETS: weaponArray({
            POSITION: [turretSize, turretX, 0, turretAngle, turretArc, 0],
            TYPE: turretIdentifier
        }, count)
    }
}

// Basic Tank
Class.tank_diep = {
    PARENT: "diep",
    LABEL: "Tank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet"
            }
        }
    ]
}

// Tier 1
Class.flankGuard_diep = {
    PARENT: "diep",
    LABEL: "Flank Guard",
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.machineGun_diep = {
    PARENT: "diep",
    LABEL: "Machine Gun",
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ASPECT: 1.77
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sniper_diep = {
    PARENT: "diep",
    LABEL: "Sniper",
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.twin_diep = {
    PARENT: "diep",
    LABEL: "Twin",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8,
            Y: 5.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
            TYPE: "bullet"
        }
    })
}

// Tier 2
Class.assassin_diep = {
    PARENT: "diep",
    LABEL: "Assassin",
    DANGER: 6,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.4 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25.5,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.auto3_diep = makeRadialAuto("autoTankGun", {isTurret: true, danger: 6, label: "Auto 3"})
Class.gunner_diep = {
    PARENT: "diep",
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 12.75,
                WIDTH: 4.25,
                Y: 6.75,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 4.25,
                Y: 3.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], 0.25)
}
Class.hunter_diep = {
    PARENT: "diep",
    LABEL: "Hunter",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.quadTank_diep = {
    PARENT: "diep",
    LABEL: "Quad Tank",
    DANGER: 6,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 4)
}
Class.smasher_diep = {
    PARENT: "diepSmasher",
    LABEL: "Smasher",
    DANGER: 6,
    TURRETS: [
        {
            POSITION: {
                SIZE: 21.5,
                ARC: 360
            },
            TYPE: "smasherBody"
        }
    ]
}
Class.trapper_diep = {
    PARENT: "genericTank",
    LABEL: "Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8.25
            }
        },
        {
            POSITION: {
                LENGTH: 3.3,
                WIDTH: 8.25,
                ASPECT: 1.6,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.triAngle_diep = {
    PARENT: "diep",
    LABEL: "Tri-Angle",
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    },
    DANGER: 6,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }, 0)
    ]
}
Class.tripleShot_diep = {
    PARENT: "diep",
    LABEL: "Triple Shot",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ANGLE: 45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.twinFlank_diep = {
    PARENT: "diep",
    LABEL: "Twin Flank",
    DANGER: 6,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8,
            Y: 5.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
            TYPE: "bullet"
        }
    }), 2)
}

// Tier 3
Class.auto5_diep = makeRadialAuto("autoTankGun", {isTurret: true, danger: 7, label: "Auto 5", count: 5})
Class.autoGunner_diep = makeAuto("gunner_diep", "Auto Gunner")
Class.autoTank_diep = makeAuto("tank_diep", "Auto Tank")
Class.booster_diep = {
    PARENT: "diep",
    LABEL: "Booster",
    DANGER: 7,
    BODY: {
        HEALTH: base.HEALTH * 0.4,
        SHIELD: base.SHIELD * 0.4,
        DENSITY: base.DENSITY * 0.3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front"
            }
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 14,
                WIDTH: 8,
                ANGLE: 135,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                ANGLE: 150,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }], 0)
    ]
}
Class.gunnerTrapper_diep = {
    PARENT: "diep",
    LABEL: "Gunner Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: 1.25 * base.FOV
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 14.75,
                WIDTH: 3.1,
                Y: -3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: {
                LENGTH: 12.75,
                WIDTH: 10.5,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4.25,
                WIDTH: 10.5,
                ASPECT: 1.6,
                X: 12.75,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, { recoil: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.octoTank_diep = {
    PARENT: "diep",
    LABEL: "Octo Tank",
    DANGER: 7,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        }
    ], 4)
}
Class.predator_diep = {
    PARENT: "diep",
    LABEL: "Predator",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Use your right mouse button to look further in the direction you're facing",
    GUNS: [
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 11,
                DELAY: 0.15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 14,
                DELAY: 0.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.ranger_diep = {
    PARENT: "diep",
    LABEL: "Ranger",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25.5,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: -2.2
            }
        }
    ]
}
Class.stalker_diep = {
    PARENT: "diep",
    LABEL: "Stalker",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.35 * base.FOV
    },
    INVISIBLE: [0.08, 0.03],
    GUNS: [
        {
            POSITION: {
                LENGTH: 25.5,
                WIDTH: 8,
                ASPECT: -1.77
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.streamliner_diep = {
    PARENT: "diep",
    LABEL: "Streamliner",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 8,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8,
                DELAY: 0.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                DELAY: 0.8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.tripleTwin_diep = {
    PARENT: "diep",
    LABEL: "Triple Twin",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 19,
            WIDTH: 8,
            Y: 5.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.doubleTwin]),
            TYPE: "bullet"
        }
    }), 3)
}
Class.triplet_diep = {
    PARENT: "diep",
    LABEL: "Triplet",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet"
            }
        }, 0),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet]),
                TYPE: "bullet"
            }
        }
    ]
}

// Bosses
Class.guardian_diep = {
    PARENT: "elite",
    LABEL: "Guardian of the Pentagons",
    UPGRADE_LABEL: "Guardian",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [4, 12, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 0.5, reload: 0.25 }]),
                TYPE: "swarm",
                AUTOFIRE: true,
            },
        },
    ],
    AI: { NO_LEAD: false },
}
Class.defenderTurret_diep = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
                TYPE: ["bullet", {COLOR: "yellow"}],
            },
        },
    ],
}
Class.defender_diep = {
    PARENT: "elite",
    LABEL: "Defender",
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, -3, 0, 60, 0],
        }, {
            POSITION: [3, 7, 1.7, 12, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, {reload: 1.33, damage: 2.5}]),
                TYPE: ["trap", {COLOR: "yellow"}],
                STAT_CALCULATOR: "trap",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 190, 1],
        TYPE: "defenderTurret_diep",
    }, 3),
    AI: { NO_LEAD: false },
}

// Class Tree
Class.tank_diep.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard"].map(x => x + "_diep")
    Class.tank_diep.UPGRADES_TIER_2 = ["smasher"].map(x => x + "_diep")
        Class.tank_diep.UPGRADES_TIER_3 = ["autoTank"].map(x => x + "_diep")

    Class.twin_diep.UPGRADES_TIER_2 = ["tripleShot", "quadTank", "twinFlank"].map(x => x + "_diep")
        Class.tripleShot_diep.UPGRADES_TIER_3 = ["triplet"].map(x => x + "_diep")
        Class.twinFlank_diep.UPGRADES_TIER_3 = ["tripleTwin"].map(x => x + "_diep")

    Class.sniper_diep.UPGRADES_TIER_2 = ["assassin", "hunter", "trapper"].map(x => x + "_diep")
        Class.assassin_diep.UPGRADES_TIER_3 = ["ranger", "stalker"].map(x => x + "_diep")
        Class.hunter_diep.UPGRADES_TIER_3 = ["predator", "streamliner"].map(x => x + "_diep")
        //Class.overseer_diep.UPGRADES_TIER_3 = [].map(x => x + "_diep")
        Class.trapper_diep.UPGRADES_TIER_3 = ["gunnerTrapper"].map(x => x + "_diep")

    Class.machineGun_diep.UPGRADES_TIER_2 = ["gunner"].map(x => x + "_diep")
        Class.gunner_diep.UPGRADES_TIER_3 = ["autoGunner", "gunnerTrapper", "streamliner"].map(x => x + "_diep")

    Class.flankGuard_diep.UPGRADES_TIER_2 = ["triAngle", "quadTank", "twinFlank", "auto3"].map(x => x + "_diep")
        Class.triAngle_diep.UPGRADES_TIER_3 = ["booster"].map(x => x + "_diep")
        Class.quadTank_diep.UPGRADES_TIER_3 = ["octoTank", "auto5"].map(x => x + "_diep")
        Class.triAngle_diep.UPGRADES_TIER_3 = [].map(x => x + "_diep")
        Class.auto3_diep.UPGRADES_TIER_3 = ["auto5", "autoGunner"].map(x => x + "_diep")
