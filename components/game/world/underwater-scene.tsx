'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MarinePlant {
  id: number
  x: number
  z: number
  height: number
  segments: number
  phase: number
  color: string
  type: 'kelp' | 'seagrass' | 'coral'
}

export function UnderwaterScene() {
  const groupRef = useRef<THREE.Group>(null)

  const plants = useMemo<MarinePlant[]>(() => {
    const result: MarinePlant[] = []
    const colors = ['#2d5016', '#3a6b1e', '#1e3d0f', '#4a7c2e', '#5a8c3e']
    const types: Array<'kelp' | 'seagrass' | 'coral'> = ['kelp', 'seagrass', 'coral']

    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2 + Math.random() * 0.5
      const radius = 10 + Math.random() * 120
      const type = types[Math.floor(Math.random() * (i < 20 ? 2 : 3))]
      result.push({
        id: i,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height: type === 'kelp' ? 3 + Math.random() * 4 : type === 'seagrass' ? 1 + Math.random() * 2 : 0.5 + Math.random() * 1,
        segments: type === 'kelp' ? 8 : type === 'seagrass' ? 4 : 3,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
      })
    }
    return result
  }, [])

  const bubbles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      z: (Math.random() - 0.5) * 150,
      y: -2 - Math.random() * 5,
      speed: 0.3 + Math.random() * 0.5,
      size: 0.03 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
      wobble: Math.random() * 0.5,
    }))
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    bubbles.forEach((bubble, i) => {
      const child = groupRef.current?.children[plants.length + i]
      if (!child) return

      const progress = ((t * bubble.speed + bubble.phase) % 8) / 8
      child.position.set(
        bubble.x + Math.sin(t * bubble.wobble + bubble.phase) * 0.3,
        bubble.y + progress * 6,
        bubble.z + Math.cos(t * bubble.wobble + bubble.phase) * 0.3
      )
      const scale = bubble.size * (1 - progress * 0.3)
      child.scale.setScalar(scale)
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = 0.5 * (1 - progress)
    })
  })

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {plants.map((plant) => (
        plant.type === 'coral' ? (
          <Coral key={plant.id} plant={plant} />
        ) : (
          <SwayingPlant key={plant.id} plant={plant} />
        )
      ))}
      {bubbles.map((bubble) => (
        <mesh key={`bubble-${bubble.id}`}>
          <sphereGeometry args={[bubble.size, 6, 6]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.5}
            roughness={0}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function SwayingPlant({ plant }: { plant: MarinePlant }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < groupRef.current.children.length; i++) {
      const child = groupRef.current.children[i]
      const segmentRatio = i / plant.segments
      const sway = Math.sin(t * 0.8 + plant.phase + segmentRatio * 2) * 0.15 * segmentRatio
      child.rotation.x = sway
      child.rotation.z = sway * 0.7
    }
  })

  return (
    <group ref={groupRef} position={[plant.x, -3, plant.z]}>
      {Array.from({ length: plant.segments }, (_, i) => {
        const ratio = i / plant.segments
        const segHeight = plant.height / plant.segments
        const width = (1 - ratio * 0.7) * 0.15
        return (
          <group key={i} position={[0, ratio * plant.height, 0]}>
            <mesh>
              {plant.type === 'kelp' ? (
                <capsuleGeometry args={[width, segHeight, 4, 6]} />
              ) : (
                <boxGeometry args={[width * 0.5, segHeight, width * 0.1]} />
              )}
              <meshStandardMaterial
                color={plant.color}
                transparent
                opacity={0.8}
                roughness={0.8}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Coral({ plant }: { plant: MarinePlant }) {
  const colors = ['#ff6b6b', '#ffa07a', '#ff7f50', '#e9967a', '#cd853f', '#8b4513']
  const color = colors[Math.floor(plant.id % colors.length)]

  return (
    <group position={[plant.x, -3.5, plant.z]}>
      <mesh>
        <dodecahedronGeometry args={[plant.height * 0.5, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[plant.height * 0.3, 0, plant.height * 0.2]}>
        <dodecahedronGeometry args={[plant.height * 0.3, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[-plant.height * 0.2, 0, -plant.height * 0.3]}>
        <dodecahedronGeometry args={[plant.height * 0.25, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} flatShading />
      </mesh>
    </group>
  )
}
