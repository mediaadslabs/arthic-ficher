import { useGameStore } from '../lib/game/store';
import { getXPForLevel } from '../lib/game/types';

describe('GameStore core functionality', () => {
  const spawnPos = { x: 0, y: 0, z: 0 };

  beforeEach(() => {
    // Reset store state by reinitializing player and clearing other state
    const store = useGameStore.getState();
    store.initializePlayer('TestPlayer', spawnPos);
  });

  test('initializePlayer creates a player with the given name', () => {
    const { player } = useGameStore.getState();
    expect(player).not.toBeNull();
    expect(player?.name).toBe('TestPlayer');
  });

  test('addGold adds gold correctly (no bonus)', () => {
    const store = useGameStore.getState();
    const initialGold = store.player?.gold ?? 0;
    store.addGold(100);
    const { player } = useGameStore.getState();
    expect(player?.gold).toBe(initialGold + 100);
  });

  test('spendGold reduces gold and returns true when affordable', () => {
    const store = useGameStore.getState();
    const initialGold = store.player?.gold ?? 0;
    const result = store.spendGold(20);
    expect(result).toBe(true);
    const { player } = useGameStore.getState();
    expect(player?.gold).toBe(initialGold - 20);
  });

  test('addXP levels up the player appropriately', () => {
    const store = useGameStore.getState();
    const xpToNext = store.player?.xpToNextLevel ?? 0;
    // Add enough XP to exceed current level requirement
    const addedXP = xpToNext + 50; // Should cause a level up
    store.addXP(addedXP);
    const { player } = useGameStore.getState();
    expect(player?.level).toBeGreaterThan(1);
    expect(player?.xp).toBeGreaterThanOrEqual(addedXP);
  });

  test('buyBoat purchases a boat and updates gold', () => {
    const store = useGameStore.getState();
    // Ensure sufficient gold
    store.addGold(200);
    // Re-fetch player state after addGold to ensure goldBefore is accurate
    let { player: playerAfterAdd } = useGameStore.getState();
    const goldBefore = playerAfterAdd?.gold ?? 0;

    const success = store.buyBoat('dinghy');
    expect(success).toBe(true);

    const { player: playerAfterBuy } = useGameStore.getState(); // Get the final player state
    expect(playerAfterBuy?.ownedBoats.length).toBe(1);
    expect(playerAfterBuy?.currentBoatId).toBeDefined();
    // Dinghy costs 100
    expect(playerAfterBuy?.gold).toBe(goldBefore - 100); // Expect 150 == 250 - 100
  });

  test('upgradeBoat upgrades engine level and deducts gold', () => {
    const store = useGameStore.getState();
    
    // Add initial gold
    store.addGold(200); // Gold becomes 250.
    // Ensure state is updated after addGold
    let { player: playerAfterAdd } = useGameStore.getState();
    const goldAfterAdd = playerAfterAdd?.gold ?? 0; // Should be 250

    // Buy the boat
    const buySuccess = store.buyBoat('dinghy'); // Costs 100.
    expect(buySuccess).toBe(true);
    
    // Ensure state is updated after buyBoat
    const { player: playerAfterBuy } = useGameStore.getState();
    const goldBeforeUpgrade = playerAfterBuy?.gold ?? 0; // Should be 150 (250 - 100)

    const boat = store.getCurrentBoat?.();
    expect(boat).toBeDefined();
    const boatId = boat?.id as string;

    // Upgrade the boat
    const upgradeSuccess = store.upgradeBoat(boatId, 'engine'); // Costs 100.
    expect(upgradeSuccess).toBe(true);

    const upgradedBoat = store.getCurrentBoat?.();
    expect(upgradedBoat?.upgrades.engine).toBe(1);

    // Engine upgrade costs 100 (level 0 -> 1)
    const { player: playerAfterUpgrade } = useGameStore.getState(); // Final state. Gold should be 50.
    // Assertion: Final gold should be goldBeforeUpgrade - 100
    expect(playerAfterUpgrade?.gold).toBe(goldBeforeUpgrade - 100); // Expecting 50 == 150 - 100
  });

  test('tickGameTime advances time correctly', () => {
    const store = useGameStore.getState();
    const initialHour = store.player?.time.hour ?? 0;
    // Add 60 "seconds" which the store treats as minutes
    store.tickGameTime(60);
    const { player } = useGameStore.getState();
    const newHour = player?.time.hour ?? 0;
    expect(newHour).toBe((initialHour + 1) % 24);
  });
});
