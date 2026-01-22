// Thanks to Damocles
// https://discord.com/channels/366661839620407297/508125275675164673/1114907447195349074

class Train {
    constructor () {
        this.directions = new Map();
    }
    loop () {
        let train_able = [];
        for (let instance of entities.values()) if (instance.isPlayer || instance.isBot) train_able.push(instance);
        let clans = new Set(train_able.map(r => r.clan).filter(Boolean));
        for (let clan of clans) {
            let train = train_able.filter(r => r.clan === clan).sort((a, b) => b.skill.score - a.skill.score);
            if (!train.length) continue;
            let leader = train[0];
            if (leader.invuln) {
                leader.velocity.x = 0;
                leader.velocity.y = 0;
                continue;
            }
            let t = leader.control?.target ?? { x: 0, y: 0 };
            let tlen = Math.hypot(t.x, t.y);
            let lastDir = this.directions.get(clan);
            let dirx = tlen > 0.01 ? t.x / tlen : lastDir?.x ?? Math.cos(leader.facing);
            let diry = tlen > 0.01 ? t.y / tlen : lastDir?.y ?? Math.sin(leader.facing);
            if (tlen > 0.01) this.directions.set(clan, { x: dirx, y: diry });
            let speedMult = 3;
            let baseSpeed = 6;
            let trainSpeed = baseSpeed * speedMult;
            let leaderVelX = dirx * trainSpeed;
            let leaderVelY = diry * trainSpeed;
            leader.velocity.x += (leaderVelX - leader.velocity.x) * 0.35;
            leader.velocity.y += (leaderVelY - leader.velocity.y) * 0.35;

            for (let i = 1; i < train.length; i++) {
                let player = train[i];
                let prev = train[i - 1];
                let pv = Math.hypot(prev.velocity.x, prev.velocity.y);
                let pdx = pv > 0.01 ? prev.velocity.x / pv : Math.cos(prev.facing);
                let pdy = pv > 0.01 ? prev.velocity.y / pv : Math.sin(prev.facing);
                let followDistance = 80;
                let targetX = prev.x - pdx * followDistance;
                let targetY = prev.y - pdy * followDistance;
                let dx = targetX - player.x;
                let dy = targetY - player.y;
                let dist = Math.hypot(dx, dy) || 1;
                let pull = Math.min(90, dist);
                let desiredX = (dx / dist) * pull * player.damp * 1.1 + pdx * trainSpeed * 0.7;
                let desiredY = (dy / dist) * pull * player.damp * 1.1 + pdy * trainSpeed * 0.7;
                player.velocity.x += (desiredX - player.velocity.x) * 0.35;
                player.velocity.y += (desiredY - player.velocity.y) * 0.35;
            }
        }
    }
}

module.exports = { Train };
