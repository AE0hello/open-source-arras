// Currently all placeholders.

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

Class.deadlyWall = {
    PARENT: "wall",
    LABEL: "Deadly Wall",
    COLOR: 12
}

Class.healingWall = {
    PARENT: "wall",
    LABEL: "Healing Wall",
    COLOR: 11
}

Class.bouncyWall = {
    PARENT: "wall",
    LABEL: "Bouncy Wall",
    COLOR: 19
}

Class.breakerWall = {
    PARENT: "wall",
    LABEL: "Breaker Wall",
    COLOR: 5
}

Class.chunksWall = {
    PARENT: "wall",
    LABEL: "Chunks Wall",
    COLOR: 4
}

Class.opticalWall = {
    PARENT: "wall",
    LABEL: "Optical Wall",
    PROPS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: "eyeturret"
        }
    ],
    COLOR: 13
}

Class.oneWayWallDown = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Down)",
    COLOR: 17
}

Class.oneWayWallLeft = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Left)",
    COLOR: 17
}

Class.oneWayWallRight = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Right)",
    COLOR: 17
}

Class.oneWayWallUp = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Up)",
    COLOR: 17
}

Class.stickyWall = {
    PARENT: "wall",
    LABEL: "Sticky Wall",
    COLOR: 6
}

Class.trickWall = {
    PARENT: "wall",
    LABEL: "Trick Wall",
    COLOR: 4
}

Class.paintWallLayer = {
    COLOR: 6,
    SHAPE: 4
}
Class.paintWall = {
    PARENT: "wall",
    LABEL: "Paint Wall",
    COLOR: 6,
    PROPS: [
        {
            TYPE: 'paintWallLayer',
            POSITION: {
                SIZE: 20 * Math.SQRT1_2,
                ANGLE: 45,
                LAYER: 1
            }
        }
    ],
}

Class.filterWallLayer = {
    COLOR: 6,
    SHAPE: 4
}
Class.filterWall = {
    PARENT: "wall",
    LABEL: "Filter Wall",
    COLOR: 6,
    PROPS: [
        {
            TYPE: 'filterWallLayer',
            POSITION: {
                SIZE: 20 * Math.SQRT1_2,
                ANGLE: 45,
                LAYER: 1
            }
        }
    ],
}

Class.teamWall = {
    PARENT: "wall",
    LABEL: "Team Wall",
    COLOR: 12
}

Class.baseWall = {
    PARENT: "wall",
    LABEL: "Base Wall",
    COLOR: 12
}

Class.portalWall = {
    PARENT: "wall",
    LABEL: "Portal Wall",
    COLOR: 10
}

Class.checkpointWall = {
    PARENT: "wall",
    LABEL: "Checkpoint Wall",
    COLOR: 11
}