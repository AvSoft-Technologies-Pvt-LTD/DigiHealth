import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Snackbar } from 'react-native-paper';
import PatientRegisterView, { PatientFormData } from './PatientRegisterView';
import { RootStackParamList } from '../../../types/navigation';
import { API } from '../../../config/api';
import { PAGES } from '../../../constants/pages';
import { postJson } from '../../../services/apiServices';


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

  // Function to convert image to base64
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Extract only the base64 data without the data URL prefix
          const base64Data = base64String.split(',')[1] || base64String;
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  };

  // Function to get image MIME type from URI
  const getImageMimeType = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  };

  // Function to validate image size
  const validateImageSize = (base64String: string): boolean => {
    try {
      // Calculate approximate size in bytes
      // Base64 string length * 3/4 gives approximate byte size
      const sizeInBytes = (base64String.length * 3) / 4;
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (sizeInBytes > maxSize) {
        showSnackbar('Image size should be less than 5MB. Please select a smaller image.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating image size:', error);
      return false;
    }
  };

  const handlePatientRegistration = async (formData: PatientFormData) => {
    setLoading(true);
    console.log("Form Data patient reg", formData);
    
    try {
      let photoBase64 = null;
      let photoMimeType = 'image/jpeg';
      
      // Handle photo conversion if available
      if (formData.photo?.uri) {
        try {
          console.log("Converting image to base64...");
          photoBase64 = await convertImageToBase64(formData.photo.uri);
          photoMimeType = getImageMimeType(formData.photo.uri);
          
          // Validate image size
          if (!validateImageSize(photoBase64)) {
            setLoading(false);
            return;
          }
          
          console.log("Image converted to base64 successfully", {
            size: `${Math.round((photoBase64.length * 3) / (4 * 1024))}KB`,
            type: photoMimeType
          });
        } catch (error: any) {
          console.error('Image conversion error:', error);
          showSnackbar('Failed to process image. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Create JSON payload for the request
      const payload = {
        firstName: formData.firstName,
        middleName: formData.middleName || '',
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        // Format Aadhaar with hyphens after every 4 digits
        aadhaar: formData.aadhaar.replace(/(\d{4})(?=\d)/g, '$1-'),
        genderId: formData.genderId,
        dob: formData.dob,
        occupation: formData.occupation,
        pinCode: formData.pinCode,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        agreeDeclaration: formData.agreeDeclaration,
        photo: photoBase64, // Send base64 string or null
        photoMimeType: photoBase64 ? photoMimeType : null, // Optional: Send MIME type
      };

      console.log("Registration payload:", { 
        ...payload, 
        photo: photoBase64 ? `[Base64 Image - ${Math.round(photoBase64.length / 1024)}KB]` : 'No photo' 
      });
      
      // Make API call using JSON endpoint
      const responseData = await postJson(API.PATIENT_REGISTER_API, payload);

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
      
      // Handle different error types
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        showSnackbar(errorMessages.join(', '));
      } else if (error.message) {
        showSnackbar(error.message);
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