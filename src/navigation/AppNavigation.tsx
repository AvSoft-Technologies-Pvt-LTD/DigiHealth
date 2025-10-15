// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PAGES } from '../constants/pages';
import CustomDrawer from './CustomDrawer';

import { RootStackParamList } from '../types/navigation';
import { useDrawer } from './DrawerContext';
import {
  AmbulanceBookingView,

  DrBookAppointmentComponent, PasswordResetPage, ForgotPassword, VerifyOTP, ResetPassword, ViewAllDoctor, SearchAmbulanceView, PaymentPage, PaymentScreen, InvoiceDetails, InvoicePrintPreview, DoctorRegister, Home, Login, PatientDashboard, PatientRegister, PharmacyFinderView, Register, SplashScreen,MedicalRecordScreen,
  
  MedicalRecordsPreview,
  MedicalRecordDetails,
} from '../screens';
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

import { useAppSelector } from '../store/hooks';
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const userRole = useAppSelector((state) => state?.user?.userProfile?.role);
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={PAGES.SPLASH}
      >
        <Stack.Screen name={PAGES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={PAGES.HOME} component={Home} />
        <Stack.Screen name={PAGES.LOGIN} component={Login} />
        <Stack.Screen name={PAGES.REGISTER} component={Register} />
        <Stack.Screen name={PAGES.FORGOT_PASSWORD} component={ForgotPassword} />
        <Stack.Screen name={PAGES.VERIFY_OTP} component={VerifyOTP} />
        <Stack.Screen name={PAGES.RESET_PASSWORD} component={ResetPassword} />
        <Stack.Screen name={PAGES.PASSWORD_RESET_PAGE} component={PasswordResetPage} />
        <Stack.Screen name={PAGES.PATIENT_REGISTER} component={PatientRegister} />
        <Stack.Screen name={PAGES.DOCTOR_REGISTER} component={DoctorRegister} />
        <Stack.Screen name={PAGES.HOSPITAL_REGISTER} component={HospitalRegister} />
        <Stack.Screen name={PAGES.LABS_SCAN_REGISTER} component={LabsScanRegister} />
        <Stack.Screen name={PAGES.AMBULANCE_BOOKING_VIEW} component={AmbulanceBookingView} />
        <Stack.Screen name={PAGES.BILLING} component={Billing} />
        <Stack.Screen name={PAGES.PHARMACY_FINDER_VIEW} component={PharmacyFinderView} />
        <Stack.Screen name={PAGES.NOTIFICATION_SCREEN} component={NotificationsScreen} />

        <Stack.Screen name={PAGES.PATIENT_OVERVIEW} component={PatientDashboardView} />
        <Stack.Screen name={PAGES.PATIENT_SETTINGS} component={PatientSettingsView} />
        <Stack.Screen name={PAGES.PATIENT_HEALTHCARD} component={HealthCard} />
        <Stack.Screen name={PAGES.PATIENT_APPOINTMENTS} component={Appointments} />
        <Stack.Screen name={PAGES.LAB_BOOKING} component={LabBookingView} />
        <Stack.Screen name={PAGES.PAYMENT_GATEWAY_PAGE} component={PaymentGateway} />

        <Stack.Screen name={PAGES.VIEW_ALL_DOCTOR} component={ViewAllDoctor} />
        <Stack.Screen name={PAGES.PAYMENT_PAGE} component={PaymentPage} />
        <Stack.Screen name={PAGES.PAYMENT_SCREEN} component={PaymentScreen} />
        <Stack.Screen name={PAGES.INVOICEPRINTPREVIEW} component={InvoicePrintPreview} />
        <Stack.Screen name={PAGES.INVOICE_DETAILS} component={InvoiceDetails} />
        <Stack.Screen name={PAGES.SEARCH_AMBULANCE_VIEW} component={SearchAmbulanceView} />
        <Stack.Screen name={PAGES.DR_BOOKAPPOITMENT_COMPONENT} component={DrBookAppointmentComponent} />
        <Stack.Screen name={PAGES.PATIENT_MEDICAL_RECORD} component={MedicalRecordScreen} />
        <Stack.Screen name={PAGES.PATIENT_MEDICAL_DETAILS} component={MedicalRecordDetails} />
        <Stack.Screen name={PAGES.PATIENT_SECOND_OPINION} component={MedicalRecordsPreview} />
      </Stack.Navigator>
      <CustomDrawer userRole={userRole ?? ''} />

    </> //Drawer outside navigator but inside container
  );
};

export default AppNavigator;
