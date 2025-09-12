import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigation';
import { COLORS } from './src/constants/colors';
import { getStatusBarStyle } from './src/utils/statusBar';

const App: React.FC = () => {
  // Set global status bar configuration
  const defaultBackgroundColor = COLORS.WHITE; // Change this to your app's primary background
  const statusBarStyle = getStatusBarStyle(defaultBackgroundColor);

  useEffect(() => {
    // Set initial status bar configuration
    StatusBar.setBarStyle(statusBarStyle, true);
    StatusBar.setBackgroundColor(defaultBackgroundColor, true);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={statusBarStyle}
        backgroundColor={defaultBackgroundColor}
        translucent={false}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
