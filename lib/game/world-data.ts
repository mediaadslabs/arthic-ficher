import type { Country, Location, Job, Position } from './types'

// Arctic region countries for the game
export const COUNTRIES: Country[] = [
  {
    id: 'norway',
    name: 'Norway',
    position: { x: 20, y: 0, z: -30 },
    color: '#1e3a5f',
    isSpawnPoint: true,
  },
  {
    id: 'iceland',
    name: 'Iceland',
    position: { x: -40, y: 0, z: -20 },
    color: '#2d4a6f',
    isSpawnPoint: true,
  },
  {
    id: 'greenland',
    name: 'Greenland',
    position: { x: -80, y: 0, z: -50 },
    color: '#3d5a7f',
    isSpawnPoint: true,
  },
  {
    id: 'alaska',
    name: 'Alaska',
    position: { x: -120, y: 0, z: -40 },
    color: '#4d6a8f',
    isSpawnPoint: true,
  },
  {
    id: 'canada',
    name: 'Northern Canada',
    position: { x: -90, y: 0, z: -70 },
    color: '#5d7a9f',
    isSpawnPoint: true,
  },
  {
    id: 'russia',
    name: 'Arctic Russia',
    position: { x: 80, y: 0, z: -60 },
    color: '#3d5a7f',
    isSpawnPoint: true,
  },
  {
    id: 'svalbard',
    name: 'Svalbard',
    position: { x: 30, y: 0, z: -70 },
    color: '#4d6a8f',
    isSpawnPoint: false,
  },
  {
    id: 'finland',
    name: 'Finland',
    position: { x: 50, y: 0, z: -25 },
    color: '#2d4a6f',
    isSpawnPoint: true,
  },
  {
    id: 'faroe',
    name: 'Faroe Islands',
    position: { x: -10, y: 0, z: -50 },
    color: '#1a4a3f',
    isSpawnPoint: true,
  },
  {
    id: 'jan_mayen',
    name: 'Jan Mayen',
    position: { x: -5, y: 0, z: -90 },
    color: '#2a3a5f',
    isSpawnPoint: false,
  },
  {
    id: 'nova_zembla',
    name: 'Novaya Zemlya',
    position: { x: 100, y: 0, z: -80 },
    color: '#4a2a4f',
    isSpawnPoint: false,
  },
]

