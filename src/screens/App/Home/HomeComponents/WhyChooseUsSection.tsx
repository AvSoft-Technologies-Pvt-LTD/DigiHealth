import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import FadeInView from './FadeInView';
import { selectBenefits } from '../../../../store/slices/homeSlice';


const WhyChooseUsSection = () => {
  const benefits = useSelector(selectBenefits);
  return (
    <View style={styles.section}>
      <AvText type="heading_3" style={styles.sectionTitle}>
        Why Choose DigiHealth?
      </AvText>
      <FadeInView delay={200}>
        <Card style={styles.whyCard}>
          <Card.Content>
            {benefits?.map((benefit, index) => (
              <View 
                key={benefit.id} 
                style={[
                  styles.benefitItem,
                  index < benefits.length - 1 && styles.benefitItemBorder
                ]}
              >
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={20} 
                  color={COLORS.GREEN}
                  style={styles.benefitIcon}
                />
                <AvText type="body" style={styles.benefitText}>
                  {benefit.text}
                </AvText>
              </View>
            ))}
          </Card.Content>
        </Card>
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: normalize(24),
    paddingHorizontal: normalize(16),
  },
  sectionTitle: {
    color: COLORS.PRIMARY,
    marginBottom: normalize(16),
  },
  whyCard: {
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  benefitItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  benefitIcon: {
    marginRight: normalize(12),
    width: 24,
    height: 24,
  },
  benefitText: {
    color: COLORS.GREY,
    fontSize: normalize(14),
    flex: 1,
  },
});

export default WhyChooseUsSection;
