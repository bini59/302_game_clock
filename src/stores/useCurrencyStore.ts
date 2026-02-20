import { create } from 'zustand'
import { storage } from '../services/storageService'

interface CurrencyStore {
  coins: number
  gems: number
  addCoins: (amount: number) => void
  addGems: (amount: number) => void
  spendCoins: (amount: number) => boolean
  spendGems: (amount: number) => boolean
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  coins: storage.getNumber('coins') ?? 0,
  gems: storage.getNumber('gems') ?? 0,

  addCoins: (amount) => {
    const newCoins = get().coins + amount
    storage.set('coins', newCoins)
    set({ coins: newCoins })
  },

  addGems: (amount) => {
    const newGems = get().gems + amount
    storage.set('gems', newGems)
    set({ gems: newGems })
  },

  spendCoins: (amount) => {
    const current = get().coins
    if (current < amount) return false
    const newCoins = current - amount
    storage.set('coins', newCoins)
    set({ coins: newCoins })
    return true
  },

  spendGems: (amount) => {
    const current = get().gems
    if (current < amount) return false
    const newGems = current - amount
    storage.set('gems', newGems)
    set({ gems: newGems })
    return true
  },
}))
