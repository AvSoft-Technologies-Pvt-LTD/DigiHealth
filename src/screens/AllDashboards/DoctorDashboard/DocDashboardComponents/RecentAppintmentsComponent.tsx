import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";
import { ROLES } from "../../../../constants/data";
import { useAppSelector } from "../../../../store/hooks";
import moment from "moment";

interface Appointment {
    id: number;
    name?: string;
    lastName?: string;
    doctorName?: string;
    doctorSpeciality?: string;
    consultationType?: string;
    date: string;
    time: string;
    appointmentDate: "string";
    appointmentTime: "string";
    type: 'Virtual' | 'Physical';
    status?: string;
    action?: string;
}

const RecentAppointmentsComponent: React.FC<{ recentAppointments: any; displayType?: 'DOCTOR' | 'PATIENT' }> = ({ recentAppointments, displayType = 'doctor' }) => {
    const onViewAllAppointments = () => {
        console.log('View All Appointments');
    };
    const onAppointmentAction = (id: number, action: string) => {
        console.log('Appointment Action:', id, action);
    };
    const PatAppointmentData = useAppSelector((state) => state.patientAppointmentsData.appointmentsData);
    // Render table for patient view
    const renderPatientTableView = (PatAppointmentData: any) => {
        return (
            <>

                {PatAppointmentData.length > 0 ? <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <AvText type="caption" style={styles.headerText}>Doctor Name</AvText>
                        <AvText type="caption" style={styles.headerText}>Date & Time</AvText>
                        <AvText type="caption" style={styles.headerText}>Consultation Type</AvText>
                        <AvText type="caption" style={styles.headerText}>Status</AvText>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        style={styles.horizontalScrollView}
                    >
                        <View style={styles.tableBody}>
                            {PatAppointmentData.slice(0, 3).map((appointment: Appointment) => (
                                <TouchableOpacity
                                    key={appointment.id}
                                    style={styles.tableRow}
                                    onPress={() => onAppointmentAction(appointment.id, 'view')}
                                >
                                    <View style={styles.tableCell}>
                                        <AvText type="caption" style={styles.cellText}>
                                            {appointment.doctorName || 'General'}
                                        </AvText>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <AvText type="caption" style={styles.cellText}>
                                            {appointment.appointmentDate ? moment(appointment.appointmentDate).format('DD-MM-YY') + " | " : ''}
                                            {appointment.appointmentTime ? moment(appointment.appointmentTime, 'HH:mm:ss').format('hh:mm A') : ''}

                                        </AvText>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <View style={[styles.typeBadge, appointment.consultationType === 'Virtual' ? styles.virtualBadge : styles.physicalBadge]}>
                                            <AvText type="caption" style={styles.typeText}>{appointment.consultationType}</AvText>
                                        </View>
                                    </View>
                                    <View style={styles.tableCell}>
                                        <View style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
                                            <AvText type="caption" style={styles.statusText}>{appointment.status || 'Scheduled'}</AvText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View> : <View style={styles.tableCell}>
                    <View style={[styles.typeBadge, styles.virtualBadge]}>
                        <AvText type="caption" style={styles.typeText}>No Data Found</AvText>
                    </View>
                </View>}
            </>
        );
    };

    const getStatusStyle = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return { backgroundColor: COLORS.SUCCESS + '20' };
            case 'cancelled':
                return { backgroundColor: COLORS.ERROR + '20' };
            case 'scheduled':
            default:
                return { backgroundColor: COLORS.WARNING + '20' };
        }
    };

    // Render card view for doctor view
    const renderDoctorCardView = () => {
        return (
            <>
                <View style={styles.appointmentsList}>
                    {recentAppointments?.slice(0, 3).map((appointment: Appointment) => (
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
                                onPress={() => onAppointmentAction(appointment.id, appointment.action || 'view')}
                            >
                                <AvIcons type="MaterialIcons" name="chevron-right" size={20} color={COLORS.GREY} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </>
        );
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <AvText type="heading_6" style={styles.cardTitle}>Recent Appointments</AvText>
                {PatAppointmentData.length>0 &&<TouchableOpacity style={styles.viewAllButton} onPress={onViewAllAppointments}>
                    <AvText type="caption" style={styles.viewAllText}>View All</AvText>
                    <AvIcons type="MaterialIcons" name="arrow-forward" size={16} color={COLORS.PRIMARY} />
                </TouchableOpacity>}
            </View>

            {displayType === ROLES.PATIENT ? renderPatientTableView(PatAppointmentData) : renderDoctorCardView()}
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
    // Table styles for patient view
    tableContainer: {
        marginTop: normalize(8),
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY + '30',
        paddingBottom: normalize(8),
        marginBottom: normalize(4),
    },
    headerText: {
        color: COLORS.BLACK,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        minWidth: 80,
    },
    tableBody: {
        minWidth: '100%',
    },
    horizontalScrollView: {
        marginTop: normalize(4),
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: normalize(8),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY + '20',
    },
    tableCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(4),
        minWidth: 80,
    },
    cellText: {
        color: COLORS.BLACK,
        textAlign: 'center',
    },
    statusBadge: {
        paddingHorizontal: normalize(6),
        paddingVertical: normalize(2),
        borderRadius: normalize(4),
    },
    statusText: {
        fontSize: normalize(10),
        fontWeight: '500',
        textAlign: 'center',
    },
});
export default RecentAppointmentsComponent;