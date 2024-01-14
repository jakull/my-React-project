import React, { useState, useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



function SpielWahlScreen({setLockedOptionsSpiel, setSelectedLabelSpiel, selectedOptionSpiel, setSelectedOptionSpiel }) {


  const pickerfunction = (itemValue) => {
    if (itemValue !== null && itemValue !== "placeholder_value") {
      setSelectedOptionSpiel(itemValue);
      setSelectedLabelSpiel(itemValue);
      setLockedOptionsSpiel({
    		Challenges: false,
    		Achievments: false,
  	  });
    }
  };



  return (
    <View style={styles.container}>
    <Text style={styles.title}>Wählen Sie das Spiel von dem Sie Challenges oder Achievements editieren möchten</Text>
      <Text style={styles.currentCourse}>Aktuelles Spiel: {selectedOptionSpiel} </Text>
      <Picker
        selectedValue={selectedOptionSpiel}
        onValueChange={pickerfunction}
        style={styles.picker}
      >
        <Picker.Item label="Wählen Sie ein Spiel" value="placeholder_value" />
        <Picker.Item label="8b" value="8b" />
		<Picker.Item label="9c" value="9c" />
      </Picker>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'hsl(97, 93%, 92%)',
    paddingTop: 170,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 90,
    textAlign: 'center',
  },
  currentCourse: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    width: '40%',
    height: 50,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8,
  },
});

export default SpielWahlScreen;
