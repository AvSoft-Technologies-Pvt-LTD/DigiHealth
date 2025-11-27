import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

const QuickStatsComponent: React.FC<{ doctorData: any, patientCounts: any, recentAppointments: any }> = ({ doctorData, patientCounts, recentAppointments }) => {
    return (
        <View style={styles.quickStatsContainer}>
            <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: COLORS.SUCCESS + '20' }]}>
                    <AvIcons type="MaterialIcons" name="people" size={24} color={COLORS.SUCCESS} />
                </View>
                <AvText type="heading_5" style={styles.statNumber}>{patientCounts?.totalPatients}</AvText>
                <AvText type="caption" style={styles.statLabel}>Total Patients</AvText>
            </View>

            <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: COLORS.WARNING + '20' }]}>
                    <AvIcons type="MaterialIcons" name="event" size={24} color={COLORS.WARNING} />
                </View>
                <AvText type="heading_5" style={styles.statNumber}>{recentAppointments.length}</AvText>
                <AvText type="caption" style={styles.statLabel}>Today's Appointments</AvText>
            </View>

            <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: COLORS.PRIMARY + '20' }]}>
                    <AvIcons type="MaterialIcons" name="trending-up" size={24} color={COLORS.PRIMARY} />
                </View>
                <AvText type="heading_5" style={styles.statNumber}>{doctorData.totalRevenue}</AvText>
                <AvText type="caption" style={styles.statLabel}>Total Revenue</AvText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quickStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(20),
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderRadius: normalize(12),
        padding: normalize(16),
        marginHorizontal: normalize(4),
        alignItems: 'center',
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIcon: {
        width: normalize(48),
        height: normalize(48),
        borderRadius: normalize(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(8),
    },
    statNumber: {
        color: COLORS.BLACK,
        marginBottom: normalize(4),
    },
    statLabel: {
        color: COLORS.GREY,
        textAlign: 'center',
    },
});
export default QuickStatsComponent;