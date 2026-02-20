import { Platform } from 'react-native'

const TEST_BANNER_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111',
})

const TEST_REWARDED_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/1712485313',
  android: 'ca-app-pub-3940256099942544/5224354917',
  default: 'ca-app-pub-3940256099942544/5224354917',
})

const TEST_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
  default: 'ca-app-pub-3940256099942544/1033173712',
})

const PROD_BANNER_ID = 'ca-app-pub-3404990406454167/1114009064'
const PROD_REWARDED_ID = 'ca-app-pub-3404990406454167/3764657900'
const PROD_INTERSTITIAL_ID = 'ca-app-pub-3404990406454167/4917522707'

export const AD_UNIT_IDS = {
  banner: __DEV__ ? TEST_BANNER_ID : PROD_BANNER_ID,
  rewarded: __DEV__ ? TEST_REWARDED_ID : PROD_REWARDED_ID,
  interstitial: __DEV__ ? TEST_INTERSTITIAL_ID : PROD_INTERSTITIAL_ID,
} as const
