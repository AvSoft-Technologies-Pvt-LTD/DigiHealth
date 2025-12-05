import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, MediaType, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { COLORS } from '../../../constants/colors';
import { AvSelect } from '../../../elements/AvSelect';
import { TextInput } from 'react-native-paper';
import { isIos, normalize } from '../../../constants/platform';
import Header from '../../../components/Header';
import { AvImage, AvTextInput, AvText, AvIcons } from '../../../elements';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { PAGES } from '../../../constants/pages';

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

interface FormError {
    field?: keyof PatientFormData;
    message: string;
    isActive: boolean;
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
        firstName: 'Sahana',
        middleName: 'S',
        lastName: 'Kadrolli',
        phone: '9998887776',
        email: 'sahana@gmail.com',
        password: 'Sahana@123',
        confirmPassword: 'Sahana@123',
        aadhaar: '999988887777',
        genderId: 2,
        dob: '1998-01-01',
        occupation: 'Developer',
        pinCode: '805104',
        city: 'Bangalore',
        district: 'Bangalore Urban',
        state: 'Karnataka',
        agreeDeclaration: true,
        photo: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formError, setFormError] = useState<FormError>({
        field: undefined,
        message: '',
        isActive: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigation = useNavigation();

    const updateFormData = <K extends keyof PatientFormData>(field: K, value: PatientFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        if (formError.isActive && formError.field === field) {
            setFormError(prev => ({ ...prev, isActive: false }));
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
        if (!formData.agreeDeclaration) newErrors.agreeDeclaration = 'You must agree to the terms and conditions';

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

        // Optional: Validate image size client-side if needed
        if (formData.photo?.fileSize && formData.photo.fileSize > 5 * 1024 * 1024) {
            newErrors.photo = 'Image size should be less than 5MB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Select Profile Photo',
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
            includeBase64: false, // We'll convert in container
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8, // Compress image quality
            saveToPhotos: false,
        };
        launchImageLibrary(options, handleImageResponse);
    };

    const openGallery = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false, // We'll convert in container
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8, // Compress image quality
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
            
            // Clear any previous photo errors
            if (errors.photo) {
                setErrors(prev => ({ ...prev, photo: undefined }));
            }
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            let errorField: keyof PatientFormData | undefined;

            if (errorMessage.toLowerCase().includes('pincode')) {
                errorField = 'pinCode';
            } else if (errorMessage.toLowerCase().includes('email')) {
                errorField = 'email';
            } else if (errorMessage.toLowerCase().includes('phone')) {
                errorField = 'phone';
            } else if (errorMessage.toLowerCase().includes('aadhaar')) {
                errorField = 'aadhaar';
            } else if (errorMessage.toLowerCase().includes('photo') || errorMessage.toLowerCase().includes('image')) {
                errorField = 'photo';
            }

            setFormError({
                field: errorField,
                message: errorMessage,
                isActive: true
            });
        }
    };

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
                size={18}
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
                    dense={true}
                    theme={{
                        colors: {
                            primary: COLORS.SECONDARY,
                            outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
                            background: COLORS.WHITE,
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
            keyboardVerticalOffset={isIos() ? 60 : 0}
        >
            <Header
                title={PAGES.DOCTOR_REGISTER}
                showBackButton={true}
                onLoginPress={() => navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: PAGES.LOGIN }],
                    })
                )}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.PRIMARY}
            />
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <AvText type="h4" style={styles.title}>Create Account</AvText>
                        <AvText type="body2" style={styles.subtitle}>Fill in your details to get started</AvText>
                    </View>

                    <View style={styles.form}>
                        {/* Personal Information Section */}
                        <View style={styles.section}>
                            <AvText type="subtitle1" style={styles.sectionTitle}>Personal Information</AvText>

                            {/* Name Row - Compact Layout */}
                            <View style={styles.row}>
                                <View style={[styles.flex1, styles.rightSpacing]}>
                                    {renderInput('First Name', formData.firstName, text => updateFormData('firstName', text), 'First name', 'default', false, true, 'firstName')}
                                </View>
                                <View style={styles.flex1}>
                                    {renderInput('Last Name', formData.lastName, text => updateFormData('lastName', text), 'Last name', 'default', false, true, 'lastName')}
                                </View>
                            </View>

                            {renderInput('Middle Name', formData.middleName, text => updateFormData('middleName', text), 'Middle name (optional)')}

                            {/* Contact Row */}
                            <View style={styles.row}>
                                <View style={[styles.flex1, styles.rightSpacing]}>
                                    {renderInput('Phone', formData.phone, text => updateFormData('phone', text), 'Phone number', 'phone-pad', false, true, 'phone')}
                                </View>
                                <View style={styles.flex1}>
                                    {renderInput('Email', formData.email, text => updateFormData('email', text), 'Email address', 'email-address', false, true, 'email')}
                                </View>
                            </View>

                            {renderInput('Aadhaar', formatAadhaar(formData.aadhaar), handleAadhaarChange, 'Aadhaar number', 'default', false, false, 'aadhaar')}

                            {/* Gender and DOB Row */}
                            <View style={styles.row}>
                                <View style={[styles.flex1, styles.rightSpacing]}>
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
                                            dense={true}
                                            theme={{
                                                colors: {
                                                    primary: COLORS.SECONDARY,
                                                    outline: errors.genderId ? COLORS.ERROR : COLORS.LIGHT_GREY,
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.flex1}>
                                    <View style={styles.inputContainer}>
                                        <AvText type="caption" style={styles.label}>
                                            Date of Birth *
                                        </AvText>
                                        <TouchableOpacity
                                            style={[styles.dateButton, errors.dob ? styles.inputError : {}]}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <AvText type="body2" style={[styles.dateText, !formData.dob ? styles.placeholderText : {}]}>
                                                {formData.dob ? new Date(formData.dob).toLocaleDateString() : 'Select DOB'}
                                            </AvText>
                                        </TouchableOpacity>
                                        {errors.dob && <AvText type="caption" style={styles.errorText}>{errors.dob}</AvText>}
                                    </View>
                                </View>
                            </View>

                            {renderInput('Occupation', formData.occupation, text => updateFormData('occupation', text), 'Occupation', 'default', false, true, 'occupation')}

                            {/* Photo Upload */}
                            <View style={styles.inputContainer}>
                                <AvText type="caption" style={styles.label}>
                                    Profile Photo
                                </AvText>
                                <TouchableOpacity
                                    style={[styles.photoButton, errors.photo ? styles.inputError : {}]}
                                    onPress={handleImagePicker}
                                >
                                    {formData.photo?.uri ? (
                                        <View style={styles.photoPreviewContainer}>
                                            <AvImage 
                                                source={{ uri: formData.photo.uri }} 
                                                style={styles.photoPreview} 
                                                resizeMode="cover"
                                            />
                                            <TouchableOpacity 
                                                style={styles.removePhotoButton}
                                                onPress={() => updateFormData('photo', null)}
                                            >
                                                <AvIcons type="MaterialIcons" name="close" size={16} color={COLORS.WHITE} />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.photoPlaceholder}>
                                            <AvIcons type="MaterialIcons" name="add-a-photo" size={24} color={COLORS.GREY} />
                                            <AvText type="caption" style={styles.photoButtonText}>Add Photo</AvText>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {errors.photo && <AvText type="caption" style={styles.errorText}>{errors.photo}</AvText>}
                                {formData.photo?.uri && (
                                    <AvText type="caption2" style={styles.photoInfoText}>
                                        {formData.photo.fileName || 'Selected image'} 
                                        {formData.photo.fileSize ? ` • ${Math.round(formData.photo.fileSize / 1024)}KB` : ''}
                                    </AvText>
                                )}
                            </View>
                        </View>

                        {/* Address Information Section */}
                        <View style={styles.section}>
                            <AvText type="subtitle1" style={styles.sectionTitle}>Address Information</AvText>

                            {/* Pincode and City Row */}
                            <View style={styles.row}>
                                <View style={[styles.flex2, styles.rightSpacing]}>
                                    <AvTextInput
                                        label="Pincode *"
                                        value={formData.pinCode}
                                        onChangeText={(text) => updateFormData('pinCode', text.replace(/[^0-9]/g, ''))}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        error={!!errors.pinCode || (formError.isActive && formError.field === 'pinCode')}
                                        errorText={errors.pinCode || (formError.field === 'pinCode' ? formError.message : '')}
                                        mode="outlined"
                                        dense={true}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.flex3}>
                                    {renderInput('City', formData.city, text => updateFormData('city', text), 'City', 'default', false, true, 'city')}
                                </View>
                            </View>

                            {/* District and State Row */}
                            <View style={styles.row}>
                                <View style={[styles.flex1, styles.rightSpacing]}>
                                    {renderInput('District', formData.district, text => updateFormData('district', text), 'District', 'default', false, true, 'district')}
                                </View>
                                <View style={styles.flex1}>
                                    {renderInput('State', formData.state, text => updateFormData('state', text), 'State', 'default', false, true, 'state')}
                                </View>
                            </View>
                        </View>

                        {/* Security Section */}
                        <View style={styles.section}>
                            <AvText type="subtitle1" style={styles.sectionTitle}>Security</AvText>

                            {/* Password Row */}
                            <View style={styles.row}>
                                <View style={[styles.flex1, styles.rightSpacing]}>
                                    {renderInput('Password', formData.password, text => updateFormData('password', text), 'Password', 'default', true, true, 'password')}
                                </View>
                                <View style={styles.flex1}>
                                    {renderInput('Confirm', formData.confirmPassword, text => updateFormData('confirmPassword', text), 'Confirm password', 'default', true, true, 'confirmPassword')}
                                </View>
                            </View>
                        </View>

                        {/* Terms and Submit Section */}
                        <View style={styles.section}>
                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity
                                    style={styles.checkbox}
                                    onPress={() => updateFormData('agreeDeclaration', !formData.agreeDeclaration)}
                                >
                                    <View style={[styles.checkboxInner, formData.agreeDeclaration && styles.checkboxChecked]}>
                                        {formData.agreeDeclaration && <AvText type="caption" style={styles.checkmark}>✓</AvText>}
                                    </View>
                                    <AvText type="body2" style={styles.checkboxText}>
                                        I agree to the terms and conditions *
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
                                <AvText type="button" style={styles.submitButtonText}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </AvText>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.loginLinkContainer}>
                                <AvText type="body2" style={styles.loginLinkText}>Already have an account? </AvText>
                                <TouchableOpacity onPress={onLoginPress}>
                                    <AvText type="link" style={styles.loginLink}>Sign In</AvText>
                                </TouchableOpacity>
                            </View>

                            {/* Error Message */}
                            {formError.isActive && !formError.field && (
                                <View style={styles.errorContainer}>
                                    <AvText type="caption" style={styles.errorText}>
                                        {formError.message}
                                    </AvText>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.dob ? new Date(formData.dob) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}
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
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: normalize(20),
    },
    content: {
        flex: 1,
        paddingHorizontal: normalize(16),
    },
    headerSection: {
        alignItems: 'center',
        marginVertical: normalize(20),
    },
    title: {
        color: COLORS.PRIMARY,
        fontWeight: '600',
        marginBottom: normalize(4),
    },
    subtitle: {
        color: COLORS.GREY,
        textAlign: 'center',
    },
    form: {
        marginBottom: normalize(20),
    },
    section: {
        marginBottom: normalize(24),
    },
    sectionTitle: {
        color: COLORS.PRIMARY,
        fontWeight: '600',
        marginBottom: normalize(16),
        paddingBottom: normalize(8),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GREY,
    },
    row: {
        flexDirection: 'row',
        marginBottom: normalize(12),
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    flex3: {
        flex: 3,
    },
    rightSpacing: {
        marginRight: normalize(8),
    },
    inputContainer: {
        marginBottom: normalize(12),
    },
    input: {
        backgroundColor: COLORS.WHITE,
        fontSize: normalize(14),
    },
    inputError: {
        borderColor: COLORS.ERROR,
    },
    errorText: {
        color: COLORS.ERROR,
        marginTop: normalize(4),
        fontSize: normalize(12),
    },
    label: {
        color: COLORS.DARK_GREY,
        marginBottom: normalize(8),
        fontSize: normalize(14),
        fontWeight: '500',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: normalize(4),
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(12),
        backgroundColor: COLORS.WHITE,
    },
    dateText: {
        color: COLORS.BLACK,
        fontSize: normalize(14),
    },
    placeholderText: {
        color: COLORS.GREY,
    },
    photoButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: normalize(8),
        padding: normalize(12),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        minHeight: normalize(100),
    },
    photoPreviewContainer: {
        position: 'relative',
        width: normalize(80),
        height: normalize(80),
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        borderRadius: normalize(40),
    },
    removePhotoButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.ERROR,
        borderRadius: normalize(10),
        width: normalize(20),
        height: normalize(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoButtonText: {
        color: COLORS.GREY,
        marginTop: normalize(8),
        fontSize: normalize(12),
    },
    photoInfoText: {
        marginTop: normalize(4),
        color: COLORS.GREY,
        fontSize: normalize(12),
        textAlign: 'center',
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
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: normalize(4),
        marginRight: normalize(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
    },
    checkmark: {
        color: COLORS.WHITE,
        fontSize: normalize(12),
        fontWeight: 'bold',
    },
    checkboxText: {
        color: COLORS.DARK_GREY,
        flex: 1,
    },
    submitButton: {
        backgroundColor: COLORS.PRIMARY,
        borderRadius: normalize(8),
        paddingVertical: normalize(14),
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.LIGHT_GREY,
        opacity: 0.7,
    },
    submitButtonText: {
        color: COLORS.WHITE,
        fontWeight: '600',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    loginLinkText: {
        color: COLORS.GREY,
    },
    loginLink: {
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        padding: normalize(12),
        borderRadius: normalize(8),
        marginTop: normalize(12),
    },
});

export default PatientRegisterView;