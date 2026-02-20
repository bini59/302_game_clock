import { View, StyleSheet, type ViewStyle } from 'react-native'
import { COLORS, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  progress: number // 0 to 1
  color?: string
  height?: number
  style?: ViewStyle
}

export function ProgressBar({
  progress,
  color = COLORS.primary,
  height = 8,
  style,
}: Props) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  return (
    <View style={[styles.track, { height }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BORDER_RADIUS.full,
  },
})
