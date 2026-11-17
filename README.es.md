<p align="center"><img src="src-tauri/icons/128x128.png" width="112" alt=""></p>

<h1 align="center">Decklight</h1>

<p align="center"><b>Un Stream Deck virtual y ligero que controla los modelos USB compatibles e importa perfiles de Stream Deck.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F%20System%20%26%20hardware-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-2f6fde?style=flat-square" alt="Sistema y hardware"> <a href="https://github.com/jeremdevgit/decklight/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/decklight?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <b>Español</b> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/decklight/releases"><b>⬇ Descargar</b></a></p>

![Perfil de streaming de Decklight](docs/screenshots/decklight-en.png)

Decklight es un panel de acciones virtual para Windows, macOS y Linux. Usa Tauri y el motor web del sistema en lugar de incluir un navegador, y **puede controlar Stream Deck reales por USB**. Es una versión preliminar, todavía no sustituye por completo al software oficial.

## De un vistazo

| | |
|---|---|
| **Categoría** | 🛠️ Sistema y hardware |
| **Plataformas** | Windows · macOS · Linux |
| **Interfaz** | 8 idiomas (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Precio** | Gratis, de código abierto, sin anuncios ni telemetría |
| **Estado** | Versión preliminar |
| **Licencia** | [GPL-3.0-or-later](LICENSE) |

## Qué hace

- **Diseños virtuales** Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio y Mobile, además de cuadrículas personalizadas.
- **Control USB** de los modelos compatibles con el controlador `elgato-streamdeck`: imágenes de teclas, pulsaciones y acciones separadas para pulsar y girar los diales de Plus/Plus XL.
- **Acciones**: abrir webs y archivos, atajos de teclado, escribir texto, teclas multimedia, esperas y secuencias.
- Varios **perfiles, páginas y carpetas**; nombre, símbolo y color por tecla; importación/exportación JSON.
- **Importación de Stream Deck**: archivos `.streamDeckProfile` y `.StreamDeckProfilesBackup` con páginas, acciones, imágenes y ajustes originales, con un informe que revisar antes de añadirlos.

![Vista previa de importación con datos de demostración](docs/screenshots/import-en.png)

## Hardware compatible

El control USB cubre Original, Mini, MK.2, XL, Neo, Plus, Plus XL y Pedal (con sus revisiones). Studio, Mobile y las teclas G no son compatibles; las bandas táctiles del Plus, la barra de información del Neo, los plugins de Elgato y los perfiles automáticos por app no están implementados. Las acciones de plugins importadas aparecen como teclas inactivas. Decklight debe seguir abierto para controlar un dispositivo, y a veces el software oficial debe liberarlo antes. No todos los modelos se han probado físicamente.

## Instalar

Descarga la versión para tu sistema en la [página de versiones](https://github.com/jeremdevgit/decklight/releases). Las versiones de macOS no están firmadas; las de Windows y Linux aún no.

- **macOS**: las acciones de teclado necesitan el permiso de Accesibilidad.
- **Linux**: instala `xdg-open`, un servicio de entrada X11/Wayland para las acciones de teclado y las [reglas udev](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux) para los dispositivos Elgato.

## Seguridad y privacidad

- **Sin cuenta, nube, telemetría, ejecución de shell ni servidor en segundo plano.**
- URL limitadas a HTTP, HTTPS y mailto; las acciones de archivo exigen una ruta absoluta existente; los valores nunca pasan por un shell.
- Los archivos importados se comprueban (tamaño y estructura). Un JSON exportado puede contener ajustes de plugins importados, a veces credenciales: trátalo como dato sensible.

## Compilar

```sh
# Rust, Node.js 22 y los requisitos de Tauri 2
npm ci
npm run desktop:dev
npm run desktop:build
```

## Licencia

GPL-3.0-or-later — ver [LICENSE](LICENSE). El controlador USB es [elgato-streamdeck](https://github.com/OpenActionAPI/rust-elgato-streamdeck) (MPL-2.0). Decklight no está afiliado a Elgato ni a Corsair; Stream Deck es una marca de su propietario.

---

¿Has encontrado una vulnerabilidad? Infórmala en privado (consulta [SECURITY.md](SECURITY.md)) y no en una incidencia pública.

## Más software libre de jeremdevgit

Todos gratuitos, de código abierto y sin anuncios.

**🛠️ Sistema y hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub)

**📒 Productividad y datos** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Música y juegos** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [AutoDex](https://github.com/jeremdevgit/autodex) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
