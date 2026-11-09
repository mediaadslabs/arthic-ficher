'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COUNTRIES, LOCATIONS } from '@/lib/game/world-data'
import { Ocean } from './ocean'
import { LandMass } from './land-mass'
import { LocationMarker } from './location-marker'
import { FishJumpingParticles } from './fish-jumping'
import { UnderwaterScene } from './underwater-scene'
import { FloatingDebris, WaterSpray } from './floating-debris'
import { IceSurfaceEffects } from './ice-surface-effects'
import type { Position } from '@/lib/game/types'
import { useGameStore } from '@/lib/game/store'

// ─── Land exclusion ──────────────────────────────────────────────────────────
const LAND_EXCLUSION_RADIUS = 25

function isOnLand(x: number, z: number): boolean {
  for (const country of COUNTRIES) {
    const dx = x - country.position.x
    const dz = z - country.position.z
    if (Math.sqrt(dx * dx + dz * dz) < LAND_EXCLUSION_RADIUS) {
      return true
    }
  }
  return false
}

interface GameWorldProps {
  playerPosition: Position
  quality?: 'low' | 'medium' | 'high'
  onLocationClick?: (locationId: string) => void
}

export function GameWorld({ playerPosition, quality = 'high', onLocationClick }: GameWorldProps) {
  const discoveredSecrets = useGameStore(s => s.player?.discoveredSecrets || [])

  // Filter locations: hide undiscovered secret locations
  const visibleLocations = useMemo(() => {
    return LOCATIONS.filter(loc => {
      if (loc.type === 'secret') return discoveredSecrets.includes(loc.id)
      return true
    })
  }, [discoveredSecrets])

  const nearbyLocations = useMemo(() => {
    const nearby: string[] = []
    const threshold = 8

    for (const location of visibleLocations) {
      const dx = location.position.x - playerPosition.x
      const dz = location.position.z - playerPosition.z
      const distance = Math.sqrt(dx * dx + dz * dz)

      if (distance <= threshold) {
        nearby.push(location.id)
      }
    }

    return nearby
  }, [playerPosition, visibleLocations])

  return (
    <group>
      {/* Ocean */}
      <Ocean size={500} quality={quality} />

      {/* Ice floes scattered around — land-safe */}
      <IceFloes count={quality === 'high' ? 60 : quality === 'medium' ? 35 : 18} />

      {/* Countries/Land masses */}
      {COUNTRIES.map((country) => (
        <LandMass key={country.id} country={country} />
      ))}

      {/* Location markers — filter by discovered secrets */}
      {visibleLocations.map((location) => (
        <LocationMarker
          key={location.id}
          location={location}
          isNearby={nearbyLocations.includes(location.id)}
          onClick={() => onLocationClick?.(location.id)}
        />
      ))}

      {/* Lighthouses for navigation */}
      <Lighthouses />

      {/* Ambient wildlife */}
      {quality !== 'low' && <AmbientWildlife />}

      {/* Jumping fish */}
      {quality !== 'low' && <FishJumpingParticles count={quality === 'high' ? 12 : 6} />}

      {/* Ambient decorations */}
      <AmbientDecorations />

      {/* Underwater scene */}
      {quality !== 'low' && <UnderwaterScene />}

      {/* Floating debris and seaweed */}
      <FloatingDebris count={quality === 'high' ? 20 : 10} />

      {/* Water spray particles near boat */}
      {quality !== 'low' && <WaterSpray playerPosition={playerPosition} />}

      {/* Ice surface effects in snow/whiteout */}
      <IceSurfaceEffects />
    </group>
  )
}

