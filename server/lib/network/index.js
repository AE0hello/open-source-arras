const NetworkProtocol = require("./PacketProtocol.js");
const BinaryCodec = require("./PacketParser.js");
const PacketDispatcher = require("./PacketRouter.js");
const NetworkOrchestrator = require("./NetworkManager.js");

class GameNetworkSystem {
  constructor(config = {}) {
    this.config = {
      enableValidation: config.enableValidation !== false,
      enableCompression: config.enableCompression !== false,
      enableEncryption: config.enableEncryption || false,
      ...config
    };

    this.protocol = new NetworkProtocol();
    this.codec = new BinaryCodec(this.protocol);
    this.dispatcher = new PacketDispatcher(this.protocol, this.codec);
    this.validators = null;
    this.compression = null;

    this.setupIntegration();
  }

  setupIntegration() {
    if (this.config.enableValidation) {
      this.setupValidation();
    }

    if (this.config.enableCompression) {
      this.setupCompression();
    }
  }

  setupValidation() {
    this.dispatcher.registerInterceptor((packet, context) => {
      const validation = this.protocol.verifyPacket(packet.type, packet.data);

      if (!validation.valid) {
        console.error(`Packet validation failed for ${packet.type}:`, validation.errors);
        return false;
      }

      return context;
    }, { priority: 95, critical: true });
  }

  setupCompression() {
    const originalDecode = this.codec.decodePacket;
    this.codec.decodePacket = (rawData, context) => {
      try {
        const decompressed = this.compression ? this.compression.decompress(rawData) : rawData;
        return originalDecode.call(this.codec, decompressed, context);
      } catch (error) {
        return originalDecode.call(this.codec, rawData, context);
      }
    };

    const originalEncode = this.codec.encodePacket;
    this.codec.encodePacket = (type, data, options) => {
      const encoded = originalEncode.call(this.codec, type, data, options);
      return this.compression ? this.compression.compress(encoded) : encoded;
    };
  }

  createSocketBridge(existingSocketManager) {
    return new SocketBridge(existingSocketManager, this);
  }

  getNetworkStats() {
    return {
      protocol: {
        registeredPackets: this.protocol.listPacketTypes().length,
        packetTypes: this.protocol.listPacketTypes()
      },
      codec: this.codec.getMetrics(),
      dispatcher: this.dispatcher.getStats()
    };
  }

  registerPacketType(type, definition, handler, validator) {
    this.protocol.definePacket(type, definition);

    if (handler) {
      this.dispatcher.registerHandler(type, handler);
    }

    if (validator) {
      this.protocol.validationMap.set(type, validator);
    }

    return this;
  }

  addInterceptor(interceptor, options) {
    this.dispatcher.registerInterceptor(interceptor, options);
    return this;
  }

  setCompressionOptions(options) {
    if (this.compression) {
      this.compression.setOptions(options);
    }
    return this;
  }

  configureFeatures(features) {
    if (features.validation !== undefined) {
      this.config.enableValidation = features.validation;
    }
    if (features.compression !== undefined) {
      this.config.enableCompression = features.compression;
    }
    if (features.encryption !== undefined) {
      this.config.enableEncryption = features.encryption;
    }
    return this;
  }

  broadcastPacket(type, data) {
    // Broadcast to all connected clients
    if (this.dispatcher) {
      this.dispatcher.broadcast(type, data);
    }
  }

  sendPacket(socketId, type, data) {
    // Send to specific client
    if (this.dispatcher) {
      this.dispatcher.sendToSocket(socketId, type, data);
    }
  }

  handleIncomingPacket(rawData, context) {
    if (this.dispatcher) {
      this.dispatcher.processPacket(rawData, context);
    }
  }

  getOrCreateConnection(socketId) {
    // Return a mock connection object for now
    return {
      socketId: socketId,
      send: (data) => {
        // This will be overridden by SocketBridge
      }
    };
  }

  removeConnection(socketId) {
    // Remove connection tracking
    if (this.dispatcher) {
      this.dispatcher.removeConnection(socketId);
    }
  }

  shutdown() {
    if (this.compression) {
      this.compression.resetStats();
    }
    this.codec.clearCache();
    this.dispatcher.clearQueue();
    this.dispatcher.clearFlowControllers();
  }
}

class SocketBridge {
  constructor(socketManager, networkSystem) {
    this.socketManager = socketManager;
    this.networkSystem = networkSystem;

    this.adaptExistingSockets();
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
      this.networkSystem.removeConnection(socket.socketId);
      return originalClose.call(this.socketManager, socket);
    };
  }

  setupSocketNetworking(socket) {
    socket.socketId = this.generateSocketId(socket);

    const connection = this.networkSystem.getOrCreateConnection(socket.socketId);

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
          this.networkSystem.handleIncomingPacket(rawData, {
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
        this.networkSystem.sendPacket(socket.socketId, packetType, packetData);
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

  generateSocketId(socket) {
    return "socket_" + (socket.ip || "unknown") + "_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  }

  sendGameState(entities, roomInfo) {
    this.networkSystem.broadcastPacket("WORLD_STATE", {
      entities: entities,
      gameTime: Date.now(),
      roomInfo: roomInfo
    });
  }

  sendEntityUpdate(socketId, entityData) {
    this.networkSystem.sendPacket(socketId, "ENTITY_STATE", [
      entityData.id,
      entityData.position,
      entityData.health,
      entityData.shield,
      Date.now()
    ]);
  }

  getStats() {
    return {
      networkManager: this.networkSystem.getNetworkStats(),
      adaptedSockets: this.socketManager.clients.filter(c => c.socketId).length
    };
  }

  shutdown() {
    this.networkSystem.shutdown();
  }
}

module.exports = {
  GameNetworkSystem,
  NetworkProtocol,
  BinaryCodec,
  PacketDispatcher,
  NetworkOrchestrator,
  SocketBridge
};

module.exports.createNetworkSystem = (config) => {
  return new GameNetworkSystem(config);
};

module.exports.createSocketBridge = (socketManager, config) => {
  const networkSystem = new GameNetworkSystem(config);
  return new SocketBridge(socketManager, networkSystem);
};
