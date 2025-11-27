import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface Appointment {
    id: number;
    name: string;
    lastName?: string;
    date: string;
    time: string;
    type: 'Virtual' | 'Physical';
    action: string;
}

const RecentAppointmentsComponent: React.FC<{ recentAppointments: any }> = ({ recentAppointments }) => {
    const onViewAllAppointments = () => {
        console.log('View All Appointments');
    };
    const onAppointmentAction = (id: number, action: string) => {
        console.log('Appointment Action:', id, action);
    };
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <AvText type="heading_6" style={styles.cardTitle}>Recent Appointments</AvText>
                <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllAppointments}>
                    <AvText type="caption" style={styles.viewAllText}>View All</AvText>
                    <AvIcons type="MaterialIcons" name="arrow-forward" size={16} color={COLORS.PRIMARY} />
                </TouchableOpacity>
            </View>

            <View style={styles.appointmentsList}>
                {recentAppointments.slice(0, 3).map((appointment: Appointment) => (
                    <View key={appointment.id} style={styles.appointmentItem}>
                        <View style={styles.appointmentAvatar}>
                            <AvIcons type="MaterialIcons" name="person" size={24} color={COLORS.PRIMARY} />
                        </View>
                        <View style={styles.appointmentInfo}>
                            <AvText type="body" style={styles.patientName}>
                                {appointment.name} {appointment.lastName || ''}
                            </AvText>
                            <View style={styles.appointmentMeta}>
                                <AvIcons type="MaterialIcons" name="schedule" size={12} color={COLORS.GREY} />
                                <AvText type="caption" style={styles.appointmentTime}>
                                    {appointment.date + "  |  " + appointment.time}
                                </AvText>
                                <View style={[styles.typeBadge, appointment.type === 'Virtual' ? styles.virtualBadge : styles.physicalBadge]}>
                                    <AvText type="caption" style={styles.typeText}>{appointment.type}</AvText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.appointmentAction}
                            onPress={() => onAppointmentAction(appointment.id, appointment.action)}
                        >
                            <AvIcons type="MaterialIcons" name="chevron-right" size={20} color={COLORS.GREY} />
                        </TouchableOpacity>
                    </View>
                ))}
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
viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        color: COLORS.PRIMARY,
        marginRight: normalize(4),
    },
    appointmentsList: {
        gap: normalize(12),
    },
        appointmentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.GREY + '10',
            borderRadius: normalize(12),
            padding: normalize(12),
        },
        appointmentAvatar: {
            width: normalize(40),
            height: normalize(40),
            borderRadius: normalize(20),
            backgroundColor: COLORS.PRIMARY + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: normalize(12),
        },
        appointmentInfo: {
            flex: 1,
        },
        appointmentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appointmentTime: {
        color: COLORS.GREY,
        marginLeft: normalize(4),
        marginRight: normalize(8),
    },
    patientName: {
        color: COLORS.BLACK,
        marginBottom: normalize(4),
    },
    appointmentAction: {
        padding: normalize(8),
    },
    typeBadge: {
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(2),
        borderRadius: normalize(4),
    },
    virtualBadge: {
        backgroundColor: COLORS.WARNING + '20',
    },
    physicalBadge: {
        backgroundColor: COLORS.SUCCESS + '20',
    },
    typeText: {
        fontSize: normalize(10),
        fontWeight: '500',
    },
});
export default RecentAppointmentsComponent;