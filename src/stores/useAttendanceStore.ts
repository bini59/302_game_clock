import { create } from 'zustand'
import { getStoredObject, setStoredObject } from '../services/storageService'
import type { AttendanceData } from '../types/store'
import { getDateString, isSameDay } from '../utils/time'

const STORAGE_KEY = 'attendance'

const DEFAULT_ATTENDANCE: AttendanceData = {
  lastCheckIn: '',
  streak: 0,
  totalDays: 0,
  monthlyCheckIns: [],
}

interface AttendanceStore extends AttendanceData {
  checkIn: () => { isNew: boolean; streak: number }
  hasCheckedInToday: () => boolean
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => {
  const saved = getStoredObject<AttendanceData>(STORAGE_KEY, DEFAULT_ATTENDANCE)
  return {
    ...saved,

    checkIn: () => {
      const today = getDateString()
      const current = get()

      if (current.lastCheckIn === today) {
        return { isNew: false, streak: current.streak }
      }

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

      const isConsecutive = current.lastCheckIn === yesterdayStr
      const newStreak = isConsecutive ? current.streak + 1 : 1
      const newTotal = current.totalDays + 1

      const currentMonth = today.substring(0, 7)
      const monthlyCheckIns = current.monthlyCheckIns.filter(
        (d) => d.startsWith(currentMonth)
      )
      monthlyCheckIns.push(today)

      const updated: AttendanceData = {
        lastCheckIn: today,
        streak: newStreak,
        totalDays: newTotal,
        monthlyCheckIns,
      }

      setStoredObject(STORAGE_KEY, updated)
      set(updated)
      return { isNew: true, streak: newStreak }
    },

    hasCheckedInToday: () => {
      return get().lastCheckIn === getDateString()
    },
  }
})
