import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginView from './LoginView';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { post } from '../../../services/apiServices';
import { API } from '../../../config/api';
import { PAGES } from '../../../constants/pages';
import StorageService from '../../../services/storageService';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserProfile, UserRole } from '../../../store/slices/userSlice';

// Validation utility functions
const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
};

const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (password.length > 50) return 'Password must be less than 50 characters';
    return null;
};

const validatePhoneNumber = (phoneNumber: string): string | null => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneNumber.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) return 'Please enter a valid phone number';
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) return 'Phone number must be at least 10 digits';
    if (digitsOnly.length > 15) return 'Phone number must be less than 15 digits';
    return null;
};

const validateOTP = (otp: string): string | null => {
    const otpRegex = /^\d{6}$/;
    if (!otp.trim()) return 'OTP is required';
    if (!otpRegex.test(otp)) return 'OTP must be exactly 6 digits';
    return null;
};

type LoginProps = {};

interface LoginResponse {
    token: string;
    role: UserRole;
    message?: string;
    userId:string;
    email:string;
}

const Login: React.FC<LoginProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const dispatch = useDispatch();

    const handlePasswordLogin = async (email: string, password: string) => {
        // Validate email
        console.log("Logging in with ",email,password)
        const emailError = validateEmail(email);
        if (emailError) {
            setSnackbarMessage(emailError);
            setSnackbarVisible(true);
            return;
        }

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setSnackbarMessage(passwordError);
            setSnackbarVisible(true);
            return;
        }
        
            setLoading(true);
        try {
            const responseData = await post<LoginResponse>(API.LOGIN_API, { identifier: email, password });
            console.log("Login response:", responseData);
            
            if (!responseData.token) {
                throw new Error(responseData.message || 'Login failed. Please try again.');
            }

            // Save token and role to AsyncStorage
            await StorageService.save("userToken", responseData.token);
            await StorageService.save("userRole", responseData.role);
            await StorageService.save("userEmail", responseData.email);
            await StorageService.save("userId",responseData.userId)
            dispatch(setAuthenticated(true));
            dispatch(setUserProfile({ role: responseData.role,email:responseData.email,userId:responseData.userId }));
            
            // Show success message
            setSnackbarMessage(responseData.message || 'Login successful!');
            setSnackbarVisible(true);
            
            // Navigate to drawer navigator after a short delay
            setTimeout(() => {
                navigation.replace(PAGES.HOME);
            }, 0);
        } catch (error: any) {
            console.error('Login error:', error);
            // Check if error has a response with data
            if (error?.response?.data?.message) {
                setSnackbarMessage(error.response.data.message);
            } else if (error?.message) {
                setSnackbarMessage(error.message);
            } else {
                setSnackbarMessage('Login failed. Please try again.');
            }
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (phoneNumber: string) => {
        // Validate phone number
        const phoneError = validatePhoneNumber(phoneNumber);
        if (phoneError) {
            setSnackbarMessage(phoneError);
            setSnackbarVisible(true);
            return;
        }
        
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
            setSnackbarMessage('OTP sent successfully!');
            setSnackbarVisible(true);
        }, 2000);
    };

    const handleOTPLogin = async (otp: string) => {
        // Validate OTP
        const otpError = validateOTP(otp);
        if (otpError) {
            setSnackbarMessage(otpError);
            setSnackbarVisible(true);
            return;
        }
        
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage('Login successful!');
            setSnackbarVisible(true);
        }, 2000);
    };

    return (
        <LoginView 
            loading={loading}
            otpSent={otpSent}
            snackbarVisible={snackbarVisible}
            snackbarMessage={snackbarMessage}
            onPasswordLogin={handlePasswordLogin}
            onSendOTP={handleSendOTP}
            onOTPLogin={handleOTPLogin}
            onSnackbarDismiss={() => setSnackbarVisible(false)}
            navigation={navigation}
        />
    );
};

export default Login;