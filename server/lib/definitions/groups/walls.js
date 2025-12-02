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
    COLOR: "red"
}

Class.healingWall = {
    PARENT: "wall",
    LABEL: "Healing Wall"
}

Class.bouncyWall = {
    PARENT: "wall",
    LABEL: "Bouncy Wall"
}

Class.breakerWall = {
    PARENT: "wall",
    LABEL: "Breaker Wall"
}

Class.chunksWall = {
    PARENT: "wall",
    LABEL: "Chunks Wall"
}

Class.opticalWall = {
    PARENT: "wall",
    LABEL: "Optical Wall",
    PROPS: [
        {
            POSITION: [14, 0, 0, 0, 360, 1],
            TYPE: "eyeturret"
        }
    ]
}

Class.oneWayWallUp = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Up)"
}

Class.oneWayWallDown = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Down)"
}

Class.oneWayWallLeft = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Left)"
}

Class.oneWayWallRight = {
    PARENT: "wall",
    LABEL: "One-Way Wall (Right)"
}

Class.stickyWall = {
    PARENT: "wall",
    LABEL: "Sticky Wall"
}

Class.trickWall = {
    PARENT: "wall",
    LABEL: "Trick Wall"
}

Class.paintWall = {
    PARENT: "wall",
    LABEL: "Paint Wall",
    PROPS: [
    ]
}

Class.filterWall = {
    PARENT: "wall",
    LABEL: "Filter Wall"
}

Class.teamWall = {
    PARENT: "wall",
    LABEL: "Team Wall"
}

Class.baseWall = {
    PARENT: "wall",
    LABEL: "Base Wall"
}

Class.portalWall = {
    PARENT: "wall",
    LABEL: "Portal Wall"
}

Class.checkpointWall = {
    PARENT: "wall",
    LABEL: "Checkpoint Wall"
}