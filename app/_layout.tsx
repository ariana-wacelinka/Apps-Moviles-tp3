import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    text: Colors.light.text,
    tabIconDefault: Colors.light.tabIconDefault,
    card: Colors.light.cardBackground,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    text: Colors.dark.text,
    card: Colors.dark.cardBackground,
    tabIconDefault: Colors.dark.tabIconDefault,
    border: Colors.dark.border,
  },
};

function RootLayoutContent() {
  const { effectiveTheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const navigationTheme = effectiveTheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: navigationTheme.colors.background }}>
        <Stack 
          screenOptions={{
            contentStyle: { backgroundColor: navigationTheme.colors.background },
            headerStyle: { backgroundColor: navigationTheme.colors.card },
            headerTintColor: navigationTheme.colors.text,
            animation: 'slide_from_right',
            animationDuration: 200,
            animationTypeForReplace: 'push',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            statusBarStyle: effectiveTheme === 'dark' ? 'light' : 'dark',
          }}
        >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: navigationTheme.colors.background },
            animation: 'none',
          }} 
        />
        <Stack.Screen 
          name="category/[categoryName]"
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: navigationTheme.colors.background },
            animation: 'slide_from_right',
            animationDuration: 200,
            gestureEnabled: true,
            presentation: 'card',
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen 
          name="+not-found"
          options={{
            contentStyle: { backgroundColor: navigationTheme.colors.background }
          }}
        />
      </Stack>
      <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
