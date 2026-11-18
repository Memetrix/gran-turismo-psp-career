importScripts('patch-config.js?v=20261118-1', 'vendor/rompatcher/BinFile.js',
  'vendor/rompatcher/HashCalculator.js', 'vendor/rompatcher/RomPatcher.format.vcdiff.js');

const CHUNK_BYTES = 4 * 1024 * 1024;
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let value = i;
  for (let j = 0; j < 8; j++) value = value & 1 ? (value >>> 1) ^ 0xEDB88320 : value >>> 1;
  CRC_TABLE[i] = value >>> 0;
}

// VCDIFF's validation hook predates the upstream HashCalculator namespace.
function adler32(file, offset, length) {
  return HashCalculator.adler32(file._u8array.buffer, offset, length);
}

function update(message, percent) {
  self.postMessage({ type: 'progress', message, percent });
}

function crcBytes(bytes, previous) {
  let crc = previous;
  for (let i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 255];
  return crc;
}

function crcHex(crc) {
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

async function fileCrc(file) {
  let crc = 0xFFFFFFFF;
  let last = -1;
  for (let offset = 0; offset < file.size; offset += CHUNK_BYTES) {
    const bytes = new Uint8Array(await file.slice(offset, offset + CHUNK_BYTES).arrayBuffer());
    crc = crcBytes(bytes, crc);
    const percent = Math.round(Math.min(file.size, offset + bytes.length) * 100 / file.size);
    if (percent !== last) update('Checking your ISO… ' + percent + '%', percent);
    last = percent;
  }
  return crcHex(crc);
}

function outputCrc(bytes) {
  let crc = 0xFFFFFFFF;
  let last = -1;
  for (let offset = 0; offset < bytes.length; offset += CHUNK_BYTES) {
    crc = crcBytes(bytes.subarray(offset, offset + CHUNK_BYTES), crc);
    const percent = Math.round(Math.min(bytes.length, offset + CHUNK_BYTES) * 100 / bytes.length);
    if (percent !== last) update('Checking the finished ISO… ' + percent + '%', percent);
    last = percent;
  }
  return crcHex(crc);
}

// The release whose original (inputBytes) or finished ISO (outputBytes) has this size; sizes are unique per region.
function patchForSize(size) {
  return CAREER_PATCHES.find(patch => patch.inputBytes === size || patch.outputBytes === size) || null;
}

async function loadPatch(CAREER_PATCH) {
  update('Downloading the career patch…', 0);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180000);
  try {
    const response = await fetch(CAREER_PATCH.patchPath, { signal: controller.signal });
    if (!response.ok) throw new Error('Could not download the career patch. Check your connection and try again.');
    // Pin both release size and SHA-256 before decoding any downloaded bytes.
    const bytes = new Uint8Array(CAREER_PATCH.patchBytes);
    if (response.body) {
      const reader = response.body.getReader();
      let offset = 0;
      let last = -1;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (offset + value.length > bytes.length) throw new Error('The patch download was not valid. Please try again.');
        bytes.set(value, offset);
        offset += value.length;
        const percent = Math.floor(offset * 100 / bytes.length);
        if (percent !== last) update('Downloading the career patch… ' + percent + '%', percent);
        last = percent;
      }
      if (offset !== bytes.length) throw new Error('The patch download was incomplete. Please try again.');
    } else {
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength !== bytes.length) throw new Error('The patch download was incomplete. Please try again.');
      bytes.set(new Uint8Array(buffer));
    }
    update('Checking the patch download…');
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    const hex = Array.from(hash, value => value.toString(16).padStart(2, '0')).join('');
    if (hex !== CAREER_PATCH.patchSha256) throw new Error('The patch download failed its check. Please try again.');
    return bytes.buffer;
  } finally {
    clearTimeout(timeout);
  }
}

self.onmessage = async ({ data }) => {
  try {
    const file = data.file;
    const CAREER_PATCH = file instanceof File ? patchForSize(file.size) : null;
    if (!CAREER_PATCH) {
      throw new Error('Choose an unmodified Gran Turismo PSP ISO (USA or Europe).');
    }
    const checksum = await fileCrc(file);
    if (file.size === CAREER_PATCH.outputBytes) {
      if (checksum !== CAREER_PATCH.outputCrc32) throw new Error('This is not the finished ' + CAREER_PATCH.version + ' ISO. Choose your original ' + CAREER_PATCH.region + ' ISO to install the current release.');
      self.postMessage({ type: 'already-patched', version: CAREER_PATCH.version, region: CAREER_PATCH.region });
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(CAREER_PATCH.inputs, checksum)) {
      throw new Error('This ISO is not supported (CRC32 ' + checksum + '). Choose an unmodified ' + CAREER_PATCH.region + ' ISO.');
    }
    update('Detected: ' + CAREER_PATCH.inputs[checksum] + '.');
    const patchBuffer = await loadPatch(CAREER_PATCH);
    update('Reading your original ISO…');
    const original = new BinFile(await file.arrayBuffer());
    update('Applying the career patch… Keep this page open.');
    const patched = VCDIFF.fromFile(new BinFile(patchBuffer)).apply(original, true);
    if (patched.fileSize !== CAREER_PATCH.outputBytes || outputCrc(patched._u8array) !== CAREER_PATCH.outputCrc32) {
      throw new Error('The finished ISO failed its check. Please retry using your original ' + CAREER_PATCH.region + ' ISO.');
    }
    self.postMessage({ type: 'ready', buffer: patched._u8array.buffer, name: CAREER_PATCH.outputName }, [patched._u8array.buffer]);
  } catch (error) {
    let message = error.message || 'Could not finish the patch. Please try again.';
    if (error.name === 'AbortError') message = 'The patch download timed out. Check your connection and try again.';
    if (error instanceof RangeError) message = 'The browser ran out of memory. Close other apps and try again, or use the manual installation guide.';
    if (error.name === 'NotReadableError') message = 'Could not read this ISO. Copy it to your device’s storage and try again.';
    if (error instanceof TypeError) message = 'Could not read the ISO or download the patch. Check your connection and try again.';
    self.postMessage({ type: 'error', message });
  }
};
