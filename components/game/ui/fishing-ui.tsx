'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/lib/game/store'
import { FISH_SPECIES, TOKEN_TYPES, type FishSpecies, type FishingMethod, type TokenType } from '@/lib/game/types'
import { rollForTokenWhileFishing } from '@/lib/game/fishing-engine'
import type { TokenDiscoveryResult } from '@/lib/game/fishing-engine'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Fish,
  Anchor,
  Timer,
  Sparkles,
  X,
  Waves,
} from 'lucide-react'

interface FishingUIProps {
  isInFishingZone: boolean
}

type FishingState = 'idle' | 'casting' | 'waiting' | 'biting' | 'reeling' | 'caught' | 'escaped'

const RARITY_COLORS = {
  common: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  uncommon: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  rare: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  mythical: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function FishingUI({ isInFishingZone }: FishingUIProps) {
  const { player, catchFish, addXP, addToInventory, getCurrentBoat, updateChallengeProgress } = useGameStore()
  const [fishingState, setFishingState] = useState<FishingState>('idle')
  const [progress, setProgress] = useState(0)
  const [targetFish, setTargetFish] = useState<FishSpecies | null>(null)
  const [caughtFish, setCaughtFish] = useState<{ species: FishSpecies; quantity: number } | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<FishingMethod>('rod')
  const [showResults, setShowResults] = useState(false)
  const [tokenDiscovery, setTokenDiscovery] = useState<TokenDiscoveryResult | null>(null)

  const currentBoat = getCurrentBoat()
  const hasTool = player?.ownedTools.some(t => t.method === selectedMethod)

  // Get available methods based on owned tools
  const availableMethods = player?.ownedTools.map(t => t.method) ?? []

  // Determine catch based on method and luck
  const determineCatch = useCallback((): FishSpecies | null => {
    const eligibleFish = FISH_SPECIES.filter(f => f.methods.includes(selectedMethod))
    if (eligibleFish.length === 0) return null

    // Weighted random selection based on rarity
    const weights = eligibleFish.map(f => {
      switch (f.rarity) {
        case 'common': return 50
        case 'uncommon': return 30
        case 'rare': return 15
        case 'legendary': return 5
        default: return 50
      }
    })

    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < eligibleFish.length; i++) {
      random -= weights[i]
      if (random <= 0) return eligibleFish[i]
    }

    return eligibleFish[0]
  }, [selectedMethod])

  // Start fishing
  const startFishing = () => {
    if (!hasTool || !isInFishingZone) return
    
    setFishingState('casting')
    setProgress(0)
    
    // Casting animation
    setTimeout(() => {
      setFishingState('waiting')
      
      // Random wait time for bite
      const waitTime = 2000 + Math.random() * 4000
      setTimeout(() => {
        const fish = determineCatch()
        if (fish && Math.random() > 0.3) { // 70% chance of bite
          setTargetFish(fish)
          setFishingState('biting')
        } else {
          setFishingState('escaped')
          setTimeout(() => setFishingState('idle'), 2000)
        }
      }, waitTime)
    }, 1000)
  }

  // Handle reeling
  const handleReel = () => {
    if (fishingState !== 'biting') return
    
    setFishingState('reeling')
    setProgress(0)
  }

  // Reeling progress — setInterval força re-renders React corretamente
  // visibilitychange reinicia o intervalo ao voltar de outra tab
  useEffect(() => {
    if (fishingState !== 'reeling') return

    let intervalId: ReturnType<typeof setInterval>

    const startInterval = () => {
      intervalId = setInterval(() => {
        setProgress(p => {
          const newProgress = p + 2 + Math.random() * 3

          if (newProgress >= 100) {
            clearInterval(intervalId)
            if (targetFish) {
              const tool = player?.ownedTools.find(t => t.method === selectedMethod)
              const quantity = selectedMethod === 'trawl' || selectedMethod === 'net'
                ? Math.floor(1 + Math.random() * 3 * (tool?.efficiency ?? 1))
                : 1
              catchFish(targetFish.id, quantity)
              const xpGain = targetFish.rarity === 'legendary' ? 50 :
                             targetFish.rarity === 'rare' ? 25 :
                             targetFish.rarity === 'uncommon' ? 15 : 10
              addXP(xpGain * quantity)
              setCaughtFish({ species: targetFish, quantity })
              setFishingState('caught')
              setShowResults(true)

              // Roll for token discovery
              const toolEff = player?.ownedTools.find(t => t.method === selectedMethod)?.efficiency ?? 1
              const tokenRoll = rollForTokenWhileFishing(targetFish.rarity, player?.weather.current.type || 'clear', toolEff, 0)
              if (tokenRoll.foundToken && tokenRoll.tokenType) {
                addToInventory({ id: crypto.randomUUID(), type: 'token', itemId: tokenRoll.tokenType, quantity: 1 })
                setTokenDiscovery(tokenRoll)
                updateChallengeProgress('catch', quantity)
              }
            }
            return 100
          }

          if (Math.random() < 0.01) {
            clearInterval(intervalId)
            setFishingState('escaped')
            setTimeout(() => setFishingState('idle'), 2000)
            return p
          }

          return newProgress
        })
      }, 100)
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearInterval(intervalId)
        startInterval()
      }
    }

    startInterval()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [fishingState, targetFish, player, selectedMethod, catchFish, addXP])

  // Close results and reset
  const closeResults = () => {
    setShowResults(false)
    setCaughtFish(null)
    setTargetFish(null)
    setFishingState('idle')
    setProgress(0)
    setTokenDiscovery(null)
  }

  if (!player) return null
  // Keep mounted during active fishing even if player drifts out of zone
  // so the interval and state are never destroyed mid-reel
  const isActive = fishingState !== 'idle'
  if (!isInFishingZone && !isActive) return null

  return (
    <>
      {/* Fishing Controls */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <Card className="bg-slate-900/90 backdrop-blur-sm border-cyan-500/30 shadow-xl">
          <CardContent className="p-4">
            {fishingState === 'idle' && (
              <div className="space-y-3">
                {/* Method selection */}
                <div className="flex gap-2 justify-center">
                  {(['rod', 'trap', 'net', 'trawl'] as FishingMethod[]).map((method) => {
                    const hasMethod = availableMethods.includes(method)
                    return (
                      <Button
                        key={method}
                        variant={selectedMethod === method ? 'default' : 'outline'}
                        size="sm"
                        disabled={!hasMethod}
                        onClick={() => setSelectedMethod(method)}
                        className={`capitalize ${
                          selectedMethod === method 
                            ? 'bg-cyan-600 text-white' 
                            : 'border-slate-600 text-slate-400'
                        } ${!hasMethod ? 'opacity-50' : ''}`}
                      >
                        {method}
                      </Button>
                    )
                  })}
                </div>
                
                {/* Cast button */}
                <Button
                  onClick={startFishing}
                  disabled={!hasTool}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                >
                  <Anchor className="w-4 h-4 mr-2" />
                  {hasTool ? 'Cast Line' : 'No Tool Equipped'}
                </Button>
                
                {!hasTool && (
                  <p className="text-center text-slate-500 text-xs">
                    Buy fishing tools at a marketplace
                  </p>
                )}
              </div>
            )}

            {fishingState === 'casting' && (
              <div className="text-center py-4">
                <Waves className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                <p className="text-slate-300 mt-2">Casting...</p>
              </div>
            )}

            {fishingState === 'waiting' && (
              <div className="text-center py-4">
                <div className="relative">
                  <Timer className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                </div>
                <p className="text-slate-300 mt-2">Waiting for a bite...</p>
                <p className="text-slate-500 text-xs">Stay alert!</p>
              </div>
            )}

            {fishingState === 'biting' && (
              <div className="text-center py-4 animate-pulse">
                <Fish className="w-8 h-8 text-yellow-400 mx-auto" />
                <p className="text-yellow-400 font-bold mt-2">Something is biting!</p>
                <Button
                  onClick={handleReel}
                  className="mt-2 bg-yellow-600 hover:bg-yellow-500 text-white animate-bounce"
                >
                  Reel In Now!
                </Button>
              </div>
            )}

            {fishingState === 'reeling' && (
              <div className="space-y-3 min-w-64">
                <div className="text-center">
                  <p className="text-cyan-400 font-semibold animate-pulse">Reeling in...</p>
                  {targetFish && (
                    <Badge className={RARITY_COLORS[targetFish.rarity]}>
                      {targetFish.rarity}
                    </Badge>
                  )}
                </div>
                {/* Raw bar — não depende de CSS transitions do shadcn */}
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full bg-cyan-500 transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-slate-400 text-sm font-mono">{Math.round(progress)}%</p>
              </div>
            )}

            {fishingState === 'escaped' && (
              <div className="text-center py-4">
                <X className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-red-400 mt-2">It got away!</p>
                <p className="text-slate-500 text-xs">Better luck next time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Catch Results Dialog */}
      <Dialog open={showResults} onOpenChange={closeResults}>
        <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-sm z-[100]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              Catch!
            </DialogTitle>
          </DialogHeader>
          
          {caughtFish && (
            <div className="text-center py-4">
              <div className={`inline-block p-4 rounded-full mb-4 ${
                caughtFish.species.rarity === 'legendary' ? 'bg-yellow-500/20' :
                caughtFish.species.rarity === 'rare' ? 'bg-purple-500/20' :
                caughtFish.species.rarity === 'uncommon' ? 'bg-blue-500/20' :
                'bg-slate-500/20'
              }`}>
                <Fish className={`w-12 h-12 ${
                  caughtFish.species.rarity === 'legendary' ? 'text-yellow-400' :
                  caughtFish.species.rarity === 'rare' ? 'text-purple-400' :
                  caughtFish.species.rarity === 'uncommon' ? 'text-blue-400' :
                  'text-slate-300'
                }`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">
                {caughtFish.quantity}x {caughtFish.species.name}
              </h3>
              
              <Badge className={RARITY_COLORS[caughtFish.species.rarity]}>
                {caughtFish.species.rarity}
              </Badge>
              
              <p className="text-slate-400 mt-3 text-sm">
                {caughtFish.species.description}
              </p>
              
              {tokenDiscovery && tokenDiscovery.foundToken && (
                <div className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{tokenDiscovery.tokenIcon}</span>
                    <span className="text-purple-400 font-bold">Token Discovered!</span>
                  </div>
                  <p className="text-purple-300 text-sm">{tokenDiscovery.tokenName}</p>
                  <p className="text-slate-400 text-xs mt-1">Added to inventory</p>
                </div>
              )}
              
              <div className="mt-4 bg-slate-800 rounded-lg p-3">
                <p className="text-slate-400 text-sm">Value</p>
                <p className="text-yellow-400 font-bold text-lg">
                  {caughtFish.species.baseValue * caughtFish.quantity} Gold
                </p>
              </div>
              
              <Button
                onClick={closeResults}
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Continue Fishing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
