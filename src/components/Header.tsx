import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AvText from '../elements/AvText';
import { COLORS } from '../constants/colors';
import { useDrawer } from '../navigation/DrawerContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { isIos, normalize } from '../constants/platform';
import { RootStackParamList } from '../types/navigation';
import AvButton from '../elements/AvButton';
import { PAGES } from '../constants/pages';
import { width } from '../constants/common';
import { ScrollView } from 'react-native-gesture-handler';
import AvIcons from '../elements/AvIcons';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    onLoginPress?: () => void;
    onRegisterPress?: () => void;
    isAuthenticated?: boolean;
    backgroundColor?: string;
    titleColor?: string;
}
// Define navigation prop type
type HeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC<HeaderProps> = ({
    title = '',
    showBackButton = true,
    onBackPress,
    onLoginPress = () => { },
    onRegisterPress = () => { },
    backgroundColor = COLORS.WHITE,
    titleColor = COLORS.BLACK,
    onNotificationPress,
    notificationCount
}) => {

    // Use a more specific selector to get the authentication state
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { openDrawer } = useDrawer();
    const navigation = useNavigation<HeaderNavigationProp>();
    const handleMorePress = () => {
        setModalVisible(true);
    };

    const handlePharmacyPress = () => {
        setModalVisible(false);
        navigation.navigate(PAGES.PHARMACY_FINDER_VIEW);
    };

    const handleAmbulancePress = () => {
        setModalVisible(false);
        navigation.navigate(PAGES.AMBULANCE_BOOKING_VIEW);
    };

    const handleNotificationsPress = () => {
        setModalVisible(false);
        if (onNotificationPress) {
            onNotificationPress();
        }
    }; // Add this closing brace



    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };
    const renderAuthenticatedUI = React.useCallback(() => {
        console.log('Rendering authenticated UI');
        return (
            <View style={[styles.container, { backgroundColor }]}>
                {/* Left Section - Menu Button */}
                {showBackButton ? (
                    <AvIcons
                        onPress={handleBackPress}
                        type="MaterialIcons"
                        name="arrow-back"
                        size={24}
                        color={titleColor}
                    />
                ) : (

                    <View style={styles.leftSection}>
                        <Pressable
                            style={styles.menuButton}
                            onPress={openDrawer}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            testID="menu-button"
                        >
                            <MaterialIcons name="menu" size={24} color={titleColor} />
                        </Pressable>
                    </View>
                )}

                {/* Center Section - Title */}
                <View style={styles.centerSection}>
                    {title && (
                        <AvText type="title_2" style={[styles.title, { color: titleColor }]}>
                            {title}
                        </AvText>
                    )}
                </View>

                {/* Right Section - Empty for now, can be used for notifications, profile, etc. */}
                <View style={styles.rightSection} />
            </View>
        );
    }, [title, titleColor, backgroundColor, openDrawer]);

    const renderUnauthenticatedUI = React.useCallback(() => {
        return (
            <View style={[styles.container, { backgroundColor }]}>
                {/* Left Section - Empty */}
                {/* <View style={styles.leftSection} /> */}

                {/* Right Section - Auth Buttons */}
                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <AvText style={styles.quickActionsTitle}>QUICK ACTIONS</AvText>

                    <TouchableOpacity
                        style={[styles.actionItem, { backgroundColor: '#d9ecf8ff' }]}
                        onPress={handlePharmacyPress}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#14161aff' }]}>
                            <MaterialIcons name="local-pharmacy" size={24} color="#f1f7f7ff" />
                        </View>
                        <AvText style={styles.actionText}>Pharmacy</AvText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionItem, { backgroundColor: '#fce8e8ff' }]}
                        onPress={handleAmbulancePress}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#ca3535ff' }]}>
                            <MaterialIcons name="local-hospital" size={24} color="#ffffffff" />
                        </View>
                        <AvText style={styles.actionText}>Ambulance</AvText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionItem, { backgroundColor: '#e9d5ff' }]}
                        onPress={handleNotificationsPress}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#d1b2f7' }]}>
                            <MaterialIcons name="notifications" size={24} color="#ffffffff" />
                        </View>
                        <AvText style={styles.actionText}>Notifications</AvText>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightSection}>
                    <View style={styles.buttonRow}>
                        <Pressable
                            onPress={onLoginPress}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name="log-in-outline"
                                size={24}
                                color={COLORS.ERROR}
                            />
                            <AvText type="overline" style={[{ color: titleColor }]}>  Login</AvText>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }, [title, titleColor, backgroundColor, onLoginPress, onRegisterPress]);


    return (
        <>
            {/* // <ScrollView style={styles.wrapper}> */}
            {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                    <AvText type="caption" style={styles.notificationText}>
                        {notificationCount}
                    </AvText>
                </View>
            )}
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={backgroundColor === COLORS.WHITE ? 'dark-content' : 'light-content'}
            />
            {isAuthenticated ? renderAuthenticatedUI() : renderUnauthenticatedUI()}
            {/* {__DEV__ && (
                <AvText style={styles.debugText as unknown as TextStyle}>
                    Auth: {isAuthenticated ? 'Logged In' : 'Logged Out'}
                </AvText>
            )} */}
            {/* // </ScrollView> */}
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 15,
    },

    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 70,
    },
    rightIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row-reverse',
    },
    modalContent: {
        width: width * 0.7,
        backgroundColor: '#fff',
        height: '100%',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0c223c',
    },
    profileIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4ade80',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIconText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileRole: {
        color: '#ccc',
        fontSize: 14,
    },
    closeButton: {
        padding: 5,
    },
    quickActionsSection: {
        padding: 20,
    },
    quickActionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 15,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
    },
    wrapper: {
        position: 'relative' as const,
    },
    debugText: {
        position: 'absolute' as const,
        bottom: 0,
        color: 'red',
        fontSize: 10,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(16),
        paddingTop: isIos() ? normalize(50) : normalize(40),
        paddingBottom: normalize(10),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
    },
    rightSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    authButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },

    loginButton: {
        borderWidth: 1,
    },
    registerButton: {
        backgroundColor: COLORS.WHITE,
    },
    authButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        padding: normalize(8),
        borderRadius: 20,
    },
    menuButton: {
        padding: normalize(8),
        marginLeft: normalize(8),
    },
    backButtonText: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        lineHeight: normalize(24),
    },
    title: {
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: normalize(8),
    },
    btnText: {
        fontWeight: '600',
    },
    iconButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default Header;
