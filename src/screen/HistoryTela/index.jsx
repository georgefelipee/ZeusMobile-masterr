import { View, Text, StyleSheet, TextInput, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import IconSearch from 'react-native-vector-icons/FontAwesome';
import HistoricoCards from '../../components/HistoricoCards';
import { Picker } from '@react-native-picker/picker';
import api from '../../../services/api.js'
import format from 'date-fns/format';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { isSameMonth, parse, parseISO } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime/index.js';
import ptBR from 'date-fns/esm/locale/pt-BR/index.js';



export default function HistoryTela() {

  const [mesesDisponiveis, setMesesDisponiveis] = useState([]);

  const [selectedValue, setSelectedValue] = useState('2000');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [gastos, setGastos] = useState([]);

  const [gastosForMonths, setGastosForMonths] = useState([]);

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  function pegarGastos() {
    api.get('/gastos')
      .then((response) => {

        const dados = response.data
        pegarMeses(dados)

        const comprasPeriodoEspecifico = ComprasPeriodoEspecifico(selectedValue, dados)
        // const arrayOrdenado = comprasPeriodoEspecifico.sort((a, b) => new Date(b.data) - new Date(a.data));
        // const arrayFormatado = formatarDatasNoArray(comprasPeriodoEspecifico)

        setGastos(comprasPeriodoEspecifico.sort((a, b) => new Date(b.data) - new Date(a.data)));


      })
      .catch((err) => {
        console.error('Erro ao buscar dados', err);
      })
  }


  useEffect(() => {
    pegarGastos();

  }, [selectedValue])


  function pegarMeses(dados) {
    const timeZone = 'America/Sao_Paulo'
    
    const meses = dados.map((compra) => {

      const dataString = compra.data;
      const data = new Date(dataString);
  
      const options = { month: 'long', timeZone: 'UTC' };
      const mes = data.toLocaleString('pt-BR', options);

      return mes;
    });
    // Remover duplicatas e ordenar os meses
    const mesesUnicos = [...new Set(meses)].sort();
    setMesesDisponiveis(mesesUnicos);
  }

  function ComprasPeriodoEspecifico(periodo, dados) {
    if (periodo == '15' || periodo == '30' || periodo == '2000') {
      console.log('entrou');
      const periodoEmDias = Number(periodo);
      const dataAtual = new Date();
      const dataInicial = new Date(dataAtual);
      dataInicial.setDate(dataAtual.getDate() - periodoEmDias);

      const comprasNoPeriodo = dados.filter((compra) => {
        const dataCompra = new Date(compra.data); // Suponhamos que 'data' é a propriedade da data da compra
        return dataCompra >= dataInicial && dataCompra <= dataAtual;
      });

      return comprasNoPeriodo
    } else {
      const arrayFormatado = filtrarComprasPorMes(periodo, dados)
      return arrayFormatado
    }

  }


  function formatarDatasNoArray(gastos) {
    return gastos.map((objeto) => {
      // Analisar a data no objeto (caso não esteja em um objeto de data)
      const dataComFusoHorario = objeto.data;

      // Analisar a data, considerando o fuso horário
      const dataObj = new Date(dataComFusoHorario);
      const dia = format(dataObj, 'dd')
      const mes = format(dataObj, 'MM')
      const ano = format(dataObj, 'yyyy')
      const diaFormat = Number(dia) + 1

      // Formatar a data no padrão brasileiro (dd/MM/yyyy)
      const dataFormatada = `${String(diaFormat)}/${mes}/${ano}`;

      // Retornar o objeto com a data formatada
      return { ...objeto, data: dataFormatada };
    })
  }

  const filtrarNomes = (termo) => {
    if (termo === '') {
      const gastos = pegarGastos()
      setGastos(gastos)
    }

    const comprasFiltrados = gastos.filter((compra) =>
      compra.nomeRacao.toLowerCase().includes(termo.toLowerCase())
    );
    setGastos(comprasFiltrados);
  };

  const handlePesquisaChange = (texto) => {
    setTermoPesquisa(texto);
    filtrarNomes(texto);

  };

  const filtrarComprasPorMes = (mes, dados) => {
    const comprasFiltradas = dados.filter((compra) => {
      const dataString = `${compra.data.slice(0, 10)}T00:00:00.000Z`;
      const data = new Date(dataString);

      // Obtém o mês da compra como um número (0 a 11)
      const mesCompra = data.getUTCMonth();

      // Mapeia o mês em um formato mais fácil de comparar
      const meses = [
        'Janeiro', 'Fevereiro', 'março', 'abril',
        'maio', 'junho', 'julho', 'agosto',
        'setembro', 'outubro', 'novembro', 'dezembro'
      ];
       // Obtém o mês em extenso a partir do array
       const mesCompraExtenso = meses[mesCompra];

       return mesCompraExtenso === mes;
    });

    return comprasFiltradas;

  }

  // const comprasFiltradas = dados.filter((compra) => {
  //   const data = new Date(compra.data);
  //   const mesCompra = data.toLocaleString('pt-BR', { month: 'long' });
  //   console.log('mesCompra', mesCompra);
  //   return mesCompra === mes;

  // });


  return (
    <View style={styles.container}>
     

      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="left" size={32} color="#C97C37" />
        </TouchableOpacity>
        <Text style={styles.titulo} > Histórico de compras </Text>
      </View>

      <View style={styles.containerSearch} >
        <TextInput
          style={styles.input}
          placeholder="Pesquise por nome"
          placeholderTextColor="#888"
          value={termoPesquisa}
          onChangeText={handlePesquisaChange}
        />
        <IconSearch name="search" size={20} color="#545F66" style={styles.icon} />
      </View>

      <View style={styles.containerSorting}>

        <Text style={styles.textSorting} >Ordenar : </Text>

          <Picker
            itemStyle={{fontSize:18,fontFamily:'Inter-Regular',height:100}}
            style={{ flex:1,height:10,marginBottom:100,width:10 }}
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedValue(itemValue)
              handlePesquisaChange('')

            }

            }
          >
            <Picker.Item style={{ fontSize: 11, fontFamily: 'Inter-SemiBold' }} label="Últimos 15 dias" value="15" />
            <Picker.Item style={{ fontSize: 11, fontFamily: 'Inter-SemiBold' }} label="Últimos 30 dias" value="30" />
            {mesesDisponiveis.map((mes, index) => (
              <Picker.Item style={{ fontSize: 11, fontFamily: 'Inter-SemiBold' }} key={index} label={mes} value={mes} />
            ))}

            <Picker.Item style={{ fontSize: 18, fontFamily: 'Inter-Bold' }} label="Todos" value="2000" />
          </Picker>

    

      </View >
      <SafeAreaView>
        <View style={{ height: '75%' }}>

          <ScrollView >
            {gastos.map((item) => (<HistoricoCards key={item._id}
              id={item._id}
              nomeRacao={item.nomeRacao}
              quantidade={item.quantidade}
              totalgasto={item.totalGasto}
              data={item.data}
              setGastos={setGastos}
              pegarGastos={pegarGastos}
              navigation={navigation}
            />))}
          </ScrollView>
        </View>


      </SafeAreaView>



    </View>
  )
}


const styles = StyleSheet.create({

  container: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  containerHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 20,
    gap: 26

  }, titulo: {
    fontFamily: 'Inter-Bold',
    fontSize: 23,
    color: '#809733',
    zIndex:10
  },
  containerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '77%',
    height:40,
    borderColor: '#CC7E39',
    borderWidth: 2,
    borderRadius: 9,
    paddingHorizontal: 10,
    marginTop: 40,
    marginHorizontal: 36,

  }, input: {
    flex: 1,
    paddingLeft: 26,
    paddingVertical: 3,
    color: '#000', // Cor do texto dentro do input
  }, icon: {
    position: 'absolute',
    left: 10

  }, containerSorting: {
    marginLeft: 36,
    marginTop:25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width:'70%',
   
  }, textSorting: {
    fontFamily: 'Inter-Bold',
    color: '#545F66',
    fontSize: 18,
  
  }, textDias: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: '#FFF'

  }, containerOrdenar: {
   
  }, textPicker: {
    color: '#545F66',


  }
})


