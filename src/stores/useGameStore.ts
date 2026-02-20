import { create } from 'zustand'
import { storage } from '../services/storageService'
import { getStoredObject, setStoredObject } from '../services/storageService'
import type { GameResult } from '../types/game'
import { MINI_GAME_DAILY_FREE_PLAYS } from '../constants/gameConfig'
import { getDateString } from '../utils/time'

const PLAYS_KEY = 'gamePlaysToday'
const PLAYS_DATE_KEY = 'gamePlaysDate'
const HISTORY_KEY = 'gameHistory'
const INTERSTITIAL_COUNT_KEY = 'interstitialCount'

interface GameStore {
  playsToday: number
  gameHistory: GameResult[]
  interstitialCount: number
  canPlayFree: () => boolean
  recordPlay: () => void
  addGameResult: (result: GameResult) => void
  incrementInterstitialCount: () => number
  resetDailyPlays: () => void
}

export const useGameStore = create<GameStore>((set, get) => {
  const savedDate = storage.getString(PLAYS_DATE_KEY)
  const today = getDateString()
  const playsToday = savedDate === today
    ? (storage.getNumber(PLAYS_KEY) ?? 0)
    : 0

  return {
    playsToday,
    gameHistory: getStoredObject<GameResult[]>(HISTORY_KEY, []),
    interstitialCount: storage.getNumber(INTERSTITIAL_COUNT_KEY) ?? 0,

    canPlayFree: () => get().playsToday < MINI_GAME_DAILY_FREE_PLAYS,

    recordPlay: () => {
      const newPlays = get().playsToday + 1
      storage.set(PLAYS_KEY, newPlays)
      storage.set(PLAYS_DATE_KEY, getDateString())
      set({ playsToday: newPlays })
    },

    addGameResult: (result) => {
      const newHistory = [result, ...get().gameHistory].slice(0, 50)
      setStoredObject(HISTORY_KEY, newHistory)
      set({ gameHistory: newHistory })
    },

    incrementInterstitialCount: () => {
      const newCount = get().interstitialCount + 1
      storage.set(INTERSTITIAL_COUNT_KEY, newCount)
      set({ interstitialCount: newCount })
      return newCount
    },

    resetDailyPlays: () => {
      storage.set(PLAYS_KEY, 0)
      storage.set(PLAYS_DATE_KEY, getDateString())
      set({ playsToday: 0 })
    },
  }
})
