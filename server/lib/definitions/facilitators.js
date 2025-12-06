const { skill_cap } = require("../../config.js")
const g = require('./gunvals.js')
const { basePolygonDamage, basePolygonHealth, dfltskl } = require("./constants")
let skcnv = {
    atk: 6,
    spd: 4,
    dam: 3,
    shi: 5,
    str: 2,
    mob: 9,
    rld: 0,
    pen: 1,
    rgn: 8,
    hlt: 7,
}

// gun definitions
exports.combineStats = function (stats) {
    try {
        // Build a blank array of the appropiate length
        let data = {
            reload: 1,
            recoil: 1,
            shudder: 1,
            size: 1,
            health: 1,
            damage: 1,
            pen: 1,
            speed: 1,
            maxSpeed: 1,
            range: 1,
            density: 1,
            spray: 1,
            resist: 1
        };

        for (let object = 0; object < stats.length; object++) {
            let gStat = stats[object];
            if (Array.isArray(gStat)) {
                gStat = {
                    reload: gStat[0], recoil: gStat[1], shudder: gStat[2],
                    size: gStat[3], health: gStat[4], damage: gStat[5],
                    pen: gStat[6], speed: gStat[7], maxSpeed: gStat[8],
                    range: gStat[9], density: gStat[10], spray: gStat[11],
                    resist: gStat[12]
                };
            }
            data.reload *= gStat.reload ?? 1;
            data.recoil *= gStat.recoil ?? 1;
            data.shudder *= gStat.shudder ?? 1;
            data.size *= gStat.size ?? 1;
            data.health *= gStat.health ?? 1;
            data.damage *= gStat.damage ?? 1;
            data.pen *= gStat.pen ?? 1;
            data.speed *= gStat.speed ?? 1;
            data.maxSpeed *= gStat.maxSpeed ?? 1;
            data.range *= gStat.range ?? 1;
            data.density *= gStat.density ?? 1;
            data.spray *= gStat.spray ?? 1;
            data.resist *= gStat.resist ?? 1;
        }
        return data;
    } catch (err) {
        console.log(err);
        throw JSON.stringify(stats);
    }
}
exports.setBuild = (build) => {
    let skills = build.split(build.includes("/") ? "/" : "").map((r) => +r);
    if (skills.length !== 10)
        throw new RangeError("Build must be made up of 10 numbers");
    return [6, 4, 3, 5, 2, 9, 0, 1, 8, 7].map((r) => skills[r]);
}
exports.skillSet = (args) => {
    let skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let s in args) {
        if (!args.hasOwnProperty(s)) continue;
        skills[skcnv[s]] = Math.round(skill_cap * args[s]);
    }
    return skills;
}

// functions
exports.dereference = type => {
    type = ensureIsClass(type);

    let output = JSON.parse(JSON.stringify(type));
    if (type.GUNS) {
        for (let i = 0; i < type.GUNS.length; i++) {
            if (output.GUNS[i].PROPERTIES) {
                output.GUNS[i].PROPERTIES.TYPE = type.GUNS[i].PROPERTIES.TYPE;
            }
        }
    }
    if (type.TURRETS) {
        for (let i = 0; i < type.TURRETS.length; i++) {
            output.TURRETS[i].TYPE = type.TURRETS[i].TYPE;
        }
    }
    for (let key in output) {
        if (key.startsWith('UPGRADES_TIER_')) {
            delete output[key];
        }
    }
    return output;
}

