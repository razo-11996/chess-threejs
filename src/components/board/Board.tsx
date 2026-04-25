import Square from './Square'

export default function Board() {
  const squares = []
  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      squares.push(<Square key={`${x}-${z}`} x={x} z={z} />)
    }
  }
  return <group>{squares}</group>
}
