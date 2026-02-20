import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { formatDate, getDayOfWeek } from '../../utils/time'
import { COLORS, SPACING } from '../../constants/theme'

export function DateWeather() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(now)}</Text>
      <Text style={styles.day}>{getDayOfWeek(now)}요일</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  date: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  day: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
})
