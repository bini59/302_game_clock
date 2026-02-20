import { useState, useCallback } from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ClockSkinRenderer } from '../../components/clock/ClockSkinRenderer'
import { DateWeather } from '../../components/clock/DateWeather'
import { PetDisplay } from '../../components/pet/PetDisplay'
import { PetInteraction } from '../../components/pet/PetInteraction'
import { BannerAdComponent } from '../../components/ads/BannerAd'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useClockStore } from '../../stores/useClockStore'
import { usePetStore } from '../../stores/usePetStore'
import { COLORS, SPACING } from '../../constants/theme'
import type { ClockSkinType } from '../../types/store'

export default function ClockScreen() {
  const selectedSkinId = useSettingsStore((s) => s.selectedClockSkin)
  const selectedPetId = useSettingsStore((s) => s.selectedPetId)
  const getSkinById = useClockStore((s) => s.getSkinById)
  const pets = usePetStore((s) => s.pets)
  const [showPetModal, setShowPetModal] = useState(false)
  const [isUIHidden, setIsUIHidden] = useState(false)

  const skin = getSkinById(selectedSkinId)
  const skinType: ClockSkinType = skin?.type ?? 'digital'
  const activePet = pets.find((p) => p.id === selectedPetId)

  const toggleUI = useCallback(() => {
    setIsUIHidden((prev) => !prev)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.clockArea} onPress={toggleUI}>
        {!isUIHidden && (
          <View style={styles.topBar}>
            <CoinDisplay />
          </View>
        )}

        <View style={styles.clockCenter}>
          <ClockSkinRenderer skinType={skinType} skinId={selectedSkinId} />
          {!isUIHidden && <DateWeather />}
        </View>

        {!isUIHidden && activePet && (
          <Pressable
            style={styles.petArea}
            onPress={() => setShowPetModal(true)}
          >
            <PetDisplay pet={activePet} size="sm" showProgress={false} />
          </Pressable>
        )}
      </Pressable>

      {!isUIHidden && <BannerAdComponent />}

      {activePet && (
        <PetInteraction
          pet={activePet}
          visible={showPetModal}
          onClose={() => setShowPetModal(false)}
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
  clockArea: {
    flex: 1,
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.md,
    zIndex: 10,
  },
  clockCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  petArea: {
    position: 'absolute',
    bottom: SPACING.lg,
    alignSelf: 'center',
  },
})