// Game locations (inns, marketplaces, docks, fishing zones)
export const LOCATIONS: Location[] = [
  // Norway
  {
    id: 'norway_inn',
    type: 'inn',
    name: "Fisherman's Rest",
    position: { x: 18, y: 0, z: -28 },
    countryId: 'norway',
  },
  {
    id: 'norway_market',
    type: 'marketplace',
    name: 'Bergen Harbor Market',
    position: { x: 22, y: 0, z: -26 },
    countryId: 'norway',
  },
  {
    id: 'norway_dock',
    type: 'dock',
    name: 'Bergen Dock',
    position: { x: 20, y: 0, z: -32 },
    countryId: 'norway',
  },
  {
    id: 'norway_fishing',
    type: 'fishing_zone',
    name: 'Norwegian Sea',
    position: { x: 15, y: 0, z: -40 },
    countryId: 'norway',
  },
  
  // Iceland
  {
    id: 'iceland_inn',
    type: 'inn',
    name: 'Viking Lodge',
    position: { x: -42, y: 0, z: -18 },
    countryId: 'iceland',
  },
  {
    id: 'iceland_market',
    type: 'marketplace',
    name: 'Reykjavik Fish Market',
    position: { x: -38, y: 0, z: -22 },
    countryId: 'iceland',
  },
  {
    id: 'iceland_dock',
    type: 'dock',
    name: 'Reykjavik Harbor',
    position: { x: -40, y: 0, z: -24 },
    countryId: 'iceland',
  },
  {
    id: 'iceland_fishing',
    type: 'fishing_zone',
    name: 'Iceland Basin',
    position: { x: -45, y: 0, z: -30 },
    countryId: 'iceland',
  },
  
  // Greenland
  {
    id: 'greenland_inn',
    type: 'inn',
    name: 'Arctic Haven',
    position: { x: -78, y: 0, z: -48 },
    countryId: 'greenland',
  },
  {
    id: 'greenland_market',
    type: 'marketplace',
    name: 'Nuuk Trading Post',
    position: { x: -82, y: 0, z: -52 },
    countryId: 'greenland',
  },
  {
    id: 'greenland_dock',
    type: 'dock',
    name: 'Nuuk Dock',
    position: { x: -80, y: 0, z: -54 },
    countryId: 'greenland',
  },
  {
    id: 'greenland_fishing',
    type: 'fishing_zone',
    name: 'Greenland Sea',
    position: { x: -75, y: 0, z: -60 },
    countryId: 'greenland',
  },
  
  // Alaska
  {
    id: 'alaska_inn',
    type: 'inn',
    name: 'Deadliest Catch Inn',
    position: { x: -118, y: 0, z: -38 },
    countryId: 'alaska',
  },
  {
    id: 'alaska_market',
    type: 'marketplace',
    name: 'Dutch Harbor Market',
    position: { x: -122, y: 0, z: -42 },
    countryId: 'alaska',
  },
  {
    id: 'alaska_dock',
    type: 'dock',
    name: 'Dutch Harbor',
    position: { x: -120, y: 0, z: -44 },
    countryId: 'alaska',
  },
  {
    id: 'alaska_fishing',
    type: 'fishing_zone',
    name: 'Bering Sea',
    position: { x: -125, y: 0, z: -50 },
    countryId: 'alaska',
  },
  
  // Russia
  {
    id: 'russia_inn',
    type: 'inn',
    name: 'Murmansk Lodge',
    position: { x: 78, y: 0, z: -58 },
    countryId: 'russia',
  },
  {
    id: 'russia_market',
    type: 'marketplace',
    name: 'Murmansk Fish Exchange',
    position: { x: 82, y: 0, z: -62 },
    countryId: 'russia',
  },
  {
    id: 'russia_dock',
    type: 'dock',
    name: 'Murmansk Port',
    position: { x: 80, y: 0, z: -64 },
    countryId: 'russia',
  },
  {
    id: 'russia_fishing',
    type: 'fishing_zone',
    name: 'Barents Sea',
    position: { x: 75, y: 0, z: -70 },
    countryId: 'russia',
  },
  
  // Norway Garage & Treasure Hunt
  {
    id: 'norway_garage',
    type: 'garage',
    name: 'Arctic Boat Garage',
    position: { x: 24, y: 0, z: -30 },
    countryId: 'norway',
  },
  {
    id: 'norway_treasure',
    type: 'treasure_hunt',
    name: 'Treasure Hunter Outpost',
    position: { x: 16, y: 0, z: -24 },
    countryId: 'norway',
  },
  
  // Alaska Garage & Treasure Hunt
  {
    id: 'alaska_garage',
    type: 'garage',
    name: 'Bering Boat Works',
    position: { x: -116, y: 0, z: -36 },
    countryId: 'alaska',
  },
  {
    id: 'alaska_treasure',
    type: 'treasure_hunt',
    name: 'Gold Rush Relics',
    position: { x: -124, y: 0, z: -46 },
    countryId: 'alaska',
  },
  
  // Iceland Garage & Treasure Hunt
  {
    id: 'iceland_garage',
    type: 'garage',
    name: 'Viking Shipyard',
    position: { x: -36, y: 0, z: -16 },
    countryId: 'iceland',
  },
  {
    id: 'iceland_treasure',
    type: 'treasure_hunt',
    name: 'Norse Treasure Cove',
    position: { x: -44, y: 0, z: -26 },
    countryId: 'iceland',
  },
  
  // Russia Garage & Treasure Hunt
  {
    id: 'russia_garage',
    type: 'garage',
    name: 'Soviet Dry Dock',
    position: { x: 84, y: 0, z: -56 },
    countryId: 'russia',
  },
  {
    id: 'russia_treasure',
    type: 'treasure_hunt',
    name: 'Sunken Fleet Graves',
    position: { x: 76, y: 0, z: -66 },
    countryId: 'russia',
  },
  
  // Greenland Garage & Treasure Hunt
  {
    id: 'greenland_garage',
    type: 'garage',
    name: 'Ice Harbor Garage',
    position: { x: -76, y: 0, z: -46 },
    countryId: 'greenland',
  },
  {
    id: 'greenland_treasure',
    type: 'treasure_hunt',
    name: 'Glacier Ruins',
    position: { x: -84, y: 0, z: -56 },
    countryId: 'greenland',
  },
  
  // Faroe Islands
  {
    id: 'faroe_inn',
    type: 'inn',
    name: 'Shepherd Inn',
    position: { x: -12, y: 0, z: -48 },
    countryId: 'faroe',
  },
  {
    id: 'faroe_market',
    type: 'marketplace',
    name: 'Torshavn Market',
    position: { x: -8, y: 0, z: -52 },
    countryId: 'faroe',
  },
  {
    id: 'faroe_dock',
    type: 'dock',
    name: 'Klaksvik Harbor',
    position: { x: -10, y: 0, z: -54 },
    countryId: 'faroe',
  },
  {
    id: 'faroe_fishing',
    type: 'fishing_zone',
    name: 'Faroe Trench',
    position: { x: -15, y: 0, z: -58 },
    countryId: 'faroe',
  },
  {
    id: 'faroe_garage',
    type: 'garage',
    name: 'Viking Shipyard',
    position: { x: -6, y: 0, z: -46 },
    countryId: 'faroe',
  },
  {
    id: 'faroe_treasure',
    type: 'treasure_hunt',
    name: 'Sunken Viking Fleet',
    position: { x: -14, y: 0, z: -56 },
    countryId: 'faroe',
  },
  
  // Jan Mayen
  {
    id: 'jan_mayen_inn',
    type: 'inn',
    name: 'Olonkin Lodge',
    position: { x: -7, y: 0, z: -88 },
    countryId: 'jan_mayen',
  },
  {
    id: 'jan_mayen_market',
    type: 'marketplace',
    name: 'Olonkin Trading Post',
    position: { x: -3, y: 0, z: -92 },
    countryId: 'jan_mayen',
  },
  {
    id: 'jan_mayen_dock',
    type: 'dock',
    name: 'Olonkin Harbor',
    position: { x: -5, y: 0, z: -94 },
    countryId: 'jan_mayen',
  },
  {
    id: 'jan_mayen_fishing',
    type: 'fishing_zone',
    name: 'Jan Mayen Deep',
    position: { x: -10, y: 0, z: -98 },
    countryId: 'jan_mayen',
  },
  {
    id: 'jan_mayen_treasure',
    type: 'treasure_hunt',
    name: 'Beerenberg Ruins',
    position: { x: 0, y: 0, z: -86 },
    countryId: 'jan_mayen',
  },
  
  // Novaya Zemlya
  {
    id: 'nova_inn',
    type: 'inn',
    name: 'Arctic Outpost',
    position: { x: 98, y: 0, z: -78 },
    countryId: 'nova_zembla',
  },
  {
    id: 'nova_market',
    type: 'marketplace',
    name: 'Rogachevo Market',
    position: { x: 102, y: 0, z: -82 },
    countryId: 'nova_zembla',
  },
  {
    id: 'nova_dock',
    type: 'dock',
    name: 'Rogachevo Dock',
    position: { x: 100, y: 0, z: -84 },
    countryId: 'nova_zembla',
  },
  {
    id: 'nova_fishing',
    type: 'fishing_zone',
    name: 'Kara Sea',
    position: { x: 105, y: 0, z: -88 },
    countryId: 'nova_zembla',
  },
  {
    id: 'nova_treasure',
    type: 'treasure_hunt',
    name: 'Frozen Graveyard',
    position: { x: 96, y: 0, z: -82 },
    countryId: 'nova_zembla',
  },
  
  // Repair shops in key regions
  {
    id: 'norway_repair',
    type: 'repair',
    name: 'Bergen Shipwright',
    position: { x: 26, y: 0, z: -32 },
    countryId: 'norway',
  },
  {
    id: 'alaska_repair',
    type: 'repair',
    name: 'Dutch Harbor Repairs',
    position: { x: -126, y: 0, z: -38 },
    countryId: 'alaska',
  },
  {
    id: 'russia_repair',
    type: 'repair',
    name: 'Murmansk Dry Dock',
    position: { x: 74, y: 0, z: -56 },
    countryId: 'russia',
  },
  
  // Crew hiring offices
  {
    id: 'norway_crew',
    type: 'crew',
    name: 'Viking Crew Hall',
    position: { x: 14, y: 0, z: -26 },
    countryId: 'norway',
  },
  {
    id: 'iceland_crew',
    type: 'crew',
    name: 'Reykjavik Guild',
    position: { x: -46, y: 0, z: -20 },
    countryId: 'iceland',
  },
  {
    id: 'faroe_crew',
    type: 'crew',
    name: 'Faroe Seamen Office',
    position: { x: -16, y: 0, z: -50 },
    countryId: 'faroe',
  },
  
  // Challenge/Competition boards
  {
    id: 'norway_challenges',
    type: 'challenges',
    name: 'Fisherman Guild Board',
    position: { x: 22, y: 0, z: -24 },
    countryId: 'norway',
  },
  {
    id: 'alaska_challenges',
    type: 'challenges',
    name: 'Deadliest Catch Board',
    position: { x: -114, y: 0, z: -40 },
    countryId: 'alaska',
  },
  {
    id: 'iceland_challenges',
    type: 'challenges',
    name: 'Viking Challenge Hall',
    position: { x: -34, y: 0, z: -18 },
    countryId: 'iceland',
  },
  
  // Underwater wreck sites for treasure hunting
  {
    id: 'viking_wreck',
    type: 'treasure_hunt',
    name: 'Sunken Longship',
    position: { x: 50, y: 0, z: -60 },
    countryId: 'norway',
  },
  {
    id: 'whaler_wreck',
    type: 'treasure_hunt',
    name: 'Old Whaler Wreck',
    position: { x: -80, y: 0, z: -70 },
    countryId: 'greenland',
  },
  {
    id: 'soviet_wreck',
    type: 'treasure_hunt',
    name: 'Soviet Submarine',
    position: { x: 60, y: 0, z: -45 },
    countryId: 'russia',
  },
  {
    id: 'pirate_wreck',
    type: 'treasure_hunt',
    name: 'Pirate Galleon',
    position: { x: -50, y: 0, z: -80 },
    countryId: 'iceland',
  },
  {
    id: 'modern_wreck',
    type: 'treasure_hunt',
    name: 'Cargo Ship Wreck',
    position: { x: -140, y: 0, z: -50 },
    countryId: 'alaska',
  },
  {
    id: 'explorer_wreck',
    type: 'treasure_hunt',
    name: 'Lost Explorer Vessel',
    position: { x: 110, y: 0, z: -100 },
    countryId: 'nova_zembla',
  },

  // ─── Secret Locations (discoverable via tokens) ────────────────────────
  {
    id: 'secret_ice_cavern',
    type: 'secret',
    name: 'Frozen Cavern Entrance',
    position: { x: 55, y: 0, z: -110 },
    countryId: 'svalbard',
    requiredTokens: [{ tokenType: 'ice_crystal', quantity: 5 }],
    discoveryReward: { gold: 300, xp: 150 },
  },
  {
    id: 'secret_hot_springs',
    type: 'secret',
    name: 'Geothermal Hot Springs',
    position: { x: -30, y: 0, z: -5 },
    countryId: 'iceland',
    requiredTokens: [{ tokenType: 'coral_gem', quantity: 4 }],
    discoveryReward: { gold: 200, xp: 100 },
  },
  {
    id: 'secret_pirate_cove',
    type: 'secret',
    name: 'Hidden Pirate Cove',
    position: { x: -110, y: 0, z: -90 },
    countryId: 'canada',
    requiredTokens: [{ tokenType: 'ancient_coin', quantity: 8 }],
    discoveryReward: { gold: 500, xp: 250 },
  },
  {
    id: 'secret_whale_graveyard',
    type: 'secret',
    name: 'Whale Graveyard',
    position: { x: -60, y: 0, z: -110 },
    countryId: 'greenland',
    requiredTokens: [{ tokenType: 'whale_bone', quantity: 3 }],
    discoveryReward: { gold: 400, xp: 200 },
  },
  {
    id: 'secret_abyssal_vent',
    type: 'secret',
    name: 'Abyssal Hydrothermal Vent',
    position: { x: 130, y: 0, z: -120 },
    countryId: 'nova_zembla',
    requiredTokens: [{ tokenType: 'abyssal_core', quantity: 3 }],
    discoveryReward: { gold: 800, xp: 400 },
  },
  {
    id: 'secret_siren_grotto',
    type: 'secret',
    name: "Siren's Hidden Grotto",
    position: { x: -150, y: 0, z: -30 },
    countryId: 'alaska',
    requiredTokens: [{ tokenType: 'siren_tear', quantity: 2 }],
    discoveryReward: { gold: 600, xp: 350 },
  },
  {
    id: 'secret_viking_tomb',
    type: 'secret',
    name: 'Ancient Viking Tomb',
    position: { x: 45, y: 0, z: -15 },
    countryId: 'norway',
    requiredTokens: [{ tokenType: 'viking_rune', quantity: 4 }],
    discoveryReward: { gold: 350, xp: 180 },
  },
  {
    id: 'secret_leviathan_lair',
    type: 'secret',
    name: 'Leviathan Resting Grounds',
    position: { x: 0, y: 0, z: -150 },
    countryId: 'faroe',
    requiredTokens: [{ tokenType: 'leviathan_scale', quantity: 3 }, { tokenType: 'abyssal_core', quantity: 2 }],
    discoveryReward: { gold: 1200, xp: 600 },
  },
]

