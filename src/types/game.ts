export type MiniGameType = 'reaction' | 'math' | 'pattern' | 'shake' | 'timeGuess' | 'pomodoro'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface GameResult {
  readonly gameType: MiniGameType
  readonly score: number
  readonly coinsEarned: number
  readonly expEarned: number
  readonly completedAt: number
  readonly isAlarmGame: boolean
}

export interface GameConfig {
  readonly type: MiniGameType
  readonly displayName: string
  readonly description: string
  readonly difficulty: GameDifficulty
  readonly baseReward: number
  readonly expReward: number
}
