import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Weatherapp from './Weatherapp';

const WelcomeScreen = () => {
  const navigation = useNavigation();


  setTimeout(() => {

    navigation.navigate(Weatherapp)
    
  }, 1500);
  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.imghead}>
        <Image style={styles.img} source={require('../image/welcome.png')} />
        <Text style={styles.text}>Weather</Text>
        <Text style={styles.text1}>Forecast</Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#DAE0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imghead: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 200,
    height: 200,
    bottom: 15,
  },
  text: {
    fontSize: 30,
    fontFamily: 'Poppins-Regular',
    color: '#0A0A22',
  },
  text1: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#8B95A2',
  },
});
