import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from '../ui/Button'
import { usePetStore } from '../../stores/usePetStore'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { FOOD_MAX_CAPACITY } from '../../constants/gameConfig'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  petId: string
}

export function PetFeed({ petId }: Props) {
  const food = usePetStore((s) => s.food)
  const feedPet = usePetStore((s) => s.feedPet)
  const addCoins = useCurrencyStore((s) => s.addCoins)
  const [feedback, setFeedback] = useState('')

  const handleFeed = () => {
    const result = feedPet(petId)
    if (result.success) {
      addCoins(result.coinsEarned)
      setFeedback(`+${result.expEarned} EXP, +${result.coinsEarned} 코인!`)
      setTimeout(() => setFeedback(''), 2000)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>먹이주기</Text>
        <Text style={styles.foodCount}>🍖 {food}/{FOOD_MAX_CAPACITY}</Text>
      </View>
      {feedback !== '' && (
        <Text style={styles.feedback}>{feedback}</Text>
      )}
      <Button
        title={food > 0 ? '먹이주기 (+20 EXP, +10 코인)' : '먹이가 없어요!'}
        onPress={handleFeed}
        disabled={food <= 0}
        fullWidth
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  foodCount: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
  feedback: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'center',
  },
})
