'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Position } from '@/lib/game/types'

export function FloatingDebris({ count }: { count: number }) {
  const debris = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = Math.random() > 0.5 ? 'driftwood' : 'seaweed'
      return {
        id: i,
        x: (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 200,
        type,
        rotation: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        scale: 0.3 + Math.random() * 0.7,
        length: type === 'seaweed' ? 1 + Math.random() * 2 : 0.5 + Math.random() * 1,
      }
    })
  }, [count])

  return (
    <group>
      {debris.map((d) =>
        d.type === 'driftwood' ? (
          <Driftwood key={d.id} data={d} />
        ) : (
          <Seaweed key={d.id} data={d} />
        )
      )}
    </group>
  )
}

function Driftwood({ data }: { data: { x: number; z: number; phase: number; rotation: number; scale: number } }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = -0.3 + Math.sin(t * 0.3 + data.phase) * 0.1
    groupRef.current.rotation.y = data.rotation + Math.sin(t * 0.2 + data.phase) * 0.1
  })

  return (
    <group ref={groupRef} position={[data.x, 0, data.z]} scale={data.scale}>
      <mesh rotation={[0, data.rotation, 0]}>
        <capsuleGeometry args={[0.1, 1, 4, 6]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 0, 0.1]} rotation={[0.3, 0.5, 0]}>
        <capsuleGeometry args={[0.05, 0.4, 4, 4]} />
        <meshStandardMaterial color="#7a6245" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

function Seaweed({ data }: { data: { x: number; z: number; phase: number; scale: number; length: number } }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < groupRef.current.children.length; i++) {
      const child = groupRef.current.children[i]
      const ratio = i / 5
      child.rotation.x = Math.sin(t * 0.6 + data.phase + ratio * 2) * 0.2 * ratio
      child.rotation.z = Math.cos(t * 0.4 + data.phase + ratio * 1.5) * 0.15 * ratio
    }
  })

  return (
    <group ref={groupRef} position={[data.x, -0.5, data.z]} scale={data.scale}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, i * (data.length / 5), 0]}>
          <boxGeometry args={[0.05, data.length / 5, 0.2]} />
          <meshStandardMaterial color="#2d5016" transparent opacity={0.7} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export function WaterSpray({ playerPosition }: { playerPosition: Position }) {
  const groupRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number }>>([])

  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 20 }, () => ({
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      life: 0, maxLife: 1,
    }))
  }

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const px = playerPosition.x
    const pz = playerPosition.z

    groupRef.current.position.set(px, 0, pz)
    const group = groupRef.current

    particlesRef.current.forEach((p, i) => {
      const child = group.children[i]
      if (!child) return

      if (p.life <= 0) {
        p.x = (Math.random() - 0.5) * 2
        p.y = -0.2
        p.z = (Math.random() - 0.5) * 2
        p.vx = (Math.random() - 0.5) * 0.5
        p.vy = 0.5 + Math.random() * 1
        p.vz = (Math.random() - 0.5) * 0.5
        p.life = 0.5 + Math.random() * 0.5
        p.maxLife = p.life
      }

      p.vy -= 2 * 0.016
      p.x += p.vx * 0.016
      p.y += p.vy * 0.016
      p.z += p.vz * 0.016
      p.life -= 0.016

      child.position.set(p.x, p.y, p.z)
      const progress = 1 - p.life / p.maxLife
      const scale = 0.05 * (1 - progress)
      child.scale.setScalar(scale)
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = 0.6 * (1 - progress)

      if (p.y < -0.5) p.life = 0
    })
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.6}
            roughness={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
