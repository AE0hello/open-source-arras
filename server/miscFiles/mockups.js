let { MockupEntity } = require("./mockupEntity");

function getMockup(e, positionInfo) {
    let turretsAndProps = e.turrets.concat(e.props);
    return {
        index: e.index,
        name: e.label,
        x: util.rounder(e.x),
        y: util.rounder(e.y),
        upgradeName: e.upgradeLabel,
        upgradeTooltip: e.upgradeTooltip,
        color: e.color,
        strokeWidth: e.strokeWidth,
        upgradeColor: e.upgradeColor,
        glow: e.glow,
        borderless: e.borderless,
        drawFill: e.drawFill,
        visibleOnBlackout: e.visibleOnBlackout,
        shape: e.shapeData,
        imageInterpolation: e.imageInterpolation,
        size: util.rounder(e.size),
        realSize: util.rounder(e.realSize),
        mirrorMasterAngle: e.settings.mirrorMasterAngle,
        layer: e.layer,
        displayScore: e.displayScore,
        statnames: e.settings.skillNames,
        sendAllMockups: e.sendAllMockups,
        position: positionInfo,
        rerootUpgradeTree: e.rerootUpgradeTree,
        className: e.className,
        upgrades: e.upgrades.map(r => ({
            tier: r.tier,
            index: r.index
        })),
        guns: e.guns.map(function(gun) {
            return {
                offset: util.rounder(gun.offset),
                direction: util.rounder(gun.direction),
                length: util.rounder(gun.length),
                width: util.rounder(gun.width),
                aspect: util.rounder(gun.aspect),
                angle: util.rounder(gun.angle),
                color: gun.color,
                strokeWidth: gun.strokeWidth,
                alpha: gun.alpha,
                borderless: gun.borderless,
                drawFill: gun.drawFill,
                drawAbove: gun.drawAbove,
            };
        }),
        turrets: turretsAndProps.map(function(t) {
            // Merge turrets and props for the entity images.
            let out = getMockup(t, {});
            out.sizeFactor = util.rounder(t.bound.size);
            out.offset = util.rounder(t.bound.offset);
            out.direction = util.rounder(t.bound.direction);
            out.layer = util.rounder(t.bound.layer);
            out.angle = util.rounder(t.bound.angle);
            out.isProp = t.isProp;
            return out;
        }),
        props: e.props.map(function(p) {
            let out = getMockup(p, {});
            out.sizeFactor = util.rounder(p.bound.size);
            out.offset = util.rounder(p.bound.offset);
            out.direction = util.rounder(p.bound.direction);
            out.layer = util.rounder(p.bound.layer);
            out.angle = util.rounder(p.bound.angle);
            out.forceAngle = p.forceAngle;
            out.isProp = true;
            return out;
        })
    };
}

// Minimum enclosing circle via Welzl's algorithm
function welzlMEC(P, R) {
    if (P.length === 0 || R.length === 3) {
        if (R.length === 0) return { x: 0, y: 0, r: 0 };
        if (R.length === 1) return { x: R[0][0], y: R[0][1], r: 0 };
        if (R.length === 2) {
            let cx = (R[0][0] + R[1][0]) / 2, cy = (R[0][1] + R[1][1]) / 2;
            return { x: cx, y: cy, r: Math.hypot(R[0][0] - R[1][0], R[0][1] - R[1][1]) / 2 };
        }
        return constructCircumcirle(R[0], R[1], R[2]);
    }
    let p = P[P.length - 1];
    let d = welzlMEC(P.slice(0, -1), R);
    if (Math.hypot(p[0] - d.x, p[1] - d.y) <= d.r + 1e-10) return d;
    return welzlMEC(P.slice(0, -1), [...R, p]);
}

function getDimensions(entity) {
    endPoints = [];
    sizeEntity(entity);

    // Shuffle for expected O(n) performance
    for (let i = endPoints.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [endPoints[i], endPoints[j]] = [endPoints[j], endPoints[i]];
    }

    let { x, y, r } = welzlMEC(endPoints, []);
    return {
        axis: r * 2,
        middle: { x, y },
    };
}