// gun functions
exports.makeGuard = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = exports.dereference(type),
    cannons = [{
        POSITION: [13, 8, 1, 0, 0, 180, 0],
    }, {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: exports.combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: "trap",
        },
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? type.LABEL + " Guard" : name;
    return output;
}
exports.makeRearGunner = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = exports.dereference(type);
    let cannons = [{
        POSITION: [19, 2, 1, 0, -2.5, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: exports.combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [19, 2, 1, 0, 2.5, 180, 0.5],
        PROPERTIES: {
            SHOOT_SETTINGS: exports.combineStats([g.basic, g.pelleter, g.power, g.twin, { recoil: 4 }, { recoil: 1.8 }]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [12, 11, 1, 0, 0, 180, 0],
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? type.LABEL : name;
    return output;
}
exports.makeBird = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = exports.dereference(type);
    let frontRecoilFactor = options.frontRecoil ?? 1;
    let backRecoilFactor = options.frontRecoil ?? 1;
    let color = options.frontRecoil;
    let superBird = options.super ?? false;

    // Thrusters
    let backRecoil = 0.5 * backRecoilFactor;
    let thrusterProperties = { SHOOT_SETTINGS: exports.combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: backRecoil }]), TYPE: "bullet", LABEL: "thruster" };
    let shootyBois = [{
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [16, 8, 1, 0, 0, -150, 0.1],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [18, 8, 1, 0, 0, 180, 0.6],
            PROPERTIES: thrusterProperties
        }];
    if (superBird) {
        shootyBois.splice(0, 0, {
            POSITION: [14, 8, 1, 0, 0, 130, 0.6],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [14, 8, 1, 0, 0, -130, 0.6],
            PROPERTIES: thrusterProperties
        })
    }
    // Assign thruster color
    if (color) for (let gun of shootyBois) {
        gun.PROPERTIES.TYPE = [gun.PROPERTIES.TYPE, { COLOR: color }];
    }

    // Modify front barrels
    for (let gun of output.GUNS) {
        if (gun.PROPERTIES) {
            gun.PROPERTIES.ALT_FIRE = true;
            // Nerf front barrels
            if (gun.PROPERTIES.SHOOT_SETTINGS) {
                gun.PROPERTIES.SHOOT_SETTINGS = exports.combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: frontRecoilFactor}]);
            }
        }
    }
    // Assign misc settings
    if (output.FACING_TYPE == "locksFacing") output.FACING_TYPE = "toTarget";
    output.GUNS = type.GUNS == null ? [...shootyBois] : [...output.GUNS, ...shootyBois];
    output.LABEL = name == -1 ? "Bird " + type.LABEL : name;
    return output;
}

// drone functions
exports.makeOver = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let output = exports.dereference(type);

    let angle = 180 - (options.angle ?? 125);
    let count = options.count ?? 2;
    let independent = options.independent ?? false;
    let cycle = options.cycle ?? true;
    let maxChildren = options.maxDrones ?? 3;
    let stats = options.extraStats ?? [];
    let spawnerType = options.spawnerType;

    let spawners = [];
    if (spawnerType == "swarm") {
        let spawnerProperties = {
            SHOOT_SETTINGS: exports.combineStats([g.swarm, ...stats]),
            TYPE: independent ? "autoswarm" : "swarm",
            STAT_CALCULATOR: "swarm",
        }
        if (count % 2 == 1) {
            spawners.push({
                POSITION: [7, 7.5, 0.6, 7, 4, 180, 0],
                PROPERTIES: spawnerProperties,
            }, {
                POSITION: [7, 7.5, 0.6, 7, -4, 180, 0.5],
                PROPERTIES: spawnerProperties,
            })
        }
        for (let i = 2; i <= (count - count % 2); i += 2) {
            spawners.push({
                POSITION: [7, 7.5, 0.6, 7, 4, 180 - angle * i / 2, 0],
                PROPERTIES: spawnerProperties,
            }, {
                POSITION: [7, 7.5, 0.6, 7, -4, 180 - angle * i / 2, 0.5],
                PROPERTIES: spawnerProperties,
            }, {
                POSITION: [7, 7.5, 0.6, 7, 4, 180 + angle * i / 2, 0],
                PROPERTIES: spawnerProperties,
            }, {
                POSITION: [7, 7.5, 0.6, 7, -4, 180 + angle * i / 2, 0.5],
                PROPERTIES: spawnerProperties,
            })
        }
    } else {
        let spawnerProperties = {
            SHOOT_SETTINGS: exports.combineStats([g.drone, g.overseer, ...stats]),
            TYPE: ["drone", {INDEPENDENT: independent}],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: cycle,
            MAX_CHILDREN: maxChildren,
        }
        if (count % 2 == 1) {
            spawners.push({
                POSITION: [6, 12, 1.2, 8, 0, 180, 0],
                PROPERTIES: spawnerProperties,
            })
        }
        for (let i = 2; i <= (count - count % 2); i += 2) {
            spawners.push({
                POSITION: [6, 12, 1.2, 8, 0, 180 - angle * i / 2, 0],
                PROPERTIES: spawnerProperties,
            }, {
                POSITION: [6, 12, 1.2, 8, 0, 180 + angle * i / 2, 0],
                PROPERTIES: spawnerProperties,
            })
        }
    }
    
    output.GUNS = type.GUNS == null ? spawners : type.GUNS.concat(spawners);
    output.LABEL = name == -1 ? "Over" + type.LABEL.toLowerCase() : name;
    return output;
}

