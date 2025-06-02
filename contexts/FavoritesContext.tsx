import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MealPreview } from '../types/recipes';

type FavoritesContextType = {
  favorites: MealPreview[];
  toggleFavorite: (meal: MealPreview) => void;
  isFavorite: (idMeal: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<MealPreview[]>([]);

  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem('@favorites');
      if (json) setFavorites(JSON.parse(json));
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (meal: MealPreview) => {
    setFavorites(prev =>
      prev.some(fav => fav.idMeal === meal.idMeal)
        ? prev.filter(fav => fav.idMeal !== meal.idMeal)
        : [...prev, meal]
    );
  };

  const isFavorite = (idMeal: string) => favorites.some(f => f.idMeal === idMeal);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
};
