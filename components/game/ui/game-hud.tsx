'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { FISH_SPECIES, TOKEN_TYPES } from '@/lib/game/types'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { TimeWeatherDisplay } from './time-weather-display'
import { 
  Coins, 
  Star, 
  Anchor, 
  Ship, 
  Package, 
  MapPin,
  Pause,
  Fish,
  Sparkles,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react'
import { ChatPanel } from './chat-panel'

interface GameHUDProps {
  onPause: () => void
  onInventory?: () => void
  nearLocation?: { type: string; name: string } | null
}

export function GameHUD({ onPause, onInventory, nearLocation }: GameHUDProps) {
  const { player, getCurrentBoat, getInventoryCapacity, getCosmeticBonus } = useGameStore()
  const [showChat, setShowChat] = useState(false)
  
  if (!player) return null
  
  const currentBoat = getCurrentBoat()
  const xpProgress = player.xp > 0 ? ((player.xp % player.xpToNextLevel) / player.xpToNextLevel) * 100 : 0
  
  // Calculate inventory usage
  const totalItems = player.inventory.reduce((sum, item) => sum + item.quantity, 0)
  const maxStorage = getInventoryCapacity()
  const storagePercent = (totalItems / maxStorage) * 100
  const cosmeticStorageBonus = getCosmeticBonus('inventorySpace')
  
  // Get fish count for display
  const fishInventory = player.inventory.filter(i => i.type === 'fish')
  const totalFish = fishInventory.reduce((sum, i) => sum + i.quantity, 0)

  // Get token count for display
  const tokenInventory = player.inventory.filter(i => i.type === 'token')
  const totalTokens = tokenInventory.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {/* Player Stats - Left */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 shadow-lg min-w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg p-2">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-lg">{player.name}</p>
              <p className="text-cyan-400 text-sm">Level {player.level}</p>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                Experience
              </span>
              <span className="text-slate-400">
                {Math.floor(player.xp % player.xpToNextLevel)} / {player.xpToNextLevel}
              </span>
            </div>
            <Progress value={xpProgress} className="h-2 bg-slate-700" />
          </div>
          
          {/* Gold */}
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
            <span className="text-slate-400 text-sm">Gold</span>
          </div>
        </div>

        {/* Time & Weather + Pause - Right */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowChat(!showChat)}
              variant="outline"
              size="icon"
              className="bg-slate-900/80 backdrop-blur-sm border-slate-600 hover:bg-slate-800 text-green-400 h-12 w-12 relative"
            >
              <MessageCircle className="w-5 h-5" />
              {(player.chat.unreadWorld + player.chat.unreadClan) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                  {player.chat.unreadWorld + player.chat.unreadClan}
                </span>
              )}
            </Button>
            <Button
              onClick={onInventory}
              variant="outline"
              size="icon"
              className="bg-slate-900/80 backdrop-blur-sm border-slate-600 hover:bg-slate-800 text-purple-400 h-12 w-12"
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <Button
              onClick={onPause}
              variant="outline"
              size="icon"
              className="bg-slate-900/80 backdrop-blur-sm border-slate-600 hover:bg-slate-800 text-slate-300 h-12 w-12"
            >
              <Pause className="w-6 h-6" />
            </Button>
          </div>
          <TimeWeatherDisplay />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
        {/* Boat Info - Left */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 shadow-lg min-w-56">
          {currentBoat ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Ship className="w-5 h-5 text-cyan-400" />
                <span className="font-semibold text-white">{currentBoat.name}</span>
              </div>
              
              {/* Storage */}
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Storage
                  </span>
                  <span className="text-slate-400">{totalItems} / {maxStorage}</span>
                </div>
                <Progress 
                  value={storagePercent} 
                  className={`h-2 ${storagePercent > 90 ? 'bg-red-900' : 'bg-slate-700'}`}
                />
                {cosmeticStorageBonus > 0 && (
                  <p className="text-green-400 text-[10px]">+{cosmeticStorageBonus} from cosmetics</p>
                )}
              </div>
              
              {/* Durability */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Durability</span>
                  <span className="text-slate-400">{currentBoat.durability} / {currentBoat.maxDurability}</span>
                </div>
                <Progress 
                  value={(currentBoat.durability / currentBoat.maxDurability) * 100} 
                  className="h-2 bg-slate-700"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <Ship className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No boat equipped</p>
              <p className="text-slate-500 text-xs">Visit a marketplace</p>
            </div>
          )}
        </div>

        {/* Quick Inventory - Center */}
        {totalFish > 0 && (
          <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Fish className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">Catch ({totalFish})</span>
            </div>
            <div className="flex gap-2 flex-wrap max-w-xs">
              {fishInventory.slice(0, 4).map((item) => {
                const species = FISH_SPECIES.find(f => f.id === item.itemId)
                if (!species) return null
                return (
                  <div 
                    key={item.id}
                    className="bg-slate-800 rounded px-2 py-1 text-xs flex items-center gap-1"
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      species.rarity === 'legendary' ? 'bg-yellow-400' :
                      species.rarity === 'rare' ? 'bg-purple-400' :
                      species.rarity === 'uncommon' ? 'bg-blue-400' :
                      'bg-slate-400'
                    }`} />
                    <span className="text-slate-300">{item.quantity}x</span>
                    <span className="text-slate-400">{species.name}</span>
                  </div>
                )
              })}
              {fishInventory.length > 4 && (
                <div className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-400">
                  +{fishInventory.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mini Map / Location - Right */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20 shadow-lg min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">Location</span>
          </div>
          <p className="text-slate-400 text-sm">
            X: {player.position.x.toFixed(0)} Z: {player.position.z.toFixed(0)}
          </p>
          {nearLocation && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <p className="text-cyan-400 text-xs uppercase">{nearLocation.type}</p>
              <p className="text-white text-sm">{nearLocation.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Interaction Prompt */}
      {nearLocation && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-cyan-500/30 shadow-xl animate-pulse">
            <p className="text-white text-center">
              Press <kbd className="bg-slate-700 px-2 py-1 rounded mx-1 font-mono">E</kbd> to enter{' '}
              <span className="text-cyan-400">{nearLocation.name}</span>
            </p>
          </div>
        </div>
      )}

      {/* Active Jobs Indicator */}
      {player.activeJobs.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
            <p className="text-yellow-400 text-sm font-medium">
              {player.activeJobs.length} Active Job{player.activeJobs.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Token Collection Indicator */}
      {totalTokens > 0 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <p className="text-purple-400 text-sm font-medium">
              {totalTokens} Token{totalTokens > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </div>
  )
}
