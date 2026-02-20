import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { STARTER_PETS, PET_CONFIGS } from '../constants/petConfig'
import { usePetStore } from '../stores/usePetStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { Button } from '../components/ui/Button'
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme'
import type { PetSpecies } from '../types/pet'

export default function OnboardingScreen() {
  const router = useRouter()
  const createPet = usePetStore((s) => s.createPet)
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding)
  const selectPet = useSettingsStore((s) => s.selectPet)

  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | null>(null)
  const [petName, setPetName] = useState('')

  const handleConfirm = () => {
    if (!selectedSpecies || !petName.trim()) return
    const pet = createPet(selectedSpecies, petName.trim())
    selectPet(pet.id)
    completeOnboarding()
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>시간을 키우다</Text>
        <Text style={styles.subtitle}>함께할 펫을 선택하세요!</Text>

        <View style={styles.petGrid}>
          {STARTER_PETS.map((species) => {
            const config = PET_CONFIGS[species]
            const isSelected = selectedSpecies === species
            return (
              <Pressable
                key={species}
                style={[styles.petCard, isSelected && styles.petCardSelected]}
                onPress={() => setSelectedSpecies(species)}
              >
                <Text style={styles.petEmoji}>{config.emoji}</Text>
                <Text style={styles.petName}>{config.displayName}</Text>
              </Pressable>
            )
          })}
        </View>

        {selectedSpecies && (
          <View style={styles.nameSection}>
            <Text style={styles.nameLabel}>이름을 지어주세요</Text>
            <TextInput
              style={styles.nameInput}
              value={petName}
              onChangeText={setPetName}
              placeholder="펫 이름"
              placeholderTextColor={COLORS.textMuted}
              maxLength={10}
            />
          </View>
        )}

        <Button
          title="모험 시작!"
          onPress={handleConfirm}
          size="lg"
          fullWidth
          disabled={!selectedSpecies || !petName.trim()}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  petGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  petCard: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    width: 100,
  },
  petCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
  },
  petEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  petName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  nameSection: {
    gap: SPACING.sm,
  },
  nameLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nameInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
  },
})
