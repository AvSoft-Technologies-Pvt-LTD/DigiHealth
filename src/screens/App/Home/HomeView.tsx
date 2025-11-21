import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../../assets';
import { COLORS } from '../../../constants/colors';
import { normalize } from '../../../constants/platform';
import Header from '../../../components/Header';
import QuickAccessSection from './HomeComponents/QuickAccessSection';
import OurImpactSection from './HomeComponents/OurImpactSection';
import WhyChooseUsSection from './HomeComponents/WhyChooseUsSection';
import BookAppointmentComponent from './HomeComponents/BookAppointmentComponent';
import { AvButton, AvImage, AvModal, AvText } from '../../../elements';
import LocationPermission from '../../../components/CommonComponents/LocationPermission';

type HomeViewProps = {
  refreshing: boolean;
  onRefresh: () => void;
  isConsultationModalVisible: boolean;
  setConsultationModalVisible: (visible: boolean) => void;
  onContentLoadComplete?: () => void;
};

const HomeView: React.FC<HomeViewProps> = ({
  refreshing,
  onRefresh,
  isConsultationModalVisible,
  setConsultationModalVisible,
  onContentLoadComplete,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  React.useEffect(() => {
    onContentLoadComplete?.();
  }, [onContentLoadComplete]);

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header
        title="DigiHealth"
        showBackButton={false}
        onLoginPress={() => navigation.navigate('Login')}
        onRegisterPress={() => navigation.navigate('Register')}
        backgroundColor={COLORS.PRIMARY}
        titleColor={COLORS.WHITE}
      />
      <LocationPermission
        permissionMessage="We need your location to show nearby services."
        settingsMessage="Please enable location access in settings to use this feature."
        // onPermissionGranted={() => console.log('Location permission granted!')}
        // onPermissionDenied={() => console.log('Location permission denied')}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
        >
          {/* Hero Section */}
          <View style={styles.heroContainer}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <AvImage source={IMAGES.LOGO_CROPPED} style={styles.logoImage} />
              </View>
              <AvText type="heading_2" style={styles.title}>
                Welcome to Pocket Clinic
              </AvText>
              <AvText type="title_3" style={styles.subtitle}>
                Your Digital Health Care Partner
              </AvText>
            </View>
          </View>

          {/* CTA Buttons */}
          <View style={styles.buttonRow}>
            <AvButton
              mode="contained"
              onPress={() => setConsultationModalVisible(true)}
              labelStyle={styles.btnText}
              buttonColor={COLORS.PRIMARY}
              icon="calendar"
              style={{ flex: 1, marginRight: normalize(8) }}
            >
              Book Consultation
            </AvButton>
            <AvButton
              mode="contained"
              onPress={() => console.log('Explore Services')}
              labelStyle={[styles.btnText, { color: COLORS.WHITE }]}
              buttonColor={COLORS.SECONDARY}
              icon="magnify"
              style={{ flex: 1, marginLeft: normalize(8) }}
            >
              Explore Services
            </AvButton>
          </View>

          <AvModal
            isModalVisible={isConsultationModalVisible}
            setModalVisible={setConsultationModalVisible}
            animationType="fade"
            title="Booking Consultation"
            containerStyle={{ padding: normalize(6) }}
          >
            <BookAppointmentComponent />
          </AvModal>

          {/* Sections */}
          <OurImpactSection />
          <QuickAccessSection />
          <WhyChooseUsSection />
          <View style={{ height: 24 }} />
        </ScrollView>

      </LocationPermission>
    </View>
  );
};

// Define the styles for the HomeView component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flexGrow: 1,
    paddingBottom: normalize(24),
  },
  contentContainer: {
    paddingBottom: normalize(24),
  },
  heroContainer: {
    padding: normalize(10),
    borderBottomLeftRadius: normalize(60),
    borderBottomRightRadius: normalize(60),
    marginBottom: normalize(24),
    backgroundColor: COLORS.PRIMARY,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: normalize(12),
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(60),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
    ...Platform.select({
      ios: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoImage: {
    width: normalize(80),
    height: normalize(80),
  },
  title: {
    color: COLORS.WHITE,
    fontWeight: '700',
    marginBottom: normalize(8),
  },
  subtitle: {
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: normalize(24),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    marginBottom: normalize(24),
  },
  btnText: {
    fontWeight: '600',
  },
  section: {
    marginBottom: normalize(24),
  },
  sectionTitle: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
    marginBottom: normalize(16),
    paddingHorizontal: normalize(16),
  },
});

export default HomeView;