// Job templates that inns can offer
export const JOB_TEMPLATES: Omit<Job, 'id'>[] = [
  // Easy jobs
  {
    title: 'Cod Delivery',
    description: 'The local restaurant needs fresh Arctic Cod for tonight.',
    requirements: [{ fishId: 'arctic_cod', quantity: 5 }],
    reward: { gold: 50, xp: 25 },
    difficulty: 'easy',
  },
  {
    title: 'Salmon Run',
    description: 'Catch some Arctic Salmon for the market.',
    requirements: [{ fishId: 'salmon', quantity: 3 }],
    reward: { gold: 45, xp: 20 },
    difficulty: 'easy',
  },
  {
    title: 'Char Fishing',
    description: 'Arctic Char are in season - catch some!',
    requirements: [{ fishId: 'arctic_char', quantity: 4 }],
    reward: { gold: 100, xp: 40 },
    difficulty: 'easy',
  },
  
  // Medium jobs
  {
    title: 'Halibut Hunter',
    description: 'A wealthy merchant wants premium Halibut.',
    requirements: [{ fishId: 'halibut', quantity: 3 }],
    reward: { gold: 75, xp: 50 },
    difficulty: 'medium',
  },
  {
    title: 'Snow Crab Order',
    description: 'The fancy restaurant needs Snow Crabs.',
    requirements: [{ fishId: 'snow_crab', quantity: 5 }],
    reward: { gold: 175, xp: 80 },
    difficulty: 'medium',
  },
  {
    title: 'Mixed Catch',
    description: 'Bring a variety of fish for the fish market.',
    requirements: [
      { fishId: 'arctic_cod', quantity: 3 },
      { fishId: 'salmon', quantity: 2 },
    ],
    reward: { gold: 85, xp: 45 },
    difficulty: 'medium',
  },
  {
    title: 'Wolffish Wanted',
    description: 'A collector is looking for rare Wolffish.',
    requirements: [{ fishId: 'wolffish', quantity: 2 }],
    reward: { gold: 120, xp: 70 },
    difficulty: 'medium',
  },
  
  // Hard jobs
  {
    title: 'King Crab Haul',
    description: 'The governor is hosting a feast and needs King Crabs.',
    requirements: [{ fishId: 'king_crab', quantity: 5 }],
    reward: { gold: 400, xp: 150 },
    difficulty: 'hard',
  },
  {
    title: 'Legendary Catch',
    description: 'Capture a Giant Pacific Octopus for the aquarium.',
    requirements: [{ fishId: 'giant_octopus', quantity: 1 }],
    reward: { gold: 500, xp: 200 },
    difficulty: 'hard',
  },
  {
    title: 'Ultimate Haul',
    description: 'Fill a large order with premium seafood.',
    requirements: [
      { fishId: 'king_crab', quantity: 3 },
      { fishId: 'halibut', quantity: 2 },
      { fishId: 'wolffish', quantity: 1 },
    ],
    reward: { gold: 600, xp: 250 },
    difficulty: 'hard',
  },
  
  // New jobs for new fish species
  {
    title: 'Lumpfish Delivery',
    description: 'A local chef wants fresh lumpfish for roe.',
    requirements: [{ fishId: 'lumpfish', quantity: 8 }],
    reward: { gold: 80, xp: 30 },
    difficulty: 'easy',
  },
  {
    title: 'Capelin Run',
    description: 'Bulk order of capelin for processing.',
    requirements: [{ fishId: 'capelin', quantity: 20 }],
    reward: { gold: 75, xp: 35 },
    difficulty: 'easy',
  },
  {
    title: 'Redfish Special',
    description: 'A restaurant wants ocean perch for tonight.',
    requirements: [{ fishId: 'redfish', quantity: 4 }],
    reward: { gold: 90, xp: 45 },
    difficulty: 'easy',
  },
  {
    title: 'Skate Order',
    description: 'A collector wants fresh Arctic skate.',
    requirements: [{ fishId: 'skate', quantity: 3 }],
    reward: { gold: 85, xp: 50 },
    difficulty: 'medium',
  },
  {
    title: 'Shrimp Haul',
    description: 'Premium Arctic shrimp for the market.',
    requirements: [{ fishId: 'blue_whale_shrimp', quantity: 5 }],
    reward: { gold: 400, xp: 120 },
    difficulty: 'medium',
  },
  {
    title: 'Sea Cucumber Quest',
    description: 'An Asian restaurant pays top dollar for sea cucumber.',
    requirements: [{ fishId: 'sea_cucumber', quantity: 4 }],
    reward: { gold: 150, xp: 70 },
    difficulty: 'medium',
  },
  {
    title: 'Deep Sea Angler',
    description: 'A museum wants a deep sea angler for display.',
    requirements: [{ fishId: 'anglerfish', quantity: 2 }],
    reward: { gold: 120, xp: 80 },
    difficulty: 'medium',
  },
  {
    title: 'Atlantic Halibut Haul',
    description: 'The governor wants premium Atlantic halibut.',
    requirements: [{ fishId: 'atlantic_halibut', quantity: 3 }],
    reward: { gold: 200, xp: 100 },
    difficulty: 'hard',
  },
  {
    title: 'Greenland Shark Hunt',
    description: 'A researcher needs Greenland shark samples.',
    requirements: [{ fishId: 'greenland_shark', quantity: 1 }],
    reward: { gold: 500, xp: 200 },
    difficulty: 'hard',
  },
  {
    title: 'Blobfish Expedition',
    description: 'A scientist wants a live blobfish specimen.',
    requirements: [{ fishId: 'blobfish', quantity: 1 }],
    reward: { gold: 400, xp: 180 },
    difficulty: 'hard',
  },
  {
    title: 'Mythical Narwhal Quest',
    description: 'Find the legendary narwhal tusk fragment.',
    requirements: [{ fishId: 'narwhal_tusk', quantity: 1 }],
    reward: { gold: 1000, xp: 500 },
    difficulty: 'hard',
  },
  {
    title: 'Kraken Hunt',
    description: 'Hunt the mythical kraken tentacle.',
    requirements: [{ fishId: 'kraken_tentacle', quantity: 1 }],
    reward: { gold: 2000, xp: 800 },
    difficulty: 'hard',
  },
  {
    title: 'Ambergris Treasure',
    description: 'Find the rare sperm whale ambergris.',
    requirements: [{ fishId: 'sperm_ambergris', quantity: 1 }],
    reward: { gold: 2500, xp: 1000 },
    difficulty: 'hard',
  },
]

