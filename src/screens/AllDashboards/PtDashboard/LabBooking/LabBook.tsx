import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp, NativeStackNavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvButton from '../../../../elements/AvButton';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';

// Define the expected route parameters
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

// Define the RootStackParamList type
type RootStackParamList = {
  [PAGES.LAB_BOOKING_PAGE]: LabBookRouteParams;
  [PAGES.LAB_BOOK_APPOINTMENT]: LabBookRouteParams;
  // Add other routes as needed
};

const LabBook = () => {
  // Type the route and navigation
  const route = useRoute<RouteProp<RootStackParamList, typeof PAGES.LAB_BOOKING_PAGE>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { lab, cart } = route.params;
  const totalPrice = cart.reduce((sum, test) => sum + test.price, 0);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={normalize(20)} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Back to Labs List</AvText>
      </TouchableOpacity>

      {/* Lab Info */}
      <AvCard cardStyle={styles.labInfoCard}>
        <View style={styles.labHeader}>
          <AvText type="title_6" style={styles.labName}>{lab.name}</AvText>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={normalize(16)} color={COLORS.GREY} />
            <AvText type="body" style={styles.locationText}>{lab.location}</AvText>
          </View>
        </View>
        <View style={styles.ratingRow}>
          <Icon name="star" size={normalize(16)} color={COLORS.GREEN} />
          <AvText type="body" style={styles.ratingText}>{lab.rating}/5</AvText>
        </View>
        {lab.homeCollection && (
          <View style={styles.facilityItem}>
            <Icon name="check" size={normalize(16)} color={COLORS.GREEN} />
            <AvText type="body" style={styles.facilityText}>Home Collection Available</AvText>
          </View>
        )}
      </AvCard>

      {/* Selected Tests */}
      <AvCard cardStyle={styles.selectedTestsCard}>
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
      <AvCard cardStyle={styles.bookingCard}>
        <AvText type="title_6" style={styles.sectionTitle}>Book Your Appointment</AvText>
        <AvText type="body" style={styles.bookingDescription}>
          Choose between home sample collection or visiting the lab for your selected tests.
        </AvText>
        <AvButton
          mode="contained"
          onPress={() => navigation.navigate(PAGES.LAB_BOOK_APPOINTMENT, { lab, cart })}
          style={styles.bookButton}
        >
          Book Appointment
        </AvButton>
      </AvCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    padding: normalize(16),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  backText: {
    color: COLORS.PRIMARY,
    marginLeft: normalize(8),
  },
  labInfoCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  labHeader: {
    marginBottom: normalize(8),
  },
  labName: {
    fontWeight: 'bold',
    fontSize: normalize(18),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  locationText: {
    color: COLORS.GREY,
    marginLeft: normalize(4),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  ratingText: {
    color: COLORS.GREY,
    marginLeft: normalize(4),
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  facilityText: {
    color: COLORS.GREEN,
    marginLeft: normalize(4),
  },
  selectedTestsCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  testItem: {
    marginBottom: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  testTitle: {
    fontWeight: 'bold',
  },
  testTag: {
    backgroundColor: COLORS.LIGHT_GREY,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(4),
  },
  testTagText: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  testCode: {
    color: COLORS.GREY,
    marginBottom: normalize(2),
  },
  testReportTime: {
    color: COLORS.GREY,
    marginBottom: normalize(2),
  },
  testFasting: {
    color: COLORS.GREY,
  },
  totalRow: {
    alignItems: 'flex-end',
    marginTop: normalize(8),
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  bookingCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  bookingDescription: {
    color: COLORS.GREY,
    marginBottom: normalize(16),
  },
  bookButton: {
    borderRadius: normalize(24),
    paddingVertical: normalize(8),
  },
  labDetailsCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  labDetailsText: {
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
});

export default LabBook;
