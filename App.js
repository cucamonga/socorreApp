import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/home';
import CameraScreen from './screens/camera';
import AddressScreen from './screens/address';
import FinalScreen from './screens/final';
import ImageScreen from './screens/imagens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Socorre">
        <Stack.Screen name="Socorre" component={HomeScreen} />
        <Stack.Screen name="Cam" component={CameraScreen} />
        <Stack.Screen name="Local" component={AddressScreen} />
        <Stack.Screen name="Imagens" component={ImageScreen} />
        <Stack.Screen name="Finalizado" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
