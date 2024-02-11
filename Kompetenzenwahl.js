import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, push, set, onChildAdded, remove, onChildChanged, onChildRemoved} from "firebase/database";
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, FlatList, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import KategorienWahlScreen from './Kategorienwahl'
import EditScreen from './EditScreen';
import ExpandableSection from './UI-Elemente/ExpandableSection';
import { MaterialIcons } from '@expo/vector-icons';



const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function KompetenzWahlScreen() {

  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();


  const toggleModal = () => {
   setModalVisible(!modalVisible);
 };

   const handleSelection = () => {
    if (selectedKey) {
      navigation.navigate('Kategorien der Kompetenz', { selectedKey });
    }
  };

  const filteredKeys = keys.filter((key) =>
   key.toLowerCase().includes(searchText.toLowerCase())
 );


  useEffect(() => {
    const JSONRef = ref(database, '/JSON-Tree/competences');

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dataKeys = Object.keys(data);
        setKeys(dataKeys);
        console.log("Gelesene Daten:", dataKeys);

      } else {
        console.log("Keine Daten gefunden.");
      }
    };

    get(JSONRef)
      .then(onDataChange)
      .catch((error) => {
        console.error("Fehler beim Lesen der Daten:", error);
      });

    const dataChangeListener = onChildAdded(JSONRef, (snapshot) => {
      onDataChange(snapshot);
    });

    const handleChildRemoved = onChildRemoved(JSONRef, (snapshot) => {
      onDataChange(snapshot);
      console.log("Listener für Entfernen aufgerufen");
});


  }, []);



 const deleteCompetenceFromFirebase = async () => {
   if (selectedKey) {
     const competenceRef = ref(database, `/JSON-Tree/competences/${selectedKey}`);
     try {
       await remove(competenceRef);
       const updatedKeys = keys.filter((key) => key !== selectedKey);
       setKeys(updatedKeys);
       setSelectedKey(null);
       console.log('Kompetenz erfolgreich gelöscht:', selectedKey);
     } catch (error) {
       console.error('Fehler beim Löschen der Kompetenz:', error);
     }
   } else {
     console.warn('Keine Kompetenz ausgewählt zum Löschen.');
   }
 };

  return (
    <View style={styles.container}>
    <CustomModal modalVisible={modalVisible} toggleModal={toggleModal} selectedKey={selectedKey} setSelectedKey={setSelectedKey} keys={keys} setKeys={setKeys}/>
    <Text style={styles.title}>Wählen Sie die Kompetenz aus die sie bearbeiten möchten</Text>
      <Text style={styles.currentCourse}>gewählte Kompetenz: {selectedKey}</Text>
  	  <TextInput
          placeholder="Suche nach Kompetenzen"
          style={styles.textinput}
          onChangeText={(newText) => setSearchText(newText)}
          value={searchText}
        />
      <Picker
        selectedValue={selectedKey}
        onValueChange={(itemValue) => {
          if (itemValue !== null && itemValue !== 'placeholder_value') {
            setSelectedKey(itemValue);
          }
        }}
        style={styles.picker}
      >
          <Picker.Item label="Kompetenz auswählen" value={'placeholder_value'}/>
        {filteredKeys.map((key) => (
          <Picker.Item label={key} value={key} key={`${key}_unique`}   />
        ))}
      </Picker>


      <View style={styles.containerButtons}>
      <CustomButton onPress={handleSelection} title="Ausgewählte kompetenz bearbeiten" backgroundColor= 'hsl(331,72%,65%)' />
        <View style={styles.buttonRow}>
        <CustomButton onPress={toggleModal} title="Kompetenz hinzufügen" backgroundColor= 'rgb(255,222, 173)' />
        <CustomButton onPress={deleteCompetenceFromFirebase} title="Kompetenz löschen" backgroundColor= 'rgb(255,222, 173)'/>
        </View>
      </View>

  </View>
  );
}

