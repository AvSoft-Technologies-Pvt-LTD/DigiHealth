import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, MediaType, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { COLORS } from '../../../constants/colors';
import AvText from '../../../elements/AvText';
// import Header from '../../../components/Header';
import AvTextInput from '../../../elements/AvTextInput';
import { AvSelect } from '../../../elements/AvSelect';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIos, normalize } from '../../../constants/platform';
import Header from '../../../components/Header';
import AvImage from '../../../elements/AvImage';

export interface PatientFormData {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    aadhaar: string;
    genderId: number;
    dob: string;
    occupation: string;
    pinCode: string;
    city: string;
    district: string;
    state: string;
    agreeDeclaration: boolean;
    photo: Asset | null;
}

type FormErrors = Partial<Record<keyof PatientFormData, string>>;

interface PatientRegisterViewProps {
    onSubmit: (formData: PatientFormData) => void;
    onLoginPress: () => void;
    loading?: boolean;
};

const PatientRegisterView: React.FC<PatientRegisterViewProps> = ({
    onSubmit,
    onLoginPress,
    loading = false,
}) => {
    const [formData, setFormData] = useState<PatientFormData>({
        firstName: 'Haris',
        middleName: 'Ali',
        lastName: 'Patel',
        phone: '1234567863',
        email: 'haris@gmail.com',
        password: 'Test@123$$',
        confirmPassword: 'Test@123$$',
        aadhaar: '123456789012',
        genderId: 1,
        dob: '1990-09-26',
        occupation: 'Student',
        pinCode: '123456',
        city: 'Dharwad',
        district: 'Dharwad',
        state: 'Karnataka',
        agreeDeclaration: true,
        photo: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const updateFormData = <K extends keyof PatientFormData>(field: K, value: PatientFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const formatAadhaar = (input: string): string => {
        const digits = input.replace(/\D/g, '');
        return digits.replace(/(\d{4})(?=\d)/g, '$1-');
    };

    const handleAadhaarChange = (text: string) => {
        const digits = text.replace(/\D/g, '').substring(0, 12);
        const formatted = formatAadhaar(digits);
        updateFormData('aadhaar', digits);
        return formatted;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (formData.aadhaar && !/^[0-9]{12}$/.test(formData.aadhaar)) {
            newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
        }

        if (formData.pinCode && !/^[0-9]{6}$/.test(formData.pinCode)) {
            newErrors.pinCode = 'Please enter a valid 6-digit pin code';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.dob) {
            const dob = new Date(formData.dob);
            const today = new Date();
            if (dob > today) {
                newErrors.dob = 'Date of birth cannot be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Select Image',
            'Choose an option to select your photo',
            [
                { text: 'Camera', onPress: () => openCamera() },
                { text: 'Gallery', onPress: () => openGallery() },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const openCamera = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        launchImageLibrary(options, handleImageResponse);
    };

    const openGallery = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        launchImageLibrary(options, handleImageResponse);
    };

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel) {
            return;
        }
        if (response.errorMessage) {
            Alert.alert('Error', 'Failed to select image. Please try again.');
            return;
        }
        if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0];
            updateFormData('photo', selectedImage);
        } else {
            Alert.alert('Error', 'No image was selected. Please try again.');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);

        if (event?.type === 'dismissed') {
            return;
        }

        if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
            setErrors(prev => ({
                ...prev,
                dob: undefined
            }));

            const formattedDate = selectedDate.toISOString().split('T')[0];
            updateFormData('dob', formattedDate);
        } else if (event?.nativeEvent?.timestamp) {
            const dateFromTimestamp = new Date(event.nativeEvent.timestamp);
            const formattedDate = dateFromTimestamp.toISOString().split('T')[0];
            updateFormData('dob', formattedDate);
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const renderInput = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder: string,
        keyboardType: any = 'default',
        secureTextEntry = false,
        mandatory = false,
        fieldKey?: keyof PatientFormData
    ) => {
        const errorText = fieldKey ? errors[fieldKey] : '';
        const hasError = Boolean(errorText);

        const isPasswordField = fieldKey === 'password' || fieldKey === 'confirmPassword';
        const isPasswordVisible = fieldKey === 'password' ? showPassword : showConfirmPassword;
        const setPasswordVisibility = fieldKey === 'password'
            ? () => setShowPassword(!isPasswordVisible)
            : () => setShowConfirmPassword(!isPasswordVisible);

        const rightIcon = isPasswordField && value.length > 0 ? (
            <TextInput.Icon
                icon={isPasswordVisible ? "eye-off" : "eye"}
                onPress={setPasswordVisibility}
                color={COLORS.GREY}
                size={20}
            />
        ) : undefined;

        return (
            <View style={styles.inputContainer}>
                <AvTextInput
                    label={label + (mandatory ? ' *' : '')}
                    style={[
                        styles.input,
                        hasError ? styles.inputError : {}
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={isPasswordField ? !isPasswordVisible : secureTextEntry}
                    placeholderTextColor={COLORS.GREY}
                    right={rightIcon}
                    mode="outlined"
                    theme={{
                        colors: {
                            primary: COLORS.SECONDARY,
                            outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
                        }
                    }}
                />
                {errorText && (
                    <AvText type="caption" style={styles.errorText}>
                        {errorText}
                    </AvText>
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={isIos() ? 'padding' : 'height'}
            keyboardVerticalOffset={isIos() ? 90 : 0}
        >
            <Header
                title="Patient Registration"
                showBackButton={true}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.BLACK}
            />
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <AvText type="body" style={styles.subtitle}>Please fill in all the required information</AvText>
                    <View style={styles.form}>
                        {/* Personal Information */}
                        <AvText type="title_2" style={styles.sectionTitle}>Personal Information</AvText>
                        {renderInput('First Name', formData.firstName, text => updateFormData('firstName', text), 'Enter your first name', 'default', false, true, 'firstName')}
                        {renderInput('Middle Name', formData.middleName, text => updateFormData('middleName', text), 'Enter your middle name')}
                        {renderInput('Last Name', formData.lastName, text => updateFormData('lastName', text), 'Enter your last name', 'default', false, true, 'lastName')}
                        {renderInput('Phone Number', formData.phone, text => updateFormData('phone', text), 'Enter your phone number', 'phone-pad', false, true, 'phone')}
                        {renderInput('Email', formData.email, text => updateFormData('email', text), 'Enter your email address', 'email-address', false, true, 'email')}
                        {renderInput('Aadhaar Number', formatAadhaar(formData.aadhaar), handleAadhaarChange, 'Enter your 12-digit Aadhaar number', 'default', false, false, 'aadhaar')}

                        {/* Gender */}
                        <View style={styles.inputContainer}>
                            <AvSelect
                                label="Gender *"
                                required
                                items={[
                                    { label: 'Male', value: 1 },
                                    { label: 'Female', value: 2 },
                                    { label: 'Other', value: 3 },
                                ]}
                                selectedValue={formData.genderId}
                                onValueChange={(value) => updateFormData('genderId', value)}
                                placeholder="Select Gender"
                                error={!!errors.genderId}
                                errorText={errors.genderId}
                                mode="outlined"
                                theme={{
                                    colors: {
                                        primary: COLORS.SECONDARY,
                                        outline: errors.genderId ? COLORS.ERROR : COLORS.LIGHT_GREY,
                                    }
                                }}
                            />
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.inputContainer}>
                            <AvText type="Subtitle_1" style={styles.label}>
                                Date of Birth *
                            </AvText>
                            <TouchableOpacity
                                style={[styles.dateButton, errors.dob ? styles.inputError : {}]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <AvText type="body" style={[styles.dateText, !formData.dob ? styles.placeholderText : {}]}>
                                    {formData.dob ? new Date(formData.dob).toDateString() : 'Select Date of Birth'}
                                </AvText>
                            </TouchableOpacity>
                            {errors.dob && <AvText type="caption" style={styles.errorText}>{errors.dob}</AvText>}
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.dob ? new Date(formData.dob) : new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        )}

                        {renderInput('Occupation', formData.occupation, text => updateFormData('occupation', text), 'Enter your occupation', 'default', false, true, 'occupation')}

                        {/* Photo Upload */}
                        <View style={styles.inputContainer}>
                            <AvText type="Subtitle_1" style={styles.label}>
                                Upload Photo *
                            </AvText>
                            <TouchableOpacity
                                style={[styles.photoButton, errors.photo ? styles.inputError : {}]}
                                onPress={handleImagePicker}
                            >
                                {formData.photo?.uri ? (
                                    <AvImage source={{ uri: formData.photo.uri }} style={styles.photoPreview} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <Icon name="add-a-photo" size={30} color={COLORS.GREY} />
                                        <AvText type="body" style={styles.photoButtonText}>Upload Photo</AvText>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {errors.photo && <AvText type="caption" style={styles.errorText}>{errors.photo}</AvText>}
                        </View>

                        {/* Address Information */}
                        <AvText type="title_2" style={styles.sectionTitle}>Address Information</AvText>
                        {renderInput('Pin Code', formData.pinCode, text => updateFormData('pinCode', text), 'Enter your pin code', 'numeric', false, true, 'pinCode')}
                        {renderInput('City', formData.city, text => updateFormData('city', text), 'Enter your city', 'default', false, true, 'city')}
                        {renderInput('District', formData.district, text => updateFormData('district', text), 'Enter your district', 'default', false, true, 'district')}
                        {renderInput('State', formData.state, text => updateFormData('state', text), 'Enter your state', 'default', false, true, 'state')}

                        {/* Security */}
                        <AvText type="title_2" style={styles.sectionTitle}>Security</AvText>
                        {renderInput('Password', formData.password, text => updateFormData('password', text), 'Enter your password', 'default', true, true, 'password')}
                        {renderInput('Confirm Password', formData.confirmPassword, text => updateFormData('confirmPassword', text), 'Confirm your password', 'default', true, true, 'confirmPassword')}

                        {/* Terms and Conditions */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => updateFormData('agreeDeclaration', !formData.agreeDeclaration)}
                            >
                                <View style={[styles.checkboxInner, formData.agreeDeclaration && styles.checkboxChecked]}>
                                    {formData.agreeDeclaration && <AvText type="caption" style={styles.checkmark}>✓</AvText>}
                                </View>
                                <AvText type="body" style={styles.checkboxText}>
                                    I agree to the declaration *
                                </AvText>
                            </TouchableOpacity>
                            {errors.agreeDeclaration && <AvText type="caption" style={styles.errorText}>{errors.agreeDeclaration}</AvText>}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <AvText type="buttonText" style={styles.submitButtonText}>
                                {loading ? 'Processing...' : 'Verify & Proceed'}
                            </AvText>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginLinkContainer}>
                            <AvText type="body" style={styles.loginLinkText}>Already have an account? </AvText>
                            <TouchableOpacity onPress={onLoginPress}>
                                <AvText type="Link" style={styles.loginLink}>Login Here</AvText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: normalize(20),
    },
    content: {
        padding: normalize(20),
        flex: 1,
        width: '100%',
    },
    header: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(40),
        paddingBottom: normalize(20),
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        fontSize: normalize(16),
        textAlign: 'center',
        marginTop: normalize(8),
        opacity: 0.9,
    },
    form: {
        padding: normalize(20),
    },
    sectionTitle: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginTop: normalize(20),
        marginBottom: normalize(15),
    },
    inputContainer: {
        marginBottom: normalize(16),
    },
    label: {
        fontSize: normalize(14),
        fontWeight: '500',
        color: COLORS.BLACK,
        marginBottom: normalize(4),
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: normalize(4),
        marginLeft: normalize(8),
        alignSelf: 'flex-start',
        zIndex: 1,
    },
    input: {
        height: normalize(56),
        backgroundColor: COLORS.WHITE,
        borderRadius: 8,
        fontSize: normalize(16),
        color: COLORS.BLACK,
    },
    inputError: {
        borderColor: COLORS.ERROR,
    },
    errorText: {
        color: COLORS.ERROR,
        fontSize: normalize(12),
        marginTop: normalize(4),
        marginLeft: normalize(12),
    },
    dateButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(14),
        backgroundColor: COLORS.WHITE,
    },
    dateText: {
        fontSize: normalize(16),
        color: COLORS.BLACK,
    },
    placeholderText: {
        color: COLORS.GREY,
    },
    photoButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        padding: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        minHeight: normalize(120),
    },
    photoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoButtonText: {
        fontSize: normalize(16),
        color: COLORS.GREY,
        marginTop: normalize(8),
    },
    photoPreview: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: 8,
    },
    checkboxContainer: {
        marginBottom: normalize(20),
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxInner: {
        width: normalize(20),
        height: normalize(20),
        borderWidth: 2,
        borderColor: COLORS.PRIMARY,
        borderRadius: 4,
        marginRight: normalize(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.PRIMARY,
    },
    checkmark: {
        color: COLORS.WHITE,
        fontSize: normalize(14),
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: normalize(16),
        color: COLORS.BLACK,
        flex: 1,
    },
    submitButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: normalize(15),
        borderRadius: 8,
        alignItems: 'center',
        marginTop: normalize(10),
        marginBottom: normalize(20),
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.WHITE,
        fontSize: normalize(18),
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(10),
    },
    loginLinkText: {
        fontSize: normalize(16),
        color: COLORS.GREY,
    },
    loginLink: {
        fontSize: normalize(16),
        color: COLORS.PRIMARY,
        fontWeight: 'bold',
    },
});

export default PatientRegisterView;