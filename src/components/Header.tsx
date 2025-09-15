import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AvText from '../elements/AvText';
import { COLORS } from '../constants/colors';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    backgroundColor?: string;
    titleColor?: string;
}

const Header: React.FC<HeaderProps> = ({
    title = '',
    showBackButton = true,
    onBackPress,
    backgroundColor = COLORS.WHITE,
    titleColor = COLORS.BLACK,
}) => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            <StatusBar 
                backgroundColor={backgroundColor} 
                barStyle={backgroundColor === COLORS.WHITE ? 'dark-content' : 'light-content'} 
            />
            <View style={[styles.container, { backgroundColor }]}>
                <View style={styles.leftSection}>
                    {showBackButton && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackPress}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <AvText type="title_2" style={[styles.backButtonText, { color: titleColor }]}>
                                ←
                            </AvText>
                        </TouchableOpacity>
                    )}
                </View>
                
                <View style={styles.centerSection}>
                    {title && (
                        <AvText type="title_2" style={[styles.title, { color: titleColor }]}>
                            {title}
                        </AvText>
                    )}
                </View>
                
                <View style={styles.rightSection}>
                    {/* Right section for future use (menu, profile, etc.) */}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 40,
        paddingBottom: 10,
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
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default Header;
