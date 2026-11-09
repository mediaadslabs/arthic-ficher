// Game Types for Arctic Fisher

export type GameState = 'menu' | 'playing' | 'paused' | 'loading' | 'saving'

export interface Position {
  x: number
  y: number
  z: number
}

export interface Rotation {
  x: number
  y: number
  z: number
}

// Boat Types
export type BoatTier = 'dinghy' | 'trawler' | 'cutter' | 'vessel' | 'icebreaker'

export interface BoatUpgrade {
  id: string
  name: string
  description: string
  tier: number
  maxTier: number
  cost: number
  effect: {
    type: 'speed' | 'storage' | 'durability' | 'radar' | 'crane'
    value: number
  }
}

export interface Boat {
  id: string
  tier: BoatTier
  name: string
  description: string
  speed: number
  baseSpeed: number
  storage: number
  baseStorage: number
  durability: number
  maxDurability: number
  cost: number
  requiredLevel: number
  upgrades: {
    engine: number
    hull: number
    storage: number
    radar: number
    crane: number
    lucky_charm: number
    ice_plow: number
    night_vision: number
    autopilot: number
    refrigeration: number
  }
  position: Position
  rotation: Rotation
}

export const BOAT_CONFIGS: Record<BoatTier, Omit<Boat, 'id' | 'position' | 'rotation' | 'upgrades'>> = {
  dinghy: {
    tier: 'dinghy',
    name: 'Wooden Dinghy',
    description: 'A small but reliable starter boat',
    speed: 5,
    baseSpeed: 5,
    storage: 10,
    baseStorage: 10,
    durability: 100,
    maxDurability: 100,
    cost: 100,
    requiredLevel: 1,
  },
  trawler: {
    tier: 'trawler',
    name: 'Fishing Trawler',
    description: 'A sturdy boat for serious fishing',
    speed: 8,
    baseSpeed: 8,
    storage: 30,
    baseStorage: 30,
    durability: 200,
    maxDurability: 200,
    cost: 500,
    requiredLevel: 5,
  },
  cutter: {
    tier: 'cutter',
    name: 'Arctic Cutter',
    description: 'Built for harsh arctic conditions',
    speed: 12,
    baseSpeed: 12,
    storage: 60,
    baseStorage: 60,
    durability: 350,
    maxDurability: 350,
    cost: 2000,
    requiredLevel: 15,
  },
  vessel: {
    tier: 'vessel',
    name: 'Arctic Vessel',
    description: 'The ultimate fishing machine',
    speed: 15,
    baseSpeed: 15,
    storage: 100,
    baseStorage: 100,
    durability: 500,
    maxDurability: 500,
    cost: 5000,
    requiredLevel: 25,
  },
  icebreaker: {
    tier: 'icebreaker',
    name: 'Polar Icebreaker',
    description: 'A massive ship that can crush through ice to reach untouched waters',
    speed: 18,
    baseSpeed: 18,
    storage: 200,
    baseStorage: 200,
    durability: 1000,
    maxDurability: 1000,
    cost: 15000,
    requiredLevel: 40,
  },
}

// Fishing Types
export type FishingMethod = 'rod' | 'trap' | 'net' | 'trawl'

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'

export interface FishSpecies {
  id: string
  name: string
  description: string
  rarity: RarityTier
  baseValue: number
  weight: number
  methods: FishingMethod[]
  minDepth: number
  maxDepth: number
}

export const FISH_SPECIES: FishSpecies[] = [
  {
    id: 'arctic_cod',
    name: 'Arctic Cod',
    description: 'A common cold-water fish',
    rarity: 'common',
    baseValue: 5,
    weight: 1,
    methods: ['rod', 'net', 'trawl'],
    minDepth: 0,
    maxDepth: 50,
  },
  {
    id: 'halibut',
    name: 'Halibut',
    description: 'A large flatfish prized for its meat',
    rarity: 'uncommon',
    baseValue: 15,
    weight: 5,
    methods: ['rod', 'trawl'],
    minDepth: 20,
    maxDepth: 100,
  },
  {
    id: 'king_crab',
    name: 'King Crab',
    description: 'The king of arctic seafood',
    rarity: 'rare',
    baseValue: 50,
    weight: 3,
    methods: ['trap'],
    minDepth: 30,
    maxDepth: 150,
  },
  {
    id: 'snow_crab',
    name: 'Snow Crab',
    description: 'Delicate and delicious',
    rarity: 'uncommon',
    baseValue: 25,
    weight: 2,
    methods: ['trap'],
    minDepth: 20,
    maxDepth: 100,
  },
  {
    id: 'arctic_char',
    name: 'Arctic Char',
    description: 'A beautiful salmonid fish',
    rarity: 'uncommon',
    baseValue: 20,
    weight: 2,
    methods: ['rod', 'net'],
    minDepth: 0,
    maxDepth: 30,
  },
  {
    id: 'giant_octopus',
    name: 'Giant Pacific Octopus',
    description: 'A massive intelligent creature',
    rarity: 'legendary',
    baseValue: 200,
    weight: 15,
    methods: ['trap', 'trawl'],
    minDepth: 50,
    maxDepth: 200,
  },
  {
    id: 'salmon',
    name: 'Arctic Salmon',
    description: 'Rich in omega-3 fatty acids',
    rarity: 'common',
    baseValue: 10,
    weight: 3,
    methods: ['rod', 'net'],
    minDepth: 0,
    maxDepth: 40,
  },
  {
    id: 'wolffish',
    name: 'Atlantic Wolffish',
    description: 'A fierce-looking delicacy',
    rarity: 'rare',
    baseValue: 40,
    weight: 4,
    methods: ['rod', 'trawl'],
    minDepth: 40,
    maxDepth: 120,
  },
  {
    id: 'greenland_shark',
    name: 'Greenland Shark',
    description: 'An ancient deep-sea predator living 400+ years',
    rarity: 'legendary',
    baseValue: 350,
    weight: 20,
    methods: ['trawl', 'trap'],
    minDepth: 100,
    maxDepth: 300,
  },
  {
    id: 'narwhal_tusk',
    name: 'Narwhal Tusk Fragment',
    description: 'A rare fragment from the unicorn of the sea',
    rarity: 'mythical',
    baseValue: 800,
    weight: 5,
    methods: ['trap'],
    minDepth: 150,
    maxDepth: 400,
  },
  {
    id: 'lumpfish',
    name: 'Lumpfish',
    description: 'A round, colorful fish with sticky fins',
    rarity: 'common',
    baseValue: 8,
    weight: 1,
    methods: ['rod', 'net'],
    minDepth: 0,
    maxDepth: 30,
  },
  {
    id: 'redfish',
    name: 'Ocean Perch',
    description: 'A vibrant red fish found in deep waters',
    rarity: 'uncommon',
    baseValue: 18,
    weight: 2,
    methods: ['rod', 'trawl'],
    minDepth: 50,
    maxDepth: 150,
  },
  {
    id: 'capelin',
    name: 'Capelin',
    description: 'Small but abundant forage fish',
    rarity: 'common',
    baseValue: 3,
    weight: 0.5,
    methods: ['net', 'trawl'],
    minDepth: 0,
    maxDepth: 20,
  },
  {
    id: 'skate',
    name: 'Arctic Skate',
    description: 'A flat, ray-like fish with camouflaged skin',
    rarity: 'uncommon',
    baseValue: 22,
    weight: 4,
    methods: ['trawl', 'net'],
    minDepth: 30,
    maxDepth: 80,
  },
  {
    id: 'blue_whale_shrimp',
    name: 'Arctic Shrimp',
    description: 'Tiny but incredibly valuable crustaceans',
    rarity: 'rare',
    baseValue: 60,
    weight: 0.2,
    methods: ['trawl'],
    minDepth: 80,
    maxDepth: 200,
  },
  {
    id: 'kraken_tentacle',
    name: 'Kraken Tentacle',
    description: 'A mysterious appendage from the deep',
    rarity: 'mythical',
    baseValue: 1200,
    weight: 25,
    methods: ['trap'],
    minDepth: 200,
    maxDepth: 500,
  },
  {
    id: 'anglerfish',
    name: 'Deep Sea Angler',
    description: 'A bizarre fish with a glowing lure',
    rarity: 'rare',
    baseValue: 45,
    weight: 2,
    methods: ['trap', 'trawl'],
    minDepth: 100,
    maxDepth: 250,
  },
  {
    id: 'sea_cucumber',
    name: 'Arctic Sea Cucumber',
    description: 'A delicacy in Asian cuisine, found in cold depths',
    rarity: 'uncommon',
    baseValue: 30,
    weight: 1,
    methods: ['trap', 'trawl'],
    minDepth: 50,
    maxDepth: 150,
  },
  {
    id: 'sperm_ambergris',
    name: 'Ambergris Chunk',
    description: 'Rare whale product worth its weight in gold',
    rarity: 'mythical',
    baseValue: 1500,
    weight: 3,
    methods: ['trawl'],
    minDepth: 150,
    maxDepth: 400,
  },
  {
    id: 'polar_cod',
    name: 'Polar Cod',
    description: 'The key species of the arctic food chain',
    rarity: 'common',
    baseValue: 6,
    weight: 0.8,
    methods: ['rod', 'net', 'trawl'],
    minDepth: 0,
    maxDepth: 40,
  },
  {
    id: 'atlantic_halibut',
    name: 'Atlantic Halibut',
    description: 'One of the largest flatfish species',
    rarity: 'rare',
    baseValue: 55,
    weight: 8,
    methods: ['rod', 'trawl'],
    minDepth: 50,
    maxDepth: 200,
  },
  {
    id: 'blobfish',
    name: 'Arctic Blobfish',
    description: 'A gelatinous deep-sea oddity',
    rarity: 'legendary',
    baseValue: 250,
    weight: 1,
    methods: ['trawl'],
    minDepth: 200,
    maxDepth: 500,
  },
  // New fish species - expanded variety
  {
    id: 'icefish',
    name: 'Antarctic Icefish',
    description: 'A transparent fish with antifreeze proteins in its blood',
    rarity: 'rare',
    baseValue: 48,
    weight: 1.5,
    methods: ['rod', 'trawl'],
    minDepth: 60,
    maxDepth: 180,
  },
  {
    id: 'haddock',
    name: 'Haddock',
    description: 'A popular food fish found in cold waters',
    rarity: 'common',
    baseValue: 7,
    weight: 2,
    methods: ['rod', 'net', 'trawl'],
    minDepth: 10,
    maxDepth: 60,
  },
  {
    id: 'ling',
    name: 'Ling',
    description: 'A long, eel-like fish prized in Nordic cuisine',
    rarity: 'uncommon',
    baseValue: 24,
    weight: 4,
    methods: ['rod', 'trawl'],
    minDepth: 40,
    maxDepth: 120,
  },
  {
    id: 'red_king_crab',
    name: 'Red King Crab',
    description: 'The largest and most valuable crab species',
    rarity: 'legendary',
    baseValue: 280,
    weight: 8,
    methods: ['trap'],
    minDepth: 80,
    maxDepth: 250,
  },
  {
    id: 'monkfish',
    name: 'Monkfish',
    description: 'An ugly but delicious bottom-dwelling predator',
    rarity: 'uncommon',
    baseValue: 28,
    weight: 5,
    methods: ['trawl', 'rod'],
    minDepth: 50,
    maxDepth: 150,
  },
  {
    id: 'sablefish',
    name: 'Sablefish (Black Cod)',
    description: 'Rich, buttery fish highly valued in sushi',
    rarity: 'rare',
    baseValue: 52,
    weight: 3,
    methods: ['rod', 'trawl'],
    minDepth: 80,
    maxDepth: 200,
  },
  {
    id: 'leopard_seal_tooth',
    name: 'Leopard Seal Tooth',
    description: 'A rare trophy from the apex predator of the south',
    rarity: 'mythical',
    baseValue: 900,
    weight: 0.3,
    methods: ['trap'],
    minDepth: 100,
    maxDepth: 350,
  },
  {
    id: 'sea_angel',
    name: 'Sea Angel',
    description: 'A tiny, translucent mollusk that looks like an angel',
    rarity: 'rare',
    baseValue: 42,
    weight: 0.1,
    methods: ['net', 'trawl'],
    minDepth: 30,
    maxDepth: 100,
  },
  {
    id: 'coelacanth_scale',
    name: 'Coelacanth Scale',
    description: 'A living fossil scale from the deep abyss',
    rarity: 'mythical',
    baseValue: 2000,
    weight: 0.5,
    methods: ['trawl'],
    minDepth: 300,
    maxDepth: 600,
  },
  {
    id: 'mackerel',
    name: 'Atlantic Mackerel',
    description: 'A fast, striped fish with rich oily meat',
    rarity: 'common',
    baseValue: 4,
    weight: 1,
    methods: ['rod', 'net'],
    minDepth: 0,
    maxDepth: 30,
  },
  {
    id: 'tusk',
    name: 'Tusk (Cusk)',
    description: 'A deep-water relative of the cod family',
    rarity: 'uncommon',
    baseValue: 20,
    weight: 6,
    methods: ['rod', 'trawl'],
    minDepth: 60,
    maxDepth: 180,
  },
  {
    id: 'giant_isopod',
    name: 'Giant Isopod',
    description: 'A massive deep-sea scavenger resembling a pill bug',
    rarity: 'legendary',
    baseValue: 180,
    weight: 2,
    methods: ['trap', 'trawl'],
    minDepth: 200,
    maxDepth: 500,
  },
  {
    id: 'yeti_crab',
    name: 'Yeti Crab',
    description: 'A mysterious hairy crab found near hydrothermal vents',
    rarity: 'mythical',
    baseValue: 1800,
    weight: 1,
    methods: ['trap'],
    minDepth: 400,
    maxDepth: 700,
  },
]

