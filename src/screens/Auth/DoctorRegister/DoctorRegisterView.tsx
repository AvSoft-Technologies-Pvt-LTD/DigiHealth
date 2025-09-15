import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import AvText from '../../../elements/AvText';

type DoctorRegisterViewProps = {};

const DoctorRegisterView: React.FC<DoctorRegisterViewProps> = () => {
  return (
    <View style={styles.container}>
      <AvText type="heading_1" style={styles.text}>Doctor Register Page</AvText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
});

export default DoctorRegisterView;