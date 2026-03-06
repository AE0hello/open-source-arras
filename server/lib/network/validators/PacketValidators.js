/**
 * Packet Validators for Arras.io
 * Comprehensive validation system for network packets
 */

class PacketValidators {
  constructor() {
    this.validators = new Map();
    this.sanitizers = new Map();
    this.customRules = new Map();
    this.registerDefaultValidators();
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
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      sanitizedData: data
    };

    try {
      this.validateStructure(packetType, data, result);

      const validator = this.validators.get(packetType);
      if (validator) {
        validator(data, result);
      }

      const sanitizer = this.sanitizers.get(packetType);
      if (sanitizer) {
        result.sanitizedData = sanitizer(data);
      }

      for (const [ruleName, rule] of this.customRules) {
        rule(packetType, data, result);
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Validation error: ${error.message}`);
    }

    return result;
  }

  validateStructure(packetType, data, result) {
    if (!Array.isArray(data)) {
      result.valid = false;
      result.errors.push("Payload must be array");
      return;
    }

    if (data.length === 0) {
      result.valid = false;
      result.errors.push("Payload cannot be empty");
      return;
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i] === null || data[i] === undefined) {
        result.warnings.push(`Field ${i} is null or undefined`);
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

  containsSuspiciousContent(text) {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /\x00/,
      /[\r\n]/,
      /admin/i,
      /password/i,
      /token/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  containsBannedCharacters(text) {
    const bannedChars = /[<>\"'&\x00-\x1f\x7f-\x9f]/;
    return bannedChars.test(text);
  }

  containsInjectionPatterns(text) {
    const injectionPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,
      /update\s+set/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /system\s*\(/i,
      /\$\(/,
      /`[^`]*`/
    ];

    return injectionPatterns.some(pattern => pattern.test(text));
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
