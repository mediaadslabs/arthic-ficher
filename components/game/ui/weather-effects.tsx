'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/lib/game/store'
import type { WeatherType, TimeOfDay } from '@/lib/game/types'

// ─── Config per weather type ─────────────────────────────────────────────────
const WEATHER_CONFIG: Record<WeatherType, {
  fogNear: number
  fogFar: number
  fogColor: string
  ambientIntensity: number
  sunIntensity: number
  skyRayleigh: number
  skyMie: number
  sunPosition: [number, number, number]
}> = {
  clear:    { fogNear: 80,  fogFar: 350, fogColor: '#0a1628', ambientIntensity: 0.5,  sunIntensity: 1.2,  skyRayleigh: 0.5,  skyMie: 0.005, sunPosition: [100, 30, 100] },
  cloudy:   { fogNear: 60,  fogFar: 250, fogColor: '#1a2035', ambientIntensity: 0.35, sunIntensity: 0.6,  skyRayleigh: 1.5,  skyMie: 0.02,  sunPosition: [100, 20, 100] },
  rain:     { fogNear: 30,  fogFar: 150, fogColor: '#0d1520', ambientIntensity: 0.25, sunIntensity: 0.3,  skyRayleigh: 3.0,  skyMie: 0.05,  sunPosition: [100, 10, 100] },
  snow:     { fogNear: 20,  fogFar: 120, fogColor: '#c8d8e8', ambientIntensity: 0.6,  sunIntensity: 0.5,  skyRayleigh: 0.3,  skyMie: 0.01,  sunPosition: [100, 15, 100] },
  fog:      { fogNear: 5,   fogFar: 60,  fogColor: '#8899aa', ambientIntensity: 0.3,  sunIntensity: 0.2,  skyRayleigh: 5.0,  skyMie: 0.08,  sunPosition: [100, 5,  100] },
  storm:    { fogNear: 15,  fogFar: 80,  fogColor: '#050d18', ambientIntensity: 0.15, sunIntensity: 0.1,  skyRayleigh: 6.0,  skyMie: 0.1,   sunPosition: [100, 2,  100] },
  blizzard: { fogNear: 3,   fogFar: 30,  fogColor: '#ddeeff', ambientIntensity: 0.7,  sunIntensity: 0.3,  skyRayleigh: 0.2,  skyMie: 0.005, sunPosition: [100, 8,  100] },
  aurora:   { fogNear: 60,  fogFar: 300, fogColor: '#050a15', ambientIntensity: 0.35, sunIntensity: 0.5,  skyRayleigh: 0.2,  skyMie: 0.002, sunPosition: [100, 25, 100] },
  whiteout: { fogNear: 2,   fogFar: 15,  fogColor: '#ffffff', ambientIntensity: 1.0,  sunIntensity: 0.1,  skyRayleigh: 0.1,  skyMie: 0.001, sunPosition: [100, 5,  100] },
  hail:     { fogNear: 25,  fogFar: 100, fogColor: '#0d1520', ambientIntensity: 0.3,  sunIntensity: 0.2,  skyRayleigh: 2.0,  skyMie: 0.03,  sunPosition: [100, 8,  100] },
  thunderstorm: { fogNear: 10,  fogFar: 70,  fogColor: '#050d18', ambientIntensity: 0.12, sunIntensity: 0.08, skyRayleigh: 7.0,  skyMie: 0.12,  sunPosition: [100, 2,  100] },
  mist:     { fogNear: 8,   fogFar: 50,  fogColor: '#8899aa', ambientIntensity: 0.25, sunIntensity: 0.15, skyRayleigh: 6.0,  skyMie: 0.1,   sunPosition: [100, 4,  100] },
  heatwave: { fogNear: 100, fogFar: 400, fogColor: '#1a2035', ambientIntensity: 0.6,  sunIntensity: 1.5,  skyRayleigh: 0.3,  skyMie: 0.002, sunPosition: [100, 35, 100] },
  polar_night: { fogNear: 15,  fogFar: 100, fogColor: '#050a15', ambientIntensity: 0.08, sunIntensity: 0.05, skyRayleigh: 4.0,  skyMie: 0.01,  sunPosition: [100, -30, 100] },
  magnetic_storm: { fogNear: 20,  fogFar: 80,  fogColor: '#050d18', ambientIntensity: 0.2,  sunIntensity: 0.15, skyRayleigh: 5.0,  skyMie: 0.06,  sunPosition: [100, 5,  100] },
  hurricane:  { fogNear: 2,   fogFar: 20,  fogColor: '#020810', ambientIntensity: 0.05, sunIntensity: 0.02, skyRayleigh: 8.0,  skyMie: 0.2,   sunPosition: [100, 0,  100] },
  tornado:    { fogNear: 1,   fogFar: 15,  fogColor: '#050505', ambientIntensity: 0.08, sunIntensity: 0.03, skyRayleigh: 7.0,  skyMie: 0.15,  sunPosition: [100, 1,  100] },
  tsunami:    { fogNear: 10,  fogFar: 60,  fogColor: '#020d1a', ambientIntensity: 0.1,  sunIntensity: 0.05, skyRayleigh: 6.0,  skyMie: 0.1,   sunPosition: [100, 2,  100] },
  volcanic_ash:{ fogNear: 2,  fogFar: 25,  fogColor: '#1a1210', ambientIntensity: 0.05, sunIntensity: 0.01, skyRayleigh: 0.1,  skyMie: 0.3,   sunPosition: [100, -10, 100] },
  meteor_shower:{ fogNear: 50, fogFar: 200, fogColor: '#050a15', ambientIntensity: 0.15, sunIntensity: 0.2,  skyRayleigh: 0.3,  skyMie: 0.002, sunPosition: [100, 15, 100] },
  blood_moon: { fogNear: 15,  fogFar: 80,  fogColor: '#1a0505', ambientIntensity: 0.08, sunIntensity: 0.05, skyRayleigh: 5.0,  skyMie: 0.01,  sunPosition: [100, -15, 100] },
  supercell:  { fogNear: 5,   fogFar: 35,  fogColor: '#030a12', ambientIntensity: 0.1,  sunIntensity: 0.04, skyRayleigh: 7.0,  skyMie: 0.18,  sunPosition: [100, 1,  100] },
  ice_storm:  { fogNear: 3,   fogFar: 20,  fogColor: '#c8d8e8', ambientIntensity: 0.6,  sunIntensity: 0.2,  skyRayleigh: 0.2,  skyMie: 0.008, sunPosition: [100, 3,  100] },
  rogue_wave: { fogNear: 15,  fogFar: 60,  fogColor: '#020d1a', ambientIntensity: 0.12, sunIntensity: 0.06, skyRayleigh: 6.0,  skyMie: 0.1,   sunPosition: [100, 3,  100] },
}

