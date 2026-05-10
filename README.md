# Chess R3F Advanced

Interactive chess in the browser: **React Three Fiber** + **Three.js** for the board and GLTF pieces, **chess.js** for rules, **Zustand** for game state (turn, selection, legal moves, board snapshots), and **Tailwind** for the layout shell around the canvas.

Use it as a portfolio piece or interview demo.

## Features

- Full legal moves, turn order, check / checkmate / stalemate / draw detection
- Click a piece to see destinations; illegal moves are ignored
- 3D board with orbit controls, soft shadows, tone mapping, and environment lighting
- Move list, turn / check status, and **New game** in a sidebar; on-canvas input hints overlay
- Context-aware audio (captures, castling, promotion, check, game end): MP3 in `public/sounds/` with **Web Audio** fallbacks when files or autoplay block playback
- Pawn promotion promotes to queen by default (see `promotion` in the game store if you extend the UI)

## Requirements

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm (ships with Node; repo includes `package-lock.json`)

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command                  | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `npm run dev`            | Start Vite dev server                                 |
| `npm run build`          | Production build to `dist/` ([`vite.config.ts`](vite.config.ts)) |
| `npm run preview`        | Serve `dist/` locally                                 |
| `npm run format`         | Format with Prettier                                  |
| `npm run format:check`   | Check formatting only                                 |

## Project layout

```
src/
  audio/           MP3 playback + Web Audio fallbacks
  components/
    board/         Squares, frame, piece placement
    layout/        DOM sidebar (moves, status, help overlay)
    pieces/        GLTF piece meshes
    scene/         Canvas, lights, table, controls
  constants/       Model URLs and piece tuning
  game/            chess.js instance + Zustand store
  types/           Shared TypeScript types
  utils/           Board coordinates, move list helpers
public/
  models/          Piece GLTF assets
  sounds/          Optional MP3 clips
```

## Tech stack

- [Vite](https://vitejs.dev/) · [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) · [@react-three/drei](https://github.com/pmndrs/drei) · [Three.js](https://threejs.org/)
- [chess.js](https://github.com/jhlywa/chess.js) · [Zustand](https://github.com/pmndrs/zustand) · [Tailwind CSS](https://tailwindcss.com/)
