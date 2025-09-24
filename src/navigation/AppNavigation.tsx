// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PAGES } from '../constants/pages';
import CustomDrawer from './CustomDrawer';

import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useDrawer } from './DrawerContext';
import { AmbulanceBookingView, BookAppointment, DoctorRegister, Home, Login, PatientDashboard, PatientRegister, PharmacyFinderView, Register, SplashScreen } from '../screens';
import PatientDashboardView from '../screens/AllDashboards/PtDashboard/Overview/PatientDashboardView';
import PatientSettingsView from '../screens/AllDashboards/PtDashboard/PtSetting';
import HealthCard from '../screens/AllDashboards/PtDashboard/HealthCard/HealthCard';
import Appointments from '../screens/AllDashboards/PtDashboard/Appointments';
import HospitalRegister from '../screens/Auth/HospitalRegister';
import LabsScanRegister from '../screens/Auth/LabsScanRegister';

import LabBookingView from '../screens/AllDashboards/PtDashboard/LabBooking/LabBookingView';
import PaymentGateway from '../elements/AvPayment';
import Billing from '../screens/AllDashboards/PtDashboard/Billing';
import NotificationsScreen from '../components/CommonComponents/Notification';
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
       <Stack.Screen name={PAGES.AMBULANCE_BOOKING_VIEW} component={AmbulanceBookingView} />
          <Stack.Screen name={PAGES.BILLING} component={Billing} />
           <Stack.Screen name={PAGES.BOOKING_APPOITMENT} component={BookAppointment} />
                <Stack.Screen name={PAGES.PHARMACY_FINDER_VIEW} component={PharmacyFinderView} />
                          <Stack.Screen name={PAGES.NOTIFICATION_SCREEN} component={NotificationsScreen} />
      
      {/* <Stack.Screen name={PAGES.HOSPITAL_REGISTER} component={HospitalRegister} />
      <Stack.Screen name={PAGES.LABS_SCAN_REGISTER} component={LabsScanRegister} /> */}
      {/* app screens */}
      <Stack.Screen name={PAGES.PATIENT_OVERVIEW} component={PatientDashboardView} />
      <Stack.Screen name={PAGES.PATIENT_SETTINGS} component={PatientSettingsView} />
      <Stack.Screen name={PAGES.PATIENT_HEALTHCARD} component={HealthCard} />
       <Stack.Screen name={PAGES.PATIENT_APPOINTMENTS} component={Appointments} />
       <Stack.Screen name={PAGES.LAB_BOOKING} component={LabBookingView} />
       <Stack.Screen name={PAGES.PAYMENT_GATEWAY_PAGE} component={PaymentGateway} /> 
    </Stack.Navigator>
    <CustomDrawer />
  </> //Drawer outside navigator but inside container
  );
};

export default AppNavigator;
