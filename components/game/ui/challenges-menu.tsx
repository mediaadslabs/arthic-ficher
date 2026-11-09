'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import type { Location } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Trophy,
  Coins,
  Target,
  Check,
  Lock,
  Clock,
  Calendar,
  Star,
  Fish,
} from 'lucide-react'

interface ChallengesMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function ChallengesMenu({ location, open, onClose }: ChallengesMenuProps) {
  const { player, refreshDailyChallenges, joinCompetition, getActiveCompetition } = useGameStore()

  useEffect(() => {
    if (open && player) {
      const challenges = player.dailyChallenges || []
      if (challenges.length === 0 || challenges.some(c => c.expiresAt < Date.now())) {
        refreshDailyChallenges()
      }
    }
  }, [open])

  if (!player) return null

  const activeCompetition = getActiveCompetition()

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getChallengeIcon = (type: string) => {
    const icons: Record<string, typeof Fish> = {
      catch: Fish,
      sell: Coins,
      hunt: Target,
      travel: Calendar,
      combat: Trophy,
      craft: Star,
    }
    return icons[type] || Target
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-amber-500/30 text-white max-w-3xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-amber-400 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {location.name}
            </DialogTitle>
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="daily" className="mt-4">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="daily" className="flex-1 data-[state=active]:bg-amber-600">
              <Calendar className="w-4 h-4 mr-1" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 data-[state=active]:bg-amber-600">
              <Trophy className="w-4 h-4 mr-1" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex-1 data-[state=active]:bg-amber-600">
              <Target className="w-4 h-4 mr-1" />
              Competitions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {(player.dailyChallenges || []).map((challenge) => {
                  const Icon = getChallengeIcon(challenge.type)
                  const progress = (challenge.current / challenge.target) * 100
                  const isCompleted = challenge.completed
                  const timeLeft = formatTimeLeft(challenge.expiresAt)

                  return (
                    <Card key={challenge.id} className={`bg-slate-800/50 border-slate-700 ${isCompleted ? 'border-green-500/30' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 ${isCompleted ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                              <Icon className={`w-5 h-5 ${isCompleted ? 'text-green-400' : 'text-amber-400'}`} />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{challenge.title}</p>
                              <p className="text-slate-400 text-sm">{challenge.description}</p>
                            </div>
                          </div>
                          {isCompleted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{challenge.current} / {challenge.target}</span>
                            <span>{Math.floor(progress)}%</span>
                          </div>
                          <Progress value={progress} className={`h-2 ${isCompleted ? 'bg-green-900' : 'bg-slate-700'}`} />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{timeLeft}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-yellow-400 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {challenge.reward.gold}
                            </span>
                            <span className="text-cyan-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {challenge.reward.xp} XP
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="achievements" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {(player.achievements || []).map((achievement) => {
                  const progress = Math.min((achievement.current / achievement.target) * 100, 100)
                  const isCompleted = achievement.completed

                  return (
                    <Card key={achievement.id} className={`bg-slate-800/50 border-slate-700 ${isCompleted ? 'border-yellow-500/30' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-2 text-2xl ${isCompleted ? 'bg-yellow-500/20' : 'bg-slate-700'}`}>
                              {achievement.icon}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{achievement.name}</p>
                              <p className="text-slate-400 text-sm">{achievement.description}</p>
                            </div>
                          </div>
                          {isCompleted && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              <Check className="w-3 h-3 mr-1" />
                            </Badge>
                          )}
                        </div>

                        {!isCompleted && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>{achievement.current} / {achievement.target}</span>
                              <span>{Math.floor(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-slate-700" />
                          </div>
                        )}

                        {(achievement.reward.gold || achievement.reward.xp) && (
                          <div className="flex items-center gap-3 mt-3 text-sm">
                            {achievement.reward.gold && (
                              <span className="text-yellow-400 flex items-center gap-1">
                                <Coins className="w-3 h-3" />
                                {achievement.reward.gold}
                              </span>
                            )}
                            {achievement.reward.xp && (
                              <span className="text-cyan-400 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {achievement.reward.xp} XP
                              </span>
                            )}
                            {achievement.reward.artifact && (
                              <span className="text-purple-400 text-xs flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Artifact
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="competitions" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {activeCompetition && (
                  <Card className="bg-slate-800/50 border-amber-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg text-amber-400 flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        {activeCompetition.title}
                      </CardTitle>
                      <CardDescription>{activeCompetition.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-700/50 rounded p-3 text-center">
                          <p className="text-slate-400 text-xs">Your Score</p>
                          <p className="text-white font-bold text-lg">{activeCompetition.playerScore}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-3 text-center">
                          <p className="text-slate-400 text-xs">Participants</p>
                          <p className="text-white font-bold text-lg">{activeCompetition.participants}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-3 text-center">
                          <p className="text-slate-400 text-xs">Time Left</p>
                          <p className="text-white font-bold text-lg">{formatTimeLeft(activeCompetition.endTime)}</p>
                        </div>
                      </div>
                      <div className="bg-slate-700/30 rounded p-3">
                        <p className="text-slate-400 text-xs mb-2">Prize Pool</p>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-bold flex items-center gap-1">
                            <Coins className="w-4 h-4" />
                            {activeCompetition.prize.gold}
                          </span>
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {activeCompetition.prize.xp} XP
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-3">
                    Join a fishing competition to earn bonus rewards! Entry fee is 100 gold.
                  </p>
                  <Button
                    onClick={() => joinCompetition('random')}
                    disabled={player.gold < 100 || !!activeCompetition}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                    size="lg"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    {activeCompetition ? 'Competition Active' : 'Join Competition (100g)'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
