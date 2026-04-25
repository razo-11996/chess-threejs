import type { Square } from 'chess.js'
import type { BoardGrid } from '../types/chess.types'

const FILES = 'abcdefgh' as const

/** Board file index 0–7 and rank index 0–7 (rank 1 = z 0) → algebraic square. */
export function toSquare(x: number, z: number): Square {
  return `${FILES[x]}${z + 1}` as Square
}

export function pieceAtSquare(board: BoardGrid, algebraic: Square) {
  for (let z = 0; z < 8; z++) {
    for (let x = 0; x < 8; x++) {
      if (toSquare(x, z) === algebraic) return board[z][x]
    }
  }
  return null
}
