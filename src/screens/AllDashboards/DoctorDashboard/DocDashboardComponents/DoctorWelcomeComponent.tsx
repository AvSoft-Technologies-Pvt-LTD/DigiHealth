import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

const DoctorWelcomeComponent: React.FC<{ doctorData: any }> = ({ doctorData }) => {
    return (
        <View style={[styles.welcomeCard, { backgroundColor: COLORS.PRIMARY }]}>
            <View style={styles.welcomeContent}>
                <View style={styles.doctorAvatar}>
                    <AvIcons type="MaterialIcons" name="person" size={50} color={COLORS.WHITE} />
                </View>
                <View style={styles.welcomeInfo}>
                    <AvText type="heading_4" style={styles.welcomeTitle}>
                        Welcome back, Dr. {doctorData.firstName}!
                    </AvText>
                    <AvText type="body" style={styles.welcomeSubtitle}>
                        {doctorData.specialization}
                    </AvText>
                    <View style={styles.statusBadge}>
                        {/* <AvIcons type="MaterialIcons" name="verified" size={16} color={COLORS.SUCCESS} /> */}
                        <AvText type="caption" style={styles.statusText}>{doctorData.qualification}</AvText>
                    </View>
                </View>
            </View>
        </View>
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
    welcomeCard: {
        borderRadius: normalize(16),
        padding: normalize(20),
        marginBottom: normalize(20),
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    welcomeContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorAvatar: {
        width: normalize(60),
        height: normalize(60),
        borderRadius: normalize(30),
        backgroundColor: COLORS.WHITE + '30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(16),
    },
    welcomeInfo: {
        flex: 1,
    },
    snackbar: {
        backgroundColor: COLORS.SUCCESS,
    },
    welcomeTitle: {
        color: COLORS.WHITE,
        marginBottom: normalize(4),
    },
    welcomeSubtitle: {
        color: COLORS.WHITE + '80',
        marginBottom: normalize(8),
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE + '20',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(4),
        borderRadius: normalize(12),
        alignSelf: 'flex-start',
    },
    statusText: {
        color: COLORS.WHITE,
        marginLeft: normalize(4),
    }
});
export default DoctorWelcomeComponent;