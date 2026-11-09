'use client'

import { Suspense, useState, useEffect, useCallback, useRef, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Stars, Html } from '@react-three/drei'
import { WeatherScene, WeatherOverlay } from './ui/weather-effects'
import { CombatUI } from './ui/combat-ui'
import { useGameStore } from '@/lib/game/store'
import { LOCATIONS } from '@/lib/game/world-data'
import { isNearLocation } from '@/lib/game/world-data'
import type { Position, Location } from '@/lib/game/types'

import { GameWorld } from './world/game-world'
import { PlayerController } from './entities/player-controller'
import { GameHUD } from './ui/game-hud'
import { PauseMenu } from './menus/pause-menu'
import { InnMenu } from './ui/inn-menu'
import { MarketplaceMenu } from './ui/marketplace-menu'
import { DockMenu } from './ui/dock-menu'
import { FishingUI } from './ui/fishing-ui'
import { GarageMenu } from './ui/garage-menu'
import { TreasureHuntMenu } from './ui/treasure-hunt-menu'
import { CrewMenu } from './ui/crew-menu'
import { ChallengesMenu } from './ui/challenges-menu'
import { RepairMenu } from './ui/repair-menu'
import { InventoryMenu } from './ui/inventory-menu'
import { SonarUI } from './ui/sonar-ui'
import { CompassHUD } from './ui/compass-hud'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

// Error boundary for catching WebGL and Three.js errors
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: () => void
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[v0] WebGL Error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
            <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">Graphics Error</h1>
              <p className="text-slate-400 mb-4">
                An error occurred while rendering the game. This may be due to WebGL limitations or graphics driver issues.
              </p>
              <p className="text-slate-500 text-sm font-mono bg-slate-800 p-2 rounded">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Reload Game
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface GameSceneProps {
  onMainMenu: () => void
}

function LoadingScreen() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8 text-cyan-400" />
        <p className="text-cyan-400 text-lg">Loading world...</p>
      </div>
    </Html>
  )
}

