import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PAGES } from '../../constants/pages';

type HomeScreenNavigationProp = DrawerNavigationProp<{}>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Home: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action 
          icon="menu" 
          onPress={() => navigation.openDrawer()} 
        />
        <Appbar.Content title="DigiHealth" />
      </Appbar.Header>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to DigiHealth</Text>
        <Text style={styles.subtitle}>Your health, our priority</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default Home;
