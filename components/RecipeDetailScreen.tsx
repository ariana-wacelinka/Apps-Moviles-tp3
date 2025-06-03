import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{recipe.strMeal}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons 
              name="tag" 
              size={20} 
              color={theme.colors.text} 
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {recipe.strCategory}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons 
              name="place" 
              size={20} 
              color={theme.colors.text} 
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {recipe.strArea}
            </Text>
          </View>
        </View>

        {recipe.strTags && (
          <View style={styles.tagsContainer}>
            <MaterialCommunityIcons 
              name="tag-multiple" 
              size={18} 
              color={theme.colors.text} 
              style={styles.infoIcon}
            />
            <Text style={[styles.tags, { color: theme.colors.text }]}>
              {recipe.strTags}
            </Text>
          </View>
        )}

        {/* Ingredientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons 
              name="food-variant" 
              size={24} 
              color={theme.colors.text}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { 
              color: theme.colors.text,
              borderBottomColor: theme.colors.border 
            }]}>
              Ingredientes
            </Text>
          </View>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <MaterialIcons 
                name="fiber-manual-record" 
                size={8} 
                color={theme.colors.text} 
                style={styles.bulletIcon}
              />
              <Text style={[styles.ingredientText, { color: theme.colors.text }]}>
                {item.measure} {item.ingredient}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons 
              name="format-list-numbered" 
              size={24} 
              color={theme.colors.text}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { 
              color: theme.colors.text,
              borderBottomColor: theme.colors.border 
            }]}>
              Instrucciones
            </Text>
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tags: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4,
  },
  bulletIcon: {
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'justify',
  },
});