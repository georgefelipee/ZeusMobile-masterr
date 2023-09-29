import { useState } from 'react';

import { StyleSheet, Text, View,TouchableOpacity, Image  } from 'react-native';
import { Carousel } from '../carousel';



export default function ComprasCard({dados,gastos30Dias,navigation}) {


    const data = [
    

        // Adicione mais itens conforme necessário
      ];


  return (
    
      <View style={styles.containerCompras} >
        
            <Carousel navigation={navigation} testeDatas={data} gastos30Dias={gastos30Dias} data={dados}/>
        
      </View>
    
  );
}

const styles = StyleSheet.create({
    
  })