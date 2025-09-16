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
import Header from '../../../components/Header';
import AvTextInput from '../../../elements/AvTextInput';

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

type PatientRegisterViewProps = {
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
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        aadhaar: '',
        genderId: 0,
        dob: '',
        occupation: '',
        pinCode: '',
        city: '',
        district: '',
        state: '',
        agreeDeclaration: false,
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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
        if (!formData.genderId || formData.genderId === 0) newErrors.genderId = 'Gender is required';
        if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
        if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
        if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImagePicker = () => {
        console.log('handleImagePicker called');
        
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
        console.log('Image picker response:', response);
        
        if (response.didCancel) {
            console.log('User cancelled image picker');
            return;
        }

        if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
            Alert.alert('Error', 'Failed to select image. Please try again.');
            return;
        }

        if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0];
            console.log('Selected image:', selectedImage);
            updateFormData('photo', selectedImage);
        } else {
            Alert.alert('Error', 'No image was selected. Please try again.');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        console.log('Event:', event);
        console.log('Selected date:', selectedDate);
        console.log('Selected date type:', typeof selectedDate);
        
        setShowDatePicker(false);
        
        // Handle different platforms and event types
        if (event?.type === 'dismissed') {
            console.log('Date picker was dismissed');
            return;
        }
        
        if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
            console.log('Valid date selected:', selectedDate.toISOString());
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            updateFormData('dob', formattedDate);
        } else if (event?.nativeEvent?.timestamp) {
            // Fallback for some Android versions
            const dateFromTimestamp = new Date(event.nativeEvent.timestamp);
            console.log('Date from timestamp:', dateFromTimestamp.toISOString());
            const formattedDate = dateFromTimestamp.toISOString().split('T')[0];
            updateFormData('dob', formattedDate);
        } else {
            console.log('No valid date selected');
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
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
        return (
            <View style={styles.inputContainer}>
                <AvText type="Subtitle_1" style={styles.label}>
                    {label} {mandatory && <AvText type="caption" style={styles.mandatory}>*</AvText>}
                </AvText>
                <AvTextInput
                    style={[styles.input, errorText ? styles.inputError : {}]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={COLORS.GREY}
                />
                {errorText && <AvText type="caption" style={styles.errorText}>{errorText}</AvText>}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
                        {renderInput('Aadhaar Number', formData.aadhaar, text => updateFormData('aadhaar', text), 'Enter your 12-digit Aadhaar number', 'numeric')}

                        {/* Gender */}
                        <View style={styles.inputContainer}>
                            <AvText type="Subtitle_1" style={styles.label}>
                                Gender <AvText type="caption" style={styles.mandatory}>*</AvText>
                            </AvText>
                            <TouchableOpacity
                                style={[styles.pickerButton, errors.genderId ? styles.inputError : {}]}
                                onPress={() => {
                                    Alert.alert(
                                        'Select Gender',
                                        '',
                                        [
                                            { text: 'Male', onPress: () => updateFormData('genderId', 1) },
                                            { text: 'Female', onPress: () => updateFormData('genderId', 2) },
                                            { text: 'Other', onPress: () => updateFormData('genderId', 3) },
                                            { text: 'Cancel', style: 'cancel' }
                                        ]
                                    );
                                }}
                            >
                                <AvText type="body" style={[styles.pickerText, !formData.genderId ? styles.placeholderText : {}]}>
                                    {formData.genderId === 1 ? 'Male' : formData.genderId === 2 ? 'Female' : formData.genderId === 3 ? 'Other' : 'Select Gender'}
                                </AvText>
                            </TouchableOpacity>
                            {errors.genderId && <AvText type="caption" style={styles.errorText}>{errors.genderId}</AvText>}
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.inputContainer}>
                            <AvText type="Subtitle_1" style={styles.label}>
                                Date of Birth <AvText type="caption" style={styles.mandatory}>*</AvText>
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
                                Upload Photo <AvText type="caption" style={styles.mandatory}>*</AvText>
                            </AvText>
                            <TouchableOpacity
                                style={[styles.photoButton, errors.photo ? styles.inputError : {}]}
                                onPress={handleImagePicker}
                            >
                                {formData.photo ? (
                                    <Image source={{ uri: formData.photo.uri }} style={styles.photoPreview} />
                                ) : (
                                    <AvText type="body" style={styles.photoButtonText}>Choose Photo</AvText>
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
                        {renderInput('Create Password', formData.password, text => updateFormData('password', text), 'Enter your password', 'default', true, true, 'password')}
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
                                    I agree to the declaration
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
        paddingBottom: 20,
    },
    content: {
        padding: 20,
        flex: 1,
        width: '100%',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {

        textAlign: 'center',

    },
    subtitle: {
        fontSize: 16,
        // color: COLORS.WHITE,
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.9,
    },
    form: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginTop: 20,
        marginBottom: 15,

    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: 8,

    },
    mandatory: {
        color: COLORS.ERROR || '#FF0000',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: COLORS.WHITE,

    },
    inputError: {
        borderColor: COLORS.ERROR || '#FF0000',
    },
    errorText: {
        color: COLORS.ERROR || '#FF0000',
        fontSize: 14,
        marginTop: 5,

    },
    pickerButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: COLORS.WHITE,
    },
    pickerText: {
        fontSize: 16,
        color: COLORS.BLACK,

    },
    dateButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: COLORS.WHITE,
    },
    dateText: {
        fontSize: 16,
        color: COLORS.BLACK,

    },
    placeholderText: {
        color: COLORS.GREY,
    },
    photoButton: {
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        minHeight: 120,
    },
    photoButtonText: {
        fontSize: 16,
        color: COLORS.GREY,

    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    checkboxContainer: {
        marginBottom: 20,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: COLORS.PRIMARY,
        borderRadius: 4,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.PRIMARY,
    },
    checkmark: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: 16,
        color: COLORS.BLACK,
        flex: 1,

    },
    submitButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: 'bold',

    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginLinkText: {
        fontSize: 16,
        color: COLORS.GREY,

    },
    loginLink: {
        fontSize: 16,
        color: COLORS.PRIMARY,
        fontWeight: 'bold',

    },
});

export default PatientRegisterView;