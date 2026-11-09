import { FISH_SPECIES, getTimeOfDayFromHour, TOKEN_TYPES } from './types'
import type { FishSpecies, FishingMiniGame, FishOnLine, TimeOfDay, WeatherType, FishingState, TokenType } from './types'

export function selectFishSpecies(
  timeOfDay: TimeOfDay,
  weather: WeatherType,
  toolMethod: string,
  playerLevel: number,
  cosmeticRareBonus: number = 0,
  cosmeticLegendaryBonus: number = 0,
  cosmeticMythicalBonus: number = 0,
): FishSpecies | null {
  const candidates = FISH_SPECIES.filter((fish) => {
    const methodMatch = fish.methods.includes(toolMethod as any)
    let levelMatch = fish.rarity === 'common' ||
      (fish.rarity === 'uncommon' && playerLevel >= 3) ||
      (fish.rarity === 'rare' && playerLevel >= 8) ||
      (fish.rarity === 'legendary' && playerLevel >= 15) ||
      (fish.rarity === 'mythical' && playerLevel >= 20)
    // Cosmetics can reduce level requirements for higher rarity
    if (!levelMatch) {
      if (fish.rarity === 'rare' && cosmeticRareBonus > 0 && playerLevel >= 5) levelMatch = true
      if (fish.rarity === 'legendary' && cosmeticLegendaryBonus > 0 && playerLevel >= 10) levelMatch = true
      if (fish.rarity === 'mythical' && cosmeticMythicalBonus > 0 && playerLevel >= 15) levelMatch = true
    }
    return methodMatch && levelMatch
  })

  if (candidates.length === 0) {
    const fallback = FISH_SPECIES.filter((f) => f.methods.includes(toolMethod as any))
    if (fallback.length === 0) return null
    return fallback[Math.floor(Math.random() * fallback.length)]
  }

  const weights = candidates.map((fish) => {
    let weight = 1
    if (fish.rarity === 'common') weight = 5
    else if (fish.rarity === 'uncommon') weight = 3
    else if (fish.rarity === 'rare') weight = 1.5 + cosmeticRareBonus * 10
    else if (fish.rarity === 'legendary') weight = 0.5 + cosmeticLegendaryBonus * 10
    else if (fish.rarity === 'mythical') weight = 0.2 + cosmeticMythicalBonus * 10
    return weight
  })

  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i]
    if (random <= 0) return candidates[i]
  }

  return candidates[0]
}

export function startFishingCast(fishing: FishingMiniGame): FishingMiniGame {
  return {
    ...fishing,
    state: 'casting',
    castPower: 0,
    castDirection: 0,
    lineTension: 0,
    fishOnLine: null,
    reelProgress: 0,
    reelSpeed: 0,
    fishStruggle: 0,
    timer: 0,
    combo: fishing.state === 'caught' ? fishing.combo + 1 : 0,
    perfectReels: 0,
  }
}

export function updateFishingCast(
  fishing: FishingMiniGame,
  delta: number,
  holdingSpace: boolean
): FishingMiniGame {
  if (fishing.state !== 'casting') return fishing

  let newPower = fishing.castPower + delta * 80

  if (newPower >= 100) {
    newPower = 100
    return releaseFishingCast(fishing, newPower)
  }

  if (!holdingSpace && newPower > 10) {
    return releaseFishingCast(fishing, newPower)
  }

  return {
    ...fishing,
    castPower: newPower,
    castDirection: Math.sin(Date.now() * 0.003) * 30,
  }
}

function releaseFishingCast(fishing: FishingMiniGame, power: number): FishingMiniGame {
  return {
    ...fishing,
    state: 'waiting',
    castPower: power,
    timer: 3 + Math.random() * 5,
  }
}

export function updateFishingWait(
  fishing: FishingMiniGame,
  delta: number,
  playerLevel: number
): FishingMiniGame {
  if (fishing.state !== 'waiting') return fishing

  const newTimer = fishing.timer - delta

  if (newTimer <= 0) {
    return {
      ...fishing,
      state: 'bite',
      timer: 2,
    }
  }

  return {
    ...fishing,
    timer: newTimer,
  }
}

