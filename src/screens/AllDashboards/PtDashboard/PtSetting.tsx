import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView, ActivityIndicator, Alert } from "react-native";
import { launchImageLibrary, launchCamera, ImagePickerResponse, CameraOptions, ImageLibraryOptions, PhotoQuality } from 'react-native-image-picker';
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/index";
import { updatePatientStart, updatePatientFailure, updatePatientSuccess, } from "../../../store/slices/updatePatientSlice";
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
import { format, parseISO } from 'date-fns';
import { AvIcons, AvSelect } from "../../../elements";
import { IMAGES } from "../../../assets";
import { getImageSource, getImageSourceString } from "../../../services/apiHelpers";
import { Avatar } from "react-native-paper";
import { postJson, putJson } from "../../../services/apiServices";
import { fetchPatientDashboardData } from "../../../store/thunks/patientThunks";
import { useNavigation } from "@react-navigation/native";

const PatientSettingsView = () => {
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.updatePatient
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAppDispatch();

  // State for patient data
  const [patient, setPatient] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    aadhaar: "",
    dob: new Date(),
    genderId: 1,
    email: "",
    phone: "",
    occupation: "",
    district: "",
    city: "",
    state: "",
    pinCode: "",
    password: "",
    photo: null as string | null, // Base64 string or null
    photoFile: null as any, // For new photo uploads
  });

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // Get the current patient from Redux store
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});

  // Helper function to get image source for display
  // const getImageSource = () => {
  //   // If new photo was uploaded
  //   if (patient.photoFile?.base64) {
  //     return { uri: patient.photoFile.base64 };
  //   }

  //   // If photo is a base64 string
  //   if (patient.photo && patient.photo.startsWith('data:image')) {
  //     return { uri: patient.photo };
  //   }

  //   // If photo is a pure base64 string (without data: prefix)
  //   if (patient.photo && patient.photo.length > 100 && !patient.photo.includes('http')) {
  //     // Try to detect image type
  //     const isJpeg = patient.photo.startsWith('/9j/') || patient.photo.includes('JFIF') || patient.photo.includes('Exif');
  //     const isPng = patient.photo.startsWith('iVBORw');
  //     const isGif = patient.photo.startsWith('R0lGOD');
  //     const isWebp = patient.photo.startsWith('UklGR');

  //     let mimeType = 'image/jpeg';
  //     if (isPng) mimeType = 'image/png';
  //     else if (isGif) mimeType = 'image/gif';
  //     else if (isWebp) mimeType = 'image/webp';

  //     return { uri: `data:${mimeType};base64,${patient.photo}` };
  //   }

  //   // If photo is a URL or filename
  //   if (patient.photo && patient.photo.startsWith('http')) {
  //     return { uri: patient.photo };
  //   }

  //   // If photo is a filename from backend
  //   if (patient.photo) {
  //     return { uri: API.PATIENT_PHOTO + patient.photo };
  //   }

  //   return null;
  // };

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const handleChange = (field: string, value: string) => {
    setPatient({ ...patient, [field]: value });
  };

  const handlePhotoChange = (photoData: any) => {
    setPatient(prev => ({
      ...prev,
      photoFile: photoData,
      photo: photoData.base64 // Store base64 for immediate preview
    }));
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Photo',
      'Choose an option to select your photo',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.8 as PhotoQuality,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.8 as PhotoQuality,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, handleImageResponse);
  };

  // const handleImageResponse = (response: ImagePickerResponse) => {
  //   if (response.assets && response.assets[0]) {
  //     const asset = response.assets[0];
  //     if (asset.base64) {
  //       // Create data URL from base64
  //       const base64Image = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
  //       const photoData = {
  //         uri: asset.uri,
  //         base64: base64Image,
  //         type: asset.type || 'image/jpeg',
  //         fileName: asset.fileName || `photo_${Date.now()}.jpg`,
  //         base64Raw: asset.base64, // Store raw base64 for sending to backend
  //       };
  //       handlePhotoChange(photoData);
  //     }
  //   }
  // };

  const handleImageResponse = async (response: any) => {
    if (response.didCancel) {
      return;
    }

    if (response.error) {
      Alert.alert('Error', 'Failed to select image');
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      if (asset.base64) {
        const base64Image = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
        const photoData = {
          uri: asset.uri,
          base64: base64Image,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `photo_${Date.now()}.jpg`,
          base64Raw: asset.base64,
        };

        // Update the patient state with the new photo
        setPatient(prev => ({
          ...prev,
          photo: base64Image, // This will trigger a re-render with the new image
          photoFile: photoData
        }));

        // Clear any previous photo errors
        if (errors.photo) {
          setErrors(prev => ({ ...prev, photo: undefined }));
        }
      }
    }
  };

  // Format date from backend string or array to Date object
  const parseDate = (dateInput: any): Date => {
    if (!dateInput) return new Date();

    // If it's an array [year, month, day]
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day);
    }

    // If it's a string in format "YYYY-MM-DD"
    if (typeof dateInput === 'string') {
      try {
        return parseISO(dateInput);
      } catch {
        return new Date();
      }
    }

    return new Date();
  };

  useEffect(() => {
    if (currentPatient) {
      // console.log("Current patient data:", currentPatient);

      // Parse DOB
      const dobDate = parseDate(currentPatient.dob);

      // Get photo from backend - handle both URL and base64
      let photoData = currentPatient.photo;

      setPatient({
        firstName: currentPatient.firstName || "",
        middleName: currentPatient.middleName || "",
        lastName: currentPatient.lastName || "",
        aadhaar: currentPatient.aadhaar || "",
        dob: dobDate,
        genderId: currentPatient.genderId || currentPatient.gender || 1,
        email: currentPatient.email || "",
        phone: currentPatient.phone || "",
        occupation: currentPatient.occupation || "",
        district: currentPatient.district || "",
        city: currentPatient.city || "",
        state: currentPatient.state || "",
        pinCode: currentPatient.pinCode || "",
        password: "", // Don't pre-fill password
        photo: photoData, // Could be base64, URL, or filename
        photoFile: null, // Reset uploaded file
      });
    }
  }, [currentPatient]);

  // Function to convert image to base64 for sending to backend
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1] || base64String;
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };
  const navigation = useNavigation()
  const handleSave = async () => {
    dispatch(updatePatientStart());
    const url = `${API.UPDATE_PATIENT_BY_ID}${currentPatient?.id}`;

    try {
      // Validate required fields
      const newErrors: any = {};
      if (!patient.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!patient.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!patient.email.trim()) newErrors.email = 'Email is required';
      if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!patient.phone.trim()) newErrors.phone = 'Phone number is required';
      if (patient.phone && !/^[0-9]{10}$/.test(patient.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        Alert.alert('Validation Error', 'Please fix the errors before saving.');
        return;
      }

      // Prepare payload
      const payload: any = {
        id: currentPatient?.id,
        firstName: patient.firstName,
        middleName: patient.middleName || '',
        lastName: patient.lastName,
        phone: patient.phone,
        email: patient.email,
        aadhaar: patient.aadhaar || '',
        genderId: patient.genderId,
        dob: format(patient.dob, 'yyyy-MM-dd'),
        occupation: patient.occupation || '',
        pinCode: patient.pinCode || '',
        city: patient.city || '',
        district: patient.district || '',
        state: patient.state || '',
        agreeDeclaration: true,
      };

      // Handle photo - convert to base64 if new photo was uploaded
      if (patient.photoFile) {
        try {
          if (patient.photoFile.base64Raw) {
            // Use raw base64 from image picker
            payload.photo = patient.photoFile.base64Raw;
          } else if (patient.photoFile.uri) {
            // Convert URI to base64
            payload.photo = await convertImageToBase64(patient.photoFile.uri);
          }
        } catch (error) {
          console.error('Failed to process photo:', error);
          Alert.alert('Error', 'Failed to process the selected image.');
          return;
        }
      } else if (patient.photo) {
        // Keep existing photo (could be base64 or filename)
        payload.photo = patient.photo;
      }

      console.log("Update payload:", {
        ...payload,
        photo: payload.photo ? `[Base64 Image - ${payload.photo.length} characters]` : 'No photo'
      });

      // Make API call using putJson
      const response = await putJson(url, payload);
      console.log("UPDATE RESPONSE", response)
      setPatient(prev => ({
        ...prev,
        ...response, // Assuming the response contains the updated patient data
        // Keep the password field as is
        password: prev.password
      }));
      dispatch(updatePatientSuccess(response));

      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
      dispatch(fetchPatientDashboardData(response.id));
      navigation.reset({
        index: 0,
        routes: [{ name: PAGES.PATIENT_OVERVIEW as never }],
      });
    } catch (error: any) {
      console.error("Update failed:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      dispatch(updatePatientFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };
  const handleCancel = () => {
    // Reset to original patient data
    if (currentPatient) {
      const dobDate = parseDate(currentPatient.dob);
      setPatient(prev => ({
        ...prev,
        firstName: currentPatient.firstName || "",
        middleName: currentPatient.middleName || "",
        lastName: currentPatient.lastName || "",
        aadhaar: currentPatient.aadhaar || "",
        dob: dobDate,
        genderId: currentPatient.genderId || currentPatient.gender || 1,
        email: currentPatient.email || "",
        phone: currentPatient.phone || "",
        occupation: currentPatient.occupation || "",
        district: currentPatient.district || "",
        city: currentPatient.city || "",
        state: currentPatient.state || "",
        pinCode: currentPatient.pinCode || "",
        photo: currentPatient.photo,
        photoFile: null,
      }));
    }
    setEditing(false);
    setErrors({});
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

  const renderField = (field: string, value: any) => {
    const label = formatFieldName(field);
    const error = errors[field];

    // Special handling for different field types
    switch (field) {
      case "genderId":
        return (
          <View key={field} style={styles.inputContainer}>
            <AvSelect
              disabled={!editing}
              label="Gender *"
              required
              items={[
                { label: 'Male', value: 1 },
                { label: 'Female', value: 2 },
                { label: 'Other', value: 3 },
              ]}
              selectedValue={value}
              onValueChange={(val) => handleChange(field, val?.toString())}
              placeholder="Select Gender"
              error={!!error}
              errorText={error}
              mode="outlined"
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: error ? COLORS.ERROR : COLORS.LIGHT_GREY,
                }
              }}
            />
          </View>
        );

      case "dob":
        return (
          <View key={field} style={styles.inputContainer}>
            <TouchableOpacity
              disabled={!editing}
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInputContainer}
            >
              <AvText style={[styles.label, error && { color: COLORS.ERROR }]}>
                Date of Birth *
              </AvText>
              <View style={[
                styles.dateInput,
                { borderColor: error ? COLORS.ERROR : COLORS.LIGHT_GREY }
              ]}>
                <AvText>{format(value, 'dd/MM/yyyy')}</AvText>
                <AvIcons type="MaterialCommunityIcons" name="calendar" size={20} color={COLORS.GREY} />
              </View>
              {error && (
                <AvText style={styles.errorText}>{error}</AvText>
              )}
            </TouchableOpacity>
            {showDatePicker && editing && (
              <DateTimePicker
                value={value}
                mode="date"
                display={isIos() ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) handleChange('dob', date.toISOString());
                }}
                maximumDate={new Date()}
              />
            )}
          </View>
        );

      case "photo":
        // Photo field is handled separately in the UI
        return null;

      default:
        const isEditable = editing && field !== "email"; // Don't allow email editing
        const keyboardType =
          field.includes("Phone") || field.includes("Number") || field === "aadhaar"
            ? "phone-pad"
            : field.includes("Email")
              ? "email-address"
              : field === "pinCode"
                ? "number-pad"
                : "default";

        return (
          <View key={field} style={styles.inputContainer}>
            <AvText style={[styles.label, error && { color: COLORS.ERROR }]}>
              {label}{field !== "middleName" && field !== "occupation" ? " *" : ""}
            </AvText>
            {isEditable ? (
              <AvTextInput
                value={value?.toString()}
                onChangeText={(text) => handleChange(field, text)}
                editable={isEditable}
                mode="outlined"
                style={[styles.input, error && styles.inputError]}
                placeholder={!value ? "Not provided" : ""}
                keyboardType={keyboardType}
                error={!!error}
                errorText={error}
                theme={{
                  colors: {
                    primary: COLORS.SECONDARY,
                    outline: error ? COLORS.ERROR : COLORS.LIGHT_GREY,
                  }
                }}
              />
            ) : (
              <View style={styles.displayContainer}>
                <AvText style={styles.displayValue}>
                  {value || "Not provided"}
                </AvText>
              </View>
            )}
          </View>
        );
    }
  };
  const imageSource = getImageSource(patient);

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
            <View style={styles.photoContainer}>
              <AvText type="caption" style={styles.label}>
                Profile Photo
              </AvText>
              <TouchableOpacity
                style={[styles.photoButton, editing ? {} : styles.photoButtonDisabled]}
                onPress={handleImagePicker}
                disabled={!editing}
              >

                {imageSource || patient.photoFile?.base64
                  ? editing && patient.photoFile
                    ? (
                      <AvText type="caption2" style={styles.photoInfoText}>
                        New photo selected
                      </AvText>
                    )
                    : null
                  : (
                    <View style={styles.photoPlaceholder}>
                      <AvIcons
                        type="MaterialIcons"
                        name="person"
                        size={40}
                        color={COLORS.WHITE}
                      />
                    </View>
                  )
                }
                {imageSource || patient.photoFile?.base64 ? (
                  <AvImage
                    source={{ uri: patient.photoFile?.base64 || (imageSource?.uri as string) }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : null}
              </TouchableOpacity>
              
            </View>
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

              {/* Form Fields */}
              {/* <View style={styles.formFields}>
                {Object.entries(patient).map(([field, value]) =>
                  renderField(field, value)
                )}
              </View> */}
              <View style={styles.formFields}>
                {Object.entries(patient)
                  .filter(([field]) => !['password', 'photoFile', 'photo'].includes(field))
                  .map(([field, value]) => renderField(field, value))
                }
              </View>

              {/* Action Buttons - Only show when editing */}
              {editing && (
                <View style={styles.buttonContainer}>
                  <AvButton
                    mode="outlined"
                    onPress={handleCancel}
                    style={[styles.button, styles.cancelButton]}
                  >
                    Cancel
                  </AvButton>
                  <AvButton
                    mode="contained"
                    onPress={handleSave}
                    style={[styles.button, styles.saveButton]}
                    loading={loading}
                    disabled={loading}
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: COLORS.BLACK,
  },
  photoButton: {
    // borderWidth: 2,
    // borderColor: COLORS.LIGHT_GREY,
    // borderRadius: 50,
    // height: 120,
    // width: 120,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: COLORS.WHITE,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoButtonDisabled: {
    opacity: 0.6,
    // backgroundColor: COLORS.GREY + '20',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: COLORS.LIGHT_GREY,
    borderWidth: 1
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoButtonText: {
    marginTop: 8,
    color: COLORS.GREY,
  },
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
  formFields: {
    marginBottom: 16,
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

  input: {
    marginBottom: 16,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  displayContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    backgroundColor: COLORS.GREY + '10',
  },
  displayValue: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.WHITE,
  },

  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoInfoText: {
    marginTop: 8,
    color: COLORS.SUCCESS,
    fontSize: 12,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },

});

export default PatientSettingsView;
