const NetworkOrchestrator = require("./NetworkManager.js");

class SocketBridge {
  constructor(existingSocketManager) {
    this.socketManager = existingSocketManager;
    this.networkOrchestrator = new NetworkOrchestrator({
      enableCompression: true,
      enableEncryption: false,
      connectionTimeout: 30000,
      heartbeatInterval: 5000
    });

    this.setupEventHandlers();
    this.adaptExistingSockets();
  }

  setupEventHandlers() {
    this.networkOrchestrator.on("playerEntered", (data) => {
      this.handlePlayerEntered(data);
    });

    this.networkOrchestrator.on("playerMovement", (data) => {
      this.handlePlayerMovement(data);
    });

    this.networkOrchestrator.on("playerAction", (data) => {
      this.handlePlayerAction(data);
    });

    this.networkOrchestrator.on("playerMessage", (data) => {
      this.handlePlayerMessage(data);
    });

    this.networkOrchestrator.on("evolutionRequest", (data) => {
      this.handleEvolutionRequest(data);
    });

    this.networkOrchestrator.on("enhancementRequest", (data) => {
      this.handleEnhancementRequest(data);
    });

    this.networkOrchestrator.on("connectionClosed", (data) => {
      this.handleConnectionClosed(data);
    });
  }

  adaptExistingSockets() {
    const originalNewPlayer = this.socketManager.newPlayer;
    this.socketManager.newPlayer = (socket) => {
      const result = originalNewPlayer.call(this.socketManager, socket);
      this.setupSocketNetworking(socket);
      return result;
    };

    const originalClose = this.socketManager.close;
    this.socketManager.close = (socket) => {
      this.networkOrchestrator.removeConnection(socket.socketId);
      return originalClose.call(this.socketManager, socket);
    };
  }

  setupSocketNetworking(socket) {
    socket.socketId = this.generateSocketId(socket);

    const connection = this.networkOrchestrator.getOrCreateConnection(socket.socketId);

    connection.send = (data) => {
      if (socket.readyState === socket.OPEN) {
        socket.send(data);
      }
    };

    const originalOnMessage = socket.onmessage;
    socket.onmessage = (event) => {
      try {
        const rawData = Buffer.from(event.data);

        if (rawData.length >= 2 && rawData.readUInt16BE(0) === 0xABCD) {
          this.networkOrchestrator.handleIncomingPacket(rawData, {
            socketId: socket.socketId,
            socket: socket,
            ip: socket.ip,
            player: socket.player
          });
        } else {
          if (originalOnMessage) {
            originalOnMessage.call(socket, event);
          }
        }
      } catch (error) {
        console.error("Socket message error:", error);
        if (originalOnMessage) {
          originalOnMessage.call(socket, event);
        }
      }
    };

    socket.talk = (...args) => {
      const packetType = this.legacyToNewPacketType(args[0]);
      if (packetType) {
        const packetData = args.slice(1);
        this.networkOrchestrator.sendPacket(socket.socketId, packetType, packetData);
      } else {
        if (socket.originalTalk) {
          socket.originalTalk(...args);
        }
      }
    };

    socket.originalTalk = socket.talk;
  }

  legacyToNewPacketType(legacyType) {
    const mapping = {
      "s": "ENTER_GAME",
      "C": "ACTION",
      "M": "MESSAGE",
      "U": "EVOLVE",
      "x": "ENHANCE",
      "p": "HEARTBEAT",
      "S": "CLOCK_SYNC",
      "d": "DOWNLINK",
      "t": "TOGGLE",
      "L": "LEVEL_UP",
      "H": "CONTROL",
      "T": "TREE_REQUEST",
      "DTA": "DAILY_AD",
      "DTAD": "DAILY_AD_DONE",
      "DTAST": "DAILY_AD_SKIP",
      "NWB": "NEW_BROADCAST"
    };

    return mapping[legacyType] || null;
  }

  handlePlayerEntered(data) {
    const { socketId, alias, vehicle, faction, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket) {
      return;
    }

    if (socket.player && this.socketManager.initalizePlayer) {
      const epackage = {
        name: alias,
        autoLVLup: 0,
        transferbodyID: null,
        braindamagemode: false
      };

      this.socketManager.initalizePlayer(epackage, socket);
    }
  }

  handlePlayerMovement(data) {
    const { socketId, posX, posY, heading, moment, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket || !socket.player) {
      return;
    }

    if (socket.player.body) {
      socket.player.target = { x: posX, y: posY };
      socket.player.body.facing = heading;
    }
  }

  handlePlayerAction(data) {
    const { socketId, actions, moment, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket || !socket.player) {
      return;
    }

    if (socket.player.command) {
      socket.player.command.up = actions.forward;
      socket.player.command.down = actions.backward;
      socket.player.command.left = actions.left;
      socket.player.command.right = actions.right;
      socket.player.command.lmb = actions.primary;
      socket.player.command.mmb = actions.secondary;
      socket.player.command.rmb = actions.special;
    }
  }

  handlePlayerMessage(data) {
    const { socketId, text, recipient, moment, playerAlias, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket) {
      return;
    }

    if (global.chats && socket.player && socket.player.body) {
      const id = socket.player.body.id;
      if (!global.chats[id]) {
        global.chats[id] = [];
      }

      global.chats[id].unshift({
        text,
        expires: Date.now() + global.Config.chat_message_duration
      });

      if (this.socketManager.chatLoop) {
        this.socketManager.chatLoop();
      }
    }
  }

  handleEvolutionRequest(data) {
    const { socketId, path, branch, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket || !socket.player) {
      return;
    }

    if (socket.player.body && socket.player.body.upgrade) {
      socket.player.body.upgrade(path, branch);
    }
  }

  handleEnhancementRequest(data) {
    const { socketId, attribute, magnitude, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket || !socket.player) {
      return;
    }

    if (socket.player.body && socket.player.body.skillUp) {
      for (let i = 0; i < magnitude; i++) {
        socket.player.body.skillUp(attribute);
      }
    }
  }

  handleConnectionClosed(data) {
    const { socketId, connection } = data;

    const socket = this.findSocketById(socketId);
    if (!socket) {
      return;
    }

    if (this.socketManager.close) {
      this.socketManager.close(socket);
    }
  }

  findSocketById(socketId) {
    for (const client of this.socketManager.clients) {
      if (client.socketId === socketId) {
        return client;
      }
    }
    return null;
  }

  generateSocketId(socket) {
    return "socket_" + (socket.ip || "unknown") + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  }

  sendGameState(entities, roomInfo) {
    this.networkOrchestrator.broadcastPacket("WORLD_STATE", {
      entities: entities,
      gameTime: Date.now(),
      roomInfo: roomInfo
    });
  }

  sendEntityUpdate(socketId, entityData) {
    this.networkOrchestrator.sendPacket(socketId, "ENTITY_STATE", [
      entityData.id,
      entityData.position,
      entityData.health,
      entityData.shield,
      Date.now()
    ]);
  }

  getStats() {
    return {
      networkOrchestrator: this.networkOrchestrator.getMetrics(),
      adaptedSockets: this.socketManager.clients.filter(c => c.socketId).length
    };
  }

  shutdown() {
    this.networkOrchestrator.shutdown();
  }
}

module.exports = SocketBridge;
