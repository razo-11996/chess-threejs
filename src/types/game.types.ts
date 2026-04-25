import type { Square } from 'chess.js'
import type { BoardGrid } from './chess.types'

export type PieceColor = 'w' | 'b'

export type GameSnapshot = {
  board: BoardGrid
  turn: PieceColor
  resultMessage: string | null
  inCheck: boolean
  moveHistory: string[]
}

export type GameStore = GameSnapshot & {
  selected: Square | null
  possibleMoves: Square[]
  selectSquare: (square: Square | null) => void
  move: (to: Square) => void
  newGame: () => void
}
