import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../../../constants/colors";
import Header from "../../../../components/Header";
import { PAGES } from "../../../../constants/pages";
import PatientOverview from "./PtDashboard";
import HealthSummary from "./HealthSummary";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchAllergiesData, fetchPatientAdditionalData, fetchPatientDashboardData, fetchPatientPersonalHealthData, fetchSurgeriesData } from "../../../../store/thunks/patientThunks";
import RecentAppointmentsComponent from "../../DoctorDashboard/DocDashboardComponents/RecentAppintmentsComponent";
import { ROLES } from "../../../../constants/data";

const PatientDashboardView = () => {
      const id = useAppSelector((state) => state.user.userProfile.patientId);
      const PatData = useAppSelector((state) => state.patientDashboardData.patientDashboardData);
    
    const dispatch = useAppDispatch()
      useEffect(() => {
        if (id) {
          dispatch(fetchPatientPersonalHealthData(id));
          dispatch(fetchPatientDashboardData(id));
          dispatch(fetchAllergiesData());
          dispatch(fetchSurgeriesData());
          dispatch(fetchPatientAdditionalData(id));
        }
      }, [id]);
    
    return (
        <>
            <Header
                title={PAGES.PATIENT_DASHBOARD}
                showBackButton={false}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.BLACK}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <PatientOverview />
                    <RecentAppointmentsComponent displayType={ROLES.PATIENT} recentAppointments={[]} />
                    {/* <HealthSummary /> */}
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: COLORS.WHITE
    },
    container: {
        flex: 1,
        // padding: 16
    }
});

export default PatientDashboardView;
