/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#23344A',
    background: '#E6E8E6',
    tint: '#23344A',
    icon: '#23344A',
    tabIconDefault: '#8A9BB0',
    tabIconSelected: '#23344A',
    // Additional colors for comprehensive theming
    primary: '#BF1A2F',
    secondary: '#36749E',
    muted: '#5A8CA8',
    surface: '#FFFFFF',
    border: '#D4D6D4',
    error: '#BF1A2F',
    success: '#36749E',
    disabled: '#C8CACC',
    inputBackground: '#FFFFFF',
    placeholder: '#8A9BB0',
    shadow: '#23344A',
    overlay: 'rgba(35, 52, 74, 0.08)',
    progressTrack: '#D4D6D4',
    addButtonBg: '#23344A',
    rewardColor: '#C47A1E',
  },
  dark: {
    text: '#E6E8E6',
    background: '#111820',
    tint: '#36749E',
    icon: '#9BAFC5',
    tabIconDefault: '#5A7A9A',
    tabIconSelected: '#36749E',
    // Additional colors for comprehensive theming
    primary: '#BF1A2F',
    secondary: '#4A8BB8',
    muted: '#9BAFC5',
    surface: '#23344A',
    border: '#2E4560',
    error: '#BF1A2F',
    success: '#4A8BB8',
    disabled: '#2E4560',
    inputBackground: '#1C2B3A',
    placeholder: '#5A7A9A',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.3)',
    progressTrack: '#2E4560',
    addButtonBg: '#36749E',
    rewardColor: '#E8A030',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
