import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../../../constants/colors";
import Header from "../../../../components/Header";
import { PAGES } from "../../../../constants/pages";
import PatientOverview from "./PtDashboard";
import HealthSummary from "./HealthSummary";
import { useAppSelector } from "../../../../store/hooks";

const PatientDashboardView = () => {
    const userRole = useAppSelector((state) => state?.user?.userProfile?.role);
    console.log("userRole", userRole);
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
                    <HealthSummary />
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: COLORS.BG_OFF_WHITE
    },
    container: {
        flex: 1,
        padding: 16
    }
});

export default PatientDashboardView;
