const { combineStats, skillSet, makeAuto, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
require('./generics.js')
require('./tanks.js')
const g = require('../gunvals.js')

// OBSTACLES
Class.rock = {
    TYPE: "wall",
    DAMAGE_CLASS: 1,
    LABEL: "Rock",
    FACING_TYPE: "turnWithSpeed",
    SHAPE: -9,
    CAN_GO_OUTSIDE_ROOM: true,
    BODY: {
        PUSHABILITY: 0,
        HEALTH: 10000,
        SHIELD: 10000,
        REGEN: 1000,
        DAMAGE: 1,
        RESIST: 100,
        STEALTH: 1,
    },
    VALUE: 0,
    SIZE: 60,
    COLOR: "lightGray",
    VARIES_IN_SIZE: true,
    ACCEPTS_SCORE: false
}
Class.pumpkinLine = {
    LABEL: "Line",
    SHAPE: -1,
    COLOR: "#ff9000",
}
Class.pumpkinCircle = {
    LABEL: "Circle",
    SHAPE: 0,
    COLOR: "#654320",
}
Class.pumpkinStar = {
    LABEL: "Star",
    SHAPE: -6,
    COLOR: "#267524"
}
Class.pumpkin = {
    PARENT: "stone",
    LABEL: "Pumpkin",
    SHAPE: 9,
    COLOR: "#ff9000",
    GUNS: [],
    SIZE: 63,
    PROPS: [
        ...weaponArray({
            POSITION: [6, -4.5, 0, 0, 360, 1],
            TYPE: "pumpkinLine",
        }, 9),
        {
            POSITION: [6.5, 0, 0, 0, 360, 2],
            TYPE: "pumpkinCircle",
        },
        {
            POSITION: [4.5, 0, 0, 0, 360, 3],
            TYPE: "pumpkinStar",
        },
    ],
};
Class.stone = {
    PARENT: "rock",
    LABEL: "Stone",
    SIZE: 32,
    SHAPE: -7
}
Class.gravel = {
    PARENT: "rock",
    LABEL: "Gravel",
    SIZE: 16,
    SHAPE: -7
}
Class.wall = {
    PARENT: "rock",
    LABEL: "Wall",
    SIZE: 25,
    SHAPE: 4,
    ANGLE: 0,
    FACING_TYPE: ["noFacing", { angle: Math.PI / 2 }],
    WALL_TYPE: 1,
    VARIES_IN_SIZE: false
}
Class.eyewall = {
    PARENT: "wall",
    PROPS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: "eyeturret",
            ANGLE: Math.PI / 2,
        }
    ]
}
Class.moon = {
    PARENT: "rock",
    LABEL: "Moon",
    SIZE: 60,
    SHAPE: 0,
    VARIES_IN_SIZE: false
}
// EYES
Class.whiteEyeturret = {
    PARENT: "genericEntity",
    SHAPE: [[0, 0.8999999761581421], [0.04500000178813934, 0.898829996585846], [0.09000000357627869, 0.8955000042915344], [0.13500000536441803, 0.8898299932479858], [0.18000000715255737, 0.8817300200462341], [0.22499999403953552, 0.8713799715042114], [0.27000001072883606, 0.8585100173950195], [0.3149999976158142, 0.8430299758911133], [0.36000001430511475, 0.8248500227928162], [0.4050000011920929, 0.8036999702453613], [0.44999998807907104, 0.7793999910354614], [0.4950000047683716, 0.7516800165176392], [0.5400000214576721, 0.7200000286102295], [0.5849999785423279, 0.6840000152587891], [0.6299999952316284, 0.6426900029182434], [0.6426900029182434, 0.6299999952316284], [0.6840000152587891, 0.5849999785423279], [0.7200000286102295, 0.5400000214576721], [0.7516800165176392, 0.4950000047683716], [0.7793999910354614, 0.44999998807907104], [0.8036999702453613, 0.4050000011920929], [0.8248500227928162, 0.36000001430511475], [0.8430299758911133, 0.3149999976158142], [0.8585100173950195, 0.27000001072883606], [0.8713799715042114, 0.22499999403953552], [0.8817300200462341, 0.18000000715255737], [0.8898299932479858, 0.13500000536441803], [0.8955000042915344, 0.09000000357627869], [0.898829996585846, 0.04500000178813934], [0.8999999761581421, 0], [0.8999999761581421, 0], [0.898829996585846, -0.04500000178813934], [0.8955000042915344, -0.09000000357627869], [0.8898299932479858, -0.13500000536441803], [0.8817300200462341, -0.18000000715255737], [0.8713799715042114, -0.22499999403953552], [0.8585100173950195, -0.27000001072883606], [0.8430299758911133, -0.3149999976158142], [0.8248500227928162, -0.36000001430511475], [0.8036999702453613, -0.4050000011920929], [0.7793999910354614, -0.44999998807907104], [0.7516800165176392, -0.4950000047683716], [0.7200000286102295, -0.5400000214576721], [0.6840000152587891, -0.5849999785423279], [0.6426900029182434, -0.6299999952316284], [0.6299999952316284, -0.6426900029182434], [0.5849999785423279, -0.6840000152587891], [0.5400000214576721, -0.7200000286102295], [0.4950000047683716, -0.7516800165176392], [0.44999998807907104, -0.7793999910354614], [0.4050000011920929, -0.8036999702453613], [0.36000001430511475, -0.8248500227928162], [0.3149999976158142, -0.8430299758911133], [0.27000001072883606, -0.8585100173950195], [0.22499999403953552, -0.8713799715042114], [0.18000000715255737, -0.8817300200462341], [0.13500000536441803, -0.8898299932479858], [0.09000000357627869, -0.8955000042915344], [0.04500000178813934, -0.898829996585846], [0, -0.8999999761581421], [0, -0.8999999761581421], [-0.04500000178813934, -0.898829996585846], [-0.09000000357627869, -0.8955000042915344], [-0.13500000536441803, -0.8898299932479858], [-0.18000000715255737, -0.8817300200462341], [-0.22499999403953552, -0.8713799715042114], [-0.27000001072883606, -0.8585100173950195], [-0.3149999976158142, -0.8430299758911133], [-0.36000001430511475, -0.8248500227928162], [-0.4050000011920929, -0.8036999702453613], [-0.44999998807907104, -0.7793999910354614], [-0.4950000047683716, -0.7516800165176392], [-0.5400000214576721, -0.7200000286102295], [-0.5849999785423279, -0.6840000152587891], [-0.6299999952316284, -0.6426900029182434], [-0.6426900029182434, -0.6299999952316284], [-0.6840000152587891, -0.5849999785423279], [-0.7200000286102295, -0.5400000214576721], [-0.7516800165176392, -0.4950000047683716], [-0.7793999910354614, -0.44999998807907104], [-0.8036999702453613, -0.4050000011920929], [-0.8248500227928162, -0.36000001430511475], [-0.8430299758911133, -0.3149999976158142], [-0.8585100173950195, -0.27000001072883606], [-0.8713799715042114, -0.22499999403953552], [-0.8817300200462341, -0.18000000715255737], [-0.8898299932479858, -0.13500000536441803], [-0.8955000042915344, -0.09000000357627869], [-0.898829996585846, -0.04500000178813934], [-0.8999999761581421, 0], [-0.8999999761581421, 0], [-0.898829996585846, 0.04500000178813934], [-0.8955000042915344, 0.09000000357627869], [-0.8898299932479858, 0.13500000536441803], [-0.8817300200462341, 0.18000000715255737], [-0.8713799715042114, 0.22499999403953552], [-0.8585100173950195, 0.27000001072883606], [-0.8430299758911133, 0.3149999976158142], [-0.8248500227928162, 0.36000001430511475], [-0.8036999702453613, 0.4050000011920929], [-0.7793999910354614, 0.44999998807907104], [-0.7516800165176392, 0.4950000047683716], [-0.7200000286102295, 0.5400000214576721], [-0.6840000152587891, 0.5849999785423279], [-0.6426900029182434, 0.6299999952316284], [-0.6299999952316284, 0.6426900029182434], [-0.5849999785423279, 0.6840000152587891], [-0.5400000214576721, 0.7200000286102295], [-0.4950000047683716, 0.7516800165176392], [-0.44999998807907104, 0.7793999910354614], [-0.4050000011920929, 0.8036999702453613], [-0.36000001430511475, 0.8248500227928162], [-0.3149999976158142, 0.8430299758911133], [-0.27000001072883606, 0.8585100173950195], [-0.22499999403953552, 0.8713799715042114], [-0.18000000715255737, 0.8817300200462341], [-0.13500000536441803, 0.8898299932479858], [-0.09000000357627869, 0.8955000042915344], [-0.04500000178813934, 0.898829996585846], [0, 0.8999999761581421], [0, 0.8999999761581421], [0, 0.6000000238418579], [-0.04050000011920929, 0.8089470267295837], [0, 0.6000000238418579], [-0.029999999329447746, 0.5992199778556824], [-0.05999999865889549, 0.597000002861023], [-0.09000000357627869, 0.5932199954986572], [-0.11999999731779099, 0.5878199934959412], [-0.15000000596046448, 0.5809199810028076], [-0.18000000715255737, 0.5723400115966797], [-0.20999999344348907, 0.5620200037956238], [-0.23999999463558197, 0.5498999953269958], [-0.27000001072883606, 0.5357999801635742], [-0.30000001192092896, 0.519599974155426], [-0.33000001311302185, 0.5011199712753296], [-0.36000001430511475, 0.47999998927116394], [-0.38999998569488525, 0.4560000002384186], [-0.41999998688697815, 0.4284600019454956], [-0.4284600019454956, 0.41999998688697815], [-0.4560000002384186, 0.38999998569488525], [-0.47999998927116394, 0.36000001430511475], [-0.5011199712753296, 0.33000001311302185], [-0.519599974155426, 0.30000001192092896], [-0.5357999801635742, 0.27000001072883606], [-0.5498999953269958, 0.23999999463558197], [-0.5620200037956238, 0.20999999344348907], [-0.5723400115966797, 0.18000000715255737], [-0.5809199810028076, 0.15000000596046448], [-0.5878199934959412, 0.11999999731779099], [-0.5932199954986572, 0.09000000357627869], [-0.597000002861023, 0.05999999865889549], [-0.5992199778556824, 0.029999999329447746], [-0.6000000238418579, 0], [-0.6000000238418579, 0], [-0.5992199778556824, -0.029999999329447746], [-0.597000002861023, -0.05999999865889549], [-0.5932199954986572, -0.09000000357627869], [-0.5878199934959412, -0.11999999731779099], [-0.5809199810028076, -0.15000000596046448], [-0.5723400115966797, -0.18000000715255737], [-0.5620200037956238, -0.20999999344348907], [-0.5498999953269958, -0.23999999463558197], [-0.5357999801635742, -0.27000001072883606], [-0.519599974155426, -0.30000001192092896], [-0.5011199712753296, -0.33000001311302185], [-0.47999998927116394, -0.36000001430511475], [-0.4560000002384186, -0.38999998569488525], [-0.4284600019454956, -0.41999998688697815], [-0.41999998688697815, -0.4284600019454956], [-0.38999998569488525, -0.4560000002384186], [-0.36000001430511475, -0.47999998927116394], [-0.33000001311302185, -0.5011199712753296], [-0.30000001192092896, -0.519599974155426], [-0.27000001072883606, -0.5357999801635742], [-0.23999999463558197, -0.5498999953269958], [-0.20999999344348907, -0.5620200037956238], [-0.18000000715255737, -0.5723400115966797], [-0.15000000596046448, -0.5809199810028076], [-0.11999999731779099, -0.5878199934959412], [-0.09000000357627869, -0.5932199954986572], [-0.05999999865889549, -0.597000002861023], [-0.029999999329447746, -0.5992199778556824], [0.029999999329447746, -0.5992199778556824], [0.05999999865889549, -0.597000002861023], [0.09000000357627869, -0.5932199954986572], [0.11999999731779099, -0.5878199934959412], [0.15000000596046448, -0.5809199810028076], [0.18000000715255737, -0.5723400115966797], [0.20999999344348907, -0.5620200037956238], [0.23999999463558197, -0.5498999953269958], [0.27000001072883606, -0.5357999801635742], [0.30000001192092896, -0.519599974155426], [0.33000001311302185, -0.5011199712753296], [0.36000001430511475, -0.47999998927116394], [0.38999998569488525, -0.4560000002384186], [0.41999998688697815, -0.4284600019454956], [0.4284600019454956, -0.41999998688697815], [0.4560000002384186, -0.38999998569488525], [0.47999998927116394, -0.36000001430511475], [0.5011199712753296, -0.33000001311302185], [0.519599974155426, -0.30000001192092896], [0.5357999801635742, -0.27000001072883606], [0.5498999953269958, -0.23999999463558197], [0.5620200037956238, -0.20999999344348907], [0.5723400115966797, -0.18000000715255737], [0.5809199810028076, -0.15000000596046448], [0.5878199934959412, -0.11999999731779099], [0.5932199954986572, -0.09000000357627869], [0.597000002861023, -0.05999999865889549], [0.5992199778556824, -0.029999999329447746], [0.6000000238418579, 0], [0.6000000238418579, 0], [0.5992199778556824, 0.029999999329447746], [0.597000002861023, 0.05999999865889549], [0.5932199954986572, 0.09000000357627869], [0.5878199934959412, 0.11999999731779099], [0.5809199810028076, 0.15000000596046448], [0.5723400115966797, 0.18000000715255737], [0.5620200037956238, 0.20999999344348907], [0.5498999953269958, 0.23999999463558197], [0.5357999801635742, 0.27000001072883606], [0.519599974155426, 0.30000001192092896], [0.5011199712753296, 0.33000001311302185], [0.47999998927116394, 0.36000001430511475], [0.4560000002384186, 0.38999998569488525], [0.4284600019454956, 0.41999998688697815], [0.41999998688697815, 0.4284600019454956], [0.38999998569488525, 0.4560000002384186], [0.36000001430511475, 0.47999998927116394], [0.33000001311302185, 0.5011199712753296], [0.30000001192092896, 0.519599974155426], [0.27000001072883606, 0.5357999801635742], [0.23999999463558197, 0.5498999953269958], [0.20999999344348907, 0.5620200037956238], [0.18000000715255737, 0.5723400115966797], [0.15000000596046448, 0.5809199810028076], [0.11999999731779099, 0.5878199934959412], [0.09000000357627869, 0.5932199954986572], [0.05999999865889549, 0.597000002861023], [0.029999999329447746, 0.5992199778556824], [0, 0.6000000238418579]],
};
Class.eyeShape = {
    PARENT: "genericEntity",
    SHAPE: [[0.7222222089767456,0],[0.7044034600257874,0.1604112833738327],[0.6533481478691101,0.31666800379753113],[0.5757527351379395,0.4647231698036194],[0.48120468854904175,0.6007422804832458],[0.38019800186157227,0.7212024331092834],[0.28201842308044434,0.8229838609695435],[0.19297508895397186,0.9034504294395447],[0.11537414789199829,0.9605181217193604],[0.047459136694669724,0.9927088618278503],[-0.015680737793445587,0.999189019203186],[-0.0804554671049118,0.9797906279563904],[-0.15276512503623962,0.9350162148475647],[-0.2361111044883728,0.8660253882408142],[-0.3302743136882782,0.7746049761772156],[-0.4308764636516571,0.6631226539611816],[-0.5299378037452698,0.5344658493995667],[-0.6173150539398193,0.3919666111469269],[-0.6826998591423035,0.23931565880775452],[-0.7177289724349976,0.08046656847000122],[-0.7177289724349976,-0.08046656847000122],[-0.6826998591423035,-0.23931565880775452],[-0.6173150539398193,-0.3919666111469269],[-0.5299378037452698,-0.5344658493995667],[-0.4308764636516571,-0.6631226539611816],[-0.3302743136882782,-0.7746049761772156],[-0.2361111044883728,-0.8660253882408142],[-0.15276512503623962,-0.9350162148475647],[-0.0804554671049118,-0.9797906279563904],[-0.015680737793445587,-0.999189019203186],[0.047459136694669724,-0.9927088618278503],[0.11537414789199829,-0.9605181217193604],[0.19297508895397186,-0.9034504294395447],[0.28201842308044434,-0.8229838609695435],[0.38019800186157227,-0.7212024331092834],[0.48120468854904175,-0.6007422804832458],[0.5757527351379395,-0.4647231698036194],[0.6533481478691101,-0.31666800379753113],[0.7044034600257874,-0.1604112833738327]],
}
Class.eyeturret = {
    PARENT: "genericEntity",
    COLOR: 19,
    SHAPE: [[0.7222222089767456,0],[0.7044034600257874,0.1604112833738327],[0.6533481478691101,0.31666800379753113],[0.5757527351379395,0.4647231698036194],[0.48120468854904175,0.6007422804832458],[0.38019800186157227,0.7212024331092834],[0.28201842308044434,0.8229838609695435],[0.19297508895397186,0.9034504294395447],[0.11537414789199829,0.9605181217193604],[0.047459136694669724,0.9927088618278503],[-0.015680737793445587,0.999189019203186],[-0.0804554671049118,0.9797906279563904],[-0.15276512503623962,0.9350162148475647],[-0.2361111044883728,0.8660253882408142],[-0.3302743136882782,0.7746049761772156],[-0.4308764636516571,0.6631226539611816],[-0.5299378037452698,0.5344658493995667],[-0.6173150539398193,0.3919666111469269],[-0.6826998591423035,0.23931565880775452],[-0.7177289724349976,0.08046656847000122],[-0.7177289724349976,-0.08046656847000122],[-0.6826998591423035,-0.23931565880775452],[-0.6173150539398193,-0.3919666111469269],[-0.5299378037452698,-0.5344658493995667],[-0.4308764636516571,-0.6631226539611816],[-0.3302743136882782,-0.7746049761772156],[-0.2361111044883728,-0.8660253882408142],[-0.15276512503623962,-0.9350162148475647],[-0.0804554671049118,-0.9797906279563904],[-0.015680737793445587,-0.999189019203186],[0.047459136694669724,-0.9927088618278503],[0.11537414789199829,-0.9605181217193604],[0.19297508895397186,-0.9034504294395447],[0.28201842308044434,-0.8229838609695435],[0.38019800186157227,-0.7212024331092834],[0.48120468854904175,-0.6007422804832458],[0.5757527351379395,-0.4647231698036194],[0.6533481478691101,-0.31666800379753113],[0.7044034600257874,-0.1604112833738327]],
    TURRETS: [
        {
            /*  SIZE     X       Y     ANGLE    ARC */
            POSITION: [12.3, 0, 0, 0, 360, 1],
            TYPE: ["whiteEyeturret", {COLOR: "pureWhite"}]
        },
    ]
};
Class.hwEye = {
    PARENT: "spectator",
    COLOR: "red",
    DRAW_FILL: false,
    BORDERLESS: true,
    LAYER: 12,
    ALPHA: 0.3,
    LABEL: "",
    TURRETS: [
        {
            /*  SIZE     X       Y     ANGLE    ARC */
            POSITION: [45, 0, 0, 0, 360, 0],
            TYPE: ["eyeShape", {COLOR: "pureWhite"}]
        },
        {
            /*  SIZE     X       Y     ANGLE    ARC */
            POSITION: [20, 0, 0, 0, 360, 1],
            TYPE: ["genericEntity", {
                COLOR: "red",
                BODY: {
                    FOV: 0.5,
                },
                AI: { IGNORE_SHAPES: true, CHASE: true },
                CONTROLLERS: [["nearestDifferentMaster", {lockThroughWalls: true}]],
                TURRETS: [
                    {
                        /*  SIZE     X       Y     ANGLE    ARC */
                        POSITION: [12, 2.5, 0, 0, 360, 1],
                        TYPE: ["genericEntity", {
                            COLOR: 19,
                        }]
                    },
                ]
            }]
        },
    ]
}
// DOMINATORS
Class.dominator = {
    PARENT: "genericTank",
    LABEL: "Dominator",
    UPGRADE_LABEL: 'Unknown',
    ON_MINIMAP: false,
    DANGER: 7,
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        str: 1,
        spd: 1,
    }),
    LEVEL: 45,
    level_cap: 45,
    SIZE: 50,
    SYNC_WITH_TANK: true,
    BODY: {
        RESIST: 100,
        SPEED: 1.32,
        ACCELERATION: 0.8,
        HEALTH: 590,
        DAMAGE: 6,
        PENETRATION: 0.25,
        FOV: 0.5,
        PUSHABILITY: 0,
        HETERO: 0,
        SHIELD: base.SHIELD * 1.4
    },
    CONTROLLERS: ["nearestDifferentMaster", ["spin", { onlyWhenIdle: true }]],
    AI: { IGNORE_SHAPES: true },
    DISPLAY_NAME: true,
    TURRETS: [
        {
            POSITION: [22, 0, 0, 0, 360, 0],
            TYPE: "dominationBody"
        }
    ],
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    HITS_OWN_TYPE: "pushOnlyTeam"
}
Class.destroyerDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Destroyer',
    GUNS: [
        {
            POSITION: [15.25, 6.75, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.destroyerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 6.75, -1.6, 6.75, 0, 0, 0]
        }
    ]
}
Class.gunnerDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Gunner',
    GUNS: [
        {
            POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15.85, 3, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0]
        }
    ]
}
Class.trapperDominator = {
    PARENT: "dominator",
    UPGRADE_LABEL: 'Trapper',
    FACING_TYPE: ["spin", {speed: 0.02}],
    GUNS: weaponArray([
        {
            POSITION: [4, 3.75, 1, 8, 0, 0, 0]
        },
        {
            POSITION: [1.25, 3.75, 1.7, 12, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
                AUTOFIRE: true
            }
        }
    ], 8)
}

