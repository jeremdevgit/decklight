<p align="center"><img src="src-tauri/icons/128x128.png" width="112" alt=""></p>

<h1 align="center">Decklight</h1>

<p align="center"><b>轻量的虚拟 Stream Deck，可控制受支持的 USB 型号并导入 Stream Deck 配置。</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F%20System%20%26%20hardware-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-2f6fde?style=flat-square" alt="系统与硬件"> <a href="https://github.com/jeremdevgit/decklight/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/decklight?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <a href="README.pt.md">Português</a> · <b>简体中文</b> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/decklight/releases"><b>⬇ 下载</b></a></p>

![Decklight 直播配置](docs/screenshots/decklight-en.png)

Decklight 是适用于 Windows、macOS 和 Linux 的虚拟操作面板。它使用 Tauri 和系统自带的网页引擎，而不是捆绑浏览器，并且**可以通过 USB 控制真正的 Stream Deck**。目前是预览版，还不能完全替代官方软件。

## 概览

| | |
|---|---|
| **类别** | 🛠️ 系统与硬件 |
| **平台** | Windows · macOS · Linux |
| **界面语言** | 8 种语言（英、法、西、德、意、葡、中、日） |
| **价格** | 免费、开源、无广告、无遥测 |
| **状态** | 预览版 |
| **许可证** | [GPL-3.0-or-later](LICENSE) |

## 功能

- **虚拟布局**：Mini、Original/MK.2、XL、Neo、Plus、Plus XL、Pedal、Studio 和 Mobile，以及自定义网格。
- **USB 控制** `elgato-streamdeck` 驱动支持的型号：按键图像、按键按下，Plus/Plus XL 旋钮的按下和旋转可分别设置操作。
- **操作**：打开网站和文件、键盘快捷键、输入文本、媒体键、延时和多步序列。
- 多个**配置、页面和文件夹**；每个按键的名称、符号和颜色；JSON 导入/导出。
- **导入 Stream Deck**：支持 `.streamDeckProfile` 和 `.StreamDeckProfilesBackup` 文件，包含页面、操作、图像和原始设置，添加前会给出报告供你检查。

![使用演示数据的导入预览](docs/screenshots/import-en.png)

## 支持的硬件

USB 控制支持 Original、Mini、MK.2、XL、Neo、Plus、Plus XL 和 Pedal（及所列修订版）。不支持 Studio、Mobile 和 G 键；Plus 触摸条、Neo 信息栏、Elgato 插件以及按应用自动切换配置尚未实现。导入的插件操作会显示为未激活的按键。控制设备时 Decklight 必须保持运行，有时需要先让官方软件释放设备。并非所有型号都经过实机测试。

## 安装

在[版本页面](https://github.com/jeremdevgit/decklight/releases)下载适合你系统的版本。macOS 版未签名；Windows 和 Linux 版暂未进行代码签名。

- **macOS**：键盘操作需要“辅助功能”权限。
- **Linux**：请安装 `xdg-open`、用于键盘操作的 X11/Wayland 输入服务，以及 Elgato 设备的 [udev 规则](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux)。

## 安全与隐私

- **无账号、无云服务、无遥测、不执行 shell、无后台服务器。**
- 网址仅限 HTTP、HTTPS 和 mailto；文件操作需要已存在的绝对路径；操作值永远不会传给 shell。
- 导入的文件会检查大小和结构。导出的 JSON 可能包含导入配置中的插件设置，其中可能有凭据：请当作敏感数据处理。

## 从源码构建

```sh
# Rust、Node.js 22 以及 Tauri 2 的前置依赖
npm ci
npm run desktop:dev
npm run desktop:build
```

## 许可证

GPL-3.0-or-later，见 [LICENSE](LICENSE)。USB 驱动为 [elgato-streamdeck](https://github.com/OpenActionAPI/rust-elgato-streamdeck)（MPL-2.0）。Decklight 与 Elgato 或 Corsair 均无关联；Stream Deck 是其所有者的商标。

---

发现安全漏洞？请私下报告（见 [SECURITY.md](SECURITY.md)），不要发公开 issue。

## jeremdevgit 的其他自由软件

全部免费、开源、无广告。

**🛠️ 系统与硬件** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub)

**📒 效率与数据** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 音乐与游戏** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [AutoDex](https://github.com/jeremdevgit/autodex) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
