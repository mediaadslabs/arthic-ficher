'use client'

import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'
import { getInnJobs } from '@/lib/game/world-data'
import { FISH_SPECIES } from '@/lib/game/types'
import type { Job, Location } from '@/lib/game/types'
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
import { Slider } from '@/components/ui/slider'
import { 
  X, 
  Briefcase, 
  ClipboardList, 
  Coins, 
  Star, 
  CheckCircle,
  XCircle,
  Fish,
  Moon,
  Sun,
  Bed,
} from 'lucide-react'

interface InnMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function InnMenu({ location, open, onClose }: InnMenuProps) {
  const { player, acceptJob, completeJob, abandonJob, tickGameTime } = useGameStore()
  const [availableJobs, setAvailableJobs] = useState<Job[]>([])
  const [sleepHours, setSleepHours] = useState(1)
  const [isSleeping, setIsSleeping] = useState(false)
  const [sleepDone, setSleepDone] = useState(false)

  // Use player.time.hour as source of truth (falls back to 8 if not yet initialised)
  const gameHour = player?.time?.hour ?? 8

  // Max hours until end of current day (midnight = hour 24)
  const hoursUntilMidnight = 24 - gameHour
  const maxSleep = Math.max(1, hoursUntilMidnight)

  const wakeHour = (gameHour + sleepHours) % 24

  function formatHour(h: number) {
    const period = h < 12 ? 'AM' : 'PM'
    const display = h % 12 === 0 ? 12 : h % 12
    return `${display}:00 ${period}`
  }

  function handleSleep() {
    setIsSleeping(true)
    setSleepDone(false)
    // tickGameTime advances player.time by N real-seconds worth of game-minutes
    // 1 game-minute = 1 real-second, so sleeping 1h = 60 ticks
    setTimeout(() => {
      tickGameTime(sleepHours * 60)
      setIsSleeping(false)
      setSleepDone(true)
    }, 1800)
  }
  
