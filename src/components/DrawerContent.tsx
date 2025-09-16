import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DrawerContent = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.drawerContent}>
        <View style={styles.drawerSection}>
          <Drawer.Section title="Main Menu" style={styles.section}>
            <Drawer.Item
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              )}
              label="Home"
              onPress={() => navigation.navigate('Home')}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => navigation.navigate('Profile')}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="calendar" color={color} size={size} />
              )}
              label="Appointments"
              onPress={() => navigation.navigate('Appointments')}
            />
          </Drawer.Section>
          
          <Drawer.Section title="Settings" style={styles.section}>
            <Drawer.Item
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="cog" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
            <Drawer.Item
              icon={({ color, size }) => (
                <MaterialCommunityIcons name="help-circle" color={color} size={size} />
              )}
              label="Help & Support"
              onPress={() => navigation.navigate('Help')}
            />
          </Drawer.Section>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  drawerContent: {
    flex: 1,
  },
  section: {
    marginTop: 10,
  },
  drawerSection: {
    marginTop: 15,
  },
});

export default DrawerContent;
