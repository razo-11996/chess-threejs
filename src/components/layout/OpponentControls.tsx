import { useMemo } from 'react'
import { useGameStore } from '../../game/gameStore'
import type { PieceColor } from '../../types/game.types'
import {
  DEFAULT_AI_MOVE_TIME_MS,
  DEFAULT_AI_SKILL,
  type Player,
  type Players,
} from '../../types/players.types'

type Mode = 'human-vs-human' | 'human-vs-ai' | 'ai-vs-ai'

type ModeOption = {
  id: Mode
  title: string
  description: string
}

const MODE_OPTIONS: ModeOption[] = [
  { id: 'human-vs-human', title: 'Pass & play', description: 'Two humans share the board' },
  { id: 'human-vs-ai', title: 'Play vs AI', description: 'Challenge Stockfish' },
  { id: 'ai-vs-ai', title: 'Watch AI', description: 'Stockfish plays itself' },
]

const SKILL_TIERS: Array<{ max: number; label: string; hint: string }> = [
  { max: 3, label: 'Beginner', hint: 'Plays casually, blunders often' },
  { max: 7, label: 'Casual', hint: 'Comfortable but forgiving' },
  { max: 12, label: 'Intermediate', hint: 'Solid club-level play' },
  { max: 16, label: 'Advanced', hint: 'Tactical and accurate' },
  { max: 20, label: 'Master', hint: 'Near full strength' },
]

function tierFor(skill: number) {
  return SKILL_TIERS.find((t) => skill <= t.max) ?? SKILL_TIERS[SKILL_TIERS.length - 1]
}

function deriveMode(players: Players): Mode {
  const w = players.w.kind
  const b = players.b.kind
  if (w === 'human-local' && b === 'human-local') return 'human-vs-human'
  if (w === 'ai' && b === 'ai') return 'ai-vs-ai'
  return 'human-vs-ai'
}

function deriveHumanColor(players: Players): PieceColor {
  return players.b.kind === 'ai' ? 'w' : 'b'
}

function deriveSkill(players: Players): number {
  if (players.w.kind === 'ai') return players.w.skillLevel
  if (players.b.kind === 'ai') return players.b.skillLevel
  return DEFAULT_AI_SKILL
}

function buildPlayers(mode: Mode, humanColor: PieceColor, skill: number): Players {
  const ai: Player = {
    kind: 'ai',
    engine: 'stockfish',
    skillLevel: skill,
    moveTimeMs: DEFAULT_AI_MOVE_TIME_MS,
  }
  const human: Player = { kind: 'human-local' }
  switch (mode) {
    case 'human-vs-human':
      return { w: human, b: human }
    case 'ai-vs-ai':
      return { w: ai, b: ai }
    case 'human-vs-ai':
      return humanColor === 'w' ? { w: human, b: ai } : { w: ai, b: human }
  }
}

export default function OpponentControls() {
  const players = useGameStore((s) => s.players)
  const thinking = useGameStore((s) => s.thinking)
  const setPlayers = useGameStore((s) => s.setPlayers)

  const mode = useMemo(() => deriveMode(players), [players])
  const humanColor = useMemo(() => deriveHumanColor(players), [players])
  const skill = useMemo(() => deriveSkill(players), [players])
  const tier = useMemo(() => tierFor(skill), [skill])

  const aiInvolved = mode !== 'human-vs-human'

  function update(next: { mode?: Mode; humanColor?: PieceColor; skill?: number }) {
    setPlayers(
      buildPlayers(
        next.mode ?? mode,
        next.humanColor ?? humanColor,
        next.skill ?? skill,
      ),
    )
  }

  return (
    <section className="rounded-xl border border-amber-900/25 bg-stone-950/80 p-3 text-stone-200 shadow-lg backdrop-blur-md">
      <header className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Opponent</h2>
        {aiInvolved ? (
          <span
            className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-stone-500"
            aria-live="polite"
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                thinking ? 'animate-pulse bg-amber-400' : 'bg-emerald-500/80'
              }`}
              aria-hidden
            />
            {thinking ? 'Thinking' : 'Ready'}
          </span>
        ) : null}
      </header>

      <div className="mb-3 space-y-1" role="radiogroup" aria-label="Game mode">
        {MODE_OPTIONS.map((opt) => {
          const active = mode === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => update({ mode: opt.id })}
              className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition ${
                active
                  ? 'border-amber-700/60 bg-amber-900/30 text-amber-50 shadow-inner'
                  : 'border-stone-800/70 bg-stone-900/60 text-stone-300 hover:border-stone-700 hover:bg-stone-900'
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                  active ? 'border-amber-300/80' : 'border-stone-600'
                }`}
                aria-hidden
              >
                {active ? <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> : null}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[13px] font-medium">{opt.title}</span>
                <span className="truncate text-[11px] text-stone-500">{opt.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      {mode === 'human-vs-ai' ? (
        <div className="mb-3">
          <p className="mb-1 text-[10px] uppercase tracking-wide text-stone-500">You play</p>
          <div className="grid grid-cols-2 gap-1">
            <SideButton
              active={humanColor === 'w'}
              glyph="♔"
              label="White"
              onClick={() => update({ humanColor: 'w' })}
            />
            <SideButton
              active={humanColor === 'b'}
              glyph="♚"
              label="Black"
              onClick={() => update({ humanColor: 'b' })}
            />
          </div>
        </div>
      ) : null}

      {aiInvolved ? (
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wide text-stone-500">Difficulty</span>
            <span className="text-xs font-semibold text-amber-200">{tier.label}</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={skill}
            onChange={(e) => update({ skill: Number(e.target.value) })}
            className="w-full cursor-pointer accent-amber-700"
            aria-label={`Difficulty: ${tier.label} (skill ${skill})`}
          />
          <div className="mt-0.5 flex justify-between text-[10px] tabular-nums text-stone-600">
            <span>0</span>
            <span>20</span>
          </div>
          <p className="mt-1 text-center text-[11px] leading-snug text-stone-500">
            {tier.hint}
          </p>
        </div>
      ) : null}
    </section>
  )
}

type SideButtonProps = {
  active: boolean
  glyph: string
  label: string
  onClick: () => void
}

function SideButton({ active, glyph, label, onClick }: SideButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-sm transition ${
        active
          ? 'border-amber-700/60 bg-amber-900/30 text-amber-50 shadow-inner'
          : 'border-stone-800/70 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        {glyph}
      </span>
      {label}
    </button>
  )
}
