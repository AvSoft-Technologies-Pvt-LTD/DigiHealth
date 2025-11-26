import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, MediaType, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { COLORS } from '../../../constants/colors';
import { AvSelect } from '../../../elements/AvSelect';
import { RadioButton, TextInput } from 'react-native-paper';
import { isIos, normalize } from '../../../constants/platform';
import Header from '../../../components/Header';
import { AvImage, AvTextInput, AvText, AvIcons } from '../../../elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { PAGES } from '../../../constants/pages';
import { MasterItem, selectFormattedGenders, selectFormattedPracticeTypes, selectFormattedSpecializations, selectHospitals } from '../../../store/slices/masterSlice';
import { useAppSelector } from '../../../store/hooks';

export interface DoctorFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  aadhaar: string;
  genderId: number;
  dob: string;
  registrationNumber: string;
  practiceTypeId: number;
  specializationId: number;
  qualification: string;
  associationType: string;
  hospitalId?: number;
  clinicName: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  agreeDeclaration: boolean;
  photo: Asset | null;
}

interface FormError {
  field?: keyof DoctorFormData;
  message: string;
  isActive: boolean;
}

type FormErrors = Partial<Record<keyof DoctorFormData, string>>;

interface DoctorRegisterViewProps {
  onSubmit: (formData: DoctorFormData) => void;
  onLoginPress: () => void;
  loading?: boolean;
  genders?: MasterItem[];
  practiceTypes?: MasterItem[];
  specializations?: MasterItem[];
};

