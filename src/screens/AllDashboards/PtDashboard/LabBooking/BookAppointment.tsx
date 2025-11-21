import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AvText from '../../../../elements/AvText';
import DynamicForm from '../../../../components/CommonComponents/form/AvForm';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';
import { AvIcons } from '../../../../elements';

// Define RootStackParamList with correct route keys
type RootStackParamList = {
  [PAGES.LAB_BOOK_APPOINTMENT]: {
    lab: any;
    cart: any[];
  };
  [PAGES.LAB_PAYMENT]: {
    lab: any;
    cart: any[];
    totalPrice: number;
    fullName: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    location: string;
    address?: string;
    homeCollection: boolean;
    labLocation: string;
    labName: string;
    testTitle: string;
    testDetails?: {
      name: string;
      code: string;
      category: string;
      price: number;
      reportTime: string;
      fasting?: boolean;
    }[];
  };
};

// Form Field Types
type FormFieldOption = { label: string; value: string };
type FormField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'time' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    errorMessage?: string;
  };
};

// Form Data Type
type AppointmentFormData = {
  location: string;
  address?: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email?: string;
};

const BookAppointment: React.FC = () => {
  // Correctly type useRoute and useNavigation
  const route = useRoute<RouteProp<RootStackParamList, typeof PAGES.LAB_BOOK_APPOINTMENT>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { lab, cart } = route.params;
  const totalPrice = cart.reduce((sum, test) => sum + test.price, 0);

  const [form, setForm] = useState<AppointmentFormData>({
    location: 'Visit Lab',
    address: '',
    date: '',
    time: '',
    fullName: '',
    phone: '',
    email: '',
  });

  // Generate form fields dynamically
  const getFormFields = (): FormField[] => {
    const baseFields: FormField[] = [
      {
        name: 'location',
        label: 'Appointment Location',
        type: 'radio',
        required: true,
        options: [
          { label: 'Home Collection', value: 'Home Collection' },
          { label: 'Visit Lab', value: 'Visit Lab' },
        ],
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        placeholder: 'Select date',
      },
      {
        name: 'time',
        label: 'Time',
        type: 'time',
        required: true,
        placeholder: 'Select time',
      },
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
        validation: {
          minLength: 3,
          errorMessage: 'Full name must be at least 3 characters',
        },
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
        required: true,
        placeholder: 'Enter your phone number',
        validation: {
          pattern: /^\d{10}$/,
          errorMessage: 'Phone number must be exactly 10 digits',
        },
      },
    ];

    // Add address field if Home Collection is selected
    if (form.location === 'Home Collection') {
      baseFields.splice(1, 0, {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: true,
        placeholder: 'Enter your address',
      });
    }

    return baseFields;
  };

  const formFields = getFormFields();

  // Handle field changes
  const handleFormChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (formData: AppointmentFormData) => {
    const payload: RootStackParamList[typeof PAGES.LAB_PAYMENT] = {
      lab,
      cart,
      totalPrice,
      homeCollection: formData.location === 'Home Collection',
      labLocation: lab.location,
      labName: lab.name,
      testTitle: cart.map(test => test.title).join(', '),
      testDetails: cart.map(test => ({
        name: test.title,
        code: test.code,
        category: test.type,
        price: test.price,
        reportTime: test.reportTime,
        fasting: test.fasting,
      })),
      ...formData,
    };

    navigation.navigate(PAGES.LAB_PAYMENT, payload);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AvIcons type="MaterialIcons" name="arrow-back" size={normalize(20)} color={COLORS.PRIMARY} />
          <AvText style={styles.backText}>Back to Lab Details</AvText>
        </TouchableOpacity>

        <DynamicForm
          fields={formFields}
          formData={form}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit as (data: Record<string, any>) => void}
          headerTitle="Book Appointment"
          buttonTitle="Proceed to Book"
          singleButton
        />
      </ScrollView>
    </View>
  );
};

// Styles with normalize for responsive sizing
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollView: { flex: 1, padding: normalize(16) },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(16) },
  backText: { color: COLORS.PRIMARY, marginLeft: normalize(8) },
});

export default BookAppointment;
