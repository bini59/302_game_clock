import { create } from 'zustand'
import { storage } from '../services/storageService'
import { AD_FREE_DURATION_MS } from '../constants/gameConfig'

interface AdFreeStore {
  adFreeUntil: number
  coinBoosterUntil: number
  isAdFree: () => boolean
  hasCoinBooster: () => boolean
  activateAdFree: () => void
  activateCoinBooster: () => void
  getRemainingAdFreeTime: () => string
}

export const useAdFreeStore = create<AdFreeStore>((set, get) => ({
  adFreeUntil: storage.getNumber('adFreeUntil') ?? 0,
  coinBoosterUntil: storage.getNumber('coinBoosterUntil') ?? 0,

  isAdFree: () => Date.now() < get().adFreeUntil,

  hasCoinBooster: () => Date.now() < get().coinBoosterUntil,

  activateAdFree: () => {
    const until = Date.now() + AD_FREE_DURATION_MS
    storage.set('adFreeUntil', until)
    set({ adFreeUntil: until })
  },

  activateCoinBooster: () => {
    const until = Date.now() + 60 * 60 * 1000
    storage.set('coinBoosterUntil', until)
    set({ coinBoosterUntil: until })
  },

  getRemainingAdFreeTime: () => {
    const remaining = get().adFreeUntil - Date.now()
    if (remaining <= 0) return ''
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}시간 ${minutes}분 남음`
  },
}))
