import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, CheckBox, FlatList, StyleSheet, ScrollView, Picker, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update, onChildChanged } from "firebase/database";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import EditScreen from './EditScreen';
import ExpandableSection from './UI-Elemente/ExpandableSection';
import { Tooltip } from 'react-native-elements';






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




const KategorienWahlScreen = ({ route }) => {
  const { selectedKey } = route.params;
  const navigation = useNavigation();


  const [allSectionsCollapse, setAllSectionsCollapse] = useState(false)

  const [answers, setAnswers] = useState([]);

  const [content, setContent] = useState([]);

  const [explanations, setExplanations] = useState([]);

  const [chatbubble, setChatbubble] = useState([]);

  const [MT, setMT] = useState([]);


  const [fetchTrigger, setFetchTrigger] = useState(false);

  const [fragenZahl, setFragenZahl] = useState();





useEffect(() => {
    const db = getDatabase();
    const competenceRef = ref(db, `/JSON-Tree/competences/`);

    const onChildChangedCallback = (snapshot) => {
      setFetchTrigger((prevFetchTrigger) => !prevFetchTrigger);
    };

    onChildChanged(competenceRef, onChildChangedCallback);

  }, [selectedKey]);



  useEffect(() => {

    const fetchAnswersFromFirebase = async () => {
      try {
        const db = getDatabase();
        const competenceRef = ref(db, `/JSON-Tree/competences/${selectedKey}`);
        const snapshot = await get(competenceRef);
        const dataCompetence = snapshot.val();
        let snapshotMT = null;
        let snapshotAnswers = null;
        let snapshotContent = null;
        let snapshotQuestion = null;
        let snapshotExplanation = null;
        let snapshotChatbubble = null;

        if (dataCompetence.type==="MU_Text"){
          const mtRef = ref(db, `/JSON-Tree/competences/${selectedKey}/MT`);
          snapshotMT = await get(mtRef);
          const explanationRef=  ref(db, `/JSON-Tree/competences/${selectedKey}/explanation`);
          snapshotExplanation = await get(explanationRef);
        }
        else if (dataCompetence.type==="MC_Select"){
          const  answersRef = ref(db, `/JSON-Tree/competences/${selectedKey}/answers`);
          snapshotAnswers = await get(answersRef);
          const contentRef=  ref(db, `/JSON-Tree/competences/${selectedKey}/content`);
          snapshotContent = await get(contentRef);
          const explanationRef=  ref(db, `/JSON-Tree/competences/${selectedKey}/explanation`);
          snapshotExplanation = await get(explanationRef);
          const questionRef =  ref(db, `/JSON-Tree/competences/${selectedKey}`);
          snapshotQuestion = await get(questionRef);
        }
        else if  (!dataCompetence.type) {
          const chatbubbleRef=  ref(db, `/JSON-Tree/competences/${selectedKey}/INFO`);
          snapshotChatbubble = await get(chatbubbleRef);
       }



        if (snapshotMT && snapshotMT.exists()) {
          const data = snapshotMT.val();
          const MTData = Object.keys(data).map((key) => {
            const element = data[key];
            let content = [element];
            if (element) {

              const firstItem = element;
              let type = '';
              let Text = '';


              if (element.Text) {
                type = 'Text';
                Text = element.Text;
              } else if (element.Image) {
                type = 'Image';
                Text = 'Image';
              } else if (element.Video) {
                type = 'Video';
                Text = 'Video';
              } else if (element.Audio) {
                type = 'Audio';
                Text = 'Audio';
              }else if (element.expl) {
               type = 'expl';
               Text = 'expl';
             }else if (element.TextInput) {
                type = 'TextInput';
                Text = 'TextInput';
              }



            return {
              id: key,
              type,
              Text,
              content,
            };
            }
          });

          var jsonString = JSON.stringify(MTData);
          setMT(MTData);
        }




        if (snapshotExplanation && snapshotExplanation.exists()) {
          const data = snapshotExplanation.val();
          const ExplanationData = Object.keys(data).map((key) => {
            const element = data[key];
            let type = '';
            let Text = '';
            let icon = element.icon;
            let personalized = element.personalized;
            let subtitle = element.subtitle;
            let explTitle = element.title;


            let returnObject = {
               id: key,
               type: '',
               Text: ''
             };

             if (element.Separator) {
               returnObject.type = 'Separator';
               returnObject.Text = 'Separator';
               returnObject.separatorvalue = element.Separator;
             } else if (element.Expandable) {
               returnObject.type = 'Expandable';
               returnObject.Text = 'Expandable';
               returnObject.icon = element.Expandable.icon;
               returnObject.personalized = element.Expandable.personalized;
               returnObject.subtitle = element.Expandable.subtitle;
               returnObject.explTitle = element.Expandable.title;
               returnObject.content = element.Expandable.content;
             }

             return returnObject;
           });

          var jsonString = JSON.stringify(ExplanationData);
          setExplanations(ExplanationData);
        }



        if (snapshotAnswers && snapshotAnswers.exists()) {
            const data = snapshotAnswers.val();
            const question = snapshotQuestion.val();

            const answersData = Object.keys(data).map((key) => {
              const element = data[key];
              let validity = element.validity;
              let id = element.id;
              let content = element.content;
              let expl = element.expl;

              if (element.content && element.content.length > 0) {
                const firstItem = element.content[0];
                let type = '';
                let Text = '';


                if (firstItem.Text) {
                  type = 'Text';
                  Text = firstItem.Text;
                } else if (firstItem.Image) {
                  type = 'Image';
                  Text = 'Image';
                } else if (firstItem.Video) {
                  type = 'Video';
                  Text = 'Video';
                } else if (firstItem.Audio) {
                  type = 'Audio';
                  Text = 'Audio';
                }




                return {
                  id,
                  type,
                  Text,
                  validity,
                  content,
                  expl,
                  numbAns: question.numbAns,
                };
              }
          });


          setAnswers(answersData);
          setFragenZahl(question.numbAns);
          }



      if (snapshotContent && snapshotContent.exists()) {
        const data = snapshotContent.val();

        const contentData = Object.keys(data).map((key) => {
          const element = data[key];

            let type = '';
            let Text = '';
            let content = [element];


            if (element.Text) {
              type = 'Text';
              Text = element.Text;
            } else if (element.Image) {
              type = 'Image';
              Text = `Image`;
            }else if (element.Video) {
              type = 'Video';
              Text = 'Video';
            }
            else if (element.Audio) {
              type = 'Audio';
              Text = 'Audio';
            }
            else if (element.comp) {
              type = 'comp';
              Text = 'comp';
            }
            else if (element.expl) {
              type = 'expl';
              Text = 'expl';
            }

            return {
              id: key,
              type,
              Text,
              content,
            };

        });

        setContent(contentData);
        var jsonString2 = JSON.stringify(contentData);
      }




       if (snapshotChatbubble && snapshotChatbubble.exists()) {
               const data = snapshotChatbubble.val();
               const LindaData = Object.keys(data).map((key) => {
                 const element = data[key];
                 let type = '';
                 let Text = '';
                 let content = element.ChatBubble.content;
                 let img = element.ChatBubble.img;
                 let orientation = element.ChatBubble.orientation;

                 // Überprüfe, ob 'content' vorhanden und nicht leer ist
                 if (element.ChatBubble && element.ChatBubble.content && element.ChatBubble.content.length > 0) {

                   const firstItem = element.ChatBubble.content[0];

                   if (firstItem.Text) {
                     type = 'Text';
                     Text = firstItem.Text;
                   } else if (firstItem.Image) {
                     type = 'Image';
                     Text = `Image`;
                   }else if (firstItem.Video) {
                     type = 'Video';
                     Text = 'Video';
                   }
                   else if (firstItem.Audio) {
                     type = 'Audio';
                     Text = 'Audio';
                   }
                 }

                 return {
                   id: key,
                   type,
                   Text,
                   content,
                   img,
                   orientation,
                 };
               });

               var jsonString = JSON.stringify(LindaData);
               setChatbubble(LindaData);
             }

}


      catch (error) {
        console.error('Fehler beim Laden der Daten aus Firebase:', error);
      }
    };

    fetchAnswersFromFirebase();
  }, [fetchTrigger, selectedKey]);



return (
     <ScrollView style={sectionStyles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

     <View style={sectionStyles.collapseAllButton}>
     <Tooltip popover={<Text>Collapse All</Text>}>
       <TouchableOpacity onPress={() => setAllSectionsCollapse(!allSectionsCollapse)}>
           <Icon name="angle-double-up" size={50} color="black" />
       </TouchableOpacity>
    </Tooltip>
    </View>

      {answers.length > 0 && (
       <View style={sectionStyles.sectionContainer}>
         <ExpandableSection
           title="Answers"
           data={answers}
           selectedKey={selectedKey}
           expanded={allSectionsCollapse}
           fragenZahl={fragenZahl}
         />
       </View>
       )}
       {content.length > 0 && (
       <View style={sectionStyles.sectionContainer}>
         <ExpandableSection
           title="Content"
           data={content}
           expanded={allSectionsCollapse}
           selectedKey={selectedKey}
         />
       </View>
        )}


        {chatbubble.length > 0 && (
         <View style={sectionStyles.sectionContainer}>
           <ExpandableSection
             title="Chatbubble"
             data={chatbubble}
             expanded={allSectionsCollapse}
             selectedKey={selectedKey}
           />
         </View>
          )}

          {MT.length > 0 && (
           <View style={sectionStyles.sectionContainer}>
             <ExpandableSection
               title="MT"
               data={MT}
               expanded={allSectionsCollapse}
               selectedKey={selectedKey}
             />
           </View>
            )}

            {explanations.length > 0 && (
             <View style={sectionStyles.sectionContainer}>
               <ExpandableSection
                 title="Explanations"
                 data={explanations}
                 expanded={allSectionsCollapse}
                 selectedKey={selectedKey}
               />
             </View>
              )}


     </ScrollView>
   );
};

const sectionStyles = StyleSheet.create({
  collapseAllButton: {
    alignItems: 'flex-end',
    marginRight: 20,
  },

  container: {
    paddingHorizontal: 20,
    backgroundColor: 'hsl(97, 93%, 92%)',
  },
  sectionContainer: {
	backgroundColor: 'gainsboro',
    borderColor: 'blue',
    borderWidth: 2,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },


    listItem: {
    backgroundColor: 'yellow',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    margin: 1,
    borderRadius: 2,
	flexDirection: 'row',
	alignItems: 'center'
  },

    selectedListItem: {
    backgroundColor: 'darkorange',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },

    textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 200,
    marginLeft: 10,
  },

});


export default KategorienWahlScreen;
