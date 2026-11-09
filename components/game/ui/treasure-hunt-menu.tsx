'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { TOKEN_TYPES, TREASURE_MAPS, type TokenType } from '@/lib/game/types'
import type { Location } from '@/lib/game/types'
import { LOCATIONS } from '@/lib/game/world-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Map,
  Coins,
  Compass,
  Star,
  Check,
  AlertTriangle,
  Sparkles,
  MapPin,
  Eye,
  Hammer,
  Lock,
} from 'lucide-react'

interface TreasureHuntMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function TreasureHuntMenu({ location, open, onClose }: TreasureHuntMenuProps) {
  const {
    player, startTreasureHunt, getCurrentBoat, refreshTradeMarket, buyFromMarket, getTokenCount,
    getUndiscoveredSecrets, canDiscoverSecret, discoverSecretLocation,
    canCraftMapFromTokens, craftMapFromTokens, getDiscoveredSecrets,
  } = useGameStore()
  const [lastResult, setLastResult] = useState<Awaited<ReturnType<typeof startTreasureHunt>> | null>(null)
  const [isHunting, setIsHunting] = useState(false)
  const [discoveryMessage, setDiscoveryMessage] = useState<string | null>(null)

  if (!player) return null

  const currentBoat = getCurrentBoat()
  const tradeMarket = player.tradeMarket ?? []
  const undiscoveredSecrets = getUndiscoveredSecrets()
  const discoveredSecrets = getDiscoveredSecrets()
  const totalTokens = player.inventory.filter(i => i.type === 'token').reduce((sum, i) => sum + i.quantity, 0)

  const handleTreasureHunt = () => {
    setIsHunting(true)
    setTimeout(() => {
      const result = startTreasureHunt()
      setLastResult(result)
      setIsHunting(false)
    }, 1500)
  }

  const handleRefreshMarket = () => {
    refreshTradeMarket()
  }

  const handleBuyFromMarket = (itemId: string) => {
    buyFromMarket(itemId)
  }

  const handleDiscoverSecret = (locationId: string) => {
    const success = discoverSecretLocation(locationId)
    if (success) {
      const loc = LOCATIONS.find(l => l.id === locationId)
      setDiscoveryMessage(`✨ Discovered: ${loc?.name || locationId}!`)
      setTimeout(() => setDiscoveryMessage(null), 3000)
    }
  }

  const handleCraftMap = () => {
    const success = craftMapFromTokens()
    if (success) {
      setDiscoveryMessage('🗺️ Crafted a treasure map from 10 tokens!')
      setTimeout(() => setDiscoveryMessage(null), 3000)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
      case 'uncommon': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10'
    }
  }

  const canHunt = currentBoat && currentBoat.durability >= 20 && !isHunting

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-amber-500/30 text-white max-w-4xl max-h-[90vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-amber-400 flex items-center gap-2">
              <Compass className="w-6 h-6" />
              {location.name}
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Notification */}
        {discoveryMessage && (
          <div className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-sm text-center animate-pulse">
            {discoveryMessage}
          </div>
        )}

        <Tabs defaultValue="hunt" className="mt-2">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="hunt" className="flex-1 data-[state=active]:bg-amber-600">
              <Compass className="w-4 h-4 mr-1" />
              Hunt
            </TabsTrigger>
            <TabsTrigger value="secrets" className="flex-1 data-[state=active]:bg-amber-600">
              <Eye className="w-4 h-4 mr-1" />
              Secrets
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex-1 data-[state=active]:bg-amber-600">
              <MapPin className="w-4 h-4 mr-1" />
              Maps
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex-1 data-[state=active]:bg-amber-600">
              <Star className="w-4 h-4 mr-1" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="trade" className="flex-1 data-[state=active]:bg-amber-600">
              <Coins className="w-4 h-4 mr-1" />
              Trade
            </TabsTrigger>
          </TabsList>

