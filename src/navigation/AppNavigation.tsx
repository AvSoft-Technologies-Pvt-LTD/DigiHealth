// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PAGES } from '../constants/pages';
import CustomDrawer from './CustomDrawer';

import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useDrawer } from './DrawerContext';
import { DoctorRegister, Home, Login, PatientDashboard, PatientRegister, Register, SplashScreen } from '../screens';
import PatientDashboardView from '../screens/AllDashboards/PtDashboard/Overview/PtDashboard';
import PatientSettingsView from '../screens/AllDashboards/PtDashboard/PtSetting';
import HealthCard from '../screens/AllDashboards/PtDashboard/HealthCard/HealthCard';
import Appointments from '../screens/AllDashboards/PtDashboard/Appointments';

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
      {/* <Stack.Screen name={PAGES.HOSPITAL_REGISTER} component={HospitalRegister} />
      <Stack.Screen name={PAGES.LABS_SCAN_REGISTER} component={LabsScanRegister} /> */}
      {/* app screens */}
      <Stack.Screen name={PAGES.PATIENT_DASHBOARD} component={PatientDashboardView} />
      <Stack.Screen name={PAGES.PATIENT_SETTINGS} component={PatientSettingsView} />
      <Stack.Screen name={PAGES.PATIENT_HEALTHCARD} component={HealthCard} />
       <Stack.Screen name={PAGES.PATIENT_APPOINTMENTS} component={Appointments} />
    </Stack.Navigator>
    <CustomDrawer />
  </> //Drawer outside navigator but inside container
  );
};

export default AppNavigator;
