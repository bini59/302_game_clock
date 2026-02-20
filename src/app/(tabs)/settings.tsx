import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../../components/ui/Button'
import { RewardedAdButton } from '../../components/ads/RewardedAdButton'
import { AchievementList } from '../../components/achievement/AchievementList'
import { StreakBadge } from '../../components/achievement/StreakBadge'
import { AlarmList } from '../../components/alarm/AlarmList'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useAdFreeStore } from '../../stores/useAdFreeStore'
import { useAttendanceStore } from '../../stores/useAttendanceStore'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { calculateCheckInReward } from '../../services/rewardService'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

export default function SettingsScreen() {
  const settings = useSettingsStore()
  const adFreeStore = useAdFreeStore()
  const attendance = useAttendanceStore()
  const addCoins = useCurrencyStore((s) => s.addCoins)
  const addGems = useCurrencyStore((s) => s.addGems)

  const handleCheckIn = () => {
    const result = attendance.checkIn()
    if (result.isNew) {
      const reward = calculateCheckInReward(result.streak)
      addCoins(reward.coins)
    }
  }

  const remainingAdFree = adFreeStore.getRemainingAdFreeTime()

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Streak Badge */}
        <StreakBadge streak={attendance.streak} totalDays={attendance.totalDays} />

        {/* Daily Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>출석 체크</Text>
          <Button
            title={attendance.hasCheckedInToday() ? '오늘 출석 완료!' : '출석 체크하기'}
            onPress={handleCheckIn}
            disabled={attendance.hasCheckedInToday()}
            fullWidth
          />
        </View>

        {/* Ad Removal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>광고 제거</Text>
          {remainingAdFree ? (
            <Text style={styles.adFreeText}>광고 없는 시간: {remainingAdFree}</Text>
          ) : (
            <RewardedAdButton
              title="광고 보고 24시간 광고 제거"
              onRewardEarned={() => adFreeStore.activateAdFree()}
            />
          )}
        </View>

        {/* Rewarded Gems */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>무료 젬</Text>
          <RewardedAdButton
            title="광고 보고 젬 5개 받기"
            onRewardEarned={() => addGems(5)}
          />
        </View>

        {/* Coin Booster */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>코인 부스터</Text>
          {adFreeStore.hasCoinBooster() ? (
            <Text style={styles.boosterText}>코인 2배 부스터 활성 중!</Text>
          ) : (
            <RewardedAdButton
              title="광고 보고 1시간 코인 2배"
              onRewardEarned={() => adFreeStore.activateCoinBooster()}
            />
          )}
        </View>

        {/* Alarms */}
        <View style={styles.section}>
          <AlarmList />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>사운드</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => settings.updateSettings({ soundEnabled: v })}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>햅틱 피드백</Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={(v) => settings.updateSettings({ hapticEnabled: v })}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>알람</Text>
            <Switch
              value={settings.alarmEnabled}
              onValueChange={(v) => settings.updateSettings({ alarmEnabled: v })}
              trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>업적</Text>
          <AchievementList />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  streakText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  adFreeText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '600',
  },
  boosterText: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  settingLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
})
