import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import ScoreboardScreen from './screens/ScoreboardScreen';
import { ScoreProvider } from './context/ScoreContext';
import { Platform } from 'react-native';

import './global.css';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // This effect is no longer necessary for setting status bar properties
  }, []);

  return (
    <ScoreProvider>
      <NavigationContainer>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scoreboard" component={ScoreboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ScoreProvider>
  );
}
