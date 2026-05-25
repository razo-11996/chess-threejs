import stockfishWorkerUrl from 'stockfish.js/stockfish.js?url'

/**
 * Minimal UCI wrapper around the Stockfish web worker.
 *
 * Stockfish is single-threaded and stateful: only one search runs at a time and
 * each `position` + `go` must be paired with exactly one `bestmove` reply. We
 * serialize requests through a FIFO and treat cancellation as "drop the result"
 * rather than trying to interleave commands.
 */

export type UciMove = {
  from: string
  to: string
  /** UCI promotion letter: q | r | b | n. */
  promotion?: string
}

export type RequestOpts = {
  moveTimeMs: number
  skillLevel: number
}

type Pending = {
  fen: string
  opts: RequestOpts
  resolve: (move: UciMove | null) => void
  cancelled: boolean
}

let worker: Worker | null = null
let queue: Pending[] = []
let active: Pending | null = null
let currentSkill = -1

function ensureWorker(): Worker {
  if (worker) return worker
  const w = new Worker(stockfishWorkerUrl)
  w.addEventListener('message', handleMessage)
  w.postMessage('uci')
  w.postMessage('isready')
  worker = w
  return w
}

function handleMessage(event: MessageEvent) {
  const line = typeof event.data === 'string' ? event.data : String(event.data)
  if (!line.startsWith('bestmove') || !active) return

  const finished = active
  active = null

  const uci = line.split(/\s+/)[1]
  if (finished.cancelled || !uci || uci === '(none)') {
    finished.resolve(null)
  } else {
    finished.resolve(parseUciMove(uci))
  }
  pump()
}

function parseUciMove(uci: string): UciMove {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  }
}

function applySkill(w: Worker, level: number) {
  const clamped = Math.max(0, Math.min(20, Math.round(level)))
  if (clamped === currentSkill) return
  currentSkill = clamped
  w.postMessage(`setoption name Skill Level value ${clamped}`)
}

function pump() {
  if (active || queue.length === 0) return
  const next = queue.shift()!
  if (next.cancelled) {
    next.resolve(null)
    pump()
    return
  }

  active = next
  const w = ensureWorker()
  applySkill(w, next.opts.skillLevel)
  w.postMessage(`position fen ${next.fen}`)
  w.postMessage(`go movetime ${next.opts.moveTimeMs}`)
}

/**
 * Enqueue a move request. Resolves with `null` if the request is aborted
 * (e.g. user starts a new game mid-think) or the engine returns no move.
 */
export function requestMove(fen: string, opts: RequestOpts): Promise<UciMove | null> {
  return new Promise((resolve) => {
    queue.push({ fen, opts, resolve, cancelled: false })
    pump()
  })
}

/**
 * Cancel all pending and in-flight searches. Pending requests resolve with
 * `null` immediately; the in-flight search still emits a `bestmove`, but it
 * is dropped in `handleMessage` because `cancelled` is set.
 */
export function abort() {
  for (const p of queue) p.cancelled = true
  if (active) {
    active.cancelled = true
    worker?.postMessage('stop')
  }
}

export function resetEngine() {
  worker?.postMessage('ucinewgame')
}
