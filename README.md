# MagicGarden-CoinFarmer

A farming assistant project for Magic Garden, focused on earning spendable Coins through normal gameplay.

## Development status

Version 0.2.0 adds a standalone companion for use alongside Discord desktop. See the instructions below.

Version 0.1.0 includes an installable userscript with a manual Coin session tracker and crop-profit calculator. JavaScript syntax has been checked; live game and Discord browser testing is still needed. It does not automatically read game data, harvest, plant, or sell.

## Features and roadmap

- Available: manually record balances to track net Coin changes and estimated Coins/hour.
- Available: calculate estimated profit per harvest and per hour from entered seed costs, total harvest sale values, harvest intervals, and plot counts.
- Planned: harvest reminders and farming recommendations.
- Explore user-controlled farming assistance after verifying the game's integration points.

This project does not grant unlimited Coins or modify server balances. Donuts and Magic Dust are outside its scope.

## Discord desktop companion (v0.2.0)

You can keep playing Magic Garden in the Discord desktop app and open this companion alongside it. No Tampermonkey is needed for the companion.

1. Use **Code → Download ZIP** on this repository and extract the ZIP.
2. Open `companion.html` in Microsoft Edge.
3. Resize the window and place it beside Discord.

Optional: right-click `Launch-Companion.ps1` and select **Run with PowerShell** to open a separate Edge app window without the normal address bar. Keep it in the same folder as `companion.html`. If Windows blocks the launcher, open the HTML file directly; changing execution policy is unnecessary.

### Companion features and limits

- Manual session tracking with net Coin change and estimated Coins/hour.
- Crop-profit estimates using your entered prices and harvest intervals.
- Session storage in your browser when local storage is available. Keep the file at the same path and use the same browser/profile to retain records; moving it or clearing browser data can lose records.
- Works independently alongside the Discord app; it does not connect to Discord or read the game.
- No automatic harvesting, planting, selling, or unlimited Coins.
- No always-on-top behavior; arrange the windows side by side.
- JavaScript syntax checked. Windows launcher and live browser rendering still require user testing.

## Platform plan

The script runs through Tampermonkey or Violentmonkey.

| Platform | Project status |
| --- | --- |
| Magic Garden in a browser | URL matching included; live testing pending |
| Discord Activity in a browser | Activity frame URL matching included; live testing pending |
| Discord desktop app | Standalone manual companion available; embedded userscript unsupported |
| Discord mobile app | Unsupported by the planned browser userscript |

For Discord play, use Discord in Chrome, Edge, or Firefox. Browser extensions cannot be installed inside the Discord desktop app.

## Getting started

Clone the repository:

```bash
git clone https://github.com/AnasaAyatan/MagicGarden-CoinFarmer.git
cd MagicGarden-CoinFarmer
```

### Install version 0.1.0

1. Install [Tampermonkey](https://www.tampermonkey.net/) in Chrome/Edge or [Violentmonkey](https://violentmonkey.github.io/) in Firefox.
2. Open [coinfarmer.user.js](https://github.com/AnasaAyatan/MagicGarden-CoinFarmer/blob/main/coinfarmer.user.js), select **Raw**, and accept the userscript manager's installation prompt. If no prompt appears, create a new script in the manager and paste the complete file contents.
3. If Tampermonkey is blocked, enable **Allow user scripts** in its browser extension details, or Developer mode if required by your browser.
4. Reload Magic Garden on its website or launch its Activity through [Discord in your browser](https://discord.com/app).
5. Look for the **CoinFarmer 0.1.0** panel at the top right.

The Discord desktop/mobile apps cannot run this browser extension. If the panel does not appear, report your browser and whether you used the website or Discord; both targets still need live testing.

### Using the panel

- Enter your full Coin balance using digits (for example, `22140000000`, rather than `22.14B`) and select **Start new session**.
- After playing, enter the new balance and select **Record balance**. Spending reduces net income; this is not a separate earnings/spending ledger.
- Enter seed cost per planting, total sale value per harvest, minutes between harvests, and plot count, then select **Calculate profit**.
- For regrowing crops, uncheck **Pay seed cost every harvest**. The recurring estimate then excludes initial planting costs.
- **Minimize** collapses the panel. Session records persist through userscript-manager storage when available. The calculator uses your inputs, not a built-in crop or mutation database.

No build step or dependency installation is required. To check syntax locally with Node.js:

```bash
node --check coinfarmer.user.js
```

## Development roadmap

1. Identify the game's available state and browser integration points.
2. Build a minimal overlay and verify it in the game and Discord browser Activity.
3. Add earnings tracking and a crop-profit calculator.
4. Test farming assistance before advertising it as supported.
5. Publish a versioned userscript with installation instructions.

## Issues and contributions

Use [GitHub Issues](https://github.com/AnasaAyatan/MagicGarden-CoinFarmer/issues) for suggestions and reproducible bugs. Include your browser, whether you play on the website or Discord, and steps to reproduce. Remove account tokens and personal information from logs or screenshots.

## License

Copyright 2026 AnasaAyatan. Licensed under the custom [Personal Use License](LICENSE).

- Free to download, install, and use personally for non-commercial purposes.
- Prior written permission is required for modifications (including private changes), redistribution, sharing copies, or selling/commercial use.
- Changing built-in settings and sharing links to this repository are allowed.
- Request permission through [GitHub Issues](https://github.com/AnasaAyatan/MagicGarden-CoinFarmer/issues); wait for explicit written approval.

This is not an open-source license. GitHub's rights for viewing and forking public repositories and applicable statutory rights still apply. Copies previously released under MIT retain their original permissions.

Independent community project; not affiliated with Magic Garden or Discord.
