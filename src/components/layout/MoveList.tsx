import { useEffect, useMemo, useRef } from 'react'
import { useGameStore } from '../../game/gameStore'
import { pairsFromHistory } from '../../utils/moveHistory'

export default function MoveList() {
  const moveHistory = useGameStore((s) => s.moveHistory)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pairs = useMemo(() => pairsFromHistory(moveHistory), [moveHistory])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [moveHistory.length])

  return (
    <div className="pointer-events-auto flex min-h-0 w-full flex-1 flex-col rounded-xl border border-amber-900/25 bg-stone-950/80 shadow-lg backdrop-blur-md sm:min-h-[8rem]">
      <p className="shrink-0 border-b border-amber-900/20 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-400">
        Moves
      </p>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 max-sm:max-h-[min(38vh,220px)]"
      >
        {pairs.length === 0 ? (
          <p className="px-1 py-3 text-center text-xs text-stone-500">No moves yet</p>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-stone-200">
            <tbody>
              {pairs.map((row) => (
                <tr key={row.num} className="border-b border-stone-800/60 last:border-0">
                  <td className="w-7 py-1 pr-1 align-top text-xs tabular-nums text-stone-500">
                    {row.num}.
                  </td>
                  <td className="py-1 pr-1 font-mono text-[13px] text-stone-100">{row.white}</td>
                  <td className="py-1 font-mono text-[13px] text-stone-300">{row.black ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
