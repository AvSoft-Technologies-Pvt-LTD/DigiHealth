import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvButton from '../../../../elements/AvButton';
import { COLORS } from '../../../../constants/colors';

type LabBookRouteParams = {
  lab: {
    name: string;
    location: string;
    rating: number;
    homeCollection?: boolean;
  };
  cart: {
    id: string | number;
    title: string;
    type: string;
    code: string;
    price: number;
    reportTime: string;
    fasting?: boolean;
  }[];
};

const LabBook = () => {
  const route = useRoute();
  const { lab, cart } = route.params as LabBookRouteParams;
  const navigation = useNavigation<any>();

  const totalPrice = cart.reduce((sum, test) => sum + test.price, 0);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={20} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Back to Labs List</AvText>
      </TouchableOpacity>

      {/* Lab Info */}
      <AvCard style={styles.labInfoCard}>
        <View style={styles.labHeader}>
          <AvText type="title_6" style={styles.labName}>{lab.name}</AvText>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={16} color={COLORS.GREY} />
            <AvText type="body" style={styles.locationText}>{lab.location}</AvText>
          </View>
        </View>
        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color={COLORS.GREEN} />
          <AvText type="body" style={styles.ratingText}>{lab.rating}/5</AvText>
        </View>
        {lab.homeCollection && (
          <View style={styles.facilityItem}>
            <Icon name="check" size={16} color={COLORS.GREEN} />
            <AvText type="body" style={styles.facilityText}>Home Collection Available</AvText>
          </View>
        )}
      </AvCard>

      {/* Selected Tests */}
      <AvCard style={styles.selectedTestsCard}>
        <AvText type="title_6" style={styles.sectionTitle}>Selected Tests</AvText>
        {cart.map((test) => (
          <View key={test.id} style={styles.testItem}>
            <View style={styles.testHeader}>
              <AvText type="body" style={styles.testTitle}>{test.title}</AvText>
              <View style={styles.testTag}>
                <AvText type="body" style={styles.testTagText}>{test.type}</AvText>
              </View>
            </View>
            <AvText type="body" style={styles.testCode}>Code: {test.code}</AvText>
            <AvText type="body" style={styles.testReportTime}>Report Time: {test.reportTime}</AvText>
            <AvText type="body" style={styles.testFasting}>{test.fasting ? 'Fasting required' : 'No fasting required'}</AvText>
          </View>
        ))}
        <View style={styles.totalRow}>
          <AvText type="title_6" style={styles.totalPrice}>₹{totalPrice}</AvText>
        </View>
      </AvCard>

      {/* Booking Section */}
      <AvCard style={styles.bookingCard}>
        <AvText type="title_6" style={styles.sectionTitle}>Book Your Appointment</AvText>
        <AvText type="body" style={styles.bookingDescription}>
          Choose between home sample collection or visiting the lab for your selected tests.
        </AvText>
        <AvButton
          mode="contained"
          onPress={() => navigation.navigate('BookAppointment', { lab, cart })}
          style={styles.bookButton} // only style for the button container
        >
          Book Appointment
        </AvButton>
      </AvCard>

      {/* Lab Details */}
      <AvCard style={styles.labDetailsCard}>
        <AvText type="title_6" style={styles.sectionTitle}>Lab Information:</AvText>
        <AvText type="body" style={styles.labDetailsText}>Lab Name: {lab.name}</AvText>
        <AvText type="body" style={styles.labDetailsText}>Location: {lab.location}</AvText>
      </AvCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
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
  labInfoCard: {
    marginBottom: 16,
    padding: 16,
  },
  labHeader: {
    marginBottom: 8,
  },
  labName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: COLORS.GREY,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    color: COLORS.GREY,
    marginLeft: 4,
  },
  facilitiesSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  facilityText: {
    color: COLORS.GREY,
    marginLeft: 4,
  },
  selectedTestsCard: {
    marginBottom: 16,
    padding: 16,
  },
  testItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    padding: 12,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  testTitle: {
    fontWeight: 'bold',
  },
  testTag: {
    backgroundColor: COLORS.LIGHT_GREY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  testTagText: {
    color: COLORS.GREY,
    fontSize: 12,
  },
  testCode: {
    color: COLORS.GREY,
    marginBottom: 2,
  },
  testReportTime: {
    color: COLORS.GREY,
    marginBottom: 2,
  },
  testFasting: {
    color: COLORS.GREY,
  },
  totalRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookingCard: {
    marginBottom: 16,
    padding: 16,
  },
  bookingDescription: {
    color: COLORS.GREY,
    marginBottom: 16,
  },
  bookButton: {
    borderRadius: 24,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: COLORS.WHITE,
  },
  labDetailsCard: {
    marginBottom: 16,
    padding: 16,
  },
  labDetailsText: {
    color: COLORS.GREY,
    marginBottom: 4,
  },
});

export default LabBook;
