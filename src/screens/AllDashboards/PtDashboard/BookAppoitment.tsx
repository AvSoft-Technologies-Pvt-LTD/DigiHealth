


import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import axios from "axios";
import AvText from "../../../elements/AvText";
import AvButton from "../../../elements/AvButton";
import AvTextInput from "../../../elements/AvTextInput";
import { AvSelect } from "../../../elements/AvSelect";
import { normalize } from "../../../constants/platform";
import { COLORS } from "../../../constants/colors";
import { debounce } from "lodash";
import AvCard from "../../../elements/AvCards";
import AvModal from "../../../elements/AvModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setFilteredDoctors, setLoading, setError } from "../../../store/slices/doctorSlice";
import AvImage from "../../../elements/AvImage";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fees: number;
  location?: string;
  doctorType?: string;
  consultationType?: string;
  hospital?: string;
  image?: string;
  qualification?: string;
  experience?: number;
  availability?: Array<{
    date: string;
    slots: Array<{
      time: string;
      isBooked: boolean;
    }>;
  }>;
}

interface PostOffice {
  Name: string;
  District: string;
  State: string;
}

interface PincodeApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

// Mock data for cities by state
const CITIES_BY_STATE: Record<string, { label: string; value: string }[]> = {
  Maharashtra: [
    { label: "Mumbai", value: "Mumbai" },
    { label: "Pune", value: "Pune" },
    { label: "Nagpur", value: "Nagpur" },
    { label: "Thane", value: "Thane" },
  ],
  Delhi: [
    { label: "New Delhi", value: "New Delhi" },
    { label: "South Delhi", value: "South Delhi" },
    { label: "East Delhi", value: "East Delhi" },
  ],
  Karnataka: [
    { label: "Bangalore", value: "Bangalore" },
    { label: "Mysore", value: "Mysore" },
    { label: "Hubli", value: "Hubli" },
    { label: "Dharwad", value: "Dharwad" },
  ],
  Telangana: [
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Warangal", value: "Warangal" },
  ],
  Gujarat: [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Surat", value: "Surat" },
  ],
};

