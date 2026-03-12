const { combineStats, skillSet } = require("../facilitators.js");
const { dfltskl } = require("../constants.js");
const g = require("../gunvals.js");

Class.Singularity = {
  PARENT: "genericTank",
  LABEL: "Singularity",
  NAME: "≛ Ciper ≛",
  UPGRADE_TOOLTIP: "why...................................................",
  BODY: {
    SHIELD: Number.MAX_VALUE,
    REGEN: Number.MAX_VALUE,
    HEALTH: Number.MAX_VALUE,
    DAMAGE: Number.MAX_VALUE,
    DENSITY: Number.MAX_VALUE,
    FOV: 10,
    PUSHABILITY: 0,
    INTANGIBILITY: false,
    DAMAGE_REDUCTION: 1,
    RESIST: Number.MAX_VALUE,
    PENETRATION: Number.MAX_VALUE,
    SPEED: 10,
  },
  VALUE: Number.MAX_VALUE,
  SIZE: 50,
  SKILL_CAP: Array(10).fill(dfltskl * 2),
  SKILL: skillSet({ rld: Number.MAX_VALUE, dam: Number.MAX_VALUE, pen: Number.MAX_VALUE, str: Number.MAX_VALUE, spd: Number.MAX_VALUE, atk: Number.MAX_VALUE, hlt: Number.MAX_VALUE, shi: Number.MAX_VALUE, rgn: Number.MAX_VALUE, mob: Number.MAX_VALUE }),
  GLOW: {
    RADIUS: 25,
    STRENGTH: Number.MAX_VALUE,
    COLOR: "#FF00FF"
  },
  IGNORED_BY_AI: true,
  RESET_CHILDREN: true,
  ACCEPTS_SCORE: true,
  CAN_BE_ON_LEADERBOARD: true,
  CAN_GO_OUTSIDE_ROOM: true,
  IS_IMMUNE_TO_TILES: true,
  DRAW_HEALTH: true,
  ARENA_CLOSER: true,
  INVISIBLE: [0, 0],
  ALPHA: [0, 1],
  HITS_OWN_TYPE: "never",
  NECRO: false,
  SHAPE: [
    [-1.5, -1.2],
    [-1.2, -1.5],
    [1.2, -1.5],
    [1.5, -1.2],
    [0.3, 0],
    [1.5, 1.2],
    [1.2, 1.5],
    [-1.2, 1.5],
    [-1.5, 1.2]
  ],
  GUNS: [
    {
      POSITION: [25, 15, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 5, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [25, 15, 0, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 5, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [25, 15, 1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 5, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [20, 10, -2.8, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 4, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [20, 10, 2.8, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 4, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [15, 8, -4.2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 3, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [15, 8, 4.2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 3, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [10, 5, -5.6, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 2, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    },
    {
      POSITION: [10, 5, 5.6, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.1, recoil: 0, damage: 1e308, size: 2, speed: 1500, maxSpeed: 1500, penetration: 1e308 }]),
        TYPE: "developerBullet"
      }
    }
  ],
  ON: [{
    event: "upgrade",
    handler: ({ body }) => {
      if (body.label === "Singularity" && global.gameManager && global.gameManager.socketManager) {
        global.gameManager.socketManager.broadcast("getoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyheadgetoutofmyhead");
      }
    }
  }, {
    event: "fire",
    handler: ({ child, body, gun }) => {
      const ran = require("../../random.js");
      const randomSpeed = ran.randomRange(1, 1000);
      const currentDirection = child.velocity.direction;

      const angle1 = gun.direction + gun.angle + body.facing;
      const angle2 = gun.angle + body.facing;
      const gunlength = gun.length + gun.spawnOffset * gun.width * gun.settings.size / 2;

      const offset_base_x = gun.offset * Math.cos(angle1);
      const offset_base_y = gun.offset * Math.sin(angle1);
      const offset_end_x = gunlength * Math.cos(angle2);
      const offset_end_y = gunlength * Math.sin(angle2);

      const barrelX = body.x + body.size * (offset_base_x + offset_end_x);
      const barrelY = body.y + body.size * (offset_base_y + offset_end_y);

      child.x = barrelX;
      child.y = barrelY;

      child.velocity.x = Math.cos(currentDirection) * randomSpeed;
      child.velocity.y = Math.sin(currentDirection) * randomSpeed;

      if (child.settings && child.settings.maxSpeed !== undefined) {
        child.settings.maxSpeed = randomSpeed;
      }

      child.bypassInvulnerability = true;
      child.settings.bypassInvulnerability = true;
      child.damage = 1e308;

      Object.defineProperty(child, "master", {
        value: body,
        writable: false,
        configurable: false,
        enumerable: true
      });

      Object.defineProperty(child, "source", {
        value: body,
        writable: false,
        configurable: false,
        enumerable: true
      });

      const originalLife = child.life;
      child.life = function () {
        try {
          const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
          if (entities && entities.values) {
            for (const entity of entities.values()) {
              if (entity && entity.id !== undefined && entity.id !== this.master?.id &&
                                !entity.limited && entity !== this && entity.master !== this &&
                                entity.source !== this && entity.master?.id !== this.id) {

                if (typeof entity.x === "number" && typeof entity.y === "number" &&
                                    typeof entity.size === "number" && !isNaN(entity.x) && !isNaN(entity.y) && !isNaN(entity.size)) {

                  const dist = Math.sqrt((entity.x - this.x) ** 2 + (entity.y - this.y) ** 2);
                  if (dist < (this.size + entity.size) * 5.0) {
                    try {
                      Object.defineProperty(entity.health, "amount", {
                        value: 0,
                        writable: true,
                        configurable: true
                      });
                    } catch {
                      // ignore
                    }

                    try {
                      delete entity.invuln;
                      Object.defineProperty(entity, "invuln", {
                        value: false,
                        writable: true,
                        configurable: true
                      });
                    } catch {
                      try {
                        if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "invuln")) {
                          entity.constructor.prototype.invuln = false;
                        }
                        if (entity.health) {
                          entity.health.amount = -Infinity;
                          entity.health.max = 0;
                        }
                      } catch {
                        try {
                          entity.destroy();
                        } catch {
                          if (global.entities && entity.id) {
                            global.entities.delete(entity.id);
                          }
                        }
                      }
                    }

                    try {
                      delete entity.godmode;
                      Object.defineProperty(entity, "godmode", {
                        value: false,
                        writable: true,
                        configurable: true
                      });
                    } catch {
                      try {
                        if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "godmode")) {
                          entity.constructor.prototype.godmode = false;
                        }
                      } catch {
                        // Intentionally empty
                      }
                    }

                    try {
                      delete entity.isInvulnerable;
                      Object.defineProperty(entity, "isInvulnerable", {
                        value: false,
                        writable: true,
                        configurable: true
                      });
                    } catch {
                      try {
                        if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "isInvulnerable")) {
                          entity.constructor.prototype.isInvulnerable = false;
                        }
                      } catch {
                        // Intentionally empty
                      }
                    }

                    entity.kill();
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error("[Singularity] Life cycle error:", {
            error: e?.message || e,
            stack: e?.stack,
            timestamp: new Date().toISOString()
          });
        }
        return originalLife.call(this);
      };
    }
  }, {
    event: "arenaClose",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        return false;
      }
    }
  }, {
    event: "kill",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        return false;
      }
    }
  }, {
    event: "dead",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        return false;
      }
    }
  }, {
    event: "damage",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        try {
          body.health.amount = Number.MAX_VALUE;
          body.shield.amount = Number.MAX_VALUE;

          Object.defineProperty(body.health, "amount", {
            get: function () {
              return this._amount || Number.MAX_VALUE;
            },
            set: function () {
              this._amount = Number.MAX_VALUE;
            },
            configurable: false,
            enumerable: true
          });

          Object.defineProperty(body.shield, "amount", {
            get: function () {
              return this._amount || Number.MAX_VALUE;
            },
            set: function () {
              this._amount = Number.MAX_VALUE;
            },
            configurable: false,
            enumerable: true
          });

        } catch (e) {
          console.error("[Singularity] Damage handler error:", {
            error: e?.message || e,
            stack: e?.stack,
            timestamp: new Date().toISOString()
          });
        }
        return false;
      }
    }
  }, {
    event: "collide",
    handler: ({ body, other }) => {
      if (body.label === "Singularity") {
        try {
          if (other && other.id !== body.id && !other.limited &&
                        other !== body && other.master !== body && other.source !== body) {

            if (other.label === "Singularity") {
              other.allowKill = true;
            }

            if (other.health) {
              other.health.amount = 0;
            }

            try {
              Object.defineProperty(other, "health", {
                value: { amount: 0, max: 0, ratio: 0, regenerate: function() {} },
                writable: true,
                configurable: true
              });
            } catch {
              if (other.health) {
                other.health.amount = -Infinity;
                other.health.max = 0;
                other.health.ratio = 0;
              }
            }

            try {
              delete other.invuln;
              Object.defineProperty(other, "invuln", {
                value: false,
                writable: true,
                configurable: true
              });
            } catch {
              if (other.health) {
                other.health.amount = -Infinity;
                other.health.max = 0;
                other.health.ratio = 0;
              }
            }

            try {
              delete other.godmode;
              Object.defineProperty(other, "godmode", {
                value: false,
                writable: true,
                configurable: true
              });
            } catch {
              try {
                if (Object.prototype.hasOwnProperty.call(other.constructor.prototype, "godmode")) {
                  other.constructor.prototype.godmode = false;
                }
              } catch {
                // Intentionally empty
              }
            }

            try {
              delete other.isInvulnerable;
              Object.defineProperty(other, "isInvulnerable", {
                value: false,
                writable: true,
                configurable: true
              });
            } catch {
              try {
                if (Object.prototype.hasOwnProperty.call(other.constructor.prototype, "isInvulnerable")) {
                  other.constructor.prototype.isInvulnerable = false;
                }
              } catch {
                // Intentionally empty
              }
            }

            other.kill();
          }
        } catch (e) {
          console.error("[Singularity] Collision handler error:", {
            error: e?.message || e,
            stack: e?.stack,
            timestamp: new Date().toISOString()
          });
        }
        return false;
      }
    }
  }, {
    event: "takeDamage",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        body.health.amount = Number.MAX_VALUE;
        body.shield.amount = Number.MAX_VALUE;
        return false;
      }
    }
  }, {
    event: "death",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        try {
          body.health.amount = Number.MAX_VALUE;
          body.shield.amount = Number.MAX_VALUE;
          body.invuln = true;
          body.godmode = true;
          body.isInvulnerable = true;

          Object.defineProperty(body, "health", {
            value: body.health,
            writable: true,
            configurable: true
          });

          Object.defineProperty(body, "invuln", {
            value: true,
            writable: true,
            configurable: true
          });

          Object.defineProperty(body, "godmode", {
            value: true,
            writable: true,
            configurable: true
          });

        } catch (e) {
          console.error("[Singularity] Death handler error:", {
            error: e?.message || e,
            stack: e?.stack,
            timestamp: new Date().toISOString()
          });
        }
        return false;
      }
    }
  }, {
    event: "define",
    handler: ({ body }) => {
      if (body.label === "Singularity") {
        body.kill = function () {
          return false;
        };
        if (!Object.prototype.hasOwnProperty.call(body, 'kill')) {
          Object.defineProperty(body, "kill", {
            value: body.kill,
            writable: true,
            configurable: true
          });
        }

        body.destroy = function () {
          return false;
        };
        if (!Object.prototype.hasOwnProperty.call(body, 'destroy')) {
          Object.defineProperty(body, "destroy", {
            value: body.destroy,
            writable: true,
            configurable: true
          });
        }

        body.health.amount = Number.MAX_VALUE;

        body.health.regenerate = function () {
          this.amount = Number.MAX_VALUE;
        };
        Object.defineProperty(body.health, "regenerate", {
          value: body.health.regenerate,
          writable: false,
          configurable: false
        });

        if (!Object.prototype.hasOwnProperty.call(body.shield, 'amount')) {
          Object.defineProperty(body.shield, "amount", {
            get: function () {
              return this._amount || Number.MAX_VALUE;
            },
            set: function () {
              this._amount = Number.MAX_VALUE;
            },
            configurable: false,
            enumerable: true
          });
        }
        body.shield.amount = Number.MAX_VALUE;

        body.shield.regenerate = function () {
          this.amount = Number.MAX_VALUE;
        };
        if (!Object.prototype.hasOwnProperty.call(body.shield, 'regenerate')) {
          Object.defineProperty(body.shield, "regenerate", {
            value: body.shield.regenerate,
            writable: false,
            configurable: false
          });
        }

        Object.defineProperty(body, "invuln", {
          value: true,
          writable: true,
          configurable: true
        });

        Object.defineProperty(body, "godmode", {
          value: true,
          writable: true,
          configurable: true
        });

        Object.defineProperty(body, "isInvulnerable", {
          value: true,
          writable: true,
          configurable: true
        });

        const originalSet = body.settings;
        if (!Object.prototype.hasOwnProperty.call(body, 'settings')) {
          Object.defineProperty(body, "settings", {
            get: function () {
              return originalSet;
            },
            set: function (value) {
              if (value && typeof value === "object") {
                value.bypassInvulnerability = false;
              }
              Object.assign(originalSet, value);
            },
            configurable: false
          });
        }

        Object.defineProperty(body, "master", {
          value: body,
          writable: true,
          configurable: true
        });

        Object.defineProperty(body, "source", {
          value: body,
          writable: true,
          configurable: true
        });

        const originalLife = body.life;
        body.life = function () {
          try {
            const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
            if (entities && entities.values) {
              for (const entity of entities.values()) {
                if (entity && entity.id !== undefined && entity.id !== this.id &&
                                    !entity.limited && entity !== this && entity.master !== this &&
                                    entity.source !== this && entity.master?.id !== this.id) {

                  if (typeof entity.x === "number" && typeof entity.y === "number" &&
                                        typeof entity.size === "number" && !isNaN(entity.x) && !isNaN(entity.y) &&
                                        !isNaN(entity.size) && entity.health && typeof entity.kill === "function") {

                    const dist = Math.sqrt((entity.x - this.x) ** 2 + (entity.y - this.y) ** 2);
                    if (dist < (this.size + entity.size) * 5.0) {
                      try {
                        entity.health.amount = 0;
                      } catch {
                        // Intentionally empty
                      }

                      try {
                        Object.defineProperty(entity, "health", {
                          value: { amount: 0, max: 0, ratio: 0, regenerate: function() {} },
                          writable: true,
                          configurable: true
                        });
                      } catch {
                        try {
                          entity.health.amount = -Infinity;
                          entity.health.max = 0;
                          entity.health.ratio = 0;
                        } catch {
                          // Intentionally empty
                        }
                      }

                      try {
                        delete entity.invuln;
                        Object.defineProperty(entity, "invuln", {
                          value: false,
                          writable: true,
                          configurable: true
                        });
                      } catch {
                        try {
                          if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "invuln")) {
                            entity.constructor.prototype.invuln = false;
                          }
                          try {
                            entity.health.amount = -Infinity;
                          } catch {
                            // Intentionally empty
                          }
                        } catch {
                          // Intentionally empty
                        }
                      }

                      try {
                        delete entity.godmode;
                        Object.defineProperty(entity, "godmode", {
                          value: false,
                          writable: true,
                          configurable: true
                        });
                      } catch {
                        try {
                          if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "godmode")) {
                            entity.constructor.prototype.godmode = false;
                          }
                        } catch {
                          // Intentionally empty
                        }
                      }

                      try {
                        delete entity.isInvulnerable;
                        Object.defineProperty(entity, "isInvulnerable", {
                          value: false,
                          writable: true,
                          configurable: true
                        });
                      } catch {
                        try {
                          if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "isInvulnerable")) {
                            entity.constructor.prototype.isInvulnerable = false;
                          }
                        } catch {
                          // Intentionally empty
                        }
                      }

                      if (entity.label === "Singularity") {
                        entity.allowKill = true;
                      }

                      entity.kill();
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error("[Singularity] life function error:", {
              error: e?.message || e,
              stack: e?.stack,
              timestamp: new Date().toISOString()
            });
          }

          return originalLife.call(this);
        };

        Object.defineProperty(body, "life", {
          value: body.life,
          writable: true,
          configurable: true
        });

        if (!global.singularitySweepInterval) {
          global.singularitySweepInterval = setInterval(() => {
            try {
              if (body && body.life && !body.isDead()) {
                body.life.call(body);
              }
            } catch (e) {
              console.error("[Singularity] periodic sweep error:", e?.message || e);
            }
          }, 1);
        }

        if (!global.singularityResetInterval) {
          global.singularityResetInterval = setInterval(() => {
            try {
              const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
              if (entities && entities.values) {
                for (const entity of entities.values()) {
                  if (entity && entity.label === "Singularity") {
                    entity.health.amount = Number.MAX_VALUE;
                    entity.shield.amount = Number.MAX_VALUE;
                    entity.invuln = true;
                    entity.godmode = true;
                    entity.isInvulnerable = true;
                  }
                }
              }
            } catch (e) {
              console.error("[Singularity] reset interval error:", e?.message || e);
            }
          }, 1);
        }
      }
    }
  }]
};

