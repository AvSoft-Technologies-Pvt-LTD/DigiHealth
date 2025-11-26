import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Snackbar } from 'react-native-paper';
import DoctorRegisterView, { DoctorFormData } from './DoctorRegisterView';
import { RootStackParamList } from '../../../types/navigation';
import { API } from '../../../config/api';
import { PAGES } from '../../../constants/pages';
import { post, postFormData } from '../../../services/apiServices';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchGenders,
  fetchHospitals,
  fetchPracticeTypes,
  fetchSpecializations,
  selectFormattedGenders,
  selectFormattedPracticeTypes
} from '../../../store/slices/masterSlice';


type DoctorRegisterProps = {};

const DoctorRegister: React.FC<DoctorRegisterProps> = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch()


  

  useEffect(() => {
    // Fetch master data
    dispatch(fetchGenders());
    dispatch(fetchPracticeTypes());
    dispatch(fetchSpecializations());
    dispatch(fetchHospitals());

  }, [dispatch]);
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDoctorRegistration = async (formData: DoctorFormData) => {
    setLoading(true);
    console.log("Form Data doctor reg", formData);

    try {
      // Create FormData for the request
      const formDataToSend = new FormData();

      // Append all fields with proper type handling
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('middleName', formData.middleName || '');
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('aadhaar', formData.aadhaar.replace(/-/g, '').replace(/(\d{4})(?=\d)/g, '$1-'));
      formDataToSend.append('genderId', formData.genderId);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('registrationNumber', formData.registrationNumber);
      formDataToSend.append('practiceTypeId', formData.practiceTypeId);
      formDataToSend.append('specializationId', formData.specializationId);
      formDataToSend.append('qualification', formData.qualification);
      formDataToSend.append('associationType', formData.associationType);

      if (formData.hospitalId) {
        formDataToSend.append('hospitalId', formData.hospitalId);
      }

      if (formData.clinicName) {
        formDataToSend.append('clinicName', formData.clinicName);
      }

      formDataToSend.append('pincode', formData.pincode);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('agreeDeclaration', String(formData.agreeDeclaration));

      // Handle photo upload separately if available
      if (formData.photo?.uri) {
        const photo = {
          uri: formData.photo.uri,
          type: formData.photo.type || 'image/jpeg',
          name: formData.photo.fileName || `doctor_photo_${Date.now()}.jpg`,
        };

        // Replace the photo field with the file object
        formDataToSend.append('photo', photo as any);

        console.log("Photo prepared for upload:", {
          name: photo.name,
          type: photo.type,
          size: formData.photo.fileSize
        });
      } else {
        console.log("No photo provided for upload");
      }

      console.log("Doctor Registration Payload", formDataToSend);
      // return
      // Make API call using the imported postFormData function
      const responseData = await postFormData(API.DOCTOR_REGISTER_API, formDataToSend);
      console.log("Registration response:", responseData);

      Alert.alert(
        'Registration Successful',
        responseData.message || 'Your doctor registration has been completed successfully. Please wait for admin approval.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(PAGES.LOGIN)
          }
        ]
      );
    } catch (error: any) {
      console.error('Doctor registration error:', error);

      // Check for specific API error response
      if (error.response?.data?.error) {
        showSnackbar(error.response.data.error);
      } else if (error.response?.data?.message) {
        showSnackbar(error.response.data.message);
      } else if (error.message) {
        showSnackbar(error.message);
      } else {
        showSnackbar('Network error. Please check your internet connection and try again.');
      }
      // Re-throw the error to be caught by the view component if needed
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate(PAGES.LOGIN);
  };

  const doctorProps = {
    onSubmit: handleDoctorRegistration,
    onLoginPress: handleLoginPress,
    loading,
  };

  return (
    <>
      <DoctorRegisterView
        {...doctorProps}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

export default DoctorRegister;