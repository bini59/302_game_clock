import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  streak: number
  totalDays: number
}

function getStreakTier(streak: number): { label: string; color: string; emoji: string } {
  if (streak >= 30) return { label: '전설', color: COLORS.gold, emoji: '🏆' }
  if (streak >= 14) return { label: '다이아', color: '#74b9ff', emoji: '💎' }
  if (streak >= 7) return { label: '골드', color: COLORS.gold, emoji: '🥇' }
  if (streak >= 3) return { label: '실버', color: '#a0a0b8', emoji: '🥈' }
  return { label: '브론즈', color: '#cd7f32', emoji: '🥉' }
}

export function StreakBadge({ streak, totalDays }: Props) {
  const tier = getStreakTier(streak)

  return (
    <View style={[styles.container, { borderColor: tier.color }]}>
      <Text style={styles.emoji}>{tier.emoji}</Text>
      <View style={styles.info}>
        <Text style={[styles.label, { color: tier.color }]}>{tier.label}</Text>
        <Text style={styles.streak}>{streak}일 연속</Text>
      </View>
      <Text style={styles.total}>총 {totalDays}일</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  streak: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  total: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
})
