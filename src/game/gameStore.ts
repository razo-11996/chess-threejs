import { create } from 'zustand'
import type { Square } from 'chess.js'
import { playNewGame, playPieceSelect, playSoundForMove } from '../audio/chessSounds'
import type { GameStore } from '../types/game.types'
import type { Players } from '../types/players.types'
import { chess, takeGameSnapshot } from './chessGame'
import {
  abort as engineAbort,
  requestMove as engineRequestMove,
  resetEngine,
} from '../ai/stockfishEngine'

const defaultPlayers: Players = {
  w: { kind: 'human-local' },
  b: { kind: 'human-local' },
}

export const useGameStore = create<GameStore>((set, get) => {
  /**
   * Drive the AI side(s). Called after every successful move, `newGame`, and
   * `setPlayers`. Re-invokes itself so AI-vs-AI plays without further input.
   */
  async function maybeRunEngine() {
    if (chess.isGameOver()) {
      set({ thinking: false })
      return
    }
    const player = get().players[chess.turn()]
    if (player.kind !== 'ai') return

    set({ thinking: true })

    const requested = await engineRequestMove(chess.fen(), {
      moveTimeMs: player.moveTimeMs,
      skillLevel: player.skillLevel,
    })

    if (!requested || chess.isGameOver()) {
      set({ thinking: false })
      return
    }

    const moved = chess.move({
      from: requested.from,
      to: requested.to,
      promotion: requested.promotion ?? 'q',
    })
    if (!moved) {
      set({ thinking: false })
      return
    }

    playSoundForMove(moved, chess)
    set({
      ...takeGameSnapshot(),
      selected: null,
      possibleMoves: [],
      thinking: false,
    })
    void maybeRunEngine()
  }

  function isHumanTurn(): boolean {
    return get().players[chess.turn()].kind === 'human-local'
  }

  return {
    ...takeGameSnapshot(),
    selected: null,
    possibleMoves: [],
    players: defaultPlayers,
    thinking: false,

    selectSquare: (square) => {
      if (chess.isGameOver() || get().thinking || !isHumanTurn()) return

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
      if (!selected || chess.isGameOver() || get().thinking || !isHumanTurn()) return

      const moved = chess.move({
        from: selected,
        to,
        promotion: 'q',
      })

      if (moved) {
        playSoundForMove(moved, chess)
        set({
          ...takeGameSnapshot(),
          selected: null,
          possibleMoves: [],
        })
        void maybeRunEngine()
      }
    },

    newGame: () => {
      engineAbort()
      resetEngine()
      chess.reset()
      playNewGame()
      set({
        ...takeGameSnapshot(),
        selected: null,
        possibleMoves: [],
        thinking: false,
      })
      void maybeRunEngine()
    },

    setPlayers: (next) => {
      engineAbort()
      set({ players: next, thinking: false, selected: null, possibleMoves: [] })
      void maybeRunEngine()
    },
  }
})
