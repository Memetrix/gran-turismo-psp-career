# Install Gran Turismo PSP Career

You need your own unmodified Gran Turismo PSP ISO: the USA version 1.00 or 2.00, or the European version 2.00. The patch does not include the game.

There are two patches on the [release page](https://github.com/Memetrix/gran-turismo-psp-career/releases/tag/v1.1.1), one per region (see [Supported ISOs](#supported-isos)).

For a USA ISO take `Gran-Turismo-PSP-Career-v1.1.1.xdelta`. It works with all three known USA dumps of the game.

For a European ISO (UCES01245) take `Gran-Turismo-PSP-Career-v1.1.1-Europe.xdelta`. The career is translated into the disc's eight languages: English, French, German, Italian, Spanish, Dutch, Portuguese and Russian.

## Install in your browser

1. Open the [browser installer](https://memetrix.github.io/gran-turismo-psp-career/) and choose your original ISO, USA or Europe. The installer picks the patch for your region.
2. Keep the page open while it checks the ISO, downloads the patch and applies it. Your ISO stays on your device and the original file is not changed.
3. Click **Save patched ISO**. Open the saved file in PPSSPP or copy it to your PSP's `ISO` folder.

If your browser cannot finish, use one of the manual methods below.

## Windows and macOS (Delta Patcher)

1. Download the `.xdelta` for your region, plus the free [Delta Patcher](https://deltapatcher.net/) for Windows or macOS.
2. Make a copy of your original ISO. In Delta Patcher, choose the copy under **Original file**.
3. Choose the downloaded `.xdelta` under **XDelta patch** and click **Apply patch**. Delta Patcher changes the selected ISO copy. When it reports success, copy that ISO to your PSP's `ISO` folder or open it in PPSSPP.

These are screenshots from an actual installation; your file paths will differ.

![Original ISO and the career patch selected in Delta Patcher](screenshots/delta-patcher-ready.jpg)

![Delta Patcher confirming the patch was applied](screenshots/delta-patcher-success.jpg)

If Delta Patcher reports a checksum error, your ISO is not one of the supported originals: a modified ISO or the other region's patch fails. Keep checksum validation on. The finished USA ISO has SHA-256 `f1dddd11c0f8045732b3e143ba63f530779d06f796c525d2629a9d5d3cc23246` with every supported source. The finished European ISO has SHA-256 `63c8fd320acd0b2e367012eb18bba4e55fbd5825dfb35f2ef39977a819d6e38f`.

## Android (UniPatcher)

1. Install UniPatcher 0.17 or newer (0.17.3 on 32-bit phones).
2. Put your unmodified ISO on the phone as a plain `.iso`. In PPSSPP, long-press the game, open **Game info** and note the **CRC**. It must be one of the CRCs in the table below.
3. Keep at least 3.5 GB free on internal storage besides the ISO and the patch.
4. In UniPatcher choose **Apply patch**: patch = `Gran-Turismo-PSP-Career-v1.1.1.xdelta` for a USA ISO or `Gran-Turismo-PSP-Career-v1.1.1-Europe.xdelta` for a European ISO, ROM = your ISO, output = a normal folder PPSSPP can see (Download, Documents or your PSP games folder), not `Android/data`.
5. Leave **Ignore checksum** off and keep the app open for several minutes until it finishes.
6. "ROM is not compatible" means your ISO is not one of the supported originals, or the patch is for the other region. "Not enough space" means you need to free space and retry.
7. Check the result in PPSSPP **Game info**: the CRC must be `709DCC77` for the USA version or `DE8DDC32` for the European version.

## Supported ISOs

| Original ISO | CRC32 | Patch |
| --- | --- | --- |
| USA UMD v2.00 | `1EADB6B4` | `Gran-Turismo-PSP-Career-v1.1.1.xdelta` |
| USA UMD v1.00 | `9613AC93` | `Gran-Turismo-PSP-Career-v1.1.1.xdelta` |
| Originally supported USA v2.00 image | `71DCC467` | `Gran-Turismo-PSP-Career-v1.1.1.xdelta` |
| Europe UMD v2.00 (UCES01245) | `DA79C7C1` | `Gran-Turismo-PSP-Career-v1.1.1-Europe.xdelta` |

The USA patch turns each of the three USA ISOs into the same ISO.

| File | Size | CRC32 | SHA-256 |
| --- | --- | --- | --- |
| Gran-Turismo-PSP-Career-v1.1.1.xdelta | 40,328,602 bytes | `39052CC0` | `6b96ababeab8e693e024f796c72b9e240124f361f9d902df67fc48c941e28513` |
| Patched ISO (USA) | 1,137,475,584 bytes | `709DCC77` | `f1dddd11c0f8045732b3e143ba63f530779d06f796c525d2629a9d5d3cc23246` |
| Gran-Turismo-PSP-Career-v1.1.1-Europe.xdelta | 36,163,033 bytes | `6CF100FF` | `8173ff20fb6c05a4ffc57103a0658cf2e06ebc6daf52baf37ffd850ad18bd2d7` |
| Patched ISO (Europe) | 1,222,475,776 bytes | `DE8DDC32` | `63c8fd320acd0b2e367012eb18bba4e55fbd5825dfb35f2ef39977a819d6e38f` |

## Updating and saves

Apply 1.1.1 to a copy of your original ISO, not to an ISO already patched with an earlier release. Back up your savedata first.

The career uses its own save: `UCUS98632-CAREER` on the USA version, `UCES01245-CAREER` on the European version. On first launch it can copy your garage and credits from the stock save (`UCUS98632-GAMEDAT` or `UCES01245-GAMEDAT`) without overwriting it. Career saves from 1.1 load in 1.1.1; back up yours before updating. Career saves from 1.0 are supported.

The career remembers paid setups for up to **128 car model/colour combinations** at once.

### Moving your save from the USA version to the European one

The two versions keep their saves in different folders, and a PSP does not accept a folder that was only renamed.

In PPSSPP and on a PSP, start the European version while it has no save of its own. It finds your USA career save, tells you it has copied it, and saves to its own slot from then on. Your USA save is not changed.

On a PSP you can also copy a save in either direction with GT Career Save Converter. Unzip `GT-Career-Save-Converter.zip` from the [release page](https://github.com/Memetrix/gran-turismo-psp-career/releases/tag/v1.1.1), copy the `GTCSAVE` folder to `PSP/GAME` on the Memory Stick and run it from the Game menu. It asks before replacing a save that is already there.

### FAQ

**I chose 8 cars but I race 4 (or the Extended Grid row is greyed).**
Eight cars need the extra memory of a PSP-2000 or later. The PSP-1000 races four, and Città di Aria races four on every console.
- PPSSPP: Settings → System → PSP settings → PSP model must be PSP-2000/3000. Restart the game after changing it.
- PSP on custom firmware: on its first start the game asks ARK for the extra memory and tells you to restart. If the row stays greyed, open the CFW settings, change High Memory from Auto to Forced and start the game again.

**PS Vita / Adrenaline freezes, or the second eight-car race does not load.**
A player traced this to the "Suspend threads" option of Adrenaline Bubble Booter (Booter tab): turn it off. Plain Adrenaline has no such option.

**The game runs slowly with eight cars on my PSP.**
Choose 5 or 6 cars in Options → Extended Grid, or set the CPU clock above 333 MHz in your custom firmware settings.

## Questions

- **PS Vita (Adrenaline):** players reported that 1.0 runs with UMD Mode **Inferno**, Force High Memory **Stable** and CPU 333/166. M33 could stop at a black screen after the intro. These reports are from 1.0.
- **CHD:** extract it to an ISO before patching.
- **UMD disc:** dump your own disc to an ISO, then patch that ISO.
- **USA v1.00:** no v2.00 update is needed; the same patch supports both versions.
- **Language:** the USA version is in English. The European version has the career in the disc's eight languages.
- **Check the result:** choose the finished ISO on the [patch page](https://memetrix.github.io/gran-turismo-psp-career/), or check PPSSPP **Game info**. Its CRC must be `709DCC77` (USA) or `DE8DDC32` (Europe).

[Report a problem](https://github.com/Memetrix/gran-turismo-psp-career/issues) with the console model or PPSSPP version, event and round, and what happened.
