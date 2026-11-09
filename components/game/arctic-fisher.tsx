'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { StartMenu } from './menus/start-menu'
import { GameScene } from './game-scene'
import { GamePreview } from './game-preview'
import { Spinner } from '@/components/ui/spinner'

// Check if WebGL is available
function checkWebGLSupport(): { supported: boolean; message: string } {
  if (typeof window === 'undefined') {
    return { supported: false, message: 'Server-side rendering detected' }
  }
  
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (gl) {
      return { supported: true, message: 'WebGL is supported' }
    } else {
      return { supported: false, message: 'WebGL is not supported by your browser or device' }
    }
  } catch (e) {
    return { supported: false, message: 'Error checking WebGL support' }
  }
}

export function ArcticFisher() {
  const { gameState, setGameState, loadSaveSlots, player } = useGameStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showGame, setShowGame] = useState(false)
  const [webglSupport, setWebglSupport] = useState<{ supported: boolean; message: string } | null>(null)

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Check WebGL support
      const support = checkWebGLSupport()
      setWebglSupport(support)
      
      if (support.supported) {
        await loadSaveSlots()
      }
      setIsLoading(false)
    }
    init()
  }, [loadSaveSlots])

  const handleStartGame = () => {
    setShowGame(true)
  }

  const handleMainMenu = () => {
    setShowGame(false)
    setGameState('menu')
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-cyan-400" />
          <p className="text-cyan-400 text-lg">Loading Arctic Fisher...</p>
        </div>
      </div>
    )
  }

  // Show WebGL not supported - display game preview instead
  if (webglSupport && !webglSupport.supported) {
    return <GamePreview />
  }

  // Show start menu or game
  if (!showGame || gameState === 'menu') {
    return <StartMenu onStartGame={handleStartGame} />
  }

  // Show game scene
  if (player && (gameState === 'playing' || gameState === 'paused' || gameState === 'loading' || gameState === 'saving')) {
    return <GameScene onMainMenu={handleMainMenu} />
  }

  // Fallback to menu
  return <StartMenu onStartGame={handleStartGame} />
}
