/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#86BAB4';

export const Colors = {
  light: {
    text: '#2C3E50',
    background: '#D0DBDB',
    tint: tintColorLight,
    icon: '#415A6B',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardBackground: '#E8F0F0',
    border: '#B8C8C8',
    searchBar: '#E8F0F0',
  },
  dark: {
    text: '#E8F0F0',
    background: '#2C3E50',
    tint: tintColorDark,
    icon: '#B8C8C8',
    tabIconDefault: '#95A5A6',
    tabIconSelected: tintColorDark,
    cardBackground: '#34495E',
    border: '#415A6B',
    searchBar: '#34495E',
  },
};
