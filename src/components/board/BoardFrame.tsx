import { RoundedBox } from '@react-three/drei'

const wood = (
  <meshStandardMaterial color="#4a3528" roughness={0.72} metalness={0.06} envMapIntensity={0.35} />
)

const edgeH = 8.75
const edgeV = 8.75
const thick = 0.32
const height = 0.16
const y = 0.04
const inset = 4.18

export default function BoardFrame() {
  return (
    <group>
      <RoundedBox
        args={[edgeH, height, thick]}
        radius={0.04}
        smoothness={4}
        position={[0, y, -inset]}
        castShadow
        receiveShadow
      >
        {wood}
      </RoundedBox>
      <RoundedBox
        args={[edgeH, height, thick]}
        radius={0.04}
        smoothness={4}
        position={[0, y, inset]}
        castShadow
        receiveShadow
      >
        {wood}
      </RoundedBox>
      <RoundedBox
        args={[thick, height, edgeV]}
        radius={0.04}
        smoothness={4}
        position={[-inset, y, 0]}
        castShadow
        receiveShadow
      >
        {wood}
      </RoundedBox>
      <RoundedBox
        args={[thick, height, edgeV]}
        radius={0.04}
        smoothness={4}
        position={[inset, y, 0]}
        castShadow
        receiveShadow
      >
        {wood}
      </RoundedBox>
    </group>
  )
}
