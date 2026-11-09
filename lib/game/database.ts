import Dexie, { type EntityTable } from 'dexie'
import type { SaveData } from './types'

// Database for Arctic Fisher save system
class ArcticFisherDB extends Dexie {
  saves!: EntityTable<SaveData, 'id'>

  constructor() {
    super('ArcticFisherDB')
    this.version(1).stores({
      saves: '++id, slotNumber, name, timestamp',
    })
    this.version(2).upgrade(tx => {
      return tx.table('saves').toCollection().modify(save => {
        if (save.player) {
          save.player.ownedUpgrades = save.player.ownedUpgrades || []
          save.player.tradeMarket = save.player.tradeMarket || []
          save.player.inventory = save.player.inventory || []
        }
      })
    })
  }
}

export const db = new ArcticFisherDB()

// Save game to a specific slot (1-5)
export async function saveGame(saveData: Omit<SaveData, 'id'>): Promise<number> {
  // Check if slot already has a save
  const existingSave = await db.saves.where('slotNumber').equals(saveData.slotNumber).first()
  
  if (existingSave) {
    // Update existing save
    const id = existingSave.id as number
    await db.saves.update(id, saveData)
    return id
  } else {
    // Create new save
    const newId = await db.saves.add(saveData as SaveData)
    return newId as number
  }
}

// Load game from a specific slot
export async function loadGame(slotNumber: number): Promise<SaveData | undefined> {
  return await db.saves.where('slotNumber').equals(slotNumber).first()
}

// Get all saves
export async function getAllSaves(): Promise<SaveData[]> {
  return await db.saves.orderBy('slotNumber').toArray()
}

// Delete a save
export async function deleteSave(slotNumber: number): Promise<void> {
  await db.saves.where('slotNumber').equals(slotNumber).delete()
}

// Check if any saves exist
export async function hasSaves(): Promise<boolean> {
  const count = await db.saves.count()
  return count > 0
}

// Get save slots status
export async function getSaveSlots(): Promise<(SaveData | null)[]> {
  const slots: (SaveData | null)[] = [null, null, null, null, null]
  const saves = await getAllSaves()
  
  for (const save of saves) {
    if (save.slotNumber >= 1 && save.slotNumber <= 5) {
      slots[save.slotNumber - 1] = save
    }
  }
  
  return slots
}

// Auto-save to a dedicated slot (slot 0 is auto-save)
export async function autoSave(saveData: Omit<SaveData, 'id' | 'slotNumber'>): Promise<number> {
  return await saveGame({
    ...saveData,
    slotNumber: 0, // Reserved for auto-save
  })
}

// Load auto-save
export async function loadAutoSave(): Promise<SaveData | undefined> {
  return await loadGame(0)
}