// Generate a random job from templates
export function generateJob(difficulty?: 'easy' | 'medium' | 'hard'): Job {
  const filtered = difficulty
    ? JOB_TEMPLATES.filter((j) => j.difficulty === difficulty)
    : JOB_TEMPLATES
  
  const template = filtered[Math.floor(Math.random() * filtered.length)]
  
  return {
    ...template,
    id: crypto.randomUUID(),
  }
}

// Get available jobs for an inn
export function getInnJobs(innId: string, playerLevel: number): Job[] {
  const jobs: Job[] = []
  
  // Always offer easy jobs
  jobs.push(generateJob('easy'))
  
  // Medium jobs at level 3+
  if (playerLevel >= 3) {
    jobs.push(generateJob('medium'))
  }
  
  // Hard jobs at level 10+
  if (playerLevel >= 10) {
    jobs.push(generateJob('hard'))
  }
  
  return jobs
}

// Get a random spawn country
export function getRandomSpawnCountry(): Country {
  const spawnCountries = COUNTRIES.filter((c) => c.isSpawnPoint)
  return spawnCountries[Math.floor(Math.random() * spawnCountries.length)]
}

// Get spawn position near a country
export function getSpawnPosition(country: Country): Position {
  const offset = {
    x: (Math.random() - 0.5) * 10,
    y: 0.5 + Math.random() * 0.5, // Spawn on top of land (land is at y=0.3-1.1)
    z: (Math.random() - 0.5) * 10,
  }
  
  return {
    x: country.position.x + offset.x,
    y: country.position.y + offset.y,
    z: country.position.z + offset.z,
  }
}

// Get nearest location of a specific type
export function getNearestLocation(
  position: Position,
  type: Location['type']
): Location | null {
  const locations = LOCATIONS.filter((l) => l.type === type)
  
  if (locations.length === 0) return null
  
  let nearest = locations[0]
  let nearestDistance = Infinity
  
  for (const loc of locations) {
    const dx = loc.position.x - position.x
    const dz = loc.position.z - position.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    
    if (distance < nearestDistance) {
      nearest = loc
      nearestDistance = distance
    }
  }
  
  return nearest
}

// Check if player is near a location
export function isNearLocation(
  playerPosition: Position,
  locationPosition: Position,
  threshold: number = 5
): boolean {
  const dx = playerPosition.x - locationPosition.x
  const dz = playerPosition.z - locationPosition.z
  const distance = Math.sqrt(dx * dx + dz * dz)
  return distance <= threshold
}
