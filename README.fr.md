# Decklight

Decklight est une grille virtuelle de commandes légère pour Windows, macOS et Linux. L’interface est traduite en français, anglais, espagnol, allemand, italien, portugais, chinois et japonais. Elle utilise Tauri et le moteur web du système.

![Profil de démonstration Decklight](docs/screenshots/decklight-fr.png)

La version 0.1 propose un deck virtuel aux formats Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio et Mobile, ou personnalisé. Elle détecte les appareils USB reconnus par le pilote Rust, affiche les touches sur leur écran et réagit aux appuis. Les appuis et rotations des molettes Plus peuvent recevoir des actions distinctes. Profils, pages, dossiers, raccourcis clavier, touches multimédias, ouverture de sites et de fichiers, saisie de texte, pauses et enchaînements sont disponibles. Les profils restent sur l’ordinateur et s’importent ou s’exportent en JSON.

**Limite actuelle :** les modèles Studio, Mobile et G-keys, les bandes tactiles Plus et Neo, les plugins et profils Elgato ainsi que le changement automatique de profil ne sont pas pris en charge. La prise en charge USB n’a pas été testée sur chaque appareil réel. L’application doit rester lancée ; le logiciel officiel Stream Deck peut devoir libérer l’appareil. Sur macOS, les raccourcis peuvent demander l’autorisation Accessibilité ; sur Linux, l’injection clavier dépend du service d’entrée disponible et l’accès USB peut demander une [règle udev](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux).

Pour compiler : installer Rust, Node.js 22 et les [prérequis Tauri 2](https://v2.tauri.app/start/prerequisites/), puis lancer `npm ci`, `npm run desktop:dev` ou `npm run desktop:build`. Les profils sont conservés dans le stockage local de l’application : exportez un fichier JSON pour les sauvegarder. Examinez les actions d’un profil importé avant de l’utiliser.

Decklight est indépendant d’Elgato et Corsair. Licence GPL-3.0-or-later ; auteur : jeremdevgit.
