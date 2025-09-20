// src/navigation/CustomDrawer.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Pressable, Alert } from 'react-native';
import { useDrawer } from './DrawerContext';
import { PAGES } from '../constants/pages';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../types/navigation';
import StorageService from '../services/storageService';
import { CommonActions, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvText from '../elements/AvText';
import { width } from '../constants/common';
import { normalize } from '../constants/platform';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserProfile } from '../store/slices/userSlice';


const DRAWER_WIDTH = width * 0.75;

const CustomDrawer: React.FC = () => {
  const { isOpen, closeDrawer } = useDrawer();
  const navigation = useNavigation<any>();
  const animation = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Clear user token and role
      await StorageService.remove('userToken');
      await StorageService.remove('userRole');
      dispatch(setAuthenticated(false));
      dispatch(setUserProfile({ role: null }));
      // Reload app
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: PAGES.SPLASH,
            },
          ],
        })
      );
            
      // Close drawer
      closeDrawer();
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: PAGES.HOME }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const overlayOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Wait for the animation to complete before hiding the drawer
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with your animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;
 
  const menuItems = [
    // { title: 'Home', icon: 'home', screen: PAGES.HOME },
    { title: 'Patient Dashboard', icon: 'home', screen: PAGES.PATIENT_DASHBOARD },
    { title: 'Patient Register', icon: 'account-plus', screen: PAGES.PATIENT_REGISTER },
    { title: 'Doctor Register', icon: 'stethoscope', screen: PAGES.DOCTOR_REGISTER },
    { title: 'Hospital Register', icon: 'hospital-building', screen: PAGES.HOSPITAL_REGISTER },
    { title: 'Labs & Scan', icon: 'microscope', screen: PAGES.LABS_SCAN_REGISTER },
    { title: 'Settings', icon: 'setting', screen: PAGES.PATIENT_SETTINGS },
    { title: 'Appointments', icon: 'microscope', screen: PAGES.PATIENT_APPOINTMENTS },
    { 
      title: 'Logout', 
      icon: 'logout', 
      action: handleLogout,
      isDestructive: true 
    },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Pressable style={styles.overlay} onPress={() => closeDrawer()}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <AvText style={styles.title}>DigiHealth</AvText>
          <AvText style={styles.subtitle}>Your Health Partner</AvText>
        </View>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: pressed ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: normalize(24),
                  marginVertical: normalize(4),
                  padding: normalize(12),
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                item.isDestructive && styles.destructiveItem
              ]}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  closeDrawer(item.screen as keyof RootStackParamList);
                }
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={normalize(24)}
                  color={COLORS.WHITE}
                />
              </View>
              <AvText style={[styles.menuItemText, { marginLeft: normalize(16) }]}>{item.title}</AvText>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.PRIMARY,
    elevation: normalize(5),
    paddingTop: normalize(50),
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: normalize(5),
  },
  header: {
    padding: normalize(20),
    paddingTop: normalize(50),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    backgroundColor: COLORS.PRIMARY_BG,
  },
  title: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  subtitle: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginTop: normalize(4),
  },
  menuContainer: {
    paddingVertical: normalize(10),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    marginHorizontal: normalize(12),
    borderRadius: normalize(24),
    marginVertical: normalize(4),
  },
  iconContainer: {
    width: normalize(24),
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: normalize(16),
    color: COLORS.WHITE,
    marginLeft: normalize(16),
  },
  destructiveItem: {
    marginTop: normalize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: normalize(12),
  },
  destructiveText: {
    color: COLORS.ERROR,
  },
});

export default CustomDrawer;
