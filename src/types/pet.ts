export type PetSpecies = 'cat' | 'dog' | 'dragon' | 'slime' | 'robot'
export type GrowthStage = 'egg' | 'baby' | 'teen' | 'adult' | 'legendary'
export type PetMood = 'happy' | 'normal' | 'sad' | 'hungry'

export interface Pet {
  readonly id: string
  readonly species: PetSpecies
  readonly name: string
  readonly stage: GrowthStage
  readonly exp: number
  readonly mood: PetMood
  readonly lastFedAt: number
  readonly lastInteractedAt: number
  readonly createdAt: number
}

export interface PetConfig {
  readonly species: PetSpecies
  readonly displayName: string
  readonly emoji: string
  readonly expToNextStage: Record<GrowthStage, number>
}
