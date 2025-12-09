/**
 * RecipAId Theme Configuration
 * Colors and fonts for the app
 */

import { Platform } from 'react-native';

// Brand Colors
export const primary = {
  50: '#fef7ee',
  100: '#fdedd3',
  200: '#fad7a5',
  300: '#f6ba6d',
  400: '#f19432',
  500: '#ee7711', // Main brand color
  600: '#df5d07',
  700: '#b94409',
  800: '#93360f',
  900: '#772e10',
  950: '#401506',
};

export const secondary = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e', // Success/secondary
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

const tintColorLight = primary[500];
const tintColorDark = primary[400];

export const Colors = {
  light: {
    text: '#1c1917',
    background: '#fafaf9',
    tint: tintColorLight,
    icon: '#78716c',
    tabIconDefault: '#a8a29e',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e7e5e4',
  },
  dark: {
    text: '#fafaf9',
    background: '#1c1917',
    tint: tintColorDark,
    icon: '#a8a29e',
    tabIconDefault: '#78716c',
    tabIconSelected: tintColorDark,
    card: '#292524',
    border: '#44403c',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
