export type AchievementId =
  | 'early_bird'
  | 'fire_streak'
  | 'time_master'
  | 'dragon_master'
  | 'collector'

export interface Achievement {
  readonly id: AchievementId
  readonly name: string
  readonly description: string
  readonly emoji: string
  readonly condition: string
  readonly rewardType: 'skin' | 'gachaPull' | 'pet' | 'adFree'
  readonly rewardValue: string
  readonly targetCount: number
}

export interface AchievementProgress {
  readonly achievementId: AchievementId
  readonly currentCount: number
  readonly isCompleted: boolean
  readonly completedAt: number | null
}
