import { useEffect, useMemo } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const PARTICLE_COUNT = 12
const EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊']

interface Props {
  visible: boolean
  onFinish?: () => void
}

function Particle({ emoji, startX, startY, endX, endY, delay, visible }: {
  emoji: string
  startX: number
  startY: number
  endX: number
  endY: number
  delay: number
  visible: boolean
}) {
  const translateX = useSharedValue(startX)
  const translateY = useSharedValue(startY)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.3)

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 200 }))
      scale.value = withDelay(delay, withTiming(1, { duration: 400 }))
      translateX.value = withDelay(
        delay,
        withTiming(endX, { duration: 1000, easing: Easing.out(Easing.quad) }),
      )
      translateY.value = withDelay(
        delay,
        withTiming(endY, { duration: 1000, easing: Easing.out(Easing.quad) }),
      )

      // Fade out
      opacity.value = withDelay(delay + 700, withTiming(0, { duration: 300 }))
    } else {
      translateX.value = startX
      translateY.value = startY
      opacity.value = 0
      scale.value = 0.3
    }
  }, [visible, delay, startX, startY, endX, endY, translateX, translateY, opacity, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.Text style={[styles.particle, animatedStyle]}>
      {emoji}
    </Animated.Text>
  )
}

export function CelebrationEffect({ visible, onFinish }: Props) {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2
      const radius = 80 + Math.random() * 60
      return {
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        startX: 0,
        startY: 0,
        endX: Math.cos(angle) * radius,
        endY: Math.sin(angle) * radius,
        delay: i * 50,
      }
    }),
  [])

  useEffect(() => {
    if (visible && onFinish) {
      const timer = setTimeout(onFinish, 1500)
      return () => clearTimeout(timer)
    }
  }, [visible, onFinish])

  if (!visible) return null

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {particles.map((p) => (
        <Particle
          key={p.id}
          emoji={p.emoji}
          startX={p.startX}
          startY={p.startY}
          endX={p.endX}
          endY={p.endY}
          delay={p.delay}
          visible={visible}
        />
      ))}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
  },
})
