import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, CheckBox, FlatList, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, set, push } from "firebase/database";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BildComponent, TextComponent,ContentItem } from './UI-Elemente/ContentItem';

const firebaseConfig = {
   apiKey: "AIzaSyDuz4Lrq8XO0zY8KvSsTRIh7EVBusRJpWA",

  authDomain: "zweites-projekt-7d9a4.firebaseapp.com",

  databaseURL: "https://zweites-projekt-7d9a4-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "zweites-projekt-7d9a4",

  storageBucket: "zweites-projekt-7d9a4.appspot.com",

  messagingSenderId: "472356646467",

  appId: "1:472356646467:web:dc968f12d6347762b2aef6",

  measurementId: "G-XTHVDF9F77"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const EditScreen = ({ route }) => {
  const { item, title, index: routeIndex, selectedKey, indicesSelected, setIndicesSelected  } = route.params;
  const [contentItems, setContentItems] = useState(item.content);
  const [selectedItems, setSelectedItems] = useState([]);
  const [myItem, setMyItem] = useState(item);



 const updateValidity = async () => {
   setMyItem(prevItem => ({ ...prevItem, validity: !prevItem.validity }));
   const updatedItem = { ...myItem, validity: !myItem.validity };

   try {
      let updatePath = `/JSON-Tree/competences/${selectedKey}/answers/${routeIndex}/`;
      const itemRef = ref(db, updatePath);
      await update(itemRef, { validity: updatedItem.validity });


      console.log('Firebase: Validity erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Validity:', error);
    }
     };






 useEffect(() => {
  setIndicesSelected([]);
}, []);


const updateFirebaseOnMoveEdit = async (db, dataCopy, selectedKey, title) => {
  let updateData = dataCopy;
  let updatePath = '';
  if (title === 'Answers') {
    updatePath = `/JSON-Tree/competences/${selectedKey}/answers/${routeIndex}/content`;
  }else if (title === 'Chatbubble') {
    updatePath = `/JSON-Tree/competences/${selectedKey}/INFO/${routeIndex}/ChatBubble/content`;
  }else if (title === 'MT') {
    updatePath = `/JSON-Tree/competences/${selectedKey}/MT/${routeIndex}`;
    updateData = dataCopy[0];
  }else if (title === 'Content') {
    updatePath = `/JSON-Tree/competences/${selectedKey}/content/${routeIndex}`;
    updateData = dataCopy[0];
  }
  else if (title === 'Explanations') {
    updatePath = `/JSON-Tree/competences/${selectedKey}/explanation/${routeIndex}/Expandable/content`;
  }
  try {
    const answersRef = ref(db, updatePath);
    await set(answersRef, updateData);

    console.log('Daten erfolgreich aktualisiert in Firebase!');
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Daten in Firebase:', error);
  }
};




const updateContentItem = (index, updatedItem) => {
   const updatedContentItems = [...contentItems];
   updatedContentItems[index] = updatedItem;
   setContentItems(updatedContentItems);
   updateFirebaseOnMoveEdit(db, updatedContentItems, selectedKey, title);

   const selectedItemIndex = selectedItems.findIndex((selectedItem) => selectedItem === contentItems[index]);
   if (selectedItemIndex !== -1) {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[selectedItemIndex] = updatedItem;
      return updatedSelectedItems;
    });
  }
 };





  const handleSelectItem = (itemIndex) => {

    const isSelected = selectedItems.includes(contentItems[itemIndex]);

    if (isSelected) {
      const updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem !== contentItems[itemIndex]);
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems([...selectedItems, contentItems[itemIndex]]);
    }
  };


  const changeTypeOfItem = (index, newType) => {
    const updatedContentItems = contentItems.map((contentItem,idx) => {
      if (idx === index) {
        let newItem;

        if (newType === 'Image') {
          newItem = {
            Image: {
              source: {
                file: 'Standardsource',
              },
              width: 'Standardwidth',
            },
          };
        } else if (newType === 'Text') {
          newItem = {
            Text: "StandardText",
          };
        }
        else if (newType === 'Video') {
        newItem = {
          Video: {
            source: {
              file: 'Standardsource',
            },
            width: 'Standardwidth',
            format: 'Standardformat',
          },
        };
      }else if (newType === 'Audio') {
        newItem = {
          Audio: {
            source: {
              file: 'Standardsource',
            },
            codec: 'Standardcodec',
          },
        };
      }

      if (selectedItems.includes(contentItem) && newItem) {
        const selectedItemIndex = selectedItems.findIndex((selectedItem) => selectedItem === contentItem);
        if (selectedItemIndex !== -1) {
          setSelectedItems((prevSelectedItems) => {
            const updatedSelectedItems = [...prevSelectedItems];
            updatedSelectedItems[selectedItemIndex] = newItem;
            return updatedSelectedItems;
          });
        }
      }

        return newItem;
      }
      return contentItem;
    });

    setContentItems(updatedContentItems);
    updateFirebaseOnMoveEdit(db, updatedContentItems, selectedKey, title);
  };




  const handleDeleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const updatedContentItems = contentItems.filter((item) => !selectedItems.includes(item));

    setSelectedItems([]);
    setContentItems(updatedContentItems);
    updateFirebaseOnMoveEdit(db, updatedContentItems, selectedKey, title);
  };




  const handleAddTextItem = () => {
    const newItemId = generateUniqueId();
    const newTextItem = {
      Text: 'Neues Element',
    };
    const updatedItems = [...contentItems, newTextItem];
    setContentItems(updatedItems);
    updateFirebaseOnMoveEdit(db, updatedItems, selectedKey, title);
  };

  function generateUniqueId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }


  const handleMoveItemUp = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const updatedContentItems = [...contentItems];

    for (let i = 1; i < contentItems.length; i++) {
      if (selectedItems.includes(updatedContentItems[i]) && !selectedItems.includes(updatedContentItems[i - 1])) {
        const tempItem = updatedContentItems[i];
        updatedContentItems[i] = updatedContentItems[i - 1];
        updatedContentItems[i - 1] = tempItem;
      }
    }

    setContentItems(updatedContentItems);
    updateFirebaseOnMoveEdit(db, updatedContentItems, selectedKey, title);
  };


  const handleMoveItemDown = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const updatedContentItems = [...contentItems];

    for (let i = contentItems.length - 2; i >= 0; i--) {
      if (selectedItems.includes(updatedContentItems[i]) && !selectedItems.includes(updatedContentItems[i + 1])) {
        const tempItem = updatedContentItems[i];
        updatedContentItems[i] = updatedContentItems[i + 1];
        updatedContentItems[i + 1] = tempItem;
      }
    }

    setContentItems(updatedContentItems);
    updateFirebaseOnMoveEdit(db, updatedContentItems, selectedKey, title);
  };

  const isValid = myItem && myItem.validity !== undefined ? myItem.validity : null;

  const backgroundColor = isValid !== null ? (isValid ? 'lightgreen' : 'tomato') : 'hsl(97, 93%, 92%)';


  return (
    <View style={[styles.container, { backgroundColor}]}>
      <View style={styles.editBox}>
        <Text style={styles.editTitle}> {title}: {routeIndex}</Text>
        {title === "Answers" && (

          <TouchableOpacity onPress={updateValidity}>
             <View style={styles.iconCircle}>
                 <Icon name="check-circle" size={20} color="green" />
             </View>
          </TouchableOpacity>
        )}
        <View style={styles.contentBox}>
        {(title === 'Answers' || title === 'Explanations' || title === 'Chatbubble')&& (
          <View>
          <Text style={styles.contentTitle}>Elemente von {title} anpassen</Text>
          <View style={styles.iconRow}>
            <Icon name="arrow-up" size={30} color="black" onPress={handleMoveItemUp}/>
            <Icon name="arrow-down" size={30} color="black" onPress={handleMoveItemDown} />
            <Icon name="trash" size={30} color="red" onPress={handleDeleteSelectedItems} />
            <Icon name="plus" size={30} color="green" onPress={handleAddTextItem}/>
          </View>
          </View>
        )}
         {(title === 'Content' || title === 'MT') && (
          <View style={{ height: 55 , alignItems: 'center',  justifyContent: 'center'}} >
          <Text style={styles.contentTitle}>Element von {title} anpassen</Text>
          </View>
            )}
        </View>
        {contentItems.map((content, contentIndex) => (
          <ContentItem
            key={contentIndex}
            item={content}
            isSelected={selectedItems.includes(content)}
            onSelectItem={() => handleSelectItem(contentIndex)}
            itemIndex={contentIndex}
            changeTypeOfItem={changeTypeOfItem}
            updateContentItem={updateContentItem}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
  },

  editBox: {
    backgroundColor: 'hsl(160,3%,64%)',
    borderRadius: 10,
    borderWidth:3,
    alignItems: 'center',
    paddingVertical: 20,
    marginRight:20,
    marginLeft: 20,
},
  editTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
  contentBox: {
    backgroundColor: 'hsl(62,34%,57%)',
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'lightgray',
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 100,
  },
  customItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    width: '100%',
  },
  textItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
  },
  flatListContent: {
  width: '100%',
}
});

export default EditScreen;
