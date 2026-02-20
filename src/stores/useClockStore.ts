import { create } from 'zustand'
import { getStoredObject, setStoredObject } from '../services/storageService'
import type { ClockSkin } from '../types/store'
import { DEFAULT_CLOCK_SKINS } from '../constants/gachaConfig'

const STORAGE_KEY = 'clockSkins'

interface ClockStore {
  skins: ClockSkin[]
  addSkin: (skinId: string) => void
  getSkinById: (skinId: string) => ClockSkin | undefined
}

export const useClockStore = create<ClockStore>((set, get) => {
  const defaultSkins: ClockSkin[] = DEFAULT_CLOCK_SKINS.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.id.includes('analog') ? 'analog' as const : 'digital' as const,
    rarity: item.rarity,
    isOwned: item.id === 'skin_digital_basic' || item.id === 'skin_analog_basic',
  }))

  return {
    skins: getStoredObject<ClockSkin[]>(STORAGE_KEY, defaultSkins),

    addSkin: (skinId) => {
      const updatedSkins = get().skins.map((skin) => {
        if (skin.id !== skinId) return skin
        return { ...skin, isOwned: true }
      })
      setStoredObject(STORAGE_KEY, updatedSkins)
      set({ skins: updatedSkins })
    },

    getSkinById: (skinId) => {
      return get().skins.find((s) => s.id === skinId)
    },
  }
})
