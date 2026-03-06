class BinaryCodec {
  constructor(protocol) {
    this.protocol = protocol;
    this.compressionEnabled = true;
    this.encryptionEnabled = false;
    this.packetCache = new Map();
    this.sequenceMap = new Map();
    this.lastPacketTime = new Map();
    this.debugMode = false;
    this.validationLevel = 'strict'; // 'strict', 'normal', 'lenient'

    this.metrics = {
      packetsDecoded: 0,
      packetsEncoded: 0,
      bytesTransmitted: 0,
      compressionEfficiency: 0,
      averageDecodeTime: 0,
      validationErrors: 0,
      cacheHits: 0,
      cacheMisses: 0,
      fieldValidations: 0,
      packetDrops: 0
    };

    this.packetHistory = [];
    this.errorLog = [];
    this.validationRules = new Map();
    this.initializeValidationRules();
  }

  decodePacket(rawData, context = {}) {
    const startTime = performance.now();
    const decodeId = this.generateDecodeId();
    
    this.logDebug(`[DECODE:${decodeId}] Starting packet decode`, {
      dataSize: rawData?.length,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString()
    });

    try {
      // Deep validation of input data
      this.validateRawPacketData(rawData, decodeId);

      const header = this.extractHeader(rawData);
      if (!header) {
        throw new Error(`[DECODE:${decodeId}] Invalid packet header - magic bytes mismatch or insufficient data`);
      }

      this.logDebug(`[DECODE:${decodeId}] Header extracted successfully`, {
        type: header.type,
        typeId: header.typeId,
        sequence: header.sequence,
        flags: this.parseFlags(header.flags),
        payloadLength: header.payloadLength
      });

      // Validate packet structure before processing
      this.validatePacketStructure(header, rawData, decodeId);

      const cacheKey = this.generateCacheKey(header, context);
      if (this.packetCache.has(cacheKey)) {
        this.metrics.cacheHits++;
        this.logDebug(`[DECODE:${decodeId}] Cache hit for key: ${cacheKey}`);
        return this.packetCache.get(cacheKey);
      }
      this.metrics.cacheMisses++;

      let payload = rawData.slice(header.length);
      let processingSteps = [];

      if (header.compressed) {
        const decompressStart = performance.now();
        payload = this.decompressData(payload);
        const decompressTime = performance.now() - decompressStart;
        processingSteps.push(`decompress(${decompressTime.toFixed(2)}ms)`);
        this.logDebug(`[DECODE:${decodeId}] Payload decompressed`, {
          originalSize: rawData.length - header.length,
          decompressedSize: payload.length,
          ratio: ((payload.length / (rawData.length - header.length)) * 100).toFixed(1) + '%'
        });
      }

      if (this.encryptionEnabled && header.encrypted) {
        const decryptStart = performance.now();
        payload = this.decryptData(payload, context);
        const decryptTime = performance.now() - decryptStart;
        processingSteps.push(`decrypt(${decryptTime.toFixed(2)}ms)`);
        this.logDebug(`[DECODE:${decodeId}] Payload decrypted`);
      }

      const payloadDecodeStart = performance.now();
      const packetData = this.decodePayload(header.type, payload, context, decodeId);
      const payloadDecodeTime = performance.now() - payloadDecodeStart;
      processingSteps.push(`payload_decode(${payloadDecodeTime.toFixed(2)}ms)`);

      const validation = this.protocol.verifyPacket(header.type, packetData);
      if (!validation.valid) {
        this.metrics.validationErrors++;
        throw new Error(`[DECODE:${decodeId}] Packet validation failed: ${validation.error}`);
      }

      const packet = {
        type: header.type,
        data: packetData,
        header: header,
        timestamp: Date.now(),
        context: context,
        size: rawData.length,
        sequence: header.sequence,
        decodeId: decodeId,
        processingSteps: processingSteps,
        decodeTime: performance.now() - startTime
      };

      this.packetCache.set(cacheKey, packet);
      this.updateMetrics("decode", performance.now() - startTime, rawData.length);
      this.recordPacketHistory(packet, 'decode');

      this.logDebug(`[DECODE:${decodeId}] Packet decode completed successfully`, {
        totalDecodeTime: packet.decodeTime.toFixed(2) + 'ms',
        processingSteps: processingSteps.join(', '),
        cacheKey: cacheKey
      });

      return packet;

    } catch (error) {
      this.metrics.packetDrops++;
      this.logError(`[DECODE:${decodeId}] Packet decode failed`, {
        error: error.message,
        stack: error.stack,
        dataSize: rawData?.length,
        context: this.sanitizeContext(context)
      });
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

  decodePayload(type, payload, context, decodeId = 'unknown') {
    const packetDef = this.protocol.getPacketSpec(type);
    if (!packetDef) {
      throw new Error(`[DECODE:${decodeId}] Unknown packet type: ${type}`);
    }

    this.logDebug(`[DECODE:${decodeId}] Decoding payload for type: ${type}`, {
      payloadSize: payload.length,
      expectedFields: Object.keys(packetDef.schema).length,
      packetSpec: {
        identifier: packetDef.identifier,
        priority: packetDef.priority,
        guaranteed: packetDef.guaranteed,
        compacted: packetDef.compacted
      }
    });

    const fields = Object.keys(packetDef.schema);
    const data = [];
    let offset = 0;
    const fieldResults = [];

    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      const fieldName = fields[fieldIndex];
      const fieldSpec = packetDef.schema[fieldName];

      const fieldDecodeStart = performance.now();
      
      try {
        // Validate field position
        if (offset > payload.length) {
          throw new Error(`[DECODE:${decodeId}] Field offset ${offset} exceeds payload size ${payload.length}`);
        }

        // Check for insufficient data
        if (offset >= payload.length) {
          if (fieldSpec.mandatory) {
            throw new Error(`[DECODE:${decodeId}] Missing required field '${fieldName}' at offset ${offset} (payload size: ${payload.length})`);
          }
          data.push(undefined);
          fieldResults.push({
            fieldName,
            status: 'skipped',
            reason: 'insufficient_data',
            offset,
            value: undefined
          });
          continue;
        }

        const value = this.decodeField(payload, offset, fieldSpec.dataType, fieldSpec, fieldName, decodeId);
        const fieldSize = this.getFieldSize(value, fieldSpec.dataType, fieldSpec);
        const fieldDecodeTime = performance.now() - fieldDecodeStart;

        // Validate field value
        this.validateFieldValue(fieldName, value, fieldSpec, decodeId);

        data.push(value);
        offset += fieldSize;
        
        fieldResults.push({
          fieldName,
          status: 'success',
          offset: offset - fieldSize,
          size: fieldSize,
          value: this.sanitizeFieldValue(value),
          decodeTime: fieldDecodeTime.toFixed(3) + 'ms',
          dataType: fieldSpec.dataType
        });

        this.metrics.fieldValidations++;

      } catch (fieldError) {
        const fieldDecodeTime = performance.now() - fieldDecodeStart;
        this.logError(`[DECODE:${decodeId}] Field decode error: ${fieldName}`, {
          error: fieldError.message,
          offset,
          dataType: fieldSpec.dataType,
          mandatory: fieldSpec.mandatory,
          decodeTime: fieldDecodeTime.toFixed(3) + 'ms'
        });

        if (fieldSpec.mandatory || this.validationLevel === 'strict') {
          throw fieldError;
        }

        data.push(undefined);
        fieldResults.push({
          fieldName,
          status: 'error',
          error: fieldError.message,
          offset,
          value: undefined
        });
      }
    }

    // Validate final payload structure
    if (offset < payload.length) {
      this.logDebug(`[DECODE:${decodeId}] Unused payload data detected`, {
        usedBytes: offset,
        totalBytes: payload.length,
        unusedBytes: payload.length - offset,
        unusedData: this.bufferToHex(payload.slice(offset, Math.min(offset + 16, payload.length)))
      });
    }

    this.logDebug(`[DECODE:${decodeId}] Payload decode completed`, {
      totalFields: fields.length,
      successfulFields: fieldResults.filter(f => f.status === 'success').length,
      failedFields: fieldResults.filter(f => f.status === 'error').length,
      skippedFields: fieldResults.filter(f => f.status === 'skipped').length,
      bytesProcessed: offset,
      fieldDetails: fieldResults
    });

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
   * Enhanced field decoder with comprehensive validation and detailed logging
   * @param {Buffer} buffer - The buffer containing the encoded data
   * @param {number} offset - The byte offset in the buffer where the field starts
   * @param {string} type - The data type of the field
   * @param {object} definition - The field definition object containing type-specific properties
   * @param {string} fieldName - The name of the field for error context and logging
   * @param {string} decodeId - Unique identifier for the decode operation
   * @returns {*} The decoded value of the appropriate type
   * @throws {Error} If validation fails or data is malformed
   */
  decodeField(buffer, offset, type, definition, fieldName = '', decodeId = 'unknown') {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
    const fieldStart = performance.now();

    this.logDebug(`[DECODE:${decodeId}] Decoding field '${fieldName}'`, {
      type,
      offset,
      bufferRemaining: buffer.length - offset,
      definition: {
        mandatory: definition.mandatory,
        float: definition.float,
        int32: definition.int32,
        int16: definition.int16,
        elementType: definition.elementType
      }
    });

    let value;
    let validationDetails = {};

    try {
      switch (type) {
        case "number":
          value = this.decodeNumberField(view, definition, fieldName, decodeId);
          validationDetails = {
            numericType: definition.float ? 'float32' : definition.int32 ? 'int32' : definition.int16 ? 'int16' : 'uint8',
            valueRange: this.getNumberRange(definition),
            actualValue: value
          };
          break;

        case "string":
          value = this.decodeStringField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            stringLength: value.length,
            byteLength: Buffer.byteLength(value, 'utf8'),
            containsNull: value.includes('\0'),
            validUtf8: this.isValidUtf8(value)
          };
          break;

        case "boolean":
          value = this.decodeBooleanField(view, fieldName, decodeId);
          validationDetails = {
            rawByte: view.getUint8(0),
            normalizedValue: value
          };
          break;

        case "object":
          value = this.decodeObjectField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            objectType: Array.isArray(value) ? 'array' : typeof value,
            propertyCount: typeof value === 'object' && value !== null ? Object.keys(value).length : 0,
            jsonSize: JSON.stringify(value).length
          };
          break;

        case "uint32":
          value = this.decodeUint32Field(view, fieldName, decodeId);
          validationDetails = {
            range: '0-4294967295',
            actualValue: value,
            hexValue: '0x' + value.toString(16).toUpperCase()
          };
          break;

        case "int8":
          value = this.decodeInt8Field(view, fieldName, decodeId);
          validationDetails = {
            range: '-128-127',
            actualValue: value,
            signedByte: value
          };
          break;

        case "buffer":
          value = this.decodeBufferField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            bufferSize: value.length,
            hexPreview: this.bufferToHex(value.slice(0, 16)),
            isBinary: !this.isPrintableBuffer(value)
          };
          break;

        case "array":
          value = this.decodeArrayField(buffer, offset, view, definition, fieldName, decodeId);
          validationDetails = {
            arrayLength: value.length,
            elementType: definition.elementType,
            totalElements: value.length
          };
          break;

        default:
          throw new Error(`[DECODE:${decodeId}] Unsupported field type: ${type} for field '${fieldName}'`);
      }

      const fieldDecodeTime = performance.now() - fieldStart;
      this.logDebug(`[DECODE:${decodeId}] Field '${fieldName}' decoded successfully`, {
        value: this.sanitizeFieldValue(value),
        decodeTime: fieldDecodeTime.toFixed(3) + 'ms',
        validationDetails
      });

      return value;

    } catch (error) {
      const fieldDecodeTime = performance.now() - fieldStart;
      this.logError(`[DECODE:${decodeId}] Field decode failed: ${fieldName}`, {
        type,
        offset,
        error: error.message,
        decodeTime: fieldDecodeTime.toFixed(3) + 'ms',
        bufferHex: this.bufferToHex(buffer.slice(offset, Math.min(offset + 8, buffer.length)))
      });
      throw error;
    }
  }

  // Specialized field decoder methods with deep validation
  
  decodeNumberField(view, definition, fieldName, decodeId) {
    let value;
    const rawBytes = [];
    
    if (definition.float) {
      value = view.getFloat32(0);
      rawBytes.push(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      
      if (!isFinite(value)) {
        throw new Error(`[DECODE:${decodeId}] Invalid float value for field '${fieldName}': ${value} (raw bytes: 0x${rawBytes.map(b => b.toString(16).padStart(2, '0')).join('')})`);
      }
      
      // Additional float validation
      if (Math.abs(value) > 3.4e38) {
        this.logDebug(`[DECODE:${decodeId}] Float value near overflow for field '${fieldName}': ${value}`);
      }
      
    } else if (definition.int32) {
      value = view.getInt32(0);
      rawBytes.push(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      
      if (value < -2147483648 || value > 2147483647) {
        throw new Error(`[DECODE:${decodeId}] Int32 value out of range for field '${fieldName}': ${value} (expected: -2147483648 to 2147483647)`);
      }
      
    } else if (definition.int16) {
      value = view.getInt16(0);
      rawBytes.push(view.getUint8(0), view.getUint8(1));
      
      if (value < -32768 || value > 32767) {
        throw new Error(`[DECODE:${decodeId}] Int16 value out of range for field '${fieldName}': ${value} (expected: -32768 to 32767)`);
      }
      
    } else {
      value = view.getUint8(0);
      rawBytes.push(view.getUint8(0));
      
      if (value < 0 || value > 255) {
        throw new Error(`[DECODE:${decodeId}] Uint8 value out of range for field '${fieldName}': ${value} (expected: 0-255)`);
      }
    }
    
    this.logDebug(`[DECODE:${decodeId}] Number field '${fieldName}' decoded`, {
      value,
      rawBytes: `0x${rawBytes.map(b => b.toString(16).padStart(2, '0')).join('')}`,
      binary: rawBytes.map(b => b.toString(2).padStart(8, '0')).join(' '),
      numericType: definition.float ? 'float32' : definition.int32 ? 'int32' : definition.int16 ? 'int16' : 'uint8'
    });
    
    return value;
  }
  
  decodeStringField(buffer, offset, view, fieldName, decodeId) {
    const length = view.getUint16(0);
    
    if (length > buffer.length - offset - 2) {
      throw new Error(`[DECODE:${decodeId}] String length ${length} exceeds buffer size for field '${fieldName}' (available: ${buffer.length - offset - 2})`);
    }
    
    const stringBytes = buffer.slice(offset + 2, offset + 2 + length);
    const str = stringBytes.toString("utf8");
    
    // Comprehensive string validation
    const validation = {
      declaredLength: length,
      actualByteLength: Buffer.byteLength(str, 'utf8'),
      characterLength: str.length,
      hasNullBytes: str.includes('\0'),
      hasControlChars: /[\x00-\x1F\x7F]/.test(str),
      isValidUtf8: true,
      encodingIssues: []
    };
    
    // Check for UTF-8 encoding issues
    if (Buffer.byteLength(str, 'utf8') !== length) {
      validation.isValidUtf8 = false;
      validation.encodingIssues.push('Byte length mismatch');
    }
    
    // Check for common problematic characters
    if (validation.hasNullBytes) {
      validation.encodingIssues.push('Contains null bytes');
    }
    
    if (validation.hasControlChars) {
      validation.encodingIssues.push('Contains control characters');
    }
    
    // Log string details
    this.logDebug(`[DECODE:${decodeId}] String field '${fieldName}' decoded`, {
      ...validation,
      preview: str.length > 50 ? str.substring(0, 47) + '...' : str,
      hexPreview: this.bufferToHex(stringBytes.slice(0, 16)),
      characterAnalysis: this.analyzeStringCharacters(str)
    });
    
    if (!validation.isValidUtf8 && this.validationLevel === 'strict') {
      throw new Error(`[DECODE:${decodeId}] Invalid UTF-8 string for field '${fieldName}': ${validation.encodingIssues.join(', ')}`);
    }
    
    return str;
  }
  
  decodeBooleanField(view, fieldName, decodeId) {
    const rawByte = view.getUint8(0);
    
    if (rawByte !== 0 && rawByte !== 1) {
      this.logDebug(`[DECODE:${decodeId}] Non-standard boolean byte for field '${fieldName}': ${rawByte} (expected 0 or 1)`);
      
      if (this.validationLevel === 'strict') {
        throw new Error(`[DECODE:${decodeId}] Invalid boolean value ${rawByte} for field '${fieldName}' (must be 0 or 1)`);
      }
    }
    
    const boolValue = rawByte !== 0;
    
    this.logDebug(`[DECODE:${decodeId}] Boolean field '${fieldName}' decoded`, {
      rawByte,
      binaryByte: rawByte.toString(2).padStart(8, '0'),
      normalizedValue: boolValue,
      isStandard: rawByte === 0 || rawByte === 1
    });
    
    return boolValue;
  }
  
  decodeObjectField(buffer, offset, view, fieldName, decodeId) {
    const objLength = view.getUint16(0);
    
    if (objLength > buffer.length - offset - 2) {
      throw new Error(`[DECODE:${decodeId}] Object length ${objLength} exceeds buffer size for field '${fieldName}' (available: ${buffer.length - offset - 2})`);
    }
    
    const objBytes = buffer.slice(offset + 2, offset + 2 + objLength);
    const jsonStr = objBytes.toString("utf8");
    
    try {
      const parsed = JSON.parse(jsonStr);
      
      this.logDebug(`[DECODE:${decodeId}] Object field '${fieldName}' decoded`, {
        jsonSize: jsonStr.length,
        objectType: Array.isArray(parsed) ? 'array' : typeof parsed,
        propertyCount: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0,
        jsonPreview: jsonStr.length > 100 ? jsonStr.substring(0, 97) + '...' : jsonStr,
        parseSuccess: true
      });
      
      return parsed;
      
    } catch (e) {
      this.logError(`[DECODE:${decodeId}] JSON parse failed for field '${fieldName}'`, {
        error: e.message,
        jsonString: jsonStr.length > 200 ? jsonStr.substring(0, 197) + '...' : jsonStr,
        byteLength: objLength
      });
      
      throw new Error(`[DECODE:${decodeId}] Invalid JSON for field '${fieldName}': ${e.message}`);
    }
  }
  
  decodeUint32Field(view, fieldName, decodeId) {
    const value = view.getUint32(0);
    
    if (value < 0 || value > 4294967295) {
      throw new Error(`[DECODE:${decodeId}] Uint32 value out of range for field '${fieldName}': ${value} (expected: 0-4294967295)`);
    }
    
    this.logDebug(`[DECODE:${decodeId}] Uint32 field '${fieldName}' decoded`, {
      value,
      hexValue: '0x' + value.toString(16).toUpperCase().padStart(8, '0'),
      binaryValue: value.toString(2).padStart(32, '0'),
      highByte: (value >> 24) & 0xFF,
      lowByte: value & 0xFF
    });
    
    return value;
  }
  
  decodeInt8Field(view, fieldName, decodeId) {
    const value = view.getInt8(0);
    
    if (value < -128 || value > 127) {
      throw new Error(`[DECODE:${decodeId}] Int8 value out of range for field '${fieldName}': ${value} (expected: -128-127)`);
    }
    
    this.logDebug(`[DECODE:${decodeId}] Int8 field '${fieldName}' decoded`, {
      value,
      unsignedValue: value & 0xFF,
      hexValue: '0x' + (value & 0xFF).toString(16).toUpperCase().padStart(2, '0'),
      binaryValue: (value & 0xFF).toString(2).padStart(8, '0'),
      isNegative: value < 0
    });
    
    return value;
  }
  
  decodeBufferField(buffer, offset, view, fieldName, decodeId) {
    const bufLength = view.getUint16(0);
    
    if (bufLength > buffer.length - offset - 2) {
      throw new Error(`[DECODE:${decodeId}] Buffer length ${bufLength} exceeds buffer size for field '${fieldName}' (available: ${buffer.length - offset - 2})`);
    }
    
    const value = buffer.slice(offset + 2, offset + 2 + bufLength);
    
    this.logDebug(`[DECODE:${decodeId}] Buffer field '${fieldName}' decoded`, {
      bufferSize: bufLength,
      hexPreview: this.bufferToHex(value.slice(0, 32)),
      isPrintable: this.isPrintableBuffer(value),
      entropy: this.calculateEntropy(value),
      containsNull: value.includes(0),
      patternAnalysis: this.analyzeBufferPattern(value)
    });
    
    return value;
  }
  
  decodeArrayField(buffer, offset, view, definition, fieldName, decodeId) {
    const arrLength = view.getUint16(0);
    const arr = [];
    let arrOffset = offset + 2;
    const elementType = definition.elementType;
    
    if (!elementType) {
      throw new Error(`[DECODE:${decodeId}] Missing elementType for array field '${fieldName}'`);
    }
    
    if (arrLength > 10000) {
      this.logDebug(`[DECODE:${decodeId}] Large array detected for field '${fieldName}': ${arrLength} elements`);
    }
    
    for (let i = 0; i < arrLength; i++) {
      try {
        const elemValue = this.decodeField(buffer, arrOffset, elementType, definition, `${fieldName}[${i}]`, decodeId);
        arr.push(elemValue);
        arrOffset += this.getFieldSize(elemValue, elementType, definition);
        
      } catch (elemError) {
        if (this.validationLevel === 'strict') {
          throw new Error(`[DECODE:${decodeId}] Array element decode failed at index ${i}: ${elemError.message}`);
        }
        
        this.logError(`[DECODE:${decodeId}] Array element decode error at index ${i}`, {
          error: elemError.message,
          elementType,
          arrayField: fieldName
        });
        
        arr.push(undefined);
      }
    }
    
    this.logDebug(`[DECODE:${decodeId}] Array field '${fieldName}' decoded`, {
      arrayLength: arrLength,
      elementType,
      bytesProcessed: arrOffset - offset,
      successfulElements: arr.filter(v => v !== undefined).length,
      failedElements: arr.filter(v => v === undefined).length
    });
    
    return arr;
  }

  // Utility methods for deep packet analysis and validation
  
  initializeValidationRules() {
    // Initialize default validation rules for different packet types
    this.validationRules.set('MOVEMENT', {
      maxCoordinate: 100000,
      maxTimestampDelta: 30000,
      requiredFields: ['posX', 'posY', 'heading', 'moment']
    });
    
    this.validationRules.set('MESSAGE', {
      maxLength: 200,
      allowedCharacters: /^[\x20-\x7E\u00A0-\uFFFF]*$/,
      forbiddenPatterns: [/<script/i, /javascript:/i, /data:/i]
    });
  }
  
  validateRawPacketData(rawData, decodeId) {
    if (!rawData) {
      throw new Error(`[DECODE:${decodeId}] Null packet data received`);
    }
    
    if (!Buffer.isBuffer(rawData)) {
      throw new Error(`[DECODE:${decodeId}] Invalid data type: expected Buffer, got ${typeof rawData}`);
    }
    
    if (rawData.length === 0) {
      throw new Error(`[DECODE:${decodeId}] Empty packet data received`);
    }
    
    if (rawData.length > 1048576) { // 1MB limit
      throw new Error(`[DECODE:${decodeId}] Packet too large: ${rawData.length} bytes (max: 1048576)`);
    }
    
    this.logDebug(`[DECODE:${decodeId}] Raw packet data validated`, {
      size: rawData.length,
      hexPreview: this.bufferToHex(rawData.slice(0, 16)),
      entropy: this.calculateEntropy(rawData)
    });
  }
  
  validatePacketStructure(header, rawData, decodeId) {
    const expectedTotalSize = header.length + header.payloadLength;
    
    if (expectedTotalSize !== rawData.length) {
      this.logDebug(`[DECODE:${decodeId}] Packet size mismatch`, {
        expected: expectedTotalSize,
        actual: rawData.length,
        headerLength: header.length,
        payloadLength: header.payloadLength,
        difference: rawData.length - expectedTotalSize
      });
      
      if (this.validationLevel === 'strict') {
        throw new Error(`[DECODE:${decodeId}] Packet size mismatch: expected ${expectedTotalSize}, got ${rawData.length}`);
      }
    }
    
    // Validate header fields
    if (header.sequence > 0xFFFFFFFF) {
      this.logDebug(`[DECODE:${decodeId}] Sequence number overflow: ${header.sequence}`);
    }
    
    if (header.payloadLength > 1048576) {
      throw new Error(`[DECODE:${decodeId}] Payload too large: ${header.payloadLength} bytes`);
    }
  }
  
  validateFieldValue(fieldName, value, fieldSpec, decodeId) {
    if (fieldSpec.mandatory && (value === undefined || value === null)) {
      throw new Error(`[DECODE:${decodeId}] Required field '${fieldName}' is missing or null`);
    }
    
    if (value !== undefined && fieldSpec.check && typeof fieldSpec.check === 'function') {
      if (!fieldSpec.check(value)) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' failed custom validation`);
      }
    }
    
    // Type-specific validation
    if (typeof value === 'number' && !isFinite(value)) {
      throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' contains invalid number: ${value}`);
    }
    
    if (typeof value === 'string' && value.length > 100000) {
      throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' string too long: ${value.length} characters`);
    }
  }
  
  generateDecodeId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  parseFlags(flags) {
    return {
      raw: flags,
      compressed: !!(flags & 0x01),
      encrypted: !!(flags & 0x02),
      priority: (flags >> 4) & 0x0F,
      reserved: flags & 0xC0
    };
  }
  
  bufferToHex(buffer) {
    if (!buffer || buffer.length === 0) return '';
    return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join(' ');
  }
  
  calculateEntropy(buffer) {
    if (!buffer || buffer.length === 0) return 0;
    
    const frequency = new Array(256).fill(0);
    for (const byte of buffer) {
      frequency[byte]++;
    }
    
    let entropy = 0;
    const len = buffer.length;
    for (let i = 0; i < 256; i++) {
      if (frequency[i] > 0) {
        const p = frequency[i] / len;
        entropy -= p * Math.log2(p);
      }
    }
    
    return Math.round(entropy * 1000) / 1000;
  }
  
  isValidUtf8(str) {
    try {
      const encoded = new TextEncoder().encode(str);
      const decoded = new TextDecoder('utf-8', { strict: true }).decode(encoded);
      return decoded === str;
    } catch {
      return false;
    }
  }
  
  analyzeStringCharacters(str) {
    const analysis = {
      total: str.length,
      printable: 0,
      whitespace: 0,
      control: 0,
      extended: 0,
      categories: {}
    };
    
    for (const char of str) {
      const code = char.charCodeAt(0);
      
      if (code >= 32 && code <= 126) {
        analysis.printable++;
      } else if (code === 9 || code === 10 || code === 13) {
        analysis.whitespace++;
      } else if (code < 32 || code === 127) {
        analysis.control++;
      } else {
        analysis.extended++;
      }
      
      const category = code < 128 ? 'ascii' : 'unicode';
      analysis.categories[category] = (analysis.categories[category] || 0) + 1;
    }
    
    return analysis;
  }
  
  analyzeBufferPattern(buffer) {
    if (!buffer || buffer.length === 0) return { pattern: 'empty' };
    
    let zeros = 0, ones = 0, repeated = 0;
    const frequency = new Map();
    
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      frequency.set(byte, (frequency.get(byte) || 0) + 1);
      
      if (byte === 0) zeros++;
      else if (byte === 255) ones++;
    }
    
    // Check for repeated patterns
    for (const [byte, count] of frequency) {
      if (count > buffer.length * 0.5) {
        repeated++;
      }
    }
    
    const uniqueBytes = frequency.size;
    const entropy = this.calculateEntropy(buffer);
    
    let pattern = 'random';
    if (zeros > buffer.length * 0.8) pattern = 'mostly_zeros';
    else if (ones > buffer.length * 0.8) pattern = 'mostly_ones';
    else if (uniqueBytes < 10) pattern = 'low_entropy';
    else if (repeated > 0) pattern = 'repeated';
    
    return {
      pattern,
      uniqueBytes,
      entropy,
      zeroRatio: zeros / buffer.length,
      oneRatio: ones / buffer.length
    };
  }
  
  isPrintableBuffer(buffer) {
    if (!buffer || buffer.length === 0) return true;
    
    for (const byte of buffer) {
      if (byte < 32 || byte > 126) {
        if (byte !== 9 && byte !== 10 && byte !== 13) { // Allow tab, LF, CR
          return false;
        }
      }
    }
    return true;
  }
  
  getNumberRange(definition) {
    if (definition.float) return '±3.4e38';
    if (definition.int32) return '-2147483648 to 2147483647';
    if (definition.int16) return '-32768 to 32767';
    return '0 to 255';
  }
  
  sanitizeFieldValue(value) {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      return value.length > 100 ? value.substring(0, 97) + '...' : value;
    }
    if (Buffer.isBuffer(value)) {
      return `<Buffer ${value.length} bytes>`;
    }
    if (typeof value === 'object') {
      return `<Object ${Array.isArray(value) ? 'Array' : 'Object'}>`;
    }
    return value;
  }
  
  sanitizeContext(context) {
    const sanitized = { ...context };
    if (sanitized.socket) delete sanitized.socket;
    if (sanitized.sendPacket) delete sanitized.sendPacket;
    return sanitized;
  }
  
  recordPacketHistory(packet, operation) {
    const entry = {
      timestamp: Date.now(),
      operation,
      type: packet.type,
      size: packet.size,
      sequence: packet.sequence,
      decodeId: packet.decodeId
    };
    
    this.packetHistory.push(entry);
    
    // Keep only last 1000 entries
    if (this.packetHistory.length > 1000) {
      this.packetHistory = this.packetHistory.slice(-1000);
    }
  }
  
  logDebug(message, data = {}) {
    if (this.debugMode) {
      console.log(`[BinaryCodec] ${message}`, data);
    }
  }
  
  logError(message, data = {}) {
    const errorEntry = {
      timestamp: Date.now(),
      message,
      data
    };
    
    this.errorLog.push(errorEntry);
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
    
    console.error(`[BinaryCodec] ${message}`, data);
  }

  /**
   * Enhanced field encoder with comprehensive validation and detailed logging
   * @param {*} value - The value to encode
   * @param {string} type - The data type of the field
   * @param {object} definition - The field definition object containing type-specific properties
   * @param {string} fieldName - The name of the field for error context and logging
   * @returns {Buffer} The encoded buffer for the field
   * @throws {Error} If validation fails or value is invalid
   */
  encodeField(value, type, definition, fieldName = '') {
    const encodeStart = performance.now();
    
    this.logDebug(`[ENCODE] Encoding field '${fieldName}'`, {
      type,
      value: this.sanitizeFieldValue(value),
      definition: {
        mandatory: definition.mandatory,
        float: definition.float,
        int32: definition.int32,
        int16: definition.int16,
        elementType: definition.elementType
      }
    });

    try {
      let buffer;
      
      switch (type) {
        case "number":
          buffer = this.encodeNumberField(value, definition, fieldName);
          break;
          
        case "string":
          buffer = this.encodeStringField(value, fieldName);
          break;
          
        case "boolean":
          buffer = this.encodeBooleanField(value, fieldName);
          break;
          
        case "object":
          buffer = this.encodeObjectField(value, fieldName);
          break;
          
        case "uint32":
          buffer = this.encodeUint32Field(value, fieldName);
          break;
          
        case "int8":
          buffer = this.encodeInt8Field(value, fieldName);
          break;
          
        case "buffer":
          buffer = this.encodeBufferField(value, fieldName);
          break;
          
        case "array":
          buffer = this.encodeArrayField(value, definition, fieldName);
          break;
          
        default:
          throw new Error(`Unsupported field type: ${type} for field '${fieldName}'`);
      }
      
      const encodeTime = performance.now() - encodeStart;
      this.logDebug(`[ENCODE] Field '${fieldName}' encoded successfully`, {
        bufferSize: buffer.length,
        encodeTime: encodeTime.toFixed(3) + 'ms',
        hexPreview: this.bufferToHex(buffer.slice(0, 16))
      });
      
      return buffer;
      
    } catch (error) {
      const encodeTime = performance.now() - encodeStart;
      this.logError(`[ENCODE] Field encode failed: ${fieldName}`, {
        type,
        error: error.message,
        value: this.sanitizeFieldValue(value),
        encodeTime: encodeTime.toFixed(3) + 'ms'
      });
      throw error;
    }
  }
  
  // Specialized field encoder methods
  
  encodeNumberField(value, definition, fieldName) {
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
      
      this.logDebug(`[ENCODE] Float field '${fieldName}'`, {
        value,
        buffer: this.bufferToHex(buffer),
        binary: Array.from(buffer).map(b => b.toString(2).padStart(8, '0')).join(' ')
      });
      
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
  
  encodeStringField(value, fieldName) {
    if (typeof value !== 'string') {
      throw new Error(`Invalid string value for field '${fieldName}': ${value}`);
    }
    
    const stringBytes = Buffer.from(value, "utf8");
    if (stringBytes.length > 65535) {
      throw new Error(`String too long for field '${fieldName}': length ${stringBytes.length}`);
    }
    
    const lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16LE(stringBytes.length, 0);
    
    this.logDebug(`[ENCODE] String field '${fieldName}'`, {
      length: value.length,
      byteLength: stringBytes.length,
      preview: value.length > 50 ? value.substring(0, 47) + '...' : value,
      hexPreview: this.bufferToHex(stringBytes.slice(0, 16))
    });
    
    return Buffer.concat([lengthBuffer, stringBytes]);
  }
  
  encodeBooleanField(value, fieldName) {
    if (typeof value !== 'boolean') {
      throw new Error(`Invalid boolean value for field '${fieldName}': ${value}`);
    }
    
    const boolBuffer = Buffer.alloc(1);
    boolBuffer.writeUInt8(value ? 1 : 0, 0);
    
    this.logDebug(`[ENCODE] Boolean field '${fieldName}'`, {
      value,
      byte: value ? 1 : 0,
      binary: (value ? 1 : 0).toString(2).padStart(8, '0')
    });
    
    return boolBuffer;
  }
  
  encodeObjectField(value, fieldName) {
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
    
    this.logDebug(`[ENCODE] Object field '${fieldName}'`, {
      objectType: Array.isArray(value) ? 'array' : typeof value,
      propertyCount: typeof value === 'object' && value !== null ? Object.keys(value).length : 0,
      jsonSize: jsonString.length,
      byteSize: objBytes.length,
      preview: jsonString.length > 100 ? jsonString.substring(0, 97) + '...' : jsonString
    });
    
    return Buffer.concat([objLengthBuffer, objBytes]);
  }
  
  encodeUint32Field(value, fieldName) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 4294967295) {
      throw new Error(`Invalid uint32 value for field '${fieldName}': ${value}`);
    }
    
    const buffer = Buffer.alloc(4);
    const view = new DataView(buffer.buffer);
    view.setUint32(0, value);
    
    this.logDebug(`[ENCODE] Uint32 field '${fieldName}'`, {
      value,
      hexValue: '0x' + value.toString(16).toUpperCase().padStart(8, '0'),
      binaryValue: value.toString(2).padStart(32, '0')
    });
    
    return buffer;
  }
  
  encodeInt8Field(value, fieldName) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < -128 || value > 127) {
      throw new Error(`Invalid int8 value for field '${fieldName}': ${value}`);
    }
    
    const buffer = Buffer.alloc(1);
    buffer.writeInt8(value, 0);
    
    this.logDebug(`[ENCODE] Int8 field '${fieldName}'`, {
      value,
      unsignedValue: value & 0xFF,
      hexValue: '0x' + (value & 0xFF).toString(16).toUpperCase().padStart(2, '0')
    });
    
    return buffer;
  }
  
  encodeBufferField(value, fieldName) {
    if (!Buffer.isBuffer(value)) {
      throw new Error(`Invalid buffer value for field '${fieldName}': ${value}`);
    }
    
    if (value.length > 65535) {
      throw new Error(`Buffer too long for field '${fieldName}': length ${value.length}`);
    }
    
    const bufLenBuffer = Buffer.alloc(2);
    bufLenBuffer.writeUInt16LE(value.length, 0);
    
    this.logDebug(`[ENCODE] Buffer field '${fieldName}'`, {
      bufferSize: value.length,
      hexPreview: this.bufferToHex(value.slice(0, 32)),
      isPrintable: this.isPrintableBuffer(value),
      entropy: this.calculateEntropy(value)
    });
    
    return Buffer.concat([bufLenBuffer, value]);
  }
  
  encodeArrayField(value, definition, fieldName) {
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
      try {
        arrBuffers.push(this.encodeField(value[i], definition.elementType, definition, `${fieldName}[${i}]`));
      } catch (elemError) {
        if (this.validationLevel === 'strict') {
          throw new Error(`Array element encode failed at index ${i}: ${elemError.message}`);
        }
        this.logError(`[ENCODE] Array element encode error at index ${i}`, {
          error: elemError.message,
          elementType: definition.elementType,
          arrayField: fieldName
        });
        // Encode undefined placeholder
        arrBuffers.push(Buffer.alloc(1)); // Single null byte
      }
    }
    
    this.logDebug(`[ENCODE] Array field '${fieldName}'`, {
      arrayLength: value.length,
      elementType: definition.elementType,
      totalBufferSize: arrBuffers.reduce((sum, buf) => sum + buf.length, 0),
      successfulElements: value.filter((v, i) => {
        try {
          this.encodeField(v, definition.elementType, definition, `${fieldName}[${i}]`);
          return true;
        } catch {
          return false;
        }
      }).length
    });
    
    return Buffer.concat(arrBuffers);
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
