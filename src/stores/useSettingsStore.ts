import { create } from 'zustand'
import { storage } from '../services/storageService'
import type { UserSettings } from '../types/store'

const STORAGE_KEY = 'settings'

function loadSettings(): UserSettings {
  const raw = storage.getString(STORAGE_KEY)
  if (!raw) {
    return {
      alarmEnabled: false,
      alarmTime: '07:00',
      selectedClockSkin: 'skin_digital_basic',
      selectedPetId: '',
      soundEnabled: true,
      hapticEnabled: true,
      onboardingCompleted: false,
    }
  }
  try {
    return JSON.parse(raw) as UserSettings
  } catch {
    return {
      alarmEnabled: false,
      alarmTime: '07:00',
      selectedClockSkin: 'skin_digital_basic',
      selectedPetId: '',
      soundEnabled: true,
      hapticEnabled: true,
      onboardingCompleted: false,
    }
  }
}

function saveSettings(settings: UserSettings): void {
  storage.set(STORAGE_KEY, JSON.stringify(settings))
}

interface SettingsStore extends UserSettings {
  updateSettings: (partial: Partial<UserSettings>) => void
  completeOnboarding: () => void
  selectClockSkin: (skinId: string) => void
  selectPet: (petId: string) => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const initial = loadSettings()
  return {
    ...initial,
    updateSettings: (partial) => {
      const current = get()
      const updated: UserSettings = {
        alarmEnabled: partial.alarmEnabled ?? current.alarmEnabled,
        alarmTime: partial.alarmTime ?? current.alarmTime,
        selectedClockSkin: partial.selectedClockSkin ?? current.selectedClockSkin,
        selectedPetId: partial.selectedPetId ?? current.selectedPetId,
        soundEnabled: partial.soundEnabled ?? current.soundEnabled,
        hapticEnabled: partial.hapticEnabled ?? current.hapticEnabled,
        onboardingCompleted: partial.onboardingCompleted ?? current.onboardingCompleted,
      }
      saveSettings(updated)
      set(updated)
    },
    completeOnboarding: () => {
      const current = get()
      const updated: UserSettings = { ...current, onboardingCompleted: true }
      saveSettings(updated)
      set({ onboardingCompleted: true })
    },
    selectClockSkin: (skinId) => {
      const current = get()
      const updated: UserSettings = { ...current, selectedClockSkin: skinId }
      saveSettings(updated)
      set({ selectedClockSkin: skinId })
    },
    selectPet: (petId) => {
      const current = get()
      const updated: UserSettings = { ...current, selectedPetId: petId }
      saveSettings(updated)
      set({ selectedPetId: petId })
    },
  }
})
