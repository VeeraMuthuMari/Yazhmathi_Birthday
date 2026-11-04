# Veera Yazhmathi — Magical Birthday Playground

## Development

Requires Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Vite listens on `0.0.0.0:8888`, so the app is available at `http://localhost:8888/` and `http://192.168.1.127:8888/` while this machine is on the configured LAN. If port 8888 is occupied, stop the service that owns it before starting this project; strict port mode intentionally does not choose another port.

Keep the development server on a trusted local network. Do not forward port 8888 through a router or expose it to the public internet; apply the machine firewall's normal LAN-only rules.

## Birthday games

The home page opens into a royal-colour birthday playground for Veera's third birthday on 07 November 2026. Children can pop balloons, light three candles, collect magic stars, decorate and rotate/zoom the genuine TresJS 3D cake, and open a surprise gift. Completing all five games unlocks the celebration screen. Game controls support touch and mouse, include replay controls, and respect reduced-motion preferences. Music and playful sound effects begin only after a visitor interacts with the page.

## Baby photographs

The project includes ten licensed sample baby photographs in `src/assets/images/baby/dummy/`, named `baby-01.webp` through `baby-10.webp`. They are illustrative stock portraits, not photographs of Veera. The images are by Vyacheslav Argenberg and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); the photo viewer links to each image's source. `src/data/dummyPhotoCredits.json` contains the per-image source metadata.

To replace a sample, overwrite its matching `baby-NN.webp` file with a family photograph, then remove that filename's credit entry from `src/data/dummyPhotoCredits.json`. The photo configuration and section compositions live in `src/data/babyPhotos.ts`; no component edits are needed. Keep each image reasonably sized. Non-hero floating portraits are lazy-loaded; hero portraits receive high fetch priority.

The site uses royal-purple, midnight, rainbow and champagne-gold gradients; baby photos are occasional floating foreground portraits, never full-screen backgrounds. If all images are removed, the game experience still works without photo placeholders.

## Validation

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
```
