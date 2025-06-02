import React from 'react';
import { FlatList, View } from 'react-native';
import MealSearchCard from '../../components/MealSearchCard';
import { ThemedText } from '../../components/ThemedText';
import { useFavorites } from '../../contexts/FavoritesContext';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {favorites.length === 0 ? (
        <ThemedText>No tenés favoritos guardados.</ThemedText>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <MealSearchCard meal={item} />}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;