const TIME_AMBIENT: Record<TimeOfDay, number> = {
  dawn:  0.3,
  day:   1.0,
  dusk:  0.4,
  night: 0.08,
}

const TIME_SUN_POSITION: Record<TimeOfDay, [number, number, number]> = {
  dawn:  [50,  5,  100],
  day:   [100, 30, 100],
  dusk:  [-50, 5,  100],
  night: [100, -20, 100],
}

// ─── Aurora Borealis 3D Effect ───────────────────────────────────────────────
function AuroraBorealis() {
  const groupRef = useRef<THREE.Group>(null)
  const { player } = useGameStore()
  const weatherType = player?.weather?.current?.type ?? 'clear'
  
  const ribbons = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      y: 80 + i * 12 + Math.random() * 8,
      z: -100 + Math.random() * 50,
      width: 150 + Math.random() * 100,
      speed: 0.1 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      color: ['#22c55e', '#06b6d4', '#8b5cf6', '#a855f7', '#10b981', '#14b8a6', '#3b82f6'][i],
      opacity: 0.15 + Math.random() * 0.2,
      amplitude: 8 + Math.random() * 12,
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const ribbon = ribbons[i]
        const t = state.clock.elapsedTime
        if (child instanceof THREE.Mesh) {
          child.position.x = Math.sin(t * ribbon.speed + ribbon.phase) * ribbon.amplitude
          child.material.opacity = ribbon.opacity * (0.6 + Math.sin(t * 0.5 + ribbon.phase) * 0.4)
        }
      })
    }
  })

  if (weatherType !== 'aurora') return null

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon) => (
        <mesh key={ribbon.id} position={[0, ribbon.y, ribbon.z]}>
          <planeGeometry args={[ribbon.width, 6, 40, 1]} />
          <meshBasicMaterial
            color={ribbon.color}
            transparent
            opacity={ribbon.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Lightning 3D Effect ─────────────────────────────────────────────────────
function LightningEffect() {
  const lightRef = useRef<THREE.PointLight>(null)
  const { player } = useGameStore()
  const weatherType = player?.weather?.current?.type ?? 'clear'
  const nextFlash = useRef(0)

  useFrame((state) => {
    if (lightRef.current && (weatherType === 'storm' || weatherType === 'blizzard' || weatherType === 'thunderstorm' || weatherType === 'supercell' || weatherType === 'hurricane' || weatherType === 'tornado')) {
      const t = state.clock.elapsedTime
      if (t > nextFlash.current) {
        lightRef.current.intensity = 5 + Math.random() * 10
        nextFlash.current = t + 2 + Math.random() * 5
      } else {
        lightRef.current.intensity *= 0.9
      }
    }
    if (lightRef.current) {
      lightRef.current.intensity *= 0.95
    }
  })

  if (weatherType !== 'storm' && weatherType !== 'blizzard' && weatherType !== 'thunderstorm' && weatherType !== 'supercell' && weatherType !== 'hurricane' && weatherType !== 'tornado') return null

  return (
    <pointLight
      ref={lightRef}
      position={[50, 60, 50]}
      color="#e0e7ff"
      intensity={0}
      distance={200}
      castShadow={false}
    />
  )
}

// ─── Three.js dynamic fog + lighting ─────────────────────────────────────────
export function WeatherScene() {
  const { player } = useGameStore()
  const { scene } = useThree()
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const fogRef = useRef<THREE.Fog | null>(null)

  const weatherType = player?.weather?.current?.type ?? 'clear'
  const timeOfDay = player?.time?.timeOfDay ?? 'day'
  const cfg = WEATHER_CONFIG[weatherType]

  // Lerp targets for smooth transitions
  const targets = useRef({
    fogNear: cfg.fogNear,
    fogFar: cfg.fogFar,
    fogColor: new THREE.Color(cfg.fogColor),
    ambient: cfg.ambientIntensity,
    sun: cfg.sunIntensity,
  })

  useFrame((_, delta) => {
    const t = targets.current
    const c = WEATHER_CONFIG[weatherType]
    const timeAmbientMult = TIME_AMBIENT[timeOfDay]

    // Update targets
    t.fogNear += (c.fogNear - t.fogNear) * delta * 0.5
    t.fogFar  += (c.fogFar  - t.fogFar)  * delta * 0.5
    t.fogColor.lerp(new THREE.Color(c.fogColor), delta * 0.5)
    t.ambient += (c.ambientIntensity * timeAmbientMult - t.ambient) * delta * 0.5
    t.sun     += (c.sunIntensity     * timeAmbientMult - t.sun)     * delta * 0.5

    // Apply to scene fog
    if (!scene.fog) {
      scene.fog = new THREE.Fog(t.fogColor, t.fogNear, t.fogFar)
      fogRef.current = scene.fog as THREE.Fog
    } else {
      const fog = scene.fog as THREE.Fog
      fog.near = t.fogNear
      fog.far  = t.fogFar
      fog.color.copy(t.fogColor)
    }

    // Apply to lights
    if (ambientRef.current) ambientRef.current.intensity = t.ambient
    if (sunRef.current)     sunRef.current.intensity     = t.sun
  })

  const sunPos = TIME_SUN_POSITION[timeOfDay]
  const isNight = timeOfDay === 'night'
  const isAurora = weatherType === 'aurora'

  return (
    <>
      <ambientLight ref={ambientRef} intensity={cfg.ambientIntensity} color={isAurora ? '#1a2744' : '#ffffff'} />
      <directionalLight
        ref={sunRef}
        position={sunPos}
        intensity={cfg.sunIntensity}
        castShadow
        shadow-mapSize={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        color={isAurora ? '#7c83ff' : '#ffffff'}
      />
      <Sky
        distance={450000}
        sunPosition={sunPos}
        rayleigh={cfg.skyRayleigh}
        mieCoefficient={cfg.skyMie}
        inclination={isNight ? 0.9 : timeOfDay === 'dawn' || timeOfDay === 'dusk' ? 0.55 : 0.5}
        azimuth={0.25}
      />
      {isNight && (
        <Stars
          radius={300}
          depth={60}
          count={isAurora ? 3000 : 5000}
          factor={4}
          saturation={isAurora ? 0.5 : 0}
          fade
          speed={isAurora ? 0.2 : 0.5}
        />
      )}
      <AuroraBorealis />
      <LightningEffect />
      {isNight && <Moon />}
    </>
  )
}

// ─── Moon for night time ─────────────────────────────────────────────────────
function Moon() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.02) * 0.05
  })

  return (
    <group ref={groupRef} position={[80, 80, -80]}>
      {/* Moon sphere */}
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial
          color="#e8e8d0"
          emissive="#d0d0b8"
          emissiveIntensity={0.5}
          roughness={0.9}
        />
      </mesh>
      {/* Craters */}
      <mesh position={[3, 2, 6]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#c8c8b0" roughness={0.95} />
      </mesh>
      <mesh position={[-2, -3, 7]}>
        <sphereGeometry args={[2, 12, 12]} />
        <meshStandardMaterial color="#c0c0a8" roughness={0.95} />
      </mesh>
      <mesh position={[1, 4, 5.5]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#d0d0b8" roughness={0.95} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color="#e8e8d0" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      {/* Moonlight */}
      <pointLight position={[0, 0, 0]} color="#a0b8d0" intensity={0.5} distance={200} />
    </group>
  )
}

// ─── CSS overlay for rain / snow / storm / blizzard / aurora ─────────────────
export function WeatherOverlay() {
  const { player } = useGameStore()
  const weatherType = player?.weather?.current?.type ?? 'clear'
  const windSpeed   = player?.weather?.current?.windSpeed ?? 0

  const particles = useMemo(() => {
    const count =
      weatherType === 'blizzard' ? 200 :
      weatherType === 'storm'    ? 150 :
      weatherType === 'snow'     ? 120 :
      weatherType === 'rain'     ? 100 :
      weatherType === 'hurricane' ? 250 :
      weatherType === 'supercell' ? 200 :
      weatherType === 'ice_storm' ? 180 :
      weatherType === 'volcanic_ash' ? 300 :
      weatherType === 'tornado'   ? 80 : 0

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.4 + Math.random() * 0.8,
      size: weatherType === 'rain' || weatherType === 'storm' || weatherType === 'hurricane' || weatherType === 'supercell'
        ? 1 + Math.random()
        : weatherType === 'volcanic_ash'
        ? 2 + Math.random() * 3
        : 3 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.5,
    }))
  }, [weatherType])

  const showOverlay = ['rain', 'snow', 'storm', 'blizzard', 'fog', 'aurora', 'whiteout', 'hurricane', 'tornado', 'supercell', 'ice_storm', 'volcanic_ash', 'tsunami', 'rogue_wave'].includes(weatherType)
  if (!showOverlay) return null

  const isSnow = weatherType === 'snow' || weatherType === 'blizzard' || weatherType === 'whiteout' || weatherType === 'ice_storm'
  const isAsh = weatherType === 'volcanic_ash'
  const windAngle = Math.min(windSpeed * 1.5, 45)

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">

      {/* Fog / Ash overlay */}
      {(weatherType === 'fog' || weatherType === 'whiteout' || weatherType === 'volcanic_ash') && (
        <div 
          className="absolute inset-0 backdrop-blur-[1px]"
          style={{
            backgroundColor: weatherType === 'whiteout' ? 'rgba(255,255,255,0.7)'
              : weatherType === 'volcanic_ash' ? 'rgba(30,20,15,0.7)'
              : 'rgba(136,153,170,0.4)',
          }}
        />
      )}

      {/* Aurora overlay */}
      {weatherType === 'aurora' && (
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(34,197,94,0.05) 30%, rgba(6,182,212,0.08) 50%, rgba(139,92,246,0.06) 70%, transparent 100%)',
          animation: 'auroraShift 8s ease-in-out infinite',
        }} />
      )}

      {/* Meteor shower overlay */}
      {weatherType === 'meteor_shower' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(255,200,50,0.08) 0%, transparent 60%)',
          animation: 'auroraShift 12s ease-in-out infinite',
        }} />
      )}

      {/* Blood moon overlay */}
      {weatherType === 'blood_moon' && (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(180,20,20,0.2) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
      )}

      {/* Storm darkness vignette */}
      {(weatherType === 'storm' || weatherType === 'blizzard' || weatherType === 'hurricane' || weatherType === 'tornado' || weatherType === 'supercell' || weatherType === 'tsunami' || weatherType === 'rogue_wave') && (
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.8) 100%)' }}
        />
      )}

      {/* Lightning flash for storms */}
      {(weatherType === 'storm' || weatherType === 'thunderstorm' || weatherType === 'supercell' || weatherType === 'tornado' || weatherType === 'hurricane') && (
        <div className="absolute inset-0 bg-white/0" style={{ animation: 'lightning 4s ease-in-out infinite' }} />
      )}

      {/* Disaster warning border */}
      {(weatherType === 'hurricane' || weatherType === 'tornado' || weatherType === 'tsunami' || weatherType === 'rogue_wave') && (
        <div className="absolute inset-0 border-4 border-red-500/30" style={{ animation: 'disasterPulse 1s ease-in-out infinite' }} />
      )}

      {/* Rain / Snow / Ash particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationName: isSnow ? 'snowfall' : isAsh ? 'ashfall' : 'rainfall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            transform: `rotate(${windAngle}deg)`,
          }}
        >
          {isSnow ? (
            <div
              className="rounded-full"
              style={{
                width: p.size, height: p.size, opacity: p.opacity,
                backgroundColor: weatherType === 'ice_storm' ? '#b0d0e8' : '#ffffff',
              }}
            />
          ) : isAsh ? (
            <div
              className="rounded-full"
              style={{ width: p.size * 2, height: p.size * 2, opacity: p.opacity * 0.8, backgroundColor: '#4a3a2a' }}
            />
          ) : (
            <div
              className="bg-slate-300/70"
              style={{ width: 1.5, height: p.size * 12, opacity: p.opacity }}
            />
          )}
        </div>
      ))}

      {/* Screen shake for extreme events */}
      {(weatherType === 'whiteout' || weatherType === 'hurricane' || weatherType === 'tornado' || weatherType === 'tsunami' || weatherType === 'rogue_wave' || weatherType === 'supercell') && (
        <div className="absolute inset-0" style={{
          animation: weatherType === 'whiteout' ? 'whiteoutShake 0.1s linear infinite' : 'disasterShake 0.08s linear infinite',
          background: weatherType === 'whiteout' ? 'rgba(255,255,255,0.1)' : 'transparent',
        }} />
      )}

      <style>{`
        @keyframes rainfall {
          0%   { transform: translateY(-20px) rotate(${windAngle}deg); }
          100% { transform: translateY(110vh) rotate(${windAngle}deg); }
        }
        @keyframes snowfall {
          0%   { transform: translateY(-10px) translateX(0px); }
          50%  { transform: translateY(50vh)  translateX(${windAngle / 2}px); }
          100% { transform: translateY(110vh) translateX(${windAngle}px); }
        }
        @keyframes ashfall {
          0%   { transform: translateY(-20px) translateX(0px); opacity: 0.8; }
          50%  { transform: translateY(50vh)  translateX(${windAngle / 2}px); opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(${windAngle}px); opacity: 0.1; }
        }
        @keyframes lightning {
          0%, 93%, 96%, 100% { background-color: transparent; }
          94%, 95%           { background-color: rgba(255,255,255,0.15); }
        }
        @keyframes auroraShift {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes whiteoutShake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -2px); }
        }
        @keyframes disasterShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-3px, 2px) rotate(-1deg); }
          20% { transform: translate(3px, -2px) rotate(1deg); }
          30% { transform: translate(-2px, -3px) rotate(0deg); }
          40% { transform: translate(2px, 3px) rotate(-1deg); }
          50% { transform: translate(-3px, -2px) rotate(1deg); }
          60% { transform: translate(3px, 2px) rotate(0deg); }
          70% { transform: translate(-2px, 3px) rotate(-1deg); }
          80% { transform: translate(2px, -3px) rotate(1deg); }
          90% { transform: translate(-3px, -2px) rotate(0deg); }
        }
        @keyframes disasterPulse {
          0%, 100% { border-color: rgba(255, 0, 0, 0.2); }
          50% { border-color: rgba(255, 0, 0, 0.6); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
