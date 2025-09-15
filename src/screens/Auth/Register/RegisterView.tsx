import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Modal,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import AvText from '../../../elements/AvText';
import {
    Button,
    Card,
    Divider,
    Menu,
} from 'react-native-paper';
import { COLORS } from '../../../constants/colors';
import { PAGES } from '../../../constants/pages';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';

const { width } = Dimensions.get('window');

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
                        <Modal
                            visible={modalVisible}
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
                        </Modal>

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
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.SECONDARY,
        textAlign: 'center',
        fontWeight: '600',
    },
    contentCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        textAlign: 'center',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.GREY,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    highlightText: {
        color: COLORS.SECONDARY,
    },
    roleSection: {
        marginBottom: 30,
    },
    roleLabel: {
        fontSize: 18,
    },
    dropdownButton: {
        marginTop: 8,
        borderColor: COLORS.PRIMARY,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: COLORS.PRIMARY_TXT,
        flex: 1,
    },
    chevronIcon: {
        fontSize: 12,
        color: COLORS.PRIMARY,
        marginLeft: 8,
    },
    dropdownSection: {
        marginBottom: 30,
    },
    dropdownLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.PRIMARY_TXT,
        marginBottom: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 300,
        maxHeight: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.PRIMARY_TXT,
        textAlign: 'center',
        marginBottom: 20,
    },
    roleOption: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roleOptionText: {
        fontSize: 16,
        color: COLORS.PRIMARY_TXT,
        flex: 1,
    },
    checkmark: {
        fontSize: 18,
        color: COLORS.PRIMARY,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.LIGHT_GREY,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: COLORS.GREY,
        fontWeight: '500',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.PRIMARY,
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.GREY,
        lineHeight: 18,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.GREY,
    },
    loginLink: {
        color: COLORS.SECONDARY,
        fontWeight: '600',
    },
});

export default RegisterView;