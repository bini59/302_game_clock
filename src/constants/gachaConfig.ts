import type { GachaItem, Rarity } from '../types/gacha'

export const RARITY_COLORS: Record<Rarity, string> = {
  normal: '#a0a0b8',
  rare: '#74b9ff',
  epic: '#a29bfe',
  legendary: '#fdcb6e',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  normal: '일반',
  rare: '레어',
  epic: '에픽',
  legendary: '레전더리',
}

export const DEFAULT_CLOCK_SKINS: GachaItem[] = [
  {
    id: 'skin_digital_basic',
    name: '기본 디지털',
    type: 'clockSkin',
    rarity: 'normal',
    imageUrl: '',
    description: '깔끔한 기본 디지털 시계',
  },
  {
    id: 'skin_analog_basic',
    name: '기본 아날로그',
    type: 'clockSkin',
    rarity: 'normal',
    imageUrl: '',
    description: '클래식 아날로그 시계',
  },
  {
    id: 'skin_neon_blue',
    name: '네온 블루',
    type: 'clockSkin',
    rarity: 'rare',
    imageUrl: '',
    description: '파란 네온 빛의 디지털 시계',
  },
  {
    id: 'skin_neon_purple',
    name: '네온 퍼플',
    type: 'clockSkin',
    rarity: 'rare',
    imageUrl: '',
    description: '보라 네온 빛의 디지털 시계',
  },
  {
    id: 'skin_space',
    name: '우주 테마',
    type: 'clockSkin',
    rarity: 'rare',
    imageUrl: '',
    description: '은하수 배경의 시계',
  },
  {
    id: 'skin_ocean',
    name: '바다 테마',
    type: 'clockSkin',
    rarity: 'rare',
    imageUrl: '',
    description: '깊은 바다 속 시계',
  },
  {
    id: 'skin_pixel_retro',
    name: '픽셀 레트로',
    type: 'clockSkin',
    rarity: 'epic',
    imageUrl: '',
    description: '레트로 게임 스타일 시계',
  },
  {
    id: 'skin_animated_fire',
    name: '불꽃 시계',
    type: 'clockSkin',
    rarity: 'epic',
    imageUrl: '',
    description: '타오르는 불꽃 애니메이션 시계',
  },
  {
    id: 'skin_legendary_aurora',
    name: '오로라 시계',
    type: 'clockSkin',
    rarity: 'legendary',
    imageUrl: '',
    description: '움직이는 오로라 배경 + 사운드',
  },
]

export const GACHA_POOL_ITEMS: GachaItem[] = [
  ...DEFAULT_CLOCK_SKINS,
  {
    id: 'bg_starry_night',
    name: '별이 빛나는 밤',
    type: 'background',
    rarity: 'rare',
    imageUrl: '',
    description: '반짝이는 별이 가득한 배경',
  },
  {
    id: 'bg_sunset',
    name: '석양',
    type: 'background',
    rarity: 'epic',
    imageUrl: '',
    description: '아름다운 석양 배경',
  },
  {
    id: 'effect_sparkle',
    name: '반짝이 효과',
    type: 'effect',
    rarity: 'rare',
    imageUrl: '',
    description: '시계 주변에 반짝이는 파티클',
  },
  {
    id: 'effect_rainbow',
    name: '무지개 효과',
    type: 'effect',
    rarity: 'epic',
    imageUrl: '',
    description: '무지개빛 파티클 효과',
  },
]
