'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { BOAT_CONFIGS, FISHING_TOOLS, FISH_SPECIES, TOKEN_TYPES, COSMETICS, type BoatTier, type TokenType, type CosmeticSlot } from '@/lib/game/types'
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
import { 
  ShoppingBag, 
  Ship, 
  Anchor, 
  Coins, 
  Star,
  Lock,
  Check,
  Fish,
  Package,
  TrendingUp,
  Wrench,
  Sparkles,
  Zap,
  Shield,
  Clover,
  Snowflake,
  Eye,
  Navigation,
  ThermometerSnowflake,
} from 'lucide-react'

interface MarketplaceMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function MarketplaceMenu({ location, open, onClose }: MarketplaceMenuProps) {
  const { player, buyBoat, buyTool, sellFish, upgradeBoat, getCurrentBoat, refreshTradeMarket, buyFromMarket, getTokenCount, buyCosmetic, equipCosmetic } = useGameStore()
  const [selectedBoatUpgrade, setSelectedBoatUpgrade] = useState<string | null>(null)

  useEffect(() => {
    if (open && player) {
      const tradeMarket = player.tradeMarket ?? []
      if (tradeMarket.length === 0) {
        refreshTradeMarket()
      }
    }
  }, [open])

  if (!player) return null

  const currentBoat = getCurrentBoat()
  const tradeMarket = player.tradeMarket ?? []

  const handleBuyBoat = (tier: BoatTier) => {
    const success = buyBoat(tier)
    if (success) {
      // Could show a success toast here
    }
  }

  const handleBuyTool = (toolId: string) => {
    buyTool(toolId)
  }

  const handleSellFish = (fishId: string, quantity: number) => {
    sellFish(fishId, quantity)
  }

  const handleUpgradeBoat = (upgradeType: keyof NonNullable<typeof currentBoat>['upgrades']) => {
    if (currentBoat) {
      upgradeBoat(currentBoat.id, upgradeType)
    }
  }

  const getUpgradeCost = (currentLevel: number) => {
    return 100 * (currentLevel + 1) * (currentLevel + 1)
  }

