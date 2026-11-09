'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Country } from '@/lib/game/types'

interface LandMassProps {
  country: Country
  isHighlighted?: boolean
  onClick?: () => void
}

// ─── Seeded pseudo-random number generator ───────────────────────────────────
// Using a simple mulberry32 PRNG so every country always generates the
// exact same shape, snow caps, and sizes — deterministic across all renders.
function makePRNG(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Turn a string (country id) into a stable numeric seed
function strToSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
// ─────────────────────────────────────────────────────────────────────────────

export function LandMass({ country, isHighlighted = false, onClick }: LandMassProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // All geometry is seeded on country.id — stable across every render
  const { geometry, snowCaps } = useMemo(() => {
    const rng = makePRNG(strToSeed(country.id))

    // ── Land shape ────────────────────────────────────────────────────────────
    const shape = new THREE.Shape()
    const points = 8 + Math.floor(rng() * 4)           // 8–11 points
    const baseRadius = 8 + rng() * 6                    // 8–14 units

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const radius = baseRadius * (0.7 + rng() * 0.6)  // 0.7–1.3 × baseRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.5,
      bevelSegments: 2,
    })

    // ── Snow caps ─────────────────────────────────────────────────────────────
    // Keep snow caps well inside the island: max radius = baseRadius * 0.7 * 0.5
    // so they never reach the shore even on the narrowest point.
    const innerRadius = baseRadius * 0.7 * 0.45
    const numCaps = 0 + Math.floor(rng() * 0)           // 3–5 caps

    const caps: { pos: THREE.Vector3; coneR: number; coneH: number }[] = []
    for (let i = 0; i < numCaps; i++) {
      const angle = rng() * Math.PI * 2
      const r = rng() * innerRadius
      caps.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * r,
          1.5 + rng() * 0.5,
          Math.sin(angle) * r,
        ),
        coneR: 1.5 + rng() * 1.0,   // cone base radius  1.5–2.5
        coneH: 2.0 + rng() * 2.0,   // cone height       2.0–4.0
      })
    }

    return { geometry: geo, snowCaps: caps }
  }, [country.id]) // re-compute only if the country changes

  useFrame((_, delta) => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group position={[country.position.x, 0, country.position.z]}>
      {/* Main land mass */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.3, 0]}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={isHighlighted ? '#4a7c59' : country.color}
          roughness={0.8}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Snow caps / mountains — always inside the island */}
      {snowCaps.map((cap, i) => (
        <mesh key={i} position={cap.pos} castShadow>
          <coneGeometry args={[cap.coneR, cap.coneH, 6]} />
          <meshStandardMaterial
            color="#e8e8e8"
            roughness={0.6}
            metalness={0.1}
            flatShading
          />
        </mesh>
      ))}

      {/* Country label */}
      <group position={[0, 4, 0]}>
        <mesh>
          <planeGeometry args={[country.name.length * 0.8, 1.2]} />
          <meshBasicMaterial color="#1a1a2e" opacity={0.8} transparent />
        </mesh>
      </group>
    </group>
  )
}
