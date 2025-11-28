const { combineStats, makeDeco, weaponArray, makeGuard, makeAuto } = require('../facilitators.js')
const { base, statnames, dfltskl } = require('../constants.js')
const g = require('../gunvals.js')

// misc tanks, cont.
Class.masterBullet = {
    PARENT: "missile",
    FACING_TYPE: ["spin", {speed: 2}],
    MOTION_TYPE: "motor",
    HAS_NO_RECOIL: false,
    DIE_AT_RANGE: false,
    GUNS: [
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Front",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [13, 8, 1, 0, -1, 140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [13, 8, 1, 0, 1, 220, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster",
                AUTOFIRE: true,
            },
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "Thruster",
                AUTOFIRE: true,
            },
        },
    ],
}
Class.machineShot = {
    PARENT: "genericTank",
    LABEL: "Machine Shot",
    DANGER: 7,
    BODY: {
      SPEED: 0.85 * base.SPEED,
    },
    GUNS: [
        {
            POSITION: [16, 8, 1, 0, -3, -30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 0.667],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 0.333],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.machineShot]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.bacteriaChildren = {
    PARENT: "genericTank",
    LABEL: 'Bacteria',
    FACING_TYPE: 'smoothToTarget',
    CONTROLLERS: ['mapTargetToGoal'],
    BODY: {
        SPEED: base.SPEED * 0.5
    },
    CONNECT_CHILDREN_ON_CAMERA: true,
    CLEAR_ON_MASTER_UPGRADE: false,
    GUNS: [
        {
            POSITION: [4, 32, 1, 1.5, 0, 0, 2],
        },
    ],
};
Class.bacteria = {
    PARENT: "genericTank",
    LABEL: 'Bacteria',
    MAX_BULLETS: 32,
    CONNECT_CHILDREN_ON_CAMERA: true,
    GUNS: [
        {
            POSITION: [4, 32, 1, 1.5, 0, 0, 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.bacteria]),
                TYPE: "bacteriaChildren",
                NO_LIMITATIONS: true,
            },
        },
    ],
};
Class.lamgSpinnerTurret = {
    PARENT: "genericTank",
    FACING_TYPE: ["spinOnFire", {speed: 0.5}],
    LABEL: "Spinner Turret",
    COLOR: "grey",
    GUNS: weaponArray({
        POSITION: [15, 3.5, 1, 0, 0, 0, 0]
    }, 10)
}
Class.literallyAMachineGun = {
    PARENT: "genericTank",
    LABEL: "Literally a Machine Gun",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.2
    },
    TURRETS: [
        {
            POSITION: [10, 14, 0, 0, 0, 1],
            TYPE: "lamgSpinnerTurret"
        }
    ],
    GUNS: [
        {
            POSITION: [10, 2, 1, 0, 0, 0, 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([{spray: 0, recoil: 0, shudder: 0, reload: 2, speed: 5, maxSpeed: 5}]),
                TYPE: "bullet",
                FIXED_RELOAD: true,
            }, 
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0]
        }
    ]
}
// Undercover cop
Class.undercoverCop = {
    PARENT: "booster",
    LABEL: "Undercover Cop",
    UPGRADE_TOOLTIP: "WOOP WOOP! That's the sound of da police!",
    TURRETS: [
        {
            POSITION: {
                SIZE: 6,
                Y: 8,
                LAYER: 1
            },
            TYPE: "hexagonBlue"
        },
        {
            POSITION: {
                SIZE: 6,
                Y: -8,
                LAYER: 1
            },
            TYPE: "hexagonRed"
        },
        {
            POSITION: {
                SIZE: 6,
                Y: 3,
                LAYER: 1
            },
            TYPE: "squareBlue"
        },
        {
            POSITION: {
                SIZE: 6,
                Y: -3,
                LAYER: 1
            },
            TYPE: "squareRed"
        }
    ]
}