export function startReelingFishing(fishing: FishingMiniGame, species: FishSpecies): FishingMiniGame {
  const fightStrength = species.rarity === 'mythical' ? 2 : species.rarity === 'legendary' ? 1.5 : species.rarity === 'rare' ? 1 : 0.5
  const fishOnLine: FishOnLine = {
    speciesId: species.id,
    weight: species.weight * (0.8 + Math.random() * 0.4),
    strength: fightStrength,
    strugglePattern: Math.random() * Math.PI * 2,
    escapeChance: 0.05,
    fatigue: 0,
  }

  return {
    ...fishing,
    state: 'reeling',
    fishOnLine,
    reelProgress: 0,
    reelSpeed: 0,
    fishStruggle: 0,
    lineTension: 0,
    timer: 30 + fightStrength * 30,
    maxTimer: 30 + fightStrength * 30,
  }
}

export function updateFishingReeling(
  fishing: FishingMiniGame,
  delta: number,
  isReeling: boolean,
  toolEfficiency: number
): FishingMiniGame {
  if (fishing.state !== 'reeling' && fishing.state !== 'fighting') return fishing
  if (!fishing.fishOnLine) return fishing

  const fish = fishing.fishOnLine
  const struggleIntensity = fish.strength * (1 - fish.fatigue * 0.5)
  const struggleValue = Math.sin(fish.strugglePattern) * struggleIntensity * 50

  fish.strugglePattern += delta * (1 + fish.strength * 2)
  fish.fatigue = Math.min(1, fish.fatigue + delta * 0.02)

  let newReelProgress = fishing.reelProgress
  let newLineTension = fishing.lineTension

  if (isReeling) {
    const reelAmount = delta * 15 * toolEfficiency * (1 - fish.fatigue * 0.3)
    newReelProgress += reelAmount
    newLineTension += delta * 30 * fish.strength
  }

  newLineTension += struggleValue * delta
  newLineTension = Math.max(0, Math.min(fishing.maxTension, newLineTension))

  const newState = newLineTension > fishing.maxTension * 0.8 ? 'fighting' : 'reeling'

  if (newLineTension >= fishing.maxTension) {
    return {
      ...fishing,
      state: 'escaped',
      lineTension: fishing.maxTension,
      timer: 0,
    }
  }

  if (fishing.timer <= 0) {
    if (newReelProgress >= 100) {
      return {
        ...fishing,
        state: 'caught',
        reelProgress: 100,
        timer: 0,
      }
    }
    return {
      ...fishing,
      state: 'escaped',
      timer: 0,
    }
  }

  if (newReelProgress >= 100) {
    const wasPerfect = fishing.lineTension > 30 && fishing.lineTension < 70
    return {
      ...fishing,
      state: 'caught',
      reelProgress: 100,
      perfectReels: wasPerfect ? fishing.perfectReels + 1 : fishing.perfectReels,
      timer: 0,
    }
  }

  return {
    ...fishing,
    state: newState,
    reelProgress: newReelProgress,
    lineTension: newLineTension,
    fishStruggle: struggleValue,
    fishOnLine: fish,
    timer: fishing.timer - delta,
  }
}

export function resetFishingGame(fishing: FishingMiniGame): FishingMiniGame {
  return {
    state: 'idle',
    castPower: 0,
    castDirection: 0,
    lineTension: 0,
    maxTension: 100,
    fishOnLine: null,
    reelProgress: 0,
    reelSpeed: 0,
    fishStruggle: 0,
    timer: 0,
    maxTimer: 60,
    combo: fishing.state === 'caught' ? fishing.combo : 0,
    perfectReels: 0,
  }
}

export function calculateFishingReward(
  species: FishSpecies,
  combo: number,
  perfectReels: number,
  weather: WeatherType
): { gold: number; xp: number; bonusGold: number; bonusXp: number } {
  let gold = species.baseValue
  let xp = Math.floor(species.baseValue * 0.5)

  let bonusGold = 0
  let bonusXp = 0

  const comboMultiplier = 1 + combo * 0.1
  const perfectMultiplier = 1 + perfectReels * 0.15
  const weatherMultiplier = weather === 'storm' || weather === 'blizzard' ? 1.5 : 1

  const totalMultiplier = comboMultiplier * perfectMultiplier * weatherMultiplier

  bonusGold = Math.floor(gold * (totalMultiplier - 1))
  bonusXp = Math.floor(xp * (totalMultiplier - 1))

  gold = Math.floor(gold * totalMultiplier)
  xp = Math.floor(xp * totalMultiplier)

  return { gold, xp, bonusGold, bonusXp }
}

