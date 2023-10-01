import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'; // ou outra biblioteca de ícones
import IconEdit from 'react-native-vector-icons/FontAwesome5';
import IconRemove from 'react-native-vector-icons/MaterialIcons';
import { ListItem } from 'react-native-elements';
import ModalEdit from '../modalEdit';
import ModalRemove from '../modalRemove';
import { format, parse,parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import addDays from 'date-fns/esm/fp/addDays/index.js';


export default function HistoricoCards({ id, nomeRacao, quantidade, totalgasto, data, setGastos, pegarGastos }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRemove, setModalVisibleRemove] = useState(false)

  function formatarData(data) {
   
    const dataParseada = parseISO(data);
    // Ajuste o fuso horário para UTC
    const dataUTC = new Date(dataParseada.getTime() + dataParseada.getTimezoneOffset() * 60000);
    // Formate a data para 'dd/MM/yyyy' usando o locale 'pt-BR'
    const dataFormatada = format(dataUTC, 'dd/MM/yyyy', { locale: ptBR })

    return dataFormatada
  }

  return (
    <>
      <ModalRemove pegarGastos={pegarGastos} id={id} nomeRacao={nomeRacao} modalVisibleRemove={modalVisibleRemove} setModalVisibleRemove={setModalVisibleRemove} />
      <ModalEdit
        id={id}
        nomeRacaoEdit={nomeRacao}
        quantidadeEdit={quantidade}
        totalGastoEdit={totalgasto}
        dataEdit={formatarData(data)}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        setGastos={setGastos}
        pegarGastos={pegarGastos}
      />
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/racao-para-animais-de-estimacao.png')}
          style={styles.imagem}
        />
        <View style={styles.textosContainer}>
          <View style={styles.textoIconeContainer}>
            <Icon name="paw" size={18} color="#BC6C25" style={styles.icone} />
            <Text style={styles.textNome}>{nomeRacao}</Text>

            <View style={styles.containerIcones} >

              <TouchableOpacity onPress={() => setModalVisible(true)} >
                <IconEdit name="edit" size={26} color="#404E4D" style={styles.iconeEdit} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisibleRemove(true)}>
                <IconRemove name="highlight-remove" size={28} color="#D41515" style={styles.iconeRemove} />
              </TouchableOpacity>

            </View>

          </View>
          <View style={styles.textoIconeContainer}>
            <Icon name="balance-scale" size={17} color="#BC6C25" style={styles.Balance} />
            <Text style={styles.textQuantidade} >{Number(quantidade).toFixed(2)} Kg</Text>
          </View>
          <View style={styles.textoIconeContainer}>
            <Icon name="money" size={18} color="#BC6C25" style={styles.icone} />
            <Text style={styles.textMoney} >R$ {Number(totalgasto).toFixed(2)}</Text>

          </View>

        </View>
        <Text style={styles.data}>{formatarData(data)}</Text>

      </View>
    </>


  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#404E4D',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imagem: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  textosContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textoIconeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  }, containerIcones: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    left: 190

  }, iconeRemove: {
    marginLeft: 6
  },
  icone: {
    marginRight: 4,
  }, Balance: {
    marginRight: 5,
  },
  data: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#CC7E39',
    marginTop: 59,

  }, text: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#CC7E39',
    marginLeft: 5

  }, textNome: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#CC7E39',
    marginLeft: 8
  }, textQuantidade: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#CC7E39',
    marginLeft: 1,
  }, textMoney: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#CC7E39',
    marginLeft: 8,
  }

});


