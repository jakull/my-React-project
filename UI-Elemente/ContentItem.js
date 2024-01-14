import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, CheckBox, FlatList, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


export const BildComponent = ({ item, updateItemSource, updateItemLink, updateItemWidth, selectedType }) => {

  const [imageData,setImageData] = useState(item[selectedType]);
  const [itemSource, setItemSource] = useState("Standardsource");
  const [itemWidth, setItemWidth] = useState(imageData.width);
  const [itemLink, setItemLink] = useState(imageData.source.file);

console.log("selectedTypeBildComponent:"+ JSON.stringify(selectedType));
console.log("item[selectedType]  BildComponent:"+ JSON.stringify(item[selectedType]));
console.log("item  BildComponent:"+ JSON.stringify(item));

    useEffect(() => {
      if (item[selectedType] && item[selectedType].width && item[selectedType].source.file) {
        setItemWidth(item[selectedType].width);
        setItemLink(item[selectedType].source.file);
      }
    }, [item]);




 const handleSourceChange = (newSource) => {
   setItemSource(newSource);
   updateItemSource(newSource); // Die aktualisierte Bildquelle wird an die Elternkomponente weitergegeben
 };

 const handleLinkChange = (newText) => {
   setItemLink(newText);
   updateItemLink(newText); // Hier wird die aktualisierte Textänderung an die Elternkomponente weitergegeben
 };

 const handleWidthChange = (newWidth) => {
   setItemWidth(newWidth);
   updateItemWidth(newWidth); // Die aktualisierte Bildquelle wird an die Elternkomponente weitergegeben
 };

 return (
  <View style={styles.containerBild}>
    <Picker
      selectedValue={itemSource}
      onValueChange={(itemValue) => handleSourceChange (itemValue)}// Funktion erstellen
      style={styles.picker}
    >
      <Picker.Item label="File" value="File" />
      <Picker.Item label="Link" value="Link" />
    </Picker>
    <TextInput
      style={styles.urlInput}
      placeholder={itemLink}
      value={itemLink}
      onChangeText={handleLinkChange}//Funktion erstellen
    />
    <Picker
      selectedValue={itemWidth}
      onValueChange={(itemValue) => handleWidthChange(itemValue)} //Funktion erstellen
      style={styles.picker}
    >
      <Picker.Item label="100%" value="100%" />
      <Picker.Item label="50%" value="50%" />
    </Picker>
  </View>
  );
};


export const TextComponent = ({ item, updateText, selectedType }) => {
  const [itemText, setItemText] = useState(item.Text);
  //console.log("selectedType in TextKomponent:"+ item[selectedType]);


  useEffect(() => {
    setItemText(item.Text);
  }, [item, selectedType]);


  const handleTextChange = (newText) => {
    setItemText(newText);
    updateText(newText); // Hier wird die aktualisierte Textänderung an die Elternkomponente weitergegeben
  };

  return (
    <View style={styles.containerText}>
      <TextInput
        style={styles.textInput}
        placeholder={itemText}
        value={itemText}
        onChangeText={handleTextChange}
      />
    </View>
  );
};


