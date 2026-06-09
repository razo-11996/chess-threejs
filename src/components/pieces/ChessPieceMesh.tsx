import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import type { Color, PieceSymbol } from 'chess.js'
import {
  PIECE_MODEL_URL,
  PIECE_PRE_ROTATION,
  PIECE_TARGET_HEIGHT,
  PIECE_YAW_OFFSET,
} from '../../constants/pieceModels'
import type { ChessPieceMeshProps } from '../../types/pieces.types'

const PIECE_SYMBOLS = ['p', 'r', 'n', 'b', 'q', 'k'] as const satisfies readonly PieceSymbol[]
for (const sym of PIECE_SYMBOLS) {
  useGLTF.preload(PIECE_MODEL_URL[sym])
}

const skipRaycast = () => {}

const white = new THREE.Color('#f4eee4')
const black = new THREE.Color('#2e2a35')
const blackEmissive = new THREE.Color('#151018')

function clearTextureMaps(m: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial) {
  m.map = null
  m.metalnessMap = null
  m.roughnessMap = null
  m.aoMap = null
  m.emissiveMap = null
  m.normalMap = null

  if (m instanceof THREE.MeshPhysicalMaterial) {
    m.clearcoatNormalMap = null
    m.specularIntensityMap = null
  }
}

function tintPieceMaterials(root: THREE.Object3D, side: Color) {
  const isWhite = side === 'w'
  const base = isWhite ? white : black

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i]
      let std: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial

      if (m instanceof THREE.MeshPhysicalMaterial || m instanceof THREE.MeshStandardMaterial) {
        std = m
      } else if (m instanceof THREE.MeshPhongMaterial || m instanceof THREE.MeshLambertMaterial) {
        const rep = new THREE.MeshStandardMaterial()
        rep.color.copy(m.color)
        if (m.map) rep.map = m.map

        if (Array.isArray(obj.material)) {
          ;(obj.material as THREE.Material[])[i] = rep
        } else {
          obj.material = rep
        }
        std = rep
      } else {
        continue
      }

      clearTextureMaps(std)
      std.vertexColors = false
      std.color.copy(base)
      std.metalness = isWhite ? 0.08 : 0.18
      std.roughness = isWhite ? 0.48 : 0.42
      std.envMapIntensity = isWhite ? 0.75 : 0.85

      if (!isWhite) {
        std.emissive.copy(blackEmissive)
        std.emissiveIntensity = 0.18
      } else {
        std.emissive.setHex(0x000000)
        std.emissiveIntensity = 0
      }

      std.needsUpdate = true
    }
  })
}

/**
 * SkeletonUtils.clone reuses materials across instances — each piece needs its own material clones.
 */
function cloneWithUniqueMaterials(source: THREE.Object3D) {
  const root = SkeletonUtils.clone(source)

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.material) return

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((m) => m.clone())
    } else {
      obj.material = obj.material.clone()
    }
  })

  return root
}

/**
 * Only for pieces with no manual tilt in pieceModels — avoids false positives after Y yaw.
 */
function autoUprightIfFlat(root: THREE.Object3D, type: PieceSymbol) {
  const [rx, ry, rz] = PIECE_PRE_ROTATION[type]
  if (rx !== 0 || ry !== 0 || rz !== 0) return

  root.updateMatrixWorld(true)
  let box = new THREE.Box3().setFromObject(root)
  let size = box.getSize(new THREE.Vector3())

  const horiz = Math.max(size.x, size.z)
  if (horiz > 1e-4 && size.y < horiz * 0.42) {
    root.rotation.x += Math.PI / 2

    root.updateMatrixWorld(true)
    box = new THREE.Box3().setFromObject(root)
    size = box.getSize(new THREE.Vector3())
  }
}

function normalizePieceOnBoard(root: THREE.Object3D, type: PieceSymbol, side: Color) {
  root.scale.set(1, 1, 1)
  root.position.set(0, 0, 0)
  root.rotation.set(0, 0, 0)

  root.rotation.order = 'YXZ'
  const [rx, ry, rz] = PIECE_PRE_ROTATION[type]
  const yaw = PIECE_YAW_OFFSET[type] + (side === 'b' ? Math.PI : 0) + ry
  root.rotation.set(rx, yaw, rz)

  autoUprightIfFlat(root, type)

  root.updateMatrixWorld(true)
  let box = new THREE.Box3().setFromObject(root)
  let size = box.getSize(new THREE.Vector3())

  const targetH = PIECE_TARGET_HEIGHT[type]
  const h = Math.max(size.y, 1e-4)
  const s = targetH / h
  root.scale.setScalar(s)

  root.updateMatrixWorld(true)
  box = new THREE.Box3().setFromObject(root)

  const cx = (box.min.x + box.max.x) / 2
  const cz = (box.min.z + box.max.z) / 2
  root.position.set(-cx, -box.min.y, -cz)
}

export default function ChessPieceMesh({ type, color }: ChessPieceMeshProps) {
  const url = PIECE_MODEL_URL[type]
  const { scene } = useGLTF(url)

  const clone = useMemo(() => cloneWithUniqueMaterials(scene), [scene])

  useLayoutEffect(() => {
    normalizePieceOnBoard(clone, type, color)
    tintPieceMaterials(clone, color)

    clone.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.raycast = skipRaycast
      }
    })
  }, [clone, type, color])

  return <primitive object={clone} />
}
