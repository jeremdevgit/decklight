<p align="center"><img src="src-tauri/icons/128x128.png" width="112" alt=""></p>

<h1 align="center">Decklight</h1>

<p align="center"><b>A lightweight virtual Stream Deck that drives supported USB models and imports Stream Deck profiles.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F%20System%20%26%20hardware-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-2f6fde?style=flat-square" alt="System & hardware"> <a href="https://github.com/jeremdevgit/decklight/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/decklight?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><b>English</b> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/decklight/releases"><b>⬇ Download</b></a></p>

![Decklight streaming profile](docs/screenshots/decklight-en.png)

Decklight is a virtual action deck for Windows, macOS and Linux. It uses Tauri and the system web view instead of bundling a browser, and **can drive real Stream Deck hardware over USB**. It is a preview, not yet a full replacement for the official software.

## At a glance

| | |
|---|---|
| **Category** | 🛠️ System & hardware |
| **Platforms** | Windows · macOS · Linux |
| **Interface** | 8 languages (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Price** | Free, open source, no ads, no telemetry |
| **Status** | Preview |
| **License** | [GPL-3.0-or-later](LICENSE) |

## What it does

- **Virtual layouts** for Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio and Mobile, plus custom grids.
- **USB control** of models supported by the `elgato-streamdeck` driver: key images, key presses, and separate actions for Plus/Plus XL encoder presses and turns.
- **Actions**: open websites and files, keyboard shortcuts, text typing, media keys, delays and multi-step sequences.
- Multiple **profiles, pages and folders**; per-key names, symbols and colors; JSON import/export.
- **Stream Deck import**: `.streamDeckProfile` and `.StreamDeckProfilesBackup` files with pages, actions, images and original settings, with a report to review before adding.

![Import preview with demo data](docs/screenshots/import-en.png)

## Supported hardware

USB control covers Original, Mini, MK.2, XL, Neo, Plus, Plus XL and Pedal (with their listed revisions). Studio, Mobile and G-keys are not supported; Plus touch strips, Neo's info strip, Elgato plugins and automatic per-app profiles are not implemented. Imported plugin actions stay visible as inactive keys. Decklight must stay open to control a device, and the official software may need to release it first. Not every model has been tested physically.

## Install

Download the build for your system from the [releases page](https://github.com/jeremdevgit/decklight/releases). macOS builds are unsigned; Windows and Linux builds are not code-signed yet.

- **macOS**: keyboard actions need the Accessibility permission.
- **Linux**: install `xdg-open`, an X11/Wayland input service for keyboard actions, and the [udev rules](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux) for Elgato devices.

## Safety and privacy

- **No account, cloud, telemetry, shell execution or background server.**
- URLs are limited to HTTP, HTTPS and mailto; file actions need an existing absolute path; action values are never passed to a shell.
- Imported files are checked for size and structure. An exported JSON can contain plugin settings from imported profiles, which may include credentials: treat it as sensitive.

## Build from source

```sh
# Rust, Node.js 22 and the Tauri 2 prerequisites
npm ci
npm run desktop:dev
npm run desktop:build
```

## License

GPL-3.0-or-later — see [LICENSE](LICENSE). The USB driver is [elgato-streamdeck](https://github.com/OpenActionAPI/rust-elgato-streamdeck) (MPL-2.0). Decklight is not affiliated with Elgato or Corsair; Stream Deck is a trademark of its owner.

---

Found a vulnerability? Please report it privately (see [SECURITY.md](SECURITY.md)) rather than in a public issue.

## More free software by jeremdevgit

All free, open source and ad-free.

**🛠️ System & hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub)

**📒 Productivity & data** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Music & games** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [AutoDex](https://github.com/jeremdevgit/autodex) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
