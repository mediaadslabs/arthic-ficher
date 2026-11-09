'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Boat } from './boat'
import { useGameStore } from '@/lib/game/store'
import type { BoatTier, Position } from '@/lib/game/types'

interface PlayerControllerProps {
  onPositionChange?: (position: Position) => void
  controlScheme?: 'wasd' | 'arrows'
}

export function PlayerController({ onPositionChange, controlScheme = 'wasd' }: PlayerControllerProps) {
  const { player, getCurrentBoat, updatePlayerPosition, updatePlayerRotation } = useGameStore()
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  
  const currentBoat = getCurrentBoat()
  const speed = currentBoat?.speed ?? 3
  const hasBoat = !!currentBoat

  // Key handlers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    
    if (controlScheme === 'wasd') {
      if (key === 'w') setKeys(k => ({ ...k, forward: true }))
      if (key === 's') setKeys(k => ({ ...k, backward: true }))
      if (key === 'a') setKeys(k => ({ ...k, left: true }))
      if (key === 'd') setKeys(k => ({ ...k, right: true }))
    } else {
      if (key === 'arrowup') setKeys(k => ({ ...k, forward: true }))
      if (key === 'arrowdown') setKeys(k => ({ ...k, backward: true }))
      if (key === 'arrowleft') setKeys(k => ({ ...k, left: true }))
      if (key === 'arrowright') setKeys(k => ({ ...k, right: true }))
    }
  }, [controlScheme])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    
    if (controlScheme === 'wasd') {
      if (key === 'w') setKeys(k => ({ ...k, forward: false }))
      if (key === 's') setKeys(k => ({ ...k, backward: false }))
      if (key === 'a') setKeys(k => ({ ...k, left: false }))
      if (key === 'd') setKeys(k => ({ ...k, right: false }))
    } else {
      if (key === 'arrowup') setKeys(k => ({ ...k, forward: false }))
      if (key === 'arrowdown') setKeys(k => ({ ...k, backward: false }))
      if (key === 'arrowleft') setKeys(k => ({ ...k, left: false }))
      if (key === 'arrowright') setKeys(k => ({ ...k, right: false }))
    }
  }, [controlScheme])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Initialize position from player state
  useEffect(() => {
    if (player && groupRef.current) {
      groupRef.current.position.set(player.position.x, 0, player.position.z)
      groupRef.current.rotation.y = player.rotation.y
    }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current || !player) return
    
    // Calculate movement
    direction.current.set(0, 0, 0)
    
    if (keys.forward) direction.current.z -= 1
    if (keys.backward) direction.current.z += 1
    if (keys.left) direction.current.x -= 1
    if (keys.right) direction.current.x += 1
    
    direction.current.normalize()
    
    // Apply rotation for turning
    if (direction.current.x !== 0) {
      groupRef.current.rotation.y -= direction.current.x * delta * 2
    }
    
    // Move forward/backward in facing direction
    if (direction.current.z !== 0) {
      const moveSpeed = hasBoat ? speed : speed * 0.5 // Slower without boat
      velocity.current.z = direction.current.z * moveSpeed * delta
      
      // Convert local direction to world direction
      const worldDirection = new THREE.Vector3(0, 0, velocity.current.z)
      worldDirection.applyQuaternion(groupRef.current.quaternion)
      
      groupRef.current.position.add(worldDirection)
    }
    
    // Update camera to follow player
    const idealOffset = new THREE.Vector3(0, 15, 20)
    idealOffset.applyQuaternion(groupRef.current.quaternion)
    idealOffset.add(groupRef.current.position)
    
    camera.position.lerp(idealOffset, delta * 2)
    camera.lookAt(groupRef.current.position)
    
    // Update game state
    const newPosition: Position = {
      x: groupRef.current.position.x,
      y: groupRef.current.position.y,
      z: groupRef.current.position.z,
    }
    
    updatePlayerPosition(newPosition)
    updatePlayerRotation({
      x: groupRef.current.rotation.x,
      y: groupRef.current.rotation.y,
      z: groupRef.current.rotation.z,
    })
    
    onPositionChange?.(newPosition)
  })

  if (!player) return null

  return (
    <group ref={groupRef}>
      {hasBoat ? (
        <Boat tier={currentBoat.tier as BoatTier} isPlayer />
      ) : (
        // Player character when no boat (swimming/walking)
        <PlayerCharacter />
      )}
      
      {/* Player light */}
      <pointLight
        position={[0, 3, 0]}
        color="#ffffff"
        intensity={0.5}
        distance={15}
      />
    </group>
  )
}

// Simple player character for when walking/swimming
function PlayerCharacter() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Bob animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color="#2d4a6f" roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>
      
      {/* Hat */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.25, 0.15, 8]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
        <meshStandardMaterial color="#333" roughness={0.9} />
      </mesh>
    </group>
  )
}
