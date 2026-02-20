import { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ReactionGame } from './ReactionGame'
import { MathQuiz } from './MathQuiz'
import { TimeGuess } from './TimeGuess'
import { COLORS, SPACING } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

const ALARM_GAMES = [
  { id: 'reaction', name: '반응속도', Component: ReactionGame },
  { id: 'math', name: '수학 퀴즈', Component: MathQuiz },
  { id: 'timeGuess', name: '시간 맞추기', Component: TimeGuess },
] as const

export function AlarmGame({ onComplete }: Props) {
  const selectedGame = useMemo(() => {
    const index = Math.floor(Math.random() * ALARM_GAMES.length)
    return ALARM_GAMES[index]!
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.alarmLabel}>⏰ 알람을 끄려면 게임을 클리어하세요!</Text>
      <Text style={styles.gameLabel}>{selectedGame.name}</Text>
      <selectedGame.Component onComplete={onComplete} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: SPACING.sm,
  },
  alarmLabel: {
    fontSize: 14,
    color: COLORS.warning,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  gameLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
})
