// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from "./src/store/index"
import AppNavigator from './src/navigation/AppNavigation';
import { COLORS } from './src/constants/colors';
import { getStatusBarStyle, applyStatusBarForBackground } from './src/utils/statusBar';
import { DrawerProvider } from './src/navigation/DrawerContext';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorBoundary from './src/components/ErrorBoundary';
import { setNavigationReference } from './src/services/apiServices';
import ApiCallTrackerComponent from './src/components/ApiCallTracker/ApiCallTrackerComponent';

// This is needed for react-native-gesture-handler to work in the whole app
const GestureHandlerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

const App: React.FC = () => {
  // Set global status bar configuration
  const defaultBackgroundColor = COLORS.BLACK;
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
    Icon.loadFont();
  }, []);

  useEffect(() => {
    // Set initial status bar configuration
    applyStatusBarForBackground(defaultBackgroundColor);
  }, []);

  return (
      <ErrorBoundary>
        <GestureHandlerWrapper>
          <Provider store={store}>
            {/* <SafeAreaProvider> */}
              <PaperProvider theme={theme}>
                <NavigationContainer
                  ref={(ref) => {
                    if (ref) {
                      setNavigationReference(ref);
                    }
                  }}
                >
                  {/* <SafeAreaView style={{ flex: 1, backgroundColor: defaultBackgroundColor }}> */}
                    <StatusBar
                      barStyle={statusBarStyle}
                      backgroundColor={defaultBackgroundColor}
                      translucent={false}
                    />
                    <DrawerProvider>
                      <AppNavigator />
                    </DrawerProvider>
                    {/* <ApiCallTrackerComponent /> */}
                  {/* </SafeAreaView> */}
                </NavigationContainer>
              </PaperProvider>
            {/* </SafeAreaProvider> */}
          </Provider>
        </GestureHandlerWrapper>
      </ErrorBoundary>
  );
};

export default React.memo(App);