class TwoTDMOneDominator {
  constructor() {
    this.dominatorTypes = ["destroyerDominator", "gunnerDominator", "trapperDominator"];
    this.dominator = null;
    this.gameActive = false;
  }

  spawnDominator(team = TEAM_ENEMIES, color = null) {
    // Create a tile-like object at center (0,0)
    const tile = {
      loc: { x: 0, y: 0 },
      color: Config.mode === "tdm" ? 3 : 12,
      bluePrint: { COLOR: Config.mode === "tdm" ? 3 : 12 }
    };

    // Randomly choose a dominator type
    const type = ran.choose(this.dominatorTypes);

    const o = new Entity(tile.loc);
    o.define(type);
    o.team = team;
    o.color.base = color || tile.bluePrint.COLOR;
    o.skill.score = 111069;
    o.name = "Dominator";
    o.SIZE = global.gameManager.room.tileWidth / 15;
    o.permanentSize = o.SIZE;
    o.isDominator = true;
    o.controllers = [new ioTypes.nearestDifferentMaster(o, {}, global.gameManager), new ioTypes.spin(o, { onlyWhenIdle: true })];

    // When dominator dies, spawn a new one with random variant and team switching
    o.on("dead", () => {
      let newTeam = TEAM_ENEMIES,
        newColor = getTeamColor(newTeam);

      if (o.team === TEAM_ENEMIES) {
        // Find the killer and switch to their team
        const killers = [];
        for (const instance of o.collisionArray) {
          if (isPlayerTeam(instance.team) && o.team !== instance.team) {
            killers.push(instance);
          }
        }

        let killer = ran.choose(killers);
        killer = killer ? killer.master.master : { team: TEAM_ROOM, color: Config.mode === "tdm" ? 3 : 12 };

        newTeam = killer.team;
        newColor = getTeamColor(newTeam);

        // Broadcast team change
        const teamName = newTeam > 0 ? killer.name : getTeamName(newTeam);
        global.gameManager.socketManager.broadcast(`The dominator is now controlled by ${teamName}!`);
      } else {
        // Dominator is contested when it belongs to a team
        global.gameManager.socketManager.broadcast("The dominator is being contested!");
      }

      global.gameManager.socketManager.broadcast("The dominator has been destroyed!");
      this.spawnDominator(newTeam, newColor);

      // Update the center domination tile color
      const centerTile = global.gameManager.room.setup[7][7];
      if (centerTile) {
        centerTile.color = newColor;
      }

      global.gameManager.socketManager.broadcastRoom();
    });

    this.dominator = o;
  }

  start() {
    this.gameActive = true;
    this.spawnDominator();
  }

  reset() {
    this.gameActive = false;
    if (this.dominator) {
      this.dominator.kill();
      this.dominator = null;
    }
  }

  redefine(theshit) {
    // No special redefinition needed for this gamemode
  }
}

module.exports = { TwoTDMOneDominator };
