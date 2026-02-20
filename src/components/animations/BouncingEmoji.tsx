import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'

interface Props {
  emoji: string
  size?: number
  delay?: number
}

export function BouncingEmoji({ emoji, size = 64, delay = 0 }: Props) {
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 600, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 600, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    )

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      ),
    )
  }, [delay, translateY, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <Animated.Text style={[styles.emoji, { fontSize: size }, animatedStyle]}>
      {emoji}
    </Animated.Text>
  )
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
})
