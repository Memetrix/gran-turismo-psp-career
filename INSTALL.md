# Install Gran Turismo PSP Career

You need your own unmodified **Gran Turismo PSP USA** ISO. The patch does not include the game.

One patch, `Gran-Turismo-PSP-Career-v1.1.xdelta` from the [release page](https://github.com/Memetrix/gran-turismo-psp-career/releases/latest), works with every supported USA ISO (see [Supported ISOs](#supported-isos)).

## Install in your browser

1. Open the [browser installer](https://memetrix.github.io/gran-turismo-psp-career/) and choose your original USA ISO.
2. Keep the page open while it checks the ISO, downloads the patch and applies it. Your ISO stays on your device and the original file is not changed.
3. Click **Save patched ISO**. Open the saved file in PPSSPP or copy it to your PSP's `ISO` folder.

If your browser cannot finish, use one of the manual methods below.

## Windows and macOS (Delta Patcher)

1. Download `Gran-Turismo-PSP-Career-v1.1.xdelta`, plus the free [Delta Patcher](https://deltapatcher.net/) for Windows or macOS.
2. Make a copy of your original ISO. In Delta Patcher, choose the copy under **Original file**.
3. Choose the downloaded `.xdelta` under **XDelta patch** and click **Apply patch**. Delta Patcher changes the selected ISO copy. When it reports success, copy that ISO to your PSP's `ISO` folder or open it in PPSSPP.

These are screenshots from an actual installation; your file paths will differ.

![Original ISO and the career patch selected in Delta Patcher](screenshots/delta-patcher-ready.jpg)

![Delta Patcher confirming the patch was applied](screenshots/delta-patcher-success.jpg)

If Delta Patcher reports a checksum error, your ISO is not one of the supported originals: a modified ISO or a different region fails. Keep checksum validation on. The finished ISO has SHA-256 `ae3d5268a3cc8777ba45e9bf00e3f3870a4cba0c1d5ee6f92ad7682cf4a95213` with every supported source.

## Android (UniPatcher)

1. Install UniPatcher 0.17 or newer (0.17.3 on 32-bit phones).
2. Put your unmodified USA ISO on the phone as a plain `.iso`. In PPSSPP, long-press the game, open **Game info** and note the **CRC**. It must be one of the CRCs in the table below.
3. Keep at least 3.5 GB free on internal storage besides the ISO and the patch.
4. In UniPatcher choose **Apply patch**: patch = the `.xdelta`, ROM = your ISO, output = a normal folder PPSSPP can see (Download, Documents or your PSP games folder), not `Android/data`.
5. Leave **Ignore checksum** off and keep the app open for several minutes until it finishes.
6. "ROM is not compatible" means your ISO is not one of the supported originals. "Not enough space" means you need to free space and retry.
7. Check the result in PPSSPP **Game info**: the CRC must be `A034807E`.

## Supported ISOs

| Original ISO | CRC32 |
| --- | --- |
| USA UMD v2.00 | `1EADB6B4` |
| USA UMD v1.00 | `9613AC93` |
| Originally supported USA v2.00 image | `71DCC467` |

The same `.xdelta` turns each of them into the same ISO.

The European `UCES01245` version is not supported yet.

## Updating and saves

Apply 1.1 to a copy of your original USA ISO, not to an ISO already patched with an earlier release. Back up your savedata first.

The career uses its own `UCUS98632-CAREER` save. On first launch it can copy your garage and credits from `UCUS98632-GAMEDAT` without overwriting your stock save. Career saves from 1.0 are supported.

The career remembers paid setups for up to **128 car model/colour combinations** at once.

## Questions

- **PS Vita (Adrenaline):** players reported that 1.0 runs with UMD Mode **Inferno**, Force High Memory **Stable** and CPU 333/166. M33 could stop at a black screen after the intro. These reports are from 1.0.
- **CHD:** extract it to an ISO before patching.
- **UMD disc:** dump your own disc to an ISO, then patch that ISO.
- **USA v1.00:** no v2.00 update is needed; the same patch supports both versions.
- **Language:** English only.
- **Check the result:** choose the finished ISO on the [patch page](https://memetrix.github.io/gran-turismo-psp-career/), or check PPSSPP **Game info**. Its CRC must be `A034807E`.

[Report a problem](https://github.com/Memetrix/gran-turismo-psp-career/issues) with the console model or PPSSPP version, event and round, and what happened.
