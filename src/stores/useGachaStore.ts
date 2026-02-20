import { create } from 'zustand'
import { getStoredObject, setStoredObject } from '../services/storageService'
import { storage } from '../services/storageService'
import type { GachaPull } from '../types/gacha'
import { performPull } from '../services/gachaService'

const OWNED_KEY = 'ownedItems'
const PITY_KEY = 'gachaPity'
const HISTORY_KEY = 'gachaHistory'

interface GachaStore {
  ownedItemIds: string[]
  pityCount: number
  pullHistory: GachaPull[]
  doPull: () => GachaPull
  getTotalPulls: () => number
}

export const useGachaStore = create<GachaStore>((set, get) => ({
  ownedItemIds: getStoredObject<string[]>(OWNED_KEY, [
    'skin_digital_basic',
    'skin_analog_basic',
  ]),
  pityCount: storage.getNumber(PITY_KEY) ?? 0,
  pullHistory: getStoredObject<GachaPull[]>(HISTORY_KEY, []),

  doPull: () => {
    const { pityCount, ownedItemIds, pullHistory } = get()
    const result = performPull(pityCount, ownedItemIds)

    const newPity = result.item.rarity === 'epic' || result.item.rarity === 'legendary'
      ? 0
      : pityCount + 1
    const newOwned = result.isNew
      ? [...ownedItemIds, result.item.id]
      : ownedItemIds
    const newHistory = [result, ...pullHistory].slice(0, 100)

    storage.set(PITY_KEY, newPity)
    setStoredObject(OWNED_KEY, newOwned)
    setStoredObject(HISTORY_KEY, newHistory)
    set({
      pityCount: newPity,
      ownedItemIds: newOwned,
      pullHistory: newHistory,
    })

    return result
  },

  getTotalPulls: () => get().pullHistory.length,
}))