export interface FishingTool {
  id: string
  name: string
  description: string
  method: FishingMethod
  efficiency: number
  durability: number
  maxDurability: number
  cost: number
  requiredLevel: number
  enchantments?: ToolEnchantment[]
}

export interface ToolEnchantment {
  id: string
  name: string
  description: string
  effect: { type: 'efficiency' | 'durability' | 'rare_chance' | 'legendary_chance' | 'quantity' | 'depth'; value: number }
  icon: string
}

export const FISHING_TOOLS: FishingTool[] = [
  {
    id: 'basic_rod',
    name: 'Basic Fishing Rod',
    description: 'A simple rod for beginners',
    method: 'rod',
    efficiency: 1,
    durability: 50,
    maxDurability: 50,
    cost: 25,
    requiredLevel: 1,
  },
  {
    id: 'pro_rod',
    name: 'Professional Rod',
    description: 'High-quality rod for experienced fishers',
    method: 'rod',
    efficiency: 2,
    durability: 100,
    maxDurability: 100,
    cost: 150,
    requiredLevel: 8,
  },
  {
    id: 'carbon_rod',
    name: 'Carbon Fiber Rod',
    description: 'Ultra-light rod with maximum sensitivity',
    method: 'rod',
    efficiency: 3,
    durability: 150,
    maxDurability: 150,
    cost: 500,
    requiredLevel: 20,
  },
  {
    id: 'crab_trap',
    name: 'Crab Trap',
    description: 'Standard trap for catching crabs',
    method: 'trap',
    efficiency: 1,
    durability: 30,
    maxDurability: 30,
    cost: 75,
    requiredLevel: 3,
  },
  {
    id: 'pro_trap',
    name: 'Professional Crab Pot',
    description: 'Large capacity trap for serious crabbing',
    method: 'trap',
    efficiency: 2.5,
    durability: 60,
    maxDurability: 60,
    cost: 300,
    requiredLevel: 12,
  },
  {
    id: 'deep_trap',
    name: 'Deep Sea Trap',
    description: 'Reinforced trap for abyssal creatures',
    method: 'trap',
    efficiency: 4,
    durability: 100,
    maxDurability: 100,
    cost: 800,
    requiredLevel: 25,
  },
  {
    id: 'cast_net',
    name: 'Cast Net',
    description: 'Catch multiple fish at once',
    method: 'net',
    efficiency: 1.5,
    durability: 40,
    maxDurability: 40,
    cost: 100,
    requiredLevel: 5,
  },
  {
    id: 'trawl_net',
    name: 'Trawl Net',
    description: 'Large net for deep-sea trawling',
    method: 'trawl',
    efficiency: 3,
    durability: 80,
    maxDurability: 80,
    cost: 500,
    requiredLevel: 15,
  },
  {
    id: 'sonar_net',
    name: 'Sonar-Guided Net',
    description: 'Smart net that targets specific species',
    method: 'trawl',
    efficiency: 5,
    durability: 120,
    maxDurability: 120,
    cost: 1200,
    requiredLevel: 30,
  },
]

// Treasure Hunting & Token Types
export type TokenType = 'ancient_coin' | 'coral_gem' | 'pearl_fragment' | 'driftwood_charm' | 'ice_crystal' | 'sea_shell' | 'tide_stone' | 'whale_bone' | 'viking_rune' | 'siren_tear' | 'leviathan_scale' | 'abyssal_core' | 'cosmetic_token'
export type CraftableType = 'tool_upgrade' | 'boat_upgrade' | 'special_tool' | 'treasure_map'

export interface Token {
  id: string
  type: TokenType
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  icon: string
}

export const TOKEN_TYPES: Record<TokenType, Omit<Token, 'id'>> = {
  ancient_coin: {
    type: 'ancient_coin',
    name: 'Ancient Coin',
    description: 'A weathered coin from a forgotten civilization',
    rarity: 'common',
    icon: '🪙',
  },
  coral_gem: {
    type: 'coral_gem',
    name: 'Coral Gem',
    description: 'A precious gem formed from deep sea coral',
    rarity: 'uncommon',
    icon: '💎',
  },
  pearl_fragment: {
    type: 'pearl_fragment',
    name: 'Pearl Fragment',
    description: 'A piece of a massive pearl, shimmering with iridescence',
    rarity: 'uncommon',
    icon: '🔮',
  },
  driftwood_charm: {
    type: 'driftwood_charm',
    name: 'Driftwood Charm',
    description: 'Carved driftwood with ancient markings',
    rarity: 'common',
    icon: '🪵',
  },
  ice_crystal: {
    type: 'ice_crystal',
    name: 'Ice Crystal',
    description: 'A永不-melting crystal from arctic depths',
    rarity: 'rare',
    icon: '❄️',
  },
  sea_shell: {
    type: 'sea_shell',
    name: 'Enchanted Shell',
    description: 'A shell that whispers secrets of the ocean',
    rarity: 'common',
    icon: '🐚',
  },
  tide_stone: {
    type: 'tide_stone',
    name: 'Tide Stone',
    description: 'A stone that pulses with tidal energy',
    rarity: 'rare',
    icon: '🌊',
  },
  whale_bone: {
    type: 'whale_bone',
    name: 'Whale Bone Talisman',
    description: 'A carved talisman from ancient whale bone',
    rarity: 'legendary',
    icon: '🦴',
  },
  viking_rune: {
    type: 'viking_rune',
    name: 'Viking Rune Stone',
    description: 'A stone carved with Elder Futhark runes of protection',
    rarity: 'rare',
    icon: '🪨',
  },
  siren_tear: {
    type: 'siren_tear',
    name: "Siren's Tear",
    description: 'A crystallized tear from a mythical siren, glows faintly',
    rarity: 'legendary',
    icon: '💧',
  },
  leviathan_scale: {
    type: 'leviathan_scale',
    name: 'Leviathan Scale',
    description: 'An impossibly large scale from a sea monster',
    rarity: 'legendary',
    icon: '🐉',
  },
  abyssal_core: {
    type: 'abyssal_core',
    name: 'Abyssal Core',
    description: 'A pulsating energy source from the deepest trench',
    rarity: 'legendary',
    icon: '⚫',
  },
  cosmetic_token: {
    type: 'cosmetic_token',
    name: 'Gilded Token',
    description: 'A rare golden token that can be exchanged for exclusive cosmetics, boat skins, and decorations',
    rarity: 'legendary',
    icon: '🎨',
  },
}

export interface CraftableRecipe {
  id: string
  name: string
  description: string
  type: CraftableType
  tokenType: TokenType
  tokensRequired: number
  result: {
    type: 'tool' | 'boat_upgrade' | 'upgrade_item'
    itemId: string
    effect: string
  }
}

