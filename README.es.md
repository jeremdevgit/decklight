<p align="center"><img src="src-tauri/icons/128x128.png" width="96" alt=""></p>

# Decklight

[![CI](https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml) [![CodeQL](https://github.com/jeremdevgit/decklight/actions/workflows/codeql.yml/badge.svg)](https://github.com/jeremdevgit/decklight/actions/workflows/codeql.yml)

[English](README.md) · [Français](README.fr.md) · **Español**

Decklight es un panel virtual ligero de acciones para Windows, macOS y Linux. La interfaz está disponible en francés, inglés, español, alemán, italiano, portugués, chino y japonés. Utiliza Tauri y el motor web del sistema.

![Perfil de demostración Decklight](docs/screenshots/decklight-en.png)

La versión 0.2 ofrece paneles virtuales Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio y Mobile, además de un formato personalizado. Detecta los dispositivos USB reconocidos por el controlador Rust, actualiza sus pantallas y responde a las pulsaciones. Las pulsaciones y giros de los diales Plus admiten acciones distintas. También incluye perfiles, páginas, carpetas, atajos, teclas multimedia, apertura de sitios y archivos, texto, pausas y secuencias. Los perfiles se guardan localmente y se importan o exportan como JSON.

**Importación Stream Deck:** Decklight lee las exportaciones `.streamDeckProfile` y las copias `.StreamDeckProfilesBackup` que contienen perfiles, con páginas, acciones, imágenes y ajustes originales. Muestra un resumen antes de importar. Las acciones compatibles funcionan; las de plugins y las desconocidas permanecen visibles, pero inactivas. No importa las preferencias globales de la aplicación oficial ni instala plugins. Las imágenes grandes pueden omitirse para limitar el almacenamiento. Una exportación JSON de Decklight incluye los ajustes conservados, que pueden contener credenciales de plugins: protege ese archivo.

**Límite actual:** no admite los modelos Studio, Mobile ni G-keys, las pantallas táctiles Plus y Neo, la ejecución de plugins Elgato ni el cambio automático de perfil. No se ha probado el USB con cada modelo real. La aplicación debe permanecer en ejecución y el software oficial puede tener que liberar el dispositivo. En macOS los atajos pueden requerir permiso de Accesibilidad; en Linux la entrada depende del servicio disponible y el USB puede requerir una [regla udev](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux).

Descarga la [versión preliminar v0.2.1](https://github.com/jeremdevgit/decklight/releases/tag/v0.2.1) para tu sistema. Para compilar, instala Rust, Node.js 22 y los [requisitos de Tauri 2](https://v2.tauri.app/start/prerequisites/), y ejecuta `npm ci` y `npm run desktop:build`. Exporta tus perfiles en JSON para hacer copias de seguridad y revisa las acciones de los perfiles importados.

Decklight es independiente de Elgato y Corsair. Licencia GPL-3.0-or-later; autor: jeremdevgit.

## Mis otros programas

Todos libres, gratuitos y sin publicidad — [github.com/jeremdevgit](https://github.com/jeremdevgit):

| Programa | Plataforma | En resumen |
|---|---|---|
| [AutoDex](https://github.com/jeremdevgit/autodex) | Windows, macOS, Linux | Juego de colección de coches con reconocimiento de fotos en el dispositivo |
| [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) | Windows, macOS | Mantenimiento del ordenador, limpieza y búsqueda de archivos |
| [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) | Windows | Cuadernos cifrados y sincronización experimental |
| [JMeca](https://github.com/jeremdevgit/jmeca) | Windows, macOS, Linux | Seguimiento de mantenimiento de vehículos cifrado |
| [LJ Hub](https://github.com/jeremdevgit/lj-hub) | Windows, macOS, Linux | Gestor de perfiles para dispositivos Logitech |
| [Pomme](https://github.com/jeremdevgit/pomme) | Windows | Reproductor de música para Apple Music y archivos locales |
| [rJb](https://github.com/jeremdevgit/rjb) | Windows | Control de la iluminación RGB |
| [Ludothèque](https://github.com/jeremdevgit/ludotheque) | macOS | Biblioteca y lanzador de juegos |
| [Suite Libre](https://jeremdevgit.github.io/suite-libre/) | Navegador | Seis herramientas sin cuenta |
| [Batailles de France](https://github.com/jeremdevgit/batailles-de-france) | Navegador | Juego de estrategia en tiempo real |
