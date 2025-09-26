import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';

type RootStackParamList = {
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
  [PAGES.LAB_TRACK_APPOINTMENT]: {
    bookingId: string;
    fullName: string;
    testTitle: string;
    labName: string;
    date: string;
    time: string;
    phone: string;
    location: string;
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

const PaymentSuccess = () => {
  const route = useRoute<RouteProp<RootStackParamList, typeof PAGES.LAB_PAYMENT_SUCCESS>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    bookingId,
    fullName,
    testTitle,
    labName,
    date,
    time,
    location,
    method,
    phone,
    totalPrice,
    homeCollection,
    address,
    testDetails,
  } = route.params;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      {/* Success Section */}
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Icon name="check-circle" size={normalize(60)} color={COLORS.GREEN} />
        </View>
        <AvText type="title_6" style={styles.successTitle}>
          Appointment Confirmed!
        </AvText>
        <AvText type="body" style={styles.successMessage}>
          Your appointment has been successfully booked and payment received.
        </AvText>
      </View>

      {/* Appointment Card */}
      <AvCard cardStyle={styles.card}>
        <AvText type="title_6" style={styles.sectionTitle}>
          Appointment Details
        </AvText>

        {/* Details Rows with Icons */}
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="confirmation-number" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Booking ID</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{bookingId}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="person" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Patient Name</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{fullName}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="phone" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Phone</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{phone}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="payment" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Payment Method</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{method}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="attach-money" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Amount Paid</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>₹{totalPrice}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="schedule" size={normalize(18)} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Date & Time</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{date} at {time}</AvText>
        </View>

        {/* Test Details Section */}
        <AvText varient="subtitle" style={styles.subSectionTitle}>
          Test Details
        </AvText>
        {testDetails.map((test, index) => (
          <View key={index} style={styles.testItem}>
            <AvText type="body" style={styles.testName}>
              {test.name}
            </AvText>
            <View style={styles.testDetailRow}>
              <AvText type="body" style={styles.testCode}>Code: {test.code}</AvText>
              <AvText type="body" style={styles.testPrice}>₹{test.price}</AvText>
            </View>
            <View style={styles.testDetailRow}>
              <AvText type="body" style={styles.testCategory}>Category: {test.category}</AvText>
              <AvText type="body" style={styles.testReportTime}>Report: {test.reportTime}</AvText>
            </View>
            {test.fasting && (
              <AvText type="body" style={styles.testFasting}>
                <Icon name="warning" size={normalize(14)} color={COLORS.ERROR} /> Fasting Required
              </AvText>
            )}
          </View>
        ))}

        {/* Address/Lab Section */}
        {homeCollection ? (
          <>
            <AvText varient="subtitle" style={styles.subSectionTitle}>
              Home Collection Address
            </AvText>
            <View style={styles.addressContainer}>
              <View style={styles.iconTitleContainer}>
                <Icon name="home" size={normalize(18)} color={COLORS.GREY} />
                <AvText type="body" style={styles.addressText}>
                  {address || 'N/A'}
                </AvText>
              </View>
            </View>
          </>
        ) : (
          <>
            <AvText varient="subtitle" style={styles.subSectionTitle}>
              Lab Details
            </AvText>
            <View style={styles.detailRow}>
              <View style={styles.iconTitleContainer}>
                <Icon name="local-hospital" size={normalize(18)} color={COLORS.GREY} />
                <AvText type="body" style={styles.detailLabel}>Lab Name</AvText>
              </View>
              <AvText type="body" style={styles.detailValue}>{labName}</AvText>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.iconTitleContainer}>
                <Icon name="location-on" size={normalize(18)} color={COLORS.GREY} />
                <AvText type="body" style={styles.addressText}>
                  {location || 'N/A'}
                </AvText>
              </View>
            </View>
          </>
        )}
      </AvCard>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(PAGES.LAB_TRACK_APPOINTMENT, { bookingId, fullName, testTitle, labName, date, time, phone, testDetails, location,  homeCollection, address,  })}
          style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}>
          <Icon name="track-changes" size={normalize(18)} color={COLORS.WHITE} />
          <AvText style={[styles.actionButtonText, { color: COLORS.WHITE }]}>Track Appointment</AvText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.actionButton, styles.outlinedActionButton]}
        >
          <Icon name="download" size={normalize(18)} color={COLORS.PRIMARY} />
          <AvText style={[styles.actionButtonText, { color: COLORS.PRIMARY }]}>Download Receipt</AvText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: normalize(16) },
  scrollView: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  successContainer: { alignItems: 'center', marginBottom: normalize(24), paddingHorizontal: normalize(16) },
  successIconContainer: { marginBottom: normalize(16) },
  successTitle: { fontWeight: 'bold', fontSize: normalize(20), marginBottom: normalize(8), color: COLORS.PRIMARY, textAlign: 'center' },
  successMessage: { color: COLORS.GREY, textAlign: 'center', fontSize: normalize(14), lineHeight: normalize(20) },
  card: { marginBottom: normalize(24), padding: normalize(16), borderRadius: normalize(12), shadowColor: COLORS.BLACK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: normalize(4), elevation: 2, backgroundColor: COLORS.WHITE },
  sectionTitle: { fontWeight: 'bold', marginBottom: normalize(16), fontSize: normalize(16), color: COLORS.PRIMARY },
  subSectionTitle: { fontWeight: 'bold', marginTop: normalize(20), marginBottom: normalize(12), fontSize: normalize(15), color: COLORS.PRIMARY },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(12) },
  iconTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  detailLabel: { color: COLORS.GREY, marginLeft: normalize(8), fontSize: normalize(14) },
  detailValue: { color: COLORS.BLACK, fontSize: normalize(14), fontWeight: '500', textAlign: 'right', maxWidth: '50%' },
  addressContainer: { marginTop: normalize(8) },
  addressText: { color: COLORS.GREY, marginLeft: normalize(8), fontSize: normalize(14), marginBottom: normalize(4), lineHeight: normalize(20) },
  testItem: { borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: normalize(8), padding: normalize(12), marginBottom: normalize(16), backgroundColor: COLORS.WHITE },
  testName: { fontWeight: 'bold', marginBottom: normalize(8), fontSize: normalize(15), color: COLORS.PRIMARY },
  testDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(4) },
  testCode: { color: COLORS.GREY, fontSize: normalize(13) },
  testPrice: { color: COLORS.BLACK, fontSize: normalize(13), fontWeight: '500' },
  testCategory: { color: COLORS.GREY, fontSize: normalize(13) },
  testReportTime: { color: COLORS.GREY, fontSize: normalize(13) },
  testFasting: { color: COLORS.ERROR, fontStyle: 'italic', fontSize: normalize(13), marginTop: normalize(8) },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(24) },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(12), paddingHorizontal: normalize(16), borderRadius: normalize(8), marginHorizontal: normalize(4) },
  outlinedActionButton: { backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.PRIMARY },
  actionButtonText: { marginLeft: normalize(8), fontWeight: '500', fontSize: normalize(14) },
});

export default PaymentSuccess;
