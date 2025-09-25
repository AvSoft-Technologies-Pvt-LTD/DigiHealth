import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, ViewStyle, TextStyle } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AvButton from '../../../../elements/AvButton';
import { AvSelect } from '../../../../elements/AvSelect';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import AvCustomMultiSelect from './AvCustomMultiSelect';
import BookingConfirmationScreen from './BookingConfirmationScreen';
import {
  SelectItem,
  EquipmentItem,
  pickupLocationData,
  hospitalData,
  ambulanceTypeData,
  categoryData,
  equipmentData
} from '../../../../constants/data';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { PAGES } from '../../../../constants/pages';

const ACCENT_COLOR = COLORS.SECONDARY;

interface BookingDetails {
  pickupLocation: string;
  hospital: string;
  ambulanceType: string;
  category: string;
  equipment: string[];
  date: Date;
}

const AmbulanceBookingView: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [pickupLocation, setPickupLocation] = useState<string>("dharwad_hubballi");
  const [hospital, setHospital] = useState<string>("");
  const [ambulanceType, setAmbulanceType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const isFormFilled: boolean = Boolean(pickupLocation && hospital && ambulanceType && category);

  const navigation = useNavigation();

  const handleAmbulanceSelect = (value: string): void => {
    setAmbulanceType(value);
    setCategory("");
    setEquipment([]);
  };

  const handleCategorySelect = (value: string): void => setCategory(value);
  const handleEquipmentSelect = (value: string[]): void => setEquipment(value);
  const handleUpdateEquipment = (newEquipment: string[]): void => setEquipment(newEquipment);

  const handleDateChange = (event: Event, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = (): void => setShowDatePicker(true);
  const handleNext = (): void => setShowConfirmation(true);
  const handleBack = (): void => setShowConfirmation(false);

  if (showConfirmation) {
    return (
      <BookingConfirmationScreen
        onBack={handleBack}
        bookingDetails={{
          pickupLocation: pickupLocationData.find(item => item.value === pickupLocation)?.label || "",
          hospital: hospitalData.find(item => item.value === hospital)?.label || "",
          ambulanceType: ambulanceTypeData.find(item => item.value === ambulanceType)?.label || "",
          category: categoryData.find(item => item.value === category)?.label || "",
          equipment,
          date
        }}
        onUpdateEquipment={handleUpdateEquipment}
      />
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MCI name="ambulance" size={normalize(20)} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.headerText}>Ambulance Booking</AvText>
          </View>
          <AvText type="description" style={styles.subText}>Book an ambulance from AV Swasthya's trusted network</AvText>
          <AvButton
            mode="contained"
            style={styles.nearbyButton}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate(PAGES.SEARCH_AMBULANCE_VIEW)}
          >
            <Icon name="location-pin" size={normalize(16)} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>Near By Ambulance</AvText>
          </AvButton>
        </View>

        <View style={styles.formCard}>
          <View style={styles.stepRow}>
            <View style={[styles.stepNumberContainer, { backgroundColor: ACCENT_COLOR }]}>
              <AvText type="heading_7" style={styles.stepNumberText}>1</AvText>
            </View>
            <View style={styles.stepLineActive} />
            <View style={styles.stepNumberContainer}>
              <AvText type="heading_7" style={styles.stepNumberText}>2</AvText>
            </View>
          </View>

        

          <AvSelect
            items={pickupLocationData}
            selectedValue={pickupLocation}
            onValueChange={setPickupLocation}
            placeholder="Search pickup location..."
            label="Pickup Location"
            required
          />

          <AvSelect
            items={hospitalData}
            selectedValue={hospital}
            onValueChange={setHospital}
            placeholder="Search hospital..."
            label="Hospital"
            required
          />

          <AvSelect
            items={ambulanceTypeData}
            selectedValue={ambulanceType}
            onValueChange={handleAmbulanceSelect}
            placeholder="Search ambulance type"
            label="Ambulance Type"
            required
          />

          <AvSelect
            items={categoryData}
            selectedValue={category}
            onValueChange={handleCategorySelect}
            placeholder="Search category"
            label="Category"
            required
          />

          <AvCustomMultiSelect
            placeholder="Add equipment"
            value={equipment}
            onSelect={handleEquipmentSelect}
            data={equipmentData}
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={showDatepicker}
          >
            <AvText type="body" style={styles.dateText}>
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </AvText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <AvButton
            mode="contained"
            style={isFormFilled ? styles.nextButton : styles.disabledButton}
            contentStyle={styles.buttonContent}
            onPress={handleNext}
            disabled={!isFormFilled}
          >
            <AvText type="buttonText" style={styles.nextButtonText}>Next</AvText>
          </AvButton>
        </View>
      </ScrollView>
    </View>
  );
};

interface Styles {
  outerContainer: ViewStyle;
  scrollContainer: ViewStyle;
  card: ViewStyle;
  formCard: ViewStyle;
  dateButton: ViewStyle;
  dateText: TextStyle;
  placeholderText: TextStyle;
  disabled: ViewStyle;
  headerRow: ViewStyle;
  headerText: TextStyle;
  subText: TextStyle;
  nearbyButton: ViewStyle;
  buttonContent: ViewStyle;
  buttonText: TextStyle;
  stepRow: ViewStyle;
  stepNumberContainer: ViewStyle;
  stepLineActive: ViewStyle;
  stepLabelsRow: ViewStyle;
  stepLabel: TextStyle;
  stepNumberText: TextStyle;
  nextButton: ViewStyle;
  nextButtonContent: ViewStyle;
  nextButtonText: TextStyle;
  disabledButton: ViewStyle;
}

const styles: Styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollContainer: {
    padding: normalize(12),
  },
  card: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(12),
    width: '100%',
  },
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(16),
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    width: '100%',
  },
  dateButton: {
    borderColor: COLORS.GREY,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    marginBottom: normalize(10),
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
  disabled: {
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(4),
  },
  headerText: {
    fontSize: normalize(15),
    fontWeight: "600",
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
    width: normalize(290),
    alignSelf: 'flex-start',
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalize(8),
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: "600",
    marginLeft: normalize(6),
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: normalize(12),
    width: '100%',
  },
  stepNumberContainer: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLineActive: {
    width: '80%',
    height: normalize(2),
    backgroundColor: ACCENT_COLOR,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '12%',
    marginBottom: normalize(20),
    width: '100%',
  },
  stepLabel: {
    fontSize: normalize(12),
    marginTop: normalize(4),
    color: COLORS.GREY,
  },
  stepNumberText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  nextButton: {
    borderRadius: normalize(8),
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(4),
    marginTop: normalize(20),
    alignSelf: "flex-end",
    backgroundColor: COLORS.SECONDARY,
    minWidth: normalize(100),
  },
  nextButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(15),
    fontWeight: "600",
    marginRight: normalize(6),
  },
  disabledButton: {
    backgroundColor: COLORS.LIGHT_GREY,
    paddingHorizontal: normalize(24),
    borderRadius: normalize(8),
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(4),
    marginTop: normalize(20),
    alignSelf: "flex-end",
    minWidth: normalize(100),
  },
});

export default AmbulanceBookingView;
