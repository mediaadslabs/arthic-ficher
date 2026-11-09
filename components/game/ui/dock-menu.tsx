'use client'

import { useState, useMemo } from 'react'
import { useGameStore } from '@/lib/game/store'
import { FISH_SPECIES } from '@/lib/game/types'
import type { Location } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import {
  Anchor,
  TrendingUp,
  Skull,
  ShoppingCart,
  Fish,
  Coins,
  AlertTriangle,
  Package,
} from 'lucide-react'

interface DockMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

type Market = 'current' | 'trade' | 'black'

const MARKET_CONFIG: Record<Market, {
  label: string
  description: string
  multiplier: number
  icon: React.ReactNode
  color: string
  badgeClass: string
  warning?: string
}> = {
  current: {
    label: 'Current Market',
    description: 'Fair local prices. Sell at the standard rate with no risk.',
    multiplier: 1.0,
    icon: <ShoppingCart className="w-5 h-5" />,
    color: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  trade: {
    label: 'Trade Market',
    description: 'Bulk buyers pay slightly less but take everything immediately.',
    multiplier: 0.75,
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    warning: '25% lower prices — quick & easy',
  },
  black: {
    label: 'Black Market',
    description: 'Shady buyers pay top gold. No questions asked — but no receipt either.',
    multiplier: 1.5,
    icon: <Skull className="w-5 h-5" />,
    color: 'text-red-400',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'Illegal — 50% bonus but risky',
  },
}

interface SellState {
  [speciesId: string]: number // quantity to sell
}

export function DockMenu({ location, open, onClose }: DockMenuProps) {
  const { player, sellFishAtMarket } = useGameStore()
  const [activeMarket, setActiveMarket] = useState<Market>('current')
  const [sellQuantities, setSellQuantities] = useState<SellState>({})
  const [lastSale, setLastSale] = useState<{ total: number; market: Market } | null>(null)

  const fishInInventory = useMemo(() => {
    if (!player) return []
    return player.inventory
      .filter(item => item.type === 'fish' && item.quantity > 0)
      .map(item => {
        const species = FISH_SPECIES.find(f => f.id === item.itemId)
        return { item, species }
      })
      .filter(e => e.species != null)
  }, [player])

  const market = MARKET_CONFIG[activeMarket]

  function getQuantity(speciesId: string, max: number) {
    return Math.min(sellQuantities[speciesId] ?? 1, max)
  }

  function setQuantity(speciesId: string, qty: number) {
    setSellQuantities(prev => ({ ...prev, [speciesId]: qty }))
  }

  function previewGold(speciesId: string, quantity: number): number {
    const species = FISH_SPECIES.find(f => f.id === speciesId)
    if (!species) return 0
    return Math.floor(species.baseValue * quantity * market.multiplier)
  }

  function handleSell(speciesId: string) {
    const invItem = player?.inventory.find(i => i.itemId === speciesId)
    if (!invItem) return
    const qty = getQuantity(speciesId, invItem.quantity)
    const earned = sellFishAtMarket(speciesId, qty, activeMarket)
    if (earned > 0) {
      setLastSale({ total: earned, market: activeMarket })
      setSellQuantities(prev => ({ ...prev, [speciesId]: 1 }))
    }
  }

  function handleSellAll() {
    if (!player) return
    let total = 0
    for (const { item, species } of fishInInventory) {
      if (!species) continue
      const qty = getQuantity(species.id, item.quantity)
      total += sellFishAtMarket(species.id, qty, activeMarket)
    }
    if (total > 0) setLastSale({ total, market: activeMarket })
    setSellQuantities({})
  }

  if (!player) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-2xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
            <Anchor className="w-6 h-6" />
            {location.name}
          </DialogTitle>
          <p className="text-slate-400 text-sm">Sell your catch at the best price</p>
        </DialogHeader>

        {/* Gold earned flash */}
        {lastSale && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold
            ${lastSale.market === 'black'
              ? 'bg-red-900/30 border-red-500/40 text-red-300'
              : lastSale.market === 'trade'
              ? 'bg-amber-900/30 border-amber-500/40 text-amber-300'
              : 'bg-cyan-900/30 border-cyan-500/40 text-cyan-300'}`}>
            <Coins className="w-4 h-4" />
            +{lastSale.total.toLocaleString()} Gold sold via {MARKET_CONFIG[lastSale.market].label}!
          </div>
        )}

        {/* Market selector tabs */}
        <Tabs value={activeMarket} onValueChange={v => { setActiveMarket(v as Market); setLastSale(null) }}>
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="current" className="flex-1 gap-1 data-[state=active]:bg-cyan-700">
              <ShoppingCart className="w-4 h-4" /> Market
            </TabsTrigger>
            <TabsTrigger value="trade" className="flex-1 gap-1 data-[state=active]:bg-amber-700">
              <TrendingUp className="w-4 h-4" /> Trade
            </TabsTrigger>
            <TabsTrigger value="black" className="flex-1 gap-1 data-[state=active]:bg-red-800">
              <Skull className="w-4 h-4" /> Black Market
            </TabsTrigger>
          </TabsList>

          {(['current', 'trade', 'black'] as Market[]).map(mkt => (
            <TabsContent key={mkt} value={mkt} className="mt-3">
              {/* Market description */}
              <div className={`flex items-start gap-2 p-3 rounded-lg border mb-3
                ${mkt === 'black'
                  ? 'bg-red-950/30 border-red-800/40'
                  : mkt === 'trade'
                  ? 'bg-amber-950/30 border-amber-800/40'
                  : 'bg-cyan-950/30 border-cyan-800/40'}`}>
                <span className={MARKET_CONFIG[mkt].color}>{MARKET_CONFIG[mkt].icon}</span>
                <div>
                  <p className="text-slate-300 text-sm">{MARKET_CONFIG[mkt].description}</p>
                  {MARKET_CONFIG[mkt].warning && (
                    <p className="text-xs mt-1 flex items-center gap-1 text-slate-400">
                      <AlertTriangle className="w-3 h-3" />
                      {MARKET_CONFIG[mkt].warning}
                    </p>
                  )}
                </div>
                <Badge className={`ml-auto shrink-0 ${MARKET_CONFIG[mkt].badgeClass}`}>
                  ×{MARKET_CONFIG[mkt].multiplier.toFixed(2)}
                </Badge>
              </div>

              {/* Fish list */}
              {fishInInventory.length === 0 ? (
                <div className="text-center py-10">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Your hold is empty</p>
                  <p className="text-slate-500 text-sm">Go fishing first!</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-60">
                    <div className="space-y-2 pr-2">
                      {fishInInventory.map(({ item, species }) => {
                        if (!species) return null
                        const qty = getQuantity(species.id, item.quantity)
                        const gold = previewGold(species.id, qty)

                        return (
                          <Card key={species.id} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Fish className="w-4 h-4 text-cyan-400" />
                                  <span className="font-semibold text-white">{species.name}</span>
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                    {item.quantity} in hold
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                  <Coins className="w-3 h-3" />
                                  {gold.toLocaleString()}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Slider
                                    min={1}
                                    max={item.quantity}
                                    step={1}
                                    value={[qty]}
                                    onValueChange={([v]) => setQuantity(species.id, v)}
                                  />
                                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>1</span>
                                    <span className="text-slate-300">{qty}x @ {Math.floor(species.baseValue * market.multiplier)}g each</span>
                                    <span>{item.quantity}</span>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleSell(species.id)}
                                  size="sm"
                                  className={
                                    mkt === 'black'
                                      ? 'bg-red-800 hover:bg-red-700'
                                      : mkt === 'trade'
                                      ? 'bg-amber-700 hover:bg-amber-600'
                                      : 'bg-cyan-700 hover:bg-cyan-600'
                                  }
                                >
                                  Sell
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>

                  {/* Sell all */}
                  <Button
                    onClick={handleSellAll}
                    className={`w-full mt-3 py-5 text-base
                      ${mkt === 'black'
                        ? 'bg-red-800 hover:bg-red-700'
                        : mkt === 'trade'
                        ? 'bg-amber-700 hover:bg-amber-600'
                        : 'bg-cyan-700 hover:bg-cyan-600'}`}
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Sell All Selected via {MARKET_CONFIG[mkt].label}
                  </Button>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-700 flex justify-between text-sm">
          <span className="text-slate-400">
            Hold: <span className="text-cyan-400">{fishInInventory.reduce((a, e) => a + e.item.quantity, 0)} fish</span>
          </span>
          <span className="text-slate-400">
            Gold: <span className="text-yellow-400">{player.gold.toLocaleString()}</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
