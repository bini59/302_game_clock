import { Pressable, View, Text, StyleSheet } from 'react-native'
import { PET_CONFIGS } from '../../constants/petConfig'
import type { Pet, GrowthStage } from '../../types/pet'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import { ProgressBar } from '../ui/ProgressBar'
import { BouncingEmoji } from '../animations/BouncingEmoji'

interface Props {
  pet: Pet
  onPress?: () => void
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const STAGE_LABELS: Record<GrowthStage, string> = {
  egg: '알',
  baby: '아기',
  teen: '청소년',
  adult: '성체',
  legendary: '레전더리',
}

const EMOJI_SIZES: Record<string, number> = {
  sm: 32,
  md: 64,
  lg: 96,
}

export function PetDisplay({ pet, onPress, showProgress = true, size = 'md' }: Props) {
  const config = PET_CONFIGS[pet.species]
  const expThreshold = config.expToNextStage[pet.stage]
  const progress = expThreshold === Infinity ? 1 : pet.exp / expThreshold

  const moodEmoji = pet.mood === 'happy' ? '😊' : pet.mood === 'sad' ? '😢' : pet.mood === 'hungry' ? '😋' : '😐'

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <BouncingEmoji emoji={config.emoji} size={EMOJI_SIZES[size]} />
      <Text style={styles.name}>{pet.name}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.stage}>{STAGE_LABELS[pet.stage]}</Text>
        <Text style={styles.mood}>{moodEmoji}</Text>
      </View>
      {showProgress && pet.stage !== 'legendary' && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={COLORS.secondary} height={6} />
          <Text style={styles.expText}>
            EXP {pet.exp}/{expThreshold === Infinity ? 'MAX' : expThreshold}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  emoji: {
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  stage: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  mood: {
    fontSize: 14,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 200,
    marginTop: SPACING.sm,
    gap: 4,
  },
  expText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
})
