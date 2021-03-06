import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'


export default function Cam({route, navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    //const [type, setType] = useState(null);
    const [picture, setPicture] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const cameraRef = useRef();
    const [enviando, setEnv] = useState(null);

    const [permission, askForPermission] = Permissions.usePermissions(Permissions.CAMERA, { ask: true });

    
   
   /* useEffect(() => {
        (async () => {
          setType(Camera.Constants.Type.back);  
          const { status } = await Camera.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);*/

      /*
      useEffect(()=>{async() =>{
        const {status } = await Permissions.P(Permissions.CAMERA);
        setHasPermission(status === 'granted');
      }

      });*/

      const enviarImg = async (img, navigation) =>{
        let formdata = new FormData();
        formdata.append('image', img);
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
           if(resp['status']!==200){
            navigation.navigate('Local',{image:{data:{url:img}}}); 
           }
           else{
           navigation.navigate('Local',{ image: resp}); 
           }

           setEnv(null);  
                
        }).catch(err => {
          console.log(err);
          
        });  
    }
      


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
           //console.log(resp);
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


           
            //setPicture(photo);
            //console.log(photo.width);
            if(!photo.base64){
              let str = photo;
              const res = str.replace('data:image/'+photo.type+';base64,','');
              enviarImg(res, navigation);
              setEnv('Aguarde carregando foto');
            }
            else{
            enviarImg(photo.base64, navigation);
            setEnv('Aguarde carregando foto');
            }
        }
        else {
            console.log('Camera Not Open');
        }
      }

      const nextScreen = async (navigation) => {
        navigation.navigate('Local',{ image: imgUrl});

      }

      /*

      if (hasPermission === null) {
        return (<View><Text>No camera</Text></View>);
      }
      if (hasPermission === false) {
        return( <View><Text>No access to camera</Text></View>);
      }*/

      if (!permission || permission.status !== 'granted') {
        return (
          <View>
            <Text>Permission is not granted</Text>
            <Button title="Habilitar Camera" onPress={askForPermission} />
            <Button title="Pular" onPress={() => navigation.navigate('Local',{image:{data:{url:'nada'}}})} />
          </View>
        );
      }

      if(enviando){
        return( 
        <View style={ styles.container}>  
        <Text>Enviando Imagem</Text>
        </View>
        );
      }

  return (
    <View style={{ flex: 1 }}>  
    
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View style={styles.button}>          
            <Button onPress={() =>{
               takePicture(navigation);

            }} title="SNAP"/>
            <TouchableOpacity ></TouchableOpacity>        
        </View>  
         
      </Camera> 

      <Button title="Pular"
      onPress={() => navigation.navigate('Local',{image:{data:{url:'nada'}}})} />   
      
      
     
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
