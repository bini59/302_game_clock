import { GACHA_RATES } from '../constants/gameConfig'
import type { Rarity } from '../types/gacha'

export function getRandomRarity(): Rarity {
  const roll = Math.random()
  let cumulative = 0

  const rarities: Rarity[] = ['legendary', 'epic', 'rare', 'normal']
  for (const rarity of rarities) {
    cumulative += GACHA_RATES[rarity]
    if (roll < cumulative) {
      return rarity
    }
  }

  return 'normal'
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffleArray<T>(array: readonly T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
