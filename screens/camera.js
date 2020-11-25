import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';


export default function Cam({route, navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    //const [type, setType] = useState(null);
    const [picture, setPicture] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const cameraRef = useRef();
    const [enviando, setEnv] = useState(null);

    const [permission, askForPermission] = Permissions.usePermissions(Permissions.CAMERA, { ask: true });

    const testImg = "data:image/gif;base64,R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==";
   
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
           navigation.navigate('Local',{ image: resp}); 
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
            setPicture(photo);
            //console.log(photo['base64']);
            enviarImg(photo['base64'], navigation);
            setEnv('Aguarde carregando foto');
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
