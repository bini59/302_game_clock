import { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PetDisplay } from '../../components/pet/PetDisplay'
import { PetInteraction } from '../../components/pet/PetInteraction'
import { PetFeed } from '../../components/pet/PetFeed'
import { GrowthProgress } from '../../components/pet/GrowthProgress'
import { RewardedAdButton } from '../../components/ads/RewardedAdButton'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { usePetStore } from '../../stores/usePetStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

export default function PetScreen() {
  const pets = usePetStore((s) => s.pets)
  const food = usePetStore((s) => s.food)
  const addFood = usePetStore((s) => s.addFood)
  const selectedPetId = useSettingsStore((s) => s.selectedPetId)
  const selectPet = useSettingsStore((s) => s.selectPet)
  const [showInteraction, setShowInteraction] = useState(false)

  const activePet = pets.find((p) => p.id === selectedPetId)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 펫</Text>
        <CoinDisplay />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activePet && (
          <View style={styles.activePetSection}>
            <PetDisplay
              pet={activePet}
              size="lg"
              onPress={() => setShowInteraction(true)}
            />
            <Text style={styles.tapHint}>탭하여 상호작용</Text>
          </View>
        )}

        {activePet && <GrowthProgress pet={activePet} />}

        {activePet && <PetFeed petId={activePet.id} />}

        <View style={styles.foodSection}>
          <Text style={styles.sectionTitle}>먹이 보충</Text>
          <RewardedAdButton
            title="광고 보고 먹이 3개 받기"
            onRewardEarned={() => addFood(3)}
          />
        </View>

        {pets.length > 1 && (
          <View style={styles.petList}>
            <Text style={styles.sectionTitle}>보유 펫</Text>
            <View style={styles.petGrid}>
              {pets.map((pet) => (
                <Pressable
                  key={pet.id}
                  style={[
                    styles.petCard,
                    pet.id === selectedPetId && styles.petCardActive,
                  ]}
                  onPress={() => selectPet(pet.id)}
                >
                  <PetDisplay pet={pet} size="sm" showProgress={false} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {activePet && (
        <PetInteraction
          pet={activePet}
          visible={showInteraction}
          onClose={() => setShowInteraction(false)}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  activePetSection: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  tapHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  foodSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  petList: {
    gap: SPACING.sm,
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  petCard: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  petCardActive: {
    borderColor: COLORS.primary,
  },
})
