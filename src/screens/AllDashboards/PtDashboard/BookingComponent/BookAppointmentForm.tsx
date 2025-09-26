// // BookAppointmentForm.tsx
// import React from "react";
// import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
// import AvText from "../../../../elements/AvText";
// import AvButton from "../../../../elements/AvButton";
// import AvTextInput from "../../../../elements/AvTextInput";
// import { AvSelect } from "../../../../elements/AvSelect";
// import { normalize } from "../../../../constants/platform";
// import { COLORS } from "../../../../constants/colors";
// import { Doctor, PostOffice, CITIES_BY_STATE, INDIAN_STATES, HOSPITALS, DOCTOR_PANEL_OPTIONS } from "../../../../constants/data";
// import { PAGES } from "../../../../constants/pages";

// interface BookAppointmentFormProps {
//   consultationType: "Physical" | "Virtual";
//   setConsultationType: (type: "Physical" | "Virtual") => void;
//   pincode: string;
//   setPincode: (pincode: string) => void;
//   state: string;
//   setState: (state: string) => void;
//   city: string;
//   setCity: (city: string) => void;
//   hospital: string;
//   setHospital: (hospital: string) => void;
//   symptoms: string;
//   setSymptoms: (symptoms: string) => void;
//   doctorPanel: "All" | "Hospital Affiliated" | "Consultant Doctor" | "Our Medical Expert";
//   setDoctorPanel: (panel: "All" | "Hospital Affiliated" | "Consultant Doctor" | "Our Medical Expert") => void;
//   minFees: string;
//   setMinFees: (fees: string) => void;
//   maxFees: string;
//   setMaxFees: (fees: string) => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   suggestedSpecialties: string[];
//   selectedSpecialty: string | null;
//   handleSpecialtySelect: (specialty: string) => void;
//   loading: boolean;
//   error: string | null;
//   onSubmit: () => void;
//   navigation: any;
// }

// const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
//   consultationType,
//   setConsultationType,
//   pincode,
//   setPincode,
//   state,
//   setState,
//   city,
//   setCity,
//   hospital,
//   setHospital,
//   symptoms,
//   setSymptoms,
//   doctorPanel,
//   setDoctorPanel,
//   minFees,
//   setMinFees,
//   maxFees,
//   setMaxFees,
//   searchQuery,
//   setSearchQuery,
//   suggestedSpecialties,
//   selectedSpecialty,
//   handleSpecialtySelect,
//   loading,
//   error,
//   navigation,
//   onSubmit
// }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <AvText type="title_1" style={styles.pageTitle}>
//           Book an Appointment
//         </AvText>
//       </View>

//       <AvTextInput
//         label="Search Doctors"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         style={styles.input}
//         theme={{
//           colors: {
//             primary: COLORS.SECONDARY,
//             outline: COLORS.LIGHT_GREY
//           },
//           roundness: 4
//         }}
//         style={[styles.input, ]}
//       />

//       <AvText type="title_2" style={styles.label}>
//         Consultation Type
//       </AvText>
//       <View style={styles.row}>
//         <AvButton
//           mode={consultationType === "Physical" ? "contained" : "outlined"}
//           onPress={() => setConsultationType("Physical")}
//           style={{
//             flex: 1,
//             marginRight: normalize(8),
//             backgroundColor: consultationType === "Physical" ? COLORS.SECONDARY : "transparent",
//             borderColor: COLORS.SECONDARY,
//           }}
//         >
//           Physical
//         </AvButton>
//         <AvButton
//           mode={consultationType === "Virtual" ? "contained" : "outlined"}
//           onPress={() => setConsultationType("Virtual")}
//           style={{
//             flex: 1,
//             backgroundColor: consultationType === "Virtual" ? COLORS.SECONDARY : "transparent",
//             borderColor: COLORS.SECONDARY,
//           }}
//         >
//           Virtual
//         </AvButton>
//       </View>

//       <AvTextInput
//         label="Enter Pincode for Quick Location Detection"
//         value={pincode}
//         onChangeText={setPincode}
//         keyboardType="numeric"
//         style={[styles.input, ]}
       
//       />

//       {loading && <ActivityIndicator size="small" color={COLORS.SECONDARY} />}
//       {error ? <AvText style={{ color: "red" }}>{error}</AvText> : null}

//       <AvSelect
//         label="Select State"
//         items={INDIAN_STATES}
//         selectedValue={state}
//         onValueChange={setState}
//         style={styles.input}
//       />

//       <AvSelect
//         label="Select City"
//         items={CITIES_BY_STATE[state] || []}
//         selectedValue={city}
//         onValueChange={setCity}
//         style={styles.input}
//         selectButtonStyle={{
//           borderWidth: 1,
//           borderColor: COLORS.GREY,
//           borderRadius: 4,
//         }}
//       />

