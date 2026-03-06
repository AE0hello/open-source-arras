class surviveArenaCloser {
  constructor(gameManager) {
    this.room = gameManager.room;
    this.gameActive = false;
    this.arenaCloser = null;
    this.bots = [];
  }

  start() {
    this.gameActive = true;

    // Spawn bots
    for (let i = 0; i < Config.bot_cap; i++) {
      const x = ran.random(0, this.room.width);
      const y = ran.random(0, this.room.height);
      const loc = { x: x, y: y };
      const bot = new Entity(loc);
      bot.define("bot");
      bot.team = TEAM_BLUE; // All on same team
      bot.FOV = 30;
      bot.refreshSkills();
      bot.refreshBodyAttributes();
      this.bots.push(bot);
    }

    // Spawn Gamemode Arena Closer at 0,0
    const loc = { x: 0, y: 0 };
    this.arenaCloser = new Entity(loc);
    this.arenaCloser.define("gamemodeArenaCloser");
    this.arenaCloser.team = TEAM_ENEMIES;
    this.arenaCloser.FOV = 30;
    this.arenaCloser.refreshSkills();
    this.arenaCloser.refreshBodyAttributes();
    this.arenaCloser.isBoss = true;
  }

  reset() {
    this.gameActive = false;
    this.arenaCloser = null;
    this.bots = [];
  }

  redefine(theshit) {
    this.room = theshit.room;
    this.reset();
  }

  loop() {
    // No win condition - just survival
    // The Arena Closer stays active indefinitely
  }
}

module.exports = { surviveArenaCloser };
