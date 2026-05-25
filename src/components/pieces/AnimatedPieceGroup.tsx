import { useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type Props = {
  /** World position to animate from. `null` ⇒ no animation, mount at `to`. */
  from: [number, number, number] | null
  to: [number, number, number]
  children: ReactNode
}

const DURATION_S = 0.32
const ARC_HEIGHT = 0.35

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Wraps a piece mesh and tweens its group position from `from` to `to` on mount.
 *
 * `Pieces` keys each piece by its current square, so React always unmounts the
 * old occupant and mounts a new component at the destination. When that new
 * component is the destination of `lastMove`, we set its `from` to the source
 * square's world position so it visually slides over from there.
 */
export default function AnimatedPieceGroup({ from, to, children }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const startTimeRef = useRef<number | null>(null)
  const doneRef = useRef(from === null)

  useFrame((state) => {
    if (doneRef.current || !groupRef.current || !from) return

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime
    }
    const elapsed = state.clock.elapsedTime - startTimeRef.current
    const tRaw = Math.min(1, elapsed / DURATION_S)
    const t = easeOutCubic(tRaw)

    groupRef.current.position.x = from[0] + (to[0] - from[0]) * t
    groupRef.current.position.y = Math.sin(tRaw * Math.PI) * ARC_HEIGHT
    groupRef.current.position.z = from[2] + (to[2] - from[2]) * t

    if (tRaw >= 1) {
      groupRef.current.position.set(to[0], 0, to[2])
      doneRef.current = true
    }
  })

  return (
    <group ref={groupRef} position={from ?? to}>
      {children}
    </group>
  )
}
