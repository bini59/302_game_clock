import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'
import { Button } from '../ui/Button'

interface Props {
  onConfirm: (hour: number, minute: number, label: string) => void
  onCancel: () => void
}

export function AlarmPicker({ onConfirm, onCancel }: Props) {
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(0)
  const [label, setLabel] = useState('')

  const adjustHour = (delta: number) => {
    setHour((h) => {
      const next = h + delta
      if (next < 0) return 23
      if (next > 23) return 0
      return next
    })
  }

  const adjustMinute = (delta: number) => {
    setMinute((m) => {
      const next = m + delta
      if (next < 0) return 55
      if (next > 59) return 0
      return next
    })
  }

  const period = hour >= 12 ? '오후' : '오전'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <View style={styles.timeColumn}>
          <Pressable onPress={() => adjustHour(1)} style={styles.arrowBtn}>
            <Text style={styles.arrow}>▲</Text>
          </Pressable>
          <Text style={styles.timeValue}>{displayHour.toString().padStart(2, '0')}</Text>
          <Pressable onPress={() => adjustHour(-1)} style={styles.arrowBtn}>
            <Text style={styles.arrow}>▼</Text>
          </Pressable>
        </View>

        <Text style={styles.colon}>:</Text>

        <View style={styles.timeColumn}>
          <Pressable onPress={() => adjustMinute(5)} style={styles.arrowBtn}>
            <Text style={styles.arrow}>▲</Text>
          </Pressable>
          <Text style={styles.timeValue}>{minute.toString().padStart(2, '0')}</Text>
          <Pressable onPress={() => adjustMinute(-5)} style={styles.arrowBtn}>
            <Text style={styles.arrow}>▼</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setHour((h) => (h >= 12 ? h - 12 : h + 12))}
          style={styles.periodBtn}
        >
          <Text style={styles.periodText}>{period}</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.labelInput}
        placeholder="알람 이름 (선택)"
        placeholderTextColor={COLORS.textMuted}
        value={label}
        onChangeText={setLabel}
        maxLength={30}
      />

      <View style={styles.buttonRow}>
        <Button title="취소" onPress={onCancel} variant="ghost" size="sm" />
        <Button
          title="추가"
          onPress={() => onConfirm(hour, minute, label)}
          size="sm"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  timeColumn: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  arrowBtn: {
    padding: SPACING.xs,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  timeValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    minWidth: 60,
    textAlign: 'center',
  },
  colon: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  periodBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  labelInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
})
