import GameStatusCard from './GameStatusCard'
import MoveList from './MoveList'

/** Move list + turn: lives in the right column so it does not paint over the 3D board. */
export default function GameSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-stone-800/80 bg-stone-950/40 p-3 sm:h-full sm:min-h-0 sm:w-[11.75rem] sm:border-l sm:bg-stone-950/55 sm:py-4">
      <GameStatusCard />
      <div className="flex min-h-0 flex-1 flex-col sm:overflow-hidden">
        <MoveList />
      </div>
    </aside>
  )
}