// TURKEY
Class.turkeynose = {
    COLOR: 19,
    LABEL: '',
    SIZE: 6.45,
}
Class.turkeyeye = {
    COLOR: 18,
    LABEL: '',
    TURRETS: [
        {
            POSITION: [10.75, 1, 0, 0, 360, 1],
            TYPE: "turkeynose"
        }
    ] 
}
Class.turkeyhead = {
    LABEL: 'Turkey',
    SIZE: 26.9,
    GUNS: [
        {
            POSITION: [19.8, 8.1, -1.75, 5.5, 0, 0, 0]
        }
    ],
    SHAPE: 0,
    TURRETS: [
        {
            POSITION: [6.5, 7, -5, 0, 360, 1],
            TYPE: "turkeyeye"
        },
        {
            POSITION: [6.5, 7, 5, 0, 360, 1],
            TYPE: "turkeyeye"
        }
    ]
}
Class.turkey = {
    PARENT: "genericTank",
    LABEL: 'Turkey',
    NAME: 'Turkey',
    SIZE: 50,
    MAX_CHILDREN: 16,
    SHAPE: 16,
    BODY: {
        SPEED: base.SPEED * 0.2,
        FOV: 1.5,
        SHIELD: 0,
        ACCEL: 0.2,
        SPEED: 0.3,
        HEALTH: 2000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 1.5,
    },
    GUNS: [
        {
            POSITION: [18, 4.69, 1, 0, 0, 135, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            },
        },
        { 
            POSITION: [20.96, 6.69, 1, 0, 0, 157.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }, 
        },
        {
            POSITION: [18, 4.69, 1, 0, 0, 225, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            },  
        },
        {
            POSITION: [20.96, 6.69, 1, 0, 0, 202.5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }, 
        },
        {
        POSITION: [24.09, 8.69, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            },
        },
        {
            POSITION: [ 24.09, 8.69, 1, 0, 0, 180, 0 ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            },
        },
        { 
            POSITION: [ 4, 5, 1, 10, 0, 105, 0 ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }, 
        },
        {   POSITION: [ 4, 5, 1, 10, 0, -105, 0 ],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
            }, 
        }
    ],
    TURRETS: [
        {
            POSITION: [10, 8.75, 0, 0, 360, 1],
            TYPE: "turkeyhead"
        }
    ],
}
Class.damoclone = {
    PARENT: "genericTank",
    LABEL: "Damoclone",
    COLOR: 37,
    HAS_NO_RECOIL: true,
    GUNS: (() => {
        const GUNS = 24;
        let guns = [];
        for (let i = 0; i < GUNS; i++) {
          guns.push({
             POSITION: [16, 4, 1, 0, 0, 360 / GUNS * i, 0.1 / GUNS * 10 * i],
             PROPERTIES: {
               SHOOT_SETTINGS: combineStats([g.basic, g.spam, g.spam]),
               TYPE: "bullet",
             },
          });
        }
        return guns
    })(),
}
    Class.fat456 = {
        PARENT: "genericTank",
        SIZE: 30,
        LABEL: "Fat456",
        COLOR: "brown",
        FACING_TYPE: "spin",
        BODY: {
            SPEED: base.SPEED * 4
        },
        TURRETS: [
            {
                POSITION: [12, 8, 0, 0, 190, 0],
                TYPE: "architectGun",
            },
            {
                POSITION: [12, 8, 0, 120, 190, 0],
                TYPE: "architectGun",
            },
            {
                POSITION: [12, 8, 0, 240, 190, 0],
                TYPE: "architectGun",
            },
        ],
    }
    Class.wifeBeater = {
        PARENT: "overlord",
        LABEL: 'Wife Beater',
        DANGER: 8,
        STAT_NAMES: statnames.drone,
        BODY: {
            ACCELERATION: base.ACCEL * 0.75,
            SPEED: base.SPEED * 0.8,
            FOV: base.FOV * 1.1,
        },
        MAX_CHILDREN: 16,
        GUNS: weaponArray({
            POSITION: [6, 12, 1.2, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.op]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 4)
    }
// literally a tank
class io_turretWithMotion extends IO {
    constructor(b, opts = {}) {
        super(b)
    }
    think(input) {
        return {
            target: this.body.master.velocity,
            main: true,
        };
    }
}
ioTypes.turretWithMotion = io_turretWithMotion
Class.latTop = makeDeco(0)
Class.latDeco1 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "#5C533F",
    SHAPE: "M -1 -2 C -1 -2 -1 -3 0 -3 C 1 -3 1 -2 1 -2 V 2 C 1 2 1 3 0 3 C -1 3 -1 2 -1 2 V -2",
    MIRROR_MASTER_ANGLE: true,
}
Class.latDeco2 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "#5C533F",
    SHAPE: "M -2 0 H 2 L 0 1 L -2 0",
    MIRROR_MASTER_ANGLE: true,
}
Class.latDeco3 = {
    PARENT: "genericTank",
    LABEL: "Tank Deco",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "#3F3B2D",
    SHAPE: "M -10 -1 L 10 -1 L 10 1 L -10 1 L -10 -1",
    MIRROR_MASTER_ANGLE: true,
}
Class.latRight = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "#96794E",
    SHAPE: "M -6 0 H 5 V 1 C 5 2 4 2 4 2 H -5 C -6 2 -6 1 -6 1 V 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, 31, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, 24, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, 17, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, -42, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, -35, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, -28, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [18, -5, 0, 0, 0, 1],
            TYPE: "latDeco2",
        },
    ]
}
Class.latLeft = {
    PARENT: "genericTank",
    LABEL: "Tank Side",
    FACING_TYPE: ["turnWithSpeed"],
    COLOR: "#96794E",
    SHAPE: "M -5 0 H 6 V 1 C 6 2 5 2 5 2 H -4 C -5 2 -5 1 -5 1 V 0",
    MIRROR_MASTER_ANGLE: true,
    TURRETS: [
        {
            POSITION: [4.8, -31, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, -24, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, -17, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, 42, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, 35, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [4.8, 28, 10, 0, 0, 1],
            TYPE: "latDeco1",
        },
        {
            POSITION: [18, 5, 0, 0, 0, 1],
            TYPE: "latDeco2",
        },
    ]
}
Class.latBase = {
    PARENT: "genericTank",
    LABEL: "Tank Base",
    CONTROLLERS: ["turretWithMotion"],
    COLOR: "#96794E",
    SHAPE: [
        [1.1, 1],
        [1.4, 0],
        [1.1, -1],
        [-1.1, -1],
        [-0.8, 0],
        [-1.1, 1]
    ],
    GUNS: [
        {
            POSITION: [16, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 0, 0]
        },
        {
            POSITION: [16, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [14.5, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 0, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, 6.5, 180, 0]
        },
        {
            POSITION: [13, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [11.5, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [10, 5.5, 1, 1, -6.5, 180, 0]
        },
        {
            POSITION: [8.5, 5.5, 1, 1, -6.5, 180, 0]
        },
    ],
    TURRETS: [
        {
            POSITION: [5.3, 0, -10, 0, 0, 1],
            TYPE: "latLeft",
        },
        {
            POSITION: [5.3, 0, -10, 180, 0, 1],
            TYPE: "latRight",
        },
        {
            POSITION: [2, 0, -1.4, 90, 0, 1],
            TYPE: "latDeco3",
        },
    ]
}
Class.literallyATank = {
    PARENT: "genericTank",
    DANGER: 6,
    BODY: {
        HEALTH: base.HEALTH * 1.2,
    },
    LABEL: "Literally A Tank",
    SHAPE: "M -1 -1 H 0 C 1 -1 1 0 1 0 C 1 0 1 1 0 1 H -1 V -1",
    GUNS: [
        {
            POSITION: [30, 8, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [4, 8, -1.4, 8, 0, 0, 0]
        },
        {
            POSITION: [12, 8, 1.3, 30, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { reload: 3, damage: 1.2, shudder: 0.5 }]),
                TYPE: "developerBullet"
            }
        },
        {
            POSITION: [2, 11, 1, 34, 0, 0, 0]
        }
    ],
    TURRETS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "#5C533F" } ],
        },
        {
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: [ "latTop", { COLOR: "#736245" } ],
        },
        {
            POSITION: [35, 0, 0, 0, 360, 0],
            TYPE: [ "latBase", { COLOR: "#96794E" } ],
        },
    ]
}

