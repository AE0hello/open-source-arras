class NetworkOrchestrator {
  constructor(config = {}) {
    this.config = {
      enableCompression: config.enableCompression !== false,
      enableEncryption: config.enableEncryption || false,
      maxPacketSize: config.maxPacketSize || 65536,
      connectionTimeout: config.connectionTimeout || 30000,
      heartbeatInterval: config.heartbeatInterval || 5000,
      ...config
    };

    this.protocol = new NetworkProtocol();
    this.codec = new BinaryCodec(this.protocol);
    this.dispatcher = new PacketDispatcher(this.protocol, this.codec);

    this.connections = new Map();
    this.connectionMetrics = {
      totalConnections: 0,
      activeConnections: 0,
      packetsReceived: 0,
      packetsSent: 0,
      bytesTransmitted: 0
    };

    this.setupInterceptors();
    this.setupPacketHandlers();
    this.startHeartbeat();
  }

  setupInterceptors() {
    this.dispatcher.registerInterceptor((packet, context) => {
      if (!context.socketId) {
        console.warn("Packet missing socket ID");
        return false;
      }
      return context;
    }, { priority: 100, critical: true });

    this.dispatcher.registerInterceptor((packet, context) => {
      if (packet.size > this.config.maxPacketSize) {
        console.warn(`Packet too large: ${packet.size} bytes`);
        return false;
      }
      return context;
    }, { priority: 90 });

    this.dispatcher.registerInterceptor((packet, context) => {
      const now = Date.now();
      const packetAge = now - packet.timestamp;

      if (packetAge > 30000) {
        console.warn(`Packet too old: ${packetAge}ms`);
        return false;
      }

      return { ...context, packetAge };
    }, { priority: 80 });

    this.dispatcher.registerInterceptor((packet, context) => {
      const publicPackets = ["HEARTBEAT", "ENTER_GAME", "DEPARTURE"];
      if (publicPackets.includes(packet.type)) {
        return context;
      }

      const connection = this.connections.get(context.socketId);
      if (!connection || !connection.authenticated) {
        console.warn(`Unauthenticated connection attempted ${packet.type}`);
        return false;
      }

      return context;
    }, { priority: 70 });

    this.dispatcher.registerInterceptor((packet, context) => {
      const connection = this.connections.get(context.socketId);
      if (!connection) {
        return context;
      }

      const now = Date.now();
      const windowStart = now - 60000;

      connection.packetHistory = connection.packetHistory.filter(
        timestamp => timestamp > windowStart
      );

      if (connection.packetHistory.length >= 100) {
        console.warn(`Rate limit exceeded for ${context.socketId}`);
        return false;
      }

      connection.packetHistory.push(now);
      return context;
    }, { priority: 60 });
  }

  setupPacketHandlers() {
    this.dispatcher.registerHandler("ENTER_GAME", async (packet) => {
      const [alias, vehicle, faction] = packet.data;
      const socketId = packet.context.socketId;

      try {
        const connection = this.getOrCreateConnection(socketId);
        connection.authenticated = true;
        connection.playerAlias = alias;
        connection.vehicle = vehicle;
        connection.faction = faction;

        this.sendPacket(socketId, "SPAWN_CONFIRM", {
          playerId: connection.playerId,
          spawnTime: Date.now()
        });

        this.emit("playerEntered", {
          socketId,
          alias,
          vehicle,
          faction,
          connection
        });

      } catch (error) {
        console.error("Entry failed:", error);
        this.sendPacket(socketId, "SPAWN_ERROR", {
          error: error.message
        });
      }
    });

    this.dispatcher.registerHandler("MOVEMENT", async (packet) => {
      const [posX, posY, heading, moment] = packet.data;
      const socketId = packet.context.socketId;

      const connection = this.connections.get(socketId);
      if (!connection) {
        return;
      }

      connection.lastPosition = { posX, posY, heading, moment };

      this.emit("playerMovement", {
        socketId,
        posX, posY, heading, moment,
        connection
      });
    });

    this.dispatcher.registerHandler("ACTION", async (packet) => {
      const [flags, moment] = packet.data;
      const socketId = packet.context.socketId;

      const connection = this.connections.get(socketId);
      if (!connection) {
        return;
      }

      const actionData = {
        forward: !!(flags & 1),
        backward: !!(flags & 2),
        left: !!(flags & 4),
        right: !!(flags & 8),
        primary: !!(flags & 16),
        secondary: !!(flags & 32),
        special: !!(flags & 64)
      };

      this.emit("playerAction", {
        socketId,
        actions: actionData,
        moment,
        connection
      });
    });

    this.dispatcher.registerHandler("MESSAGE", async (packet) => {
      const [text, recipient, moment] = packet.data;
      const socketId = packet.context.socketId;

      const connection = this.connections.get(socketId);
      if (!connection) {
        return;
      }

      if (!text || text.length > 200) {
        return;
      }

      this.emit("playerMessage", {
        socketId,
        text,
        recipient,
        moment,
        playerAlias: connection.playerAlias,
        connection
      });
    });

    this.dispatcher.registerHandler("EVOLVE", async (packet) => {
      const [path, branch] = packet.data;
      const socketId = packet.context.socketId;

      const connection = this.connections.get(socketId);
      if (!connection) {
        return;
      }

      this.emit("evolutionRequest", {
        socketId,
        path,
        branch,
        connection
      });
    });

    this.dispatcher.registerHandler("ENHANCE", async (packet) => {
      const [attribute, magnitude] = packet.data;
      const socketId = packet.context.socketId;

      const connection = this.connections.get(socketId);
      if (!connection) {
        return;
      }

      this.emit("enhancementRequest", {
        socketId,
        attribute,
        magnitude,
        connection
      });
    });
  }

  handleIncomingPacket(rawData, context) {
    try {
      const packet = this.codec.decodePacket(rawData, context);

      this.connectionMetrics.packetsReceived++;
      this.connectionMetrics.bytesTransmitted += rawData.length;

      this.dispatcher.dispatchPacket(packet, context);

    } catch (error) {
      console.error("Incoming packet failed:", error);
      this.emit("packetError", error, context);
    }
  }

  sendPacket(socketId, type, data, options = {}) {
    try {
      const packetBuffer = this.codec.encodePacket(type, data, options);

      this.connectionMetrics.packetsSent++;
      this.connectionMetrics.bytesTransmitted += packetBuffer.length;

      const connection = this.connections.get(socketId);
      if (!connection) {
        console.warn(`Send to unknown connection: ${socketId}`);
        return;
      }

      if (connection.send) {
        connection.send(packetBuffer);
      }

      this.emit("packetSent", { socketId, type, data, size: packetBuffer.length });

    } catch (error) {
      console.error("Send packet failed:", error);
      this.emit("sendError", error, socketId, type, data);
    }
  }

  broadcastPacket(type, data, filter = null) {
    for (const [socketId, connection] of this.connections) {
      if (!filter || filter(connection)) {
        this.sendPacket(socketId, type, data);
      }
    }
  }

  getOrCreateConnection(socketId) {
    if (!this.connections.has(socketId)) {
      this.connections.set(socketId, {
        socketId,
        playerId: this.generatePlayerId(),
        authenticated: false,
        connectedAt: Date.now(),
        lastActivity: Date.now(),
        packetHistory: [],
        send: null,
        ...this.config.connectionDefaults
      });

      this.connectionMetrics.totalConnections++;
      this.connectionMetrics.activeConnections++;
    }

    const connection = this.connections.get(socketId);
    connection.lastActivity = Date.now();
    return connection;
  }

  removeConnection(socketId) {
    if (this.connections.has(socketId)) {
      const connection = this.connections.get(socketId);
      this.connections.delete(socketId);
      this.connectionMetrics.activeConnections--;

      this.emit("connectionClosed", { socketId, connection });
    }
  }

  generatePlayerId() {
    return "player_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  }

  startHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      const timeout = this.config.connectionTimeout;

      for (const [socketId, connection] of this.connections) {
        if (now - connection.lastActivity > timeout) {
          console.log(`Connection timeout: ${socketId}`);
          this.removeConnection(socketId);
        }
      }

      this.broadcastPacket("HEARTBEAT", [now, Math.floor(Math.random() * 1000000)]);

    }, this.config.heartbeatInterval);
  }

  getMetrics() {
    return {
      ...this.connectionMetrics,
      activeConnections: this.connections.size,
      dispatcherStats: this.dispatcher.getStats(),
      codecMetrics: this.codec.getMetrics(),
      registeredPackets: this.protocol.listPacketTypes()
    };
  }

  getConnection(socketId) {
    return this.connections.get(socketId);
  }

  getAllConnections() {
    return Array.from(this.connections.values());
  }

  shutdown() {
    this.connections.clear();
    this.codec.clearCache();
    this.dispatcher.clearQueue();
    this.dispatcher.clearFlowControllers();

    this.emit("shutdown");
  }
}

module.exports = NetworkOrchestrator;