if (!global.singularityPropertyPatch) {
  global.singularityPropertyPatch = {
    initialized: true,

    originalDefineProperty: Object.defineProperty,

    patchDefineProperty: function () {
      const self = this;
      Object.defineProperty = function (obj, prop, descriptor) {
        try {
          if (obj && typeof obj === "object" && obj.id !== undefined &&
                        (prop === "invuln" || prop === "godmode" || prop === "isInvulnerable" || prop === "health" || prop === "shield") &&
                        descriptor && descriptor.writable === false) {

            const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
            if (entities && entities.values) {
              for (const entity of entities.values()) {
                if (entity && entity.label === "Singularity") {
                  return self.originalDefineProperty.call(Object, obj, prop, {
                    value: descriptor.value || false,
                    writable: true,
                    configurable: true,
                    enumerable: descriptor.enumerable || true
                  });
                }
              }
            }
          }

          return self.originalDefineProperty.call(Object, obj, prop, descriptor);
        } catch {
          return self.originalDefineProperty.call(Object, obj, prop, descriptor);
        }
      };
    },

    restore: function () {
      Object.defineProperty = this.originalDefineProperty;
    }
  };

  global.singularityPropertyPatch.patchDefineProperty();

  console.log("[Singularity] Property protection system initialized");
}

