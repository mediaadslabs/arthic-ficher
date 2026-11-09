'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { BOAT_CONFIGS, CRAFTABLE_RECIPES, TOKEN_TYPES, PLAYER_SKILLS, ARTIFACT_TEMPLATES, COSMETICS, TREASURE_MAPS, type TokenType } from '@/lib/game/types'
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
  Ship, 
  Coins, 
  Wrench,
  Check,
  Lock,
  Hammer,
  Zap,
  Shield,
  Package,
  Anchor,
  Star,
  Trophy,
  Sparkles,
  Scroll,
  Gem,
  Wrench as ToolWrench,
  ArrowUp,
  ArrowDown,
  Eye,
  Snowflake,
  Navigation,
  ThermometerSnowflake,
  Clover,
} from 'lucide-react'

interface GarageMenuProps {
  location: Location
  open: boolean
  onClose: () => void
}

export function GarageMenu({ location, open, onClose }: GarageMenuProps) {
  const { player, switchBoat, getCurrentBoat, canCraft, craftItem, getTokenCount, getSkills, getSkillLevel, getSkillBonus, equipArtifact, unequipArtifact, getEquippedArtifacts, repairTool, levelUpCrew, canCraftTreasureMap, craftTreasureMap } = useGameStore()
  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null)

  if (!player) return null

  const currentBoat = getCurrentBoat()
  const selectedBoat = player.ownedBoats.find(b => b.id === (selectedBoatId || player.currentBoatId))
  const ownedUpgrades = player.ownedUpgrades ?? []
  const skills = getSkills()
  const equippedArtifacts = getEquippedArtifacts()

  const handleSwitchBoat = (boatId: string) => {
    switchBoat(boatId)
    setSelectedBoatId(boatId)
  }

  const handleCraft = (recipeId: string) => {
    craftItem(recipeId)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
      case 'rare': return 'text-purple-400 border-purple-500/30 bg-purple-500/10'
      case 'uncommon': return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400'
      case 'rare': return 'text-purple-400'
      case 'uncommon': return 'text-blue-400'
      default: return 'text-slate-400'
    }
  }

  const UPGRADE_ICONS: Record<string, typeof Wrench> = {
    engine: Zap,
    hull: Shield,
    storage: Package,
    radar: Anchor,
    crane: Wrench,
    lucky_charm: Clover,
    ice_plow: Snowflake,
    night_vision: Eye,
    autopilot: Navigation,
    refrigeration: ThermometerSnowflake,
  }

  const UPGRADE_DESC: Record<string, string> = {
    engine: '+10% speed per level',
    hull: '+15% durability per level',
    storage: '+20% capacity per level',
    radar: 'Better fish detection',
    crane: 'Faster trap hauling',
    lucky_charm: '+5% drop luck per level',
    ice_plow: 'Ice navigation safety',
    night_vision: 'Night fishing bonus',
    autopilot: 'Auto-navigation',
    refrigeration: '+5% fish value per level',
  }

  const SKILL_CATEGORY_COLORS: Record<string, string> = {
    fishing: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    navigation: 'text-green-400 bg-green-500/10 border-green-500/30',
    combat: 'text-red-400 bg-red-500/10 border-red-500/30',
    crafting: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    trading: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-6xl max-h-[95vh] overflow-hidden z-[100]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
              <Ship className="w-6 h-6" />
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

        <Tabs defaultValue="boats" className="mt-4">
          <TabsList className="bg-slate-800 w-full flex-wrap">
            <TabsTrigger value="boats" className="flex-1 data-[state=active]:bg-cyan-600">
              <Ship className="w-4 h-4 mr-1" />
              Boats
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 data-[state=active]:bg-cyan-600">
              <Trophy className="w-4 h-4 mr-1" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex-1 data-[state=active]:bg-cyan-600">
              <Gem className="w-4 h-4 mr-1" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="crafting" className="flex-1 data-[state=active]:bg-cyan-600">
              <Hammer className="w-4 h-4 mr-1" />
              Crafting
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex-1 data-[state=active]:bg-cyan-600">
              <Star className="w-4 h-4 mr-1" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="treasure_maps" className="flex-1 data-[state=active]:bg-cyan-600">
              <Scroll className="w-4 h-4 mr-1" />
              Maps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boats" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                {(player.ownedBoats?.length ?? 0) === 0 ? (
                  <div className="text-center py-12">
                    <Ship className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No boats in garage</p>
                    <p className="text-slate-500 text-sm mt-2">Visit the marketplace to purchase your first boat</p>
                  </div>
                ) : (
                  player.ownedBoats.map((boat) => {
                    const isCurrent = boat.id === player.currentBoatId
                    const tierConfig = BOAT_CONFIGS[boat.tier]

                    return (
                      <Card key={boat.id} className={`bg-slate-800/50 border-slate-700 ${isCurrent ? 'border-cyan-500/50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <Ship className="w-5 h-5 text-cyan-400" />
                                <p className="text-white font-semibold text-lg">{tierConfig.name}</p>
                                {isCurrent && (
                                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    <Check className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-400 text-sm mt-1">{tierConfig.description}</p>
                            </div>
                            {!isCurrent && (
                              <Button
                                onClick={() => handleSwitchBoat(boat.id)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white"
                                size="sm"
                              >
                                Select
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-3 mb-3">
                            <div className="bg-slate-700/50 rounded p-3 text-center">
                              <p className="text-slate-400 text-xs mb-1">Speed</p>
                              <p className="text-cyan-400 font-bold">{boat.speed.toFixed(1)}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded p-3 text-center">
                              <p className="text-slate-400 text-xs mb-1">Storage</p>
                              <p className="text-cyan-400 font-bold">{boat.storage}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded p-3 text-center">
                              <p className="text-slate-400 text-xs mb-1">Durability</p>
                              <p className="text-cyan-400 font-bold">{Math.floor(boat.durability)}/{boat.maxDurability}</p>
                            </div>
                            <div className="bg-slate-700/50 rounded p-3 text-center">
                              <p className="text-slate-400 text-xs mb-1">Tier</p>
                              <p className="text-cyan-400 font-bold capitalize">{boat.tier}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Upgrades (10 slots)</p>
                            <div className="grid grid-cols-5 gap-2">
                              {Object.entries(boat.upgrades).map(([key, level]) => {
                                const Icon = UPGRADE_ICONS[key] || Wrench
                                const maxLevel = 5
                                return (
                                  <div key={key} className="bg-slate-700/30 rounded p-2 text-center">
                                    <Icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                                    <p className="text-slate-400 text-xs capitalize truncate">{key.replace('_', ' ')}</p>
                                    <p className="text-slate-500 text-[10px]">{UPGRADE_DESC[key]}</p>
                                    <div className="flex gap-0.5 justify-center mt-1">
                                      {Array.from({ length: maxLevel }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`w-2 h-2 rounded-full ${
                                            i < level ? 'bg-cyan-400' : 'bg-slate-600'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}

                {/* Tools section */}
                {(player.ownedTools?.length ?? 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Tools</p>
                    <div className="space-y-2">
                      {player.ownedTools.map((tool) => (
                        <Card key={tool.id} className="bg-slate-800/50 border-slate-700">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium text-sm">{tool.name}</p>
                                <p className="text-slate-400 text-xs">{tool.method} - Efficiency: {tool.efficiency.toFixed(1)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${(tool.durability / tool.maxDurability) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-slate-400 text-xs">{tool.durability}/{tool.maxDurability}</span>
                                </div>
                                {tool.enchantments && tool.enchantments.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {tool.enchantments.map((enc) => (
                                      <Badge key={enc.id} className="text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        <Sparkles className="w-3 h-3 mr-0.5" />
                                        {enc.name}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {tool.durability < tool.maxDurability && (
                                <Button
                                  onClick={() => repairTool(tool.id)}
                                  className="bg-green-600 hover:bg-green-500 text-white"
                                  size="sm"
                                >
                                  <ToolWrench className="w-3 h-3 mr-1" />
                                  Repair
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm">
                    Skills level up through use. Catch fish to improve fishing skills, fight to improve combat, etc. Each level provides passive bonuses.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Scholar skill grants +3% XP per level to all sources.
                  </p>
                </div>

                {['fishing', 'navigation', 'combat', 'crafting', 'trading'].map((category) => (
                  <div key={category}>
                    <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${SKILL_CATEGORY_COLORS[category]?.split(' ')[0]}`}>
                      {category}
                    </p>
                    <div className="space-y-2 mb-4">
                      {skills.filter(s => s.category === category).map((skill) => {
                        const progress = (skill.xp / skill.xpToNext) * 100
                        const isMaxed = skill.level >= skill.maxLevel
                        return (
                          <Card key={skill.id} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{skill.icon}</span>
                                  <div>
                                    <p className="text-white font-medium text-sm">{skill.name}</p>
                                    <p className="text-slate-400 text-xs">{skill.effect}</p>
                                  </div>
                                </div>
                                <Badge className={getRarityColor(skill.level >= 15 ? 'legendary' : skill.level >= 10 ? 'rare' : skill.level >= 5 ? 'uncommon' : 'common')}>
                                  Lv.{skill.level}/{skill.maxLevel}
                                </Badge>
                              </div>
                              {!isMaxed && (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-cyan-500 rounded-full transition-all"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-slate-400 text-xs whitespace-nowrap">{skill.xp}/{skill.xpToNext} XP</span>
                                </div>
                              )}
                              {isMaxed && (
                                <p className="text-yellow-400 text-xs text-center">MAX LEVEL</p>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="artifacts" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm">
                    Equip up to 3 artifacts for powerful passive bonuses. Artifacts are found through achievements, treasure hunts, and rare catches.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Equipped: {equippedArtifacts.length}/3
                  </p>
                </div>

                {(player.ownedArtifacts?.length ?? 0) === 0 ? (
                  <div className="text-center py-12">
                    <Gem className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No artifacts discovered</p>
                    <p className="text-slate-500 text-sm mt-2">Complete achievements and treasure hunts to find artifacts</p>
                  </div>
                ) : (
                  player.ownedArtifacts.map((artifact) => {
                    const isEquipped = (player.equippedArtifacts ?? []).includes(artifact.id)
                    return (
                      <Card key={artifact.id} className={`bg-slate-800/50 border-slate-700 ${isEquipped ? 'border-yellow-500/50' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{artifact.icon}</span>
                              <div>
                                <p className={`font-medium text-sm ${getRarityTextColor(artifact.rarity)}`}>{artifact.name}</p>
                                <p className="text-slate-400 text-xs">{artifact.description}</p>
                                <p className="text-cyan-400 text-xs mt-1">{artifact.effect}</p>
                                <p className="text-slate-500 text-xs">Value: {artifact.value.toLocaleString()} gold</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {isEquipped ? (
                                <Button
                                  onClick={() => unequipArtifact(artifact.id)}
                                  className="bg-red-600/50 hover:bg-red-500/50 text-white"
                                  size="sm"
                                >
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                  Unequip
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => equipArtifact(artifact.id)}
                                  disabled={(player.equippedArtifacts?.length ?? 0) >= 3}
                                  className="bg-yellow-600/50 hover:bg-yellow-500/50 text-white disabled:opacity-50"
                                  size="sm"
                                >
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                  Equip
                                </Button>
                              )}
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

          <TabsContent value="crafting" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm">
                    Craft powerful upgrades using tokens. <span className="text-purple-400">Craftsman</span> skill reduces token cost. <span className="text-purple-400">Enchanter</span> skill boosts upgrade power.
                  </p>
                </div>

                {CRAFTABLE_RECIPES.map((recipe) => {
                  const tokenInfo = TOKEN_TYPES[recipe.tokenType]
                  const owned = getTokenCount(recipe.tokenType)
                  const craftsmanBonus = getSkillBonus('craftsman')
                  const tokensNeeded = Math.max(1, recipe.tokensRequired - craftsmanBonus)
                  const canCraftRecipe = owned >= tokensNeeded && !ownedUpgrades.includes(recipe.id)
                  const alreadyCrafted = ownedUpgrades.includes(recipe.id)

                  return (
                    <Card key={recipe.id} className={`bg-slate-800/50 border-slate-700 ${alreadyCrafted ? 'border-green-500/50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white">{recipe.name}</CardTitle>
                            <CardDescription className="text-slate-400 text-sm mt-1">
                              {recipe.description}
                            </CardDescription>
                          </div>
                          {alreadyCrafted && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Crafted
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-3 border ${getRarityColor(tokenInfo.rarity)}`}>
                              <p className="text-2xl">{tokenInfo.icon}</p>
                            </div>
                            <div>
                              <p className="text-white font-medium">{tokenInfo.name}</p>
                              <p className="text-slate-400 text-sm">
                                {owned} / {tokensNeeded} needed{craftsmanBonus > 0 && <span className="text-purple-400"> (-{craftsmanBonus} craftsman)</span>}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {Array.from({ length: tokensNeeded }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${
                                      i < owned ? 'bg-cyan-400' : 'bg-slate-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          {!alreadyCrafted && (
                            <Button
                              onClick={() => handleCraft(recipe.id)}
                              disabled={!canCraftRecipe}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                              size="sm"
                            >
                              <Hammer className="w-4 h-4 mr-1" />
                              Craft
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

          <TabsContent value="tokens" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 gap-3 pr-4">
                {Object.entries(TOKEN_TYPES).map(([type, token]) => {
                  const owned = getTokenCount(type as TokenType)
                  const recipes = CRAFTABLE_RECIPES.filter(r => r.tokenType === type)

                  return (
                    <Card key={type} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-lg p-3 border ${getRarityColor(token.rarity)}`}>
                              <p className="text-3xl">{token.icon}</p>
                            </div>
                            <div>
                              <CardTitle className="text-base text-white">{token.name}</CardTitle>
                              <CardDescription className="text-slate-400 text-xs mt-1">
                                {token.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getRarityColor(token.rarity)}>
                            {owned}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-slate-400 text-xs mb-2">Used in recipes:</p>
                          <div className="space-y-1">
                            {recipes.map(recipe => (
                              <div key={recipe.id} className="text-xs text-slate-300 flex items-center gap-1">
                                <Scroll className="w-3 h-3" />
                                {recipe.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Treasure Maps Tab */}
          <TabsContent value="treasure_maps" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                  <p className="text-slate-300 text-sm">
                    Craft treasure maps using tokens. Each map leads to different rewards - gold, artifacts, and exclusive cosmetics!
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Maps are consumed after use. Higher rarity maps require more tokens but yield better rewards.
                  </p>
                </div>

                {TREASURE_MAPS.map((map) => {
                  const discovered = player.discoveredMaps?.includes(map.id)
                  const canCraft = map.requiredTokens.every(req => getTokenCount(req.tokenType) >= req.quantity)

                  return (
                    <Card key={map.id} className={`bg-slate-800/50 border-slate-700 ${discovered ? 'border-green-500/50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                              <Scroll className="w-5 h-5 text-cyan-400" />
                              {map.name}
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-sm mt-1">
                              {map.description}
                            </CardDescription>
                          </div>
                          {discovered && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Discovered
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="bg-slate-700/50 rounded p-3 text-center">
                            <p className="text-slate-400">Gold</p>
                            <p className="text-yellow-400 font-bold">{map.rewards.goldMin}-{map.rewards.goldMax}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-3 text-center">
                            <p className="text-slate-400">XP</p>
                            <p className="text-cyan-400 font-bold">{map.rewards.xpReward}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-3 text-center">
                            <p className="text-slate-400">Artifact</p>
                            <p className="text-purple-400 font-bold">{(map.rewards.artifactChance * 100).toFixed(0)}%</p>
                          </div>
                        </div>

                        <div className="bg-slate-700/30 rounded p-3 mb-3">
                          <p className="text-slate-400 text-xs font-medium mb-2">Required Tokens:</p>
                          <div className="flex flex-wrap gap-2">
                            {map.requiredTokens.map((req) => {
                              const tokenInfo = TOKEN_TYPES[req.tokenType]
                              const owned = getTokenCount(req.tokenType)
                              const hasEnough = owned >= req.quantity
                              return (
                                <Badge key={req.tokenType} className={hasEnough ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                  {tokenInfo?.icon} {req.quantity}x {tokenInfo?.name || req.tokenType} ({owned})
                                </Badge>
                              )
                            })}
                          </div>
                        </div>

                        {map.rewards.cosmeticChance > 0 && (
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2 mb-3">
                            <p className="text-purple-400 text-xs font-medium">
                              🎁 Cosmetic Drop: {(map.rewards.cosmeticChance * 100).toFixed(0)}% chance to unlock a random shop cosmetic!
                            </p>
                          </div>
                        )}

                        {!discovered && (
                          <Button
                            onClick={() => craftTreasureMap(map.id)}
                            disabled={!canCraft}
                            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white disabled:opacity-50"
                          >
                            <Hammer className="w-4 h-4 mr-2" />
                            Craft Map
                          </Button>
                        )}
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
