import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { PAGES } from '../../../constants/pages';
import ForgotPassword from '../../../components/CommonComponents/form/ForgotPassword';
import VerifyOTP from '../../../components/CommonComponents/form/VerifyOTP';
import ResetPassword from '../../../components/CommonComponents/form/ResetPassword';

type PasswordResetPageRouteProp = RouteProp<RootStackParamList, 'PasswordResetPage'>;

interface PasswordResetPageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ navigation }) => {
  const route = useRoute<PasswordResetPageRouteProp>();
  const { email: routeEmail } = route.params || {};
  const [screen, setScreen] = useState<'forgot' | 'verify' | 'reset'>('forgot');
  const [email, setEmail] = useState(routeEmail || '');

  const handleForgotSubmit = (email: string) => {
    setEmail(email);
    setScreen('verify');
    console.log(`OTP sent to ${email}`);
  };

  const handleVerifySubmit = (otp: string) => {
    setScreen('reset');
  };

  const handleResetSubmit = (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(`Password reset for ${email}`);
    navigation.navigate(PAGES.LOGIN);
  };

  const goBackToLogin = () => navigation.navigate(PAGES.LOGIN);
  const goBackToForgot = () => setScreen('forgot');
  const goBackToVerify = () => setScreen('verify');

  const forgotPasswordProps = {
    title: "Forgot Password",
    description: "Enter your email to receive a verification code.",
    inputPlaceholder: "Enter your email",
    buttonText: "Send Code",
    onSubmit: handleForgotSubmit,
    onBackToLogin: goBackToLogin,
    methodOptions: [{ label: "Email", value: "email" }],
    selectedMethod: "email" as const,
    onMethodChange: () => {},
    email: email,
    setEmail: setEmail,
  };

  const verifyOTPProps = {
    title: "Verify OTP",
    description: `Enter the OTP sent to ${email}`,
    email,
    otpLength: 6,
    onVerify: handleVerifySubmit,
    onResend: () => console.log("Resend OTP"),
    onBack: goBackToForgot,
    resendTimer: 60,
  };

  const resetPasswordProps = {
    title: "Reset Password",
    description: "Enter your new password.",
    newPasswordPlaceholder: "New Password",
    confirmPasswordPlaceholder: "Confirm Password",
    buttonText: "Reset Password",
    onSubmit: handleResetSubmit,
    onBackToLogin: goBackToLogin,
  };

  return (
    <>
      {screen === 'forgot' && <ForgotPassword {...forgotPasswordProps} />}
      {screen === 'verify' && <VerifyOTP {...verifyOTPProps} />}
      {screen === 'reset' && <ResetPassword {...resetPasswordProps} />}
    </>
  );
};

export default PasswordResetPage;