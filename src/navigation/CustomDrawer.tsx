// src/navigation/CustomDrawer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Pressable } from 'react-native';
import { useDrawer } from './DrawerContext';
import { PAGES } from '../constants/pages';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../types/navigation';
import StorageService from '../services/storageService';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AvText from '../elements/AvText';
import { width } from '../constants/common';
import { normalize } from '../constants/platform';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUserProfile } from '../store/slices/userSlice';
import { ROLES } from '../constants/data';
import AvModal from '../elements/AvModal';
import { AvButton, AvIcons } from '../elements';


const DRAWER_WIDTH = width * 0.75;

interface CustomDrawerProps {
  userRole?: string;  // Make it optional with '?' if it might not always be provided
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ userRole }) => {
  const { isOpen, closeDrawer } = useDrawer();
  const navigation = useNavigation<any>();
  const animation = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear user token and role
      await StorageService.remove('userToken');
      await StorageService.remove('userRole');
      dispatch(setAuthenticated(false));
      dispatch(setUserProfile({ role: null }));
      setShowLogoutModal(false);
      
      // Close drawer
      closeDrawer();
      
      // Navigate to home screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: PAGES.HOME }],
        })
      );
    } catch (error) {
      console.error('Error during logout:', error);
      // Show error message
      setShowLogoutModal(false);
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
    ...(userRole === ROLES.DOCTOR
      ? [
          { title: 'Dashboard', icon: 'view-dashboard', screen: PAGES.PATIENT_OVERVIEW },
          { title: 'Appointments', icon: 'calendar-clock', screen: PAGES.PATIENT_APPOINTMENTS },
          { title: 'Patients', icon: 'account-group', screen: PAGES.PATIENT_MEDICAL_RECORD },
          { title: 'Payments', icon: 'credit-card', screen: PAGES.BILLING },
          { title: 'Scheduler', icon: 'calendar-month', screen: PAGES.PATIENT_APPOINTMENTS },
          { title: 'Settings', icon: 'cog-outline', screen: PAGES.PATIENT_SETTINGS },
        ]
      : userRole === ROLES.PATIENT
      ? [
          { title: 'Dashboard', icon: 'view-dashboard', screen: PAGES.PATIENT_OVERVIEW },
          { title: 'My Appointments', icon: 'calendar-clock', screen: PAGES.PATIENT_APPOINTMENTS },
          { title: 'Medical Records', icon: 'file-document', screen: PAGES.PATIENT_MEDICAL_RECORD },
          { title: 'Billing', icon: 'credit-card', screen: PAGES.BILLING },
          { title: 'Settings', icon: 'cog-outline', screen: PAGES.PATIENT_SETTINGS },
        ]
      : [
          // Default menu items for other roles
          { title: 'Home', icon: 'home', screen: PAGES.HOME },
          { title: 'Patient Dashboard', icon: 'account-details', screen: PAGES.PATIENT_OVERVIEW },
          { title: 'Medical Record', icon: 'receipt', screen: PAGES.PATIENT_MEDICAL_RECORD },
          { title: 'Appointments', icon: 'calendar-clock', screen: PAGES.PATIENT_APPOINTMENTS },
          { title: 'Billing', icon: 'receipt', screen: PAGES.BILLING },
          { title: 'Settings', icon: 'cog-outline', screen: PAGES.PATIENT_SETTINGS },
        ]),
    { title: 'Logout', icon: 'logout', action: handleLogout, isDestructive: true },
  ];

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Pressable style={styles.overlay} onPress={() => closeDrawer()}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <AvText style={styles.title}>Pocket Clinic</AvText>
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
                <AvIcons
                  type="MaterialCommunityIcons"
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

      {/* Logout Confirmation Modal */}
      <AvModal
        isModalVisible={showLogoutModal}
        setModalVisible={setShowLogoutModal}
        animationType="fade"
        modalStyles={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <AvText type="heading_2" style={styles.modalTitle}>
            Logout
          </AvText>
          <AvText style={styles.modalMessage}>
            Are you sure you want to logout?
          </AvText>
          <View style={styles.modalButtons}>
            <AvButton
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowLogoutModal(false)}
            >
              <AvText>Cancel</AvText>
            </AvButton>
            <AvButton
              style={[styles.modalButton, styles.logoutButton]}
              onPress={confirmLogout}
            >
              <AvText  style={styles.logoutButtonText}>Logout</AvText>
            </AvButton>
          </View>
        </View>
      </AvModal>
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
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(20),
    maxWidth: 400,
  },
  modalTitle: {
    // fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(12),
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: normalize(16),
    color: COLORS.GREY,
    marginBottom: normalize(24),
    textAlign: 'center',
    lineHeight: normalize(22),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: normalize(16),
  },
  modalButton: {
    marginLeft: normalize(20),
    minWidth: normalize(100),
  },
  cancelButton: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  logoutButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  logoutButtonText: {
    color: COLORS.WHITE,
    fontWeight: '500',
  },
});

export default CustomDrawer;
