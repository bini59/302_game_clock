import { Pressable, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  fullWidth?: boolean
  style?: ViewStyle
}

const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
    text: { fontSize: 13 },
  },
  md: {
    container: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2 },
    text: { fontSize: 15 },
  },
  lg: {
    container: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md },
    text: { fontSize: 17 },
  },
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
}: Props) {
  const sizeStyle = SIZE_STYLES[size]

  const containerStyle: ViewStyle = {
    ...styles.base,
    ...sizeStyle.container,
    ...(variant === 'primary' && styles.primary),
    ...(variant === 'secondary' && styles.secondary),
    ...(variant === 'outline' && styles.outline),
    ...(variant === 'ghost' && styles.ghost),
    ...(disabled && styles.disabled),
    ...(fullWidth && styles.fullWidth),
    ...style,
  }

  const textStyle: TextStyle = {
    ...styles.text,
    ...sizeStyle.text,
    ...(variant === 'outline' && { color: COLORS.primary }),
    ...(variant === 'ghost' && { color: COLORS.textSecondary }),
    ...(disabled && { color: COLORS.textMuted }),
  }

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, pressed && !disabled && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: COLORS.surfaceLight,
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: COLORS.text,
    fontWeight: '600',
  },
})