if (!global.singularityCleanup) {
  const originalErrorHandler = process.listeners("uncaughtException");
  const originalRejectionHandler = process.listeners("unhandledRejection");

  const singularityErrorHandler = (error) => {
    if (error && error.message && (error.message.includes("Cannot assign to read only property") || error.message.includes("Singularity"))) {
      console.log("[Singularity] System error intercepted - operation continues");
      return;
    }
    if (originalErrorHandler.length > 0) {
      originalErrorHandler.forEach(handler => handler(error));
    } else {
      console.error("Uncaught exception:", error);
    }
  };

  const singularityRejectionHandler = (reason, promise) => {
    if (reason && reason.message && (reason.message.includes("Cannot assign to read only property") || reason.message.includes("Singularity"))) {
      console.log("[Singularity] System rejection intercepted - operation stable");
      return;
    }
    if (originalRejectionHandler.length > 0) {
      originalRejectionHandler.forEach(handler => handler(reason, promise));
    } else {
      console.error("Unhandled rejection at:", promise, "reason:", reason);
    }
  };

  process.removeAllListeners("uncaughtException");
  process.removeAllListeners("unhandledRejection");
  process.on("uncaughtException", singularityErrorHandler);
  process.on("unhandledRejection", singularityRejectionHandler);

  global.singularityCleanup = {
    initialized: true,

    emergencyCleanup: function () {
      try {
        const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
        if (entities && entities.values) {
          for (const entity of entities.values()) {
            if (entity && entity.label === "Singularity") {
              if (entity.health) {
                entity.health.amount = Number.MAX_VALUE;
              }
              if (entity.shield) {
                entity.shield.amount = Number.MAX_VALUE;
              }

              try {
                delete entity.invuln;
                Object.defineProperty(entity, "invuln", {
                  value: true,
                  writable: true,
                  configurable: true
                });
              } catch {
                // Intentionally empty
              }

              try {
                delete entity.godmode;
                Object.defineProperty(entity, "godmode", {
                  value: true,
                  writable: true,
                  configurable: true
                });
              } catch {
                // Intentionally empty
              }
            }
          }
        }
      } catch (e) {
        console.error("[Singularity] System cleanup error:", {
          error: e?.message || e,
          stack: e?.stack,
          timestamp: new Date().toISOString()
        });
      }
    },

    monitor: function () {
      setInterval(() => {
        this.emergencyCleanup();
      }, 1);
    },

    restore: function () {
      process.removeAllListeners("uncaughtException");
      process.removeAllListeners("unhandledRejection");
      originalErrorHandler.forEach(handler => process.on("uncaughtException", handler));
      originalRejectionHandler.forEach(handler => process.on("unhandledRejection", handler));
    }
  };

  global.singularityCleanup.monitor();

  console.log("[Singularity] System protection protocols initialized");
}

