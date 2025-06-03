import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealSearchCard from '../../components/MealSearchCard';
import { ThemedText } from '../../components/ThemedText';
import { useFavorites } from '../../contexts/FavoritesContext';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.inner}>
        <ThemedText style={styles.title}>Mis favoritos</ThemedText>
        {favorites.length === 0 ? (
          <ThemedText style={styles.emptyText}>No tenés favoritos guardados.</ThemedText>
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
    paddingTop: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 32,
  },
});

export default FavoritesScreen;
