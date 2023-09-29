import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/inter';
import React from 'react';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Button, StyleSheet, Text, View } from 'react-native';
import { Home } from './src/screen/Home';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

//telas
import AppNavigationContainer from './AppNavigationContainer.jsx'
import {AddTela} from './src/screen/AddTela/index.jsx';
import HistoryTela from './src/screen/HistoryTela';

export default function App() {


  let [fontsLoaded] = useFonts({
    'Inter-ExtraBold': require('./src/assets/fontInter/static/Inter-ExtraBold.ttf'),
    'Inter-Medium': require('./src/assets/fontInter/static/Inter-Medium.ttf'),
    'Inter-Bold': require('./src/assets/fontInter/static/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./src/assets/fontInter/static/Inter-SemiBold.ttf'),
    'Inter-Regular': require('./src/assets/fontInter/static/Inter-Regular.ttf'),
    // Outras fontes podem ser adicionadas aqui, se necessário
  });

  if(!fontsLoaded){
    return null
  }

  const Stack = createStackNavigator();

  return (
    
    <NavigationContainer  style={{backgroundColor: '#fff' }}  >
      
      <Stack.Navigator style={{backgroundColor:'#fff'}} initialRouteName='Home'>
          <Stack.Screen options={{ headerShown: false ,title: 'Minha Tela Inicial', // Define o título personalizado
          headerStyle: {
            backgroundColor: '#fff', // Define a cor de fundo do cabeçalho
          },}} name='Home' component={Home}/>

          <Stack.Screen options={{headerShown:false}} name='AddTela' component={AddTela}/>
          <Stack.Screen options={{headerShown:false}} name='HistoryTela' component={HistoryTela}/>

      </Stack.Navigator>
      <Toast/>
     </NavigationContainer>
    
  );
}

