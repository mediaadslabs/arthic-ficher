'use client'

import { useGameStore } from '@/lib/game/store'
import { FISH_SPECIES, TOKEN_TYPES, COSMETICS, TREASURE_MAPS } from '@/lib/game/types'
import type { Location } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Fish, Coins, Sparkles, Scroll, Package,
  Ship, Anchor, Gem, Map,
} from 'lucide-react'

interface InventoryMenuProps {
  location?: Location | null
  open: boolean
  onClose: () => void
}

export function InventoryMenu({ location, open, onClose }: InventoryMenuProps) {
  const { player, getCurrentBoat, sellFish } = useGameStore()

  if (!player) return null

  const currentBoat = getCurrentBoat()
  const maxStorage = currentBoat?.storage ?? 10
  const totalItems = player.inventory.reduce((sum, item) => sum + item.quantity, 0)
  const storagePercent = (totalItems / maxStorage) * 100

  const fishItems = player.inventory.filter(i => i.type === 'fish')
  const tokenItems = player.inventory.filter(i => i.type === 'token')
  const cosmeticItems = player.inventory.filter(i => i.type === 'cosmetic')
  const mapItems = player.inventory.filter(i => i.type === 'treasure_map')

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythical': return 'text-red-400 border-red-500/30 bg-red-500/10'
      case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
      case 'uncommon': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10'
    }
  }

  const getRarityDot = (rarity: string) => {
    switch (rarity) {
      case 'mythical': return 'bg-red-400'
      case 'legendary': return 'bg-yellow-400'
      case 'rare': return 'bg-purple-400'
      case 'uncommon': return 'bg-blue-400'
      default: return 'bg-slate-400'
    }
  }

  const ownedCosmeticsIds = player.ownedCosmetics || []
  const ownedCosmetics = COSMETICS.filter(c => ownedCosmeticsIds.includes(c.id))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-4xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-purple-400 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Inventory
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">{totalItems}/{maxStorage}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {storagePercent > 90 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-2">
            <p className="text-red-400 text-sm font-medium">Storage nearly full! Sell some items or upgrade your boat.</p>
          </div>
        )}

        <Tabs defaultValue="fish" className="mt-4">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="fish" className="flex-1 data-[state=active]:bg-purple-600">
              <Fish className="w-4 h-4 mr-1" />
              Fish ({fishItems.length})
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex-1 data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-1" />
              Tokens ({tokenItems.length})
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex-1 data-[state=active]:bg-purple-600">
              <Gem className="w-4 h-4 mr-1" />
              Cosmetics ({ownedCosmetics.length})
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex-1 data-[state=active]:bg-purple-600">
              <Map className="w-4 h-4 mr-1" />
              Maps ({mapItems.length + (player.discoveredMaps?.length || 0)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fish" className="mt-4">
            <ScrollArea className="h-72">
              <div className="space-y-2 pr-4">
                {fishItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Fish className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No fish in inventory</p>
                    <p className="text-slate-500 text-sm">Go fishing to fill your hold!</p>
                  </div>
                ) : (
                  fishItems.map((item) => {
                    const species = FISH_SPECIES.find(f => f.id === item.itemId)
                    if (!species) return null
                    return (
                      <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getRarityDot(species.rarity)}`} />
                              <div>
                                <p className="text-white font-medium">{species.name}</p>
                                <p className="text-slate-400 text-sm">Qty: {item.quantity} | Value: {species.baseValue} gold each</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-slate-700 text-slate-300 capitalize">{species.rarity}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tokens" className="mt-4">
            <ScrollArea className="h-72">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {tokenItems.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No tokens collected</p>
                    <p className="text-slate-500 text-sm">Catch rare fish and discover treasure to find tokens!</p>
                  </div>
                ) : (
                  tokenItems.map((item) => {
                    const tokenInfo = TOKEN_TYPES[item.itemId as keyof typeof TOKEN_TYPES]
                    if (!tokenInfo) return null
                    return (
                      <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`rounded-lg p-2 border ${getRarityColor(tokenInfo.rarity)}`}>
                              <span className="text-2xl">{tokenInfo.icon}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{tokenInfo.name}</p>
                              <p className="text-slate-400 text-xs">{tokenInfo.description}</p>
                            </div>
                            <Badge className={getRarityColor(tokenInfo.rarity)}>
                              x{item.quantity}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cosmetics" className="mt-4">
            <ScrollArea className="h-72">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {ownedCosmetics.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Gem className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No cosmetics owned</p>
                    <p className="text-slate-500 text-sm">Visit the marketplace cosmetics shop!</p>
                  </div>
                ) : (
                  ownedCosmetics.map((cosmetic) => (
                    <Card key={cosmetic.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`rounded-lg p-2 border ${getRarityColor(cosmetic.rarity)}`}>
                            <span className="text-2xl">{cosmetic.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{cosmetic.name}</p>
                            <p className="text-slate-400 text-xs capitalize">{cosmetic.slot.replace('_', ' ')}</p>
                            <p className="text-slate-500 text-xs mt-1">{cosmetic.description}</p>
                          </div>
                          <Badge className={getRarityColor(cosmetic.rarity)}>
                            {cosmetic.rarity}
                          </Badge>
                        </div>
                        {cosmetic.effects && Object.keys(cosmetic.effects).length > 0 && (
                          <div className="bg-slate-700/30 rounded p-2 mt-2">
                            <p className="text-cyan-400 text-xs font-medium">Effects:</p>
                            {Object.entries(cosmetic.effects).map(([key, val]) => (
                              <p key={key} className="text-green-400 text-xs">
                                +{typeof val === 'number' ? (val * 100).toFixed(0) : val}% {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="maps" className="mt-4">
            <ScrollArea className="h-72">
              <div className="space-y-2 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm font-medium">Discovered Treasure Maps</p>
                  <p className="text-slate-400 text-xs">Use maps at treasure locations to find riches!</p>
                </div>
                {(player.discoveredMaps?.length || 0) === 0 ? (
                  <div className="text-center py-12">
                    <Map className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No treasure maps</p>
                    <p className="text-slate-500 text-sm">Craft maps at the garage using tokens!</p>
                  </div>
                ) : (
                  (player.discoveredMaps || []).map((mapId) => {
                    const mapData = TREASURE_MAPS.find(m => m.id === mapId)
                    if (!mapData) return null
                    return (
                      <Card key={mapId} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-3 border ${getRarityColor(mapData.rarity)}`}>
                              <Map className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{mapData.name}</p>
                              <p className="text-slate-400 text-sm">{mapData.description}</p>
                              <p className="text-yellow-400 text-xs mt-1">
                                Rewards: {mapData.rewards.goldMin}-{mapData.rewards.goldMax} gold, {mapData.rewards.xpReward} XP
                              </p>
                            </div>
                            <Badge className={getRarityColor(mapData.rarity)}>
                              {mapData.rarity}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
