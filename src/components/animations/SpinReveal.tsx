import { useEffect } from 'react'
import { StyleSheet, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated'

interface Props {
  visible: boolean
  children: React.ReactNode
  style?: ViewStyle
}

export function SpinReveal({ visible, children, style }: Props) {
  const rotation = useSharedValue(0)
  const scale = useSharedValue(0.3)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      rotation.value = withSequence(
        withTiming(720, { duration: 800, easing: Easing.out(Easing.cubic) }),
      )
      scale.value = withSpring(1, { damping: 8, stiffness: 100 })
      opacity.value = withTiming(1, { duration: 300 })
    } else {
      rotation.value = 0
      scale.value = 0.3
      opacity.value = 0
    }
  }, [visible, rotation, scale, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
