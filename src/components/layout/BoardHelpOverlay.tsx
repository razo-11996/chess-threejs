export default function BoardHelpOverlay() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-10 p-3 sm:p-4">
      <aside className="pointer-events-auto max-w-[17.5rem] rounded-xl border border-amber-900/25 bg-stone-950/90 shadow-xl backdrop-blur-md sm:max-w-xs">
        <h2 className="border-b border-amber-900/20 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-400">
          Guide
        </h2>
        <div className="space-y-3 px-3 py-3 text-xs leading-relaxed text-stone-400">
          <section>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Board
            </h3>
            <p>
              Standard algebraic layout: files{' '}
              <strong className="font-medium text-stone-200">a–h</strong>, ranks{' '}
              <strong className="font-medium text-stone-200">1</strong> (White) through{' '}
              <strong className="font-medium text-stone-200">8</strong> (Black). There are no
              letters on the rim — the <strong className="text-stone-300">Moves</strong> list uses
              the same coordinates.
            </p>
          </section>
          <section>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Controls
            </h3>
            <ul className="space-y-2 [&>li]:pl-0.5">
              <li className="flex gap-2">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-700/90"
                  aria-hidden
                />
                <span>
                  Choose a piece for the side to move (square glows{' '}
                  <span className="font-medium text-sky-300">blue</span>), then a legal target (
                  <span className="font-medium text-emerald-400/95">green</span>).
                </span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-700/90"
                  aria-hidden
                />
                <span>Click the same piece again to clear the selection.</span>
              </li>
              <li className="flex gap-2">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-700/90"
                  aria-hidden
                />
                <span>Drag to orbit; scroll the wheel to zoom in and out.</span>
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  )
}
