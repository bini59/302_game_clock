export type ClockSkinType = 'digital' | 'analog' | 'flip' | 'neon' | 'pixel'

export interface ClockSkin {
  readonly id: string
  readonly name: string
  readonly type: ClockSkinType
  readonly rarity: import('./gacha').Rarity
  readonly isOwned: boolean
}

export interface Currency {
  readonly coins: number
  readonly gems: number
}

export interface AttendanceData {
  readonly lastCheckIn: string
  readonly streak: number
  readonly totalDays: number
  readonly monthlyCheckIns: readonly string[]
}

export interface UserSettings {
  readonly alarmEnabled: boolean
  readonly alarmTime: string
  readonly selectedClockSkin: string
  readonly selectedPetId: string
  readonly soundEnabled: boolean
  readonly hapticEnabled: boolean
  readonly onboardingCompleted: boolean
}
