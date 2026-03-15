const {weaponArray} = require('../facilitators.js')

// Rocks
Class.gravel = {
    PARENT: "genericObstacle",
    LABEL: "Gravel",
    SIZE: 16,
    SHAPE: -7
}
Class.stone = {
    PARENT: "genericObstacle",
    LABEL: "Stone",
    SIZE: 32,
    SHAPE: -7,
    VARIES_IN_SIZE: true
}
Class.rock = {
    PARENT: "genericObstacle",
    LABEL: "Rock",
    SIZE: 60,
    SHAPE: -9,
    VARIES_IN_SIZE: true
}
Class.moon = {
    PARENT: "genericObstacle",
    LABEL: "Moon",
    SIZE: 60
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
}

// Walls
Class.wall = {
    PARENT: "genericObstacle",
    LABEL: "Wall",
    SIZE: 25,
    SHAPE: 4,
    ANGLE: 0,
    WALL_TYPE: 1,
    VARIES_IN_SIZE: false
}
Class.eyewall = {
    PARENT: "wall",
    LABEL: "Optical Wall",
    PROPS: [
        {
            POSITION: [15, 0, 0, 0, 360, 1],
            TYPE: "eyeturret",
            ANGLE: Math.PI / 2,
        }
    ]
}
Class.oneWayUpWall = {
    PARENT: "wall",
	LABEL: "One-Way Wall (Up)",
	PROPS: [
		{
            TYPE: "triangleHat",
			POSITION: {
				SIZE: 7,
				X: -0.5,
                ANGLE: 270,
                LAYER: 1
			}
		}
	]
}
Class.oneWayDownWall = {
    PARENT: "wall",
	LABEL: "One-Way Wall (Down)",
	PROPS: [
		{
            TYPE: "triangleHat",
			POSITION: {
				SIZE: 7,
				X: -0.5,
                ANGLE: 90,
                LAYER: 1
			}
		}
	]
}
Class.oneWayLeftWall = {
    PARENT: "wall",
	LABEL: "One-Way Wall (Left)",
	PROPS: [
		{
            TYPE: "triangleHat",
			POSITION: {
                SIZE: 7,
                X: -0.5,
                ANGLE: 180,
                LAYER: 1
			}
		}
	]
}
Class.oneWayRightWall = {
    PARENT: "wall",
	LABEL: "One-Way Wall (Right)",
	PROPS: [
		{
            TYPE: "triangleHat",
			POSITION: {
                SIZE: 7,
                X: -0.5,
                LAYER: 1
			}
		}
	]
}
