import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ViewStyle, ImageStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { IMAGES } from '../../assets';
// constants
import { PAGES } from '../../constants/pages';
import { COLORS } from '../../constants/colors';
import { normalize } from '../../constants/platform';
import { benefits, features, ROLES, stats } from '../../constants/data';

import StorageService from '../../services/storageService';
import { RootStackParamList } from '../../types/navigation';
import { setAuthenticated, setUserProfile } from '../../store/slices/userSlice';

import { setHomeData } from '../../store/slices/homeSlice';
import AvImage from '../../elements/AvImage';
// Define the type for the navigation stack parameters

// Define the type for the navigation prop
type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, typeof PAGES.SPLASH>;

// Define the props for the SplashScreen component
interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();


  useEffect(() => {
    homeData();
    dispatch(setHomeData(homeData()));
  }, [dispatch]);
  const homeData = () => ({
    stats: stats,
    features: features,
    benefits: benefits,
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const [token, userRole, userId, userEmail, doctorId, patientId] = await Promise.all([
          StorageService.get<string>("userToken"),
          StorageService.get<string>("userRole"),
          StorageService.get<string>("userId"),
          StorageService.get<string>("userEmail"),
          StorageService.get<string>("doctorId"),
          StorageService.get<string>("patientId"),
        ]);


        if (token) {
          // Update Redux store with authentication state
          dispatch(setAuthenticated(true));


          if (userRole) {
            dispatch(setUserProfile({ role: userRole as any }));
          }
          if (userId) {
            dispatch(setUserProfile({ userId: userId as any }));
          }
          if (userEmail) {
            dispatch(setUserProfile({ email: userEmail as any }));
          }
          if(userRole === ROLES.PATIENT){
            dispatch(setUserProfile({ patientId: patientId as any }));
          } else if(userRole === ROLES.DOCTOR){
            console.log("DISPATCHING DOCTOR ID",doctorId)
            dispatch(setUserProfile({ doctorId: doctorId as any }));
          } else {
            dispatch(setUserProfile({ userId: userId as any }));
          }
          console.log("USER ROLE",userRole)
          // Navigate based on user role
          if(userRole == ROLES.DOCTOR){
            navigation.replace(PAGES.DOCTOR_DASHBOARD);
          } else if(userRole == ROLES.PATIENT){
            navigation.replace(PAGES.PATIENT_OVERVIEW);
          } else {
            navigation.replace(PAGES.HOME);
          }
        } else {
          // If no token, ensure Redux state is cleared
          dispatch(setAuthenticated(false));
          navigation.replace(PAGES.HOME);
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        // Ensure Redux state is cleared on error
        dispatch(setAuthenticated(false));
        navigation.replace(PAGES.HOME);
      }
    };

    const timer = setTimeout(() => {
      checkToken();
    }, 2000); // Delay for 2 seconds before checking

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AvImage source={IMAGES.LOGO} style={styles.logo} />
    </View>
  );
};

// Define the styles for the SplashScreen component
interface Styles {
  container: ViewStyle;
  logo: ImageStyle;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: COLORS.WHITE,
  },
  logo: {
    width: '50%',
    height: '60%',
    aspectRatio: 1,
  },
});

export default SplashScreen;