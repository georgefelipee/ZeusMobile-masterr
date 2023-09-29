import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image  } from 'react-native';
import ComprasCard from '../comprasCard';

export default function Compras({dados,gastos30Dias,navigation}) {
  return (
    
      <View style={styles.containerUltimasCompras} >
          <Text  style={styles.title}> 
              Últimas Compras 
          </Text>
          
          <ComprasCard navigation={navigation} gastos30Dias={gastos30Dias} dados={dados}/>
          
      </View>
    
  );
}

const styles = StyleSheet.create({
    containerUltimasCompras:{
        marginTop:40

    }, 
    title: {
      fontSize: 20,
      fontFamily:'Inter-Bold',
      color: '#404E4D',
      marginLeft:'6%',
    }
  })