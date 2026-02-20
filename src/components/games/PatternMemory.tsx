import { useState, useEffect, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Button } from '../ui/Button'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

const TILE_COLORS = ['#ff6b6b', '#74b9ff', '#00b894', '#fdcb6e']

export function PatternMemory({ onComplete }: Props) {
  const [pattern, setPattern] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [activeTile, setActiveTile] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const showPattern = useCallback((seq: number[]) => {
    setIsShowingPattern(true)
    setPlayerInput([])
    seq.forEach((tile, index) => {
      setTimeout(() => {
        setActiveTile(tile)
        setTimeout(() => setActiveTile(null), 400)
      }, (index + 1) * 700)
    })
    setTimeout(() => {
      setIsShowingPattern(false)
    }, seq.length * 700 + 500)
  }, [])

  const startNextRound = useCallback(() => {
    const nextTile = Math.floor(Math.random() * 4)
    const newPattern = [...pattern, nextTile]
    setPattern(newPattern)
    setRound((r) => r + 1)
    showPattern(newPattern)
  }, [pattern, showPattern])

  useEffect(() => {
    startNextRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTilePress = (tileIndex: number) => {
    if (isShowingPattern || gameOver) return

    const newInput = [...playerInput, tileIndex]
    setPlayerInput(newInput)

    setActiveTile(tileIndex)
    setTimeout(() => setActiveTile(null), 200)

    const currentStep = newInput.length - 1
    if (newInput[currentStep] !== pattern[currentStep]) {
      setGameOver(true)
      const finalScore = round - 1
      setScore(finalScore)
      onComplete(finalScore)
      return
    }

    if (newInput.length === pattern.length) {
      setScore(round)
      setTimeout(() => startNextRound(), 800)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>패턴 기억</Text>
      <Text style={styles.round}>라운드: {round}</Text>
      <Text style={styles.status}>
        {gameOver
          ? `게임 오버! 스코어: ${score}`
          : isShowingPattern
            ? '패턴을 기억하세요!'
            : '패턴을 따라하세요!'}
      </Text>

      <View style={styles.grid}>
        {TILE_COLORS.map((color, index) => (
          <Pressable
            key={index}
            style={[
              styles.tile,
              { backgroundColor: color },
              activeTile === index && styles.tileActive,
              activeTile !== index && !isShowingPattern && styles.tileDim,
            ]}
            onPress={() => handleTilePress(index)}
            disabled={isShowingPattern || gameOver}
          />
        ))}
      </View>

      {gameOver && (
        <Button
          title="다시하기"
          onPress={() => {
            setPattern([])
            setPlayerInput([])
            setRound(0)
            setGameOver(false)
            setScore(0)
            setTimeout(() => {
              const firstTile = Math.floor(Math.random() * 4)
              setPattern([firstTile])
              setRound(1)
              showPattern([firstTile])
            }, 300)
          }}
          fullWidth
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    gap: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  round: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: 16,
    color: COLORS.primaryLight,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 220,
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  tile: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
  },
  tileActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  tileDim: {
    opacity: 0.5,
  },
})
