import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function Address({route, navigation}) {
  const { image } = route.params;
 
  //const { image } = 'urlde teste';
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [local, setLocal] = useState(null);
  const [city, setCity] = useState('carregando');
  const [nome, setNome] = useState('Anonimo');
  const [tel, setTel] = useState(null);
  const [descricao, setDesc] = useState(null);

  useEffect(() =>{

    getPosition().then(loc =>

    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+loc.coords.latitude+'&lon='+loc.coords.longitude,{
        method: 'GET',
        headers: {
        'Accept': 'application/json'
        }
      })
          .then((response) => response.json())
          .then((json) => {           
             setLocal(json['address']);           
          })
          .catch((error) => {
            console.error(error);
          }));
}, []);

    const getPosition = async () =>{
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }
    let location = await Location.getCurrentPositionAsync({});
      setLocal(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      return location;
    }

  if(local == null){
    
    return(
    <View style={styles.container}>   
        <Text>Carregando...</Text>   
        <Button title="Próximo"/>
    </View>);
  }



  const abrirOcorrencia = async (navigation) =>{
    
    const requestOptions = {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome,
        latitude: latitude,
        longitude: longitude,
        rua: local['road'],
        bairro: local['city_district'],
        cidade: local['city'],
        estado: local['state'],
        descricao: descricao,
        telefone: tel,
        image: image['data']['url'],
    })
  };

  fetch('https://digoboratv.000webhostapp.com/socorre/api/insert.php', requestOptions)
      .then(async response => {
        alert("Ocorrencia aberta");
        navigation.navigate('Socorre');
          /*const data = await response.json();

      
          if (!response.ok) {
          
              const error = (data && data.message) || response.status;
              return Promise.reject(error);
          }

          alert("Ocorrencia aberta")*/
      })
      .catch(error => {
          this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
      });

   }

  return (
    <View style={styles.container}>
      <Text>Endereço</Text>
      
      <Text>{local['road']} </Text>    
      <Text>{local['city_district']} </Text>  
      <Text>{local['city']} </Text> 
      <Text>{local['state']} </Text>
      <Text>Nome:</Text>
      <TextInput onChangeText={text => setNome(text)}></TextInput>
      <Text>Tel:</Text>
      <TextInput onChangeText={text => setTel(text)}></TextInput>
      <Text>Descrição:</Text>
      <TextInput onChangeText={text => setDesc(text)}></TextInput>
      <Button title="Próximo" onPress={() =>{ abrirOcorrencia(navigation)}}/>
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
  textinput:{
     height: 40, 
        borderColor: 'gray', 
        borderWidth: 1 
  }
});
