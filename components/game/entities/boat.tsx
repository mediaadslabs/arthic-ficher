'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { BoatTier } from '@/lib/game/types'

interface BoatProps {
  tier: BoatTier
  position?: [number, number, number]
  rotation?: [number, number, number]
  isPlayer?: boolean
}

// Boat configurations for different tiers
const BOAT_VISUAL_CONFIG = {
  dinghy: {
    hullColor: '#5d4e37',
    deckColor: '#8b7355',
    accentColor: '#4a90a4',
    scale: 0.6,
    hasCanopy: false,
    hasCabin: false,
    hasCrane: false,
  },
  trawler: {
    hullColor: '#4a4a4a',
    deckColor: '#6b6b6b',
    accentColor: '#2d6a4f',
    scale: 1,
    hasCanopy: true,
    hasCabin: true,
    hasCrane: false,
  },
  cutter: {
    hullColor: '#2d3748',
    deckColor: '#4a5568',
    accentColor: '#e53e3e',
    scale: 1.3,
    hasCanopy: true,
    hasCabin: true,
    hasCrane: true,
  },
  vessel: {
    hullColor: '#1a202c',
    deckColor: '#2d3748',
    accentColor: '#f6ad55',
    scale: 1.6,
    hasCanopy: true,
    hasCabin: true,
    hasCrane: true,
  },
  icebreaker: {
    hullColor: '#1e3a5f',
    deckColor: '#2d3748',
    accentColor: '#ff4500',
    scale: 2.2,
    hasCanopy: true,
    hasCabin: true,
    hasCrane: true,
  },
}

export function Boat({ tier, position = [0, 0, 0], rotation = [0, 0, 0], isPlayer = false }: BoatProps) {
  const groupRef = useRef<THREE.Group>(null)
  const config = BOAT_VISUAL_CONFIG[tier]

  // Bob animation for water effect
  useFrame((state) => {
    if (groupRef.current && isPlayer) {
      const time = state.clock.elapsedTime
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.08
      groupRef.current.rotation.z = Math.sin(time * 1.2) * 0.03
      groupRef.current.rotation.x = Math.sin(time * 0.8) * 0.02
    }
  })

  // Create hull shape
  const hullGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    
    // Hull outline (top view shape)
    shape.moveTo(-2, 0)
    shape.quadraticCurveTo(-2.2, 1, -1.5, 2)
    shape.lineTo(1.5, 2)
    shape.quadraticCurveTo(2.2, 1, 2, 0)
    shape.quadraticCurveTo(2.2, -1, 1.5, -2)
    shape.quadraticCurveTo(0, -2.5, -1.5, -2)
    shape.quadraticCurveTo(-2.2, -1, -2, 0)

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2,
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={config.scale}
    >
      {/* Hull */}
      <mesh geometry={hullGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} castShadow>
        <meshStandardMaterial color={config.hullColor} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Deck */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5 * config.scale, 0.15, 3.8 * config.scale]} />
        <meshStandardMaterial color={config.deckColor} roughness={0.8} />
      </mesh>

      {/* Deck details - planks */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, 0.18, -1.5 + i * 0.75]} castShadow>
          <boxGeometry args={[3.2 * config.scale, 0.02, 0.15]} />
          <meshStandardMaterial color="#3d3426" roughness={0.9} />
        </mesh>
      ))}

      {/* Railing */}
      {[
        [-1.6, 0.4, 0],
        [1.6, 0.4, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.5, 3.5 * config.scale]} />
          <meshStandardMaterial color={config.accentColor} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* Cabin (trawler and up) */}
      {config.hasCabin && (
        <group position={[0, 0.6, 0.8]}>
          {/* Main cabin */}
          <mesh castShadow>
            <boxGeometry args={[2, 1.2, 1.5]} />
            <meshStandardMaterial color={config.hullColor} roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Cabin roof */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[2.2, 0.15, 1.7]} />
            <meshStandardMaterial color={config.accentColor} roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Windows */}
          {[[-0.5, 0.1, 0.76], [0.5, 0.1, 0.76]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <planeGeometry args={[0.4, 0.4]} />
              <meshStandardMaterial color="#1a5f7a" roughness={0.1} metalness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {/* Canopy (trawler and up) */}
      {config.hasCanopy && (
        <group position={[0, 1.4, 0.8]}>
          {/* Canopy frame */}
          <mesh castShadow>
            <boxGeometry args={[2.4, 0.1, 1.8]} />
            <meshStandardMaterial color="#333" roughness={0.7} />
          </mesh>
          {/* Support poles */}
          {[
            [-1.1, -0.5, 0.8],
            [1.1, -0.5, 0.8],
            [-1.1, -0.5, -0.8],
            [1.1, -0.5, -0.8],
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
              <meshStandardMaterial color="#333" roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* Crane (cutter and vessel) */}
      {config.hasCrane && (
        <group position={[-1, 0.5, -1]}>
          {/* Crane base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
            <meshStandardMaterial color="#444" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Crane arm */}
          <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[0.15, 1.5, 0.15]} />
            <meshStandardMaterial color={config.accentColor} roughness={0.5} metalness={0.5} />
          </mesh>
          {/* Crane hook */}
          <mesh position={[0.4, 1.2, 0]} castShadow>
            <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* Engine exhaust (back) */}
      <mesh position={[0, 0.4, -1.8]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>

      {/* Navigation light (front) */}
      <pointLight
        position={[0, 0.5, 2]}
        color="#ffffff"
        intensity={isPlayer ? 0.5 : 0.2}
        distance={5}
      />
      <mesh position={[0, 0.5, 1.9]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