const CustomModal = ({ modalVisible, toggleModal, selectedKey, setSelectedKey, keys, setKeys }) => {

  const navigation = useNavigation();

  const [newMcSelect, setNewMcSelect] = useState("Name der neuen Frage");
  const [newChatBubble, setNewChatBubble] = useState("Name der neuen Frage");
  const [newMuText, setNewMuText] = useState("Name der neuen Frage");

  const [inputStates, setInputStates] = useState({
     button1: false,
     button2: false,
     button3: false,
   });

   const toggleInput = (buttonName) => {
     setInputStates({
       ...inputStates,
       [buttonName]: !inputStates[buttonName],
     });
   };


   const addObjectToFirebase = async (buttonName, inputValue) => {
     const database = getDatabase();
     const JSONRefModal = ref(database, `/JSON-Tree/competences/${inputValue}`);
     let newObject = {};
     if (inputValue !== "Name der neuen Frage") {
       try {
         switch (buttonName) {
           case 'button1':

              newObject = {
                 answers: [
                   {
                     content: [
                       {
                         Text: "neue Antwort"
                       }
                     ],
                     id: "all_auswirkungen",
                     validity: true
                   }

                 ],
                 content: [
                   {
                     Text: "neuer Content"
                   }

                 ],
                 explanation: [
                   {
                     Separator: 10
                   },
                   {
                     Expandable: {
                       content: [
                         {
                           Text: "neues Expandable"
                         }
                       ],
                       icon: "help",
                       personalized: true,
                       subtitle: "Auswirkungen und Kosten",
                       title: "Grundwissen"
                     }
                   }
                 ],
                 key: inputValue,
                 numbAns: 4,
                 title: inputValue,
                 type: "MC_Select"
               };
               break;

           case 'button2':

              newObject = {
                "INFO": [
                  {
                    "ChatBubble": {
                      "content": [
                        {
                          "Text": "neue Chatbubble"
                        }
                      ],
                      "img": "/klimawandel_basics/media/Linda.jpg",
                      "orientation": "left"
                    }
                  }
                ],
                "key": "inputValue",
                "oneTime": true,
                "title": "Geschichte"
              };
              break;

          case 'button3':

             newObject = {
               "MT": [
                 {
                   "Text": "neues MT"
                 },
                 {
                   "expl": [
                     {
                       "Text": "Haushalte und Kleinverbraucher emittieren 17 % der Treibhausgase."
                     }
                   ]
                 },
                 {
                   "TextInput": {
                     "answers": [
                       "17",
                       "17%",
                       "17 %"
                     ],
                     "id": "branchen2_t1"
                   }
                 }
               ],
               "evaluateSolo": true,
               "explanation": [
                 {
                   "Separator": 10
                 },
                 {
                   "Expandable": {
                     "content": [
                       {
                         "Text": "neues Expandable"
                       },

                     ],
                     "icon": "help",
                     "personalized": true,
                     "subtitle": "Verteilung CO₂ auf Branchen",
                     "title": "Grundwissen"
                   }
                 }
               ],
               "key": "inputValue",
               "type": "MU_Text"
             };
           break;

          default:
            break;
          }

          setSelectedKey(inputValue);
          await set(JSONRefModal, newObject);
          const updatedKeys = [...keys, inputValue];
          setKeys(updatedKeys);


     } catch (error) {
       console.error('Fehler beim Hinzufügen des Objekts:', error);
     }
     toggleModal();
     navigation.navigate('Kategorien der Kompetenz', { selectedKey: inputValue });
     console.log('Neues Objekt erfolgreich hinzugefügt!');
     }
   };


   return (

     <Modal
   animationType="slide"
   transparent={true}
   visible={modalVisible}
   onRequestClose={toggleModal}
 >
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(144, 238, 144, 0.7)' }}>
       <View style={styles.buttonContainer}>
         <Button title="Frage hinzufügen" onPress={() => toggleInput('button1')} />
         {inputStates.button1 && (
           <View style={{flexDirection: 'row', flex: 1 }}>
           <TextInput
             style={styles.textInput}
             placeholder={newMcSelect}
             value={newMcSelect}
             onChangeText={(text) => setNewMcSelect(text)}
           />

           <MaterialIcons name="system-update-alt" size={24} color="black" onPress={() => addObjectToFirebase('button1', newMcSelect)} />
           </View>
         )}
       </View>
       <View style={styles.buttonContainer}>
         <Button title="Chatbubble Hinzufügen" onPress={() => toggleInput('button2')} />
         {inputStates.button2 && (
           <View style={{flexDirection: 'row', flex: 1 }}>
           <TextInput
             style={styles.textInput}
             placeholder={newChatBubble}
             value={newChatBubble}
             onChangeText={(text) => setNewChatBubble(text)}
           />
           <MaterialIcons name="system-update-alt" size={24} color="black" onPress={() => addObjectToFirebase('button2', newChatBubble)} />
           </View>

         )}
       </View>
       <View style={styles.buttonContainer}>
         <Button title="Frage mit TextInput hinzufügen" onPress={() => toggleInput('button3')} />
         {inputStates.button3 && (
        <View style={{flexDirection: 'row', flex: 1 }}>
             <TextInput
               style={styles.textInput}
               placeholder={newMuText}
               value={newMuText}
               onChangeText={(text) => setNewMuText(text)}
              />
              <MaterialIcons name="system-update-alt" size={24} color="black" onPress={() => addObjectToFirebase('button3', newMuText)} />
        </View>
         )}
       </View>
       <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
          <MaterialIcons name="close" size={24} color="black" />
      </TouchableOpacity>
</View>
      </Modal>

   );
};

const CustomButton = ({ onPress, title, backgroundColor }) => {
  const buttonStyle = [styles.buttoncustom, { backgroundColor: backgroundColor || '#3498db' }];
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerButtons: {
    alignItems: 'center',
    marginTop: 20,
  },

buttoncustom: {
  borderWidth: 4,
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 24,
  marginVertical: 10,
  alignItems: 'center',
  marginHorizontal: 50,
},
buttonText: {
  color: 'black',
  fontSize: 18,
  fontWeight: 'bold',
},
buttonRow: {
  flexDirection: 'row',
  marginVertical: 10,
  justifyContent: 'space-between',
},

centerButton: {
  backgroundColor: 'lightblue',
  padding: 15,
  borderRadius: 5,
},
  container: {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingHorizontal: 20,
  backgroundColor: 'hsl(97, 93%, 92%)',
  paddingTop: 120,
},
picker: {
  width: '40%',
  height: 50,
  borderWidth: 3,
  borderColor: 'black',
  borderRadius: 8,
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
textinput: {
  width: 250,
  height: 45,
  borderColor: 'gray',
  borderWidth: 2 ,
  backgroundColor: 'white',
  marginBottom: 10,
},
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '80%',
  paddingHorizontal: 20,
  marginBottom: 20
},

closeButton: {
 position: 'absolute',
 top: 20,
 right: 20,
},
modalButton: {
  flex: 1,
  marginHorizontal: 5,
  marginTop: 10,
  backgroundColor: '#FFFFFF',
  borderRadius: 5,
},
textInputContainer: {
  marginTop: 20,
  paddingHorizontal: 20,
},
textInput: {
  borderWidth: 1,
  borderColor: '#CCCCCC',
  borderRadius: 5,
  height: 40,
  paddingHorizontal: 10,
  width: '100%',
  backgroundColor: 'white',
},
});
export default KompetenzWahlScreen;
