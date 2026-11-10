import { create } from 'zustand'
import type {
  GameState, Player, Position, Boat, FishingTool, Job,
  InventoryItem, FishSpecies, GameSettings, SaveData,
  EnemyType, CombatState, Enemy, TokenType, TreasureHuntResult, TradeMarketItem, Token,
  CrewMember, Artifact, DailyChallenge, FishingCompetition, AchievementProgress,
  PlayerSkill, ToolEnchantment, Cosmetic, CosmeticSlot, CooperativeSettings,
  CooperativeState, TreasureMap, Clan, ClanMember, ClanStats,
  ChatMessage, ChatChannel, ChatState,
} from './types'
import {
  createDefaultPlayer, getXPForLevel, getLevelFromXP,
  BOAT_CONFIGS, FISH_SPECIES, FISHING_TOOLS,
  ENEMY_CONFIGS, WEATHER_MODIFIERS, TOKEN_TYPES, CRAFTABLE_RECIPES,
  CREW_TEMPLATES, ACHIEVEMENT_TEMPLATES, ARTIFACT_TEMPLATES, PLAYER_SKILLS,
  COSMETICS, TREASURE_MAPS, DEFAULT_COOPERATIVE_SETTINGS,
} from './types'
import { LOCATIONS } from './world-data'
import { saveGame, loadGame, autoSave, getSaveSlots, deleteSave } from './database'
import { createDefaultChatState } from './types'

interface GameStore {
  gameState: GameState
  setGameState: (state: GameState) => void

  player: Player | null
  initializePlayer: (name: string, spawnPosition: Position) => void
  updatePlayerPosition: (position: Position) => void
  updatePlayerRotation: (rotation: { x: number; y: number; z: number }) => void
  addGold: (amount: number) => void
  spendGold: (amount: number) => boolean
  addXP: (amount: number) => void
  addSkillXP: (skillId: string, amount: number) => boolean

  addToInventory: (item: InventoryItem) => void
  removeFromInventory: (itemId: string, quantity: number) => boolean
  getInventoryItem: (itemId: string) => InventoryItem | undefined

  buyBoat: (boatTier: keyof typeof BOAT_CONFIGS) => boolean
  selectBoat: (boatId: string) => void
  upgradeBoat: (boatId: string, upgradeType: keyof Boat['upgrades']) => boolean
  getCurrentBoat: () => Boat | null

  buyTool: (toolId: string) => boolean
  repairTool: (toolId: string) => boolean
  enchantTool: (toolId: string, enchantmentId: string) => boolean

  acceptJob: (job: Job) => void
  completeJob: (jobId: string) => boolean
  abandonJob: (jobId: string) => void

  catchFish: (speciesId: string, quantity: number) => void
  sellFish: (speciesId: string, quantity: number) => number
  sellFishAtMarket: (speciesId: string, quantity: number, market: 'current' | 'trade' | 'black') => number

  updateSettings: (settings: Partial<GameSettings>) => void

  saveSlots: (SaveData | null)[]
  loadSaveSlots: () => Promise<void>
  saveToSlot: (slotNumber: number, saveName: string) => Promise<void>
  loadFromSlot: (slotNumber: number) => Promise<boolean>
  deleteSlot: (slotNumber: number) => Promise<void>
  triggerAutoSave: () => Promise<void>

  currentLocation: string | null
  setCurrentLocation: (locationId: string | null) => void
  showTutorial: boolean
  setShowTutorial: (show: boolean) => void

  updatePlayTime: (deltaTime: number) => void
  tickGameTime: (realSeconds: number) => void

  // Garage
  garageOpen: boolean
  setGarageOpen: (open: boolean) => void
  switchBoat: (boatId: string) => boolean
  applyCraftedUpgrade: (boatId: string, upgradeType: keyof Boat['upgrades'], bonus: number) => boolean

  // Skills
  getSkills: () => PlayerSkill[]
  getSkillLevel: (skillId: string) => number
  getSkillBonus: (skillId: string) => number

  // Artifacts
  equipArtifact: (artifactId: string) => boolean
  unequipArtifact: (artifactId: string) => boolean
  getEquippedArtifacts: () => Artifact[]
  getArtifactBonus: (effectType: string) => number

  // Tool Enchantments
  getToolEnchantments: () => ToolEnchantment[]
  applyToolEnchantment: (toolId: string, enchantment: ToolEnchantment) => boolean

  // Treasure Hunting
  startTreasureHunt: () => TreasureHuntResult
  getTokenCount: (tokenType: TokenType) => number

  // Crafting
  craftItem: (recipeId: string) => boolean
  canCraft: (recipeId: string) => boolean

  // Trade Market
  refreshTradeMarket: () => void
  buyFromMarket: (itemId: string) => boolean
  sellToMarket: (tokenType: TokenType, quantity: number, price: number) => boolean

  // Crew Management
  hireCrew: (crewIndex: number) => boolean
  fireCrew: (crewId: string) => boolean
  payCrew: () => boolean
  levelUpCrew: (crewId: string) => boolean
  getCrewEfficiency: () => number

  // Boat Repair
  repairBoat: (boatId: string, amount?: number) => boolean

  // Achievements
  getAchievements: () => AchievementProgress[]
  checkAchievements: () => AchievementProgress[]

  // Daily Challenges
  refreshDailyChallenges: () => void
  updateChallengeProgress: (type: DailyChallenge['type'], amount: number) => void
  getDailyChallenges: () => DailyChallenge[]

  // Fishing Competitions
  joinCompetition: (competitionId: string) => boolean
  updateCompetitionScore: (speciesId: string, quantity: number) => void
  getActiveCompetition: () => FishingCompetition | null

  // Combat
  combat: CombatState | null
  startCombat: (enemyType?: EnemyType) => void
  doCombatAction: (action: 'attack' | 'defend' | 'flee' | 'special') => void
  endCombat: () => void

  // Cosmetics
  buyCosmetic: (cosmeticId: string) => boolean
  equipCosmetic: (cosmeticId: string, slot: CosmeticSlot) => boolean
  unequipCosmetic: (slot: CosmeticSlot) => boolean
  getEquippedCosmetics: () => Partial<Record<CosmeticSlot, Cosmetic | undefined>>
  getCosmeticBonus: (effectType: string) => number
  getOwnedCosmetics: () => Cosmetic[]

  // Treasure Maps
  craftTreasureMap: (mapId: string) => TreasureMap | null
  canCraftTreasureMap: (mapId: string) => boolean
  getDiscoveredMaps: () => string[]
  executeTreasureMap: (mapId: string) => TreasureHuntResult

  // Cooperative
  updateCooperativeSettings: (settings: Partial<CooperativeSettings>) => void
  setCoopSessionId: (sessionId: string | null) => void
  setCoopHost: (isHost: boolean) => void
  addCoopPlayer: (player: CooperativeState['players'][0]) => void
  removeCoopPlayer: (playerId: string) => void

  // Token fishing discovery
  getTokensFoundWhileFishing: () => number

  // Secret locations
  discoverSecretLocation: (locationId: string) => boolean
  getDiscoveredSecrets: () => string[]
  getUndiscoveredSecrets: () => typeof LOCATIONS
  canDiscoverSecret: (locationId: string) => boolean

  // Generic map crafting from tokens
  craftMapFromTokens: () => boolean
  canCraftMapFromTokens: () => boolean

  // Inventory capacity with cosmetic bonuses
  getInventoryCapacity: () => number

  // Clan management
  clans: Clan[]
  createClan: (name: string, tag: string, description: string, motto: string) => boolean
  disbandClan: () => boolean
  inviteToClan: (playerName: string) => boolean
  acceptClanInvite: (clanId: string) => boolean
  leaveClan: () => boolean
  getClan: () => Clan | null
  kickFromClan: (playerId: string) => boolean
  promoteClanMember: (playerId: string) => boolean
  contributeToClan: (amount: number) => boolean
  addClanXP: (amount: number) => void
  getClanMemberCount: () => number

  // Cosmetic token redemption
  redeemCosmeticToken: () => string | null
  getRedeemableCosmetics: () => Cosmetic[]

  // Chat system
  sendWorldMessage: (content: string) => void
  sendClanMessage: (content: string) => void
  sendPrivateMessage: (recipientId: string, recipientName: string, content: string) => void
  addSystemMessage: (channel: ChatChannel, content: string) => void
  clearChat: (channel: ChatChannel, otherPlayerId?: string) => void
  markChatRead: (channel: ChatChannel, otherPlayerId?: string) => void
  getChatMessages: (channel: ChatChannel, otherPlayerId?: string) => ChatMessage[]
}