export const CRAFTABLE_RECIPES: CraftableRecipe[] = [
  {
    id: 'reinforced_rod',
    name: 'Reinforced Fishing Rod',
    description: 'A rod strengthened with ancient materials, +50% efficiency',
    type: 'tool_upgrade',
    tokenType: 'driftwood_charm',
    tokensRequired: 5,
    result: { type: 'tool', itemId: 'basic_rod', effect: 'efficiency +0.5' },
  },
  {
    id: 'crystal_trap',
    name: 'Crystal-Enhanced Trap',
    description: 'A trap infused with ice crystals, attracts rare crabs',
    type: 'tool_upgrade',
    tokenType: 'ice_crystal',
    tokensRequired: 5,
    result: { type: 'tool', itemId: 'crab_trap', effect: 'rare crab chance +20%' },
  },
  {
    id: 'tide_net',
    name: 'Tidal Net',
    description: 'A net woven with tide stones, catches more fish',
    type: 'tool_upgrade',
    tokenType: 'tide_stone',
    tokensRequired: 5,
    result: { type: 'tool', itemId: 'cast_net', effect: 'quantity +1' },
  },
  {
    id: 'pearl_engine',
    name: 'Pearl-Infused Engine',
    description: 'Engine upgrade using pearl fragments, +20% speed',
    type: 'boat_upgrade',
    tokenType: 'pearl_fragment',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'engine', effect: 'speed +20%' },
  },
  {
    id: 'coral_hull',
    name: 'Coral-Reinforced Hull',
    description: 'Hull strengthened with coral gems, +25% durability',
    type: 'boat_upgrade',
    tokenType: 'coral_gem',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'hull', effect: 'durability +25%' },
  },
  {
    id: 'whale_sonar',
    name: 'Whale Sonar System',
    description: 'Advanced radar using whale bone, reveals rare fish zones',
    type: 'boat_upgrade',
    tokenType: 'whale_bone',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'radar', effect: 'rare fish detection' },
  },
  {
    id: 'coin_storage',
    name: 'Ancient Storage Expansion',
    description: 'Storage扩容 using ancient coin magic, +30% capacity',
    type: 'boat_upgrade',
    tokenType: 'ancient_coin',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'storage', effect: 'storage +30%' },
  },
  {
    id: 'shell_crane',
    name: 'Enchanted Crane System',
    description: 'Crane powered by enchanted shells, faster hauling',
    type: 'boat_upgrade',
    tokenType: 'sea_shell',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'crane', effect: 'haul speed +40%' },
  },
  // New recipes with new token types
  {
    id: 'rune_shield',
    name: 'Runic Hull Shield',
    description: 'Hull enchanted with Viking runes, -30% storm damage',
    type: 'boat_upgrade',
    tokenType: 'viking_rune',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'hull', effect: 'storm resistance +30%' },
  },
  {
    id: 'siren_lure',
    name: "Siren's Fish Lure",
    description: 'A lure imbued with siren magic, attracts legendary fish',
    type: 'special_tool',
    tokenType: 'siren_tear',
    tokensRequired: 5,
    result: { type: 'tool', itemId: 'pro_rod', effect: 'legendary fish chance +15%' },
  },
  {
    id: 'leviathan_armor',
    name: 'Leviathan Hull Plating',
    description: 'Hull plated with leviathan scales, +50% max durability',
    type: 'boat_upgrade',
    tokenType: 'leviathan_scale',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'hull', effect: 'max durability +50%' },
  },
  {
    id: 'abyssal_engine',
    name: 'Abyssal Core Engine',
    description: 'Engine powered by abyssal energy, +40% speed in all weather',
    type: 'boat_upgrade',
    tokenType: 'abyssal_core',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'engine', effect: 'all-weather speed +40%' },
  },
  {
    id: 'rune_finder',
    name: 'Runic Treasure Finder',
    description: 'Treasure detection enhanced by runic magic',
    type: 'treasure_map',
    tokenType: 'viking_rune',
    tokensRequired: 3,
    result: { type: 'upgrade_item', itemId: 'rune_finder', effect: 'treasure success +25%' },
  },
  {
    id: 'abyssal_depth',
    name: 'Abyssal Depth Charge',
    description: 'Allows treasure hunting in extreme depths',
    type: 'treasure_map',
    tokenType: 'abyssal_core',
    tokensRequired: 3,
    result: { type: 'upgrade_item', itemId: 'abyssal_depth', effect: 'deep treasure access' },
  },
  // Expanded recipes - tool enchantments
  {
    id: 'enchant_efficiency',
    name: 'Efficiency Enchantment',
    description: 'Enchant any tool with +30% efficiency',
    type: 'tool_upgrade',
    tokenType: 'pearl_fragment',
    tokensRequired: 3,
    result: { type: 'tool', itemId: 'any', effect: 'efficiency +30%' },
  },
  {
    id: 'enchant_durability',
    name: 'Durability Enchantment',
    description: 'Double the durability of any tool',
    type: 'tool_upgrade',
    tokenType: 'coral_gem',
    tokensRequired: 3,
    result: { type: 'tool', itemId: 'any', effect: 'maxDurability x2' },
  },
  {
    id: 'enchant_rare_luck',
    name: 'Rare Luck Enchantment',
    description: '+25% chance to catch rare fish',
    type: 'tool_upgrade',
    tokenType: 'tide_stone',
    tokensRequired: 4,
    result: { type: 'tool', itemId: 'any', effect: 'rare chance +25%' },
  },
  {
    id: 'enchant_legendary_lure',
    name: 'Legendary Lure Enchantment',
    description: '+10% chance to catch legendary fish',
    type: 'tool_upgrade',
    tokenType: 'siren_tear',
    tokensRequired: 4,
    result: { type: 'tool', itemId: 'any', effect: 'legendary chance +10%' },
  },
  {
    id: 'enchant_deep_cast',
    name: 'Deep Cast Enchantment',
    description: 'Reach 50m deeper fishing zones',
    type: 'tool_upgrade',
    tokenType: 'abyssal_core',
    tokensRequired: 2,
    result: { type: 'tool', itemId: 'any', effect: 'maxDepth +50m' },
  },
  // Expanded recipes - boat upgrades
  {
    id: 'ice_plow_upgrade',
    name: 'Ice Plow Attachment',
    description: 'Navigate through ice floes without damage',
    type: 'boat_upgrade',
    tokenType: 'ice_crystal',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'ice_plow', effect: 'ice navigation' },
  },
  {
    id: 'night_vision_upgrade',
    name: 'Night Vision Spotlight',
    description: 'Better visibility and fishing at night',
    type: 'boat_upgrade',
    tokenType: 'pearl_fragment',
    tokensRequired: 4,
    result: { type: 'boat_upgrade', itemId: 'night_vision', effect: 'night fishing +25%' },
  },
  {
    id: 'autopilot_upgrade',
    name: 'Autopilot System',
    description: 'Auto-navigate to nearest location',
    type: 'boat_upgrade',
    tokenType: 'viking_rune',
    tokensRequired: 3,
    result: { type: 'boat_upgrade', itemId: 'autopilot', effect: 'auto-navigation' },
  },
  {
    id: 'refrigeration_upgrade',
    name: 'Refrigeration Unit',
    description: 'Preserve fish value for longer, +20% fish prices',
    type: 'boat_upgrade',
    tokenType: 'ice_crystal',
    tokensRequired: 4,
    result: { type: 'boat_upgrade', itemId: 'refrigeration', effect: 'fish value +20%' },
  },
  {
    id: 'lucky_charm_upgrade',
    name: 'Lucky Charm Mount',
    description: 'Increase all rare drop chances by 15%',
    type: 'boat_upgrade',
    tokenType: 'driftwood_charm',
    tokensRequired: 5,
    result: { type: 'boat_upgrade', itemId: 'lucky_charm', effect: 'all drops +15%' },
  },
  // New token combo recipes
  {
    id: 'titan_hull',
    name: 'Titan Hull Reinforcement',
    description: 'Combine whale bone and coral for ultimate hull, +75% durability',
    type: 'boat_upgrade',
    tokenType: 'whale_bone',
    tokensRequired: 3,
    result: { type: 'boat_upgrade', itemId: 'hull', effect: 'durability +75%' },
  },
  {
    id: 'storm_engine',
    name: 'Storm-Proof Engine',
    description: 'No speed penalty in storms or blizzards',
    type: 'boat_upgrade',
    tokenType: 'leviathan_scale',
    tokensRequired: 3,
    result: { type: 'boat_upgrade', itemId: 'engine', effect: 'storm immunity' },
  },
  {
    id: 'mega_storage',
    name: 'Mega Storage Bay',
    description: 'Double your boat storage capacity',
    type: 'boat_upgrade',
    tokenType: 'ancient_coin',
    tokensRequired: 8,
    result: { type: 'boat_upgrade', itemId: 'storage', effect: 'storage x2' },
  },
  // Skill boost recipes
  {
    id: 'skill_fishing_boost',
    name: 'Fishing Skill Tome',
    description: 'Instantly +2 levels to Fishing Luck skill',
    type: 'special_tool',
    tokenType: 'tide_stone',
    tokensRequired: 5,
    result: { type: 'upgrade_item', itemId: 'skill_fishing_boost', effect: 'fishing_luck +2' },
  },
  {
    id: 'skill_combat_boost',
    name: 'Combat Skill Tome',
    description: 'Instantly +2 levels to Harpoon Master skill',
    type: 'special_tool',
    tokenType: 'whale_bone',
    tokensRequired: 3,
    result: { type: 'upgrade_item', itemId: 'skill_combat_boost', effect: 'harpoon +2' },
  },
  {
    id: 'skill_trade_boost',
    name: 'Trading Skill Tome',
    description: 'Instantly +2 levels to Haggler skill',
    type: 'special_tool',
    tokenType: 'ancient_coin',
    tokensRequired: 5,
    result: { type: 'upgrade_item', itemId: 'skill_trade_boost', effect: 'haggler +2' },
  },
  // Treasure boost recipes
  {
    id: 'treasure_compass',
    name: 'Treasure Compass',
    description: '+50% treasure hunt success rate permanently',
    type: 'treasure_map',
    tokenType: 'viking_rune',
    tokensRequired: 5,
    result: { type: 'upgrade_item', itemId: 'treasure_compass', effect: 'treasure success +50%' },
  },
  {
    id: 'sonar_pulse',
    name: 'Sonar Pulse Module',
    description: 'Detect fish schools from 2x distance',
    type: 'boat_upgrade',
    tokenType: 'whale_bone',
    tokensRequired: 3,
    result: { type: 'boat_upgrade', itemId: 'radar', effect: 'detection range x2' },
  },
]

export interface TreasureHuntResult {
  success: boolean
  tokensFound: Token[]
  goldFound: number
  xpReward: number
  message: string
  durabilityCost: number
}

export interface TradeMarketItem {
  id: string
  type: 'token' | 'craftable' | 'upgrade'
  itemId: string
  price: number
  quantity: number
  expiresAt: number
}

// Location Types
export interface Country {
  id: string
  name: string
  position: Position
  color: string
  isSpawnPoint: boolean
}

