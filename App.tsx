import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import ParticipantScreen from './src/screens/ParticipantScreen';
import ModeratorScreen from './src/screens/ModeratorScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator>
        <Tab.Screen name="Participant" component={ParticipantScreen} />
        <Tab.Screen name="Moderator" component={ModeratorScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


