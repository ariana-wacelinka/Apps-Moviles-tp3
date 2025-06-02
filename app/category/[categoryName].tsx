import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MealSearchCard from '../../components/MealSearchCard';
import { getAllCategories, getRecipesByCategory } from '../../services/theMealDbService';
import { Category } from '../../types/categories';
import { MealPreview } from '../../types/recipes';

export default function CategoryDetailsScreen() {
  const { categoryName } = useLocalSearchParams();
  const categoryNameStr = Array.isArray(categoryName) ? categoryName[0] : categoryName;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<MealPreview[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [errorRecipes, setErrorRecipes] = useState<string | null>(null);
  const fetchCategoryDetails = useCallback(async () => {
    if (!categoryNameStr) return;
    
    setIsLoadingCategory(true);
    setErrorCategory(null);
    
    try {
      const response = await getAllCategories();
      if (response.categories) {        const foundCategory = response.categories.find(
          cat => cat.strCategory === categoryNameStr
        );
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          setErrorCategory('Categoría no encontrada.');
        }
      } else {
        setErrorCategory('No se pudieron cargar los detalles de la categoría.');
      }
    } catch (err) {
      setErrorCategory('Error al cargar la categoría.');
      console.error(err);
    } finally {
      setIsLoadingCategory(false);
    }  }, [categoryNameStr]);

  const fetchRecipes = useCallback(async () => {
    if (!categoryNameStr) return;
    
    setIsLoadingRecipes(true);
    setErrorRecipes(null);
    setRecipes([]);
    
    try {
      const response = await getRecipesByCategory(categoryNameStr);
      if (response.meals) {
        setRecipes(response.meals);
      } else {
        setErrorRecipes('No se encontraron recetas para esta categoría.');
      }
    } catch (err) {
      setErrorRecipes('Error al cargar las recetas.');
      console.error(err);
    } finally {
      setIsLoadingRecipes(false);
    }
  }, [categoryNameStr]);

  useEffect(() => {
    fetchCategoryDetails();
    fetchRecipes();
  }, [fetchCategoryDetails, fetchRecipes]);

  const handleMealPress = (meal: MealPreview) => {
    console.log('Meal selected:', meal.strMeal);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoadingCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (errorCategory) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorCategory}</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Text style={styles.goBackText}>Volver</Text>
          </TouchableOpacity>
        </View>
    );
  }

  return (
    
      <><Stack.Screen options={{ headerShown: false }} /><SafeAreaView style={styles.container} edges={['top']}>
          {/* Header with back button */}
          <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                  <Text style={styles.backButtonText}>← Volver</Text>
              </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Category details section */}
              {category && (
                  <View style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                          <Image
                              source={{ uri: category.strCategoryThumb }}
                              style={styles.categoryImage} />
                          <View style={styles.categoryInfo}>
                              <Text style={styles.categoryName}>{category.strCategory}</Text>
                              <Text style={styles.categoryDescription} numberOfLines={0}>
                                  {category.strCategoryDescription}
                              </Text>
                          </View>
                      </View>
                  </View>
              )}

              {/* Recipes section */}
              <View style={styles.recipesSection}>
                  <Text style={styles.sectionTitle}>
                      Recetas de {categoryName} ({recipes.length})
                  </Text>

                  {isLoadingRecipes && (
                      <ActivityIndicator size="large" style={styles.loader} />
                  )}

                  {errorRecipes && (
                      <Text style={styles.errorText}>{errorRecipes}</Text>
                  )}

                  {!isLoadingRecipes && !errorRecipes && recipes.length === 0 && (
                      <Text style={styles.infoText}>
                          No se encontraron recetas para esta categoría.
                      </Text>
                  )}

                  {recipes.length > 0 && (
                      <FlatList
                          data={recipes}
                          keyExtractor={(item) => item.idMeal}
                          renderItem={({ item }) => (
                              <MealSearchCard
                                  meal={item}
                                  category={categoryNameStr}
                                  onPress={handleMealPress} />
                          )}
                          scrollEnabled={false}
                          contentContainerStyle={styles.recipesList} />
                  )}
              </View>
          </ScrollView>
      </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recipesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recipesList: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
    fontSize: 16,
  },
  goBackButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  goBackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
