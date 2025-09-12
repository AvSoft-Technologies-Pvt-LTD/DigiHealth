import { StatusBar } from 'react-native';

// Utility function to determine if a color is light or dark
export const isLightColor = (hexColor: string): boolean => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if light (luminance > 0.5)
  return luminance > 0.5;
};

// Set status bar style based on background color
export const setStatusBarStyle = (backgroundColor: string) => {
  const barStyle = isLightColor(backgroundColor) ? 'dark-content' : 'light-content';
  StatusBar.setBarStyle(barStyle, true);
  StatusBar.setBackgroundColor(backgroundColor, true);
};

// Get status bar style without setting it
export const getStatusBarStyle = (backgroundColor: string): 'light-content' | 'dark-content' => {
  return isLightColor(backgroundColor) ? 'dark-content' : 'light-content';
};
