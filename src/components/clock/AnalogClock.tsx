import { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Circle, Line } from 'react-native-svg'
import { COLORS } from '../../constants/theme'

interface Props {
  size?: number
  color?: string
}

export function AnalogClock({ size = 280, color = COLORS.primary }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const center = size / 2
  const radius = size / 2 - 10

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180)
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180)
  const secondAngle = (seconds * 6 - 90) * (Math.PI / 180)

  const hourLength = radius * 0.5
  const minuteLength = radius * 0.7
  const secondLength = radius * 0.85

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Clock face */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.border}
          strokeWidth={2}
          fill="transparent"
        />

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180)
          const innerR = radius - 15
          const outerR = radius - 5
          return (
            <Line
              key={i}
              x1={center + innerR * Math.cos(angle)}
              y1={center + innerR * Math.sin(angle)}
              x2={center + outerR * Math.cos(angle)}
              y2={center + outerR * Math.sin(angle)}
              stroke={COLORS.textSecondary}
              strokeWidth={2}
              strokeLinecap="round"
            />
          )
        })}

        {/* Hour hand */}
        <Line
          x1={center}
          y1={center}
          x2={center + hourLength * Math.cos(hourAngle)}
          y2={center + hourLength * Math.sin(hourAngle)}
          stroke={COLORS.text}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <Line
          x1={center}
          y1={center}
          x2={center + minuteLength * Math.cos(minuteAngle)}
          y2={center + minuteLength * Math.sin(minuteAngle)}
          stroke={COLORS.text}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Second hand */}
        <Line
          x1={center}
          y1={center}
          x2={center + secondLength * Math.cos(secondAngle)}
          y2={center + secondLength * Math.sin(secondAngle)}
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <Circle cx={center} cy={center} r={4} fill={color} />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