// ─── Ice floes ───────────────────────────────────────────────────────────────
function IceFloes({ count }: { count: number }) {
  const floes = useMemo(() => {
    const result: {
      id: number
      position: [number, number, number]
      rotation: number
      scale: number
    }[] = []

    const maxAttempts = count * 30
    let attempts = 0

    while (result.length < count && attempts < maxAttempts) {
      attempts++
      const x = (Math.random() - 0.5) * 400
      const z = (Math.random() - 0.5) * 400

      if (isOnLand(x, z)) continue

      result.push({
        id: result.length,
        position: [x, -0.2 + Math.random() * 0.3, z],
        rotation: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 2,
      })
    }

    return result
  }, [count])

  return (
    <group>
      {floes.map((floe) => (
        <mesh
          key={floe.id}
          position={floe.position}
          rotation={[0, floe.rotation, 0]}
          scale={floe.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#e0f2fe"
            roughness={0.3}
            metalness={0.1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Lighthouses ─────────────────────────────────────────────────────────────
function Lighthouses() {
  const lighthouses = useMemo(() => [
    { position: [40, 0, -50] as [number, number, number], color: '#ef4444' },
    { position: [-60, 0, -30] as [number, number, number], color: '#3b82f6' },
    { position: [80, 0, 20] as [number, number, number], color: '#10b981' },
    { position: [-100, 0, 60] as [number, number, number], color: '#f59e0b' },
    { position: [0, 0, -120] as [number, number, number], color: '#8b5cf6' },
  ], [])

  return (
    <>
      {lighthouses.map((lh, i) => (
        <Lighthouse key={i} position={lh.position} color={lh.color} />
      ))}
    </>
  )
}

function Lighthouse({ position, color }: { position: [number, number, number]; color: string }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const beamRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 2) * 1
    }
    if (beamRef.current) {
      beamRef.current.rotation.y = t * 0.8
    }
  })

  return (
    <group position={position}>
      {/* Base rock */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[3, 2, 8]} />
        <meshStandardMaterial color="#555" roughness={0.9} flatShading />
      </mesh>
      {/* Tower */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[1, 1.5, 6, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      {/* Red stripes */}
      {[1, 3, 5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[1.1 + (5 - y) * 0.1, 1.2 + (5 - y) * 0.1, 0.8, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Lantern room */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[1.2, 1, 1, 8]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[1, 0.9, 0.8, 8, 1, true]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffaa00" emissiveIntensity={2} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 6.3, 0]}>
        <coneGeometry args={[1.3, 0.8, 8]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Light beam */}
      <mesh ref={beamRef} position={[0, 5.5, 0]}>
        <coneGeometry args={[30, 60, 8, 1, true]} />
        <meshBasicMaterial color="#ffdd00" transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Point light */}
      <pointLight ref={lightRef} position={[0, 5.5, 0]} color="#ffdd00" intensity={3} distance={80} />
    </group>
  )
}

// ─── Ambient Wildlife ────────────────────────────────────────────────────────
function AmbientWildlife() {
  const seals = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 200,
        -0.1,
        (Math.random() - 0.5) * 200,
      ] as [number, number, number],
      scale: 0.6 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
    }))
  }, [])

  const whales = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => {
      const whaleType: 'humpback' | 'orca' = Math.random() > 0.5 ? 'humpback' : 'orca'
      return {
        id: i,
        orbitRadius: 80 + Math.random() * 100,
        speed: 0.05 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        yOffset: -2 + Math.random() * -1,
        scale: 1.5 + Math.random(),
        type: whaleType,
      }
    })
  }, [])

  const birds = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      center: [(Math.random() - 0.5) * 200, 20 + Math.random() * 30, (Math.random() - 0.5) * 200] as [number, number, number],
      radius: 5 + Math.random() * 15,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.2 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <>
      {/* Seals on ice floes */}
      {seals.map((seal) => (
        <Seal key={seal.id} {...seal} />
      ))}
      
      {/* Whales swimming */}
      {whales.map((whale) => (
        <Whale key={whale.id} {...whale} />
      ))}
      
      {/* Birds flying */}
      {birds.map((bird) => (
        <Bird key={bird.id} {...bird} />
      ))}
    </>
  )
}

function Seal({ position, scale, phase, rotation }: { position: [number, number, number]; scale: number; phase: number; rotation: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.15
    }
  })

  return (
    <group position={[position[0], position[1], position[2]]} rotation={[0, rotation, 0]}>
      <mesh ref={meshRef} scale={scale}>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0, 0.5]} scale={scale}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.1, 0.7]} scale={scale * 0.5}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.1, 0.1, 0.7]} scale={scale * 0.5}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

