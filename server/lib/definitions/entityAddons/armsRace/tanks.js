const {combineStats, deleteUpgrade, dereference, makeAuto, makeAutoArray, makeBird, makeDrive, makeGuard, makeHat, makeMenu, makeOver, makeRadialAuto, makeGunner, makeTurret, makeWhirlwind, weaponArray, weaponMirror, weaponStack} = require('../../facilitators.js')
const {base, statnames} = require('../../constants.js')
const g = require('../../gunvals.js')
const preset = require('../../presets.js')

// Settings
const integrate_healers = false
const use_original_tree = false // Set to true to enable the original arras.io Arms Race tree and level cap, with some minor bugfixes.
const todo_placeholder_guns = {
    UPGRADE_COLOR: "pureBlack",
    UPGRADE_TOOLTIP: "The guns of this tank have not had their SHOOT_SETTINGS defined yet and will not shoot."
}

// Functions
const makeBattle = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 125)
    let count = options.count ?? 2
    let independent = options.independent ?? false
    let stats = options.extraStats ?? []

    options.renderBehind ??= false

    let spawners = [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.swarm, ...stats]),
        TYPE: independent ? "autoswarm" : "swarm",
        STAT_CALCULATOR: "swarm",
    }
    if (count % 2 == 1) {
        spawners.push(
            ...weaponMirror({
                POSITION: {
                    LENGTH: 9,
                    WIDTH: 8.2,
                    ASPECT: 0.6,
                    X: 5,
                    Y: 4,
                    ANGLE: 180
                },
                PROPERTIES: spawnerProperties,
            }, {delayIncrement: 0.5})
        )
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push(
            ...weaponMirror([{
                POSITION: {
                    LENGTH: 9,
                    WIDTH: 8.2,
                    ASPECT: 0.6,
                    X: 5,
                    Y: 4,
                    ANGLE: 180 - angle * i / 2
                },
                PROPERTIES: spawnerProperties,
            },
            {
                POSITION: {
                    LENGTH: 9,
                    WIDTH: 8.2,
                    ASPECT: 0.6,
                    X: 5,
                    Y: 4,
                    ANGLE: 180 + angle * i / 2
                },
                PROPERTIES: spawnerProperties,
            }], {delayIncrement: 0.5})
        )
    }
    if (options.renderBehind) {
        output.GUNS = type.GUNS == null ? spawners : spawners.concat(type.GUNS)
    } else {
        output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners)
    }
    output.LABEL = name == -1 ? "Battle" + type.LABEL.toLowerCase() : name
    if (type.UPGRADE_LABEL !== undefined) {
        output.UPGRADE_LABEL = output.LABEL;
    }
    return output
}
const makeUnder = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 135)
    let count = options.count ?? 2
    let independent = options.independent ?? false
    let cycle = options.cycle ?? true
    let maxChildren = options.maxDrones ?? 4
    let stats = options.extraStats ?? []

    options.renderBehind ??= false

    let spawners = [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
        TYPE: ["sunchip", {INDEPENDENT: independent}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "necro",
        DELAY_SPAWN: false,
        WAIT_TO_CYCLE: cycle,
        MAX_CHILDREN: maxChildren
    }
    if (count % 2 == 1) {
        spawners.push({
                POSITION: {
                    LENGTH: 6,
                    WIDTH: 11,
                    ASPECT: 1.2,
                    X: 7.4,
                    ANGLE: 180
                },
                PROPERTIES: spawnerProperties
            }
        )
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push(...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 11,
                ASPECT: 1.2,
                X: 7.4,
                ANGLE: 180 - angle * i / 2
            },
            PROPERTIES: spawnerProperties
        }))
    }
    if (options.renderBehind) {
        output.GUNS = type.GUNS == null ? spawners : spawners.concat(type.GUNS)
    } else {
        output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners)
    }
    output.LABEL = name == -1 ? "Under" + type.LABEL.toLowerCase() : name
    if (type.UPGRADE_LABEL !== undefined) {
        output.UPGRADE_LABEL = output.LABEL;
    }
    output.SHAPE = options.shape ?? 4.5
    return output
}
const makeMummy = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 135)
    let count = options.count ?? 2
    let independent = options.independent ?? false
    let cycle = options.cycle ?? true
    let maxChildren = options.maxDrones ?? 2
    let stats = options.extraStats ?? []

    options.renderBehind ??= false

    let spawners = [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8, size: Math.SQRT2}]),
        TYPE: ["betaSunchip_AR", {INDEPENDENT: independent}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "necro",
        DELAY_SPAWN: false,
        WAIT_TO_CYCLE: cycle,
        MAX_CHILDREN: maxChildren
    }
    if (count % 2 == 1) {
        spawners.push({
            POSITION: {
                LENGTH: 12,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 1.4,
                ANGLE: 180
            },
            PROPERTIES: spawnerProperties
        })
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push(...weaponMirror({
            POSITION: {
                LENGTH: 12,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 1.4,
                ANGLE: 180 - angle * i / 2
            },
            PROPERTIES: spawnerProperties
        }))
    }
    let hat = [
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / Math.floor(4)),
                //ANGLE: 0,
                LAYER: 0.1
            },
            MIRROR_MASTER_ANGLE: true
        }
    ]
    if (options.renderBehind) {
        output.GUNS = type.GUNS == null ? spawners : spawners.concat(type.GUNS)
    } else {
        output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners)
    }
    output.SHAPE = 4.5
    output.PROPS =  type.PROPS == null ? hat : type.PROPS.concat(hat)
    output.LABEL = name == -1 ? "Mummy" + type.LABEL.toLowerCase() : name
    if (type.UPGRADE_LABEL !== undefined) {
        output.UPGRADE_LABEL = output.LABEL;
    }
    return output
}
const makePenta = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 144)
    let count = options.count ?? 2
    let independent = options.independent ?? false
    let cycle = options.cycle ?? true
    let maxChildren = options.maxDrones ?? 4
    let stats = options.extraStats ?? []

    options.renderBehind ??= false

    let spawners = [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8, size: 1.5}]),
        TYPE: ["pentaseerSunchip_AR", {INDEPENDENT: independent}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "necro",
        DELAY_SPAWN: false,
        WAIT_TO_CYCLE: cycle,
        MAX_CHILDREN: maxChildren
    }
    if (count % 2 == 1) {
        spawners.push({
                POSITION: {
                    LENGTH: 6,
                    WIDTH: 11,
                    ASPECT: 1.2,
                    X: 7.4,
                    ANGLE: 180
                },
                PROPERTIES: spawnerProperties
            }
        )
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push(...weaponMirror({
            POSITION: {
                LENGTH: 6,
                WIDTH: 11,
                ASPECT: 1.2,
                X: 7.4,
                ANGLE: 180 - angle * i / 2
            },
            PROPERTIES: spawnerProperties
        }))
    }
    if (options.renderBehind) {
        output.GUNS = type.GUNS == null ? spawners : spawners.concat(type.GUNS)
    } else {
        output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners)
    }
    output.LABEL = name == -1 ? "Penta" + type.LABEL.toLowerCase() : name
    output.SHAPE = 5.5
    return output
}
const makeCap = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 125)
    let count = options.count ?? 2
    let independent = options.independent ?? false
    let cycle = options.cycle ?? true
    let maxChildren = options.maxDrones ?? 3
    let stats = options.extraStats ?? []

    options.renderBehind ??= false

    let spawners = [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: ["minion", {INDEPENDENT: independent}],
        STAT_CALCULATOR: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        WAIT_TO_CYCLE: cycle,
        MAX_CHILDREN: maxChildren,
    }
    if (count % 2 == 1) {
        spawners.push(
            {
                POSITION: {
                    LENGTH: 4.5,
                    WIDTH: 10,
                    X: 10.5,
                    ANGLE: 180
                }
            },
            {
                POSITION: {
                    LENGTH: 1,
                    WIDTH: 12,
                    X: 15,
                    ANGLE: 180
                },
                PROPERTIES: spawnerProperties
            },
            {
                POSITION: {
                    LENGTH: 11.5,
                    WIDTH: 12,
                    ANGLE: 180
                }
            }
        )
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push(
            ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 4.5,
                    WIDTH: 10,
                    X: 10.5,
                    ANGLE: 180 - angle * i / 2
                }
            },
            {
                POSITION: {
                    LENGTH: 1,
                    WIDTH: 12,
                    X: 15,
                    ANGLE: 180 - angle * i / 2
                },
                PROPERTIES: spawnerProperties
            },
            {
                POSITION: {
                    LENGTH: 11.5,
                    WIDTH: 12,
                    ANGLE: 180 - angle * i / 2
                }
            }])
        )
    }
    if (options.renderBehind) {
        output.GUNS = type.GUNS == null ? spawners : spawners.concat(type.GUNS)
    } else {
        output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners)
    }
    output.LABEL = name == -1 ? "Cap" + type.LABEL.toLowerCase() : name
    if (type.UPGRADE_LABEL !== undefined) {
        output.UPGRADE_LABEL = output.LABEL;
    }
    return output
}

// Gun Presets
preset.guns.birdSuper = [
    ...weaponMirror([{
        POSITION: {
            LENGTH: 14,
            WIDTH: 9,
            ANGLE: 133,
            DELAY: 0.1
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 0.5 }]),
            TYPE: "bullet",
            LABEL: "Thruster"
        }
    },
    {
        POSITION: {
            LENGTH: 16,
            WIDTH: 9,
            ANGLE: 153,
            DELAY: 0.35
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 0.5 }]),
            TYPE: "bullet",
            LABEL: "Thruster"
        }
    }]),
    {
        POSITION: {
            LENGTH: 18,
            WIDTH: 9,
            ANGLE: 180,
            DELAY: 0.6
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: 0.5 }]),
            TYPE: "bullet",
            LABEL: "Thruster"
        }
    }
]

// Function Presets (makeAuto)
preset.makeAuto.drive = {type: "driveAutoTurret_AR", size: 9, clearTurrets: true}
preset.makeAuto.storm = {type: "stormAutoTurret_AR", size: 9, clearTurrets: true}
preset.makeAuto.blank = {type: "blankAutoTurret_AR", size: 8}

// Function Presets (makeDrive)
preset.makeDrive.storm = {suffix: "storm", type: "swarmAutoTurret_AR", hatType: "stormSquare_AR", size: 12}
preset.makeDrive.stormSwarm = {suffix: "storm", type: "swarmAutoTurret_AR", hatType: "stormTriangle_AR", hatSize: 8, hatAngle: 180}

// Credits
// - u/SkyShredder89: Default Tier 3/4 Sprayer upgrades
// - Taureon: Original Mummifier concept

// Hats
Class.healerHat_spin = makeHat(Class.healerHat.SHAPE, {color: "red", rotationSpeed: 0.16})
Class.stormSquare_AR = {
    PARENT: "squareHat",
    LABEL: "Storm Square",
    COLOR: "grey",
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 90
        }
    })
}
Class.stormTriangle_AR = {
    PARENT: "stormSquare_AR",
    SHAPE: 3,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 60
        }
    })
}
Class.downpourerSquare_AR = {
    PARENT: "stormSquare_AR",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 7,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 9,
                ASPECT: -1.2,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 9,
                X: 15.5,
                ANGLE: 90
            }
        }
    ])
}
Class.vortexSquare_AR = {
    PARENT: "stormSquare_AR",
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5
        }
    }, 4)
}

// Projectiles
Class.mechTrap_AR = makeAuto("trap", {type: "droneAutoTurret"})
Class.pentaseerSunchip_AR = {
    PARENT: "sunchip",
    NECRO: [5],
    SHAPE: 5
}
Class.betaSunchip_AR = {
    PARENT: "sunchip",
    PROPS: [
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4),
                ANGLE: 45,
                LAYER: 0.1
            }
        }
    ]
}
Class.alphaSunchip_AR = {
    PARENT: "sunchip",
    PROPS: [
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4),
                ANGLE: 45,
                LAYER: 0.1
            }
        },
        {
            TYPE: "squareHat",
            POSITION: {
                SIZE: 20 * Math.cos(Math.PI / 4) ** 2,
                LAYER: 0.1
            }
        }
    ]
}

// Turrets
Class.blankAutoTurret_AR = {PARENT: "autoTurret", SHAPE: 1}
Class.driveAutoTurret_AR = {PARENT: "autoTurret", SHAPE: 4}
Class.stormAutoTurret_AR = {
    PARENT: "driveAutoTurret_AR",
    GUNS: [
        ...Class.autoTurret.GUNS,
        ...Class.stormSquare_AR.GUNS
    ]
}

Class.healerAutoTankGun_AR = makeTurret({
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer]),
                TYPE: "healerBullet",
            }
        }
    ],
    TURRETS: [
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ],
}, {canRepel: true, limitFov: true, fov: 3})

Class.swarmAutoTurret_AR = makeTurret({
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm"
        }
    })
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.vortexAutoTurret_AR = makeTurret({
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm"
        }
    }, 4, 0.25)
}, {label: "Turret", fov: 0.8, extraStats: []})

// Tier 2
Class.diesel_AR = {
    PARENT: "genericTank",
    LABEL: "Diesel",
    DANGER: 6,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8
            }
        }
    ]
}
Class.doper_AR = {
    PARENT: "genericTank",
    LABEL: "Doper",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {speed: 2}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.honcho_AR = {
    PARENT: "genericTank",
    LABEL: "Honcho",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 2
            }
        }
    ]
}
Class.machineTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.mech_AR = {
    PARENT: "genericTank",
    LABEL: "Mech",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "mechTrap_AR",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.pen_AR = {
    PARENT: "genericTank",
    LABEL: "Pen",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
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
Class.wark_AR = {
    PARENT: "genericTank",
    LABEL: "Wark",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], {delayIncrement: 0.5})
}

// Tier 3
Class.analyzer_AR = {
    PARENT: "genericHealer",
    LABEL: "Analyzer",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 12,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}
