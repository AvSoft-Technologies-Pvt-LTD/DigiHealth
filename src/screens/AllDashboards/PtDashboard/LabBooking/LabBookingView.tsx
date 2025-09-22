// src/screens/AllDashboards/Ptdashboard/LabBookingView.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LabHome from './LabHome';
import DetailsPage from './DetailsPage';
import AvailableLabs from './AvailableLabs';
import BookAppointment from './BookAppointment';
import LabPayment from './LabPayment';
import PaymentSuccess from './PaymentSucess';
import TrackAppointment from './TrackAppointment';
import { PAGES } from '../../../../constants/pages';
import LabCart from './LabCart';
import LabBook from './LabBook';

const Stack = createNativeStackNavigator();

const LabBookingView = () => {
  return (
    <Stack.Navigator
      initialRouteName="LabHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name={PAGES.LAB_HOME} component={LabHome} />
      <Stack.Screen name={PAGES.LAB_CART} component={LabCart} />
      <Stack.Screen name="DetailsPage" component={DetailsPage} />
      <Stack.Screen name="AvailableLabs" component={AvailableLabs} />
      <Stack.Screen name={PAGES.LAB_BOOK} component={LabBook} />
      <Stack.Screen name="BookAppointment" component={BookAppointment} />
      <Stack.Screen name="LabPayment" component={LabPayment} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="TrackAppointment" component={TrackAppointment} />
    </Stack.Navigator>
  );
};

export default LabBookingView;
