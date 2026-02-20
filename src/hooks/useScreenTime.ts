import { useEffect, useRef } from 'react'
import { usePetStore } from '../stores/usePetStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { SCREEN_TIME_EXP_PER_HOUR } from '../constants/gameConfig'

const EXP_INTERVAL_MS = 60 * 1000 // Check every minute

export function useScreenTime() {
  const selectedPetId = useSettingsStore((s) => s.selectedPetId)
  const addExp = usePetStore((s) => s.addExp)
  const accumulatedMinutes = useRef(0)

  useEffect(() => {
    if (!selectedPetId) return

    const interval = setInterval(() => {
      accumulatedMinutes.current += 1
      if (accumulatedMinutes.current >= 60) {
        addExp(selectedPetId, SCREEN_TIME_EXP_PER_HOUR)
        accumulatedMinutes.current = 0
      }
    }, EXP_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [selectedPetId, addExp])

  return { minutesActive: accumulatedMinutes.current }
}
