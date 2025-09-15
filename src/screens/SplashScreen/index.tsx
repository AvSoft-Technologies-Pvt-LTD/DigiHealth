import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ViewStyle, ImageStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMAGES } from '../../assets';
import { PAGES } from '../../constants/pages';
import { COLORS } from '../../constants/colors';

// Define the type for the navigation stack parameters
type RootStackParamList = {
  [PAGES.SPLASH]: undefined;
  [PAGES.LOGIN]: undefined;
};

// Define the type for the navigation prop
type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

// Define the props for the SplashScreen component
interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

// Define the SplashScreen component
const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(PAGES.LOGIN); // Navigate to the Home screen after 3 seconds
    }, 0); //Later Increase the timeout

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