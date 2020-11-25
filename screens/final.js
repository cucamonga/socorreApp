import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function Final({navigation}){
    return(
        <View style={styles.container}>
            <Text>Chamado realizado</Text>
            <Button title="Ok" onPress={()=>{navigation.navigate('Socorre')}}/>           
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
  