  const UPGRADE_TYPES = [
    { key: 'engine' as const, name: 'Engine', icon: Zap, description: '+10% speed per level' },
    { key: 'hull' as const, name: 'Hull', icon: Shield, description: '+15% durability per level' },
    { key: 'storage' as const, name: 'Storage', icon: Package, description: '+20% capacity per level' },
    { key: 'radar' as const, name: 'Radar', icon: Anchor, description: 'Better fish detection' },
    { key: 'crane' as const, name: 'Crane', icon: Wrench, description: 'Faster trap hauling' },
    { key: 'lucky_charm' as const, name: 'Lucky Charm', icon: Clover, description: '+5% drop luck per level' },
    { key: 'ice_plow' as const, name: 'Ice Plow', icon: Snowflake, description: 'Ice navigation safety' },
    { key: 'night_vision' as const, name: 'Night Vision', icon: Eye, description: 'Night fishing bonus' },
    { key: 'autopilot' as const, name: 'Autopilot', icon: Navigation, description: 'Auto-navigation' },
    { key: 'refrigeration' as const, name: 'Refrigeration', icon: ThermometerSnowflake, description: '+5% fish value per level' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-emerald-500/30 text-white max-w-6xl max-h-[95vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-emerald-400 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              {location.name}
            </DialogTitle>
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="boats" className="mt-4">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="boats" className="flex-1 data-[state=active]:bg-emerald-600">
              <Ship className="w-4 h-4 mr-1" />
              Boats
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex-1 data-[state=active]:bg-emerald-600">
              <Anchor className="w-4 h-4 mr-1" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex-1 data-[state=active]:bg-emerald-600">
              <Fish className="w-4 h-4 mr-1" />
              Sell Catch
            </TabsTrigger>
            {currentBoat && (
              <TabsTrigger value="upgrades" className="flex-1 data-[state=active]:bg-emerald-600">
                <Wrench className="w-4 h-4 mr-1" />
                Upgrades
              </TabsTrigger>
            )}
            <TabsTrigger value="trade" className="flex-1 data-[state=active]:bg-emerald-600">
              <Sparkles className="w-4 h-4 mr-1" />
              Trade Tokens
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex-1 data-[state=active]:bg-emerald-600">
              <Sparkles className="w-4 h-4 mr-1" />
              Cosmetics
            </TabsTrigger>
          </TabsList>

          {/* Boats Tab */}
          <TabsContent value="boats" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {(Object.entries(BOAT_CONFIGS) as [BoatTier, typeof BOAT_CONFIGS.dinghy][]).map(([tier, config]) => {
                  const owned = player.ownedBoats.some(b => b.tier === tier)
                  const canAfford = player.gold >= config.cost
                  const meetsLevel = player.level >= config.requiredLevel

                  return (
                    <Card key={tier} className={`bg-slate-800/50 border-slate-700 ${owned ? 'border-green-500/50' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base text-white flex items-center gap-2">
                              <Ship className="w-4 h-4 text-cyan-400" />
                              {config.name}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-xs mt-1">
                              {config.description}
                            </CardDescription>
                          </div>
                          {owned && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Owned
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="bg-slate-700/50 rounded p-2 text-center">
                            <p className="text-slate-400">Speed</p>
                            <p className="text-cyan-400 font-semibold">{config.speed}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2 text-center">
                            <p className="text-slate-400">Storage</p>
                            <p className="text-cyan-400 font-semibold">{config.storage}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2 text-center">
                            <p className="text-slate-400">HP</p>
                            <p className="text-cyan-400 font-semibold">{config.durability}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Coins className="w-4 h-4" />
                              <span className="font-semibold">{config.cost.toLocaleString()}</span>
                            </div>
                            {!meetsLevel && (
                              <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
                                <Lock className="w-3 h-3" />
                                Level {config.requiredLevel}
                              </div>
                            )}
                          </div>
                          {!owned && (
                            <Button
                              onClick={() => handleBuyBoat(tier)}
                              disabled={!canAfford || !meetsLevel}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                              size="sm"
                            >
                              Buy
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {FISHING_TOOLS.map((tool) => {
                  const owned = player.ownedTools.some(t => t.id === tool.id)
                  const canAfford = player.gold >= tool.cost
                  const meetsLevel = player.level >= tool.requiredLevel

                  return (
                    <Card key={tool.id} className={`bg-slate-800/50 border-slate-700 ${owned ? 'border-green-500/50' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base text-white">{tool.name}</CardTitle>
                            <CardDescription className="text-slate-400 text-xs mt-1">
                              {tool.description}
                            </CardDescription>
                          </div>
                          {owned && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Owned
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="bg-slate-700/50 rounded p-2 text-center">
                            <p className="text-slate-400">Method</p>
                            <p className="text-cyan-400 font-semibold capitalize">{tool.method}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2 text-center">
                            <p className="text-slate-400">Efficiency</p>
                            <p className="text-cyan-400 font-semibold">x{tool.efficiency}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Coins className="w-4 h-4" />
                              <span className="font-semibold">{tool.cost}</span>
                            </div>
                            {!meetsLevel && (
                              <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
                                <Lock className="w-3 h-3" />
                                Level {tool.requiredLevel}
                              </div>
                            )}
                          </div>
                          {!owned && (
                            <Button
                              onClick={() => handleBuyTool(tool.id)}
                              disabled={!canAfford || !meetsLevel}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                              size="sm"
                            >
                              Buy
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Sell Fish Tab */}
          <TabsContent value="sell" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2 pr-4">
                {player.inventory.filter(i => i.type === 'fish').length === 0 ? (
                  <div className="text-center py-8">
                    <Fish className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No fish to sell</p>
                    <p className="text-slate-500 text-sm">Go fishing and come back with your catch</p>
                  </div>
                ) : (
                  player.inventory.filter(i => i.type === 'fish').map((item) => {
                    const species = FISH_SPECIES.find(f => f.id === item.itemId)
                    if (!species) return null
                    
                    const totalValue = species.baseValue * item.quantity

                    return (
                      <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                species.rarity === 'legendary' ? 'bg-yellow-400' :
                                species.rarity === 'rare' ? 'bg-purple-400' :
                                species.rarity === 'uncommon' ? 'bg-blue-400' :
                                'bg-slate-400'
                              }`} />
                              <div>
                                <p className="text-white font-medium">{species.name}</p>
                                <p className="text-slate-400 text-sm">
                                  {item.quantity}x @ {species.baseValue} gold each
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-yellow-400 font-bold flex items-center gap-1">
                                  <Coins className="w-4 h-4" />
                                  {totalValue}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => handleSellFish(item.itemId, 1)}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                  size="sm"
                                >
                                  Sell 1
                                </Button>
                                <Button
                                  onClick={() => handleSellFish(item.itemId, item.quantity)}
                                  variant="outline"
                                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                  size="sm"
                                >
                                  Sell All
                                </Button>
                              </div>
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

          {/* Upgrades Tab */}
          {currentBoat && (
            <TabsContent value="upgrades" className="mt-4">
              <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Ship className="w-6 h-6 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">{currentBoat.name}</p>
                    <p className="text-slate-400 text-sm">Current boat selected for upgrades</p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2 pr-4">
                  {UPGRADE_TYPES.map(({ key, name, icon: Icon, description }) => {
                    const currentLevel = currentBoat.upgrades[key]
                    const maxLevel = 5
                    const cost = getUpgradeCost(currentLevel)
                    const canUpgrade = currentLevel < maxLevel && player.gold >= cost

                    return (
                      <Card key={key} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-slate-700 p-2 rounded-lg">
                                <Icon className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{name}</p>
                                <p className="text-slate-400 text-xs">{description}</p>
                                <div className="flex gap-1 mt-1">
                                  {Array.from({ length: maxLevel }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-3 h-3 rounded-full ${
                                        i < currentLevel ? 'bg-cyan-400' : 'bg-slate-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {currentLevel < maxLevel ? (
                                <>
                                  <div className="text-right">
                                    <p className="text-yellow-400 font-bold flex items-center gap-1">
                                      <Coins className="w-4 h-4" />
                                      {cost}
                                    </p>
                                    <p className="text-slate-500 text-xs">Level {currentLevel + 1}</p>
                                  </div>
                                  <Button
                                    onClick={() => handleUpgradeBoat(key)}
                                    disabled={!canUpgrade}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                                    size="sm"
                                  >
                                    Upgrade
                                  </Button>
                                </>
                              ) : (
                                <Badge className="bg-cyan-500/20 text-cyan-400">MAX</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {/* Trade Tokens Tab */}
          <TabsContent value="trade" className="mt-4">
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Token Trade Market</p>
                  <p className="text-slate-400 text-sm">Buy and sell treasure tokens</p>
                </div>
                <Button
                  onClick={refreshTradeMarket}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  size="sm"
                >
                  Refresh Market
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2 pr-4">
                {tradeMarket.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No tokens available</p>
                    <p className="text-slate-500 text-sm">Click "Refresh Market" to find tokens</p>
                  </div>
                ) : (
                  tradeMarket.map((item) => {
                    const tokenInfo = TOKEN_TYPES[item.itemId as TokenType]
                    if (!tokenInfo) return null

                    const getRarityColor = (rarity: string) => {
                      switch (rarity) {
                        case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                        case 'rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
                        case 'uncommon': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                        default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10'
                      }
                    }

                    return (
                      <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-3 border ${getRarityColor(tokenInfo.rarity)}`}>
                                <p className="text-2xl">{tokenInfo.icon}</p>
                              </div>
                              <div>
                                <p className="text-white font-medium">{tokenInfo.name}</p>
                                <p className="text-slate-400 text-sm">{tokenInfo.description}</p>
                                <p className="text-slate-500 text-xs">Available: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-yellow-400 font-bold flex items-center gap-1">
                                  <Coins className="w-4 h-4" />
                                  {item.price}
                                </p>
                              </div>
                              <Button
                                onClick={() => buyFromMarket(item.id)}
                                disabled={player.gold < item.price || item.quantity <= 0}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                                size="sm"
                              >
                                Buy
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </ScrollArea>

            <div className="mt-4">
              <p className="text-slate-400 text-sm font-semibold mb-2">Your Token Collection</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(TOKEN_TYPES).map(([type, token]) => {
                  const owned = getTokenCount(type as TokenType)
                  if (owned === 0) return null

                  const getRarityColor = (rarity: string) => {
                    switch (rarity) {
                      case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                      case 'rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
                      case 'uncommon': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10'
                    }
                  }

                  return (
                    <div key={type} className={`rounded-lg p-3 border ${getRarityColor(token.rarity)}`}>
                      <p className="text-xl">{token.icon}</p>
                      <p className="text-white text-sm font-medium">{token.name}</p>
                      <p className="text-slate-400 text-xs">Owned: {owned}</p>
                    </div>
                  )
                })}
              </div>
              {player.inventory.filter(i => i.type === 'token').length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No tokens collected yet. Try treasure hunting!</p>
              )}
            </div>
          </TabsContent>

          {/* Cosmetics Tab */}
          <TabsContent value="cosmetics" className="mt-4">
            <ScrollArea className="h-[65vh]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {COSMETICS.filter(c => c.availableInShop).map((cosmetic) => {
                  const owned = player.ownedCosmetics?.includes(cosmetic.id)
                  const canAfford = player.gold >= cosmetic.price
                  const meetsLevel = player.level >= cosmetic.requiredLevel
                  const equipped = player.equippedCosmetics?.[cosmetic.slot] === cosmetic.id

                  return (
                    <Card key={cosmetic.id} className={`bg-slate-800/50 border-slate-700 ${owned ? 'border-green-500/50' : ''} ${equipped ? 'border-cyan-500/50' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{cosmetic.icon}</div>
                            <div>
                              <CardTitle className="text-sm text-white">{cosmetic.name}</CardTitle>
                              <CardDescription className="text-slate-400 text-xs">
                                {cosmetic.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={
                            cosmetic.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            cosmetic.rarity === 'rare' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            cosmetic.rarity === 'uncommon' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }>
                            {cosmetic.rarity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-slate-500 mb-2 capitalize">
                          Slot: {cosmetic.slot.replace('_', ' ')}
                        </p>
                        {cosmetic.effects && Object.keys(cosmetic.effects).length > 0 && (
                          <div className="bg-slate-700/30 rounded p-2 mb-2">
                            <p className="text-cyan-400 text-xs font-medium mb-1">Effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(cosmetic.effects).map(([key, val]) => (
                                <span key={key} className="text-green-400 text-xs bg-green-500/10 px-1.5 py-0.5 rounded">
                                  +{typeof val === 'number' ? (val * 100).toFixed(0) : val}% {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Coins className="w-4 h-4" />
                            <span className="font-semibold text-sm">{cosmetic.price.toLocaleString()}</span>
                          </div>
                          <div className="flex gap-1">
                            {!owned && (
                              <Button
                                onClick={() => buyCosmetic(cosmetic.id)}
                                disabled={!canAfford || !meetsLevel}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                                size="sm"
                              >
                                {meetsLevel ? 'Buy' : `Lv.${cosmetic.requiredLevel}`}
                              </Button>
                            )}
                            {owned && !equipped && (
                              <Button
                                onClick={() => equipCosmetic(cosmetic.id, cosmetic.slot)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                size="sm"
                              >
                                Equip
                              </Button>
                            )}
                            {equipped && (
                              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                Equipped
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
