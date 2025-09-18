import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Snackbar } from 'react-native-paper';
import PatientRegisterView, { PatientFormData } from './PatientRegisterView';
import { RootStackParamList } from '../../../types/navigation';
import { API } from '../../../config/api';
import { PAGES } from '../../../constants/pages';
import { post, postFormData } from '../../../services/apiServices';

type PatientRegisterProps = {};

const PatientRegister: React.FC<PatientRegisterProps> = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handlePatientRegistration = async (formData: PatientFormData) => {
    setLoading(true);
    console.log("Form Data patient reg", formData);
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
      // Format Aadhaar with hyphens after every 4 digits
      const formattedAadhaar = formData.aadhaar.replace(/(\d{4})(?=\d)/g, '$1-');
      formDataToSend.append('aadhaar', formattedAadhaar);
      formDataToSend.append('genderId', formData.genderId); // Keep as string, let backend parse
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('occupation', formData.occupation);
      formDataToSend.append('pinCode', formData.pinCode);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('agreeDeclaration', String(formData.agreeDeclaration));

      // Handle photo upload separately if available
      if (formData.photo?.uri) {
        const photo = {
          uri: formData.photo.uri,
          type: formData.photo.type || 'image/jpeg',
          name: formData.photo.fileName || `photo_${Date.now()}.jpg`,
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

      console.log("Payload",formDataToSend);
      
      // Make API call using the imported postFormData function
      const responseData = await postFormData(API.PATIENT_REGISTER_API, formDataToSend);
      console.log("Registration response:", responseData);
      
      Alert.alert(
        'Registration Successful',
        responseData.message || 'Your patient registration has been completed successfully. Please login to continue.',
        [
          {
            text: 'Login Now',
            // onPress: () => navigation.navigate(PAGES.LOGIN)
          }
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message);
      } else {
        showSnackbar('Network error. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoginPress = () => {
    navigation.navigate(PAGES.LOGIN);
  };

  return (
    <>
      <PatientRegisterView
        onSubmit={handlePatientRegistration}
        onLoginPress={handleLoginPress}
        loading={loading}
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

export default PatientRegister;