Class.baltimore_AR = {
    PARENT: "genericTank",
    LABEL: "Baltimore",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    ...todo_placeholder_guns,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 12.,
            WIDTH: 8.7,
            ASPECT: 0.75,
            X: 3,
            Y: 4.6
        }
    }, {delayIncrement: 0.5})
}
Class.banger_AR = {
    PARENT: "genericSmasher",
    LABEL: "Banger",
    DANGER: 7,
    SIZE: Class.genericTank.SIZE * 1.3,
    TURRETS: [
        {
            TYPE: "digDigHat",
            POSITION: {SIZE: 27}
        }
    ]
}
Class.bentGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Gunner",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 3.5,
                Y: 8.25,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 3.5,
                Y: 4.75,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        }
    ], {delayIncrement: 0.5})
}
Class.bentMinigun_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Minigun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    ...todo_placeholder_guns,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                X: -2,
                Y: 2,
                ANGLE: 16
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                X: -2,
                Y: 2,
                ANGLE: 16
            }
        }], {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8
            }
        }
    ]
}
Class.brisker_AR = {
    PARENT: "genericTank",
    LABEL: "Brisker",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {speed: 3}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 0.5,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.captain_AR = {
    PARENT: "genericTank",
    LABEL: "Captain",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5,
                ANGLE: 90
            },
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                MAX_CHILDREN: 4,
            },
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 12,
                ANGLE: 90
            }
        }
    ], 2)
}
Class.charger_AR = {
    PARENT: "genericTank",
    LABEL: "Charger",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 4,
                ASPECT: 0.001,
                X: 18
            }
        }
    ]
}
Class.cluster_AR = {
    PARENT: "genericTank",
    LABEL: "Cluster",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.5,
                WIDTH: 16,
                ASPECT: 0.5
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 14,
                ASPECT: 1.2
            }
        }
    ]
}
Class.cog_AR = {
    PARENT: "genericTank",
    LABEL: "Cog",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 4.5,
                ANGLE: 10
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11,
                Y: 4.5,
                ANGLE: 10
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                Y: 4.5,
                ANGLE: 10
            }
        }
    ], {delayIncrement: 0.5})
}
Class.combo_AR = {
    PARENT: "genericTank",
    LABEL: "Combo",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3),
    TURRETS: weaponArray([
        {
            POSITION: {
                SIZE: 11,
                X: 8,
                ANGLE: 180,
                ARC: 190
            },
            TYPE: "autoTankGun",
            INDEPENDENT: true,
        },
    ], 3)
}
Class.courser_AR = {
    PARENT: "genericTank",
    LABEL: "Courser",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 11,
                ASPECT: -1.7
            }
        }
    ]
}
Class.crowbar_AR = {
    PARENT: "genericTank",
    LABEL: "Crowbar",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 40,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: -2
            }
        }
    ],
    TURRETS: weaponStack({
        TYPE: ["crowbarTurretTank", {INDEPENDENT: true}],
        POSITION: {
            SIZE: 6,
            X: 40,
            ARC: 180,
            LAYER: 1
        }
    }, 3, {xPosOffset: 10.25})
}
Class.cruiserdrive_AR = makeDrive("cruiser", preset.makeDrive.swarm)
Class.dieselTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Diesel Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 11,
                ASPECT: 1.6
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 18,
                ASPECT: 1.3,
                X: 17
            }
        }
    ]
}
Class.directorstorm_AR = makeDrive("director", preset.makeDrive.storm)
Class.discharger_AR = {
    PARENT: "genericTank",
    LABEL: "Discharger",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                Y: -5.5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 15,
                Y: -5.5,
                ANGLE: -7
            }
        }], {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            }
        }
    ]
}
Class.dopeseer_AR = {
    PARENT: "genericTank",
    LABEL: "Dopeseer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8.,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 9,
                ANGLE: 90
            }
        }
    ])
}
Class.doubleArtillery_AR = {
    PARENT: "genericTank",
    LABEL: "Double Artillery",
    DANGER: 7,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.flankGuard]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.flankGuard]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ], 2)
}
Class.doubleBlaster_AR = {
    PARENT: "genericTank",
    LABEL: "Double Blaster",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 13,
            WIDTH: 8,
            ASPECT: 1.9,
            X: 4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 2)
}
Class.doubleDiesel_AR = {
    PARENT: "genericTank",
    LABEL: "Double Diesel",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 14,
            WIDTH: 12,
            ASPECT: 1.6,
            X: 8,
            ANGLE: 0
        }
    }, 2)
}
Class.doubleFlankTwin_AR = {
    PARENT: "genericTank",
    LABEL: "Double Flank Twin",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 90,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5})
    ], 2)
}
Class.doubleGatling_AR = {
    PARENT: "genericTank",
    LABEL: "Double Gatling",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 24,
            WIDTH: 8,
            ASPECT: 1.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 2)
}
Class.doubleGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Double Gunner",
    DANGER: 7,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], {delayIncrement: 0.25}), 2)
}
Class.doubleHelix_AR = {
    PARENT: "genericTank",
    LABEL: "Double Helix",
    DANGER: 7,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        }, {delayIncrement: 0.5})
    ], 2)
}
Class.doubleMinigun_AR = {
    PARENT: "genericTank",
    LABEL: "Double Minigun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponArray(weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3}), 2)
}
Class.doubleSprayer_AR = {
    PARENT: "genericTank",
    LABEL: "Double Sprayer",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.drifter_AR = {
    PARENT: "genericSmasher",
    LABEL: "Drifter",
    DANGER: 7,
    TURRETS: [
        {
            TYPE: ["squareHat_spin", { COLOR: "black" }],
            POSITION: {SIZE: 21.5}
        }
    ]
}
Class.encircler_AR = {
    PARENT: "genericTank",
    LABEL: "Encircler",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.enforcer_AR = {
    PARENT: "genericTank",
    LABEL: "Enforcer",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: -2.2
            }
        }
    ]
}
Class.equalizer_AR = {
    PARENT: "genericTank",
    LABEL: "Equalizer",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 12,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 12,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 16,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: -3.75
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 3.5,
                ASPECT: 1.77,
                X: 16,
                Y: -3.75
            }
        }
    ],
    TURRETS: []
}
Class.expeller_AR = {
    PARENT: "genericTank",
    LABEL: "Expeller",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ASPECT: 1.4,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            }
        }
    ], {delayIncrement: 0.5})
}
Class.faucet_AR = {
    PARENT: "genericTank",
    LABEL: "Faucet",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 1.5,
                ANGLE: 22.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.foamer_AR = {
    PARENT: "genericTank",
    LABEL: "Foamer",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 9
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8
            }
        }
    ]
}
Class.foreman_AR = {
    PARENT: "genericTank",
    LABEL: "Foreman",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    MAX_CHILDREN: 6,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 15,
            ASPECT: 1.3,
            X: 2,
            ANGLE: 90,
        }
    }, 2)
}
Class.foctillery_AR = {
    PARENT: "genericTank",
    LABEL: "Foctillery",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -6,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.forger_AR = {
    PARENT: "genericTank",
    LABEL: "Forger",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 17
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "block",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.foundry_AR = {
    PARENT: "genericTank",
    LABEL: "Foundry",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 15
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 17,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 17
            }
        }
    ]
}
Class.frother_AR = {
    PARENT: "genericTank",
    LABEL: "Frother",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 5,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.3,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.hangar_AR = {
    PARENT: "genericTank",
    LABEL: "Hangar",
    DANGER: 7,
    FACING_TYPE: "locksFacing",
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.2
    },
    ...todo_placeholder_guns,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 8.5,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 3,
                Y: 5.5
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 3.5,
                WIDTH: 12,
                X: 8
            }
        }
    ]
}
Class.helicopter_AR = {
    PARENT: "genericTank",
    LABEL: "Helicopter",
    ANGLE: 60,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.satellite,
    HEALING_TANK: true,
    TURRETS: [
        {
            TYPE: "healerHat_spin",
            POSITION: {
                SIZE: 4.5,
                LAYER: 2
            }
        },
        {
            POSITION: {
                SIZE: 8,
                LAYER: 1
            },
            TYPE: ["hexagonHat_spin", { COLOR: "grey" }]
        }
    ],
    AI: {
        SPEED: 2, 
    },
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 6; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.healer]), 
                    TYPE: ["healerSatellite", {ANGLE: i * 60}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.hurler_AR = {
    PARENT: "genericTank",
    LABEL: "Hurler",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 16,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 16
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.launcher]),
                TYPE: "minimissile",
                STAT_CALCULATOR: "sustained"
            }
        }
    ]
}
Class.hutch_AR = {
    PARENT: "genericTank",
    LABEL: "Hutch",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 20.25,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            }
        }
    ], {delayIncrement: 0.5})
}
Class.incarcerator_AR = {
    PARENT: "genericTank",
    LABEL: "Incarcerator",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 180
            }
        }
    ]
}
Class.inception_AR = {
    PARENT: "genericTank",
    LABEL: "Inception",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 13,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                X: 13
            }
        }
    ]
}
Class.issuer_AR = {
    PARENT: "genericTank",
    LABEL: "Issuer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 3.5,
                WIDTH: 12,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.jalopy_AR = {
    PARENT: "genericTank",
    LABEL: "Jalopy",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12,
                ASPECT: 1.8,
                X: 6,
                ANGLE: 0
            }
        }
    ]
}
Class.junkie_AR = {
    PARENT: "genericTank",
    LABEL: "Junkie",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 2
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.laborer_AR = {
    PARENT: "genericTank",
    LABEL: "Laborer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 10,
                ASPECT: 1.2,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 12,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 11,
                ASPECT: -1.3,
                X: 6
            }
        }
    ]
}
Class.machineGuard_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Guard",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15,
                ANGLE: 180
            }
        }
    ]
}
Class.machineMech_AR = {
    PARENT: "genericTank",
    LABEL: "Machine Mech",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 13,
                ASPECT: 1.2
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ]
}
Class.mechGuard_AR = {
    PARENT: "genericTank",
    LABEL: "Mech Guard",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                ANGLE: 180
            }
        }
    ]
}
Class.megaHunter_AR = {
    PARENT: "genericTank",
    LABEL: "Mega Hunter",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 15,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.hunter]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.megaSpawner_AR = {
    PARENT: "genericTank",
    LABEL: "Mega-Spawner",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 13
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 15
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 15,
                X: 15
            },
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {size: 0.8 }]),
                TYPE: "megaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true
            }
        }
    ]
}
Class.megaTrapper_AR = {
    PARENT: "genericTank",
    LABEL: "Mega Trapper",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 12,
                ASPECT: 1.7,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.megaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.mingler_AR = {
    PARENT: "genericTank",
    LABEL: "Mingler",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 3.5,
                ANGLE: 30,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 6, 0.5)
}
Class.mosey_AR = {
    PARENT: "genericTank",
    LABEL: "Mosey",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 4
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 1,
                ASPECT: -2.5,
                X: 8,
                Y: 4
            }
        }
    ], {delayIncrement: 0.5})
}
Class.mummifier_AR = {
    PARENT: "genericTank",
    LABEL: "Mummifier",
    DANGER: 7,
    NECRO: [4],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 6,
    //...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 13,
            ASPECT: 1.3,
            X: 1.4,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8, size: Math.SQRT2}]),
            TYPE: "betaSunchip_AR",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
        }
    }, 2),
    PROPS: Class.betaSunchip_AR.PROPS
}
Class.nurse_AR = {
    PARENT: "genericHealer",
    LABEL: "Nurse",
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], {delayIncrement: 0.5})
}
Class.operator_AR = {
    PARENT: "genericTank",
    LABEL: "Operator",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            }
        }
    ]
}
Class.peashooter_AR = makeGuard({
    PARENT: "genericTank",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 7.5,
                ASPECT: 0.6,
                X: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm"
            }
        }
    ]
}, "Peashooter")
Class.pentaseer_AR = {
    PARENT: "genericTank",
    LABEL: "Pentaseer",
    DANGER: 7,
    NECRO: [5],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 5,
    //...todo_placeholder_guns,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 6,
            WIDTH: 11,
            ASPECT: 1.2,
            X: 7.4,
            ANGLE: 36
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8, size: 1.5}]),
            TYPE: "pentaseerSunchip_AR",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 5
        }
    }, {delayIncrement: 0.5})
}
Class.piercer_AR = {
    PARENT: "genericTank",
    LABEL: "Piercer",
    DANGER: 7,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 7
            }
        }, 3, {xPosOffset: 5}),
        ...weaponStack({
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.marksman]),
                TYPE: "bullet"
            }
        }, 3, {lengthOffset: 2, delayIncrement: 1/3})
    ]
}
Class.pitcher_AR = {
    PARENT: "genericTank",
    LABEL: "Pitcher",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 13,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 13
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                Y: 4
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                Y: -4
            }
        }
    ]
}
Class.prober_AR = {
    PARENT: "genericTank",
    LABEL: "Prober",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 5
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 7
            }
        }
    ]
}
Class.productionist_AR = {
    PARENT: "genericTank",
    LABEL: "Productionist",
    DANGER: 7,
    STAT_NAMES: statnames.swarm,
    BODY: {
        SPEED: base.SPEED * 0.75,
        FOV: 1.2,
    },
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 14.5,
                WIDTH: 6,
                Y: 5.2
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                ASPECT: -1.2,
                Y: 5.2
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 8,
                X: 14.5,
                Y: 5.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.productionist]),
                TYPE: "tinyMinion",
                STAT_CALCULATOR: "drone",
                SYNCS_SKILLS: true
            }
        }
    ], {delayIncrement: 0.5})
}
Class.projector_AR = {
    PARENT: "genericTank",
    LABEL: "Projector",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 14,
                ASPECT: -0.5
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 14
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 10,
                ASPECT: -0.5,
                X: 9
            }
        },
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 10,
                X: 9
            }
        }
    ]
}
Class.psychiatrist_AR = {
    PARENT: "genericHealer",
    LABEL: "Psychiatrist",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10,
                ASPECT: 1.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}
Class.quadAngle_AR = {
    PARENT: "genericTank",
    LABEL: "Quad-Angle",
    DANGER: 7,
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    },
    TURRETS: [
        {
            POSITION: {
                SIZE: 8,
                X: 8,
                ANGLE: 45,
                ARC: 190
            },
            TYPE: "autoTankGun",
        },
        {
            POSITION: {
                SIZE: 8,
                X: 8,
                ANGLE: -45,
                ARC: 190
            },
            TYPE: "autoTankGun",
        },
    ],
    GUNS: weaponMirror({
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
    })
}
Class.queller_AR = {
    PARENT: "genericTank",
    LABEL: "Queller",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -6,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.artillery]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ]
}
Class.railgun_AR = {
    PARENT: "genericTank",
    LABEL: "Railgun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7.95
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.recalibrator_AR = {
    PARENT: "genericHealer",
    LABEL: "Recalibrator",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 11.5
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.healer]),
                TYPE: ["healerBullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 90
            }
        }, {delayIncrement: 0.5})
    ]
}
Class.rimfire_AR = {
    PARENT: "genericTank",
    LABEL: "Rimfire",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 2,
                X: 2,
                Y: -2.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 2,
                X: 2,
                Y: 2.5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 7,
                Y: 5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 7,
                Y: -5
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                X: 2
            }
        }
    ]
}
Class.rotaryGun_AR = {
    PARENT: "genericTank",
    LABEL: "Rotary Gun",
    DANGER: 7,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.focal]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.scientist_AR = {
    PARENT: "genericHealer",
    LABEL: "Scientist",
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            }
        }
    ]
}
Class.slinker_AR = {
    PARENT: "genericTank",
    LABEL: "Slinker",
    DANGER: 7,
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 14,
                ASPECT: -1.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.sniper3_AR = makeRadialAuto("sniper3gun", {isTurret: true, danger: 7, size: 13, label: "Sniper-3", body: {SPEED: 0.8 * base.SPEED, FOV: 1.25 * base.FOV}})
Class.soother_AR = {
    PARENT: "genericHealer",
    LABEL: "Soother",
    STAT_NAMES: statnames.drone,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 10,
                ASPECT: 1.3,
                X: 8
            }
        }
    ]
}
Class.splitShot_AR = {
    PARENT: "genericTank",
    LABEL: "Split Shot",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                X: 8,
                Y: 2,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                X: 4,
                Y: 0.5,
                ANGLE: 15
            }
        }], {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            }
        }
    ]
}
Class.stall_AR = {
    PARENT: "genericTank",
    LABEL: "Stall",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 2,
                WIDTH: 12,
                ASPECT: 1.1,
                X: 18
            }
        }
    ]
}
Class.stormer_AR = {
    PARENT: "genericTank",
    LABEL: "Stormer",
    DANGER: 7,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 30,
                WIDTH: 2,
                Y: -2.5,
                ANGLE: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet",
            },
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.triHealer_AR = {
    PARENT: "genericHealer",
    LABEL: "Tri-Healer",
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], 3)
}
Class.triMachine_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Machine",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15,
                ANGLE: 0
            }
        }
    ], 3)
}
Class.triMech_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Mech",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15
            }
        }
    ], 3)
}
Class.triPen_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Pen",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13
            }
        }
    ], 3)
}
Class.triTrapGuard_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Trap Guard",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            }
        }]),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 13,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.volley_AR = {
    PARENT: "genericTank",
    LABEL: "Volley",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: -3.75
            }
        }
    ]
}
Class.waarrk_AR = {
    PARENT: "genericTank",
    LABEL: "Waarrk",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 2,
                ANGLE: 18
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 15,
                Y: 2,
                ANGLE: 18
            }
        }], {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 17
            }
        }
    ]
}
Class.warkwark_AR = {
    PARENT: "genericTank",
    LABEL: "Warkwark",
    DANGER: 7,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.doubleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], {delayIncrement: 0.5}), 2)
}
Class.widget_AR = {
    PARENT: "genericTank",
    LABEL: "Widget",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                ASPECT: 1.4
            }
        }
    ]
}
Class.zipper_AR = {
    PARENT: "genericTank",
    LABEL: "Zipper",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 1.5,
                ANGLE: 22.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
                TYPE: "bullet"
            }
        }
    ]
}

// Tier 4
Class.PLACEHOLDER_healerOverseer_AR = {
    PARENT: "genericHealer",
    LABEL: "",
    STAT_NAMES: statnames.drone,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 8,
            ANGLE: 90
        }
    }, 2)
}
Class.PLACEHOLDER_healerSprayer_AR = {
    PARENT: "genericHealer",
    LABEL: "",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 6,
                ASPECT: -0.4,
                X: 14.5
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.healer]),
                TYPE: "healerBullet"
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10,
                ASPECT: 1.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}
