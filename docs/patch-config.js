// One entry per supported original disc. The worker picks the entry whose original (inputBytes) or finished ISO
// (outputBytes) has the selected file's size, then checks its CRC32. Update all fingerprints together when
// publishing a new release.
const CAREER_PATCHES = Object.freeze([
  Object.freeze({
    region: 'USA',
    version: '1.1.1',
    inputBytes: 1097826304,
    inputs: { '9613AC93': 'USA UMD v1.00', '1EADB6B4': 'USA UMD v2.00', '71DCC467': 'USA v2.00' },
    patchPath: 'patches/Gran-Turismo-PSP-Career-v1.1.1.xdelta',
    patchBytes: 40328602,
    patchSha256: '6b96ababeab8e693e024f796c72b9e240124f361f9d902df67fc48c941e28513',
    outputName: 'Gran-Turismo-PSP-Career-v1.1.1.iso',
    outputBytes: 1137475584,
    outputCrc32: '709DCC77'
  }),
  Object.freeze({
    region: 'Europe',
    version: '1.1.1',
    inputBytes: 1177026560,
    inputs: { 'DA79C7C1': 'Europe UMD v2.00' },
    patchPath: 'patches/Gran-Turismo-PSP-Career-v1.1.1-Europe.xdelta',
    patchBytes: 36163033,
    patchSha256: '8173ff20fb6c05a4ffc57103a0658cf2e06ebc6daf52baf37ffd850ad18bd2d7',
    outputName: 'Gran-Turismo-PSP-Career-v1.1.1-Europe.iso',
    outputBytes: 1222475776,
    outputCrc32: 'DE8DDC32'
  })
]);
