import { create } from 'zustand'
import type { Square } from 'chess.js'
import { playNewGame, playPieceSelect, playSoundForMove } from '../audio/chessSounds'
import type { GameStore } from '../types/game.types'
import { chess, takeGameSnapshot } from './chessGame'

export const useGameStore = create<GameStore>((set, get) => ({
  ...takeGameSnapshot(),
  selected: null,
  possibleMoves: [],

  selectSquare: (square) => {
    if (chess.isGameOver()) return

    if (!square) {
      set({ selected: null, possibleMoves: [] })
      return
    }

    const sq = square
    const piece = chess.get(sq)
    if (!piece || piece.color !== chess.turn()) return

    const verbose = chess.moves({ square: sq, verbose: true })
    playPieceSelect()
    set({
      selected: square,
      possibleMoves: verbose.map((m) => m.to),
    })
  },

  move: (to) => {
    const { selected } = get()
    if (!selected || chess.isGameOver()) return

    const move = chess.move({
      from: selected,
      to,
      promotion: 'q',
    })

    if (move) {
      playSoundForMove(move, chess)
      set({
        ...takeGameSnapshot(),
        selected: null,
        possibleMoves: [],
      })
    }
  },

  newGame: () => {
    chess.reset()
    playNewGame()
    set({
      ...takeGameSnapshot(),
      selected: null,
      possibleMoves: [],
    })
  },
}))
