import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { PAGES } from '../../../../constants/pages';

type RootStackParamList = {
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, typeof PAGES.LAB_TRACK_APPOINTMENT>;
type RoutePropType = RouteProp<RootStackParamList, typeof PAGES.LAB_TRACK_APPOINTMENT>;

const TrackAppointment = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const {
    bookingId = 'N/A',
    fullName = 'N/A',
    testTitle = 'N/A',
    labName = 'N/A',
    date = 'N/A',
    time = 'N/A',
    phone = 'N/A',
    location = 'N/A',
    homeCollection = false,
    address = 'N/A',
    testDetails = [],
  } = route.params || {};
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    setAppointment({
      bookingId,
      patientName: fullName,
      testTitle,
      labName,
      date,
      time,
      phone,
      location: homeCollection ? address : location,
      status: 'Sample Collected',
    });
  }, [bookingId, fullName, testTitle, labName, date, time, location, homeCollection, address]);

  const steps = [
    'Appointment Confirmed',
    'Technician On the Way',
    'Sample Collected',
    'Test Processing',
    'Report Ready',
  ];
  const currentStep = steps.indexOf(appointment?.status || 'Appointment Confirmed');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity   onPress={() => navigation.navigate(PAGES.LAB_HOME)} style={styles.backButton}>
        <Icon name="arrow-back" size={normalize(20)} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Back to Home</AvText>
      </TouchableOpacity>
      <AvText varient="title_4" style={styles.title}>Appointment Summary</AvText>
      <AvCard cardStyle={styles.card}>
        <View style={styles.trackingStep}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIconContainer,
                    {
                      backgroundColor: index <= currentStep ? COLORS.PRIMARY : COLORS.LIGHT_GREY,
                      borderColor: index <= currentStep ? COLORS.PRIMARY : COLORS.LIGHT_GREY,
                    },
                  ]}
                >
                  {index <= currentStep ? (
                    <Icon name="check" size={normalize(16)} color={COLORS.WHITE} />
                  ) : (
                    <AvText style={styles.stepNumber}>{index + 1}</AvText>
                  )}
                </View>
                <AvText
                  style={[
                    styles.stepText,
                    {
                      color: index <= currentStep ? COLORS.PRIMARY : COLORS.GREY,
                      fontWeight: index === currentStep ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {step}
                </AvText>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    {
                      backgroundColor: index < currentStep ? COLORS.PRIMARY : COLORS.LIGHT_GREY,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </AvCard>
      <AvCard cardStyle={styles.card}>
        <AvText varient="title_6" style={styles.cardTitle}>Appointment Details</AvText>
        <View style={styles.detailSection}>
          <AvText varient="subtitle" style={styles.sectionTitle}>Test Information</AvText>
          {testDetails.map((test, index) => (
            <View key={index} style={styles.testItem}>
              <AvText varient="body" style={styles.testName}>
                {test.name}
              </AvText>
              <AvText varient="body" style={styles.testCode}>
                Code: {test.code}
              </AvText>
              <AvText varient="body" style={styles.testCategory}>
                Category: {test.category}
              </AvText>
              <AvText varient="body" style={styles.testReportTime}>
                Report Time: {test.reportTime}
              </AvText>
              {test.fasting && (
                <AvText varient="body" style={styles.testFasting}>
                  Fasting Required
                </AvText>
              )}
            </View>
          ))}
        </View>
        <View style={styles.detailSection}>
          <AvText varient="subtitle" style={styles.sectionTitle}>Patient Information</AvText>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Name:</AvText>
            <AvText varient="body" style={styles.detailValue}>{appointment?.patientName}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Phone:</AvText>
            <AvText varient="body" style={styles.detailValue}>{appointment?.phone}</AvText>
          </View>
        </View>
      </AvCard>
      <AvCard cardStyle={styles.card}>
        <View style={styles.detailSection}>
          <AvText varient="subtitle" style={styles.sectionTitle}>Appointment Information</AvText>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Date:</AvText>
            <AvText varient="body" style={styles.detailValue}>{appointment?.date}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Time:</AvText>
            <AvText varient="body" style={styles.detailValue}>{appointment?.time}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Type:</AvText>
            <AvText varient="body" style={styles.detailValue}>
              {homeCollection ? 'Home Collection' : 'Lab Visit'}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText varient="body" style={styles.detailLabel}>Payment:</AvText>
            <AvText varient="body" style={styles.detailValue}>Success</AvText>
          </View>
        </View>
      </AvCard>
      <AvCard cardStyle={styles.card}>
        <AvText varient="subtitle" style={styles.sectionTitle}>Lab Information</AvText>
        <View style={styles.detailRow}>
          <AvText varient="body" style={styles.detailLabel}>{appointment?.labName}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="location-on" size={normalize(16)} color={COLORS.GREY} />
            <AvText varient="body" style={styles.detailLabel}>Location</AvText>
          </View>
          <AvText varient="body" style={styles.detailValue}>{appointment?.location}</AvText>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.iconTitleContainer}>
            <Icon name="phone" size={normalize(16)} color={COLORS.GREY} />
            <AvText varient="body" style={styles.detailLabel}>Phone</AvText>
          </View>
          <AvText varient="body" style={styles.detailValue}>+91 98765 43210</AvText>
        </View>
        <View style={styles.detailRow}>
          <AvText varient="body" style={styles.detailLabel}>Amount Paid:</AvText>
          <AvText varient="body" style={styles.detailValue}>₹ N/A</AvText>
        </View>
        <View style={styles.detailRow}>
          <AvText varient="body" style={styles.detailLabel}>Payment Status:</AvText>
          <AvText varient="body" style={styles.detailValue}>Success</AvText>
        </View>
      </AvCard>
      <AvCard cardStyle={styles.card}>
        <AvText varient="subtitle" style={styles.sectionTitle}>Actions</AvText>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => { }}
            style={[styles.touchableButton, { backgroundColor: COLORS.PRIMARY }]}
          >
            <Icon name="download" size={normalize(18)} color={COLORS.WHITE} />
            <AvText style={styles.buttonText}>Download</AvText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={[styles.touchableButton, styles.outlinedButton]}
          >
            <Icon name="print" size={normalize(18)} color={COLORS.PRIMARY} />
            <AvText style={[styles.buttonText, { color: COLORS.PRIMARY }]}>Print</AvText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={[styles.touchableButton, styles.outlinedButton]}
          >
            <Icon name="share" size={normalize(18)} color={COLORS.PRIMARY} />
            <AvText style={[styles.buttonText, { color: COLORS.PRIMARY }]}>Share</AvText>
          </TouchableOpacity>
        </View>
      </AvCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollContent: { padding: normalize(16) },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(16) },
  backText: { color: COLORS.PRIMARY, marginLeft: normalize(8) },
  title: { fontWeight: 'bold', marginBottom: normalize(16), fontSize: normalize(18) },
  card: { marginBottom: normalize(16), padding: normalize(16) },
  trackingStep: { marginVertical: normalize(16), paddingHorizontal: normalize(8) },
  stepContainer: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: normalize(8) },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) },
  stepIconContainer: { width: normalize(32), height: normalize(32), borderRadius: normalize(16), justifyContent: 'center', alignItems: 'center', marginRight: normalize(12), borderWidth: normalize(2) },
  stepNumber: { color: COLORS.GREY, fontWeight: 'bold', fontSize: normalize(12) },
  stepText: { flex: 1, fontSize: normalize(14) },
  stepLine: { height: normalize(24), width: normalize(2), marginLeft: normalize(15), marginBottom: normalize(8), borderRadius: normalize(1) },
  detailSection: { marginBottom: normalize(12) },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(8) },
  iconTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { color: COLORS.GREY, marginLeft: normalize(6) },
  detailValue: { color: COLORS.BLACK, flex: 1, textAlign: 'right' },
  cardTitle: { fontWeight: 'bold', marginBottom: normalize(12) },
  sectionTitle: { fontWeight: 'bold', marginBottom: normalize(8) },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: normalize(8) },
  touchableButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(10), paddingHorizontal: normalize(8), borderRadius: normalize(4), marginHorizontal: normalize(4) },
  outlinedButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.PRIMARY },
  buttonText: { color: COLORS.WHITE, marginLeft: normalize(6), fontSize: normalize(14) },
  testItem: { borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: normalize(8), padding: normalize(12), marginBottom: normalize(8) },
  testName: { fontWeight: 'bold', marginBottom: normalize(2) },
  testCode: { color: COLORS.GREY, marginBottom: normalize(2) },
  testCategory: { color: COLORS.GREY, marginBottom: normalize(2) },
  testReportTime: { color: COLORS.GREY, marginBottom: normalize(2) },
  testFasting: { color: COLORS.ERROR, fontStyle: 'italic' },
});

export default TrackAppointment;
