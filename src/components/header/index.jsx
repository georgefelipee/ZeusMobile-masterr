import { useFonts } from '@expo-google-fonts/inter';
import { View, Text, StyleSheet } from "react-native/"
import { Colors } from "react-native/Libraries/NewAppScreen"
import  Icon from 'react-native-vector-icons/FontAwesome5'
import NavegacaoCard from '../navegacaoCard/index.jsx';
import { Button } from 'react-native-elements';
import Compras from '../compras/index.jsx';
import api from '../../../services/api.js'
import React, { useEffect, useState } from 'react';
import format from 'date-fns/format';
import { useFocusEffect } from '@react-navigation/native';

export const Header = ({navegarParaAddTela,navigation,navegarParaHistoryTela}) => {
    const [gastos, setGastos] = useState([]);
    const [gastos30Dias, setGastos30Dias] = useState([]);

    const[somaGastoTotal, setSomaGastototal] = useState(0)
    const[somaQuantidadeTotal, setSomaQuantidadetotal] = useState(0)

    useEffect(() => {

      api.get('/gastos')
                .then((response) => {
                   
                    const arrayFormatado =  formatarDatasNoArray(response.data) 
                    setGastos(arrayFormatado) 

                    const soma = response.data.reduce((total, gasto)=> total + gasto.totalGasto,0)
                    setSomaGastototal(Number(soma).toFixed(2))

                    const gastosTotaisMes =  calcularGastosTotais(response.data)
                    setSomaGastototal(gastosTotaisMes.toFixed(2))

                    const quantidadeTotal= calcularQuantidadeTotal(response.data)
                    setSomaQuantidadetotal(quantidadeTotal)
                     
                })
                .catch((err)=>{
                    console.error('Erro ao buscar dados', err);
                })

    }, [navigation])

    const onTelaEntrouEmFoco = () => {
        // Coloque aqui as ações que deseja executar quando a tela entra em foco
        api.get('/gastos')
        .then((response) => {
           
            const arrayFormatado =  formatarDatasNoArray(response.data) 
            setGastos(arrayFormatado) 

            const soma = response.data.reduce((total, gasto)=> total + gasto.totalGasto,0)
            setSomaGastototal(Number(soma).toFixed(2))

            const gastosTotaisMes =  calcularGastosTotais(response.data)
            setSomaGastototal(gastosTotaisMes.toFixed(2))

            const quantidadeTotal= calcularQuantidadeTotal(response.data)
            setSomaQuantidadetotal(quantidadeTotal)
            console.log(quantidadeTotal);
             
        })
        .catch((err)=>{
            console.error('Erro ao buscar dados', err);
        })
        console.log('Tela entrou em foco HEader!');
      };

    useFocusEffect(
        React.useCallback(() => {
          onTelaEntrouEmFoco();
        }, [])
      );


    function formatarDatasNoArray(gastos){
        return gastos.map((objeto) => {
            // Analisar a data no objeto (caso não esteja em um objeto de data)
            const dataComFusoHorario = objeto.data;
    
            // Analisar a data, considerando o fuso horário
            const dataObj = new Date(dataComFusoHorario);
            const dia = format(dataObj, 'dd')
            const mes = format(dataObj, 'MM')
            const ano = format(dataObj, 'yyyy')
            const diaFormat = Number(dia)+1
    
            // Formatar a data no padrão brasileiro (dd/MM/yyyy)
            const dataFormatada = `${String(diaFormat)}/${mes}/${ano}`;
            
            // Retornar o objeto com a data formatada
            return { ...objeto, data: dataFormatada };      
        })
    }

    const calcularGastosTotais = (dados) => {
        const periodoEmDias = 30;
        const dataAtual = new Date();
        const dataInicial = new Date(dataAtual);
        dataInicial.setDate(dataAtual.getDate() - periodoEmDias);
    
        const comprasNoPeriodo = dados.filter((compra) => {
          const dataCompra = new Date(compra.data); // Suponhamos que 'data' é a propriedade da data da compra
          return dataCompra >= dataInicial && dataCompra <= dataAtual;
        });
    
        const gastosTotais = comprasNoPeriodo.reduce((total, compra) => {
          return total + compra.totalGasto; // Suponhamos que 'totalGasto' é a propriedade do valor da compra
        }, 0);
    
        return gastosTotais;
      };

      const calcularQuantidadeTotal = (dados) => {
        const periodoEmDias = 30;
        const dataAtual = new Date();
        const dataInicial = new Date(dataAtual);
        dataInicial.setDate(dataAtual.getDate() - periodoEmDias);
    
        const comprasNoPeriodo = dados.filter((compra) => {
          const dataCompra = new Date(compra.data); // Suponhamos que 'data' é a propriedade da data da compra
          return dataCompra >= dataInicial && dataCompra <= dataAtual;
        });
        const comprasNoPeriodoDatesFormated= formatarDatasNoArray(comprasNoPeriodo)

        setGastos30Dias(comprasNoPeriodoDatesFormated);
    
        const quantidadeTotais = comprasNoPeriodo.reduce((total, compra) => {
          return total + compra.quantidade; // Suponhamos que 'valor' é a propriedade do valor da compra
        }, 0);
    
        return quantidadeTotais;
      };

    return (
        <View style={styles.containerPrincipal}>
            <View style={styles.headerContainer}>
                <Text style={styles.TextHeader}>  Pet<Text style={styles.textInvestiment}>Investiment</Text> </Text>
                <Icon style={styles.icon}  size={28} name="dog"/> 
            </View>
            
            <View style={styles.containerCards}> 
        
                {/* Card de Gasto Mensal */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Gasto do Mês</Text>
                    <Text style={styles.cardValue}>R$ {somaGastoTotal}</Text>
                </View>

               {/* Card de Estoque Mensal */}
                <View style={styles.card}>
                     <Text style={styles.cardTitle}>Estoque do mês </Text>
                     <Text style={styles.cardValue}>{somaQuantidadeTotal.toFixed(2)} Kg</Text>
                </View>

            </View>
            <NavegacaoCard navigation={navigation} navegarParaHistoryTela={navegarParaHistoryTela} navegarParaAddTela={navegarParaAddTela} />
            <Compras navigation={navigation} gastos30Dias={gastos30Dias} dados={gastos} />
        </View>

    )

}

const styles = StyleSheet.create({
    icon: {
        marginTop: 35, // Espaço entre o ícone e o texto
        color:'#BC6C25'
     },
     textInvestiment:{
        color:'#809733'
     },
    headerContainer:{
        flexDirection: 'row', // Organiza os elementos em uma linha horizontal
        alignItems: 'center', // Alinha os elementos verticalmente
        marginBottom:18,
    },
    TextHeader: {
        marginTop: 40,
        marginLeft: 10,
        fontFamily: 'Inter-ExtraBold',
        fontSize:32,
       
        color:'#BC6C25'
    },
    containerCards: {
       
    }, 
    card:{
      marginBottom:20,   

    },cardTitle:{
        fontSize: 20,
        marginLeft: 22,
        fontFamily:'Inter-Bold',
        color:'#404E4D',
    },cardValue: {
        color:'#000000',
        fontFamily:'Inter-ExtraBold',
        fontSize: 36,
        marginLeft:22,
    }
})