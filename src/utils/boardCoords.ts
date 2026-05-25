import type { Square } from 'chess.js'
import type { BoardGrid } from '../types/chess.types'

const FILES = 'abcdefgh' as const

/** Board file index 0–7 and rank index 0–7 (rank 1 = z 0) → algebraic square. */
export function toSquare(x: number, z: number): Square {
  return `${FILES[x]}${z + 1}` as Square
}

/** Board grid (file, rank) → world [x, y, z]. Mirrors the layout used by `Square` and `Pieces`. */
export function boardToWorld(x: number, z: number): [number, number, number] {
  return [3.5 - x, 0, z - 3.5]
}

/** Algebraic square (e.g. `e4`) → world [x, y, z]. */
export function squareToWorld(square: Square): [number, number, number] {
  const file = square.charCodeAt(0) - 97 // 'a'.charCodeAt(0)
  const rank = Number(square[1]) - 1
  return boardToWorld(file, rank)
}

export function pieceAtSquare(board: BoardGrid, algebraic: Square) {
  for (let z = 0; z < 8; z++) {
    for (let x = 0; x < 8; x++) {
      if (toSquare(x, z) === algebraic) return board[z][x]
    }
  }
  return null
}
