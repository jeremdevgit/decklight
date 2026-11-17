<p align="center"><img src="src-tauri/icons/128x128.png" width="112" alt=""></p>

<h1 align="center">Decklight</h1>

<p align="center"><b>Um Stream Deck virtual e leve que controla os modelos USB compatíveis e importa perfis do Stream Deck.</b></p>

<p align="center"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F%20System%20%26%20hardware-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-2f6fde?style=flat-square" alt="Sistema e hardware"> <a href="https://github.com/jeremdevgit/decklight/releases"><img src="https://img.shields.io/github/v/release/jeremdevgit/decklight?include_prereleases&style=flat-square&label=version" alt="version"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0--or--later-555?style=flat-square" alt="GPL-3.0-or-later"></a> <a href="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml"><img src="https://github.com/jeremdevgit/decklight/actions/workflows/ci.yml/badge.svg" alt="CI"></a></p>

<p align="center"><a href="README.md">English</a> · <a href="README.fr.md">Français</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.it.md">Italiano</a> · <b>Português</b> · <a href="README.zh.md">简体中文</a> · <a href="README.ja.md">日本語</a></p>

<p align="center"><a href="https://github.com/jeremdevgit/decklight/releases"><b>⬇ Transferir</b></a></p>

![Perfil de streaming do Decklight](docs/screenshots/decklight-en.png)

O Decklight é um painel de ações virtual para Windows, macOS e Linux. Usa o Tauri e o motor web do sistema em vez de incluir um navegador, e **pode controlar Stream Decks reais por USB**. É uma pré-visualização, ainda não substitui por completo o software oficial.

## Em resumo

| | |
|---|---|
| **Categoria** | 🛠️ Sistema e hardware |
| **Plataformas** | Windows · macOS · Linux |
| **Interface** | 8 idiomas (EN, FR, ES, DE, IT, PT, ZH, JA) |
| **Preço** | Gratuito, de código aberto, sem anúncios nem telemetria |
| **Estado** | Pré-visualização |
| **Licença** | [GPL-3.0-or-later](LICENSE) |

## O que faz

- **Layouts virtuais** Mini, Original/MK.2, XL, Neo, Plus, Plus XL, Pedal, Studio e Mobile, além de grelhas personalizadas.
- **Controlo USB** dos modelos suportados pelo controlador `elgato-streamdeck`: imagens das teclas, pressões e ações separadas para premir e rodar os botões rotativos do Plus/Plus XL.
- **Ações**: abrir sites e ficheiros, atalhos de teclado, escrever texto, teclas multimédia, pausas e sequências.
- Vários **perfis, páginas e pastas**; nome, símbolo e cor por tecla; importação/exportação JSON.
- **Importação do Stream Deck**: ficheiros `.streamDeckProfile` e `.StreamDeckProfilesBackup` com páginas, ações, imagens e definições originais, com um relatório para rever antes de adicionar.

![Pré-visualização da importação com dados de demonstração](docs/screenshots/import-en.png)

## Hardware compatível

O controlo USB abrange Original, Mini, MK.2, XL, Neo, Plus, Plus XL e Pedal (com as revisões listadas). Studio, Mobile e as teclas G não são suportados; as barras táteis do Plus, a barra de informação do Neo, os plugins da Elgato e os perfis automáticos por app não estão implementados. As ações de plugins importadas ficam visíveis como teclas inativas. O Decklight tem de ficar aberto para controlar um dispositivo, e o software oficial pode ter de o libertar primeiro. Nem todos os modelos foram testados fisicamente.

## Instalar

Transfira a versão para o seu sistema na [página de versões](https://github.com/jeremdevgit/decklight/releases). As versões para macOS não estão assinadas; as de Windows e Linux ainda não.

- **macOS**: as ações de teclado precisam da permissão de Acessibilidade.
- **Linux**: instale `xdg-open`, um serviço de entrada X11/Wayland para as ações de teclado e as [regras udev](https://github.com/OpenActionAPI/rust-elgato-streamdeck#udev-rules-for-linux) para os dispositivos Elgato.

## Segurança e privacidade

- **Sem conta, nuvem, telemetria, execução de shell nem servidor em segundo plano.**
- URLs limitados a HTTP, HTTPS e mailto; as ações de ficheiro exigem um caminho absoluto existente; os valores nunca passam por uma shell.
- Os ficheiros importados são verificados (tamanho e estrutura). Um JSON exportado pode conter definições de plugins importados, por vezes credenciais: trate-o como dado sensível.

## Compilar

```sh
# Rust, Node.js 22 e os pré-requisitos do Tauri 2
npm ci
npm run desktop:dev
npm run desktop:build
```

## Licença

GPL-3.0-or-later — ver [LICENSE](LICENSE). O controlador USB é o [elgato-streamdeck](https://github.com/OpenActionAPI/rust-elgato-streamdeck) (MPL-2.0). O Decklight não está afiliado à Elgato nem à Corsair; Stream Deck é uma marca do respetivo proprietário.

---

Encontrou uma vulnerabilidade? Comunique-a em privado (consulte [SECURITY.md](SECURITY.md)) e não num issue público.

## Mais software livre de jeremdevgit

Todos gratuitos, de código aberto e sem anúncios.

**🛠️ Sistema e hardware** — [Boîte à outils](https://github.com/jeremdevgit/boite-a-outils) · [rJb](https://github.com/jeremdevgit/rjb) · [LJ Hub](https://github.com/jeremdevgit/lj-hub)

**📒 Produtividade e dados** — [Carnet de notes](https://github.com/jeremdevgit/carnet-rust) · [JMeca](https://github.com/jeremdevgit/jmeca) · [Suite Libre](https://jeremdevgit.github.io/suite-libre/)

**🎮 Música e jogos** — [Pomme](https://github.com/jeremdevgit/pomme) · [Ludothèque](https://github.com/jeremdevgit/ludotheque) · [AutoDex](https://github.com/jeremdevgit/autodex) · [Batailles de France](https://github.com/jeremdevgit/batailles-de-france)
