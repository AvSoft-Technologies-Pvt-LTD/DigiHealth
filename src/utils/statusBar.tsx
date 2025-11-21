import { StatusBar, StatusBarStyle, Platform } from 'react-native';

// Try to parse a color string (hex #RGB, #RRGGBB, #RRGGBBAA, rgb(...))
const parseColorToRgb = (color: string): { r: number; g: number; b: number } | null => {
  if (!color) return null;
  const c = color.trim().toLowerCase();

  // Hex formats
  const hexMatch = c.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map((ch) => ch + ch).join('');
    }
    if (hex.length === 4) {
      // rgba short form #RGBA -> drop alpha
      hex = hex.slice(0, 3).split('').map((ch) => ch + ch).join('');
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return { r, g, b };
    }
    return null;
  }

  // rgb(...) or rgba(...)
  const rgbMatch = c.match(/rgba?\s*\(([^)]+)\)/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((p) => p.trim());
    const r = parseInt(parts[0], 10);
    const g = parseInt(parts[1], 10);
    const b = parseInt(parts[2], 10);
    if ([r, g, b].every((v) => !Number.isNaN(v))) return { r, g, b };
  }

  return null;
};

// Utility function to determine if a color is light or dark
export const isLightColor = (color: string): boolean => {
  const rgb = parseColorToRgb(color);
  if (!rgb) {
    // Fallback: assume light so text becomes dark (safer for visibility)
    return true;
  }

  const { r, g, b } = rgb;
  // Calculate relative luminance (ITU-R BT.709)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

// Get status bar style without setting it
export const getStatusBarStyle = (backgroundColor: string): StatusBarStyle => {
  return isLightColor(backgroundColor) ? 'dark-content' : 'light-content';
};

// Apply status bar style and background color appropriately for platform
export const applyStatusBarForBackground = (backgroundColor: string) => {
  const barStyle = getStatusBarStyle(backgroundColor);
  // On iOS, StatusBar.setBackgroundColor is ignored; on Android it's used
  StatusBar.setBarStyle(barStyle, true);
  if (Platform.OS === 'android') {
    try {
      StatusBar.setBackgroundColor(backgroundColor, true);
    } catch (e) {
      // ignore if color invalid for native call
    }
  }
};
