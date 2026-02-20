import { create } from 'zustand'
import { getStoredObject, setStoredObject } from '../services/storageService'
import type { Achievement, AchievementId, AchievementProgress } from '../types/achievement'

const STORAGE_KEY = 'achievements'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'early_bird',
    name: '일찍 일어나기',
    description: '7일 연속 알람 성공',
    emoji: '🌅',
    condition: '7일 연속 알람 미션 성공',
    rewardType: 'skin',
    rewardValue: 'skin_neon_blue',
    targetCount: 7,
  },
  {
    id: 'fire_streak',
    name: '불꽃 스트릭',
    description: '30일 연속 출석',
    emoji: '🔥',
    condition: '30일 연속 출석 체크',
    rewardType: 'gachaPull',
    rewardValue: 'epic_pull',
    targetCount: 30,
  },
  {
    id: 'time_master',
    name: '시간의 달인',
    description: '시간 맞추기 오차 0.1초 이내',
    emoji: '⏱',
    condition: '시간 맞추기 게임에서 오차 0.1초 이내 달성',
    rewardType: 'pet',
    rewardValue: 'dragon',
    targetCount: 1,
  },
  {
    id: 'dragon_master',
    name: '드래곤 마스터',
    description: '펫 3마리 레전드리 달성',
    emoji: '🐉',
    condition: '3마리의 펫을 레전더리 등급으로 성장',
    rewardType: 'skin',
    rewardValue: 'skin_legendary_aurora',
    targetCount: 3,
  },
  {
    id: 'collector',
    name: '컬렉터',
    description: '스킨 50종 수집',
    emoji: '📚',
    condition: '시계 스킨 50종 수집',
    rewardType: 'adFree',
    rewardValue: '7days',
    targetCount: 50,
  },
]

interface AchievementStore {
  progress: Record<AchievementId, AchievementProgress>
  updateProgress: (id: AchievementId, count: number) => boolean
  getProgress: (id: AchievementId) => AchievementProgress
  getCompletedCount: () => number
}

const defaultProgress: Record<AchievementId, AchievementProgress> = {
  early_bird: { achievementId: 'early_bird', currentCount: 0, isCompleted: false, completedAt: null },
  fire_streak: { achievementId: 'fire_streak', currentCount: 0, isCompleted: false, completedAt: null },
  time_master: { achievementId: 'time_master', currentCount: 0, isCompleted: false, completedAt: null },
  dragon_master: { achievementId: 'dragon_master', currentCount: 0, isCompleted: false, completedAt: null },
  collector: { achievementId: 'collector', currentCount: 0, isCompleted: false, completedAt: null },
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  progress: getStoredObject(STORAGE_KEY, defaultProgress),

  updateProgress: (id, count) => {
    const current = get().progress
    const prev = current[id]
    if (!prev || prev.isCompleted) return false

    const achievement = ACHIEVEMENTS.find((a) => a.id === id)
    if (!achievement) return false

    const newCount = Math.max(prev.currentCount, count)
    const isCompleted = newCount >= achievement.targetCount

    const updated = {
      ...current,
      [id]: {
        ...prev,
        currentCount: newCount,
        isCompleted,
        completedAt: isCompleted ? Date.now() : null,
      },
    }

    setStoredObject(STORAGE_KEY, updated)
    set({ progress: updated })
    return isCompleted
  },

  getProgress: (id) => {
    return get().progress[id] ?? defaultProgress[id]!
  },

  getCompletedCount: () => {
    const progress = get().progress
    return Object.values(progress).filter((p) => p.isCompleted).length
  },
}))
