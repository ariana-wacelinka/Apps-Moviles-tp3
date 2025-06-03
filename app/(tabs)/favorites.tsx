import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import MealSearchCard from '../../components/MealSearchCard';
import { ThemedText } from '../../components/ThemedText';
import { useFavorites } from '../../contexts/FavoritesContext';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.inner}>
        {favorites.length === 0 ? (
          <ThemedText>No tenés favoritos guardados.</ThemedText>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.idMeal}
            renderItem={({ item }) => <MealSearchCard meal={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 0,
  },
  listContent: {
    paddingBottom: 32,
  },
});

export default FavoritesScreen;