// Find circumcircle and circumcenter
function constructCircumcirle(point1, point2, point3) {
    // util.rounder to avoid floating point nonsense
    let x1 = util.rounder(point1[0]);
    let y1 = util.rounder(point1[1]);
    let x2 = util.rounder(point2[0]);
    let y2 = util.rounder(point2[1]);
    let x3 = util.rounder(point3[0]);
    let y3 = util.rounder(point3[1]);

    // Invalid math protection
    if (x3 == x1 || x3 == x2) {
        x3 += 1e-5;
    }
    
    let numer1 = x3 ** 2 + y3 ** 2 - x1 ** 2 - y1 ** 2;
    let numer2 = x2 ** 2 + y2 ** 2 - x1 ** 2 - y1 ** 2;
    let factorX1 = 2 * x2 - 2 * x1;
    let factorX2 = 2 * x3 - 2 * x1;
    let factorY1 = 2 * y1 - 2 * y2;
    let factorY2 = 2 * y1 - 2 * y3;
    let y = (numer1 * factorX1 - numer2 * factorX2) / (factorY1 * factorX2 - factorY2 * factorX1);
    let x = ((y - y3) ** 2 - (y - y1) ** 2 - x1 ** 2 + x3 ** 2) / factorX2;
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));

    return {x, y, r};
}

const sidesMax = 16;
function sizeEntity(entity, x = 0, y = 0, angle = 0, scale = 1) {    
    // Process body as a polygon with [sidesMax] sides if it has at least that many or less than three sides
    if (entity.shape < 3 || entity.shape >= sidesMax) {
        for (let i = 0; i < sidesMax; i++) {
            let theta = Math.PI * 2 / sidesMax * i;
            endPoints.push([x + Math.cos(theta) * scale, y + Math.sin(theta) * scale]);
        }
    } else {
        // Process body as true size and shape otherwise
        let angleOffset = (entity.shape % 1) * 2 * Math.PI;
        let numSides = Math.floor(entity.shape);
        for (let i = 0; i < numSides; i++) {
            let theta = 2 * Math.PI / numSides * i + angleOffset;
            endPoints.push([x + Math.cos(theta) * scale * lazyRealSizes[numSides], y + Math.sin(theta) * scale * lazyRealSizes[numSides]]);
        }
    }
    
    // Process guns
    for (let g of entity.guns) {
        // Construct a trapezoid at angle 0
        let widths = g.aspect > 0 ? [g.width * g.aspect / 2, g.width / 2] : [g.width / 2, -g.width * g.aspect / 2],
            points = [],
            sinT = Math.sin(g.angle + angle),
            cosT = Math.cos(g.angle + angle);
        points.push([0, widths[1]]);
        points.push([g.length, widths[0]]);
        points.push([g.length, -widths[0]]);
        points.push([0, -widths[1]]);
    
        for (let point of points) {
            // Rotate it to the new angle via vector rotation
            let newX = point[0] * cosT - point[1] * sinT,
                newY = point[0] * sinT + point[1] * cosT;
            // Translate it to the right position
            newX += g.offset * Math.cos(g.direction + g.angle + angle);
            newY += g.offset * Math.sin(g.direction + g.angle + angle);
            // Save coords
            endPoints.push([x + newX * scale, y + newY * scale]);
        }
    }

    // Process turrets and props
    let turretsAndProps = entity.turrets.concat(entity.props);
    for (let t of turretsAndProps) {
        let trueAngle = angle + t.bound.angle,
            xShift = t.bound.offset * Math.cos(t.bound.direction + trueAngle),
            yShift = t.bound.offset * Math.sin(t.bound.direction + trueAngle);
        sizeEntity(t, x + xShift * scale, y + yShift * scale, trueAngle, t.bound.size * scale);
    }
}

function buildMockup(className, Manager) {
    try {
        let type = Class[className];
        let mockup = new MockupEntity(Manager);
        mockup.set(className);
        mockup.className = className;
        mockup.name = type.LABEL; // Rename it (for the upgrades menu).
        // Fetch the mockup.
        type.mockup = {
            position: getDimensions(mockup),
        };
        // Add the new data to the thing.
        mockupMap[mockup.index] = mockupData.length;
        mockupData.push(getMockup(mockup, type.mockup.position));
    } catch (error) {
        util.error('[WARNING]: An error has occured during mockup loading:');
        util.error('When attempting to generate mockup "' + className + '":');
        for (let i in Class[className]) util.error("\t" + i + ": " + Class[className][i]);
        throw error;
    }
}

module.exports = {
    buildMockup,
};
