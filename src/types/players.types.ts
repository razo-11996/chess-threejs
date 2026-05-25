import type { PieceColor } from './game.types'

export type AIEngine = 'stockfish'

/**
 * One side's controller. Adding `'human-remote'` later is the planned hook
 * for networked 2-player play; the game store already guards input on any
 * non-`'human-local'` player so no further routing changes are needed.
 */
export type Player =
  | { kind: 'human-local' }
  | { kind: 'ai'; engine: AIEngine; skillLevel: number; moveTimeMs: number }

export type Players = Record<PieceColor, Player>

export type GameMode = 'human-vs-human' | 'human-vs-ai-white' | 'human-vs-ai-black' | 'ai-vs-ai'

export const DEFAULT_AI_SKILL = 5
export const DEFAULT_AI_MOVE_TIME_MS = 800
