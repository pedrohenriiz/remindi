import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import AddMedicationPage from '../pages/AddMedication';

const Stack = createStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='MainTabs' component={TabNavigator} />

        <Stack.Screen name='AddMedication' component={AddMedicationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
