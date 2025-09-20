import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView,  ScrollView } from 'react-native';
import { Tabs } from '../../../components/CommonComponents/Tabs';
import { SearchFilterBar } from '../../../components/CommonComponents/SearchFilter';
import { TableCard } from '../../../components/CommonComponents/TableCard';
import AvButton from '../../../elements/AvButton';
import AvText from '../../../elements/AvText';
import { COLORS } from '../../../constants/colors';

import {
  DoctorAppointment,
  LabAppointment,
  DoctorAppointmentsData,
  LabAppointmentsData,
  FilterOptions,
  AppointmentTabs,
} from '../../../constants/data';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('doctor');
  const [searchValue, setSearchValue] = useState('');
  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>(DoctorAppointmentsData);
  const [labAppointments, setLabAppointments] = useState<LabAppointment[]>(LabAppointmentsData);

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

  // Define header fields for doctor and lab appointments
  const doctorHeaderFields = ['doctorName'];
  const labHeaderFields = [ 'labName'];

  // Define actions for doctor and lab appointments
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
    <SafeAreaView style={styles.safeArea}>
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
    onPress={() => console.log('Book Appointment Pressed')}
    style={styles.buttonStyle} // Apply additional button styles
    labelStyle={{ fontSize: 16, fontWeight: 'bold' }} // Style the button text
  >
    Book Appointment
  </AvButton>
</View>
    </SafeAreaView>
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
    backgroundColor:COLORS.PRIMARY,
  },
});

export default Appointments;