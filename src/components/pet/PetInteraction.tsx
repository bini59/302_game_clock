import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { PetDisplay } from './PetDisplay'
import { usePetStore } from '../../stores/usePetStore'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import type { Pet } from '../../types/pet'

interface Props {
  pet: Pet
  visible: boolean
  onClose: () => void
}

export function PetInteraction({ pet, visible, onClose }: Props) {
  const feedPet = usePetStore((s) => s.feedPet)
  const interactWithPet = usePetStore((s) => s.interactWithPet)
  const getInteractCooldown = usePetStore((s) => s.getInteractCooldown)
  const food = usePetStore((s) => s.food)
  const addCoins = useCurrencyStore((s) => s.addCoins)
  const [feedback, setFeedback] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!visible) return
    setCooldown(getInteractCooldown(pet.id))
    const interval = setInterval(() => {
      setCooldown(getInteractCooldown(pet.id))
    }, 1000)
    return () => clearInterval(interval)
  }, [visible, pet.id, getInteractCooldown])

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 2000)
  }

  const handleFeed = () => {
    const result = feedPet(pet.id)
    if (result.success) {
      addCoins(result.coinsEarned)
      showFeedback(`+${result.expEarned} EXP, +${result.coinsEarned} 코인!`)
    }
  }

  const handlePat = () => {
    const result = interactWithPet(pet.id)
    if (result.success) {
      addCoins(result.coinsEarned)
      showFeedback(`+${result.expEarned} EXP, +${result.coinsEarned} 코인!`)
    } else if (result.cooldownRemaining > 0) {
      const min = Math.floor(result.cooldownRemaining / 60)
      const sec = result.cooldownRemaining % 60
      showFeedback(`쿨다운: ${min}분 ${sec}초 남음`)
    }
  }

  const formatCooldown = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${String(sec).padStart(2, '0')}`
  }

  return (
    <Modal visible={visible} onClose={onClose} title="펫과 놀기">
      <View style={styles.content}>
        <PetDisplay pet={pet} size="lg" showProgress />

        {feedback !== '' && (
          <View style={styles.feedbackBadge}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title={food > 0 ? `먹이주기 (${food}개)` : '먹이가 없어요!'}
            onPress={handleFeed}
            variant="primary"
            disabled={food <= 0}
            fullWidth
          />
          <Text style={styles.rewardHint}>+20 EXP, +10 코인</Text>

          <Button
            title={cooldown > 0 ? `쓰다듬기 (${formatCooldown(cooldown)})` : '쓰다듬기'}
            onPress={handlePat}
            variant="secondary"
            disabled={cooldown > 0}
            fullWidth
          />
          <Text style={styles.rewardHint}>+5 EXP, +3 코인 (5분마다)</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  feedbackBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  feedbackText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    width: '100%',
    gap: SPACING.sm,
  },
  rewardHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
})
