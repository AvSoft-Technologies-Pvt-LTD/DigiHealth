import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AvButton from '../../../../elements/AvButton';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { PAGES } from '../../../../constants/pages';
import { useNavigation } from '@react-navigation/native';
import { AvIcons } from '../../../../elements';

// Define your navigation params type if needed
type RootStackParamList = {
  [PAGES.PAYMENT_SCREEN]: {
    amount: number;
    currency: string;
    merchantName: string;
  };
  // Add other screens here if needed
};

type Equipment = {
  label: string;
  value: string;
  price: number;
};

type BookingDetails = {
  pickupLocation: string;
  hospital: string;
  ambulanceType: string;
  category: string;
  equipment: string[];
  date: Date;
};

type BookingConfirmationScreenProps = {
  onBack: () => void;
  bookingDetails: BookingDetails;
  onUpdateEquipment: (equipment: string[]) => void;
};

const equipmentData: Equipment[] = [
  { label: "Oxygen Cylinder", value: "oxygen_cylinder", price: 500 },
  { label: "Stretcher", value: "stretcher", price: 300 },
  { label: "First Aid Kit", value: "first_aid_kit", price: 200 },
  { label: "Ventilator", value: "ventilator", price: 1000 },
  { label: "Defibrillator", value: "defibrillator", price: 1500 },
  { label: "ECG Monitor", value: "ecg_monitor", price: 2000 },
  { label: "Suction Machine", value: "suction_machine", price: 1200 },
  { label: "Spinal Board", value: "spinal_board", price: 800 }
];

