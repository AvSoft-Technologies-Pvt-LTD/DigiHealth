import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  Snackbar,
} from 'react-native-paper';
import AvText from '../../../elements/AvText';
import { COLORS } from '../../../constants/colors';
import { PAGES } from '../../../constants/pages';
import { RootStackParamList } from '../../../types/navigation';
import AvButton from '../../../elements/AvButton';
import AvTextInput from '../../../elements/AvTextInput';
import { normalize } from '../../../constants/platform';

type LoginViewProps = {
  loading: boolean;
  otpSent: boolean;
  snackbarVisible: boolean;
  snackbarMessage: string;
  onPasswordLogin: (email: string, password: string) => Promise<void>;
  onSendOTP: (phoneNumber: string) => Promise<void>;
  onOTPLogin: (otp: string) => Promise<void>;
  onSnackbarDismiss: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const LoginView: React.FC<LoginViewProps> = ({
  loading,
  otpSent,
  snackbarVisible,
  snackbarMessage,
  onPasswordLogin,
  onSendOTP,
  onOTPLogin,
  onSnackbarDismiss,
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState('password');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    if (value.trim() === '') {
      setPhoneNumberError('Phone number is required');
    } else {
      setPhoneNumberError('');
    }
  };

  const renderPasswordTab = () => (
    <View style={styles.tabContent}>

      <AvTextInput
        label={"Email Address"}
        value={email}
        mode='outlined'
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
        theme={{
          colors: {
            primary: COLORS.SECONDARY,
            outline: COLORS.LIGHT_GREY,
          }
        }}
      />

      <AvTextInput
        label={"Enter Password"}
        value={password}
        mode="outlined"
        returnKeyType="done"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        secureTextEntry={showPassword}
        onChangeText={setPassword}
        style={styles.input}
        theme={{
          colors: {
            primary: COLORS.SECONDARY,
            outline: COLORS.LIGHT_GREY,
          }
        }}
      />

      <AvButton
        mode="text"
        onPress={() => { console.log("Forgot Password CLiked") }}
        style={styles.forgotPassword}
        labelStyle={styles.forgotPasswordText}
      >
        Forgot Password?
      </AvButton>

      <AvButton
        mode="contained"
        onPress={() => onPasswordLogin(email, password)}
        loading={loading}
        disabled={loading}
        style={styles.loginButton}
        buttonColor={COLORS.SECONDARY}
      >
        <AvText type={"buttonText"} style={{ color: COLORS.WHITE }}>
          {loading ? 'Signing In...' : 'Sign In'}
        </AvText>
      </AvButton>
    </View>
  );

  const renderOTPTab = () => (
    <View style={styles.tabContent}>
      <AvTextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
        theme={{
          colors: {
            primary: COLORS.SECONDARY,
            outline: COLORS.LIGHT_GREY,
          }
        }}
      />
      {phoneNumberError ? (
        <AvText type="caption" style={styles.errorText}>
          {phoneNumberError}
        </AvText>
      ) : null}

      {!otpSent ? (
        <Button
          mode="contained"
          onPress={() => phoneNumber.trim() ? onSendOTP(phoneNumber) : handlePhoneNumberChange('')}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
          buttonColor={COLORS.SECONDARY}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      ) : (
        <>
          <AvTextInput
            label="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            mode="outlined"
            keyboardType="numeric"
            maxLength={6}
            style={styles.input}
            theme={{
              colors: {
                primary: COLORS.SECONDARY,
                outline: COLORS.LIGHT_GREY,
              }
            }}
          />

          <Button
            mode="text"
            onPress={() => onSendOTP(phoneNumber)}
            style={styles.resendButton}
            labelStyle={styles.resendButtonText}
          >
            Resend OTP
          </Button>

          <Button
            mode="contained"
            onPress={() => onOTPLogin(otp)}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            labelStyle={styles.loginButtonText}
            buttonColor={COLORS.SECONDARY}
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </Button>
        </>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer} />
          <AvText type="heading_2" style={styles.title}>Login to your Account</AvText>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard} elevation={4}>
          <Card.Content>
            <AvText type="mainTitle" style={styles.welcomeText}>Welcome Back!</AvText>
            <AvText type="body" style={styles.descriptionText}>
              Sign in to access your health dashboard
            </AvText>

            {/* Tab Selector */}
            <SegmentedButtons
              value={activeTab}
              onValueChange={setActiveTab}
              buttons={[
                {
                  value: 'password',
                  label: 'Password',
                },
                {
                  value: 'otp',
                  label: 'OTP',
                },
              ]}
              style={styles.segmentedButtons}
              theme={{
                colors: {
                  secondaryContainer: COLORS.SECONDARY,
                  onSecondaryContainer: COLORS.WHITE,
                  outline: COLORS.LIGHT_GREY,
                }
              }}
            />

            {/* Tab Content */}
            {activeTab === 'password' ? renderPasswordTab() : renderOTPTab()}



            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <AvText type="body" style={styles.signupText}>Don't have an account? </AvText>
              <Button
                mode="text"
                onPress={() => { navigation.navigate(PAGES.REGISTER) }}
                labelStyle={styles.signupLink}
              >
                Sign Up
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onSnackbarDismiss}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    minHeight: Dimensions.get('window').height - normalize(100),
  },
  header: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  logoContainer: {
    width: normalize(80),
    height: normalize(80),
    marginBottom: normalize(16),
  },
  logoText: {
    fontSize: normalize(40),
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: normalize(8),
  },
  subtitle: {
    fontSize: normalize(16),
    color: COLORS.GREY,
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(16),
    marginBottom: normalize(20),
    minHeight: 'auto',
  },
  welcomeText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: normalize(8),
  },
  descriptionText: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    textAlign: 'center',
    marginBottom: normalize(24),
  },
  segmentedButtons: {
    marginBottom: normalize(24),
  },
  tabContent: {
    marginBottom: normalize(20),
  },
  input: {
    marginBottom: normalize(16),
    backgroundColor: COLORS.WHITE,
  },
  forgotPassword: {
    backgroundColor: COLORS.TRANSPARENT,
    alignSelf: 'flex-end',
    marginBottom: normalize(16),
  },
  forgotPasswordText: {
    color: COLORS.SECONDARY,
    fontSize: normalize(14),
  },
  loginButton: {
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  loginButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'flex-end',
    marginBottom: normalize(16),
  },
  resendButtonText: {
    color: COLORS.SECONDARY,
    fontSize: normalize(14),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(20),
  },
  divider: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GREY,
  },
  dividerText: {
    marginHorizontal: normalize(16),
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(16),
    marginBottom: normalize(24),
  },
  socialButton: {
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  socialButtonText: {
    fontSize: normalize(12),
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.GREY,
    fontSize: normalize(14),
  },
  signupLink: {
    color: COLORS.SECONDARY,
    fontSize: normalize(14),
    fontWeight: '600',
  },
  snackbar: {
    backgroundColor: COLORS.SUCCESS,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: normalize(12),
    marginTop: normalize(4),
    marginLeft: normalize(12),
    marginBlock: normalize(12),
  },
});

export default LoginView;