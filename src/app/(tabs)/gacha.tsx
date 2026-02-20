import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GachaAnimation } from '../../components/gacha/GachaAnimation'
import { CollectionGrid } from '../../components/gacha/CollectionGrid'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { BannerAdComponent } from '../../components/ads/BannerAd'
import { Button } from '../../components/ui/Button'
import { useGachaStore } from '../../stores/useGachaStore'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { GACHA_COST_COINS, GACHA_PITY_THRESHOLD } from '../../constants/gameConfig'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import type { GachaPull } from '../../types/gacha'

export default function GachaScreen() {
  const doPull = useGachaStore((s) => s.doPull)
  const pityCount = useGachaStore((s) => s.pityCount)
  const spendCoins = useCurrencyStore((s) => s.spendCoins)
  const coins = useCurrencyStore((s) => s.coins)
  const [lastPull, setLastPull] = useState<GachaPull | null>(null)
  const [showCollection, setShowCollection] = useState(false)

  const canAfford = coins >= GACHA_COST_COINS

  const handlePull = () => {
    const success = spendCoins(GACHA_COST_COINS)
    if (!success) return
    const result = doPull()
    setLastPull(result)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>뽑기</Text>
        <CoinDisplay />
      </View>

      {showCollection ? (
        <View style={styles.collectionContainer}>
          <Button
            title="뽑기로 돌아가기"
            onPress={() => setShowCollection(false)}
            variant="ghost"
          />
          <CollectionGrid />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <GachaAnimation
            result={lastPull}
            onPull={handlePull}
            canPull={canAfford}
            pullCostLabel={`${GACHA_COST_COINS} 코인`}
          />

          <View style={styles.pitySection}>
            <Text style={styles.pityLabel}>
              천장까지: {pityCount}/{GACHA_PITY_THRESHOLD}
            </Text>
            <ProgressBar
              progress={pityCount / GACHA_PITY_THRESHOLD}
              color={COLORS.gold}
              height={6}
            />
            <Text style={styles.pityHint}>
              {GACHA_PITY_THRESHOLD}회 뽑기 시 에픽 이상 확정!
            </Text>
          </View>

          <Button
            title="컬렉션 보기"
            onPress={() => setShowCollection(true)}
            variant="outline"
            fullWidth
          />
        </ScrollView>
      )}

      <BannerAdComponent />
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
    alignItems: 'center',
  },
  collectionContainer: {
    flex: 1,
  },
  pitySection: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  pityLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  pityHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
})
