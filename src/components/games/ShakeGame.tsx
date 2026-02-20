import { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

const GAME_DURATION_MS = 10000

export function ShakeGame({ onComplete }: Props) {
  const [taps, setTaps] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const tapsRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, Math.ceil((GAME_DURATION_MS - elapsed) / 1000))
      setTimeLeft(remaining)

      if (elapsed >= GAME_DURATION_MS) {
        clearInterval(interval)
        setIsPlaying(false)
        setIsFinished(true)
        onComplete(tapsRef.current)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, onComplete])

  const handleTap = () => {
    if (isFinished) return
    if (!isPlaying) {
      setIsPlaying(true)
      tapsRef.current = 1
      setTaps(1)
      return
    }
    tapsRef.current += 1
    setTaps(tapsRef.current)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>빠르게 탭하기!</Text>
      <Text style={styles.timer}>{timeLeft}초</Text>

      <Pressable
        style={({ pressed }) => [
          styles.tapArea,
          pressed && styles.tapAreaPressed,
        ]}
        onPress={handleTap}
        disabled={isFinished}
      >
        <Text style={styles.tapEmoji}>👆</Text>
        <Text style={styles.tapText}>
          {isFinished
            ? `완료! ${taps}회 탭`
            : isPlaying
              ? `${taps}회`
              : '탭해서 시작!'}
        </Text>
      </Pressable>

      {isFinished && (
        <Text style={styles.result}>
          초당 {(taps / 10).toFixed(1)}회 속도!
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tapArea: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  tapAreaPressed: {
    backgroundColor: COLORS.primaryLight,
    transform: [{ scale: 0.95 }],
  },
  tapEmoji: {
    fontSize: 48,
  },
  tapText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  result: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '600',
  },
})
