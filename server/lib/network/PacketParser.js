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

      const value = this.decodeField(payload, offset, fieldSpec.dataType, fieldSpec, fieldName);
      data.push(value);
      offset += this.getFieldSize(value, fieldSpec.dataType, fieldSpec);
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
        buffers.push(this.encodeField(value, fieldSpec.dataType, fieldSpec, fieldName));
      }
    }

    return Buffer.concat(buffers);
  }

  /**
   * Decodes a single field from the buffer based on its data type and definition.
   * Performs detailed validation and logging for each field operation.
   * @param {Buffer} buffer - The buffer containing the encoded data.
   * @param {number} offset - The byte offset in the buffer where the field starts.
   * @param {string} type - The data type of the field (e.g., "number", "string", "array").
   * @param {object} definition - The field definition object containing type-specific properties.
   * @param {string} fieldName - The name of the field for error context and logging.
   * @returns {*} The decoded value of the appropriate type.
   * @throws {Error} If validation fails or data is malformed.
   */
  decodeField(buffer, offset, type, definition, fieldName = '') {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset);

    // Detailed logging for each field decode operation
    console.log(`Decoding field '${fieldName}' of type '${type}' at offset ${offset}`);

    switch (type) {
      case "number":
        let value;
        if (definition.float) {
          value = view.getFloat32(0);
          if (!isFinite(value)) {
            throw new Error(`Invalid float value for field '${fieldName}': ${value}`);
          }
        } else if (definition.int32) {
          value = view.getInt32(0);
          if (value < -2147483648 || value > 2147483647) {
            throw new Error(`Int32 value out of range for field '${fieldName}': ${value}`);
          }
        } else if (definition.int16) {
          value = view.getInt16(0);
          if (value < -32768 || value > 32767) {
            throw new Error(`Int16 value out of range for field '${fieldName}': ${value}`);
          }
        } else {
          value = view.getUint8(0);
          if (value < 0 || value > 255) {
            throw new Error(`Uint8 value out of range for field '${fieldName}': ${value}`);
          }
        }
        return value;

      case "string":
        const length = view.getUint16(0);
        if (length > buffer.length - offset - 2) {
          throw new Error(`String length ${length} exceeds buffer size for field '${fieldName}'`);
        }
        const stringBytes = buffer.slice(offset + 2, offset + 2 + length);
        const str = stringBytes.toString("utf8");
        // Basic validation: check if it's valid UTF-8
        if (Buffer.byteLength(str, 'utf8') !== length) {
          throw new Error(`Invalid UTF-8 string for field '${fieldName}'`);
        }
        return str;

      case "boolean":
        const boolValue = view.getUint8(0);
        if (boolValue !== 0 && boolValue !== 1) {
          throw new Error(`Invalid boolean value ${boolValue} for field '${fieldName}'`);
        }
        return boolValue !== 0;

      case "object":
        const objLength = view.getUint16(0);
        if (objLength > buffer.length - offset - 2) {
          throw new Error(`Object length ${objLength} exceeds buffer size for field '${fieldName}'`);
        }
        const objBytes = buffer.slice(offset + 2, offset + 2 + objLength);
        const jsonStr = objBytes.toString("utf8");
        try {
          const parsed = JSON.parse(jsonStr);
          return parsed;
        } catch (e) {
          throw new Error(`Invalid JSON for field '${fieldName}': ${e.message}`);
        }

      case "uint32":
        const uint32Val = view.getUint32(0);
        if (uint32Val < 0 || uint32Val > 4294967295) {
          throw new Error(`Uint32 value out of range for field '${fieldName}': ${uint32Val}`);
        }
        return uint32Val;

      case "int8":
        const int8Val = view.getInt8(0);
        if (int8Val < -128 || int8Val > 127) {
          throw new Error(`Int8 value out of range for field '${fieldName}': ${int8Val}`);
        }
        return int8Val;

      case "buffer":
        const bufLength = view.getUint16(0);
        if (bufLength > buffer.length - offset - 2) {
          throw new Error(`Buffer length ${bufLength} exceeds buffer size for field '${fieldName}'`);
        }
        return buffer.slice(offset + 2, offset + 2 + bufLength);

      case "array":
        const arrLength = view.getUint16(0);
        const arr = [];
        let arrOffset = offset + 2;
        const elementType = definition.elementType;
        if (!elementType) {
          throw new Error(`Missing elementType for array field '${fieldName}'`);
        }
        for (let i = 0; i < arrLength; i++) {
          const elemValue = this.decodeField(buffer, arrOffset, elementType, definition, `${fieldName}[${i}]`);
          arr.push(elemValue);
          arrOffset += this.getFieldSize(elemValue, elementType, definition);
        }
        return arr;

      default:
        throw new Error(`Unsupported field type: ${type} for field '${fieldName}'`);
    }
  }

  /**
   * Encodes a single field value into a buffer based on its data type and definition.
   * Performs detailed validation and logging for each field operation.
   * @param {*} value - The value to encode.
   * @param {string} type - The data type of the field (e.g., "number", "string", "array").
   * @param {object} definition - The field definition object containing type-specific properties.
   * @param {string} fieldName - The name of the field for error context and logging.
   * @returns {Buffer} The encoded buffer for the field.
   * @throws {Error} If validation fails or value is invalid.
   */
  encodeField(value, type, definition, fieldName = '') {
    // Detailed logging for each field encode operation
    console.log(`Encoding field '${fieldName}' of type '${type}' with value:`, value);

    switch (type) {
      case "number": {
        if (typeof value !== 'number' || !isFinite(value)) {
          throw new Error(`Invalid number value for field '${fieldName}': ${value}`);
        }
        let buffer;
        if (definition.float) {
          if (!isFinite(value)) {
            throw new Error(`Invalid float value for field '${fieldName}': ${value}`);
          }
          buffer = Buffer.alloc(4);
          const view = new DataView(buffer.buffer);
          view.setFloat32(0, value);
        } else if (definition.int32) {
          if (value < -2147483648 || value > 2147483647 || !Number.isInteger(value)) {
            throw new Error(`Invalid int32 value for field '${fieldName}': ${value}`);
          }
          buffer = Buffer.alloc(4);
          const view = new DataView(buffer.buffer);
          view.setInt32(0, value);
        } else if (definition.int16) {
          if (value < -32768 || value > 32767 || !Number.isInteger(value)) {
            throw new Error(`Invalid int16 value for field '${fieldName}': ${value}`);
          }
          buffer = Buffer.alloc(2);
          const view = new DataView(buffer.buffer);
          view.setInt16(0, value);
        } else {
          if (value < 0 || value > 255 || !Number.isInteger(value)) {
            throw new Error(`Invalid uint8 value for field '${fieldName}': ${value}`);
          }
          buffer = Buffer.alloc(1);
          buffer.writeUInt8(value, 0);
        }
        return buffer;
      }

      case "string": {
        if (typeof value !== 'string') {
          throw new Error(`Invalid string value for field '${fieldName}': ${value}`);
        }
        const stringBytes = Buffer.from(value, "utf8");
        if (stringBytes.length > 65535) {
          throw new Error(`String too long for field '${fieldName}': length ${stringBytes.length}`);
        }
        const lengthBuffer = Buffer.alloc(2);
        lengthBuffer.writeUInt16LE(stringBytes.length, 0);
        return Buffer.concat([lengthBuffer, stringBytes]);
      }

      case "boolean": {
        if (typeof value !== 'boolean') {
          throw new Error(`Invalid boolean value for field '${fieldName}': ${value}`);
        }
        const boolBuffer = Buffer.alloc(1);
        boolBuffer.writeUInt8(value ? 1 : 0, 0);
        return boolBuffer;
      }

      case "object": {
        if (typeof value !== 'object' || value === null) {
          throw new Error(`Invalid object value for field '${fieldName}': ${value}`);
        }
        const jsonString = JSON.stringify(value);
        const objBytes = Buffer.from(jsonString, "utf8");
        if (objBytes.length > 65535) {
          throw new Error(`Object JSON too long for field '${fieldName}': length ${objBytes.length}`);
        }
        const objLengthBuffer = Buffer.alloc(2);
        objLengthBuffer.writeUInt16LE(objBytes.length, 0);
        return Buffer.concat([objLengthBuffer, objBytes]);
      }

      case "uint32": {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 4294967295) {
          throw new Error(`Invalid uint32 value for field '${fieldName}': ${value}`);
        }
        let buffer;
        buffer = Buffer.alloc(4);
        const view = new DataView(buffer.buffer);
        view.setUint32(0, value);
        return buffer;
      }

      case "int8": {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < -128 || value > 127) {
          throw new Error(`Invalid int8 value for field '${fieldName}': ${value}`);
        }
        let buffer;
        buffer = Buffer.alloc(1);
        buffer.writeInt8(value, 0);
        return buffer;
      }

      case "buffer": {
        if (!Buffer.isBuffer(value)) {
          throw new Error(`Invalid buffer value for field '${fieldName}': ${value}`);
        }
        if (value.length > 65535) {
          throw new Error(`Buffer too long for field '${fieldName}': length ${value.length}`);
        }
        const bufLenBuffer = Buffer.alloc(2);
        bufLenBuffer.writeUInt16LE(value.length, 0);
        return Buffer.concat([bufLenBuffer, value]);
      }

      case "array": {
        if (!Array.isArray(value)) {
          throw new Error(`Invalid array value for field '${fieldName}': ${value}`);
        }
        if (value.length > 65535) {
          throw new Error(`Array too long for field '${fieldName}': length ${value.length}`);
        }
        const arrBuffers = [];
        arrBuffers.push(Buffer.alloc(2));
        arrBuffers[0].writeUInt16LE(value.length, 0);
        for (let i = 0; i < value.length; i++) {
          arrBuffers.push(this.encodeField(value[i], definition.elementType, definition, `${fieldName}[${i}]`));
        }
        return Buffer.concat(arrBuffers);
      }

      default: {
        throw new Error(`Unsupported field type: ${type} for field '${fieldName}'`);
      }
    }
  }

  /**
   * Calculates the byte size of a field value based on its data type and definition.
   * @param {*} value - The field value to calculate size for.
   * @param {string} type - The data type of the field.
   * @param {object} definition - The field definition object containing type-specific properties.
   * @returns {number} The size in bytes of the encoded field.
   */
  getFieldSize(value, type, definition = {}) {
    switch (type) {
      case "number":
        if (definition.float || definition.int32) {
          return 4;
        } else if (definition.int16) {
          return 2;
        } else {
          return 1;
        }

      case "string":
        return 2 + Buffer.byteLength(value, "utf8");

      case "boolean":
        return 1;

      case "object":
        const jsonString = JSON.stringify(value);
        return 2 + Buffer.byteLength(jsonString, "utf8");

      case "uint32":
        return 4;

      case "int8":
        return 1;

      case "buffer":
        return 2 + value.length;

      case "array":
        let total = 2; // for length
        for (const elem of value) {
          total += this.getFieldSize(elem, definition.elementType, definition);
        }
        return total;

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
