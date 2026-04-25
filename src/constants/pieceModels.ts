import type { PieceSymbol } from 'chess.js'

export const PIECE_MODEL_URL: Record<PieceSymbol, string> = {
  p: '/models/pawn/scene.gltf',
  r: '/models/rook/scene.gltf',
  n: '/models/knight/scene.gltf',
  b: '/models/bishop/scene.gltf',
  q: '/models/queen/scene.gltf',
  k: '/models/king/scene.gltf',
}

/**
 * Target vertical extent after upright orientation (board square ≈ 1).
 * Kept in a tight band so the set reads as one scale.
 */
export const PIECE_TARGET_HEIGHT: Record<PieceSymbol, number> = {
  p: 0.8,
  n: 0.78,
  b: 0.8,
  r: 0.76,
  q: 0.84,
  k: 0.84,
}

/**
 * Euler (rx, ry, rz) in radians — fixes Sketchfab axis conventions before scaling.
 * Knight mesh is tall on Z; rook export swaps Y/Z so it lies flat without this.
 */
export const PIECE_PRE_ROTATION: Record<PieceSymbol, [number, number, number]> = {
  p: [0, 0, 0],
  r: [-Math.PI / 2, 0, 0],
  n: [-Math.PI / 2, 0, 0],
  b: [0, 0, 0],
  q: [0, 0, 0],
  k: [0, 0, 0],
}

/** Extra yaw (radians) after upright fix — knight mesh default faces backward without this. */
export const PIECE_YAW_OFFSET: Record<PieceSymbol, number> = {
  p: 0,
  r: 0,
  n: Math.PI / 2,
  b: 0,
  q: 0,
  k: 0,
}
