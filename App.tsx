import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigation';
import { COLORS } from './src/constants/colors';
import { getStatusBarStyle } from './src/utils/statusBar';

// // This is needed for react-native-gesture-handler to work in the whole app
// const GestureHandlerWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
//   <GestureHandlerRootView style={{ flex: 1 }}>
//     {children}
//   </GestureHandlerRootView>
// );

const App: React.FC = () => {
  // Set global status bar configuration
  const defaultBackgroundColor = COLORS.WHITE; // Change this to your app's primary background
  const statusBarStyle = getStatusBarStyle(defaultBackgroundColor);

  // Custom theme for React Native Paper
  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: COLORS.SECONDARY,
      secondary: COLORS.PRIMARY,
      surface: COLORS.WHITE,
      background: COLORS.BG_OFF_WHITE,
    },
  };

  useEffect(() => {
    // Set initial status bar configuration
    StatusBar.setBarStyle(statusBarStyle, true);
    StatusBar.setBackgroundColor(defaultBackgroundColor, true);
  }, []);

  return (
    // <GestureHandlerWrapper>
      <Provider store={store}>
        <PaperProvider 
          theme={theme}
        >
          <NavigationContainer>
            <StatusBar 
              barStyle={statusBarStyle}
              backgroundColor={defaultBackgroundColor}
            translucent={false}
            />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    // </GestureHandlerWrapper>
  );
};

export default App;
