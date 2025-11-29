import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, ActivityIndicator, Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/index";
import {
  updatePatientStart,
  updatePatientSuccess,
  updatePatientFailure,
  resetUpdateState,
} from "../../../store/slices/updatePatientSlice";
import { API } from "../../../config/api";

import AvText from "../../../elements/AvText";
import AvTextInput from "../../../elements/AvTextInput";
import AvButton from "../../../elements/AvButton";
import { COLORS } from "../../../constants/colors";
import Header from "../../../components/Header";
import { PAGES } from "../../../constants/pages";
import { isIos } from "../../../constants/platform";
import AvImage from "../../../elements/AvImage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { AvIcons, AvSelect } from "../../../elements";
import { fetchPatientDashboardData, updatePatientById } from "../../../store/thunks/patientThunks";

const PatientSettingsView = () => {
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.updatePatient
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    // ... other form fields ...
    genderId: 1, // Default to Male
    dob: new Date(), // Default to today
  });
  const [errors, setErrors] = useState({});

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle date change
  const handleDateChange = (selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData('dob', selectedDate);
    }
  };

  const [patient, setPatient] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    aadhaar: "",
    dob: "",
    genderId: "",
    email: "",
    phone: "",
    occupation: "",
    district: "",
    city: "",
    state: "",
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const handleChange = (field: string, value: string) => {
    setPatient({ ...patient, [field]: value });
  };

  useEffect(() => {
    if (currentPatient) {
      // Format DOB from [year, month, day] to 'YYYY-MM-DD' format
      const formatDob = (dobArray: number[]) => {
        if (!Array.isArray(dobArray) || dobArray.length < 3) return '';
        const [year, month, day] = dobArray;
        // Months are 0-indexed in JavaScript Date, so we need to subtract 1
        const date = new Date(year, month - 1, day);
        // Format as YYYY-MM-DD
        return date.toISOString().split('T')[0];
      };

      setPatient({
        ...patient,
        firstName: currentPatient.firstName,
        middleName: currentPatient.middleName,
        lastName: currentPatient.lastName,
        aadhaar: currentPatient.aadhaar,
        dob: formatDob(currentPatient.dob),
        genderId: currentPatient.gender,
        email: currentPatient.email,
        phone: currentPatient.phone,
        occupation: currentPatient.occupation,
        district: currentPatient.district,
        city:currentPatient.city,
        state:currentPatient.state,
      });
    }
  }, [currentPatient]);
  // const handleSave = async () => {
  //   dispatch(updatePatientStart());
  //   const url = API.UPDATE_PATIENT_BY_ID + currentPatient?.id;
  //   console.log("API URL", url);
  //   console.log("PAYLOAD", patient);
  //   const payload = {
  //    id:currentPatient?.id,
  //   ...patient 
  //   }
  //   dispatch(updatePatientById(currentPatient?.id,payload));
  // }
  const handleSave = async () => {
    dispatch(updatePatientStart());
    const url = `${API.UPDATE_PATIENT_BY_ID}${currentPatient?.id}`;
  
    try {
      // ✅ Prepare FormData for sending multipart data
      const formDataToSend = new FormData();
  
      // Append all text fields safely
      formDataToSend.append('id', String(currentPatient?.id || ''));
      formDataToSend.append('firstName', patient.firstName || '');
      formDataToSend.append('middleName', patient.middleName || '');
      formDataToSend.append('lastName', patient.lastName || '');
      formDataToSend.append('phone', patient.phone || '');
      formDataToSend.append('email', patient.email || '');
      formDataToSend.append('password', patient.password || '');
      formDataToSend.append('aadhaar', patient.aadhaar || '');
      formDataToSend.append('genderId', String(patient.genderId || ''));
      formDataToSend.append('dob', patient.dob || '');
      formDataToSend.append('occupation', patient.occupation || '');
      formDataToSend.append('pinCode', patient.pinCode || '');
      formDataToSend.append('city', patient.city || '');
      formDataToSend.append('district', patient.district || '');
      formDataToSend.append('state', patient.state || '');
      formDataToSend.append('agreeDeclaration', true || '');
  
      // ✅ Append photo only if it’s a new local file (has a URI)
      if (patient.photo?.uri) {
        const photo = {
          uri: patient.photo.uri,
          type: patient.photo.type || 'image/jpeg',
          name: patient.photo.fileName || `photo_${Date.now()}.jpg`,
        };
        formDataToSend.append('photo', photo as any);
      }
  
      console.log("🧾 Update Payload Prepared:", {
        url,
        formDataKeys:formDataToSend,
      });
  
      // ✅ Call update API
      // await dispatch(updatePatientById(currentPatient?.id, formDataToSend));
      // dispatch(updatePatientSuccess());
  
      // ✅ Optionally refresh patient dashboard
      // if (currentPatient?.id) {
      //   dispatch(fetchPatientDashboardData(currentPatient.id));
      // }
  
    } catch (error) {
      console.error("❌ Update failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update patient';
      dispatch(updatePatientFailure(errorMessage));
    }
  };
  
  useEffect(() => {
    if (editing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(0);
    }
  }, [editing]);

  const inputTheme = {
    colors: {
      primary: COLORS.SECONDARY,
      outline: COLORS.LIGHT_GREY,
    },
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace("Aadhaar", "Aadhaar");
  };

  // Get the current patient from Redux store
  const { photo } = useAppSelector((state) => state.patientSettingData || {});
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={isIos() ? 'padding' : 'height'}
        keyboardVerticalOffset={isIos() ? 90 : 0}
      >
        <Header
          title={PAGES.PATIENT_SETTINGS}
          showBackButton={false}
          backgroundColor={COLORS.WHITE}
          titleColor={COLORS.BLACK}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <AvText type="heading_3" style={styles.headerTitle}>
              Profile Settings
            </AvText>
            <AvText type="description" style={styles.headerSubtitle}>
              Manage your account information and preferences
            </AvText>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>

            <AvImage
              source={{ uri: photo }} // now contains data:image/jpeg;base64,...
              style={{ width: 200, height: 200, borderRadius: 100 }}
              resizeMode="cover"
              showLoadingIndicator={true}
            />
            <AvText type="title_7" style={styles.profileName}>
              {patient.firstName} {patient.lastName}
            </AvText>
            <AvText type="title_3" style={styles.profileEmail}>
              {patient.email}
            </AvText>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "personal" && styles.activeTab]}
                onPress={() => setActiveTab("personal")}
              >
                <AvIcons
                  type="MaterialIcons"
                  name="person"
                  size={22}
                  color={activeTab === "personal" ? COLORS.WHITE : COLORS.GREY}
                />
                <AvText
                  type="buttonText"
                  style={{ color: activeTab === "personal" ? COLORS.WHITE : COLORS.GREY, marginLeft: 6 }}
                >
                  Personal
                </AvText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "password" && styles.activeTab]}
                onPress={() => setActiveTab("password")}
              >
                <AvIcons
                  type="MaterialIcons"
                  name="lock"
                  size={22}
                  color={activeTab === "password" ? COLORS.WHITE : COLORS.GREY}
                />
                <AvText
                  type="buttonText"
                  style={{ color: activeTab === "password" ? COLORS.WHITE : COLORS.GREY, marginLeft: 6 }}
                >
                  Password
                </AvText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content based on active tab */}
          {activeTab === "personal" ? (
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <AvText type="title_6">Personal Information</AvText>
                <TouchableOpacity onPress={toggleEditing} style={styles.editIconContainer}>
                  {editing ? (
                    <Animated.View style={[styles.blinkingDot, { opacity: blinkAnim }]} />
                  ) : (
                    <AvIcons type="MaterialIcons" name="edit" size={22} color={COLORS.SECONDARY} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Form Fields - Only inputs with labels inside */}
              <View style={styles.formFields}>
                {Object.entries(patient).map(([field, value]) => {
                  return (

                    field === "genderId" ? (
                      <View style={styles.inputContainer}>
                        <AvSelect
                          disabled={!editing}
                          label="Gender *"
                          required
                          items={[
                            { label: 'Male', value: 1 },
                            { label: 'Female', value: 2 },
                            { label: 'Other', value: 3 },
                          ]}
                          selectedValue={formData.genderId}
                          onValueChange={(value) => updateFormData('genderId', value)}
                          placeholder="Select Gender"
                          error={!!errors.genderId}
                          errorText={errors.genderId}
                          mode="outlined"
                          theme={{
                            colors: {
                              primary: COLORS.SECONDARY,
                              outline: errors.genderId ? COLORS.ERROR : COLORS.LIGHT_GREY,
                            }
                          }}
                        />
                      </View>
                    ) : field === "dob" ? (
                      <View style={styles.inputContainer}>
                        <TouchableOpacity
                          disabled={!editing}
                          onPress={() => setShowDatePicker(true)}
                          style={styles.dateInputContainer}
                        >
                          <AvText style={[styles.label, errors.dob && { color: COLORS.ERROR }]}>
                            Date of Birth *
                          </AvText>
                          <View style={[
                            styles.dateInput,
                            { borderColor: errors.dob ? COLORS.ERROR : COLORS.LIGHT_GREY }
                          ]}>
                            <AvText>{format(formData.dob, 'dd/MM/yyyy')}</AvText>
                            <AvIcons type="MaterialCommunityIcons" name="calendar" size={20} color={COLORS.GREY} />
                          </View>
                          {errors.dob && (
                            <AvText style={styles.errorText}>{errors.dob}</AvText>
                          )}
                        </TouchableOpacity>
                        {showDatePicker && (
                          <DateTimePicker
                            value={formData.dob}
                            mode="date"
                            display={isIos() ? 'spinner' : 'default'}
                            onChange={(event, date) => handleDateChange(date)}
                            maximumDate={new Date()}
                          />
                        )}
                      </View>) : (
                      <View key={field}>
                        <AvTextInput
                          key={field}
                          label={formatFieldName(field)}
                          value={value}
                          onChangeText={(text) => handleChange(field, text)}
                          editable={editing}
                          mode="outlined"
                          style={styles.input}
                          placeholder={!value ? "Not provided" : ""}
                          keyboardType={
                            field.includes("Phone") || field.includes("Number") || field === "aadhaar"
                              ? "phone-pad"
                              : field.includes("Email")
                                ? "email-address"
                                : field === "dob"
                                  ? "numbers-and-punctuation"
                                  : "default"
                          }
                          theme={inputTheme}
                        />
                      </View>
                    )
                  );
                })}
              </View>

              {/* Action Buttons - Only show when editing */}
              {editing && (
                <View style={styles.buttonContainer}>
                  <AvButton
                    mode="outlined"
                    onPress={() => setEditing(false)}
                    style={[styles.button, styles.cancelButton]}
                  >
                    Cancel
                  </AvButton>
                  <AvButton
                    mode="contained"
                    onPress={handleSave}
                    style={[styles.button, styles.saveButton]}
                  >
                    Save Changes
                  </AvButton>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.passwordSection}>
              <AvText type="title_6" style={styles.sectionTitle}>
                Change Password
              </AvText>
              <View style={styles.passwordForm}>
                <AvTextInput
                  label="Current Password"
                  secureTextEntry
                  mode="outlined"
                  style={styles.input}
                  placeholder="Enter current password"
                  theme={inputTheme}
                />
                <AvTextInput
                  label="New Password"
                  secureTextEntry
                  mode="outlined"
                  style={[styles.input, styles.inputSpacing]}
                  placeholder="Enter new password"
                  theme={inputTheme}
                />
                <AvTextInput
                  label="Confirm New Password"
                  secureTextEntry
                  mode="outlined"
                  style={[styles.input, styles.inputSpacing]}
                  placeholder="Confirm new password"
                  theme={inputTheme}
                />
                <AvButton mode="contained" style={styles.savePasswordButton}>
                  Change Password
                </AvButton>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.PRIMARY,
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: { color: COLORS.SECONDARY, textAlign: "center" },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 8,
    shadowColor: COLORS.BAGE_LIGTH_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10,
  },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  profileName: { color: COLORS.PRIMARY_TXT, marginBottom: 4 },
  profileEmail: { color: COLORS.GREEN },
  tabsContainer: { marginBottom: 20, marginHorizontal: 10 },
  tabs: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    shadowColor: COLORS.BAGE_LIGTH_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  activeTab: { backgroundColor: COLORS.SECONDARY },
  formSection: {
    marginBottom: 10,
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 8,
    shadowColor: COLORS.BAGE_LIGTH_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordSection: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: COLORS.BAGE_LIGTH_BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editIconContainer: {
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  inputSpacing: {
    marginTop: 12,
  },
  passwordForm: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.BLACK,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: { flex: 1, marginHorizontal: 4, borderRadius: 8, height: 44 },
  cancelButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.SECONDARY,
  },
  saveButton: { backgroundColor: COLORS.SECONDARY },
  savePasswordButton: {
    marginTop: 20,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 8,
    height: 44,
  },
  blinkingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.SECONDARY,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: COLORS.BLACK,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
  },
});

export default PatientSettingsView;