export function GameScene({ onMainMenu }: GameSceneProps) {
  const { player, gameState, setGameState, updatePlayTime, triggerAutoSave, tickGameTime } = useGameStore()
  const [nearbyLocation, setNearbyLocation] = useState<Location | null>(null)
  const [activeMenu, setActiveMenu] = useState<'inn' | 'marketplace' | 'dock' | 'garage' | 'treasure' | 'crew' | 'challenges' | 'repair' | 'inventory' | null>(null)
  const [isInFishingZone, setIsInFishingZone] = useState(false)

  const quality = player?.settings.graphicsQuality ?? 'high'

  const nearbyLocationRef = useRef<Location | null>(null)

  // Normalize player data for new fields (backwards compatibility)
  useEffect(() => {
    if (player) {
      const updates: Partial<typeof player> = {}
      if (!player.ownedUpgrades) updates.ownedUpgrades = []
      if (!player.tradeMarket) updates.tradeMarket = []
      if (Object.keys(updates).length > 0) {
        useGameStore.setState({ player: { ...player, ...updates } })
      }
    }
  }, [player?.id])

  // Handle position changes to detect nearby locations
  const handlePositionChange = useCallback((position: Position) => {
    const { player } = useGameStore.getState()
    let foundLocation: Location | null = null
    let inFishing = false
    const discoveredSecrets = player?.discoveredSecrets || []

    for (const location of LOCATIONS) {
      // Skip secret locations that haven't been discovered yet
      if (location.type === 'secret' && !discoveredSecrets.includes(location.id)) continue
      if (isNearLocation(position, location.position, 6)) {
        foundLocation = location
        if (location.type === 'fishing_zone') {
          inFishing = true
        }
        break
      }
    }

    nearbyLocationRef.current = foundLocation
    setNearbyLocation(foundLocation)
    setIsInFishingZone(inFishing)
  }, [])

  // Handle keyboard input for interactions and pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused')
        } else if (gameState === 'paused') {
          setGameState('playing')
        }
      }

      // Use ref to always get the latest nearbyLocation — avoids stale closure
      if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && gameState === 'playing') {
        const loc = nearbyLocationRef.current
        if (!loc) return
        if (loc.type === 'inn') setActiveMenu('inn')
        else if (loc.type === 'marketplace') setActiveMenu('marketplace')
        else if (loc.type === 'dock') setActiveMenu('dock')
        else if (loc.type === 'garage') setActiveMenu('garage')
        else if (loc.type === 'treasure_hunt') setActiveMenu('treasure')
        else if (loc.type === 'repair') setActiveMenu('repair')
        else if (loc.type === 'crew') setActiveMenu('crew')
        else if (loc.type === 'challenges') setActiveMenu('challenges')
        else if (loc.type === 'secret') {
          // Show a quick notification when entering a discovered secret location
          setActiveMenu(null) // No special menu, but could show a toast
        }
      }

      if (e.key === 'F5' && gameState === 'playing') {
        e.preventDefault()
        triggerAutoSave()
      }

      // Inventory toggle with I
      if ((e.key === 'i' || e.key === 'I') && gameState === 'playing') {
        setActiveMenu(prev => prev === 'inventory' ? null : 'inventory')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, setGameState, triggerAutoSave])

  // Main game loop — setInterval a 1 segundo é suficiente para tempo/clima
  // O rAF não força re-renders React; o setInterval sim via Zustand set()
  useEffect(() => {
    if (gameState !== 'playing') return

    let autoSaveAccum = 0

    const interval = setInterval(() => {
      updatePlayTime(1)
      tickGameTime(1)
      autoSaveAccum += 1
      if (autoSaveAccum >= 5 * 60) {
        autoSaveAccum = 0
        triggerAutoSave()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, updatePlayTime, tickGameTime, triggerAutoSave])

  const handlePause = () => {
    setGameState('paused')
  }

  const handleResume = () => {
    setGameState('playing')
  }

  const handleCloseMenu = () => {
    setActiveMenu(null)
  }

  if (!player) return null

  return (
    <WebGLErrorBoundary>
      <div className="w-full h-screen relative bg-slate-900">
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 15, 20], fov: 60 }}
          gl={{ 
            antialias: quality !== 'low', 
            alpha: false,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'default',
          }}
          dpr={quality === 'high' ? [1, 2] : [1, 1]}
          onCreated={({ gl }) => {
            // Log successful WebGL context creation
            console.log('[v0] WebGL context created successfully')
          }}
        >
        <Suspense fallback={<LoadingScreen />}>
          {/* Dynamic weather: fog, lighting, sky — reacts to player.weather */}
          <WeatherScene />

          {/* Stars (visible at night / clear arctic sky) */}
          <Stars
            radius={300}
            depth={60}
            count={quality === 'high' ? 5000 : 2000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Fog for atmosphere — now managed dynamically by WeatherScene */}

          {/* Game World */}
          <GameWorld
            playerPosition={player.position}
            quality={quality}
            onLocationClick={(locationId) => {
              const location = LOCATIONS.find(l => l.id === locationId)
              if (location) {
                if (location.type === 'inn') setActiveMenu('inn')
                else if (location.type === 'marketplace') setActiveMenu('marketplace')
                else if (location.type === 'dock') setActiveMenu('dock')
                else if (location.type === 'garage') setActiveMenu('garage')
                else if (location.type === 'treasure_hunt') setActiveMenu('treasure')
                else if (location.type === 'repair') setActiveMenu('repair')
                else if (location.type === 'crew') setActiveMenu('crew')
                else if (location.type === 'challenges') setActiveMenu('challenges')
              }
            }}
          />

          {/* Player */}
          <PlayerController
            onPositionChange={handlePositionChange}
            controlScheme={player.settings.controlScheme}
          />
        </Suspense>
      </Canvas>

      {/* CSS weather overlay — rain, snow, fog, storm particles */}
      <WeatherOverlay />

      {/* Combat UI — shown when an encounter triggers */}
      <CombatUI />

      {/* HUD Overlay */}
      {gameState === 'playing' && (
        <GameHUD
          onPause={handlePause}
          onInventory={() => setActiveMenu(prev => prev === 'inventory' ? null : 'inventory')}
          nearLocation={nearbyLocation ? {
            type: nearbyLocation.type.replace('_', ' '),
            name: nearbyLocation.name,
          } : null}
        />
      )}

      {/* Fishing UI */}
      {gameState === 'playing' && (
        <FishingUI isInFishingZone={isInFishingZone} />
      )}

      {/* Sonar UI — always available with radar upgrade */}
      {gameState === 'playing' && (
        <SonarUI />
      )}

      {/* Compass HUD — navigation */}
      {gameState === 'playing' && (
        <CompassHUD />
      )}

      {/* Pause Menu */}
      {gameState === 'paused' && (
        <PauseMenu onResume={handleResume} onMainMenu={onMainMenu} />
      )}

      {/* Inn Menu */}
      {activeMenu === 'inn' && nearbyLocation && (
        <InnMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Marketplace Menu */}
      {activeMenu === 'marketplace' && nearbyLocation && (
        <MarketplaceMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Dock Menu */}
      {activeMenu === 'dock' && nearbyLocation && (
        <DockMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Garage Menu */}
      {activeMenu === 'garage' && nearbyLocation && (
        <GarageMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Treasure Hunt Menu */}
      {activeMenu === 'treasure' && nearbyLocation && (
        <TreasureHuntMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Crew Menu */}
      {activeMenu === 'crew' && nearbyLocation && (
        <CrewMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Challenges Menu */}
      {activeMenu === 'challenges' && nearbyLocation && (
        <ChallengesMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Repair Menu */}
      {activeMenu === 'repair' && nearbyLocation && (
        <RepairMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Inventory Menu */}
      {activeMenu === 'inventory' && (
        <InventoryMenu
          location={nearbyLocation}
          open={true}
          onClose={handleCloseMenu}
        />
      )}

      {/* Loading/Saving indicators */}
      {(gameState === 'loading' || gameState === 'saving') && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 border border-cyan-500/30 flex flex-col items-center gap-4">
            <Spinner className="w-8 h-8 text-cyan-400" />
            <p className="text-cyan-400 text-lg">
              {gameState === 'loading' ? 'Loading...' : 'Saving...'}
            </p>
          </div>
        </div>
      )}
      </div>
    </WebGLErrorBoundary>
  )
}
