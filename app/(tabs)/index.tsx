import { useFocusEffect, useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryCard from '../../components/CategoryCard';
import MealSearchCard from '../../components/MealSearchCard';
import SearchBar from '../../components/SearchBar';
import { ThemeToggleButton } from '../../components/ThemeToggleButton';
import { getAllCategories, searchRecipesByName } from '../../services/theMealDbService';
import { Category } from '../../types/categories';
import { Meal } from '../../types/recipes';

export default function SearchScreen() {
  const theme = useTheme();
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
      if (errorSearch) return <Text style={[styles.errorText, { color: theme.colors.notification }]}>{errorSearch}</Text>;
      if (searchResults.length === 0 && searchQuery.trim().length > 2 && !isLoadingSearch) {
        return <Text style={[styles.infoText, { color: theme.colors.text }]}>No se encontraron recetas para "{searchQuery}"</Text>;
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
      if (errorCategories) return <Text style={[styles.errorText, { color: theme.colors.notification }]}>{errorCategories}</Text>;
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
          ListHeaderComponent={
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Explora nuestras categorías</Text>
            </View>
          }
        />
        
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerRight}>
          <ThemeToggleButton />
        </View>
      </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
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
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 5,
  }
});