const AudioComponent = ({ item, updateItemSource, updateItemLink, updateItemCodec, selectedType }) => {
  const [audioData, setAudioData] = useState(item[selectedType]);
  const [itemCodec, setItemCodec] = useState(audioData.codec);
  const [itemSource, setItemSource] = useState("Standardsource");
  const [itemLink, setItemLink] = useState(audioData.source.file);

  useEffect(() => {
    if (item[selectedType] && item[selectedType].codec && item[selectedType].source.file) {
      setItemCodec(item[selectedType].codec);
      setItemLink(item[selectedType].source.file);
    }
  }, [item]);

  const handleSourceChange = (newSource) => {
    setItemSource(newSource);
    updateItemSource(newSource); // Die aktualisierte Bildquelle wird an die Elternkomponente weitergegeben
  };

  const handleLinkChange = (newText) => {
    setItemLink(newText);
    updateItemLink(newText); // Hier wird die aktualisierte Textänderung an die Elternkomponente weitergegeben
  };

  const handleCodecChange = (newCodec) => {
    setItemCodec(newCodec);
    updateItemCodec(newCodec); // Hier wird die aktualisierte Textänderung an die Elternkomponente weitergegeben
  };

  return (
    <View style={styles.containerAudio}>
    <Picker
      selectedValue={itemSource}
      onValueChange={(itemValue) => handleSourceChange(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="File" value="File" />
      <Picker.Item label="Link" value="Link" />
    </Picker>
    <TextInput
      style={styles.urlInput}
      placeholder={itemLink}
      value={itemLink}
      onChangeText={handleLinkChange}
    />
      <Picker
        placeholder={itemCodec}
        value={itemCodec}
        style={styles.picker}
        onValueChange={handleCodecChange}
      >
        <Picker.Item label="mp3" value="mp3" />
        <Picker.Item label="AAC" value="AAC" />
        <Picker.Item label="WAV" value="WAV" />
        <Picker.Item label="PCM" value="PCM" />
      </Picker>
    </View>
  );
};

export const VideoComponent = ({ item, updateItemSource, updateItemWidth, updateItemLink, updateItemFormat,selectedType}) => {
  const [videoData, setVideoData] = useState(item[selectedType]);
  const [itemSource, setItemSource] = useState("Standardsource");
  const [itemWidth, setItemWidth] = useState(videoData.width);
  const [itemLink, setItemLink] = useState(videoData.source.file);
  const [itemFormat, setItemFormat] = useState(videoData.format);

  useEffect(() => {
    if (item[selectedType] && item[selectedType].width && item[selectedType].source.file && item[selectedType].format) {
      setItemWidth(item[selectedType].width);
      setItemLink(item[selectedType].source.file);
      setItemFormat(item[selectedType].format);
    }
  }, [item]);

  const handleSourceChange = (newSource) => {
    setItemSource(newSource);
    updateItemSource(newSource);
  };
  const handleFormatChange = (newFormat) => {
    setItemFormat(newFormat);
    updateItemFormat(newFormat);
  };

  const handleLinkChange = (newText) => {
    setItemLink(newText);
    updateItemLink(newText);
  };

  const handleWidthChange = (newWidth) => {
    setItemWidth(newWidth);
    updateItemWidth(newWidth);
  };

  return (
  <View style={styles.containerVideo}>
    <Picker
      selectedValue={itemSource}
      onValueChange={(itemValue) => handleSourceChange(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="File" value="File" />
      <Picker.Item label="Link" value="Link" />
    </Picker>
    <TextInput
      style={styles.urlInput}
      placeholder={itemLink}
      value={itemLink}
      onChangeText={handleLinkChange}
    />
    <Picker
      selectedValue={itemFormat}
      onValueChange={(itemValue) => handleFormatChange (itemValue)}// Funktion erstellen
      style={styles.picker}
    >
      <Picker.Item label="480p" value="480p" />
      <Picker.Item label="576p" value="576p" />
      <Picker.Item label="720p" value="720p" />
      <Picker.Item label="1080p" value="1080p" />
    </Picker>
    <Picker
      selectedValue={itemWidth}
      onValueChange={(itemValue) => handleWidthChange(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="100%" value="100%" />
      <Picker.Item label="50%" value="50%" />
    </Picker>
  </View>
);
};



export const ContentItem = ({ item, onSelectItem, isSelected, itemIndex, changeTypeOfItem, updateContentItem}) => {
const [selectedType, setSelectedType] = useState(Object.keys(item)[0]);
console.log("selectedType:" + selectedType);

useEffect(() => {
    setSelectedType(Object.keys(item)[0]);
}, [item,itemIndex]);

const handleSelectItem = () => {
  onSelectItem(item);
};

const handleTypeChange = (itemValue) => {
  setSelectedType(itemValue);
  changeTypeOfItem(itemIndex, itemValue);
};

const updateItemText = (newText) => {
  const updatedItem = { ...item, Text: newText };
  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};

const updateItemFormat = (newFormat) => {
  const updatedItem = {
  ...item,
  [selectedType]: {
    ...item[selectedType],
    format: newFormat // Neuer Wert für den Schlüssel "width" im Image-Objekt
  }
};
  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};

const updateItemCodec = (newCodec) => {
  const updatedItem = {
  ...item,
  [selectedType]: {
    ...item[selectedType],
    codec: newCodec // Neuer Wert für den Schlüssel "width" im Image-Objekt
  }
};
  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};


const updateItemSource = (newSource) => {
  const updatedItem = { ...item, file: newSource };
  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};

const updateItemWidth = (newWidth) => {
  const updatedItem = {
  ...item,
  [selectedType]: {
    ...item[selectedType],
    width: newWidth // Neuer Wert für den Schlüssel "width" im Image-Objekt
  }
};
  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};

const updateItemLink = (newLink) => {
  const updatedItem = {
  ...item,
  [selectedType]: {
    ...item[selectedType],
    source: {
      ...item[selectedType].source,
      file: newLink // Der neue Wert für den Schlüssel "file"
    }
  }
};

  updateContentItem(itemIndex, updatedItem); // Hier wird das aktualisierte Item mit dem geänderten Text an die Elternkomponente übergeben
};




  return (
    <View style={styles.customItem}>
      <CheckBox value={isSelected} onValueChange={handleSelectItem} />
      <Picker
        selectedValue={selectedType}
        onValueChange={handleTypeChange}
      >
        <Picker.Item label="Image" value="Image" />
        <Picker.Item label="Text" value="Text" />
        <Picker.Item label="Video" value="Video" />
        <Picker.Item label="Audio" value="Audio" />
      </Picker>
      {selectedType === 'Image' && (
        <BildComponent item={item} updateItemSource={updateItemSource} updateItemWidth={updateItemWidth} updateItemLink={updateItemLink} selectedType={selectedType}/>
      )}
      {selectedType === 'Text' && (
        <TextComponent item={item} updateText={updateItemText} selectedType={selectedType} />
      )}
      {selectedType === 'Video' && (
        <VideoComponent item={item} updateItemSource={updateItemSource} updateItemFormat={updateItemFormat} updateItemLink={updateItemLink} updateItemWidth={updateItemWidth} selectedType={selectedType}/>
      )}
      {selectedType === 'Audio' && (
        <AudioComponent item={item} updateItemSource={updateItemSource} updateItemCodec={updateItemCodec} updateItemLink={updateItemLink} selectedType={selectedType}/>
      )}
    </View>
  );
};



  const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  containerBild: {
    backgroundColor: '#e6e6fa',
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
    marginVertical: 1,
    marginLeft: 10,
    marginRight:20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
},
containerVideo: {
  backgroundColor: '#7fffd4',
  borderWidth: 3,
  borderColor: 'black',
  padding: 10,
  marginVertical: 1,
  marginLeft: 10,
  marginRight:20,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
containerAudio: {
  backgroundColor: '#98fb98',
  borderWidth: 3,
  borderColor: 'black',
  padding: 10,
  marginVertical: 1,
  marginLeft: 10,
  marginRight:20,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
  editBox: {
    backgroundColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
},
  editTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  containerText: {
    backgroundColor: 'hsl(103, 5%, 82%)',
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
    marginVertical: 1,
    marginLeft: 10,
    marginRight:20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentBox: {
    backgroundColor: 'yellow',
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
    flex: 1, // Breite des Pickers
  },
  customItem: {
    backgroundColor: 'lightgray',
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 20,
  },
  flatListContent: {
  width: '100%',
},
urlInput: {
  flex: 1, // Gleichmäßige Verteilung des verfügbaren Raums
},
});
