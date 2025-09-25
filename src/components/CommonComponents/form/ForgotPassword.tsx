import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import AvText from '../../../elements/AvText';
import AvTextInput from '../../../elements/AvTextInput';
import AvButton from '../../../elements/AvButton';
import AvCheckbox from '../../../elements/AvCheckbox';
import { COLORS } from '../../../constants/colors';
import { normalize } from '../../../constants/platform';
import AvImage from '../../../elements/AvImage';
import { IMAGES } from '../../../assets';

interface ForgotPasswordProps {
  title: string;
  description: string;
  inputPlaceholder: string;
  buttonText: string;
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
  methodOptions: { label: string; value: 'email' | 'phone' }[];
  selectedMethod: 'email' | 'phone';
  onMethodChange: (method: 'email' | 'phone') => void;
  rememberEmail?: boolean;
  onRememberEmailChange?: (remember: boolean) => void;
  email?: string;
  setEmail?: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  title,
  description,
  inputPlaceholder,
  buttonText,
  onSubmit,
  onBackToLogin,
  methodOptions,
  selectedMethod,
  onMethodChange,
  rememberEmail = false,
  onRememberEmailChange,
  email: propsEmail,
  setEmail: propsSetEmail,
}) => {
  const [localEmail, setLocalEmail] = useState(propsEmail || '');
  const [localRememberEmail, setLocalRememberEmail] = useState(rememberEmail);

  useEffect(() => {
    if (propsSetEmail) {
      propsSetEmail(localEmail);
    }
  }, [localEmail]);

  const handleRememberEmailChange = (checked: boolean) => {
    if (onRememberEmailChange) {
      onRememberEmailChange(checked);
    } else {
      setLocalRememberEmail(checked);
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
                source={IMAGES.FORGOT_PASSWORD}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <AvText type="heading_2" style={styles.title}>
              {title}
            </AvText>
            <AvText type="body" style={styles.description}>
              {description}
            </AvText>
            {methodOptions.length > 1 && (
              <View style={styles.methodContainer}>
                {methodOptions?.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.methodButton,
                      selectedMethod === option.value && styles.selectedMethod,
                    ]}
                    onPress={() => onMethodChange(option.value)}
                  >
                    <AvText
                      type="buttonText"
                      style={selectedMethod === option.value ? styles.selectedMethodText : styles.methodText}
                    >
                      {option.label}
                    </AvText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <AvTextInput
              label={selectedMethod === 'email' ? 'Email Address' : 'Phone Number'}
              placeholder={inputPlaceholder}
              mode="outlined"
              value={localEmail}
              onChangeText={setLocalEmail}
              keyboardType={selectedMethod === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoComplete={selectedMethod === 'email' ? 'email' : 'tel'}
              textContentType={selectedMethod === 'email' ? 'emailAddress' : 'telephoneNumber'}
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: COLORS.LIGHT_GREY,
                },
              }}
              style={styles.input}
            />
            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleRememberEmailChange(!(onRememberEmailChange ? rememberEmail : localRememberEmail))}
              >
                <AvCheckbox
                  checked={onRememberEmailChange ? rememberEmail : localRememberEmail}
                  setChecked={handleRememberEmailChange}
                  checkedColor={COLORS.PRIMARY}
                  uncheckedColor={COLORS.LIGHT_GREY}
                />
                <AvText type="caption" style={styles.rememberText}>
                  {selectedMethod === 'email' ? 'Remember this email' : 'Remember this number'}
                </AvText>
              </TouchableOpacity>
            </View>
            <AvButton
              mode="contained"
              onPress={() => onSubmit(localEmail)}
              style={styles.button}
              buttonColor={COLORS.SECONDARY}
            >
              {buttonText}
            </AvButton>
            <TouchableOpacity onPress={onBackToLogin} style={styles.backToLoginContainer}>
              <AvText type="caption" style={styles.backText}>
                Remember your password?{' '}
                <AvText type="caption" style={styles.backLink}>
                  Back to Login
                </AvText>
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
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    maxWidth: normalize(400),
  },
  content: {
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: normalize(10),
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
  methodContainer: {
    flexDirection: 'row',
    marginBottom: normalize(20),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(4),
  },
  methodButton: {
    flex: 1,
    padding: normalize(12),
    alignItems: 'center',
    borderRadius: normalize(6),
    borderWidth: 1,
    borderColor: COLORS.TRANSPARENT,
  },
  selectedMethod: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.SECONDARY,
    shadowColor: COLORS.PRIMARY_TXT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 2,
  },
  selectedMethodText: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: 'bold',
  },
  methodText: {
    color: COLORS.GREY,
  },
  input: {
    marginBottom: normalize(15),
    backgroundColor: COLORS.TRANSPARENT,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: normalize(10),
  },
  button: {
    marginBottom: normalize(20),
    borderRadius: normalize(5),
    padding: normalize(8)
  },
  backToLoginContainer: {
    alignItems: 'center',
  },
  backText: {
    textAlign: 'center',
    color: COLORS.GREY,
  },
  backLink: {
    color: COLORS.SECONDARY,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