// SANCTUARIES
let sancTiers =       [3, 6, 8, 9, 10, 12]
let sancHealerTiers = [2, 3, 4]
for (let tier of sancHealerTiers) {
    Class['sanctuaryHealerTier' + (sancHealerTiers.indexOf(tier) + 1)] = {
        PARENT: "sanctuaryHealer",
        FACING_TYPE: ["spin", {speed: -0.06}],
        GUNS: weaponArray([
            {
                POSITION: { LENGTH: 6, WIDTH: 9, ASPECT: -0.5, X: 12.5 },
            }, {
                POSITION: { LENGTH: 5.5, WIDTH: 10, X: 10 },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { range: 0.5, reload: 1.1, speed: 0.80 }, g.healer]),
                    SPAWN_OFFSET: 0,
                    TYPE: "healerSanctuaryBullet",
                    AUTOFIRE: true,
                }
            }
        ], tier)
    }
}

Class.sanctuary = {
    PARENT: "dominator",
    LABEL: "Sanctuary",
    DISPLAY_NAME: false,
    LEVEL: 45,
    SIZE: 20,
    FACING_TYPE: ["spin", {speed: 0.025}],
    SKILL: skillSet({
        rld: 1.25,
        dam: 1.25,
        str: 1.25,
    }),
    BODY: {
        HEALTH: 1280,
        DAMAGE: 5.5,
        SHIELD: base.SHIELD * 1.2,
    },
    TURRETS: [{
        POSITION: { SIZE: 22 },
        TYPE: "dominationBody",
    }]
};

