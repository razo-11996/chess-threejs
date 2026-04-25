import type { Chess, Move } from 'chess.js'

/**
 * Audio files in `public/sounds/` (Vite serves them as `/sounds/...`).
 * Add more files and extend `CLIP` / the `play*` functions as needed.
 */
const CLIP = {
  move: '/sounds/move.mp3',
  preview: '/sounds/preview.mp3',
} as const

const VOLUME = 0.42

function tryPlayUrl(url: string, fallback: () => void) {
  const a = new Audio(url)
  a.volume = VOLUME
  void a.play().catch(() => fallback())
}

/* ——— Web Audio fallback ——— */

let audioCtx: AudioContext | null = null

function ctx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )()
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume()
  return audioCtx
}

function now() {
  return ctx().currentTime
}

function tone(freq: number, duration: number, when: number, type: OscillatorType, peak = 0.1) {
  const c = ctx()
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, when)
  g.gain.setValueAtTime(0.0001, when)
  g.gain.exponentialRampToValueAtTime(peak, when + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, when + duration)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(when)
  osc.stop(when + duration + 0.02)
}

function synthPieceSelect() {
  try {
    const t = now()
    tone(620, 0.045, t, 'sine', 0.06)
  } catch {
    /* ignore */
  }
}

function synthMove() {
  try {
    const t = now()
    tone(340, 0.07, t, 'triangle', 0.09)
  } catch {
    /* ignore */
  }
}

function synthCastle() {
  try {
    const t = now()
    tone(280, 0.055, t, 'sine', 0.075)
    tone(360, 0.055, t + 0.04, 'sine', 0.065)
  } catch {
    /* ignore */
  }
}

function synthCapture() {
  try {
    const c = ctx()
    const t = now()
    const dur = 0.09
    const bufferSize = c.sampleRate * dur
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35)) * 0.45
    }
    const src = c.createBufferSource()
    src.buffer = buffer
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.14, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(g)
    g.connect(c.destination)
    src.start(t)
    tone(180, 0.11, t, 'sine', 0.07)
  } catch {
    /* ignore */
  }
}

function synthCheck() {
  try {
    const t = now()
    tone(520, 0.06, t, 'square', 0.05)
    tone(700, 0.08, t + 0.07, 'square', 0.055)
  } catch {
    /* ignore */
  }
}

function synthPromotion() {
  try {
    const t = now()
    tone(440, 0.05, t, 'sine', 0.07)
    tone(554, 0.06, t + 0.05, 'sine', 0.08)
    tone(659, 0.08, t + 0.1, 'sine', 0.085)
  } catch {
    /* ignore */
  }
}

function synthGameEnd(win: boolean) {
  try {
    const t = now()
    if (win) {
      tone(392, 0.12, t, 'sine', 0.09)
      tone(523, 0.14, t + 0.11, 'sine', 0.095)
      tone(659, 0.2, t + 0.24, 'sine', 0.1)
    } else {
      tone(330, 0.15, t, 'triangle', 0.08)
      tone(294, 0.2, t + 0.14, 'triangle', 0.075)
    }
  } catch {
    /* ignore */
  }
}

function synthNewGame() {
  try {
    const t = now()
    tone(523, 0.06, t, 'sine', 0.065)
    tone(659, 0.08, t + 0.07, 'sine', 0.07)
  } catch {
    /* ignore */
  }
}

export function playPieceSelect() {
  tryPlayUrl(CLIP.preview, synthPieceSelect)
}

export function playMove() {
  tryPlayUrl(CLIP.move, synthMove)
}

export function playCastle() {
  tryPlayUrl(CLIP.move, synthCastle)
}

export function playCapture() {
  tryPlayUrl(CLIP.move, synthCapture)
}

export function playCheck() {
  tryPlayUrl(CLIP.move, synthCheck)
}

export function playPromotion() {
  tryPlayUrl(CLIP.move, synthPromotion)
}

export function playGameEnd(win: boolean) {
  tryPlayUrl(CLIP.move, () => synthGameEnd(win))
}

export function playNewGame() {
  tryPlayUrl(CLIP.preview, synthNewGame)
}

/**
 * After a successful `chess.move()` — `chess` must already reflect the new position.
 */
export function playSoundForMove(move: Move, chess: Chess) {
  try {
    if (chess.isCheckmate()) {
      playGameEnd(true)
      return
    }
    if (chess.isStalemate()) {
      playGameEnd(false)
      return
    }
    if (chess.isDraw()) {
      playGameEnd(false)
      return
    }
    if (chess.isCheck()) {
      playCheck()
      return
    }
    if (move.isPromotion()) {
      playPromotion()
      return
    }
    if (move.isCapture() || move.isEnPassant()) {
      playCapture()
      return
    }
    if (move.isKingsideCastle() || move.isQueensideCastle()) {
      playCastle()
      return
    }
    playMove()
  } catch {
    /* ignore */
  }
}