// turret functions
exports.makeAuto = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let turret = {
        type: "autoTurret",
        size: 10,
        independent: true,
        color: 16,
        angle: 180,
        total: 1,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.size != null) {
        turret.size = options.size;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }
    if (options.color != null) {
        turret.color = options.color;
    }
    if (options.angle != null) {
        turret.angle = options.angle;
    }
    if (options.total != null) {
        turret.total = options.total;
    }
    let output = exports.dereference(type);
    let autogun = exports.weaponArray({
        POSITION: {
            SIZE: turret.size,
            ANGLE: turret.angle,
            ARC: 360 / turret.total,
            LAYER: 1
        },
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color,
            },
        ],
    }, turret.total);
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [...autogun];
    } else {
        output.TURRETS = [...type.TURRETS, ...autogun];
    }
    if (name == -1) {
        output.LABEL = "Auto-" + type.LABEL;
        output.UPGRADE_LABEL = "Auto-" + type.LABEL;
    } else {
        output.LABEL = name;
        output.UPGRADE_LABEL = name;
    }
    output.DANGER = type.DANGER + 1;
    return output;
}
exports.makeCeption = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let turret = {
        type: "autoTurret",
        size: 12.5,
        independent: true,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.size != null) {
        turret.size = options.size;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }
    let output = exports.dereference(type);
    let autogun = {
        POSITION: [turret.size, 0, 0, 180, 360, 1],
        TYPE: [
            type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
            },
        ],
    };
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [autogun];
    } else {
        output.TURRETS = [...type.TURRETS, autogun];
    }
    if (name == -1) {
        output.LABEL = type.LABEL + "-Ception";
    } else {
        output.LABEL = name;
    }
    output.DANGER = type.DANGER + 1;
    return output;
}
exports.makeDeco = (shape = 0, color = 16) => {
    return {
        PARENT: "genericTank",
        SHAPE: shape,
        COLOR: color,
    };
}
exports.makeRadialAuto = (type, options = {}) => {

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
        type = exports.dereference(type);

        let extraStats = options.extraStats ?? [];
        if (!Array.isArray(extraStats)) {
            extraStats = [extraStats];
        }
        turretIdentifier = options.turretIdentifier ?? `auto${type.LABEL}Gun`;

        Class[turretIdentifier] = {
            PARENT: 'genericTank',
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

            gun.PROPERTIES.SHOOT_SETTINGS = exports.combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.autoTurret, ...extraStats])
        }
    }

    let LABEL = options.label ?? (type.LABEL + "-" + count);
    let HAS_NO_RECOIL = options.noRecoil ?? false;
    let turretSize = options.size ?? 11;
    let turretX = options.x ?? 8;
    let turretArc = options.arc ?? 190;
    let turretAngle = options.angle ?? 0;

    return {
        PARENT: 'genericTank',
        LABEL,
        HAS_NO_RECOIL,
        FACING_TYPE: ["spin", {speed: options.rotation ?? 0.02}],
        DANGER: options.danger ?? (type.DANGER + 2),
        BODY: options.body ?? undefined,
        TURRETS: exports.weaponArray({
            POSITION: [turretSize, turretX, 0, turretAngle, turretArc, 0],
            TYPE: turretIdentifier
        }, count)
    }
}
exports.makeTurret = (type, options = {}) => {

    /*
    - type: what Class to turn into an auto turret
    
    Available options:
    - canRepel: whether or not the auto turret can fire backwards with secondary fire
    - limitFov: whether or not the auto turret should bother to try to limit its FOV arc
    - hasAI: whether or not the auto turret can think and shoot on its own
    - extraStats: array of stats to append onto the shoot settings of all of the turret's guns
    - label: turret label
    - color: turret color
    - fov: turret FOV
    - independent: turret independence
    */

    type = exports.dereference(type);

    let CONTROLLERS = [];
    if (options.canRepel) { // default false
        CONTROLLERS.push("canRepel", "mapAltToFire");
    }
    if (options.limitFov) { // default false
        CONTROLLERS.push("onlyAcceptInArc");
    }
    if (options.hasAI ?? true) { // default true
        if (options.ignoreFoods) {
            CONTROLLERS.push(["nearestDifferentMaster", { ignoreFood: true }]);
        } else CONTROLLERS.push("nearestDifferentMaster");
    }

    let GUNS = type.GUNS;
    let extraStats = options.extraStats ?? [g.autoTurret];
    if (!Array.isArray(extraStats)) {
        extraStats = [extraStats];
    }
    for (let gun of GUNS) {
        if (!gun.PROPERTIES) continue;
        if (!gun.PROPERTIES.SHOOT_SETTINGS) continue;

        gun.PROPERTIES.SHOOT_SETTINGS = exports.combineStats([gun.PROPERTIES.SHOOT_SETTINGS, ...extraStats])
    }

    return {
        PARENT: 'genericTank',
        LABEL: options.label ?? "",
        COLOR: options.color ?? "grey",
        BODY: { FOV: options.fov ?? 2 },
        INDEPENDENT: options.independent ?? false,
        CONTROLLERS,
        GUNS,
        AI: options.aiSettings,
        FACING_TYPE: options.facingType ?? null,
        TURRETS: type.TURRETS,
    }
}
exports.makeAura = (damageFactor = 1, sizeFactor = 1, opacity = 0.3, auraColor) => {
    let isHeal = damageFactor < 0;
    let auraType = isHeal ? "healAura" : "aura";
    let symbolType = isHeal ? "healerSymbol" : "auraSymbol";
    auraColor = auraColor ?? (isHeal ? 12 : 0);
    return {
        PARENT: "genericTank",
        INDEPENDENT: true,
        LABEL: "",
        COLOR: 17,
        GUNS: [
            {
                POSITION: [0, 20, 1, 0, 0, 0, 0,],
                PROPERTIES: {
                    SHOOT_SETTINGS: exports.combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
                    TYPE: [auraType, {COLOR: auraColor, ALPHA: opacity}],
                    MAX_CHILDREN: 1,
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                }, 
            }, 
        ],
        TURRETS: [
            {
                POSITION: [20 - 7.5 * isHeal, 0, 0, 0, 360, 1],
                TYPE: [symbolType, {COLOR: auraColor, INDEPENDENT: true}],
            },
        ]
    };
}

