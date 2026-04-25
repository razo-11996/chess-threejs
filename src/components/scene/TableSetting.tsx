import { RoundedBox } from '@react-three/drei'

export default function TableSetting() {
  return (
    <group position={[0, -0.22, 0]}>
      <RoundedBox
        args={[26, 0.38, 26]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#3d2a1f"
          roughness={0.78}
          metalness={0.04}
          envMapIntensity={0.25}
        />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.195, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1c1612" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  )
}
