import React from 'react';
import { View, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvButton from '../../../../elements/AvButton';
import { COLORS } from '../../../../constants/colors';

type RootStackParamList = {
  PaymentSuccess: {
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

const PaymentSuccess = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PaymentSuccess'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
          <Icon name="check-circle" size={60} color={COLORS.GREEN} />
        </View>
        <AvText type="title_4" style={styles.successTitle}>
          Appointment Confirmed!
        </AvText>
        <AvText type="body" style={styles.successMessage}>
          Your appointment has been successfully booked and payment received.
        </AvText>
      </View>

      {/* Appointment Card */}
      <AvCard style={styles.card}>
        <AvText type="title_6" style={styles.sectionTitle}>
          Appointment Details
        </AvText>

        {/* Details Rows with Icons */}
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="confirmation-number" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Booking ID</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{bookingId}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="person" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Patient Name</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{fullName}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="phone" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Phone</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{phone}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="payment" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Payment Method</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{method}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="attach-money" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Amount Paid</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>₹{totalPrice}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="schedule" size={18} color={COLORS.GREY} />
            <AvText type="body" style={styles.detailLabel}>Date & Time</AvText>
          </View>
          <AvText type="body" style={styles.detailValue}>{date} at {time}</AvText>
        </View>

        {/* Test Details Section */}
        <AvText type="subtitle" style={styles.subSectionTitle}>
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
                <Icon name="warning" size={14} color={COLORS.ERROR} /> Fasting Required
              </AvText>
            )}
          </View>
        ))}

        {/* Address/Lab Section */}
        {homeCollection ? (
          <>
            <AvText type="subtitle" style={styles.subSectionTitle}>
              Home Collection Address
            </AvText>
            <View style={styles.addressContainer}>
              <View style={styles.iconTitleContainer}>
                <Icon name="home" size={18} color={COLORS.GREY} />
                <AvText type="body" style={styles.addressText}>
                  {address || 'N/A'}
                </AvText>
              </View>
            </View>
          </>
        ) : (
          <>
            <AvText type="subtitle" style={styles.subSectionTitle}>
              Lab Details
            </AvText>
            <View style={styles.detailRow}>
              <View style={styles.iconTitleContainer}>
                <Icon name="local-hospital" size={18} color={COLORS.GREY} />
                <AvText type="body" style={styles.detailLabel}>Lab Name</AvText>
              </View>
              <AvText type="body" style={styles.detailValue}>{labName}</AvText>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.iconTitleContainer}>
                <Icon name="location-on" size={18} color={COLORS.GREY} />
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
            navigation.navigate('TrackAppointment', {
              bookingId,
              fullName,
              testTitle,
              labName,
              date,
              time,
              phone,
              testDetails,
              location,
              homeCollection,
              address,
            })
          }
          style={[styles.actionButton, { backgroundColor: COLORS.PRIMARY }]}
        >
          <Icon name="track-changes" size={18} color={COLORS.WHITE} />
          <AvText style={[styles.actionButtonText, { color: COLORS.WHITE }]}>Track Appointment</AvText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.actionButton, styles.outlinedActionButton]}
        >
          <Icon name="download" size={18} color={COLORS.PRIMARY} />
          <AvText style={[styles.actionButtonText, { color: COLORS.PRIMARY }]}>Download Receipt</AvText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding:20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  successIconContainer: {
    marginBottom: 12,
  },
  successTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    color: COLORS.PRIMARY,
  },
  successMessage: {
    color: COLORS.GREY,
    textAlign: 'center',
    fontSize: 14,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: COLORS.WHITE,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  subSectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    color: COLORS.PRIMARY,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: COLORS.GREY,
    marginLeft: 8,
    fontSize: 14,
  },
  detailValue: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontWeight: '500',
  },
  addressContainer: {
    marginTop: 8,
  },
  addressText: {
    color: COLORS.GREY,
    marginLeft: 8,
    fontSize: 14,
    marginBottom: 4,
  },
  testItem: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.BG_LIGHT,
  },
  testName: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 15,
    color: COLORS.PRIMARY,
  },
  testDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  testCode: {
    color: COLORS.GREY,
    fontSize: 13,
  },
  testPrice: {
    color: COLORS.BLACK,
    fontSize: 13,
    fontWeight: '500',
  },
  testCategory: {
    color: COLORS.GREY,
    fontSize: 13,
  },
  testReportTime: {
    color: COLORS.GREY,
    fontSize: 13,
  },
  testFasting: {
    color: COLORS.ERROR,
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  outlinedActionButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
});


export default PaymentSuccess;
