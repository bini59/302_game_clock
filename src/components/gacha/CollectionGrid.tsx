import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useGachaStore } from '../../stores/useGachaStore'
import { GACHA_POOL_ITEMS } from '../../constants/gachaConfig'
import { RARITY_COLORS } from '../../constants/gachaConfig'
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme'

export function CollectionGrid() {
  const ownedItemIds = useGachaStore((s) => s.ownedItemIds)

  return (
    <FlatList
      data={GACHA_POOL_ITEMS}
      numColumns={3}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => {
        const isOwned = ownedItemIds.includes(item.id)
        return (
          <View
            style={[
              styles.card,
              { borderColor: isOwned ? RARITY_COLORS[item.rarity] : COLORS.border },
              !isOwned && styles.locked,
            ]}
          >
            <Text style={styles.emoji}>
              {isOwned ? (
                item.type === 'clockSkin' ? '🕐' :
                item.type === 'pet' ? '🐾' :
                item.type === 'background' ? '🖼️' : '✨'
              ) : '❓'}
            </Text>
            <Text
              style={[styles.name, !isOwned && styles.lockedText]}
              numberOfLines={1}
            >
              {isOwned ? item.name : '???'}
            </Text>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  grid: {
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.xs,
    padding: SPACING.xs,
  },
  locked: {
    opacity: 0.4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  name: {
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
  },
  lockedText: {
    color: COLORS.textMuted,
  },
})
