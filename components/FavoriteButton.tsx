import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import { MealPreview } from '../types/recipes';

type Props = {
  meal: MealPreview;
  size?: number;
  color?: string;
};

const FavoriteButton: React.FC<Props> = ({ meal, size = 24, color = 'tomato' }) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <TouchableOpacity onPress={() => toggleFavorite(meal)}>
      <Ionicons
        name={isFavorite(meal.idMeal) ? 'heart' : 'heart-outline'}
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
