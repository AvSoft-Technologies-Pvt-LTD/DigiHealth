import React, { useState } from 'react';
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
import AvIcons from '../../../elements/AvIcons';
import { COLORS } from '../../../constants/colors';
import { normalize } from '../../../constants/platform';
import AvImage from '../../../elements/AvImage';
import { IMAGES } from '../../../assets';

interface ResetPasswordProps {
  title: string;
  description: string;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  buttonText: string;
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  onBackToLogin: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  title,
  description,
  newPasswordPlaceholder,
  confirmPasswordPlaceholder,
  buttonText,
  onSubmit,
  onBackToLogin,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                source={IMAGES.RESET_PASSWORD}
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

            <AvTextInput
              label={newPasswordPlaceholder}
              value={newPassword}
              mode="outlined"
              secureTextEntry={!showNewPassword}
              right={
                <AvIcons
                  type="MaterialIcons"
                  name={showNewPassword ? "visibility" : "visibility-off"}
                  size={normalize(24)}
                  color={COLORS.GREY}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
              onChangeText={setNewPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: COLORS.LIGHT_GREY,
                }
              }}
            />

            <AvTextInput
              label={confirmPasswordPlaceholder}
              value={confirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <AvIcons
                  type="MaterialIcons"
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={normalize(24)}
                  color={COLORS.GREY}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              onChangeText={setConfirmPassword}
              style={styles.input}
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: COLORS.LIGHT_GREY,
                }
              }}
            />

            <AvButton
              mode="contained"
              onPress={() => onSubmit(newPassword, confirmPassword)}
              style={styles.button}
              buttonColor={COLORS.SECONDARY}
            >
              {buttonText}
            </AvButton>

            <TouchableOpacity onPress={onBackToLogin}>
              <AvText type="caption" style={styles.backText}>
                Remember your password? <AvText type="caption" style={styles.backLink}>Back to Login</AvText>
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
  input: {
    marginBottom: normalize(16),
    backgroundColor: COLORS.TRANSPARENT,
  },
  button: {
    marginBottom: normalize(20),
    borderRadius: normalize(5),
    padding: normalize(8)
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

export default ResetPassword;
