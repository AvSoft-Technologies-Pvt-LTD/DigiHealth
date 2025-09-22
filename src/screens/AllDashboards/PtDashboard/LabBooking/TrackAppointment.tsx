import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvButton from '../../../../elements/AvButton';
import { COLORS } from '../../../../constants/colors';

const TrackAppointment = () => {
  const route = useRoute<RouteProp<{ TrackAppointment: TrackAppointmentRouteParams }, 'TrackAppointment'>>();
  const navigation = useNavigation();

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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={20} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Back to Home</AvText>
      </TouchableOpacity>

      <AvText type="title_4" style={styles.title}>Appointment Summary</AvText>

      {/* Tracking Section */}
      <AvCard style={styles.card}>
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
                    <Icon name="check" size={16} color={COLORS.WHITE} />
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
      {/* Appointment Details Section */}
      <AvCard style={styles.card}>
        <AvText type="title_6" style={styles.cardTitle}>Appointment Details</AvText>

        <View style={styles.detailSection}>
          <AvText type="subtitle" style={styles.sectionTitle}>Test Information</AvText>
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

        <View style={styles.detailSection}>
          <AvText type="subtitle" style={styles.sectionTitle}>Patient Information</AvText>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Name:</AvText>
            <AvText type="body" style={styles.detailValue}>{appointment?.patientName}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Phone:</AvText>
            <AvText type="body" style={styles.detailValue}>{appointment?.phone}</AvText>
          </View>
        </View>
      </AvCard>

      {/* Appointment Information Section */}
      <AvCard style={styles.card}>
        <View style={styles.detailSection}>
          <AvText type="subtitle" style={styles.sectionTitle}>Appointment Information</AvText>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Date:</AvText>
            <AvText type="body" style={styles.detailValue}>{appointment?.date}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Time:</AvText>
            <AvText type="body" style={styles.detailValue}>{appointment?.time}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Type:</AvText>
            <AvText type="body" style={styles.detailValue}>
              {homeCollection ? 'Home Collection' : 'Lab Visit'}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.detailLabel}>Payment:</AvText>
            <AvText type="body" style={styles.detailValue}>Success</AvText>
          </View>
        </View>
      </AvCard>

      {/* Lab Information Section */}
      <AvCard style={styles.card}>
        <AvText type="subtitle" style={styles.sectionTitle}>Lab Information</AvText>
        <View style={styles.detailRow}>
          <AvText type="body" style={styles.detailLabel}>{appointment?.labName}</AvText>
        </View>
      <View style={styles.detailRow}>
  <View style={styles.iconTitleContainer}>
    <Icon name="location-on" size={16} color={COLORS.GREY} />
    <AvText type="body" style={styles.detailLabel}>Location</AvText>
  </View>
  <AvText type="body" style={styles.detailValue}>{appointment?.location}</AvText>
</View>
<View style={styles.detailRow}>
  <View style={styles.iconTitleContainer}>
    <Icon name="phone" size={16} color={COLORS.GREY} />
    <AvText type="body" style={styles.detailLabel}>Phone</AvText>
  </View>
  <AvText type="body" style={styles.detailValue}>+91 98765 43210</AvText>
</View>

        <View style={styles.detailRow}>
          <AvText type="body" style={styles.detailLabel}>Amount Paid:</AvText>
          <AvText type="body" style={styles.detailValue}>₹ N/A</AvText>
        </View>
        <View style={styles.detailRow}>
          <AvText type="body" style={styles.detailLabel}>Payment Status:</AvText>
          <AvText type="body" style={styles.detailValue}>Success</AvText>
        </View>
      </AvCard>

      {/* Actions Section */}
    <AvCard style={styles.card}>
  <AvText type="subtitle" style={styles.sectionTitle}>Actions</AvText>
  <View style={styles.actionsRow}>
    {/* Download Button */}
    <TouchableOpacity
      onPress={() => { }}
      style={[styles.touchableButton, { backgroundColor: COLORS.PRIMARY }]}
    >
      <Icon name="download" size={18} color={COLORS.WHITE} />
      <AvText style={styles.buttonText}>Download</AvText>
    </TouchableOpacity>

    {/* Print Button */}
    <TouchableOpacity
      onPress={() => { }}
      style={[styles.touchableButton, styles.outlinedButton]}
    >
      <Icon name="print" size={18} color={COLORS.PRIMARY} />
      <AvText style={[styles.buttonText, { color: COLORS.PRIMARY }]}>Print</AvText>
    </TouchableOpacity>

    {/* Share Button */}
    <TouchableOpacity
      onPress={() => { }}
      style={[styles.touchableButton, styles.outlinedButton]}
    >
      <Icon name="share" size={18} color={COLORS.PRIMARY} />
      <AvText style={[styles.buttonText, { color: COLORS.PRIMARY }]}>Share</AvText>
    </TouchableOpacity>
  </View>
</AvCard>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollContent: {
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 18,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  trackingStep: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  stepContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  stepNumber: {
    color: COLORS.GREY,
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
  },
  stepLine: {
    height: 24,
    width: 2,
    marginLeft: 15,
    marginBottom: 8,
    borderRadius: 1,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.GREY,
    marginLeft: 6,
  },
  detailValue: {
    color: COLORS.BLACK,
    flex: 1,
    textAlign: 'right',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  touchableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  buttonText: {
    color: COLORS.WHITE,
    marginLeft: 6,
    fontSize: 14,
  },
  testItem: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  testName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  testCode: {
    color: COLORS.GREY,
    marginBottom: 2,
  },
  testCategory: {
    color: COLORS.GREY,
    marginBottom: 2,
  },
  testReportTime: {
    color: COLORS.GREY,
    marginBottom: 2,
  },
  testFasting: {
    color: COLORS.ERROR,
    fontStyle: 'italic',
  },
});

export default TrackAppointment;
