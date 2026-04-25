import { useGameStore } from '../../game/gameStore'

export default function GameStatusCard() {
  const turn = useGameStore((s) => s.turn)
  const inCheck = useGameStore((s) => s.inCheck)
  const resultMessage = useGameStore((s) => s.resultMessage)
  const newGame = useGameStore((s) => s.newGame)

  const side = turn === 'w' ? 'White' : 'Black'

  return (
    <div className="rounded-xl border border-amber-900/25 bg-stone-950/90 px-4 py-3 text-stone-100 shadow-lg backdrop-blur-md">
      {resultMessage ? (
        <p className="text-center text-base font-semibold tracking-tight text-amber-50">
          {resultMessage}
        </p>
      ) : (
        <p className="text-center text-base font-semibold tracking-tight">
          {side} to move
          {inCheck ? <span className="ml-2 text-amber-400">· Check</span> : null}
        </p>
      )}
      <button
        type="button"
        onClick={newGame}
        className="mt-3 w-full rounded-lg bg-amber-900/50 px-3 py-2 text-sm font-medium text-amber-50 ring-1 ring-amber-700/40 transition hover:bg-amber-800/60"
      >
        New game
      </button>
    </div>
  )
}