exports.setTurretProjectileRecoil = (type, recoilFactor) => {
    type = exports.dereference(type);

    if (!type.GUNS) return;
    
    // Sets the recoil of each of the turret's guns to the desired value.
    for (let gun of type.GUNS) {
        if (!gun.PROPERTIES) continue;

        // Set gun type to account for recoil factor
        let finalType = gun.PROPERTIES.TYPE;
        if (!Array.isArray(finalType)) {
            finalType = [finalType, {}];
        }
        if (typeof finalType[1] != "object") {
            finalType[1] = {};
        }
        // Set via BODY.RECOIL_FACTOR
        if (!finalType[1].BODY) {
            finalType[1].BODY = {};
        }
        finalType[1].BODY.RECOIL_MULTIPLIER = recoilFactor;

        // Save changes
        gun.PROPERTIES.TYPE = finalType;
    }

    return type;
}

// misc functions
exports.makeMenu = (name = -1, color = "mirror", shape = 0, overrideLabel = false, overrideGuns = false) => {
    let defaultGun = {
        POSITION: {
            LENGTH: 18,
            WIDTH: 10,
            ASPECT: -1.4
        },
        PROPERTIES: {
            SHOOT_SETTINGS: exports.combineStats([g.basic]),
            TYPE: "bullet",
        },
    };
    return {
        PARENT: "genericTank",
        LABEL: name == -1 ? undefined : name,
        GUNS: overrideGuns ? overrideGuns : [defaultGun],
        COLOR: color == "mirror" ? null : color,
        UPGRADE_COLOR: color == "mirror" ? null : color,
        SHAPE: shape,
        IGNORED_BY_AI: true,
        SKILL_CAP: Array(10).fill(dfltskl),
        RESET_CHILDREN: true,
    };
}
exports.weaponArray = (weapons, count, delayIncrement = 0, delayOverflow = false) => {
    // delayIncrement: how much each side's delay increases by
    // delayOverflow: false to constrain the delay value between [0, 1)
    if (!Array.isArray(weapons)) {
        weapons = [weapons]
    }
    let isTurret = weapons[0].TYPE != undefined;
    let angleKey = isTurret ? 3 : 5;
    let delayKey = 6;

    let output = [];
    for (let weapon of weapons) {
        for (let i = 0; i < count; i++) {
            let angle = 360 / count * i;
            let delay = delayIncrement * i;
            let newWeapon = exports.dereference(weapon);

            if (!Array.isArray(newWeapon.POSITION)) {
                angleKey = "ANGLE";
                delayKey = "DELAY";
            }

            newWeapon.POSITION[angleKey] = (newWeapon.POSITION[angleKey] ?? 0) + angle;
            if (!isTurret) {
                newWeapon.POSITION[delayKey] = (newWeapon.POSITION[delayKey] ?? 0) + delay;
                if (!delayOverflow) {
                    newWeapon.POSITION[delayKey] %= 1;
                }
            }
            output.push(newWeapon);
        }
    }
    return output;
}
exports.weaponMirror = (weapons, delayIncrement = 0.5, delayOverflow = false) => {
    // delayIncrement: how much each side's delay increases by
    // delayOverflow: false to constrain the delay value between [0, 1)
    if (!Array.isArray(weapons)) {
        weapons = [weapons]
    }
    let yKey = 4;
    let angleKey = 5;
    let delayKey = 6;

    let output = [];
    for (let weapon of weapons) {
        let newWeapon = exports.dereference(weapon);

        if (!Array.isArray(newWeapon.POSITION)) {
            yKey = "Y";
            angleKey = "ANGLE";
            delayKey = "DELAY";
        }

        newWeapon.POSITION[yKey] = (newWeapon.POSITION[yKey] ?? 0) * -1;
        newWeapon.POSITION[angleKey] = (newWeapon.POSITION[angleKey] ?? 0) * -1;
        newWeapon.POSITION[delayKey] = (newWeapon.POSITION[delayKey] ?? 0) + delayIncrement;
        output.push(weapon, newWeapon);

    }
    return output;
}
class LayeredBoss {
    constructor(identifier, NAME, PARENT = "celestial", SHAPE = 9, COLOR = 0, trapTurretType = "baseTrapTurret", trapTurretSize = 6.5, layerScale = 5, noSizeAn = false, BODY, SIZE, VALUE) {
        this.identifier = identifier ?? NAME.charAt(0).toLowerCase() + NAME.slice(1);
        this.layerID = 0;
        Class[this.identifier] = {
            PARENT, SHAPE, NAME, COLOR, BODY, SIZE, VALUE,
            UPGRADE_LABEL: NAME,
            UPGRADE_COLOR: COLOR,
            NO_SIZE_ANIMATION: noSizeAn,
            TURRETS: Array(SHAPE).fill().map((_, i) => ({
                POSITION: [trapTurretSize, 9, 0, 360 / SHAPE * (i + 0.5), 180, 0],
                TYPE: trapTurretType,
            })),
        };
        this.layerScale = layerScale;
        this.shape = SHAPE;
        this.layerSize = 20;
    }

