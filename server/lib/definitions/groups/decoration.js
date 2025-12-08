const { makeDeco } = require('../facilitators.js')
//const { base } = require('../constants.js')
//const g = require('../gunvals.js')

Class.healerHat = {
    LABEL: "Healer Hat",
    SHAPE: [[0.3, -0.3],[1,-0.3],[1,0.3],[0.3,0.3],[0.3,1],[-0.3,1],[-0.3,0.3],[-1,0.3],[-1,-0.3],[-0.3,-0.3],[-0.3,-1],[0.3,-1]],
    SIZE: 13,
    COLOR: "red",
}
Class.healerSymbol = { PARENT: "healerHat" }
Class.deco_oneWayTriangle = { PARENT: "healerHat" }