for (let tier of sancTiers) {
    let sancIndex = sancTiers.indexOf(tier)
    Class['sanctuaryTier' + (sancIndex + 1)] = {
        PARENT: "sanctuary",
        TURRETS: [],
        UPGRADE_LABEL: 'Tier ' + (sancIndex + 1),
        GUNS: weaponArray([
            {
                POSITION: {LENGTH: 12, WIDTH: 4}
            }, {
                POSITION: {LENGTH: 1.5, WIDTH: 4, ASPECT: 1.7, X: 12},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, {shudder: 0.15, health: 7, reload: 1.5, speed: 1}]),
                    TYPE: ["trap", {BODY: {PUSHABILITY: 0.5}}],
                    STAT_CALCULATOR: "trap",
                    AUTOFIRE: true,
                },
            }
        ], tier)
    }
    Class['sanctuaryTier' + (sancIndex + 1)].TURRETS.push({
        POSITION: { SIZE: 22 },
        TYPE: "dominationBody",
    }, {
        POSITION: { SIZE: 9.3, LAYER: 1 },
        TYPE: "sanctuaryHealerTier" + (sancIndex < 2 ? 1 : sancIndex < 4 ? 2 : sancIndex < 6 ? 3 : 3),
    })
}

// CRASHERS
Class.crasher = {
    TYPE: "crasher",
    LABEL: "Crasher",
    COLOR: "pink",
    SHAPE: 3,
    SIZE: 5,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    AI: {
        NO_LEAD: true,
    },
    BODY: {
        SPEED: 5,
        ACCELERATION: 1.4,
        HEALTH: 0.5,
        DAMAGE: 5,
        PENETRATION: 2,
        PUSHABILITY: 0.5,
        DENSITY: 10,
        RESIST: 2,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothWithMotion",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
}

// SENTRIES
Class.sentry = {
    PARENT: "genericTank",
    TYPE: "crasher",
    LABEL: "Sentry",
    DANGER: 3,
    COLOR: "pink",
    UPGRADE_COLOR: "pink",
    SHAPE: 3,
    SIZE: 10,
    SKILL: skillSet({
        rld: 0.5,
        dam: 0.8,
        pen: 0.8,
        str: 0.1,
        spd: 1,
        atk: 0.5,
        hlt: 0,
        shi: 0,
        rgn: 0.7,
        mob: 0,
    }),
    VALUE: 1500,
    VARIES_IN_SIZE: true,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    AI: {
        NO_LEAD: true,
    },
    BODY: {
        FOV: 0.5,
        ACCELERATION: 0.75,
        DAMAGE: base.DAMAGE,
        SPEED: 0.5 * base.SPEED,
        HEALTH: 0.3 * base.HEALTH,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothToTarget",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    DRAW_HEALTH: true,
    GIVE_KILL_MESSAGE: true,
};
Class.sentrySwarm = {
    PARENT: "sentry",
    UPGRADE_LABEL: "Swarm Sentry",
    UPGRADE_COLOR: "pink",
    GUNS: [
        {
            POSITION: [7, 14, 0.6, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15, range: 0.9 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.sentryGun = makeAuto("sentry", "Sentry", {
    type: "megaAutoTankGun",
    size: 12,
});
Class.sentryGun.UPGRADE_LABEL = "Gun Sentry";
Class.sentryTrap = makeAuto("sentry", "Sentry", {
    type: "trapTurret",
    size: 12,
});
Class.sentryTrap.UPGRADE_LABEL = "Trap Sentry";
Class.sentinelSwarm = {
    PARENT: "sentry",
    LABEL: "Sentinel",
    UPGRADE_LABEL: "Swarm Sentinel",
    UPGRADE_COLOR: "pink",
    GUNS: weaponMirror({
        POSITION: [7, 10, 0.6, 7, 5.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15, range: 0.9 }]),
            TYPE: "swarm",
            STAT_CALCULATOR: "swarm",
        },
    })
}
Class.sentinelGun = makeAuto("sentry", "Sentinel", {
    type: "ultraAutoTankGun",
    size: 12,
});
Class.sentinelGun.UPGRADE_LABEL = "Gun Sentinel";
Class.sentinelTrap = makeAuto("sentry", "Sentinel", {
    type: "megaTrapTurret",
    size: 12,
});
Class.sentinelTrap.UPGRADE_LABEL = "Trap Sentinel";
Class.shinySentry = {
    PARENT: "sentry",
    COLOR: "lightGreen",
    UPGRADE_COLOR: "lightGreen",
    DANGER: 4,
    SIZE: 12,
    VALUE: 50000,
    SHAPE: 3,
    BODY: {
        HEALTH: 0.6 * base.HEALTH
    },
};
Class.shinySentrySwarm = {
    PARENT: "shinySentry",
    UPGRADE_LABEL: "Shiny Swarm Sentry",
    UPGRADE_COLOR: "lightGreen",
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15 }, g.machineGun, { reload: 0.25 }]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
    ],
};
Class.shinySentryGun = makeAuto("shinySentry", "Sentry", {
    type: "artilleryTurret",
    size: 12,
});
Class.shinySentryGun.UPGRADE_LABEL = "Shiny Gun Sentry";
Class.shinySentryTrap = makeAuto("shinySentry", "Sentry", {
    type: "barricadeTurret",
    size: 12,
});
Class.shinySentryTrap.UPGRADE_LABEL = "Shiny Trap Sentry";

