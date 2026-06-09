# HeatSeeker Matrix — Standalone

A focused, full-screen per-strike per-expiry GEX matrix viewer powered by Unusual Whales — modeled on Skylit's HeatSeeker design.

## Features

- **Real per-expiry GEX data** from UW (`/spot-exposures/{expiry}/strike` endpoint)
- **Multi-expiry matrix** — 5 or 10 expirations side by side
- **Adaptive strike count** — 50 / 80 / 120 / 200 / All
- **King Node markers** (red ★) on the max-GEX strike per expiration column
- **ATM pill** (white) on the strike closest to current spot price
- **Color-coded heatmap** — teal → green → yellow for positive, teal → blue → purple for negative
- **Live local clock** (cyan)
- **PWA-installable** on mobile/desktop
- **API key persists** in browser localStorage (never leaves your device)

## Files in this bundle

| File              | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `index.html`      | The standalone HeatSeeker app                        |
| `manifest.json`   | PWA manifest (for mobile/desktop install)            |
| `service-worker.js` | Offline caching + version management               |
| `icon-192.png`    | App icon (Android home screen / desktop favicon)     |
| `icon-512.png`    | App icon (high-res splash screen)                    |
| `README.md`       | This file                                            |

## Deploy to GitHub Pages

### Option A — New dedicated repo (recommended)

1. On GitHub, create a new public repo named `heatseeker` (or any name you like)
2. Upload all files from this folder to the repo root
3. Go to **Settings → Pages** → set **Source** to "Deploy from branch" → branch = `main`, folder = `/ (root)`
4. Save. After ~30 seconds your app will be live at:
   `https://YOUR_USERNAME.github.io/heatseeker/`

### Option B — Add to existing gexuw repo

1. Upload only `index.html` to your `gexuw` repo, renaming it to `heatseeker.html` first
2. Access it at: `https://YOUR_USERNAME.github.io/gexuw/heatseeker.html`
3. PWA install won't work for this option (manifest/service-worker paths conflict with the main dashboard)

**Option A is recommended** because you can install the HeatSeeker as a separate app icon on your phone, distinct from your main GEX dashboard.

## First-time use

1. Open the live URL in Chrome (works in Safari/Firefox too)
2. Paste your Unusual Whales API token in the API KEY field
3. Enter a ticker (default SPY)
4. Pick **EXPIRATIONS** (5 or 10) and **STRIKES** (default 80)
5. Click **⚡ LOAD**

Your API key is saved to browser localStorage so you only paste it once per device.

## Install as mobile app

**Android (Chrome):** Menu → "Install app" or "Add to Home Screen"
**iPhone (Safari):** Share button → "Add to Home Screen"
**Desktop (Chrome/Edge):** Install icon in URL bar

After installing, it runs full-screen like a native app.

## Cost per load

- 1 stock-state call (spot price)
- N expiration GEX calls where N = EXPIRATIONS dropdown value (5 or 10)
- **Total per Load: 6 or 11 credits**
- Changing STRIKES dropdown: **0 credits** (re-renders cached data)

## Troubleshooting

**Status bar says "0 loaded · 10 empty · 0 failed"**
Your UW account doesn't have GEX data access for that ticker, or the endpoint returned no rows. Try a different ticker (SPY, QQQ, NVDA).

**Status bar says "0 loaded · 0 empty · 10 failed"**
Your API key is wrong or expired. Verify by logging into UW and regenerating.

**Cells show $0 across all columns for a ticker**
That ticker has no listed options on those expirations (likely a thin/illiquid name).

**Bigger numbers than expected**
UW signs put gamma negative already. The standalone uses `net_gex = call_gamma_oi + put_gamma_oi` (sum, not subtract) — same convention as SpotGamma/Skylit.

## Tech notes

- Pure browser app — no backend, no proxy, no Python server
- Calls UW API directly from your browser using your API key
- Your API key never leaves your device (saved only to browser localStorage)
- Network-first service worker — newest version always wins on refresh
- Open DevTools (F12) → Console to see every fetch and its response details
