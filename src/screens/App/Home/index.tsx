import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import AvText from '../../../elements/AvText';

// Define the props type for the Home component (if needed in the future)
type HomeProps = {};

// Define the Home component with React.FC and props type
const Home: React.FC<HomeProps> = () => {
  return (
    <View style={styles.container}>
      <AvText type="heading_1" style={styles.text}>Welcome to DigiHealth</AvText>
    </View>
  );
};

// Define the styles for the Home component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE, // Added background color for consistency
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
});

export default Home;