import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Camera } from 'expo-camera';


export default function Cam({route, navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [picture, setPicture] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const cameraRef = useRef();
    const [enviando, setEnv] = useState(null);
    const [nome, setNome] = useState('Anonimo');
    const [tel, setTel] = useState(null);
    const [desc, setDesc] = useState(null);
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);


      const sendPic = async (img, navigation) =>{
        let formdata = new FormData();
        formdata.append('image', img);
        fetch('https://api.imgbb.com/1/upload?expiration=600&key=d93562ff0554a15e69f08a5424d506db',{
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata
        }).then(response => { return response.json();})
        .then(resp => { 
           console.log(resp);
           //setImgUrl(resp).then(() => {navigation.navigate('Local',{ image: imgUrl})});
           navigation.navigate('Local',{ image: resp}); 
           setEnv(null);  
                
        }).catch(err => {
          console.log(err);
          
        });  
    }


      const takePicture = async (navigation) => {
        if (cameraRef.current) {
            console.log('Pic Taken');
            const options = { quality: 0, base64: true, skipProcessing: true };
            let photo = await cameraRef.current.takePictureAsync(options);
            setPicture(photo);
            //console.log(photo['base64']);
            sendPic(photo['base64'], navigation);
            setEnv('Aguarde carregando foto');
        }
        else {
            console.log('Camera Not Open');
        }
      }

      const nextScreen = async (navigation) => {
        navigation.navigate('Local',{ image: imgUrl});

      }

      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

      if(enviando){
        return( 
        <View style={{ flex: 1 }}>  
        <Text>Enviando Imagem</Text>
        </View>
        );
      }

  return (
    <View style={styles.container}>  
    
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View style={styles.button}>          
            <Button onPress={() =>{
               takePicture(navigation);

            }} title="SNAP"/>
            <TouchableOpacity ></TouchableOpacity>        
        </View>   
      </Camera>    
      
      
      <Button title="Pular"
      onPress={() => navigation.navigate('Local',{ image: imgUrl})} />
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