    addLayer({gun, turret}, decreaseSides = true, layerScale, MAX_CHILDREN) {
        this.layerID++;
        this.shape -= decreaseSides ? 2 : 0;
        this.layerSize -= layerScale ?? this.layerScale;
        let layer = {
            PARENT: "genericTank",
            LABEL: "",
            SHAPE: this.shape,
            COLOR: -1,
            INDEPENDENT: true,
            FACING_TYPE: ["spin", { speed: 0.05 / 1.5 * (this.layerID % 2 ? -1 : 1), }],
            MAX_CHILDREN, 
            GUNS: [],
            TURRETS: [],
        };
        if (gun) {
            for (let i = 0; i < this.shape; i++) {
                layer.GUNS.push({
                    POSITION: gun.POSITION.map(n => n ?? 360 / this.shape * (i + 0.5)),
                    PROPERTIES: gun.PROPERTIES,
                });
            }
        }
        if (turret) {
            for (let i = 0; i < this.shape; i++) {
                layer.TURRETS.push({
                    POSITION: turret.POSITION.map(n => n ?? 360 / this.shape * (i + 0.5)),
                    TYPE: turret.TYPE,
                });
            }
        }

        Class[this.identifier + "Layer" + this.layerID] = layer;
        Class[this.identifier].TURRETS.push({
            POSITION: [this.layerSize, 0, 0, 0, 360, 1],
            TYPE: this.identifier + "Layer" + this.layerID,
        });
    }
}
exports.LayeredBoss = LayeredBoss;

