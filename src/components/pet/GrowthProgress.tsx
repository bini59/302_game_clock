import { View, Text, StyleSheet } from 'react-native'
import { PET_CONFIGS } from '../../constants/petConfig'
import { SCREEN_TIME_EXP_PER_HOUR } from '../../constants/gameConfig'
import { ProgressBar } from '../ui/ProgressBar'
import type { Pet, GrowthStage } from '../../types/pet'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  pet: Pet
}

const STAGE_LABELS: Record<GrowthStage, string> = {
  egg: '🥚 알',
  baby: '🐣 아기',
  teen: '🌱 청소년',
  adult: '⭐ 성체',
  legendary: '👑 레전더리',
}

const STAGE_ORDER: GrowthStage[] = ['egg', 'baby', 'teen', 'adult', 'legendary']

export function GrowthProgress({ pet }: Props) {
  const config = PET_CONFIGS[pet.species]
  const requiredExp = config.expToNextStage[pet.stage]
  const isMaxLevel = pet.stage === 'legendary'
  const progress = isMaxLevel ? 1 : Math.min(pet.exp / requiredExp, 1)

  const currentStageIndex = STAGE_ORDER.indexOf(pet.stage)
  const nextStage = isMaxLevel ? null : STAGE_ORDER[currentStageIndex + 1]

  const remainingExp = isMaxLevel ? 0 : requiredExp - pet.exp
  const estimatedHours = isMaxLevel
    ? 0
    : Math.ceil(remainingExp / SCREEN_TIME_EXP_PER_HOUR)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>성장 정보</Text>

      <View style={styles.stageRow}>
        {STAGE_ORDER.map((stage, index) => (
          <View key={stage} style={styles.stageItem}>
            <Text
              style={[
                styles.stageLabel,
                index <= currentStageIndex && styles.stageLabelActive,
              ]}
            >
              {STAGE_LABELS[stage]}
            </Text>
            {index < STAGE_ORDER.length - 1 && (
              <Text style={styles.stageArrow}>→</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          color={isMaxLevel ? COLORS.gold : COLORS.secondary}
          height={8}
        />
        <View style={styles.expRow}>
          <Text style={styles.expText}>
            {isMaxLevel ? 'MAX LEVEL' : `${pet.exp} / ${requiredExp} EXP`}
          </Text>
          {!isMaxLevel && nextStage && (
            <Text style={styles.nextText}>
              다음: {STAGE_LABELS[nextStage]}
            </Text>
          )}
        </View>
      </View>

      {!isMaxLevel && (
        <Text style={styles.estimateText}>
          예상 소요: 약 {estimatedHours}시간 (화면 켜둔 시간 기준)
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  stageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stageLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  stageLabelActive: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  stageArrow: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  progressSection: {
    gap: 4,
  },
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  nextText: {
    fontSize: 12,
    color: COLORS.primaryLight,
  },
  estimateText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
})
