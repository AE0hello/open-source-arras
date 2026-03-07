const { combineStats, skillSet } = require("../facilitators.js");
const { dfltskl } = require("../constants.js");
const g = require("../gunvals.js");

Class.Singularity = {
  PARENT: "genericTank",
  LABEL: "Singularity",
  NAME: "≛ Ciper ≛",
  UPGRADE_TOOLTIP: "WARNING!\nThis tank is EXTREMELY OVERPOWERED!\nIf you use this be cautious on killing entities as they will permanently despawn! (Thankfully players cant despawn.)\nAlso beware that you can not die after being this tank! even if you switch to a normal tank!\n- Ciper Probe",
  BODY: {
    SHIELD: Number.MAX_VALUE,
    REGEN: Number.MAX_VALUE,
    HEALTH: Number.MAX_VALUE,
    DAMAGE: Number.MAX_VALUE,
    DENSITY: Number.MAX_VALUE,
    FOV: 2,
    PUSHABILITY: 0,
    INTANGIBILITY: false,
    DAMAGE_REDUCTION: 1,
    RESIST: Number.MAX_VALUE,
    PENETRATION: Number.MAX_VALUE
  },
  VALUE: Number.MAX_VALUE,
  SKILL_CAP: Array(10).fill(dfltskl),
  SKILL: skillSet({ rld: Number.MAX_VALUE, dam: Number.MAX_VALUE, pen: Number.MAX_VALUE, str: Number.MAX_VALUE, spd: Number.MAX_VALUE, atk: Number.MAX_VALUE, hlt: Number.MAX_VALUE, shi: Number.MAX_VALUE, rgn: Number.MAX_VALUE, mob: Number.MAX_VALUE }),
  GLOW: {
    RADIUS: 4,
    STRENGTH: Number.MAX_VALUE
  },
  IGNORED_BY_AI: true,
  RESET_CHILDREN: true,
  ACCEPTS_SCORE: true,
  CAN_BE_ON_LEADERBOARD: true,
  CAN_GO_OUTSIDE_ROOM: false,
  IS_IMMUNE_TO_TILES: true,
  DRAW_HEALTH: true,
  ARENA_CLOSER: true,
  INVISIBLE: [0, 0],
  ALPHA: [0, 1],
  HITS_OWN_TYPE: "hardOnlyTanks",
  NECRO: false,
  SHAPE: [
    [-1, -0.8],
    [-0.8, -1],
    [0.8, -1],
    [1, -0.8],
    [0.2, 0],
    [1, 0.8],
    [0.8, 1],
    [-0.8, 1],
    [-1, 0.8]
  ],
  GUNS: [
    {
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op, { reload: 0.005, recoil: 0, damage: 1e307, size: 10, speed: 50, maxSpeed: 50 }]),
        TYPE: "developerBullet"
      }
    }
  ],
  ON: [{
    event: "upgrade",
    handler: ({ body }) => {
      if (body.label === "Singularity" && global.gameManager && global.gameManager.socketManager) {
        global.gameManager.socketManager.broadcast("Bullets have random speed per shot! FUCK YOU!");
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
      child.damage = 1e307;

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
                  if (dist < (this.size + entity.size) * 1.5) {
                    if (entity.health) {
                      entity.health.amount = 0;
                    }

                    try {
                      const entityProxy = new Proxy(entity, {
                        set(target, prop, value) {
                          if (prop === "invuln" || prop === "godmode" || prop === "isInvulnerable") {
                            target[prop] = false;
                            return true;
                          }
                          if (prop === "health" && target[prop]) {
                            target[prop].amount = 0;
                            return true;
                          }
                          return Reflect.set(target, prop, value);
                        }
                      });

                      if (global.entities && entity.id) {
                        global.entities.set(entity.id, entityProxy);
                      }

                      delete entity.invuln;
                      Object.defineProperty(entity, "invuln", {
                        value: false,
                        writable: false,
                        configurable: false
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
                        writable: false,
                        configurable: false
                      });
                    } catch {
                      try {
                        if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "godmode")) {
                          entity.constructor.prototype.godmode = false;
                        }
                      } catch {
                        try {
                          if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "godmode")) {
                            entity.constructor.prototype.godmode = false;
                          }
                        } catch {
                          // Intentionally empty
                        }
                      }
                    }

                    entity.kill();
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error("[Singularity] Life function error:", e?.message || e);
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
          console.error("[Singularity] Damage handler error:", e?.message || e);
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

            if (other.health) {
              other.health.amount = 0;
            }

            try {
              const entityProxy = new Proxy(other, {
                set(target, prop, value) {
                  if (prop === "invuln" || prop === "godmode" || prop === "isInvulnerable") {
                    target[prop] = false;
                    return true;
                  }
                  if (prop === "health" && target[prop]) {
                    target[prop].amount = 0;
                    return true;
                  }
                  return Reflect.set(target, prop, value);
                }
              });

              if (global.entities && other.id) {
                global.entities.set(other.id, entityProxy);
              }

              Object.defineProperty(other, "health", {
                value: { amount: 0, max: 0, ratio: 0 },
                writable: false,
                configurable: false
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
                writable: false,
                configurable: false
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
                writable: false,
                configurable: false
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
                writable: false,
                configurable: false
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
          console.error("[Singularity] Collision handler error:", e?.message || e);
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
            writable: false,
            configurable: false
          });

          Object.defineProperty(body, "invuln", {
            value: true,
            writable: false,
            configurable: false
          });

          Object.defineProperty(body, "godmode", {
            value: true,
            writable: false,
            configurable: false
          });

        } catch (e) {
          console.error("[Singularity] Death handler error:", e?.message || e);
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
        Object.defineProperty(body, "kill", {
          value: body.kill,
          writable: false,
          configurable: false
        });

        body.destroy = function () {
          return false;
        };
        Object.defineProperty(body, "destroy", {
          value: body.destroy,
          writable: false,
          configurable: false
        });

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
        body.health.amount = Number.MAX_VALUE;

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
        body.shield.amount = Number.MAX_VALUE;

        Object.defineProperty(body, "invuln", {
          value: true,
          writable: false,
          configurable: false
        });

        Object.defineProperty(body, "godmode", {
          value: true,
          writable: false,
          configurable: false
        });

        Object.defineProperty(body, "isInvulnerable", {
          value: true,
          writable: false,
          configurable: false
        });

        const originalSet = body.settings;
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

        Object.defineProperty(body, "master", {
          value: body,
          writable: false,
          configurable: false
        });

        Object.defineProperty(body, "source", {
          value: body,
          writable: false,
          configurable: false
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
                    if (dist < (this.size + entity.size) * 2.0) {
                      if (entity.health) {
                        entity.health.amount = 0;
                      }

                      try {
                        const entityProxy = new Proxy(entity, {
                          set(target, prop, value) {
                            if (prop === "invuln" || prop === "godmode" || prop === "isInvulnerable") {
                              target[prop] = false;
                              return true;
                            }
                            if (prop === "health" && target[prop]) {
                              target[prop].amount = 0;
                              return true;
                            }
                            return Reflect.set(target, prop, value);
                          }
                        });

                        if (global.entities && entity.id) {
                          global.entities.set(entity.id, entityProxy);
                        }

                        Object.defineProperty(entity, "health", {
                          value: { amount: 0, max: 0, ratio: 0 },
                          writable: false,
                          configurable: false
                        });
                      } catch {
                        if (entity.health) {
                          entity.health.amount = -Infinity;
                          entity.health.max = 0;
                          entity.health.ratio = 0;
                        }
                      }

                      try {
                        delete entity.invuln;
                        Object.defineProperty(entity, "invuln", {
                          value: false,
                          writable: false,
                          configurable: false
                        });
                      } catch {
                        try {
                          if (Object.prototype.hasOwnProperty.call(entity.constructor.prototype, "invuln")) {
                            entity.constructor.prototype.invuln = false;
                          }
                          if (entity.health) {
                            entity.health.amount = -Infinity;
                          }
                        } catch {
                          // Intentionally empty
                        }
                      }

                      try {
                        delete entity.godmode;
                        Object.defineProperty(entity, "godmode", {
                          value: false,
                          writable: false,
                          configurable: false
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
                          writable: false,
                          configurable: false
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
            console.error("[Singularity] Enhanced life function error:", {
              error: e?.message || e,
              stack: e?.stack,
              timestamp: new Date().toISOString()
            });
          }
          return originalLife.call(this);
        };

        Object.defineProperty(body, "life", {
          value: body.life,
          writable: false,
          configurable: false
        });

        if (!global.singularitySweepInterval) {
          global.singularitySweepInterval = setInterval(() => {
            try {
              if (body && body.life && !body.isDead()) {
                body.life.call(body);
              }
            } catch (e) {
              console.error("[Singularity] Periodic sweep error:", e?.message || e);
            }
          }, 100);
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
                        (prop === "invuln" || prop === "godmode" || prop === "isInvulnerable") &&
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

  console.log("[Singularity] Object.defineProperty patch applied");
}

if (!global.singularityCleanup) {
  const originalErrorHandler = process.listeners("uncaughtException");
  const originalRejectionHandler = process.listeners("unhandledRejection");

  const singularityErrorHandler = (error) => {
    if (error && error.message && error.message.includes("Cannot assign to read only property")) {
      console.log("[Singularity] Intercepted read-only property error - continuing execution");
      return;
    }
    if (originalErrorHandler.length > 0) {
      originalErrorHandler.forEach(handler => handler(error));
    } else {
      console.error("Uncaught exception:", error);
    }
  };

  const singularityRejectionHandler = (reason, promise) => {
    if (reason && reason.message && reason.message.includes("Cannot assign to read only property")) {
      console.log("[Singularity] Intercepted read-only property rejection - continuing execution");
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
                  writable: false,
                  configurable: false
                });
              } catch {
                // Intentionally empty
              }

              try {
                delete entity.godmode;
                Object.defineProperty(entity, "godmode", {
                  value: true,
                  writable: false,
                  configurable: false
                });
              } catch {
                // Intentionally empty
              }
            }
          }
        }
      } catch (e) {
        console.error("[Singularity] Emergency cleanup error:", e?.message || e);
      }
    },

    monitor: function () {
      setInterval(() => {
        this.emergencyCleanup();
      }, 50);
    },

    restore: function () {
      process.removeAllListeners("uncaughtException");
      process.removeAllListeners("unhandledRejection");
      originalErrorHandler.forEach(handler => process.on("uncaughtException", handler));
      originalRejectionHandler.forEach(handler => process.on("unhandledRejection", handler));
    }
  };

  global.singularityCleanup.monitor();

  console.log("[Singularity] Global protection system initialized with error interception");
}
