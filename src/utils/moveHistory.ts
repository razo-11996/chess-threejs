import type { MovePair } from '../types/ui.types'

export function pairsFromHistory(history: string[]): MovePair[] {
  const pairs: MovePair[] = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      num: pairs.length + 1,
      white: history[i]!,
      black: history[i + 1] ?? null,
    })
  }
  return pairs
}
