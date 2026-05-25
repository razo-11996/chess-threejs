import { useMemo } from 'react'
import { useGameStore } from '../../game/gameStore'
import type { SquareProps } from '../../types/board.types'
import { pieceAtSquare, toSquare } from '../../utils/boardCoords'

export default function Square({ x, z }: SquareProps) {
  const board = useGameStore((s) => s.board)
  const selected = useGameStore((s) => s.selected)
  const possibleMoves = useGameStore((s) => s.possibleMoves)
  const resultMessage = useGameStore((s) => s.resultMessage)
  const thinking = useGameStore((s) => s.thinking)
  const players = useGameStore((s) => s.players)
  const turn = useGameStore((s) => s.turn)
  const selectSquare = useGameStore((s) => s.selectSquare)
  const move = useGameStore((s) => s.move)

  const interactionLocked = Boolean(resultMessage) || thinking || players[turn].kind !== 'human-local'

  const isDark = (x + z) % 2 === 0
  const square = toSquare(x, z)

  const piece = board[z][x]
  const isSelected = selected === square
  const isValidMove = possibleMoves?.includes(square)
  const selectedPiece = selected ? pieceAtSquare(board, selected) : null

  const handleClick = () => {
    if (interactionLocked) return

    if (!selected) {
      if (!piece) return
      selectSquare(square)
      return
    }

    if (selected === square) {
      selectSquare(null)
      return
    }

    if (isValidMove) {
      move(square)
      return
    }

    if (piece && selectedPiece && piece.color === selectedPiece.color) {
      selectSquare(square)
      return
    }

    if (!piece) selectSquare(null)
  }

  const materialProps = useMemo(() => {
    const lightSq = '#e6d5bc'
    const darkSq = '#7a6149'
    const base = isDark ? darkSq : lightSq

    if (isSelected) {
      return {
        color: base,
        roughness: 0.72,
        metalness: 0.04,
        emissive: '#1e6fd4',
        emissiveIntensity: 0.45,
        envMapIntensity: 0.4,
      }
    }
    if (isValidMove) {
      return {
        color: base,
        roughness: 0.72,
        metalness: 0.04,
        emissive: '#2e9a4a',
        emissiveIntensity: 0.38,
        envMapIntensity: 0.4,
      }
    }
    return {
      color: base,
      roughness: 0.82,
      metalness: 0.03,
      emissive: '#000000',
      emissiveIntensity: 0,
      envMapIntensity: 0.35,
    }
  }, [isDark, isSelected, isValidMove])

  return (
    <mesh
      position={[3.5 - x, 0, z - 3.5]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = interactionLocked ? 'default' : 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}
