import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { isIos, normalize } from '../constants/platform';
import { RootStackParamList } from '../types/navigation';
import QuickActionsModal from './CommonComponents/QuickActionsModal';
import { useDrawer } from '../navigation/DrawerContext'; // Make sure this import is correct
import { PAGES } from "../constants/pages"
import { AvButton, AvIcons, AvText } from '../elements';
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
  backgroundColor?: string;
  titleColor?: string;
  showHiveIcon?: boolean;
  showMoreIcon?: boolean;
}

type HeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC<HeaderProps> = ({
  title = '',
  showBackButton = true,
  onBackPress,
  onLoginPress = () => { },
  onRegisterPress = () => { },
  backgroundColor = COLORS.WHITE,
  titleColor = COLORS.BLACK,
  showHiveIcon = false,
  showMoreIcon = true,
}) => {
  // console.log("HEADER PROPS",title)
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const navigation = useNavigation<HeaderNavigationProp>();
  const { openDrawer } = useDrawer(); // Use the openDrawer function from your drawer context
  const [modalVisible, setModalVisible] = useState(false);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const renderAuthenticatedUI = () => {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        {/* Left Section: Show both back button and menu button */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <Pressable
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AvIcons
                type={"MaterialIcons"}
                name={"arrow-back"}
                size={normalize(24)}
                color={titleColor}
              />
            </Pressable>
          ) : <Pressable
            style={styles.menuButton}
            onPress={openDrawer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AvIcons
              type={"MaterialIcons"}
              name={"menu"}
              size={normalize(24)}
              color={titleColor}
            />
          </Pressable>}

        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && (
            <AvText type="title_2" style={[styles.title, { color: titleColor }]}>
              {title}
            </AvText>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showMoreIcon && (
            <Pressable
              style={[styles.iconButton, { backgroundColor: COLORS.PRIMARY, borderRadius: 20 }]}
              onPress={() => setModalVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AvIcons
                type={"MaterialIcons"}
                name={"more-horiz"}
                size={normalize(24)}
                color={COLORS.WHITE}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const renderUnauthenticatedUI = () => {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.rightSection}>
          <View style={styles.buttonRow}>
            <AvButton
              mode="contained"
              onPress={onLoginPress}
              labelStyle={styles.btnText}
              buttonColor={COLORS.WHITE}
              icon="login"
              style={{ marginRight: normalize(8),width:normalize(82) }}
            >
              Login
            </AvButton>
            {/* <Pressable
              onPress={onLoginPress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AvIcons
                type={"Ionicons"}
                name={"log-in-outline"}
                size={normalize(24)}
                color={COLORS.ERROR}
              />
              <AvText type="overline" style={[{ color: titleColor }]}> Login</AvText>
            </Pressable> */}
          </View>
        </View>
      </View>
    );
  };

  const handleActionPress = (action: 'pharmacy' | 'ambulance' | 'notifications') => {
    console.log("ACTION CLICKED", action);
    switch (action) {
      case 'pharmacy':
        navigation.navigate(PAGES.PHARMACY_FINDER_VIEW);
        setModalVisible(false);
        break;
      case 'ambulance':
        navigation.navigate(PAGES.AMBULANCE_BOOKING_VIEW);
        setModalVisible(false);
        break;
      case 'notifications':
        navigation.navigate(PAGES.NOTIFICATION_SCREEN);
        setModalVisible(false);
        break;
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={backgroundColor === COLORS.WHITE ? 'dark-content' : 'light-content'}
      />
      {isAuthenticated ? renderAuthenticatedUI() : renderUnauthenticatedUI()}
      <QuickActionsModal
        visible={modalVisible}
        handleActionPress={handleActionPress}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(0),
    paddingTop: isIos() ? normalize(50) : normalize(40),
    paddingBottom: normalize(10),
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor:COLORS.ERROR
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: normalize(75),
  },
  backButton: {
    padding: normalize(8),
    borderRadius: 20,
    marginRight: normalize(8),
  },
  menuButton: {
    padding: normalize(8),
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
  btnText: {
    fontWeight: '600',
    color: COLORS.PRIMARY,
    fontSize:normalize(14),
  },
  buttonRow: {
    flexDirection: 'row',
  },
  iconButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(8),
  },
});


export default React.memo(Header);