// SENTINELS (by ranar)
Class.sentinel = {
    PARENT: "genericTank",
    TYPE: "crasher",
    LABEL: "Sentinel",
    DANGER: 7,
    COLOR: "purple",
    SHAPE: 5,
    SIZE: 16,
    SKILL: skillSet({
        rld: 0.7, //reload
        dam: 0.45, //bullet damage
        pen: 0.6, //bullet penetration
        str: 0.6, //bullet health
        atk: 0.5, //bullet speed
        spd: 0.6, //body damage
        hlt: 0.85, //max health
        shi: 0.45, //shield capacity
        rgn: 0.35, //shield regeneration
        mob: 0, //movement speed
    }),
    VALUE: 26668,
    VARIES_IN_SIZE: false,
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
    AI: { NO_LEAD: true },
    BODY: {
        FOV: 0.8,
        ACCEL: 0.003,
        DAMAGE: base.DAMAGE * 2.1,
        SPEED: base.SPEED * 0.4,
        HEALTH: base.HEALTH * 2.1,
        SHIELD: base.SHIELD * 2.1,
        REGEN: base.REGEN * 0.15,
    },
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothToTarget",
    HITS_OWN_TYPE: "hard",
};
Class.sentinelLauncher = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Missile Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [3, 12.45, -1.35, 17.2, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: "sentinelMissile",
                NO_LIMITATIONS: true,
            },
        }, {
            POSITION: [17.5, 13, 1.25, 0, 0, 0, 0],
        }, {
            POSITION: [18.55, 20.25, 0.25, 1, 0, 0, 0],
        },
    ],
};
Class.sentinelCrossbow = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Crossbow Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 3.5, 35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [15, 2.5, 1, 0, -3.5, -35/2, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 3.5, 1, 0, 4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [20, 3.5, 1, 0, -4, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7 }, g.crossbow, { recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { speed: 0.7, maxSpeed: 0.7, reload: 2, recoil: 0.5 }]),
                TYPE: "bullet",
            },
        },
    ],
};
Class.sentinelMinigun = {
    PARENT: "sentinel",
    UPGRADE_LABEL: "Minigun Sentinel",
    UPGRADE_COLOR: "purple",
    GUNS: [
        {
            POSITION: [16, 7.5, 1, 0, 4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [11.5, 7.5, -1.33, 1, 4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [16, 7.5, 1, 0, -4.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [11.5, 7.5, -1.33, 1, -4.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [22.5, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [20.4, 9, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [18.3, 9, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin, g.spam, g.spam]),
                TYPE: "bullet",
            },
        },
    ],
};

// MISCELLANEOUS TANKS
Class.baseProtector = {
    PARENT: "genericTank",
    LABEL: "Base",
    UPGRADE_LABEL: "Base Protector",
    ON_MINIMAP: false,
    SIZE: 64,
    DAMAGE_CLASS: 0,
    ACCEPTS_SCORE: false,
    CAN_BE_ON_LEADERBOARD: false,
    IGNORED_BY_AI: true,
    HITS_OWN_TYPE: "pushOnlyTeam",
    SKILL: skillSet({
        rld: 1,
        dam: 1,
        pen: 1,
        spd: 1,
        str: 1,
    }),
    BODY: {
        SPEED: 0,
        HEALTH: 1e4,
        DAMAGE: 10,
        PENETRATION: 0.25,
        SHIELD: 1e3,
        REGEN: 100,
        FOV: 1,
        PUSHABILITY: 0,
        RESIST: 10000,
        HETERO: 0,
    },
    FACING_TYPE: ["spin", {speed: 0.04}],
    TURRETS: [
        {
            POSITION: [25, 0, 0, 0, 360, 0],
            TYPE: "dominationBody",
        },
        ...weaponArray({
            POSITION: [12, 7, 0, 45, 100, 0],
            TYPE: "baseSwarmTurret",
        }, 4)
    ],
    GUNS: weaponArray([
        {
            POSITION: [4.5, 11.5, -1.3, 6, 0, 45, 0],
        },
        {
            POSITION: [4.5, 8.5, -1.5, 7, 0, 45, 0],
        },
    ], 4)
};

Class.mothership = {
    PARENT: "genericTank",
    LABEL: "Mothership",
    NAME: "Mothership",
    DANGER: 10,
    SIZE: Class.genericTank.SIZE * (12 / 3),
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: {
        REGEN: 0.5,
        FOV: 1,
        SHIELD: 0,
        ACCEL: 0.2,
        SPEED: 0.3,
        HEALTH: 4000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 1.5,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    GUNS: 
    weaponArray([
        {
            POSITION: [4.3, 3.1, 1.2, 8, 0, 22.5, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: [4.3, 3.1, 1.2, 8, 0, 45, 1/32],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                TYPE: ["drone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 8, 1/16)
}
Class.flagship = {
    PARENT: "mothership",
    LABEL: "Flagship",
    NAME: "Flagship",
    TURRETS: [
        {
            POSITION: [ 10, 0, 0, 45, 0, 1 ],
            TYPE: "flagshipTurret"
        }
    ]
};
Class.arenaCloser = {
    PARENT: "genericTank",
    LABEL: "Arena Closer",
    NAME: "Arena Closer",
    DISPLAY_NAME: false,
    DANGER: 10,
    SIZE: 34,
    COLOR: "yellow",
    UPGRADE_COLOR: "yellow",
    LAYER: 13,
    BODY: {
        REGEN: 1e5,
        HEALTH: 1e6,
        DENSITY: 30,
        DAMAGE: 1e5,
        FOV: 10,
        SPEED: 6,
    },
    SKILL: skillSet({ rld: 1, dam: 1, pen: 1, str: 1, spd: 1, atk: 1, hlt: 1, shi: 1, rgn: 1, mob: 1 }),
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    UPGRADE_TOOLTIP: "Hackerman",
    GUNS: [{
        POSITION: [14, 10, 1, 0, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.arenaCloser]),
            TYPE: [ "bullet", { LAYER: 12 } ]
        }
    }]
};

Class.antiTankMachineGun = {
    PARENT: "dominator",
    LABEL: "Anti-Tank Machine Gun",
    UPGRADE_LABEL: "A.T.M.G.",
    CONTROLLERS: [['spin', {onlyWhenIdle: true}], 'nearestDifferentMaster'],
    LEVEL: 45,
    SIZE: 32,
    BODY: {
        RESIST: 100,
        SPEED: 1.32,
        ACCELERATION: 0.8,
        HEALTH: 1e99,
        DAMAGE: 6,
        PENETRATION: 0.25,
        FOV: 1.35,
        PUSHABILITY: 0,
        HETERO: 0,
        SHIELD: base.SHIELD * 1.4,
    },
    SKILL_CAP: Array(10).fill(15),
    SKILL: Array(10).fill(15),
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [1, 2.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [16.5, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op, {reload: 0.5, health: 100, damage: 100, recoil: 0, spray: 0.1, speed: 2, maxSpeed: 2}]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, 90, 0],
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, -90, 0],
        },
        {
            POSITION: [5.5, 6.5, -1.8, 6.5, 0, 0, 0]
        }
    ],
    TURRETS: [{
        POSITION: [20, 0, 25, 0, 180, 1],
        TYPE: ["antiTankMachineGunArm"]
    }, {
        POSITION: [20, 0, -25, 0, 180, 1],
        TYPE: ["antiTankMachineGunArm"]
    }, {
        POSITION: [26, 0, 0, 0, 360, 0],
        TYPE: ["dominationBody"]
    }]
}
// CX-ATMG
Class.cxATMG = {
    PARENT: "dominator",
    LABEL: "CX-ATMG",
    UPGRADE_LABEL: "CX-ATMG",
    SHAPE: Class.cube.SHAPE,
    SIZE: 12,
    BODY: {
        RESIST: 2,
        SPEED: 2.32,
        ACCELERATION: 0.8,
        HEALTH: 200,
        DAMAGE: 6,
        PENETRATION: 0.25,
        FOV: 1.35,
        PUSHABILITY: 0,
        HETERO: 0,
        SHIELD: base.SHIELD * 1.4,
    },
    SKILL_CAP: Array(10).fill(15),
    SKILL: Array(10).fill(15),
    GUNS: [
        {
            POSITION: [15, 2.5, 1, 0, 2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [15, 2.5, 1, 0, -2, 0, 0.2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [1, 2.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [16.5, 3.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5}]),
                TYPE: "cxATMGBullet",
            }
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, 90, 0],
        },
        {
            POSITION: [24, 7, -1.3, 0, 0, -90, 0],
        },
        {
            POSITION: [5.5, 6.5, -1.8, 6.5, 0, 0, 0]
        }
    ],
    TURRETS: [{
        POSITION: [20, 0, 25, 0, 180, 1],
        TYPE: ["cxATMGArm"]
    }, {
        POSITION: [20, 0, -25, 0, 180, 1],
        TYPE: ["cxATMGArm"]
    }, {
        POSITION: [26, 0, 0, 0, 360, 0],
        TYPE: ["dominationBody"]
    }]
}
// TRACKER-3
Class.tracker3 = {
  PARENT: "genericTank",
  LABEL: "Tracker-3",
  FACING_TYPE: ["spin", {speed: 0.02}],
  SKILL_CAP: [0, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  TURRETS: weaponArray({
        POSITION: [11, 8, 0, 0, 190, 0],
        TYPE: ["tracker3gun", { INDEPENDENT: true }],
    }, 3)
};
// SERVER TRAVEL PORTAL
Class.portalAura = {
    PARENT: "bullet",
    MOTION_TYPE: "withMaster",
    CLEAR_ON_MASTER_UPGRADE: true,
    ALPHA: 0.4,
    NO_COLLISIONS: true,
    BODY: {
        HEALTH: base.HEALTH * 1000,
        DAMAGE: 0,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    },
    DIE_AT_RANGE: false,
    ON: [
        {
            event: 'tick',
            handler: ({ body }) => {
                if (body.growing) {
                    body.SIZE += 1.2;
                    if (body.SIZE > 45) body.growing = false;
                } else {
                    body.SIZE -= 1.2;
                    if (body.SIZE < 32) body.growing = true;
                }
            }
        },
    ],
}

Class.serverPortal = {
    PARENT: "genericTank",
    LABEL: "Travel Portal",
    UPGRADE_LABEL: "Portal",
    NAME: "Portal",
    COLOR: "#000000",
    BODY: {
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
        PUSHABILITY: 0,
        DENSITY: 0,
    },
    FACING_TYPE: "spin",
    ITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IGNORED_BY_AI: true,
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    DISPLAY_NAME: true,
    SIZE: 25,
    GUNS: [],
    ALPHA: 1,
    TURRETS: [
        {
            POSITION: [20.1, 0, 0, 0, 0, 1],
            TYPE: ["egg",{COLOR: "#000000"}],
        },
    ],
    ON: [
        {
            event: "tick",
            handler: ({ body }) => {
                for (let instance of entities.values()) {
                    let diffX = instance.x - body.x,
                        diffY = instance.y - body.y,
                        dist2 = diffX ** 2 + diffY ** 2;
                    if (dist2 <= ((body.size / 12)*250) ** 1.9) {
                        let forceMulti = (0.2 / instance.size);
                        if (instance.isPlayer && instance.socket) {
                            if (dist2 < body.size ** 2.5 + instance.size ** 2.5) forceMulti = (3 / instance.size);
                            instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        } else if (
                            !instance.isDominator && 
                            !instance.isArenaCloser && 
                            !instance.godmode && 
                            !instance.invuln && 
                            instance.id != body.id && 
                            instance.type !== "wall" &&
                            instance.team != body.team && 
                            instance.type === "bullet" ||
                            instance.type === "drone" ||
                            instance.type === "trap" ||
                            instance.type === "minion")
                        {
                            forceMulti = (3 / instance.size);
                            instance.velocity.x -= util.clamp(body.x - instance.x, -90, 90) * instance.damp * forceMulti;//0.05
                            instance.velocity.y -= util.clamp(body.y - instance.y, -90, 90) * instance.damp * forceMulti;//0.05
                        }
                    }
                }
            }
        }
    ]
};
for (let i = 0; i < 60; i++) {
    let spawnDelay = Math.random() * 252;
    if (spawnDelay < 20) spawnDelay = Math.random() * 4;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 8, 1, -150, 0, 360 / 60 * i, spawnDelay],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
                g.basic,
                { shudder: 0, speed: 2.7, spray: 0, reload: 0.8, recoil: 0, range: 0.15 },
            ]),
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            DRAW_FILL: false,
            BORDERLESS: true,
            NO_LIMITATIONS: true,
            TYPE: [
                Class.bullet,
                {
                    NO_COLLISIONS: true,
                    ALPHA: 0,
                    ON: [
                        {
                            event: "tick",
                            handler: ({ body }) => {
                                if (body.alpha < 0.9) body.alpha += 0.06; else body.alpha = 0;
                            }
                        }
                    ]
                },
            ],
        },
    });
}
for (let i = 0; i < 2; i++) {
    if (i & 1) i++;
    Class.serverPortal.GUNS.push({
        POSITION: [2, 14, 1, 2.5, 0, 0, i],
        PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic,{damage: 0, speed: 0, maxSpeed: 0, reload: 0.4, recoil: 0, size: 3}]),
            TYPE: "portalAura",
            SYNCS_SKILLS: true,
            AUTOFIRE: true,
            NO_LIMITATIONS: true,
            MAX_CHILDREN: 1,
        },
    });
};

Class.rcs = {
    PARENT: "genericTank",
    LABEL: "RCS Thruster",
    INDEPENDENT: true,
    CONTROLLERS: ['rcs'],
    GUNS: [
        {
            POSITION: [18, 10, 1.3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.5, speed: 1, range: 0.1}]),
                TYPE: "bullet",
                STAT_CALCULATOR: "bullet",
            },
        }
    ],
}

// BOTS
Class.bot = {
    FACING_TYPE: "looseToTarget",
    CONTROLLERS: ["nearestDifferentMaster", "mapAltToFire", "minion", "fleeAtLowHealth", ["mapFireToAlt", { onlyIfHasAltFireGun: true }], ["wanderAroundMap", { immitatePlayerMovement: true, lookAtGoal: true }]],
    AI: { IGNORE_SHAPES: true },
};

// SCORE KEEPING
Class.tagMode = {
    SHAPE: "",
    LABEL: "Players"
};
// HP for mothership/your custom gamemodes
Class.hp = {
    SHAPE: [],
    LABEL: "##% HP"
};
