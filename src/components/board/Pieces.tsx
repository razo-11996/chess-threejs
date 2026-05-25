import { useGameStore } from '../../game/gameStore'
import { boardToWorld, squareToWorld } from '../../utils/boardCoords'
import AnimatedPieceGroup from '../pieces/AnimatedPieceGroup'
import ChessPieceMesh from '../pieces/ChessPieceMesh'

export default function Pieces() {
  const board = useGameStore((s) => s.board)
  const lastMove = useGameStore((s) => s.lastMove)

  return (
    <group>
      {board.map((row, z) =>
        row.map((cell, x) => {
          if (!cell) return null
          const { square, type, color } = cell
          const to = boardToWorld(x, z)
          const from = lastMove && lastMove.to === square ? squareToWorld(lastMove.from) : null
          return (
            <AnimatedPieceGroup key={`${square}-${type}-${color}`} from={from} to={to}>
              <ChessPieceMesh type={type} color={color} />
            </AnimatedPieceGroup>
          )
        })
      )}
    </group>
  )
}
