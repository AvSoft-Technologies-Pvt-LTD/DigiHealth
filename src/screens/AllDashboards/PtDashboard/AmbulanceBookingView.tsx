

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, PixelRatio, TextInput, Modal } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AvButton from '../../../elements/AvButton';
import { AvSelect } from '../../../elements/AvSelect';
import AvText from '../../../elements/AvText';
import { COLORS } from '../../../constants/colors';
import { Typography } from '../../../constants/fonts';

// Types
type EquipmentItem = {
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
type AvCustomMultiSelectProps = {
  placeholder: string;
  value: string[];
  onSelect: (value: string[]) => void;
  data: EquipmentItem[];
};
type BookingConfirmationScreenProps = {
  onBack: () => void;
  bookingDetails: BookingDetails;
};

// Mock Data
const pickupLocationData = [
  { label: "Dharwad Hubballi", value: "dharwad_hubballi" },
  { label: "Bangalore City", value: "bangalore_city" }
];
const hospitalData = [
  { label: "City General Hospital", value: "city_general_hospital" },
  { label: "St. Mary's Clinic", value: "st_marys_clinic" }
];
const ambulanceTypeData = [
  { label: "ICU Ambulance", value: "icu_ambulance" },
  { label: "ALS Ambulance", value: "als_ambulance" }
];
const categoryData = [
  { label: "Cardiology", value: "cardiology" },
  { label: "Emergency", value: "emergency" }
];
const equipmentData: EquipmentItem[] = [
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

// Enhanced Multi-Select Component with Icons, Prices, Scrollable Dropdown, and Search
const AvCustomMultiSelect: React.FC<AvCustomMultiSelectProps> = ({ placeholder, value, onSelect, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchQuery("");
  };

  const handleSelect = (item: EquipmentItem) => {
    const newSelectedItems = selectedItems.includes(item.value)
      ? selectedItems.filter((val: string) => val !== item.value)
      : [...selectedItems, item.value];
    setSelectedItems(newSelectedItems);
    onSelect(newSelectedItems);
  };

  const getEquipmentIcon = (label: string) => {
    switch (label) {
      case "Oxygen Cylinder": return <MCI name="oxygen" size={16} color={COLORS.SECONDARY} />;
      case "Stretcher": return <MCI name="bed" size={16} color={COLORS.SECONDARY} />;
      case "First Aid Kit": return <MCI name="first-aid" size={16} color={COLORS.SECONDARY} />;
      case "Ventilator": return <MCI name="fan" size={16} color={COLORS.SECONDARY} />;
      case "Defibrillator": return <MCI name="heart-pulse" size={16} color={COLORS.SECONDARY} />;
      case "ECG Monitor": return <MCI name="heart" size={16} color={COLORS.SECONDARY} />;
      case "Suction Machine": return <MCI name="vacuum" size={16} color={COLORS.SECONDARY} />;
      case "Spinal Board": return <MCI name="bed-empty" size={16} color={COLORS.SECONDARY} />;
      default: return null;
    }
  };

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.customDropdownContainer}>
      <TouchableOpacity style={styles.inputBox} onPress={handleToggle}>
        <AvText type="body" style={[styles.dropdownText, selectedItems.length === 0 && styles.placeholderText]}>
          {selectedItems.length > 0
            ? selectedItems.map(val => data.find(item => item.value === val)?.label).join(", ")
            : placeholder}
        </AvText>
        <Icon
          name="keyboard-arrow-down"
          size={20}
          color={COLORS.GREY}
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {/* Modal for dropdown to appear above everything */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.searchBarContainer}>
              <Icon name="search" size={20} color={COLORS.GREY} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search equipment..."
                placeholderTextColor={COLORS.GREY}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            <ScrollView
              style={styles.dropdownOptions}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredData.length > 0 ? (
                filteredData.map((item: EquipmentItem, index: number) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      styles.dropdownItemMulti,
                      index === filteredData.length - 1 ? styles.lastItem : {}
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    {selectedItems.includes(item.value) ? (
                      <Icon name="check-box" size={18} color={COLORS.SECONDARY} />
                    ) : (
                      <Icon name="check-box-outline-blank" size={18} color={COLORS.LIGHT_GREY} />
                    )}
                    <View style={styles.equipmentInfo}>
                      {getEquipmentIcon(item.label)}
                      <AvText type="body" style={styles.dropdownItemText}>{item.label}</AvText>
                    </View>
                    <AvText type="body" style={styles.equipmentPrice}>₹{item.price}</AvText>
                  </TouchableOpacity>
                ))
              ) : (
                <AvText type="caption" style={styles.noResultsText}>No equipment found</AvText>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Booking Confirmation Screen
const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({ onBack, bookingDetails }) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(bookingDetails.equipment);
  const totalEquipmentCost = useMemo(() => {
    return selectedEquipment.reduce((sum: number, current: string) => {
      const equipment = equipmentData.find(e => e.value === current);
      return sum + (equipment?.price || 0);
    }, 0);
  }, [selectedEquipment]);
  const getIconComponent = (itemValue: string) => {
    const item = equipmentData.find(e => e.value === itemValue);
    switch (item?.label) {
      case "Oxygen Cylinder": return <MCI name="oxygen" size={20} color={COLORS.OCEAN_BLUE} />;
      case "Stretcher": return <MCI name="bed" size={20} color={COLORS.OCEAN_BLUE} />;
      case "First Aid Kit": return <MCI name="first-aid" size={20} color={COLORS.OCEAN_BLUE} />;
      case "Ventilator": return <MCI name="fan" size={20} color={COLORS.OCEAN_BLUE} />;
      case "Defibrillator": return <MCI name="heart-pulse" size={20} color={COLORS.OCEAN_BLUE} />;
      case "ECG Monitor": return <MCI name="heart" size={20} color={COLORS.OCEAN_BLUE} />;
      case "Suction Machine": return <MCI name="vacuum" size={20} color={COLORS.OCEAN_BLUE} />;
      case "Spinal Board": return <MCI name="bed-empty" size={20} color={COLORS.OCEAN_BLUE} />;
      default: return null;
    }
  };
  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={onBack}>
            <Icon name="chevron-left" size={24} color={COLORS.GREY} />
          </TouchableOpacity>
          <AvText type="Subtitle_1" style={[styles.stepText, styles.stepTextActive]}>Details</AvText>
          <AvText type="Subtitle_1" style={styles.stepText}>Confirm</AvText>
        </View>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MCI name="ambulance" size={20} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.headerText}>Ambulance Booking</AvText>
          </View>
          <AvText type="description" style={styles.subText}>Book an ambulance from AV Swasthya's trusted network</AvText>
          <AvButton
            mode="contained"
            style={styles.nearbyButton}
            contentStyle={styles.buttonContent}
            onPress={() => {}}
          >
            <Icon name="location-pin" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>Near By Ambulance</AvText>
          </AvButton>
        </View>
        <View style={styles.stepRow}>
          <View style={[styles.stepNumberContainer, { backgroundColor: ACCENT_COLOR }]}>
            <AvText type="heading_7" style={styles.stepNumberText}>1</AvText>
          </View>
          <View style={styles.stepLineActive} />
          <View style={styles.stepNumberContainer}>
            <AvText type="heading_7" style={styles.stepNumberText}>2</AvText>
          </View>
        </View>
        <View style={styles.confirmationCard}>
          <View style={styles.confirmationCardHeader}>
            <Icon name="check-circle" size={20} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.confirmationTitle}>Booking Confirmation</AvText>
          </View>
          <AvText type="caption" style={styles.confirmationSubtitle}>Please review your booking details below</AvText>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="description" size={20} color={COLORS.ERROR} />
            <AvText type="title_6" style={styles.sectionTitle}>Service Details</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Ambulance Type:</AvText>
            <AvText type="body" style={styles.value}>{bookingDetails.ambulanceType}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Category:</AvText>
            <AvText type="body" style={styles.value}>{bookingDetails.category}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Pickup Location:</AvText>
            <AvText type="body" style={styles.value}>{bookingDetails.pickupLocation}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Hospital Location:</AvText>
            <AvText type="body" style={styles.value}>{bookingDetails.hospital}</AvText>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar-today" size={20} color={COLORS.BRIGHT_ORANGE} />
            <AvText type="title_6" style={styles.sectionTitle}>Schedule & Location</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Booking Date:</AvText>
            <AvText type="body" style={styles.value}>{bookingDetails.date.toLocaleDateString()}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Day:</AvText>
            <AvText type="body" style={styles.value}>
              {bookingDetails.date.toLocaleDateString('en-US', { weekday: 'long' })}
            </AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText type="body" style={styles.label}>Status:</AvText>
            <AvText type="body" style={[styles.value, styles.confirmedStatus]}>Confirmed</AvText>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="inventory-2" size={20} color={COLORS.OCEAN_BLUE} />
            <AvText type="title_6" style={styles.sectionTitle}>Equipment & Billing</AvText>
          </View>
          {selectedEquipment.length > 0 ? (
            <View style={styles.equipmentList}>
              {selectedEquipment.map((itemValue: string) => {
                const item = equipmentData.find(e => e.value === itemValue);
                return item ? (
                  <View key={item.value} style={styles.equipmentItem}>
                    <View style={styles.equipmentItemLeft}>
                      {getIconComponent(item.value)}
                      <AvText type="body" style={styles.equipmentLabel}>{item.label}</AvText>
                    </View>
                    <AvText type="body" style={styles.equipmentPrice}>₹{item.price}</AvText>
                  </View>
                ) : null;
              })}
              <View style={styles.divider} />
              <View style={styles.totalCostRow}>
                <View>
                  <AvText type="title_6" style={styles.totalCostLabel}>Total Equipment Cost:</AvText>
                  <AvText type="caption" style={styles.totalCostSubtitle}>Including all equipment</AvText>
                </View>
                <AvText type="title_6" style={styles.totalCostValue}>₹{totalEquipmentCost}</AvText>
              </View>
            </View>
          ) : (
            <AvText type="caption" style={styles.noEquipmentText}>No additional equipment selected</AvText>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <AvButton
            mode="contained"
            style={styles.backButton}
            contentStyle={styles.buttonContent}
            onPress={onBack}
          >
            <AvText type="buttonText" style={styles.backButtonText}>Back</AvText>
          </AvButton>
          <AvButton
            mode="contained"
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            <AvText type="buttonText" style={styles.submitButtonText}>Submit Booking</AvText>
          </AvButton>
          <AvButton
            mode="contained"
            style={styles.payButton}
            contentStyle={styles.buttonContent}
          >
            <AvText type="buttonText">Pay Now ₹{totalEquipmentCost + 800}</AvText>
          </AvButton>
        </View>
      </ScrollView>
    </View>
  );
};

