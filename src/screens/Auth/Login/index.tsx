import React, { useState } from 'react';
import LoginView from './LoginView';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';

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

const Login: React.FC<LoginProps> = () => {
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage('Login successful!');
            setSnackbarVisible(true);
        }, 2000);
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

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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