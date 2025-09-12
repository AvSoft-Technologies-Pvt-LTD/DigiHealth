import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMAGES } from '../../assets';
import { PAGES } from '../../constants/pages';

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
};

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(PAGES.HOME);
    }, 3000); // navigate after 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={IMAGES.SPLASH} style={styles.logo} />
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  logo: ImageStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
