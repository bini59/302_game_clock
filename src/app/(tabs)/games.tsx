import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ReactionGame } from '../../components/games/ReactionGame'
import { MathQuiz } from '../../components/games/MathQuiz'
import { TimeGuess } from '../../components/games/TimeGuess'
import { PatternMemory } from '../../components/games/PatternMemory'
import { ShakeGame } from '../../components/games/ShakeGame'
import { PomodoroTimer } from '../../components/games/PomodoroTimer'
import { CoinDisplay } from '../../components/ui/CoinDisplay'
import { BannerAdComponent } from '../../components/ads/BannerAd'
import { Button } from '../../components/ui/Button'
import { RewardedAdButton } from '../../components/ads/RewardedAdButton'
import { useInterstitialAd, shouldShowInterstitial } from '../../components/ads/InterstitialManager'
import { CelebrationEffect } from '../../components/animations/CelebrationEffect'
import { useGameStore } from '../../stores/useGameStore'
import { useCurrencyStore } from '../../stores/useCurrencyStore'
import { usePetStore } from '../../stores/usePetStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { calculateMiniGameReward } from '../../services/rewardService'
import { useAdFreeStore } from '../../stores/useAdFreeStore'
import { MINI_GAME_DAILY_FREE_PLAYS } from '../../constants/gameConfig'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

type ActiveGame = 'reaction' | 'math' | 'timeGuess' | 'pattern' | 'shake' | 'pomodoro' | null

const GAMES = [
  { id: 'reaction' as const, name: '반응속도', emoji: '⚡', desc: '색이 바뀌면 탭!', baseReward: 15 },
  { id: 'math' as const, name: '수학 퀴즈', emoji: '🧮', desc: '30초 안에 최대한 많이!', baseReward: 20 },
  { id: 'timeGuess' as const, name: '시간 맞추기', emoji: '⏱', desc: '정확히 N초를 맞춰보세요', baseReward: 25 },
  { id: 'pattern' as const, name: '패턴 기억', emoji: '🧩', desc: '색깔 패턴을 기억하세요!', baseReward: 20 },
  { id: 'shake' as const, name: '빠른 탭', emoji: '👆', desc: '10초 안에 최대한 빠르게!', baseReward: 15 },
  { id: 'pomodoro' as const, name: '뽀모도로', emoji: '🍅', desc: '25분 집중 타이머', baseReward: 30 },
]

export default function GamesScreen() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const canPlayFree = useGameStore((s) => s.canPlayFree)
  const playsToday = useGameStore((s) => s.playsToday)
  const recordPlay = useGameStore((s) => s.recordPlay)
  const addGameResult = useGameStore((s) => s.addGameResult)
  const incrementInterstitialCount = useGameStore((s) => s.incrementInterstitialCount)
  const addCoins = useCurrencyStore((s) => s.addCoins)
  const addExp = usePetStore((s) => s.addExp)
  const selectedPetId = useSettingsStore((s) => s.selectedPetId)
  const hasCoinBooster = useAdFreeStore((s) => s.hasCoinBooster)
  const { showIfReady } = useInterstitialAd()

  const handleGameComplete = useCallback(
    (gameId: string, score: number) => {
      const game = GAMES.find((g) => g.id === gameId)
      if (!game) return

      const reward = calculateMiniGameReward(game.baseReward, score, hasCoinBooster())

      addCoins(reward.coins)
      if (selectedPetId) {
        addExp(selectedPetId, reward.exp)
      }

      addGameResult({
        gameType: gameId as any,
        score,
        coinsEarned: reward.coins,
        expEarned: reward.exp,
        completedAt: Date.now(),
        isAlarmGame: false,
      })

      recordPlay()
      setShowCelebration(true)

      // Show interstitial ad every N games
      const count = incrementInterstitialCount()
      if (shouldShowInterstitial(count)) {
        setTimeout(() => showIfReady(), 1500)
      }

      setTimeout(() => {
        setShowCelebration(false)
        setActiveGame(null)
      }, 2000)
    },
    [hasCoinBooster, addCoins, addExp, selectedPetId, addGameResult, recordPlay, incrementInterstitialCount, showIfReady],
  )

  if (activeGame) {
    const GameComponent = {
      reaction: ReactionGame,
      math: MathQuiz,
      timeGuess: TimeGuess,
      pattern: PatternMemory,
      shake: ShakeGame,
      pomodoro: PomodoroTimer,
    }[activeGame]

    return (
      <SafeAreaView style={styles.container}>
        <CelebrationEffect visible={showCelebration} />
        <View style={styles.gameHeader}>
          <Button
            title="← 돌아가기"
            onPress={() => setActiveGame(null)}
            variant="ghost"
            size="sm"
          />
        </View>
        <GameComponent onComplete={(score) => handleGameComplete(activeGame, score)} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>미니게임</Text>
        <CoinDisplay />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.playsInfo}>
          <Text style={styles.playsText}>
            오늘 무료 플레이: {playsToday}/{MINI_GAME_DAILY_FREE_PLAYS}
          </Text>
        </View>

        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            style={styles.gameCard}
            onPress={() => {
              if (canPlayFree()) {
                setActiveGame(game.id)
              }
            }}
          >
            <Text style={styles.gameEmoji}>{game.emoji}</Text>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameDesc}>{game.desc}</Text>
            </View>
            <Text style={styles.gameReward}>🪙 {game.baseReward}</Text>
          </Pressable>
        ))}

        {!canPlayFree() && (
          <RewardedAdButton
            title="광고 보고 추가 플레이"
            onRewardEarned={() => {
              useGameStore.getState().resetDailyPlays()
            }}
          />
        )}
      </ScrollView>

      <BannerAdComponent />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  playsInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  playsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gameEmoji: {
    fontSize: 36,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  gameDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  gameReward: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
  gameHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
})
