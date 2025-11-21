import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PaymentComponent from '../../../../elements/AvPayment';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';
import { AvCards, AvText } from '../../../../elements';

// Define RootStackParamList with PAGES constants
type RootStackParamList = {
  [PAGES.LAB_PAYMENT]: {
    lab: any;
    cart: any[];
    totalPrice: number;
    fullName: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    location: string;
    address?: string;
    homeCollection: boolean;
    labLocation: string;
    labName: string;
    testTitle: string;
    testDetails: Array<{
      name: string;
      code: string;
      category: string;
      price: number;
      reportTime: string;
      fasting?: boolean;
    }>;
  };
  [PAGES.LAB_PAYMENT_SUCCESS]: {
    bookingId: string;
    fullName: string;
    testTitle: string;
    labName: string;
    date: string;
    time: string;
    phone: string;
    location: string;
    method: string;
    totalPrice: number;
    homeCollection: boolean;
    address?: string;
    testDetails: Array<{
      name: string;
      code: string;
      category: string;
      price: number;
      reportTime: string;
      fasting?: boolean;
    }>;
  };
};

const LabPayment = () => {
  // Type the route and navigation
  const route = useRoute<RouteProp<RootStackParamList, typeof PAGES.LAB_PAYMENT>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    lab,
    cart,
    totalPrice,
    fullName,
    phone,
    date,
    time,
    location,
    homeCollection,
    address,
    testDetails,
  } = route.params;

  const handlePaymentSuccess = (paymentData: any) => {
    navigation.navigate(PAGES.LAB_PAYMENT_SUCCESS, {
      bookingId: `APT${Date.now().toString().slice(-6)}`,
      fullName,
      testTitle: cart.map((test) => test.title).join(', '),
      labName: lab.name,
      date,
      time,
      phone,
      location: homeCollection ? 'Home Collection' : lab.location,
      method: paymentData?.method || 'N/A',
      totalPrice,
      homeCollection,
      address,
      testDetails,
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Payment Component */}
      <PaymentComponent
        amount={totalPrice}
        currency="₹"
        merchantName="Lab Booking"
        buttonText={`Pay ₹${totalPrice}`}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      {/* Booking Summary Card */}
      <AvCards title="Booking Summary" cardStyle={styles.card}>
        <AvText type="title_6" style={styles.cardTitle}>
          Booking Summary
        </AvText>

        <View style={styles.section}>
          <AvText type="body" style={styles.sectionTitle}>
            Patient Details
          </AvText>
          <AvText type="body" style={styles.text}>
            Name: {fullName}
          </AvText>
          <AvText type="body" style={styles.text}>
            Phone: {phone}
          </AvText>
        </View>

        <View style={styles.section}>
          <AvText type="body" style={styles.sectionTitle}>
            Appointment Details
          </AvText>
          <AvText type="body" style={styles.text}>
            Date: {date}
          </AvText>
          <AvText type="body" style={styles.text}>
            Time: {time}
          </AvText>
          <AvText type="body" style={styles.text}>
            Location: {homeCollection ? 'Home Collection' : lab.location}
          </AvText>
          {homeCollection && (
            <AvText type="body" style={styles.text}>
              Address: {address}
            </AvText>
          )}
        </View>

        <View style={styles.section}>
          <AvText type="body" style={styles.sectionTitle}>
            Test Details
          </AvText>
          {testDetails.map((test, index) => (
            <View key={index} style={styles.testItem}>
              <AvText type="body" style={styles.testName}>
                {test.name}
              </AvText>
              <AvText type="body" style={styles.testCode}>
                Code: {test.code}
              </AvText>
              <AvText type="body" style={styles.testCategory}>
                Category: {test.category}
              </AvText>
              <AvText type="body" style={styles.testPrice}>
                Price: ₹{test.price}
              </AvText>
              <AvText type="body" style={styles.testReportTime}>
                Report Time: {test.reportTime}
              </AvText>
              {test.fasting && (
                <AvText type="body" style={styles.testFasting}>
                  Fasting Required
                </AvText>
              )}
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <AvText type="title_6" style={styles.totalPrice}>
            Total: ₹{totalPrice}
          </AvText>
        </View>
      </AvCards>
    </ScrollView>
  );
};

// Styles with normalize for responsive sizing
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollContent: { padding: normalize(16) },
  card: { marginBottom: normalize(16), padding: normalize(16) },
  cardTitle: { fontWeight: 'bold', marginBottom: normalize(12) },
  section: { marginBottom: normalize(12) },
  sectionTitle: { fontWeight: 'bold', marginBottom: normalize(4) },
  text: { color: COLORS.GREY, marginBottom: normalize(2) },
  testItem: { borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: normalize(8), padding: normalize(12), marginBottom: normalize(8) },
  testName: { fontWeight: 'bold', marginBottom: normalize(2) },
  testCode: { color: COLORS.GREY, marginBottom: normalize(2) },
  testCategory: { color: COLORS.GREY, marginBottom: normalize(2) },
  testPrice: { color: COLORS.GREY, marginBottom: normalize(2) },
  testReportTime: { color: COLORS.GREY, marginBottom: normalize(2) },
  testFasting: { color: COLORS.ERROR, fontStyle: 'italic' },
  totalRow: { alignItems: 'flex-end', marginTop: normalize(8) },
  totalPrice: { fontWeight: 'bold', fontSize: normalize(16) },
});

export default LabPayment;
