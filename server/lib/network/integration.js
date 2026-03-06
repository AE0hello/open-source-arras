const { GameNetworkSystem } = require("./index.js");

let networkSystem;

function initializeCustomNetworking() {
  console.log("Initializing Custom Networking System...");

  networkSystem = new GameNetworkSystem({
    enableValidation: true,
    enableCompression: true,
    enableEncryption: false,
    connectionTimeout: 30000,
    heartbeatInterval: 5000
  });

  console.log("Custom Networking System initialized successfully");
  return networkSystem;
}

function integrateWithExistingSocketManager(existingSocketManager) {
  console.log("Integrating with existing Socket Manager...");

  const socketBridge = networkSystem.createSocketBridge(existingSocketManager);

  socketBridge.networkOrchestrator.on("playerEntered", (data) => {
    console.log(`Player entered: ${data.alias} (${data.socketId})`);
  });

  socketBridge.networkOrchestrator.on("playerMovement", (data) => {
    if (global.gameManager && global.gameManager.handlePlayerMovement) {
      global.gameManager.handlePlayerMovement(data);
    }
  });

  socketBridge.networkOrchestrator.on("playerAction", (data) => {
    if (global.gameManager && global.gameManager.handlePlayerAction) {
      global.gameManager.handlePlayerAction(data);
    }
  });

  socketBridge.networkOrchestrator.on("playerMessage", (data) => {
    if (global.gameManager && global.gameManager.handlePlayerMessage) {
      global.gameManager.handlePlayerMessage(data);
    }
  });

  socketBridge.networkOrchestrator.on("evolutionRequest", (data) => {
    if (global.gameManager && global.gameManager.handleEvolutionRequest) {
      global.gameManager.handleEvolutionRequest(data);
    }
  });

  socketBridge.networkOrchestrator.on("enhancementRequest", (data) => {
    if (global.gameManager && global.gameManager.handleEnhancementRequest) {
      global.gameManager.handleEnhancementRequest(data);
    }
  });

  console.log("Socket integration complete");
  return socketBridge;
}

function setupCustomPacketHandlers() {
  console.log("Setting up custom packet handlers...");

  networkSystem.registerPacketType("CUSTOM_GAME_EVENT", {
    identifier: 5001,
    fields: {
      eventType: { dataType: "string", mandatory: true },
      eventData: { dataType: "object", mandatory: false },
      timestamp: { dataType: "number", mandatory: true }
    },
    guaranteed: true,
    compacted: true
  }, (packet) => {
    const [eventType, eventData, timestamp] = packet.data;
    console.log(`Custom game event: ${eventType}`, eventData);

    if (global.gameManager && global.gameManager.handleCustomEvent) {
      global.gameManager.handleCustomEvent(eventType, eventData, timestamp);
    }
  });

  networkSystem.registerPacketType("SERVER_COMMAND", {
    identifier: 5002,
    fields: {
      command: { dataType: "string", mandatory: true },
      parameters: { dataType: "object", mandatory: false },
      timestamp: { dataType: "number", mandatory: true }
    },
    guaranteed: true,
    compacted: false
  }, (packet) => {
    const [command, parameters, timestamp] = packet.data;
    console.log(`Server command: ${command}`, parameters);

    if (global.gameManager && global.gameManager.handleServerCommand) {
      global.gameManager.handleServerCommand(command, parameters, timestamp);
    }
  });

  console.log("Custom packet handlers registered");
}

function setupNetworkMonitoring() {
  console.log("Setting up network monitoring...");

  setInterval(() => {
    const stats = networkSystem.getNetworkStats();

    if (global.Config && global.Config.network_logging) {
      console.log("=== Network Statistics ===");
      console.log(`Active connections: ${stats.activeConnections}`);
      console.log(`Packets received: ${stats.packetsReceived}`);
      console.log(`Packets sent: ${stats.packetsSent}`);
      console.log(`Bytes transmitted: ${stats.bytesTransmitted}`);

      if (stats.dispatcherStats) {
        console.log(`Average processing time: ${stats.dispatcherStats.averageProcessTime.toFixed(2)}ms`);
        console.log(`Rejected packets: ${stats.dispatcherStats.packetsRejected}`);
      }
    }
  }, 30000);
}

function enhanceGameLoop() {
  if (global.gameManager && global.gameManager.gameLoop) {
    const originalGameLoop = global.gameManager.gameLoop;

    global.gameManager.gameLoop = function () {
      const startTime = performance.now();

      const result = originalGameLoop.call(this);

      const entities = this.getAllEntities ? this.getAllEntities() : [];
      if (entities.length > 0) {
        networkSystem.broadcastPacket("WORLD_STATE", {
          entities: entities.map(entity => ({
            id: entity.id,
            type: entity.type,
            position: { x: entity.x, y: entity.y },
            health: entity.health,
            shield: entity.shield,
            velocity: { x: entity.vx || 0, y: entity.vy || 0 }
          })),
          gameTime: Date.now(),
          roomInfo: {
            width: this.room ? this.room.width : 1000,
            height: this.room ? this.room.height : 1000,
            gameMode: this.gamemode || "ffa"
          }
        });
      }

      const loopTime = performance.now() - startTime;
      if (loopTime > 16) {
        console.warn(`Game loop took ${loopTime.toFixed(2)}ms (target: 16ms)`);
      }

      return result;
    };

    console.log("Enhanced game loop with network integration");
  }
}

function patchSocketManager() {
  if (global.socketManager) {
    const originalNewPlayer = global.socketManager.newPlayer;

    global.socketManager.newPlayer = function (socket) {
      console.log(`New player connecting: ${socket.ip}`);

      const result = originalNewPlayer.call(this, socket);

      if (socket.player) {
        socket.player.customNetworkData = {
          joinTime: Date.now(),
          packetsReceived: 0,
          packetsSent: 0
        };
      }

      return result;
    };

    const originalClose = global.socketManager.close;
    global.socketManager.close = function (socket) {
      console.log(`Player disconnecting: ${socket.ip}`);

      if (socket.player && socket.player.customNetworkData) {
        const sessionTime = Date.now() - socket.player.customNetworkData.joinTime;
        console.log(`Player session: ${socket.ip} - ${sessionTime}ms, ${socket.player.customNetworkData.packetsReceived} packets received`);
      }

      return originalClose.call(this, socket);
    };

    console.log("Socket Manager patched with network enhancements");
  }
}

module.exports = {
  initializeCustomNetworking,
  integrateWithExistingSocketManager,
  setupCustomPacketHandlers,
  setupNetworkMonitoring,
  enhanceGameLoop,
  patchSocketManager,
  getNetworkSystem: () => networkSystem
};
