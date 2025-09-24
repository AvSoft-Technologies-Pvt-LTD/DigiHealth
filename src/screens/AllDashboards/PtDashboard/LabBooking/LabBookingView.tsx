// src/screens/AllDashboards/Ptdashboard/LabBookingView.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LabHome from './LabHome';
import LabCart from './LabCart';
import DetailsPage from './DetailsPage';
import AvailableLabs from './AvailableLabs';
import LabBook from './LabBook';
import BookAppointment from './BookAppointment';
import LabPayment from './LabPayment';
import PaymentSuccess from './PaymentSucess';
import TrackAppointment from './TrackAppointment';
import { PAGES } from '../../../../constants/pages';

const Stack = createNativeStackNavigator();

const LabBookingView = () => {
  return (
    <Stack.Navigator
      initialRouteName={PAGES.LAB_HOME}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name={PAGES.LAB_HOME} component={LabHome} />
      <Stack.Screen name={PAGES.LAB_CART} component={LabCart} />
      <Stack.Screen name={PAGES.LAB_DETAILS_PAGE} component={DetailsPage} />
      <Stack.Screen name={PAGES.AVAILABLE_LABS} component={AvailableLabs} />
      <Stack.Screen name={PAGES.LAB_BOOKING_PAGE} component={LabBook} />
      <Stack.Screen name={PAGES.LAB_BOOK_APPOINTMENT} component={BookAppointment} />
      <Stack.Screen name={PAGES.LAB_PAYMENT} component={LabPayment} />
      <Stack.Screen name={PAGES.LAB_PAYMENT_SUCCESS} component={PaymentSuccess} />
      <Stack.Screen name={PAGES.LAB_TRACK_APPOINTMENT} component={TrackAppointment} />
    </Stack.Navigator>
  );
};

export default LabBookingView;