export interface Location {
  id: string
  type: 'inn' | 'marketplace' | 'dock' | 'fishing_zone' | 'garage' | 'treasure_hunt' | 'repair' | 'crew' | 'challenges' | 'secret'
  name: string
  position: Position
  countryId: string
  requiredTokens?: { tokenType: TokenType; quantity: number }[]
  discoveryReward?: { gold: number; xp: number }
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: {
    fishId: string
    quantity: number
  }[]
  reward: {
    gold: number
    xp: number
  }
  timeLimit?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

// Inventory Types
export type InventoryItemType = 'fish' | 'tool' | 'boat_part' | 'token' | 'cosmetic' | 'treasure_map'

export interface InventoryItem {
  id: string
  type: InventoryItemType
  itemId: string
  quantity: number
  durability?: number
}

// Player Types
// Time & Weather Types
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm' | 'blizzard' | 'aurora' | 'whiteout' | 'hail' | 'thunderstorm' | 'mist' | 'heatwave' | 'polar_night' | 'magnetic_storm' | 'hurricane' | 'tornado' | 'tsunami' | 'volcanic_ash' | 'meteor_shower' | 'blood_moon' | 'supercell' | 'ice_storm' | 'rogue_wave'
export type SeasonType = 'winter' | 'spring' | 'summer' | 'autumn'

export interface GameTime {
  hour: number      // 0-23
  minute: number    // 0-59
  day: number       // starts at 1
  timeOfDay: TimeOfDay
}

export interface CurrentWeather {
  type: WeatherType
  windSpeed: number       // knots
  temperature: number     // celsius
  visibility: number      // 0-1
}

export interface Weather {
  current: CurrentWeather
  nextChangeIn: number    // real seconds until next weather change
}

export function getWeatherTypeDescription(type: WeatherType): string {
  switch (type) {
    case 'clear':    return 'Clear skies'
    case 'cloudy':   return 'Overcast'
    case 'rain':     return 'Rain showers reducing visibility'
    case 'snow':     return 'Light snowfall'
    case 'fog':      return 'Dense fog - navigate carefully'
    case 'storm':    return 'Severe storm - seek shelter!'
    case 'blizzard': return 'Whiteout conditions!'
    case 'aurora':   return 'Northern Lights dancing above'
    case 'whiteout': return 'Complete visibility loss!'
    case 'hail': return 'Hailstorm pounding the deck!'
    case 'thunderstorm': return 'Thunder and lightning all around!'
    case 'mist': return 'Ethereal mist rising from the water'
    case 'heatwave': return 'Unseasonably warm, fish go deeper'
    case 'polar_night': return 'The sun never rises - extreme cold'
    case 'magnetic_storm': return 'Solar storm disrupting electronics!'
    case 'hurricane': return 'CATEGORY 5 HURRICANE – SEEK SHELTER IMMEDIATELY!'
    case 'tornado': return 'VIOLENT TORNADO – EXTREME DANGER!'
    case 'tsunami': return 'GIANT WAVE INCOMING – BRACE FOR IMPACT!'
    case 'volcanic_ash': return 'Volcanic ash cloud blocking all sunlight!'
    case 'meteor_shower': return 'Shooting stars illuminate the frozen sky!'
    case 'blood_moon': return 'Eerie blood moon – strange things are stirring...'
    case 'supercell': return 'Supercell thunderstorm with rotating winds!'
    case 'ice_storm': return 'Freezing rain coating everything in ice!'
    case 'rogue_wave': return 'Freak wave over 30 meters spotted!'
  }
}

// Weather gameplay modifiers — applied every tick
export interface WeatherModifiers {
  speedMultiplier: number       // 0.3–1.0
  fishingSuccessBonus: number   // -0.5 to +0.2
  combatDifficultyBonus: number // -0.2 to +0.5
  visibilityRange: number       // 0.1–1.0
  durabilityDrainRate: number   // damage per minute to boat
}

export const WEATHER_MODIFIERS: Record<WeatherType, WeatherModifiers> = {
  clear:    { speedMultiplier: 1.0,  fishingSuccessBonus: 0.1,  combatDifficultyBonus: 0.0,  visibilityRange: 1.0,  durabilityDrainRate: 0 },
  cloudy:   { speedMultiplier: 0.9,  fishingSuccessBonus: 0.0,  combatDifficultyBonus: 0.0,  visibilityRange: 0.8,  durabilityDrainRate: 0 },
  rain:     { speedMultiplier: 0.75, fishingSuccessBonus: 0.2,  combatDifficultyBonus: 0.1,  visibilityRange: 0.5,  durabilityDrainRate: 0.5 },
  snow:     { speedMultiplier: 0.7,  fishingSuccessBonus: -0.1, combatDifficultyBonus: 0.1,  visibilityRange: 0.5,  durabilityDrainRate: 1.0 },
  fog:      { speedMultiplier: 0.5,  fishingSuccessBonus: -0.2, combatDifficultyBonus: 0.3,  visibilityRange: 0.2,  durabilityDrainRate: 0 },
  storm:    { speedMultiplier: 0.3,  fishingSuccessBonus: -0.5, combatDifficultyBonus: 0.5,  visibilityRange: 0.2,  durabilityDrainRate: 3.0 },
  blizzard: { speedMultiplier: 0.2,  fishingSuccessBonus: -0.5, combatDifficultyBonus: 0.4,  visibilityRange: 0.1,  durabilityDrainRate: 5.0 },
  aurora:   { speedMultiplier: 0.9,  fishingSuccessBonus: 0.3,  combatDifficultyBonus: -0.2, visibilityRange: 0.9,  durabilityDrainRate: 0 },
  whiteout: { speedMultiplier: 0.1,  fishingSuccessBonus: -0.8, combatDifficultyBonus: 0.6,  visibilityRange: 0.05, durabilityDrainRate: 8.0 },
  hail:    { speedMultiplier: 0.4,  fishingSuccessBonus: -0.3, combatDifficultyBonus: 0.3,  visibilityRange: 0.4,  durabilityDrainRate: 4.0 },
  thunderstorm: { speedMultiplier: 0.3,  fishingSuccessBonus: -0.4, combatDifficultyBonus: 0.6,  visibilityRange: 0.3,  durabilityDrainRate: 4.5 },
  mist:    { speedMultiplier: 0.7,  fishingSuccessBonus: 0.3,  combatDifficultyBonus: 0.1,  visibilityRange: 0.3,  durabilityDrainRate: 0 },
  heatwave:{ speedMultiplier: 0.9,  fishingSuccessBonus: -0.2, combatDifficultyBonus: 0.0,  visibilityRange: 0.9,  durabilityDrainRate: 0.5 },
  polar_night: { speedMultiplier: 0.6,  fishingSuccessBonus: 0.1,  combatDifficultyBonus: 0.2,  visibilityRange: 0.3,  durabilityDrainRate: 3.0 },
  magnetic_storm: { speedMultiplier: 0.5,  fishingSuccessBonus: -0.3, combatDifficultyBonus: 0.5,  visibilityRange: 0.5,  durabilityDrainRate: 2.0 },
  hurricane:  { speedMultiplier: 0.05, fishingSuccessBonus: -0.9, combatDifficultyBonus: 0.8,  visibilityRange: 0.05, durabilityDrainRate: 12.0 },
  tornado:    { speedMultiplier: 0.1,  fishingSuccessBonus: -0.9, combatDifficultyBonus: 0.9,  visibilityRange: 0.1,  durabilityDrainRate: 15.0 },
  tsunami:    { speedMultiplier: 0.2,  fishingSuccessBonus: -0.8, combatDifficultyBonus: 0.7,  visibilityRange: 0.2,  durabilityDrainRate: 20.0 },
  volcanic_ash:{ speedMultiplier: 0.3,  fishingSuccessBonus: -0.6, combatDifficultyBonus: 0.4,  visibilityRange: 0.1,  durabilityDrainRate: 6.0 },
  meteor_shower:{ speedMultiplier: 0.7,  fishingSuccessBonus: 0.4,  combatDifficultyBonus: 0.3,  visibilityRange: 0.7,  durabilityDrainRate: 0 },
  blood_moon: { speedMultiplier: 0.8,  fishingSuccessBonus: 0.5,  combatDifficultyBonus: 0.6,  visibilityRange: 0.6,  durabilityDrainRate: 0 },
  supercell:  { speedMultiplier: 0.15, fishingSuccessBonus: -0.7, combatDifficultyBonus: 0.7,  visibilityRange: 0.1,  durabilityDrainRate: 8.0 },
  ice_storm:  { speedMultiplier: 0.25, fishingSuccessBonus: -0.5, combatDifficultyBonus: 0.5,  visibilityRange: 0.15, durabilityDrainRate: 7.0 },
  rogue_wave: { speedMultiplier: 0.3,  fishingSuccessBonus: -0.6, combatDifficultyBonus: 0.6,  visibilityRange: 0.3,  durabilityDrainRate: 10.0 },
}

// ─── Combat Types ─────────────────────────────────────────────────────────────
export type EnemyType = 'pirate_skiff' | 'pirate_trawler' | 'sea_monster' | 'rival_fisher'

export interface Enemy {
  id: string
  type: EnemyType
  name: string
  health: number
  maxHealth: number
  attack: number        // damage per round
  defense: number       // damage reduction %
  speed: number
  reward: { gold: number; xp: number; loot?: string[] }
  level: number
}

export interface CombatState {
  active: boolean
  enemy: Enemy | null
  playerHealth: number   // current boat durability used as HP
  round: number
  turn: number
  log: string[]
  result: 'ongoing' | 'victory' | 'defeat' | 'fled'
  fleeChance: number
}

export const ENEMY_CONFIGS: Record<EnemyType, Omit<Enemy, 'id' | 'health'>> = {
  pirate_skiff: {
    type: 'pirate_skiff',
    name: 'Pirate Skiff',
    maxHealth: 60,
    attack: 8,
    defense: 0.1,
    speed: 12,
    level: 1,
    reward: { gold: 80 + Math.floor(Math.random() * 40), xp: 30, loot: ['rope', 'compass'] },
  },
  pirate_trawler: {
    type: 'pirate_trawler',
    name: 'Pirate Trawler',
    maxHealth: 150,
    attack: 18,
    defense: 0.25,
    speed: 8,
    level: 3,
    reward: { gold: 200 + Math.floor(Math.random() * 100), xp: 80, loot: ['cannon_ball', 'gold_ingot'] },
  },
  sea_monster: {
    type: 'sea_monster',
    name: 'Arctic Kraken',
    maxHealth: 300,
    attack: 35,
    defense: 0.3,
    speed: 6,
    level: 5,
    reward: { gold: 500, xp: 200, loot: ['kraken_ink', 'monster_scale'] },
  },
  rival_fisher: {
    type: 'rival_fisher',
    name: 'Rival Fisherman',
    maxHealth: 80,
    attack: 10,
    defense: 0.15,
    speed: 9,
    level: 2,
    reward: { gold: 50 + Math.floor(Math.random() * 50), xp: 40, loot: [] },
  },
}

export interface Player {
  id: string
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  gold: number
  currentBoatId: string | null
  position: Position
  rotation: Rotation
  inventory: InventoryItem[]
  ownedBoats: Boat[]
  ownedTools: FishingTool[]
  activeJobs: Job[]
  completedJobs: string[]
  ownedUpgrades: string[]
  tradeMarket: TradeMarketItem[]
  ownedArtifacts: Artifact[]
  equippedArtifacts: string[]
  skills: PlayerSkill[]
  toolEnchantments: ToolEnchantment[]
  crew: CrewMember[]
  achievements: AchievementProgress[]
  dailyChallenges: DailyChallenge[]
  fishingCompetitions: FishingCompetition[]
  stats: PlayerStats
  settings: GameSettings
  time: GameTime
  weather: Weather
  combat: CombatState
  season: SeasonType
  seasonDay: number
  // New fields
  ownedCosmetics: string[]
  equippedCosmetics: Partial<Record<CosmeticSlot, string>>
  discoveredMaps: string[]
  discoveredSecrets: string[]
  cooperative: CooperativeState
  tokensFoundWhileFishing: number
  clanId: string | null
  clanInvites: string[]
  chat: ChatState
}

export interface Clan {
  id: string
  name: string
  tag: string
  ownerId: string
  members: ClanMember[]
  level: number
  xp: number
  xpToNext: number
  goldBank: number
  description: string
  createdAt: number
  motto: string
  allianceIds: string[]
  baseLocation?: { latitude: number; longitude: number }
  stats: ClanStats
}

export interface ClanMember {
  playerId: string
  playerName: string
  role: 'owner' | 'officer' | 'member'
  level: number
  joinedAt: number
  lastOnline: number
  contribution: number
}

export interface ClanStats {
  totalFishCaught: number
  totalGoldEarned: number
  totalDistanceTraveled: number
  seaMonstersSlain: number
  competitionsWon: number
}

export interface AccountDatabaseConfig {
  provider: 'local' | 'supabase' | 'appwrite' | 'firebase' | 'nhost' | 'custom'
  url: string
  anonKey: string
  projectId: string
  connected: boolean
}

export interface Artifact {
  id: string
  name: string
  description: string
  rarity: 'rare' | 'legendary' | 'mythical'
  value: number
  effect: string
  icon: string
}

export interface CrewMember {
  id: string
  name: string
  role: 'deckhand' | 'navigator' | 'engineer' | 'cook' | 'harpooner'
  level: number
  salary: number
  efficiency: number
  morale: number
  icon: string
}

export interface AchievementProgress {
  id: string
  name: string
  description: string
  target: number
  current: number
  completed: boolean
  reward: { gold?: number; xp?: number; artifact?: string }
  icon: string
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  target: number
  current: number
  completed: boolean
  reward: { gold: number; xp: number }
  expiresAt: number
  type: 'catch' | 'sell' | 'hunt' | 'travel' | 'combat' | 'craft'
}

export interface FishingCompetition {
  id: string
  title: string
  description: string
  targetSpecies: string
  startTime: number
  endTime: number
  participants: number
  prize: { gold: number; xp: number }
  playerScore: number
  rank: number
  active: boolean
}

export interface PlayerStats {
  totalFishCaught: number
  totalGoldEarned: number
  totalJobsCompleted: number
  totalDistanceTraveled: number
  raresCaught: number
  legendariesCaught: number
  mythicalsCaught: number
  playTime: number
  totalTreasuresFound: number
  totalArtifactsFound: number
  totalCrewHired: number
  competitionsWon: number
  daysPlayed: number
}

export interface PlayerSkill {
  id: string
  name: string
  description: string
  level: number
  maxLevel: number
  xp: number
  xpToNext: number
  category: 'fishing' | 'navigation' | 'combat' | 'crafting' | 'trading'
  icon: string
  effect: string
}

export const PLAYER_SKILLS: Omit<PlayerSkill, 'xp' | 'xpToNext'>[] = [
  { id: 'fishing_luck', name: 'Fishing Luck', description: 'Increases chance of rare and legendary fish', level: 0, maxLevel: 20, category: 'fishing', icon: '🍀', effect: '+3% rare fish chance per level' },
  { id: 'reel_master', name: 'Reel Master', description: 'Faster reeling speed and less line tension', level: 0, maxLevel: 15, category: 'fishing', icon: '🎣', effect: '+5% reeling speed per level' },
  { id: 'deep_sea', name: 'Deep Sea Diver', description: 'Access deeper fishing zones with better fish', level: 0, maxLevel: 10, category: 'fishing', icon: '🤿', effect: '+10m max depth per level' },
  { id: 'navigator', name: 'Navigator', description: 'Faster boat speed and better treasure detection', level: 0, maxLevel: 15, category: 'navigation', icon: '🧭', effect: '+3% speed, +5% treasure success per level' },
  { id: 'ice_pilot', name: 'Ice Pilot', description: 'Reduced damage in blizzard/snow weather', level: 0, maxLevel: 10, category: 'navigation', icon: '🧊', effect: '-5% weather damage per level' },
  { id: 'explorer', name: 'Explorer', description: 'Discover hidden locations faster', level: 0, maxLevel: 10, category: 'navigation', icon: '🗺️', effect: '+8% discovery range per level' },
  { id: 'harpoon', name: 'Harpoon Master', description: 'Increased combat damage and accuracy', level: 0, maxLevel: 15, category: 'combat', icon: '⚔️', effect: '+5% damage, +2% accuracy per level' },
  { id: 'hull_repair', name: 'Hull Repair', description: 'Cheaper boat repairs and faster recovery', level: 0, maxLevel: 10, category: 'combat', icon: '🔧', effect: '-5% repair cost per level' },
  { id: 'survivalist', name: 'Survivalist', description: 'Reduced durability drain in harsh weather', level: 0, maxLevel: 10, category: 'combat', icon: '🛡️', effect: '-8% durability drain per level' },
  { id: 'craftsman', name: 'Craftsman', description: 'Better crafted items, fewer tokens needed', level: 0, maxLevel: 15, category: 'crafting', icon: '🔨', effect: '-1 token needed per 5 levels' },
  { id: 'enchanter', name: 'Enchanter', description: 'Stronger tool enchantments and boat buffs', level: 0, maxLevel: 10, category: 'crafting', icon: '✨', effect: '+5% enchantment power per level' },
  { id: 'scholar', name: 'Scholar', description: 'Bonus XP from all sources', level: 0, maxLevel: 15, category: 'crafting', icon: '📚', effect: '+3% XP gain per level' },
  { id: 'haggler', name: 'Haggler', description: 'Better sell prices and cheaper buys', level: 0, maxLevel: 15, category: 'trading', icon: '💰', effect: '+3% sell price, -2% buy cost per level' },
  { id: 'market_guru', name: 'Market Guru', description: 'Better trade market listings appear', level: 0, maxLevel: 10, category: 'trading', icon: '📈', effect: '+10% better market prices per level' },
  { id: 'smuggler', name: 'Smuggler', description: 'Black market access with premium prices', level: 0, maxLevel: 5, category: 'trading', icon: '🏴‍☠️', effect: 'Unlock black market at level 1' },
]

export interface GameSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  graphicsQuality: 'low' | 'medium' | 'high'
  showTutorials: boolean
  controlScheme: 'wasd' | 'arrows'
  cooperative: CooperativeSettings
  showFPS: boolean
  autoSaveInterval: number
  language: string
}

