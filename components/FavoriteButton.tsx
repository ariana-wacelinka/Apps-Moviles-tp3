import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import { MealPreview } from '../types/recipes';

type Props = {
  meal: MealPreview;
  size?: number;
  color?: string;
};

const FavoriteButton: React.FC<Props> = ({ meal, size = 24, color }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { effectiveTheme } = useAppTheme();
  const navigationTheme = useTheme();

  const getHeartColor = () => {
    if (color) return color;

    if (isFavorite(meal.idMeal)) {
      return effectiveTheme === 'dark' ? '#FCA5A5' : '#DC2626';
    } else {
      return effectiveTheme === 'dark' ? '#D1D5DB' : '#4B5563';
    }
  };

  return (
    <TouchableOpacity onPress={() => toggleFavorite(meal)} style={{ padding: 4 }}>
      <Ionicons
        name={isFavorite(meal.idMeal) ? 'heart' : 'heart-outline'}
        size={size}
        color={getHeartColor()}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
