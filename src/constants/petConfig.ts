import type { PetConfig, PetSpecies } from '../types/pet'

export const PET_CONFIGS: Record<PetSpecies, PetConfig> = {
  cat: {
    species: 'cat',
    displayName: '고양이',
    emoji: '🐱',
    expToNextStage: {
      egg: 100,
      baby: 300,
      teen: 800,
      adult: 2000,
      legendary: Infinity,
    },
  },
  dog: {
    species: 'dog',
    displayName: '강아지',
    emoji: '🐶',
    expToNextStage: {
      egg: 100,
      baby: 300,
      teen: 800,
      adult: 2000,
      legendary: Infinity,
    },
  },
  dragon: {
    species: 'dragon',
    displayName: '용',
    emoji: '🐉',
    expToNextStage: {
      egg: 150,
      baby: 400,
      teen: 1000,
      adult: 2500,
      legendary: Infinity,
    },
  },
  slime: {
    species: 'slime',
    displayName: '슬라임',
    emoji: '🟢',
    expToNextStage: {
      egg: 80,
      baby: 250,
      teen: 700,
      adult: 1800,
      legendary: Infinity,
    },
  },
  robot: {
    species: 'robot',
    displayName: '로봇',
    emoji: '🤖',
    expToNextStage: {
      egg: 120,
      baby: 350,
      teen: 900,
      adult: 2200,
      legendary: Infinity,
    },
  },
} as const

export const STARTER_PETS: PetSpecies[] = ['cat', 'dog', 'slime']
