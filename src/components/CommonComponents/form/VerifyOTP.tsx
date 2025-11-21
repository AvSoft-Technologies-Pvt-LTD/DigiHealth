import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,TouchableOpacity,
} from 'react-native';
import AvText from '../../../elements/AvText';
import AvButton from '../../../elements/AvButton';
import AvImage from '../../../elements/AvImage';
import { IMAGES } from '../../../assets';
import { COLORS } from '../../../constants/colors';
import { normalize } from '../../../constants/platform';
import { AvTextInput } from '../../../elements';

interface VerifyOTPProps {
  title: string;
  description: string;
  email: string;
  otpLength: number;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  resendTimer: number;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  title,
  description,
  email,
  otpLength,
  onVerify,
  onResend,
  onBack,
  resendTimer,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const [timer, setTimer] = useState(resendTimer);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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
        <View style={styles.card}>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <AvImage
                source={IMAGES.VERIFY_OTP}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <AvText type="heading_2" style={styles.title}>
              {title}
            </AvText>

            <AvText type="body" style={styles.description}>
              {description} <AvText type="body" style={styles.email}>{email}</AvText>
            </AvText>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <AvTextInput
                  key={index}
                  ref={(ref) => { if (ref) inputRefs.current[index] = ref }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    index === otpLength - 1 && otp[otpLength - 1] && styles.otpInputLastFilled,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <AvButton
              mode="contained"
              onPress={() => onVerify(otp.join(''))}
              style={styles.button}
              buttonColor={COLORS.SECONDARY}
            >
              Verify OTP
            </AvButton>

            <TouchableOpacity disabled={timer > 0} onPress={onResend}>
              <AvText type="caption" style={timer > 0 ? styles.disabledText : styles.resendText}>
                Didn't receive the code? {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
              </AvText>
            </TouchableOpacity>

            <TouchableOpacity onPress={onBack}>
              <AvText type="caption" style={styles.backText}>
                Wrong email? <AvText type="caption" style={styles.backLink}>Go back</AvText>
              </AvText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    justifyContent: 'center', // Center vertically
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    minHeight: Dimensions.get('window').height - normalize(100),
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(16),
    marginBottom: normalize(20),
    minHeight: 'auto',
    padding: normalize(24),
    shadowColor: COLORS.PRIMARY_TXT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: normalize(8),
    elevation: 5,
    width: '100%', // Ensure card takes full width of the container
    maxWidth: normalize(400), // Optional: Limit max width for larger screens
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  image: {
    width: normalize(200),
    height: normalize(200),
  },
  title: {
    marginBottom: normalize(10),
    color: COLORS.PRIMARY_TXT,
    textAlign: 'center',
  },
  description: {
    color: COLORS.GREY,
    marginBottom: normalize(30),
    textAlign: 'center',
  },
  email: {
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(30),
    width: '100%',
  },
  otpInput: {
    width: normalize(35),
    height: normalize(40),
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(8),
    textAlign: 'center',
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
    backgroundColor: COLORS.WHITE,
  },
  otpInputFilled: {
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.SUCCESS_BG,
  },
  otpInputLastFilled: {
    borderColor: COLORS.SECONDARY,
    borderWidth: 2,
  },
  button: {
    width: '100%',
    marginBottom: normalize(20),
    borderRadius: normalize(5),
    padding: normalize(8)
  },
  resendText: {
    color: COLORS.SECONDARY,
    textAlign: 'center',
    marginBottom: normalize(10),
    textDecorationLine: 'underline',
  },
  disabledText: {
    color: COLORS.GREY,
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  backText: {
    color: COLORS.GREY,
    textAlign: 'center',
  },
  backLink: {
    color: COLORS.SECONDARY,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default VerifyOTP;
