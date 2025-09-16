import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ViewStyle, ImageStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMAGES } from '../../assets';
import { PAGES } from '../../constants/pages';
import { COLORS } from '../../constants/colors';
import StorageService from '../../services/storageService';

// Define the type for the navigation stack parameters
type RootStackParamList = {
  [PAGES.SPLASH]: undefined;
  [PAGES.LOGIN]: undefined;
  [PAGES.HOME]: undefined;
};

// Define the type for the navigation prop
type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

// Define the props for the SplashScreen component
interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await StorageService.get("userToken");
        console.log("Token here",token)
        if (token) {
          // If token exists, navigate to Home
          navigation.replace(PAGES.HOME);
        } else {
          // If no token, navigate to Login
          navigation.replace(PAGES.LOGIN);
        }
      } catch (error) {
        console.error('Error reading token from storage', error);
        navigation.replace(PAGES.LOGIN); // fallback in case of error
      }
    };

    const timer = setTimeout(() => {
      checkToken();
    }, 2000); // Delay for 2 seconds before checking

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={IMAGES.SPLASH} style={styles.logo} />
    </View>
  );
};

// Define the styles for the SplashScreen component
interface Styles {
  container: ViewStyle;
  logo: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE, // Optional: Add a background color
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
