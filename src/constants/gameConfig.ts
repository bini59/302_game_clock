import type { GrowthStage } from '../types/pet'
import type { Rarity } from '../types/gacha'

export const PET_EXP_TABLE: Record<GrowthStage, number> = {
  egg: 100,
  baby: 300,
  teen: 800,
  adult: 2000,
  legendary: Infinity,
}

export const SCREEN_TIME_EXP_PER_HOUR = 10
export const ALARM_SUCCESS_EXP_BONUS = 25
export const DAILY_CHECK_IN_COINS = 50
export const STREAK_BONUS_MULTIPLIER = 0.1

export const GACHA_RATES: Record<Rarity, number> = {
  normal: 0.60,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03,
}

export const GACHA_COST_COINS = 100
export const GACHA_COST_GEMS = 10
export const GACHA_PITY_THRESHOLD = 50

export const REWARD_AD_GEM_AMOUNT = 5
export const REWARD_AD_FOOD_AMOUNT = 3
export const AD_FREE_DURATION_MS = 24 * 60 * 60 * 1000
export const COIN_BOOSTER_DURATION_MS = 60 * 60 * 1000
export const COIN_BOOSTER_MULTIPLIER = 2

export const MINI_GAME_DAILY_FREE_PLAYS = 3
export const INTERSTITIAL_FREQUENCY = 3

export const POMODORO_DURATION_MS = 25 * 60 * 1000
export const POMODORO_COIN_REWARD = 30
export const POMODORO_EXP_REWARD = 15

export const PET_ABSENCE_PENALTY_DAYS = 3
export const FOOD_MAX_CAPACITY = 10
export const FEED_EXP_REWARD = 20
export const FEED_COIN_REWARD = 10

export const MOOD_EXP_MULTIPLIER: Record<string, number> = {
  happy: 1.5,
  normal: 1.0,
  hungry: 0.5,
  sad: 0.3,
}