// Save Types
export interface SaveData {
  id?: number
  slotNumber: number
  name: string
  player: Player
  timestamp: number
  playTime: number
  thumbnail?: string
}

// XP calculation
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; xpToNext: number } {
  let level = 1
  let xpRequired = getXPForLevel(1)
  let accumulatedXP = 0

  while (accumulatedXP + xpRequired <= totalXP) {
    accumulatedXP += xpRequired
    level++
    xpRequired = getXPForLevel(level)
  }

  return {
    level,
    currentXP: totalXP - accumulatedXP,
    xpToNext: xpRequired,
  }
}

// Default player creation
export function createDefaultPlayer(name: string, spawnPosition: Position): Player {
  return {
    id: crypto.randomUUID(),
    name,
    level: 1,
    xp: 0,
    xpToNextLevel: getXPForLevel(1),
    gold: 50,
    currentBoatId: null,
    position: spawnPosition,
    rotation: { x: 0, y: 0, z: 0 },
    inventory: [],
    ownedBoats: [],
    ownedTools: [],
    activeJobs: [],
    completedJobs: [],
    ownedUpgrades: [],
    tradeMarket: [],
    ownedArtifacts: [],
    equippedArtifacts: [],
    skills: PLAYER_SKILLS.map(s => ({ ...s, xp: 0, xpToNext: 100 })),
    toolEnchantments: [],
    crew: [],
    achievements: [],
    dailyChallenges: [],
    fishingCompetitions: [],
    stats: {
      totalFishCaught: 0,
      totalGoldEarned: 0,
      totalJobsCompleted: 0,
      totalDistanceTraveled: 0,
      raresCaught: 0,
      legendariesCaught: 0,
      mythicalsCaught: 0,
      playTime: 0,
      totalTreasuresFound: 0,
      totalArtifactsFound: 0,
      totalCrewHired: 0,
      competitionsWon: 0,
      daysPlayed: 1,
    },
    settings: {
      masterVolume: 0.8,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      graphicsQuality: 'high',
      showTutorials: true,
      controlScheme: 'wasd',
      cooperative: DEFAULT_COOPERATIVE_SETTINGS,
      showFPS: false,
      autoSaveInterval: 300,
      language: 'en',
    },
    time: {
      hour: 8,
      minute: 0,
      day: 1,
      timeOfDay: 'day',
    },
    weather: {
      current: { type: 'clear', windSpeed: 5, temperature: -2, visibility: 1 },
      nextChangeIn: 120,
    },
    combat: {
      active: false,
      enemy: null,
      playerHealth: 100,
      round: 0,
      turn: 0,
      log: [],
      result: 'ongoing',
      fleeChance: 0.4,
    },
    season: 'winter',
    seasonDay: 1,
    ownedCosmetics: ['skin_classic', 'rod_skin_basic', 'deco_basic_flag', 'dock_deco_basic'],
    equippedCosmetics: { boat_skin: 'skin_classic', fishing_rod_skin: 'rod_skin_basic', fishing_spot: 'deco_basic_flag', dock_decoration: 'dock_deco_basic' },
    discoveredMaps: [],
    discoveredSecrets: [],
    cooperative: {
      sessionId: null,
      isHost: false,
      players: [],
      settings: DEFAULT_COOPERATIVE_SETTINGS,
    },
    tokensFoundWhileFishing: 0,
    clanId: null,
    clanInvites: [],
    chat: createDefaultChatState(),
  }
}

export const CREW_TEMPLATES: Omit<CrewMember, 'id'>[] = [
  { name: 'Olaf', role: 'deckhand', level: 1, salary: 10, efficiency: 1, morale: 80, icon: '🧔' },
  { name: 'Ingrid', role: 'navigator', level: 2, salary: 20, efficiency: 1.2, morale: 75, icon: '👩‍✈️' },
  { name: 'Sven', role: 'engineer', level: 3, salary: 30, efficiency: 1.5, morale: 70, icon: '👨‍🔧' },
  { name: 'Astrid', role: 'cook', level: 1, salary: 15, efficiency: 1, morale: 90, icon: '👩‍🍳' },
  { name: 'Bjorn', role: 'harpooner', level: 4, salary: 50, efficiency: 2, morale: 65, icon: '🏹' },
  { name: 'Freya', role: 'navigator', level: 5, salary: 60, efficiency: 2.5, morale: 85, icon: '🧭' },
  { name: 'Ragnar', role: 'deckhand', level: 3, salary: 25, efficiency: 1.8, morale: 60, icon: '⚓' },
  { name: 'Sigrid', role: 'engineer', level: 6, salary: 80, efficiency: 3, morale: 70, icon: '🔧' },
]

export const ACHIEVEMENT_TEMPLATES: Omit<AchievementProgress, 'current' | 'completed'>[] = [
  { id: 'first_catch', name: 'First Blood', description: 'Catch your first fish', target: 1, reward: { gold: 20, xp: 10 }, icon: '🐟' },
  { id: 'cod_master', name: 'Cod Master', description: 'Catch 50 Arctic Cod', target: 50, reward: { gold: 100, xp: 50 }, icon: '🐠' },
  { id: 'rare_hunter', name: 'Rare Hunter', description: 'Catch 10 rare fish', target: 10, reward: { gold: 200, xp: 100 }, icon: '💎' },
  { id: 'legendary_fisher', name: 'Legendary Fisher', description: 'Catch 5 legendary fish', target: 5, reward: { gold: 500, xp: 250 }, icon: '👑' },
  { id: 'mythical_catch', name: 'Mythical Catch', description: 'Catch a mythical creature', target: 1, reward: { gold: 1000, xp: 500, artifact: 'golden_trident' }, icon: '🔱' },
  { id: 'gold_hoarder', name: 'Gold Hoarder', description: 'Earn 10,000 gold', target: 10000, reward: { gold: 500, xp: 200 }, icon: '💰' },
  { id: 'treasure_hunter', name: 'Treasure Hunter', description: 'Find 20 treasures', target: 20, reward: { gold: 300, xp: 150 }, icon: '🗺️' },
  { id: 'sea_explorer', name: 'Sea Explorer', description: 'Travel 1000 distance', target: 1000, reward: { gold: 150, xp: 75 }, icon: '🧭' },
  { id: 'job_completed', name: 'Contract Worker', description: 'Complete 10 jobs', target: 10, reward: { gold: 200, xp: 100 }, icon: '📋' },
  { id: 'artifact_collector', name: 'Artifact Collector', description: 'Find 5 artifacts', target: 5, reward: { gold: 400, xp: 200 }, icon: '🏺' },
  { id: 'crew_captain', name: 'Crew Captain', description: 'Hire 3 crew members', target: 3, reward: { gold: 300, xp: 150 }, icon: '🚢' },
  { id: 'competition_winner', name: 'Champion', description: 'Win a fishing competition', target: 1, reward: { gold: 1000, xp: 500 }, icon: '🏆' },
]

