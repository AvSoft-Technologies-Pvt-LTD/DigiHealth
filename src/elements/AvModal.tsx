import React, { ReactNode, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Text as RNText,
  ScrollView
} from 'react-native';

import { normalize } from '../constants/platform';
import { COLORS } from '../constants/colors';
import AvText from './AvText';
import { height, width } from '../constants/common';

export interface AvModalProps extends Omit<RNModalProps, 'visible'> {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  setModalVisible?: (visible: boolean) => void;
  isModalVisible: boolean | { loaderVisible: boolean } | string;
  modalStyles?: StyleProp<ViewStyle>;
  animationType?: 'none' | 'slide' | 'fade';
  title?: string; // Added optional title
}

const AvModal: React.FC<AvModalProps> = ({
  children,
  containerStyle,
  setModalVisible,
  isModalVisible,
  modalStyles,
  animationType = 'fade',
  title,
  ...restProps
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const getModalVisibility = (): boolean => {
    if (isModalVisible === undefined) return false;
    if (typeof isModalVisible === 'string') return Boolean(isModalVisible);
    if (typeof isModalVisible === 'object' && isModalVisible !== null) {
      return Boolean(isModalVisible.loaderVisible);
    }
    return Boolean(isModalVisible);
  };

  const modalVisible = getModalVisibility();

  useEffect(() => {
    if (modalVisible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(0.5);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        })
      ]).start();
    }
  }, [modalVisible]);

  const handleDismiss = () => {
    if (setModalVisible) setModalVisible(false);
  };


  const renderContent = () => (
    <Animated.View 
      style={[
        styles.modalContainer, 
        modalStyles,
        {
          opacity: fadeAnim,
          transform: [
            { scale: animationType === 'fade' ? slideAnim : 1 },
            { translateY: animationType === 'slide' 
                ? slideAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) 
                : 0 
            },
          ],
        },
      ]}
    >
      {title && (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <AvText type="heading_6" style={styles.title}>{title}</AvText>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <RNText style={styles.closeText}>✕</RNText>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
        </View>
      )}
      
      <View style={styles.scrollWrapper}>
        <ScrollView contentContainerStyle={{ paddingBottom: normalize(10),maxHeight:"90%" }}>
          {children}
        </ScrollView>
      </View>
    </Animated.View>
  );

  if (!modalVisible) return null;

  return (
    <RNModal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent={true}
      {...restProps}
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, containerStyle]}>
              {renderContent()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    width: '90%', // <-- use 90% of screen width
    borderRadius: normalize(20),
    padding: normalize(20),
    maxHeight: "96%", // <-- limit max height
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollWrapper: {
    width: '100%',
    flexGrow: 1,
  },
  header: {
    width: width - 20,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    width: "85%",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: COLORS.GREY,
    opacity: 0.3,
  },
  title: {
    flex: 1,
    fontSize:20,
    fontWeight:900,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLORS.LIGHT_GREY,
  },
  content: {
    width: '90%',
  },
});

export default React.memo(AvModal);
