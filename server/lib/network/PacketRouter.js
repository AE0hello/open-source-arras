class PacketDispatcher {
  constructor(protocol, codec) {
    this.protocol = protocol;
    this.codec = codec;
    this.handlerRegistry = new Map();
    this.interceptorChain = [];
    this.flowControllers = new Map();
    this.pendingQueue = [];
    this.active = false;

    this.stats = {
      packetsReceived: 0,
      packetsProcessed: 0,
      packetsRejected: 0,
      averageProcessTime: 0,
      handlersInvoked: 0
    };

    this.setupCoreHandlers();
  }

  registerHandler(packetType, handler, config = {}) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }

    const handlerInfo = {
      handler: handler,
      priority: config.priority || 0,
      async: config.async || false,
      flowLimit: config.flowLimit || null,
      timeout: config.timeout || 5000,
      retries: config.retries || 0,
      interceptors: config.interceptors || []
    };

    if (!this.handlerRegistry.has(packetType)) {
      this.handlerRegistry.set(packetType, []);
    }

    this.handlerRegistry.get(packetType).push(handlerInfo);

    this.handlerRegistry.get(packetType).sort((a, b) => b.priority - a.priority);

    return this;
  }

  registerInterceptor(interceptor, config = {}) {
    const interceptorInfo = {
      interceptor: interceptor,
      priority: config.priority || 0,
      async: config.async || false,
      condition: config.condition || null
    };

    this.interceptorChain.push(interceptorInfo);

    this.interceptorChain.sort((a, b) => b.priority - a.priority);

    return this;
  }

  dispatchPacket(packet, context) {
    const startTime = performance.now();

    try {
      this.stats.packetsReceived++;

      const interceptorResult = this.applyInterceptors(packet, context);
      if (interceptorResult === false) {
        this.stats.packetsRejected++;
        return;
      }

      packet.context = { ...context, ...interceptorResult };

      const handlers = this.handlerRegistry.get(packet.type) || [];
      if (handlers.length === 0) {
        console.warn(`No handlers for packet: ${packet.type}`);
        this.stats.packetsRejected++;
        return;
      }

      if (!this.checkFlowControl(packet.type, packet.context)) {
        this.stats.packetsRejected++;
        return;
      }

      this.executeHandlers(handlers, packet);

      this.stats.packetsProcessed++;
      this.stats.handlersInvoked += handlers.length;

    } catch (error) {
      console.error(`Packet dispatch error ${packet.type}:`, error);
      this.stats.packetsRejected++;
    } finally {
      const processTime = performance.now() - startTime;
      this.stats.averageProcessTime =
        (this.stats.averageProcessTime + processTime) / 2;
    }
  }

  applyInterceptors(packet, context) {
    let modifiedContext = context;

    for (const interceptorInfo of this.interceptorChain) {
      if (interceptorInfo.condition && !interceptorInfo.condition(packet, modifiedContext)) {
        continue;
      }

      try {
        const result = interceptorInfo.async
          ? interceptorInfo.interceptor(packet, modifiedContext)
          : interceptorInfo.interceptor(packet, modifiedContext);

        if (result === false) {
          return false;
        }

        if (typeof result === "object" && result !== null) {
          modifiedContext = { ...modifiedContext, ...result };
        }

      } catch (error) {
        console.error("Interceptor error:", error);

        if (interceptorInfo.critical) {
          throw error;
        }
      }
    }

    return modifiedContext;
  }

  async executeHandlers(handlers, packet) {
    const results = [];

    for (const handlerInfo of handlers) {
      try {
        let result;

        if (handlerInfo.async) {
          result = await this.executeWithTimeout(
            handlerInfo.handler,
            packet,
            handlerInfo.timeout
          );
        } else {
          result = handlerInfo.handler(packet);
        }

        results.push({
          handler: handlerInfo,
          result: result,
          success: true
        });

      } catch (error) {
        console.error(`Handler error ${packet.type}:`, error);

        results.push({
          handler: handlerInfo,
          error: error,
          success: false
        });

        if (handlerInfo.retries > 0) {
          handlerInfo.retries--;
          await this.wait(100);
          await this.executeWithRetry(handlerInfo, packet);
        }
      }
    }

    return results;
  }

  async executeWithTimeout(handler, packet, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Handler timeout after ${timeout}ms`));
      }, timeout);

      Promise.resolve(handler(packet))
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  async executeWithRetry(handlerInfo, packet) {
    let lastError;

    for (let attempt = 0; attempt <= handlerInfo.retries; attempt++) {
      try {
        const result = handlerInfo.async
          ? await handlerInfo.handler(packet)
          : handlerInfo.handler(packet);

        return result;

      } catch (error) {
        lastError = error;
        if (attempt < handlerInfo.retries) {
          await this.wait(Math.pow(2, attempt) * 100);
        }
      }
    }

    throw lastError;
  }

  checkFlowControl(packetType, context) {
    const key = `${context.socketId || "unknown"}_${packetType}`;
    const now = Date.now();

    if (!this.flowControllers.has(key)) {
      this.flowControllers.set(key, {
        count: 0,
        resetTime: now + 60000,
        maxRequests: 100
      });
    }

    const controller = this.flowControllers.get(key);

    if (now > controller.resetTime) {
      controller.count = 0;
      controller.resetTime = now + 60000;
    }

    if (controller.count >= controller.maxRequests) {
      return false;
    }

    controller.count++;
    return true;
  }

  setFlowControl(packetType, maxRequests, windowMs = 60000) {
    this.flowControllers.set(`config_${packetType}`, {
      maxRequests,
      windowMs
    });
  }

  queuePacket(packet, context) {
    this.pendingQueue.push({ packet, context, timestamp: Date.now() });

    if (!this.active) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.active = true;

    while (this.pendingQueue.length > 0) {
      const { packet, context, timestamp } = this.pendingQueue.shift();

      if (Date.now() - timestamp > 5000) {
        this.stats.packetsRejected++;
        continue;
      }

      await this.dispatchPacket(packet, context);
    }

    this.active = false;
  }

  setupCoreHandlers() {
    this.registerHandler("HEARTBEAT", (packet) => {
      const [timestamp, sequence] = packet.data;

      if (packet.context && packet.context.sendPacket) {
        packet.context.sendPacket("HEARTBEAT", [timestamp, sequence]);
      }

      return { latency: Date.now() - timestamp };
    }, { priority: 100 });

    this.registerHandler("DEPARTURE", (packet) => {
      const [cause, code] = packet.data;

      console.log(`Client departing: ${cause || "Unknown"} (${code || "N/A"})`);

      if (packet.context && packet.context.socket) {
        packet.context.socket.close();
      }
    }, { priority: 90 });
  }

  registerDefaultHandler(handler) {
    this.defaultHandler = handler;
  }

  getStats() {
    return {
      ...this.stats,
      queueLength: this.pendingQueue.length,
      active: this.active,
      registeredHandlers: Array.from(this.handlerRegistry.keys()),
      interceptorCount: this.interceptorChain.length
    };
  }

  clearFlowControllers() {
    this.flowControllers.clear();
  }

  clearQueue() {
    this.pendingQueue = [];
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = PacketDispatcher;
