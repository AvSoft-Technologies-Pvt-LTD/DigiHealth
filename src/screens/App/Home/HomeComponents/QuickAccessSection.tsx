import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
//  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import FadeInView from './FadeInView';
import { selectFeatures } from '../../../../store/slices/homeSlice';
import { AvIcons } from '../../../../elements';


const QuickAccessSection = () => {
  const features = useSelector(selectFeatures);
  return (
    <View style={styles.section}>
      <AvText type="heading_3" style={styles.sectionTitle}>
        Quick Access
      </AvText>
      <View style={styles.featuresGrid}>
        {features?.map((feature, index) => (
          <FadeInView key={feature.id} delay={index * 100} style={styles.featureItem}>
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
          </FadeInView>
        ))}
      </View>
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
});

export default QuickAccessSection;
