import { useEffect, useCallback, useRef } from 'react'
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads'
import { useAdFreeStore } from '../../stores/useAdFreeStore'
import { INTERSTITIAL_FREQUENCY } from '../../constants/gameConfig'
import { AD_UNIT_IDS } from '../../constants/adUnits'

let interstitialAd: InterstitialAd | null = null

function getInterstitialAd(): InterstitialAd {
  if (!interstitialAd) {
    interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial!)
  }
  return interstitialAd
}

export function useInterstitialAd() {
  const isAdFree = useAdFreeStore((s) => s.isAdFree)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (isAdFree()) return

    const ad = getInterstitialAd()

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true
    })

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false
      interstitialAd = null
      // Pre-load next ad
      const nextAd = getInterstitialAd()
      nextAd.load()
    })

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      loadedRef.current = false
    })

    ad.load()

    return () => {
      unsubLoaded()
      unsubClosed()
      unsubError()
    }
  }, [isAdFree])

  const showIfReady = useCallback(() => {
    if (isAdFree()) return false
    if (!loadedRef.current) return false

    const ad = getInterstitialAd()
    ad.show()
    return true
  }, [isAdFree])

  return { showIfReady }
}

export function shouldShowInterstitial(interstitialCount: number): boolean {
  return interstitialCount > 0 && interstitialCount % INTERSTITIAL_FREQUENCY === 0
}
