import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';

import ParkingListScreen from './src/screens/ParkingListScreen';
import AddParkingScreen from './src/screens/AddParkingScreen';
import ParkingDetailScreen from './src/screens/ParkingDetailScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CAF50',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#fff',
    error: '#ff4444',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="ParkingList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E1E1E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen 
            name="ParkingList" 
            component={ParkingListScreen} 
            options={{ title: 'Parking List' }}
          />
          <Stack.Screen 
            name="AddParking" 
            component={AddParkingScreen} 
            options={{ title: 'Add Parking' }}
          />
          <Stack.Screen 
            name="ParkingDetail" 
            component={ParkingDetailScreen} 
            options={{ title: 'Parking Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