export const ARTIFACT_TEMPLATES: Artifact[] = [
  { id: 'golden_trident', name: 'Golden Trident', description: 'A legendary weapon of Poseidon', rarity: 'mythical', value: 5000, effect: '+50% fishing success', icon: '🔱' },
  { id: 'pearl_of_njord', name: 'Pearl of Njord', description: 'Blessing from the sea god', rarity: 'mythical', value: 3000, effect: '+30% rare fish chance', icon: '🔮' },
  { id: 'compass_of_leif', name: 'Compass of Leif', description: 'The compass that discovered Vinland', rarity: 'legendary', value: 2000, effect: '+25% treasure success', icon: '🧭' },
  { id: 'viking_amulet', name: 'Viking Amulet', description: 'Ancient protection charm', rarity: 'legendary', value: 1500, effect: '-20% damage from storms', icon: '⚔️' },
  { id: 'siren_scale', name: 'Siren Scale', description: 'A scale from a mythical siren', rarity: 'legendary', value: 1800, effect: '+20% crew morale', icon: '🎵' },
  { id: 'frozen_anchor', name: 'Frozen Anchor', description: 'An anchor that never rusts', rarity: 'rare', value: 800, effect: '+15% boat durability', icon: '⚓' },
  { id: 'kraken_eye', name: 'Kraken Eye', description: 'Glowing eye of the deep', rarity: 'mythical', value: 4000, effect: '+40% mythical fish chance', icon: '👁️' },
  { id: 'ice_heart', name: 'Heart of the Ice', description: 'A crystal from the glacier core', rarity: 'rare', value: 1000, effect: '+20% blizzard resistance', icon: '💠' },
]

// ─── Weather Gameplay Effects ─────────────────────────────────────────────────
export interface WeatherGameplayEffect {
  fishingSpeedMult: number    // multiplier on reeling speed
  fishingChanceMult: number   // multiplier on fish bite chance
  movementSpeedMult: number   // multiplier on boat speed
  combatChanceMult: number    // multiplier on random combat encounter chance
  boatDamageMult: number      // passive durability damage per minute
  xpMult: number              // bonus XP for fishing in bad weather
}

export const WEATHER_GAMEPLAY: Record<WeatherType, WeatherGameplayEffect> = {
  clear:    { fishingSpeedMult: 1.0,  fishingChanceMult: 1.0,  movementSpeedMult: 1.0,  combatChanceMult: 0.5,  boatDamageMult: 0,    xpMult: 1.0  },
  cloudy:   { fishingSpeedMult: 1.1,  fishingChanceMult: 1.2,  movementSpeedMult: 0.95, combatChanceMult: 0.7,  boatDamageMult: 0,    xpMult: 1.1  },
  rain:     { fishingSpeedMult: 1.2,  fishingChanceMult: 1.4,  movementSpeedMult: 0.85, combatChanceMult: 0.6,  boatDamageMult: 0.5,  xpMult: 1.2  },
  snow:     { fishingSpeedMult: 0.9,  fishingChanceMult: 0.8,  movementSpeedMult: 0.75, combatChanceMult: 0.4,  boatDamageMult: 1.0,  xpMult: 1.3  },
  fog:      { fishingSpeedMult: 1.0,  fishingChanceMult: 1.5,  movementSpeedMult: 0.6,  combatChanceMult: 1.5,  boatDamageMult: 0,    xpMult: 1.4  },
  storm:    { fishingSpeedMult: 0.5,  fishingChanceMult: 0.3,  movementSpeedMult: 0.4,  combatChanceMult: 2.0,  boatDamageMult: 3.0,  xpMult: 2.0  },
  blizzard: { fishingSpeedMult: 0.3,  fishingChanceMult: 0.2,  movementSpeedMult: 0.25, combatChanceMult: 1.0,  boatDamageMult: 5.0,  xpMult: 2.5  },
  aurora:   { fishingSpeedMult: 1.3,  fishingChanceMult: 2.0,  movementSpeedMult: 1.1,  combatChanceMult: 0.3,  boatDamageMult: 0,    xpMult: 3.0  },
  whiteout: { fishingSpeedMult: 0.2, fishingChanceMult: 0.5, movementSpeedMult: 0.1, combatChanceMult: 2.5, boatDamageMult: 10.0, xpMult: 4.0  },
  hail:    { fishingSpeedMult: 0.6, fishingChanceMult: 0.6, movementSpeedMult: 0.5, combatChanceMult: 1.5, boatDamageMult: 4.0,  xpMult: 2.2  },
  thunderstorm: { fishingSpeedMult: 0.4, fishingChanceMult: 0.4, movementSpeedMult: 0.35, combatChanceMult: 2.5, boatDamageMult: 4.5,  xpMult: 2.8  },
  mist:    { fishingSpeedMult: 1.1, fishingChanceMult: 1.8, movementSpeedMult: 0.75, combatChanceMult: 0.8, boatDamageMult: 0,    xpMult: 1.5  },
  heatwave:{ fishingSpeedMult: 0.8, fishingChanceMult: 0.7, movementSpeedMult: 0.9,  combatChanceMult: 0.4, boatDamageMult: 0.5,  xpMult: 0.8  },
  polar_night: { fishingSpeedMult: 1.2, fishingChanceMult: 1.3, movementSpeedMult: 0.65, combatChanceMult: 1.2, boatDamageMult: 3.0,  xpMult: 2.0  },
  magnetic_storm: { fishingSpeedMult: 0.5, fishingChanceMult: 0.8, movementSpeedMult: 0.55, combatChanceMult: 2.0, boatDamageMult: 2.0,  xpMult: 2.5  },
  hurricane:  { fishingSpeedMult: 0.05, fishingChanceMult: 0.1, movementSpeedMult: 0.05, combatChanceMult: 3.5, boatDamageMult: 15.0, xpMult: 5.0  },
  tornado:    { fishingSpeedMult: 0.1,  fishingChanceMult: 0.05, movementSpeedMult: 0.1,  combatChanceMult: 4.0, boatDamageMult: 20.0, xpMult: 5.5  },
  tsunami:    { fishingSpeedMult: 0.15, fishingChanceMult: 0.1,  movementSpeedMult: 0.15, combatChanceMult: 3.0, boatDamageMult: 25.0, xpMult: 5.0  },
  volcanic_ash:{ fishingSpeedMult: 0.4, fishingChanceMult: 0.3,  movementSpeedMult: 0.3,  combatChanceMult: 1.5, boatDamageMult: 6.0,  xpMult: 3.5  },
  meteor_shower:{ fishingSpeedMult: 1.2, fishingChanceMult: 2.5, movementSpeedMult: 0.9,  combatChanceMult: 0.5, boatDamageMult: 0,    xpMult: 3.5  },
  blood_moon: { fishingSpeedMult: 1.3,  fishingChanceMult: 2.0, movementSpeedMult: 0.85, combatChanceMult: 2.0, boatDamageMult: 0,    xpMult: 4.0  },
  supercell:  { fishingSpeedMult: 0.2,  fishingChanceMult: 0.3, movementSpeedMult: 0.2,  combatChanceMult: 3.0, boatDamageMult: 8.0,  xpMult: 4.0  },
  ice_storm:  { fishingSpeedMult: 0.3,  fishingChanceMult: 0.4, movementSpeedMult: 0.3,  combatChanceMult: 1.5, boatDamageMult: 7.0,  xpMult: 3.0  },
  rogue_wave: { fishingSpeedMult: 0.25, fishingChanceMult: 0.2, movementSpeedMult: 0.25, combatChanceMult: 2.5, boatDamageMult: 12.0, xpMult: 4.5  },
}

// ─── Legacy Engine Types (for backwards compatibility) ─────────────────────

export interface WeatherCondition {
  type: WeatherType
  intensity: number
  windSpeed: number
  windDirection: number
  visibility: number
  waveHeight: number
  temperature: number
  duration: number
}

export interface WeatherForecast {
  current: WeatherCondition
  next: WeatherType
  timeUntilChange: number
}

export interface TimeSystem {
  hour: number
  minute: number
  day: number
  timeOfDay: TimeOfDay
  speedMultiplier: number
}

export interface BoatPhysics {
  position: Position
  velocity: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  angularVelocity: { x: number; y: number; z: number }
  speed: number
  heading: number
}

export interface FishingState {
  isCasting: boolean
  isWaiting: boolean
  isReeling: boolean
  castPower: number
  waitTimer: number
  reelProgress: number
}

export interface FishingMiniGame {
  state: 'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'fighting' | 'caught' | 'escaped'
  castPower: number
  castDirection: number
  lineTension: number
  maxTension: number
  fishOnLine: FishOnLine | null
  reelProgress: number
  reelSpeed: number
  fishStruggle: number
  timer: number
  maxTimer: number
  combo: number
  perfectReels: number
}

export interface FishOnLine {
  speciesId: string
  weight: number
  strength: number
  strugglePattern: number
  escapeChance: number
  fatigue: number
}

export interface PirateShip {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  speed: number
  position: Position
  isHostile: boolean
}

export interface CombatSystem {
  active: boolean
  playerHealth: number
  enemyHealth: number
  round: number
  log: string[]
}

export interface CombatLogEntry {
  timestamp: number
  message: string
  type: 'attack' | 'defense' | 'heal' | 'info'
}

export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 19) return 'day'
  if (hour >= 19 && hour < 22) return 'dusk'
  return 'night'
}

export function generatePirateShip(level: number): PirateShip {
  const names = ['Black Pearl', 'Sea Serpent', 'Ghost Ship', 'Iron Hull', 'Storm Bringer']
  return {
    id: crypto.randomUUID(),
    name: names[Math.floor(Math.random() * names.length)],
    health: 50 + level * 20,
    maxHealth: 50 + level * 20,
    attack: 10 + level * 5,
    defense: 0.1 + level * 0.05,
    speed: 3 + level * 0.5,
    position: { x: 0, y: 0, z: 0 },
    isHostile: true,
  }
}

export function getDefaultTimeSystem(): TimeSystem {
  return { hour: 8, minute: 0, day: 1, timeOfDay: 'day', speedMultiplier: 1 }
}

export function getDefaultWeatherForecast(): WeatherForecast {
  return {
    current: { type: 'clear', intensity: 0.3, windSpeed: 5, windDirection: 0, visibility: 1, waveHeight: 0.5, temperature: 5, duration: 300 },
    next: 'cloudy',
    timeUntilChange: 300,
  }
}