// Main Component
const AmbulanceBookingView: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<string>("dharwad_hubballi");
  const [hospital, setHospital] = useState<string>("");
  const [ambulanceType, setAmbulanceType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isFormFilled = pickupLocation && hospital && ambulanceType && category;
  const handleAmbulanceSelect = (value: string) => {
    setAmbulanceType(value);
    setCategory("");
    setEquipment([]);
  };
  const handleCategorySelect = (value: string) => setCategory(value);
  const handleEquipmentSelect = (value: string[]) => setEquipment(value);
  const handleDateChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => setShowDatePicker(true);
  const handleNext = () => setShowConfirmation(true);
  const handleBack = () => setShowConfirmation(false);
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
      />
    );
  }
  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <MCI name="ambulance" size={20} color={COLORS.WHITE} />
            <AvText type="title_6" style={styles.headerText}>Ambulance Booking</AvText>
          </View>
          <AvText type="description" style={styles.subText}>Book an ambulance from AV Swasthya's trusted network</AvText>
          <AvButton
            mode="contained"
            style={styles.nearbyButton}
            contentStyle={styles.buttonContent}
            onPress={() => {}}
          >
            <Icon name="location-pin" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>Near By Ambulance</AvText>
          </AvButton>
        </View>
        <View>
          <View style={styles.stepRow}>
            <View style={[styles.stepNumberContainer, { backgroundColor: ACCENT_COLOR }]}>
              <AvText type="heading_7" style={styles.stepNumberText}>1</AvText>
            </View>
            <View style={styles.stepLineActive} />
            <View style={styles.stepNumberContainer}>
              <AvText type="heading_7" style={styles.stepNumberText}>2</AvText>
            </View>
          </View>
          <View style={styles.stepLabelsRow}>
            <AvText type="Subtitle_1" style={[styles.stepLabel, { color: ACCENT_COLOR }]}>Details</AvText>
            <AvText type="Subtitle_1" style={styles.stepLabel}>Confirm</AvText>
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
          <TouchableOpacity style={styles.inputBox} onPress={showDatepicker}>
            <AvText type="body" style={styles.dropdownText}>
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
            style={[styles.nextButton, !isFormFilled && styles.disabledButton]}
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

