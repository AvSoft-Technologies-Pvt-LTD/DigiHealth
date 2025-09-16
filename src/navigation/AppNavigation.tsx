import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Login, Register, SplashScreen, PatientRegister, DoctorRegister, Home } from '../screens';
import { PAGES } from '../constants/pages';
// import DrawerNavigator from './DrawerNavigator';

export type RootStackParamList = {
  [PAGES.SPLASH]: undefined;
  [PAGES.LOGIN]: undefined; 
  [PAGES.HOME]: undefined;  
  [PAGES.REGISTER]: undefined;  
  [PAGES.PATIENT_REGISTER]: undefined;  
  [PAGES.HOSPITAL_REGISTER]: undefined;  
  [PAGES.DOCTOR_REGISTER]: undefined;  
  [PAGES.LABS_SCAN_REGISTER]: undefined;  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PAGES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={PAGES.LOGIN} component={Login} />
      <Stack.Screen name={PAGES.HOME} component={Home} />
      {/* <Stack.Screen name={PAGES.HOME} component={DrawerNavigator} options={{ headerShown: false }} /> */}
      <Stack.Screen name={PAGES.REGISTER} component={Register} />
      <Stack.Screen name={PAGES.PATIENT_REGISTER} component={PatientRegister} />
      <Stack.Screen name={PAGES.DOCTOR_REGISTER} component={DoctorRegister} />
      {/* <Stack.Screen name={PAGES.HOSPITAL_REGISTER} component={HospitalRegister} />
      <Stack.Screen name={PAGES.LABS_SCAN_REGISTER} component={LabsScanRegister} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;

export type AppNavigationProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;