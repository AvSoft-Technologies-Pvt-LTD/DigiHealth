import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PatientRegisterView, { PatientFormData } from './PatientRegisterView';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import { API } from '../../../config/api';
import { PAGES } from '../../../constants/pages';
import { post, postFormData } from '../../../services/apiServices';

type PatientRegisterProps = {};

const PatientRegister: React.FC<PatientRegisterProps> = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePatientRegistration = async (formData: PatientFormData) => {
    setLoading(true);
    console.log("Form Data patient reg", formData);
    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();
      
      // Add all form fields according to API specification
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('middleName', formData.middleName || ''); // Send empty value if not provided
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirmPassword', formData.confirmPassword);
      formDataToSend.append('aadhaar', formData.aadhaar || ''); // Send empty value if not provided
      formDataToSend.append('genderId', formData.genderId.toString());
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('occupation', formData.occupation);
      formDataToSend.append('pinCode', formData.pinCode);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('agreeDeclaration', formData.agreeDeclaration.toString());
      
      // Add photo if available
      if (formData.photo && formData.photo.uri) {
        // Create a file-like object for the photo
        const photo = {
          uri: formData.photo.uri,
          type: formData.photo.type || 'image/jpeg',
          name: formData.photo.fileName || `photo_${Date.now()}.jpg`,
        };
        
        // For React Native, we need to append the file object directly
        formDataToSend.append('photo', photo as any);
        
        console.log("Photo prepared for upload:", {
          name: photo.name,
          type: photo.type,
          size: formData.photo.fileSize
        });
      } else {
        console.log("No photo provided for upload");
      }

      console.log("Payload",formData);
      
      // Make API call using the imported postFormData function
      const responseData = await postFormData(API.PATIENT_REGISTER_API, formDataToSend);
      console.log("Registration response:", responseData);
      
      Alert.alert(
        'Registration Successful',
        responseData.message || 'Your patient registration has been completed successfully. Please login to continue.',
        [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate(PAGES.LOGIN)
          }
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle axios error responses
      if (error.response && error.response.data) {
        Alert.alert(
          'Registration Failed',
          error.response.data.message || 'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Network Error',
          'Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoginPress = () => {
    navigation.navigate(PAGES.LOGIN);
  };

  return (
    <PatientRegisterView 
      onSubmit={handlePatientRegistration}
      onLoginPress={handleLoginPress}
      loading={loading}
    />
  );
};

export default PatientRegister;