function normalizePlayer(player: Player): Player {
  if (!player.equippedArtifacts) player.equippedArtifacts = []
  if (!player.ownedArtifacts) player.ownedArtifacts = []
  if (!player.ownedTools) player.ownedTools = []
  if (!player.activeJobs) player.activeJobs = []
  if (!player.completedJobs) player.completedJobs = []
  if (!player.ownedUpgrades) player.ownedUpgrades = []
  if (!player.tradeMarket) player.tradeMarket = []
  if (!player.crew) player.crew = []
  if (!player.achievements) player.achievements = []
  if (!player.dailyChallenges) player.dailyChallenges = []
  if (!player.fishingCompetitions) player.fishingCompetitions = []
  if (!player.discoveredMaps) player.discoveredMaps = []
  if (!player.clanInvites) player.clanInvites = []
  if (!player.skills || player.skills.length === 0) {
    player.skills = PLAYER_SKILLS.map(s => ({ ...s, xp: 0, xpToNext: 100 }))
  }
  if (!player.toolEnchantments) player.toolEnchantments = []
  if (!player.discoveredSecrets) player.discoveredSecrets = []
  if (!player.ownedCosmetics) player.ownedCosmetics = ['skin_classic', 'rod_skin_basic', 'deco_basic_flag', 'dock_deco_basic']
  if (!player.equippedCosmetics) player.equippedCosmetics = { boat_skin: 'skin_classic', fishing_rod_skin: 'rod_skin_basic', fishing_spot: 'deco_basic_flag', dock_decoration: 'dock_deco_basic' }
  if (!player.chat) player.chat = createDefaultChatState()
  // Normalize boats with new upgrade slots
  if (!player.ownedBoats) player.ownedBoats = []
  player.ownedBoats = player.ownedBoats.map(b => ({
    ...b,
    upgrades: {
      engine: b.upgrades.engine ?? 0,
      hull: b.upgrades.hull ?? 0,
      storage: b.upgrades.storage ?? 0,
      radar: b.upgrades.radar ?? 0,
      crane: b.upgrades.crane ?? 0,
      lucky_charm: (b.upgrades as any).lucky_charm ?? 0,
      ice_plow: (b.upgrades as any).ice_plow ?? 0,
      night_vision: (b.upgrades as any).night_vision ?? 0,
      autopilot: (b.upgrades as any).autopilot ?? 0,
      refrigeration: (b.upgrades as any).refrigeration ?? 0,
    },
  }))
  return player
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Game State
  gameState: 'menu',
  setGameState: (state) => set({ gameState: state }),
  
  // Player
  player: null,
  initializePlayer: (name, spawnPosition) => {
    const player = createDefaultPlayer(name, spawnPosition)
    set({ player })
  },
  updatePlayerPosition: (position) => {
    const { player } = get()
    if (!player) return
    
    // Calculate distance traveled
    const dx = position.x - player.position.x
    const dz = position.z - player.position.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    
    set({
      player: {
        ...player,
        position,
        stats: {
          ...player.stats,
          totalDistanceTraveled: player.stats.totalDistanceTraveled + distance,
        },
      },
    })
  },
  updatePlayerRotation: (rotation) => {
    const { player } = get()
    if (!player) return
    set({ player: { ...player, rotation } })
  },
  addGold: (amount) => {
    const { player } = get()
    if (!player) return
    // Apply cosmetic gold bonus
    const goldBonus = get().getCosmeticBonus('goldBonus')
    const adjustedAmount = Math.floor(amount * (1 + goldBonus))
    set({
      player: {
        ...player,
        gold: player.gold + adjustedAmount,
        stats: {
          ...player.stats,
          totalGoldEarned: player.stats.totalGoldEarned + adjustedAmount,
        },
      },
    })
  },
  spendGold: (amount) => {
    const { player } = get()
    if (!player || player.gold < amount) return false
    set({ player: { ...player, gold: player.gold - amount } })
    return true
  },
  addXP: (amount) => {
    const { player } = get()
    if (!player) return
    
    // Apply cosmetic XP bonus
    const xpBonus = get().getCosmeticBonus('xpBonus')
    const scholarBonus = get().getSkillBonus('scholar')
    const totalMultiplier = 1 + xpBonus + scholarBonus
    const adjustedAmount = Math.floor(amount * totalMultiplier)
    
    const newTotalXP = player.xp + adjustedAmount
    const { level, currentXP, xpToNext } = getLevelFromXP(newTotalXP)
    
    set({
      player: {
        ...player,
        level,
        xp: newTotalXP,
        xpToNextLevel: xpToNext,
      },
    })
  },
  addSkillXP: (skillId, amount) => {
    const { player } = get()
    if (!player || !player.skills) return false
    const skillIndex = player.skills.findIndex(s => s.id === skillId)
    if (skillIndex < 0) return false
    const skill = player.skills[skillIndex]
    if (skill.level >= skill.maxLevel) return false
    
    const newSkills = [...player.skills]
    let newXP = skill.xp + amount
    let newLevel = skill.level
    let newXpToNext = skill.xpToNext
    
    while (newXP >= newXpToNext && newLevel < skill.maxLevel) {
      newXP -= newXpToNext
      newLevel++
      newXpToNext = Math.floor(100 * Math.pow(1.3, newLevel - 1))
    }
    
    newSkills[skillIndex] = { ...skill, level: newLevel, xp: newXP, xpToNext: newXpToNext }
    set({ player: { ...player, skills: newSkills } })
    return true
  },
  
  // Inventory
  addToInventory: (item) => {
    const { player } = get()
    if (!player) return
    
    const existingIndex = player.inventory.findIndex(
      (i) => i.itemId === item.itemId && i.type === item.type
    )
    
    if (existingIndex >= 0) {
      const newInventory = [...player.inventory]
      newInventory[existingIndex] = {
        ...newInventory[existingIndex],
        quantity: newInventory[existingIndex].quantity + item.quantity,
      }
      set({ player: { ...player, inventory: newInventory } })
    } else {
      set({ player: { ...player, inventory: [...player.inventory, item] } })
    }
  },
  removeFromInventory: (itemId, quantity) => {
    const { player } = get()
    if (!player) return false
    
    const existingIndex = player.inventory.findIndex((i) => i.itemId === itemId)
    if (existingIndex < 0 || player.inventory[existingIndex].quantity < quantity) {
      return false
    }
    
    const newInventory = [...player.inventory]
    newInventory[existingIndex] = {
      ...newInventory[existingIndex],
      quantity: newInventory[existingIndex].quantity - quantity,
    }
    
    // Remove if quantity is 0
    if (newInventory[existingIndex].quantity <= 0) {
      newInventory.splice(existingIndex, 1)
    }
    
    set({ player: { ...player, inventory: newInventory } })
    return true
  },
  getInventoryItem: (itemId) => {
    const { player } = get()
    return player?.inventory.find((i) => i.itemId === itemId)
  },
  
  // Boats
  buyBoat: (boatTier) => {
    const { spendGold } = get()
    let { player } = get()
    if (!player) return false
    
    const boatConfig = BOAT_CONFIGS[boatTier]
    if (player.level < boatConfig.requiredLevel) return false
    if (!spendGold(boatConfig.cost)) return false
    
    // Refresh player after gold spent
    player = get().player!;
    
    const newBoat: Boat = {
      ...boatConfig,
      id: crypto.randomUUID(),
      position: player.position,
      rotation: player.rotation,
      upgrades: {
        engine: 0,
        hull: 0,
        storage: 0,
        radar: 0,
        crane: 0,
        lucky_charm: 0,
        ice_plow: 0,
        night_vision: 0,
        autopilot: 0,
        refrigeration: 0,
      },
    }
    
    set({
      player: {
        ...player,
        ownedBoats: [...player.ownedBoats, newBoat],
        currentBoatId: player.currentBoatId || newBoat.id,
      },
    })
    return true
  },
  selectBoat: (boatId) => {
    const { player } = get()
    if (!player) return
    
    const boat = player.ownedBoats.find((b) => b.id === boatId)
    if (!boat) return
    
    set({ player: { ...player, currentBoatId: boatId } })
  },
  upgradeBoat: (boatId, upgradeType) => {
    const { player, spendGold } = get()
    if (!player) return false
    
    const boatIndex = player.ownedBoats.findIndex((b) => b.id === boatId)
    if (boatIndex < 0) return false
    
    const boat = player.ownedBoats[boatIndex]
    const currentLevel = boat.upgrades[upgradeType]
    if (currentLevel >= 5) return false
    
    const upgradeCost = 100 * (currentLevel + 1) * (currentLevel + 1)
    if (!spendGold(upgradeCost)) return false
    
    // Re-fetch player state after gold is spent, as it might have changed
    const { player: playerAfterSpend } = get();
    if (!playerAfterSpend) return false; // Should not happen, but for safety

    const newBoats = [...playerAfterSpend.ownedBoats]
    const newUpgrades = { ...boat.upgrades, [upgradeType]: currentLevel + 1 }
    const updatedBoat = { ...boat, upgrades: newUpgrades }
    
    switch (upgradeType) {
      case 'engine':
        updatedBoat.speed = boat.baseSpeed * (1 + (currentLevel + 1) * 0.1)
        break
      case 'hull':
        updatedBoat.maxDurability = Math.floor(boat.maxDurability * (1 + (currentLevel + 1) * 0.15))
        updatedBoat.durability = Math.min(boat.durability + Math.floor(boat.maxDurability * 0.15), updatedBoat.maxDurability)
        break
      case 'storage':
        updatedBoat.storage = Math.floor(boat.baseStorage * (1 + (currentLevel + 1) * 0.2))
        break
      case 'lucky_charm':
        updatedBoat.speed = boat.speed
        break
      case 'ice_plow':
        updatedBoat.speed = boat.speed
        break
      case 'night_vision':
        updatedBoat.speed = boat.speed
        break
      case 'autopilot':
        updatedBoat.speed = boat.speed
        break
      case 'refrigeration':
        updatedBoat.speed = boat.speed
        break
    }
    
    newBoats[boatIndex] = updatedBoat
    set({ player: { ...playerAfterSpend, ownedBoats: newBoats } }) // Use playerAfterSpend to ensure gold deduction is kept
    return true
  },
  getCurrentBoat: () => {
    const { player } = get()
    if (!player || !player.currentBoatId) return null
    return player.ownedBoats.find((b) => b.id === player.currentBoatId) || null
  },
  
  // Tools
  buyTool: (toolId) => {
    const { player, spendGold } = get()
    if (!player) return false
    
    const tool = FISHING_TOOLS.find((t) => t.id === toolId)
    if (!tool) return false
    if (player.level < tool.requiredLevel) return false
    if (!spendGold(tool.cost)) return false
    
    if (player.ownedTools.some((t) => t.id === toolId)) return false
    
    set({
      player: {
        ...player,
        ownedTools: [...player.ownedTools, { ...tool, enchantments: [] }],
      },
    })
    return true
  },
  repairTool: (toolId) => {
    const { player, spendGold } = get()
    if (!player) return false
    const toolIndex = player.ownedTools.findIndex(t => t.id === toolId)
    if (toolIndex < 0) return false
    const tool = player.ownedTools[toolIndex]
    if (tool.durability >= tool.maxDurability) return false
    const repairCost = Math.floor((tool.maxDurability - tool.durability) * 0.3)
    if (!spendGold(repairCost)) return false
    const newTools = [...player.ownedTools]
    newTools[toolIndex] = { ...tool, durability: tool.maxDurability }
    set({ player: { ...player, ownedTools: newTools } })
    return true
  },
  enchantTool: (toolId, enchantmentId) => {
    const { player, spendGold } = get()
    if (!player) return false
    const toolIndex = player.ownedTools.findIndex(t => t.id === toolId)
    if (toolIndex < 0) return false
    const tool = player.ownedTools[toolIndex]
    if ((tool.enchantments?.length ?? 0) >= 3) return false
    const enchantCost = 200 + (tool.enchantments?.length ?? 0) * 150
    if (!spendGold(enchantCost)) return false
    const enchantmentTypes: ToolEnchantment[] = [
      { id: `eff_${Date.now()}`, name: 'Efficiency Boost', description: '+20% efficiency', effect: { type: 'efficiency', value: 0.2 }, icon: '⚡' },
      { id: `dur_${Date.now()}`, name: 'Durability Charm', description: '+30% max durability', effect: { type: 'durability', value: 0.3 }, icon: '🛡️' },
      { id: `rare_${Date.now()}`, name: 'Rare Luck', description: '+15% rare fish chance', effect: { type: 'rare_chance', value: 0.15 }, icon: '💎' },
      { id: `leg_${Date.now()}`, name: 'Legendary Lure', description: '+8% legendary fish chance', effect: { type: 'legendary_chance', value: 0.08 }, icon: '👑' },
      { id: `qty_${Date.now()}`, name: 'Net Expansion', description: '+1 catch quantity', effect: { type: 'quantity', value: 1 }, icon: '📦' },
      { id: `dep_${Date.now()}`, name: 'Deep Reach', description: '+30m max depth', effect: { type: 'depth', value: 30 }, icon: '🌊' },
    ]
    const chosen = enchantmentTypes[enchantmentTypes.findIndex(e => e.id.startsWith(enchantmentId)) % enchantmentTypes.length]
    const newTools = [...player.ownedTools]
    const currentEnchantments = tool.enchantments ?? []
    newTools[toolIndex] = { ...tool, enchantments: [...currentEnchantments, chosen] }
    set({ player: { ...player, ownedTools: newTools } })
    return true
  },
  
  // Jobs
  acceptJob: (job) => {
    const { player } = get()
    if (!player) return
    
    if (player.activeJobs.length >= 3) return // Max 3 active jobs
    if (player.activeJobs.some((j) => j.id === job.id)) return
    
    set({ player: { ...player, activeJobs: [...player.activeJobs, job] } })
  },
  completeJob: (jobId) => {
    const { player, addGold, addXP } = get()
    if (!player) return false
    
    const job = player.activeJobs.find((j) => j.id === jobId)
    if (!job) return false
    
    // Check if requirements are met
    for (const req of job.requirements) {
      const inventoryItem = player.inventory.find((i) => i.itemId === req.fishId)
      if (!inventoryItem || inventoryItem.quantity < req.quantity) {
        return false
      }
    }
    
    // Remove required fish from inventory
    let newPlayer = { ...player }
    for (const req of job.requirements) {
      const inventoryIndex = newPlayer.inventory.findIndex((i) => i.itemId === req.fishId)
      if (inventoryIndex >= 0) {
        const newInventory = [...newPlayer.inventory]
        newInventory[inventoryIndex] = {
          ...newInventory[inventoryIndex],
          quantity: newInventory[inventoryIndex].quantity - req.quantity,
        }
        if (newInventory[inventoryIndex].quantity <= 0) {
          newInventory.splice(inventoryIndex, 1)
        }
        newPlayer = { ...newPlayer, inventory: newInventory }
      }
    }
    
    // Grant rewards
    addGold(job.reward.gold)
    addXP(job.reward.xp)
    
    // Move job to completed
    set({
      player: {
        ...get().player!,
        activeJobs: get().player!.activeJobs.filter((j) => j.id !== jobId),
        completedJobs: [...get().player!.completedJobs, jobId],
        stats: {
          ...get().player!.stats,
          totalJobsCompleted: get().player!.stats.totalJobsCompleted + 1,
        },
      },
    })
    
    return true
  },
  abandonJob: (jobId) => {
    const { player } = get()
    if (!player) return
    
    set({
      player: {
        ...player,
        activeJobs: player.activeJobs.filter((j) => j.id !== jobId),
      },
    })
  },
  
  // Fishing
  catchFish: (speciesId, quantity) => {
    const { player, addToInventory } = get()
    if (!player) return
    
    const species = FISH_SPECIES.find((f) => f.id === speciesId)
    if (!species) return
    
    addToInventory({
      id: crypto.randomUUID(),
      type: 'fish',
      itemId: speciesId,
      quantity,
    })
    
    // Update stats
    const newStats = { ...player.stats, totalFishCaught: player.stats.totalFishCaught + quantity }
    if (species.rarity === 'rare') {
      newStats.raresCaught += quantity
    } else if (species.rarity === 'legendary') {
      newStats.legendariesCaught += quantity
    }
    
    set({ player: { ...get().player!, stats: newStats } })
  },
  sellFish: (speciesId, quantity) => {
    const { player, removeFromInventory, addGold } = get()
    if (!player) return 0
    
    const species = FISH_SPECIES.find((f) => f.id === speciesId)
    if (!species) return 0
    
    if (!removeFromInventory(speciesId, quantity)) return 0
    
    const totalValue = species.baseValue * quantity
    addGold(totalValue)
    return totalValue
  },
  sellFishAtMarket: (speciesId, quantity, market) => {
    const { player, removeFromInventory, addGold } = get()
    if (!player) return 0
    
    const species = FISH_SPECIES.find((f) => f.id === speciesId)
    if (!species) return 0
    
    if (!removeFromInventory(speciesId, quantity)) return 0
    
    const priceMultiplier = market === 'current' ? 1.0 : market === 'trade' ? 0.75 : 1.5
    const totalValue = Math.floor(species.baseValue * quantity * priceMultiplier)
    addGold(totalValue)
    return totalValue
  },
  
  // Settings
  updateSettings: (settings) => {
    const { player } = get()
    if (!player) return
    
    set({
      player: {
        ...player,
        settings: { ...player.settings, ...settings },
      },
    })
  },
  
  // Save/Load
  saveSlots: [null, null, null, null, null],
  loadSaveSlots: async () => {
    const slots = await getSaveSlots()
    set({ saveSlots: slots })
  },
  saveToSlot: async (slotNumber, saveName) => {
    const { player } = get()
    if (!player) return
    
    set({ gameState: 'saving' })
    
    await saveGame({
      slotNumber,
      name: saveName,
      player,
      timestamp: Date.now(),
      playTime: player.stats.playTime,
    })
    
    await get().loadSaveSlots()
    set({ gameState: 'playing' })
  },
  loadFromSlot: async (slotNumber) => {
    set({ gameState: 'loading' })
    
    const saveData = await loadGame(slotNumber)
    if (!saveData) {
      set({ gameState: 'menu' })
      return false
    }
    
    // Normalize old saves that may be missing new fields
    const player = saveData.player
    if (player) {
      normalizePlayer(player)
    }
    
    set({
      player: saveData.player,
      gameState: 'playing',
    })
    return true
  },
  deleteSlot: async (slotNumber) => {
    await deleteSave(slotNumber)
    await get().loadSaveSlots()
  },
  triggerAutoSave: async () => {
    const { player } = get()
    if (!player) return
    
    await autoSave({
      name: 'Auto Save',
      player,
      timestamp: Date.now(),
      playTime: player.stats.playTime,
    })
  },
  
  // Clan State
  clans: [],
  // UI State
  currentLocation: null,
  setCurrentLocation: (locationId) => set({ currentLocation: locationId }),
  showTutorial: true,
  setShowTutorial: (show) => set({ showTutorial: show }),
  
  // Stats
  updatePlayTime: (deltaTime) => {
    const { player } = get()
    if (!player) return
    
    set({
      player: {
        ...player,
        stats: {
          ...player.stats,
          playTime: player.stats.playTime + deltaTime,
        },
      },
    })
  },

  tickGameTime: (realSeconds) => {
    const { player } = get()
    if (!player) return

    const addedMinutes = realSeconds
    let { hour, minute, day } = player.time
    minute += addedMinutes
    while (minute >= 60) { minute -= 60; hour++ }
    while (hour >= 24) { hour -= 24; day++ }

    const timeOfDay =
      hour >= 5 && hour < 9 ? 'dawn' :
      hour >= 9 && hour < 19 ? 'day' :
      hour >= 19 && hour < 22 ? 'dusk' : 'night'

    // ── Weather transition ──────────────────────────────────────────────────
    let { current, nextChangeIn } = player.weather
    nextChangeIn -= realSeconds

    if (nextChangeIn <= 0) {
      // Intelligent weather: transitions follow realistic patterns
      // e.g. clear → cloudy → rain → storm, not random jumps
      const progressions: Record<string, string[]> = {
        clear:    ['clear', 'clear', 'cloudy', 'heatwave'],
        cloudy:   ['clear', 'cloudy', 'rain', 'snow', 'fog', 'mist'],
        rain:     ['cloudy', 'rain', 'rain', 'storm', 'hail', 'thunderstorm'],
        snow:     ['cloudy', 'snow', 'snow', 'blizzard', 'ice_storm', 'polar_night'],
        fog:      ['clear', 'cloudy', 'fog', 'mist'],
        storm:    ['rain', 'storm', 'cloudy', 'thunderstorm', 'supercell', 'hurricane'],
        blizzard: ['snow', 'blizzard', 'storm', 'polar_night', 'ice_storm', 'whiteout'],
        aurora:   ['clear', 'clear', 'cloudy', 'clear', 'magnetic_storm', 'meteor_shower', 'blood_moon'],
        whiteout: ['blizzard', 'snow', 'storm', 'whiteout', 'ice_storm'],
        hail:     ['rain', 'storm', 'hail', 'thunderstorm', 'ice_storm'],
        thunderstorm: ['storm', 'thunderstorm', 'rain', 'hail', 'supercell', 'tornado'],
        mist:     ['fog', 'mist', 'clear', 'cloudy', 'rain'],
        heatwave: ['clear', 'heatwave', 'cloudy', 'mist', 'thunderstorm'],
        polar_night: ['snow', 'blizzard', 'polar_night', 'aurora', 'ice_storm'],
        magnetic_storm: ['aurora', 'clear', 'magnetic_storm', 'storm', 'meteor_shower'],
        hurricane: ['storm', 'hurricane', 'supercell', 'rain', 'tsunami', 'rogue_wave'],
        tornado:   ['thunderstorm', 'tornado', 'supercell', 'storm', 'hurricane'],
        tsunami:   ['storm', 'tsunami', 'hurricane', 'rain', 'rogue_wave'],
        volcanic_ash: ['clear', 'volcanic_ash', 'cloudy', 'fog', 'mist'],
        meteor_shower: ['clear', 'aurora', 'meteor_shower', 'magnetic_storm', 'clear'],
        blood_moon: ['aurora', 'clear', 'blood_moon', 'magnetic_storm', 'meteor_shower'],
        supercell: ['storm', 'thunderstorm', 'supercell', 'tornado', 'hurricane', 'hail'],
        ice_storm: ['snow', 'blizzard', 'ice_storm', 'polar_night', 'hail', 'whiteout'],
        rogue_wave: ['storm', 'rogue_wave', 'tsunami', 'hurricane', 'clear'],
      }
      const isNight = timeOfDay === 'night'
      const candidates = progressions[current.type] ?? ['clear', 'cloudy']
      // At night, slightly prefer worse weather
      const pool = isNight ? [...candidates, 'storm', 'fog'] : candidates
      const newType = pool[Math.floor(Math.random() * pool.length)] as typeof current.type

      current = {
        type: newType,
        windSpeed:
          newType === 'storm' || newType === 'blizzard' || newType === 'thunderstorm' ? 25 + Math.random() * 25
          : newType === 'rain' || newType === 'snow' || newType === 'hail' ? 10 + Math.random() * 12
          : newType === 'polar_night' || newType === 'magnetic_storm' ? 8 + Math.random() * 15
          : newType === 'hurricane' || newType === 'supercell' ? 50 + Math.random() * 40
          : newType === 'tornado' ? 80 + Math.random() * 50
          : newType === 'tsunami' || newType === 'rogue_wave' ? 30 + Math.random() * 25
          : newType === 'volcanic_ash' ? 15 + Math.random() * 10
          : newType === 'ice_storm' ? 25 + Math.random() * 20
          : 2 + Math.random() * 8,
        temperature: newType === 'blizzard' || newType === 'polar_night' ? -20 + Math.random() * -10
          : newType === 'snow' || newType === 'hail' || newType === 'ice_storm' ? -15 + Math.random() * 5
          : newType === 'heatwave' ? 10 + Math.random() * 10
          : newType === 'thunderstorm' || newType === 'supercell' ? -5 + Math.random() * 3
          : newType === 'volcanic_ash' ? -10 + Math.random() * 5
          : newType === 'hurricane' || newType === 'tornado' || newType === 'tsunami' || newType === 'rogue_wave' ? -5 + Math.random() * 5
          : -5 + Math.random() * 15,
        visibility:
          newType === 'blizzard' || newType === 'whiteout' ? 0.1
          : newType === 'fog' || newType === 'mist' ? 0.15 + Math.random() * 0.15
          : newType === 'storm' || newType === 'thunderstorm' ? 0.3 + Math.random() * 0.2
          : newType === 'rain' || newType === 'snow' || newType === 'hail' ? 0.5 + Math.random() * 0.2
          : newType === 'polar_night' ? 0.2 + Math.random() * 0.2
          : newType === 'magnetic_storm' ? 0.4 + Math.random() * 0.3
          : newType === 'hurricane' || newType === 'tornado' || newType === 'supercell' ? 0.05 + Math.random() * 0.05
          : newType === 'tsunami' || newType === 'rogue_wave' ? 0.15 + Math.random() * 0.15
          : newType === 'volcanic_ash' ? 0.03 + Math.random() * 0.05
          : newType === 'ice_storm' ? 0.1 + Math.random() * 0.1
          : newType === 'meteor_shower' ? 0.7 + Math.random() * 0.2
          : newType === 'blood_moon' ? 0.4 + Math.random() * 0.2
          : 0.85 + Math.random() * 0.15,
      }
      // Storms are short, calm weather is long
      nextChangeIn =
        newType === 'storm' || newType === 'blizzard' || newType === 'thunderstorm' || newType === 'hail' || newType === 'hurricane' || newType === 'tornado' || newType === 'supercell' ? 20 + Math.random() * 40
        : newType === 'clear' || newType === 'heatwave' ? 120 + Math.random() * 180
        : 60 + Math.random() * 90
    }

    // ── Weather gameplay effects ────────────────────────────────────────────
    // Apply boat durability drain from harsh weather
    const mods = WEATHER_MODIFIERS[current.type]
    let updatedBoats = player.ownedBoats
    if (mods.durabilityDrainRate > 0 && player.currentBoatId) {
      const drainPerSecond = mods.durabilityDrainRate / 60
      updatedBoats = player.ownedBoats.map(b =>
        b.id === player.currentBoatId
          ? { ...b, durability: Math.max(0, b.durability - drainPerSecond * realSeconds) }
          : b
      )
    }

    // ── Random encounter trigger ────────────────────────────────────────────
    // Fog and storm increase pirate encounter chance
    const encounterChancePerSecond =
      current.type === 'fog' || current.type === 'mist' ? 0.002
      : current.type === 'storm' || current.type === 'thunderstorm' || current.type === 'supercell' ? 0.0015
      : current.type === 'magnetic_storm' || current.type === 'blood_moon' ? 0.003
      : current.type === 'polar_night' || current.type === 'volcanic_ash' ? 0.002
      : current.type === 'hurricane' || current.type === 'tornado' ? 0.005
      : current.type === 'tsunami' || current.type === 'rogue_wave' ? 0.004
      : 0.0005
    const { combat } = get()
    if (!combat?.active && player.currentBoatId && Math.random() < encounterChancePerSecond * realSeconds) {
      const types: EnemyType[] = player.level < 3
        ? ['pirate_skiff']
        : player.level < 6
        ? ['pirate_skiff', 'rival_fisher']
        : ['pirate_skiff', 'pirate_trawler', 'rival_fisher', 'sea_monster']
      const chosenType = types[Math.floor(Math.random() * types.length)]
      setTimeout(() => get().startCombat(chosenType), 500)
    }

    set({
      player: {
        ...player,
        time: { hour: Math.floor(hour), minute: Math.floor(minute), day, timeOfDay },
        weather: { current, nextChangeIn },
        ownedBoats: updatedBoats,
      },
    })
  },

  // ── Combat ────────────────────────────────────────────────────────────────
  combat: null,

  startCombat: (enemyType) => {
    const { player } = get()
    if (!player) return
    const boat = player.ownedBoats.find(b => b.id === player.currentBoatId)
    if (!boat) return // can't fight without a boat

    const type: EnemyType = enemyType ?? 'pirate_skiff'
    const cfg = ENEMY_CONFIGS[type]
    // Scale enemy to player level
    const lvlMult = 0.7 + player.level * 0.1
    const enemy: Enemy = {
      ...cfg,
      id: crypto.randomUUID(),
      health: Math.floor(cfg.maxHealth * lvlMult),
      maxHealth: Math.floor(cfg.maxHealth * lvlMult),
      attack: Math.floor(cfg.attack * lvlMult),
      level: Math.max(1, player.level - 1 + Math.floor(Math.random() * 3)),
      reward: {
        gold: Math.floor((cfg.reward.gold ?? 100) * lvlMult),
        xp: Math.floor((cfg.reward.xp ?? 30) * lvlMult),
        loot: cfg.reward.loot,
      },
    }

    const combat: CombatState = {
      active: true,
      enemy,
      playerHealth: boat.durability,
      round: 1,
      turn: 1,
      log: [`⚔️ A ${enemy.name} has appeared! Prepare for battle!`],
      result: 'ongoing',
      fleeChance: 0.35,
    }
    set({ combat })
  },

  doCombatAction: (action) => {
    const { combat, player, addXP, addGold } = get()
    if (!combat?.active || !combat.enemy || !player) return

    const boat = player.ownedBoats.find(b => b.id === player.currentBoatId)
    const weatherMods = WEATHER_MODIFIERS[player.weather.current.type]
    const log = [...combat.log]
    let { enemy, playerHealth } = combat
    const { round, fleeChance } = combat
    let result: CombatState['result'] = 'ongoing'

    if (action === 'flee') {
      // Weather reduces flee chance (harder to escape in fog/storm)
      const effectiveFlee = fleeChance - weatherMods.combatDifficultyBonus * 0.3
      if (Math.random() < effectiveFlee) {
        log.push(`🏃 You managed to escape!`)
        set({ combat: { ...combat, active: false, result: 'fled', log } })
        return
      } else {
        log.push(`❌ Couldn't escape! The ${enemy.name} attacks!`)
        const dmg = Math.floor(enemy.attack * (0.8 + Math.random() * 0.4) * (1 + weatherMods.combatDifficultyBonus * 0.5))
        playerHealth = Math.max(0, playerHealth - dmg)
        log.push(`💥 You took ${dmg} damage. Hull: ${Math.floor(playerHealth)}`)
      }
    } else if (action === 'attack') {
      // Player attack: base 20 + level bonus, weather affects accuracy
      const accuracy = 0.6 + player.level * 0.04 - weatherMods.combatDifficultyBonus * 0.2
      if (Math.random() < accuracy) {
        const dmg = Math.floor((15 + player.level * 3) * (0.8 + Math.random() * 0.4) * (1 - enemy.defense))
        enemy = { ...enemy, health: Math.max(0, enemy.health - dmg) }
        log.push(`⚓ You deal ${dmg} damage! Enemy hull: ${enemy.health}/${enemy.maxHealth}`)
      } else {
        log.push(`💨 Missed! The waves throw off your aim.`)
      }
      // Enemy counter-attack
      if (enemy.health > 0) {
        const eDmg = Math.floor(enemy.attack * (0.7 + Math.random() * 0.5))
        playerHealth = Math.max(0, playerHealth - eDmg)
        log.push(`💥 ${enemy.name} hits back for ${eDmg}! Hull: ${Math.floor(playerHealth)}`)
      }
    } else if (action === 'defend') {
      // Defend: take half damage this round, small counter
      const eDmg = Math.floor(enemy.attack * 0.3 * (0.7 + Math.random() * 0.4))
      playerHealth = Math.max(0, playerHealth - eDmg)
      const counter = Math.floor((8 + player.level * 2) * (1 - enemy.defense))
      enemy = { ...enemy, health: Math.max(0, enemy.health - counter) }
      log.push(`🛡️ You defend! Took only ${eDmg} damage, counter for ${counter}.`)
    } else if (action === 'special') {
      // Special: high damage but 40% chance to miss, costs 10 durability
      if (Math.random() < 0.6) {
        const dmg = Math.floor((30 + player.level * 5) * (1 - enemy.defense))
        enemy = { ...enemy, health: Math.max(0, enemy.health - dmg) }
        log.push(`🔥 HARPOON! Critical strike for ${dmg} damage!`)
      } else {
        log.push(`💨 Harpoon missed completely!`)
      }
      playerHealth = Math.max(0, playerHealth - 10)
      if (enemy.health > 0) {
        const eDmg = Math.floor(enemy.attack * (0.7 + Math.random() * 0.5))
        playerHealth = Math.max(0, playerHealth - eDmg)
        log.push(`💥 ${enemy.name} retaliates for ${eDmg}!`)
      }
    }

    // Check victory/defeat
    if (enemy.health <= 0) {
      result = 'victory'
      log.push(`🎉 Victory! ${enemy.name} defeated!`)
      log.push(`💰 +${enemy.reward.gold} Gold, +${enemy.reward.xp} XP`)
      addGold(enemy.reward.gold)
      addXP(enemy.reward.xp)
      // Apply durability damage to boat
      if (boat) {
        const updatedBoats = player.ownedBoats.map(b =>
          b.id === player.currentBoatId
            ? { ...b, durability: Math.floor(playerHealth) }
            : b
        )
        set({ player: { ...player, ownedBoats: updatedBoats } })
      }
    } else if (playerHealth <= 0) {
      result = 'defeat'
      log.push(`💀 Your boat was destroyed! You barely escaped with your life.`)
      // Lose 20% gold on defeat
      const goldLost = Math.floor(player.gold * 0.2)
      if (goldLost > 0) {
        log.push(`💸 Lost ${goldLost} Gold in the chaos.`)
        set({ player: { ...player, gold: player.gold - goldLost } })
      }
    }

    set({
      combat: {
        active: result === 'ongoing',
        enemy,
        playerHealth,
        round: round + 1,
        turn: round + 1,
        log: log.slice(-8), // keep last 8 lines
        result,
        fleeChance: Math.min(0.8, fleeChance + 0.05), // flee gets easier each round
      },
    })
  },

  endCombat: () => {
    set({ combat: null })
  },

  // ── Garage ────────────────────────────────────────────────────────────────
  garageOpen: false,
  setGarageOpen: (open) => set({ garageOpen: open }),
  switchBoat: (boatId) => {
    const { player } = get()
    if (!player) return false
    const boat = player.ownedBoats.find(b => b.id === boatId)
    if (!boat) return false
    set({ player: { ...player, currentBoatId: boatId } })
    return true
  },
  applyCraftedUpgrade: (boatId, upgradeType, bonus) => {
    const { player } = get()
    if (!player) return false
    const boatIndex = player.ownedBoats.findIndex(b => b.id === boatId)
    if (boatIndex < 0) return false
    const boat = player.ownedBoats[boatIndex]
    const newBoats = [...player.ownedBoats]
    switch (upgradeType) {
      case 'engine':
        newBoats[boatIndex] = { ...boat, speed: boat.speed * (1 + bonus) }
        break
      case 'hull':
        newBoats[boatIndex] = { ...boat, maxDurability: Math.floor(boat.maxDurability * (1 + bonus)), durability: Math.min(boat.durability * (1 + bonus), boat.maxDurability * (1 + bonus)) }
        break
      case 'storage':
        newBoats[boatIndex] = { ...boat, storage: Math.floor(boat.storage * (1 + bonus)) }
        break
      case 'radar':
      case 'crane':
      case 'lucky_charm':
      case 'ice_plow':
      case 'night_vision':
      case 'autopilot':
      case 'refrigeration':
        newBoats[boatIndex] = { ...boat, upgrades: { ...boat.upgrades, [upgradeType]: Math.min(boat.upgrades[upgradeType] + 1, 10) } }
        break
    }
    set({ player: { ...player, ownedBoats: newBoats } })
    return true
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  getSkills: () => {
    const { player } = get()
    if (!player || !player.skills) return []
    return player.skills
  },
  getSkillLevel: (skillId) => {
    const { player } = get()
    if (!player || !player.skills) return 0
    const skill = player.skills.find(s => s.id === skillId)
    return skill?.level ?? 0
  },
  getSkillBonus: (skillId) => {
    const { player } = get()
    if (!player || !player.skills) return 0
    const skill = player.skills.find(s => s.id === skillId)
    if (!skill) return 0
    switch (skillId) {
      case 'fishing_luck': return skill.level * 0.03
      case 'reel_master': return skill.level * 0.05
      case 'deep_sea': return skill.level * 10
      case 'navigator': return skill.level * 0.03
      case 'ice_pilot': return skill.level * 0.05
      case 'explorer': return skill.level * 0.08
      case 'harpoon': return skill.level * 0.05
      case 'hull_repair': return skill.level * 0.05
      case 'survivalist': return skill.level * 0.08
      case 'craftsman': return Math.floor(skill.level / 5)
      case 'enchanter': return skill.level * 0.05
      case 'scholar': return skill.level * 0.03
      case 'haggler': return skill.level * 0.03
      case 'market_guru': return skill.level * 0.10
      case 'smuggler': return skill.level > 0 ? 1 : 0
      default: return 0
    }
  },

  // ── Artifacts ─────────────────────────────────────────────────────────────
  equipArtifact: (artifactId) => {
    const { player } = get()
    if (!player) return false
    if (!player.ownedArtifacts.find(a => a.id === artifactId)) return false
    const equipped = player.equippedArtifacts ?? []
    if (equipped.includes(artifactId)) return false
    if (equipped.length >= 3) return false
    set({ player: { ...player, equippedArtifacts: [...equipped, artifactId] } })
    return true
  },
  unequipArtifact: (artifactId) => {
    const { player } = get()
    if (!player) return false
    const equipped = player.equippedArtifacts ?? []
    set({ player: { ...player, equippedArtifacts: equipped.filter(id => id !== artifactId) } })
    return true
  },
  getEquippedArtifacts: () => {
    const { player } = get()
    if (!player) return []
    const equipped = player.equippedArtifacts ?? []
    return (player.ownedArtifacts ?? []).filter(a => equipped.includes(a.id))
  },
  getArtifactBonus: (effectType) => {
    const { player } = get()
    if (!player) return 0
    const equipped = get().getEquippedArtifacts()
    let bonus = 0
    equipped.forEach(a => {
      const effects: Record<string, number> = {
        'fishing_success': a.effect.includes('+50% fishing') ? 0.5 : a.effect.includes('+30% rare') ? 0.3 : 0,
        'treasure_success': a.effect.includes('+25% treasure') ? 0.25 : 0,
        'storm_resistance': a.effect.includes('-20% damage') ? 0.2 : 0,
        'crew_morale': a.effect.includes('+20% crew') ? 0.2 : 0,
        'durability': a.effect.includes('+15% boat') ? 0.15 : 0,
        'mythical_chance': a.effect.includes('+40% mythical') ? 0.4 : 0,
        'blizzard_resistance': a.effect.includes('+20% blizzard') ? 0.2 : 0,
      }
      bonus += effects[effectType] ?? 0
    })
    return bonus
  },

  // ── Tool Enchantments ─────────────────────────────────────────────────────
  getToolEnchantments: () => {
    const { player } = get()
    if (!player) return []
    return player.toolEnchantments ?? []
  },
  applyToolEnchantment: (toolId, enchantment) => {
    const { player } = get()
    if (!player) return false
    const toolIndex = player.ownedTools.findIndex(t => t.id === toolId)
    if (toolIndex < 0) return false
    const newTools = [...player.ownedTools]
    const tool = newTools[toolIndex]
    const currentEnchantments = tool.enchantments ?? []
    if (currentEnchantments.length >= 3) return false
    newTools[toolIndex] = { ...tool, enchantments: [...currentEnchantments, enchantment] }
    set({ player: { ...player, ownedTools: newTools } })
    return true
  },

  // ── Treasure Hunting ──────────────────────────────────────────────────────
  startTreasureHunt: (): TreasureHuntResult => {
    const { player, addXP, addGold } = get()
    if (!player) return { success: false, tokensFound: [], goldFound: 0, xpReward: 0, message: 'No player data', durabilityCost: 0 }
    const ownedUpgrades = player.ownedUpgrades ?? []
    const tradeMarket = player.tradeMarket ?? []
    const boat = player.ownedBoats.find(b => b.id === player.currentBoatId)
    if (!boat) return { success: false, tokensFound: [], goldFound: 0, xpReward: 0, message: 'No boat available', durabilityCost: 0 }
    if (boat.durability < 20) return { success: false, tokensFound: [], goldFound: 0, xpReward: 0, message: 'Boat durability too low', durabilityCost: 0 }

    const durabilityCost = 15 + Math.floor(Math.random() * 10)
    const weatherBonus = player.weather.current.type === 'clear' ? 1.2 : player.weather.current.type === 'fog' ? 0.5 : 0.8
    const radarBonus = boat.upgrades.radar * 0.1
    const successChance = (0.4 + radarBonus) * weatherBonus
    const success = Math.random() < successChance

    if (!success) {
      const updatedBoats = player.ownedBoats.map(b =>
        b.id === player.currentBoatId ? { ...b, durability: Math.max(0, b.durability - durabilityCost) } : b
      )
      set({ player: { ...player, ownedBoats: updatedBoats } })
      return { success: false, tokensFound: [], goldFound: 0, xpReward: 5, message: 'No treasures found this time...', durabilityCost }
    }

    const numTokens = 1 + Math.floor(Math.random() * 3)
    const tokensFound: Token[] = []
    const tokenTypes: TokenType[] = ['ancient_coin', 'coral_gem', 'pearl_fragment', 'driftwood_charm', 'ice_crystal', 'sea_shell', 'tide_stone', 'whale_bone', 'viking_rune', 'siren_tear', 'leviathan_scale', 'abyssal_core', 'cosmetic_token']
    const rarityWeights = { common: 50, uncommon: 30, rare: 15, legendary: 5 }

    for (let i = 0; i < numTokens; i++) {
      const roll = Math.random() * 100
      let chosenRarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common'
      if (roll > 95) chosenRarity = 'legendary'
      else if (roll > 80) chosenRarity = 'rare'
      else if (roll > 50) chosenRarity = 'uncommon'

      const candidates = tokenTypes.filter(t => TOKEN_TYPES[t].rarity === chosenRarity)
      const chosenType = candidates[Math.floor(Math.random() * candidates.length)]
      const tokenConfig = TOKEN_TYPES[chosenType]
      const token: Token = { id: crypto.randomUUID(), type: chosenType, name: tokenConfig.name, description: tokenConfig.description, rarity: tokenConfig.rarity, icon: tokenConfig.icon }
      tokensFound.push(token)

      const existing = player.inventory.find(item => item.itemId === chosenType && item.type === 'token')
      if (existing) {
        const newInventory = [...player.inventory]
        const idx = newInventory.findIndex(item => item.itemId === chosenType && item.type === 'token')
        newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity + 1 }
        set({ player: { ...get().player!, inventory: newInventory } })
      } else {
        get().addToInventory({ id: crypto.randomUUID(), type: 'token', itemId: chosenType, quantity: 1 })
      }
    }

    const goldFound = Math.floor(20 + Math.random() * 80 * (1 + radarBonus))
    const xpReward = 20 + numTokens * 15 + (tokensFound.some(t => t.rarity === 'legendary') ? 50 : 0)

    addGold(goldFound)
    addXP(xpReward)

    const updatedBoats = player.ownedBoats.map(b =>
      b.id === player.currentBoatId ? { ...b, durability: Math.max(0, b.durability - durabilityCost) } : b
    )
    set({ player: { ...get().player!, ownedBoats: updatedBoats } })

    const rarityMsg = tokensFound.some(t => t.rarity === 'legendary') ? 'Legendary find!' : tokensFound.some(t => t.rarity === 'rare') ? 'Rare discovery!' : 'Treasure hunt successful!'
    return { success: true, tokensFound, goldFound, xpReward, message: rarityMsg, durabilityCost }
  },
  getTokenCount: (tokenType) => {
    const { player } = get()
    if (!player) return 0
    const item = player.inventory.find(i => i.itemId === tokenType && i.type === 'token')
    return item ? item.quantity : 0
  },

  // ── Crafting ──────────────────────────────────────────────────────────────
  canCraft: (recipeId) => {
    const { player, getTokenCount } = get()
    if (!player) return false
    const ownedUpgrades = player.ownedUpgrades || []
    const recipe = CRAFTABLE_RECIPES.find(r => r.id === recipeId)
    if (!recipe) return false
    if (ownedUpgrades.includes(recipeId)) return false
    return getTokenCount(recipe.tokenType) >= recipe.tokensRequired
  },
  craftItem: (recipeId) => {
    const { player, getTokenCount, applyCraftedUpgrade, addXP, addSkillXP } = get()
    if (!player) return false
    const ownedUpgrades = player.ownedUpgrades ?? []
    const recipe = CRAFTABLE_RECIPES.find(r => r.id === recipeId)
    if (!recipe) return false
    if (!get().canCraft(recipeId)) return false

    let tokensNeeded = recipe.tokensRequired
    const craftsmanBonus = get().getSkillBonus('craftsman')
    tokensNeeded = Math.max(1, tokensNeeded - craftsmanBonus)

    const newInventory = [...player.inventory]
    const tokenIdx = newInventory.findIndex(i => i.itemId === recipe.tokenType && i.type === 'token')
    if (tokenIdx < 0) return false
    newInventory[tokenIdx] = { ...newInventory[tokenIdx], quantity: newInventory[tokenIdx].quantity - tokensNeeded }
    if (newInventory[tokenIdx].quantity <= 0) newInventory.splice(tokenIdx, 1)

    const enchanterBonus = get().getSkillBonus('enchanter')

    if (recipe.result.type === 'boat_upgrade' && player.currentBoatId) {
      const bonusMap: Record<string, number> = {
        engine: 0.2, hull: 0.25, storage: 0.3, radar: 0, crane: 0,
        lucky_charm: 0, ice_plow: 0, night_vision: 0, autopilot: 0, refrigeration: 0,
      }
      let bonus = bonusMap[recipe.result.itemId] ?? 0
      bonus *= (1 + enchanterBonus)
      applyCraftedUpgrade(player.currentBoatId, recipe.result.itemId as keyof Boat['upgrades'], bonus)
    } else if (recipe.result.type === 'tool' && recipe.result.itemId === 'any') {
      const enchantment: ToolEnchantment = {
        id: `craft_${Date.now()}`,
        name: recipe.name,
        description: recipe.description,
        effect: { type: 'efficiency', value: 0.2 * (1 + enchanterBonus) },
        icon: '✨',
      }
      if (player.ownedTools.length > 0) {
        get().applyToolEnchantment(player.ownedTools[0].id, enchantment)
      }
    } else if (recipe.result.itemId.startsWith('skill_')) {
      const skillMap: Record<string, string> = {
        skill_fishing_boost: 'fishing_luck',
        skill_combat_boost: 'harpoon',
        skill_trade_boost: 'haggler',
      }
      const skillId = skillMap[recipe.result.itemId]
      if (skillId) {
        const skill = player.skills?.find(s => s.id === skillId)
        if (skill && skill.level < skill.maxLevel) {
          const xpNeeded = skill.xpToNext - skill.xp
          addSkillXP(skillId, xpNeeded * 2)
        }
      }
    }

    addXP(50)

    set({ player: { ...player, inventory: newInventory, ownedUpgrades: [...ownedUpgrades, recipeId] } })
    return true
  },

  // ── Trade Market ──────────────────────────────────────────────────────────
  refreshTradeMarket: () => {
    const { player } = get()
    if (!player) return
    const tradeMarket = player.tradeMarket ?? []
    const marketItems: TradeMarketItem[] = []
    const tokenTypes: TokenType[] = ['ancient_coin', 'coral_gem', 'pearl_fragment', 'driftwood_charm', 'ice_crystal', 'sea_shell', 'tide_stone', 'whale_bone', 'viking_rune', 'siren_tear', 'leviathan_scale', 'abyssal_core', 'cosmetic_token']
    const basePrices: Record<TokenType, number> = {
      ancient_coin: 30, coral_gem: 60, pearl_fragment: 55, driftwood_charm: 25,
      ice_crystal: 100, sea_shell: 35, tide_stone: 90, whale_bone: 200,
      viking_rune: 150, siren_tear: 300, leviathan_scale: 500, abyssal_core: 800,
      cosmetic_token: 1000,
    }
    for (let i = 0; i < 4; i++) {
      const tokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)]
      const priceVariation = 0.7 + Math.random() * 0.6
      marketItems.push({
        id: crypto.randomUUID(),
        type: 'token',
        itemId: tokenType,
        price: Math.floor(basePrices[tokenType] * priceVariation),
        quantity: 1 + Math.floor(Math.random() * 3),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      })
    }
    set({ player: { ...player, tradeMarket: marketItems } })
  },
  buyFromMarket: (itemId) => {
    const { player, spendGold, addToInventory } = get()
    if (!player) return false
    const tradeMarket = player.tradeMarket ?? []
    const marketItem = tradeMarket.find(i => i.id === itemId)
    if (!marketItem || marketItem.quantity <= 0) return false
    if (!spendGold(marketItem.price)) return false

    const updatedMarket = tradeMarket.map(i =>
      i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0)

    addToInventory({ id: crypto.randomUUID(), type: 'token', itemId: marketItem.itemId, quantity: 1 })
    set({ player: { ...player, tradeMarket: updatedMarket } })
    return true
  },
  sellToMarket: (tokenType, quantity, price) => {
    const { player, removeFromInventory } = get()
    if (!player) return false
    const tradeMarket = player.tradeMarket ?? []
    if (!removeFromInventory(tokenType, quantity)) return false

    const marketItem: TradeMarketItem = {
      id: crypto.randomUUID(),
      type: 'token',
      itemId: tokenType,
      price,
      quantity,
      expiresAt: Date.now() + 48 * 60 * 60 * 1000,
    }
    const updatedMarket = [...tradeMarket.slice(-9), marketItem]
    set({ player: { ...player, tradeMarket: updatedMarket } })
    return true
  },

  // ── Crew Management ─────────────────────────────────────────────────────
  hireCrew: (crewIndex) => {
    const { player, spendGold } = get()
    if (!player) return false
    const template = CREW_TEMPLATES[crewIndex]
    if (!template) return false
    const hireCost = template.salary * 5
    if (!spendGold(hireCost)) return false
    if (player.crew.length >= 5) return false

    const newCrew: CrewMember = {
      ...template,
      id: crypto.randomUUID(),
    }
    const updatedStats = {
      ...player.stats,
      totalCrewHired: player.stats.totalCrewHired + 1,
    }
    set({ player: { ...player, crew: [...player.crew, newCrew], stats: updatedStats } })
    return true
  },
  fireCrew: (crewId) => {
    const { player } = get()
    if (!player) return false
    const updatedCrew = player.crew.filter(c => c.id !== crewId)
    set({ player: { ...player, crew: updatedCrew } })
    return true
  },
  payCrew: () => {
    const { player, spendGold } = get()
    if (!player || player.crew.length === 0) return false
    const totalSalary = player.crew.reduce((sum, c) => sum + c.salary, 0)
    if (!spendGold(totalSalary)) return false
    const updatedCrew = player.crew.map(c => ({
      ...c,
      morale: Math.min(100, c.morale + 10),
    }))
    set({ player: { ...player, crew: updatedCrew } })
    return true
  },
  levelUpCrew: (crewId) => {
    const { player, spendGold } = get()
    if (!player) return false
    const crewIndex = player.crew.findIndex(c => c.id === crewId)
    if (crewIndex < 0) return false
    const crew = player.crew[crewIndex]
    if (crew.level >= 10) return false
    const levelUpCost = crew.salary * 10 * crew.level
    if (!spendGold(levelUpCost)) return false
    const updatedCrew = [...player.crew]
    updatedCrew[crewIndex] = {
      ...crew,
      level: crew.level + 1,
      efficiency: Math.round((crew.efficiency + 0.3) * 10) / 10,
      salary: Math.floor(crew.salary * 1.15),
      morale: Math.min(100, crew.morale + 15),
    }
    set({ player: { ...player, crew: updatedCrew } })
    return true
  },
  getCrewEfficiency: () => {
    const { player } = get()
    if (!player || player.crew.length === 0) return 1
    const totalEff = player.crew.reduce((sum, c) => sum + c.efficiency, 0)
    return 1 + (totalEff * 0.1)
  },

  // ── Boat Repair ─────────────────────────────────────────────────────────
  repairBoat: (boatId, amount) => {
    const { player, spendGold } = get()
    if (!player) return false
    const boatIndex = player.ownedBoats.findIndex(b => b.id === boatId)
    if (boatIndex < 0) return false
    const boat = player.ownedBoats[boatIndex]
    const repairAmount = amount ?? Math.floor(boat.maxDurability * 0.3)
    const cost = Math.floor(repairAmount * 0.5)
    if (!spendGold(cost)) return false

    const newBoats = [...player.ownedBoats]
    newBoats[boatIndex] = {
      ...boat,
      durability: Math.min(boat.maxDurability, boat.durability + repairAmount),
    }
    set({ player: { ...player, ownedBoats: newBoats } })
    return true
  },

  // ── Achievements ────────────────────────────────────────────────────────
  getAchievements: () => {
    const { player } = get()
    if (!player) return []
    if (!player.achievements || player.achievements.length === 0) {
      const initialAchievements: AchievementProgress[] = ACHIEVEMENT_TEMPLATES.map(a => ({
        ...a,
        current: 0,
        completed: false,
      }))
      set({ player: { ...player, achievements: initialAchievements } })
      return initialAchievements
    }
    return player.achievements
  },
  checkAchievements: () => {
    const { player } = get()
    if (!player) return []
    const achievements = player.achievements || []
    const newAchievements = achievements.map(a => {
      if (a.completed) return a
      let current = a.current
      switch (a.id) {
        case 'first_catch': current = player.stats.totalFishCaught
          break
        case 'cod_master': current = player.inventory.find(i => i.itemId === 'arctic_cod')?.quantity ?? 0
          break
        case 'rare_hunter': current = player.stats.raresCaught
          break
        case 'legendary_fisher': current = player.stats.legendariesCaught
          break
        case 'mythical_catch': current = player.stats.mythicalsCaught
          break
        case 'gold_hoarder': current = player.stats.totalGoldEarned
          break
        case 'treasure_hunter': current = player.stats.totalTreasuresFound
          break
        case 'sea_explorer': current = Math.floor(player.stats.totalDistanceTraveled)
          break
        case 'job_completed': current = player.stats.totalJobsCompleted
          break
        case 'artifact_collector': current = player.stats.totalArtifactsFound
          break
        case 'crew_captain': current = player.crew.length
          break
        case 'competition_winner': current = player.stats.competitionsWon
          break
      }
      const newlyCompleted = current >= a.target && !a.completed
      if (newlyCompleted) {
        if (a.reward.gold) get().addGold(a.reward.gold)
        if (a.reward.xp) get().addXP(a.reward.xp)
        if (a.reward.artifact) {
          const artifact = ARTIFACT_TEMPLATES.find(ar => ar.id === a.reward.artifact)
          if (artifact && !player.ownedArtifacts.find(ar => ar.id === artifact.id)) {
            set({ player: { ...get().player!, ownedArtifacts: [...(get().player!.ownedArtifacts || []), artifact] } })
          }
        }
      }
      return { ...a, current, completed: newlyCompleted || a.completed }
    })
    set({ player: { ...player, achievements: newAchievements } })
    return newAchievements.filter(a => a.completed && !achievements.find(oa => oa.id === a.id && oa.completed))
  },

  // ── Daily Challenges ────────────────────────────────────────────────────
  refreshDailyChallenges: () => {
    const { player } = get()
    if (!player) return
    const challengePool = [
      { id: 'daily_catch_10', title: 'Daily Catch', description: 'Catch 10 fish', target: 10, type: 'catch' as const, reward: { gold: 50, xp: 30 } },
      { id: 'daily_sell_100', title: 'Market Day', description: 'Sell 100 gold worth of fish', target: 100, type: 'sell' as const, reward: { gold: 40, xp: 25 } },
      { id: 'daily_hunt_3', title: 'Treasure Seeker', description: 'Complete 3 treasure hunts', target: 3, type: 'hunt' as const, reward: { gold: 80, xp: 50 } },
      { id: 'daily_travel_50', title: 'Explorer', description: 'Travel 50 distance', target: 50, type: 'travel' as const, reward: { gold: 30, xp: 20 } },
      { id: 'daily_combat_2', title: 'Sea Warrior', description: 'Win 2 naval battles', target: 2, type: 'combat' as const, reward: { gold: 100, xp: 60 } },
      { id: 'daily_craft_1', title: 'Craftsman', description: 'Craft 1 upgrade', target: 1, type: 'craft' as const, reward: { gold: 60, xp: 40 } },
    ]
    const shuffled = [...challengePool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 3).map(c => ({
      ...c,
      current: 0,
      completed: false,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }))
    set({ player: { ...player, dailyChallenges: selected } })
  },
  updateChallengeProgress: (type, amount) => {
    const { player } = get()
    if (!player || !player.dailyChallenges) return
    const updatedChallenges = player.dailyChallenges.map(c => {
      if (c.type === type && !c.completed) {
        const newCurrent = c.current + amount
        const newlyCompleted = newCurrent >= c.target
        if (newlyCompleted) {
          get().addGold(c.reward.gold)
          get().addXP(c.reward.xp)
        }
        return { ...c, current: newCurrent, completed: newlyCompleted }
      }
      return c
    })
    set({ player: { ...player, dailyChallenges: updatedChallenges } })
  },
  getDailyChallenges: () => {
    const { player } = get()
    if (!player) return []
    const challenges = player.dailyChallenges || []
    const expired = challenges.filter(c => c.expiresAt < Date.now())
    if (expired.length > 0) {
      get().refreshDailyChallenges()
    }
    return challenges
  },

  // ── Fishing Competitions ────────────────────────────────────────────────
  joinCompetition: (competitionId) => {
    const { player, spendGold } = get()
    if (!player) return false
    const entryFee = 100
    if (!spendGold(entryFee)) return false

    const species = FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)]
    const competition: FishingCompetition = {
      id: crypto.randomUUID(),
      title: `${species.name} Derby`,
      description: `Catch as many ${species.name} as possible!`,
      targetSpecies: species.id,
      startTime: Date.now(),
      endTime: Date.now() + 30 * 60 * 1000,
      participants: 5 + Math.floor(Math.random() * 10),
      prize: { gold: 500 + Math.floor(Math.random() * 500), xp: 200 },
      playerScore: 0,
      rank: 0,
      active: true,
    }
    set({ player: { ...player, fishingCompetitions: [...(player.fishingCompetitions || []), competition] } })
    return true
  },
  updateCompetitionScore: (speciesId, quantity) => {
    const { player } = get()
    if (!player || !player.fishingCompetitions) return
    const updatedCompetitions = player.fishingCompetitions.map(c => {
      if (c.active && c.targetSpecies === speciesId) {
        return { ...c, playerScore: c.playerScore + quantity }
      }
      return c
    })
    const now = Date.now()
    const completedCompetitions = updatedCompetitions.map(c => {
      if (c.active && now >= c.endTime) {
        const finalRank = Math.max(1, Math.floor(Math.random() * 4))
        const won = finalRank === 1
        if (won) {
          get().addGold(c.prize.gold)
          get().addXP(c.prize.xp)
        }
        return { ...c, active: false, rank: finalRank }
      }
      return c
    })
    set({ player: { ...player, fishingCompetitions: completedCompetitions } })
  },
  getActiveCompetition: () => {
    const { player } = get()
    if (!player) return null
    return (player.fishingCompetitions || []).find(c => c.active) || null
  },

  // ── Cosmetics ──────────────────────────────────────────────────────────
  buyCosmetic: (cosmeticId) => {
    const { player, spendGold } = get()
    if (!player) return false
    const cosmetic = COSMETICS.find(c => c.id === cosmeticId)
    if (!cosmetic || !cosmetic.availableInShop) return false
    if (player.level < cosmetic.requiredLevel) return false
    if (player.ownedCosmetics?.includes(cosmeticId)) return false
    if (!spendGold(cosmetic.price)) return false
    const ownedCosmetics = [...(player.ownedCosmetics || []), cosmeticId]
    set({ player: { ...player, ownedCosmetics } })
    return true
  },
  equipCosmetic: (cosmeticId, slot) => {
    const { player } = get()
    if (!player) return false
    const owned = player.ownedCosmetics?.includes(cosmeticId)
    if (!owned) return false
    const cosmetic = COSMETICS.find(c => c.id === cosmeticId)
    if (!cosmetic || cosmetic.slot !== slot) return false
    const equippedCosmetics = { ...(player.equippedCosmetics || {}), [slot]: cosmeticId }
    set({ player: { ...player, equippedCosmetics } })
    return true
  },
  unequipCosmetic: (slot) => {
    const { player } = get()
    if (!player) return false
    const equippedCosmetics = { ...(player.equippedCosmetics || {}) }
    delete equippedCosmetics[slot]
    set({ player: { ...player, equippedCosmetics } })
    return true
  },
  getEquippedCosmetics: () => {
    const { player } = get()
    if (!player) return {}
    const equipped: Partial<Record<CosmeticSlot, Cosmetic | undefined>> = {}
    const eq = player.equippedCosmetics || {}
    for (const [slot, id] of Object.entries(eq)) {
      equipped[slot as CosmeticSlot] = COSMETICS.find(c => c.id === id)
    }
    return equipped
  },
  getCosmeticBonus: (effectType) => {
    const { player } = get()
    if (!player) return 0
    const equipped = get().getEquippedCosmetics()
    let bonus = 0
    for (const cosmetic of Object.values(equipped)) {
      if (cosmetic?.effects) {
        const val = (cosmetic.effects as any)[effectType]
        if (val) bonus += val
      }
    }
    return bonus
  },
  getOwnedCosmetics: () => {
    const { player } = get()
    if (!player) return []
    return (player.ownedCosmetics || []).map(id => COSMETICS.find(c => c.id === id)).filter(Boolean) as Cosmetic[]
  },

  // ── Treasure Maps ──────────────────────────────────────────────────────
  canCraftTreasureMap: (mapId) => {
    const { player, getTokenCount } = get()
    if (!player) return false
    const map = TREASURE_MAPS.find(m => m.id === mapId)
    if (!map) return false
    if (player.discoveredMaps?.includes(mapId)) return false
    return map.requiredTokens.every(req => getTokenCount(req.tokenType) >= req.quantity)
  },
  craftTreasureMap: (mapId) => {
    const { player } = get()
    if (!player) return null
    if (!get().canCraftTreasureMap(mapId)) return null
    const map = TREASURE_MAPS.find(m => m.id === mapId)!
    const newInventory = [...player.inventory]
    for (const req of map.requiredTokens) {
      const idx = newInventory.findIndex(i => i.itemId === req.tokenType && i.type === 'token')
      if (idx >= 0) {
        newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity - req.quantity }
        if (newInventory[idx].quantity <= 0) newInventory.splice(idx, 1)
      }
    }
    const discoveredMaps = [...(player.discoveredMaps || []), mapId]
    set({ player: { ...player, inventory: newInventory, discoveredMaps } })
    return map
  },
  getDiscoveredMaps: () => {
    const { player } = get()
    return player?.discoveredMaps || []
  },
  executeTreasureMap: (mapId) => {
    const { player, addGold, addXP, addToInventory } = get()
    if (!player) return { success: false, tokensFound: [], goldFound: 0, xpReward: 0, message: 'No player', durabilityCost: 0 }
    const map = TREASURE_MAPS.find(m => m.id === mapId)
    if (!map || !player.discoveredMaps?.includes(mapId)) {
      return { success: false, tokensFound: [], goldFound: 0, xpReward: 0, message: 'Map not discovered', durabilityCost: 0 }
    }
    const rarityBonus = map.rarity === 'mythical' ? 1.5 : map.rarity === 'legendary' ? 1.3 : map.rarity === 'rare' ? 1.1 : 1
    const goldFound = Math.floor((map.rewards.goldMin + Math.random() * (map.rewards.goldMax - map.rewards.goldMin)) * rarityBonus)
    const xpReward = Math.floor(map.rewards.xpReward * rarityBonus)
    const tokensFound: Token[] = []
    for (const gt of map.rewards.guaranteedTokens) {
      const tokenConfig = TOKEN_TYPES[gt.tokenType]
      if (tokenConfig) {
        const token: Token = { id: crypto.randomUUID(), ...tokenConfig }
        tokensFound.push(token)
        addToInventory({ id: crypto.randomUUID(), type: 'token', itemId: gt.tokenType, quantity: gt.quantity })
      }
    }
    if (Math.random() < map.rewards.artifactChance) {
      const artifact = ARTIFACT_TEMPLATES[Math.floor(Math.random() * ARTIFACT_TEMPLATES.length)]
      if (!player.ownedArtifacts?.find(a => a.id === artifact.id)) {
        set({ player: { ...get().player!, ownedArtifacts: [...(get().player!.ownedArtifacts || []), { ...artifact, id: crypto.randomUUID() }] } })
      }
    }
    if (Math.random() < map.rewards.cosmeticChance) {
      const shopCosmetics = COSMETICS.filter(c => c.availableInShop && !player.ownedCosmetics?.includes(c.id))
      if (shopCosmetics.length > 0) {
        const prize = shopCosmetics[Math.floor(Math.random() * shopCosmetics.length)]
        const ownedCosmetics = [...(player.ownedCosmetics || []), prize.id]
        set({ player: { ...get().player!, ownedCosmetics } })
      }
    }
    addGold(goldFound)
    addXP(xpReward)
    const discoveredMaps = (player.discoveredMaps || []).filter(id => id !== mapId)
    set({ player: { ...get().player!, discoveredMaps } })
    const rarityMsg = `Treasure map "${map.name}" completed!`
    return { success: true, tokensFound, goldFound, xpReward, message: rarityMsg, durabilityCost: 0 }
  },

  // ── Cooperative ────────────────────────────────────────────────────────
  updateCooperativeSettings: (settings) => {
    const { player } = get()
    if (!player) return
    const cooperative = { ...player.settings.cooperative, ...settings }
    set({ player: { ...player, settings: { ...player.settings, cooperative } } })
  },
  setCoopSessionId: (sessionId) => {
    const { player } = get()
    if (!player) return
    set({ player: { ...player, cooperative: { ...player.cooperative, sessionId } } })
  },
  setCoopHost: (isHost) => {
    const { player } = get()
    if (!player) return
    set({ player: { ...player, cooperative: { ...player.cooperative, isHost } } })
  },
  addCoopPlayer: (playerData) => {
    const { player } = get()
    if (!player) return
    const players = [...player.cooperative.players.filter(p => p.id !== playerData.id), playerData]
    set({ player: { ...player, cooperative: { ...player.cooperative, players } } })
  },
  removeCoopPlayer: (playerId) => {
    const { player } = get()
    if (!player) return
    const players = player.cooperative.players.filter(p => p.id !== playerId)
    set({ player: { ...player, cooperative: { ...player.cooperative, players } } })
  },

  // ── Token Fishing Discovery ────────────────────────────────────────────
  getTokensFoundWhileFishing: () => {
    const { player } = get()
    return player?.tokensFoundWhileFishing || 0
  },

  // ── Secret Locations ──────────────────────────────────────────────────
  getDiscoveredSecrets: () => {
    const { player } = get()
    return player?.discoveredSecrets || []
  },

  getUndiscoveredSecrets: () => {
    const { player } = get()
    if (!player) return []
    const discovered = player.discoveredSecrets || []
    return LOCATIONS.filter(l => l.type === 'secret' && !discovered.includes(l.id))
  },

  canDiscoverSecret: (locationId) => {
    const { player, getTokenCount } = get()
    if (!player) return false
    const location = LOCATIONS.find(l => l.id === locationId && l.type === 'secret')
    if (!location || !location.requiredTokens) return false
    if (player.discoveredSecrets?.includes(locationId)) return false
    return location.requiredTokens.every(req => getTokenCount(req.tokenType) >= req.quantity)
  },

  discoverSecretLocation: (locationId) => {
    const { player, getTokenCount, addXP, addGold } = get()
    if (!player) return false
    const location = LOCATIONS.find(l => l.id === locationId && l.type === 'secret')
    if (!location || !location.requiredTokens) return false
    if (player.discoveredSecrets?.includes(locationId)) return false

    if (!location.requiredTokens.every(req => getTokenCount(req.tokenType) >= req.quantity)) return false

    // Remove required tokens
    const newInventory = [...player.inventory]
    for (const req of location.requiredTokens) {
      const idx = newInventory.findIndex(i => i.itemId === req.tokenType && i.type === 'token')
      if (idx >= 0) {
        newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity - req.quantity }
        if (newInventory[idx].quantity <= 0) newInventory.splice(idx, 1)
      }
    }

    const discoveredSecrets = [...(player.discoveredSecrets || []), locationId]

    // Grant discovery reward
    if (location.discoveryReward) {
      addGold(location.discoveryReward.gold)
      addXP(location.discoveryReward.xp)
    }

    set({ player: { ...player, inventory: newInventory, discoveredSecrets } })
    return true
  },

  // ── Generic Map Crafting from 10 Tokens ──────────────────────────────────
  canCraftMapFromTokens: () => {
    const { player } = get()
    if (!player) return false
    const totalTokens = player.inventory
      .filter(i => i.type === 'token')
      .reduce((sum, i) => sum + i.quantity, 0)
    return totalTokens >= 10
  },

  craftMapFromTokens: () => {
    const { player } = get()
    if (!player) return false
    if (!get().canCraftMapFromTokens()) return false

    // Take 10 tokens from inventory, prioritizing common tokens
    let tokensToRemove = 10
    const newInventory = [...player.inventory]
    const tokenItems = newInventory.filter(i => i.type === 'token').sort((a, b) => a.quantity - b.quantity)

    for (const item of tokenItems) {
      if (tokensToRemove <= 0) break
      const idx = newInventory.findIndex(i => i.id === item.id)
      if (idx < 0) continue
      const remove = Math.min(item.quantity, tokensToRemove)
      newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity - remove }
      tokensToRemove -= remove
      if (newInventory[idx].quantity <= 0) newInventory.splice(idx, 1)
    }

    // Award a random treasure map
    const mapPool = TREASURE_MAPS.filter(m => !player.discoveredMaps?.includes(m.id))
    const map = mapPool.length > 0
      ? mapPool[Math.floor(Math.random() * mapPool.length)]
      : TREASURE_MAPS[Math.floor(Math.random() * TREASURE_MAPS.length)]

    const discoveredMaps = [...(player.discoveredMaps || []), map.id]
    set({ player: { ...player, inventory: newInventory, discoveredMaps } })
    return true
  },

  // ── Inventory Capacity ──────────────────────────────────────────────────
  getInventoryCapacity: () => {
    const { player, getCurrentBoat } = get()
    if (!player) return 10
    const baseStorage = getCurrentBoat()?.storage ?? 10
    const cosmeticBonus = get().getCosmeticBonus('inventorySpace')
    return Math.floor(baseStorage + cosmeticBonus)
  },

  // ── Clan Management ────────────────────────────────────────────────────
  createClan: (name: string, tag: string, description: string, motto: string) => {
    const { player } = get()
    if (!player) return false
    if (player.clanId) return false
    if (player.gold < 500) return false

    const clan: Clan = {
      id: crypto.randomUUID(),
      name,
      tag,
      ownerId: player.id,
      members: [{
        playerId: player.id,
        playerName: player.name,
        role: 'owner',
        level: player.level,
        joinedAt: Date.now(),
        lastOnline: Date.now(),
        contribution: 0,
      }],
      level: 1,
      xp: 0,
      xpToNext: 500,
      goldBank: 0,
      description,
      createdAt: Date.now(),
      motto,
      allianceIds: [],
      stats: {
        totalFishCaught: 0,
        totalGoldEarned: 0,
        totalDistanceTraveled: 0,
        seaMonstersSlain: 0,
        competitionsWon: 0,
      },
    }

    set(state => ({
      player: { ...player, clanId: clan.id, gold: player.gold - 500 },
      clans: [...(state as any).clans || [], clan],
    }))
    return true
  },
  disbandClan: () => {
    const { player } = get()
    if (!player || !player.clanId) return false
    const clan = get().getClan()
    if (!clan || clan.ownerId !== player.id) return false

    const updatedPlayers = clan.members.filter(m => m.playerId !== player.id).map(m => m.playerId)
    set(state => ({
      player: { ...player, clanId: null },
      clans: (state as any).clans?.filter((c: Clan) => c.id !== player.clanId) || [],
    }))
    return true
  },
  inviteToClan: (playerName: string) => {
    const { player } = get()
    if (!player || !player.clanId) return false
    set({ player: { ...player, clanInvites: [...(player.clanInvites || []), playerName] } })
    return true
  },
  acceptClanInvite: (clanId: string) => {
    const { player } = get()
    if (!player || player.clanId) return false
    const invite = (player.clanInvites || []).find(i => i === clanId)
    if (!invite) return false
    set({
      player: {
        ...player,
        clanId,
        clanInvites: (player.clanInvites || []).filter(i => i !== clanId),
      },
    })
    return true
  },
  leaveClan: () => {
    const { player } = get()
    if (!player || !player.clanId) return false
    set({ player: { ...player, clanId: null } })
    return true
  },
  getClan: () => {
    const { player } = get()
    if (!player || !player.clanId) return null
    const state = get()
    return ((state as any).clans || []).find((c: Clan) => c.id === player.clanId) || null
  },
  kickFromClan: (playerId: string) => {
    const { player } = get()
    if (!player || !player.clanId) return false
    set(state => ({
      clans: (state as any).clans?.map((c: Clan) =>
        c.id === player.clanId
          ? { ...c, members: c.members.filter(m => m.playerId !== playerId) }
          : c
      ) || [],
    }))
    return true
  },
  promoteClanMember: (playerId: string) => {
    const { player } = get()
    if (!player || !player.clanId) return false
    set(state => ({
      clans: (state as any).clans?.map((c: Clan) =>
        c.id === player.clanId
          ? {
              ...c,
              members: c.members.map(m =>
                m.playerId === playerId
                  ? { ...m, role: m.role === 'member' ? 'officer' as const : 'officer' as const }
                  : m
              ),
            }
          : c
      ) || [],
    }))
    return true
  },
  contributeToClan: (amount: number) => {
    const { player, spendGold } = get()
    if (!player || !player.clanId) return false
    if (!spendGold(amount)) return false
    const state = get()
    const clans = (state as any).clans || []
    const clanIndex = clans.findIndex((c: Clan) => c.id === player.clanId)
    if (clanIndex < 0) return false
    const updatedClans = [...clans]
    updatedClans[clanIndex] = {
      ...updatedClans[clanIndex],
      goldBank: updatedClans[clanIndex].goldBank + amount,
      members: updatedClans[clanIndex].members.map((m: ClanMember) =>
        m.playerId === player.id ? { ...m, contribution: m.contribution + amount } : m
      ),
    }
    set({ clans: updatedClans } as any)
    return true
  },
  addClanXP: (amount: number) => {
    const state = get()
    const clans = (state as any).clans || []
    const clan = state.player?.clanId ? clans.find((c: Clan) => c.id === state.player!.clanId) : null
    if (!clan) return
    const newXP = clan.xp + amount
    let newLevel = clan.level
    let xpToNext = clan.xpToNext
    while (newXP >= xpToNext) {
      newLevel++
      xpToNext = Math.floor(xpToNext * 1.5)
    }
    const updatedClans = clans.map((c: Clan) =>
      c.id === clan.id ? { ...c, xp: newXP, level: newLevel, xpToNext } : c
    )
    set({ clans: updatedClans } as any)
  },
  getClanMemberCount: () => {
    const clan = get().getClan()
    return clan?.members.length || 0
  },

  // ── Cosmetic Token Redemption ────────────────────────────────────────────
  getRedeemableCosmetics: () => {
    const { player } = get()
    if (!player) return []
    return COSMETICS.filter(c => c.availableInShop && !player.ownedCosmetics?.includes(c.id) && c.price <= 0)
  },
  redeemCosmeticToken: () => {
    const { player } = get()
    if (!player) return null
    const tokenItem = player.inventory.find(i => i.itemId === 'cosmetic_token' && i.type === 'token')
    if (!tokenItem || tokenItem.quantity < 1) return null

    const unownedCosmetics = COSMETICS.filter(c => c.availableInShop && !player.ownedCosmetics?.includes(c.id))
    if (unownedCosmetics.length === 0) return null

    const prize = unownedCosmetics[Math.floor(Math.random() * unownedCosmetics.length)]

    const newInventory = [...player.inventory]
    const idx = newInventory.findIndex(i => i.itemId === 'cosmetic_token' && i.type === 'token')
    if (idx >= 0) {
      newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity - 1 }
      if (newInventory[idx].quantity <= 0) newInventory.splice(idx, 1)
    }

    const ownedCosmetics = [...(player.ownedCosmetics || []), prize.id]
    set({ player: { ...player, inventory: newInventory, ownedCosmetics } })
    return prize.id
  },

  // ── Chat System ──────────────────────────────────────────────────────────
  sendWorldMessage: (content: string) => {
    const { player } = get()
    if (!player || !content.trim()) return
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      channel: 'world',
      type: 'player',
      senderId: player.id,
      senderName: player.name,
      content: content.trim(),
      timestamp: Date.now(),
    }
    const chat = player.chat
    const messages = [...chat.worldMessages, msg].slice(-chat.maxMessages)
    set({ player: { ...player, chat: { ...chat, worldMessages: messages } } })
  },
  sendClanMessage: (content: string) => {
    const { player } = get()
    if (!player || !content.trim()) return
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      channel: 'clan',
      type: 'player',
      senderId: player.id,
      senderName: player.name,
      content: content.trim(),
      timestamp: Date.now(),
    }
    const chat = player.chat
    const messages = [...chat.clanMessages, msg].slice(-chat.maxMessages)
    set({ player: { ...player, chat: { ...chat, clanMessages: messages } } })
  },
  sendPrivateMessage: (recipientId: string, recipientName: string, content: string) => {
    const { player } = get()
    if (!player || !content.trim()) return
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      channel: 'private',
      type: 'private',
      senderId: player.id,
      senderName: player.name,
      content: content.trim(),
      timestamp: Date.now(),
      recipientId,
      recipientName,
    }
    const chat = player.chat
    const existing = chat.privateMessages[recipientId] || []
    const messages = [...existing, msg].slice(-chat.maxMessages)
    set({
      player: {
        ...player,
        chat: {
          ...chat,
          privateMessages: { ...chat.privateMessages, [recipientId]: messages },
        },
      },
    })
  },
  addSystemMessage: (channel: ChatChannel, content: string) => {
    const { player } = get()
    if (!player) return
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      channel,
      type: 'system',
      senderId: 'system',
      senderName: 'System',
      content,
      timestamp: Date.now(),
    }
    const chat = player.chat
    if (channel === 'world') {
      const messages = [...chat.worldMessages, msg].slice(-chat.maxMessages)
      set({ player: { ...player, chat: { ...chat, worldMessages: messages } } })
    } else if (channel === 'clan') {
      const messages = [...chat.clanMessages, msg].slice(-chat.maxMessages)
      set({ player: { ...player, chat: { ...chat, clanMessages: messages } } })
    }
  },
  clearChat: (channel: ChatChannel, otherPlayerId?: string) => {
    const { player } = get()
    if (!player) return
    const chat = player.chat
    if (channel === 'private' && otherPlayerId) {
      const pm = { ...chat.privateMessages, [otherPlayerId]: [] }
      set({ player: { ...player, chat: { ...chat, privateMessages: pm } } })
    } else if (channel === 'world') {
      set({ player: { ...player, chat: { ...chat, worldMessages: [] } } })
    } else if (channel === 'clan') {
      set({ player: { ...player, chat: { ...chat, clanMessages: [] } } })
    }
  },
  markChatRead: (channel: ChatChannel, otherPlayerId?: string) => {
    const { player } = get()
    if (!player) return
    const chat = player.chat
    if (channel === 'world') {
      set({ player: { ...player, chat: { ...chat, unreadWorld: 0 } } })
    } else if (channel === 'clan') {
      set({ player: { ...player, chat: { ...chat, unreadClan: 0 } } })
    } else if (channel === 'private' && otherPlayerId) {
      const up = { ...chat.unreadPrivate, [otherPlayerId]: 0 }
      set({ player: { ...player, chat: { ...chat, unreadPrivate: up } } })
    }
  },
  getChatMessages: (channel: ChatChannel, otherPlayerId?: string) => {
    const { player } = get()
    if (!player) return []
    const chat = player.chat
    if (channel === 'world') return chat.worldMessages
    if (channel === 'clan') return chat.clanMessages
    if (channel === 'private' && otherPlayerId) return chat.privateMessages[otherPlayerId] || []
    return []
  },
}))
