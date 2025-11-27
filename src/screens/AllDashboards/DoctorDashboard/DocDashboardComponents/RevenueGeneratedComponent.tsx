import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AvIcons, AvText } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";


const RevenueGeneratedComponent: React.FC<{ doctorData: any, onViewBilling: () => void }> = ({ doctorData,onViewBilling }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <AvText type="heading_6" style={styles.cardTitle}>Revenue Generated</AvText>
                <TouchableOpacity style={styles.viewAllButton} onPress={onViewBilling}>
                    <AvText type="caption" style={styles.viewAllText}>View Billing</AvText>
                    <AvIcons type="MaterialIcons" name="arrow-forward" size={16} color={COLORS.PRIMARY} />
                </TouchableOpacity>
            </View>

            <View style={styles.revenueContainer}>
                <View style={styles.revenueMain}>
                    <AvText type="caption" style={styles.revenueLabel}>Total Revenue</AvText>
                    <AvText type="heading_3" style={styles.revenueAmount}>{doctorData.totalRevenue}</AvText>
                    <View style={styles.revenueMeta}>
                        <View style={styles.revenueStat}>
                            <AvIcons type="MaterialIcons" name="trending-up" size={16} color={COLORS.SUCCESS} />
                            <AvText type="caption" style={styles.revenueStatText}>+12% from last month</AvText>
                        </View>
                        <AvText type="caption" style={styles.revenuePeriod}>This Month</AvText>
                    </View>
                </View>
                <View style={styles.revenueIcon}>
                    <AvIcons type="MaterialIcons" name="account-balance-wallet" size={40} color={COLORS.SUCCESS} />
                </View>
            </View>

            <View style={styles.revenueBreakdown}>
                <View style={styles.revenueItem}>
                    <View style={styles.revenueItemLeft}>
                        <AvIcons type="MaterialIcons" name="local-hospital" size={16} color={COLORS.SUCCESS} />
                        <AvText type="caption" style={styles.revenueItemLabel}>OPD Revenue</AvText>
                    </View>
                    <AvText type="body" style={styles.revenueItemAmount}>₹12,000</AvText>
                </View>
                <View style={styles.revenueItem}>
                    <View style={styles.revenueItemLeft}>
                        <AvIcons type="MaterialIcons" name="hotel" size={16} color={COLORS.WARNING} />
                        <AvText type="caption" style={styles.revenueItemLabel}>IPD Revenue</AvText>
                    </View>
                    <AvText type="body" style={styles.revenueItemAmount}>₹6,000</AvText>
                </View>
                <View style={styles.revenueItem}>
                    <View style={styles.revenueItemLeft}>
                        <AvIcons type="MaterialIcons" name="videocam" size={16} color={COLORS.PRIMARY} />
                        <AvText type="caption" style={styles.revenueItemLabel}>Virtual Revenue</AvText>
                    </View>
                    <AvText type="body" style={styles.revenueItemAmount}>₹2,000</AvText>
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
revenueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(16),
    },
    revenueMain: {
        flex: 1,
    },
    revenueLabel: {
        color: COLORS.GREY,
        marginBottom: normalize(4),
    },
    revenueAmount: {
        color: COLORS.BLACK,
        marginBottom: normalize(8),
    },
    revenueMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    revenueStat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    revenueStatText: {
        color: COLORS.SUCCESS,
        marginLeft: normalize(4),
    },
    revenuePeriod: {
        color: COLORS.GREY,
    },
    revenueIcon: {
        marginLeft: normalize(16),
    },
    revenueBreakdown: {
        gap: normalize(8),
    },
    revenueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.GREY + '10',
        borderRadius: normalize(8),
        padding: normalize(12),
    },
    revenueItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: normalize(8),
    },
    revenueItemLabel: {
        color: COLORS.GREY,
    },
    revenueItemAmount: {
        color: COLORS.BLACK,
        fontWeight: '600',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        color: COLORS.PRIMARY,
        marginRight: normalize(4),
    },
});
export default RevenueGeneratedComponent;