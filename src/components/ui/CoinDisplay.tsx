import { View, Text, StyleSheet } from 'react-native'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { COLORS, SPACING } from '../../constants/theme'
import { formatNumber } from '../../utils/format'

export function CoinDisplay() {
  const coins = useCurrencyStore((s) => s.coins)
  const gems = useCurrencyStore((s) => s.gems)

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.icon}>🪙</Text>
        <Text style={styles.value}>{formatNumber(coins)}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.icon}>💎</Text>
        <Text style={[styles.value, { color: COLORS.secondary }]}>
          {formatNumber(gems)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    gap: 4,
  },
  icon: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
  },
})
