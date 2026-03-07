class PacketValidators {
  constructor() {
    this.validators = new Map();
    this.sanitizers = new Map();
    this.customRules = new Map();
    this.validationMetrics = {
      totalValidations: 0,
      validationErrors: 0,
      validationWarnings: 0,
      sanitizations: 0,
      customRuleHits: 0
    };
    this.validationHistory = [];
    this.debugMode = false;
    this.strictMode = false;
    
    this.registerDefaultValidators();
    this.initializeAdvancedValidation();
  }

  initializeAdvancedValidation() {
    // Advanced validation patterns and rules
    this.advancedPatterns = {
      // Security patterns
      injectionAttempts: [
        /union\s+select/i,
        /drop\s+table/i,
        /insert\s+into/i,
        /delete\s+from/i,
        /update\s+set/i,
        /exec\s*\(/i,
        /eval\s*\(/i,
        /system\s*\(/i,
        /\$\(/,
        /`[^`]*`/,
        /<script[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i
      ],
      
      // Data quality patterns
      suspiciousPatterns: [
        /\x00/,           // Null bytes
        /[\r\n]{3,}/,     // Excessive line breaks
        /(.)\1{50,}/,      // Repeated characters (50+ times)
        /[\x80-\xFF]{10,}/, // High ASCII sequences
        /\p{C}+/u         // Control characters (Unicode)
      ],
      
      // Performance patterns
      expensiveOperations: [
        /.{1000,}/,        // Very long strings
        /\[[\s\S]{500,}\]/, // Large arrays
        /\{[\s\S]{500,}\}/  // Large objects
      ]
    };
    
    // Validation thresholds
    this.thresholds = {
      maxStringLength: 1000,
      maxArrayLength: 10000,
      maxObjectDepth: 10,
      maxPacketSize: 1048576, // 1MB
      maxValidationTime: 100,   // 100ms
      entropyThreshold: 7.0     // High entropy threshold
    };
  }

  registerValidator(packetType, validator) {
    this.validators.set(packetType, validator);
    return this;
  }

  registerSanitizer(packetType, sanitizer) {
    this.sanitizers.set(packetType, sanitizer);
    return this;
  }

  registerRule(ruleName, rule) {
    this.customRules.set(ruleName, rule);
    return this;
  }

  validate(packetType, data) {
    const validationStart = performance.now();
    const validationId = this.generateValidationId();
    
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      sanitizedData: data,
      metadata: {
        validationId,
        packetType,
        validationTime: 0,
        dataAnalysis: this.analyzeDataStructure(data),
        securityFlags: [],
        performanceFlags: [],
        qualityFlags: []
      }
    };

    try {
      this.validationMetrics.totalValidations++;
      
      this.logDebug(`[VALIDATION:${validationId}] Starting validation`, {
        packetType,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataSize: this.calculateDataSize(data),
        strictMode: this.strictMode
      });

      // Basic structure validation
      this.validateStructure(packetType, data, result);
      
      // Deep data analysis
      this.performDeepAnalysis(data, result);
      
      // Security validation
      this.performSecurityValidation(data, result);
      
      // Performance validation
      this.performPerformanceValidation(data, result);
      
      // Quality validation
      this.performQualityValidation(data, result);

      // Type-specific validator
      const validator = this.validators.get(packetType);
      if (validator) {
        this.logDebug(`[VALIDATION:${validationId}] Applying type-specific validator`, {
          validator: validator.name || 'anonymous'
        });
        validator(data, result);
      }

      // Custom rules
      for (const [ruleName, rule] of this.customRules) {
        this.logDebug(`[VALIDATION:${validationId}] Applying custom rule: ${ruleName}`);
        rule(packetType, data, result);
        this.validationMetrics.customRuleHits++;
      }

      // Sanitization
      const sanitizer = this.sanitizers.get(packetType);
      if (sanitizer) {
        this.logDebug(`[VALIDATION:${validationId}] Applying sanitizer`);
        result.sanitizedData = sanitizer(data);
        this.validationMetrics.sanitizations++;
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Validation error: ${error.message}`);
      this.validationMetrics.validationErrors++;
      
      this.logError(`[VALIDATION:${validationId}] Validation exception`, {
        error: error.message,
        stack: error.stack,
        packetType
      });
    } finally {
      const validationTime = performance.now() - validationStart;
      result.metadata.validationTime = validationTime;
      
      // Record validation history
      this.recordValidationHistory(packetType, result, validationTime);
      
      if (validationTime > this.thresholds.maxValidationTime) {
        result.warnings.push(`Validation took ${validationTime.toFixed(2)}ms (threshold: ${this.thresholds.maxValidationTime}ms)`);
        result.metadata.performanceFlags.push('slow_validation');
      }
      
      this.logDebug(`[VALIDATION:${validationId}] Validation completed`, {
        valid: result.valid,
        errorCount: result.errors.length,
        warningCount: result.warnings.length,
        validationTime: validationTime.toFixed(2) + 'ms',
        securityFlags: result.metadata.securityFlags,
        performanceFlags: result.metadata.performanceFlags,
        qualityFlags: result.metadata.qualityFlags
      });
    }

    return result;
  }

  // Deep analysis methods
  
  performDeepAnalysis(data, result) {
    const analysis = result.metadata.dataAnalysis;
    
    // Analyze data structure
    this.analyzeDataStructure(data, analysis);
    
    // Calculate entropy for strings
    if (typeof data === 'string') {
      analysis.entropy = this.calculateStringEntropy(data);
    }
    
    // Analyze array patterns
    if (Array.isArray(data)) {
      analysis.arrayPatterns = this.analyzeArrayPatterns(data);
    }
    
    // Analyze object patterns
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      analysis.objectPatterns = this.analyzeObjectPatterns(data);
    }
  }
  
  performSecurityValidation(data, result) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Check for injection attempts
    for (const pattern of this.advancedPatterns.injectionAttempts) {
      if (pattern.test(dataString)) {
        result.metadata.securityFlags.push('injection_attempt');
        result.warnings.push(`Potential injection attempt detected: ${pattern.source}`);
        
        if (this.strictMode) {
          result.valid = false;
          result.errors.push(`Security violation: ${pattern.source}`);
        }
      }
    }
    
    // Check for suspicious patterns
    for (const pattern of this.advancedPatterns.suspiciousPatterns) {
      if (pattern.test(dataString)) {
        result.metadata.securityFlags.push('suspicious_pattern');
        result.warnings.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }
    
    // Check for encoded payloads
    if (this.detectEncodedPayload(dataString)) {
      result.metadata.securityFlags.push('encoded_payload');
      result.warnings.push('Potential encoded payload detected');
    }
  }
  
  performPerformanceValidation(data, result) {
    const dataSize = this.calculateDataSize(data);
    
    // Check data size limits
    if (dataSize > this.thresholds.maxPacketSize) {
      result.metadata.performanceFlags.push('oversized_data');
      result.warnings.push(`Data size ${dataSize} exceeds threshold ${this.thresholds.maxPacketSize}`);
      
      if (this.strictMode) {
        result.valid = false;
        result.errors.push(`Data too large: ${dataSize} bytes`);
      }
    }
    
    // Check for expensive operations
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    for (const pattern of this.advancedPatterns.expensiveOperations) {
      if (pattern.test(dataString)) {
        result.metadata.performanceFlags.push('expensive_operation');
        result.warnings.push(`Expensive operation pattern detected: ${pattern.source}`);
      }
    }
    
    // Check array length
    if (Array.isArray(data) && data.length > this.thresholds.maxArrayLength) {
      result.metadata.performanceFlags.push('large_array');
      result.warnings.push(`Array length ${data.length} exceeds threshold ${this.thresholds.maxArrayLength}`);
    }
  }
  
  performQualityValidation(data, result) {
    // Check for null/undefined values
    const nullCheck = this.checkNullValues(data);
    if (nullCheck.hasNulls) {
      result.metadata.qualityFlags.push('contains_null');
      result.warnings.push(`Data contains ${nullCheck.nullCount} null/undefined values`);
    }
    
    // Check for empty values
    const emptyCheck = this.checkEmptyValues(data);
    if (emptyCheck.hasEmpty) {
      result.metadata.qualityFlags.push('contains_empty');
      result.warnings.push(`Data contains ${emptyCheck.emptyCount} empty values`);
    }
    
    // Check data consistency
    if (Array.isArray(data)) {
      const consistency = this.checkArrayConsistency(data);
      if (!consistency.isConsistent) {
        result.metadata.qualityFlags.push('inconsistent_types');
        result.warnings.push(`Array contains inconsistent types: ${consistency.types.join(', ')}`);
      }
    }
    
    // Check for duplicate values
    if (Array.isArray(data)) {
      const duplicates = this.findDuplicates(data);
      if (duplicates.length > 0) {
        result.metadata.qualityFlags.push('contains_duplicates');
        result.warnings.push(`Array contains ${duplicates.length} duplicate values`);
      }
    }
  }

  registerDefaultValidators() {
    this.registerValidator("MOVEMENT", (data, result) => {
      const [posX, posY, heading, moment] = data;

      if (typeof posX !== "number" || !isFinite(posX)) {
        result.valid = false;
        result.errors.push("Invalid x coordinate");
      }

      if (typeof posY !== "number" || !isFinite(posY)) {
        result.valid = false;
        result.errors.push("Invalid y coordinate");
      }

      if (typeof heading !== "number" || !isFinite(heading)) {
        result.valid = false;
        result.errors.push("Invalid angle");
      }

      if (typeof moment !== "number" || moment <= 0) {
        result.valid = false;
        result.errors.push("Invalid timestamp");
      }

      if (Math.abs(posX) > 100000 || Math.abs(posY) > 100000) {
        result.warnings.push("Coordinates seem unusually large");
      }

      const now = Date.now();
      if (Math.abs(now - moment) > 30000) {
        result.warnings.push("Timestamp is old or in the future");
      }
    });

    this.registerValidator("ACTION", (data, result) => {
      const [actions, moment] = data;

      if (typeof actions !== "number" || actions < 0 || actions > 255) {
        result.valid = false;
        result.errors.push("Invalid actions bitmask");
      }

      if (typeof moment !== "number" || moment <= 0) {
        result.valid = false;
        result.errors.push("Invalid timestamp");
      }
    });

    this.registerValidator("MESSAGE", (data, result) => {
      const [text, recipient, moment] = data;

      if (typeof text !== "string") {
        result.valid = false;
        result.errors.push("Message must be a string");
      } else {
        if (text.length === 0) {
          result.valid = false;
          result.errors.push("Message cannot be empty");
        }

        if (text.length > 200) {
          result.valid = false;
          result.errors.push("Message too long (max 200 characters)");
        }

        if (this.containsSuspiciousContent(text)) {
          result.warnings.push("Message contains potentially suspicious content");
        }
      }

      if (recipient !== undefined && typeof recipient !== "string") {
        result.valid = false;
        result.errors.push("Target must be a string");
      }

      if (typeof moment !== "number" || moment <= 0) {
        result.valid = false;
        result.errors.push("Invalid timestamp");
      }
    });

    this.registerValidator("ENTER_GAME", (data, result) => {
      const [alias, vehicle, faction] = data;

      if (typeof alias !== "string") {
        result.valid = false;
        result.errors.push("Name must be a string");
      } else {
        if (alias.length === 0) {
          result.valid = false;
          result.errors.push("Name cannot be empty");
        }

        if (alias.length > 48) {
          result.valid = false;
          result.errors.push("Name too long (max 48 characters)");
        }

        if (this.containsBannedCharacters(alias)) {
          result.valid = false;
          result.errors.push("Name contains banned characters");
        }
      }

      if (vehicle !== undefined && typeof vehicle !== "string") {
        result.valid = false;
        result.errors.push("Tank class must be a string");
      }

      if (faction !== undefined && (typeof faction !== "number" || faction < -100 || faction > 100)) {
        result.valid = false;
        result.errors.push("Invalid team value");
      }
    });

    this.registerValidator("EVOLVE", (data, result) => {
      const [path, branch] = data;

      if (typeof path !== "number" || path < 0 || path > 1000) {
        result.valid = false;
        result.errors.push("Invalid upgrade class");
      }

      if (typeof branch !== "number" || branch < 0 || branch > 10) {
        result.valid = false;
        result.errors.push("Invalid branch");
      }
    });

    this.registerValidator("ENHANCE", (data, result) => {
      const [attribute, magnitude] = data;

      const validSkills = ["atk", "hlt", "spd", "str", "pen", "dam", "rld", "mob", "rgn", "shi"];
      if (typeof attribute !== "string" || !validSkills.includes(attribute)) {
        result.valid = false;
        result.errors.push("Invalid skill type");
      }

      if (typeof magnitude !== "number" || magnitude < 0 || magnitude > 10) {
        result.valid = false;
        result.errors.push("Invalid skill upgrade amount");
      }
    });

    this.registerValidator("ENTITY_STATE", (data, result) => {
      const [entityId, position, health, shield, moment] = data;

      if (typeof entityId !== "number" || entityId <= 0) {
        result.valid = false;
        result.errors.push("Invalid entity ID");
      }

      if (position !== undefined) {
        if (!position || typeof position.x !== "number" || typeof position.y !== "number") {
          result.valid = false;
          result.errors.push("Invalid position data");
        }
      }

      if (health !== undefined && (typeof health !== "number" || health < 0)) {
        result.valid = false;
        result.errors.push("Invalid health value");
      }

      if (shield !== undefined && (typeof shield !== "number" || shield < 0)) {
        result.valid = false;
        result.errors.push("Invalid shield value");
      }

      if (typeof moment !== "number" || moment <= 0) {
        result.valid = false;
        result.errors.push("Invalid timestamp");
      }
    });

    this.registerSanitizer("MESSAGE", (data) => {
      const [message, target, timestamp] = data;

      const sanitizedMessage = this.sanitizeMessage(message);

      return [sanitizedMessage, target, timestamp];
    });

    this.registerSanitizer("ENTER_GAME", (data) => {
      const [name, tankClass, team] = data;

      const sanitizedName = this.sanitizeName(name);

      return [sanitizedName, tankClass, team];
    });

    this.registerRule("rateLimitCheck", (packetType, data, result) => {
      const highFrequencyPackets = ["MOVEMENT", "ACTION"];
      if (highFrequencyPackets.includes(packetType)) {
        result.warnings.push("High-frequency packet detected");
      }
    });

    this.registerRule("securityCheck", (packetType, data, result) => {
      if (data.length > 100) {
        result.warnings.push("Packet has unusually large number of fields");
      }

      for (let i = 0; i < data.length; i++) {
        if (typeof data[i] === "string" && this.containsInjectionPatterns(data[i])) {
          result.valid = false;
          result.errors.push(`Potential injection attempt in field ${i}`);
        }
      }
    });
  }

  // Utility methods for deep analysis
  
  generateValidationId() {
    return 'VAL_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  analyzeDataStructure(data, target = null) {
    const analysis = target || {};
    
    analysis.type = Array.isArray(data) ? 'array' : typeof data;
    analysis.size = this.calculateDataSize(data);
    analysis.depth = this.calculateDepth(data);
    
    if (Array.isArray(data)) {
      analysis.length = data.length;
      analysis.elementTypes = this.getElementTypes(data);
    }
    
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      analysis.propertyCount = Object.keys(data).length;
      analysis.propertyTypes = this.getPropertyTypes(data);
    }
    
    if (typeof data === 'string') {
      analysis.length = data.length;
      analysis.characterTypes = this.getCharacterTypes(data);
    }
    
    return analysis;
  }
  
  calculateDataSize(data) {
    if (data === null || data === undefined) return 0;
    if (typeof data === 'string') return Buffer.byteLength(data, 'utf8');
    if (typeof data === 'number') return 8;
    if (typeof data === 'boolean') return 1;
    if (Buffer.isBuffer(data)) return data.length;
    if (Array.isArray(data)) return data.reduce((sum, item) => sum + this.calculateDataSize(item), 0);
    if (typeof data === 'object') return Buffer.byteLength(JSON.stringify(data), 'utf8');
    return 0;
  }
  
  calculateDepth(data, currentDepth = 0) {
    if (currentDepth > this.thresholds.maxObjectDepth) return currentDepth;
    if (Array.isArray(data)) {
      return Math.max(...data.map(item => this.calculateDepth(item, currentDepth + 1)));
    }
    if (typeof data === 'object' && data !== null) {
      return Math.max(...Object.values(data).map(value => this.calculateDepth(value, currentDepth + 1)));
    }
    return currentDepth;
  }
  
  getElementTypes(array) {
    const types = new Set();
    for (const item of array) {
      types.add(Array.isArray(item) ? 'array' : typeof item);
    }
    return Array.from(types);
  }
  
  getPropertyTypes(obj) {
    const types = {};
    for (const [key, value] of Object.entries(obj)) {
      types[key] = Array.isArray(value) ? 'array' : typeof value;
    }
    return types;
  }
  
  getCharacterTypes(str) {
    const types = {
      ascii: 0,
      unicode: 0,
      whitespace: 0,
      control: 0,
      printable: 0
    };
    
    for (const char of str) {
      const code = char.charCodeAt(0);
      
      if (code < 128) types.ascii++;
      else types.unicode++;
      
      if (code === 9 || code === 10 || code === 13) types.whitespace++;
      else if (code < 32 || code === 127) types.control++;
      else if (code >= 32 && code <= 126) types.printable++;
    }
    
    return types;
  }
  
  calculateStringEntropy(str) {
    if (!str || str.length === 0) return 0;
    
    const frequency = new Map();
    for (const char of str) {
      frequency.set(char, (frequency.get(char) || 0) + 1);
    }
    
    let entropy = 0;
    const len = str.length;
    for (const count of frequency.values()) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    
    return Math.round(entropy * 1000) / 1000;
  }
  
  analyzeArrayPatterns(array) {
    const patterns = {
      monotonicIncreasing: true,
      monotonicDecreasing: true,
      hasDuplicates: false,
      duplicateCount: 0,
      uniqueCount: 0,
      nullCount: 0,
      undefinedCount: 0
    };
    
    const seen = new Set();
    let lastValue = null;
    
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      
      if (value === null) patterns.nullCount++;
      if (value === undefined) patterns.undefinedCount++;
      
      if (seen.has(value)) {
        patterns.hasDuplicates = true;
        patterns.duplicateCount++;
      } else {
        seen.add(value);
        patterns.uniqueCount++;
      }
      
      if (lastValue !== null) {
        if (value > lastValue) patterns.monotonicDecreasing = false;
        if (value < lastValue) patterns.monotonicIncreasing = false;
      }
      
      lastValue = value;
    }
    
    return patterns;
  }
  
  analyzeObjectPatterns(obj) {
    const patterns = {
      propertyCount: Object.keys(obj).length,
      nullProperties: 0,
      undefinedProperties: 0,
      nestedObjects: 0,
      arrays: 0,
      functions: 0,
      maxDepth: 0
    };
    
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) patterns.nullProperties++;
      if (value === undefined) patterns.undefinedProperties++;
      if (Array.isArray(value)) patterns.arrays++;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        patterns.nestedObjects++;
        patterns.maxDepth = Math.max(patterns.maxDepth, this.calculateDepth(value));
      }
      if (typeof value === 'function') patterns.functions++;
    }
    
    return patterns;
  }
  
  detectEncodedPayload(dataString) {
    // Check for common encoding patterns
    const encodingPatterns = [
      /%[0-9A-Fa-f]{2}/g,           // URL encoding
      /\s*=[\s\r\n]*/g,           // Base64 padding
      /^[A-Za-z0-9+/]+={0,2}$/g,      // Base64 pattern
      /\\x[0-9A-Fa-f]{2}/g,          // Hex encoding
      /\\u[0-9A-Fa-f]{4}/g,          // Unicode escape
      /\\[0-7]{1,3}/g                // Octal escape
    ];
    
    let encodingScore = 0;
    for (const pattern of encodingPatterns) {
      if (pattern.test(dataString)) {
        encodingScore++;
      }
    }
    
    return encodingScore >= 2; // Multiple encoding patterns detected
  }
  
  checkNullValues(data) {
    const result = { hasNulls: false, nullCount: 0 };
    
    const check = (value) => {
      if (value === null || value === undefined) {
        result.hasNulls = true;
        result.nullCount++;
      } else if (Array.isArray(value)) {
        value.forEach(check);
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(check);
      }
    };
    
    check(data);
    return result;
  }
  
  checkEmptyValues(data) {
    const result = { hasEmpty: false, emptyCount: 0 };
    
    const check = (value) => {
      if (value === '' || value === 0 || (Array.isArray(value) && value.length === 0)) {
        result.hasEmpty = true;
        result.emptyCount++;
      } else if (Array.isArray(value)) {
        value.forEach(check);
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(check);
      }
    };
    
    check(data);
    return result;
  }
  
  checkArrayConsistency(array) {
    const types = new Set();
    
    for (const item of array) {
      if (item !== null && item !== undefined) {
        types.add(Array.isArray(item) ? 'array' : typeof item);
      }
    }
    
    return {
      isConsistent: types.size <= 1,
      types: Array.from(types)
    };
  }
  
  findDuplicates(array) {
    const seen = new Map();
    const duplicates = [];
    
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      if (value !== null && value !== undefined) {
        if (seen.has(value)) {
          if (!duplicates.includes(value)) {
            duplicates.push(value);
          }
        } else {
          seen.set(value, i);
        }
      }
    }
    
    return duplicates;
  }
  
  recordValidationHistory(packetType, result, validationTime) {
    const entry = {
      timestamp: Date.now(),
      packetType,
      valid: result.valid,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      validationTime,
      securityFlags: result.metadata.securityFlags,
      performanceFlags: result.metadata.performanceFlags,
      qualityFlags: result.metadata.qualityFlags
    };
    
    this.validationHistory.push(entry);
    
    // Keep only last 1000 validation records
    if (this.validationHistory.length > 1000) {
      this.validationHistory = this.validationHistory.slice(-1000);
    }
  }
  
  logDebug(message, data = {}) {
    if (this.debugMode) {
      console.log(`[PacketValidators] ${message}`, data);
    }
  }
  
  logError(message, data = {}) {
    console.error(`[PacketValidators] ${message}`, data);
  }

  sanitizeMessage(message) {
    return message
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/&/g, "&amp;")
      .replace(/[\r\n]/g, " ")
      .trim();
  }

  sanitizeName(name) {
    return name
      .replace(/[<>\"'&\x00-\x1f\x7f-\x9f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Enhanced getter methods with detailed insights
  
  getMetrics() {
    return {
      ...this.validationMetrics,
      averageValidationTime: this.calculateAverageValidationTime(),
      errorRate: this.validationMetrics.totalValidations > 0 ? 
        (this.validationMetrics.validationErrors / this.validationMetrics.totalValidations) * 100 : 0,
      warningRate: this.validationMetrics.totalValidations > 0 ? 
        (this.validationMetrics.validationWarnings / this.validationMetrics.totalValidations) * 100 : 0
    };
  }
  
  getValidationHistory(limit = 100) {
    return this.validationHistory.slice(-limit);
  }
  
  getSecurityReport() {
    const recent = this.validationHistory.slice(-100);
    const securityIssues = recent.filter(entry => 
      entry.securityFlags && entry.securityFlags.length > 0
    );
    
    const flagCounts = {};
    for (const entry of securityIssues) {
      for (const flag of entry.securityFlags) {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1;
      }
    }
    
    return {
      totalSecurityIssues: securityIssues.length,
      issueRate: (securityIssues.length / recent.length) * 100,
      flagCounts,
      recentIssues: securityIssues.slice(-10)
    };
  }
  
  getPerformanceReport() {
    const recent = this.validationHistory.slice(-100);
    const performanceIssues = recent.filter(entry => 
      entry.performanceFlags && entry.performanceFlags.length > 0
    );
    
    const avgTime = this.calculateAverageValidationTime();
    const slowValidations = recent.filter(entry => entry.validationTime > this.thresholds.maxValidationTime);
    
    return {
      averageValidationTime: avgTime,
      slowValidations: slowValidations.length,
      slowValidationRate: (slowValidations.length / recent.length) * 100,
      performanceIssues: performanceIssues.length,
      threshold: this.thresholds.maxValidationTime
    };
  }
  
  calculateAverageValidationTime() {
    if (this.validationHistory.length === 0) return 0;
    
    const totalTime = this.validationHistory.reduce((sum, entry) => sum + entry.validationTime, 0);
    return totalTime / this.validationHistory.length;
  }
  
  // Configuration methods
  
  setDebugMode(enabled) {
    this.debugMode = enabled;
    this.logDebug(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  setStrictMode(enabled) {
    this.strictMode = enabled;
    this.logDebug(`Strict mode ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    this.logDebug('Thresholds updated', { thresholds: this.thresholds });
  }
  
  // Cleanup and maintenance methods
  
  clearHistory() {
    this.validationHistory = [];
    this.logDebug('Validation history cleared');
  }
  
  resetMetrics() {
    this.validationMetrics = {
      totalValidations: 0,
      validationErrors: 0,
      validationWarnings: 0,
      sanitizations: 0,
      customRuleHits: 0
    };
    this.logDebug('Validation metrics reset');
  }
  
  exportConfiguration() {
    return {
      thresholds: this.thresholds,
      debugMode: this.debugMode,
      strictMode: this.strictMode,
      validators: Array.from(this.validators.keys()),
      sanitizers: Array.from(this.sanitizers.keys()),
      customRules: Array.from(this.customRules.keys())
    };
  }

  getValidators() {
    return new Map(this.validators);
  }

  getSanitizers() {
    return new Map(this.sanitizers);
  }

  getCustomRules() {
    return new Map(this.customRules);
  }
}

module.exports = PacketValidators;
