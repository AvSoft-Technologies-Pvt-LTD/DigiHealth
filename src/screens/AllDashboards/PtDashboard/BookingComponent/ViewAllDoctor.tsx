import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import AvCard from "../../../../elements/AvCards";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";
import { SearchFilterBar } from "../../../../components/CommonComponents/SearchFilter";
import { PAGES } from "../../../../constants/pages";
import BookingModal from "./BookingModal";
import { Doctor } from "../../../../constants/data";

const ViewAllDoctor = () => {
  const { filteredDoctors, loading, error } = useAppSelector((state) => state.doctor);
  const dispatch = useAppDispatch();

  // State for search and filters
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // State for booking modal
  const [isBookingModalVisible, setIsBookingModalVisible] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Example filter options
  const filterOptions = [
    { id: "physical", displayName: "Physical Consultation" },
    { id: "virtual", displayName: "Virtual Consultation" },
    { id: "hospitalAffiliated", displayName: "Hospital Affiliated" },
    { id: "consultant", displayName: "Consultant Doctor" },
  ];

  // Handle search and filter logic
  useEffect(() => {
    // You can dispatch an action here to filter doctors based on searchValue and selectedFilters
    // For example:
    // dispatch(filterDoctors({ searchValue, filters: selectedFilters }));
  }, [searchValue, selectedFilters]);

  const handleBookPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalVisible(true);
  };

  const handleDateSelect = (event: Event, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    // Handle the booking logic here, such as making an API call or updating the Redux store
    console.log("Booking confirmed for:", selectedDoctor?.name, "on", selectedDate, "at", selectedTime);
    setIsBookingModalVisible(false);
  };

  const getTimesForDate = (date: Date | null): Array<{ time: string; isBooked: boolean }> => {
    // Implement logic to get available time slots for the selected date
    if (!date) return [];
    return [
      { time: "10:00 AM", isBooked: false },
      { time: "11:00 AM", isBooked: true },
      { time: "12:00 PM", isBooked: false },
    ];
  };

  // Render loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AvText style={styles.errorText}>{error}</AvText>
      </View>
    );
  }

  // Render the list of doctors using AvCard
  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search doctors..."
        filterOptions={filterOptions}
        onFiltersApplied={setSelectedFilters}
        filterModalTitle="Filter Doctors"
        applyButtonText="Apply"
        resetButtonText="Reset"
      />

      {/* Doctor List */}
      <FlatList<Doctor>
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item: doctor }) => (
          <AvCard
            title={doctor.name}
            cardStyle={styles.doctorCard}
          >
            <View style={styles.doctorHeader}>
              <Image
                source={{ uri: doctor.image }}
                style={styles.doctorProfileImage}
                resizeMode="cover"
              />
              <View style={styles.doctorNameContainer}>
                <AvText style={styles.doctorName}>{doctor.name}</AvText>
                <AvText style={styles.doctorSpecialty}>{doctor.specialty}</AvText>
              </View>
            </View>
            <View style={styles.doctorInfo}>
              {doctor.hospital && <AvText style={styles.doctorHospital}>{doctor.hospital}</AvText>}
              <View style={styles.doctorDetailsRow}>
                <AvText style={styles.doctorFees}>₹{doctor.fees}</AvText>
                <AvButton
                  mode="outlined"
                  onPress={() => handleBookPress(doctor)}
                  style={styles.smallBookButton}
                >
                  Book
                </AvButton>
              </View>
            </View>
          </AvCard>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AvText style={styles.emptyText}>No doctors found.</AvText>
          </View>
        }
        contentContainerStyle={styles.doctorList}
      />

      {/* Booking Modal */}
      <BookingModal
        isVisible={isBookingModalVisible}
        onClose={() => setIsBookingModalVisible(false)}
        selectedDoctor={selectedDoctor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        showDatePicker={showDatePicker}
        onDateSelect={handleDateSelect}
        onTimeSelect={handleTimeSelect}
        onConfirmBooking={handleConfirmBooking}
        getTimesForDate={getTimesForDate}
        setShowDatePicker={setShowDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GREY,
  },
  doctorList: {
    paddingBottom: normalize(16),
  },
  doctorCard: {
    marginBottom: normalize(16),
    width: "100%",
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(8),
    paddingTop: normalize(8),
  },
  doctorProfileImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(12),
  },
  doctorNameContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  doctorSpecialty: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  doctorInfo: {
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(8),
  },
  doctorDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: normalize(8),
  },
  doctorHospital: {
    color: COLORS.SECONDARY,
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  doctorFees: {
    color: COLORS.SECONDARY,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  smallBookButton: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    minWidth: normalize(60),
  },
});

export default ViewAllDoctor;
