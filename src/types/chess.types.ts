import type { Chess } from 'chess.js'

/** Normalized board rows: UI z=0 is White's back rank (rank 1). */
export type BoardGrid = ReturnType<Chess['board']>
