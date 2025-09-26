




import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { debounce } from "lodash";
import BookAppointmentForm from "./BookAppointmentForm";
import DoctorList from "./DoctorList";
import BookingModal from "./BookingModal";
import LocationPickerModal from "./LocationPickerModal";
import SpecialtyModal from "./SpecialtyModal";
import { Doctor, PostOffice, PincodeApiResponse, CITIES_BY_STATE, INDIAN_STATES, HOSPITALS, DOCTOR_PANEL_OPTIONS, symptomSpecialtyMap } from "../../../../constants/data";
import { normalize } from "../../../../constants/platform";
import { COLORS } from "../../../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setFilteredDoctors, setLoading, setError } from "../../../../store/slices/doctorSlice";

const DrBookAppointmentComponent: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { filteredDoctors, loading, error } = useAppSelector((state) => state.doctor);

  // State management
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

  // API functions
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
      const response = await axios.get("https://mocki.io/v1/98995b39-a191-4514-b9e4-33a35aa19aee");
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
  // Handlers
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

  const handleBookDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingModalVisible(true);
    console.log("Booking modal should open now"); // Debug log
  };

  const handleSubmit = () => {
    if (selectedSpecialty) {
      fetchFilteredDoctors();
    } else {
      dispatch(setError("Please select a specialty"));
    }
  };

  // Effects
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

  const mapSymptomsToSpecialization = (symptoms: string): string[] => {
    const lowerSymptoms = symptoms.toLowerCase().replace(/\s/g, "");
    return symptomSpecialtyMap[lowerSymptoms] || [];
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true}
    >
      <BookAppointmentForm
        consultationType={consultationType}
        setConsultationType={setConsultationType}
        pincode={pincode}
        setPincode={setPincode}
        state={state}
        setState={setState}
        city={city}
        setCity={setCity}
        hospital={hospital}
        setHospital={setHospital}
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        doctorPanel={doctorPanel}
        setDoctorPanel={setDoctorPanel}
        minFees={minFees}
        setMinFees={setMinFees}
        maxFees={maxFees}
        setMaxFees={setMaxFees}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        suggestedSpecialties={suggestedSpecialties}
        selectedSpecialty={selectedSpecialty}
        handleSpecialtySelect={handleSpecialtySelect}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        navigation={navigation}
      />
      <DoctorList
        doctors={filteredDoctors}
        loading={loading}
        error={error}
        city={city}
        onBookDoctor={handleBookDoctor}
      />
      <BookingModal
        isVisible={isBookingModalVisible}
        onClose={() => {
          setIsBookingModalVisible(false);
          setSelectedTime(null);
        }}
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
      <LocationPickerModal
        isVisible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        locations={locationOptions}
        onSelectLocation={handleSelectLocation}
      />
      <SpecialtyModal
        isVisible={showAllSpecialties}
        onClose={() => setShowAllSpecialties(false)}
        specialties={suggestedSpecialties}
        onSelectSpecialty={handleSpecialtySelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: normalize(10),
  },
});

export default DrBookAppointmentComponent;