const INDIAN_STATES = [
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Delhi", value: "Delhi" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Telangana", value: "Telangana" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "West Bengal", value: "West Bengal" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Punjab", value: "Punjab" },
  { label: "Haryana", value: "Haryana" },
  { label: "Bihar", value: "Bihar" },
  { label: "Odisha", value: "Odisha" },
  { label: "Kerala", value: "Kerala" },
  { label: "Assam", value: "Assam" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
  { label: "Goa", value: "Goa" },
  { label: "Tripura", value: "Tripura" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Manipur", value: "Manipur" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "Andaman and Nicobar Islands", value: "Andaman and Nicobar Islands" },
  { label: "Chandigarh", value: "Chandigarh" },
  { label: "Dadra and Nagar Haveli", value: "Dadra and Nagar Haveli" },
  { label: "Daman and Diu", value: "Daman and Diu" },
  { label: "Lakshadweep", value: "Lakshadweep" },
  { label: "Puducherry", value: "Puducherry" },
];

const HOSPITALS = [
  { label: "Apollo Hospitals", value: "Apollo Hospitals" },
  { label: "Fortis Healthcare", value: "Fortis Healthcare" },
  { label: "Max Healthcare", value: "Max Healthcare" },
  { label: "Manipal Hospitals", value: "Manipal Hospitals" },
  { label: "Kokilaben Dhirubhai Ambani Hospital", value: "Kokilaben Dhirubhai Ambani Hospital" },
  { label: "KLE Hospital", value: "KLE Hospital" },
  { label: "SDM Medical College", value: "SDM Medical College" },
  { label: "Karnataka Institute of Medical Sciences", value: "Karnataka Institute of Medical Sciences" },
  { label: "City Hospital", value: "City Hospital" },
  { label: "District Hospital", value: "District Hospital" },
  { label: "Apollo Clinic", value: "Apollo Clinic" },
];

const DOCTOR_PANEL_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Hospital Affiliated", value: "Hospital Affiliated" },
  { label: "Consultant Doctor", value: "Consultant Doctor" },
  { label: "Our Medical Expert", value: "Our Medical Expert" },
];

const symptomSpecialtyMap: Record<string, string[]> = {
  fever: ["General Physician", "Pediatrics", "Pathology", "Psychiatry", "Oncology"],
  cough: ["General Physician", "Pulmonology", "ENT", "Oncology", "Pathology"],
  chestpain: ["Cardiology", "Pulmonology", "Gastroenterology", "General Medicine", "Orthopedics"],
  acne: ["Dermatology", "Endocrinology", "Psychiatry", "Pathology"],
  skinrash: ["Dermatology", "Pediatrics", "Pathology", "Oncology"],
  headache: ["Neurology", "General Medicine", "Psychiatry", "ENT"],
  stomachache: ["Gastroenterology", "General Medicine", "Pediatrics", "Endocrinology"],
  toothache: ["Dentistry", "Pediatrics", "General Medicine"],
  pregnancy: ["Gynecology", "Pediatrics", "Nephrology"],
  anxiety: ["Psychiatry", "Endocrinology", "General Medicine"],
  bloodinurine: ["Nephrology", "Hematology", "Urology"],
  fatigue: ["General Medicine", "Endocrinology", "Oncology", "Psychiatry"],
  jointpain: ["Orthopedics", "General Medicine", "Endocrinology"],
};

const BookAppointmentComponent: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { filteredDoctors, loading, error } = useAppSelector((state) => state.doctor);

  const [consultationType, setConsultationType] = useState<"Physical" | "Virtual">("Physical");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState(INDIAN_STATES[0].value);
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [doctorPanel, setDoctorPanel] = useState<"All" | "Hospital Affiliated" | "Consultant Doctor" | "Our Medical Expert">("All");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedSpecialties, setSuggestedSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationOptions, setLocationOptions] = useState<PostOffice[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString() : "Select Date";
  };

  const mapSymptomsToSpecialization = (symptoms: string): string[] => {
    const lowerSymptoms = symptoms.toLowerCase().replace(/\s/g, "");
    return symptomSpecialtyMap[lowerSymptoms] || [];
  };

  const fetchLocationByPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get<PincodeApiResponse[]>(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0]?.PostOffice && response.data[0].PostOffice.length > 0) {
        if (response.data[0].PostOffice.length > 1) {
          setShowLocationPicker(true);
          setLocationOptions(response.data[0].PostOffice);
        } else {
          const postOffice = response.data[0].PostOffice[0];
          setState(postOffice.State || INDIAN_STATES[0].value);
          setCity(postOffice.District || postOffice.Name || "");
        }
      } else {
        dispatch(setError("Pincode not found"));
      }
    } catch (error) {
      dispatch(setError("Error fetching location data"));
      console.error("API Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchFilteredDoctors = async () => {
    if (!selectedSpecialty) {
      dispatch(setError("Please select a specialty"));
      return;
    }
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await axios.get("https://mocki.io/v1/3c5e1986-ce11-405c-9356-5cd3e7f038a8");
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data format from API");
      }
      let filteredData = response.data.map((doc: any) => ({
        id: doc.id?.toString() || Math.random().toString(36).substring(7),
        name: doc.name || "Unknown Doctor",
        specialty: doc.specialty || "General Physician",
        fees: doc.fees || 0,
        location: doc.location || "",
        doctorType: doc.doctorType || "Consultant Doctor",
        consultationType: doc.consultationType || "Physical",
        hospital: doc.hospital || "",
        image: doc.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
        qualification: doc.qualification || "",
        experience: doc.experience || 0,
        availability: doc.availability || [],
      }));
      filteredData = filteredData.filter((doc) => {
        const matchesConsultationType = !consultationType || doc.consultationType?.toLowerCase() === consultationType.toLowerCase();
        const matchesSpecialty = doc.specialty?.toLowerCase() === selectedSpecialty?.toLowerCase();
        const docLocation = doc.location?.toLowerCase() || "";
        const userCity = city?.toLowerCase() || "";
        const matchesLocation = consultationType !== "Physical" || !userCity || docLocation.includes(userCity);
        const matchesMinFees = !minFees || doc.fees >= parseInt(minFees);
        const matchesMaxFees = !maxFees || doc.fees <= parseInt(maxFees);
        const matchesHospital = !hospital || doc.hospital?.toLowerCase().includes(hospital.toLowerCase());
        const matchesDoctorPanel = doctorPanel === "All" || doc.doctorType === doctorPanel;
        return (
          matchesConsultationType &&
          matchesSpecialty &&
          matchesLocation &&
          matchesMinFees &&
          matchesMaxFees &&
          matchesHospital &&
          matchesDoctorPanel
        );
      });
      if (filteredData.length > 0) {
        dispatch(setFilteredDoctors(filteredData));
      } else {
        dispatch(setError("No doctors found. Try adjusting your filters."));
        dispatch(setFilteredDoctors([]));
      }
    } catch (error) {
      dispatch(setError("Failed to fetch doctors. Please try again."));
      console.error("API Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const debouncedFetchLocation = debounce(fetchLocationByPincode, 500);
  const debouncedFetchDoctors = debounce(fetchFilteredDoctors, 500);

  useEffect(() => {
    if (pincode.length === 6) {
      debouncedFetchLocation(pincode);
    }
  }, [pincode]);

  useEffect(() => {
    if (symptoms.trim()) {
      const specialties = mapSymptomsToSpecialization(symptoms);
      setSuggestedSpecialties(specialties);
    } else {
      setSuggestedSpecialties([]);
    }
  }, [symptoms]);

  useEffect(() => {
    if (selectedSpecialty) {
      debouncedFetchDoctors();
    }
  }, [consultationType, city, hospital, minFees, maxFees, doctorPanel, selectedSpecialty]);

  const handleBookAppointment = () => {
    console.log({
      consultationType,
      pincode,
      state,
      city,
      hospital,
      symptoms,
      doctorPanel,
      minFees,
      maxFees,
      selectedSpecialty,
    });
  };

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalVisible(true);
  };

  const handleSelectLocation = (postOffice: PostOffice) => {
    setState(postOffice.State || INDIAN_STATES[0].value);
    setCity(postOffice.District || postOffice.Name || "");
    setShowLocationPicker(false);
  };

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSearchQuery(specialty);
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select a doctor, date, and time.");
      return;
    }
    alert(`Appointment booked with ${selectedDoctor.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime}.`);
    setIsBookingModalVisible(false);
  };

  const getTimesForDate = (date: Date | null) => {
    if (!selectedDoctor?.availability || !date) return [];
    const dateString = date.toISOString().split("T")[0];
    const availabilitySlot = selectedDoctor.availability.find(
      (slot) => slot.date === dateString
    );
    return availabilitySlot ? availabilitySlot.slots : [];
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <AvText type="title_1" style={styles.pageTitle}>
        Book an Appointment
      </AvText>

      <View style={styles.container}>
        <AvTextInput
          label="Search Doctors"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />
        <AvText type="title_2" style={styles.label}>
          Consultation Type
        </AvText>
        <View style={styles.row}>
          <AvButton
            mode={consultationType === "Physical" ? "contained" : "outlined"}
            onPress={() => setConsultationType("Physical")}
            style={{
              flex: 1,
              marginRight: normalize(8),
              backgroundColor: consultationType === "Physical" ? COLORS.SECONDARY : "transparent",
              borderColor: COLORS.SECONDARY,
            }}
          >
            Physical
          </AvButton>
          <AvButton
            mode={consultationType === "Virtual" ? "contained" : "outlined"}
            onPress={() => setConsultationType("Virtual")}
            style={{
              flex: 1,
              backgroundColor: consultationType === "Virtual" ? COLORS.SECONDARY : "transparent",
              borderColor: COLORS.SECONDARY,
            }}
          >
            Virtual
          </AvButton>
        </View>
        <AvTextInput
          label="Enter Pincode for Quick Location Detection"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
          style={styles.input}
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />
        {loading && <ActivityIndicator size="small" color={COLORS.SECONDARY} />}
        {error ? <AvText style={{ color: "red" }}>{error}</AvText> : null}
        <AvSelect
          label="Select State"
          items={INDIAN_STATES}
          selectedValue={state}
          onValueChange={setState}
          style={styles.input}
          selectButtonStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.GREY,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          }}
        />
        <AvSelect
          label="Select City"
          items={CITIES_BY_STATE[state] || []}
          selectedValue={city}
          onValueChange={setCity}
          style={styles.input}
          selectButtonStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.GREY,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          }}
        />
        <AvSelect
          label="Select Hospital (Optional)"
          items={HOSPITALS}
          selectedValue={hospital}
          onValueChange={setHospital}
          selectButtonStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.GREY,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          }}
        />
        <AvTextInput
          label="Describe Symptoms"
          value={symptoms}
          onChangeText={setSymptoms}
          style={styles.input}
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />
        {/* Specialty Slider */}
        {suggestedSpecialties.length > 0 && (
          <View style={styles.specialtySliderContainer}>
            <AvText type="title_2" style={styles.label}>
              Select Specialties
            </AvText>
            <FlatList
              data={suggestedSpecialties}
              renderItem={({ item: specialty }) => (
                <TouchableOpacity
                  style={[
                    styles.specialtySliderChip,
                    selectedSpecialty === specialty ? styles.selectedSpecialtySliderChip : null,
                  ]}
                  onPress={() => handleSpecialtySelect(specialty)}
                >
                  <AvText style={selectedSpecialty === specialty ? { color: COLORS.WHITE } : { color: COLORS.BLACK }}>
                    {specialty}
                  </AvText>
                </TouchableOpacity>
              )}
              keyExtractor={(specialty, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.specialtySlider}
            />
          </View>
        )}
        {/* Doctor Panel Slider */}
        <View style={styles.specialtySliderContainer}>
          <AvText type="title_2" style={styles.label}>
            Select Doctor Panel
          </AvText>
          <FlatList
            data={DOCTOR_PANEL_OPTIONS}
            renderItem={({ item: panel }) => (
              <TouchableOpacity
                style={[
                  styles.specialtySliderChip,
                  doctorPanel === panel.value ? styles.selectedSpecialtySliderChip : null,
                ]}
                onPress={() => setDoctorPanel(panel.value as any)}
              >
                <AvText style={doctorPanel === panel.value ? { color: COLORS.WHITE } : { color: COLORS.BLACK }}>
                  {panel.label}
                </AvText>
              </TouchableOpacity>
            )}
            keyExtractor={(panel, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtySlider}
          />
        </View>
        <View style={styles.row}>
          <AvTextInput
            label="Min Fees (₹)"
            value={minFees}
            onChangeText={setMinFees}
            keyboardType="numeric"
            style={[styles.input, { flex: 1, marginRight: normalize(8) }]}
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
          <AvTextInput
            label="Max Fees (₹)"
            value={maxFees}
            onChangeText={setMaxFees}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
        </View>
        <View style={styles.viewButtonContainer}>
          {/* <AvButton
    mode="outlined"
    onPress={() => navigation.navigate('DoctorList')} // Replace 'DoctorList' with your target screen
    labelStyle={{ color: COLORS.SECONDARY }}
    style={styles.viewButton}
  >
    View
  </AvButton> */}
        </View>

        {!selectedSpecialty && <AvText style={{ color: "red", marginTop: normalize(8) }}>Please select a specialty to find doctors.</AvText>}
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.SECONDARY} />
        ) : error ? (
          <AvText style={{ color: "red" }}>{error}</AvText>
        ) : filteredDoctors.length > 0 ? (
          <View style={styles.doctorList}>
            <FlatList
              data={filteredDoctors}
              renderItem={({ item: doctor }) => (
                <AvCard
                  key={doctor.id}
                  cardStyle={styles.doctorCard}
                  onPress={() => handleBookDoctor(doctor)}
                >
                  <View style={styles.doctorHeader}>
                    <AvImage
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
                        onPress={(e) => {
                          e.stopPropagation();
                          handleBookDoctor(doctor);
                        }}
                        style={styles.smallBookButton}
                      >
                        Book
                      </AvButton>
                    </View>
                  </View>
                </AvCard>
              )}
              keyExtractor={(doctor) => doctor.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.doctorSlider}
            />
          </View>
        ) : (
          <AvText style={styles.noDoctors}>
            {city ? "No doctors found matching all your criteria. Try changing your filters." : "Please select your filters to find doctors"}
          </AvText>
        )}
      </View>
      {/* Booking Modal */}
      <AvModal
        isModalVisible={isBookingModalVisible}
        setModalVisible={setIsBookingModalVisible}
        title="Book Appointment"
      >
        {selectedDoctor && (
          <View style={styles.modalContent}>
            {/* Doctor Details Section */}
            <View style={styles.doctorDetailsContainer}>
              <AvImage
                source={{ uri: selectedDoctor?.image as string }}  // selectedDoctor.image could be undefined
                style={styles.modalDoctorImage}
                resizeMode="cover"
              />
              <View style={styles.doctorDetailsText}>
                <AvText style={styles.modalDoctorName}>{selectedDoctor.name}</AvText>
                <AvText style={styles.modalDoctorSpecialty}>{selectedDoctor.specialty}</AvText>
                <AvText style={styles.modalDoctorHospital}>{selectedDoctor.hospital}</AvText>
                <AvText style={styles.modalDoctorFees}>₹{selectedDoctor.fees}</AvText>
              </View>
            </View>

            {/* Date Selection Section */}
            <AvText type="title_3" style={styles.sectionTitle}>
              Select Date
            </AvText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <AvText style={styles.datePickerText}>
                {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
              </AvText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={handleDateSelect}
              />
            )}

            {/* Time Slots Section */}
            {selectedDate && (
              <>
                <AvText type="title_3" style={styles.sectionTitle}>
                  Available Time Slots
                </AvText>
                {getTimesForDate(selectedDate).length > 0 ? (
                  <View style={styles.timeSlotsContainer}>
                    {getTimesForDate(selectedDate).map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          selectedTime === slot.time ? styles.selectedTimeSlot : null,
                          slot.isBooked ? styles.bookedTimeSlot : null,
                        ]}
                        onPress={() => !slot.isBooked && handleTimeSelect(slot.time)}
                        disabled={slot.isBooked}
                      >
                        <AvText style={[
                          styles.timeSlotText,
                          selectedTime === slot.time ? { color: COLORS.WHITE } : { color: COLORS.BLACK },
                          slot.isBooked ? { color: COLORS.LIGHT_GREY } : null,
                        ]}>
                          {slot.time}
                        </AvText>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View style={styles.noSlotsContainer}>
                    <AvText style={styles.noSlotsText}>
                      No slots available for this date. Please select a different date.
                    </AvText>
                  </View>
                )}
              </>
            )}

            {/* Confirm Button Section */}
            <AvButton
              mode="contained"
              onPress={handleConfirmBooking}
              labelStyle={styles.confirmButtonText}
              buttonColor={COLORS.SECONDARY}
              style={styles.confirmButton}
              disabled={!selectedDate || !selectedTime || getTimesForDate(selectedDate).length === 0}
            >
              {getTimesForDate(selectedDate).length === 0
                ? "No Slots Available"
                : !selectedTime
                  ? "Select Time Slot"
                  : "Confirm Booking"}
            </AvButton>
          </View>
        )}
      </AvModal>

      {/* Modals */}
      <Modal visible={showAllSpecialties} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AvText type="title_2" style={styles.modalTitle}>
              All Suggested Specialties
            </AvText>
            {suggestedSpecialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  handleSpecialtySelect(specialty);
                  setShowAllSpecialties(false);
                }}
              >
                <AvText>{specialty}</AvText>
              </TouchableOpacity>
            ))}
            <AvButton
              mode="contained"
              onPress={() => setShowAllSpecialties(false)}
              labelStyle={{ color: COLORS.WHITE }}
              buttonColor={COLORS.SECONDARY}
              style={styles.modalCloseButton}
            >
              Close
            </AvButton>
          </View>
        </View>
      </Modal>
      <Modal visible={showLocationPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AvText type="title_2" style={styles.modalTitle}>
              Select Location
            </AvText>
            <FlatList
              data={locationOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectLocation(item)}>
                  <AvText>
                    {item.Name}, {item.District}, {item.State}
                  </AvText>
                </TouchableOpacity>
              )}
            />
            <AvButton
              mode="contained"
              onPress={() => setShowLocationPicker(false)}
              labelStyle={{ color: COLORS.WHITE }}
              buttonColor={COLORS.SECONDARY}
              style={styles.modalCloseButton}
            >
              Close
            </AvButton>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: normalize(10),
  },
  container: {
    paddingHorizontal: normalize(16),
  },
  label: {
    marginTop: normalize(12),
    marginBottom: normalize(8),
  },
  row: {
    flexDirection: "row",
    marginBottom: normalize(12),
  },
  input: {
    marginBottom: normalize(12),
  },
  specialtySliderContainer: {
    marginVertical: normalize(10),
  },
  specialtySlider: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
  },
  viewButtonContainer: {
    alignItems: 'flex-end', // Aligns the button to the right
    marginVertical: normalize(12),
  },
  viewButton: {
    borderColor: COLORS.SECONDARY,
    paddingHorizontal: normalize(12), // Adjust for button width
    minWidth: normalize(80), // Set a fixed small width
  },

  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(4),
    padding: normalize(12),
    marginBottom: normalize(12),
    minHeight: normalize(50),
    justifyContent: 'center',
  },
  modalContent: {
    padding: normalize(20),
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
  },
  doctorDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
    padding: normalize(12),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(12),
  },
  modalDoctorImage: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    marginRight: normalize(15),
  },
  doctorDetailsText: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: normalize(4),
  },
  modalDoctorSpecialty: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  modalDoctorHospital: {
    fontSize: normalize(12),
    color: COLORS.SECONDARY,
    marginBottom: normalize(4),
  },
  modalDoctorFees: {
    fontSize: normalize(14),
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: normalize(16),
    marginBottom: normalize(12),
    color: COLORS.BLACK,
    fontWeight: '600',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(16),
  },
  datePickerText: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: normalize(16),
    gap: normalize(8),
  },
  timeSlot: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  pageTitle: {
    textAlign: "center",
    marginVertical: normalize(16),
    color: COLORS.PRIMARY, // Change to your preferred color (e.g., COLORS.PRIMARY, COLORS.BLACK, etc.)
    fontWeight: "bold",
    fontSize: normalize(20), // Increase font size
  },

  selectedTimeSlot: {
    backgroundColor: COLORS.SECONDARY,
  },
  bookedTimeSlot: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderColor: COLORS.LIGHT_GREY,
  },
  timeSlotText: {
    fontSize: normalize(12),
    textAlign: 'center',
  },
  noSlotsContainer: {
    padding: normalize(16),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  noSlotsText: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  confirmButton: {
    marginTop: normalize(16),
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: 'bold',
  },

  specialtySliderChip: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    marginRight: normalize(8),
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  selectedSpecialtySliderChip: {
    backgroundColor: COLORS.SECONDARY,
  },
  doctorList: {
    marginTop: normalize(20),
  },
  doctorSlider: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
  },
  doctorCard: {
    marginRight: normalize(16),
    width: Dimensions.get("window").width * 0.7,
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
    fontSize: normalize(12),
  },
  smallBookButton: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    minWidth: normalize(60),
  },
  noDoctors: {
    textAlign: "center",
    marginTop: normalize(20),
    color: COLORS.GREY,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
    borderRadius: normalize(8),
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    marginBottom: normalize(16),
    textAlign: "center",
  },
  modalItem: {
    padding: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  modalCloseButton: {
    marginTop: normalize(16),
  },
  // Booking Modal Styles
  doctorDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20),
  },
  modalDoctorImage: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    marginRight: normalize(15),
  },
  doctorDetailsText: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: normalize(4),
  },
  modalDoctorSpecialty: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  modalDoctorHospital: {
    fontSize: normalize(12),
    color: COLORS.SECONDARY,
    marginBottom: normalize(4),
  },
  modalDoctorFees: {
    fontSize: normalize(14),
    color: COLORS.SECONDARY,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: normalize(16),
    marginBottom: normalize(12),
    color: COLORS.BLACK,
  },
  dateChip: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    marginRight: normalize(8),
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  selectedDateChip: {
    backgroundColor: COLORS.SECONDARY,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: normalize(16),
  },
  timeSlot: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    marginRight: normalize(8),
    marginBottom: normalize(8),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.SECONDARY,
  },
  bookedTimeSlot: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderColor: COLORS.LIGHT_GREY,
  },
  timeSlotText: {
    fontSize: normalize(12),
  },
  confirmButton: {
    marginTop: normalize(16),
  },
  noSlotsContainer: {
    padding: normalize(16),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  noSlotsText: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
});

export default BookAppointmentComponent;