import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedRole, UserRole } from '../../../store/slices/userSlice';
import { RootStackParamList } from '../../../types/navigation';
import RegisterView from './RegisterView';
import { PAGES } from '../../../constants/pages';

type RegisterProps = {
  // Add any props here if needed
};

const Register: React.FC<RegisterProps> = () => {
  const dispatch = useAppDispatch();
  const selectedRole = useAppSelector((state) => state.user.userProfile.role);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRoleSelect = (role: UserRole) => {
    // Dispatch the selected role to Redux store
    dispatch(setSelectedRole(role));
    // Navigate to appropriate registration screen based on role
    if (role) {
      switch (role) {
        case "Patient":
          navigation.navigate(PAGES.PATIENT_REGISTER);
          break;
        case "Doctor":
          navigation.navigate(PAGES.DOCTOR_REGISTER);
          break;
        case "Hospital":
          // TODO: Create HospitalRegister screen
          Alert.alert('Coming Soon', 'Hospital registration will be available soon.');
          break;
        case "Labs/Scan":
          // TODO: Create LabsScanRegister screen
          Alert.alert('Coming Soon', 'Labs/Scan registration will be available soon.');
          break;
        default:
          navigation.navigate(PAGES.HOME);
          break;
      }
    }
  };

  return (
    <RegisterView 
      onRoleSelect={handleRoleSelect} 
      selectedRole={selectedRole}
      navigation={navigation}
    />
  );
};

export default Register;