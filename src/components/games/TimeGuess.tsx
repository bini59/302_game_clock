import { useState, useRef, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { getRandomInt } from '../../utils/random'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

type GameState = 'idle' | 'counting' | 'result'

export function TimeGuess({ onComplete }: Props) {
  const [state, setState] = useState<GameState>('idle')
  const [targetSeconds, setTargetSeconds] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)

  const startGame = useCallback(() => {
    const target = getRandomInt(3, 10)
    setTargetSeconds(target)
    startRef.current = Date.now()
    setState('counting')
  }, [])

  const stopGame = useCallback(() => {
    const elapsedMs = Date.now() - startRef.current
    const elapsedSec = elapsedMs / 1000
    setElapsed(elapsedSec)
    setState('result')

    const diff = Math.abs(elapsedSec - targetSeconds)
    const score = Math.max(0, Math.floor(100 - diff * 20))
    onComplete(score)
  }, [targetSeconds, onComplete])

  const reset = useCallback(() => {
    setState('idle')
    setElapsed(0)
  }, [])

  return (
    <View style={styles.container}>
      {state === 'idle' && (
        <Pressable style={styles.startButton} onPress={startGame}>
          <Text style={styles.startText}>탭하여 시작</Text>
        </Pressable>
      )}

      {state === 'counting' && (
        <Pressable style={styles.countingArea} onPress={stopGame}>
          <Text style={styles.targetText}>{targetSeconds}초를 맞춰보세요!</Text>
          <Text style={styles.instruction}>정확하다고 생각되면 탭!</Text>
        </Pressable>
      )}

      {state === 'result' && (
        <View style={styles.resultArea}>
          <Text style={styles.resultLabel}>목표</Text>
          <Text style={styles.resultValue}>{targetSeconds}초</Text>
          <Text style={styles.resultLabel}>당신의 기록</Text>
          <Text style={styles.resultValue}>{elapsed.toFixed(2)}초</Text>
          <Text style={styles.diffText}>
            오차: {Math.abs(elapsed - targetSeconds).toFixed(2)}초
          </Text>
          <Pressable style={styles.retryButton} onPress={reset}>
            <Text style={styles.retryText}>다시 하기</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
  },
  startText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  countingArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.lg,
  },
  targetText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.gold,
  },
  instruction: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  resultArea: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resultLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
  },
  diffText: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
})
