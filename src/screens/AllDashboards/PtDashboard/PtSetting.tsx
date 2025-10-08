import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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
import { IMAGES } from "../../../assets";
import { fetchPatientPhoto } from "../../../store/thunks/patientThunks";

const PatientSettingsView = () => {
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.updatePatient
  );

  const [patient, setPatient] = useState({
    id: "1", // temp hardcoded, replace with logged-in patient id
    firstName: "Trupti",
    middleName: "",
    lastName: "Chavan",
    aadhaarNumber: "5785-4549-8879",
    dateOfBirth: "2002-12-03",
    gender: "female",
    email: "trupti@gmail.com",
    phoneNumber: "9901341783",
    alternatePhoneNumber: "",
    occupation: "Software Developer",
    permanentAddress: "",
    temporaryAddress: "",
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    setPatient({ ...patient, [field]: value });
  };

  const handleSave = async () => {
    dispatch(updatePatientStart());
    try {
      const response = await fetch(API.UPDATE_PATIENT_BY_ID(patient.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      await response.json();
      dispatch(updatePatientSuccess());
      setEditing(false);
    } catch (err: any) {
      dispatch(updatePatientFailure(err.message));
    }
  };

  useEffect(() => {
    if (success) {
      Alert.alert("Success", "Patient details updated successfully", [
        { text: "OK", onPress: () => dispatch(resetUpdateState()) },
      ]);
    }
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => dispatch(resetUpdateState()) },
      ]);
    }
  }, [success, error]);

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
                <Icon
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
                <Icon
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
                    <Icon name="edit" size={22} color={COLORS.SECONDARY} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Form Fields - Only inputs with labels inside */}
              <View style={styles.formFields}>
                {Object.entries(patient).map(([field, value]) => (
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
                      field.includes("Phone") || field.includes("Number") || field === "aadhaarNumber"
                        ? "phone-pad"
                        : field.includes("Email")
                          ? "email-address"
                          : field === "dateOfBirth"
                            ? "numbers-and-punctuation"
                            : "default"
                    }
                    theme={inputTheme}
                  />
                ))}
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
});

export default PatientSettingsView;