export function getDefaultFishingMiniGame(): FishingMiniGame {
  return {
    state: 'idle', castPower: 0, castDirection: 0, lineTension: 0, maxTension: 100,
    fishOnLine: null, reelProgress: 0, reelSpeed: 0, fishStruggle: 0,
    timer: 0, maxTimer: 60, combo: 0, perfectReels: 0,
  }
}

export function getDefaultCombatSystem(): CombatSystem {
  return { active: false, playerHealth: 100, enemyHealth: 100, round: 0, log: [] }
}

export function getDefaultBoatPhysics(): BoatPhysics {
  return {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 },
    speed: 0, heading: 0,
  }
}

export function getFishingStateDescription(state: string): string {
  const descriptions: Record<string, string> = {
    idle: 'Ready to cast your line',
    casting: 'Charging your cast...',
    waiting: 'Waiting for a bite...',
    bite: 'Fish on the line!',
    reeling: 'Reeling it in...',
    fighting: 'Fighting the fish!',
    caught: 'Got one!',
    escaped: 'It got away...',
  }
  return descriptions[state] || 'Unknown state'
}

// ─── Cosmetics System ──────────────────────────────────────────────────────
export type CosmeticSlot = 'boat_skin' | 'fishing_spot' | 'boat_accessory' | 'fishing_rod_skin' | 'dock_decoration' | 'inventory_amulet'

export interface Cosmetic {
  id: string
  name: string
  description: string
  slot: CosmeticSlot
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
  icon: string
  price: number
  effects?: {
    rareFishChance?: number
    legendaryFishChance?: number
    mythicalFishChance?: number
    fishingSpeed?: number
    xpBonus?: number
    goldBonus?: number
    weatherResistance?: number
    durabilityBonus?: number
    inventorySpace?: number
  }
  requiredLevel: number
  availableInShop: boolean
  craftRecipe?: { tokenType: TokenType; tokensRequired: number }
}

export const COSMETICS: Cosmetic[] = [
  // Boat Skins
  { id: 'skin_classic', name: 'Classic Wood', description: 'The traditional wooden hull', slot: 'boat_skin', rarity: 'common', icon: '🪵', price: 0, requiredLevel: 1, availableInShop: false },
  { id: 'skin_icebreaker', name: 'Ice Breaker Stripes', description: 'Bold red and white stripes, +2% rare fish chance', slot: 'boat_skin', rarity: 'uncommon', icon: '🎨', price: 200, effects: { rareFishChance: 0.02 }, requiredLevel: 3, availableInShop: true },
  { id: 'skin_night_phantom', name: 'Night Phantom', description: 'Stealthy black coating, +3% rare fish chance', slot: 'boat_skin', rarity: 'rare', icon: '🌑', price: 500, effects: { rareFishChance: 0.03 }, requiredLevel: 8, availableInShop: true },
  { id: 'skin_viking_longship', name: 'Viking Longship', description: 'Authentic Norse design, +5% fishing speed', slot: 'boat_skin', rarity: 'rare', icon: '⛵', price: 800, effects: { fishingSpeed: 0.05 }, requiredLevel: 12, availableInShop: true },
  { id: 'skin_aurora_guardian', name: 'Aurora Guardian', description: 'Shimmering aurora paint, +8% legendary fish chance', slot: 'boat_skin', rarity: 'legendary', icon: '🌌', price: 2000, effects: { legendaryFishChance: 0.08 }, requiredLevel: 20, availableInShop: true, craftRecipe: { tokenType: 'ice_crystal', tokensRequired: 8 } },
  { id: 'skin_kraken_hunter', name: 'Kraken Hunter', description: 'Adorned with kraken trophies, +5% all rare fish', slot: 'boat_skin', rarity: 'legendary', icon: '🐙', price: 3000, effects: { rareFishChance: 0.05, legendaryFishChance: 0.05 }, requiredLevel: 25, availableInShop: true, craftRecipe: { tokenType: 'leviathan_scale', tokensRequired: 5 } },
  { id: 'skin_abyssal_lord', name: 'Abyssal Lord', description: 'Forged in the deepest trenches, +10% mythical chance', slot: 'boat_skin', rarity: 'mythical', icon: '👑', price: 8000, effects: { mythicalFishChance: 0.1 }, requiredLevel: 40, availableInShop: true, craftRecipe: { tokenType: 'abyssal_core', tokensRequired: 10 } },
  { id: 'skin_golden_dawn', name: 'Golden Dawn', description: 'Plated with gold leaf, +15% gold from fish sales', slot: 'boat_skin', rarity: 'legendary', icon: '✨', price: 5000, effects: { goldBonus: 0.15 }, requiredLevel: 30, availableInShop: true, craftRecipe: { tokenType: 'ancient_coin', tokensRequired: 12 } },
  { id: 'skin_frost_emperor', name: 'Frost Emperor', description: 'Encased in eternal ice, +20% blizzard resistance', slot: 'boat_skin', rarity: 'legendary', icon: '❄️', price: 3500, effects: { weatherResistance: 0.2 }, requiredLevel: 22, availableInShop: true, craftRecipe: { tokenType: 'ice_crystal', tokensRequired: 10 } },

  // Fishing Spot Decorations
  { id: 'deco_basic_flag', name: 'Simple Flag', description: 'Mark your spot with a small flag', slot: 'fishing_spot', rarity: 'common', icon: '🚩', price: 50, requiredLevel: 1, availableInShop: true },
  { id: 'deco_lanterns', name: 'Warm Lanterns', description: 'Cozy lanterns attract more fish, +2% bite rate', slot: 'fishing_spot', rarity: 'uncommon', icon: '🏮', price: 150, effects: { fishingSpeed: 0.02 }, requiredLevel: 4, availableInShop: true },
  { id: 'deco_totem', name: 'Fishing Totem', description: 'Ancient totem blessing, +5% rare fish', slot: 'fishing_spot', rarity: 'rare', icon: '🗿', price: 600, effects: { rareFishChance: 0.05 }, requiredLevel: 10, availableInShop: true, craftRecipe: { tokenType: 'driftwood_charm', tokensRequired: 5 } },
  { id: 'deco_crystal_pedestal', name: 'Crystal Pedestal', description: 'Ice crystal amplify fish attraction, +4% legendary', slot: 'fishing_spot', rarity: 'legendary', icon: '💎', price: 2500, effects: { legendaryFishChance: 0.04 }, requiredLevel: 20, availableInShop: true, craftRecipe: { tokenType: 'ice_crystal', tokensRequired: 8 } },
  { id: 'deco_siren_statue', name: 'Siren Statue', description: 'A hauntingly beautiful statue, +10% XP bonus', slot: 'fishing_spot', rarity: 'legendary', icon: '🧜', price: 4000, effects: { xpBonus: 0.1 }, requiredLevel: 28, availableInShop: true, craftRecipe: { tokenType: 'siren_tear', tokensRequired: 5 } },
  { id: 'deco_rune_circle', name: 'Rune Circle', description: 'Viking runes channel luck, +8% all rare catches', slot: 'fishing_spot', rarity: 'legendary', icon: '🪐', price: 3000, effects: { rareFishChance: 0.04, legendaryFishChance: 0.04 }, requiredLevel: 25, availableInShop: true, craftRecipe: { tokenType: 'viking_rune', tokensRequired: 6 } },
  { id: 'deco_abyssal_altar', name: 'Abyssal Altar', description: 'Sacrifice fish for mythical blessings, +6% mythical', slot: 'fishing_spot', rarity: 'mythical', icon: '🔮', price: 7000, effects: { mythicalFishChance: 0.06 }, requiredLevel: 35, availableInShop: true, craftRecipe: { tokenType: 'abyssal_core', tokensRequired: 8 } },
  { id: 'deco_whale_fountain', name: 'Whale Fountain', description: 'A water fountain celebrating the giants, +3% durability bonus', slot: 'fishing_spot', rarity: 'rare', icon: '🐋', price: 1200, effects: { durabilityBonus: 0.03 }, requiredLevel: 15, availableInShop: true, craftRecipe: { tokenType: 'whale_bone', tokensRequired: 4 } },

  // Boat Accessories
  { id: 'acc_lucky_banner', name: 'Lucky Banner', description: 'A banner that flaps in the wind, +2% luck', slot: 'boat_accessory', rarity: 'uncommon', icon: '🏴', price: 200, effects: { rareFishChance: 0.02 }, requiredLevel: 5, availableInShop: true },
  { id: 'acc_golden_anchor', name: 'Golden Anchor', description: 'Purely decorative golden anchor', slot: 'boat_accessory', rarity: 'rare', icon: '⚓', price: 500, requiredLevel: 10, availableInShop: true },
  { id: 'acc_captain_skull', name: "Captain's Skull", description: 'Intimidating pirate skull, +3% combat damage', slot: 'boat_accessory', rarity: 'rare', icon: '💀', price: 800, effects: { xpBonus: 0.03 }, requiredLevel: 12, availableInShop: true, craftRecipe: { tokenType: 'ancient_coin', tokensRequired: 5 } },
  { id: 'acc_treasure_compass', name: 'Treasure Compass', description: 'Glows near treasure, +10% treasure success', slot: 'boat_accessory', rarity: 'legendary', icon: '🧭', price: 3000, effects: { xpBonus: 0.05 }, requiredLevel: 25, availableInShop: true, craftRecipe: { tokenType: 'tide_stone', tokensRequired: 6 } },
  { id: 'acc_mermaid_figure', name: 'Mermaid Figurehead', description: 'Carved mermaid guiding your ship, +5% legendary fish', slot: 'boat_accessory', rarity: 'legendary', icon: '🧜‍♀️', price: 4000, effects: { legendaryFishChance: 0.05 }, requiredLevel: 30, availableInShop: true, craftRecipe: { tokenType: 'siren_tear', tokensRequired: 7 } },

  // Fishing Rod Skins
  { id: 'rod_skin_basic', name: 'Plain Rod', description: 'Standard fishing rod', slot: 'fishing_rod_skin', rarity: 'common', icon: '🎣', price: 0, requiredLevel: 1, availableInShop: false },
  { id: 'rod_skin_carbon', name: 'Carbon Fiber', description: 'Sleek modern look, +3% reeling speed', slot: 'fishing_rod_skin', rarity: 'uncommon', icon: '🎋', price: 250, effects: { fishingSpeed: 0.03 }, requiredLevel: 6, availableInShop: true },
  { id: 'rod_skin_viking_rune', name: 'Rune-Inscribed Rod', description: 'Ancient runes glow when fish bite, +5% rare chance', slot: 'fishing_rod_skin', rarity: 'rare', icon: '⚡', price: 750, effects: { rareFishChance: 0.05 }, requiredLevel: 14, availableInShop: true, craftRecipe: { tokenType: 'viking_rune', tokensRequired: 4 } },
  { id: 'rod_skin_leviathan', name: 'Leviathan Bone Rod', description: 'Carved from leviathan bones, +6% legendary chance', slot: 'fishing_rod_skin', rarity: 'legendary', icon: '🦴', price: 3500, effects: { legendaryFishChance: 0.06 }, requiredLevel: 28, availableInShop: true, craftRecipe: { tokenType: 'leviathan_scale', tokensRequired: 6 } },

  // Dock Decorations
  { id: 'dock_deco_basic', name: 'Plain Dock', description: 'Simple wooden dock', slot: 'dock_decoration', rarity: 'common', icon: '🪵', price: 0, requiredLevel: 1, availableInShop: false },
  { id: 'dock_deco_fish_crates', name: 'Fish Crates', description: 'Stacked crates show your catch', slot: 'dock_decoration', rarity: 'uncommon', icon: '📦', price: 100, requiredLevel: 2, availableInShop: true },
  { id: 'dock_deco_net_rack', name: 'Net Rack', description: 'Drying nets, +2% fishing efficiency', slot: 'dock_decoration', rarity: 'uncommon', icon: '🕸️', price: 250, effects: { fishingSpeed: 0.02 }, requiredLevel: 6, availableInShop: true },
  { id: 'dock_deco_trophy_wall', name: 'Trophy Wall', description: 'Show off your rare catches, +5% XP', slot: 'dock_decoration', rarity: 'rare', icon: '🏆', price: 1000, effects: { xpBonus: 0.05 }, requiredLevel: 15, availableInShop: true, craftRecipe: { tokenType: 'pearl_fragment', tokensRequired: 5 } },
  { id: 'dock_deco_frozen_anchor', name: 'Frozen Anchor Display', description: 'Massive anchor sculpture, +8% durability', slot: 'dock_decoration', rarity: 'rare', icon: '⚓', price: 1500, effects: { durabilityBonus: 0.08 }, requiredLevel: 18, availableInShop: true, craftRecipe: { tokenType: 'coral_gem', tokensRequired: 4 } },
  { id: 'dock_deco_lighthouse', name: 'Mini Lighthouse', description: 'Working miniature lighthouse, +10% night fishing', slot: 'dock_decoration', rarity: 'legendary', icon: '💡', price: 5000, effects: { fishingSpeed: 0.1 }, requiredLevel: 30, availableInShop: true, craftRecipe: { tokenType: 'tide_stone', tokensRequired: 8 } },

  // Inventory Amulets — expand storage space
  { id: 'inv_satchel', name: 'Leather Satchel', description: 'Handy satchel, +5 inventory slots', slot: 'inventory_amulet', rarity: 'common', icon: '👝', price: 100, effects: { inventorySpace: 5 }, requiredLevel: 2, availableInShop: true },
  { id: 'inv_backpack', name: 'Explorer Backpack', description: 'Rugged backpack, +10 inventory slots', slot: 'inventory_amulet', rarity: 'uncommon', icon: '🎒', price: 300, effects: { inventorySpace: 10 }, requiredLevel: 5, availableInShop: true },
  { id: 'inv_crate', name: 'Reinforced Crate', description: 'Extra cargo crate, +15 inventory slots', slot: 'inventory_amulet', rarity: 'rare', icon: '📦', price: 800, effects: { inventorySpace: 15 }, requiredLevel: 10, availableInShop: true, craftRecipe: { tokenType: 'ancient_coin', tokensRequired: 4 } },
  { id: 'inv_barrel', name: 'Mythic Barrel', description: 'Enchanted barrel, +25 inventory slots', slot: 'inventory_amulet', rarity: 'legendary', icon: '🛢️', price: 2500, effects: { inventorySpace: 25 }, requiredLevel: 20, availableInShop: true, craftRecipe: { tokenType: 'whale_bone', tokensRequired: 5 } },
  { id: 'inv_abyssal_hold', name: 'Abyssal Hold', description: 'Void-touched storage, +40 inventory slots', slot: 'inventory_amulet', rarity: 'mythical', icon: '🌀', price: 7000, effects: { inventorySpace: 40 }, requiredLevel: 35, availableInShop: true, craftRecipe: { tokenType: 'abyssal_core', tokensRequired: 8 } },

  // More rare-fish chance cosmetics
  { id: 'acc_lucky_horseshoe', name: 'Lucky Horseshoe', description: 'A genuine horseshoe, +3% rare fish', slot: 'boat_accessory', rarity: 'uncommon', icon: '🧲', price: 350, effects: { rareFishChance: 0.03 }, requiredLevel: 6, availableInShop: true },
  { id: 'acc_four_leaf', name: 'Four-Leaf Clover', description: 'Extremely rare clover, +4% legendary fish', slot: 'boat_accessory', rarity: 'rare', icon: '🍀', price: 1200, effects: { legendaryFishChance: 0.04 }, requiredLevel: 16, availableInShop: true, craftRecipe: { tokenType: 'driftwood_charm', tokensRequired: 5 } },
  { id: 'rod_skin_abyssal', name: 'Abyssal Rod', description: 'Forged in the abyss, +8% mythical fish chance', slot: 'fishing_rod_skin', rarity: 'mythical', icon: '🐉', price: 8000, effects: { mythicalFishChance: 0.08 }, requiredLevel: 38, availableInShop: true, craftRecipe: { tokenType: 'abyssal_core', tokensRequired: 10 } },
  { id: 'skin_phantom', name: 'Phnom Shimmer', description: 'Ghostly hull, +5% XP from all sources', slot: 'boat_skin', rarity: 'legendary', icon: '👻', price: 4500, effects: { xpBonus: 0.05 }, requiredLevel: 26, availableInShop: true, craftRecipe: { tokenType: 'siren_tear', tokensRequired: 6 } },
  { id: 'deco_golden_totem', name: 'Golden Totem', description: 'Ancient totem of abundance, +8% XP bonus', slot: 'fishing_spot', rarity: 'legendary', icon: '🪔', price: 3500, effects: { xpBonus: 0.08, rareFishChance: 0.02 }, requiredLevel: 24, availableInShop: true, craftRecipe: { tokenType: 'viking_rune', tokensRequired: 6 } },
]