Class.PLACEHOLDER_healerUnderseer_AR = {
    PARENT: "genericHealer",
    LABEL: "",
    NECRO: [4],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    MAX_CHILDREN: 14,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 7.4,
            ANGLE: 90
        }
    }, 2)
}
Class.PLACEHOLDER_whirlBanshee_AR = makeWhirlwind("banshee", {label: ""})
Class.PLACEHOLDER_whirlBeekeeper_AR = makeWhirlwind("beekeeper", {label: ""})
Class.PLACEHOLDER_whirlCyclone_AR = makeWhirlwind("cyclone", {label: ""})
Class.PLACEHOLDER_whirlDischarger_AR = makeWhirlwind("discharger_AR", {label: ""})
Class.PLACEHOLDER_whirlFieldGun_AR = makeWhirlwind("fieldGun", {label: ""})
Class.PLACEHOLDER_whirlFoctillery_AR = makeWhirlwind("foctillery_AR", {label: ""})
Class.PLACEHOLDER_whirlForger_AR = makeWhirlwind("forger_AR", {label: ""})
Class.PLACEHOLDER_whirlHexaTrapper_AR = makeWhirlwind(makeAuto({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 6, 0.5),
}, "", preset.makeAuto.blank), {label: ""})
Class.PLACEHOLDER_whirlInfestor_AR = makeWhirlwind("infestor", {label: ""})
Class.PLACEHOLDER_whirlMaleficitor_AR = makeWhirlwind("maleficitor", {label: "", satelliteType: "squareSatellite"})
Class.PLACEHOLDER_whirlMingler_AR = makeWhirlwind("mingler_AR", {label: ""})
Class.PLACEHOLDER_whirlMortar_AR = makeWhirlwind("mortar", {label: ""})
Class.PLACEHOLDER_whirlNecromancer_AR = makeWhirlwind("necromancer", {label: "", satelliteType: "squareSatellite"})
Class.PLACEHOLDER_whirlOrdnance_AR = makeWhirlwind("ordnance", {label: ""})
Class.PLACEHOLDER_whirlQueller_AR = makeWhirlwind("queller_AR", {label: ""})
Class.PLACEHOLDER_whirlSniper3_AR = makeWhirlwind("sniper3_AR", {label: ""})
Class.accountant_AR = {
    PARENT: "genericHealer",
    LABEL: "Accountant",
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 14,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ]
}
Class.actuary_AR = {
    PARENT: "genericHealer",
    LABEL: "Actuary",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 8
            }
        }
    ]
}
Class.adderall_AR = {
    PARENT: "genericTank",
    LABEL: "Adderall",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {speed: 3}]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: {
                LENGTH: 8,
                WIDTH: 0.25,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.antidote_AR = {
    PARENT: "genericHealer",
    LABEL: "Antidote",
    STAT_NAMES: statnames.swarm,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 6.5,
                WIDTH: 5.2,
                ASPECT: -0.4,
                X: 9.5,
                Y: 4
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 4
            }
        }
    ], {delayIncrement: 0.5})
}
Class.armament_AR = makeGunner('enforcer_AR', "Armament", {rear: true})
Class.autoDirectorstorm_AR = makeAuto("directorstorm_AR", "Auto-Directorstorm", preset.makeAuto.storm)
Class.autoDoubleFlank_AR = makeAuto("doubleFlankTwin_AR", "Auto-Double Flank")
Class.autoHexaTrapper_AR = makeAuto({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 6, 0.5),
}, "Auto-Hexa-Trapper", preset.makeAuto.triple)
Class.autoHexaWhirl_AR = makeWhirlwind(makeAuto("hexaTank", "", preset.makeAuto.blank), {label: "Auto-Hexa Whirl"})
Class.autoMunition_AR = makeWhirlwind(makeAuto("artillery", "", preset.makeAuto.blank), {label: "Auto-Munition"})
Class.autoOverdrive_AR = makeAuto("overdrive", "Auto-Overdrive", preset.makeAuto.drive)
Class.autoProphet_AR = makeWhirlwind(makeAuto("underseer", "", preset.makeAuto.blank), {label: "Auto-Prophet"})
Class.autoTriple_AR = makeAuto("tripleTwin", "Auto-Triple")
Class.autoVortex_AR = makeWhirlwind(makeAuto("launcher", "", preset.makeAuto.blank), {label: "Auto-Vortex"})
Class.autoWhirl3_AR = makeWhirlwind(makeAuto("auto3", "", preset.makeAuto.blank), {label: "Auto-Whirl-3"})
Class.autoWhirlGuard_AR = makeWhirlwind(makeAuto("trapGuard", "", preset.makeAuto.blank), {label: "Auto-Whirl Guard"})
Class.battledrive_AR = makeDrive("battleship", {...preset.makeDrive.swarm, label: "Battledrive"})
Class.bentSubverter_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Subverter",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        ...weaponMirror(weaponStack({
            POSITION: {
                LENGTH: 19,
                WIDTH: 14,
                X: -2,
                Y: 2,
                ANGLE: 16,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 2, {lengthOffset: 2, delayIncrement: 0.25})),
        ...weaponStack({
            POSITION: {
                LENGTH: 21,
                WIDTH: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, g.tripleShot]),
                TYPE: "bullet"
            }
        }, 3, {lengthOffset: 2, delayIncrement: 1/3})
    ]
}
Class.bentTriple_AR = {
    PARENT: "genericTank",
    LABEL: "Bent Triple",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 18,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin, g.tripleTwin]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin, g.tripleTwin]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.bigChip_AR = {
    PARENT: "genericTank",
    LABEL: "Big Chip",
    DANGER: 8,
    NECRO: [4],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 4,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 14,
            WIDTH: 14,
            ASPECT: 1.3,
            X: 1.4,
            ANGLE: 90
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8, size: 2}]),
            TYPE: "alphaSunchip_AR",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "necro",
            WAIT_TO_CYCLE: true,
            DELAY_SPAWN: false,
            MAX_CHILDREN: 1
        }
    }, 2),
    PROPS: Class.alphaSunchip_AR.PROPS
}
Class.blusterer_AR = makeGunner('conqueror', "Blusterer", {length: 16.75, noDeco: true})
Class.bruiser_AR = {
    PARENT: "genericTank",
    LABEL: "Bruiser",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21.5,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 12,
                ASPECT: -1.6
            }
        }
    ]
}
Class.buster_AR = makeGunner('construct', "Buster", {rear: true})
Class.butcher_AR = makeGuard('hunter', "Butcher")
Class.carnivore_AR = {
    PARENT: "genericTank",
    LABEL: "Carnivore",
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.1
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 14,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 17,
                DELAY: 0.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.carrierdrive_AR = makeDrive("carrier", preset.makeDrive.swarm)
Class.chemist_AR = {
    PARENT: "genericHealer",
    LABEL: "Chemist",
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            }
        }
    ], 3)
}
Class.cleft_AR = {
    PARENT: "genericTank",
    LABEL: "Cleft",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: -5.5,
                ANGLE: -25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }, 
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }
    ], {delayIncrement: 0.5}), 2)
}
Class.clerk_AR = {
    PARENT: "genericHealer",
    LABEL: "Clerk",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19.2,
                WIDTH: 12,
                ASPECT: 0.7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 12
            }
        }
    ]
}
Class.clinician_AR = {
    PARENT: "genericHealer",
    LABEL: "Clinician",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 8,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], {delayIncrement: 0.5}), 2)
}
Class.comboWhirl_AR = makeWhirlwind("combo_AR", {label: "Combo Whirl"})
Class.combustor_AR = {
    PARENT: "genericTank",
    LABEL: "Combustor",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 7,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 20,
                ASPECT: 0.95,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flamethrower]),
                TYPE: "growBullet"
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 12,
                ASPECT: 2,
                X: 4
            }
        }
    ]
}
Class.concentrator_AR = {
    PARENT: "genericTank",
    LABEL: "Concentrator",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 29,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.focal]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.coordinator_AR = {
    PARENT: "genericTank",
    LABEL: "Coordinator",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.single]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 13.5,
                ASPECT: -1.45
            }
        }
    ]
}
Class.cruiserstorm_AR = makeDrive("cruiser", preset.makeDrive.stormSwarm)
Class.cyclops_AR = {
    PARENT: "genericTank",
    LABEL: "Cyclops",
    DANGER: 8,
    GUNS: [
        ...weaponStack({
            POSITION: {
                LENGTH: 13,
                WIDTH: 5,
                ASPECT: 2.2,
                X: 4
            }
        }, 2, { xPosOffset: 5 }),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.marksman]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.decaTank_AR = {
    PARENT: "genericTank",
    LABEL: "Deca Tank",
    DANGER: 8,
    GUNS: weaponArray([
        // Must be kept like this to preserve visual layering
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8,
                ANGLE: 36,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam]),
                TYPE: "bullet"
            }
        }
    ], 5)
}
Class.demise_AR = {
    PARENT: "genericTank",
    LABEL: "Demise",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20.5,
                WIDTH: 12,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 4)
}
Class.destabilizer_AR = {
    PARENT: "genericTank",
    LABEL: "Destabilizer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.3
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 25,
            WIDTH: 14
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, g.streamliner]),
            TYPE: "bullet"
        }
    }, 5, {lengthOffset: 2, delayIncrement: 0.2})
}
Class.doctor_AR = {
    PARENT: "genericHealer",
    LABEL: "Doctor",
    STAT_NAMES: statnames.drone,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 14,
                ASPECT: 1.3,
                X: 2
            }
        }
    ]
}
Class.doperstorm_AR = makeDrive("doper_AR", preset.makeDrive.storm)
Class.doubleAtomizer_AR = {
    PARENT: "genericTank",
    LABEL: "Double Atomizer",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 7,
                ASPECT: 1.4,
                X: 18
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.atomizer, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleCoil_AR = {
    PARENT: "genericTank",
    LABEL: "Double Coil",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    UPGRADE_TOOLTIP: "[DEV NOTE] This tank does not function as intended yet!",
    GUNS: weaponArray([
        {
            POSITION: [20, 8, 0.75, 0, -5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            },
        },
        {
            POSITION: [20, 8, 0.75, 0, 5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [["snake", {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: [21, 4, 0.75, 0, 5, 0, 0]
        },
        {
            POSITION: [3.625, 7.5, 2.75, 5.75, 6.75, -90, 0],
        }]),
        {
            POSITION: [6, 8, 0.25, 10.5, 0, 0, 0],
        }
    ], 2)
}
Class.doubleDual_AR = {
    PARENT: "genericTank",
    LABEL: "Double Dual",
    DANGER: 8,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.dual, g.lowPower]),
                TYPE: "bullet",
                LABEL: "Small"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 8.5,
                Y: 5.5,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.dual]),
                TYPE: "bullet"
            }
        }
    ], {delayIncrement: 0.5}), 2)
}
Class.doubleDuplicator_AR = {
    PARENT: "genericTank",
    LABEL: "Double Duplicator",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: [20, 8, -1.5, 0, 0, 20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: [["snake", {invert: false}]]}]
            }
        },
        {
            POSITION: [20, 8, -1.5, 0, 0, -20, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["splitterBullet", {CONTROLLERS: [["snake", {invert: true}]]}]
            }
        },
        ...weaponMirror([{
            POSITION: [5.625, 9.5, 2, 0.375-1, -8, 111.5, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, 0, 4.75, -30, 0]
        }]),
        {
            POSITION: [17, 8, 0.65, 0, 0, 0, 0]
        },
        {
            POSITION: [18, 8, 0.25, 0, 0, 0, 0]
        },
    ], 2)
}
Class.doubleFaucet_AR = {
    PARENT: "genericTank",
    LABEL: "Double Faucet",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 9,
                WIDTH: 8.2,
                ASPECT: 0.6,
                X: 5,
                Y: 1.5,
                ANGLE: 22.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleFlamethrower_AR = {
    PARENT: "genericTank",
    LABEL: "Double Flamethrower",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 20,
                ASPECT: 0.95,
                X: 13
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flamethrower, g.flankGuard]),
                TYPE: "growBullet"
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 12,
                ASPECT: 2,
                X: 4
            }
        }
    ], 2)
}
Class.doubleFlankHelix_AR = {
    PARENT: "genericTank",
    LABEL: "Double Flank Helix",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 90,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        }, {delayIncrement: 0.5})
    ], 2)
}
Class.doubleFocal_AR = {
    PARENT: "genericTank",
    LABEL: "Double Focal",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleFoamer_AR = {
    PARENT: "genericTank",
    LABEL: "Double Foamer",
    DANGER: 8,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 9
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 12,
                ASPECT: 1.6,
                X: 8
            }
        }
    ], 2)
}
Class.doubleFrother_AR = {
    PARENT: "genericTank",
    LABEL: "Double Frother",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 5,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.3,
                X: 18
            }
        },
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 9,
                ASPECT: 1.4
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 15
            }
        }
    ], 2)
}
Class.doubleMunition_AR = makeWhirlwind("doubleArtillery_AR", {label: "Double Munition"})
Class.doubleMusket_AR = {
    PARENT: "genericTank",
    LABEL: "Double Musket",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.225
    },
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 7,
                Y: 6.15
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                Y: 4.15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, g.twin, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], {delayIncrement: 0.5}), 2)
}
Class.doubleRedistributor_AR = {
    PARENT: "genericTank",
    LABEL: "Double Redistributor",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 10,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleSplasher_AR = {
    PARENT: "genericTank",
    LABEL: "Double Splasher",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.blaster, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleStormer_AR = {
    PARENT: "genericTank",
    LABEL: "Double Stormer",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 30,
                WIDTH: 2,
                Y: -2.5,
                ANGLE: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }, g.flankGuard]),
                TYPE: "bullet",
            },
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 10
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleSubverter_AR = {
    PARENT: "genericTank",
    LABEL: "Double Subverter",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponArray(weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 14
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.minigun, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3}), 2)
}
Class.doubleTriBlaster_AR = {
    PARENT: "genericTank",
    LABEL: "Double Tri-Blaster",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 4,
                Y: 2,
                ANGLE: 15,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.lowPower, g.doubleTwin]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleTriplet_AR = {
    PARENT: "genericTank",
    LABEL: "Double Triplet",
    DANGER: 8,
    BODY: {
        FOV: 1.05 * base.FOV
    },
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 17.5,
                WIDTH: 8,
                Y: 5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.triplet]),
                TYPE: "bullet"
            }
        }),
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.triplet]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.doubleTriplex_AR = {
    PARENT: "genericTank",
    LABEL: "Double Triplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -45,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -4.75,
                Y: -5,
                ANGLE: 45
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 22.5
            }
        }], {delayIncrement: 0.5}),
    ], 2)
}
Class.doubleVolley_AR = {
    PARENT: "genericTank",
    LABEL: "Double Volley",
    DANGER: 8,
    ...todo_placeholder_guns,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 5,
                Y: -7.25
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5,
                Y: -3.75
            }
        }
    ], 2)
}
Class.downpourer_AR = makeDrive("director", {label: "Downpourer", type: "genericEntity", size: 12, hatType: "downpourerSquare_AR"}) // fix later
Class.duo_AR = {
    PARENT: "genericTank",
    LABEL: "Duo",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 21,
                WIDTH: 8,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 18,
                ASPECT: -1.1
            }
        }
    ]
}
Class.duster_AR = {
    PARENT: "genericTank",
    LABEL: "Duster",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 26,
                WIDTH: 3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.executor_AR = makeGuard('assassin', "Executor")
Class.flexedDouble_AR = {
    PARENT: "genericTank",
    LABEL: "Flexed Double",
    DANGER: 8,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: weaponArray([
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 8,
                Y: 3,
                ANGLE: 30,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 15,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.fortdrive_AR = makeDrive("fortress", {...preset.makeDrive.swarm, label: "Fortdrive"})
Class.gadgetGun_AR = {
    PARENT: "genericTank",
    LABEL: "Gadget Gun",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11.3,
                ASPECT: -1.6
            }
        }
    ]
}
Class.geneticist_AR = {
    PARENT: "genericHealer",
    LABEL: "Geneticist",
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 11,
                WIDTH: 5,
                ASPECT: -0.4,
                X: 11.5,
                Y: 5
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos, g.healer]),
                TYPE: ["healerBullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.desmos, g.healer]),
                TYPE: ["healerBullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        }, {delayIncrement: 0.5})
    ]
}
Class.guru_AR = {
    PARENT: "genericHealer",
    LABEL: "Guru",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 4,
                ASPECT: -0.4,
                X: 9.5,
                Y: -5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7
            }
        },
        {
            POSITION: {
                LENGTH: 10,
                WIDTH: 4,
                ASPECT: -0.4,
                X: 9.5,
                Y: 5,
                ANGLE: 7
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: 5,
                ANGLE: 7
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 12,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 13
            }
        }
    ]
}
Class.healer3_AR = {
    PARENT: "genericHealer",
    LABEL: "Healer-3",
    FACING_TYPE: ["spin", {speed: 0.02}],
    TURRETS: [
        ...weaponArray({
            TYPE: "healerAutoTankGun_AR",
            POSITION: {
                SIZE: 11,
                X: 8,
                ARC: 190
            }
        }, 3),
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ]
}
Class.hewnFlankDouble_AR = {
    PARENT: "genericTank",
    LABEL: "Hewn Flank Double",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 90,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        }),
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: -5.5,
                ANGLE: 155
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}), 2)
    ]
}
Class.hewnGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Hewn Gunner",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 10,
                    WIDTH: 3.5,
                    Y: 8.25,
                    ANGLE: 205,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: {
                    LENGTH: 14,
                    WIDTH: 3.5,
                    Y: 4.75,
                    ANGLE: 205
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
        ], {delayIncrement: 0.25}),
        ...weaponArray(weaponMirror([
            {
                POSITION: {
                    LENGTH: 12,
                    WIDTH: 3.5,
                    Y: 7.25,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: {
                    LENGTH: 16,
                    WIDTH: 3.5,
                    Y: 3.75
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            }
        ], {delayIncrement: 0.25}), 2)
    ]
}
Class.hewnTriple_AR = {
    PARENT: "genericTank",
    LABEL: "Hewn Triple",
    DANGER: 8,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: -5.5,
                ANGLE: -25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}), 3)
    ]
}
Class.hexaHealer_AR = {
    PARENT: "genericHealer",
    LABEL: "Hexa-Healer",
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.healer]),
                TYPE: "healerBullet"
            }
        }
    ], 6, 0.5)
}
Class.hexer_AR = makeDrive("maleficitor", {label: "Hexer"})
Class.hextuplex_AR = {
    PARENT: "genericTank",
    LABEL: "Hextuplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 60
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 120
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: 50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 240
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true, amplitude: 180, yOffset: -50}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: -1.5,
                ANGLE: 300
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, { reload: 2 }]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: false, amplitude: 180, yOffset: -50}]]}]
            }
        },
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 150
            }
        }), 3),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -5.25,
                Y: -7,
                ANGLE: 90
            }
        }), 3)
    ]
}
Class.honchostorm_AR = makeDrive("honcho_AR", preset.makeDrive.storm)
Class.injection_AR = {
    PARENT: "genericHealer",
    LABEL: "Injection",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 6,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11
            }
        }
    ]
}
Class.inspector_AR = {
    PARENT: "genericTank",
    LABEL: "Inspector",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV
    },
    ...todo_placeholder_guns,
    GUNS: weaponMirror({
        POSITION: {
            LENGTH: 5,
            WIDTH: 11,
            ASPECT: 1.3,
            X: 8,
            ANGLE: 90
        }
    })
}
Class.instructor_AR = makeDrive({
    PARENT: "genericTank",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {FOV: base.FOV * 1.15},
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 6,
            WIDTH: 12,
            ASPECT: 1.2,
            X: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone]),
            TYPE: "drone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            MAX_CHILDREN: 2,
            STAT_CALCULATOR: "drone"
        }
    }, 3)
}, {label: "Instructor"})
Class.instructor_AR.GUNS.push(...weaponArray({
    POSITION: {
        LENGTH: 9,
        WIDTH: 8.2,
        ASPECT: 0.6,
        X: 5,
        ANGLE: 180
    },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
        TYPE: "swarm",
        STAT_CALCULATOR: "swarm"
    }
}, 3, 1/3))
Class.prescriber_AR = makeDrive({
    PARENT: "genericTank",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {FOV: base.FOV * 1.15},
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 9,
            WIDTH: 8.2,
            ASPECT: 0.6,
            X: 5,
            ANGLE: 180
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm"
        }
    }, 3, 1/3)
}, {...preset.makeDrive.swarm, label: "Prescriber"})
Class.prescriber_AR.GUNS.push(...weaponArray({
    POSITION: {
        LENGTH: 6,
        WIDTH: 12,
        ASPECT: 1.2,
        X: 8
    },
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        MAX_CHILDREN: 2,
        STAT_CALCULATOR: "drone"
    }
}, 3))
//Class.instructor_AR = makeDrive("commander", {label: "Instructor", discrimination: true, discriminateFor: "drone"})
Class.intern_AR = {
    PARENT: "genericHealer",
    LABEL: "Intern",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 10
            }
        }
    ]
}
Class.jimmy_AR = {
    PARENT: "genericTank",
    LABEL: "Jimmy",
    DANGER: 8,
    BODY: {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
        //SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        ...Class.crowbar_AR.GUNS,
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
        })
    ],
    TURRETS: Class.crowbar_AR.TURRETS
}
Class.kraw_AR = {
    PARENT: "genericHealer",
    LABEL: "Kraw",
    STAT_NAMES: statnames.trap,
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], {delayIncrement: 0.5})
}
Class.leader_AR = {
    PARENT: "genericTank",
    LABEL: "Leader",
    DANGER: 8,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    TOOLTIP: "You are always invisible.",
    IGNORED_BY_AI: true,
    INVISIBLE: [0, 0],
    ALPHA: 0.3,
    GUNS: [
        {
            POSITION: {
                LENGTH: 7,
                WIDTH: 13,
                ASPECT: 1.3,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, { reload: 0.5 }]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 8
            }
        }
    ]
}
Class.marine_AR = makeGunner('ranger', "Marine", {rear: true})
Class.medicare_AR = {
    PARENT: "genericHealer",
    LABEL: "Medicare",
    STAT_NAMES: statnames.drone,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 4.5,
                WIDTH: 8,
                X: 10.5
            }
        },
        {
            POSITION: {
                LENGTH: 1,
                WIDTH: 10,
                X: 15
            }
        },
        {
            POSITION: {
                LENGTH: 3.5,
                WIDTH: 10,
                X: 8
            }
        }
    ]
}
Class.megaAutoDouble_AR = makeAuto("doubleTwin", "Mega Auto-Double", preset.makeAuto.mega)
Class.megaCocciSegment_AR = {
    PARENT: "genericSmasher",
    COLOR: "mirror",
    CAN_BE_ON_LEADERBOARD: false,
    DISPLAY_NAME: false,
    BODY: {
        SPEED: 1.05 * base.SPEED,
        FOV: 1.1 * base.FOV,
        DENSITY: 4 * base.DENSITY
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 25 }
        }
    ]
}
Class.megaCocci_AR = {
    PARENT: "genericSmasher",
    LABEL: "Mega-Cocci",
    DANGER: 8,
    BODY: {
        SPEED: 1.05 * base.SPEED,
        FOV: 1.1 * base.FOV,
        DENSITY: 4 * base.DENSITY
    },
    TURRETS: [
        {
            TYPE: ["hexagonHat_spin", { COLOR: "black" }],
            POSITION: { SIZE: 25 }
        }
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                const numOfSegments = 5;
                const segmentClass = "megaCocciSegment_AR";

                body.store.snakeSegments ??= [];

                for (let i = body.store.snakeSegments.length; i < numOfSegments; i++) {
                    let seg = new Entity(body, body);
                    seg.health = body.health;
                    seg.shield = body.shield;
                    seg.master = body;
                    seg.source = body;
                    seg.skill.score = body.skill.score;
                    seg.define(segmentClass);
                    body.store.snakeSegments.push(seg);
                }

                let previous = body;
                const children = body.store.snakeSegments;
            
                for (const child of children) {
                    const dx = child.x - previous.x;
                    const dy = child.y - previous.y;
                    const distance = Math.hypot(dx, dy) || 1; // /0 possible ig
                    const factor = (child.size + previous.size) * 1 / distance;
        
                    child.x = previous.x + dx * factor;
                    child.y = previous.y + dy * factor;
                    child.velocity.x = 0; // No natural move!
                    child.velocity.y = 0; // No natural move!
                    child.life();
                    previous = child;
                }
            }
        }
    ]
}
Class.megaHexaTrapper_AR = makeAuto({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 6, 0.5),
}, "Mega Hexa-Trapper", preset.makeAuto.mega)
Class.megaWhirl3_AR = makeWhirlwind("mega3", {label: "Mega-Whirl-3"})
Class.mono_AR = {
    PARENT: "genericTank",
    LABEL: "Mono",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 3.5,
                WIDTH: 8,
                ASPECT: -1.5,
                X: 13.5
            }
        }
    ]
}
Class.octoTrapper_AR = makeAuto({
    PARENT: "genericTank",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED
    },
    STAT_NAMES: statnames.trap,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.hexaTrapper]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], 8, 0.5),
}, "Octo-Trapper")
Class.octoWhirl_AR = makeWhirlwind("octoTank", {label: "Octo Whirl"})
Class.ointment_AR = {
    PARENT: "genericHealer",
    LABEL: "Ointment",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 13
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH:7,
                ASPECT: -0.4,
                X: 14
            }
        },
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            }
        }
    ]
}
Class.omen_AR = {
    PARENT: "genericTank",
    LABEL: "Omen",
    DANGER: 8,
    STAT_NAMES: statnames.necroMixed,
    SHAPE: 8,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        ...weaponArray({
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: 1.6,
                ANGLE: 45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.5, size: 2, damage: 0.95}]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 2
            },
        }, 4, 0.25),
        ...weaponArray([{
            POSITION: {
                LENGTH: 14,
                WIDTH: 9
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { range: 0.5, speed: 0.7, maxSpeed: 0.7 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }], 4)
    ],
}
Class.oracle_AR = makeOver("gunnerTrapper", "Oracle", {angle: 90})
Class.orifice_AR = makeGunner('single', "Orifice", {rear: true})
Class.overangle_AR = makeOver("triAngle", "Overangle", {angle: 90})
Class.overdoubleMachine_AR = makeOver("doubleMachine", "Overdouble Machine", {angle: 90})
Class.overdoubleTwin_AR = makeOver("doubleTwin", "Overdouble Twin", {angle: 90})
Class.overstorm_AR = makeDrive("overseer", {...preset.makeDrive.storm, label: "Overstorm"})
Class.overtrapGuard_AR = makeOver("trapGuard", "Overtrap Guard", {angle: 90})
Class.peaceMoon_AR = makeWhirlwind("deathStar", {label: "Peace Moon"})
Class.pentaBlaster_AR = {
    PARENT: "genericTank",
    LABEL: "Penta-Blaster",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 1,
                Y: 3,
                ANGLE: 30,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.lowPower, g.lowPower]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 4,
                Y: 2,
                ANGLE: 15,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.lowPower]),
                TYPE: "bullet"
            }
        }]),
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.physician_AR = {
    PARENT: "genericSmasher",
    LABEL: "Physician",
    HEALING_TANK: true,
    FACING_TYPE: ["spin", {speed: 0.05}],
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 0,
            WIDTH: 0
        }
    }, 12),
    TURRETS: [
        ...weaponArray({
            TYPE: ["pentagonHat_spin", { COLOR: "black" }],
            POSITION: {SIZE: 20}
        }, 4),
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 1
            }
        }
    ]
}
Class.pistol_AR = {
    PARENT: "genericTank",
    LABEL: "Pistol",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 12
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 7,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.productiondrive_AR = makeDrive("productionist_AR", {...preset.makeDrive.swarm, label: "Productiondrive"})
Class.professor_AR = {
    PARENT: "genericHealer",
    LABEL: "Professor",
    STAT_NAMES: statnames.mixed,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 9,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 10,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 9,
                ASPECT: 1.5,
                X: 16,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            }
        }
    ]
}
Class.quadMachine_AR = {
    PARENT: "genericTank",
    LABEL: "Quad Machine",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 12,
            WIDTH: 10,
            ASPECT: 1.4,
            X: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, { size: 0.92 }, g.flankGuard, g.flankGuard, g.spam]),
            TYPE: "bullet"
        }
    }, 4)
}
Class.quadTwin_AR = {
    PARENT: "genericTank",
    LABEL: "Quad Twin",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror({
        POSITION: {
            LENGTH: 20,
            WIDTH: 8,
            Y: 5.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
            TYPE: "bullet"
        }
    }, {delayIncrement: 0.5}), 4)
}
Class.quarterNQuarter_AR = {
    PARENT: "genericTank",
    LABEL: "Quarter 'n Quarter",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4,
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.quintuplet_AR = {
    PARENT: "genericTank",
    LABEL: "Quintuplet",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    GUNS: [
        ...weaponMirror([{
            POSITION: {
                LENGTH: 16,
                WIDTH: 10,
                Y: 5,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 10,
                Y: 3,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        }]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 10
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.quint]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.quintuplex_AR = {
    PARENT: "genericTank",
    LABEL: "Quintuplex",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, {speed: 1.25, maxSpeed: 1.25}]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 45,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -45,
                DELAY: 1/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: 90,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 7,
                ASPECT: -1.5,
                ANGLE: -90,
                DELAY: 2/3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        ...weaponMirror([{
            POSITION: {
                LENGTH: 5,
                WIDTH: 5,
                ASPECT: -4,
                X: -4.75,
                Y: -5,
                ANGLE: 0
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 22.5
            }
        },
        {
            POSITION: {
                LENGTH: 15.5,
                WIDTH: 3,
                ASPECT: -4,
                ANGLE: 67.5
            }
        }], {delayIncrement: 0.5}),
    ]
}
Class.ransacker_AR = makeGuard('rifle', "Ransacker")
Class.rationalizer_AR = {
    PARENT: "genericTank",
    LABEL: "Rationalizer",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.4
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 29,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner, g.streamliner]),
            TYPE: "bullet"
        }
    }, 7, {lengthOffset: 2, delayIncrement: 1/7})
}
Class.renovator_AR = {
    PARENT: "genericHealer",
    LABEL: "Renovator",
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 9,
                ASPECT: -0.4,
                X: 9.5
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 10
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: -1.8
            }
        }
    ]
}
Class.scatterer_AR = {
    PARENT: "genericTank",
    LABEL: "Scatterer",
    DANGER: 8,
    GUNS: [
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 11
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.scribble_AR = {
    PARENT: "genericHealer",
    LABEL: "Scribble",
    STAT_NAMES: statnames.mixed,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 11,
                WIDTH: 6,
                ASPECT: -0.4,
                X: 12
            }
        },
        {
            POSITION: {
                LENGTH: 21.5,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 13.5,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.5,
                X: 16
            }
        }
    ]
}
Class.sharpshooter_AR = {
    PARENT: "genericTank",
    LABEL: "Sharpshooter",
    DANGER: 8,
    BODY: {
        FOV: 1.2 * base.FOV
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.sifter_AR = makeGunner('courser_AR', "Sifter", {rear: true})
Class.skewnDouble_AR = {
    PARENT: "genericTank",
    LABEL: "Skewn Double",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 16,
                    WIDTH: 8,
                    Y: 5.5,
                    ANGLE: 225
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: {
                    LENGTH: 19,
                    WIDTH: 8,
                    Y: -5.5,
                    ANGLE: -205
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                    TYPE: "bullet"
                }
            }
        ], {delayIncrement: 0.5}),
        ...weaponArray(weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}), 2)
    ]
}
Class.slabNSlab_AR = {
    PARENT: "genericTank",
    LABEL: "Slab 'n Slab",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8,
                ASPECT: 1.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.spam, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.spam, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.sootherdrive_AR = {
    PARENT: "genericHealer",
    LABEL: "Sootherdrive",
    STAT_NAMES: statnames.drone,
    BODY: Class.soother_AR.BODY,
    TURRETS: [
        {
            TYPE: "healerHat",
            POSITION: {
                SIZE: 13,
                LAYER: 2
            }
        },
        {
            TYPE: ["squareHat", { COLOR: "grey" }],
            POSITION: {
                SIZE: 9,
                LAYER: 1
            }
        }
    ],
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 8
            }/*,
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "turretedDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }*/
        }
    ]
}
Class.spawnerstorm_AR = makeDrive("spawner", preset.makeDrive.storm)
Class.spiker_AR = {
    PARENT: "genericHealer",
    LABEL: "Spiker",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 10,
                ASPECT: 1.3,
                X: 8
            }
        },
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 1,
                ASPECT: -5,
                X: 8
            }
        }
    ]
}
Class.sprayNSpray_AR = {
    PARENT: "genericTank",
    LABEL: "Spray 'n Spray",
    DANGER: 8,
    HAS_NO_RECOIL: true,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 7,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 25,
                WIDTH: 7,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.lowPower, g.machineGun, { recoil: 1.15 }, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 9.5,
                ASPECT: 1.25,
                X: 8,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.spy_AR = {
    PARENT: "genericTank",
    LABEL: "Spy",
    DANGER: 8,
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 12.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.storm_AR = makeGunner('queller_AR', "Storm", {rear: true})
Class.subduer_AR = {
    PARENT: "genericTank",
    LABEL: "Subduer",
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.05
    },
    CONTROLLERS: ["zoom"],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.hunter]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 11,
                ASPECT: -1.3,
                X: 6.5
            }
        }
    ]
}
Class.tailer_AR = makeGunner('stalker', "Tailer", {rear: true})
Class.ternion_AR = {
    PARENT: "genericTank",
    LABEL: "Ternion",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 8,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ], 3)
}
Class.therapist_AR = {
    PARENT: "genericHealer",
    LABEL: "Therapist",
    ...todo_placeholder_guns,
    GUNS: weaponMirror([
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 2.5,
                ASPECT: -0.4,
                X: 9.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25
            }
        },
        {
            POSITION: {
                LENGTH: 9,
                WIDTH: 2.5,
                ASPECT: -0.4,
                X: 9.5,
                Y: 3.75
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            }
        }
    ], {delayIncrement: 0.5})
}
Class.tommy_AR = makeGuard('minigun', "Tommy")
Class.toppler_AR = {
    PARENT: "genericTank",
    LABEL: "Toppler",
    DANGER: 8,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 16
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.minigun]),
            TYPE: "bullet"
        }
    }, 3, {lengthOffset: 2, delayIncrement: 1/3})
}
Class.tornado_AR = {
    PARENT: "genericTank",
    LABEL: "Tornado",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 90,
                DELAY: 0.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 30,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5,
                ANGLE: 60,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.triSplasher_AR = {
    PARENT: "genericTank",
    LABEL: "Tri-Splasher",
    DANGER: 8,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 19,
                    WIDTH: 7,
                    Y: 2,
                    ANGLE: 15,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: {
                    LENGTH: 13,
                    WIDTH: 8,
                    ASPECT: 1.7,
                    X: 4,
                    Y: 2,
                    ANGLE: 15,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }, g.lowPower]),
                    TYPE: "bullet"
                }
            }
        ]),
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 7,
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 8,
                ASPECT: 1.9,
                X: 6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, { recoil: 0.5 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.triWhirlGuard_AR = makeWhirlwind("triTrapGuard_AR", {label: "Tri-Whirl Guard"})
Class.tricker_AR = {
    PARENT: "genericTank",
    LABEL: "Tricker",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 16
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.single]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        },
        {
            POSITION: {
                LENGTH: 5.5,
                WIDTH: 7,
                ASPECT: -1.8,
                X: 6.5
            }
        }
    ]
}
Class.tripleArtillery_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Artillery",
    DANGER: 8,
    GUNS: weaponArray([
        ...weaponMirror({
            POSITION: {
                LENGTH: 17,
                WIDTH: 5,
                Y: -5,
                ANGLE: -7,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.artillery, g.flankGuard]),
                TYPE: "bullet",
                LABEL: "Secondary"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.flankGuard]),
                TYPE: "bullet",
                LABEL: "Heavy"
            }
        }
    ], 3)
}
Class.tripleAutoDouble_AR = makeAuto("doubleTwin", "Triple Auto-Double", preset.makeAuto.triple)
Class.tripleBlaster_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Blaster",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 13,
            WIDTH: 8,
            ASPECT: 1.9,
            X: 4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.blaster, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3)
}
Class.tripleDiesel_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Diesel",
    DANGER: 8,
    ...todo_placeholder_guns,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 14,
            WIDTH: 12,
            ASPECT: 1.6,
            X: 8
        }
    }, 3)
}
Class.tripleFlankTwin_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Flank Twin",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ANGLE: 60,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5})
    ], 3)
}
Class.tripleGatling_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Gatling",
    DANGER: 7,
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 24,
            WIDTH: 8,
            ASPECT: 1.5
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.focal, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3)
}
Class.tripleGunner_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Gunner",
    DANGER: 8,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 3.5,
                Y: 7.25,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 16,
                WIDTH: 3.5,
                Y: 3.75
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], { delayIncrement: 0.25 }), 3)
}
Class.tripleHelix_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Helix",
    DANGER: 8,
    STAT_NAMES: statnames.desmos,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: -5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            },
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 6,
                ASPECT: -1.5,
                Y: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.spam, g.doubleTwin, g.tripleTwin, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            },
        },
        {
            POSITION: {
                LENGTH: 16.5,
                WIDTH: 2,
                ASPECT: -9.25
            }
        },
        ...weaponMirror({
            POSITION: {
                LENGTH: 4,
                WIDTH: 5,
                ASPECT: -4,
                X: -9.5,
                Y: -7,
                ANGLE: 90
            }
        }, {delayIncrement: 0.5})
    ], 3)
}
Class.tripleMinigun_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Minigun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: weaponArray(weaponStack({
        POSITION: {
            LENGTH: 21,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.flankGuard, g.flankGuard]),
            TYPE: "bullet"
        }
    }, 3, { lengthOffset: 2, delayIncrement: 1/3 }), 3)
}
Class.tripleSprayer_AR = {
    PARENT: "genericTank",
    LABEL: "Triple Sprayer",
    DANGER: 8,
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 23,
                WIDTH: 7
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.lowPower, g.pelleter, { recoil: 1.15 }, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 10,
                ASPECT: 1.4,
                X: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.understorm_AR = makeDrive("underseer", {...preset.makeDrive.storm, label: "Understorm"})
Class.underdoubleMachine_AR = makeUnder("doubleMachine", "Underdouble Machine", {angle: 90, shape: 4})
Class.underdoubleTwin_AR = makeUnder("doubleTwin", "Underdouble Twin", {angle: 90, shape: 4})
Class.undertrapGuard_AR = makeUnder("trapGuard", "Undertrap Guard", {angle: 90, shape: 4})
Class.ultraTornado_AR = {
    PARENT: "genericTank",
    LABEL: "Ultra-Tornado",
    DANGER: 8,
    TURRETS: [
        {
            TYPE: ["circleHat", { COLOR: "grey" }],
            POSITION: [16, 0, 0, 0, 360, 1],
        },
    ],
    ANGLE: 360,
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.satellite,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 1; i++) { 
            output.push({ 
                POSITION: {WIDTH: 20, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite, g.pounder, g.destroyer, g.annihilator]), 
                    TYPE: ["satellite", {ANGLE: i * 180}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}
Class.vortex_AR = makeDrive("director", {label: "Vortex", type: "vortexAutoTurret_AR", size: 12, hatType: "vortexSquare_AR"})
Class.vulcan_AR = {
    PARENT: "genericTank",
    LABEL: "Vulcan",
    DANGER: 7,
    ...todo_placeholder_guns,
    GUNS: [ // Each gun will be stacked to mimic a "back-forth" firing pattern, isn't present right now
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 1.5,
                Y: -4.45
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 1.5,
                Y: 4.45,
                DELAY: 0.8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 1.5,
                Y: 2.5,
                DELAY: 0.2
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 1.5,
                Y: -2.5,
                DELAY: 0.6
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 30,
                WIDTH: 1.5,
                DELAY: 0.4
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 14
            }
        },
        {
            POSITION: {
                LENGTH: 5,
                WIDTH: 14,
                X: 20
            }
        }
    ]
}
Class.warkwarkwark_AR = {
    PARENT: "genericTank",
    LABEL: "Warkwarkwark",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: weaponArray(weaponMirror([
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 8,
                Y: 5.5,
                ANGLE: 5
            }
        },
        {
            POSITION: {
                LENGTH: 3.25,
                WIDTH: 8,
                ASPECT: 1.7,
                X: 14,
                Y: 5.5,
                ANGLE: 5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.spam, g.doubleTwin, g.tripleTwin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ], {delayIncrement: 0.5}), 3)
}
Class.warkwawarkrk_AR = {
    PARENT: "genericTank",
    LABEL: "Warkwawarkrk",
    DANGER: 8,
    STAT_NAMES: statnames.trap,
    GUNS: [
        ...weaponMirror([
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 8,
                    Y: -5.5,
                    ANGLE: 155,
                }
            },
            {
                POSITION: {
                    LENGTH: 3.25,
                    WIDTH: 8,
                    ASPECT: 1.7,
                    X: 14,
                    Y: -5.5,
                    ANGLE: 155,
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], {delayIncrement: 0.5}),
        ...weaponArray(weaponMirror([
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 8,
                    Y: 5.5,
                    ANGLE: 5
                }
            },
            {
                POSITION: {
                    LENGTH: 3.25,
                    WIDTH: 8,
                    ASPECT: 1.7,
                    X: 14,
                    Y: 5.5,
                    ANGLE: 5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.twin, g.doubleTwin, g.hewnDouble]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ], {delayIncrement: 0.5}), 2)
    ]
}
Class.warlock_AR = {
    PARENT: "genericTank",
    LABEL: "Warlock",
    DANGER: 8,
    NECRO: [5],
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.1,
    },
    SHAPE: 5,
    GUNS: [
        ...Class.pentaseer_AR.GUNS,
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 7.4,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, {reload: 0.8}]),
                TYPE: "sunchip",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 5
            }
        }
    ]
}
Class.whirl4_AR = makeWhirlwind("auto4", {label: "Whirl-4"})
Class.whirl5_AR = makeWhirlwind("auto5", {label: "Whirl-5"})
Class.whirlbar_AR = makeWhirlwind("crowbar_AR", {label: "Whirlbar"})
Class.wiper_AR = makeGunner('annihilator', "Wiper", {rear: true})
Class.witch_AR = {
    PARENT: "genericTank",
    LABEL: "Witch",
    DANGER: 8,
    NECRO: [5],
    TOOLTIP: "Press R and wait to turn your drones invisible.",
    STAT_NAMES: statnames.necro,
    BODY: {
        SPEED: base.SPEED * 0.85,
        FOV: base.FOV * 1.1
    },
    SHAPE: 5,
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 12,
                ASPECT: 1.2,
                X: 7.4,
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.sunchip, g.maleficitor, {size: 1.5}]),
                TYPE: ["pentaseerSunchip_AR", {INVISIBLE: [0.06, 0.03]}],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "necro",
                WAIT_TO_CYCLE: true,
                DELAY_SPAWN: false,
                MAX_CHILDREN: 10
            }
        }
    ]
}
Class.harpy_AR = makeGunner('falcon', "Harpy", {rear: true, length: 20, renderBehind: true})
Class.xCourser_AR = {
    PARENT: "genericTank",
    LABEL: "X-Courser",
    DANGER: 8,
    ...todo_placeholder_guns,
    GUNS: [
        {
            POSITION: {
                LENGTH: 27,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 11
            }
        },
        {
            POSITION: {
                LENGTH: 17,
                WIDTH: 11,
                ASPECT: -1.35
            }
        },
        {
            POSITION: {
                LENGTH: 12.5,
                WIDTH: 12,
                ASPECT: -1.65
            }
        }
    ]
}
Class.xNimrod_AR = {
    PARENT: "genericTank",
    LABEL: "X-Nimrod",
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.3
    },
    CONTROLLERS: [["zoom", { distance: 550 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 6.5,
                ASPECT: 2.2
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 6.4,
                ASPECT: 2.2,
                X: 5
            }
        },
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.marksman]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.marksman]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12.5,
                WIDTH: 11,
                ASPECT: -1.65
            }
        }
    ]
}
Class.xPredator_AR = {
    PARENT: "genericTank",
    LABEL: "X-Predator",
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: [["zoom", { distance: 550 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary, g.hunterSecondary, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
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
                LENGTH: 18,
                WIDTH: 14,
                DELAY: 0.3
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 12.5,
                WIDTH: 14,
                ASPECT: -1.325
            }
        }
    ]
}
Class.yHunter_AR = {
    PARENT: "genericTank",
    LABEL: "Y-Hunter",
    DANGER: 8,
    BODY: {
        SPEED: base.SPEED * 0.9,
        FOV: base.FOV * 1.25
    },
    CONTROLLERS: [["zoom", { distance: 775 }]],
    TOOLTIP: "Hold right click to zoom.",
    GUNS: [
        {
            POSITION: {
                LENGTH: 24,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.hunterSecondary]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 11,
                DELAY: 0.25
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 11,
                ASPECT: -1.35,
                X: 12.5
            }
        },
        {
            POSITION: {
                LENGTH: 11.5,
                WIDTH: 15
            }
        }
    ]
}
Class.zephyr_AR = makeGunner('slinker_AR', "Zephyr", {rear: true})