  // Gera jobs apenas uma vez quando o menu abre — não reage a mudanças do player
  // para não estar constantemente a substituir a lista enquanto o utilizador decide
  useEffect(() => {
    if (open && player && availableJobs.length === 0) {
      setAvailableJobs(getInnJobs(location.id, player.level))
    }
    if (!open) {
      setAvailableJobs([]) // limpa ao fechar para a próxima visita ter jobs frescos
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!player) return null

  const handleAcceptJob = (job: Job) => {
    if (player.activeJobs.length >= 3) return
    acceptJob(job)
    // Remove apenas o job aceite da lista — não regenera tudo
    setAvailableJobs(prev => prev.filter(j => j.id !== job.id))
  }

  const handleCompleteJob = (jobId: string) => {
    completeJob(jobId)
  }

  const handleAbandonJob = (jobId: string) => {
    abandonJob(jobId)
  }

  const canCompleteJob = (job: Job): boolean => {
    for (const req of job.requirements) {
      const inventoryItem = player.inventory.find(i => i.itemId === req.fishId)
      if (!inventoryItem || inventoryItem.quantity < req.quantity) {
        return false
      }
    }
    return true
  }

  const getJobProgress = (job: Job): number => {
    let totalRequired = 0
    let totalHave = 0
    
    for (const req of job.requirements) {
      totalRequired += req.quantity
      const inventoryItem = player.inventory.find(i => i.itemId === req.fishId)
      totalHave += Math.min(inventoryItem?.quantity ?? 0, req.quantity)
    }
    
    return totalRequired > 0 ? (totalHave / totalRequired) * 100 : 0
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-amber-500/30 text-white max-w-2xl max-h-[85vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-amber-400 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              {location.name}
            </DialogTitle>
          </div>
          <p className="text-slate-400 text-sm">Find work and complete contracts for rewards</p>
        </DialogHeader>

        <Tabs defaultValue="available" className="mt-4">
          <TabsList className="bg-slate-800 w-full">
            <TabsTrigger value="available" className="flex-1 data-[state=active]:bg-amber-600">
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-amber-600">
              Active ({player.activeJobs.length}/3)
            </TabsTrigger>
            <TabsTrigger value="rest" className="flex-1 data-[state=active]:bg-indigo-700">
              <Bed className="w-4 h-4 mr-1" /> Rest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {availableJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No jobs available right now</p>
                    <p className="text-slate-500 text-sm">Check back later or visit another inn</p>
                  </div>
                ) : (
                  availableJobs.map((job) => (
                    <Card key={job.id} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white">{job.title}</CardTitle>
                            <CardDescription className="text-slate-400 mt-1">
                              {job.description}
                            </CardDescription>
                          </div>
                          <Badge className={DIFFICULTY_COLORS[job.difficulty]}>
                            {job.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Requirements */}
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 uppercase mb-2">Requirements</p>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, i) => {
                              const species = FISH_SPECIES.find(f => f.id === req.fishId)
                              return (
                                <Badge key={i} variant="outline" className="border-slate-600">
                                  <Fish className="w-3 h-3 mr-1" />
                                  {req.quantity}x {species?.name ?? req.fishId}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>

                        {/* Rewards */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Coins className="w-4 h-4" />
                              <span className="font-semibold">{job.reward.gold}</span>
                            </div>
                            <div className="flex items-center gap-1 text-cyan-400">
                              <Star className="w-4 h-4" />
                              <span className="font-semibold">{job.reward.xp} XP</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAcceptJob(job)}
                            disabled={player.activeJobs.length >= 3 || player.activeJobs.some(j => j.id === job.id)}
                            className="bg-amber-600 hover:bg-amber-500 text-white"
                            size="sm"
                          >
                            Accept
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {player.activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No active jobs</p>
                    <p className="text-slate-500 text-sm">Accept a job from the available list</p>
                  </div>
                ) : (
                  player.activeJobs.map((job) => {
                    const progress = getJobProgress(job)
                    const canComplete = canCompleteJob(job)
                    
                    return (
                      <Card key={job.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-white">{job.title}</CardTitle>
                              <CardDescription className="text-slate-400 mt-1">
                                {job.description}
                              </CardDescription>
                            </div>
                            <Badge className={DIFFICULTY_COLORS[job.difficulty]}>
                              {job.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Progress */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-slate-400">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {/* Requirements with current amounts */}
                          <div className="mb-3 space-y-1">
                            {job.requirements.map((req, i) => {
                              const species = FISH_SPECIES.find(f => f.id === req.fishId)
                              const have = player.inventory.find(item => item.itemId === req.fishId)?.quantity ?? 0
                              const complete = have >= req.quantity
                              
                              return (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-300 flex items-center gap-1">
                                    {complete ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <Fish className="w-4 h-4 text-slate-500" />
                                    )}
                                    {species?.name ?? req.fishId}
                                  </span>
                                  <span className={complete ? 'text-green-400' : 'text-slate-400'}>
                                    {Math.min(have, req.quantity)} / {req.quantity}
                                  </span>
                                </div>
                              )
                            })}
                          </div>

                          {/* Rewards */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-yellow-400">
                                <Coins className="w-4 h-4" />
                                <span className="font-semibold">{job.reward.gold}</span>
                              </div>
                              <div className="flex items-center gap-1 text-cyan-400">
                                <Star className="w-4 h-4" />
                                <span className="font-semibold">{job.reward.xp} XP</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAbandonJob(job.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleCompleteJob(job.id)}
                                disabled={!canComplete}
                                className="bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Complete
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
          </TabsContent>
          {/* ── REST TAB ─────────────────────────────────────────────────── */}
          <TabsContent value="rest" className="mt-4">
            <div className="space-y-6 px-1">

              {/* Current time display */}
              <div className="flex items-center justify-center gap-3 py-3">
                {gameHour >= 6 && gameHour < 20
                  ? <Sun className="w-6 h-6 text-yellow-400" />
                  : <Moon className="w-6 h-6 text-indigo-400" />}
                <span className="text-2xl font-bold text-white">{formatHour(gameHour)}</span>
                <span className="text-slate-400 text-sm">current time</span>
              </div>

              {/* Sleeping animation overlay */}
              {isSleeping && (
                <div className="flex flex-col items-center gap-3 py-6 animate-pulse">
                  <Bed className="w-12 h-12 text-indigo-400" />
                  <p className="text-indigo-300 text-lg font-semibold">Sleeping…</p>
                  <div className="flex gap-1">
                    {['z','z','z'].map((z, i) => (
                      <span key={i} className="text-indigo-400 font-bold text-xl"
                        style={{ animationDelay: `${i * 0.3}s` }}>
                        {z}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Wake-up confirmation */}
              {sleepDone && !isSleeping && (
                <div className="text-center py-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
                  <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">You wake up refreshed!</p>
                  <p className="text-slate-400 text-sm mt-1">It is now {formatHour(gameHour)}</p>
                </div>
              )}

              {/* Slider — only when not sleeping */}
              {!isSleeping && (
                <>
                  <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Hours to sleep</span>
                      <span className="text-indigo-300 font-semibold">{sleepHours}h</span>
                    </div>
                    <Slider
                      min={1}
                      max={maxSleep}
                      step={1}
                      value={[sleepHours]}
                      onValueChange={([v]) => { setSleepHours(v); setSleepDone(false) }}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>1h</span>
                      <span>{maxSleep}h (midnight)</span>
                    </div>
                  </div>

                  {/* Wake time preview */}
                  <div className="flex items-center justify-between bg-slate-800/60 rounded-lg px-4 py-3 border border-slate-700">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm">Sleep until</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {wakeHour >= 6 && wakeHour < 20
                        ? <Sun className="w-4 h-4 text-yellow-400" />
                        : <Moon className="w-4 h-4 text-indigo-400" />}
                      <span className="font-bold text-white">{formatHour(wakeHour)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSleep}
                    className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-5 text-base"
                  >
                    <Bed className="w-5 h-5 mr-2" />
                    Sleep {sleepHours} hour{sleepHours > 1 ? 's' : ''}
                  </Button>
                </>
              )}

              {/* Cost reminder */}
              <p className="text-center text-slate-500 text-xs">
                Resting at the inn is free. Time will pass while you sleep.
              </p>
            </div>
          </TabsContent>

        </Tabs>

        {/* Stats footer */}
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm">
          <span className="text-slate-400">
            Jobs Completed: <span className="text-cyan-400">{player.stats.totalJobsCompleted}</span>
          </span>
          <span className="text-slate-400">
            Total Earned: <span className="text-yellow-400">{player.stats.totalGoldEarned.toLocaleString()} Gold</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
