import { View,FlatList, StyleSheet, Text, Dimensions, LogBox } from "react-native"
import React, { useState, useEffect, useRef } from "react"
import Animated, {Layout, FadeInLeft, FadeOutRight} from "react-native-reanimated"
import { format } from "date-fns"
import { utcToZonedTime } from 'date-fns-tz';
import api from '../../../services/api.js'
import LottieView from 'lottie-react-native'
import animationDados from '../../assets/gifs/lupinha.json'
import { useFocusEffect } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window')

export const Carousel = ({data,navigation,gastos30Dias,testeDatas}) =>{
    const lottieRef = React.useRef(null);
    const [activeBanner, setActiveBanner] = useState(0)
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    console.ignoredYellowBox = ['Sending `onAnimatedValueUpdate` with no listeners registered.'];
    
   

    const viewabilityConfigCallbackPairs = useRef([
        {
            
            onViewableItemsChanged: ({ viewableItems }) => {

                if (viewableItems.length > 0) {
                    console.log('Índice do item visível teste 2 :', viewableItems[0].index);
                    setActiveBanner(viewableItems[0].index+1)
                  }

              },
         }
    ])
  
    useEffect(() => {   
        api.get('/gastos')
                .then((response) => {
                
                    const arrayFormatado30Dias= formatarDados30Dias(response.data)
                    // Ordena as compras em ordem decrescente com base na data
                    arrayFormatado30Dias.sort((a, b) => new Date(b.data) - new Date(a.data));
                   
                    setGastos(arrayFormatado30Dias)
                   
                })
                .catch((err)=>{
                    console.error('Erro ao buscar dados', err);
                })
        
      }, []); 
      
      const onTelaEntrouEmFoco = () => {
        // Coloque aqui as ações que deseja executar quando a tela entra em foco
        api.get('/gastos')
                .then((response) => {
                
                    const arrayFormatado30Dias= formatarDados30Dias(response.data)
                    // Ordena as compras em ordem decrescente com base na data
                    arrayFormatado30Dias.sort((a, b) => new Date(b.data) - new Date(a.data));
                   
                    setGastos(arrayFormatado30Dias)
                   
                })
                .catch((err)=>{
                    console.error('Erro ao buscar dados', err);
                })
                
        console.log('Tela entrou em foco Carrousel!');
      };

      useFocusEffect(
        React.useCallback(() => {
          onTelaEntrouEmFoco();
        }, [])
      );

    const formatarDados30Dias = (dados) => {
        const periodoEmDias = 30;
        const dataAtual = new Date();
        const dataInicial = new Date(dataAtual);
        dataInicial.setDate(dataAtual.getDate() - periodoEmDias);

        const comprasNoPeriodo = dados.filter((compra) => {
            const dataCompra = new Date(compra.data); // Suponhamos que 'data' é a propriedade da data da compra
            return dataCompra >= dataInicial && dataCompra <= dataAtual;
          });
        
          return comprasNoPeriodo;
        
      };

  

    const renderItem = ({ item, index }) => {

        const backgroundColor = index % 2 === 0 ? '#CC7E39' : 'rgba(128, 151, 51, 0.8);'

        const data = new Date(item.data);
        data.setDate(data.getDate() + 1); // Adiciona +1 ao dia
    
        return (
        <View style={[styles.item, {backgroundColor}]}>
            <View style={{display:'flex', flexDirection:'row', marginLeft:10}}>
                <Icon name="paw" size={18} color="#FFF" style={styles.icone} />
                <Text  style={styles.text} >{item.nomeRacao} </Text>
            </View>
            <View style={{display:'flex', flexDirection:'row', marginLeft:8,marginTop:5}}>
                 <Icon name="balance-scale" size={17} color="#FFF" style={styles.Balance} />
                <Text style={styles.textKg} >{Number(item.quantidade).toFixed(2)} Kg</Text>
            </View>
            <View style={styles.cardContainerPreco}> 
                <View  style={{display:'flex', flexDirection:'row', marginLeft:10}}>
                     <Icon name="money" size={17} color="#FFF" style={styles.Balance} />
                    <Text style={styles.textTotalGasto} >R$  {Number(item.totalGasto).toFixed(2)} </Text>
                </View>
             <Text style={styles.textDate} >{ formatarData(data)} </Text>
            </View>
         </View>
        );
      };

      const formatarData = (data) => {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() +1 ).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
        };
     
    return ( 
    <><View >
      {gastos.length == 0  ? (
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginTop: 50,fontFamily:'Inter-SemiBold',fontSize:16 }}>Ops, você ainda não cadastrou nada!</Text>
            <LottieView
            source={animationDados}
            autoPlay
            loop
            ref={lottieRef}
            style={{ width: 80, height: 80 }} // Defina o tamanho desejado aqui
            />
      </View> ) : (
             <FlatList  viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current} showsHorizontalScrollIndicator={false} 
            horizontal 
            data={gastos} 
            renderItem={renderItem} 
            snapToAlignment={'start'}
            scrollEventThrottle={16}
            decelerationRate='fast'
            snapToOffsets={[...Array(data.length)].map(
                (x,i)=> i * (width*0.63-88) + (i-1)*88 )}

            keyExtractor={(item,index) => String(index)} 
            />)  
        }
    </View>
      {gastos.length == 0  ? '':(
          <FlatList keyExtractor={(item, index) => String(index)} scrollEnabled={false} horizontal style={styles.carroselVisual}
          data={gastos}
          renderItem = {({item,index}) => (
              <Animated.View
              layout={Layout}
              entering={FadeInLeft}
              exiting={FadeOutRight}
               style={{
                  width: activeBanner === index ? 12 : 8,
                  height:8,
                  borderRadius:4,
                  backgroundColor: activeBanner=== index ? 'black' : 'gray',
                  marginHorizontal:1.5
               }}
          />
          )
           } 
         />
      ) }

     
    </>
    )
}

const styles = StyleSheet.create({
    item: {
      paddingTop:8,
      paddingBottom:8,
      borderRadius:5,
      marginTop:24,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor:"#CC7E39",

      width: width * 0.63 -44,  
      marginHorizontal:22,
    },text:{
        fontFamily:'Inter-SemiBold',
        fontSize:16,
        color:'#FFF',
        marginLeft:10,
        marginBottom:2
    },textTotalGasto:{
        fontFamily:'Inter-Bold',
        color:'#FFF',
        marginLeft:10,

    },textKg:{
        fontFamily:'Inter-Regular',
        color:'#FFF',
        marginLeft:7,
        marginBottom:4
    },textDate:{
        fontFamily:'Inter-Regular',
        color:'#FFF',
    },
    cardContainerPreco:{
        display:'flex',
        flexDirection:'row',
        gap:28,
        paddingBottom:4,
        marginTop:5
    },carroselVisual:{
        paddingTop:20,
        alignSelf:'center'
    }
  });