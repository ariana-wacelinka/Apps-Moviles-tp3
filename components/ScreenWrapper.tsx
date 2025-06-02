import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const { effectiveTheme } = useTheme();
  const themeColors = effectiveTheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
