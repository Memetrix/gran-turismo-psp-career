# Install Gran Turismo PSP Career

You need your own unmodified **Gran Turismo PSP USA** ISO. The patch does not include the game.

**[Find the right patch for your ISO](https://memetrix.github.io/gran-turismo-psp-career/)**: choose the ISO file and download the patch it recommends. The check runs on your device; the ISO is never uploaded.

## Windows and macOS (Delta Patcher)

1. Download the recommended `.xdelta`, plus the free [Delta Patcher](https://deltapatcher.net/) for Windows or macOS.
2. Make a copy of your original ISO. In Delta Patcher, choose the copy under **Original file**.
3. Choose the downloaded `.xdelta` under **XDelta patch** and click **Apply patch**. Delta Patcher changes the selected ISO copy. When it reports success, copy that ISO to your PSP's `ISO` folder or open it in PPSSPP.

These are screenshots from an actual installation; your file paths will differ.

![Original ISO and the career patch selected in Delta Patcher](screenshots/delta-patcher-ready.jpg)

![Delta Patcher confirming the patch was applied](screenshots/delta-patcher-success.jpg)

If Delta Patcher reports a checksum error, check that you picked the patch for your ISO. A modified ISO or a different region will also fail. Keep checksum validation on. The finished ISO has SHA-256 `52553a5a77ec9ebc5a5474b83ce7147486a9072264a4098e9c8d376762c13f5d` with every supported source.

## Android (UniPatcher)

1. Install UniPatcher 0.17 or newer (0.17.3 on 32-bit phones).
2. Put your unmodified USA ISO on the phone as a plain `.iso`. In PPSSPP, long-press the game, open **Game info** and note the **CRC**. Pick the patch for that CRC from the table below.
3. Keep at least 3.5 GB free on internal storage besides the ISO and the patch.
4. In UniPatcher choose **Apply patch**: patch = the `.xdelta`, ROM = your ISO, output = a normal folder PPSSPP can see (Download, Documents or your PSP games folder), not `Android/data`.
5. Leave **Ignore checksum** off and keep the app open for several minutes until it finishes.
6. "ROM is not compatible" means the patch does not match your ISO. "Not enough space" means you need to free space and retry.
7. Check the result in PPSSPP **Game info**: the CRC must be `5FCB3D96`.

## Choose the patch manually

| Original ISO | CRC32 | Patch |
| --- | --- | --- |
| USA UMD v2.00 | `1EADB6B4` | `Gran-Turismo-PSP-Career-v1.0.0-USA-UMD-v2.xdelta` |
| USA UMD v1.00 | `9613AC93` | `Gran-Turismo-PSP-Career-v1.0.0-USA-UMD-v1.xdelta` |
| USA v2.00 image (other dump) | `71DCC467` | `Gran-Turismo-PSP-Career-v1.0.0.xdelta` |

All three patches are on the [release page](https://github.com/Memetrix/gran-turismo-psp-career/releases/tag/v1.0.0) and produce the same ISO.

A USA ISO with another CRC has no patch yet; [tell us](https://github.com/Memetrix/gran-turismo-psp-career/issues) its CRC. The European `UCES01245` version is not supported yet.

## Saves

Back up your savedata before installing. The career uses its own `UCUS98632-CAREER` save. On first launch it can copy your garage and credits from the stock `UCUS98632-GAMEDAT` save without overwriting it.

The career remembers bought tuning for up to **128 cars**. Beyond that, a new car cannot be tuned until a tuned car is sold.

## Questions

- **PS Vita (Adrenaline):** players report it runs with UMD Mode **Inferno**, Force High Memory **Stable** and CPU 333/166. With UMD Mode M33 it can stop on a black screen after the intro movie.
- **CHD:** extract it back to an ISO first (for example `chdman extractdvd`), then patch the ISO.
- **UMD disc:** the patch needs an ISO. Dump your own disc to an ISO, then patch that.
- **The v2.00 update is not needed:** there are patches for both USA v1.00 and v2.00.
- **Next to the original:** yes. The patch writes a new ISO and leaves your original as it is. Both use the same save folder for the stock game; the career keeps its own `UCUS98632-CAREER` save.
- **Language:** English only.
- **Check the result:** choose the finished ISO on the [patch page](https://memetrix.github.io/gran-turismo-psp-career/), or look at its CRC in PPSSPP **Game info**: it must be `5FCB3D96`.

## PSP-1000

On a PSP-1000 the game can stay on the loading screen before a race. The PSP-1000 leaves the game about 350 KB of spare memory; if plugins and the ISO driver take more than that, no race loads, whatever the car and its tuning. Turn off game plugins and try again, and [report](https://github.com/Memetrix/gran-turismo-psp-career/issues) your firmware and plugins if it still happens.

<details>
<summary>Command-line patch (advanced)</summary>

The ZIP on the release page is an alternative for the USA v2.00 image with CRC32 `71DCC467`, SHA-256 `78d1b6855a268bd6480a6572977c3f4df4c438af11c751baeca14390819de435`. It needs Python 3.8+, `xdelta3` on your PATH, the .NET 9 or 10 runtime and about 5 GB of free disk space. Extract the ZIP, then run this from a terminal inside its folder:

```sh
python3 apply_patch.py "/path/to/your/original.iso" "/path/to/Gran-Turismo-PSP-Career-v1.0.0.iso"
```

On Windows, use `python` or `py` in place of `python3`. If `dotnet` is not on your PATH, add `--dotnet /path/to/dotnet`. This installer leaves the original ISO untouched.

</details>

[Report a problem](https://github.com/Memetrix/gran-turismo-psp-career/issues) with the console model or PPSSPP version, event and round, and what happened.