export function getBiteChance(timeOfDay: TimeOfDay, weather: WeatherType, playerLevel: number): number {
  let baseChance = 0.3

  const timeBonus: Record<TimeOfDay, number> = {
    dawn: 0.15,
    day: 0,
    dusk: 0.1,
    night: 0.05,
  }

  const weatherBonus: Record<WeatherType, number> = {
    clear: 0,
    cloudy: 0.05,
    rain: 0.1,
    snow: -0.05,
    fog: 0,
    storm: -0.15,
    blizzard: -0.3,
    aurora: 0.2,
    whiteout: -0.5,
    hail: -0.2,
    thunderstorm: -0.25,
    mist: 0.15,
    heatwave: -0.1,
    polar_night: 0.1,
    magnetic_storm: -0.2,
    hurricane: -0.6,
    tornado: -0.7,
    tsunami: -0.5,
    volcanic_ash: -0.3,
    meteor_shower: 0.4,
    blood_moon: 0.35,
    supercell: -0.45,
    ice_storm: -0.3,
    rogue_wave: -0.4,
  }

  baseChance += timeBonus[timeOfDay]
  baseChance += weatherBonus[weather]
  baseChance += playerLevel * 0.01

  return Math.max(0.05, Math.min(0.8, baseChance))
}

// ─── Token Discovery While Fishing ────────────────────────────────────────
export interface TokenDiscoveryResult {
  foundToken: boolean
  tokenType?: TokenType
  tokenName?: string
  tokenIcon?: string
}

export const FISHING_TOKEN_WEIGHTS: Record<string, number> = {
  ancient_coin: 30,
  coral_gem: 20,
  pearl_fragment: 18,
  driftwood_charm: 25,
  ice_crystal: 12,
  sea_shell: 22,
  tide_stone: 10,
  whale_bone: 5,
  viking_rune: 6,
  siren_tear: 3,
  leviathan_scale: 2,
  abyssal_core: 1,
  cosmetic_token: 1,
}

export const FISHING_TOKEN_RARITIES: Record<string, string> = {
  ancient_coin: 'common',
  coral_gem: 'uncommon',
  pearl_fragment: 'uncommon',
  driftwood_charm: 'common',
  ice_crystal: 'rare',
  sea_shell: 'common',
  tide_stone: 'rare',
  whale_bone: 'legendary',
  viking_rune: 'rare',
  siren_tear: 'legendary',
  leviathan_scale: 'legendary',
  abyssal_core: 'legendary',
  cosmetic_token: 'legendary',
}

export function rollForTokenWhileFishing(
  rarity: string,
  weather: WeatherType,
  fishingToolEfficiency: number,
  cosmeticBonus: number,
): TokenDiscoveryResult {
  // Base chance: higher for rarer fish
  const baseChanceMap: Record<string, number> = {
    common: 0.05,
    uncommon: 0.08,
    rare: 0.15,
    legendary: 0.25,
    mythical: 0.40,
  }
  let chance = baseChanceMap[rarity] || 0.05
  chance *= fishingToolEfficiency
  chance *= (1 + cosmeticBonus)
  // Weather bonus: better in aurora, worse in storm
  const weatherMultMap: Record<string, number> = {
    clear: 1.0, cloudy: 1.1, rain: 1.2, snow: 0.9,
    fog: 1.3, storm: 0.6, blizzard: 0.8, aurora: 2.0,
    whiteout: 1.5, hail: 0.7, thunderstorm: 0.5,
    mist: 1.4, heatwave: 0.8, polar_night: 1.6, magnetic_storm: 1.8,
    hurricane: 2.5, tornado: 3.0, tsunami: 2.0,
    volcanic_ash: 1.2, meteor_shower: 3.5, blood_moon: 2.8,
    supercell: 1.8, ice_storm: 1.5, rogue_wave: 2.2,
    dawn: 1.0, day: 1.0, dusk: 1.0, night: 1.0,
  }
  chance *= (weatherMultMap[weather] || 1.0)

  if (Math.random() > chance) return { foundToken: false }

  // Roll which token
  const roll = Math.random() * 100
  let cumulative = 0
  const entries = Object.entries(FISHING_TOKEN_WEIGHTS)
  for (const [tokenType, weight] of entries) {
    cumulative += weight
    if (roll <= cumulative) {
      return {
        foundToken: true,
        tokenType: tokenType as TokenType,
        tokenName: tokenType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tokenIcon: getTokenIcon(tokenType),
      }
    }
  }
  return { foundToken: false }
}

function getTokenIcon(tokenType: string): string {
  const token = TOKEN_TYPES[tokenType as TokenType]
  return token?.icon || '🎁'
}
