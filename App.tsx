import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { StatusBar } from 'expo-status-bar';
import ScoreboardScreen from './screens/ScoreboardScreen';
import { ScoreProvider } from './context/ScoreContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import './global.css';

const Stack = createStackNavigator();

export default function App() {
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);

  useEffect(() => {
    setIsStatusBarVisible(true);
  }, []);

  return (
     <SafeAreaProvider>
      <ScoreProvider>
        <NavigationContainer>
          {isStatusBarVisible && (
            <StatusBar style="light" translucent backgroundColor="transparent" />
          )}
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scoreboard" component={ScoreboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ScoreProvider>
    </SafeAreaProvider>
  );
}