// Food facilitators
exports.makeRelic = (type, scale = 1, gem, SIZE, yBase = 8.25) => {
    // Code by Damocles (https://discord.com/channels/366661839620407297/508125275675164673/1090010998053818488)
    // Albeit heavily modified because the math in the original didn't work LOL
    type = ensureIsClass(type);
    let relicCasing = {
        PARENT: 'genericEntity',
        LABEL: 'Relic Casing',
        level_cap: 45,
        COLOR: type.COLOR,
        MIRROR_MASTER_ANGLE: true,
        SHAPE: [[-0.4,-1],[0.4,-0.25],[0.4,0.25],[-0.4,1]].map(r => r.map(s => s * scale))
    }, relicBody = {
        PARENT: 'genericEntity',
        LABEL: 'Relic Mantle',
        level_cap: 45,
        COLOR: type.COLOR,
        MIRROR_MASTER_ANGLE: true,
        SHAPE: type.SHAPE
    };
    Class[Math.random().toString(36)] = relicCasing;
    Class[Math.random().toString(36)] = relicBody;
    let width = 6 * scale,
        y = yBase + ((scale % 1) * 5),
        isEgg = type.SHAPE == 0,
        casings = isEgg ? 8 : type.SHAPE,
        fraction = 360 / casings,
        GUNS = [],
        TURRETS = [{ POSITION: [32.5, 0, 0, 0, 0, 0], TYPE: relicBody }],
        PARENT = type,
        additionalAngle = type.SHAPE % 2 === 0 ? 0 : fraction / 2;

    for (let i = 0; i < casings; i++) {
        let angle = i * fraction,
            gunAngle = angle + additionalAngle;
        if (isEgg) {
            GUNS.push({
                POSITION: [4, width, 2.5, 12,  0, gunAngle, 0]
            });
            TURRETS.push({
                POSITION: [8, -15,  0, angle, 0, 1],
                TYPE: relicCasing
            });
        } else {
            GUNS.push({
                POSITION: [4, width, 2.5, 12,  y, gunAngle, 0]
            });
            GUNS.push({
                POSITION: [4, width, 2.5, 12, -y, gunAngle, 0]
            });
            TURRETS.push({
                POSITION: [8, -15,  y, angle, 0, 1],
                TYPE: relicCasing
            });
            TURRETS.push({
                POSITION: [8, -15, -y, angle, 0, 1],
                TYPE: relicCasing
            });
        }
    }

    if (gem) {
        TURRETS.push({
            POSITION: [8, 0, 0, 0, 0, 1],
            TYPE: [gem, { MIRROR_MASTER_ANGLE: true }]
        });
    }

    let out = {
        PARENT,
        LABEL: type.LABEL + ' Relic',
        COLOR: "white", // This is the color of the floor, this makes it look hollow.
        BODY: {
            ACCELERATION: 0.001
        },
        CONTROLLERS: [],
        VALUE: type.VALUE * 100_000,
        GUNS,
        TURRETS
    };

    if (SIZE) {
        out.SIZE = SIZE;
    }

    return out;
}

