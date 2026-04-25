import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

/** Match OrbitControls target so the key light aims at the same pivot. */
const boardTarget = new THREE.Vector3(0, 0.15, 0)
const sunScratch = new THREE.Vector3()

/** Key light stays on the camera–board line so shadow direction updates when you orbit. */
export default function DirectionalSun() {
  const light = useRef<THREE.DirectionalLight>(null)
  const { camera } = useThree()

  useFrame(() => {
    const L = light.current
    if (!L) return
    sunScratch.copy(camera.position).sub(boardTarget)
    if (sunScratch.lengthSq() < 1e-6) return
    sunScratch.normalize().multiplyScalar(22)
    L.position.copy(boardTarget).add(sunScratch)
  })

  return (
    <directionalLight
      ref={light}
      castShadow
      intensity={1.15}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-near={0.5}
      shadow-camera-far={48}
      shadow-camera-left={-14}
      shadow-camera-right={14}
      shadow-camera-top={14}
      shadow-camera-bottom={-14}
      shadow-bias={-0.00035}
      shadow-normalBias={0.02}
      shadow-radius={3.5}
    >
      <object3D attach="target" position={[0, 0.15, 0]} />
    </directionalLight>
  )
}
