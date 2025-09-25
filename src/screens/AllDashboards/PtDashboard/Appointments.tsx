import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Tabs } from "../../../components/CommonComponents/Tabs";
import { SearchFilterBar } from "../../../components/CommonComponents/SearchFilter";
import { TableCard } from "../../../components/CommonComponents/TableCard";
import AvButton from "../../../elements/AvButton";
import AvText from "../../../elements/AvText";
import { COLORS } from "../../../constants/colors";
import Header from "../../../components/Header";
import {
  DoctorAppointmentsData,
  LabAppointmentsData,
  FilterOptions,
  AppointmentTabs,
} from "../../../constants/data";
import { PAGES } from "../../../constants/pages";
import { normalize, StatusBarHeight } from "../../../constants/platform";
// Define types for appointments
export interface DoctorAppointment {
  recordId: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  specialization: string;
  [key: string]: any;
}
export interface LabAppointment {
  recordId: string;
  labName: string;
  date: string;
  time: string;
  status: string;
  testName: string;
  testId: string;
  [key: string]: any;
}
type RootStackParamList = {
  Appointments: undefined;
  LabBooking: { screen?: string; params?: any; testId?: string };
  [key: string]: any;
};
const Appointments = () => {
  const [activeTab, setActiveTab] = useState("doctor");
  const [searchValue, setSearchValue] = useState("");
  const [doctorAppointments, setDoctorAppointments] = useState<DoctorAppointment[]>(DoctorAppointmentsData);
  const [labAppointments, setLabAppointments] = useState<LabAppointment[]>(LabAppointmentsData);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleToggleHide = (recordId: string, isHidden: boolean) => {
    if (activeTab === "doctor") {
      setDoctorAppointments((prev) =>
        prev.map((appt) => (appt.recordId === recordId ? { ...appt, isHidden } : appt))
      );
    } else {
      setLabAppointments((prev) =>
        prev.map((appt) => (appt.recordId === recordId ? { ...appt, isHidden } : appt))
      );
    }
  };
  const handleFiltersApplied = (selectedFilters: Record<string, boolean>) => {
    if (activeTab === "doctor") {
      let filteredAppointments = [...DoctorAppointmentsData];
      if (selectedFilters.confirmed) {
        filteredAppointments = filteredAppointments.filter((appt) => appt.status === "Confirmed");
      }
      if (selectedFilters.rejected) {
        filteredAppointments = filteredAppointments.filter((appt) => appt.status === "Rejected");
      }
      setDoctorAppointments(filteredAppointments);
    } else {
      let filteredAppointments = [...LabAppointmentsData];
      if (selectedFilters.paid) {
        filteredAppointments = filteredAppointments.filter((appt) => appt.status === "Paid");
      }
      setLabAppointments(filteredAppointments);
    }
  };
  const handleCardPress = (record: DoctorAppointment | LabAppointment) => {
    console.log("Card pressed:", record);
  };
  const doctorHeaderFields = ["doctorName"];
  const labHeaderFields = ["labName"];
  const doctorBodyFields = ["date", "time", "status", "specialization"];
  const labBodyFields = ["date", "time", "status", "testName"];
  const doctorActions = [
    {
      key: "pay",
      onPress: (record: DoctorAppointment) => {
        console.log("Pay", record.recordId);
        navigation.navigate(PAGES.PAYMENT_GATEWAY_PAGE, { recordId: record.recordId });
      },
      render: () => (
        <View style={styles.actionBtn}>
          <AvText type="caption" style={{ color: COLORS.WHITE }}>Pay</AvText>
        </View>
      ),
    },
  ];
  const labActions = [
    {
      key: "track",
      onPress: (record: LabAppointment) => {
        console.log("Track", record.recordId);
        navigation.navigate(PAGES.LAB_BOOKING, {
          screen: PAGES.LAB_TRACK_APPOINTMENT,
          params: { recordId: record.recordId },
          testId: record.testId,
        });
      },
      render: () => (
        <View style={styles.actionBtn}>
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
        <View style={styles.container}>
          <Tabs tabs={AppointmentTabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <SearchFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filterOptions={FilterOptions}
            onFiltersApplied={handleFiltersApplied}
          />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TableCard
              data={activeTab === "doctor" ? doctorAppointments : labAppointments}
              headerFields={activeTab === "doctor" ? doctorHeaderFields : labHeaderFields}
              bodyFields={activeTab === "doctor" ? doctorBodyFields : labBodyFields}
              actions={activeTab === "doctor" ? doctorActions : labActions}
              onCardPress={handleCardPress}
            />
          </ScrollView>
        </View>
        <View style={styles.bottomButtonContainer}>
          <AvButton
            mode="contained"
            onPress={() => {
              if (activeTab === "doctor") {
                navigation.navigate(PAGES.DR_BOOKAPPOITMENT_COMPONENT);
              } else {
                navigation.navigate(PAGES.LAB_BOOKING);
              }
            }}
            style={styles.buttonStyle}
            labelStyle={{ fontSize: normalize(14), fontWeight: "bold" }}
          >
            {activeTab === "doctor" ? "Book Doctor Appointment" : "Book Lab Appointment"}
          </AvButton>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.WHITE, paddingTop: StatusBarHeight() },
  container: { flex: 1, padding: normalize(12) },
  scrollContent: { paddingBottom: normalize(80) },
  bottomButtonContainer: { padding: normalize(12), backgroundColor: COLORS.WHITE, borderTopWidth: 1, borderTopColor: COLORS.LIGHT_GREY },
  buttonStyle: { width: "100%", paddingVertical: normalize(8), borderRadius: normalize(6), backgroundColor: COLORS.PRIMARY },
  actionBtn: { backgroundColor: COLORS.PRIMARY, padding: normalize(6), borderRadius: normalize(6) },
});
export default Appointments;