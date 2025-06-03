import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Meal } from '../../types/recipes';
import { RecipeDetailScreen } from '../../components/RecipeDetailScreen';

export default function RecipeDetailPage() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipeDetail();
  }, [recipeId]);

  const fetchRecipeDetail = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      const data = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        setRecipe(data.meals[0]);
      } else {
        Alert.alert('Error', 'Receta no encontrada');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la receta');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!recipe) {
    return null;
  }

  return <RecipeDetailScreen recipe={recipe} onBack={handleBack} />;
}