          {/* Hunt Tab */}
          <TabsContent value="hunt" className="mt-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Map className="w-6 h-6 text-amber-400" />
                  <div>
                    <p className="text-white font-semibold">Treasure Hunting</p>
                    <p className="text-slate-400 text-sm">Search for hidden treasures and ancient tokens</p>
                  </div>
                </div>
                {currentBoat && (
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Boat Durability</p>
                    <p className={`font-bold ${currentBoat.durability < 30 ? 'text-red-400' : 'text-green-400'}`}>
                      {Math.floor(currentBoat.durability)} / {currentBoat.maxDurability}
                    </p>
                  </div>
                )}
              </div>

              {currentBoat && currentBoat.durability < 20 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">Boat durability too low for treasure hunting! Repair at marketplace.</p>
                </div>
              )}

              <Button
                onClick={handleTreasureHunt}
                disabled={!canHunt}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                size="lg"
              >
                {isHunting ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Searching for treasures...
                  </>
                ) : (
                  <>
                    <Compass className="w-5 h-5 mr-2" />
                    Start Treasure Hunt
                  </>
                )}
              </Button>

              <p className="text-slate-500 text-xs text-center mt-2">
                Costs 15-25 durability • Success affected by weather & radar
              </p>
            </div>

            {lastResult && (
              <Card className={`bg-slate-800/50 border-slate-700 ${lastResult.success ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${lastResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {lastResult.success ? 'Treasure Found!' : 'No Luck This Time'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-3">{lastResult.message}</p>
                  
                  {lastResult.success && lastResult.tokensFound.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-slate-400 text-sm font-semibold">Tokens Found:</p>
                      <div className="flex gap-2 flex-wrap">
                        {lastResult.tokensFound.map((token) => (
                          <Badge key={token.id} className={getRarityColor(token.rarity)}>
                            {token.icon} {token.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-700/50 rounded p-2 text-center">
                      <p className="text-slate-400 text-xs">Gold Found</p>
                      <p className="text-yellow-400 font-bold">{lastResult.goldFound}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-2 text-center">
                      <p className="text-slate-400 text-xs">XP Earned</p>
                      <p className="text-cyan-400 font-bold">{lastResult.xpReward}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-2 text-center">
                      <p className="text-slate-400 text-xs">Durability Cost</p>
                      <p className="text-red-400 font-bold">-{lastResult.durabilityCost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Secret Locations Tab */}
          <TabsContent value="secrets" className="mt-4">
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-pink-400" />
                <div>
                  <p className="text-white font-semibold">Secret Locations</p>
                  <p className="text-slate-400 text-sm">Use tokens to discover hidden locations on the map</p>
                </div>
              </div>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-2 pr-2">
                {undiscoveredSecrets.length === 0 && discoveredSecrets.length > 0 && (
                  <div className="text-center py-8">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-400">All secret locations discovered!</p>
                  </div>
                )}
                {undiscoveredSecrets.length === 0 && discoveredSecrets.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No secret locations found yet</p>
                    <p className="text-slate-500 text-sm">Check back later — more secrets await!</p>
                  </div>
                )}

                {/* Undiscovered secrets */}
                {undiscoveredSecrets.map((secret) => {
                  const canDiscover = canDiscoverSecret(secret.id)
                  return (
                    <Card key={secret.id} className="bg-slate-800/50 border-pink-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-pink-500/10 rounded-lg p-2">
                              <Lock className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">???</p>
                              <p className="text-slate-400 text-xs">Hidden secret location</p>
                              {secret.requiredTokens && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {secret.requiredTokens.map((req) => {
                                    const owned = getTokenCount(req.tokenType)
                                    const tokenInfo = TOKEN_TYPES[req.tokenType]
                                    return (
                                      <span key={req.tokenType} className={`text-xs px-1.5 py-0.5 rounded ${owned >= req.quantity ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {tokenInfo?.icon} {owned}/{req.quantity}
                                      </span>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDiscoverSecret(secret.id)}
                            disabled={!canDiscover}
                            className="bg-pink-600 hover:bg-pink-500 text-white disabled:opacity-50"
                            size="sm"
                          >
                            {canDiscover ? 'Discover' : 'Need Tokens'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {/* Already discovered secrets */}
                {discoveredSecrets.length > 0 && (
                  <>
                    <p className="text-green-400 text-sm font-semibold mt-4 mb-2">Discovered:</p>
                    {discoveredSecrets.map((id) => {
                      const loc = LOCATIONS.find(l => l.id === id)
                      if (!loc) return null
                      return (
                        <Card key={id} className="bg-slate-800/50 border-green-500/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-500/10 rounded-lg p-2">
                                <MapPin className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{loc.name}</p>
                                <p className="text-green-400 text-xs">✓ Discovered</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Map Crafting Tab */}
          <TabsContent value="maps" className="mt-4">
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Hammer className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">Map Crafting</p>
                  <p className="text-slate-400 text-sm">Trade 10 tokens of any type to craft a treasure map</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <p className="text-white font-semibold mb-2">Craft Treasure Map</p>
              <p className="text-slate-400 text-sm mb-4">
                Collect 10 tokens and combine them into a treasure map worth gold, XP, and rare items!
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-bold">{totalTokens}</span>
                <span className="text-slate-400">/ 10 tokens</span>
              </div>
              <Button
                onClick={handleCraftMap}
                disabled={!canCraftMapFromTokens()}
                className="bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                size="lg"
              >
                <Hammer className="w-5 h-5 mr-2" />
                {canCraftMapFromTokens() ? 'Craft Map (10 tokens)' : 'Need 10 tokens'}
              </Button>
            </div>

            {player.discoveredMaps && player.discoveredMaps.length > 0 && (
              <div className="mt-4">
                <p className="text-slate-400 text-sm font-semibold mb-2">Your Treasure Maps:</p>
                <div className="space-y-2">
                  {player.discoveredMaps.map((mapId) => {
                    const map = TREASURE_MAPS.find(m => m.id === mapId)
                    if (!map) return null
                    return (
                      <Card key={mapId} className="bg-slate-800/50 border-amber-500/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span className="text-white text-sm">{map.name}</span>
                            <Badge className={getRarityColor(map.rarity)}>{map.rarity}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Token Collection
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="grid grid-cols-2 gap-2 pr-2">
                    {Object.entries(TOKEN_TYPES).map(([type, token]) => {
                      const owned = getTokenCount(type as TokenType)
                      if (owned === 0) return null

                      return (
                        <div key={type} className="bg-slate-700/50 rounded p-3 flex items-center gap-2">
                          <div className={`rounded p-2 border ${getRarityColor(token.rarity)}`}>
                            <p className="text-xl">{token.icon}</p>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{token.name}</p>
                            <p className="text-slate-400 text-xs">Owned: {owned}</p>
                          </div>
                          {owned >= 5 && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                              <Check className="w-3 h-3 mr-1" />
                              Craft Ready
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {player.inventory.filter(i => i.type === 'token').length === 0 && (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No tokens collected yet</p>
                      <p className="text-slate-500 text-sm">Start treasure hunting to find tokens!</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade Tab */}
          <TabsContent value="trade" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Trade Market
                  </CardTitle>
                  <Button
                    onClick={handleRefreshMarket}
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2 pr-2">
                    {tradeMarket.length === 0 ? (
                      <div className="text-center py-8">
                        <Coins className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">Market is empty</p>
                        <p className="text-slate-500 text-sm">Click "Refresh" to find tokens</p>
                      </div>
                    ) : (
                      tradeMarket.map((item) => {
                        const tokenInfo = TOKEN_TYPES[item.itemId as TokenType]
                        if (!tokenInfo) return null

                        return (
                          <div key={item.id} className="bg-slate-700/50 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`rounded p-2 border ${getRarityColor(tokenInfo.rarity)}`}>
                                <p className="text-xl">{tokenInfo.icon}</p>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{tokenInfo.name}</p>
                                <p className="text-slate-400 text-xs">Available: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-yellow-400 font-bold flex items-center gap-1">
                                <Coins className="w-4 h-4" />
                                {item.price}
                              </p>
                              <Button
                                onClick={() => handleBuyFromMarket(item.id)}
                                disabled={player.gold < item.price}
                                className="bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                                size="sm"
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
