import {
  DAILY_CHECK_IN_COINS,
  STREAK_BONUS_MULTIPLIER,
  ALARM_SUCCESS_EXP_BONUS,
  SCREEN_TIME_EXP_PER_HOUR,
  POMODORO_COIN_REWARD,
  POMODORO_EXP_REWARD,
  COIN_BOOSTER_MULTIPLIER,
} from '../constants/gameConfig'

interface RewardResult {
  readonly coins: number
  readonly exp: number
  readonly gems: number
}

export function calculateCheckInReward(streak: number): RewardResult {
  const streakBonus = Math.floor(streak * STREAK_BONUS_MULTIPLIER * DAILY_CHECK_IN_COINS)
  return {
    coins: DAILY_CHECK_IN_COINS + streakBonus,
    exp: 5,
    gems: 0,
  }
}

export function calculateAlarmReward(
  difficulty: number,
  streakCount: number,
): RewardResult {
  const baseCoins = 10 + difficulty * 5
  const streakMultiplier = 1 + Math.min(streakCount, 10) * 0.1
  return {
    coins: Math.floor(baseCoins * streakMultiplier),
    exp: ALARM_SUCCESS_EXP_BONUS,
    gems: 0,
  }
}

export function calculateScreenTimeExp(minutes: number): number {
  return Math.floor((minutes / 60) * SCREEN_TIME_EXP_PER_HOUR)
}

export function calculateMiniGameReward(
  baseReward: number,
  score: number,
  hasCoinBooster: boolean,
): RewardResult {
  const multiplier = hasCoinBooster ? COIN_BOOSTER_MULTIPLIER : 1
  return {
    coins: Math.floor(baseReward * (score / 100) * multiplier),
    exp: Math.floor(score / 10),
    gems: 0,
  }
}

export function calculatePomodoroReward(hasCoinBooster: boolean): RewardResult {
  const multiplier = hasCoinBooster ? COIN_BOOSTER_MULTIPLIER : 1
  return {
    coins: Math.floor(POMODORO_COIN_REWARD * multiplier),
    exp: POMODORO_EXP_REWARD,
    gems: 0,
  }
}
