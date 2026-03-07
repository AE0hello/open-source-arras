class BinaryCodec {
  constructor(protocol) {
    this.protocol = protocol;
    this.compressionEnabled = true;
    this.encryptionEnabled = false;

    this.packetCache = new Map();
    this.fieldCache = new Map();
    this.validationCache = new Map();
    this.sequenceMap = new Map();
    this.lastPacketTime = new Map();

    this.debugMode = false;
    this.validationLevel = 'strict';
    this.maxCacheSize = 10000;
    this.cacheCleanupThreshold = 0.8;
    this.batchProcessingEnabled = true;
    this.memoryOptimizationEnabled = true;

    this.reverseEngineeringMode = true;
    this.detailedBinaryAnalysis = true;
    this.hexDumpEnabled = true;
    this.bitLevelAnalysis = true;
    this.packetStructureAnalysis = true;
    this.fieldMetadataExposure = true;
    this.analysisExportEnabled = true;

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
      packetDrops: 0,
      memoryUsage: 0,
      peakMemoryUsage: 0,
      cacheEvictions: 0,
      batchOperations: 0,
      optimizationSaves: 0
    };

    this.packetHistory = [];
    this.errorLog = [];
    this.validationRules = new Map();
    this.performanceProfile = new Map();

    this.binaryAnalysisLog = [];
    this.packetStructureLog = [];
    this.fieldAnalysisLog = [];
    this.hexDumpLog = [];
    this.bitAnalysisLog = [];
    this.patternAnalysisLog = [];

    this.initializePerformanceOptimizations();
    this.initializeValidationRules();
    this.initializeReverseEngineeringTools();
  }

  initializePerformanceOptimizations() {
    this.compiledPatterns = new Map();
    this.bufferPool = [];
    this.maxBufferPoolSize = 100;

    this.fieldSizeCache = new Map();

    this.typeOptimizations = {
      'number': { enableFastPath: true, enableBoundsCache: true },
      'string': { enableFastPath: true, enableLengthCache: true },
      'boolean': { enableFastPath: true },
      'uint32': { enableFastPath: true },
      'int8': { enableFastPath: true },
      'buffer': { enableFastPath: false, enablePoolOptimization: true },
      'array': { enableFastPath: false, enableBatchProcessing: true },
      'object': { enableFastPath: false, enableValidationCache: true }
    };

    this.cleanupInterval = setInterval(() => {
      this.performMemoryCleanup();
    }, 30000);
  }

  initializeReverseEngineeringTools() {
    this.hexDumpGenerator = {
      generate: (buffer, offset = 0, length = buffer.length) => this.generateHexDump(buffer, offset, length),
      generateDetailed: (buffer, offset = 0, length = buffer.length) => this.generateDetailedHexDump(buffer, offset, length)
    };

    this.bitAnalyzer = {
      analyzeBits: (byte) => this.analyzeBits(byte),
      analyzeBitField: (buffer, offset, bitCount) => this.analyzeBitField(buffer, offset, bitCount),
      extractBits: (value, startBit, bitCount) => this.extractBits(value, startBit, bitCount)
    };

    this.patternDetector = {
      findPatterns: (buffer) => this.findBinaryPatterns(buffer),
      analyzeStructure: (buffer) => this.analyzeBinaryStructure(buffer),
      detectEncoding: (buffer) => this.detectDataEncoding(buffer)
    };

    this.metadataExtractor = {
      extractPacketMetadata: (packet) => this.extractPacketMetadata(packet),
      extractFieldMetadata: (field, value) => this.extractFieldMetadata(field, value),
      generateStructureMap: (packet) => this.generateStructureMap(packet)
    };

    this.analysisExporter = {
      exportAnalysis: (format = 'json') => this.exportAnalysisData(format),
      exportHexDumps: () => this.exportHexDumpData(),
      exportStructureAnalysis: () => this.exportStructureAnalysisData()
    };
  }

  decodePacket(rawData, context = {}) {
    const startTime = performance.now();
    const decodeId = this.generateDecodeId();

    const initialMemory = this.getCurrentMemoryUsage();

    if (this.reverseEngineeringMode && this.detailedBinaryAnalysis) {
      this.performInitialBinaryAnalysis(rawData, decodeId);
    }

    this.logDebug(`[DECODE:${decodeId}] Starting packet decode`, {
      dataSize: rawData?.length,
      context: this.sanitizeContext(context),
      timestamp: new Date().toISOString(),
      memoryUsage: initialMemory,
      binaryAnalysis: this.reverseEngineeringMode ? 'enabled' : 'disabled'
    });

    try {
      this.validateRawPacketData(rawData, decodeId);

      const header = this.extractHeader(rawData);
      if (!header) {
        throw new Error(`[DECODE:${decodeId}] Invalid packet header - magic bytes mismatch or insufficient data`);
      }

      if (this.reverseEngineeringMode) {
        this.analyzeHeaderStructure(header, rawData, decodeId);
      }

      this.logDebug(`[DECODE:${decodeId}] Header extracted successfully`, {
        type: header.type,
        typeId: header.typeId,
        sequence: header.sequence,
        flags: this.parseFlags(header.flags),
        payloadLength: header.payloadLength,
        headerBytes: this.hexDumpGenerator.generate(rawData.slice(0, header.length)),
        flagAnalysis: this.bitLevelAnalysis ? this.analyzeHeaderFlags(header.flags) : undefined
      });

      this.validatePacketStructure(header, rawData, decodeId);

      const cacheKey = this.generateOptimizedCacheKey(header, context);
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
          ratio: ((payload.length / (rawData.length - header.length)) * 100).toFixed(1) + '%',
          compressionAnalysis: this.reverseEngineeringMode ? this.analyzeCompressionPattern(payload) : undefined
        });
      }

      if (this.encryptionEnabled && header.encrypted) {
        const decryptStart = performance.now();
        payload = this.decryptData(payload, context);
        const decryptTime = performance.now() - decryptStart;
        processingSteps.push(`decrypt(${decryptTime.toFixed(2)}ms)`);
        this.logDebug(`[DECODE:${decodeId}] Payload decrypted`, {
          encryptionAnalysis: this.reverseEngineeringMode ? this.analyzeEncryptionPattern(payload) : undefined
        });
      }

      const payloadDecodeStart = performance.now();
      const packetData = this.decodeOptimizedPayload(header.type, payload, context, decodeId);
      const payloadDecodeTime = performance.now() - payloadDecodeStart;
      processingSteps.push(`payload_decode(${payloadDecodeTime.toFixed(2)}ms)`);

      const validation = this.getCachedValidation(header.type, packetData);
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
        decodeTime: performance.now() - startTime,
        memoryFootprint: this.getCurrentMemoryUsage() - initialMemory
      };

      if (this.reverseEngineeringMode && this.fieldMetadataExposure) {
        packet.reverseEngineering = {
          binaryAnalysis: this.extractPacketBinaryAnalysis(rawData, header, payload, decodeId),
          structureMap: this.metadataExtractor.generateStructureMap(packet),
          hexDump: this.hexDumpEnabled ? this.hexDumpGenerator.generateDetailed(rawData) : undefined,
          fieldAnalysis: this.extractFieldLevelAnalysis(packetData, header.type, decodeId),
          patternAnalysis: this.patternDetector.findPatterns(rawData),
          bitLevelAnalysis: this.bitLevelAnalysis ? this.performBitLevelAnalysis(rawData, header) : undefined
        };
      }

      this.manageCacheSize();
      this.packetCache.set(cacheKey, packet);

      this.updateMetrics("decode", performance.now() - startTime, rawData.length);
      this.recordPacketHistory(packet, 'decode');
      this.updatePerformanceProfile(header.type, performance.now() - startTime);

      this.logDebug(`[DECODE:${decodeId}] Packet decode completed successfully`, {
        totalDecodeTime: packet.decodeTime.toFixed(2) + 'ms',
        processingSteps: processingSteps.join(', '),
        cacheKey: cacheKey,
        memoryFootprint: packet.memoryFootprint,
        reFeatures: this.reverseEngineeringMode ? {
          binaryAnalysisComplete: true,
          structureMapGenerated: true,
          hexDumpAvailable: !!packet.reverseEngineering?.hexDump,
          fieldAnalysisComplete: true
        } : undefined
      });

      return packet;

    } catch (error) {
      this.metrics.packetDrops++;
      this.logError(`[DECODE:${decodeId}] Packet decode failed`, {
        error: error.message,
        stack: error.stack,
        dataSize: rawData?.length,
        context: this.sanitizeContext(context),
        binaryContext: this.reverseEngineeringMode ? {
          hexDump: this.hexDumpGenerator.generate(rawData.slice(0, Math.min(32, rawData.length))),
          patternAnalysis: this.patternDetector.findPatterns(rawData.slice(0, Math.min(32, rawData.length)))
        } : undefined
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

    if (rawData.length < 14) {
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

    const parsedFlags = {
      compressed: !!(flags & 0x01),
      encrypted: !!(flags & 0x02),
      priority: (flags >> 4) & 0x0F,
      reserved: flags & 0xC0
    };

    return {
      type: type,
      typeId: typeId,
      flags: flags,
      parsedFlags: parsedFlags,
      sequence: sequence,
      timestamp: timestamp,
      payloadLength: payloadLength,
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

        if (offset > payload.length) {
          throw new Error(`[DECODE:${decodeId}] Field offset ${offset} exceeds payload size ${payload.length}`);
        }

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

  decodeField(buffer, offset, type, definition, fieldName = '', decodeId = 'unknown') {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
    const fieldStart = performance.now();

    this.validateFieldPreconditions(buffer, offset, type, definition, fieldName, decodeId);

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
            actualValue: value,
            withinBounds: this.isWithinNumericBounds(value, definition)
          };
          break;

        case "string":

          value = this.decodeStringField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            stringLength: value.length,
            byteLength: Buffer.byteLength(value, 'utf8'),
            containsNull: value.includes('\0'),
            validUtf8: this.isValidUtf8(value),
            securityFlags: this.checkStringSecurity(value)
          };
          break;

        case "boolean":

          value = this.decodeBooleanField(view, fieldName, decodeId);
          validationDetails = {
            rawByte: view.getUint8(0),
            normalizedValue: value,
            isStandard: view.getUint8(0) === 0 || view.getUint8(0) === 1
          };
          break;

        case "object":

          value = this.decodeObjectField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            objectType: Array.isArray(value) ? 'array' : typeof value,
            propertyCount: typeof value === 'object' && value !== null ? Object.keys(value).length : 0,
            jsonSize: JSON.stringify(value).length,
            isValidJson: this.isValidJsonObject(value)
          };
          break;

        case "uint32":

          value = this.decodeUint32Field(view, fieldName, decodeId);
          validationDetails = {
            range: '0-4294967295',
            actualValue: value,
            hexValue: '0x' + value.toString(16).toUpperCase(),
            isValidRange: value >= 0 && value <= 4294967295
          };
          break;

        case "int8":

          value = this.decodeInt8Field(view, fieldName, decodeId);
          validationDetails = {
            range: '-128-127',
            actualValue: value,
            signedByte: value,
            isValidRange: value >= -128 && value <= 127
          };
          break;

        case "buffer":

          value = this.decodeBufferField(buffer, offset, view, fieldName, decodeId);
          validationDetails = {
            bufferSize: value.length,
            hexPreview: this.bufferToHex(value.slice(0, 16)),
            isBinary: !this.isPrintableBuffer(value),
            entropy: this.calculateEntropy(value),
            securityFlags: this.checkBufferSecurity(value)
          };
          break;

        case "array":

          value = this.decodeArrayField(buffer, offset, view, definition, fieldName, decodeId);
          validationDetails = {
            arrayLength: value.length,
            elementType: definition.elementType,
            totalElements: value.length,
            validElements: value.filter(v => v !== undefined).length,
            securityFlags: this.checkArraySecurity(value)
          };
          break;

        default:
          throw new Error(`[DECODE:${decodeId}] Unsupported field type: ${type} for field '${fieldName}'`);
      }

      this.validateDecodedValue(fieldName, value, definition, decodeId);

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
        bufferHex: this.bufferToHex(buffer.slice(offset, Math.min(offset + 8, buffer.length))),
        errorContext: this.generateErrorContext(error, type, definition)
      });
      throw error;
    }
  }

  decodeNumberField(view, definition, fieldName, decodeId) {
    let value;
    const rawBytes = [];

    if (definition.float) {
      value = view.getFloat32(0);
      rawBytes.push(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));

      if (!isFinite(value)) {
        throw new Error(`[DECODE:${decodeId}] Invalid float value for field '${fieldName}': ${value} (raw bytes: 0x${rawBytes.map(b => b.toString(16).padStart(2, '0')).join('')})`);
      }

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

    if (offset + 2 > buffer.length) {
      throw new Error(`[DECODE:${decodeId}] String header exceeds buffer for field '${fieldName}' (need 2 bytes, have ${buffer.length - offset})`);
    }

    if (length > buffer.length - offset - 2) {
      throw new Error(`[DECODE:${decodeId}] String length ${length} exceeds buffer size for field '${fieldName}' (available: ${buffer.length - offset - 2})`);
    }

    if (length > 1000000) {
      throw new Error(`[DECODE:${decodeId}] String too large for field '${fieldName}': ${length} bytes (max: 1000000)`);
    }

    const stringBytes = buffer.slice(offset + 2, offset + 2 + length);
    const str = stringBytes.toString("utf8");

    const validation = {
      declaredLength: length,
      actualByteLength: Buffer.byteLength(str, 'utf8'),
      characterLength: str.length,
      hasNullBytes: str.includes('\0'),
      hasControlChars: /[\x00-\x1F\x7F]/.test(str),
      isValidUtf8: true,
      encodingIssues: [],
      securityIssues: []
    };

    if (Buffer.byteLength(str, 'utf8') !== length) {
      validation.isValidUtf8 = false;
      validation.encodingIssues.push('Byte length mismatch');
    }

    if (validation.hasNullBytes) {
      validation.encodingIssues.push('Contains null bytes');
      validation.securityIssues.push('Null byte injection risk');
    }

    if (validation.hasControlChars) {
      validation.encodingIssues.push('Contains control characters');
      validation.securityIssues.push('Control character injection risk');
    }

    const securityPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /\${.*}/,
      /\x00-\x1F/
    ];

    for (const pattern of securityPatterns) {
      if (pattern.test(str)) {
        validation.securityIssues.push(`Pattern detected: ${pattern.source}`);
      }
    }

    this.logDebug(`[DECODE:${decodeId}] String field '${fieldName}' decoded`, {
      ...validation,
      preview: str.length > 50 ? str.substring(0, 47) + '...' : str,
      hexPreview: this.bufferToHex(stringBytes.slice(0, 16)),
      characterAnalysis: this.analyzeStringCharacters(str)
    });

    if (!validation.isValidUtf8 && this.validationLevel === 'strict') {
      throw new Error(`[DECODE:${decodeId}] Invalid UTF-8 string for field '${fieldName}': ${validation.encodingIssues.join(', ')}`);
    }

    if (validation.securityIssues.length > 0 && this.validationLevel === 'strict') {
      throw new Error(`[DECODE:${decodeId}] Security issues detected in field '${fieldName}': ${validation.securityIssues.join(', ')}`);
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

  validateFieldPreconditions(buffer, offset, type, definition, fieldName, decodeId) {

    if (!Buffer.isBuffer(buffer)) {
      throw new Error(`[DECODE:${decodeId}] Invalid buffer type for field '${fieldName}': expected Buffer, got ${typeof buffer}`);
    }

    if (offset < 0 || offset >= buffer.length) {
      throw new Error(`[DECODE:${decodeId}] Invalid offset for field '${fieldName}': ${offset} (buffer size: ${buffer.length})`);
    }

    if (!type || typeof type !== 'string') {
      throw new Error(`[DECODE:${decodeId}] Invalid type specification for field '${fieldName}': ${type}`);
    }

    if (!definition || typeof definition !== 'object') {
      throw new Error(`[DECODE:${decodeId}] Invalid field definition for field '${fieldName}': expected object, got ${typeof definition}`);
    }

    const minSizes = {
      'number': 1,
      'boolean': 1,
      'uint32': 4,
      'int8': 1,
      'string': 2,
      'object': 2,
      'buffer': 2,
      'array': 2
    };

    const minSize = minSizes[type] || 1;
    if (buffer.length - offset < minSize) {
      throw new Error(`[DECODE:${decodeId}] Insufficient buffer for field '${fieldName}' type ${type}: need ${minSize} bytes, have ${buffer.length - offset}`);
    }
  }

  validateDecodedValue(fieldName, value, definition, decodeId) {

    if (definition.mandatory && (value === undefined || value === null)) {
      throw new Error(`[DECODE:${decodeId}] Required field '${fieldName}' is ${value}`);
    }

    if (definition.check && typeof definition.check === 'function') {
      try {
        if (!definition.check(value)) {
          throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' failed custom validation`);
        }
      } catch (checkError) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' custom validation error: ${checkError.message}`);
      }
    }

    if (typeof value === 'number') {
      if (!isFinite(value)) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' contains invalid number: ${value}`);
      }

      if (definition.min !== undefined && value < definition.min) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' below minimum: ${value} < ${definition.min}`);
      }

      if (definition.max !== undefined && value > definition.max) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' above maximum: ${value} > ${definition.max}`);
      }
    }

    if (typeof value === 'string') {
      if (definition.maxLength && value.length > definition.maxLength) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' too long: ${value.length} > ${definition.maxLength}`);
      }

      if (definition.pattern && !definition.pattern.test(value)) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' pattern validation failed`);
      }
    }

    if (Array.isArray(value)) {
      if (definition.maxElements && value.length > definition.maxElements) {
        throw new Error(`[DECODE:${decodeId}] Field '${fieldName}' array too large: ${value.length} > ${definition.maxElements}`);
      }
    }
  }

  isWithinNumericBounds(value, definition) {
    if (typeof value !== 'number' || !isFinite(value)) return false;

    if (definition.float) {
      return Math.abs(value) <= 3.4e38;
    } else if (definition.int32) {
      return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
    } else if (definition.int16) {
      return Number.isInteger(value) && value >= -32768 && value <= 32767;
    } else {
      return Number.isInteger(value) && value >= 0 && value <= 255;
    }
  }

  checkStringSecurity(str) {
    const flags = {
      hasScripting: false,
      hasInjection: false,
      hasNullBytes: str.includes('\0'),
      hasControlChars: /[\x00-\x1F\x7F]/.test(str),
      hasExcessiveLength: str.length > 10000,
      suspiciousPatterns: []
    };

    const scriptPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    for (const pattern of scriptPatterns) {
      if (pattern.test(str)) {
        flags.hasScripting = true;
        flags.suspiciousPatterns.push(pattern.source);
      }
    }

    const injectionPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /exec\s*\(/i,
      /system\s*\(/i,
      /\$\(/,
      /`[^`]*`/
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(str)) {
        flags.hasInjection = true;
        flags.suspiciousPatterns.push(pattern.source);
      }
    }

    return flags;
  }

  checkBufferSecurity(buffer) {
    const flags = {
      isExecutable: false,
      hasShellcode: false,
      hasNullBytes: buffer.includes(0),
      highEntropy: false,
      suspiciousPatterns: []
    };

    const executableSignatures = [
      Buffer.from([0x4D, 0x5A]),
      Buffer.from([0x7F, 0x45, 0x4C, 0x46]),
      Buffer.from([0xFE, 0xED, 0xFA, 0xCE]),
    ];

    for (const sig of executableSignatures) {
      if (buffer.length >= sig.length && buffer.slice(0, sig.length).equals(sig)) {
        flags.isExecutable = true;
        flags.suspiciousPatterns.push('Executable header detected');
      }
    }

    const shellcodePatterns = [
      /\x90\x90\x90\x90/,
      /\x31\xc0/,
      /\x50\x51\x52\x53/,
      /\x6a\x02/,
    ];

    for (const pattern of shellcodePatterns) {
      if (pattern.test(buffer)) {
        flags.hasShellcode = true;
        flags.suspiciousPatterns.push('Shellcode pattern detected');
      }
    }

    const entropy = this.calculateEntropy(buffer);
    flags.highEntropy = entropy > 7.0;

    return flags;
  }

  checkArraySecurity(array) {
    const flags = {
      hasNestedArrays: false,
      hasCircularRefs: false,
      hasExcessiveDepth: false,
      hasLargeElements: false,
      suspiciousPatterns: []
    };

    for (const element of array) {
      if (Array.isArray(element)) {
        flags.hasNestedArrays = true;
        flags.suspiciousPatterns.push('Nested arrays detected');
      }

      if (typeof element === 'object' && element !== null) {

        if (Object.keys(element).length > 1000) {
          flags.hasLargeElements = true;
          flags.suspiciousPatterns.push('Large object elements');
        }
      }

      if (typeof element === 'string' && element.length > 10000) {
        flags.hasLargeElements = true;
        flags.suspiciousPatterns.push('Large string elements');
      }
    }

    let maxDepth = 0;
    const checkDepth = (arr, depth = 1) => {
      maxDepth = Math.max(maxDepth, depth);
      if (depth > 10) return;

      for (const element of arr) {
        if (Array.isArray(element)) {
          checkDepth(element, depth + 1);
        }
      }
    };

    try {
      checkDepth(array);
      flags.hasExcessiveDepth = maxDepth > 5;
      if (flags.hasExcessiveDepth) {
        flags.suspiciousPatterns.push(`Excessive array depth: ${maxDepth}`);
      }
    } catch (e) {
      flags.hasCircularRefs = true;
      flags.suspiciousPatterns.push('Circular reference detected');
    }

    return flags;
  }

  isValidJsonObject(value) {
    try {
      if (value === null || typeof value !== 'object') return false;
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  generateErrorContext(error, type, definition) {
    return {
      errorType: error.constructor.name,
      errorMessage: error.message,
      fieldType: type,
      fieldDefinition: {
        mandatory: definition.mandatory,
        dataType: definition.dataType,
        hasCustomCheck: typeof definition.check === 'function',
        hasConstraints: !!(definition.min || definition.max || definition.maxLength)
      },
      suggestions: this.generateErrorSuggestions(error, type, definition)
    };
  }

  generateErrorSuggestions(error, type, definition) {
    const suggestions = [];

    if (error.message.includes('offset') || error.message.includes('buffer')) {
      suggestions.push('Check packet structure and field ordering');
      suggestions.push('Verify packet header length calculations');
    }

    if (error.message.includes('type') || error.message.includes('Invalid')) {
      suggestions.push('Verify field type matches expected data type');
      suggestions.push('Check data type compatibility');
    }

    if (error.message.includes('range') || error.message.includes('bounds')) {
      suggestions.push('Check numeric value ranges');
      suggestions.push('Verify field constraints and limits');
    }

    if (error.message.includes('security') || error.message.includes('injection')) {
      suggestions.push('Review input sanitization');
      suggestions.push('Check for malicious content patterns');
    }

    return suggestions;
  }

  decodeOptimizedPayload(type, payload, context, decodeId) {
    const packetDef = this.protocol.getPacketSpec(type);
    if (!packetDef) {
      throw new Error(`[DECODE:${decodeId}] Unknown packet type: ${type}`);
    }

    if (this.canUseFastPath(type, packetDef)) {
      return this.decodeFastPathPayload(type, payload, packetDef, decodeId);
    }

    return this.decodePayloadWithOptimizations(type, payload, packetDef, context, decodeId);
  }

  canUseFastPath(type, packetDef) {
    const optimization = this.typeOptimizations[type];
    if (!optimization || !optimization.enableFastPath) return false;

    const fields = Object.keys(packetDef.schema);
    if (fields.length > 10) return false;

    for (const fieldName of fields) {
      const fieldSpec = packetDef.schema[fieldName];
      if (!this.isSimpleFieldType(fieldSpec.dataType)) {
        return false;
      }
    }

    return true;
  }

  isSimpleFieldType(type) {
    return ['number', 'boolean', 'uint32', 'int8'].includes(type);
  }

  decodeFastPathPayload(type, payload, packetDef, decodeId) {
    const fields = Object.keys(packetDef.schema);
    const data = [];
    let offset = 0;

    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldSpec = packetDef.schema[fieldName];

      try {
        const value = this.decodeFieldFastPath(payload, offset, fieldSpec.dataType, fieldSpec);
        data.push(value);
        offset += this.getCachedFieldSize(fieldSpec.dataType, value, fieldSpec);
      } catch (error) {

        return this.decodePayloadWithOptimizations(type, payload, packetDef, {}, decodeId);
      }
    }

    return data;
  }

  decodeFieldFastPath(buffer, offset, type, definition) {

    switch (type) {
      case "number":
        if (definition.float) {
          const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
          return view.getFloat32(0);
        } else if (definition.int32) {
          const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
          return view.getInt32(0);
        } else if (definition.int16) {
          const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
          return view.getInt16(0);
        } else {
          return buffer.readUInt8(offset);
        }

      case "boolean":
        return buffer.readUInt8(offset) !== 0;

      case "uint32": {
        const view = new DataView(buffer.buffer, buffer.byteOffset + offset);
        return view.getUint32(0);
      }

      case "int8":
        return buffer.readInt8(offset);

      default:
        throw new Error(`Fast path not supported for type: ${type}`);
    }
  }

  getCachedFieldSize(type, value, definition) {
    const cacheKey = `${type}_${definition.float ? 'f' : ''}${definition.int32 ? 'i32' : ''}${definition.int16 ? 'i16' : ''}`;

    if (this.fieldSizeCache.has(cacheKey)) {
      return this.fieldSizeCache.get(cacheKey);
    }

    let size;
    switch (type) {
      case "number":
        size = (definition.float || definition.int32) ? 4 : (definition.int16 ? 2 : 1);
        break;
      case "boolean":
        size = 1;
        break;
      case "uint32":
        size = 4;
        break;
      case "int8":
        size = 1;
        break;
      case "string":
        size = 2 + Buffer.byteLength(value, "utf8");
        break;
      case "object":
        size = 2 + Buffer.byteLength(JSON.stringify(value), "utf8");
        break;
      case "buffer":
        size = 2 + value.length;
        break;
      case "array":
        size = 2;
        for (const elem of value) {
          size += this.getCachedFieldSize(definition.elementType, elem, definition);
        }
        break;
      default:
        size = 0;
    }

    if (this.fieldSizeCache.size < 1000) {
      this.fieldSizeCache.set(cacheKey, size);
    }

    return size;
  }

  decodePayloadWithOptimizations(type, payload, packetDef, context, decodeId) {
    const fields = Object.keys(packetDef.schema);
    const data = [];
    let offset = 0;
    const fieldResults = [];

    if (this.batchProcessingEnabled && fields.length > 5) {
      return this.decodePayloadBatched(fields, payload, packetDef, decodeId);
    }

    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      const fieldName = fields[fieldIndex];
      const fieldSpec = packetDef.schema[fieldName];

      const fieldDecodeStart = performance.now();

      try {

        if (offset > payload.length) {
          throw new Error(`[DECODE:${decodeId}] Field offset ${offset} exceeds payload size ${payload.length}`);
        }

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
        const fieldSize = this.getCachedFieldSize(fieldSpec.dataType, value, fieldSpec);
        const fieldDecodeTime = performance.now() - fieldDecodeStart;

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

  decodePayloadBatched(fields, payload, packetDef, decodeId) {
    this.metrics.batchOperations++;

    const batchSize = 10;
    const data = [];
    let offset = 0;

    for (let batchStart = 0; batchStart < fields.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, fields.length);
      const batch = fields.slice(batchStart, batchEnd);

      for (let fieldIndex = 0; fieldIndex < batch.length; fieldIndex++) {
        const fieldName = batch[fieldIndex];
        const fieldSpec = packetDef.schema[fieldName];

        try {
          if (offset >= payload.length) {
            if (fieldSpec.mandatory) {
              throw new Error(`Missing required field '${fieldName}'`);
            }
            data.push(undefined);
            continue;
          }

          const value = this.decodeField(payload, offset, fieldSpec.dataType, fieldSpec, fieldName, decodeId);
          const fieldSize = this.getCachedFieldSize(fieldSpec.dataType, value, fieldSpec);

          data.push(value);
          offset += fieldSize;

        } catch (error) {
          if (fieldSpec.mandatory || this.validationLevel === 'strict') {
            throw error;
          }
          data.push(undefined);
        }
      }
    }

    return data;
  }

  generateOptimizedCacheKey(header, context) {

    const keyParts = [
      header.type,
      header.sequence,
      context.socketId || 'unknown',
      header.compressed ? 'c' : '',
      header.encrypted ? 'e' : ''
    ];

    return keyParts.join('|');
  }

  getCachedValidation(type, data) {

    const cacheKey = this.generateValidationCacheKey(type, data);

    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey);
    }

    const validation = this.protocol.verifyPacket(type, data);

    if (this.validationCache.size < 5000) {
      this.validationCache.set(cacheKey, validation);
    }

    return validation;
  }

  generateValidationCacheKey(type, data) {

    const dataHash = this.hashData(data);
    return `${type}_${dataHash}`;
  }

  hashData(data) {

    let hash = 0;
    const str = JSON.stringify(data);

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return hash.toString(36);
  }

  manageCacheSize() {
    if (this.packetCache.size > this.maxCacheSize * this.cacheCleanupThreshold) {

      const targetSize = Math.floor(this.maxCacheSize * 0.6);
      const entriesToRemove = this.packetCache.size - targetSize;

      const entries = Array.from(this.packetCache.entries());
      for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
        this.packetCache.delete(entries[i][0]);
        this.metrics.cacheEvictions++;
      }
    }
  }

  performMemoryCleanup() {
    if (!this.memoryOptimizationEnabled) return;

    const currentMemory = this.getCurrentMemoryUsage();
    this.metrics.memoryUsage = currentMemory;
    this.metrics.peakMemoryUsage = Math.max(this.metrics.peakMemoryUsage, currentMemory);

    this.manageCacheSize();

    if (this.validationCache.size > 2500) {
      const entriesToRemove = Math.floor(this.validationCache.size * 0.4);
      const entries = Array.from(this.validationCache.entries());
      for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
        this.validationCache.delete(entries[i][0]);
      }
    }

    if (this.fieldSizeCache.size > 500) {
      const entriesToRemove = Math.floor(this.fieldSizeCache.size * 0.3);
      const entries = Array.from(this.fieldSizeCache.entries());
      for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
        this.fieldSizeCache.delete(entries[i][0]);
      }
    }

    if (this.packetHistory.length > 500) {
      this.packetHistory = this.packetHistory.slice(-500);
    }

    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    this.logDebug('Memory cleanup completed', {
      memoryUsage: currentMemory,
      cacheSizes: {
        packet: this.packetCache.size,
        validation: this.validationCache.size,
        fieldSize: this.fieldSizeCache.size
      }
    });
  }

  getCurrentMemoryUsage() {

    const packetCacheSize = this.packetCache.size * 1000;
    const validationCacheSize = this.validationCache.size * 500;
    const fieldSizeCacheSize = this.fieldSizeCache.size * 100;

    return packetCacheSize + validationCacheSize + fieldSizeCacheSize;
  }

  updatePerformanceProfile(packetType, decodeTime) {
    if (!this.performanceProfile.has(packetType)) {
      this.performanceProfile.set(packetType, {
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        averageTime: 0
      });
    }

    const profile = this.performanceProfile.get(packetType);
    profile.count++;
    profile.totalTime += decodeTime;
    profile.minTime = Math.min(profile.minTime, decodeTime);
    profile.maxTime = Math.max(profile.maxTime, decodeTime);
    profile.averageTime = profile.totalTime / profile.count;
  }

  getPerformanceStats() {
    return {
      metrics: { ...this.metrics },
      cacheStats: {
        packetCache: this.packetCache.size,
        validationCache: this.validationCache.size,
        fieldSizeCache: this.fieldSizeCache.size,
        cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0
      },
      performanceProfile: Object.fromEntries(this.performanceProfile),
      memoryUsage: this.getCurrentMemoryUsage()
    };
  }

  logDebug(message, data = {}) {
    if (!this.debugMode) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      component: 'BinaryCodec',
      message,
      data: this.sanitizeLogData(data),
      memoryUsage: this.getCurrentMemoryUsage(),
      performance: this.getCurrentPerformanceSnapshot()
    };

    console.log(`[BINARY_CODEC] ${message}`, logEntry);

    if (this.debugHistory) {
      this.debugHistory.push(logEntry);
      if (this.debugHistory.length > 1000) {
        this.debugHistory = this.debugHistory.slice(-1000);
      }
    }
  }

  logError(message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      component: 'BinaryCodec',
      message,
      data: this.sanitizeLogData(data),
      memoryUsage: this.getCurrentMemoryUsage(),
      performance: this.getCurrentPerformanceSnapshot(),
      stackTrace: new Error().stack
    };

    console.error(`[BINARY_CODEC] ${message}`, logEntry);

    this.errorLog.push({
      ...logEntry,
      id: this.generateErrorId(),
      resolved: false,
      resolutionAttempts: 0
    });

    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    if (this.enableErrorAnalysis) {
      this.analyzeError(logEntry);
    }
  }

  logPerformance(operation, duration, metadata = {}) {
    const perfEntry = {
      timestamp: Date.now(),
      operation,
      duration,
      metadata,
      memoryDelta: this.getCurrentMemoryUsage() - (this.lastMemoryUsage || 0),
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0
    };

    this.lastMemoryUsage = this.getCurrentMemoryUsage();

    if (this.performanceLog) {
      this.performanceLog.push(perfEntry);
      if (this.performanceLog.length > 500) {
        this.performanceLog = this.performanceLog.slice(-500);
      }
    }

    if (duration > 100) {
      this.logDebug(`Slow operation detected: ${operation}`, {
        duration: duration.toFixed(2) + 'ms',
        threshold: '100ms',
        ...metadata
      });
    }
  }

  sanitizeLogData(data) {
    const sanitized = { ...data };

    if (sanitized.socket) delete sanitized.socket;
    if (sanitized.sendPacket) delete sanitized.sendPacket;
    if (sanitized.password) delete sanitized.password;
    if (sanitized.token) delete sanitized.token;

    if (sanitized.buffer && sanitized.buffer.length > 100) {
      sanitized.buffer = `<Buffer ${sanitized.buffer.length} bytes: ${this.bufferToHex(sanitized.buffer.slice(0, 32))}...>`;
    }

    if (sanitized.value && typeof sanitized.value === 'string' && sanitized.value.length > 100) {
      sanitized.value = sanitized.value.substring(0, 97) + '...';
    }

    return this.limitObjectDepth(sanitized, 3);
  }

  limitObjectDepth(obj, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) return '[Max Depth Reached]';
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      if (obj.length > 10) {
        return `[Array ${obj.length} items: ${obj.slice(0, 3).map(item => this.limitObjectDepth(item, maxDepth, currentDepth + 1)).join(', ')}...]`;
      }
      return obj.map(item => this.limitObjectDepth(item, maxDepth, currentDepth + 1));
    }

    const limited = {};
    const keys = Object.keys(obj);
    if (keys.length > 10) {
      const sampleKeys = keys.slice(0, 5);
      for (const key of sampleKeys) {
        limited[key] = this.limitObjectDepth(obj[key], maxDepth, currentDepth + 1);
      }
      limited['...'] = `${keys.length - 5} more properties`;
    } else {
      for (const key of keys) {
        limited[key] = this.limitObjectDepth(obj[key], maxDepth, currentDepth + 1);
      }
    }

    return limited;
  }

  getCurrentPerformanceSnapshot() {
    return {
      packetsDecoded: this.metrics.packetsDecoded,
      packetsEncoded: this.metrics.packetsEncoded,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
      averageDecodeTime: this.metrics.averageDecodeTime,
      validationErrors: this.metrics.validationErrors,
      memoryUsage: this.getCurrentMemoryUsage()
    };
  }

  generateErrorId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  analyzeError(errorEntry) {

    const errorPatterns = {
      'buffer overflow': { severity: 'high', suggestion: 'Check packet size limits' },
      'invalid type': { severity: 'medium', suggestion: 'Verify field type definitions' },
      'range error': { severity: 'medium', suggestion: 'Check value constraints' },
      'validation failed': { severity: 'low', suggestion: 'Review validation rules' }
    };

    for (const [pattern, info] of Object.entries(errorPatterns)) {
      if (errorEntry.message.toLowerCase().includes(pattern)) {
        this.logDebug(`Error pattern detected: ${pattern}`, {
          severity: info.severity,
          suggestion: info.suggestion,
          originalError: errorEntry.message
        });
        break;
      }
    }
  }

  enableDebugMode(options = {}) {
    this.debugMode = true;
    this.debugHistory = [];
    this.performanceLog = [];
    this.enableErrorAnalysis = options.enableErrorAnalysis || false;
    this.debugLevel = options.level || 'normal';

    this.logDebug('Debug mode enabled', {
      options,
      timestamp: new Date().toISOString()
    });
  }

  disableDebugMode() {
    this.logDebug('Debug mode disabled', {
      finalStats: this.getPerformanceStats()
    });

    this.debugMode = false;
  }

  getDebugReport() {
    if (!this.debugMode) {
      return { error: 'Debug mode not enabled' };
    }

    return {
      debugHistory: this.debugHistory || [],
      performanceLog: this.performanceLog || [],
      errorLog: this.errorLog,
      performanceStats: this.getPerformanceStats(),
      cacheAnalysis: this.analyzeCachePatterns(),
      errorAnalysis: this.analyzeErrorPatterns(),
      recommendations: this.generateRecommendations()
    };
  }

  analyzeCachePatterns() {
    const cacheStats = {
      totalRequests: this.metrics.cacheHits + this.metrics.cacheMisses,
      hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
      evictions: this.metrics.cacheEvictions,
      efficiency: 'good'
    };

    if (cacheStats.hitRate < 0.5) {
      cacheStats.efficiency = 'poor';
    } else if (cacheStats.hitRate < 0.8) {
      cacheStats.efficiency = 'fair';
    }

    return cacheStats;
  }

  analyzeErrorPatterns() {
    const errorTypes = {};
    const recentErrors = this.errorLog.slice(-50);

    for (const error of recentErrors) {
      const type = this.categorizeError(error.message);
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    }

    const totalErrors = recentErrors.length;
    const errorDistribution = {};

    for (const [type, count] of Object.entries(errorTypes)) {
      errorDistribution[type] = {
        count,
        percentage: ((count / totalErrors) * 100).toFixed(1) + '%'
      };
    }

    return {
      totalRecentErrors: totalErrors,
      distribution: errorDistribution,
      mostCommon: Object.keys(errorTypes).reduce((a, b) => errorTypes[a] > errorTypes[b] ? a : b, '')
    };
  }

  categorizeError(errorMessage) {
    const message = errorMessage.toLowerCase();

    if (message.includes('buffer') || message.includes('offset')) return 'buffer_error';
    if (message.includes('type') || message.includes('invalid')) return 'type_error';
    if (message.includes('range') || message.includes('bounds')) return 'range_error';
    if (message.includes('validation')) return 'validation_error';
    if (message.includes('security') || message.includes('injection')) return 'security_error';
    if (message.includes('cache')) return 'cache_error';

    return 'other';
  }

  generateRecommendations() {
    const recommendations = [];
    const stats = this.getPerformanceStats();

    if (stats.cacheStats.cacheHitRate < 0.7) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'Low cache hit rate detected. Consider increasing cache size or reviewing cache key generation.',
        currentHitRate: (stats.cacheStats.cacheHitRate * 100).toFixed(1) + '%'
      });
    }

    if (stats.metrics.averageDecodeTime > 50) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'High average decode time detected. Consider enabling fast path optimizations.',
        averageTime: stats.metrics.averageDecodeTime.toFixed(2) + 'ms'
      });
    }

    const errorAnalysis = this.analyzeErrorPatterns();
    if (errorAnalysis.totalRecentErrors > 10) {
      recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: `High error rate detected: ${errorAnalysis.totalRecentErrors} errors in recent logs.`,
        mostCommonError: errorAnalysis.mostCommon
      });
    }

    if (stats.memoryUsage > 10000000) {
      recommendations.push({
        type: 'memory',
        priority: 'medium',
        message: 'High memory usage detected. Consider reducing cache sizes or enabling more aggressive cleanup.',
        memoryUsage: (stats.memoryUsage / 1024 / 1024).toFixed(2) + 'MB'
      });
    }

    return recommendations;
  }

  debugPacketValidation(packetType, data) {
    if (!this.debugMode) return;

    const validation = this.protocol.verifyPacket(packetType, data);
    const debugInfo = {
      packetType,
      validationResult: validation,
      dataAnalysis: this.analyzePacketData(data),
      timestamp: new Date().toISOString()
    };

    this.logDebug(`Packet validation debug: ${packetType}`, debugInfo);

    return debugInfo;
  }

  analyzePacketData(data) {
    if (!Array.isArray(data)) {
      return { type: 'non-array', dataType: typeof data };
    }

    const analysis = {
      type: 'array',
      length: data.length,
      elementTypes: data.map(item => typeof item),
      nullCount: data.filter(item => item === null || item === undefined).length,
      sizeEstimate: JSON.stringify(data).length
    };

    if (analysis.nullCount > 0) {
      analysis.hasNulls = true;
      analysis.nullPercentage = ((analysis.nullCount / analysis.length) * 100).toFixed(1) + '%';
    }

    return analysis;
  }

  startProfiling(operation) {
    if (!this.debugMode) return null;

    const profileId = this.generateProfileId();
    const profile = {
      id: profileId,
      operation,
      startTime: performance.now(),
      startMemory: this.getCurrentMemoryUsage()
    };

    if (!this.activeProfiles) this.activeProfiles = new Map();
    this.activeProfiles.set(profileId, profile);

    return profileId;
  }

  endProfiling(profileId, metadata = {}) {
    if (!this.debugMode || !this.activeProfiles?.has(profileId)) return;

    const profile = this.activeProfiles.get(profileId);
    const endTime = performance.now();
    const endMemory = this.getCurrentMemoryUsage();

    profile.endTime = endTime;
    profile.duration = endTime - profile.startTime;
    profile.memoryDelta = endMemory - profile.startMemory;
    profile.metadata = metadata;

    this.logDebug(`Profile completed: ${profile.operation}`, {
      duration: profile.duration.toFixed(2) + 'ms',
      memoryDelta: profile.memoryDelta,
      ...metadata
    });

    if (!this.profiles) this.profiles = [];
    this.profiles.push(profile);
    if (this.profiles.length > 100) {
      this.profiles = this.profiles.slice(-100);
    }

    this.activeProfiles.delete(profileId);
    return profile;
  }

  generateProfileId() {
    return 'prof_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  getProtocolDocumentation() {
    const documentation = {
      packetFormat: {
        header: {
          magic: "0xABCD (Little Endian)",
          structure: "14 bytes fixed header",
          fields: [
            { offset: 0, size: 2, name: "magic", description: "Packet identifier" },
            { offset: 2, size: 1, name: "typeId", description: "Packet type identifier" },
            { offset: 3, size: 1, name: "flags", description: "Compression, encryption, priority" },
            { offset: 4, size: 4, name: "sequence", description: "Packet sequence number" },
            { offset: 8, size: 4, name: "timestamp", description: "Creation timestamp" },
            { offset: 12, size: 2, name: "payloadLength", description: "Payload data length" }
          ]
        },
        payload: {
          structure: "Variable length field data",
          encoding: "Type-specific binary encoding"
        }
      },
      fieldTypes: {
        number: {
          subtypes: {
            uint8: { size: 1, range: "0-255", endian: "little" },
            int16: { size: 2, range: "-32768 to 32767", endian: "little" },
            int32: { size: 4, range: "-2147483648 to 2147483647", endian: "little" },
            float32: { size: 4, format: "IEEE 754", endian: "little" }
          }
        },
        string: {
          encoding: "UTF-8",
          structure: "2-byte length prefix + data",
          maxLength: 65535
        },
        boolean: {
          size: 1,
          values: { 0: "false", 1: "true" }
        },
        uint32: {
          size: 4,
          range: "0-4294967295",
          endian: "little"
        },
        int8: {
          size: 1,
          range: "-128 to 127"
        },
        buffer: {
          structure: "2-byte length prefix + raw data",
          maxLength: 65535
        },
        array: {
          structure: "2-byte element count + concatenated elements",
          maxElements: 65535
        },
        object: {
          encoding: "JSON string",
          structure: "2-byte length prefix + UTF-8 JSON",
          maxLength: 65535
        }
      },
      flagBits: {
        0: { name: "compressed", description: "Payload is compressed" },
        1: { name: "encrypted", description: "Payload is encrypted" },
        2: { name: "reserved", description: "Reserved for future use" },
        3: { name: "reserved", description: "Reserved for future use" },
        4: { name: "priority0", description: "Priority level bit 0" },
        5: { name: "priority1", description: "Priority level bit 1" },
        6: { name: "priority2", description: "Priority level bit 2" },
        7: { name: "priority3", description: "Priority level bit 3" }
      },
      packetTypes: {}
    };

    for (const [typeName, packetDef] of this.protocol.packetRegistry) {
      documentation.packetTypes[typeName] = {
        identifier: packetDef.identifier,
        description: packetDef.description,
        priority: packetDef.priority,
        guaranteed: packetDef.guaranteed,
        compacted: packetDef.compacted,
        revision: packetDef.revision,
        fields: {}
      };

      for (const [fieldName, fieldSpec] of Object.entries(packetDef.schema)) {
        documentation.packetTypes[typeName].fields[fieldName] = {
          type: fieldSpec.dataType,
          mandatory: fieldSpec.mandatory || false,
          description: fieldSpec.description || `Field: ${fieldName}`,
          constraints: {
            min: fieldSpec.min,
            max: fieldSpec.max,
            maxLength: fieldSpec.maxLength,
            pattern: fieldSpec.pattern ? fieldSpec.pattern.source : null
          }
        };
      }
    }

    return documentation;
  }

  generateExamplePacket(packetType, customData = {}) {
    const packetDef = this.protocol.getPacketSpec(packetType);
    if (!packetDef) {
      throw new Error(`Unknown packet type: ${packetType}`);
    }

    const exampleData = [];
    const fields = Object.keys(packetDef.schema);

    for (const fieldName of fields) {
      const fieldSpec = packetDef.schema[fieldName];

      if (customData[fieldName] !== undefined) {
        exampleData.push(customData[fieldName]);
      } else {

        exampleData.push(this.generateExampleFieldValue(fieldSpec.dataType, fieldSpec));
      }
    }

    const encodedPacket = this.encodePacket(packetType, exampleData);
    const decodedPacket = this.decodePacket(encodedPacket);

    return {
      type: packetType,
      data: exampleData,
      encoded: encodedPacket,
      decoded: decodedPacket,
      hexDump: this.bufferToHex(encodedPacket),
      structure: this.analyzePacketStructure(encodedPacket)
    };
  }

  generateExampleFieldValue(dataType, fieldSpec) {
    switch (dataType) {
      case "number":
        if (fieldSpec.float) return 3.14159;
        if (fieldSpec.int32) return 123456789;
        if (fieldSpec.int16) return 12345;
        return 42;

      case "string":
        return fieldSpec.maxLength ? "example".substring(0, fieldSpec.maxLength) : "example string";

      case "boolean":
        return true;

      case "uint32":
        return 123456789;

      case "int8":
        return 42;

      case "buffer":
        return Buffer.from([0x01, 0x02, 0x03, 0x04]);

      case "array":
        return [1, 2, 3];

      case "object":
        return { example: "value", number: 42 };

      default:
        return null;
    }
  }

  analyzePacketStructure(packetData) {
    const header = this.extractHeader(packetData);
    if (!header) {
      return { error: "Invalid packet format" };
    }

    const analysis = {
      header: {
        magic: `0x${header.parsedFlags.magic?.toString(16).padStart(4, '0') || 'ABCD'}`,
        typeId: header.typeId,
        type: header.type,
        flags: {
          raw: header.flags,
          parsed: header.parsedFlags
        },
        sequence: header.sequence,
        timestamp: new Date(header.timestamp * 1000).toISOString(),
        payloadLength: header.payloadLength
      },
      payload: {
        offset: header.length,
        size: header.payloadLength,
        hex: this.bufferToHex(packetData.slice(header.length, header.length + Math.min(header.payloadLength, 32)))
      }
    };

    return analysis;
  }

  initializeValidationRules() {

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

    if (rawData.length > 1048576) {
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
        if (byte !== 9 && byte !== 10 && byte !== 13) {
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

    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    console.error(`[BinaryCodec] ${message}`, data);
  }

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

        arrBuffers.push(Buffer.alloc(1));
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

      case "object": {
        const jsonString = JSON.stringify(value);
        return 2 + Buffer.byteLength(jsonString, "utf8");
      }

      case "uint32":
        return 4;

      case "int8":
        return 1;

      case "buffer":
        return 2 + value.length;

      case "array":
        let total = 2;
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

  performInitialBinaryAnalysis(rawData, decodeId) {
    const analysis = {
      timestamp: Date.now(),
      decodeId: decodeId,
      dataSize: rawData.length,
      hexPreview: this.hexDumpGenerator.generate(rawData.slice(0, Math.min(64, rawData.length))),
      entropy: this.calculateEntropy(rawData),
      patterns: this.patternDetector.findPatterns(rawData),
      structure: this.patternDetector.analyzeStructure(rawData),
      encoding: this.patternDetector.detectEncoding(rawData)
    };

    this.binaryAnalysisLog.push(analysis);
    return analysis;
  }

  generateHexDump(buffer, offset = 0, length = buffer.length) {
    const lines = [];
    const end = Math.min(offset + length, buffer.length);
    
    for (let i = offset; i < end; i += 16) {
      const chunk = buffer.slice(i, Math.min(i + 16, end));
      const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ');
      const ascii = Array.from(chunk).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
      const address = i.toString(16).padStart(8, '0').toUpperCase();
      
      lines.push(`${address}  ${hex.padEnd(47)}  |${ascii}|`);
    }
    
    return lines.join('\n');
  }

  generateDetailedHexDump(buffer, offset = 0, length = buffer.length) {
    const lines = [];
    const end = Math.min(offset + length, buffer.length);
    
    for (let i = offset; i < end; i += 16) {
      const chunk = buffer.slice(i, Math.min(i + 16, end));
      const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ');
      const ascii = Array.from(chunk).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
      const address = i.toString(16).padStart(8, '0').toUpperCase();
      
      // Add bit-level analysis for each byte
      const bits = Array.from(chunk).map(b => b.toString(2).padStart(8, '0')).join(' ');
      const decimal = Array.from(chunk).map(b => b.toString().padStart(3, ' ')).join(' ');
      
      lines.push(`${address}  ${hex.padEnd(47)}  |${ascii}|`);
      lines.push(`        BITS: ${bits}`);
      lines.push(`        DEC:  ${decimal}`);
      lines.push('');
    }
    
    return lines.join('\n');
  }

  analyzeBits(byte) {
    const bits = byte.toString(2).padStart(8, '0');
    return {
      decimal: byte,
      hexadecimal: '0x' + byte.toString(16).padStart(2, '0').toUpperCase(),
      binary: bits,
      octal: '0' + byte.toString(8),
      bits: {
        b7: parseInt(bits[0]), b6: parseInt(bits[1]), b5: parseInt(bits[2]), b4: parseInt(bits[3]),
        b3: parseInt(bits[4]), b2: parseInt(bits[5]), b1: parseInt(bits[6]), b0: parseInt(bits[7])
      },
      ascii: (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.',
      isPrintable: byte >= 32 && byte <= 126,
      isControl: byte < 32 || byte === 127,
      description: this.getByteDescription(byte)
    };
  }

  analyzeBitField(buffer, offset, bitCount) {
    const byteIndex = Math.floor(offset / 8);
    const bitOffset = offset % 8;
    const bytesNeeded = Math.ceil((bitOffset + bitCount) / 8);
    
    if (byteIndex + bytesNeeded > buffer.length) {
      throw new Error(`Bit field exceeds buffer: need ${bytesNeeded} bytes from offset ${byteIndex}`);
    }
    
    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) | buffer[byteIndex + i];
    }
    
    value = (value >> (8 - bitOffset - bitCount)) & ((1 << bitCount) - 1);
    
    return {
      value: value,
      offset: offset,
      bitCount: bitCount,
      byteIndex: byteIndex,
      bitOffset: bitOffset,
      bytesUsed: bytesNeeded,
      binary: value.toString(2).padStart(bitCount, '0'),
      hexadecimal: '0x' + value.toString(16).padStart(Math.ceil(bitCount / 4), '0').toUpperCase(),
      decimal: value
    };
  }

  extractBits(value, startBit, bitCount) {
    const mask = (1 << bitCount) - 1;
    return (value >> startBit) & mask;
  }

  findBinaryPatterns(buffer) {
    const patterns = {
      repeated: this.findRepeatedPatterns(buffer),
      sequences: this.findSequentialPatterns(buffer),
      structures: this.findStructuralPatterns(buffer),
      encodings: this.findEncodingPatterns(buffer),
      signatures: this.findSignaturePatterns(buffer)
    };
    
    return patterns;
  }

  findRepeatedPatterns(buffer) {
    const patterns = [];
    const minLength = 2;
    const maxLength = Math.min(16, Math.floor(buffer.length / 4));
    
    for (let len = minLength; len <= maxLength; len++) {
      const frequency = new Map();
      
      for (let i = 0; i <= buffer.length - len; i++) {
        const pattern = buffer.slice(i, i + len).toString('hex');
        frequency.set(pattern, (frequency.get(pattern) || 0) + 1);
      }
      
      for (const [pattern, count] of frequency) {
        if (count > 1) {
          patterns.push({
            pattern: pattern,
            length: len,
            frequency: count,
            hex: pattern.match(/.{2}/g)?.join(' ') || pattern
          });
        }
      }
    }
    
    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  findSequentialPatterns(buffer) {
    const patterns = [];
    
    // Look for increasing sequences
    let incStart = 0;
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i] === buffer[i-1] + 1) {
        continue;
      }
      if (i - incStart >= 3) {
        patterns.push({
          type: 'increasing',
          start: incStart,
          length: i - incStart,
          sequence: Array.from(buffer.slice(incStart, i)).join(', ')
        });
      }
      incStart = i;
    }
    
    // Look for decreasing sequences
    let decStart = 0;
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i] === buffer[i-1] - 1) {
        continue;
      }
      if (i - decStart >= 3) {
        patterns.push({
          type: 'decreasing',
          start: decStart,
          length: i - decStart,
          sequence: Array.from(buffer.slice(decStart, i)).join(', ')
        });
      }
      decStart = i;
    }
    
    return patterns;
  }

  findStructuralPatterns(buffer) {
    const patterns = [];
    
    const signatures = [
      { name: 'PNG', pattern: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) },
      { name: 'JPEG', pattern: Buffer.from([0xFF, 0xD8, 0xFF]) },
      { name: 'GZIP', pattern: Buffer.from([0x1F, 0x8B]) },
      { name: 'ZIP', pattern: Buffer.from([0x50, 0x4B, 0x03, 0x04]) },
      { name: 'JSON', pattern: Buffer.from([0x7B]) },
      { name: 'ASCII Text', pattern: Buffer.from([0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27]) }
    ];
    
    for (const sig of signatures) {
      if (buffer.length >= sig.pattern.length && buffer.slice(0, sig.pattern.length).equals(sig.pattern)) {
        patterns.push({
          type: 'signature',
          name: sig.name,
          offset: 0,
          pattern: Array.from(sig.pattern).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')
        });
      }
    }
    
    return patterns;
  }

  findEncodingPatterns(buffer) {
    const patterns = [];
    
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      patterns.push({ type: 'UTF-8 BOM', offset: 0 });
    }
    
    if (buffer.length >= 2) {
      if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        patterns.push({ type: 'UTF-16 LE BOM', offset: 0 });
      } else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
        patterns.push({ type: 'UTF-16 BE BOM', offset: 0 });
      }
    }
    
    const distribution = new Array(256).fill(0);
    for (const byte of buffer) {
      distribution[byte]++;
    }
    
    const asciiCount = distribution.slice(32, 127).reduce((a, b) => a + b, 0);
    const asciiRatio = asciiCount / buffer.length;
    
    if (asciiRatio > 0.9) {
      patterns.push({ type: 'Mostly ASCII', ratio: asciiRatio });
    } else if (asciiRatio < 0.1) {
      patterns.push({ type: 'Mostly Binary', ratio: asciiRatio });
    }
    
    return patterns;
  }

  findSignaturePatterns(buffer) {
    const patterns = [];
    
    for (let i = 0; i < buffer.length - 4; i++) {
      if (buffer[i] >= 32 && buffer[i] <= 126) {
        let j = i;
        while (j < buffer.length && buffer[j] >= 32 && buffer[j] <= 126) {
          j++;
        }
        if (j < buffer.length && buffer[j] === 0 && j - i >= 4) {
          patterns.push({
            type: 'null-terminated string',
            offset: i,
            length: j - i,
            value: buffer.slice(i, j).toString('ascii')
          });
          i = j;
        }
      }
    }
    
    return patterns;
  }

  analyzeBinaryStructure(buffer) {
    const structure = {
      size: buffer.length,
      entropy: this.calculateEntropy(buffer),
      byteDistribution: this.getByteDistribution(buffer),
      runLengths: this.getRunLengthEncoding(buffer),
      chunks: this.identifyChunks(buffer)
    };
    
    return structure;
  }

  detectDataEncoding(buffer) {
    const encodings = [];
    
    // Try UTF-8
    try {
      const utf8Str = buffer.toString('utf8');
      const isValidUtf8 = Buffer.from(utf8Str, 'utf8').equals(buffer);
      if (isValidUtf8) {
        encodings.push({ type: 'UTF-8', confidence: 0.9, sample: utf8Str.slice(0, 50) });
      }
    } catch (e) {
      // Not valid UTF-8
    }
    
    // Try ASCII
    let asciiValid = true;
    let asciiStr = '';
    for (let i = 0; i < Math.min(100, buffer.length); i++) {
      if (buffer[i] < 32 || buffer[i] > 126) {
        asciiValid = false;
        break;
      }
      asciiStr += String.fromCharCode(buffer[i]);
    }
    if (asciiValid) {
      encodings.push({ type: 'ASCII', confidence: 0.8, sample: asciiStr });
    }
    
    return encodings;
  }

  analyzeHeaderStructure(header, rawData, decodeId) {
    const analysis = {
      decodeId: decodeId,
      headerBytes: rawData.slice(0, header.length),
      magicBytes: rawData.slice(0, 2),
      typeId: rawData[2],
      flags: rawData[3],
      sequence: rawData.readUInt32BE(4),
      timestamp: rawData.readUInt32BE(8),
      payloadLength: rawData.readUInt16BE(12),
      flagAnalysis: this.analyzeHeaderFlags(header.flags),
      bitAnalysis: this.performBitLevelAnalysis(rawData.slice(0, header.length), header)
    };
    
    this.packetStructureLog.push(analysis);
    return analysis;
  }

  analyzeHeaderFlags(flags) {
    return {
      raw: flags,
      binary: flags.toString(2).padStart(8, '0'),
      hex: '0x' + flags.toString(16).padStart(2, '0').toUpperCase(),
      bits: {
        b0: { value: (flags >> 0) & 1, meaning: 'compressed' },
        b1: { value: (flags >> 1) & 1, meaning: 'encrypted' },
        b2: { value: (flags >> 2) & 1, meaning: 'reserved' },
        b3: { value: (flags >> 3) & 1, meaning: 'reserved' },
        b4: { value: (flags >> 4) & 1, meaning: 'priority_0' },
        b5: { value: (flags >> 5) & 1, meaning: 'priority_1' },
        b6: { value: (flags >> 6) & 1, meaning: 'priority_2' },
        b7: { value: (flags >> 7) & 1, meaning: 'priority_3' }
      },
      interpreted: {
        compressed: !!(flags & 0x01),
        encrypted: !!(flags & 0x02),
        priority: (flags >> 4) & 0x0F,
        reserved: flags & 0xC0
      }
    };
  }

  performBitLevelAnalysis(buffer, header) {
    const analysis = {
      totalBits: buffer.length * 8,
      byteAnalysis: Array.from(buffer).map((byte, index) => this.analyzeBits(byte)),
      bitDistribution: this.getBitDistribution(buffer),
      patterns: this.findBitPatterns(buffer)
    };
    
    if (header) {
      analysis.headerBitAnalysis = {
        magicBits: this.analyzeBitField(buffer, 0, 16),
        typeBits: this.analyzeBitField(buffer, 16, 8),
        flagBits: this.analyzeBitField(buffer, 24, 8),
        sequenceBits: this.analyzeBitField(buffer, 32, 32),
        timestampBits: this.analyzeBitField(buffer, 64, 32),
        payloadLengthBits: this.analyzeBitField(buffer, 96, 16)
      };
    }
    
    return analysis;
  }

  extractFieldLevelAnalysis(packetData, packetType, decodeId) {
    const analysis = {
      decodeId: decodeId,
      packetType: packetType,
      fieldCount: packetData.length,
      fields: packetData.map((value, index) => this.extractFieldMetadata(index, value)),
      totalSize: this.calculateTotalFieldSize(packetData, packetType),
      fieldDistribution: this.getFieldDistribution(packetData)
    };
    
    this.fieldAnalysisLog.push(analysis);
    return analysis;
  }

  extractFieldMetadata(fieldIndex, value) {
    const metadata = {
      index: fieldIndex,
      value: value,
      type: typeof value,
      size: this.calculateFieldSize(value),
      isNull: value === null,
      isUndefined: value === undefined,
      hexRepresentation: this.valueToHex(value),
      binaryRepresentation: this.valueToBinary(value),
      analysis: this.analyzeFieldValue(value)
    };
    
    if (Buffer.isBuffer(value)) {
      metadata.bufferAnalysis = {
        size: value.length,
        hex: this.hexDumpGenerator.generate(value.slice(0, 32)),
        entropy: this.calculateEntropy(value),
        isPrintable: this.isPrintableBuffer(value),
        patterns: this.findBinaryPatterns(value)
      };
    }
    
    if (typeof value === 'string') {
      metadata.stringAnalysis = {
        length: value.length,
        byteLength: Buffer.byteLength(value, 'utf8'),
        encoding: 'utf8',
        hasNullBytes: value.includes('\0'),
        hasControlChars: /[\x00-\x1F\x7F]/.test(value),
        characterAnalysis: this.analyzeStringCharacters(value)
      };
    }
    
    if (Array.isArray(value)) {
      metadata.arrayAnalysis = {
        length: value.length,
        elementType: this.getArrayElementType(value),
        elementTypes: [...new Set(value.map(v => typeof v))],
        nestedArrays: value.some(v => Array.isArray(v)),
        maxDepth: this.calculateArrayDepth(value)
      };
    }
    
    return metadata;
  }

  calculateEntropy(buffer) {
    if (buffer.length === 0) return 0;
    
    const frequency = new Array(256).fill(0);
    for (const byte of buffer) {
      frequency[byte]++;
    }
    
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (frequency[i] > 0) {
        const probability = frequency[i] / buffer.length;
        entropy -= probability * Math.log2(probability);
      }
    }
    
    return entropy;
  }

  getByteDistribution(buffer) {
    const distribution = new Array(256).fill(0);
    for (const byte of buffer) {
      distribution[byte]++;
    }
    
    return {
      distribution: distribution,
      unique: distribution.filter(count => count > 0).length,
      mostCommon: distribution.indexOf(Math.max(...distribution)),
      leastCommon: distribution.indexOf(Math.min(...distribution.filter(count => count > 0))),
      histogram: distribution.map((count, byte) => ({
        byte: byte,
        hex: '0x' + byte.toString(16).padStart(2, '0').toUpperCase(),
        count: count,
        percentage: ((count / buffer.length) * 100).toFixed(2) + '%'
      }))
    };
  }

  getBitDistribution(buffer) {
    const bitCounts = new Array(8).fill(0);
    const totalBits = buffer.length * 8;
    
    for (const byte of buffer) {
      for (let bit = 0; bit < 8; bit++) {
        if ((byte >> bit) & 1) {
          bitCounts[bit]++;
        }
      }
    }
    
    return bitCounts.map((count, bit) => ({
      bitPosition: bit,
      setBits: count,
      clearBits: buffer.length - count,
      percentage: ((count / buffer.length) * 100).toFixed(2) + '%'
    }));
  }

  getByteDescription(byte) {
    if (byte === 0) return 'Null byte';
    if (byte >= 32 && byte <= 126) return `ASCII '${String.fromCharCode(byte)}'`;
    if (byte === 9) return 'Tab';
    if (byte === 10) return 'Line feed';
    if (byte === 13) return 'Carriage return';
    if (byte === 255) return 'High byte (0xFF)';
    return 'Non-printable';
  }

  valueToHex(value) {
    if (Buffer.isBuffer(value)) {
      return Array.from(value.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    }
    if (typeof value === 'number') {
      return '0x' + value.toString(16);
    }
    if (typeof value === 'string') {
      return Buffer.from(value, 'utf8').slice(0, 16).toString('hex').match(/.{2}/g)?.join(' ') || '';
    }
    return '';
  }

  valueToBinary(value) {
    if (typeof value === 'number') {
      return value.toString(2);
    }
    return '';
  }

  analyzeFieldValue(value) {
    const analysis = {
      category: 'unknown',
      characteristics: []
    };
    
    if (typeof value === 'number') {
      analysis.category = 'numeric';
      if (Number.isInteger(value)) {
        analysis.characteristics.push('integer');
      } else {
        analysis.characteristics.push('float');
      }
      if (value < 0) analysis.characteristics.push('negative');
      if (value === 0) analysis.characteristics.push('zero');
      if (value > 0 && value <= 255) analysis.characteristics.push('byte-range');
    }
    
    if (typeof value === 'string') {
      analysis.category = 'text';
      if (value.length === 0) analysis.characteristics.push('empty');
      if (value.length > 100) analysis.characteristics.push('long');
      if (/^\d+$/.test(value)) analysis.characteristics.push('numeric-string');
      if (/^[a-zA-Z]+$/.test(value)) analysis.characteristics.push('alphabetic');
    }
    
    if (Buffer.isBuffer(value)) {
      analysis.category = 'binary';
      if (value.length === 0) analysis.characteristics.push('empty');
      if (this.isPrintableBuffer(value)) analysis.characteristics.push('printable');
      if (this.calculateEntropy(value) > 7) analysis.characteristics.push('high-entropy');
    }
    
    return analysis;
  }

  exportAnalysisData(format = 'json') {
    const data = {
      timestamp: Date.now(),
      binaryAnalysisLog: this.binaryAnalysisLog,
      packetStructureLog: this.packetStructureLog,
      fieldAnalysisLog: this.fieldAnalysisLog,
      hexDumpLog: this.hexDumpLog,
      bitAnalysisLog: this.bitAnalysisLog,
      patternAnalysisLog: this.patternAnalysisLog,
      metrics: this.metrics
    };
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    
    return data;
  }

  exportHexDumpData() {
    return {
      timestamp: Date.now(),
      hexDumps: this.hexDumpLog,
      totalDumps: this.hexDumpLog.length
    };
  }

  exportStructureAnalysisData() {
    return {
      timestamp: Date.now(),
      packetStructures: this.packetStructureLog,
      fieldAnalyses: this.fieldAnalysisLog,
      totalPackets: this.packetStructureLog.length
    };
  }

  extractPacketBinaryAnalysis(rawData, header, payload, decodeId) {
    return {
      decodeId: decodeId,
      totalSize: rawData.length,
      headerSize: header.length,
      payloadSize: payload.length,
      headerHex: this.hexDumpGenerator.generate(rawData.slice(0, header.length)),
      payloadHex: this.hexDumpGenerator.generate(payload.slice(0, Math.min(64, payload.length))),
      fullHex: this.hexDumpGenerator.generate(rawData.slice(0, Math.min(64, rawData.length))),
      entropy: {
        total: this.calculateEntropy(rawData),
        header: this.calculateEntropy(rawData.slice(0, header.length)),
        payload: this.calculateEntropy(payload)
      },
      patterns: this.findBinaryPatterns(rawData),
      structure: this.analyzeBinaryStructure(rawData)
    };
  }

  generateStructureMap(packet) {
    const map = {
      packetType: packet.type,
      totalSize: packet.size,
      header: {
        size: packet.header.length,
        fields: [
          { name: 'magic', offset: 0, size: 2, value: '0xABCD' },
          { name: 'typeId', offset: 2, size: 1, value: packet.header.typeId },
          { name: 'flags', offset: 3, size: 1, value: packet.header.flags },
          { name: 'sequence', offset: 4, size: 4, value: packet.header.sequence },
          { name: 'timestamp', offset: 8, size: 4, value: packet.header.timestamp },
          { name: 'payloadLength', offset: 12, size: 2, value: packet.header.payloadLength }
        ]
      },
      payload: {
        size: packet.size - packet.header.length,
        fieldCount: packet.data.length,
        fields: packet.data.map((value, index) => ({
          index: index,
          type: typeof value,
          size: this.calculateFieldSize(value),
          value: this.sanitizeFieldValue(value)
        }))
      }
    };
    
    return map;
  }

  setReverseEngineeringMode(enabled) {
    this.reverseEngineeringMode = enabled;
    this.logDebug(`Reverse engineering mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  setDetailedBinaryAnalysis(enabled) {
    this.detailedBinaryAnalysis = enabled;
    this.logDebug(`Detailed binary analysis ${enabled ? 'enabled' : 'disabled'}`);
  }

  setHexDumpEnabled(enabled) {
    this.hexDumpEnabled = enabled;
    this.logDebug(`Hex dump generation ${enabled ? 'enabled' : 'disabled'}`);
  }

  setBitLevelAnalysis(enabled) {
    this.bitLevelAnalysis = enabled;
    this.logDebug(`Bit-level analysis ${enabled ? 'enabled' : 'disabled'}`);
  }

  getReverseEngineeringStats() {
    return {
      binaryAnalysisEntries: this.binaryAnalysisLog.length,
      packetStructureEntries: this.packetStructureLog.length,
      fieldAnalysisEntries: this.fieldAnalysisLog.length,
      hexDumpEntries: this.hexDumpLog.length,
      patternAnalysisEntries: this.patternAnalysisLog.length,
      totalAnalysisData: this.binaryAnalysisLog.length + this.packetStructureLog.length + this.fieldAnalysisLog.length
    };
  }

  clearReverseEngineeringData() {
    this.binaryAnalysisLog = [];
    this.packetStructureLog = [];
    this.fieldAnalysisLog = [];
    this.hexDumpLog = [];
    this.bitAnalysisLog = [];
    this.patternAnalysisLog = [];
    this.logDebug('Reverse engineering data cleared');
  }

  getRunLengthEncoding(buffer) {
    const rle = [];
    let currentByte = buffer[0];
    let count = 1;
    
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i] === currentByte) {
        count++;
      } else {
        rle.push({ byte: currentByte, count: count });
        currentByte = buffer[i];
        count = 1;
      }
    }
    
    if (buffer.length > 0) {
      rle.push({ byte: currentByte, count: count });
    }
    
    return rle;
  }

  identifyChunks(buffer) {
    const chunks = [];
    const chunkSize = 16;
    
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      chunks.push({
        offset: i,
        size: chunk.length,
        hex: this.hexDumpGenerator.generate(chunk),
        entropy: this.calculateEntropy(chunk)
      });
    }
    
    return chunks;
  }

  findBitPatterns(buffer) {
    const patterns = [];
    
    // Look for alternating bit patterns
    for (let i = 0; i < buffer.length - 1; i++) {
      const current = buffer[i];
      const next = buffer[i + 1];
      
      // Check for alternating bits (0x55 = 01010101, 0xAA = 10101010)
      if (current === 0x55 && next === 0x55) {
        patterns.push({ type: 'alternating_01', offset: i, pattern: '0x55 0x55' });
      }
      if (current === 0xAA && next === 0xAA) {
        patterns.push({ type: 'alternating_10', offset: i, pattern: '0xAA 0xAA' });
      }
    }
    
    return patterns;
  }

  calculateFieldSize(value) {
    if (Buffer.isBuffer(value)) {
      return value.length;
    }
    if (typeof value === 'string') {
      return Buffer.byteLength(value, 'utf8');
    }
    if (typeof value === 'number') {
      return 4; // Assume 32-bit numbers
    }
    if (typeof value === 'boolean') {
      return 1;
    }
    if (Array.isArray(value)) {
      return value.reduce((total, item) => total + this.calculateFieldSize(item), 0);
    }
    if (typeof value === 'object' && value !== null) {
      return Buffer.byteLength(JSON.stringify(value), 'utf8');
    }
    return 0;
  }

  calculateTotalFieldSize(packetData, packetType) {
    return packetData.reduce((total, field) => total + this.calculateFieldSize(field), 0);
  }

  getFieldDistribution(packetData) {
    const distribution = {
      types: {},
      sizes: [],
      totalFields: packetData.length
    };
    
    for (const field of packetData) {
      const type = typeof field;
      distribution.types[type] = (distribution.types[type] || 0) + 1;
      distribution.sizes.push(this.calculateFieldSize(field));
    }
    
    return distribution;
  }

  getArrayElementType(array) {
    if (array.length === 0) return 'unknown';
    const types = [...new Set(array.map(item => typeof item))];
    return types.length === 1 ? types[0] : 'mixed';
  }

  calculateArrayDepth(array) {
    let maxDepth = 1;
    
    const checkDepth = (arr, depth = 1) => {
      maxDepth = Math.max(maxDepth, depth);
      for (const item of arr) {
        if (Array.isArray(item)) {
          checkDepth(item, depth + 1);
        }
      }
    };
    
    checkDepth(array);
    return maxDepth;
  }

  analyzeCompressionPattern(payload) {
    return {
      size: payload.length,
      entropy: this.calculateEntropy(payload),
      patterns: this.findBinaryPatterns(payload),
      compressionRatio: 'N/A',
      algorithm: 'unknown'
    };
  }

  analyzeEncryptionPattern(payload) {
    return {
      size: payload.length,
      entropy: this.calculateEntropy(payload),
      randomness: this.assessRandomness(payload),
      possibleAlgorithm: 'unknown'
    };
  }

  assessRandomness(buffer) {
    const entropy = this.calculateEntropy(buffer);
    const maxEntropy = 8; // Maximum entropy for random data
    const randomness = entropy / maxEntropy;
    
    return {
      score: randomness,
      entropy: entropy,
      isRandom: randomness > 0.9,
      isStructured: randomness < 0.5
    };
  }

  analyzeStringCharacters(str) {
    const analysis = {
      total: str.length,
      printable: 0,
      control: 0,
      numeric: 0,
      alphabetic: 0,
      whitespace: 0,
      other: 0
    };
    
    for (const char of str) {
      const code = char.charCodeAt(0);
      if (code >= 32 && code <= 126) {
        analysis.printable++;
        if (code >= 48 && code <= 57) analysis.numeric++;
        else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) analysis.alphabetic++;
        else if (code === 32 || code === 9 || code === 10 || code === 13) analysis.whitespace++;
        else analysis.other++;
      } else {
        analysis.control++;
      }
    }
    
    return analysis;
  }

  isPrintableBuffer(buffer) {
    for (const byte of buffer) {
      if (byte < 32 || byte > 126) {
        return false;
      }
    }
    return true;
  }

  sanitizeFieldValue(value) {
    if (value === null || value === undefined) {
      return value;
    }
    
    if (Buffer.isBuffer(value)) {
      if (value.length > 64) {
        return `Buffer(${value.length} bytes): ${this.hexDumpGenerator.generate(value.slice(0, 32))}...`;
      }
      return `Buffer(${value.length} bytes): ${this.hexDumpGenerator.generate(value)}`;
    }
    
    if (typeof value === 'string') {
      if (value.length > 100) {
        return value.substring(0, 97) + '...';
      }
      return value;
    }
    
    if (Array.isArray(value)) {
      if (value.length > 10) {
        return `Array(${value.length} items): [${value.slice(0, 5).map(v => this.sanitizeFieldValue(v)).join(', ')}, ...]`;
      }
      return `Array(${value.length} items): [${value.map(v => this.sanitizeFieldValue(v)).join(', ')}]`;
    }
    
    if (typeof value === 'object' && value !== null) {
      const keys = Object.keys(value);
      if (keys.length > 5) {
        return `Object(${keys.length} keys): {${keys.slice(0, 3).join(', ')}, ...}`;
      }
      return `Object(${keys.length} keys): {${keys.join(', ')}}`;
    }
    
    return value;
  }
}

module.exports = BinaryCodec;
