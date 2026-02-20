import { useMemo } from 'react'
import { PET_CONFIGS } from '../constants/petConfig'
import { SCREEN_TIME_EXP_PER_HOUR } from '../constants/gameConfig'
import type { Pet } from '../types/pet'

interface GrowthInfo {
  readonly currentExp: number
  readonly requiredExp: number
  readonly progress: number
  readonly isMaxLevel: boolean
  readonly estimatedHoursToNextStage: number
}

export function useGrowthCalculator(pet: Pet): GrowthInfo {
  return useMemo(() => {
    const config = PET_CONFIGS[pet.species]
    const requiredExp = config.expToNextStage[pet.stage]
    const isMaxLevel = pet.stage === 'legendary'

    const progress = isMaxLevel ? 1 : Math.min(pet.exp / requiredExp, 1)
    const remainingExp = isMaxLevel ? 0 : requiredExp - pet.exp
    const estimatedHoursToNextStage = isMaxLevel
      ? 0
      : Math.ceil(remainingExp / SCREEN_TIME_EXP_PER_HOUR)

    return {
      currentExp: pet.exp,
      requiredExp: isMaxLevel ? pet.exp : requiredExp,
      progress,
      isMaxLevel,
      estimatedHoursToNextStage,
    }
  }, [pet.species, pet.stage, pet.exp])
}
