import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Image, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// elements
import AvText from '../../../elements/AvText';
import AvButton from '../../../elements/AvButton';
// constants
import { COLORS } from '../../../constants/colors';
import { normalize } from '../../../constants/platform';

// Sections
import Header from '../../../components/Header';
import QuickAccessSection from './HomeComponents/QuickAccessSection';
import OurImpactSection from './HomeComponents/OurImpactSection';
import WhyChooseUsSection from './HomeComponents/WhyChooseUsSection';

// data
import { StatItem, Feature, Benefit } from '../../../constants/data';

// Define the props type for the HomeView component (if needed in the future)
type HomeViewProps = {
  stats: StatItem[];
  features: Feature[];
  benefits: Benefit[];
  refreshing: boolean;
  onRefresh: () => void;
};

// Define the HomeView component with React.FC and props type
const HomeView: React.FC<HomeViewProps> = ({ 
  stats, 
  features, 
  benefits,
  refreshing,
  onRefresh 
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Header
        title={"DigiHealth"}
        showBackButton={false}
        onLoginPress={handleLoginPress}
        onRegisterPress={handleRegisterPress}
        backgroundColor={COLORS.PRIMARY}
        titleColor={COLORS.WHITE}
      />

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
              <Image
                source={require('../../../assets/images/launch_screen.png')}
                style={styles.logoImage}
              />
            </View>
            <AvText type="heading_2" style={styles.title}>
              Welcome to DigiHealth
            </AvText>
            <AvText type="title_3" style={styles.subtitle}>
              Your Digital Healthcare Partner
            </AvText>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonRow}>
          <AvButton
            mode="contained"
            onPress={() => console.log("Book Consultation")}
            labelStyle={styles.btnText}
            buttonColor={COLORS.PRIMARY}
            icon="calendar"
            style={{ flex: 1, marginRight: normalize(8) }}
          >
            Book Consultation
          </AvButton>
          <AvButton
            mode="contained"
            onPress={() => console.log("Explore Services")}
            labelStyle={[styles.btnText, { color: COLORS.WHITE }]}
            buttonColor={COLORS.SECONDARY}
            icon="magnify"
            style={{ flex: 1, marginLeft: normalize(8) }}
          >
            Explore Services
          </AvButton>
        </View>

        {/* Stats Section */}
        <OurImpactSection stats={stats} />

        {/* Quick Access Section */}
        <QuickAccessSection features={features} />

        {/* Why Choose Us Section */}
        <WhyChooseUsSection benefits={benefits}/>

        {/* Bottom Spacer */}
        <View style={{ height: 24 }} />

      </ScrollView>
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
        shadowRadius: 12,
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
    width: normalize(90),
    height: normalize(90),
    borderRadius: normalize(45),
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
    color: 'rgba(255, 255, 255, 0.9)',
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