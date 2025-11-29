import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../../constants/colors';
import Header from '../../../components/Header';
import { PAGES } from '../../../constants/pages';
import { normalize } from '../../../constants/platform';
import { Snackbar } from 'react-native-paper';
import DoctorWelcomeCard from './DocDashboardComponents/DoctorWelcomeComponent';
import QuickStatsComponent from './DocDashboardComponents/QuickStatsComponent';
import PatientCountBreakdown from './DocDashboardComponents/PatientCountComponent';
import RecentAppointmentsComponent from './DocDashboardComponents/RecentAppintmentsComponent';
import RevenueGeneratedComponent from './DocDashboardComponents/RevenueGeneratedComponent';
import { ROLES } from '../../../constants/data';

interface DoctorDashboardViewProps {
    loading: boolean;
    doctorData: {
        firstName: string;
        lastName: string;
        specialization: string;
        qualification: string;
        email: string;
        registrationNumber: string;
        totalPatients: number;
        opdPatients: number;
        ipdPatients: number;
        virtualPatients: number;
        totalRevenue: string;
    };
    recentAppointments: Array<{
        id: number;
        name: string;
        lastName?: string;
        date: string;
        time: string;
        reason: string;
        type: string;
        action: string;
    }>;
    onRefresh: () => void;
    onViewAllAppointments: () => void;
    onViewBilling: () => void;
    onAppointmentAction: (appointmentId: number, action: string) => void;
    snackbarVisible: boolean;
    snackbarMessage: string;
    onSnackbarDismiss: () => void;
    patientCounts: {
        totalPatients: number;
        opdPatients: number;
        ipdPatients: number;
        virtualPatients: number;
    };
}

const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
    doctorData,
    recentAppointments,
    onViewBilling,
    snackbarVisible,
    snackbarMessage,
    onSnackbarDismiss,
    patientCounts
}) => {

    return (
        <>
            <Header
                title={PAGES.DOCTOR_DASHBOARD}
                showBackButton={false}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.BLACK}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {/* Welcome Card */}
                    <DoctorWelcomeCard doctorData={doctorData} />
                    {/* Quick Stats */}
                    <QuickStatsComponent doctorData={doctorData} patientCounts={patientCounts} recentAppointments={recentAppointments} />

                    {/* Patient Breakdown */}
                    <PatientCountBreakdown patientCounts={patientCounts} />

                    {/* Recent Appointments */}
                    <RecentAppointmentsComponent displayType={"DOCTOR"} recentAppointments={recentAppointments} />

                    {/* Revenue Generated */}
                    <RevenueGeneratedComponent doctorData={doctorData} onViewBilling={onViewBilling} />

                </View>
                {/* Snackbar */}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={onSnackbarDismiss}
                    duration={3000}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: normalize(20),
    },
    container: {
        flex: 1,
        padding: normalize(16),
        backgroundColor: COLORS.GREY + '10',
    },
    snackbar: {
        backgroundColor: COLORS.SUCCESS,
    },
});

export default DoctorDashboardView;