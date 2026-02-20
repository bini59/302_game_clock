import { create } from 'zustand'
import { storage, getStoredObject, setStoredObject } from '../services/storageService'
import { PET_CONFIGS } from '../constants/petConfig'
import type { Pet, PetSpecies, GrowthStage } from '../types/pet'
import { generateId } from '../utils/random'
import { getDaysSince } from '../utils/time'
import {
  PET_ABSENCE_PENALTY_DAYS,
  FEED_EXP_REWARD,
  FEED_COIN_REWARD,
} from '../constants/gameConfig'

const STORAGE_KEY = 'pets'
const FOOD_KEY = 'petFood'
const INTERACT_COOLDOWN_MS = 5 * 60 * 1000 // 5분 쿨다운
const INTERACT_EXP_REWARD = 5
const INTERACT_COIN_REWARD = 3

function getNextStage(stage: GrowthStage): GrowthStage {
  const stages: GrowthStage[] = ['egg', 'baby', 'teen', 'adult', 'legendary']
  const idx = stages.indexOf(stage)
  if (idx < stages.length - 1) return stages[idx + 1]!
  return stage
}

interface InteractionResult {
  readonly success: boolean
  readonly expEarned: number
  readonly coinsEarned: number
  readonly cooldownRemaining: number
}

interface PetStore {
  pets: Pet[]
  food: number
  createPet: (species: PetSpecies, name: string) => Pet
  addExp: (petId: string, amount: number) => void
  feedPet: (petId: string) => { success: boolean; expEarned: number; coinsEarned: number }
  interactWithPet: (petId: string) => InteractionResult
  addFood: (amount: number) => void
  getPetMood: (pet: Pet) => Pet['mood']
  getInteractCooldown: (petId: string) => number
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: getStoredObject<Pet[]>(STORAGE_KEY, []),
  food: storage.getNumber(FOOD_KEY) ?? 5,

  createPet: (species, name) => {
    const newPet: Pet = {
      id: generateId(),
      species,
      name,
      stage: 'egg',
      exp: 0,
      mood: 'happy',
      lastFedAt: Date.now(),
      lastInteractedAt: Date.now(),
      createdAt: Date.now(),
    }
    const updatedPets = [...get().pets, newPet]
    setStoredObject(STORAGE_KEY, updatedPets)
    set({ pets: updatedPets })
    return newPet
  },

  addExp: (petId, amount) => {
    const updatedPets = get().pets.map((pet) => {
      if (pet.id !== petId) return pet
      const newExp = pet.exp + amount
      const config = PET_CONFIGS[pet.species]
      const threshold = config.expToNextStage[pet.stage]
      if (newExp >= threshold && pet.stage !== 'legendary') {
        return {
          ...pet,
          exp: newExp - threshold,
          stage: getNextStage(pet.stage),
        }
      }
      return { ...pet, exp: newExp }
    })
    setStoredObject(STORAGE_KEY, updatedPets)
    set({ pets: updatedPets })
  },

  feedPet: (petId) => {
    const { food } = get()
    if (food <= 0) return { success: false, expEarned: 0, coinsEarned: 0 }

    const newFood = food - 1
    const updatedPets = get().pets.map((pet) => {
      if (pet.id !== petId) return pet
      return {
        ...pet,
        lastFedAt: Date.now(),
        mood: 'happy' as const,
      }
    })

    storage.set(FOOD_KEY, newFood)
    setStoredObject(STORAGE_KEY, updatedPets)
    set({ pets: updatedPets, food: newFood })

    // 먹이 보상: EXP + 코인
    get().addExp(petId, FEED_EXP_REWARD)
    return { success: true, expEarned: FEED_EXP_REWARD, coinsEarned: FEED_COIN_REWARD }
  },

  interactWithPet: (petId) => {
    const pet = get().pets.find((p) => p.id === petId)
    if (!pet) return { success: false, expEarned: 0, coinsEarned: 0, cooldownRemaining: 0 }

    const timeSinceLastInteract = Date.now() - pet.lastInteractedAt
    if (timeSinceLastInteract < INTERACT_COOLDOWN_MS) {
      const remaining = Math.ceil((INTERACT_COOLDOWN_MS - timeSinceLastInteract) / 1000)
      return { success: false, expEarned: 0, coinsEarned: 0, cooldownRemaining: remaining }
    }

    const updatedPets = get().pets.map((p) => {
      if (p.id !== petId) return p
      return { ...p, lastInteractedAt: Date.now() }
    })
    setStoredObject(STORAGE_KEY, updatedPets)
    set({ pets: updatedPets })

    // 쓰다듬기 보상: EXP + 코인
    get().addExp(petId, INTERACT_EXP_REWARD)
    return {
      success: true,
      expEarned: INTERACT_EXP_REWARD,
      coinsEarned: INTERACT_COIN_REWARD,
      cooldownRemaining: 0,
    }
  },

  getInteractCooldown: (petId) => {
    const pet = get().pets.find((p) => p.id === petId)
    if (!pet) return 0
    const timeSince = Date.now() - pet.lastInteractedAt
    if (timeSince >= INTERACT_COOLDOWN_MS) return 0
    return Math.ceil((INTERACT_COOLDOWN_MS - timeSince) / 1000)
  },

  addFood: (amount) => {
    const newFood = get().food + amount
    storage.set(FOOD_KEY, newFood)
    set({ food: newFood })
  },

  getPetMood: (pet) => {
    const daysSinceLastFed = getDaysSince(pet.lastFedAt)
    if (daysSinceLastFed >= PET_ABSENCE_PENALTY_DAYS) return 'sad'
    if (daysSinceLastFed >= 1) return 'hungry'
    const daysSinceInteraction = getDaysSince(pet.lastInteractedAt)
    if (daysSinceInteraction >= 2) return 'normal'
    return 'happy'
  },
}))
