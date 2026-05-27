import { Text } from '@react-three/drei'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

/** Matches `inset` in `BoardFrame` so labels sit centered on the rim's top face. */
const RIM_OFFSET = 4.18
/** Slightly above the rim's top surface (rim top ≈ 0.12) to avoid z-fighting. */
const RIM_TOP_Y = 0.13

const FONT_SIZE = 0.22
const LABEL_COLOR = '#e7d8be'
const FILL_OPACITY = 0.9

/**
 * Algebraic notation along all four rims, as on a tournament board.
 *
 * - **Files (`a`–`h`)** sit on the rank-1 and rank-8 rims, centered over each
 *   file column.
 * - **Ranks (`1`–`8`)** sit on the a-file and h-file rims, centered over each
 *   rank row.
 *
 * Each label is rotated to lie flat on the rim with its "up" pointing outward,
 * so the text reads correctly whichever side the camera is on. Reading
 * direction is irrelevant for single characters — placement does the work.
 */
export default function BoardNotation() {
  return (
    <group>
      {FILES.map((file, i) => (
        <Text
          key={`file-bottom-${file}`}
          position={[3.5 - i, RIM_TOP_Y, -RIM_OFFSET]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={FONT_SIZE}
          color={LABEL_COLOR}
          fillOpacity={FILL_OPACITY}
          anchorX="center"
          anchorY="middle"
        >
          {file}
        </Text>
      ))}

      {FILES.map((file, i) => (
        <Text
          key={`file-top-${file}`}
          position={[3.5 - i, RIM_TOP_Y, RIM_OFFSET]}
          rotation={[-Math.PI / 2, 0, Math.PI]}
          fontSize={FONT_SIZE}
          color={LABEL_COLOR}
          fillOpacity={FILL_OPACITY}
          anchorX="center"
          anchorY="middle"
        >
          {file}
        </Text>
      ))}

      {RANKS.map((rank, i) => (
        <Text
          key={`rank-left-${rank}`}
          position={[RIM_OFFSET, RIM_TOP_Y, i - 3.5]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          fontSize={FONT_SIZE}
          color={LABEL_COLOR}
          fillOpacity={FILL_OPACITY}
          anchorX="center"
          anchorY="middle"
        >
          {rank}
        </Text>
      ))}

      {RANKS.map((rank, i) => (
        <Text
          key={`rank-right-${rank}`}
          position={[-RIM_OFFSET, RIM_TOP_Y, i - 3.5]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          fontSize={FONT_SIZE}
          color={LABEL_COLOR}
          fillOpacity={FILL_OPACITY}
          anchorX="center"
          anchorY="middle"
        >
          {rank}
        </Text>
      ))}
    </group>
  )
}