//       <AvSelect
//         label="Select Hospital (Optional)"
//         items={HOSPITALS}
//         selectedValue={hospital}
//         onValueChange={setHospital}
//         selectButtonStyle={{
//           borderWidth: 1,
//           borderColor: COLORS.GREY,
//           borderRadius: 4,
//         }}
//       />

//       <AvTextInput
//         label="Describe Symptoms"
//         value={symptoms}
//         onChangeText={setSymptoms}
//         style={[styles.input, ]}
//         multiline
      
//       />

//       {/* Specialty Slider */}
//       {suggestedSpecialties.length > 0 && (
//         <View style={styles.specialtySliderContainer}>
//           <AvText type="title_2" style={styles.label}>
//             Select Specialties
//           </AvText>
//           <FlatList
//             data={suggestedSpecialties}
//             renderItem={({ item: specialty }) => (
//               <TouchableOpacity
//                 style={[
//                   styles.specialtySliderChip,
//                   selectedSpecialty === specialty ? styles.selectedSpecialtySliderChip : null,
//                 ]}
//                 onPress={() => handleSpecialtySelect(specialty)}
//               >
//                 <AvText style={selectedSpecialty === specialty ? { color: COLORS.WHITE } : { color: COLORS.BLACK }}>
//                   {specialty}
//                 </AvText>
//               </TouchableOpacity>
//             )}
//             keyExtractor={(specialty, index) => index.toString()}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.specialtySlider}
//           />
//         </View>
//       )}

//       {/* Doctor Panel Slider */}
//       <View style={styles.specialtySliderContainer}>
//         <AvText type="title_2" style={styles.label}>
//           Select Doctor Panel
//         </AvText>
//         <FlatList
//           data={DOCTOR_PANEL_OPTIONS}
//           renderItem={({ item: panel }) => (
//             <TouchableOpacity
//               style={[
//                 styles.specialtySliderChip,
//                 doctorPanel === panel.value ? styles.selectedSpecialtySliderChip : null,
//               ]}
//               onPress={() => setDoctorPanel(panel.value as any)}
//             >
//               <AvText style={doctorPanel === panel.value ? { color: COLORS.WHITE } : { color: COLORS.BLACK }}>
//                 {panel.label}
//               </AvText>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(panel, index) => index.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.specialtySlider}
//         />
//       </View>

//       <View style={styles.row}>
//         <AvTextInput
//           label="Min Fees (₹)"
//           value={minFees}
//           onChangeText={setMinFees}
//           keyboardType="numeric"
//           style={[styles.input, { flex: 1, marginRight: normalize(8) }, ]}
//           theme={{
//             colors: {
//               primary: COLORS.SECONDARY,
//               outline: COLORS.LIGHT_GREY
//             },
//             roundness: 4
//           }}
//         />
//         <AvTextInput
//           label="Max Fees (₹)"
//           value={maxFees}
//           onChangeText={setMaxFees}
//           keyboardType="numeric"
//           style={[styles.input, { flex: 1 }, ]}
//           theme={{
//             colors: {
//               primary: COLORS.SECONDARY,
//               outline: COLORS.LIGHT_GREY
//             },
//             roundness: 4
//           }}
//         />
//       </View>

//       <View style={styles.viewAllButtonContainer}>
//         <AvButton
//           mode="contained"
//           onPress={() => navigation.navigate(PAGES.VIEW_ALL_DOCTOR)}
//           style={styles.submitButton}
//           buttonColor={COLORS.SECONDARY}
//         >
//           View All
//         </AvButton>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: normalize(16),
//   },
//   header: {
//     backgroundColor: COLORS.GRADIENT_START,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: COLORS.BLACK,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     marginBottom: normalize(16),
//   },
//   pageTitle: {
//     textAlign: "center",
//     color: COLORS.WHITE,
//     fontWeight: "bold",
//     fontSize: normalize(20),
//   },
//   label: {
//     marginTop: normalize(12),
//     marginBottom: normalize(8),
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: normalize(12),
//   },
//   input: {
//     marginBottom: normalize(12),
//   },
//   textInputBorder: {
//     borderWidth: 1,
//     borderColor: COLORS.GREY,
//     borderRadius: 6,
//     backgroundColor: COLORS.WHITE,
//   },
//   specialtySliderContainer: {
//     marginVertical: normalize(10),
//   },
//   specialtySlider: {
//     paddingHorizontal: normalize(6),
//     paddingBottom: normalize(16),
//   },
//   specialtySliderChip: {
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(8),
//     marginRight: normalize(8),
//     borderRadius: normalize(20),
//     borderWidth: 1,
//     borderColor: COLORS.SECONDARY,
//     backgroundColor: COLORS.WHITE,
//   },
//   selectedSpecialtySliderChip: {
//     backgroundColor: COLORS.SECONDARY,
//   },
//   viewAllButtonContainer: {
//     alignSelf: 'flex-end',
//     marginBottom: normalize(16),
//   },
//   submitButton: {
//     paddingHorizontal: normalize(10),
//   },
// });

