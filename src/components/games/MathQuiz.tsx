import { useState, useCallback, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { getRandomInt } from '../../utils/random'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

interface Props {
  onComplete: (score: number) => void
}

interface Problem {
  question: string
  answer: number
  options: number[]
}

function generateProblem(): Problem {
  const ops = ['+', '-', '*'] as const
  const op = ops[getRandomInt(0, 2)]!
  let a: number, b: number, answer: number

  switch (op) {
    case '+':
      a = getRandomInt(1, 50)
      b = getRandomInt(1, 50)
      answer = a + b
      break
    case '-':
      a = getRandomInt(10, 99)
      b = getRandomInt(1, a)
      answer = a - b
      break
    case '*':
      a = getRandomInt(2, 12)
      b = getRandomInt(2, 12)
      answer = a * b
      break
  }

  const options = [answer]
  while (options.length < 4) {
    const wrong = answer + getRandomInt(-10, 10)
    if (wrong !== answer && wrong >= 0 && !options.includes(wrong)) {
      options.push(wrong)
    }
  }
  options.sort(() => Math.random() - 0.5)

  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options,
  }
}

export function MathQuiz({ onComplete }: Props) {
  const [problem, setProblem] = useState<Problem>(generateProblem)
  const [solved, setSolved] = useState(0)
  const [total, setTotal] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setIsActive(false)
        const score = total > 0 ? Math.floor((solved / total) * 100) : 0
        onComplete(score)
      }
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isActive, solved, total, onComplete])

  const handleAnswer = useCallback(
    (selected: number) => {
      if (!isActive) return
      setTotal((t) => t + 1)
      if (selected === problem.answer) {
        setSolved((s) => s + 1)
      }
      setProblem(generateProblem())
    },
    [isActive, problem.answer],
  )

  if (!isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>결과: {solved}/{total}</Text>
        <Text style={styles.scoreText}>
          점수: {total > 0 ? Math.floor((solved / total) * 100) : 0}점
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>{timeLeft}초</Text>
        <Text style={styles.counter}>{solved}/{total}</Text>
      </View>
      <Text style={styles.question}>{problem.question}</Text>
      <View style={styles.options}>
        {problem.options.map((opt, i) => (
          <Pressable
            key={`${opt}-${i}`}
            style={styles.option}
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timer: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent,
  },
  counter: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  question: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.text,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  option: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 100,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  scoreText: {
    fontSize: 22,
    color: COLORS.secondary,
  },
})
