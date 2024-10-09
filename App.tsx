import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Weatherapp from './src/screens/Weatherapp';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
   <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}/>
      <Stack.Screen name='Weatherapp' component={Weatherapp}/>
    </Stack.Navigator>
   </NavigationContainer>

  )
}

export default App

const styles = StyleSheet.create({})