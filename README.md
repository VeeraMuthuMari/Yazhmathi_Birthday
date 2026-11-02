# Veera's Magical Birthday

## Development

Requires Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Vite listens on `0.0.0.0:5173`, so the app is available at `http://localhost:5173/` and `http://192.168.1.127:5173/` while this machine is on the configured LAN. If port 5173 is occupied, stop the service that owns it before starting this project; strict port mode intentionally does not choose another port.

Keep the development server on a trusted local network. Do not forward port 5173 through a router or expose it to the public internet; apply the machine firewall's normal LAN-only rules.

## Validation

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
```
