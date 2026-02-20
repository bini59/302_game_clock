export type Rarity = 'normal' | 'rare' | 'epic' | 'legendary'
export type ItemType = 'clockSkin' | 'pet' | 'background' | 'effect'

export interface GachaItem {
  readonly id: string
  readonly name: string
  readonly type: ItemType
  readonly rarity: Rarity
  readonly imageUrl: string
  readonly description: string
}

export interface GachaPull {
  readonly item: GachaItem
  readonly pulledAt: number
  readonly isNew: boolean
}

export interface GachaPool {
  readonly id: string
  readonly name: string
  readonly items: readonly GachaItem[]
  readonly pityCount: number
  readonly maxPity: number
}