exports.makeCrasher = type => ({
    PARENT: type,
    COLOR: 'pink',
    TYPE: 'crasher',
    LABEL: 'Crasher ' + type.LABEL,
    CONTROLLERS: ['nearestDifferentMaster', 'mapTargetToGoal'],
    MOTION_TYPE: "motor",
    FACING_TYPE: "smoothWithMotion",
    HITS_OWN_TYPE: "hard",
    HAS_NO_MASTER: true,
    VALUE: type.VALUE * 5,
    BODY: {
        SPEED: 1 + 5 / Math.max(2, (type.PROPS.length ?? 0) + type.SHAPE),
        HEALTH: Math.pow(type.BODY.HEALTH, 2/3),
        DAMAGE: Math.pow(type.BODY.HEALTH, 1/3) * type.BODY.DAMAGE,
        ACCELERATION: 5,
        PUSHABILITY: 0.5,
        DENSITY: 10
    },
    AI: {
        NO_LEAD: true,
    }
});

exports.makeRare = (type, level) => {
    type = ensureIsClass(type);
    return {
        PARENT: "food",
        LABEL: ["Shiny", "Legendary", "Shadow", "Rainbow", "Trans"][level] + " " + type.LABEL,
        VALUE: [100, 500, 2000, 4000, 5000][level] * type.VALUE,
        SHAPE: type.SHAPE,
        SIZE: type.SIZE,
        GLOW:  {
            RADIUS: 2,
            STRENGTH: 25,
            COLOR: ["lightGreen", "teal", "darkGrey", "rainbow", "trans"][level],
            ALPHA: 0.6
        },
        COLOR: ["lightGreen", "teal", "darkGrey", "rainbow", "trans"][level],
        ALPHA: level == 2 ? 0.25 : 1,
        BODY: {
            DAMAGE: [1, 1, 2, 2.5, 2.5][level] * type.BODY.DAMAGE,
            DENSITY: [1, 1, 2, 2.5, 2.5][level] * type.BODY.DENSITY,
            HEALTH: [2, 4, 4, 6, 8][level] * type.BODY.HEALTH,
            PENETRATION: [1.5, 1.5, 2, 2.5, 2.5][level] * type.BODY.PENETRATION,
            ACCELERATION: type.BODY.ACCELERATION
        },
        DRAW_HEALTH: true,
        INTANGIBLE: type.INTANGIBLE,
        GIVE_KILL_MESSAGE: true,
    }
}

