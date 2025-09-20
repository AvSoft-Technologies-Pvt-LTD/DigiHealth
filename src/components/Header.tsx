import React from 'react';
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
}) => {

    // Use a more specific selector to get the authentication state
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const { openDrawer } = useDrawer();

    // Log authentication state changes for debugging
    React.useEffect(() => {
        console.log('Header - Authentication state changed:', isAuthenticated);
    }, [isAuthenticated]);

    const navigation = useNavigation<HeaderNavigationProp>();

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
                    <Pressable
                        style={styles.backButton}
                        onPress={handleBackPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <AvText type="title_2" style={[styles.backButtonText, { color: titleColor }]}>
                            ←
                        </AvText>
                    </Pressable>
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
        console.log('Rendering unauthenticated UI');
        return (
            <View style={[styles.container, { backgroundColor }]}>
                {/* Left Section - Empty */}
                {/* <View style={styles.leftSection} /> */}

                {/* Right Section - Auth Buttons */}
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
        <View style={styles.wrapper}>
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
        </View>
    );
};

const styles = StyleSheet.create({
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