// Tier 5 (are we deadass)
Class.custodian_AR = makeGuard('single', "Custodian")

// Quick Defining
const quickMake = (type, options = {}) => {
    name = ensureIsClass(type)
    if (options.bird) {
        let classLabel = options.bird.charAt(0).toLowerCase() + options.bird.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeBird(type, options.bird)
    }
    if (options.drive) {
        let classLabel = options.drive.charAt(0).toLowerCase() + options.drive.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeDrive(type, {label: options.drive})
    }
    if (options.hybrid) {
        let classLabel = options.hybrid.charAt(0).toLowerCase() + options.hybrid.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeOver(type, options.hybrid, preset.makeOver.hybrid)
    }
    if (options.hybrid2) {
        let classLabel = options.hybrid2.charAt(0).toLowerCase() + options.hybrid2.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeOver(type, options.hybrid2, {...preset.makeOver.hybrid, renderBehind: true})
    }
    if (options.over) {
        Class[options.over.charAt(0).toLowerCase() + options.over.slice(1) + "_AR"] = makeOver(type, options.over)
    }
    if (options.cross) {
        let classLabel = options.cross.charAt(0).toLowerCase() + options.cross.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeOver(type, options.cross, {count: 3, angle: 90})
    }
    if (options.synth) {
        let classLabel = options.synth.charAt(0).toLowerCase() + options.synth.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeBattle(type, options.synth, preset.makeOver.hybrid)
    }
    if (options.battle) {
        Class[options.battle.charAt(0).toLowerCase() + options.battle.slice(1) + "_AR"] = makeBattle(type, options.battle)
    }
    if (options.underbridplaceholder) {
        let classLabel = options.underbridplaceholder.charAt(0).toLowerCase() + options.underbridplaceholder.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeUnder(type, options.underbridplaceholder, {...preset.makeOver.hybrid, shape: 4})
    }
    if (options.under) {
        Class[options.under.charAt(0).toLowerCase() + options.under.slice(1) + "_AR"] = makeUnder(type, options.under)
    }
    if (options.necro) {
        Class[options.necro.charAt(0).toLowerCase() + options.necro.slice(1) + "_AR"] = makeUnder(type, options.necro, {count: 3, angle: 90, shape: 4})
    }
    if (options.mummy) {
        Class[options.mummy.charAt(0).toLowerCase() + options.mummy.slice(1) + "_AR"] = makeMummy(type, options.mummy)
    }
    if (options.penta) {
        Class[options.penta.charAt(0).toLowerCase() + options.penta.slice(1) + "_AR"] = makePenta(type, options.penta)
    }
    if (options.enact) {
        let classLabel = options.enact.charAt(0).toLowerCase() + options.enact.slice(1).replaceAll(' ', '').replaceAll('-', '')
        Class[classLabel + "_AR"] = makeCap(type, options.enact, preset.makeOver.hybrid)
    }
    if (options.cap) {
        Class[options.cap.charAt(0).toLowerCase() + options.cap.slice(1) + "_AR"] = makeCap(type, options.cap)
    }
}
quickMake("accurator", {hybrid: "Accugator"})
quickMake("annihilator", {hybrid: "Compound"})
quickMake("artillery", {hybrid: "Force", over: "Overartillery", synth: "Mixer", under: "Underartillery"})
quickMake("assassin", {hybrid: "Hitman", over: "Overassassin", under: "Underassassin"})
quickMake("banshee", {drive: "Bansheedrive"})
quickMake("barricade", {hybrid: "Rampart"})
quickMake("bentGunner_AR", {bird: "Donkey", hybrid: "Spambrid"})
quickMake("bentMinigun_AR", {hybrid: "Junker"})
quickMake("blaster", {hybrid: "Ripoff", over: "Overblaster", under: "Underblaster"})
quickMake("blower", {hybrid: "Puffer"})
quickMake("booster", {hybrid2: "Hightailer"})
quickMake("builder", {hybrid: "Fashioner", over: "Overbuilder", under: "Underbuilder"})
quickMake("buttbuttin", {hybrid: "Mercenary"})
quickMake("captain_AR", {drive: "Captaindrive"})
quickMake("cog_AR", {hybrid: "Contriver"})
quickMake("construct", {hybrid: "Meld"})
quickMake("courser_AR", {hybrid: "Immolator"})
quickMake("destroyer", {bird: "Harrier", over: "Overdestroyer", synth: "Synthesis", under: "Underdestroyer", enact: "Enactor"})
quickMake("diesel_AR", {hybrid: "Polluter", over: "Overdiesel", under: "Underdiesel"})
quickMake("dieselTrapper_AR", {hybrid: "Blight"})
quickMake("director", {drive: "Directordrive"})
quickMake("dopeseer_AR", {drive: "Dopedrive"})
quickMake("doper_AR", {drive: "Doperdrive"})
quickMake("dual", {hybrid: "Ravisher"})
quickMake("encircler_AR", {hybrid: "Environ"})
quickMake("enforcer_AR", {hybrid: "Slayer"})
quickMake("engineer", {hybrid: "Machinist"})
quickMake("expeller_AR", {hybrid: "Throttler"})
quickMake("fighter", {hybrid2: "Pug"})
quickMake("flamethrower", {hybrid: "Imitation"})
quickMake("foreman_AR", {drive: "Foredrive"})
quickMake("gatlingGun", {hybrid: "Gator", over: "Overgatling", under: "Undergatling"})
quickMake({
    PARENT: "genericTank",
    LABEL: "Gunner",
    DANGER: 6,
    GUNS: [
        ...weaponMirror({
            POSITION: {
                LENGTH: 19,
                WIDTH: 2,
                Y: -2.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, { speed: 0.7, maxSpeed: 0.7 }, g.flankGuard, { recoil: 1.8 }]),
                TYPE: "bullet"
            }
        }, {delayIncrement: 0.5}),
        {
            POSITION: {
                LENGTH: 12,
                WIDTH: 11
            }
        }
    ]
}, {cross: "Despot", battle: "Battlegunner", under: "Undergunner", necro: "Necrogunner", mummy: "Mummygunner", penta: "Pentagunner", cap: "Capgunner"})
quickMake("helix", {hybrid: "Hybrix"})
quickMake("honcho_AR", {drive: "Honchodrive"})
quickMake("hunter", {over: "Overhunter", synth: "Plunderer", under: "Underhunter"})
quickMake("hurler_AR", {hybrid: "Mongrel"})
quickMake("hutch_AR", {hybrid: "Retainer"})
quickMake("infestor", {drive: "Infestordrive"})
quickMake("launcher", {hybrid: "Heaver", over: "Overlauncher", under: "Underlauncher"})
quickMake("machineMech_AR", {hybrid: "Repairman"})
quickMake("machineTrapper_AR", {hybrid: "Deviation", over: "Overmach", synth: "Anomaly", under: "Undermach", enact: "Sire"})
quickMake("manager", {drive: "Managerdrive"})
quickMake("marksman", {hybrid: "Hybrid Marksman", over: "Overmarksman", under: "Undermarksman"})
quickMake("minigun", {over: "Overminigun", synth: "Trimmer", under: "Underminigun", enact: "Shearer"})
quickMake("mech_AR", {hybrid: "Cobbler", over: "Overmech", synth: "Fuser", under: "Undermech", enact: "Automaton"})
quickMake("megaTrapper_AR", {hybrid: "Catcher", bird: "Shoebill"})
quickMake("musket", {hybrid: "Matchlock"})
quickMake("nailgun", {over: "Overnailer", under: "Undernailer"})
quickMake("necromancer", {drive: "Necrodrive"})
quickMake("nimrod", {hybrid: "Nacho"})
quickMake("operator_AR", {hybrid: "Utilizer"})
quickMake("overgunner", {drive: "Overgunnerdrive"})
quickMake("overlord", {drive: "Tyrant"})
quickMake("overtrapper", {drive: "Overtrapperdrive"})
quickMake("pen_AR", {bird: "Cockatiel", hybrid: "Interner", over: "Overpen", under: "Underpen"})
quickMake("pentaShot", {bird: "Deficiency", hybrid: "Flexed Hybrid"})
quickMake("pentaseer_AR", {drive: "Pentadrive"})
quickMake("queller_AR", {hybrid: "Cross"})
quickMake("railgun_AR", {bird: "Raven"})
quickMake("ranger", {hybrid: "Doorman"})
quickMake("rifle", {over: "Overrifle", under: "Underrifle"})
quickMake("rimfire_AR", {over: "Harbinger", under: "Bellwether"})
quickMake("rotaryGun_AR", {hybrid: "Rotator"})
quickMake("single", {bird: "Avian", hybrid: "Assistant"})
quickMake("slinker_AR", {hybrid: "Amalgam"})
quickMake("spawner", {drive: "Spawnerdrive"})
quickMake("splitShot_AR", {bird: "Dork", hybrid: "Split Hybrid"})
quickMake("splasher", {hybrid: "Bargain"})
quickMake("sprayer", {hybrid: "Shower", over: "Oversprayer", under: "Undersprayer"})
quickMake("spreadshot", {bird: "Bozo", hybrid: "Smearer"})
quickMake("stalker", {hybrid: "Trailer"})
quickMake("subverter", {hybrid: "Deposer"})
quickMake("surfer", {hybrid2: "Skater"})
quickMake({
    PARENT: "genericTank",
    LABEL: "Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 14,
                WIDTH: 8
            }
        },
        {
            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: 1.5,
                X: 14
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}, {cross: "Kingpin", battle: "Battletrapper", under: "Undertrapper", necro: "Necrotrapper", mummy: "Mummytrapper", penta: "Pentatrapper", cap: "Captrapper"})
quickMake("triAngle", {hybrid2: "Integrator", under: "Underangle"})
quickMake("triBlaster", {bird: "Leak", hybrid: "Bootleg"})
quickMake("tripleShot", {bird: "Defect", over: "Overshot", synth: "Bent Synthesis", under: "Undershot", enact: "Hatcher"})
quickMake("triplet", {bird: "Nitwit", hybrid: "Triprid"})
quickMake("triplex", {bird: "Nitwix", hybrid: "Triprix"})
quickMake("underseer", {drive: "Underdrive"})
quickMake("volley_AR", {hybrid: "Volley Hybrid"})
quickMake("waarrk_AR", {bird: "Fault", hybrid: "Bent Catcher"})
quickMake("wark_AR", {hybrid: "Coalesce", over: "Overwark", under: "Underwark"})
quickMake("xHunter", {hybrid: "X-Poacher"})

