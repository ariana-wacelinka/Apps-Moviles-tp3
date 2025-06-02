// app/(tabs)/search.tsx
import { useFocusEffect } from '@react-navigation/native'; // Para recargar categorías al enfocar la pestaña
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryCard from '../../components/CategoryCard'; // Importa tu componente CategoryCard
import MealSearchCard from '../../components/MealSearchCard';
import SearchBar from '../../components/SearchBar'; // Importa tu componente SearchBar
import { getAllCategories, searchRecipesByName } from '../../services/theMealDbService';
import { Category } from '../../types/categories'; // Asegúrate de que la ruta sea correcta
import { Meal } from '../../types/recipes';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await getAllCategories();
      if (response.categories) {
        setCategories(response.categories);
      } else {
        setErrorCategories('No se pudieron cargar las categorías.');
      }
    } catch (err) {
      setErrorCategories('Error al cargar categorías.');
      console.error(err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
      setIsSearchFocused(false); 
      setSearchQuery('');
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim().length > 2 && isSearchFocused) {
      const handler = setTimeout(async () => {
        setIsLoadingSearch(true);
        setErrorSearch(null);
        setSearchResults([]);
        try {
          const response = await searchRecipesByName(searchQuery.trim());
          if (response.meals) {
            setSearchResults(response.meals);
          } else {
            setErrorSearch('No se encontraron recetas para esta búsqueda.');
          }
        } catch (err) {
          setErrorSearch('Error al buscar recetas.');
          console.error(err);
        } finally {
          setIsLoadingSearch(false);
        }
      }, 500);

      return () => clearTimeout(handler);
    } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
    }
  }, [searchQuery, isSearchFocused]);

  const renderContent = () => {
    if (isSearchFocused && searchQuery.trim().length > 0) {
      if (isLoadingSearch) return <ActivityIndicator size="large" style={styles.loader} />;
      if (errorSearch) return <Text style={styles.errorText}>{errorSearch}</Text>;
      if (searchResults.length === 0 && searchQuery.trim().length > 2 && !isLoadingSearch) {
        return <Text style={styles.infoText}>No se encontraron recetas para "{searchQuery}"</Text>;
      }
      return (
        <FlatList
          key="search-results"
          style={styles.list}
          data={searchResults}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <MealSearchCard meal={item} />}
          contentContainerStyle={styles.listContainer}
        />
      );
    } else {
      if (isLoadingCategories) return <ActivityIndicator size="large" style={styles.loader} />;
      if (errorCategories) return <Text style={styles.errorText}>{errorCategories}</Text>;
      return (
        <FlatList
          key="categories-grid"
          style={styles.list}
          data={categories}
          keyExtractor={(item) => item.idCategory}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.columnItem}>
              <CategoryCard category={item} />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<Text style={styles.headerTitle}>Explorar Categorías</Text>}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchBar
        placeholder="Busca recetas o ingredientes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsSearchFocused(true)}
      />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    marginHorizontal: 10,
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  columnItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 5,
  }
});