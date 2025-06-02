import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Meal } from '../types/recipes';

interface MealSearchCardProps {
  meal: Meal;
  onPress?: (meal: Meal) => void;
}

const MealSearchCard: React.FC<MealSearchCardProps> = ({ meal, onPress }) => {
  const mealCategory = meal.strCategory;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress && onPress(meal)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {meal.strMeal}
        </Text>
        <Text style={styles.category} numberOfLines={1} ellipsizeMode="tail">
          {mealCategory}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee'
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#666',
  },
});

export default MealSearchCard;