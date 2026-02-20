import { View, StyleSheet } from 'react-native'
import { BannerAd as GADBannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { useAdFreeStore } from '../../stores/useAdFreeStore'
import { AD_UNIT_IDS } from '../../constants/adUnits'
import { COLORS } from '../../constants/theme'

export function BannerAdComponent() {
  const isAdFree = useAdFreeStore((s) => s.isAdFree)

  if (isAdFree()) return null

  return (
    <View style={styles.container}>
      <GADBannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
})
