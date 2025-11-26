import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    TouchableOpacity,
    Image,
    FlatList,
    ViewToken,
    ViewabilityConfig,
    ViewabilityConfigCallbackPairs,
} from 'react-native';
import { Card } from 'react-native-paper';
import { COLORS } from '../../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { normalize } from '../../../constants/platform';
import { AvText } from '../../../elements';
import { IMAGES } from '../../../assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { height } from '../../../constants/common';

type UserRole = 'Patient' | 'Doctor' | 'Hospital' | 'Labs';

type CarouselItem = {
    id: string;
    role: UserRole;
    title: string;
    description: string;
    image: any;
};

type RegisterViewProps = {
    onRoleSelect: (role: UserRole) => void;
    selectedRole: UserRole | null;
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

const { width: viewportWidth } = Dimensions.get('window');

const RegisterView: React.FC<RegisterViewProps> = ({ onRoleSelect, selectedRole, navigation }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }, []);

    const viewabilityConfig: ViewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>([
        {
            viewabilityConfig,
            onViewableItemsChanged,
        },
    ]);

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setActiveIndex(index);
    };

    const userRoles: CarouselItem[] = [
        {
            id: '1',
            role: 'Patient',
            title: 'Welcome to PocketClinic!',
            description: 'Order medicines, consult Doctors, store all your Medical Records & manage your family\'s health.',
            image: IMAGES.REG_PATIENT
        },
        {
            id: '2',
            role: 'Doctor',
            title: 'Welcome to PocketClinic!',
            description: 'Centralised access to Consultations, Patients & their Histories for all your practices.',
            image: IMAGES.REG_DOCTOR
        },
        {
            id: '3',
            role: 'Hospital',
            title: 'Welcome to PocketClinic!',
            description: 'Access to AI-driven insights & analytics on day-to-day operations for admins, staff & stakeholders.',
            image: IMAGES.REG_HOSPITAL
        },
        {
            id: '4',
            role: 'Labs',
            title: 'Welcome to PocketClinic!',
            description: 'Real-time access to your store\'s Sales, Purchases, Inventory, Deliveries, Customers & Finances.',
            image: IMAGES.REG_LAB
        }
    ];

    const renderItem = ({ item }: { item: CarouselItem }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.slideContent}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <AvText type="heading_2" style={styles.slideTitle}>{item.title}</AvText>
                        <AvText type="title_2" style={styles.slideSubtitle}>Get started as a {item.role}</AvText>
                    </View>

                    {/* Image Section */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.roleImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        <AvText type="body" style={styles.slideDescription}>
                            {item.description}
                        </AvText>

                        <TouchableOpacity
                            style={styles.proceedButton}
                            onPress={() => onRoleSelect(item.role)}
                        >
                            <AvText style={styles.proceedButtonText}>Proceed as {item.role}</AvText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const getTabIcon = (role: string, isActive: boolean) => {
        const size = 24;
        const color = isActive ? COLORS.PRIMARY : COLORS.GREY;

        switch (role) {
            case 'Patient':
                return <Icon name="account" size={size} color={color} />;
            case 'Doctor':
                return <Icon name="doctor" size={size} color={color} />;
            case 'Hospital':
                return <Icon name="hospital-building" size={size} color={color} />;
            case 'Labs':
                return <Icon name="microscope" size={size} color={color} />;
            default:
                return <Icon name="account" size={size} color={color} />;
        }
    };

    const renderTab = (item: CarouselItem, index: number) => {
        const isActive = activeIndex === index;
        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => scrollToIndex(index)}
            >
                <View style={styles.tabContent}>
                    {getTabIcon(item.role, isActive)}
                    <AvText
                        style={[
                            styles.tabText,
                            isActive && styles.activeTabText,
                        ]}
                        type={isActive ? "bodyBold" : "body"}
                    >
                        {item.role}
                    </AvText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Main Content */}
            <View style={styles.mainContent}>
                <View style={styles.contentCard}>
                    <Card.Content style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={userRoles}
                            renderItem={renderItem}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScrollToIndexFailed={() => { }}
                            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                            // keyExtractor={(item) => item.id}
                            // getItemLayout={(data, index) => ({
                            //     length: viewportWidth - 40,
                            //     offset: (viewportWidth - 40) * index,
                            //     index,
                            // })}
                            style={styles.flatList}
                        />
                    </Card.Content>
                </View>

                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        {userRoles.map((item, index) => renderTab(item, index))}
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AvText type="body" style={styles.footerText}>
                        Already have an account?{' '}
                        <AvText type="body" style={styles.loginLink}>Sign In</AvText>
                    </AvText>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BG_OFF_WHITE,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    contentCard: {
        backgroundColor: COLORS.WHITE,
        marginVertical: normalize(0),
        flex: 1,
    },
    carouselContainer: {
        margin: 10,
        height: height - 300,
    },
    flatList: {
        flex: 1,
    },
    slide: {
        width: viewportWidth - 60,
        // flex: 1,
        justifyContent: 'center',
    },
    slideContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(20),
        // backgroundColor: COLORS.ERROR, // Ensure content has background
    },
    headerSection: {
        alignItems: 'center',
        marginTop: normalize(10),
    },
    slideTitle: {
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        textAlign: 'center',
        marginBottom: normalize(8),
    },
    slideSubtitle: {
        fontSize: normalize(18),
        color: COLORS.SECONDARY,
        textAlign: 'center',
        marginBottom: normalize(20),
        fontWeight: '600',
    },
    imageSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(10),
    },
    imageContainer: {
        width: '100%',
        height: 150, // Reduced height for better balance
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleImage: {
        width: 150,
        height: 150,
        resizeMode: 'center',
    },
    contentSection: {
        alignItems: 'center',
        marginBottom: normalize(10),
    },
    slideDescription: {
        fontSize: normalize(14),
        color: COLORS.GREY,
        textAlign: 'center',
        marginBottom: normalize(20),
        lineHeight: normalize(20),
    },
    proceedButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(30),
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    proceedButtonText: {
        color: COLORS.WHITE,
        fontSize: normalize(16),
        fontWeight: '600',
    },
    tabsWrapper: {
        paddingHorizontal: normalize(20),
        marginBottom: normalize(10),
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        borderRadius: 30,
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: normalize(8),
        borderRadius: 20,
        marginHorizontal: normalize(2),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: COLORS.PRIMARY + '20',
    },
    tabText: {
        fontSize: normalize(12),
        color: COLORS.GREY,
        marginTop: normalize(4),
        textAlign: 'center',
    },
    activeTabText: {
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: normalize(20),
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_GREY,
        backgroundColor: COLORS.WHITE,
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