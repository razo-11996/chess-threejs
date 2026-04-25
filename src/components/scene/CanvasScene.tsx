import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import Board from '../board/Board'
import DirectionalSun from './DirectionalSun'
import TableSetting from './TableSetting'
import BoardFrame from '../board/BoardFrame'
import Pieces from '../board/Pieces'

export default function CanvasScene() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.5, 8.6, 11.2], fov: 50, near: 0.08, far: 80 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <color attach="background" args={['#18151c']} />
      <fog attach="fog" args={['#18151c', 14, 38]} />

      <hemisphereLight intensity={0.38} color="#f5ebe0" groundColor="#2c2218" />
      <ambientLight intensity={0.14} />
      <DirectionalSun />

      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.42} background={false} />
      </Suspense>

      <TableSetting />

      <group position={[0, 0.02, 0]}>
        <BoardFrame />
        <Board />
        <Suspense fallback={null}>
          <Pieces />
        </Suspense>
      </group>

      <OrbitControls
        target={[0, 0.15, 0]}
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.22}
        minPolarAngle={0.35}
      />
    </Canvas>
  )
}
