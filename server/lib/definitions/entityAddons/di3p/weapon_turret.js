const { makeTurret } = require('../../facilitators.js')
const g = require('../../gunvals.js')

// Tier 0
Class.turret_tank = makeTurret("front_tank", {label: "Turret", fov: 0.8, extraStats: [g.pelleter, g.power, { recoil: 1.15 }, g.turret]})

// Technical
Class.turret_tank_invis = {
    PARENT: "turret_tank",
    SHAPE: 1
}