// ─── Chat System ────────────────────────────────────────────────────────────
export type ChatChannel = 'world' | 'clan' | 'private'
export type ChatMessageType = 'system' | 'player' | 'private'

export interface ChatMessage {
  id: string
  channel: ChatChannel
  type: ChatMessageType
  senderId: string
  senderName: string
  content: string
  timestamp: number
  recipientId?: string
  recipientName?: string
}

export interface ChatState {
  worldMessages: ChatMessage[]
  clanMessages: ChatMessage[]
  privateMessages: Record<string, ChatMessage[]>  // keyed by other player's ID
  unreadWorld: number
  unreadClan: number
  unreadPrivate: Record<string, number>
  maxMessages: number
}

export function createDefaultChatState(): ChatState {
  return {
    worldMessages: [],
    clanMessages: [],
    privateMessages: {},
    unreadWorld: 0,
    unreadClan: 0,
    unreadPrivate: {},
    maxMessages: 100,
  }
}

// ─── Cooperative Mode ──────────────────────────────────────────────────────
export interface CooperativeSettings {
  enabled: boolean
  maxPlayers: number
  sharedLoot: boolean
  sharedXP: boolean
  sharedGold: boolean
  pvpEnabled: boolean
  friendlyFire: boolean
  tradeBetweenPlayers: boolean
  showOtherPlayers: boolean
  clanEnabled: boolean
  clanTag: string
  allianceEnabled: boolean
  sharedWeather: boolean
  voiceChat: boolean
  minimapSharing: boolean
}

export const DEFAULT_CLAN_NAME = 'The Free Marauders'
export const DEFAULT_CLAN_TAG = 'TFM'

export const DEFAULT_COOPERATIVE_SETTINGS: CooperativeSettings = {
  enabled: false,
  maxPlayers: 4,
  sharedLoot: false,
  sharedXP: true,
  sharedGold: false,
  pvpEnabled: false,
  friendlyFire: false,
  tradeBetweenPlayers: true,
  showOtherPlayers: true,
  clanEnabled: false,
  clanTag: '',
  allianceEnabled: false,
  sharedWeather: false,
  voiceChat: false,
  minimapSharing: true,
}

export interface CooperativePlayer {
  id: string
  name: string
  position: Position
  boatId: string
  level: number
  health: number
  isConnected: boolean
}

export interface CooperativeState {
  sessionId: string | null
  isHost: boolean
  players: CooperativePlayer[]
  settings: CooperativeSettings
}

// ─── Treasure Map System ──────────────────────────────────────────────────
export interface TreasureMap {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
  tokenCost: number
  requiredTokens: { tokenType: TokenType; quantity: number }[]
  rewards: {
    goldMin: number
    goldMax: number
    xpReward: number
    guaranteedTokens: { tokenType: TokenType; quantity: number }[]
    artifactChance: number
    cosmeticChance: number
  }
}

export const TREASURE_MAPS: TreasureMap[] = [
  {
    id: 'map_coastal', name: 'Coastal Waters Map', description: 'Simple map of nearby coastal waters', rarity: 'common',
    tokenCost: 3, requiredTokens: [{ tokenType: 'ancient_coin', quantity: 3 }],
    rewards: { goldMin: 50, goldMax: 150, xpReward: 30, guaranteedTokens: [], artifactChance: 0, cosmeticChance: 0 },
  },
  {
    id: 'map_deep_sea', name: 'Deep Sea Chart', description: 'Navigational chart of deep sea currents', rarity: 'uncommon',
    tokenCost: 5, requiredTokens: [{ tokenType: 'coral_gem', quantity: 3 }, { tokenType: 'pearl_fragment', quantity: 2 }],
    rewards: { goldMin: 100, goldMax: 300, xpReward: 60, guaranteedTokens: [{ tokenType: 'tide_stone', quantity: 2 }], artifactChance: 0.1, cosmeticChance: 0.05 },
  },
  {
    id: 'map_sunken_ship', name: 'Sunken Ship Coordinates', description: 'Coordinates to a famous shipwreck', rarity: 'rare',
    tokenCost: 8, requiredTokens: [{ tokenType: 'ice_crystal', quantity: 3 }, { tokenType: 'viking_rune', quantity: 3 }, { tokenType: 'driftwood_charm', quantity: 2 }],
    rewards: { goldMin: 300, goldMax: 800, xpReward: 120, guaranteedTokens: [{ tokenType: 'whale_bone', quantity: 2 }], artifactChance: 0.25, cosmeticChance: 0.15 },
  },
  {
    id: 'map_ancient_ruins', name: 'Ancient Ruins Map', description: 'Map to sunken ancient civilization ruins', rarity: 'legendary',
    tokenCost: 12, requiredTokens: [{ tokenType: 'whale_bone', quantity: 3 }, { tokenType: 'siren_tear', quantity: 3 }, { tokenType: 'abyssal_core', quantity: 2 }],
    rewards: { goldMin: 800, goldMax: 2000, xpReward: 300, guaranteedTokens: [{ tokenType: 'leviathan_scale', quantity: 1 }], artifactChance: 0.5, cosmeticChance: 0.3 },
  },
  {
    id: 'map_abyssal_trench', name: 'Abyssal Trench Expedition', description: 'The ultimate treasure hunt', rarity: 'mythical',
    tokenCost: 20, requiredTokens: [{ tokenType: 'leviathan_scale', quantity: 5 }, { tokenType: 'abyssal_core', quantity: 5 }, { tokenType: 'siren_tear', quantity: 3 }],
    rewards: { goldMin: 3000, goldMax: 8000, xpReward: 800, guaranteedTokens: [{ tokenType: 'abyssal_core', quantity: 3 }, { tokenType: 'leviathan_scale', quantity: 2 }], artifactChance: 0.8, cosmeticChance: 0.6 },
  },
]
