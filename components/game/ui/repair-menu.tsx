'use client'

import { useGameStore } from '@/lib/game/store'
import type { Location } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Wrench,
  Coins,
  Shield,
  Zap,
  Heart,
} from 'lucide-react'

interface RepairMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function RepairMenu({ location, open, onClose }: RepairMenuProps) {
  const { player, repairBoat, getCurrentBoat } = useGameStore()

  if (!player) return null

  const currentBoat = getCurrentBoat()

  const handleRepair = (boatId: string, amount?: number) => {
    repairBoat(boatId, amount)
  }

  const getRepairCost = (boat: any, amount: number) => {
    return Math.floor(amount * 0.5)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-blue-500/30 text-white max-w-3xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-blue-400 flex items-center gap-2">
              <Wrench className="w-6 h-6" />
              {location.name}
            </DialogTitle>
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] mt-4">
          <div className="space-y-4 pr-4">
            {player.ownedBoats.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No boats to repair</p>
                <p className="text-slate-500 text-sm mt-2">Visit the marketplace to purchase a boat</p>
              </div>
            ) : (
              player.ownedBoats.map((boat) => {
                const isCurrent = boat.id === player.currentBoatId
                const healthPercent = (boat.durability / boat.maxDurability) * 100
                const fullRepairAmount = boat.maxDurability - boat.durability
                const fullRepairCost = getRepairCost(boat, fullRepairAmount)
                const partialRepairAmount = Math.floor(boat.maxDurability * 0.3)
                const partialRepairCost = getRepairCost(boat, partialRepairAmount)

                return (
                  <Card key={boat.id} className={`bg-slate-800/50 border-slate-700 ${isCurrent ? 'border-blue-500/50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            {boat.name}
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-sm capitalize">{boat.tier}</CardDescription>
                        </div>
                        {isCurrent && (
                          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                            Active
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Durability</span>
                          <span className={`font-bold ${healthPercent > 50 ? 'text-green-400' : healthPercent > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {Math.floor(boat.durability)} / {boat.maxDurability}
                          </span>
                        </div>
                        <Progress value={healthPercent} className={`h-3 ${healthPercent > 50 ? 'bg-green-900' : healthPercent > 25 ? 'bg-yellow-900' : 'bg-red-900'}`} />
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                          <p className="text-slate-400 text-xs">Speed</p>
                          <p className="text-cyan-400 font-bold">{boat.speed.toFixed(1)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <Heart className="w-4 h-4 text-green-400 mx-auto mb-1" />
                          <p className="text-slate-400 text-xs">Health</p>
                          <p className="text-green-400 font-bold">{Math.floor(healthPercent)}%</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                          <p className="text-slate-400 text-xs">Max HP</p>
                          <p className="text-purple-400 font-bold">{boat.maxDurability}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRepair(boat.id, partialRepairAmount)}
                          disabled={player.gold < partialRepairCost || healthPercent >= 90}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                          size="sm"
                        >
                          Quick Repair ({partialRepairCost}g)
                        </Button>
                        <Button
                          onClick={() => handleRepair(boat.id, fullRepairAmount)}
                          disabled={player.gold < fullRepairCost || healthPercent >= 100}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                          size="sm"
                        >
                          Full Repair ({fullRepairCost}g)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
