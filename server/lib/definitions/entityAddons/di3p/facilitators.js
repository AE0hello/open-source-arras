const { dereference, combineStats } = require('../../facilitators.js')
const g = require('../../gunvals.js')

exports.makeOver = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = dereference(type);

    let angle = 180 - (options.angle ?? 125);
    let count = options.count ?? 2;
    let independent = options.independent ?? false;
    let cycle = options.cycle ?? true;
    let maxChildren = options.maxDrones ?? 3;
    let stats = options.extraStats ?? [];
    let spawnerProperties = {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer, ...stats]),
        TYPE: ["drone", { INDEPENDENT: independent }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: cycle,
        MAX_CHILDREN: maxChildren,
    };

    let spawners = [];
    if (count % 2 == 1) {
        spawners.push({
            POSITION: [7, 12, -1.2, 7, 0, 180, 0],
            PROPERTIES: spawnerProperties,
        })
    }
    for (let i = 2; i <= (count - count % 2); i += 2) {
        spawners.push({
            POSITION: [7, 12, -1.2, 7, 0, 180 - angle * i / 2, 0],
            PROPERTIES: spawnerProperties,
        }, {
            POSITION: [7, 12, -1.2, 7, 0, 180 + angle * i / 2, 0],
            PROPERTIES: spawnerProperties,
        })
    }

    output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners);
    output.LABEL = name == -1 ? "Over" + type.LABEL.toLowerCase() : name;
    return output;
}
