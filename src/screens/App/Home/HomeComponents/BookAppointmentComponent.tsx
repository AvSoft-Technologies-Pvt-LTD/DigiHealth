// Home/Components/BookAppointmentComponent.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvTextInput from "../../../../elements/AvTextInput";
import { normalize } from "../../../../constants/platform";
import { COLORS } from "../../../../constants/colors";

const states = [
  "Maharashtra","Delhi","Karnataka","Telangana","Gujarat","Tamil Nadu",
  "West Bengal","Rajasthan","Uttar Pradesh","Madhya Pradesh","Punjab",
  "Haryana","Bihar","Odisha","Kerala","Assam","Jharkhand","Uttarakhand",
  "Himachal Pradesh","Jammu and Kashmir","Goa","Tripura","Meghalaya",
  "Manipur","Nagaland","Mizoram","Arunachal Pradesh","Sikkim",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli",
  "Daman and Diu","Lakshadweep","Puducherry"
];

const BookAppointmentComponent: React.FC = () => {
  const [consultationType, setConsultationType] = useState<"Physical" | "Virtual">("Physical");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState(states[0]);
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [doctorPanel, setDoctorPanel] = useState<"All" | "Hospital Affiliated" | "Consultant Doctor">("All");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");

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
    });
  };

  return (
    <View style={styles.container}>
      {/* Consultation Type */}
      <AvText type="title_2" style={styles.label}>Consultation Type</AvText>
      <View style={styles.row}>
        <AvButton
          mode={consultationType === "Physical" ? "contained" : "outlined"}
          onPress={() => setConsultationType("Physical")}
          labelStyle={{ color: consultationType === "Physical" ? COLORS.WHITE : COLORS.BLACK }}
          buttonColor={COLORS.SECONDARY}
          style={{ flex: 1, marginRight: normalize(8) }}
        >
          Physical
        </AvButton>
        <AvButton
          mode={consultationType === "Virtual" ? "contained" : "outlined"}
          onPress={() => setConsultationType("Virtual")}
          labelStyle={{ color: consultationType === "Virtual" ? COLORS.WHITE : COLORS.BLACK }}
          buttonColor={COLORS.SECONDARY}
          style={{ flex: 1 }}
        >
          Virtual
        </AvButton>
      </View>

      {/* Inputs */}
      <AvTextInput
        label="Enter Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        style={styles.input}
        theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
      />

      <AvTextInput
        label="Select State"
        value={state}
        onChangeText={setState}
        style={styles.input}
        theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
      />

      <AvTextInput
        label="Select City / Use My Location"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
      />

      <AvTextInput
        label="Select Hospital (Optional)"
        value={hospital}
        onChangeText={setHospital}
        style={styles.input}
        theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
      />

      <AvTextInput
        label="Describe Symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
        style={styles.input}
        theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
      />

      {/* Doctor Panel */}
      <AvText type="title_2" style={styles.label}>Doctor Panel</AvText>
      <View style={styles.row}>
        {["All","Hospital Affiliated","Consultant Doctor"].map(panel => (
          <AvButton
            key={panel}
            mode={doctorPanel === panel ? "contained" : "outlined"}
            onPress={() => setDoctorPanel(panel as any)}
            labelStyle={{ color: doctorPanel === panel ? COLORS.WHITE : COLORS.BLACK }}
            buttonColor={COLORS.SECONDARY}
            style={{ flex: 1, marginRight: normalize(8) }}
          >
            {panel}
          </AvButton>
        ))}
      </View>

      {/* Fees */}
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

      {/* Submit Button */}
      <AvButton
        mode="contained"
        onPress={handleBookAppointment}
        labelStyle={{ color: COLORS.WHITE }}
        buttonColor={COLORS.SECONDARY}
      >
        Book Appointment
      </AvButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(10),
  },
  heading: {
    fontWeight: "bold",
    marginBottom: normalize(16),
    textAlign: "center",
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
});

export default BookAppointmentComponent;
