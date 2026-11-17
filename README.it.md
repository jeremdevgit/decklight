<p align="center"><img src="src-tauri/icons/128x128.png" width="112" alt=""></p>

<h1 align="center">Decklight</h1>

<p align="center"><b>Uno Stream Deck virtuale e leggero che controlla i modelli USB supportati e importa i profili Stream Deck.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F%20System%20%26%20hardware-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-2f6fde?style=flat-square" alt="Sistema e hardware"> <a href="https://github.com/jeremdevgit/decklight/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/decklight?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <b>Italiano</b> · <a href="README.pt.md">Português</a> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/decklight/releases"><b>⬇ Scarica</b></a></p>

![Profilo streaming di Decklight](docs/screenshots/decklight-en.png)

Decklight è un pannello di azioni virtuale per Windows, macOS e Linux. Usa Tauri e il motore web del sistema invece di includere un browser, e **può controllare veri Stream Deck via USB**. È un'anteprima, non ancora un sostituto completo del software ufficiale.

## In breve

| | |
|---|---|
| **Categoria** | 🛠️ Sistema e hardware |
| **Piattaforme** | Windows · macOS · Linux |
| **Interfaccia** | 8 lingue (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Prezzo** | Gratuito, open source, senza pubblicità né telemetria |
| **Stato** | Anteprima |
| **Licenza** | [GPL-3.0-or-later](LICENSE) |

## Cosa fa

- **Layout virtuali** Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio e Mobile, più griglie personalizzate.
- **Controllo USB** dei modelli supportati dal driver `elgato-streamdeck`: immagini dei tasti, pressioni e azioni separate per pressione e rotazione delle manopole di Plus/Plus XL.
- **Azioni**: aprire siti e file, scorciatoie da tastiera, digitazione di testo, tasti multimediali, attese e sequenze.
- Più **profili, pagine e cartelle**; nome, simbolo e colore per tasto; importazione/esportazione JSON.
- **Importazione Stream Deck**: file `.streamDeckProfile` e `.StreamDeckProfilesBackup` con pagine, azioni, immagini e impostazioni originali, con un rapporto da rivedere prima di aggiungerli.

![Anteprima d'importazione con dati dimostrativi](docs/screenshots/import-en.png)

## Hardware supportato

Il controllo USB copre Original, Mini, MK.2, XL, Neo, Plus, Plus XL e Pedal (con le revisioni elencate). Studio, Mobile e i tasti G non sono supportati; le barre touch del Plus, la barra informazioni del Neo, i plugin Elgato e i profili automatici per app non sono implementati. Le azioni di plugin importate restano visibili come tasti inattivi. Decklight deve restare aperto per controllare un dispositivo, e a volte il software ufficiale deve prima rilasciarlo. Non tutti i modelli sono stati testati fisicamente.

## Installazione

Scarica la versione per il tuo sistema dalla [pagina delle versioni](https://github.com/jeremdevgit/decklight/releases). Le build macOS non sono firmate; quelle Windows e Linux non ancora.

- **macOS**: le azioni da tastiera richiedono il permesso Accessibilità.
- **Linux**: installa `xdg-open`, un servizio di input X11/Wayland per le azioni da tastiera e le [regole udev](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux) per i dispositivi Elgato.

## Sicurezza e privacy

- **Nessun account, cloud, telemetria, esecuzione di shell o server in background.**
- URL limitati a HTTP, HTTPS e mailto; le azioni sui file richiedono un percorso assoluto esistente; i valori non passano mai da una shell.
- I file importati vengono controllati (dimensione e struttura). Un JSON esportato può contenere impostazioni di plugin importate, a volte credenziali: trattalo come dato sensibile.

## Compilare

```sh
# Rust, Node.js 22 e i prerequisiti di Tauri 2
npm ci
npm run desktop:dev
npm run desktop:build
```

## Licenza

GPL-3.0-or-later — vedi [LICENSE](LICENSE). Il driver USB è [elgato-streamdeck](https://github.com/OpenActionAPI/rust-elgato-streamdeck) (MPL-2.0). Decklight non è affiliato a Elgato né a Corsair; Stream Deck è un marchio del suo proprietario.

---

Hai trovato una vulnerabilità? Segnalala in privato (vedi [SECURITY.md](SECURITY.md)) e non in una issue pubblica.

## Altro software libero di jeremdevgit

Tutti gratuiti, open source e senza pubblicità.

**🛠️ Sistema e hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub)

**📒 Produttività e dati** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Musica e giochi** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [AutoDex](https://github.com/jeremdevgit/autodex) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
