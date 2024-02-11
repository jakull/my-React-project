import React, { useState, useEffect, Fragment } from 'react';
import { View, Text, TouchableOpacity, CheckBox, FlatList, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, remove, child, set } from "firebase/database";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BildComponent, TextComponent, ContentItem } from './ContentItem';
import { FontAwesome } from '@expo/vector-icons';




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
const db = getDatabase(app);


const ExpandableSection = ({ title, data, selectedKey, expanded, fragenZahl }) => {
  const navigation = useNavigation();
  const [localExpanded, setLocalExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [specificData, setSpecificData] = useState(data);
  const [antwortAnzahl, setAntwortAnzahl] = useState(fragenZahl);
  const [indicesSelected, setIndicesSelected] = useState([]);



  useEffect(() => {
   setSpecificData(data);
   const updatedSelectedItems = indicesSelected.map((index) => data[index]);
   setSelectedItems(updatedSelectedItems);
 }, [data]);



const updateFirebaseOnMove = (db, dataCopy, selectedKey, title) => {

  const indicesSelected = dataCopy
    .map((item, index) => (selectedItems.includes(item) ? index : -1)) // Prüfe, ob das Element in selectedItems enthalten ist
    .filter((index) => index !== -1); // Filtere die Indizes, die nicht in selectedItems sind

  setIndicesSelected(indicesSelected);

     let updatePath = '';
     const updates = {};
     if (title === 'Answers') {
         updatePath = `/JSON-Tree/competences/${selectedKey}/answers/`;
         dataCopy.forEach((item, index) => {
           const updateProperties = {
             content: item.content ,
             id: item.id,
             validity: item.validity || false,
           };

           updates[`${index}`] = updateProperties;
         });
    } else if (title === 'Chatbubble') {
      updatePath = `/JSON-Tree/competences/${selectedKey}/INFO/`;
      dataCopy.forEach((item, index) => {
        const updateProperties = {
          ChatBubble: {
            content: item.content,
            img: item.img,
            orientation: item.orientation,
          }
        };

        updates[`${index}`] = updateProperties;
      });
    }else if (title === 'MT') {
       updatePath = `/JSON-Tree/competences/${selectedKey}/MT/`;
       dataCopy.forEach((item, index) => {
         const updateProperties = item.content[0];


         updates[`${index}`] = updateProperties;
       });
      }else if (title === 'Content') {
           updatePath = `/JSON-Tree/competences/${selectedKey}/content/`;
           dataCopy.forEach((item, index) => {
             const updateProperties = item.content[0];


             updates[`${index}`] = updateProperties;
           });
         }else if (title === 'Explanations') {
            updatePath = `/JSON-Tree/competences/${selectedKey}/explanation/`;
            dataCopy.forEach((item, index) => {
              let updateProperties = {};


              if (item.type === 'Separator') {
                updateProperties = {
                  Separator : item.separatorvalue,
                };
              } else if (item.type === 'Expandable') {
                updateProperties = {
                  Expandable: {
                    icon : item.icon,
                    personalized : item.personalized,
                    subtitle : item.subtitle,
                    title : item.explTitle,
                    content : item.content,
                  }
                };
              }

              updates[`${index}`] = updateProperties;
            });
          }


     const updatesRef = ref(db, updatePath);
     return update(updatesRef, updates)
       .then(() => {
         console.log('Daten erfolgreich aktualisiert!');
       })
       .catch((error) => {
         console.error('Fehler beim Aktualisieren der Daten:', error);
       });
   };




  const updateFirebaseWithCompleteData = (db, completeData, selectedKey, title) => {

    const indicesSelected = completeData
      .map((item, index) => (selectedItems.includes(item) ? index : -1))
      .filter((index) => index !== -1);

    setIndicesSelected(indicesSelected);

    let updatePath = '';
    const updates = {};
    if (title === 'Answers') {
        updatePath = `/JSON-Tree/competences/${selectedKey}/answers/`;
        completeData.forEach((item, index) => {
          const updateProperties = {
            content: item.content,
            id: item.id,
            validity: item.validity || false,
          };

          updates[`${index}`] = updateProperties;
        });
   } else if (title === 'Chatbubble') {
     updatePath = `/JSON-Tree/competences/${selectedKey}/INFO/`;
     completeData.forEach((item, index) => {
       const updateProperties = {
         ChatBubble: {
           content: item.content,
           img: item.img,
           orientation: item.orientation,
         }
       };

       updates[`${index}`] = updateProperties;
     });
    }else if (title === 'MT') {
       updatePath = `/JSON-Tree/competences/${selectedKey}/MT/`;
       completeData.forEach((item, index) => {
         const updateProperties = item.content[0];


         updates[`${index}`] = updateProperties;
       });
      }else if (title === 'Content') {
          updatePath = `/JSON-Tree/competences/${selectedKey}/content/`;
          completeData.forEach((item, index) => {
            const updateProperties = item.content[0];


            updates[`${index}`] = updateProperties;
          });
        }else if (title === 'Explanations') {
            updatePath = `/JSON-Tree/competences/${selectedKey}/explanation/`;
            completeData.forEach((item, index) => {
              let updateProperties = {};


              if (item.type === 'Separator') {
                updateProperties = {
                  Separator : item.separatorvalue,
                };
              } else if (item.type === 'Expandable') {
                updateProperties = {
                  Expandable: {
                    icon : item.icon,
                    personalized : item.personalized,
                    subtitle : item.subtitle,
                    title : item.explTitle,
                    content : item.content,
                  }
                };
              }

              updates[`${index}`] = updateProperties;
            });
          }
    const updatesRef = ref(db, updatePath);
    return set(updatesRef, updates)
      .then(() => {
        console.log('Daten erfolgreich aktualisiert!');
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren der Daten:', error);
      });
  };




  useEffect(() => {
   setLocalExpanded(false);
 }, [expanded]);



 const handleSelectItem = (itemIndex) => {

   const isSelected = selectedItems.includes(specificData[itemIndex]);

   if (isSelected) {
     const updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== specificData[itemIndex]);
     setSelectedItems(updatedSelectedItems);
   } else {
     setSelectedItems([...selectedItems, specificData[itemIndex]]);
   }
 };



  const handleExpanded = () => {
  setLocalExpanded(!localExpanded);
};

const moveSelectedItemsUp = () => {
  const dataCopy = [...specificData];
  const selectedItemsIndices = [];

  selectedItems.forEach((selectedItem) => {
    const index = dataCopy.findIndex((item) => item === selectedItem);
    if (index !== -1) {
      selectedItemsIndices.push(index);
    }
  });

  if (selectedItemsIndices.length < 1) {
    return;
  }

  let moved = false;

  for (let i = 1; i < dataCopy.length; i++) {
    if (selectedItemsIndices.includes(i) && !selectedItemsIndices.includes(i - 1)) {
      const temp = dataCopy[i];
      dataCopy[i] = dataCopy[i - 1];
      dataCopy[i - 1] = temp;
      selectedItemsIndices[selectedItemsIndices.indexOf(i)]--;
      moved = true;
    }
  }

  if (moved) {
    setSpecificData(dataCopy);
    updateFirebaseOnMove(db, dataCopy, selectedKey, title);
  }
};


const moveSelectedItemsDown = () => {
  const dataCopy = [...specificData];
  const selectedItemsIndices = [];

  selectedItems.forEach((selectedItem) => {
    const index = dataCopy.findIndex((item) => item === selectedItem);
    if (index !== -1) {
      selectedItemsIndices.push(index);
    }
  });

  if (selectedItemsIndices.length < 1) {
    return;
  }

  let moved = false;

  for (let i = dataCopy.length - 2; i >= 0; i--) {
    if (selectedItemsIndices.includes(i) && !selectedItemsIndices.includes(i + 1)) {
      const temp = dataCopy[i];
      dataCopy[i] = dataCopy[i + 1];
      dataCopy[i + 1] = temp;
      selectedItemsIndices[selectedItemsIndices.indexOf(i)]++;
      moved = true;
    }
  }

  if (moved) {
    setSpecificData(dataCopy);
    updateFirebaseOnMove(db, dataCopy, selectedKey, title);
  }
};


const deleteItem = (itemId) => {
  const updatedData = specificData.filter((item) => item.id !== itemId);
  setSpecificData(updatedData);


  const updatedSelectedItems = selectedItems.filter(
    (selectedItem) => selectedItem.id !== itemId
  );
  setSelectedItems(updatedSelectedItems);

  updateFirebaseWithCompleteData(db, updatedData, selectedKey, title);
};

function generateUniqueId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

const addItemToFlatList = () => {
      let newItem = {
        id: generateUniqueId(),
        Text: 'Neues Element',
        content: [{ Text:'Neues Element'}],

      };
      if (title === 'Answers') {
        newItem.validity = null;
      }
      if (title === 'Chatbubble') {
        newItem.img = '/klimawandel_basics/media/Linda.jpg',
        newItem.orientation = 'left';
       }

      const updatedData = [newItem, ...specificData];
      setSpecificData(updatedData);
      updateFirebaseWithCompleteData(db, updatedData, selectedKey, title);
  };




const getItemBackgroundColor = (item, title) => {
        if (title === "Answers") {
            if (selectedItems.includes(item)) {
              if (item.validity === null) {
                return 'gold';
              }
              return item.validity ? 'darkgreen' : 'darkred';
            } else {
              if (item.validity === null) {
                return 'yellow';
              }
              return item.validity ? 'lightgreen' : 'tomato';
            }
        }else if (title === "Explanations") {
              if (selectedItems.includes(item)) {
                switch (item.type) {
                  case "Separator":
                    return 'hsl(103, 2%, 23%)';
                  case "Expandable":
                    return 'hsl(0, 0%, 90%)';
                  default:
                    return 'white';
                }
              } else {
                switch (item.type) {
                  case "Separator":
                    return 'hsl(103, 2%, 33%)';
                  case "Expandable":
                    return 'white';
                  default:
                    return 'white';
                }
              }
        }else if (title === "Content"|| title === "Chatbubble"|| title === "MT") {
              if (selectedItems.includes(item)) {
                switch (item.type) {
                  case "Text":
                    return 'hsl(0, 0%, 62%)';
                  case "Image":
                    return '#d8d8ff';
                  case "Video":
                    return '#76eec6';
                  case "Audio":
                    return '#8fd68d';
                  default:
                    return 'yellow';
                }
              } else {
                switch (item.type) {
                  case "Text":
                    return 'hsl(103, 5%, 82%)';
                  case "Image":
                    return '#e6e6fa';
                  case "Video":
                    return '#7fffd4';
                  case "Audio":
                    return '#98fb98' ;
                  default:
                    return 'yellow';
                }
              }
        }
    };

const handleAntwortChange = async (newAntwortAnzahl) => {
      setAntwortAnzahl(newAntwortAnzahl);

      try {
         let updatePath = `/JSON-Tree/competences/${selectedKey}`;
         const newRef = ref(db, updatePath);
         await update(newRef, { numbAns: newAntwortAnzahl });


         console.log('Firebase: numbAns erfolgreich aktualisiert!');
       } catch (error) {
         console.error('Fehler beim Aktualisieren der Validity:', error);
       }
        };

  return (
    <View >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleExpanded}>
              <FontAwesome
                name={localExpanded ? 'caret-down' : 'caret-right'}
                size={24}
                color="black"
                />
          </TouchableOpacity>
         <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            {title}
         </Text>
    	   <TouchableOpacity onPress={moveSelectedItemsUp}>
            <View style={sectionStyles.iconCircle}>
                <Icon name="arrow-up" size={20} color="black" />
            </View>
    	   </TouchableOpacity>
    	   <TouchableOpacity onPress={moveSelectedItemsDown}>
            <View style={sectionStyles.iconCircle}>
    		        <Icon name="arrow-down" size={20} color="black" />
            </View>
    	   </TouchableOpacity>
         <TouchableOpacity onPress={addItemToFlatList}>
            <View style={sectionStyles.iconCircle}>
                <Icon name="plus" size={20} color="green" />
            </View>
         </TouchableOpacity>
      </View>

     {localExpanded && (
       <View>
        <FlatList
          style={{ paddingTop: 10 }}
          data={specificData}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <View       style={[
                sectionStyles.listItem,
                {
                         backgroundColor:
                           getItemBackgroundColor(item, title)
                       },
              ]}>
              <CheckBox
                value={selectedItems.includes(item)}
                onValueChange={() => handleSelectItem(index)}
              />
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10 }}>{item.Text}</Text>
              {
                item.type !== 'Separator' && (
			        <TouchableOpacity onPress={() => navigation.navigate('Edit', {
                  item,
                  title,
                  index,
                  selectedKey,
                  indicesSelected,
                  setIndicesSelected
                })}>
                <View style={sectionStyles.iconCircle}>
				           <Icon name="edit" size={20} color="blue" />
                </View>
			        </TouchableOpacity>
             )
            }
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                 <View style={sectionStyles.iconCircle}>
                    <Icon name="trash" size={20} color="red" />
                 </View>
              </TouchableOpacity>

           </View>

          )}
        />

        {title === "Answers" && (
            <View style={sectionStyles.additionalInput}>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10,  textAlign: 'center'}}>
                Anzahl der angezeigten Antworten:
              </Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginLeft: 25, backgroundColor: 'white',  width: 60}}
                placeholder = {antwortAnzahl}
                value ={antwortAnzahl}
                onChangeText={handleAntwortChange}
                />

            </View>
          )}
  </View>
      )}
  </View>
);

};

const sectionStyles = StyleSheet.create({
  sectionContainer: {
	backgroundColor: 'gainsboro',
    borderColor: 'blue',
    borderWidth: 2,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  additionalInput: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
  paddingLeft: 30,
  backgroundColor: 'hsl(311,4%,53%)',
  marginBottom: 5,
  justifyContent: 'center',
  minHeight: 60,
  borderRadius: 9,
  borderWidth:4,
},

    listItem: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    margin: 1,
    borderRadius: 5,
	  flexDirection: 'row',
	  alignItems: 'center',

  },

  iconCircle: {
     width: 30,
     height: 30,
     borderRadius: 18,
     borderWidth: 2,
     backgroundColor: 'hsl(29,68%,92%))',
     justifyContent: 'center',
     alignItems: 'center',
     marginHorizontal: 5,
     marginLeft: 10,
   },

    textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 200,
    marginLeft: 10,
  },

});


export default ExpandableSection;
