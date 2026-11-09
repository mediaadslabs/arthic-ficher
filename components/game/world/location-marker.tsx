'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Location } from '@/lib/game/types'
import { Home, ShoppingBag, Anchor, Fish, Wrench, Compass, Users, Trophy, Hammer, Sparkles } from 'lucide-react'

interface LocationMarkerProps {
  location: Location
  isNearby?: boolean
  onClick?: () => void
}

const LOCATION_COLORS: Record<string, string> = {
  inn: '#f59e0b',
  marketplace: '#10b981',
  dock: '#6366f1',
  fishing_zone: '#06b6d4',
  garage: '#8b5cf6',
  treasure_hunt: '#f97316',
  repair: '#ef4444',
  crew: '#0ea5e9',
  challenges: '#eab308',
  secret: '#ff0066',
}

const LOCATION_ICONS: Record<string, typeof Home> = {
  inn: Home,
  marketplace: ShoppingBag,
  dock: Anchor,
  fishing_zone: Fish,
  garage: Wrench,
  treasure_hunt: Compass,
  repair: Hammer,
  crew: Users,
  challenges: Trophy,
  secret: Sparkles,
}

// Animated smoke particles
function SmokeParticles({ position, count = 5 }: { position: [number, number, number]; count?: number }) {
  const particlesRef = useRef<THREE.Group>(null)
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      offset: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      size: 0.2 + Math.random() * 0.3,
      x: (Math.random() - 0.5) * 0.8,
      z: (Math.random() - 0.5) * 0.8,
    }))
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i]
        const t = state.clock.elapsedTime
        const y = ((t * p.speed + p.offset) % 3)
        child.position.set(p.x, position[1] + y, p.z)
        child.scale.setScalar(0.5 + Math.sin(t * 2 + p.offset) * 0.3)
        const opacity = Math.max(0, 0.4 - y * 0.15)
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).opacity = opacity
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((p) => (
        <mesh key={p.id}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial color="#888" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

// Floating sparkles for special locations
function SparkleParticles({ color, intensity = 0.6 }: { color: string; intensity?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  const sparkles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      radius: 2 + Math.random() * 2,
      speed: 0.5 + Math.random() * 0.5,
      yOffset: Math.random() * 3,
      size: 0.08 + Math.random() * 0.08,
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const s = sparkles[i]
        const t = state.clock.elapsedTime
        const angle = s.angle + t * s.speed
        child.position.set(
          Math.cos(angle) * s.radius,
          s.yOffset + Math.sin(t * 2 + i) * 0.5,
          Math.sin(angle) * s.radius
        )
        child.scale.setScalar(0.8 + Math.sin(t * 3 + i * 0.5) * 0.5)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {sparkles.map((s) => (
        <mesh key={s.id} position={[0, s.yOffset, 0]}>
          <octahedronGeometry args={[s.size, 0]} />
          <meshBasicMaterial color={color} transparent opacity={intensity} />
        </mesh>
      ))}
    </group>
  )
}

// Pulsing beacon light
function BeaconLight({ color, intensity = 2 }: { color: string; intensity?: number }) {
  const lightRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = intensity + Math.sin(state.clock.elapsedTime * 3) * 0.5
    }
  })

  return (
    <pointLight
      ref={lightRef}
      color={color}
      intensity={intensity}
      distance={15}
      position={[0, 4, 0]}
    />
  )
}

