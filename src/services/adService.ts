import { AD_FREE_DURATION_MS } from '../constants/gameConfig'

export function calculateAdFreeEndTime(): number {
  return Date.now() + AD_FREE_DURATION_MS
}

export function isAdFreeActive(adFreeUntil: number): boolean {
  return Date.now() < adFreeUntil
}

export function shouldShowInterstitial(gameCount: number, isAdFree: boolean): boolean {
  if (isAdFree) return false
  return gameCount > 0 && gameCount % 3 === 0
}
