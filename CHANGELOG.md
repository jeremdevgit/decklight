# Changelog / Journal des changements

## 0.2.1 — 2026-11-11

- Ship installers on every platform: a universal macOS disk image (`.dmg`, Apple silicon and Intel) replaces the ZIP archives, and Linux gains an AppImage next to the `.deb`.
- Release files come with a `SHA256SUMS.txt` checksum list.

- Installateurs sur toutes les plateformes : une image disque macOS universelle (`.dmg`, Apple silicon et Intel) remplace les archives ZIP, et Linux reçoit un AppImage en plus du `.deb`.
- Les fichiers de la version sont accompagnés d’une liste de sommes de contrôle `SHA256SUMS.txt`.

## 0.2.0 — 2026-11-10

- Import Stream Deck `.streamDeckProfile` exports and profile backup archives with pages, actions, images and retained original action settings. A preview reports unsupported actions before applying the import.
- Convert supported website, file, text, hotkey, media, delay, sequence and page navigation actions. Plugin actions remain visible but inactive.
- Add ZIP size limits, archive path checks, import tests and a moderate severity npm audit gate.

- Import des exports `.streamDeckProfile` et des sauvegardes de profils Stream Deck : pages, actions, images et réglages d’origine conservés. Un aperçu signale les actions non exécutables.
- Conversion des actions compatibles : sites, fichiers, texte, raccourcis, médias, pauses, séquences et navigation entre pages. Les actions des plugins restent visibles mais inactives.
- Limites de taille des archives ZIP, contrôle des chemins, tests d’import et audit npm à partir du niveau modéré.

## 0.1.0 — 2026-11-08

- Virtual Stream Deck layouts and custom grid for Windows, macOS and Linux.
- USB device detection, screen key images, key presses and Plus/Plus XL dial actions through the `elgato-streamdeck` driver.
- Profiles, pages, folders, actions, sequences and JSON backup.
- Eight interface languages and local only design.
