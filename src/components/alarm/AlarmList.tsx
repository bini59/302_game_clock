import { useState } from 'react'
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native'
import { useAlarmStore, type Alarm } from '../../stores/useAlarmStore'
import { scheduleAlarm, cancelAlarm } from '../../services/notificationService'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import { Button } from '../ui/Button'
import { AlarmPicker } from './AlarmPicker'

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? '오후' : '오전'
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const m = minute.toString().padStart(2, '0')
  return `${period} ${h}:${m}`
}

function AlarmItem({ alarm }: { alarm: Alarm }) {
  const toggleAlarm = useAlarmStore((s) => s.toggleAlarm)
  const removeAlarm = useAlarmStore((s) => s.removeAlarm)
  const updateNotificationId = useAlarmStore((s) => s.updateNotificationId)

  const handleToggle = async () => {
    if (alarm.enabled && alarm.notificationId) {
      await cancelAlarm(alarm.notificationId)
      updateNotificationId(alarm.id, null)
    } else if (!alarm.enabled) {
      try {
        const notifId = await scheduleAlarm(alarm.hour, alarm.minute, alarm.label)
        updateNotificationId(alarm.id, notifId)
      } catch {
        // notification scheduling failed silently
      }
    }
    toggleAlarm(alarm.id)
  }

  const handleRemove = async () => {
    if (alarm.notificationId) {
      await cancelAlarm(alarm.notificationId)
    }
    removeAlarm(alarm.id)
  }

  return (
    <View style={styles.alarmItem}>
      <View style={styles.alarmInfo}>
        <Text style={styles.alarmTime}>{formatTime(alarm.hour, alarm.minute)}</Text>
        {alarm.label ? (
          <Text style={styles.alarmLabel}>{alarm.label}</Text>
        ) : null}
      </View>
      <View style={styles.alarmActions}>
        <Switch
          value={alarm.enabled}
          onValueChange={handleToggle}
          trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary }}
          thumbColor={COLORS.text}
        />
        <Pressable onPress={handleRemove} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>삭제</Text>
        </Pressable>
      </View>
    </View>
  )
}

export function AlarmList() {
  const alarms = useAlarmStore((s) => s.alarms)
  const addAlarm = useAlarmStore((s) => s.addAlarm)
  const updateNotificationId = useAlarmStore((s) => s.updateNotificationId)
  const [showPicker, setShowPicker] = useState(false)

  const handleAdd = async (hour: number, minute: number, label: string) => {
    const alarm = addAlarm(hour, minute, label)
    try {
      const notifId = await scheduleAlarm(hour, minute, label)
      updateNotificationId(alarm.id, notifId)
    } catch {
      // notification scheduling failed
    }
    setShowPicker(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>알람</Text>
        <Text style={styles.count}>{alarms.length}개</Text>
      </View>

      {alarms.length === 0 ? (
        <Text style={styles.emptyText}>설정된 알람이 없습니다</Text>
      ) : (
        <View style={styles.list}>
          {[...alarms]
            .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))
            .map((alarm) => (
              <AlarmItem key={alarm.id} alarm={alarm} />
            ))}
        </View>
      )}

      {showPicker ? (
        <AlarmPicker onConfirm={handleAdd} onCancel={() => setShowPicker(false)} />
      ) : (
        <Button
          title="+ 알람 추가"
          onPress={() => setShowPicker(true)}
          variant="outline"
          fullWidth
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  count: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  list: {
    gap: SPACING.sm,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  alarmInfo: {
    flex: 1,
    gap: 2,
  },
  alarmTime: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  alarmLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  alarmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  deleteText: {
    fontSize: 13,
    color: COLORS.error,
  },
})
