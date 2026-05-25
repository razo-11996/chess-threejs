import { Chess } from 'chess.js'
import type { BoardGrid } from '../types/chess.types'
import type { GameSnapshot } from '../types/game.types'

export const chess = new Chess()

/** chess.js uses row 0 = rank 8; UI uses z = 0 = rank 1 */
export function normalizeBoard(raw: BoardGrid): BoardGrid {
  return [...raw].reverse()
}

function gameResultMessage(): string | null {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White'
    return `Checkmate — ${winner} wins`
  }
  if (chess.isStalemate()) return 'Stalemate — draw'
  if (chess.isDraw()) return 'Draw'
  return null
}

export function takeGameSnapshot(): GameSnapshot {
  const verbose = chess.history({ verbose: true })
  const last = verbose[verbose.length - 1]
  return {
    board: normalizeBoard(chess.board()),
    turn: chess.turn(),
    resultMessage: gameResultMessage(),
    inCheck: !chess.isGameOver() && chess.isCheck(),
    moveHistory: chess.history(),
    lastMove: last ? { from: last.from, to: last.to } : null,
  }
}
