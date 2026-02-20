import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../ui/Button'
import { POMODORO_DURATION_MS } from '../../constants/gameConfig'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

export function PomodoroTimer({ onComplete }: Props) {
  const [remainingMs, setRemainingMs] = useState(POMODORO_DURATION_MS)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const startTimeRef = useRef<number>(0)
  const pausedRemainingRef = useRef(POMODORO_DURATION_MS)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = Math.max(0, pausedRemainingRef.current - elapsed)
      setRemainingMs(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        setIsRunning(false)
        setIsComplete(true)
        onComplete(1)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [isRunning, onComplete])

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now()
    setIsRunning(true)
  }, [])

  const handlePause = useCallback(() => {
    pausedRemainingRef.current = remainingMs
    setIsRunning(false)
  }, [remainingMs])

  const handleReset = useCallback(() => {
    setRemainingMs(POMODORO_DURATION_MS)
    pausedRemainingRef.current = POMODORO_DURATION_MS
    setIsRunning(false)
    setIsComplete(false)
  }, [])

  const minutes = Math.floor(remainingMs / 60000)
  const seconds = Math.floor((remainingMs % 60000) / 1000)
  const progress = 1 - remainingMs / POMODORO_DURATION_MS

  return (
    <View style={styles.container}>
      <Text style={styles.title}>뽀모도로 타이머</Text>

      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>

      {isComplete ? (
        <View style={styles.completeSection}>
          <Text style={styles.completeText}>집중 완료! 🎉</Text>
          <Button title="다시 시작" onPress={handleReset} fullWidth />
        </View>
      ) : (
        <View style={styles.controls}>
          {isRunning ? (
            <Button title="일시정지" onPress={handlePause} fullWidth />
          ) : (
            <Button
              title={remainingMs < POMODORO_DURATION_MS ? '계속하기' : '시작하기'}
              onPress={handleStart}
              fullWidth
            />
          )}
          {!isRunning && remainingMs < POMODORO_DURATION_MS && (
            <Button title="리셋" onPress={handleReset} variant="ghost" fullWidth />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  timerText: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  controls: {
    width: '100%',
    gap: SPACING.sm,
  },
  completeSection: {
    width: '100%',
    gap: SPACING.md,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.success,
  },
})
