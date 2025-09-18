import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../../src/constants/colors';

const LabsScanRegister: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Labs & Scan Registration</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GREY,
  },
});

export default LabsScanRegister;