// SORT OUT LATER

    Class.spreadshot_old = {
        PARENT: "genericTank",
        LABEL: "Old Spreadshot",
        DANGER: 7,
        GUNS: [
            {
                POSITION: [13, 4, 1, 0, -0.8, -75, 5 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [14.5, 4, 1, 0, -1.0, -60, 4 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [16, 4, 1, 0, -1.6, -45, 3 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [17.5, 4, 1, 0, -2.4, -30, 2 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [19, 4, 1, 0, -3.0, -15, 1 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [13, 4, 1, 0, 0.8, 75, 5 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [14.5, 4, 1, 0, 1.0, 60, 4 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [16, 4, 1, 0, 1.6, 45, 3 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [17.5, 4, 1, 0, 2.4, 30, 2 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [19, 4, 1, 0, 3.0, 15, 1 / 6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.gunner,
                        g.artillery,
                        g.twin,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Spread",
                },
            },
            {
                POSITION: [13, 10, 1.3, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.pounder,
                        g.spreadshot,
                        g.spreadshot,
                    ]),
                    TYPE: "bullet",
                    LABEL: "Pounder",
                },
            },
        ],
    }
    Class.quadBuilder = {
        PARENT: "genericTank",
        DANGER: 7,
        LABEL: "Quad Builder",
        STAT_NAMES: statnames.trap,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.15 * base.FOV,
        },
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, 0, 45, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 45, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 135, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 135, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 225, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 225, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
            {
                POSITION: [14, 6, 1, 0, 0, 315, 0],
            },
            {
                POSITION: [2, 6, 1.1, 14, 0, 315, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.weak]),
                    TYPE: "setTrap",
                },
            },
        ],
    }
    Class.blunderbuss = {
        PARENT: "genericTank",
        LABEL: "Blunderbuss",
        DANGER: 7,
        BODY: {
            FOV: base.FOV * 1.225,
        },
        GUNS: [
            {
                POSITION: [13, 4, 1, 0, -3, -9, 0.3],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [15, 4, 1, 0, -2.5, -6, 0.2],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [16, 4, 1, 0, -2, -3, 0.1],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [13, 4, 1, 0, 3, 9, 0.3],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [15, 4, 1, 0, 2.5, 6, 0.2],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [16, 4, 1, 0, 2, 3, 0.1],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.sniper,
                        g.rifle,
                        g.blunderbuss,
                    ]),
                },
            },
            {
                POSITION: [25, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    TYPE: "bullet",
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                },
            },
            {
                POSITION: [14, 10.5, 1, 0, 0, 0, 0],
            },
        ],
    }
    Class.rimfire_old = {
        PARENT: "genericTank",
        LABEL: "Rimfire",
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [12, 5, 1, 0, 7.25, 15, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [12, 5, 1, 0, -7.25, -15, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, 3.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [16, 5, 1, 0, -3.75, -0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.fast]),
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.armsman_old = {
        PARENT: "genericTank",
        LABEL: "Old Armsman",
        BODY: {
            FOV: base.FOV * 1.225,
        },
        DANGER: 7,
        GUNS: [
            {
                POSITION: [20, 12, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [24, 7, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [13, 8.5, 1, 0, 0, 180, 0],
            },
            {
                POSITION: [4, 8.5, 1.7, 13, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: "trap",
                },
            },
        ],
    }

    Class.productionist = {
        PARENT: "genericTank",
        LABEL: "Productionist",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: {
            SPEED: base.SPEED * 0.75,
            FOV: 1.1,
        },
        GUNS: [
            {
                POSITION: [4.5, 6, 1, 10, 4.75, 0, 0],
            },
            {
                POSITION: [1, 7.25, 1, 14.25, 4.75, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [7.5, 7.25, -1.3, 3.5, 4.75, 0, 0],
            },
            {
                POSITION: [4.5, 6, 1, 10, -4.75, 0, 0.5],
            },
            {
                POSITION: [1, 7.25, 1, 14.25, -4.75, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.productionist]),
                    TYPE: "tinyMinion",
                    STAT_CALCULATOR: "drone",
                    SYNCS_SKILLS: true,
                },
            },
            {
                POSITION: [7.5, 7.25, -1.3, 3.5, -4.75, 0, 0.5],
            },
        ],
    }
    Class.worstTank = {
        PARENT: "genericTank",
        LABEL: "Worst Tank",
        DANGER: 7,
        BODY: {
            SPEED: 0.9 * base.SPEED,
        },
        GUNS: [
            {
                POSITION: [14, 3, 4, -3, 5, 0, 0.6],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, -3, -5, 0, 0.8],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, 2.5, 0, 0.4],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 0, -2.5, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [14, 3, 4, 3, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.worstTank]),
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.momwtdym = {
        PARENT: "genericTank",
        LABEL: "Me on my way to do your mom",
        UPGRADE_LABEL: "MOMWTDYM",
        DANGER: 7,
        GUNS: [
            {
                POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, { reload: 0.01, recoil: 10, spray: 1 }]),
                    TYPE: "bullet",
                },
            },
        ],
    }
    Class.meDoingYourMom = {
        PARENT: "genericTank",
        LABEL: "Me doing your mom",
        UPGRADE_LABEL: "MDYM",
        DANGER: 7,
        BODY: {
            SPEED: 0.8 * base.SPEED,
            FOV: 1.5 * base.FOV,
        },
        GUNS: [
            {
                POSITION: [128, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, { recoil: 0.01, reload: 0.01 }]),
                    FIXED_RELOAD: true,
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5, 8, -1.4, 8, 0, 0, 0],
            },
        ],
    }
    Class.bigBall = {
        PARENT: "drone",
        SHAPE: 8
    }
    Class.bigBalls = {
        PARENT: "genericTank",
        LABEL: "BIG Balls",
        DANGER: 7,
        STAT_NAMES: statnames.drone,
        BODY: {
            SPEED: 0.9 * base.SPEED,
            FOV: 1.1 * base.FOV,
        },
        MAX_CHILDREN: 2,
        GUNS: weaponArray({
            POSITION: [8, 18, 1.2, 6, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.bigBalls]),
                TYPE: "bigBall",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 2)
    }
    Class.tetraGunner = {
        PARENT: "genericTank",
        LABEL: "Tetra Gunner",
        DANGER: 7,
        GUNS: weaponArray([
            {
                POSITION: [8, 3.5, 1, 7.25, -4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [8, 3.5, 1, 7.25, 4, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [12, 3.5, 1, 7.25, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                    TYPE: "bullet"
                }
            },
        ], 4)
    }
