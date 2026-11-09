'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COUNTRIES } from '@/lib/game/world-data'

interface FishJump {
  id: number
  x: number
  z: number
  phase: number
  jumpHeight: number
  jumpDuration: number
  lastJump: number
  jumpInterval: number
}

export function FishJumpingParticles({ count = 12 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const jumpsRef = useRef<FishJump[]>([])

  if (jumpsRef.current.length === 0) {
    jumpsRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 300,
      phase: Math.random() * Math.PI * 2,
      jumpHeight: 0.5 + Math.random() * 1.5,
      jumpDuration: 0.8 + Math.random() * 0.5,
      lastJump: Math.random() * 10,
      jumpInterval: 5 + Math.random() * 15,
    }))
  }

  // Splash particles
  const splashes = useMemo(() => {
    return Array.from({ length: count * 4 }, (_, i) => ({
      id: i,
      fishId: Math.floor(i / 4),
      angle: (i % 4) * (Math.PI / 2) + Math.random() * 0.5,
      speed: 1 + Math.random() * 2,
      size: 0.05 + Math.random() * 0.08,
    }))
  }, [count])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    jumpsRef.current.forEach((jump, i) => {
      const child = groupRef.current?.children[i]
      if (!child) return

      const timeSinceLastJump = t - jump.lastJump
      const progress = timeSinceLastJump / jump.jumpInterval
      
      if (progress >= 1) {
        jump.lastJump = t
      }

      // Jump parabola
      let y = -0.5
      if (progress < jump.jumpDuration / jump.jumpInterval) {
        const jumpProgress = progress * jump.jumpInterval / jump.jumpDuration
        y = Math.sin(jumpProgress * Math.PI) * jump.jumpHeight - 0.5
      }

      child.position.set(jump.x, y, jump.z)
      child.visible = y > -0.4
    })

    // Splash particles
    jumpsRef.current.forEach((jump, fishIdx) => {
      const timeSinceLastJump = t - jump.lastJump
      const progress = timeSinceLastJump / jump.jumpInterval
      const isJumping = progress < jump.jumpDuration / jump.jumpInterval

      for (let s = 0; s < 4; s++) {
        const splashIdx = fishIdx * 4 + s
        const splashMesh = groupRef.current?.children[count + splashIdx]
        if (!splashMesh) continue

        const splashData = splashes[splashIdx]
        
        if (isJumping && progress < 0.1) {
          const splashProgress = progress / 0.1
          const radius = splashData.speed * splashProgress
          const sy = splashProgress * 0.5 - 0.5
          ;(splashMesh as THREE.Object3D).position.set(
            jump.x + Math.cos(splashData.angle) * radius,
            sy,
            jump.z + Math.sin(splashData.angle) * radius
          )
          splashMesh.visible = true
          const scale = 1 - splashProgress
          ;(splashMesh as THREE.Mesh).scale.setScalar(scale)
        } else {
          splashMesh.visible = false
        }
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Fish shapes */}
      {jumpsRef.current.map((jump) => (
        <group key={jump.id} position={[jump.x, -0.5, jump.z]}>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
            <meshStandardMaterial color="#4a6741" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Tail */}
          <mesh position={[0, 0, -0.3]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[0.2, 0.3, 4]} />
            <meshStandardMaterial color="#3a5731" roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Splash droplets */}
      {splashes.map((splash) => (
        <mesh key={splash.id}>
          <sphereGeometry args={[splash.size, 6, 6]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}
