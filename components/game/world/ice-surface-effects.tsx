'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/lib/game/store'

interface IceCrack {
  id: number
  x: number
  z: number
  rotation: number
  width: number
  length: number
  opacity: number
}

export function IceSurfaceEffects() {
  const { player } = useGameStore()
  const groupRef = useRef<THREE.Group>(null)
  const weatherType = player?.weather?.current?.type ?? 'clear'
  const isIceWeather = weatherType === 'whiteout' || weatherType === 'snow' || weatherType === 'blizzard'

  const cracks = useMemo<IceCrack[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      z: (Math.random() - 0.5) * 200,
      rotation: Math.random() * Math.PI,
      width: 0.02 + Math.random() * 0.05,
      length: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  }, [])

  const iceChunks = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      z: (Math.random() - 0.5) * 150,
      scale: 0.3 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    iceChunks.forEach((chunk, i) => {
      const child = groupRef.current?.children[cracks.length + i]
      if (!child) return
      child.position.y = -0.2 + Math.sin(t * 0.2 + chunk.phase) * 0.15
      child.rotation.y = chunk.rotation + Math.sin(t * 0.1 + chunk.phase) * 0.05
    })
  })

  if (!isIceWeather) return null

  const iceOpacity = weatherType === 'whiteout' ? 0.8 : weatherType === 'blizzard' ? 0.5 : 0.3

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Ice sheet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial
          color="#d0e8f0"
          transparent
          opacity={iceOpacity}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Ice cracks */}
      {cracks.map((crack) => (
        <mesh
          key={crack.id}
          position={[crack.x, 0.01, crack.z]}
          rotation={[-Math.PI / 2, crack.rotation, 0]}
        >
          <planeGeometry args={[crack.width, crack.length]} />
          <meshBasicMaterial
            color="#8bb8d0"
            transparent
            opacity={crack.opacity * iceOpacity}
          />
        </mesh>
      ))}

      {/* Floating ice chunks */}
      {iceChunks.map((chunk) => (
        <mesh
          key={`ice-${chunk.id}`}
          position={[chunk.x, 0, chunk.z]}
          scale={chunk.scale}
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#e8f4f8"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.2}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}
