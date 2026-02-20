import { GACHA_POOL_ITEMS } from '../constants/gachaConfig'
import { GACHA_PITY_THRESHOLD } from '../constants/gameConfig'
import type { GachaItem, GachaPull, Rarity } from '../types/gacha'
import { generateId, getRandomRarity } from '../utils/random'

function getItemsByRarity(rarity: Rarity): GachaItem[] {
  return GACHA_POOL_ITEMS.filter((item) => item.rarity === rarity)
}

function pickRandomItem(items: GachaItem[]): GachaItem {
  const index = Math.floor(Math.random() * items.length)
  return items[index]!
}

export function performPull(
  pityCount: number,
  ownedItemIds: readonly string[],
): GachaPull {
  const isPityPull = pityCount >= GACHA_PITY_THRESHOLD - 1

  let rarity: Rarity
  if (isPityPull) {
    rarity = Math.random() < 0.3 ? 'legendary' : 'epic'
  } else {
    rarity = getRandomRarity()
  }

  const candidates = getItemsByRarity(rarity)
  if (candidates.length === 0) {
    const fallback = getItemsByRarity('normal')
    const item = pickRandomItem(fallback)
    return {
      item,
      pulledAt: Date.now(),
      isNew: !ownedItemIds.includes(item.id),
    }
  }

  const item = pickRandomItem(candidates)
  return {
    item,
    pulledAt: Date.now(),
    isNew: !ownedItemIds.includes(item.id),
  }
}

export function calculatePityProgress(currentPity: number): number {
  return currentPity / GACHA_PITY_THRESHOLD
}