// export default BookAppointmentForm;






















// BookAppointmentForm.tsx
import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvTextInput from "../../../../elements/AvTextInput";
import { AvSelect } from "../../../../elements/AvSelect";
import { normalize } from "../../../../constants/platform";
import { COLORS } from "../../../../constants/colors";
import { Doctor, PostOffice, CITIES_BY_STATE, INDIAN_STATES, HOSPITALS, DOCTOR_PANEL_OPTIONS } from "../../../../constants/data";
import { PAGES } from "../../../../constants/pages";

interface BookAppointmentFormProps {
  consultationType: "Physical" | "Virtual";
  setConsultationType: (type: "Physical" | "Virtual") => void;
  pincode: string;
  setPincode: (pincode: string) => void;
  state: string;
  setState: (state: string) => void;
  city: string;
  setCity: (city: string) => void;
  hospital: string;
  setHospital: (hospital: string) => void;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  doctorPanel: "All" | "Hospital Affiliated" | "Consultant Doctor" | "Our Medical Expert";
  setDoctorPanel: (panel: "All" | "Hospital Affiliated" | "Consultant Doctor" | "Our Medical Expert") => void;
  minFees: string;
  setMinFees: (fees: string) => void;
  maxFees: string;
  setMaxFees: (fees: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestedSpecialties: string[];
  selectedSpecialty: string | null;
  handleSpecialtySelect: (specialty: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
  navigation: any;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  consultationType,
  setConsultationType,
  pincode,
  setPincode,
  state,
  setState,
  city,
  setCity,
  hospital,
  setHospital,
  symptoms,
  setSymptoms,
  doctorPanel,
  setDoctorPanel,
  minFees,
  setMinFees,
  maxFees,
  setMaxFees,
  searchQuery,
  setSearchQuery,
  suggestedSpecialties,
  selectedSpecialty,
  handleSpecialtySelect,
  loading,
  error,
  navigation,
  onSubmit
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AvText type="title_1" style={styles.pageTitle}>
          Book an Appointment
        </AvText>
      </View>

      <AvTextInput
        label="Search Doctors"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        theme={{
          colors: {
            primary: COLORS.SECONDARY,
            outline: COLORS.LIGHT_GREY
          },
          roundness: 4
        }}
        style={[styles.input, ]}
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
        style={[styles.input, ]}
       
      />

      {loading && <ActivityIndicator size="small" color={COLORS.SECONDARY} />}
      {error ? <AvText style={{ color: "red" }}>{error}</AvText> : null}

      <AvSelect
        label="Select State"
        items={INDIAN_STATES}
        selectedValue={state}
        onValueChange={setState}
        style={styles.input}
      />

      <AvSelect
        label="Select City"
        items={CITIES_BY_STATE[state] || []}
        selectedValue={city}
        onValueChange={setCity}
        style={styles.input}
        selectButtonStyle={{
          borderWidth: 1,
          borderColor: COLORS.GREY,
          borderRadius: 4,
        }}
      />

      <AvSelect
        label="Select Hospital (Optional)"
        items={HOSPITALS}
        selectedValue={hospital}
        onValueChange={setHospital}
        selectButtonStyle={{
          borderWidth: 1,
          borderColor: COLORS.GREY,
          borderRadius: 4,
        }}
      />

      <AvTextInput
        label="Describe Symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
        style={[styles.input, ]}
        multiline
      
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
          style={[styles.input, { flex: 1, marginRight: normalize(8) }, ]}
          theme={{
            colors: {
              primary: COLORS.SECONDARY,
              outline: COLORS.LIGHT_GREY
            },
            roundness: 4
          }}
        />
        <AvTextInput
          label="Max Fees (₹)"
          value={maxFees}
          onChangeText={setMaxFees}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }, ]}
          theme={{
            colors: {
              primary: COLORS.SECONDARY,
              outline: COLORS.LIGHT_GREY
            },
            roundness: 4
          }}
        />
      </View>

      <View style={styles.viewAllButtonContainer}>
        <AvButton
          mode="contained"
          onPress={() => navigation.navigate(PAGES.VIEW_ALL_DOCTOR)}
          style={styles.submitButton}
          buttonColor={COLORS.SECONDARY}
        >
          View All
        </AvButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(16),
  },
  header: {
    backgroundColor: COLORS.GRADIENT_START,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: normalize(16),
  },
  pageTitle: {
    textAlign: "center",
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: normalize(20),
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
    paddingHorizontal: normalize(6),
    paddingBottom: normalize(16),
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
  viewAllButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: normalize(16),
  },
  submitButton: {
    paddingHorizontal: normalize(10),
  },
});

export default BookAppointmentForm;






























