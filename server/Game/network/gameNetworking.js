const { getNetworkSystem } = require("../../lib/network/integration.js");

function setupGameNetworking(gameManager) {
  console.log("Setting up game-specific networking...");

  let networkSystem = getNetworkSystem();
  if (!networkSystem) {
    console.log("Network system not found in this worker, initializing...");
    const { initializeCustomNetworking } = require("../../lib/network/integration.js");
    networkSystem = initializeCustomNetworking();
  }

  // Player movement handler
  gameManager.handlePlayerMovement = function (data) {
    const { socketId, posX, posY, heading, moment } = data;

    // Find the player
    const player = this.findPlayerBySocketId(socketId);
    if (player && player.body) {
      // Update player position and facing
      player.target = { x: posX, y: posY };
      player.body.facing = heading;

      // Log movement for debugging
      if (global.Config && global.Config.debug_movement) {
        console.log(`Movement: ${socketId} -> (${posX}, ${posY}) @ ${heading}`);
      }
    }
  };

  // Player action handler
  gameManager.handlePlayerAction = function (data) {
    const { socketId, actions, moment } = data;

    const player = this.findPlayerBySocketId(socketId);
    if (player && player.command) {
      // Update player commands
      player.command.up = actions.forward;
      player.command.down = actions.backward;
      player.command.left = actions.left;
      player.command.right = actions.right;
      player.command.lmb = actions.primary;
      player.command.mmb = actions.secondary;
      player.command.rmb = actions.special;

      if (global.Config && global.Config.debug_actions) {
        console.log(`Actions: ${socketId} ->`, actions);
      }
    }
  };

  // Player message handler
  gameManager.handlePlayerMessage = function (data) {
    const { socketId, text, recipient, moment, playerAlias } = data;

    const player = this.findPlayerBySocketId(socketId);
    if (player) {
      // Use existing chat system
      if (global.chats && player.body) {
        const id = player.body.id;
        if (!global.chats[id]) {
          global.chats[id] = [];
        }

        global.chats[id].unshift({
          text,
          expires: Date.now() + (global.Config.chat_message_duration || 30000)
        });

        // Broadcast to all players
        this.broadcastMessage(text, playerAlias || player.name);

        if (global.Config && global.Config.debug_chat) {
          console.log(`Chat: ${playerAlias || player.name}: ${text}`);
        }
      }
    }
  };

  // Evolution request handler
  gameManager.handleEvolutionRequest = function (data) {
    const { socketId, path, branch } = data;

    const player = this.findPlayerBySocketId(socketId);
    if (player && player.body && player.body.upgrade) {
      player.body.upgrade(path, branch);

      if (global.Config && global.Config.debug_upgrades) {
        console.log(`Upgrade: ${socketId} -> path=${path}, branch=${branch}`);
      }
    }
  };

  // Enhancement request handler
  gameManager.handleEnhancementRequest = function (data) {
    const { socketId, attribute, magnitude } = data;

    const player = this.findPlayerBySocketId(socketId);
    if (player && player.body && player.body.skillUp) {
      for (let i = 0; i < magnitude; i++) {
        player.body.skillUp(attribute);
      }

      if (global.Config && global.Config.debug_skills) {
        console.log(`Skill: ${socketId} -> ${attribute} x${magnitude}`);
      }
    }
  };

  // Custom event handler
  gameManager.handleCustomEvent = function (eventType, eventData, timestamp) {
    console.log(`Custom event: ${eventType}`, eventData);

    switch (eventType) {
      case "admin_command":
        this.handleAdminCommand(eventData);
        break;
      case "server_broadcast":
        this.broadcastToAll(eventData.message, eventData.type || "info");
        break;
      case "emergency_restart":
        this.handleEmergencyRestart(eventData);
        break;
      default:
        console.log(`Unknown custom event: ${eventType}`);
    }
  };

  // Server command handler
  gameManager.handleServerCommand = function (command, parameters, timestamp) {
    console.log(`Server command received: ${command}`, parameters);

    switch (command) {
      case "restart":
        this.scheduleRestart(parameters.delay || 30);
        break;
      case "shutdown":
        this.scheduleShutdown(parameters.delay || 30);
        break;
      case "broadcast":
        this.broadcastToAll(parameters.message, "admin");
        break;
      case "kick":
        this.kickPlayer(parameters.playerId, parameters.reason);
        break;
      case "ban":
        this.banPlayer(parameters.playerId, parameters.duration, parameters.reason);
        break;
      default:
        console.log(`Unknown server command: ${command}`);
    }
  };

  // Helper function to find player by socket ID
  gameManager.findPlayerBySocketId = function (socketId) {
    if (!this.players) {
      return null;
    }

    for (const player of this.players) {
      if (player.socket && player.socket.socketId === socketId) {
        return player;
      }
    }
    return null;
  };

  // Enhanced broadcast function
  gameManager.broadcastToAll = function (message, type = "info") {
    if (global.socketManager) {
      global.socketManager.broadcast(message);
    }

    // Also use custom networking if available
    if (networkSystem) {
      networkSystem.broadcastPacket("BROADCAST_MESSAGE", {
        message,
        type,
        timestamp: Date.now()
      });
    }
  };

  // Admin command handler
  gameManager.handleAdminCommand = function (commandData) {
    const { command, parameters, adminId } = commandData;

    console.log(`Admin command: ${command} by ${adminId}`, parameters);

    // Implement admin commands here
    switch (command) {
      case "spawn_entity":
        this.spawnCustomEntity(parameters);
        break;
      case "modify_room":
        this.modifyRoom(parameters);
        break;
      case "player_stats":
        this.showPlayerStats(parameters.playerId);
        break;
      default:
        console.log(`Unknown admin command: ${command}`);
    }
  };

  console.log("Game networking handlers installed");
}

module.exports = { setupGameNetworking };
