import React, { useEffect, useRef, useState, memo } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { selectStats } from '../../../../store/slices/homeSlice';



interface AnimatedNumberProps {
  value: number;
  style: any;
}

const AnimatedNumber = memo(
  ({ value, style }: AnimatedNumberProps) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const listener = animatedValue.addListener(({ value }) => {
        setDisplayValue(Math.floor(value));
      });

      Animated.timing(animatedValue, {
        toValue: value,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();

      return () => {
        animatedValue.removeListener(listener);
        animatedValue.removeAllListeners();
      };
    }, [value]);

    return <Animated.Text style={style}>{displayValue.toLocaleString()}</Animated.Text>;
  },
  (prev, next) => prev.value === next.value && prev.style === next.style
);

const OurImpactSection = memo(() => {
  const stats = useSelector(selectStats);  
  return (
    <View style={styles.section}>
      <AvText type="heading_3" style={styles.sectionTitle}>
        Our Impact
      </AvText>
      <View style={styles.statsContainer}>
        {stats?.map((stat) => (
          <View key={stat.id} style={styles.statItem}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statCardContent}>
                <View style={styles.statValueContainer}>
                  <AnimatedNumber 
                    value={stat.value} 
                    style={styles.statValue}
                  />
                  <Text style={styles.statSuffix}>{stat.suffix}</Text>
                </View>
                <AvText type="body" style={styles.statLabel}>
                  {stat.label}
                </AvText>
              </Card.Content>
            </Card>
          </View>
        ))}
      </View>
    </View>
  );
});


const styles = StyleSheet.create({
  section: {
    marginBottom: normalize(24),
  },
  sectionTitle: {
    color: COLORS.PRIMARY,
    marginBottom: normalize(16),
    paddingHorizontal: normalize(16),
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(8),
  },
  statItem: {
    width: '48%',
    marginBottom: normalize(16),
  },
  statCard: {
    borderRadius: 16,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statCardContent: {
    padding: normalize(16),
    alignItems: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(8),
  },
  statValue: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
    fontSize: normalize(24),
    textAlign: 'center',
  },
  statSuffix: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginLeft: 4,
  },
  statLabel: {
    color: COLORS.GREY,
    textAlign: 'center',
    fontSize: normalize(13),
  },
});

export default OurImpactSection;
