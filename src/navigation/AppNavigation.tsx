// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import Home from '../screens/App/Home';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import PatientRegister from '../screens/Auth/PatientRegister';
import DoctorRegister from '../screens/Auth/DoctorRegister';
import HospitalRegister from '../screens/Auth/HospitalRegister';
import LabsScanRegister from '../screens/Auth/LabsScanRegister';
import { PAGES } from '../constants/pages';
import CustomDrawer from './CustomDrawer';

import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useDrawer } from './DrawerContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={PAGES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={PAGES.HOME} component={Home} />
      <Stack.Screen name={PAGES.LOGIN} component={Login} />
      <Stack.Screen name={PAGES.REGISTER} component={Register} />
      <Stack.Screen name={PAGES.PATIENT_REGISTER} component={PatientRegister} />
      <Stack.Screen name={PAGES.DOCTOR_REGISTER} component={DoctorRegister} />
      <Stack.Screen name={PAGES.HOSPITAL_REGISTER} component={HospitalRegister} />
      <Stack.Screen name={PAGES.LABS_SCAN_REGISTER} component={LabsScanRegister} />
    </Stack.Navigator>
    <CustomDrawer />
  </> //Drawer outside navigator but inside container
  );
};

export default AppNavigator;
