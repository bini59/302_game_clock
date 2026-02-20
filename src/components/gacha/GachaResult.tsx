import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../ui/Button'
import type { Rarity } from '../../types/gacha'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  itemName: string
  emoji: string
  rarity: Rarity
  isNew: boolean
  onDismiss: () => void
}

const RARITY_LABELS: Record<Rarity, string> = {
  normal: '일반',
  rare: '레어',
  epic: '에픽',
  legendary: '레전더리',
}

export function GachaResult({ itemName, emoji, rarity, isNew, onDismiss }: Props) {
  const rarityColor = COLORS.rarity[rarity]

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { borderColor: rarityColor }]}>
        {isNew && <Text style={styles.newBadge}>NEW!</Text>}
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.name}>{itemName}</Text>
        <Text style={[styles.rarity, { color: rarityColor }]}>
          ★ {RARITY_LABELS[rarity]} ★
        </Text>
        <Button title="확인" onPress={onDismiss} fullWidth />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
    borderWidth: 2,
  },
  newBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 2,
  },
  emoji: {
    fontSize: 72,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  rarity: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
})
