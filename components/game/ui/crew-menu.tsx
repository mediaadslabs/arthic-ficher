'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { CREW_TEMPLATES } from '@/lib/game/types'
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
  Users,
  Coins,
  TrendingUp,
  UserMinus,
  DollarSign,
  Anchor,
  Star,
} from 'lucide-react'

interface CrewMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function CrewMenu({ location, open, onClose }: CrewMenuProps) {
  const { player, hireCrew, fireCrew, payCrew, getCrewEfficiency } = useGameStore()

  if (!player) return null

  const crewEfficiency = getCrewEfficiency()
  const totalSalary = player.crew.reduce((sum, c) => sum + c.salary, 0)

  const handleHire = (index: number) => {
    hireCrew(index)
  }

  const handleFire = (crewId: string) => {
    fireCrew(crewId)
  }

  const handlePay = () => {
    payCrew()
  }

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      deckhand: '⚓',
      navigator: '🧭',
      engineer: '🔧',
      cook: '🍳',
      harpooner: '🏹',
    }
    return icons[role] || '👤'
  }

  const getRoleDescription = (role: string) => {
    const descs: Record<string, string> = {
      deckhand: '+5% fishing speed',
      navigator: '+10% treasure success',
      engineer: '-10% durability drain',
      cook: '+5% crew morale',
      harpooner: '+15% combat damage',
    }
    return descs[role] || ''
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-emerald-500/30 text-white max-w-3xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-emerald-400 flex items-center gap-2">
              <Users className="w-6 h-6" />
              {location.name}
            </DialogTitle>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 rounded-lg px-3 py-2">
                <p className="text-slate-400 text-xs">Crew Efficiency</p>
                <p className="text-cyan-400 font-bold">x{crewEfficiency.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="current" className="mt-4">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="current" className="flex-1 data-[state=active]:bg-emerald-600">
              Current Crew ({player.crew.length}/5)
            </TabsTrigger>
            <TabsTrigger value="hire" className="flex-1 data-[state=active]:bg-emerald-600">
              Hire Crew
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <ScrollArea className="h-[400px]">
              {player.crew.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No crew members</p>
                  <p className="text-slate-500 text-sm mt-2">Hire crew to boost your efficiency</p>
                </div>
              ) : (
                <div className="space-y-3 pr-4">
                  {player.crew.map((crew) => (
                    <Card key={crew.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-700 rounded-full p-3 text-2xl">
                              {crew.icon}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{crew.name}</p>
                              <p className="text-slate-400 text-sm capitalize">{crew.role}</p>
                              <p className="text-cyan-400 text-xs">{getRoleDescription(crew.role)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-white text-sm">Level {crew.level}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-sm">x{crew.efficiency}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-yellow-400 text-xs">
                                <DollarSign className="w-3 h-3" />
                                <span>{crew.salary}/day</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleFire(crew.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="bg-slate-800/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Daily Salary</p>
                      <p className="text-slate-400 text-sm">{player.crew.length} crew members</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-yellow-400 font-bold flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {totalSalary}/day
                      </p>
                      <Button
                        onClick={handlePay}
                        disabled={player.gold < totalSalary}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                        size="sm"
                      >
                        Pay Crew
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="hire" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm">
                    Hire crew members to boost your fishing, navigation, and combat efficiency. Each crew member costs 5x their daily salary to hire.
                  </p>
                </div>

                {CREW_TEMPLATES.map((template, index) => {
                  const hireCost = template.salary * 5
                  const canAfford = player.gold >= hireCost
                  const hasSpace = player.crew.length < 5

                  return (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-700 rounded-full p-3 text-2xl">
                              {template.icon}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{template.name}</p>
                              <p className="text-slate-400 text-sm capitalize">{template.role}</p>
                              <p className="text-cyan-400 text-xs">{getRoleDescription(template.role)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-white text-sm">Level {template.level}</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                                <DollarSign className="w-3 h-3" />
                                <span>{template.salary}/day</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                                <Coins className="w-3 h-3" />
                                <span>Hire: {hireCost}</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleHire(index)}
                              disabled={!canAfford || !hasSpace}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                              size="sm"
                            >
                              <Anchor className="w-4 h-4 mr-1" />
                              Hire
                            </Button>
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
