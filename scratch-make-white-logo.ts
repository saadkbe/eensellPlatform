import fs from 'fs';
import zlib from 'zlib';

function invertPngToWhite(inputPath: string, outputPath: string) {
  const buffer = fs.readFileSync(inputPath);
  
  let pos = 8; // skip signature
  let width = 0;
  let height = 0;
  let idatChunks: Buffer[] = [];
  const otherChunks: { type: string; data: Buffer }[] = [];

  while (pos < buffer.length) {
    const length = buffer.readUInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    const data = buffer.slice(pos + 8, pos + 8 + length);
    const crc = buffer.readUInt32BE(pos + 8 + length);
    pos += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      otherChunks.push({ type, data });
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else {
      otherChunks.push({ type, data });
    }
  }

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // Each scanline has 1 filter byte + width * 4 bytes (for RGBA)
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;

  for (let y = 0; y < height; y++) {
    const lineStart = y * scanlineLength;
    // scanline filter byte is at lineStart, pixel data starts at lineStart + 1
    for (let x = 0; x < width; x++) {
      const px = lineStart + 1 + x * bytesPerPixel;
      const alpha = decompressed[px + 3];
      if (alpha > 0) {
        // Set RGB to 255 (pure white) keeping original alpha intact!
        decompressed[px] = 255;
        decompressed[px + 1] = 255;
        decompressed[px + 2] = 255;
      }
    }
  }

  const newCompressed = zlib.deflateSync(decompressed);

  // Helper to calculate CRC32
  function makeCrcTable() {
    let c: number;
    const table: number[] = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c;
    }
    return table;
  }
  const crcTable = makeCrcTable();
  function crc32(buf: Buffer) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(typeStr: string, chunkData: Buffer) {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(chunkData.length, 0);
    const typeBuf = Buffer.from(typeStr, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, chunkData]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([lenBuf, typeBuf, chunkData, crcBuf]);
  }

  const outParts = [buffer.slice(0, 8)]; // signature
  for (const chunk of otherChunks) {
    if (chunk.type === 'IEND') {
      // Put IDAT before IEND
      outParts.push(makeChunk('IDAT', newCompressed));
    }
    outParts.push(makeChunk(chunk.type, chunk.data));
  }

  const finalPng = Buffer.concat(outParts);
  fs.writeFileSync(outputPath, finalPng);
  console.log(`Created pure white logo at ${outputPath} (size: ${finalPng.length} bytes, ${width}x${height})`);
}

invertPngToWhite('public/logo2-cropped.png', 'public/eensell-university-white.png');
