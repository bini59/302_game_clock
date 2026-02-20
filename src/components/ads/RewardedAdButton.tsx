import { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads'
import { Button } from '../ui/Button'
import { AD_UNIT_IDS } from '../../constants/adUnits'

interface Props {
  title: string
  onRewardEarned: () => void
}

export function RewardedAdButton({ title, onRewardEarned }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null)

  const loadAd = useCallback(() => {
    const ad = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded)

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true)
      setLoading(false)
    })

    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onRewardEarned()
      },
    )

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false)
      setRewarded(null)
    })

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false)
      setLoading(false)
      setRewarded(null)
    })

    setRewarded(ad)
    setLoading(true)
    ad.load()

    return () => {
      unsubLoaded()
      unsubEarned()
      unsubClosed()
      unsubError()
    }
  }, [onRewardEarned])

  useEffect(() => {
    const cleanup = loadAd()
    return cleanup
  }, [loadAd])

  const handlePress = () => {
    if (loaded && rewarded) {
      rewarded.show()
    } else if (!loading) {
      loadAd()
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={loading ? '광고 로딩...' : `🎬 ${title}`}
        onPress={handlePress}
        variant="outline"
        disabled={loading}
        fullWidth
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})
