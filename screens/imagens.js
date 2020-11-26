import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants'


export default function Imagens({route, navigation}) {
    const [image, setImage] = useState(null);
    const [base64Img ,setBase64Img] = useState(null);
    const [enviando, setEnv] = useState(null);

    useEffect(() => {
        (async () => {
          if (Constants.platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
       //   aspect: [4, 3],
          quality: 0,
          base64: true,
          
        });
        setImage(result.uri);
        console.log('tipo',result);
        let str = result.uri;
        let res = result.uri;
        if (str.includes("data:image/jpeg")){
             res = str.replace('data:image/jpeg;base64,','');
        }
        else if (str.includes("data:image/jpg")){
             res = str.replace('data:image/jpg;base64,','');
        }
        else if (str.includes("data:image/png")){
             res = str.replace('data:image/png;base64,','');
        }
        //let res = str.replace('data:image/jpeg;base64,','');
        //res = str.replace('data:image/jpeg;base64,','');
        //res = str.replace('data:image/jpg;base64,','');
        setBase64Img(res);
        console.log("separado",res);
        
    
        if (!result.cancelled) {
            
          setImage(result.uri);
          
        }
      };

      const enviarImg = async (img, navigation) =>{
        let formdata = new FormData();
        formdata.append('image', base64Img);
        fetch('https://api.imgbb.com/1/upload?expiration=600&key=d93562ff0554a15e69f08a5424d506db',{
        method: 'post',
        
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata
        }).then(response => response.json())
        .then(resp => { 
           //console.log(resp);
           //setImgUrl(resp).then(() => {navigation.navigate('Local',{ image: imgUrl})});
           //if(resp['status']!==200){
           // navigation.navigate('Local',{image:{data:{url:'error'}}}); 
          // }
           //else{
           navigation.navigate('Local',{ image: resp}); 
          // }

           setEnv(null);  
                
        }).catch(err => {
          console.log(err);
          
        });  
    }

    const sendPic = async (img, navigation) =>{
        console.log(base64Img);
        setEnv('enviando');
        let formdata = new FormData();
        formdata.append('image', base64Img);
        fetch('https://api.imgbb.com/1/upload?expiration=600&key=d93562ff0554a15e69f08a5424d506db',{
        method: 'post',
        /*headers: {
          'Content-Type': 'multipart/form-data',
        },*/
        body: formdata
        }).then(response => { return response.json();})
        .then(resp => { 
           //console.log(resp);
           //setImgUrl(resp).then(() => {navigation.navigate('Local',{ image: imgUrl})});
           navigation.navigate('Local',{ image: resp}); 
           setEnv(null);  
                
        }).catch(err => {
          console.log(err);
          
        });  
    }

    

      if(base64Img){
        if(enviando){
          return( 
          <View style={ styles.container}>  
          <Text>Enviando Imagem</Text>
          </View>
          );
        }
        return( 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom:15}} />}
          <View style={{marginBottom:15}}>
            <Button title="Selecionar uma imagem" onPress={pickImage}/>
          </View>
            <Button title="Enviar" onPress={()=> {sendPic(base64Img, navigation)}} />
          
        </View>
         );

      }
     else
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'  }}>
          
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom:15 }} />}
          <View style={{marginBottom:15}}>
          <Button title="Selecionar uma imagem" onPress={pickImage} />   
          </View>
          <Button title="Pular" onPress={() => navigation.navigate('Local',{image:{data:{url:'nada'}}})}  />
         
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      button: {
        flex:1,
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
       backgroundColor: "#DDDDDD",
        bottom: 50,
      /*  borderRadius: 50,
        height:70,
        width: 70,*/
      
      },
      button_red: {
    
        position: 'absolute',
    
        alignSelf: 'center',
    
    
        borderRadius: 50,
        height:50,
        width: 50,
        backgroundColor: "#595959",
        bottom: 10,
      
      },
    
      textInput:{
        borderColor: '#000000'
      },
    });
    