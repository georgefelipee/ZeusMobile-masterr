import React, { Component, useState } from "react";
import { Button, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DatePickerEditModal({DataParaOCalendario,setDataParaOCalendario,setDataParaInput, setdataParaCalendario,
    isDatePickerVisible,
    hideDatePicker,
    setDataSelecionada,dataSelecionada,open,setOpen,setDataParaEnvio,display,styles}) {

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');  

  // const formatDate = (dateToLocale) => {
  //   const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  //   return dateToLocale.toLocaleDateString('pt-BR', options);
  // };
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDataParaOCalendario(currentDate)
    console.log("data sem nadaaa",currentDate);
    const dataFormatada = format(selectedDate,'dd/MM/yyyy',{
       locale:ptBR
    })
    //const dateFormated = formatDate(currentDate)
    console.log(dataFormatada);
    setOpen(false);
    setDataParaInput(dataFormatada)
    setDataSelecionada(dataFormatada);
  };
 
  
    return (
        <>
            <DateTimePicker
                display={display}
                style={styles}
                value={DataParaOCalendario}
                mode={mode}
                locale={'pt'}   
                maximumDate={date}
                onChange={onChange}
                dateFormat={"day month year"}
            />
        </>
    );
}