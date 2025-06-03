import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MealPreview } from '../types/recipes';
import FavoriteButton from './FavoriteButton';

interface MealSearchCardProps {
  meal: MealPreview;
  onPress?: (meal: MealPreview) => void;
  category?: string;
}

const handleMealPress = (meal: MealPreview) => {
  console.log('Meal selected:', meal.idMeal);
};

const MealSearchCard: React.FC<MealSearchCardProps> = ({ meal, category }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.cardContainer, {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border
      }]}
      onPress={() => handleMealPress(meal)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.name, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {meal.strMeal}
          </Text>
          <FavoriteButton meal={meal} />
        </View>
        {category != null && (
          <Text
            style={[styles.category, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {category}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 4,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    borderWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
    maxWidth: '85%',
  },
  category: {
    fontSize: 13,
  },
});

export default MealSearchCard;
