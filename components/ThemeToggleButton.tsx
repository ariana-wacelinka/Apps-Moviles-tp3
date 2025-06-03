import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme as useNavigationTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const navigationTheme = useNavigationTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'light-mode';
      case 'dark':
        return 'dark-mode';
      case 'auto':
        return 'brightness-auto';
      default:
        return 'brightness-auto';
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      case 'auto':
        return 'Auto';
      default:
        return 'Auto';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: navigationTheme.colors.card,
          borderColor: navigationTheme.colors.border,
        }
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <MaterialIcons 
        name={getThemeIcon()} 
        size={18} 
        color={navigationTheme.colors.text}
        style={styles.icon}
      />
      <Text 
        style={[
          styles.text,
          { color: navigationTheme.colors.text }
        ]}
      >
        {getThemeText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
