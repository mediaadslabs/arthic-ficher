'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { WEATHER_MODIFIERS } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sword, Shield, Anchor, Wind, Skull,
  Heart, Zap, AlertTriangle,
} from 'lucide-react'

export function CombatUI() {
  const { combat, doCombatAction, endCombat, player } = useGameStore()
  const [isActing, setIsActing] = useState(false)

  if (!combat) return null

  const weatherType = player?.weather?.current?.type ?? 'clear'
  const mods = WEATHER_MODIFIERS[weatherType]
  const boat = player?.ownedBoats.find(b => b.id === player.currentBoatId)
  const maxHull = boat?.maxDurability ?? 100

  function act(action: 'attack' | 'defend' | 'flee' | 'special') {
    if (isActing) return
    setIsActing(true)
    doCombatAction(action)
    setTimeout(() => setIsActing(false), 600)
  }

  const isOver = combat.result !== 'ongoing'
  const enemy = combat.enemy

  const enemyHpPct = enemy ? (enemy.health / enemy.maxHealth) * 100 : 0
  const playerHpPct = (combat.playerHealth / maxHull) * 100

  const ENEMY_ICONS: Record<string, string> = {
    pirate_skiff: '🏴‍☠️',
    pirate_trawler: '⚓',
    sea_monster: '🦑',
    rival_fisher: '🎣',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 to-slate-900 px-6 py-4 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-bold text-lg">Naval Combat</span>
              <Badge className="bg-slate-700 text-slate-300 text-xs">Round {combat.round}</Badge>
            </div>
            {/* Weather penalty warning */}
            {mods.combatDifficultyBonus > 0 && (
              <div className="flex items-center gap-1 text-yellow-400 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>{weatherType} penalty active</span>
              </div>
            )}
          </div>
        </div>

        {/* Combatants */}
        <div className="px-6 pt-4 space-y-3">
          {/* Enemy */}
          {enemy && (
            <div className="bg-slate-800/60 rounded-xl p-3 border border-red-800/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ENEMY_ICONS[enemy.type] ?? '⚓'}</span>
                  <div>
                    <p className="text-white font-semibold">{enemy.name}</p>
                    <p className="text-slate-400 text-xs">Level {enemy.level} enemy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-mono text-sm">{enemy.health}/{enemy.maxHealth}</p>
                  <p className="text-slate-500 text-xs">hull integrity</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-red-500 transition-all duration-500"
                  style={{ width: `${enemyHpPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Player boat */}
          <div className="bg-slate-800/60 rounded-xl p-3 border border-cyan-800/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-semibold">{boat?.name ?? 'Your Boat'}</p>
                  <p className="text-slate-400 text-xs">Your vessel</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-mono text-sm">
                  {Math.floor(combat.playerHealth)}/{maxHull}
                </p>
                <p className="text-slate-500 text-xs">hull integrity</p>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  playerHpPct > 50 ? 'bg-cyan-500' :
                  playerHpPct > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${playerHpPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combat log */}
        <div className="px-6 pt-3">
          <ScrollArea className="h-28 bg-slate-950/60 rounded-lg border border-slate-700 p-3">
            <div className="space-y-1">
              {combat.log.map((line, i) => (
                <p key={i} className={`text-xs ${
                  i === combat.log.length - 1 ? 'text-white' : 'text-slate-400'
                }`}>{line}</p>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Actions or result */}
        <div className="px-6 py-4">
          {isOver ? (
            <div className="space-y-3">
              <div className={`text-center py-3 rounded-xl border ${
                combat.result === 'victory'
                  ? 'bg-green-900/30 border-green-500/40 text-green-400'
                  : combat.result === 'fled'
                  ? 'bg-yellow-900/30 border-yellow-500/40 text-yellow-400'
                  : 'bg-red-900/30 border-red-500/40 text-red-400'
              }`}>
                {combat.result === 'victory' && <p className="text-lg font-bold">⚓ Victory!</p>}
                {combat.result === 'defeat'  && <p className="text-lg font-bold">💀 Defeated!</p>}
                {combat.result === 'fled'    && <p className="text-lg font-bold">🏃 Escaped!</p>}
              </div>
              <Button onClick={endCombat} className="w-full bg-slate-700 hover:bg-slate-600">
                Continue Sailing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => act('attack')}
                disabled={isActing}
                className="bg-red-800 hover:bg-red-700 flex items-center gap-2 py-5"
              >
                <Sword className="w-4 h-4" /> Attack
              </Button>
              <Button
                onClick={() => act('defend')}
                disabled={isActing}
                className="bg-slate-700 hover:bg-slate-600 flex items-center gap-2 py-5"
              >
                <Shield className="w-4 h-4" /> Defend
              </Button>
              <Button
                onClick={() => act('special')}
                disabled={isActing}
                className="bg-amber-800 hover:bg-amber-700 flex items-center gap-2 py-5"
              >
                <Zap className="w-4 h-4" /> Harpoon
              </Button>
              <Button
                onClick={() => act('flee')}
                disabled={isActing}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 flex items-center gap-2 py-5"
              >
                <Wind className="w-4 h-4" /> Flee ({Math.round(combat.fleeChance * 100)}%)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
