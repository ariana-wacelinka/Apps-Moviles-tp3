import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types/categories';

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(category);
    } else {
      // Navigate to category details page
      router.push({
        pathname: '/category/[categoryName]',
        params: { categoryName: category.strCategory }
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>{category.strCategory}</Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: category.strCategoryThumb }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(240,240,240,0)', 'rgba(240,240,240,0.3)', '#f0f0f0']}
          locations={[0, 0.3, 0.6, 0.8, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.fadeGradient}
          pointerEvents="none"
        />
        {/* <LinearGradient
          colors={['transparent', 'transparent', 'rgba(240,240,240,0)', 'rgba(240,240,240,0.5)', '#f0f0f0']}
          locations={[0, 0.3, 0.6, 0.8, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.fadeGradient}
          pointerEvents="none"
        /> */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(240,240,240,0)', 'rgba(240,240,240,0.3)', '#f0f0f0']}
          locations={[0, 0.3, 0.6, 0.8, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.fadeGradientrotated}
          pointerEvents="none"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 5,
    paddingLeft: 10,
    //paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  imageWrapper: {
    width: 80,
    height: 100,
    overflow: 'hidden',
    marginRight: 0,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.2}, { translateX: 5 }],
  },
  fadeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fadeGradientrotated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ rotate: '20deg' }, { scale: 1.2}],
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CategoryCard;