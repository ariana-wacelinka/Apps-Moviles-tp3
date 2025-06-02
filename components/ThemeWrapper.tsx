import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, style }) => {
  const { effectiveTheme } = useTheme();
  const themeColors = effectiveTheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[
      { 
        flex: 1, 
        backgroundColor: themeColors.background 
      }, 
      style
    ]}>
      {children}
    </View>
  );
};