// Styles
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollContainer: {
    padding: 12,
  },
  card: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
  customDropdownContainer: {
    width: "100%",
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: '90%',
    maxHeight: 300,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 10,
    elevation: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.PRIMARY_TXT,
    paddingVertical: 4,
  },
  dropdownOptions: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  dropdownItemMulti: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
    marginLeft: 8,
  },
  equipmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  equipmentPrice: {
    fontSize: 14,
    color: COLORS.PRIMARY_TXT,
    fontWeight: "500",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.WHITE,
    marginLeft: 6,
  },
  subText: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.7,
    marginBottom: 12,
  },
  nearbyButton: {
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: COLORS.WHITE,
    fontWeight: "700",
    fontSize: 12,
  },
  stepLineActive: {
    width: '80%',
    height: 2,
    backgroundColor: ACCENT_COLOR,
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '12%',
    marginBottom: 20,
  },
  stepLabel: {
    fontSize: 12,
    marginTop: 4,
    color: COLORS.GREY,
  },
  nextButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 8,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: COLORS.SECONDARY,
  },
  nextButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextButtonText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontWeight: "600",
    marginRight: 6,
  },
  disabledButton: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  screenContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.BG_OFF_WHITE,
    flex: 1,
    padding: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.GREY,
    fontWeight: '500',
  },
  stepTextActive: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
    marginRight: 10,
  },
  confirmationCard: {
    backgroundColor: ACCENT_COLOR,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  confirmationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: 8,
  },
  confirmationSubtitle: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.7,
    marginLeft: 28,
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: COLORS.PRIMARY_TXT,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
    fontSize: 14,
  },
  value: {
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
    fontSize: 14,
  },
  confirmedStatus: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
  },
  noEquipmentText: {
    color: COLORS.GREY,
    fontStyle: 'italic',
    marginTop: 5,
    fontSize: 14,
  },
  noResultsText: {
    padding: 12,
    textAlign: 'center',
    color: COLORS.GREY,
    fontStyle: 'italic',
  },
  equipmentList: {
    marginTop: 10,
  },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  equipmentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipmentLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY,
    marginVertical: 10,
  },
  totalCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  totalCostSubtitle: {
    fontSize: 12,
    color: COLORS.GREY,
  },
  totalCostValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 20,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: ACCENT_COLOR,
    marginBottom: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
  },
  payButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default AmbulanceBookingView;