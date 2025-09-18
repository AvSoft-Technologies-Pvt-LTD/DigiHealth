import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import AvText from '../../../elements/AvText';
import Header from '../../../components/Header';
import { PAGES } from '../../../constants/pages';

// Define the props type for the HomeView component (if needed in the future)
type HomeViewProps = {};

// Define the HomeView component with React.FC and props type
const HomeView: React.FC<HomeViewProps> = () => {

  return (
    <>
      <Header
        title={PAGES.HOME}
        showBackButton={false}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
      <View style={styles.container}>
        <AvText type="heading_1" style={styles.text}>Welcome to DigiHealth</AvText>
      </View>
    </>
  );
};

// Define the styles for the HomeView component
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

export default HomeView;