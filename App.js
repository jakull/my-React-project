import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SpielWahlScreen from './ScreensDrawer/ASScreen';
import { ChallengesScreen, FaktenScreen, AchievementsScreen, QuellenScreen, KursWahlScreen } from './ScreensDrawer/Screens';
import KompetenzWahlScreen from './Kompetenzenwahl'
import KategorienWahlScreen from './Kategorienwahl'
import EditScreen from './EditScreen';
import ExpandableSection from './UI-Elemente/ExpandableSection';


const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, lockedOptions, lockedOptionsSpiel,  selectedLabelSpiel, selectedLabelKurs,selectedScreen, setSelectedScreen }) {



  const onOptionPress = (screenName) => {
    if (!lockedOptions[screenName]) {
      setSelectedScreen(screenName);
	    navigation.navigate(screenName);
    }
  };

  const onOptionPressSpiel = (screenName) => {
    if (!lockedOptionsSpiel[screenName]) {
		  setSelectedScreen(screenName);
      navigation.navigate(screenName);
    }
  };

  return (
    <DrawerContentScrollView style={styles.container}>
	 <View>
      <View style={styles.topOptions}>
        <DrawerItem
          label={`Aktueller Kurs: ${selectedLabelKurs }`}
		      icon={({ color, size }) => ( <Ionicons name="pencil" size={size} color={color} /> )}
          onPress={() => onOptionPress('Wahl des Kurses')}
		      focused={selectedScreen === 'Wahl des Kurses'}
        />
        <DrawerItem
          label="Kompetenzen"
          onPress={() => onOptionPress('Kompetenzen')}
		      inactiveTintColor={lockedOptions['Fakten'] ? 'red' : 'black'}
		      focused={selectedScreen === 'Kompetenzen'}
          disabled={lockedOptions['Kompetenzen']}
        />
        <DrawerItem
          label="Fakten"
          onPress={() => onOptionPress('Fakten')}
          inactiveTintColor={lockedOptions['Fakten'] ? 'red' : 'black'}
          disabled={lockedOptions['Fakten']}
		      focused={selectedScreen === 'Fakten'}
        />
        <DrawerItem
          label="Quellen"
          onPress={() => onOptionPress('Quellen')}
          inactiveTintColor={lockedOptions['Quellen'] ? 'red' : 'black'}
          disabled={lockedOptions['Quellen']}
		      focused={selectedScreen === 'Quellen'}
        />
      </View>
	  <View style={styles.bottomOptions}>
		    <DrawerItem
          label={`Aktuelles Spiel: ${selectedLabelSpiel}`}
          icon={({ color, size }) => (<Ionicons name="pencil" size={size} color={color} />)}
          onPress={() => onOptionPressSpiel('Wahl des Spiels')}
		      focused={selectedScreen === 'Wahl des Spiels'}
        />
		    <DrawerItem
          label="Challenges"
          onPress={() => onOptionPressSpiel('Challenges')}
          inactiveTintColor={lockedOptionsSpiel['Challenges'] ? 'red' : 'black'}
          disabled={lockedOptionsSpiel['Challenges']}
		      focused={selectedScreen === 'Challenges'}
        />
		   <DrawerItem
          label="Achievements"
          onPress={() => onOptionPressSpiel('Achievements')}
          inactiveTintColor={lockedOptionsSpiel['Achievements'] ? 'red' : 'black'}
          disabled={lockedOptionsSpiel['Achievements']}
		      focused={selectedScreen === 'Achievements'}
        />
	  </View>
	  </View>
    </DrawerContentScrollView>
  );
}

const Stack = createNativeStackNavigator();

function KompetenzenStack() {
  return (

      <Stack.Navigator initialRouteName="Kompetenzenauswahl">
        <Stack.Screen name="Kompetenzenauswahl" component={KompetenzWahlScreen} />
        <Stack.Screen name="Kategorien der Kompetenz" component={KategorienWahlScreen} />
		    <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>

  );
}


function App() {
  const [selectedOption,setSelectedOption] = useState(null);
  const [selectedOptionSpiel, setSelectedOptionSpiel] = useState(null);

  const [lockedOptions, setLockedOptions] = useState({
														  Kompetenzen: true,
														  Fakten: true,
														  Quellen: true,
														});

  const [lockedOptionsSpiel, setLockedOptionsSpiel] = useState({
														  Challenges: true,
														  Achievements: true,
														});

  const [selectedLabelKurs, setSelectedLabelKurs] = useState('N/A');
  const [selectedLabelSpiel, setSelectedLabelSpiel] = useState('N/A');
  const [selectedScreen, setSelectedScreen] = useState('Wahl des Kurses');

  return (
    <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Wahl des Kurses"
          drawerContent={(props) => (
            <CustomDrawerContent
              {...props}
              lockedOptions={lockedOptions}
        		  lockedOptionsSpiel={lockedOptionsSpiel}
        		  selectedLabelSpiel={selectedLabelSpiel}
        		  selectedLabelKurs={selectedLabelKurs}
        		  selectedScreen={selectedScreen}
        		  setSelectedScreen={setSelectedScreen}

            />
          )}
          >
        <Drawer.Screen name="Wahl des Kurses" component={() => <KursWahlScreen  setLockedOptions={setLockedOptions} setSelectedLabelKurs={setSelectedLabelKurs} selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>} />
        <Drawer.Screen name="Kompetenzen" component={KompetenzenStack} />
    		<Drawer.Screen name="Fakten" component={FaktenScreen} />
    		<Drawer.Screen name="Quellen" component={QuellenScreen} />
    		<Drawer.Screen name="Wahl des Spiels" component={() => <SpielWahlScreen setLockedOptionsSpiel={setLockedOptionsSpiel}  setSelectedLabelSpiel={setSelectedLabelSpiel} selectedOptionSpiel={selectedOptionSpiel} setSelectedOptionSpiel={setSelectedOptionSpiel}/>} />
    		<Drawer.Screen name="Achievements" component={AchievementsScreen} />
    		<Drawer.Screen name="Challenges" component={ChallengesScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  topOptions: {
    marginBottom: 120,
  },
  bottomOptions: {},

});

export default App;