export function LocationMarker({ location, isNearby = false, onClick }: LocationMarkerProps) {
  const beaconRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const flagRef = useRef<THREE.Mesh>(null)
  const lanternRef = useRef<THREE.Mesh>(null)
  
  const color = LOCATION_COLORS[location.type]
  const Icon = LOCATION_ICONS[location.type]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (beaconRef.current) {
      beaconRef.current.position.y = 2 + Math.sin(t * 2) * 0.3
    }
    if (glowRef.current) {
      const targetScale = isNearby ? 1.5 : 1
      glowRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 2) * 0.3
      flagRef.current.scale.x = 1 + Math.sin(t * 3) * 0.1
    }
    if (lanternRef.current) {
      lanternRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.2)
    }
  })

  return (
    <group position={[location.position.x, 0, location.position.z]}>
      {/* Beacon light for all locations */}
      {isNearby && <BeaconLight color={color} intensity={isNearby ? 2.5 : 0.5} />}

      {/* Base platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.5, 0.3, 8]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.3}
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Building representation based on type */}
      {location.type === 'inn' && (
        <group position={[0, 0.5, 0]}>
          {/* Main building */}
          <mesh castShadow>
            <boxGeometry args={[3.5, 2.5, 3]} />
            <meshStandardMaterial color="#8b4513" roughness={0.7} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[3, 2, 4]} />
            <meshStandardMaterial color="#4a2810" roughness={0.8} />
          </mesh>
          {/* Chimney with smoke */}
          <mesh position={[1.2, 2.5, -0.5]} castShadow>
            <boxGeometry args={[0.5, 1.2, 0.5]} />
            <meshStandardMaterial color="#555" roughness={0.9} />
          </mesh>
          <SmokeParticles position={[1.2, 3.2, -0.5]} count={6} />
          {/* Windows with warm light */}
          {[[-1, 0.5, 1.51], [1, 0.5, 1.51]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <boxGeometry args={[0.6, 0.8, 0.05]} />
              <meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={0.5} />
            </mesh>
          ))}
          {/* Door */}
          <mesh position={[0, 0, 1.51]}>
            <boxGeometry args={[0.8, 1.4, 0.05]} />
            <meshStandardMaterial color="#5d3a1a" roughness={0.8} />
          </mesh>
          {/* Sign */}
          <mesh position={[0, 2.8, 1.5]}>
            <boxGeometry args={[1.5, 0.4, 0.1]} />
            <meshStandardMaterial color="#8b6914" roughness={0.9} />
          </mesh>
          {/* Lantern */}
          <mesh ref={lanternRef} position={[2, 1.5, 1.5]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#ff8c00" emissive="#ff6600" emissiveIntensity={1} transparent opacity={0.9} />
          </mesh>
        </group>
      )}

      {location.type === 'marketplace' && (
        <group position={[0, 0.5, 0]}>
          {/* Main building */}
          <mesh castShadow>
            <boxGeometry args={[4.5, 2, 3.5]} />
            <meshStandardMaterial color="#6b4423" roughness={0.8} />
          </mesh>
          {/* Colorful awning */}
          <mesh position={[0, 1.5, 1]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[5, 0.15, 2.5]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
          {/* Awning stripes */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <mesh key={i} position={[x, 1.55, 2.2]} rotation={[0.15, 0, 0]}>
              <boxGeometry args={[0.8, 0.16, 2.5]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#f59e0b' : '#10b981'} roughness={0.7} />
            </mesh>
          ))}
          {/* Market stalls */}
          {[[-1.5, 0, 2.5], [1.5, 0, 2.5]].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh castShadow>
                <boxGeometry args={[1.2, 1, 0.8]} />
                <meshStandardMaterial color="#8b6914" roughness={0.9} />
              </mesh>
              {/* Goods display */}
              <mesh position={[0, 0.7, 0]} castShadow>
                <sphereGeometry args={[0.3, 6, 6]} />
                <meshStandardMaterial color={i === 0 ? '#06b6d4' : '#f97316'} roughness={0.5} />
              </mesh>
            </group>
          ))}
          {/* Flag */}
          <mesh ref={flagRef} position={[0, 3, 0]}>
            <boxGeometry args={[0.1, 2, 0.1]} />
            <meshStandardMaterial color="#d69e2e" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      )}

      {location.type === 'dock' && (
        <group position={[0, 0.2, 0]}>
          {/* Main dock platform */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7, 0.4, 4]} />
            <meshStandardMaterial color="#6b5344" roughness={0.9} />
          </mesh>
          {/* Dock planks */}
          {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
            <mesh key={i} position={[x, 0.45, 0]}>
              <boxGeometry args={[0.1, 0.05, 4]} />
              <meshStandardMaterial color="#5d4e37" roughness={0.95} />
            </mesh>
          ))}
          {/* Support pillars */}
          {[[-3, -1.5, -1.5], [-3, -1.5, 1.5], [3, -1.5, -1.5], [3, -1.5, 1.5]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 2, 8]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
            </mesh>
          ))}
          {/* Mooring posts */}
          {[[-2.5, 0.5, 1.8], [2.5, 0.5, 1.8]].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.12, 0.15, 1.5, 8]} />
                <meshStandardMaterial color="#5d4e37" roughness={0.9} />
              </mesh>
              {/* Rope coil */}
              <mesh position={[0, 0.3, 0]}>
                <torusGeometry args={[0.2, 0.05, 8, 12]} />
                <meshStandardMaterial color="#d4c5a9" roughness={0.9} />
              </mesh>
            </group>
          ))}
          {/* Crane */}
          <group position={[0, 0.5, -1]}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 4, 0.4]} />
              <meshStandardMaterial color="#d69e2e" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[1.5, 2, 0]} castShadow>
              <boxGeometry args={[3, 0.3, 0.3]} />
              <meshStandardMaterial color="#d69e2e" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Hook */}
            <mesh position={[3, 1, 0]}>
              <torusGeometry args={[0.2, 0.05, 8, 12, Math.PI]} />
              <meshStandardMaterial color="#666" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {location.type === 'fishing_zone' && (
        <group position={[0, 0.5, 0]}>
          {/* Main buoy */}
          <mesh ref={beaconRef} castShadow>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
          </mesh>
          {/* White stripe */}
          <mesh position={[0, 0.2, 0]}>
            <torusGeometry args={[1.01, 0.12, 8, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Light on top */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#ffdd00" emissive="#ffaa00" emissiveIntensity={2} transparent opacity={0.9} />
          </mesh>
          {/* Pole */}
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
            <meshStandardMaterial color="#666" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Radar reflector */}
          <mesh position={[0, 0.8, 0]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#ccc" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Sparkles */}
          {isNearby && <SparkleParticles color="#06b6d4" intensity={0.5} />}
        </group>
      )}

      {location.type === 'garage' && (
        <group position={[0, 0.5, 0]}>
          {/* Main building */}
          <mesh castShadow>
            <boxGeometry args={[5.5, 3, 4.5]} />
            <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* Garage door */}
          <mesh position={[0, 1, 2.26]}>
            <boxGeometry args={[3.5, 2.2, 0.1]} />
            <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Door lines */}
          {[-0.7, 0, 0.7].map((y, i) => (
            <mesh key={i} position={[0, 1 + y, 2.32]}>
              <boxGeometry args={[3.4, 0.05, 0.02]} />
              <meshStandardMaterial color="#1a202c" roughness={0.5} />
            </mesh>
          ))}
          {/* Roof */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <boxGeometry args={[6, 0.3, 5]} />
            <meshStandardMaterial color="#718096" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Crane arm */}
          <group position={[2.5, 1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 3, 0.35]} />
              <meshStandardMaterial color="#d69e2e" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[1.5, 1.5, 0]} castShadow>
              <boxGeometry args={[3, 0.35, 0.35]} />
              <meshStandardMaterial color="#d69e2e" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
          {/* Neon sign */}
          <mesh position={[0, 2.5, 2.3]}>
            <boxGeometry args={[2, 0.5, 0.1]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={1} />
          </mesh>
          {/* Smoke from vent */}
          <SmokeParticles position={[-2, 2.5, -1]} count={4} />
        </group>
      )}

      {location.type === 'treasure_hunt' && (
        <group position={[0, 0.5, 0]}>
          {/* Tent/outpost */}
          <mesh castShadow>
            <coneGeometry args={[3.5, 3.5, 8]} />
            <meshStandardMaterial color="#975a16" roughness={0.7} />
          </mesh>
          {/* Tent opening */}
          <mesh position={[0, 0.5, 2.5]}>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial color="#5d3a1a" roughness={0.9} />
          </mesh>
          {/* Treasure chest */}
          <group position={[2, 0.5, 2]}>
            <mesh castShadow>
              <boxGeometry args={[1, 0.7, 0.7]} />
              <meshStandardMaterial color="#744210" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.05, 0.2, 0.75]} />
              <meshStandardMaterial color="#975a16" roughness={0.5} />
            </mesh>
            {/* Gold lock */}
            <mesh position={[0, 0, 0.36]}>
              <boxGeometry args={[0.2, 0.2, 0.05]} />
              <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
          {/* Map post */}
          <mesh position={[-2, 1.5, 1.5]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.5, 8]} />
            <meshStandardMaterial color="#5d4e37" roughness={0.9} />
          </mesh>
          {/* Map paper */}
          <mesh position={[-2, 2.5, 1.5]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[1, 0.8, 0.05]} />
            <meshStandardMaterial color="#f5deb3" roughness={0.9} />
          </mesh>
          {/* Sparkles for treasure */}
          {isNearby && <SparkleParticles color="#f97316" intensity={0.8} />}
        </group>
      )}

      {location.type === 'repair' && (
        <group position={[0, 0.5, 0]}>
          {/* Main workshop */}
          <mesh castShadow>
            <boxGeometry args={[5.5, 3.5, 4.5]} />
            <meshStandardMaterial color="#5c4033" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Workshop door (open) */}
          <mesh position={[0, 1.2, 2.26]}>
            <boxGeometry args={[3, 2.8, 0.1]} />
            <meshStandardMaterial color="#3d2817" roughness={0.8} />
          </mesh>
          {/* Anvil */}
          <group position={[-2.5, 0.8, 2.5]}>
            <mesh castShadow>
              <boxGeometry args={[1, 0.3, 0.6]} />
              <meshStandardMaterial color="#333" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.6, 0.4, 0.5]} />
              <meshStandardMaterial color="#444" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
          {/* Smokestack */}
          <mesh position={[2, 3, -1]} castShadow>
            <cylinderGeometry args={[0.5, 0.6, 2.5, 8]} />
            <meshStandardMaterial color="#555" roughness={0.7} />
          </mesh>
          <SmokeParticles position={[2, 4.5, -1]} count={8} />
          {/* Tools display */}
          <mesh position={[-2.5, 1.5, 2.26]}>
            <boxGeometry args={[0.5, 1.8, 0.15]} />
            <meshStandardMaterial color="#8b6914" roughness={0.9} />
          </mesh>
          {/* Wrench icon on wall */}
          <mesh position={[2.5, 2, 2.26]}>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {location.type === 'crew' && (
        <group position={[0, 0.5, 0]}>
          {/* Guild hall */}
          <mesh castShadow>
            <boxGeometry args={[4.5, 3, 4]} />
            <meshStandardMaterial color="#4a5568" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Decorative trim */}
          <mesh position={[0, 1.5, 2.01]}>
            <boxGeometry args={[4.6, 0.2, 0.1]} />
            <meshStandardMaterial color="#d69e2e" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Flag pole */}
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
            <meshStandardMaterial color="#d69e2e" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Flag */}
          <mesh ref={flagRef} position={[0.6, 4.5, 0]} castShadow>
            <boxGeometry args={[1.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#0ea5e9" roughness={0.7} />
          </mesh>
          {/* Bulletin board */}
          <mesh position={[-2, 1.5, 2.01]} castShadow>
            <boxGeometry args={[1.5, 1, 0.15]} />
            <meshStandardMaterial color="#8b6914" roughness={0.9} />
          </mesh>
          {/* Papers on board */}
          {[-0.4, 0, 0.4].map((x, i) => (
            <mesh key={i} position={[-2 + x, 1.5, 2.1]}>
              <boxGeometry args={[0.3, 0.4, 0.02]} />
              <meshStandardMaterial color={i === 1 ? '#f97316' : '#f5deb3'} roughness={0.9} />
            </mesh>
          ))}
          {/* Door */}
          <mesh position={[0, 0.5, 2.01]}>
            <boxGeometry args={[1, 1.8, 0.1]} />
            <meshStandardMaterial color="#2d3748" roughness={0.7} />
          </mesh>
          {/* Lantern */}
          <mesh ref={lanternRef} position={[2.5, 2, 2]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={1} transparent opacity={0.9} />
          </mesh>
        </group>
      )}

      {location.type === 'challenges' && (
        <group position={[0, 0.5, 0]}>
          {/* Arena base */}
          <mesh castShadow>
            <cylinderGeometry args={[3.5, 4, 1.8, 12]} />
            <meshStandardMaterial color="#5d4e37" roughness={0.6} />
          </mesh>
          {/* Arena walls */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[3.2, 3.2, 1, 12, 1, true]} />
            <meshStandardMaterial color="#718096" roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
          </mesh>
          {/* Trophy pedestal */}
          <group position={[0, 1.5, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.6, 0.8, 1.2, 8]} />
              <meshStandardMaterial color="#d69e2e" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Trophy */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <coneGeometry args={[0.5, 1, 8]} />
              <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={1} />
            </mesh>
            {/* Trophy glow */}
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshBasicMaterial color="#ffd700" transparent opacity={0.2} depthWrite={false} />
            </mesh>
          </group>
          {/* Banners */}
          {[-2.5, 2.5].map((x, i) => (
            <group key={i} position={[x, 2, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
                <meshStandardMaterial color="#888" roughness={0.5} metalness={0.5} />
              </mesh>
              <mesh ref={i === 0 ? flagRef : undefined} position={[0.5, -0.5, 0]} castShadow>
                <boxGeometry args={[1, 1.5, 0.1]} />
                <meshStandardMaterial color={i === 0 ? '#ef4444' : '#3b82f6'} roughness={0.7} />
              </mesh>
            </group>
          ))}
          {/* Sparkles around trophy */}
          {isNearby && <SparkleParticles color="#ffd700" intensity={1} />}
        </group>
      )}

      {location.type === 'secret' && (
        <group position={[0, 0.5, 0]}>
          {/* Mystical portal */}
          <mesh castShadow>
            <torusGeometry args={[2.5, 0.5, 12, 24]} />
            <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Inner portal glow */}
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[2.2, 24]} />
            <meshBasicMaterial color="#ff0066" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          {/* Floating runes */}
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 2.6, Math.sin(i * Math.PI / 2) * 0.3, Math.sin(i * Math.PI / 2) * 2.6]}>
              <boxGeometry args={[0.15, 0.4, 0.15]} />
              <meshStandardMaterial color="#ff66aa" emissive="#ff0066" emissiveIntensity={0.8} />
            </mesh>
          ))}
          <SparkleParticles color="#ff0066" intensity={1} />
        </group>
      )}

      {/* Glow effect when nearby */}
      <mesh ref={glowRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color={color}
          opacity={isNearby ? 0.25 : 0.08}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Floating icon indicator */}
      <Html
        position={[0, location.type === 'inn' ? 6 : 5, 0]}
        center
        distanceFactor={20}
        occlude={false}
        style={{ pointerEvents: isNearby ? 'auto' : 'none', zIndex: 10 }}
      >
        <div 
          className={`flex flex-col items-center transition-all duration-300 ${
            isNearby ? 'scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'scale-100'
          }`}
          onClick={onClick}
        >
          <div 
            className={`p-2.5 rounded-full shadow-xl cursor-pointer transition-all duration-300 ${
              isNearby ? 'ring-2 ring-white ring-opacity-70 animate-pulse' : ''
            }`}
            style={{ backgroundColor: color }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`mt-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
            isNearby ? 'bg-slate-900/90 shadow-lg' : 'bg-slate-900/70'
          }`}>
            {location.name}
          </div>
          {isNearby && (
            <div className="mt-1 px-2 py-0.5 bg-cyan-600/80 rounded-full text-cyan-100 text-[10px] animate-bounce">
              Press E
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
