// Updates in Progress

// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Home, Profile, Appointments, Settings, Help } from '../screens';
// import DrawerContent from '../components/DrawerContent';
// import { PAGES } from '../constants/pages';

// export type DrawerParamList = {
//   [PAGES.HOME]: undefined;
//   [PAGES.PROFILE]: undefined;
//   [PAGES.APPOINTMENTS]: undefined;
//   [PAGES.SETTINGS]: undefined;
//   [PAGES.HELP]: undefined;
// };

// const Drawer = createDrawerNavigator<DrawerParamList>();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <DrawerContent {...props} />}
//       screenOptions={{
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: '#fff',
//         },
//         headerTintColor: '#000',
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//         drawerActiveTintColor: '#6200ee',
//         drawerInactiveTintColor: '#333',
//         drawerLabelStyle: {
//           fontSize: 16,
//           marginLeft: -10,
//         },
//       }}>
//       <Drawer.Screen 
//         name={PAGES.HOME} 
//         component={Home} 
//         options={{
//           title: 'Home',
//           drawerIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="home" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen 
//         name={PAGES.PROFILE} 
//         component={Profile} 
//         options={{
//           title: 'Profile',
//           drawerIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="account" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen 
//         name={PAGES.APPOINTMENTS} 
//         component={Appointments} 
//         options={{
//           title: 'Appointments',
//           drawerIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="calendar" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen 
//         name={PAGES.SETTINGS} 
//         component={Settings} 
//         options={{
//           title: 'Settings',
//           drawerIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="cog" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen 
//         name={PAGES.HELP} 
//         component={Help} 
//         options={{
//           title: 'Help & Support',
//           drawerIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="help-circle" color={color} size={size} />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default DrawerNavigator;