const DoctorRegisterView: React.FC<DoctorRegisterViewProps> = ({
  onSubmit,
  onLoginPress,
  loading = false,
}) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: 'John',
    middleName: 'Smith',
    lastName: 'Doe',
    phone: '9876543210',
    email: 'john.doe@example.com',
    password: 'John@123$$',
    confirmPassword: 'John@123$$',
    aadhaar: '123456789012',
    genderId: 1,
    dob: '1990-01-01',
    registrationNumber: 'A12345678',
    practiceTypeId: 1,
    specializationId: 1,
    qualification: 'MBBS',
    associationType: 'HOSPITAL',
    clinicName: 'John Smith Clinic',
    pincode: '803115',
    city: 'Lucknow',
    district: 'Lucknow',
    state: 'UP',
    agreeDeclaration: false,
    photo: null,
  });

  const genders = useAppSelector(selectFormattedGenders);
  const practiceTypes = useAppSelector(selectFormattedPracticeTypes);
  const hospitals = useAppSelector(selectHospitals);
  const specializations = useAppSelector(selectFormattedSpecializations);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formError, setFormError] = useState<FormError>({
    field: undefined,
    message: '',
    isActive: false
  });
  const [errorTimer, setErrorTimer] = useState<number | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<'HOSPITAL' | 'CLINIC'>('HOSPITAL');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (errorTimer) {
        clearTimeout(errorTimer);
      }
    };
  }, [errorTimer]);

  const updateFormData = <K extends keyof DoctorFormData>(field: K, value: DoctorFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (formError.isActive && formError.field === field) {
      clearFormError();
    }
  };

  const showFormError = (message: string, field?: keyof DoctorFormData) => {
    // Clear any existing timer
    if (errorTimer) {
      clearTimeout(errorTimer);
    }
    
    setFormError({
      field,
      message,
      isActive: true
    });
    
    // Auto-hide error after 5 seconds
    const timer = setTimeout(() => {
      clearFormError();
    }, 3000);
    
    setErrorTimer(timer);
  };

  const clearFormError = () => {
    setFormError(prev => ({ ...prev, isActive: false }));
    if (errorTimer) {
      clearTimeout(errorTimer);
      setErrorTimer(null);
    }
  };

  const formatAadhaar = (input: string): string => {
    const digits = input.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const handleAadhaarChange = (text: string) => {
    const digits = text.replace(/\D/g, '').substring(0, 12);
    const formatted = formatAadhaar(digits);
    updateFormData('aadhaar', digits);
    return formatted;
  };

  const handlePincodeChange = async (text: string) => {
    // Only allow numbers and limit to 6 digits
    const cleanText = text.replace(/[^0-9]/g, '').substring(0, 6);
    updateFormData('pincode', cleanText);
    
    // If pincode is 6 digits, try to fetch location data
    if (cleanText.length === 6) {
      try {
        // You can use any pincode API service
        // Example using India Post API or similar service
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanText}`);
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          if (postOffice) {
            // Always update city, district, and state when pincode changes
            updateFormData('city', postOffice.Block || postOffice.District || '');
            updateFormData('district', postOffice.District || '');
            updateFormData('state', postOffice.State || '');
          }
        }
      } catch (error) {
        console.log('Failed to fetch pincode details:', error);
        // Silently fail - user can manually enter the details
      }
    } else {
      // If pincode is not 6 digits, clear the auto-filled fields
      updateFormData('city', '');
      updateFormData('district', '');
      updateFormData('state', '');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name must contain only letters and be 2-50 characters';
    }

    // Middle Name validation (optional)
    if (formData.middleName && formData.middleName.trim()) {
      if (!/^[a-zA-Z\s]{2,50}$/.test(formData.middleName.trim())) {
        newErrors.middleName = 'Middle name must contain only letters and be 2-50 characters';
      }
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name must contain only letters and be 2-50 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Aadhaar validation (optional but if provided, must be valid)
    if (formData.aadhaar && formData.aadhaar.trim()) {
      const aadhaarDigits = formData.aadhaar.replace(/-/g, '');
      if (!/^\d{12}$/.test(aadhaarDigits)) {
        newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
      }
    }

    // Gender validation
    if (!formData.genderId) {
      newErrors.genderId = 'Please select your gender';
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18 || age > 100) {
        newErrors.dob = 'You must be between 18 and 100 years old';
      }
    }

    // Registration Number validation
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    } else if (!/^[A-Z0-9]{6,20}$/.test(formData.registrationNumber.trim().toUpperCase())) {
      newErrors.registrationNumber = 'Registration number must be 6-20 alphanumeric characters';
    }

    // Practice Type validation
    if (!formData.practiceTypeId) {
      newErrors.practiceTypeId = 'Please select your practice type';
    }

    // Specialization validation
    if (!formData.specializationId) {
      newErrors.specializationId = 'Please select your specialization';
    }

    // Qualification validation
    if (!formData.qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    } else if (!/^[a-zA-Z\s,\-\.]{3,100}$/.test(formData.qualification.trim())) {
      newErrors.qualification = 'Qualification must contain only letters, spaces, commas, hyphens, or periods';
    }

    // Association Type validation
    if (!formData.associationType) {
      newErrors.associationType = 'Association type is required';
    } else if (formData.associationType === 'HOSPITAL' && !formData.hospitalId) {
      newErrors.hospitalId = 'Please select a hospital';
    } else if (formData.associationType === 'CLINIC' && !formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required';
    }

    // Pincode validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.city.trim())) {
      newErrors.city = 'City name must contain only letters and be 2-50 characters';
    }

    // District validation
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.district.trim())) {
      newErrors.district = 'District name must contain only letters and be 2-50 characters';
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.state.trim())) {
      newErrors.state = 'State name must contain only letters and be 2-50 characters';
    }

    // Photo validation
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required';
    }

    // Terms agreement validation
    if (!formData.agreeDeclaration) {
      newErrors.agreeDeclaration = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to select your photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Gallery', onPress: openGallery }
      ]
    );
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorMessage) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      return;
    }
    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      updateFormData('photo', selectedImage);
    } else {
      Alert.alert('Error', 'No image was selected. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event?.type === 'dismissed') {
      return;
    }

    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setErrors(prev => ({
        ...prev,
        dob: undefined
      }));

      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateFormData('dob', formattedDate);
    } else if (event?.nativeEvent?.timestamp) {
      const dateFromTimestamp = new Date(event.nativeEvent.timestamp);
      const formattedDate = dateFromTimestamp.toISOString().split('T')[0];
      updateFormData('dob', formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      let errorField: keyof DoctorFormData | undefined;

      if (errorMessage.toLowerCase().includes('pincode')) {
        errorField = 'pincode';
      } else if (errorMessage.toLowerCase().includes('email')) {
        errorField = 'email';
      } else if (errorMessage.toLowerCase().includes('phone')) {
        errorField = 'phone';
      } else if (errorMessage.toLowerCase().includes('aadhaar')) {
        errorField = 'aadhaar';
      } else if (errorMessage.toLowerCase().includes('registration')) {
        errorField = 'registrationNumber';
      }

      showFormError(errorMessage, errorField);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: any = 'default',
    secureTextEntry = false,
    mandatory = false,
    fieldKey?: keyof DoctorFormData
  ) => {
    const errorText = fieldKey ? errors[fieldKey] : '';
    const hasError = Boolean(errorText);

    const isPasswordField = fieldKey === 'password' || fieldKey === 'confirmPassword';
    const isPasswordVisible = fieldKey === 'password' ? showPassword : showConfirmPassword;
    const setPasswordVisibility = fieldKey === 'password'
      ? () => setShowPassword(!isPasswordVisible)
      : () => setShowConfirmPassword(!isPasswordVisible);

    const rightIcon = isPasswordField && value.length > 0 ? (
      <TextInput.Icon
        icon={isPasswordVisible ? "eye-off" : "eye"}
        onPress={setPasswordVisibility}
        color={COLORS.GREY}
        size={18}
      />
    ) : undefined;

    return (
      <View style={styles.inputContainer}>
        <AvTextInput
          label={label + (mandatory ? ' *' : '')}
          style={[
            styles.input,
            hasError ? styles.inputError : {}
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={isPasswordField ? !isPasswordVisible : secureTextEntry}
          placeholderTextColor={COLORS.GREY}
          right={rightIcon}
          mode="outlined"
          dense={true}
          theme={{
            colors: {
              primary: COLORS.SECONDARY,
              outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
              background: COLORS.WHITE,
            }
          }}
        />
        {errorText && (
          <AvText type="caption" style={styles.errorText}>
            {errorText}
          </AvText>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={isIos() ? 'padding' : 'height'}
      keyboardVerticalOffset={isIos() ? 60 : 0}
    >
      <Header
        title={PAGES.DOCTOR_REGISTER}
        showBackButton={true}
        onLoginPress={() => navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: PAGES.LOGIN }],
          })
        )}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.PRIMARY}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <AvText type="h4" style={styles.title}>Doctor Registration</AvText>
            <AvText type="body2" style={styles.subtitle}>Complete your professional profile</AvText>
          </View>

          <View style={styles.form}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <AvText type="subtitle1" style={styles.sectionTitle}>Personal Information</AvText>
              
              {/* Name Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  {renderInput('First Name', formData.firstName, text => updateFormData('firstName', text), 'First name', 'default', false, true, 'firstName')}
                </View>
                <View style={styles.flex1}>
                  {renderInput('Last Name', formData.lastName, text => updateFormData('lastName', text), 'Last name', 'default', false, true, 'lastName')}
                </View>
              </View>

              {renderInput('Middle Name', formData.middleName, text => updateFormData('middleName', text), 'Middle name (optional)')}

              {/* Contact Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  {renderInput('Phone', formData.phone, text => updateFormData('phone', text), 'Phone number', 'phone-pad', false, true, 'phone')}
                </View>
                <View style={styles.flex1}>
                  {renderInput('Email', formData.email, text => updateFormData('email', text), 'Email address', 'email-address', false, true, 'email')}
                </View>
              </View>

              {renderInput('Aadhaar', formatAadhaar(formData.aadhaar), handleAadhaarChange, 'Aadhaar number', 'default', false, true, 'aadhaar')}

              {/* Gender and DOB Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  <View style={styles.inputContainer}>
                    <AvSelect
                      label="Gender *"
                      required
                      items={genders}
                      selectedValue={formData.genderId}
                      onValueChange={(value) => updateFormData('genderId', value)}
                      placeholder="Select Gender"
                      error={!!errors.genderId}
                      errorText={errors.genderId}
                      mode="outlined"
                      dense={true}
                      theme={{
                        colors: {
                          primary: COLORS.SECONDARY,
                          outline: errors.genderId ? COLORS.ERROR : COLORS.LIGHT_GREY,
                        }
                      }}
                    />
                  </View>
                </View>
                <View style={styles.flex1}>
                  <View style={styles.inputContainer}>
                    <AvText type="caption" style={styles.label}>
                      Date of Birth *
                    </AvText>
                    <TouchableOpacity
                      style={[styles.dateButton, errors.dob ? styles.inputError : {}]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <AvText type="body2" style={[styles.dateText, !formData.dob ? styles.placeholderText : {}]}>
                        {formData.dob ? new Date(formData.dob).toLocaleDateString() : 'Select DOB'}
                      </AvText>
                    </TouchableOpacity>
                    {errors.dob && <AvText type="caption" style={styles.errorText}>{errors.dob}</AvText>}
                  </View>
                </View>
              </View>
            </View>

            {/* Professional Information Section */}
            <View style={styles.section}>
              <AvText type="subtitle1" style={styles.sectionTitle}>Professional Information</AvText>
              
              {renderInput('Registration No.', formData.registrationNumber, text => updateFormData('registrationNumber', text), 'Medical registration number', 'default', false, true, 'registrationNumber')}

              {/* Practice and Specialization Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  <View style={styles.inputContainer}>
                    <AvSelect
                      label="Practice Type *"
                      required
                      items={practiceTypes}
                      selectedValue={formData.practiceTypeId}
                      onValueChange={(value) => updateFormData('practiceTypeId', value)}
                      placeholder="Practice Type"
                      error={!!errors.practiceTypeId}
                      errorText={errors.practiceTypeId}
                      mode="outlined"
                      dense={true}
                    />
                  </View>
                </View>
                <View style={styles.flex1}>
                  <View style={styles.inputContainer}>
                    <AvSelect
                      label="Specialization *"
                      required
                      items={specializations}
                      selectedValue={formData.specializationId}
                      onValueChange={(value) => updateFormData('specializationId', value)}
                      placeholder="Specialization"
                      error={!!errors.specializationId}
                      errorText={errors.specializationId}
                      mode="outlined"
                      dense={true}
                    />
                  </View>
                </View>
              </View>

              {renderInput('Qualification', formData.qualification, text => updateFormData('qualification', text), 'Your qualifications', 'default', false, true, 'qualification')}

              {/* Association Type */}
              <View style={styles.inputContainer}>
                <AvText type="caption" style={styles.label}>
                  Association Type *
                </AvText>
                <View style={styles.radioGroup}>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      value="HOSPITAL"
                      status={selectedAssociation === 'HOSPITAL' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedAssociation('HOSPITAL');
                        updateFormData('associationType', 'HOSPITAL');
                        updateFormData('clinicName', '');
                      }}
                      color={COLORS.PRIMARY}
                    />
                    <AvText type="body2" onPress={() => {
                      setSelectedAssociation('HOSPITAL');
                      updateFormData('associationType', 'HOSPITAL');
                      updateFormData('clinicName', '');
                    }}>Hospital</AvText>
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton
                      value="CLINIC"
                      status={selectedAssociation === 'CLINIC' ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedAssociation('CLINIC');
                        updateFormData('associationType', 'CLINIC');
                        updateFormData('hospitalId', 0);
                      }}
                      color={COLORS.PRIMARY}
                    />
                    <AvText type="body2" onPress={() => {
                      setSelectedAssociation('CLINIC');
                      updateFormData('associationType', 'CLINIC');
                      updateFormData('hospitalId', 0);
                    }}>Clinic</AvText>
                  </View>
                </View>
                {errors.associationType && (
                  <AvText type="caption" style={styles.errorText}>
                    {errors.associationType}
                  </AvText>
                )}
              </View>

              {/* Hospital/Clinic Selection */}
              {selectedAssociation === 'HOSPITAL' && (
                <View style={styles.inputContainer}>
                  <AvSelect
                    label="Select Hospital *"
                    required
                    items={hospitals.map((hospital: any) => ({
                      label: hospital.label || 'Unknown Hospital',
                      value: hospital.value?.toString() || ''
                    }))}
                    selectedValue={formData.hospitalId?.toString() || ''}
                    onValueChange={(value: string) => updateFormData('hospitalId', Number(value))}
                    placeholder="Select Hospital"
                    error={!!errors.hospitalId}
                    errorText={errors.hospitalId}
                    mode="outlined"
                    dense={true}
                  />
                </View>
              )}

              {selectedAssociation === 'CLINIC' && (
                renderInput(
                  'Clinic Name',
                  formData.clinicName,
                  text => updateFormData('clinicName', text),
                  'Enter clinic name',
                  'default',
                  false,
                  true,
                  'clinicName'
                )
              )}

              {/* Photo Upload */}
              <View style={styles.inputContainer}>
                <AvText type="caption" style={styles.label}>
                  Profile Photo
                </AvText>
                <TouchableOpacity
                  style={[styles.photoButton, errors.photo ? styles.inputError : {}]}
                  onPress={handleImagePicker}
                >
                  {formData.photo?.uri ? (
                    <AvImage source={{ uri: formData.photo.uri }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <AvIcons type="MaterialIcons" name="add-a-photo" size={24} color={COLORS.GREY} />
                      <AvText type="caption" style={styles.photoButtonText}>Add Photo</AvText>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.photo && <AvText type="caption" style={styles.errorText}>{errors.photo}</AvText>}
              </View>
            </View>

            {/* Address Information Section */}
            <View style={styles.section}>
              <AvText type="subtitle1" style={styles.sectionTitle}>Address Information</AvText>
              
              {/* Pincode and City Row */}
              <View style={styles.row}>
                <View style={[styles.flex2, styles.rightSpacing]}>
                  <AvTextInput
                    label="Pincode *"
                    value={formData.pincode}
                    onChangeText={handlePincodeChange}
                    keyboardType="number-pad"
                    maxLength={6}
                    mode="outlined"
                    dense={true}
                    style={[
                      styles.input,
                      (errors.pincode || (formError.isActive && formError.field === 'pincode')) ? styles.inputError : {}
                    ]}
                    theme={{
                      colors: {
                        primary: COLORS.SECONDARY,
                        outline: (errors.pincode || (formError.isActive && formError.field === 'pincode')) ? COLORS.TRANSPARENT : COLORS.LIGHT_GREY,
                        background: COLORS.WHITE,
                      }
                    }}
                  />
                  {(errors.pincode || (formError.field === 'pincode' && formError.isActive)) && (
                    <AvText type="caption" style={styles.errorText}>
                      {errors.pincode || (formError.field === 'pincode' ? formError.message : '')}
                    </AvText>
                  )}
                </View>
                <View style={styles.flex3}>
                  {renderInput('City', formData.city, text => updateFormData('city', text), 'City', 'default', false, true, 'city')}
                </View>
              </View>

              {/* District and State Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  {renderInput('District', formData.district, text => updateFormData('district', text), 'District', 'default', false, true, 'district')}
                </View>
                <View style={styles.flex1}>
                  {renderInput('State', formData.state, text => updateFormData('state', text), 'State', 'default', false, true, 'state')}
                </View>
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.section}>
              <AvText type="subtitle1" style={styles.sectionTitle}>Security</AvText>
              
              {/* Password Row */}
              <View style={styles.row}>
                <View style={[styles.flex1, styles.rightSpacing]}>
                  {renderInput('Password', formData.password, text => updateFormData('password', text), 'Password', 'default', true, true, 'password')}
                </View>
                <View style={styles.flex1}>
                  {renderInput('Confirm', formData.confirmPassword, text => updateFormData('confirmPassword', text), 'Confirm password', 'default', true, true, 'confirmPassword')}
                </View>
              </View>
            </View>

            {/* Terms and Submit Section */}
            <View style={styles.section}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => updateFormData('agreeDeclaration', !formData.agreeDeclaration)}
                >
                  <View style={[styles.checkboxInner, formData.agreeDeclaration && styles.checkboxChecked]}>
                    {formData.agreeDeclaration && <AvText type="caption" style={styles.checkmark}>✓</AvText>}
                  </View>
                  <AvText type="body2" style={styles.checkboxText}>
                    I agree to the terms and conditions *
                  </AvText>
                </TouchableOpacity>
                {errors.agreeDeclaration && <AvText type="caption" style={styles.errorText}>{errors.agreeDeclaration}</AvText>}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <AvText type="button" style={styles.submitButtonText}>
                  {loading ? 'Creating Account...' : 'Register as Doctor'}
                </AvText>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <AvText type="body2" style={styles.loginLinkText}>Already have an account? </AvText>
                <TouchableOpacity onPress={onLoginPress}>
                  <AvText type="link" style={styles.loginLink}>Sign In</AvText>
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {formError.isActive && !formError.field && (
                <View style={styles.errorContainer}>
                  <AvText type="caption" style={styles.errorText}>
                    {formError.message}
                  </AvText>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.dob ? new Date(formData.dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: normalize(10),
  },
  content: {
    flex: 1,
    paddingHorizontal: normalize(16),
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: normalize(16),
    marginBottom: normalize(8),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    textAlign: 'center',
    marginTop: normalize(4),
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: normalize(16),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(16),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: normalize(12),
    paddingBottom: normalize(6),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  rightSpacing: {
    marginRight: normalize(8),
  },
  inputContainer: {
    marginBottom: normalize(10),
  },
  label: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: COLORS.BLACK,
    marginBottom: normalize(4),
  },
  input: {
    height: normalize(48),
    fontSize: normalize(14),
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.TRANSPARENT,
    fontSize: normalize(11),
    marginTop: normalize(2),
    marginLeft: normalize(4),
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
    backgroundColor: COLORS.WHITE,
    height: normalize(48),
    justifyContent: 'center',
  },
  dateText: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    minHeight: normalize(80),
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: normalize(12),
    color: COLORS.GREY,
    marginTop: normalize(4),
  },
  photoPreview: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(8),
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: normalize(4),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(20),
  },
  checkboxContainer: {
    marginBottom: normalize(16),
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxInner: {
    width: normalize(18),
    height: normalize(18),
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(4),
    marginRight: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
  },
  checkmark: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: normalize(14),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginBottom: normalize(16),
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(16),
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: normalize(14),
    color: COLORS.GREY,
  },
  loginLink: {
    fontSize: normalize(14),
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  errorContainer: {
    padding: normalize(8),
    backgroundColor: COLORS.ERROR,
    borderRadius: normalize(4),
    marginTop: normalize(8),
  },
});

export default DoctorRegisterView;