function Whale({ orbitRadius, speed, phase, yOffset, scale, type }: { orbitRadius: number; speed: number; phase: number; yOffset: number; scale: number; type: 'humpback' | 'orca' }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      const angle = t * speed + phase
      groupRef.current.position.set(
        Math.cos(angle) * orbitRadius,
        yOffset + Math.sin(t * 0.3 + phase) * 1,
        Math.sin(angle) * orbitRadius
      )
      groupRef.current.rotation.y = -angle + Math.PI / 2
    }
  })

  const color = type === 'humpback' ? '#4a5568' : '#1a202c'
  const bellyColor = type === 'humpback' ? '#d4c5a9' : '#f8fafc'

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[1, 4, 4, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.8, 3.5, 4, 12]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0, 2.5]}>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Tail */}
      <group position={[0, 0, -3]}>
        <mesh position={[-0.8, 0, -0.5]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0.8, 0, -0.5]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>
      {/* Dorsal fin (larger for orca) */}
      <mesh position={[0, type === 'orca' ? 1.2 : 0.8, -0.5]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[type === 'orca' ? 0.5 : 0.3, type === 'orca' ? 1.2 : 0.6, 4]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Eye */}
      <mesh position={[0.6, 0.3, 2]} scale={0.3}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.6, 0.3, 2]} scale={0.3}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

function Bird({ center, radius, speed, phase, scale }: { center: [number, number, number]; radius: number; speed: number; phase: number; scale: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      const angle = t * speed + phase
      groupRef.current.position.set(
        center[0] + Math.cos(angle) * radius,
        center[1] + Math.sin(t * 2 + phase) * 0.5,
        center[2] + Math.sin(angle) * radius
      )
      groupRef.current.rotation.y = -angle + Math.PI / 2
      
      // Wing flap
      const wingFlap = Math.sin(t * 8 + phase) * 0.4
      if (groupRef.current.children[0]) {
        (groupRef.current.children[0] as THREE.Mesh).rotation.z = wingFlap
      }
      if (groupRef.current.children[1]) {
        (groupRef.current.children[1] as THREE.Mesh).rotation.z = -wingFlap
      }
    }
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.15, 0.4, 4, 6]} />
        <meshStandardMaterial color="#333" roughness={0.7} />
      </mesh>
      {/* Left wing */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.2]} />
        <meshStandardMaterial color="#444" roughness={0.6} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.2]} />
        <meshStandardMaterial color="#444" roughness={0.6} />
      </mesh>
    </group>
  )
}

// ─── Ambient icebergs ────────────────────────────────────────────────────────
function AmbientDecorations() {
  const icebergs = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const angle = (i / 25) * Math.PI * 2
      const radius = 180 + Math.random() * 40
      return {
        id: i,
        position: [
          Math.cos(angle) * radius,
          -2 + Math.random() * 3,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        scale: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI,
      }
    })
  }, [])

  return (
    <group>
      {icebergs.map((berg) => (
        <mesh
          key={berg.id}
          position={berg.position}
          rotation={[0, berg.rotation, 0]}
          scale={berg.scale}
        >
          <coneGeometry args={[1, 3, 5]} />
          <meshStandardMaterial
            color="#b0c4de"
            roughness={0.4}
            metalness={0.1}
            flatShading
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}
      
      {/* Distant ships on horizon */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + 0.3
        const radius = 190 + Math.random() * 20
        return (
          <Ship key={`ship-${i}`} position={[Math.cos(angle) * radius, -1, Math.sin(angle) * radius]} scale={0.5 + Math.random() * 0.5} />
        )
      })}
    </group>
  )
}

function Ship({ position, scale }: { position: [number, number, number]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Hull */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color="#5d4e37" roughness={0.8} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      {/* Sail */}
      <mesh position={[0, 1.5, 0.3]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
