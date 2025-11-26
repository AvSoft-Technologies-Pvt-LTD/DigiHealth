import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Pressable } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { COLORS } from '../../constants/colors';
import { Typography } from '../../constants/fonts';
import { widthPercentageToDP, normalize } from '../../constants/platform';
import { AvText, AvIcons } from '../../elements';

interface QuickActionsModalProps {
  visible: boolean;
  onClose: () => void;
  handleActionPress: (action: 'pharmacy' | 'ambulance' | 'notifications') => void;

}

const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  visible,
  onClose,
  handleActionPress,
}) => {
  const userProfile = useAppSelector((state) => state.user.userProfile);
  const userRole = useAppSelector((state) => state.user.userProfile.role);
  const slideAnim = useRef(new Animated.Value(widthPercentageToDP(100))).current;
  // console.log("User Profile", userProfile)
  // console.log("User Role", userRole)
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      slideAnim.setValue(widthPercentageToDP(100));
    }
  }, [visible]);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };



  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateX: slideAnim }] },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* User Profile Section */}
          <View style={styles.userProfileSection}>
            <View style={styles.userAvatar}>
              <AvText type='title_6' style={[styles.userInitial]}>
                {getInitials(userProfile.name)}
              </AvText>
            </View>
            <View style={styles.userInfo}>
              <AvText type='heading_4' style={[styles.userName]}>
                {userProfile.name || 'User'}
              </AvText>
              <AvText type='body' style={[styles.userRole]}>
                {userRole || 'Patient'}
              </AvText>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <AvIcons
                type={"MaterialCommunityIcons"}
                name={"close"}
                size={normalize(24)}
                color={COLORS.WHITE}
              />
            </TouchableOpacity>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.quickActionsContainer}>
            <View style={styles.quickActionsSection}>
              <AvText type='title_3' style={[styles.quickActionsTitle]}>
                QUICK ACTIONS
              </AvText>

              {/* Pharmacy Action */}
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: COLORS.LIGHT_GREEN }]}
                onPress={() => handleActionPress('pharmacy')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: COLORS.PRIMARY }]}>
                  <AvIcons type={"MaterialCommunityIcons"} name={"pill"} size={normalize(24)} color={COLORS.WHITE} />
                </View>
                <AvText type='buttonText' style={[styles.actionText]}>Pharmacy</AvText>
              </TouchableOpacity>

              {/* Ambulance Action (Light Red Background) */}
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: COLORS.LIGHT_RED }]}
                onPress={() => handleActionPress('ambulance')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: COLORS.ERROR }]}>
                  <AvIcons type={"MaterialCommunityIcons"} name="ambulance" size={normalize(24)} color={COLORS.WHITE} />
                </View>
                <AvText type='buttonText' style={[styles.actionText]}>Ambulance</AvText>
              </TouchableOpacity>

              {/* Notifications Action (Light Purple Background) */}
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: COLORS.LIGHT_PURPLE }]}
                onPress={() => handleActionPress('notifications')}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: COLORS.BRIGHT_PURPLE }]}>
                  <AvIcons type={"MaterialCommunityIcons"} name="bell" size={normalize(24)} color={COLORS.WHITE} />
                </View>
                <AvText type='buttonText' style={[styles.actionText]}>Notifications</AvText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  modalContent: {
    width: widthPercentageToDP(70),
    height: '100%',
    backgroundColor: COLORS.OFFWHITE,
    overflow: 'hidden',
  },
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: COLORS.PRIMARY,
    paddingTop: normalize(40),
    paddingBottom: normalize(20),
  },
  userAvatar: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  userInitial: {
    color: COLORS.WHITE,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.WHITE,
  },
  userRole: {
    color: COLORS.LIGHT_GREY,
  },
  closeButton: {
    padding: normalize(8),
    marginLeft: normalize(10),
  },
  quickActionsContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingTop: normalize(20),
  },
  quickActionsSection: {
    paddingHorizontal: widthPercentageToDP(5),
  },
  quickActionsTitle: {
    marginBottom: normalize(20),
    letterSpacing: normalize(1),
    color: COLORS.GREY,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(12),
    padding: normalize(15),
    marginBottom: normalize(15),
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
  },
  actionIconContainer: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  actionText: {
    color: COLORS.PRIMARY_TXT,
  },
});

export default QuickActionsModal;
