import React from "react";
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvCard from "../../../../elements/AvCards";
import { COLORS } from "../../../../constants/colors"
import Header from "../../../../components/Header";
import { PAGES } from "../../../../constants/pages";
import { useNavigation } from "@react-navigation/native";

const PatientDashboardView = () => {
    const navigation = useNavigation();

    const handleEditPress = () => {
        navigation.navigate(PAGES.PATIENT_SETTINGS); // Update with your actual route name
    };

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
                    {/* Patient Info Card */}
                    <View style={[styles.card, styles.cardShadow]}>
                        <View style={styles.cardHeader}>
                            <AvText type="title_7" style={{color: COLORS.PRIMARY}}>Patient Info</AvText>
                            <View style={styles.headerButtons}>
                                <AvButton
                                    onPress={() => navigation.navigate(PAGES.PATIENT_HEALTHCARD)}
                                    mode="contained"
                                    contentStyle={styles.viewHealthCardButtonContent}
                                    buttonColor={COLORS.PRIMARY}
                                >
                                    <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>View Health Card</AvText>
                                </AvButton>
                                <TouchableOpacity onPress={handleEditPress}>
                                    <Icon name="pencil" size={20} color={COLORS.PRIMARY} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.profileSection}>
                            <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.profileImage} />
                            <AvText type="title_6" style={{color: COLORS.PRIMARY}}>Trupti Chavan</AvText>
                        </View>
                        <View style={styles.detailsSection}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <View style={styles.detailValueRow}>
                                        <Icon name="gender-female" size={16} color={COLORS.PRIMARY} />
                                        <AvText type="caption" style={{marginLeft: 8, color: COLORS.PRIMARY, fontWeight: "900", fontSize: 17}}>Gender</AvText>
                                    </View>
                                    <AvText type="body" style={{marginLeft: 24, color: COLORS.PRIMARY_TXT, fontSize: 15, fontWeight: "600"}}>Female</AvText>
                                </View>
                                <View style={styles.detailItem}>
                                    <View style={styles.detailValueRow}>
                                        <Icon name="phone" size={16} color={COLORS.PRIMARY} />
                                        <AvText type="caption" style={{marginLeft: 8, color: COLORS.PRIMARY, fontWeight: "900", fontSize: 17}}>Phone No.</AvText>
                                    </View>
                                    <AvText type="body" style={{marginLeft: 24, color: COLORS.PRIMARY_TXT, fontSize: 15, fontWeight: "600"}}>9370672873</AvText>
                                </View>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <View style={styles.detailValueRow}>
                                        <Icon name="cake" size={16} color={COLORS.PRIMARY} />
                                        <AvText type="caption" style={{marginLeft: 8, color: COLORS.PRIMARY, fontWeight: "900", fontSize: 17}}>Date Of Birth</AvText>
                                    </View>
                                    <AvText type="body" style={{marginLeft: 24, color: COLORS.PRIMARY_TXT, fontSize: 15, fontWeight: "600"}}>2001-03-09</AvText>
                                </View>
                                <View style={styles.detailItem}>
                                    <View style={styles.detailValueRow}>
                                        <Icon name="water" size={16} color={COLORS.PRIMARY} />
                                        <AvText type="caption" style={{marginLeft: 8, color: COLORS.PRIMARY, fontWeight: "900", fontSize: 17}}>Blood Group</AvText>
                                    </View>
                                    <AvText type="body" style={{marginLeft: 24, color: COLORS.PRIMARY_TXT, fontSize: 15, fontWeight: "600"}}>O+</AvText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.progressSection}>
                            <View style={styles.progressBar}>
                                <View style={{height: "100%", backgroundColor: COLORS.SECONDARY, borderRadius: 3, width: "75%"}} />
                            </View>
                            <AvText type="caption" style={{textAlign: "right", marginTop: 6, color: COLORS.SECONDARY, fontWeight: "500"}}>75% Profile Complete</AvText>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonsContainer}>
                            <AvButton
                                mode="contained"
                                style={styles.actionButton}
                                buttonColor={COLORS.PRIMARY}
                                icon={() => <Icon name="account-details" size={16} color={COLORS.WHITE} />}
                            >
                                <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>Basic Details</AvText>
                            </AvButton>
                            <AvButton
                                mode="contained"
                                style={styles.actionButton}
                                buttonColor={COLORS.PRIMARY}
                                icon={() => <Icon name="heart-pulse" size={16} color={COLORS.WHITE} />}
                            >
                                <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>Personal Health</AvText>
                            </AvButton>
                            <AvButton
                                mode="contained"
                                style={styles.actionButton}
                                buttonColor={COLORS.PRIMARY}
                                icon={() => <Icon name="account-group" size={16} color={COLORS.WHITE} />}
                            >
                                <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>Family</AvText>
                            </AvButton>
                            <AvButton
                                mode="contained"
                                style={styles.actionButton}
                                buttonColor={COLORS.PRIMARY}
                                icon={() => <Icon name="file-document-edit" size={16} color={COLORS.WHITE} />}
                            >
                                <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>Additional Details</AvText>
                            </AvButton>
                        </ScrollView>
                    </View>

                    {/* Health Summary Card */}
                    <View style={[styles.healthSummary, styles.cardShadow]}>
                        <View style={styles.healthSummaryHeader}>
                            <AvText type="title_6" style={{color: COLORS.PRIMARY}}>Health Summary</AvText>
                            <AvButton
                                mode="contained"
                                style={styles.addVitalsButton}
                                buttonColor={COLORS.SECONDARY}
                                icon={() => <Icon name="plus" size={16} color={COLORS.WHITE} />}
                            >
                                <AvText type="buttonText" style={{color: COLORS.WHITE, fontSize: 14, fontWeight: '500'}}>Add Vitals</AvText>
                            </AvButton>
                        </View>
                        <View style={styles.vitalsContainer}>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>Temperature</AvText>}
                                icon={<Icon name="thermometer" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>98.6°F</AvText>
                            </AvCard>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>SpO2</AvText>}
                                icon={<Icon name="waveform" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>98%</AvText>
                            </AvCard>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>Blood Pressure</AvText>}
                                icon={<Icon name="heart-pulse" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>120/80</AvText>
                            </AvCard>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>Heart Rate</AvText>}
                                icon={<Icon name="heart" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>72 bpm</AvText>
                            </AvCard>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>Respiratory Rate</AvText>}
                                icon={<Icon name="lungs" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>16 rpm</AvText>
                            </AvCard>
                            <AvCard
                                title={<AvText type="body" style={{color: COLORS.PRIMARY_TXT, fontWeight: "500"}}>Blood Sugar</AvText>}
                                icon={<Icon name="test-tube" size={20} color={COLORS.PRIMARY} />}
                                cardStyle={[styles.vitalCard, {borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4}]}
                            >
                                <AvText type="title_6" style={{color: COLORS.PRIMARY, marginTop: 4}}>95 mg/dL</AvText>
                            </AvCard>
                        </View>
                    </View>
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
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    cardShadow: {
        shadowColor: COLORS.SECONDARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    viewHealthCardButtonContent: {
        height: 36
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 20
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8
    },
    detailsSection: {
        marginBottom: 20
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16
    },
    detailItem: {
        flex: 1,
        marginHorizontal: 8
    },
    detailValueRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6
    },
    progressSection: {
        marginBottom: 20
    },
    progressBar: {
        height: 6,
        backgroundColor: COLORS.LIGHT_GREY,
        borderRadius: 3,
        overflow: "hidden"
    },
    buttonsContainer: {
        flexDirection: "row",
        paddingVertical: 8,
        gap: 8
    },
    actionButton: {
        borderRadius: 20,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    healthSummary: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 16
    },
    healthSummaryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    addVitalsButton: {
        borderRadius: 20,
        paddingHorizontal: 12
    },
    vitalsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 8
    },
    vitalCard: {
        width: "48%",
        marginVertical: 4
    }
});

export default PatientDashboardView;