makeAutoArray([
    "artillery",
    "assassin",
    "auto3",
    "blaster",
    "builder",
    "cog_AR",
    "cruiser",
    "destroyer",
    "diesel_AR",
    "doper_AR",
    "doubleMachine",
    "gatlingGun",
    "gunner",
    "halfNHalf",
    "helix",
    "hexaTank",
    "honcho_AR",
    "hunter",
    "launcher",
    "machineTrapper_AR",
    "marksman",
    "mech_AR",
    "minigun",
    "overseer",
    "pen_AR",
    "repeater",
    "rifle",
    "spawner",
    "spiral",
    "sprayer",
    "trapGuard",
    "triAngle",
    "tripleShot",
    "underseer",
    "volute",
    "wark_AR"
], {tier: 1, suffix: "_AR"})
makeAutoArray([
    "accurator",
    "annihilator",
    "armsman",
    "atomizer",
    "auto4",
    "auto5",
    "barricade",
    "battery",
    "bentDouble",
    "bentGunner_AR",
    "bentHybrid",
    "bentMinigun_AR",
    "blower",
    "bomber",
    "booster",
    "bulwark",
    "bushwhacker",
    "buttbuttin",
    "coalesce_AR",
    "cobbler_AR",
    "cockatiel_AR",
    "coil",
    "combo_AR",
    "courser_AR",
    "cropDuster",
    "crossbow",
    "cyclone",
    "deadeye",
    "deathStar",
    "defect_AR",
    "deviation_AR",
    "doubleArtillery_AR",
    "doubleBlaster_AR",
    "doubleDiesel_AR",
    "doubleGatling_AR",
    "doubleGunner_AR",
    "doubleHelix_AR",
    "doubleMinigun_AR",
    "doubleSprayer_AR",
    "dual",
    "duplicator",
    "eagle",
    "enforcer_AR",
    "equalizer_AR",
    "expeller_AR",
    "falcon",
    "faucet_AR",
    "fighter",
    "flamethrower",
    "foamer_AR",
    "focal",
    "fork",
    "frother_AR",
    "gunnerTrapper",
    "hewnDouble",
    "hitman_AR",
    "hutch_AR",
    "hybrid",
    "hybridMarksman_AR",
    "infestor",
    "integrator_AR",
    "iterator",
    "machineGunner",
    "maleficitor",
    "manager",
    "megaHunter_AR",
    "mingler_AR",
    "mortar",
    "mummifier_AR",
    "musket",
    "nailgun",
    "necromancer",
    "nimrod",
    "octoTank",
    "ordnance",
    "overlord",
    "overgunner",
    "overtrapper",
    "pentaShot",
    "pentaseer_AR",
    "phoenix",
    "poacher",
    "predator",
    "prober_AR",
    "prodigy",
    "quadAngle_AR",
    "quadruplex",
    "railgun_AR",
    "ranger",
    "redistributor",
    "revolver",
    "rimfire_AR",
    "ripoff_AR",
    "shower_AR",
    "single",
    "sniper3_AR",
    "splasher",
    "splitShot_AR",
    "spreadshot",
    "stalker",
    "stormer_AR",
    "streamliner",
    "subverter",
    "superSpiral",
    "surfer",
    "triBlaster",
    "tripleMachine",
    "triplet",
    "triplex",
    "undergunner_AR",
    "undertrapper_AR",
    "volley_AR",
    "vulture",
    "waarrk_AR",
    "warkwark_AR",
    "widget_AR",
    "xHunter",
    "zipper_AR"
], {suffix: "_AR"})

// autodrives
Class.autoDirectordrive_AR = makeAuto("directordrive_AR", "Auto-Directordrive", preset.makeAuto.drive)
Class.autoUnderdrive_AR = makeAuto("underdrive_AR", "Auto-Underdrive", preset.makeAuto.drive)

// UNSORTED
Class.schwartz_AR = makeWhirlwind("force_AR", {label: "Schwartz"})

