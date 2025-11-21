import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    Card,
    Divider,
} from 'react-native-paper';
import { COLORS } from '../../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { normalize } from '../../../constants/platform';
import { AvModal, AvText } from '../../../elements';


type UserRole = 'Patient' | 'Hospital' | 'Doctor' | 'Labs/Scan';

type RegisterViewProps = {
    onRoleSelect: (role: UserRole) => void;
    selectedRole: UserRole | null;
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

const RegisterView: React.FC<RegisterViewProps> = ({ onRoleSelect, selectedRole, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const userRoles: UserRole[] = ['Patient', 'Hospital', 'Doctor', 'Labs/Scan'];

    const handleRoleSelection = (role: UserRole) => {
        setModalVisible(false);
        onRoleSelect(role);
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                    </View>
                    <AvText type="heading_2" style={styles.title}>Your Health, Our Priority</AvText>
                    <AvText type="description" style={styles.subtitle}>Expert Care You Can Trust</AvText>
                </View>

                {/* Main Content Card */}
                <Card style={styles.contentCard} elevation={4}>
                    <Card.Content>
                        <AvText type="mainTitle" style={styles.welcomeText}>Welcome to AVSwasthya</AvText>
                        <AvText type="body" style={styles.descriptionText}>
                            Empowering Your Health Journey with AVSwasthya — <AvText type="body" style={styles.highlightText}>Personalized Care</AvText> at Your Fingertips, <AvText type="body" style={styles.highlightText}>Trusted Services</AvText> Around the Clock
                        </AvText>

                        {/* Who Am I Dropdown */}
                        <View style={styles.dropdownSection}>
                            <AvText type="description" style={styles.dropdownLabel}>Who Am I?</AvText>
                            <TouchableOpacity
                                onPress={openModal}
                                style={styles.dropdownButton}
                            >
                                <AvText type="description" style={styles.dropdownButtonText}>
                                    {selectedRole || 'Select Your Role'}
                                </AvText>
                                <AvText type="caption" style={styles.chevronIcon}>▼</AvText>
                            </TouchableOpacity>
                        </View>

                        {/* Role Selection Modal */}
                        <AvModal    
                            isModalVisible={modalVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={closeModal}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={closeModal}
                            >
                                <View style={styles.modalContent}>
                                    <AvText type="title_2" style={styles.modalTitle}>Select Your Role</AvText>
                                    <FlatList
                                        data={userRoles}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.roleOption}
                                                    onPress={() => handleRoleSelection(item)}
                                                >
                                                    <AvText type="description" style={styles.roleOptionText}>{item}</AvText>
                                                    {selectedRole === item && (
                                                        <AvText type="title_2" style={styles.checkmark}>✓</AvText>
                                                    )}
                                                </TouchableOpacity>
                                                {index < userRoles.length - 1 && <Divider />}
                                            </View>
                                        )}
                                    />
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={closeModal}
                                    >
                                        <AvText type="description" style={styles.cancelButtonText}>Cancel</AvText>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </AvModal>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <AvText type="body" style={styles.footerText}>
                                    Already have an account?{' '}

                                    <AvText type="body" style={styles.loginLink}>Sign In</AvText>
                                </AvText>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BG_OFF_WHITE,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(40),
    },
    header: {
        alignItems: 'center',
        marginBottom: normalize(30),
    },
    logoContainer: {
        width: normalize(80),
        height: normalize(80),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    logoText: {
        fontSize: normalize(40),
    },
    title: {
        fontSize: normalize(28),
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        textAlign: 'center',
        marginBottom: normalize(8),
    },
    subtitle: {
        fontSize: normalize(16),
        color: COLORS.SECONDARY,
        textAlign: 'center',
        fontWeight: '600',
    },
    contentCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginBottom: normalize(20),
    },
    welcomeText: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        textAlign: 'center',
        marginBottom: normalize(12),
    },
    descriptionText: {
        fontSize: normalize(14),
        color: COLORS.GREY,
        textAlign: 'center',
        lineHeight: normalize(20),
        marginBottom: normalize(30),
    },
    highlightText: {
        color: COLORS.SECONDARY,
    },
    roleSection: {
        marginBottom: normalize(30),
    },
    roleLabel: {
        fontSize: normalize(18),
    },
    dropdownButton: {
        marginTop: normalize(8),
        borderColor: COLORS.PRIMARY,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    dropdownButtonText: {
        fontSize: normalize(16),
        color: COLORS.PRIMARY_TXT,
        flex: 1,
    },
    chevronIcon: {
        fontSize: normalize(12),
        color: COLORS.PRIMARY,
        marginLeft: normalize(8),
    },
    dropdownSection: {
        marginBottom: normalize(30),
    },
    dropdownLabel: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: COLORS.PRIMARY_TXT,
        marginBottom: normalize(8),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderRadius: normalize(12),
        padding: normalize(20),
        width: '100%',
        maxWidth: normalize(300),
        maxHeight: normalize(400),
    },
    modalTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: COLORS.PRIMARY_TXT,
        textAlign: 'center',
        marginBottom: normalize(20),
    },
    roleOption: {
        paddingVertical: normalize(16),
        paddingHorizontal: normalize(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roleOptionText: {
        fontSize: normalize(16),
        color: COLORS.PRIMARY_TXT,
        flex: 1,
    },
    checkmark: {
        fontSize: normalize(18),
        color: COLORS.PRIMARY,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: normalize(16),
        paddingVertical: normalize(12),
        backgroundColor: COLORS.LIGHT_GREY,
        borderRadius: normalize(8),
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: normalize(16),
        color: COLORS.GREY,
        fontWeight: '500',
    },
    infoTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: COLORS.PRIMARY,
        marginBottom: normalize(6),
    },
    infoText: {
        fontSize: normalize(14),
        color: COLORS.GREY,
        lineHeight: normalize(18),
    },
    footer: {
        alignItems: 'center',
        paddingTop: normalize(20),
    },
    footerText: {
        fontSize: normalize(14),
        color: COLORS.GREY,
    },
    loginLink: {
        color: COLORS.SECONDARY,
        fontWeight: '600',
    },
});

export default RegisterView;