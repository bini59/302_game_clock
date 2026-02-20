import { useState, useRef, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

type GameState = 'waiting' | 'ready' | 'go' | 'result' | 'tooEarly'

export function ReactionGame({ onComplete }: Props) {
  const [state, setState] = useState<GameState>('waiting')
  const [reactionTime, setReactionTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef(0)

  const startGame = useCallback(() => {
    setState('ready')
    const delay = 2000 + Math.random() * 3000
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now()
      setState('go')
    }, delay)
  }, [])

  const handleTap = useCallback(() => {
    if (state === 'waiting') {
      startGame()
      return
    }

    if (state === 'ready') {
      if (timerRef.current) clearTimeout(timerRef.current)
      setState('tooEarly')
      return
    }

    if (state === 'go') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setState('result')
      const score = Math.max(0, Math.floor(100 - (time - 150) / 5))
      onComplete(score)
      return
    }

    if (state === 'result' || state === 'tooEarly') {
      setState('waiting')
    }
  }, [state, startGame, onComplete])

  const bgColor =
    state === 'ready' ? '#c0392b' :
    state === 'go' ? '#27ae60' :
    state === 'tooEarly' ? '#e67e22' :
    COLORS.surface

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={handleTap}
    >
      {state === 'waiting' && (
        <Text style={styles.text}>탭하여 시작</Text>
      )}
      {state === 'ready' && (
        <Text style={styles.text}>초록색이 되면 탭!</Text>
      )}
      {state === 'go' && (
        <Text style={styles.text}>지금!</Text>
      )}
      {state === 'tooEarly' && (
        <>
          <Text style={styles.text}>너무 빨라요!</Text>
          <Text style={styles.subText}>탭하여 재시도</Text>
        </>
      )}
      {state === 'result' && (
        <>
          <Text style={styles.text}>{reactionTime}ms</Text>
          <Text style={styles.subText}>탭하여 재시도</Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    minHeight: 300,
  },
  text: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  subText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
})