// Class Tree
if (!Config.arms_race == true) {return}
if (!use_original_tree) {
Config.level_cap = 60
Config.level_cap_cheat = 60

Class.menu_unused.UPGRADES_TIER_0.push("menu_unused_AR", "menu_unused2_AR")
Class.menu_unused_AR = makeMenu("Unused (Tier 4)", {upgrades: ["duster_AR", "jimmy_AR", "jumpSmasher"], boxLabel: "Tier 4 (Lv.60)"})
Class.menu_unused2_AR = makeMenu("Unused (Tier 5)", {upgrades: ["custodian_AR"], boxLabel: "Tier 5 (Lv.75)"})

//Class.basic.UPGRADES_TIER_1
    //Class.basic.UPGRADES_TIER_2
        Class.smasher.UPGRADES_TIER_3.push(/*"cocci", */"banger_AR", "drifter_AR")
            Class.megaSmasher.UPGRADES_TIER_4 = [/*"megaCocci"*/].map(x => x + "_AR")
            Class.spike.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.autoSmasher.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.landmine.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.bonker.UPGRADES_TIER_4 = ["decoy", "spear", "autoBonker", "megaBonker", "basher", "thwacker", "bundler"].map(x => x + "_AR")
            //Class.cocci.UPGRADES_TIER_4 = ["megaCocci"].map(x => x + "_AR")
            //Class.banger_AR.UPGRADES_TIER_4 = ["megaBanger", "prick", "autoBanger", "tripwire", "thwacker", "sharper"].map(x => x + "_AR")
            //Class.drifter_AR.UPGRADES_TIER_4 = ["buncher", "megaDrifter", "autoDrifter", "vessel", "cauldron", "sharper", "bundler"].map(x => x + "_AR")
        Class.healer.UPGRADES_TIER_3 = ["medic", "scientist_AR", "nurse_AR", "triHealer_AR", "analyzer_AR", "psychiatrist_AR", "soother_AR", "recalibrator_AR"]
            Class.healer.UPGRADES_TIER_4 = ["physician", "renovator"].map(x => x + "_AR")
            Class.medic.UPGRADES_TIER_4 = ["intern", "ointment", "injection", "actuary"].map(x => x + "_AR")
            Class.scientist_AR.UPGRADES_TIER_4 = ["surgeon", "professor_AR", "chemist_AR", "scribble_AR"/*, [MECH HEALER], [MACHTRAP HEALER]*/, "kraw_AR"]
            Class.nurse_AR.UPGRADES_TIER_4 = ["paramedic", "therapist_AR", "clinician_AR", "hexaHealer_AR", "geneticist_AR", "kraw_AR"]
            Class.triHealer_AR.UPGRADES_TIER_4 = ["ambulance", "healer3_AR", "hexaHealer_AR", "chemist_AR", "professor_AR"]
            Class.analyzer_AR.UPGRADES_TIER_4 = ["accountant_AR", "clerk_AR", "guru_AR", "surgeon"]
            Class.psychiatrist_AR.UPGRADES_TIER_4 = ["therapist", "guru", "actuary", "PLACEHOLDER_healerSprayer"/*, [DIESEL HEALER], [MACHTRAP HEALER]*/].map(x => x + "_AR")
            Class.soother_AR.UPGRADES_TIER_4 = ["doctor", "antidote", "medicare", "PLACEHOLDER_healerOverseer", "PLACEHOLDER_healerUnderseer", "sootherdrive", "spiker"].map(x => x + "_AR")
            Class.recalibrator_AR.UPGRADES_TIER_4 = ["geneticist"].map(x => x + "_AR")

    Class.twin.UPGRADES_TIER_2.push("wark_AR")
        deleteUpgrade("twin", 3, "bulwark")
            Class.twin.UPGRADES_TIER_4 = ["duo"].map(x => x + "_AR")
            Class.dual.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.musket.UPGRADES_TIER_4 = [].map(x => x + "_AR")
        Class.doubleTwin.UPGRADES_TIER_3.push("doubleFlankTwin_AR", "doubleGunner_AR", "doubleHelix_AR", "warkwark_AR")
            Class.doubleTwin.UPGRADES_TIER_4 = ["doubleDual", "doubleMusket", "overdoubleTwin", "underdoubleTwin"].map(x => x + "_AR")
            Class.tripleTwin.UPGRADES_TIER_4 = ["quadTwin", "hewnTriple", "autoTriple", "bentTriple", "tripleFlankTwin", "tripleGunner", "tripleHelix", "warkwarkwark"].map(x => x + "_AR")
            Class.hewnDouble.UPGRADES_TIER_4 = ["hewnTriple", "skewnDouble", "autoHewnDouble", "cleft", "hewnFlankDouble", "hewnGunner"/*, "hewnHelix"*/, "warkwawarkrk"].map(x => x + "_AR")
            Class.autoDouble.UPGRADES_TIER_4 = ["megaAutoDouble", "tripleAutoDouble", "autoTriple", "autoHewnDouble", "autoBentDouble", "autoDoubleFlank", "autoDoubleGunner", "autoDoubleHelix", "autoWarkwark"].map(x => x + "_AR")
            Class.bentDouble.UPGRADES_TIER_4 = ["bentTriple", "flexedDouble", "autoBentDouble", "doubleTriplet", "doubleTriplex", "cleft"/*, "doubleSpreadshot", "bentFlankDouble", "bentDoubleGunner", "bentDoubleMinigun", "splitDouble", "waarrkwaarrk"*/].map(x => x + "_AR")
            Class.doubleFlankTwin_AR.UPGRADES_TIER_4 = ["quadTwin", "tripleFlankTwin", "hewnFlankDouble", "autoDoubleFlank"/*, "bentFlankDouble", "doubleFlankGunner*/, "doubleFlankHelix"/*, "hipwatch", "scuffler", "warkwawawark"*/].map(x => x + "_AR")
            Class.doubleGunner_AR.UPGRADES_TIER_4 = ["tripleGunner", "hewnGunner", "autoDoubleGunner"/*, "bentDoubleGunner", "doubleFlankGunner", "doubleNailgun", "doubleMachineGunner", "overdoubleGunner", "doubleBattery", "doubleRimfire"*/, "doubleVolley"/*, "doubleEqualizer"*/].map(x => x + "_AR")
            Class.doubleHelix_AR.UPGRADES_TIER_4 = ["tripleHelix"/*, "hewnHelix"*/, "autoDoubleHelix", "doubleTriplex", "doubleFlankHelix"].map(x => x + "_AR")
            Class.warkwark_AR.UPGRADES_TIER_4 = ["warkwarkwark", "warkwawarkrk", "autoWarkwark"/*, "waarrkwaarrk", "warkwawawark", "doubleEqualizer", "guardrail", "sealer", "setup"*/].map(x => x + "_AR")
        Class.tripleShot.UPGRADES_TIER_3.push("splitShot_AR", "autoTripleShot_AR", "bentGunner_AR", "bentMinigun_AR", "defect_AR", "waarrk_AR")
            Class.tripleShot.UPGRADES_TIER_4 = [/*"threefold", "flintlock"*/].map(x => x + "_AR")
            Class.pentaShot.UPGRADES_TIER_4 = [/*"heptaShot", */"flexedDouble", "flexedHybrid", "quintuplet", "quintuplex"/*, "crackshot"*/, "autoPentaShot"/*, "flexedGunner", "flexedMinigun"*/, "deficiency"/*, "waarararrk"*/].map(x => x + "_AR")
            Class.spreadshot.UPGRADES_TIER_4 = [/*"doubleSpreadshot", "*/"smearer", "autoSpreadshot"/*, "dauber", "ballista"*/, "bozo"/*, "fungus"*/].map(x => x + "_AR")
            Class.bentHybrid.UPGRADES_TIER_4 = ["overshot", "bentSynthesis", "hatcher"/*, "bentHybriddrive", "bentCrossbreed"*/, "flexedHybrid", "smearer", "splitHybrid", "autoBentHybrid", "spambrid", "junker", "triprid", "triprix", "bentCatcher"].map(x => x + "_AR")
            //Class.bentDouble.UPGRADES_TIER_4
            Class.triplet.UPGRADES_TIER_4 = ["quintuplet", "triprid", "doubleTriplet", "autoTriplet"/*, "lasher", "minilet"*/, "nitwit"/*, "warklet"*/].map(x => x + "_AR")
            Class.triplex.UPGRADES_TIER_4 = ["quintuplex", "triprix", "doubleTriplex", "autoTriplex", "nitwix"].map(x => x + "_AR")
            Class.splitShot_AR.UPGRADES_TIER_4 = [/*"slitShot", "crackshot", */"splitHybrid"/*, "splitDouble"*/, "autoSplitShot"/*, "hackshot"*/, "dork"/*, "splinterShot*/].map(x => x + "_AR")
            Class.autoTripleShot_AR.UPGRADES_TIER_4 = ["megaAutoTripleShot", "tripleAutoTripleShot", "autoPentaShot", "autoSpreadshot", "autoBentHybrid", "autoBentDouble", "autoTriplet", "autoTriplex", "autoSplitShot", "autoBentGunner", "autoBentMinigun", "autoDefect", "autoWaarrk"].map(x => x + "_AR")
            Class.bentGunner_AR.UPGRADES_TIER_4 = [/*"flexedGunner", */"spambrid"/*, "bentDoubleGunner"*/, "autoBentGunner"/*, "dagger", "bentVolley"*/, "donkey"].map(x => x + "_AR")
            Class.bentMinigun_AR.UPGRADES_TIER_4 = [/*"flexedMinigun", "bentDoubleMinigun", */"junker"/*, "hackshot", "minilet", "bentStreamliner", "bentBarricade", "bentSubverter", "jerker", "sizzler"*/, "autoBentMinigun"/*, "bentWidget"*/].map(x => x + "_AR")
            Class.defect_AR.UPGRADES_TIER_4 = ["deficiency", "bozo", "nitwit", "nitwix", "dork", "donkey"/*, "mangle", "loon", "klutz", "jerker"*/, "fault", "autoDefect"].map(x => x + "_AR")
            Class.waarrk_AR.UPGRADES_TIER_4 = [/*"waarararrk", "fungus", */"bentCatcher"/*, "waarrkwaarrk", "warklet", "splinterShot"*/, "autoWaarrk"/*, "dagger", "bentBarricade"*/, "fault"/*, "bentBulwark", "brig", "yard", "spitter"*/].map(x => x + "_AR")
        Class.gunner.UPGRADES_TIER_3.push("rimfire_AR", "volley_AR", "doubleGunner_AR", "bentGunner_AR", "equalizer_AR")
            Class.autoGunner.UPGRADES_TIER_4 = ["megaAutoGunner", "tripleAutoGunner"].map(x => x + "_AR")
            Class.nailgun.UPGRADES_TIER_4 = ["autoNailgun"].map(x => x + "_AR")
            Class.auto4.UPGRADES_TIER_4 = ["autoAuto4"].map(x => x + "_AR")
            Class.machineGunner.UPGRADES_TIER_4 = ["autoMachineGunner"].map(x => x + "_AR")
            Class.gunnerTrapper.UPGRADES_TIER_4 = ["autoGunnerTrapper"].map(x => x + "_AR")
            Class.cyclone.UPGRADES_TIER_4 = ["tornado"/*, "dustStorm"*/, "autoCyclone"/*, "tempest", "gale", "whirlwind", "trove"*/].map(x => x + "_AR")
            Class.overgunner.UPGRADES_TIER_4 = ["harbinger", "overnailer", "oracle", "autoOvergunner", "despot", "battlegunner", "capgunner"/*, "foregunner", "overdoubleGunner", "overequalizer"*/].map(x => x + "_AR")
            Class.battery.UPGRADES_TIER_4 = ["autoBattery"].map(x => x + "_AR")
            Class.buttbuttin.UPGRADES_TIER_4 = ["autoButtbuttin"].map(x => x + "_AR")
            Class.blower.UPGRADES_TIER_4 = ["autoBlower"].map(x => x + "_AR")
            Class.rimfire_AR.UPGRADES_TIER_4 = ["harbinger", "bellwether", "autoRimfire"].map(x => x + "_AR")
            Class.volley_AR.UPGRADES_TIER_4 = [/*"cannonade", "volley4", "tornado", "pummeler", "barrage", */"autoVolley", "doubleVolley"/*, "machineVolley*/, "volleyHybrid"].map(x => x + "_AR")
            //Class.doubleGunner_AR.UPGRADES_TIER_4
            //Class.bentGunner_AR.UPGRADES_TIER_4
            Class.equalizer_AR.UPGRADES_TIER_4 = ["autoEqualizer"].map(x => x + "_AR")
        Class.hexaTank.UPGRADES_TIER_3.push("autoHexaTank_AR", "mingler_AR", "combo_AR")
            Class.hexaTank.UPGRADES_TIER_4 = ["tripleFlankTwin", "hextuplex"].map(x => x + "_AR")
            Class.octoTank.UPGRADES_TIER_4 = ["decaTank", "octoTrapper", "demise", "autoOctoTank"].map(x => x + "_AR")
            //Class.cyclone.UPGRADES_TIER_4
            Class.hexaTrapper.UPGRADES_TIER_4 = ["megaHexaTrapper", "autoHexaTrapper", "octoTrapper"].map(x => x + "_AR")
            Class.deathStar.UPGRADES_TIER_4 = ["demise", "autoDeathStar"].map(x => x + "_AR")
            Class.autoHexaTank_AR.UPGRADES_TIER_4 = ["megaAutoHexaTank", "tripleAutoHexaTank", "autoOctoTank", "autoCyclone", "autoDeathStar", "autoMingler", "autoCombo"].map(x => x + "_AR")
            Class.mingler_AR.UPGRADES_TIER_4 = ["autoMingler"].map(x => x + "_AR")
            Class.combo_AR.UPGRADES_TIER_4 = ["autoCombo"].map(x => x + "_AR")
        Class.helix.UPGRADES_TIER_3.push("doubleHelix_AR", "hybrix_AR", "autoHelix_AR")
            //Class.triplex.UPGRADES_TIER_4
            Class.quadruplex.UPGRADES_TIER_4 = ["hextuplex", "autoQuadruplex"].map(x => x + "_AR")
            Class.hybrix_AR.UPGRADES_TIER_4 = ["triprix"].map(x => x + "_AR")
            Class.autoHelix_AR.UPGRADES_TIER_4 = ["megaAutoHelix", "tripleAutoHelix", "autoTriplex", "autoQuadruplex"].map(x => x + "_AR")
        Class.wark_AR.UPGRADES_TIER_3 = ["warkwark_AR", "waarrk_AR", "equalizer_AR", "hexaTrapper", "hutch_AR", "cog_AR", "expeller_AR", "bulwark", "coalesce_AR", "autoWark_AR"]
            //Class.warkwark_AR.UPGRADES_TIER_4
            //Class.waarrk_AR.UPGRADES_TIER_4
            //Class.equalizer_AR.UPGRADES_TIER_4
            //Class.hexaTrapper.UPGRADES_TIER_4
            Class.hutch_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.cog_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.expeller_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.bulwark.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.coalesce_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.autoWark_AR.UPGRADES_TIER_4 = ["megaAutoWark", "tripleAutoWark"].map(x => x + "_AR")

    //Class.sniper.UPGRADES_TIER_2
        Class.sniper.UPGRADES_TIER_3.push("railgun_AR")
            Class.sniper.UPGRADES_TIER_4 = ["sharpshooter"].map(x => x + "_AR")
            Class.bushwhacker.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.railgun_AR.UPGRADES_TIER_4 = ["raven"].map(x => x + "_AR")
        Class.assassin.UPGRADES_TIER_3.push("hitman_AR", "sniper3_AR", "enforcer_AR", "courser_AR")
            Class.ranger.UPGRADES_TIER_4 = ["mono"].map(x => x + "_AR")
            Class.stalker.UPGRADES_TIER_4 = ["spy"].map(x => x + "_AR")
            Class.falcon.UPGRADES_TIER_4 = ["avian", "autoFalcon"].map(x => x + "_AR")
            Class.autoAssassin.UPGRADES_TIER_4 = ["megaAutoAssassin", "tripleAutoAssassin", "autoSingle", "autoDeadeye"].map(x => x + "_AR")
            Class.single.UPGRADES_TIER_4 = ["duo", "sharpshooter", "gadgetGun", "ternion", "coordinator", "bruiser", "tricker"/*, [DESMOS SINGLE]*/, "mono", "avian", "assistant", "autoSingle", "spy", "cyclops", "orifice", "pistol", "subduer"].map(x => x + "_AR") // custodian is overtiered garbage :fire:
                //Class.ternion.UPGRADES_TIER_5 = ["custodian"].map(x => x + "_AR")
                //Class.tricker.UPGRADES_TIER_5 = ["custodian"].map(x => x + "_AR")
            Class.deadeye.UPGRADES_TIER_4 = ["cyclops", "autoDeadeye"].map(x => x + "_AR")
            Class.buttbuttin.UPGRADES_TIER_4 = [/*"baton", */"marine", "harpy", "tailer", "orifice"/*, "fang", "barber"*/, "mercenary", "autoButtbuttin", "armament", "sifter"].map(x => x + "_AR")
            Class.hitman_AR.UPGRADES_TIER_4 = ["overassassin"/*, "gunman", "formulator", "hitmandrive", "contractor"*/, "doorman", "trailer", "autoHitman", "assistant"/*, HYBRID_DEADEYE*/, "mercenary", "slayer", "immolator"].map(x => x + "_AR")
            Class.enforcer_AR.UPGRADES_TIER_4 = ["pistol"].map(x => x + "_AR")
            Class.courser_AR.UPGRADES_TIER_4 = ["subduer", "xCourser"].map(x => x + "_AR")
        Class.hunter.UPGRADES_TIER_3.push("autoHunter_AR", "megaHunter_AR", "prober_AR", "courser_AR")
            Class.predator.UPGRADES_TIER_4 = ["carnivore", "xPredator", "autoPredator"].map(x => x + "_AR")
            Class.xHunter.UPGRADES_TIER_4 = ["yHunter", "xPredator", "xPoacher", "xNimrod", "autoXHunter", "xCourser"].map(x => x + "_AR")
            Class.poacher.UPGRADES_TIER_4 = ["xPoacher", "nacho"].map(x => x + "_AR")
            Class.ordnance.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.dual.UPGRADES_TIER_4
            Class.nimrod.UPGRADES_TIER_4 = ["xNimrod", "nacho", "autoNimrod"].map(x => x + "_AR")
            Class.autoHunter_AR.UPGRADES_TIER_4 = ["megaAutoHunter", "tripleAutoHunter", "autoXHunter", "autoNimrod"].map(x => x + "_AR")
            Class.megaHunter_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.prober_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.courser_AR.UPGRADES_TIER_4
        Class.minigun.UPGRADES_TIER_3.push("zipper_AR", "bentMinigun_AR", "autoMinigun_AR", "widget_AR", "piercer_AR")
            Class.streamliner.UPGRADES_TIER_4 = ["rationalizer", "autoStreamliner"].map(x => x + "_AR")
            //Class.nailgun.UPGRADES_TIER_4
            Class.cropDuster.UPGRADES_TIER_4 = ["autoCropDuster"].map(x => x + "_AR")
            Class.barricade.UPGRADES_TIER_4 = ["autoBarricade"].map(x => x + "_AR")
            Class.vulture.UPGRADES_TIER_4 = ["autoVulture"].map(x => x + "_AR")
            Class.subverter.UPGRADES_TIER_4 = ["destabilizer", "deposer", "toppler", "autoSubverter", "bentSubverter"].map(x => x + "_AR")
            Class.zipper_AR.UPGRADES_TIER_4 = ["autoZipper"].map(x => x + "_AR")
            //Class.bentMinigun_AR.UPGRADES_TIER_4
            Class.autoMinigun_AR.UPGRADES_TIER_4 = ["megaAutoMinigun", "tripleAutoMinigun"].map(x => x + "_AR")
            Class.widget_AR.UPGRADES_TIER_4 = ["autoWidget"].map(x => x + "_AR")
        Class.rifle.UPGRADES_TIER_3.push("autoRifle_AR", "enforcer_AR", "prober_AR")
            //Class.musket.UPGRADES_TIER_4
            Class.crossbow.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.armsman.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.revolver.UPGRADES_TIER_4 = ["autoRevolver"].map(x => x + "_AR")
            Class.autoRifle_AR.UPGRADES_TIER_4 = ["megaAutoRifle", "tripleAutoRifle", "autoRevolver"].map(x => x + "_AR")
            //Class.enforcer_AR.UPGRADES_TIER_4
            //Class.prober_AR.UPGRADES_TIER_4
        Class.marksman.UPGRADES_TIER_3.push("piercer_AR", "hybridMarksman_AR", "autoMarksman_AR")
            //Class.deadeye.UPGRADES_TIER_4
            //Class.nimrod.UPGRADES_TIER_4
            //Class.revolver.UPGRADES_TIER_4
            Class.fork.UPGRADES_TIER_4 = ["autoFork"].map(x => x + "_AR")
            Class.hybridMarksman_AR.UPGRADES_TIER_4 = ["overmarksman", "autoHybridMarksman"].map(x => x + "_AR")
            Class.autoMarksman_AR.UPGRADES_TIER_4 = ["megaAutoMarksman", "tripleAutoMarksman", "autoDeadeye", "autoNimrod", "autoRevolver", "autoFork", "autoHybridMarksman"].map(x => x + "_AR")

    Class.machineGun.UPGRADES_TIER_2.push("diesel_AR", "machineTrapper_AR")
        //Class.machineGun.UPGRADES_TIER_3
            Class.machineGun.UPGRADES_TIER_4 = ["gadgetGun"].map(x => x + "_AR")
        Class.artillery.UPGRADES_TIER_3.push("queller_AR", "forger_AR", "force_AR", "autoArtillery_AR", "foctillery_AR", "discharger_AR")
            Class.mortar.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.ordnance.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.beekeeper.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.fieldGun.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.queller_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.forger_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.force_AR.UPGRADES_TIER_4 = ["mixer"].map(x => x + "_AR")
            Class.autoArtillery_AR.UPGRADES_TIER_4 = ["megaAutoArtillery", "tripleAutoArtillery"].map(x => x + "_AR")
            Class.foctillery_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.discharger_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
        //Class.minigun.UPGRADES_TIER_3
        //Class.gunner.UPGRADES_TIER_3
        Class.sprayer.UPGRADES_TIER_3.push("frother_AR", "foamer_AR", "faucet_AR", "shower_AR", "autoSprayer_AR", "stormer_AR")
            Class.redistributor.UPGRADES_TIER_4 = ["autoRedistributor"].map(x => x + "_AR")
            Class.phoenix.UPGRADES_TIER_4 = ["autoPhoenix"].map(x => x + "_AR")
            Class.atomizer.UPGRADES_TIER_4 = ["scatterer", "autoAtomizer"].map(x => x + "_AR")
            Class.focal.UPGRADES_TIER_4 = ["concentrator", "autoFocal"].map(x => x + "_AR")
            Class.frother_AR.UPGRADES_TIER_4 = ["autoFrother"].map(x => x + "_AR")
            Class.foamer_AR.UPGRADES_TIER_4 = ["autoFoamer"].map(x => x + "_AR")
            Class.faucet_AR.UPGRADES_TIER_4 = ["autoFaucet"].map(x => x + "_AR")
            Class.shower_AR.UPGRADES_TIER_4 = ["oversprayer", "autoShower"].map(x => x + "_AR")
            Class.autoSprayer_AR.UPGRADES_TIER_4 = ["megaAutoSprayer", "tripleAutoSprayer", "autoRedistributor", "autoPhoenix", "autoAtomizer", "autoFocal", "autoFrother", "autoFoamer", "autoFaucet", "autoShower", "autoStormer"].map(x => x + "_AR")
            Class.stormer_AR.UPGRADES_TIER_4 = ["autoStormer"].map(x => x + "_AR")
        Class.diesel_AR.UPGRADES_TIER_3 = ["jalopy_AR", "machineGunner", "foamer_AR", "dieselTrapper_AR", "polluter_AR", "autoDiesel_AR"]
            Class.jalopy_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.machineGunner.UPGRADES_TIER_4
            //Class.foamer_AR.UPGRADES_TIER_4
            Class.dieselTrapper_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.polluter_AR.UPGRADES_TIER_4 = ["overdiesel"].map(x => x + "_AR")
            Class.autoDiesel_AR.UPGRADES_TIER_4 = ["megaAutoDiesel", "tripleAutoDiesel"].map(x => x + "_AR")
        Class.machineTrapper_AR.UPGRADES_TIER_3 = ["dieselTrapper_AR", "barricade", "equalizer_AR", "frother_AR", "machineGuard_AR", "encircler_AR", "machineMech_AR", "triMachine_AR", "expeller_AR", "autoMachineTrapper_AR", "deviation_AR"]
            //Class.dieselTrapper_AR.UPGRADES_TIER_4
            //Class.barricade.UPGRADES_TIER_4
            //Class.equalizer_AR.UPGRADES_TIER_4
            //Class.frother_AR.UPGRADES_TIER_4
            Class.machineGuard_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.encircler_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.machineMech_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.triMachine_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.expeller_AR.UPGRADES_TIER_4
            Class.autoMachineTrapper_AR.UPGRADES_TIER_4 = ["megaAutoMachineTrapper", "tripleAutoMachineTrapper"].map(x => x + "_AR")
            Class.deviation_AR.UPGRADES_TIER_4 = ["autoDeviation", "anomaly", "sire"/*, "deviationdrive"*/, "overmach"/*, "contradictor"*/, "blight", "rampart", "environ", "repairman", "throttler"].map(x => x + "_AR")

    //Class.flankGuard.UPGRADES_TIER_2
        //Class.flankGuard.UPGRADES_TIER_3
            Class.flankGuard.UPGRADES_TIER_4 = ["ternion"].map(x => x + "_AR")
        //Class.hexaTank.UPGRADES_TIER_3
        Class.triAngle.UPGRADES_TIER_3.push("cockatiel_AR", "integrator_AR", "defect_AR", "quadAngle_AR")
            Class.triAngle.UPGRADES_TIER_4 = ["raven", "shoebill"].map(x => x + "_AR")
            Class.fighter.UPGRADES_TIER_4 = ["autoFighter"].map(x => x + "_AR")
            Class.booster.UPGRADES_TIER_4 = ["autoBooster"].map(x => x + "_AR")
            //Class.falcon.UPGRADES_TIER_4
            Class.bomber.UPGRADES_TIER_4 = ["autoBomber"].map(x => x + "_AR")
            Class.autoTriAngle.UPGRADES_TIER_4 = ["megaAutoTriAngle", "tripleAutoTriAngle", "autoFighter", "autoBooster", "autoFalcon", "autoBomber", "autoSurfer", "autoEagle", "autoPhoenix", "autoVulture", "autoCockatiel", "autoIntegrator", "autoDefect", "autoQuadAngle"].map(x => x + "_AR")
            Class.surfer.UPGRADES_TIER_4 = ["autoSurfer"].map(x => x + "_AR")
            Class.eagle.UPGRADES_TIER_4 = ["harrier", "autoEagle"].map(x => x + "_AR")
            //Class.phoenix.UPGRADES_TIER_4
            Class.vulture.UPGRADES_TIER_4 = ["autoVulture"].map(x => x + "_AR")
            Class.cockatiel_AR.UPGRADES_TIER_4 = ["autoCockatiel"].map(x => x + "_AR")
            Class.integrator_AR.UPGRADES_TIER_4 = ["autoIntegrator"].map(x => x + "_AR")
            //Class.defect_AR.UPGRADES_TIER_4
            Class.quadAngle_AR.UPGRADES_TIER_4 = [/*"jimmy", */"autoQuadAngle"].map(x => x + "_AR")
        Class.auto3.UPGRADES_TIER_3.push("sniper3_AR", "crowbar_AR", "autoAuto3_AR", "combo_AR")
            Class.auto5.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.mega3.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.auto4.UPGRADES_TIER_4
            Class.banshee.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.sniper3_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.crowbar_AR.UPGRADES_TIER_4 = [/*"jimmy"*/].map(x => x + "_AR")
            Class.autoAuto3_AR.UPGRADES_TIER_4 = ["megaAutoAuto3", "tripleAutoAuto3"].map(x => x + "_AR")
            //Class.combo_AR.UPGRADES_TIER_4
        Class.trapGuard.UPGRADES_TIER_3.push("peashooter_AR", "incarcerator_AR", "mechGuard_AR", "autoTrapGuard_AR", "machineGuard_AR", "triTrapGuard_AR")
            Class.trapGuard.UPGRADES_TIER_4 = [/*"garrison", "maw", */"overtrapGuard"].map(x => x + "_AR")
            //Class.bushwhacker.UPGRADES_TIER_4
            //Class.gunnerTrapper.UPGRADES_TIER_4
            //Class.bomber.UPGRADES_TIER_4
            Class.conqueror.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.bulwark.UPGRADES_TIER_4
            Class.peashooter_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.incarcerator_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.mechGuard_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.autoTrapGuard_AR.UPGRADES_TIER_4 = ["megaAutoTrapGuard", "tripleAutoTrapGuard"].map(x => x + "_AR")
            //Class.machineGuard.UPGRADES_TIER_4
            Class.triTrapGuard_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
        Class.triTrapper.UPGRADES_TIER_3.push("prodigy", "triPen_AR", "triMech_AR", "triMachine_AR", "triTrapGuard_AR")
            Class.triTrapper.UPGRADES_TIER_4 = [/*"triBarricade", "triMegaTrapper", */"warkwarkwark"].map(x => x + "_AR")
            Class.fortress.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.hexaTrapper.UPGRADES_TIER_4
            Class.septaTrapper.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.architect.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.prodigy.UPGRADES_TIER_4 = ["omen", "autoProdigy"].map(x => x + "_AR")
            Class.triPen_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.triMech_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.triMachine_AR.UPGRADES_TIER_4
            //Class.triTrapGuard_AR.UPGRADES_TIER_4

    Class.director.UPGRADES_TIER_2.push("directordrive_AR", "honcho_AR", "doper_AR")
        deleteUpgrade("director", 3, "bigCheese")
            Class.director.UPGRADES_TIER_4 = ["coordinator"].map(x => x + "_AR")
            Class.manager.UPGRADES_TIER_4 = ["leader", "inspector", "managerdrive", "autoManager"].map(x => x + "_AR")
        Class.overseer.UPGRADES_TIER_3.push("captain_AR", "foreman_AR", "dopeseer_AR")
            Class.overseer.UPGRADES_TIER_4 = ["inspector", "overdoubleTwin", "overshot", "overassassin", "overhunter", "overminigun", "overrifle", "overmarksman", "overartillery", "oversprayer", "overdiesel", "overangle", "overdestroyer", "overlauncher"].map(x => x + "_AR")
            Class.overtrapper.UPGRADES_TIER_4 = ["kingpin", "overmach", "autoOvertrapper", "overtrapperdrive", "battletrapper", "captrapper"/*, "foretrapper"*/, "overbuilder", "overtrapGuard", "overpen", "overmech", "overwark"].map(x => x + "_AR")
            //Class.overgunner.UPGRADES_TIER_4
            //Class.banshee.UPGRADES_TIER_4
            Class.autoOverseer.UPGRADES_TIER_4 = ["megaAutoOverseer", "tripleAutoOverseer"].map(x => x + "_AR")
            Class.overdrive.UPGRADES_TIER_4 = ["overstorm", "tyrant", "overtrapperdrive", "overgunnerdrive", "bansheedrive", "autoOverdrive", "instructor", "captaindrive", "foredrive", "dopedrive"].map(x => x + "_AR")
            Class.commander.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.captain_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.foreman_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.dopeseer_AR.UPGRADES_TIER_4 = [/*"briskseer", "dopelord", "autoDopeseer", "dopeseerdrive", "adjurer", "mogul", "ganger"*/].map(x => x + "_AR")
        Class.cruiser.UPGRADES_TIER_3.push("productionist_AR", "cruiserdrive_AR", "hangar_AR", "zipper_AR", "baltimore_AR", "mosey_AR")
            Class.carrier.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.battleship.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.fortress.UPGRADES_TIER_4
            Class.autoCruiser.UPGRADES_TIER_4 = ["megaAutoCruiser", "tripleAutoCruiser"].map(x => x + "_AR")
            //Class.commander.UPGRADES_TIER_4
            Class.productionist_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.cruiserdrive_AR.UPGRADES_TIER_4 = ["cruiserstorm", "carrierdrive", "battledrive", "fortdrive"/*, "autoCruiserdrive"*/, "prescriber", "productiondrive"/*, "helipad", "baltimoredrive", "moseydrive"*/].map(x => x + "_AR")
            Class.hangar_AR.UPGRADES_TIER_4 = [/*"courier", "warlord", "aerodome", "autoHangar", "megaHangar", "dirigible", "airfield", "helipad", "governer", "grinder", "barn", "reposit"*/].map(x => x + "_AR")
            //Class.zipper_AR.UPGRADES_TIER_4
            Class.baltimore_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.mosey_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
        Class.underseer.UPGRADES_TIER_3.push("prodigy", "autoUnderseer_AR", "underdrive_AR", "pentaseer_AR", "undertrapper_AR", "undergunner_AR", "mummifier_AR"/*, DOPER UNDERSEER*/)
            Class.underseer.UPGRADES_TIER_4 = [/*"conductor", */"underdoubleTwin", "undershot", "underassassin", "underhunter", "underminigun", "underrifle", "undermarksman", "underartillery", "undersprayer", "underdiesel", "underangle", "underdestroyer", "underlauncher"].map(x => x + "_AR")
            Class.necromancer.UPGRADES_TIER_4 = [/*"diviner", "charmer", */"omen", "autoNecromancer"/*, "necrodrive", "plaguer", "pentamancer"*/, "necrotrapper", "necrogunner"].map(x => x + "_AR")
            Class.maleficitor.UPGRADES_TIER_4 = [/*"bewitcher", "charmer", */"autoMaleficitor", "hexer"/*, "femaleficitor"*/, "witch"].map(x => x + "_AR")
            Class.infestor.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.prodigy.UPGRADES_TIER_4
            Class.autoUnderseer_AR.UPGRADES_TIER_4 = ["megaAutoUnderseer", "tripleAutoUnderseer", "autoNecromancer", "autoMaleficitor", "autoInfestor", "autoProdigy", "autoUnderdrive", "autoPentaseer", "autoMummifier"].map(x => x + "_AR")
            Class.underdrive_AR.UPGRADES_TIER_4 = ["understorm", "necrodrive", "hexer", "infestordrive", "autoUnderdrive", "pentadrive"].map(x => x + "_AR")
            Class.pentaseer_AR.UPGRADES_TIER_4 = [/*"pentamancer", */"witch", "autoPentaseer", "pentadrive", "warlock", "pentatrapper", "pentagunner"].map(x => x + "_AR")
            Class.undertrapper_AR.UPGRADES_TIER_4 = ["necrotrapper", "mummytrapper", "pentatrapper", "undermach", "autoUndertrapper"/*, "undertrapperdrive"*/, "underbuilder", "undertrapGuard", "underpen", "undermech", "underwark"].map(x => x + "_AR")
            Class.mummifier_AR.UPGRADES_TIER_4 = ["bigChip", "mummytrapper", "mummygunner"].map(x => x + "_AR")
        Class.spawner.UPGRADES_TIER_3.push("megaSpawner_AR", "productionist_AR", "spawnerdrive_AR", "captain_AR", "hangar_AR", "laborer_AR", "foundry_AR", "issuer_AR")
            Class.factory.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.autoSpawner.UPGRADES_TIER_4 = ["megaAutoSpawner", "tripleAutoSpawner"].map(x => x + "_AR")
            Class.megaSpawner_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.productionist_AR.UPGRADES_TIER_4
            Class.spawnerdrive_AR.UPGRADES_TIER_4 = ["spawnerstorm"].map(x => x + "_AR")
            //Class.captain_AR.UPGRADES_TIER_4
            //Class.hangar_AR.UPGRADES_TIER_4
            Class.laborer_AR.UPGRADES_TIER_4 = [/*"worker", "autoLaborer", "megaLaborer", "labordrive", "toiler", "grinder", "servicer", "endeavor", "slogger"*/].map(x => x + "_AR")
            Class.foundry_AR.UPGRADES_TIER_4 = [/*"endeavor", "stocker", "foundrydrive", "megaFoundry", "fabrication", "shopper", "autoFoundry", "barn", "topBanana", "plant"*/].map(x => x + "_AR")
            Class.issuer_AR.UPGRADES_TIER_4 = [/*"circulator", "facility", "autoIssuer", "megaIssuer", "inducer", "issuerdrive", "mogul", "reposit", "slogger", "plant"*/].map(x => x + "_AR")
        Class.directordrive_AR.UPGRADES_TIER_3 = ["directorstorm_AR", "overdrive", "cruiserdrive_AR", "underdrive_AR", "spawnerdrive_AR", "autoDirectordrive_AR", "honchodrive_AR", "doperdrive_AR"]
            Class.directordrive_AR.UPGRADES_TIER_4 = ["managerdrive"].map(x => x + "_AR")
            Class.directorstorm_AR.UPGRADES_TIER_4 = ["vortex", "downpourer", "overstorm", "cruiserstorm", "understorm", "spawnerstorm", "autoDirectorstorm", "honchostorm", "doperstorm"].map(x => x + "_AR")
            //Class.overdrive.UPGRADES_TIER_4
            //Class.cruiserdrive_AR.UPGRADES_TIER_4
            //Class.underdrive_AR.UPGRADES_TIER_4
            //Class.spawnerdrive_AR.UPGRADES_TIER_4
            Class.autoDirectordrive_AR.UPGRADES_TIER_4 = ["autoDirectorstorm"].map(x => x + "_AR")
            Class.honchodrive_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            Class.doperdrive_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
        Class.honcho_AR.UPGRADES_TIER_3 = ["bigCheese", "foreman_AR", "baltimore_AR", "mummifier_AR", "foundry_AR", "autoHoncho_AR", "honchodrive_AR", "junkie_AR"]
            Class.bigCheese.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.foreman_AR.UPGRADES_TIER_4
            //Class.baltimore_AR.UPGRADES_TIER_4
            //Class.mummifier_AR.UPGRADES_TIER_4
            //Class.foundry_AR.UPGRADES_TIER_4
            Class.autoHoncho_AR.UPGRADES_TIER_4 = ["megaAutoHoncho", "tripleAutoHoncho"].map(x => x + "_AR")
            //Class.honchodrive_AR.UPGRADES_TIER_4
            Class.junkie_AR.UPGRADES_TIER_4 = [].map(x => x + "_AR")
            //Class.junkie_AR.UPGRADES_TIER_4 = ["addict", "ganger", "harbor", "plant", "stoner", "junkiedrive", "autoJunkie"].map(x => x + "_AR")
        Class.doper_AR.UPGRADES_TIER_3 = ["brisker", "dopeseer", "mosey", "issuer", "junkie", "doperdrive", "autoDoper"].map(x => x + "_AR")
            Class.brisker_AR.UPGRADES_TIER_4 = [/*"adderall", "briskseer", "sailor", "circulator", "briskerdrive", "addict", "autoBrisker"*/].map(x => x + "_AR")
            //Class.dopeseer_AR.UPGRADES_TIER_4
            //Class.mosey_AR.UPGRADES_TIER_4
            //Class.issuer_AR.UPGRADES_TIER_4
            //Class.junkie_AR.UPGRADES_TIER_4
            //Class.doperdrive_AR.UPGRADES_TIER_4
            Class.autoDoper_AR.UPGRADES_TIER_4 = ["megaAutoDoper", "tripleAutoDoper"].map(x => x + "_AR")

    //Class.pounder.UPGRADES_TIER_2.push("volute")
        //Class.pounder.UPGRADES_TIER_3
            Class.pounder.UPGRADES_TIER_4 = ["bruiser"].map(x => x + "_AR")
        Class.destroyer.UPGRADES_TIER_3.push("megaTrapper_AR", "queller_AR", "autoDestroyer_AR", "hurler_AR", "slinker_AR")
            Class.destroyer.UPGRADES_TIER_4 = ["harrier", "toppler"].map(x => x + "_AR")
            Class.annihilator.UPGRADES_TIER_4 = ["autoAnnihilator"].map(x => x + "_AR")
            Class.hybrid.UPGRADES_TIER_4 = ["overdestroyer", "synthesis", "enactor"/*, "hybriddrive", "crossbreed"*/, "compound", "meld", "puffer", "catcher", "cross", "autoHybrid", "mongrel", "amalgam"].map(x => x + "_AR")
            Class.autoDestroyer_AR.UPGRADES_TIER_4 = ["megaAutoDestroyer", "tripleAutoDestroyer"].map(x => x + "_AR")
        Class.builder.UPGRADES_TIER_3.push("forger_AR", "stall_AR", "fashioner_AR", "charger_AR")
            Class.autoBuilder.UPGRADES_TIER_4 = ["megaAutoBuilder", "tripleAutoBuilder"].map(x => x + "_AR")
        //Class.artillery.UPGRADES_TIER_3
        Class.launcher.UPGRADES_TIER_3.push("rocketeer", "pitcher_AR", "cluster_AR", "projector_AR", "heaver_AR", "autoLauncher_AR", "hurler_AR", "inception_AR")
            Class.autoLauncher_AR.UPGRADES_TIER_4 = ["megaAutoLauncher", "tripleAutoLauncher"].map(x => x + "_AR")
            //UPGRADES_TIER_4 = ["shaver", "bazooka", "catapult", "myriad", "leviathan", "bulker", "bombard", "python", "claimant", "incline", "autoHurler", "mongrel", "bunger", "deliverer", "slingshot"].map(x => x + "_AR")

    Class.trapper.UPGRADES_TIER_2.push("pen_AR", "mech_AR", "machineTrapper_AR", "wark_AR")
        deleteUpgrade("trapper", 3, "barricade")
        Class.trapper.UPGRADES_TIER_3.push("undertrapper_AR", "megaTrapper_AR")
            Class.trapper.UPGRADES_TIER_4 = [/*"sawedOff", */"tricker"].map(x => x + "_AR")
            Class.megaTrapper_AR.UPGRADES_TIER_4 = ["shoebill"].map(x => x + "_AR")
        //Class.builder.UPGRADES_TIER_3
        //Class.triTrapper.UPGRADES_TIER_3
        //Class.trapGuard.UPGRADES_TIER_3
        Class.pen_AR.UPGRADES_TIER_3 = ["stall", "triPen", "encircler", "incarcerator", "operator", "cockatiel", "hutch", "interner", "autoPen"].map(x => x + "_AR")
            Class.autoPen_AR.UPGRADES_TIER_4 = ["megaAutoPen", "tripleAutoPen"].map(x => x + "_AR")
        Class.mech_AR.UPGRADES_TIER_3 = ["engineer", "triMech_AR", "machineMech_AR", "mechGuard_AR", "operator_AR", "cog_AR", "cobbler_AR", "autoMech_AR"]
            Class.cobbler_AR.UPGRADES_TIER_4 = ["overmech", "fuser", "undermech", "repairman", "automaton"/*, "cobblerdrive", "restorer"*/, "machinist", "contriver", "utilizer", "autoCobbler"].map(x => x + "_AR")
            Class.autoMech_AR.UPGRADES_TIER_4 = ["megaAutoMech", "tripleAutoMech"].map(x => x + "_AR")
        //Class.machineTrapper_AR.UPGRADES_TIER_3
        //Class.wark_AR.UPGRADES_TIER_3

    //Class.whirlwind.UPGRADES_TIER_2
        //Class.whirlwind.UPGRADES_TIER_3
            Class.hexaWhirl.UPGRADES_TIER_4 = ["octoWhirl", "PLACEHOLDER_whirlCyclone", "PLACEHOLDER_whirlHexaTrapper", "peaceMoon", "autoHexaWhirl", "PLACEHOLDER_whirlMingler", "comboWhirl"].map(x => x + "_AR")
            Class.munition.UPGRADES_TIER_4 = ["PLACEHOLDER_whirlMortar", "PLACEHOLDER_whirlOrdnance", "PLACEHOLDER_whirlBeekeeper", "PLACEHOLDER_whirlFieldGun", "PLACEHOLDER_whirlQueller", "PLACEHOLDER_whirlForger", "schwartz", "autoMunition", "PLACEHOLDER_whirlFoctillery", "PLACEHOLDER_whirlDischarger"].map(x => x + "_AR")
            Class.whirl3.UPGRADES_TIER_4 = ["whirl5", "megaWhirl3", "whirl4", "PLACEHOLDER_whirlBanshee", "PLACEHOLDER_whirlSniper3", "whirlbar", "autoWhirl3", "comboWhirl"].map(x => x + "_AR")
            Class.whirlGuard.UPGRADES_TIER_4 = ["autoWhirlGuard", "triWhirlGuard"].map(x => x + "_AR")
            Class.prophet.UPGRADES_TIER_4 = ["PLACEHOLDER_whirlNecromancer", "PLACEHOLDER_whirlMaleficitor", "PLACEHOLDER_whirlInfestor", "autoProphet"].map(x => x + "_AR")
            Class.vortex.UPGRADES_TIER_4 = ["PLACEHOLDER_whirlFieldGun", "autoVortex"].map(x => x + "_AR")
        //Class.tornado.UPGRADES_TIER_3
            Class.megaTornado.UPGRADES_TIER_4 = ["ultraTornado"].map(x => x + "_AR")

//    Class.desmos.UPGRADES_TIER_2.splice(0, 0, "volute")
//    Class.desmos.UPGRADES_TIER_2.push("spiral", "repeater")
//        Class.desmos.UPGRADES_TIER_3 = ["bender"]
//        Class.volute.UPGRADES_TIER_3.push("oroboros", "autoVolute_AR")
        //Class.helix.UPGRADES_TIER_3.push("coil", "duplicator", "doubleHelix_AR", "autoHelix_AR")
//        Class.spiral.UPGRADES_TIER_3.push(/*"wrangler", */"oroboros", "cocci", /*"rocket", */"autoSpiral_AR")
            //Class.superSpiral.UPGRADES_TIER_4 = ["autoSuperSpiral_AR"]
            //Class.coil.UPGRADES_TIER_4 = ["doubleCoil_AR", "autoCoil_AR"]
            //Class.autoSpiral_AR.UPGRADES_TIER_4 = ["autoSuperSpiral_AR", "autoCoil_AR"]
//        Class.repeater.UPGRADES_TIER_3.push("autoRepeater_AR")
            //Class.iterator.UPGRADES_TIER_4 = ["autoIterator_AR"]
            //Class.duplicator.UPGRADES_TIER_4 = ["doubleDuplicator_AR", "autoDuplicator_AR"]
            //Class.autoRepeater_AR.UPGRADES_TIER_4 = ["autoIterator_AR", "autoDuplicator_AR"]

if (Config.retrograde) {
    //Class.twin.UPGRADES_TIER_2
        //Class.tripleShot.UPGRADES_TIER_3
            Class.pentaShot.UPGRADES_TIER_4.push("pentaBlaster_AR")
            Class.bentHybrid.UPGRADES_TIER_4.push("bootleg_AR")
            Class.bentDouble.UPGRADES_TIER_4.push("doubleTriBlaster_AR")
            Class.defect_AR.UPGRADES_TIER_4.push("leak_AR")
    //Class.machineGun.UPGRADES_TIER_2
        Class.artillery.UPGRADES_TIER_3.push("doubleArtillery_AR")
            Class.munition.UPGRADES_TIER_4.push("doubleMunition_AR")
            Class.autoArtillery_AR.UPGRADES_TIER_4.push("autoDoubleArtillery_AR")
        Class.minigun.UPGRADES_TIER_3.push("doubleMinigun_AR")
            Class.subverter.UPGRADES_TIER_4.push("doubleSubverter_AR")
            Class.autoMinigun_AR.UPGRADES_TIER_4.push("autoDoubleMinigun_AR")
        Class.sprayer.UPGRADES_TIER_3.push("doubleSprayer_AR")
            Class.redistributor.UPGRADES_TIER_4.push("doubleRedistributor_AR")
            Class.atomizer.UPGRADES_TIER_4.push("doubleAtomizer_AR")
            Class.focal.UPGRADES_TIER_4.push("sprayNSpray_AR", "doubleFocal_AR")
            Class.frother_AR.UPGRADES_TIER_4.push("doubleFrother_AR")
            Class.foamer_AR.UPGRADES_TIER_4.push("doubleFoamer_AR")
            Class.faucet_AR.UPGRADES_TIER_4.push("doubleFaucet_AR")
            Class.shower_AR.UPGRADES_TIER_4.push("bargain_AR")
            Class.autoSprayer_AR.UPGRADES_TIER_4.push("autoSplasher_AR", "autoDoubleSprayer_AR")
            Class.stormer_AR.UPGRADES_TIER_4.push("doubleStormer_AR")
        Class.diesel_AR.UPGRADES_TIER_3.push("doubleDiesel_AR")
            Class.autoDiesel_AR.UPGRADES_TIER_4.push("autoDoubleDiesel_AR")
        Class.blaster.UPGRADES_TIER_3.push("volley_AR", "doubleBlaster_AR", "ripoff_AR", "autoBlaster_AR")
            Class.triBlaster.UPGRADES_TIER_4 = ["pentaBlaster", "triSplasher", "bentSubverter", "doubleTriBlaster", "bootleg", "autoTriBlaster", "leak"].map(x => x + "_AR")
            Class.splasher.UPGRADES_TIER_4 = ["triSplasher", "combustor", "sprayNSpray", "doubleSplasher", "bargain", "autoSplasher"].map(x => x + "_AR")
            Class.flamethrower.UPGRADES_TIER_4 = ["combustor", "doubleFlamethrower", "imitation", "autoFlamethrower"].map(x => x + "_AR")
            Class.ripoff_AR.UPGRADES_TIER_4 = ["overblaster", "underblaster", "bootleg", "bargain", "imitation", "deposer", "volleyHybrid", "autoRipoff"].map(x => x + "_AR")
            Class.autoBlaster_AR.UPGRADES_TIER_4 = ["megaAutoBlaster", "tripleAutoBlaster", "autoTriBlaster", "autoSplasher", "autoFlamethrower", "autoHalfNHalf", "autoSubverter", "autoVolley", "autoDoubleBlaster", "autoRipoff"].map(x => x + "_AR")
        Class.gatlingGun.UPGRADES_TIER_3.push("rotaryGun_AR", "doubleGatling_AR", "gator_AR", "autoGatlingGun_AR")
            Class.accurator.UPGRADES_TIER_4 = ["accugator"].map(x => x + "_AR")
            Class.rotaryGun_AR.UPGRADES_TIER_4 = ["concentrator", "rotator"].map(x => x + "_AR")
            Class.gator_AR.UPGRADES_TIER_4 = ["overgatling", "undergatling", "accugator", "rotator"].map(x => x + "_AR")
            Class.autoGatlingGun_AR.UPGRADES_TIER_4 = ["megaAutoGatlingGun", "tripleAutoGatlingGun", "autoFocal", "autoAccurator", "autoHalfNHalf"].map(x => x + "_AR")
        Class.doubleMachine.UPGRADES_TIER_3.push("doubleArtillery_AR", "doubleMinigun_AR", "doubleGunner_AR", "doubleSprayer_AR", "doubleDiesel_AR", "doubleBlaster_AR", "doubleGatling_AR", "autoDoubleMachine_AR")
            Class.doubleMachine.UPGRADES_TIER_4 = ["overdoubleMachine", "underdoubleMachine"].map(x => x + "_AR")
            Class.tripleMachine.UPGRADES_TIER_4 = ["quadMachine", "tripleArtillery", "tripleMinigun", "tripleGunner", "tripleSprayer", "tripleDiesel", "tripleBlaster", "tripleGatling", "autoTripleMachine"].map(x => x + "_AR")
            Class.halfNHalf.UPGRADES_TIER_4 = ["quarterNQuarter", "slabNSlab", "sprayNSpray", "autoHalfNHalf"].map(x => x + "_AR")
            Class.doubleArtillery_AR.UPGRADES_TIER_4 = ["tripleArtillery", "autoDoubleArtillery"].map(x => x + "_AR")
            Class.doubleMinigun_AR.UPGRADES_TIER_4 = ["tripleMinigun", "doubleSubverter", "autoDoubleMinigun"].map(x => x + "_AR")
            Class.doubleSprayer_AR.UPGRADES_TIER_4 = ["tripleSprayer", "sprayNSpray", "doubleRedistributor", "doubleAtomizer", "doubleFocal", "doubleSplasher", "doubleFrother", "doubleFoamer", "doubleFaucet", "autoDoubleSprayer", "doubleStormer"].map(x => x + "_AR")
            Class.doubleDiesel_AR.UPGRADES_TIER_4 = ["tripleDiesel", "autoDoubleDiesel"].map(x => x + "_AR")
            Class.doubleBlaster_AR.UPGRADES_TIER_4 = ["tripleBlaster", "doubleTriBlaster", "doubleSplasher", "doubleFlamethrower", "slabNSlab", "doubleSubverter", "doubleVolley", "autoDoubleBlaster"].map(x => x + "_AR")
            Class.doubleGatling_AR.UPGRADES_TIER_4 = ["tripleGatling", "doubleFocal", "quarterNQuarter", "slabNSlab", "autoDoubleGatling"].map(x => x + "_AR")
            Class.autoDoubleMachine_AR.UPGRADES_TIER_4 = ["megaAutoDoubleMachine", "tripleAutoDoubleMachine", "autoTripleMachine", "autoHalfNHalf", "autoDoubleArtillery", "autoDoubleMinigun", "autoDoubleGunner", "autoDoubleSprayer", "autoDoubleDiesel", "autoDoubleBlaster", "autoDoubleGatling"].map(x => x + "_AR")
    //Class.director.UPGRADES_TIER_2
        //Class.overseer.UPGRADES_TIER_3
            Class.overseer.UPGRADES_TIER_4.splice(10, 0, "overblaster_AR", "overgatling_AR", "overdoubleMachine_AR")
        //Class.cruiser.UPGRADES_TIER_3
            Class.battleship.UPGRADES_TIER_4.push("doubleFaucet_AR")
    if (!Config.daily_tank == undefined && Config.daily_tank.tank == "whirlwind") {
        Class.doubleArtillery_AR.UPGRADES_TIER_4.push("doubleMunition_AR") //.splice(4, 0, "doubleMunition_AR")
    }
}

if (!Config.daily_tank == undefined && Config.daily_tank.tank == "whirlwind") {
Class.vortex_AR.LABEL = "Directive"

/*if (enable_whirlwind) { // do another check without daily_tank so we aren't duplicating
Class.basic.UPGRADES_TIER_1.push("whirlwind")
}*/
    //Class.flankGuard.UPGRADES_TIER_2
        Class.hexaTank.UPGRADES_TIER_3.splice(3, 0, "hexaWhirl")
            Class.octoTank.UPGRADES_TIER_4.push("octoWhirl_AR")
            Class.hexaTrapper.UPGRADES_TIER_4.push("PLACEHOLDER_whirlHexaTrapper_AR")
            Class.cyclone.UPGRADES_TIER_4.push("PLACEHOLDER_whirlCyclone_AR")
            Class.deathStar.UPGRADES_TIER_4.push("peaceMoon_AR")
            Class.autoHexaTank_AR.UPGRADES_TIER_4.push("autoHexaWhirl_AR")
            Class.mingler_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlMingler_AR")
        Class.auto3.UPGRADES_TIER_3.splice(4, 0, "whirl3")
            Class.auto5.UPGRADES_TIER_4.push("whirl5_AR")
            Class.mega3.UPGRADES_TIER_4.push("megaWhirl3_AR")
            Class.auto4.UPGRADES_TIER_4.push("whirl4_AR")
            Class.banshee.UPGRADES_TIER_4.push("PLACEHOLDER_whirlBanshee_AR")
            Class.sniper3_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlSniper3_AR")
            Class.crowbar_AR.UPGRADES_TIER_4.push("whirlbar_AR")
            Class.autoAuto3_AR.UPGRADES_TIER_4.push("autoWhirl3_AR")
            Class.combo_AR.UPGRADES_TIER_4.push("comboWhirl_AR")
        Class.trapGuard.UPGRADES_TIER_3.splice(5, 0, "whirlGuard")
    //Class.director.UPGRADES_TIER_2
        Class.underseer.UPGRADES_TIER_3.splice(3, 0, "prophet")
            Class.necromancer.UPGRADES_TIER_4.push("PLACEHOLDER_whirlNecromancer_AR")
            Class.maleficitor.UPGRADES_TIER_4.push("PLACEHOLDER_whirlMaleficitor_AR")
            Class.infestor.UPGRADES_TIER_4.push("PLACEHOLDER_whirlInfestor_AR")
            Class.autoUnderseer_AR.UPGRADES_TIER_4.push("autoProphet_AR")
            Class.underdrive_AR.UPGRADES_TIER_4.push()
            Class.pentaseer_AR.UPGRADES_TIER_4.push()
    //Class.pounder.UPGRADES_TIER_2
        Class.artillery.UPGRADES_TIER_3.splice(4, 0, "munition")
            Class.mortar.UPGRADES_TIER_4.push("PLACEHOLDER_whirlMortar_AR")
            Class.ordnance.UPGRADES_TIER_4.push("PLACEHOLDER_whirlOrdnance_AR")
            Class.beekeeper.UPGRADES_TIER_4.push("PLACEHOLDER_whirlBeekeeper_AR")
            Class.fieldGun.UPGRADES_TIER_4.push("PLACEHOLDER_whirlFieldGun_AR")
            Class.queller_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlQueller_AR")
            Class.forger_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlForger_AR")
            Class.force_AR.UPGRADES_TIER_4.push("schwartz_AR")
            Class.autoArtillery_AR.UPGRADES_TIER_4.push("autoMunition_AR")
            Class.foctillery_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlFoctillery_AR")
            Class.discharger_AR.UPGRADES_TIER_4.push("PLACEHOLDER_whirlDischarger_AR")
        Class.launcher.UPGRADES_TIER_3.splice(5, 0, "vortex")
}

if (integrate_healers) {
    Class.basic.UPGRADES_TIER_2.push("healer")
            Class.smasher.UPGRADES_TIER_4.push("physician_AR")
            Class.single.UPGRADES_TIER_4.push("renovater_AR")
        Class.twin.UPGRADES_TIER_3.push("nurse_AR")
            Class.doubleTwin.UPGRADES_TIER_4.push("clinician_AR")
            Class.tripleShot.UPGRADES_TIER_4.push("paramedic_AR")
            Class.gunner.UPGRADES_TIER_4.push("therapist_AR")
        Class.sniper.UPGRADES_TIER_3.push("medic")
            Class.assassin.UPGRADES_TIER_4.push("intern_AR")
            Class.hunter.UPGRADES_TIER_4.push("injection_AR")
            Class.rifle.UPGRADES_TIER_4.push("ointment_AR")
        Class.machineGun.UPGRADES_TIER_3 = ["psychiatrist_AR"]
            Class.minigun.UPGRADES_TIER_4.push("actuary_AR")
        Class.flankGuard.UPGRADES_TIER_3.push("triHealer_AR")
            Class.hexaTank.UPGRADES_TIER_4.push("hexaHealer_AR")
            Class.triAngle.UPGRADES_TIER_4.push("ambulance_AR")
            Class.auto3.UPGRADES_TIER_4.push("healer3_AR")
        Class.director.UPGRADES_TIER_3.push("soother_AR")
            Class.cruiser.UPGRADES_TIER_4.push("antidote_AR")
            Class.spawner.UPGRADES_TIER_4.push("medicare_AR")
            Class.honcho.UPGRADES_TIER_4.push("doctor_AR")
        Class.pounder.UPGRADES_TIER_3.push("analyzer_AR")
            Class.destroyer.UPGRADES_TIER_4.push("accountant_AR")
            Class.artillery.UPGRADES_TIER_4.push("guru_AR")
            Class.launcher.UPGRADES_TIER_4.push("clerk_AR")
        Class.trapper.UPGRADES_TIER_3.push("scientist_AR")
            Class.builder.UPGRADES_TIER_4.push("surgeon_AR")
            Class.triTrapper.UPGRADES_TIER_4.push("chemist_AR")
            Class.trapGuard.UPGRADES_TIER_4.push("professor_AR")
            Class.pen_AR.UPGRADES_TIER_4.push("scribble_AR")
        Class.desmos.UPGRADES_TIER_3.push("recalibrator_AR")
}

} else {
Class.autoDoubleFlank_AR.LABEL = "Auto-Double Flank Twin"
Class.autoTriple_AR.LABEL = "Auto-Triple Twin"
Class.dopedrive_AR.LABEL = "Dopeseerdrive"
Class.infestor.SHAPE = 4
Class.infestordrive_AR.SHAPE = 4
Class.renovator_AR.LABEL = "Renovater"
Class.vulture.LABEL = "Taser"
//Class.genericEntity.LABEL = "Deadeye"
//Class.genericEntity.LABEL = "Nimrod"
//Class.genericEntity.LABEL = "Spiral"
}
