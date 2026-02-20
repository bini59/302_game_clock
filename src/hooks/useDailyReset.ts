import { useEffect } from 'react'
import { useGameStore } from '../stores/useGameStore'
import { storage } from '../services/storageService'
import { getDateString } from '../utils/time'

const LAST_RESET_KEY = 'lastDailyReset'

export function useDailyReset() {
  const resetDailyPlays = useGameStore((s) => s.resetDailyPlays)

  useEffect(() => {
    const today = getDateString()
    const lastReset = storage.getString(LAST_RESET_KEY)

    if (lastReset !== today) {
      resetDailyPlays()
      storage.set(LAST_RESET_KEY, today)
    }
  }, [resetDailyPlays])
}
