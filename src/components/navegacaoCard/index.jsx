
import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavegacaoCard({navegarParaAddTela,navegarParaHistoryTela,navigation}) {


  return (
    
      <View style={styles.containerNavegacao} >
          <Text  style={styles.title}> 
              Navegação Rápida 
          </Text>

           <View style={styles.buttonContainer}> 
              <TouchableOpacity onPress={navegarParaHistoryTela}
              activeOpacity={0.6} style={Platform.OS === 'ios' ? styles.iosButton : styles.androidButton}>
                <Image source={require('../../assets/images/menu_board.png')} style={styles.image} />
                <Text style={styles.text}>Histórico</Text>
              </TouchableOpacity>

              <TouchableOpacity  
              onPress={navegarParaAddTela}  
              activeOpacity={0.6} style={  Platform.OS === 'ios' ? styles.iosButtonAdicionar : styles.androidButtonAdicionar}>        
                     <Image source={require('../../assets/images/money_send.png')} style={styles.image} />
                     <Text style={styles.text}>Adicionar</Text>
               </TouchableOpacity>

          </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  iosButton: {
    backgroundColor: '#CC7E39',
    padding: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    flexDirection: 'row', // Coloca a imagem ao lado do texto
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width:'45%'
  },
  iosButtonAdicionar: {
    backgroundColor: 'rgba(128, 151, 51, 0.8);',
    padding: 10,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    flexDirection: 'row', // Coloca a imagem ao lado do texto
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width:'45%'
  },
  androidButton: {
    backgroundColor: '#BC6C25',
    padding: 10,
    borderRadius: 5,
    elevation: 15,
    flexDirection: 'row', // Coloca a imagem ao lado do texto
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    backgroundColor: '#BC6C25',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width:'45%'
  },androidButtonAdicionar: {
    backgroundColor: 'rgba(128, 151, 51, 0.8);',
    padding: 10,
    borderRadius: 5,
    elevation: 15,
    flexDirection: 'row', // Coloca a imagem ao lado do texto
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width:'45%'
  },
   image: {
    marginRight: 5, // Espaço entre a imagem e o texto
  }, 
   text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft:'5%'
  },
   buttonContainer: {
    paddingHorizontal:20,
    display:'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop: 20,
  
  },title: {
    fontSize: 20,
    fontFamily:'Inter-Bold',
    color: '#404E4D',
    marginTop:40,
    marginLeft:'6%',
  }
})