const ACCENT_COLOR = COLORS.SECONDARY;

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  onBack,
  bookingDetails,
  onUpdateEquipment,
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(bookingDetails.equipment);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    setSelectedEquipment(bookingDetails.equipment);
  }, [bookingDetails.equipment]);

  const totalEquipmentCost = useMemo(() => {
    return selectedEquipment.reduce((sum: number, current: string) => {
      const equipment = equipmentData.find((e) => e.value === current);
      return sum + (equipment?.price || 0);
    }, 0);
  }, [selectedEquipment]);

  const handleEquipmentChange = (newEquipment: string[]) => {
    setSelectedEquipment(newEquipment);
    onUpdateEquipment(newEquipment);
  };

  const getIconComponent = (itemValue: string) => {
    const item = equipmentData.find((e) => e.value === itemValue);
    switch (item?.label) {
      case "Oxygen Cylinder":
        return <AvIcons type='MaterialCommunityIcons' name="oxygen" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "Stretcher":
        return <AvIcons type='MaterialCommunityIcons' name="bed" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "First Aid Kit":
        return <AvIcons type='MaterialCommunityIcons' name="first-aid" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "Ventilator":
        return <AvIcons type='MaterialCommunityIcons' name="fan" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "Defibrillator":
        return <AvIcons type='MaterialCommunityIcons' name="heart-pulse" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "ECG Monitor":
        return <AvIcons type='MaterialCommunityIcons' name="heart" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "Suction Machine":
        return <AvIcons type='MaterialCommunityIcons' name="vacuum" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      case "Spinal Board":
        return <AvIcons type='MaterialCommunityIcons' name="bed-empty" size={normalize(20)} color={COLORS.OCEAN_BLUE} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={onBack}>
            {/* <Icon name="chevron-left" size={normalize(24)} color={COLORS.GREY} /> */}
          </TouchableOpacity>
          <AvText type="Subtitle_1" style={[styles.stepText, styles.stepTextActive]}>
            Details
          </AvText>
          <AvText type="Subtitle_1" style={styles.stepText}>
            Confirm
          </AvText>
        </View>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <AvIcons type='MaterialCommunityIcons' name="ambulance" size={normalize(20)} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.headerText}>
              Ambulance Booking
            </AvText>
          </View>
          <AvText type="description" style={styles.subText}>
            Book an ambulance from AV Swasthya's trusted network
          </AvText>
          <AvButton
            mode="contained"
            style={styles.nearbyButton}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate(PAGES.SEARCH_AMBULANCE_VIEW as any)}
          >
            <AvIcons type='MaterialCommunityIcons' name="location-pin" size={normalize(16)} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>
              Near By Ambulance
            </AvText>
          </AvButton>
        </View>
        <View style={styles.stepRow}>
          <View style={[styles.stepNumberContainer, { backgroundColor: ACCENT_COLOR }]}>
            <AvText type="heading_7" style={styles.stepNumberText}>
              1
            </AvText>
          </View>
          <View style={styles.stepLineActive} />
          <View style={styles.stepNumberContainer}>
            <AvText type="heading_7" style={styles.stepNumberText}>
              2
            </AvText>
          </View>
        </View>
        <View style={styles.confirmationCard}>
          <View style={styles.confirmationCardHeader}>
            <AvIcons type='MaterialCommunityIcons' name="check-circle" size={normalize(20)} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.confirmationTitle}>
              Booking Confirmation
            </AvText>
          </View>
          <AvText type="caption" style={styles.confirmationSubtitle}>
            Please review your booking details below
          </AvText>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AvIcons type='MaterialCommunityIcons' name="description" size={normalize(20)} color={COLORS.ERROR} />
            <AvText type="title_6" style={styles.sectionTitle}>
              Service Details
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Ambulance Type:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.ambulanceType}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Category:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.category}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Pickup Location:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.pickupLocation}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Hospital Location:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.hospital}
            </AvText>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AvIcons type='MaterialCommunityIcons' name="calendar-today" size={normalize(20)} color={COLORS.BRIGHT_ORANGE} />
            <AvText type="title_6" style={styles.sectionTitle}>
              Schedule & Location
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Booking Date:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.date.toLocaleDateString()}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Day:
            </AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.date.toLocaleDateString('en-US', { weekday: 'long' })}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>
              Status:
            </AvText>
            <AvText type="body" style={[styles.value, styles.confirmedStatus]}>
              Confirmed
            </AvText>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AvIcons type='MaterialCommunityIcons' name="inventory-2" size={normalize(20)} color={COLORS.OCEAN_BLUE} />
            <AvText type="title_6" style={styles.sectionTitle}>
              Equipment & Billing
            </AvText>
          </View>
          {selectedEquipment.length > 0 ? (
            <View style={styles.equipmentList}>
              {selectedEquipment.map((itemValue: string) => {
                const item = equipmentData.find((e) => e.value === itemValue);
                return item ? (
                  <View key={item.value} style={styles.equipmentItem}>
                    <View style={styles.equipmentItemLeft}>
                      {getIconComponent(item.value)}
                      <AvText type="body" style={styles.equipmentLabel}>
                        {item.label}
                      </AvText>
                    </View>
                    <AvText type="body" style={styles.equipmentPrice}>
                      ₹{item.price}
                    </AvText>
                  </View>
                ) : null;
              })}
              <View style={styles.divider} />
              <View style={styles.totalCostRow}>
                <View>
                  <AvText type="title_6" style={styles.totalCostLabel}>
                    Total Equipment Cost:
                  </AvText>
                  <AvText type="caption" style={styles.totalCostSubtitle}>
                    Including all equipment
                  </AvText>
                </View>
                <AvText type="title_6" style={styles.totalCostValue}>
                  ₹{totalEquipmentCost}
                </AvText>
              </View>
            </View>
          ) : (
            <AvText type="caption" style={styles.noEquipmentText}>
              No additional equipment selected
            </AvText>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <AvButton
            mode="contained"
            style={styles.backButton}
            contentStyle={styles.buttonContent}
            onPress={onBack}
          >
            <AvText type="buttonText" style={styles.backButtonText}>
              Back
            </AvText>
          </AvButton>
          <AvButton
            mode="contained"
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            <AvText type="buttonText" style={styles.submitButtonText}>
              Submit Booking
            </AvText>
          </AvButton>
          <AvButton
            mode="contained"
            style={styles.payButton}
            contentStyle={styles.buttonContent}
            onPress={() => {
              navigation.navigate(PAGES.PAYMENT_SCREEN, {
                amount: totalEquipmentCost + 800,
                currency: '₹',
                merchantName: 'AV Swasthya',
              });
            }}
          >
            <AvText type="buttonText">Pay Now ₹{totalEquipmentCost + 800}</AvText>
          </AvButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.BG_OFF_WHITE,
    flex: 1,
    padding: normalize(16),
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    paddingHorizontal: normalize(8),
  },
  stepText: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    fontWeight: '500',
  },
  stepTextActive: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
    marginRight: normalize(10),
  },
  card: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(12),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  headerText: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: COLORS.WHITE,
    marginLeft: normalize(6),
  },
  subText: {
    fontSize: normalize(12),
    color: COLORS.WHITE,
    opacity: 0.7,
    marginBottom: normalize(12),
  },
  nearbyButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    marginTop: normalize(8),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(8),
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: '600',
    marginLeft: normalize(6),
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: normalize(12),
  },
  stepNumberContainer: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: normalize(12),
  },
  stepLineActive: {
    width: '80%',
    height: normalize(2),
    backgroundColor: ACCENT_COLOR,
  },
  confirmationCard: {
    backgroundColor: ACCENT_COLOR,
    padding: normalize(16),
    borderRadius: normalize(10),
    marginBottom: normalize(16),
  },
  confirmationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  confirmationTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: normalize(8),
  },
  confirmationSubtitle: {
    fontSize: normalize(12),
    color: COLORS.WHITE,
    opacity: 0.7,
    marginLeft: normalize(28),
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    padding: normalize(16),
    borderRadius: normalize(10),
    marginBottom: normalize(16),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(3),
    elevation: normalize(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginLeft: normalize(8),
    color: COLORS.PRIMARY_TXT,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(4),
  },
  label: {
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
    fontSize: normalize(14),
  },
  value: {
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
    fontSize: normalize(14),
  },
  confirmedStatus: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
  },
  noEquipmentText: {
    color: COLORS.GREY,
    fontStyle: 'italic',
    marginTop: normalize(5),
    fontSize: normalize(14),
  },
  equipmentSelector: {
    marginBottom: normalize(15),
  },
  equipmentList: {
    marginTop: normalize(10),
  },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  equipmentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentLabel: {
    marginLeft: normalize(10),
    fontSize: normalize(15),
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
  },
  equipmentPrice: {
    fontSize: normalize(14),
    color: COLORS.PRIMARY_TXT,
    fontWeight: '500',
  },
  divider: {
    height: normalize(1),
    backgroundColor: COLORS.LIGHT_GREY,
    marginVertical: normalize(10),
  },
  totalCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCostLabel: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  totalCostSubtitle: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  totalCostValue: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: normalize(20),
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(20),
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    marginBottom: normalize(10),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
  },
  submitButton: {
    backgroundColor: ACCENT_COLOR,
    marginBottom: normalize(10),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
  },
  payButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
  },
});

export default BookingConfirmationScreen;
