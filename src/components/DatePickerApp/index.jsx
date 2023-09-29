import React, { Component, useState } from "react";
import { Button, View } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DatePicker({showDateTimePicker,
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
    const dataFormatada = format(selectedDate,'dd/MM/yyyy',{
       locale:ptBR
    })
    //const dateFormated = formatDate(currentDate)
    console.log(dataFormatada);
    setOpen(false);
    setDataSelecionada(dataFormatada);
  };
 
  
    return (
        <>
            <DateTimePicker
                display={display}
                style={styles}
                locale='pt-BR'
                value={date}
                mode={mode}
                maximumDate={date}
                onChange={onChange}
                dateFormat={"day month year"}
            />
        </>
    );
}