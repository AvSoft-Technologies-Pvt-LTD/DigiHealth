import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../../src/constants/colors';
import { normalize } from '../../../constants/platform';
import Header from '../../../components/Header';
import { PAGES } from '../../../constants/pages';
import { AvText } from '../../../elements';

const LabsScanRegister: React.FC = () => {
  return (
    <>
    <Header
        title={PAGES.LABS_SCAN_REGISTER}
        showBackButton={false}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
    <View style={styles.container}>
      <AvText style={styles.title}>Labs & Scan Registration</AvText>
      <AvText style={styles.subtitle}>Coming Soon</AvText>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: normalize(10),
  },
  subtitle: {
    fontSize: normalize(16),
    color: COLORS.GREY,
  },
});

export default LabsScanRegister;
