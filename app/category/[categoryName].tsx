import { MaterialIcons } from '@expo/vector-icons';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MealSearchCard from '../../components/MealSearchCard';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getAllCategories, getRecipesByCategory } from '../../services/theMealDbService';
import { Category } from '../../types/categories';
import { MealPreview } from '../../types/recipes';

export default function CategoryDetailsScreen() {
  const { effectiveTheme } = useTheme();
  
  const themeColors = effectiveTheme === 'dark' ? Colors.dark : Colors.light;
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
      if (response.categories) {
        const foundCategory = response.categories.find(
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
    }
  }, [categoryNameStr]);

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
  
  const handleGoBack = () => {
    router.back();
  };
  
  if (isLoadingCategory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (errorCategory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>{errorCategory}</Text>
          <TouchableOpacity 
            style={[styles.goBackButton, { backgroundColor: themeColors.primary }]} 
            onPress={handleGoBack}
          >
            <MaterialIcons name="arrow-back" size={18} color="white" />
            <Text style={styles.goBackText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView 
        style={[styles.container, { backgroundColor: themeColors.background }]} 
        edges={['top','bottom']}
      >
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={themeColors.text} 
            />
          </TouchableOpacity>
          {category && (
            <Text style={[styles.categoryName, { color: themeColors.text }]}>{category.strCategory}</Text>
          )}
        </View>
        <ScrollView 
          style={[styles.scrollView, { backgroundColor: themeColors.background }]} 
          showsVerticalScrollIndicator={false}
        >
          {category && (
            <View style={[styles.categorySection, { borderBottomColor: themeColors.border }]}>
              <View style={styles.categoryHeader}>
                <Image source={{ uri: category.strCategoryThumb }} style={styles.categoryImage} />
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryDescription, { color: themeColors.text }]} >
                    {category.strCategoryDescription}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.recipesSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recetas de {categoryNameStr} ({recipes.length})</Text>

            {isLoadingRecipes && (
              <ActivityIndicator size="large" style={styles.loader} />
            )}

            {errorRecipes && (
              <Text style={[styles.errorText, {color: themeColors.text}]}>{errorRecipes}</Text>
            )}

            {!isLoadingRecipes && !errorRecipes && recipes.length === 0 && (
              <Text style={[styles.infoText, { color: themeColors.text }]}>No se encontraron recetas para esta categoría.</Text>
            )}

            {recipes.length > 0 && (
              <FlatList
                data={recipes}
                keyExtractor={(item) => item.idMeal}
                renderItem={({ item }) => (
                  <MealSearchCard meal={item}/>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.recipesList}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    padding: 15,
    borderBottomWidth: 1,
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
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  recipesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 16,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  goBackButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goBackText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
