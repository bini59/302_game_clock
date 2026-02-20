import { View, Text, StyleSheet } from 'react-native'
import { ACHIEVEMENTS, useAchievementStore } from '../../stores/useAchievementStore'
import { ProgressBar } from '../ui/ProgressBar'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

export function AchievementList() {
  const progress = useAchievementStore((s) => s.progress)

  return (
    <View style={styles.list}>
      {ACHIEVEMENTS.map((item) => {
        const p = progress[item.id]
        const currentCount = p?.currentCount ?? 0
        const isCompleted = p?.isCompleted ?? false
        const ratio = Math.min(currentCount / item.targetCount, 1)

        return (
          <View key={item.id} style={[styles.card, isCompleted && styles.completedCard]}>
            <View style={styles.header}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
              {isCompleted && <Text style={styles.check}>✅</Text>}
            </View>
            <ProgressBar
              progress={ratio}
              color={isCompleted ? COLORS.success : COLORS.primary}
              height={4}
            />
            <Text style={styles.count}>
              {currentCount}/{item.targetCount}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  completedCard: {
    borderColor: COLORS.success,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  desc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  check: {
    fontSize: 20,
  },
  count: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
})
