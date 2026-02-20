import { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { RARITY_COLORS, RARITY_LABELS } from '../../constants/gachaConfig'
import type { GachaPull } from '../../types/gacha'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import { SpinReveal } from '../animations/SpinReveal'
import { CelebrationEffect } from '../animations/CelebrationEffect'
import { PulseGlow } from '../animations/PulseGlow'

interface Props {
  result: GachaPull | null
  onPull: () => void
  canPull: boolean
  pullCostLabel: string
}

export function GachaAnimation({ result, onPull, canPull, pullCostLabel }: Props) {
  const [isRevealed, setIsRevealed] = useState(false)

  const handlePull = () => {
    setIsRevealed(false)
    onPull()
    setTimeout(() => setIsRevealed(true), 800)
  }

  return (
    <View style={styles.container}>
      {result && isRevealed ? (
        <View style={styles.resultContainer}>
          <CelebrationEffect
            visible={result.item.rarity === 'epic' || result.item.rarity === 'legendary'}
          />
          <SpinReveal visible={isRevealed}>
            <PulseGlow
              color={RARITY_COLORS[result.item.rarity]}
              active={result.item.rarity !== 'normal'}
            >
              <View
                style={[
                  styles.resultCard,
                  { borderColor: RARITY_COLORS[result.item.rarity] },
                ]}
              >
                {result.isNew && <Text style={styles.newBadge}>NEW!</Text>}
                <Text style={styles.resultEmoji}>
                  {result.item.type === 'clockSkin' ? '🕐' :
                   result.item.type === 'pet' ? '🐾' :
                   result.item.type === 'background' ? '🖼️' : '✨'}
                </Text>
                <Text style={styles.resultName}>{result.item.name}</Text>
                <Text
                  style={[
                    styles.resultRarity,
                    { color: RARITY_COLORS[result.item.rarity] },
                  ]}
                >
                  {RARITY_LABELS[result.item.rarity]}
                </Text>
                <Text style={styles.resultDesc}>{result.item.description}</Text>
              </View>
            </PulseGlow>
          </SpinReveal>
        </View>
      ) : result && !isRevealed ? (
        <View style={styles.animContainer}>
          <SpinReveal visible={!isRevealed}>
            <Text style={styles.animText}>✨</Text>
          </SpinReveal>
        </View>
      ) : null}

      <Pressable
        style={[styles.pullButton, !canPull && styles.pullButtonDisabled]}
        onPress={handlePull}
        disabled={!canPull}
      >
        <Text style={styles.pullButtonText}>
          {canPull ? `뽑기 (${pullCostLabel})` : '재화 부족'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.lg,
    alignItems: 'center',
    minWidth: 200,
    gap: SPACING.xs,
  },
  newBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.accent,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  resultEmoji: {
    fontSize: 48,
  },
  resultName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  resultRarity: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  animContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animText: {
    fontSize: 80,
  },
  pullButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
  },
  pullButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.5,
  },
  pullButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.background,
  },
})