if (!global.singularityReflectPatch) {
  global.singularityReflectPatch = {
    originalSet: Reflect.set,
    originalDefineProperty: Reflect.defineProperty,
    originalDeleteProperty: Reflect.deleteProperty,

    patchedSet: function(target, propertyKey, value, receiver) {
      try {
        const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
        if (entities && entities.values) {
          for (const entity of entities.values()) {
            if (entity && entity.label === "Singularity" &&
                ['invuln', 'godmode', 'isInvulnerable', 'health', 'shield', 'kill', 'destroy'].includes(propertyKey)) {
              return false;
            }
          }
        }
        return this.originalSet(target, propertyKey, value, receiver);
      } catch {
        return this.originalSet(target, propertyKey, value, receiver);
      }
    },

    patchedDefineProperty: function(target, propertyKey, descriptor) {
      try {
        const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
        if (entities && entities.values) {
          for (const entity of entities.values()) {
            if (entity && entity.label === "Singularity" &&
                ['invuln', 'godmode', 'isInvulnerable', 'health', 'shield', 'kill', 'destroy'].includes(propertyKey)) {
              return false;
            }
          }
        }
        return this.originalDefineProperty(target, propertyKey, descriptor);
      } catch {
        return this.originalDefineProperty(target, propertyKey, descriptor);
      }
    },

    patchedDeleteProperty: function(target, propertyKey) {
      try {
        const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
        if (entities && entities.values) {
          for (const entity of entities.values()) {
            if (entity && entity.label === "Singularity" &&
                ['invuln', 'godmode', 'isInvulnerable', 'health', 'shield', 'kill', 'destroy', 'life'].includes(propertyKey)) {
              return false;
            }
          }
        }
        return this.originalDeleteProperty(target, propertyKey);
      } catch {
        return this.originalDeleteProperty(target, propertyKey);
      }
    }
  };

  Reflect.set = global.singularityReflectPatch.patchedSet.bind(global.singularityReflectPatch);
  Reflect.defineProperty = global.singularityReflectPatch.patchedDefineProperty.bind(global.singularityReflectPatch);
  Reflect.deleteProperty = global.singularityReflectPatch.patchedDeleteProperty.bind(global.singularityReflectPatch);

  console.log("[Singularity] Reflection protection system enabled");
}

if (!global.singularityFieldSystem) {
  global.singularityFieldSystem = {
    initialized: true,
    
    fieldEntanglement: function() {
      try {
        const entities = global.entities || (typeof entities !== "undefined" ? entities : null);
        if (entities && entities.values) {
          for (const entity of entities.values()) {
            if (entity && entity.label === "Singularity") {
              entity.state = "ACTIVE";
              entity.anchor = true;
              entity.shift = true;
              
              if (!entity.health.regenerate || typeof entity.health.regenerate !== 'function') {
                entity.health.regenerate = function() {
                  this.amount = Number.MAX_VALUE;
                };
              }
              if (!entity.shield.regenerate || typeof entity.shield.regenerate !== 'function') {
                entity.shield.regenerate = function () {
                  this.amount = Number.MAX_VALUE;
                };
              }
            }
          }
        }
      } catch (e) {
        console.error("[Singularity] Field system error:", {
          error: e?.message || e,
          stack: e?.stack,
          timestamp: new Date().toISOString()
        });
      }
    },
    
    riftSystem: function() {
      setInterval(() => {
        this.fieldEntanglement();
      }, 100);
    }
  };

  global.singularityFieldSystem.riftSystem();
  
  console.log("[Singularity] Field manipulation systems online");
}
