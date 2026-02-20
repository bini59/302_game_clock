import { DigitalClock } from './DigitalClock'
import { AnalogClock } from './AnalogClock'
import { COLORS } from '../../constants/theme'
import type { ClockSkinType } from '../../types/store'

interface Props {
  skinType: ClockSkinType
  skinId: string
}

const SKIN_COLORS: Record<string, string> = {
  skin_digital_basic: COLORS.primary,
  skin_analog_basic: COLORS.primary,
  skin_neon_blue: '#74b9ff',
  skin_neon_purple: '#a29bfe',
  skin_pixel_retro: '#00b894',
  skin_animated_fire: '#ff6b6b',
  skin_legendary_aurora: '#fdcb6e',
}

export function ClockSkinRenderer({ skinType, skinId }: Props) {
  const color = SKIN_COLORS[skinId] ?? COLORS.primary

  if (skinType === 'analog') {
    return <AnalogClock color={color} />
  }

  return <DigitalClock color={color} />
}
