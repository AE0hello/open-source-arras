class bossBattle {
  constructor(gameManager) {
    this.room = gameManager.room;
    this.gameActive = false;
    this.boss = null;
    this.bots = [];
  }

  start() {
    this.gameActive = true;

    // Spawn 32 bots
    for (let i = 0; i < 32; i++) {
      const x = ran.random(0, this.room.width);
      const y = ran.random(0, this.room.height);
      const loc = { x: x, y: y };
      const bot = new Entity(loc);
      bot.define("crasher");
      bot.team = TEAM_ENEMIES;
      bot.FOV = 30;
      bot.refreshSkills();
      bot.refreshBodyAttributes();
      this.bots.push(bot);
    }

    // Spawn Kronos large
    const x = ran.random(0, this.room.width);
    const y = ran.random(0, this.room.height);
    const loc = { x: x, y: y };
    this.boss = new Entity(loc);
    this.boss.define("kronos");
    this.boss.team = TEAM_ENEMIES;
    this.boss.FOV = 30;
    this.boss.refreshSkills();
    this.boss.refreshBodyAttributes();
    this.boss.isBoss = true;
    this.boss.SIZE *= 1.5;
    this.boss.health *= 0.25;
    this.boss.DAMAGE *= 0.25;
    this.boss.REGEN *= 0.25;

    this.boss.on("dead", () => {
      if (this.gameActive) {
        this.gameActive = false;
        global.gameManager.socketManager.broadcast("The boss has been defeated!");
        setTimeout(() => {
          global.gameManager.closeArena();
        }, 1500);
      }
    });
  }

  reset() {
    this.gameActive = false;
    this.boss = null;
    this.bots = [];
  }

  redefine(theshit) {
    this.room = theshit.room;
    this.reset();
  }

  loop() {
    // Nothing special
  }
}

module.exports = { bossBattle };
