class NetworkProtocol {
  constructor() {
    this.packetRegistry = new Map();
    this.validationMap = new Map();
    this.handlerMap = new Map();
    this.interceptorStack = [];
    this.initializeCorePackets();
  }

  definePacket(type, schema) {
    this.packetRegistry.set(type, {
      identifier: schema.identifier || this.nextIdentifier(),
      label: type,
      schema: schema.fields || {},
      priority: schema.priority || 0,
      guaranteed: schema.guaranteed !== false,
      compacted: schema.compacted || false,
      throttle: schema.throttle || 1000,
      description: schema.description || "",
      revision: schema.revision || "1.0.0"
    });

    if (schema.validator) {
      this.validationMap.set(type, schema.validator);
    }

    return this;
  }

  attachHandler(type, processor) {
    this.handlerMap.set(type, processor);
    return this;
  }

  addInterceptor(interceptor) {
    this.interceptorStack.push(interceptor);
    return this;
  }

  verifyPacket(type, payload) {
    const definition = this.packetRegistry.get(type);
    if (!definition) {
      return { valid: false, error: `Unknown packet: ${type}` };
    }

    const validator = this.validationMap.get(type);
    if (validator) {
      return validator(payload);
    }

    if (!Array.isArray(payload)) {
      return { valid: false, error: "Payload must be array" };
    }

    const requiredFields = Object.keys(definition.schema);
    if (payload.length !== requiredFields.length) {
      return {
        valid: false,
        error: `Expected ${requiredFields.length} fields, got ${payload.length}`
      };
    }

    for (let i = 0; i < requiredFields.length; i++) {
      const fieldName = requiredFields[i];
      const fieldSpec = definition.schema[fieldName];
      const value = payload[i];

      if (fieldSpec.mandatory && (value === undefined || value === null)) {
        return { valid: false, error: `Missing required field: ${fieldName}` };
      }

      if (value !== undefined && fieldSpec.dataType && typeof value !== fieldSpec.dataType) {
        return {
          valid: false,
          error: `Field ${fieldName} type mismatch`
        };
      }

      if (fieldSpec.check && !fieldSpec.check(value)) {
        return {
          valid: false,
          error: `Field ${fieldName} validation failed`
        };
      }
    }

    return { valid: true };
  }

  async processPacket(type, payload, context) {
    const verification = this.verifyPacket(type, payload);
    if (!verification.valid) {
      throw new Error(`Packet rejected: ${verification.error}`);
    }

    let packetData = { type, payload, context };
    for (const interceptor of this.interceptorStack) {
      packetData = await interceptor(packetData);
      if (!packetData) {
        return;
      }
    }

    const processor = this.handlerMap.get(type);
    if (processor) {
      await processor(packetData.payload, packetData.context);
    }
  }

  buildPacket(type, payload) {
    const verification = this.verifyPacket(type, payload);
    if (!verification.valid) {
      throw new Error(`Cannot build packet: ${verification.error}`);
    }

    return [type, ...payload];
  }

  getPacketSpec(type) {
    return this.packetRegistry.get(type);
  }

  listPacketTypes() {
    return Array.from(this.packetRegistry.keys());
  }

  nextIdentifier() {
    let id = 1000;
    for (const packet of this.packetRegistry.values()) {
      if (packet.identifier >= id) {
        id = packet.identifier + 1;
      }
    }
    return id;
  }

  initializeCorePackets() {
    this.definePacket("MOVEMENT", {
      identifier: 1001,
      fields: {
        posX: { dataType: "number", mandatory: true, check: (v) => isFinite(v) },
        posY: { dataType: "number", mandatory: true, check: (v) => isFinite(v) },
        heading: { dataType: "number", mandatory: true, check: (v) => isFinite(v) },
        moment: { dataType: "number", mandatory: true }
      },
      guaranteed: false,
      throttle: 16,
      description: "Player position and orientation"
    });

    this.definePacket("ACTION", {
      identifier: 1002,
      fields: {
        flags: { dataType: "number", mandatory: true, check: (v) => v >= 0 && v <= 255 },
        moment: { dataType: "number", mandatory: true }
      },
      guaranteed: false,
      throttle: 16,
      description: "Player input actions"
    });

    this.definePacket("MESSAGE", {
      identifier: 1003,
      fields: {
        text: { dataType: "string", mandatory: true, check: (v) => v.length <= 200 },
        recipient: { dataType: "string", mandatory: false },
        moment: { dataType: "number", mandatory: true }
      },
      guaranteed: true,
      throttle: 1000,
      description: "Chat communication"
    });

    this.definePacket("ENTITY_STATE", {
      identifier: 1004,
      fields: {
        entityId: { dataType: "number", mandatory: true },
        location: { dataType: "object", mandatory: false },
        vitality: { dataType: "number", mandatory: false },
        protection: { dataType: "number", mandatory: false },
        moment: { dataType: "number", mandatory: true }
      },
      guaranteed: false,
      compacted: true,
      throttle: 30,
      description: "Entity status updates"
    });

    this.definePacket("ENTER_GAME", {
      identifier: 1005,
      fields: {
        alias: { dataType: "string", mandatory: true, check: (v) => v.length <= 48 },
        vehicle: { dataType: "string", mandatory: false },
        faction: { dataType: "number", mandatory: false }
      },
      guaranteed: true,
      description: "Player entry request"
    });

    this.definePacket("EVOLVE", {
      identifier: 1006,
      fields: {
        path: { dataType: "number", mandatory: true },
        branch: { dataType: "number", mandatory: true }
      },
      guaranteed: true,
      description: "Character evolution"
    });

    this.definePacket("ENHANCE", {
      identifier: 1007,
      fields: {
        attribute: { dataType: "string", mandatory: true },
        magnitude: { dataType: "number", mandatory: true, check: (v) => v >= 0 && v <= 10 }
      },
      guaranteed: true,
      description: "Skill enhancement"
    });

    this.definePacket("HEARTBEAT", {
      identifier: 1008,
      fields: {
        moment: { dataType: "number", mandatory: true },
        sequence: { dataType: "number", mandatory: true }
      },
      guaranteed: false,
      throttle: 1000,
      description: "Connection vitality check"
    });

    this.definePacket("WORLD_STATE", {
      identifier: 1009,
      fields: {
        entities: { dataType: "object", mandatory: true },
        gameTime: { dataType: "number", mandatory: true },
        arenaInfo: { dataType: "object", mandatory: false }
      },
      guaranteed: false,
      compacted: true,
      throttle: 30,
      description: "Complete world snapshot"
    });

    this.definePacket("DEPARTURE", {
      identifier: 1010,
      fields: {
        cause: { dataType: "string", mandatory: false },
        code: { dataType: "number", mandatory: false }
      },
      guaranteed: true,
      description: "Graceful exit notification"
    });
  }
}

module.exports = NetworkProtocol;
