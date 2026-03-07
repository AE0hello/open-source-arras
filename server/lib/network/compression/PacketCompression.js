class PacketCompression {
  constructor(options = {}) {
    this.options = {
      algorithm: options.algorithm || "lz4",
      level: options.level || 6,
      threshold: options.threshold || 100,
      enabled: options.enabled !== false,
      ...options
    };

    this.compressionStats = {
      packetsCompressed: 0,
      packetsDecompressed: 0,
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      compressionTime: 0,
      decompressionTime: 0
    };

    this.initializeCompression();
  }

  initializeCompression() {
    try {
      this.zlib = require("zlib");
      this.lz4 = require("lz4");
    } catch {
      console.warn("Compression libraries not available, using fallback");
      this.zlib = null;
      this.lz4 = null;
    }
  }

  compress(data, algorithm = null) {
    if (!this.options.enabled || data.length < this.options.threshold) {
      return data;
    }

    const startTime = performance.now();
    const algo = algorithm || this.options.algorithm;

    try {
      let compressed;

      switch (algo) {
        case "gzip":
          compressed = this.compressGzip(data);
          break;
        case "deflate":
          compressed = this.compressDeflate(data);
          break;
        case "brotli":
          compressed = this.compressBrotli(data);
          break;
        case "lz4":
          compressed = this.compressLZ4(data);
          break;
        case "custom":
          compressed = this.compressCustom(data);
          break;
        default:
          compressed = this.compressDefault(data);
      }

      this.updateCompressionStats(data.length, compressed.length, performance.now() - startTime);

      if (compressed.length >= data.length) {
        return data;
      }

      return this.addCompressionHeader(compressed, algo);

    } catch (error) {
      console.error("Compression failed:", error);
      return data;
    }
  }

  decompress(data) {
    const startTime = performance.now();

    try {
      if (!this.isCompressed(data)) {
        return data;
      }

      const { algorithm, compressedData } = this.removeCompressionHeader(data);

      let decompressed;

      switch (algorithm) {
        case "gzip":
          decompressed = this.decompressGzip(compressedData);
          break;
        case "deflate":
          decompressed = this.decompressDeflate(compressedData);
          break;
        case "brotli":
          decompressed = this.decompressBrotli(compressedData);
          break;
        case "lz4":
          decompressed = this.decompressLZ4(compressedData);
          break;
        case "custom":
          decompressed = this.decompressCustom(compressedData);
          break;
        default:
          decompressed = this.decompressDefault(compressedData);
      }

      this.updateDecompressionStats(compressedData.length, decompressed.length, performance.now() - startTime);

      return decompressed;

    } catch (error) {
      console.error("Decompression failed:", error);
      return data;
    }
  }

  compressGzip(data) {
    if (!this.zlib) {
      throw new Error("Zlib not available");
    }
    return this.zlib.gzipSync(data, { level: this.options.level });
  }

  decompressGzip(data) {
    if (!this.zlib) {
      throw new Error("Zlib not available");
    }
    return this.zlib.gunzipSync(data);
  }

  compressDeflate(data) {
    if (!this.zlib) {
      throw new Error("Zlib not available");
    }
    return this.zlib.deflateSync(data, { level: this.options.level });
  }

  decompressDeflate(data) {
    if (!this.zlib) {
      throw new Error("Zlib not available");
    }
    return this.zlib.inflateSync(data);
  }

  compressBrotli(data) {
    if (!this.zlib || !this.zlib.brotliCompressSync) {
      throw new Error("Brotli not available");
    }
    return this.zlib.brotliCompressSync(data, {
      params: {
        [this.zlib.constants.BROTLI_PARAM_QUALITY]: this.options.level
      }
    });
  }

  decompressBrotli(data) {
    if (!this.zlib || !this.zlib.brotliDecompressSync) {
      throw new Error("Brotli not available");
    }
    return this.zlib.brotliDecompressSync(data);
  }

  compressLZ4(data) {
    if (!this.lz4) {
      throw new Error("LZ4 not available");
    }
    return this.lz4.encode(data);
  }

  decompressLZ4(data) {
    if (!this.lz4) {
      throw new Error("LZ4 not available");
    }
    return this.lz4.decode(data);
  }

  compressCustom(data) {
    const compressed = [];
    let i = 0;

    while (i < data.length) {
      let repeatCount = 1;
      while (i + repeatCount < data.length &&
                   data[i + repeatCount] === data[i] &&
                   repeatCount < 255) {
        repeatCount++;
      }

      if (repeatCount > 3) {
        compressed.push(0xFF);
        compressed.push(data[i]);
        compressed.push(repeatCount);
        i += repeatCount;
      } else {
        compressed.push(data[i]);
        i++;
      }
    }

    return Buffer.from(compressed);
  }

  decompressCustom(data) {
    const decompressed = [];
    let i = 0;

    while (i < data.length) {
      if (data[i] === 0xFF && i + 2 < data.length) {
        const byte = data[i + 1];
        const count = data[i + 2];

        for (let j = 0; j < count; j++) {
          decompressed.push(byte);
        }

        i += 3;
      } else {
        decompressed.push(data[i]);
        i++;
      }
    }

    return Buffer.from(decompressed);
  }

  compressDefault(data) {
    return this.compressCustom(data);
  }

  decompressDefault(data) {
    return this.decompressCustom(data);
  }

  addCompressionHeader(data, algorithm) {
    const algorithmCode = this.getAlgorithmCode(algorithm);
    const header = Buffer.alloc(4);

    header.writeUInt8(0x42, 0);
    header.writeUInt8(0x43, 1);
    header.writeUInt8(algorithmCode, 2);
    header.writeUInt8(this.options.level, 3);

    return Buffer.concat([header, data]);
  }

  removeCompressionHeader(data) {
    if (data.length < 4) {
      throw new Error("Invalid compression header");
    }

    const magic1 = data.readUInt8(0);
    const magic2 = data.readUInt8(1);

    if (magic1 !== 0x42 || magic2 !== 0x43) {
      throw new Error("Invalid compression magic bytes");
    }

    const algorithmCode = data.readUInt8(2);
    const level = data.readUInt8(3);
    const algorithm = this.getAlgorithmFromCode(algorithmCode);
    const compressedData = data.slice(4);

    return { algorithm, compressedData, level };
  }

  isCompressed(data) {
    return data.length >= 4 &&
               data.readUInt8(0) === 0x42 &&
               data.readUInt8(1) === 0x43;
  }

  getAlgorithmCode(algorithm) {
    const codes = {
      "gzip": 1,
      "deflate": 2,
      "brotli": 3,
      "lz4": 4,
      "custom": 5
    };
    return codes[algorithm] || 0;
  }

  getAlgorithmFromCode(code) {
    const algorithms = {
      1: "gzip",
      2: "deflate",
      3: "brotli",
      4: "lz4",
      5: "custom"
    };
    return algorithms[code] || "default";
  }

  updateCompressionStats(originalSize, compressedSize, time) {
    this.compressionStats.packetsCompressed++;
    this.compressionStats.originalSize += originalSize;
    this.compressionStats.compressedSize += compressedSize;
    this.compressionStats.compressionTime += time;

    const totalRatio = this.compressionStats.originalSize / this.compressionStats.compressedSize;
    this.compressionStats.compressionRatio = (this.compressionStats.compressionRatio + totalRatio) / 2;
  }

  updateDecompressionStats(compressedSize, decompressedSize, time) {
    this.compressionStats.packetsDecompressed++;
    this.compressionStats.compressionTime += time;
  }

  getStats() {
    return { ...this.compressionStats };
  }

  resetStats() {
    this.compressionStats = {
      packetsCompressed: 0,
      packetsDecompressed: 0,
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      compressionTime: 0,
      decompressionTime: 0
    };
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  getAvailableAlgorithms() {
    const algorithms = ["custom", "default"];

    if (this.zlib) {
      algorithms.push("gzip", "deflate");
      if (this.zlib.brotliCompressSync) {
        algorithms.push("brotli");
      }
    }

    if (this.lz4) {
      algorithms.push("lz4");
    }

    return algorithms;
  }
}

module.exports = PacketCompression;
