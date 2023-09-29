import { View, Text, Modal, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import api from '../../../services/api.js';
import Toast from 'react-native-toast-message';

export default function ModalRemove({pegarGastos,id,nomeRacao,setModalVisibleRemove,modalVisibleRemove}) {

    const handleDelete = () => {

        try {   
            api.delete(`/gastos/${id}`,{

            })
            .then(() => {
                pegarGastos()
                handleCloseRemover()
            })
            .catch((err)=> console.log(err))

        } catch (error) {
            
        }

    }

    function handleCloseRemover(){

        setModalVisibleRemove(false)
    
        Toast.show({
            text1:'Compra excluída com sucesso!',
            type:'error'
        })
    
      }
  return (

    <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleRemove}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisibleRemove(!modalVisibleRemove);
            }}>
        <View style={styles.centeredView}>
            <View style={styles.centeredContent} >
                <View style={styles.containerPrincipal}> 
                    <Text style={styles.titulo}> Excluir Compra </Text>
                </View>
                <Text style={styles.textoSecundario}> Deseja excluir a compra "{nomeRacao}" ? </Text>

                <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={() => setModalVisibleRemove(false)}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.buttonExcluir}>
                            <Text style={styles.excluirText}>Excluir</Text>
                        </TouchableOpacity>


                 </View>

            </View>

        </View>

    </Modal>
  )
}
const styles = StyleSheet.create({
    buttonsContainer:{
        paddingTop:40,
        display:'flex',
        flexDirection:'row',
        marginLeft:128,
        gap:10,
        alignItems:'center'
    },
    containerPrincipal:{
        display:'flex',
        flexDirection:'column'
    },
     centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
     },centeredContent: {
        backgroundColor: 'white',
        padding: 15,
        width: '75%',
        borderRadius: 10,
        height: 172
    },titulo:{
        fontFamily:'Inter-Bold',
        fontSize:16,
        color:'red',
        marginBottom:7
    },textoSecundario:{
        fontFamily:'Inter-Regular',
        fontSize:16,
        marginTop:8,
    },excluirText:{
        fontFamily:'Inter-SemiBold',
        fontSize:14,
        color:'red'
    }, cancelText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: 14
    },buttonExcluir:{
        borderWidth: 1.8,
        borderColor: 'red',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:6
        
    }

})
