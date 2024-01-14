import React, { useState, useEffect, memo } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';




export function KursWahlScreen({ setLockedOptions, setSelectedLabelKurs, selectedOption, setSelectedOption}) {

  console.log("selectedOption:"+selectedOption);


 const pickerfunction = (itemValue) => {
   if (itemValue !== null && itemValue !== "placeholder_value") {
     setSelectedOption(itemValue);
     setSelectedLabelKurs(itemValue);
     setLockedOptions({
       Kompetenzen: false,
       Fakten: false,
       Quellen: false,
     });
   }
 }




  return (
    <View style={styles.container}>
          <Text style={styles.title}>Wählen Sie den Kurs von dem Sie Kompetenzen, Fakten oder Quellen editieren möchten</Text>
          <Text style={styles.currentCourse}>Aktueller Kurs: {selectedOption} </Text>
          <Picker
            selectedValue={selectedOption}
            onValueChange={pickerfunction}
            style={styles.picker}
          >
            <Picker.Item label="Wählen Sie einen Kurs" value="placeholder_value" />
            <Picker.Item label="Klimawandel" value="Klimawandel" />
            <Picker.Item label="Englisch" value="Englisch" />
          </Picker>
        </View>
  );
}

export function AchievementsScreen() {
  return (
    <View>
      <Text>Achievements</Text>
    </View>
  );
}

export function FaktenScreen() {
  return (
    <View>
      <Text>Fakten</Text>
    </View>
  );
}

export function QuellenScreen() {
  return (
    <View>
      <Text>Quellen</Text>
    </View>
  );
}


export function ChallengesScreen() {
  return (
    <View>
      <Text>Challenges</Text>
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
