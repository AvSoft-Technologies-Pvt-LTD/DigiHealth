import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
//  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import FadeInView from './FadeInView';
import { selectFeatures } from '../../../../store/slices/homeSlice';
import { AvIcons, AvModal, AvButton } from '../../../../elements';
import { useNavigation } from '@react-navigation/native';
import { PAGES } from '../../../../constants/pages';


const QuickAccessSection = () => {
  const features = useSelector(selectFeatures);
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  const navigation = useNavigation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleFeaturePress = (feature: any) => {
    // if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    // }
    // Handle navigation to feature when authenticated
    console.log('Navigate to:', feature.title);
  };

  const handleLoginPress = () => {
    setShowLoginModal(false);
    navigation.navigate(PAGES.LOGIN);
  };
  return (
    <View style={styles.section}>
      <AvText type="heading_3" style={styles.sectionTitle}>
        Quick Access
      </AvText>
      <View style={styles.featuresGrid}>
        {features?.map((feature, index) => (
          <FadeInView key={feature.id} delay={index * 100} style={styles.featureItem}>
            <TouchableOpacity onPress={() => handleFeaturePress(feature)}>
              <Card style={styles.featureCard}>
                <Card.Content style={styles.featureCardContent}>
                  <View style={styles.iconContainer}>
                    <AvIcons
                      type="MaterialCommunityIcons"
                      name={feature.icon as any} 
                      size={24} 
                      color={COLORS.WHITE}
                      style={styles.featureIcon}
                    />
                  </View>
                  <AvText type="title_3" style={styles.featureTitle}>
                    {feature.title}
                  </AvText>
                  <AvText type="body" style={styles.featureDescription}>
                    {feature.description}
                  </AvText>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </FadeInView>
        ))}
      </View>
      
      {/* Login Modal */}
      <AvModal
        isModalVisible={showLoginModal}
        onDismiss={() => setShowLoginModal(false)}
        title="Authentication Required"
      >
        <View style={styles.modalContent}>
          <AvText type="body" style={styles.modalMessage}>
            You need to be logged in to access this feature. 
            Please login to continue.
          </AvText>
          <View style={styles.modalButtons}>
            <AvButton
              mode="outlined"
              onPress={() => setShowLoginModal(false)}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </AvButton>
            <AvButton
              mode="contained"
              onPress={handleLoginPress}
              style={styles.loginButton}
              buttonColor={COLORS.PRIMARY}
            >
              Login
            </AvButton>
          </View>
        </View>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: normalize(24),
  },
  sectionTitle: {
    color: COLORS.PRIMARY,
    marginBottom: normalize(16),
    paddingHorizontal: normalize(16),
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(8),
  },
  featureItem: {
    width: '48%',
    marginBottom: normalize(16),
  },
  featureCard: {
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureCardContent: {
    padding: normalize(16),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  featureIcon: {
    margin: 0,
    width: 24,
    height: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  featureTitle: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
    marginBottom: normalize(4),
    // fontSize: normalize(15),
  },
  featureDescription: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  modalContent: {
    padding: normalize(20),
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: normalize(20),
    color: COLORS.GREY,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: normalize(12),
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.GREY,
  },
  loginButton: {
    flex: 1,
  },
});

export default QuickAccessSection;
