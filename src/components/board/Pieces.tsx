import { useGameStore } from '../../game/gameStore'
import ChessPieceMesh from '../pieces/ChessPieceMesh'

export default function Pieces() {
  const board = useGameStore((s) => s.board)

  return (
    <group>
      {board.map((row, z) =>
        row.map((cell, x) => {
          if (!cell) return null
          const { square, type, color } = cell
          return (
            <group key={`${square}-${type}-${color}`} position={[x - 3.5, 0, z - 3.5]}>
              <ChessPieceMesh type={type} color={color} />
            </group>
          )
        })
      )}
    </group>
  )
}
