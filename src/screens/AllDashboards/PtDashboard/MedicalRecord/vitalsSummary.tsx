import React from 'react';
import { View, StyleSheet } from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvIcons from '../../../../elements/AvIcons';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';

interface VitalsSummaryProps {
  currentPatient: any;
}

const VitalsSummary: React.FC<VitalsSummaryProps> = ({ currentPatient }) => {
  const vitalsData = [
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="heart-pulse" size={20} color={COLORS.ERROR} />,
      label: 'BP',
      value: '120/80',
      unit: 'mmHg',
      color: COLORS.ERROR,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.ERROR,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="heart" size={20} color={COLORS.PRIMARY_BLUE} />,
      label: 'Heart Rate',
      value: '78',
      unit: 'bpm',
      color: COLORS.PRIMARY_BLUE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.PRIMARY_BLUE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="thermometer" size={20} color={COLORS.BRIGHT_ORANGE} />,
      label: 'Temp',
      value: '98.6°F',
      color: COLORS.BRIGHT_ORANGE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.ORANGE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="lungs" size={20} color={COLORS.SECONDARY} />,
      label: 'SpO₂',
      value: '98%',
      unit: '%',
      color: COLORS.SECONDARY,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.SECONDARY,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="lungs" size={20} color={COLORS.BRIGHT_PURPLE} />,
      label: 'Resp. Rate',
      value: '18',
      unit: 'bpm',
      color: COLORS.BRIGHT_PURPLE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.PURPLE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="human-male-height" size={20} color={COLORS.OCEAN_BLUE} />,
      label: 'Height',
      value: '165 cm',
      color: COLORS.OCEAN_BLUE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.BLUE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="weight" size={20} color={COLORS.GREEN} />,
      label: 'Weight',
      value: '65 kg',
      color: COLORS.GREEN,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.GREEN,
    },
  ];

  return (
    <View style={styles.vitalsContainer}>
      <View style={styles.vitalsHeader}>
        <AvIcons type="MaterialIcons" name="favorite" size={normalize(20)} color={COLORS.SECONDARY} />
        <AvText type="heading_6" style={styles.sectionTitle}>Vitals Summary</AvText>
      </View>
      <View style={styles.vitalsGrid}>
        {vitalsData.map((vital, index) => (
          <AvCard key={index} cardStyle={[styles.vitalCard, { borderColor: vital.borderColor, backgroundColor: `${vital.color}10` }]}>
            <View style={styles.vitalContent}>
              <View style={[styles.vitalIconContainer, { backgroundColor: `${vital.color}1A` }]}>
                {vital.icon}
              </View>
              <View style={styles.vitalTextContainer}>
                <AvText type="caption" style={[styles.vitalLabel, { color: vital.color }]}>{vital.label}</AvText>
                <AvText type="heading_5" style={[styles.vitalValue, { color: vital.color }]}>{vital.value}</AvText>
                {vital.unit && <AvText type="caption" style={[styles.vitalUnit, { color: vital.color }]}>{vital.unit}</AvText>}
              </View>
            </View>
          </AvCard>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vitalsContainer: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(16),
  },
  vitalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
    marginBottom: normalize(16),
  },
  sectionTitle: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: 'bold',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  vitalCard: {
    padding: normalize(12),
    borderRadius: normalize(10),
    borderWidth: 1,
    elevation: 2,
    marginBottom: normalize(12),
    width: '48%',
  },
  vitalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(12),
  },
  vitalIconContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  vitalTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: normalize(11),
    fontWeight: '500',
    marginBottom: normalize(2),
  },
  vitalValue: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    marginBottom: normalize(2),
  },
  vitalUnit: {
    fontSize: normalize(10),
  },
});

export default VitalsSummary;
