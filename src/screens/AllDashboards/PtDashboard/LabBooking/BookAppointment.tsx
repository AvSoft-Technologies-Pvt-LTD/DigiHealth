import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import DynamicForm from '../../../../components/CommonComponents/form/AvForm';
import { normalize } from '../../../../constants/platform';
import AvIcons from '../../../../elements/AvIcons';

type RootStackParamList = {
  BookAppointment: {
    lab: any;
    cart: any[];
  };
  LabPayment: {
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

const BookAppointment = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookAppointment'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { lab, cart } = route.params;

  const totalPrice = cart.reduce((sum, test) => sum + test.price, 0);

  const [form, setForm] = useState({
    location: 'Visit Lab',
    address: '',
    date: '',
    time: '',
    fullName: '',
    phone: '',
    email: '',
  });

  const getFormFields = () => {
    const baseFields = [
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

  const handleFormChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (formData: typeof form) => {
    const payload: RootStackParamList['LabPayment'] = {
      ...formData,
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
    };

    navigation.navigate('LabPayment', payload);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AvIcons
            type={"MaterialIcons"}
            name={"arrow-back"}
            size={normalize(20)}
            color={COLORS.PRIMARY}
          />
          <AvText style={styles.backText}>Back to Lab Details</AvText>
        </TouchableOpacity>

        <DynamicForm
          fields={formFields}
          onSubmit={handleFormSubmit}
          headerTitle="Book Appointment"
          formData={form}
          onChange={handleFormChange}
          buttonTitle="Proceed to Book"
          singleButton={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
});

export default BookAppointment;
