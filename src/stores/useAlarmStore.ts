import { create } from 'zustand'
import { getStoredObject, setStoredObject } from '../services/storageService'

export interface Alarm {
  readonly id: string
  readonly hour: number
  readonly minute: number
  readonly label: string
  readonly enabled: boolean
  readonly notificationId: string | null
  readonly days: readonly number[] // 0=Sun, 1=Mon, ... 6=Sat. Empty = every day
}

const STORAGE_KEY = 'alarms'

interface AlarmStore {
  alarms: readonly Alarm[]
  addAlarm: (hour: number, minute: number, label: string) => Alarm
  removeAlarm: (id: string) => void
  toggleAlarm: (id: string) => void
  updateNotificationId: (alarmId: string, notificationId: string | null) => void
  getAlarm: (id: string) => Alarm | undefined
}

function generateId(): string {
  return `alarm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: getStoredObject<Alarm[]>(STORAGE_KEY, []),

  addAlarm: (hour, minute, label) => {
    const newAlarm: Alarm = {
      id: generateId(),
      hour,
      minute,
      label,
      enabled: true,
      notificationId: null,
      days: [],
    }
    const updated = [...get().alarms, newAlarm]
    setStoredObject(STORAGE_KEY, updated)
    set({ alarms: updated })
    return newAlarm
  },

  removeAlarm: (id) => {
    const updated = get().alarms.filter((a) => a.id !== id)
    setStoredObject(STORAGE_KEY, updated)
    set({ alarms: updated })
  },

  toggleAlarm: (id) => {
    const updated = get().alarms.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a,
    )
    setStoredObject(STORAGE_KEY, updated)
    set({ alarms: updated })
  },

  updateNotificationId: (alarmId, notificationId) => {
    const updated = get().alarms.map((a) =>
      a.id === alarmId ? { ...a, notificationId } : a,
    )
    setStoredObject(STORAGE_KEY, updated)
    set({ alarms: updated })
  },

  getAlarm: (id) => get().alarms.find((a) => a.id === id),
}))
