# MagicGarden-CoinFarmer

A farming assistant project for Magic Garden, focused on earning spendable Coins through normal gameplay.

## Development status

Initial project setup. There is no installable userscript or working farming automation yet. Features below are planned, and game integration still needs to be researched and tested.

## Planned features

- Track Coins earned and spent during a session.
- Compare crop profits using purchase cost, sale value, and growth time.
- Show harvest reminders and farming recommendations.
- Explore user-controlled farming assistance after verifying the game's integration points.

This project does not grant unlimited Coins or modify server balances. Donuts and Magic Dust are outside its scope.

## Platform plan

The first implementation is planned as a JavaScript userscript for Tampermonkey or Violentmonkey.

| Platform | Project status |
| --- | --- |
| Magic Garden in a browser | Planned; untested |
| Discord Activity in a browser | Planned; frame matching and integration need testing |
| Discord desktop app | Unsupported by the planned browser userscript |
| Discord mobile app | Unsupported by the planned browser userscript |

For Discord play, use Discord in Chrome, Edge, or Firefox. Browser extensions cannot be installed inside the Discord desktop app.

## Getting started

Clone the repository:

```bash
git clone https://github.com/AnasaAyatan/MagicGarden-CoinFarmer.git
cd MagicGarden-CoinFarmer
```

Currently, this repository contains project documentation and configuration only. There are no build commands, dependencies, or installation steps for a mod yet.

## Development roadmap

1. Identify the game's available state and browser integration points.
2. Build a minimal overlay and verify it in the game and Discord browser Activity.
3. Add earnings tracking and a crop-profit calculator.
4. Test farming assistance before advertising it as supported.
5. Publish a versioned userscript with installation instructions.

## Issues and contributions

Use [GitHub Issues](https://github.com/AnasaAyatan/MagicGarden-CoinFarmer/issues) for suggestions and reproducible bugs. Include your browser, whether you play on the website or Discord, and steps to reproduce. Remove account tokens and personal information from logs or screenshots.

## License

[MIT](LICENSE), copyright 2026 AnasaAyatan.

Independent community project; not affiliated with Magic Garden or Discord.
