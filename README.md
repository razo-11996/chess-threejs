# Chess R3F Advanced

Interactive chess in the browser: **React Three Fiber** + **Three.js** for the board and GLTF pieces, **chess.js** for rules and game state, **Zustand** for UI state, **Tailwind** for the shell.

Use it as a portfolio piece or interview demo.

## Features

- Full legal moves, turn order, check / checkmate / stalemate / draw detection
- 3D board with orbit controls, shadows, and environment lighting
- Move list, status, and new game in a sidebar
- Piece move / selection audio (files in `public/sounds/`, with Web Audio fallbacks)

## Requirements

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm (ships with Node)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command                  | Description                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `npm run dev`            | Start Vite dev server                                                                               |
| `npm run build`          | Production build to `dist/` (`base` defaults to `/`)                                                |
| `npm run preview`        | Serve `dist/` locally                                                                               |
| `npm run format`         | Format with Prettier                                                                                |
| `npm run format:check`   | Check formatting only                                                                               |
| `npm run build:gh-pages` | Example build with a fixed subpath (edit the repo segment in `package.json` if you use it manually) |

## Project layout

```
src/
  audio/           Web Audio + file sounds
  components/
    board/         Squares, frame, piece placement
    layout/        DOM sidebar (moves, status, guide)
    pieces/        GLTF piece mesh
    scene/         Canvas, lights, table
  constants/       Model URLs and piece tuning
  game/            chess.js instance + Zustand store
  types/           Shared TypeScript types
  utils/           Board coordinates, move list helpers
public/
  models/          Piece GLTF assets
  sounds/          Optional MP3 clips
```

## Deploy

### GitHub Pages (free)

The repo includes [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml). It builds with `VITE_BASE_URL=/<repository-name>/` so assets resolve on a project site.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment**: set **Source** to **GitHub Actions**.
3. After the workflow succeeds, the site is available at `https://<username>.github.io/<repository>/`.

Pushes to `main` or `master` trigger a deploy; you can also run the workflow manually from the **Actions** tab.

### Other static hosts (Netlify, Vercel, Cloudflare Pages)

Use the default build:

```bash
npm run build
```

Publish the `dist/` folder. Keep `base` as `/` (default in [`vite.config.ts`](vite.config.ts)) unless the app is served from a subpath—in that case set:

```bash
VITE_BASE_URL=/your-subpath/ npm run build
```

This project already includes [`netlify.toml`](netlify.toml) with `publish = "dist"` for Netlify.

## Tech stack

- [Vite](https://vitejs.dev/) · [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) · [@react-three/drei](https://github.com/pmndrs/drei) · [Three.js](https://threejs.org/)
- [chess.js](https://github.com/jhlywa/chess.js) · [Zustand](https://github.com/pmndrs/zustand) · [Tailwind CSS](https://tailwindcss.com/)
