import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Meal } from '../types/recipes';

interface RecipeDetailScreenProps {
  recipe: Meal;
  onBack: () => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  onBack,
}) => {
  const theme = useTheme();

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Meal] as string;
      const measure = recipe[`strMeasure${i}` as keyof Meal] as string;
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return ingredients;
  };

  const ingredients = getIngredients();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{recipe.strMeal}</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.category, { color: theme.colors.text }]}>
            Categoría: {recipe.strCategory}
          </Text>
          <Text style={[styles.area, { color: theme.colors.text }]}>
            Origen: {recipe.strArea}
          </Text>
        </View>

        {recipe.strTags && (
          <Text style={[styles.tags, { color: theme.colors.text }]}>
            Tags: {recipe.strTags}
          </Text>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: theme.colors.text,
            borderBottomColor: theme.colors.border 
          }]}>
            Ingredientes
          </Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={[styles.ingredientText, { color: theme.colors.text }]}>
                • {item.measure} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: theme.colors.text,
            borderBottomColor: theme.colors.border 
          }]}>
            Instrucciones
          </Text>
          <Text style={[styles.instructions, { color: theme.colors.text }]}>
            {recipe.strInstructions}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  area: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  tags: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
    opacity: 0.7,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  ingredientRow: {
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 22,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});