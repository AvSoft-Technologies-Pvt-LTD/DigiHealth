import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

const PatientCountComponent: React.FC<{ patientCounts: any }> = ({ patientCounts }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <AvText type="heading_6" style={styles.cardTitle}>Patient Breakdown</AvText>
                <TouchableOpacity style={styles.iconButton}>
                    <AvIcons type="MaterialIcons" name="more-vert" size={20} color={COLORS.GREY} />
                </TouchableOpacity>
            </View>

            <View style={styles.patientStatsGrid}>
                <View style={styles.patientStatItem}>
                    <View style={styles.patientStatHeader}>
                        <AvIcons type="MaterialIcons" name="local-hospital" size={20} color={COLORS.SUCCESS} />
                        <AvText type="heading_4" style={styles.patientStatNumber}>{patientCounts?.opdPatients}</AvText>
                    </View>
                    <AvText type="body" style={styles.patientStatLabel}>OPD Patients</AvText>
                </View>

                <View style={styles.patientStatItem}>
                    <View style={styles.patientStatHeader}>
                        <AvIcons type="MaterialIcons" name="hotel" size={20} color={COLORS.WARNING} />
                        <AvText type="heading_4" style={styles.patientStatNumber}>{patientCounts?.ipdPatients}</AvText>
                    </View>
                    <AvText type="body" style={styles.patientStatLabel}>IPD Patients</AvText>
                </View>

                <View style={styles.patientStatItem}>
                    <View style={styles.patientStatHeader}>
                        <AvIcons type="MaterialIcons" name="videocam" size={20} color={COLORS.PRIMARY} />
                        <AvText type="heading_4" style={styles.patientStatNumber}>{patientCounts?.virtualPatients}</AvText>
                    </View>
                    <AvText type="body" style={styles.patientStatLabel}>Virtual Patients</AvText>
                </View>

                <View style={[styles.patientStatItem, styles.totalStatItem]}>
                    <View style={styles.patientStatHeader}>
                        <AvIcons type="MaterialIcons" name="people" size={20} color={COLORS.PRIMARY} />
                        <AvText type="heading_4" style={styles.patientStatNumber}>{patientCounts?.totalPatients}</AvText>
                    </View>
                    <AvText type="body" style={styles.patientStatLabel}>Total Patients</AvText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: normalize(12),
        padding: normalize(16),
        marginBottom: normalize(16),
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(16),
    },
    cardTitle: {
        color: COLORS.BLACK,
    },
    iconButton: {
        padding: normalize(4),
    },
    patientStatsGrid: {
        gap: normalize(12),
    },
    patientStatItem: {
        backgroundColor: COLORS.GREY + '10',
        borderRadius: normalize(12),
        padding: normalize(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    patientStatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(12),
    },
    patientStatNumber: {
        color: COLORS.BLACK,
    },
    patientStatLabel: {
        color: COLORS.GREY,
    },
    totalStatItem: {
        backgroundColor: COLORS.PRIMARY + '10',
        borderWidth: 1,
        borderColor: COLORS.PRIMARY + '30',
    },
});
export default PatientCountComponent;