import type { Square } from 'chess.js'
import type { BoardGrid } from './chess.types'
import type { Players } from './players.types'

export type PieceColor = 'w' | 'b'

export type LastMove = {
  from: Square
  to: Square
}

export type GameSnapshot = {
  board: BoardGrid
  turn: PieceColor
  resultMessage: string | null
  inCheck: boolean
  moveHistory: string[]
  /** Source + destination of the most recent move; used for board-piece animation. */
  lastMove: LastMove | null
}

export type GameStore = GameSnapshot & {
  selected: Square | null
  possibleMoves: Square[]
  players: Players
  /** True while an AI move is being computed; blocks board input. */
  thinking: boolean
  selectSquare: (square: Square | null) => void
  move: (to: Square) => void
  newGame: () => void
  setPlayers: (next: Players) => void
}
