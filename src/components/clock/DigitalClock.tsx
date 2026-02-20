import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { formatTime } from '../../utils/time'
import { COLORS, FONTS } from '../../constants/theme'

interface Props {
  color?: string
}

export function DigitalClock({ color = COLORS.primary }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const { hours, minutes, seconds } = formatTime(time)

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color, textShadowColor: color }]}>
          {hours}
        </Text>
        <Text style={[styles.colon, { color, textShadowColor: color }]}>:</Text>
        <Text style={[styles.timeText, { color, textShadowColor: color }]}>
          {minutes}
        </Text>
      </View>
      <Text style={[styles.seconds, { color: color + '99' }]}>{seconds}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 96,
    fontFamily: FONTS.digital,
    fontWeight: '200',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  colon: {
    fontSize: 80,
    fontFamily: FONTS.digital,
    fontWeight: '200',
    marginHorizontal: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  seconds: {
    fontSize: 32,
    fontFamily: FONTS.digital,
    fontWeight: '300',
    marginTop: -8,
    letterSpacing: 2,
  },
})