const labyTierToHealth = {
    0: 0.25,
    1: 10,
    2: 20,
    3: 150,
    4: 300
};

// not accurate values
const labyRarityToScore = {
    1: 5,
    2: 10,
    3: 40,
    4: 100,
    5: 250
};

const labyRarityToHealth = {
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    5: 10
};

exports.makeLaby = (type, tier, rarity, level, baseScale = 1) => {
    type = ensureIsClass(type);
    let usableSHAPE = Math.max(type.SHAPE, 3),
        downscale = Math.cos(Math.PI / usableSHAPE),
        healthMultiplier = Math.pow(5, level) - (level > 2 ? Math.pow(5, level) / Math.pow(5, level - 2) : 0);
    return {
        PARENT: 'food',
        LABEL: ['', 'Beta ', 'Alpha ', 'Omega ', 'Gamma ', 'Delta '][level] + type.LABEL,
        VALUE: util.getReversedJackpot(
            Math.min(
                5e6,
                (tier == 0
                    ? 30 * (level > 1 ? Math.pow(6, level - 1) : level) + 8
                    : 30 * Math.pow(5, tier + level - 1)) *
                    (labyRarityToScore[rarity] || 1)
            )
        ),
        SHAPE: type.SHAPE,
        SIZE: (type.SIZE * baseScale) / downscale ** level,
        COLOR: type.COLOR,
        ALPHA: type.ALPHA ?? 1,
        BODY: {
            DAMAGE: type.BODY.DAMAGE,
            DENSITY: type.BODY.DENSITY,
            HEALTH:
                (labyTierToHealth[tier] || 1) *
                healthMultiplier *
                (labyRarityToHealth[rarity] || 1),
            PENETRATION: type.BODY.PENETRATION,
            PUSHABILITY: type.BODY.PUSHABILITY / (level + 1) || 0,
            ACCELERATION: type.BODY.ACCELERATION,
            SHIELD: 1e-9,
            REGEN: 1e-18
        },
        INTANGIBLE: type.INTANGIBLE,
        VARIES_IN_SIZE: false,
        DRAW_HEALTH: type.DRAW_HEALTH && tier != 0,
        GIVE_KILL_MESSAGE: type.GIVE_KILL_MESSAGE || level > 1,
        GUNS: type.GUNS ?? [],
        TURRETS: type.TURRETS ?? [],
        PROPS: Array(level).fill().map((_, i) => ({
            POSITION: [
                20 * downscale ** (i + 1),
                0,
                0,
                !(i & 1) ? 180 / usableSHAPE : 0,
                1
            ],
            TYPE: [type, { COLOR: 'mirror' }]
        }))
    };
};
exports.makeRarities = (type) => {
    const ct = type.charAt(0).toUpperCase() + type.slice(1);
    const rarities = ["shiny", "legendary", "shadow", "rainbow", "trans"];
    for (let i = 0; i < rarities.length; i++) {
        const pn = `${rarities[i]}${ct}`;
        Class[pn] = exports.makeRare(`${type}`, [i]);
    }
}

//merry Christmas
exports.makePresent = (outcolor, wrapcolor) => {
    return {
        PARENT: "food",
        LABEL: "Present",
        VALUE: 6e3,
        SHAPE: 4,
        SIZE: 25,
        COLOR: outcolor,
        BODY: {
            DAMAGE: basePolygonDamage,
            DENSITY: 50,
            HEALTH: 10 * basePolygonHealth,
            RESIST: 3,
            PENETRATION: 1.1,
            ACCELERATION: 0.02
        },
        DRAW_HEALTH: true,
        PROPS: [
            {
                POSITION: [19.5, 0, 0, 0, 360, 1],
                TYPE: ["healerSymbol", { COLOR: wrapcolor}]
            }
        ]
    }
}
