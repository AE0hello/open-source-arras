class BinaryCodec {
  constructor(protocol) {
    this.protocol = protocol;
    this.compressionEnabled = true;
    this.encryptionEnabled = false;
    this.packetCache = new Map();
    this.sequenceMap = new Map();
    this.lastPacketTime = new Map();

    this.metrics = {
      packetsDecoded: 0,
      packetsEncoded: 0,
      bytesTransmitted: 0,
      compressionEfficiency: 0,
      averageDecodeTime: 0
    };
  }

  decodePacket(rawData, context = {}) {
    const startTime = performance.now();

    try {
      if (!rawData || rawData.length === 0) {
        throw new Error("Empty packet data");
      }

      const header = this.extractHeader(rawData);
      if (!header) {
        throw new Error("Invalid packet header");
      }

      const cacheKey = this.generateCacheKey(header, context);
      if (this.packetCache.has(cacheKey)) {
        return this.packetCache.get(cacheKey);
      }

      let payload = rawData.slice(header.length);
      if (header.compressed) {
        payload = this.decompressData(payload);
      }

      if (this.encryptionEnabled && header.encrypted) {
        payload = this.decryptData(payload, context);
      }

      const packetData = this.decodePayload(header.type, payload, context);

      const validation = this.protocol.verifyPacket(header.type, packetData);
      if (!validation.valid) {
        throw new Error(`Packet validation failed: ${validation.error}`);
      }

      const packet = {
        type: header.type,
        data: packetData,
        header: header,
        timestamp: Date.now(),
        context: context,
        size: rawData.length,
        sequence: header.sequence
      };

      this.packetCache.set(cacheKey, packet);
      this.updateMetrics("decode", performance.now() - startTime, rawData.length);

      return packet;

    } catch (error) {
      console.error("Packet decode failed:", error);
      throw error;
    }
  }

  encodePacket(type, data, options = {}) {
    const startTime = performance.now();

    try {
      const packetDef = this.protocol.getPacketSpec(type);
      if (!packetDef) {
        throw new Error(`Unknown packet type: ${type}`);
      }

      const validation = this.protocol.verifyPacket(type, data);
      if (!validation.valid) {
        throw new Error(`Cannot encode packet: ${validation.error}`);
      }

      const sequence = this.getNextSequence(type);

      const header = {
        type: type,
        version: packetDef.revision,
        sequence: sequence,
        timestamp: Date.now(),
        compressed: this.compressionEnabled && packetDef.compacted,
        encrypted: this.encryptionEnabled,
        priority: packetDef.priority
      };

      let payload = this.encodePayload(type, data);

      if (header.compressed) {
        payload = this.compressData(payload);
      }

      if (header.encrypted) {
        payload = this.encryptData(payload, options.context);
      }

      const packet = this.combineHeaderPayload(header, payload);
      this.updateMetrics("encode", performance.now() - startTime, packet.length);

      return packet;

    } catch (error) {
      console.error("Packet encode failed:", error);
      throw error;
    }
  }

  extractHeader(rawData) {
    if (rawData.length < 8) {
      return null;
    }

    const view = new DataView(rawData.buffer);

    const magic = view.getUint16(0);
    if (magic !== 0xABCD) {
      return null;
    }

    const typeId = view.getUint8(2);
    const flags = view.getUint8(3);
    const sequence = view.getUint32(4);
    const timestamp = view.getUint32(8);
    const payloadLength = view.getUint16(12);

    const type = this.getTypeById(typeId);
    if (!type) {
      return null;
    }

    return {
      type: type,
      typeId: typeId,
      flags: flags,
      sequence: sequence,
      timestamp: timestamp,
      payloadLength: payloadLength,
      compressed: !!(flags & 0x01),
      encrypted: !!(flags & 0x02),
      priority: (flags >> 4) & 0x0F,
      length: 14
    };
  }

  decodePayload(type, payload, context) {
    const packetDef = this.protocol.getPacketSpec(type);
    if (!packetDef) {
      throw new Error(`Unknown packet type: ${type}`);
    }

    const fields = Object.keys(packetDef.schema);
    const data = [];
    let offset = 0;

    for (const fieldName of fields) {
      const fieldSpec = packetDef.schema[fieldName];

      if (offset >= payload.length) {
        if (fieldSpec.mandatory) {
          throw new Error(`Missing required field: ${fieldName}`);
        }
        data.push(undefined);
        continue;
      }

      const value = this.decodeField(payload, offset, fieldSpec.dataType, fieldSpec);
      data.push(value);
      offset += this.getFieldSize(value, fieldSpec.dataType);
    }

    return data;
  }

  encodePayload(type, data) {
    const packetDef = this.protocol.getPacketSpec(type);
    if (!packetDef) {
      throw new Error(`Unknown packet type: ${type}`);
    }

    const fields = Object.keys(packetDef.schema);
    const buffers = [];

    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldSpec = packetDef.schema[fieldName];
      const value = data[i];

      if (value !== undefined && value !== null) {
        buffers.push(this.encodeField(value, fieldSpec.dataType, fieldSpec));
      }
    }

    return Buffer.concat(buffers);
  }

  decodeField(buffer, offset, type, definition) {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset);

    switch (type) {
      case "number":
        if (definition.float) {
          return view.getFloat32(0);
        } else if (definition.int32) {
          return view.getInt32(0);
        } else if (definition.int16) {
          return view.getInt16(0);
        } 
        return view.getUint8(0);
                

      case "string":
        const length = view.getUint16(0);
        const stringBytes = buffer.slice(offset + 2, offset + 2 + length);
        return stringBytes.toString("utf8");

      case "boolean":
        return view.getUint8(0) !== 0;

      case "object":
        const objLength = view.getUint16(0);
        const objBytes = buffer.slice(offset + 2, offset + 2 + objLength);
        return JSON.parse(objBytes.toString("utf8"));

      default:
        throw new Error(`Unsupported field type: ${type}`);
    }
  }

  encodeField(value, type, definition) {
    switch (type) {
      case "number":
        let buffer;
        if (definition.float) {
          buffer = Buffer.alloc(4);
          const view = new DataView(buffer.buffer);
          view.setFloat32(0, value);
        } else if (definition.int32) {
          buffer = Buffer.alloc(4);
          const view = new DataView(buffer.buffer);
          view.setInt32(0, value);
        } else if (definition.int16) {
          buffer = Buffer.alloc(2);
          const view = new DataView(buffer.buffer);
          view.setInt16(0, value);
        } else {
          buffer = Buffer.alloc(1);
          buffer.writeUInt8(value, 0);
        }
        return buffer;

      case "string":
        const stringBytes = Buffer.from(value, "utf8");
        const lengthBuffer = Buffer.alloc(2);
        lengthBuffer.writeUInt16LE(stringBytes.length, 0);
        return Buffer.concat([lengthBuffer, stringBytes]);

      case "boolean":
        const boolBuffer = Buffer.alloc(1);
        boolBuffer.writeUInt8(value ? 1 : 0, 0);
        return boolBuffer;

      case "object":
        const jsonString = JSON.stringify(value);
        const objBytes = Buffer.from(jsonString, "utf8");
        const objLengthBuffer = Buffer.alloc(2);
        objLengthBuffer.writeUInt16LE(objBytes.length, 0);
        return Buffer.concat([objLengthBuffer, objBytes]);

      default:
        throw new Error(`Unsupported field type: ${type}`);
    }
  }

  getFieldSize(value, type) {
    switch (type) {
      case "number":
        return 4;

      case "string":
        return 2 + Buffer.byteLength(value, "utf8");

      case "boolean":
        return 1;

      case "object":
        const jsonString = JSON.stringify(value);
        return 2 + Buffer.byteLength(jsonString, "utf8");

      default:
        return 0;
    }
  }

  combineHeaderPayload(header, payload) {
    const headerBuffer = Buffer.alloc(14);
    const view = new DataView(headerBuffer.buffer);

    view.setUint16(0, 0xABCD);
    view.setUint8(2, this.getIdByType(header.type));

    let flags = 0;
    if (header.compressed) {
      flags |= 0x01;
    }
    if (header.encrypted) {
      flags |= 0x02;
    }
    flags |= (header.priority & 0x0F) << 4;
    view.setUint8(3, flags);

    view.setUint32(4, header.sequence);
    view.setUint32(8, header.timestamp);
    view.setUint16(12, payload.length);

    return Buffer.concat([headerBuffer, payload]);
  }

  compressData(data) {
    return data;
  }

  decompressData(data) {
    return data;
  }

  encryptData(data, context) {
    return data;
  }

  decryptData(data, context) {
    return data;
  }

  getNextSequence(type) {
    if (!this.sequenceMap.has(type)) {
      this.sequenceMap.set(type, 0);
    }
    const sequence = this.sequenceMap.get(type);
    this.sequenceMap.set(type, (sequence + 1) & 0xFFFFFFFF);
    return sequence;
  }

  getTypeById(typeId) {
    for (const [type, def] of this.protocol.packetRegistry) {
      if (def.identifier === typeId) {
        return type;
      }
    }
    return null;
  }

  getIdByType(type) {
    const packetDef = this.protocol.getPacketSpec(type);
    return packetDef ? packetDef.identifier : 0;
  }

  generateCacheKey(header, context) {
    return `${header.type}_${header.sequence}_${context.socketId || "unknown"}`;
  }

  updateMetrics(operation, duration, bytes) {
    if (operation === "decode") {
      this.metrics.packetsDecoded++;
    } else {
      this.metrics.packetsEncoded++;
    }

    this.metrics.bytesTransmitted += bytes;
    this.metrics.averageDecodeTime =
      (this.metrics.averageDecodeTime + duration) / 2;
  }

  getMetrics() {
    return { ...this.metrics };
  }

  clearCache() {
    this.packetCache.clear();
  }
}

module.exports = BinaryCodec;
