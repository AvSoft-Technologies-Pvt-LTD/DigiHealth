import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Tabs } from '../../../components/CommonComponents/Tabs';
import { SearchFilterBar } from '../../../components/CommonComponents/SearchFilter';
import { TableCard } from '../../../components/CommonComponents/TableCard';
import AvButton from '../../../elements/AvButton';
import AvText from '../../../elements/AvText';
import { COLORS } from '../../../constants/colors';
import Header from '../../../components/Header';
import {
  DoctorAppointment,
  LabAppointment,
  DoctorAppointmentsData,
  LabAppointmentsData,
  FilterOptions,
  AppointmentTabs,
} from '../../../constants/data';
import {PAGES} from '../../../constants/pages'
// Define the root stack param list for the root navigator
type RootStackParamList = {
  Appointments: undefined;
  LabBooking: undefined;
};

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('doctor');
  const [searchValue, setSearchValue] = useState('');
  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>(DoctorAppointmentsData);
  const [labAppointments, setLabAppointments] = useState<LabAppointment[]>(LabAppointmentsData);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleToggleHide = (recordId: string, isHidden: boolean) => {
    if (activeTab === 'doctor') {
      setDoctorAppointments((prev) =>
        prev.map((appt) =>
          appt.recordId === recordId ? { ...appt, isHidden } : appt
        )
      );
    } else {
      setLabAppointments((prev) =>
        prev.map((appt) =>
          appt.recordId === recordId ? { ...appt, isHidden } : appt
        )
      );
    }
  };

  const handleFiltersApplied = (selectedFilters: Record<string, boolean>) => {
    if (activeTab === 'doctor') {
      let filteredAppointments = [...DoctorAppointmentsData];
      if (selectedFilters.confirmed) {
        filteredAppointments = filteredAppointments.filter(appt => appt.status === 'Confirmed');
      }
      if (selectedFilters.rejected) {
        filteredAppointments = filteredAppointments.filter(appt => appt.status === 'Rejected');
      }
      setDoctorAppointments(filteredAppointments);
    } else {
      let filteredAppointments = [...LabAppointmentsData];
      if (selectedFilters.paid) {
        filteredAppointments = filteredAppointments.filter(appt => appt.status === 'Paid');
      }
      setLabAppointments(filteredAppointments);
    }
  };

  const handleCardPress = (record: DoctorAppointment | LabAppointment) => {
    console.log('Card pressed:', record);
  };

  const doctorHeaderFields = ['doctorName'];
  const labHeaderFields = ['labName'];

  const doctorActions = [
    {
      key: 'pay',
      onPress: (record) => console.log('Pay', record.recordId),
      render: () => (
        <View style={{ backgroundColor: COLORS.PRIMARY, padding: 8, borderRadius: 8 }}>
          <AvText type="caption" style={{ color: COLORS.WHITE }}>Pay</AvText>
        </View>
      ),
    },
  ];

  const labActions = [
    {
      key: 'track',
      onPress: (record) => console.log('Track', record.recordId),
      render: () => (
        <View style={{ backgroundColor: COLORS.PRIMARY, padding: 8, borderRadius: 8 }}>
          <AvText type="caption" style={{ color: COLORS.WHITE }}>Track</AvText>
        </View>
      ),
    },
  ];

  return (
    <>
    <Header
                title={PAGES.PATIENT_APPOINTMENTS}
                showBackButton={false}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.BLACK}
            />
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={"Appointments"}
        showBackButton={false}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
      <View style={styles.container}>
        <Tabs tabs={AppointmentTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={FilterOptions}
          onFiltersApplied={handleFiltersApplied}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <TableCard
            data={activeTab === 'doctor' ? doctorAppointments : labAppointments}
            headerFields={activeTab === 'doctor' ? doctorHeaderFields : labHeaderFields}
            actions={activeTab === 'doctor' ? doctorActions : labActions}
            onCardPress={handleCardPress}
          />
        </ScrollView>
      </View>
      <View style={styles.bottomButtonContainer}>
  <AvButton
    mode="contained"
    onPress={() => {
      if (activeTab === 'doctor') {
        // Doctor appointment booking navigation
        navigation.navigate(PAGES.BOOKING_APPOITMENT, { screen: 'DoctorHome' });
      } else {
        // Lab appointment booking navigation
        navigation.navigate(PAGES.LAB_BOOKING, { screen: 'LabHome' });
      }
    }}
    style={styles.buttonStyle}
    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
  >
    {activeTab === 'doctor' ? 'Book Doctor Appointment' : 'Book Lab Appointment'}
  </AvButton>
</View>

    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
  },
  buttonStyle: {
    width: '100%',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default Appointments;