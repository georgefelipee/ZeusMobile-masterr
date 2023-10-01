import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  TouchableOpacity,
  LogBox,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { TextInputMask } from "react-native-masked-text";
import Balance from "react-native-vector-icons/FontAwesome5";
import Money from "react-native-vector-icons/MaterialIcons";
import Calendar from "react-native-vector-icons/Ionicons";
import api from "../../../services/api.js";
import { format, set, addDays } from "date-fns";
import Toast from "react-native-toast-message";
import DatePickerEditModal from "../DatePickerEditModal/index.jsx";

export default function ModalEdit({
  setGastos,
  modalVisible,
  setModalVisible,
  id,
  nomeRacaoEdit,
  quantidadeEdit,
  totalGastoEdit,
  dataEdit,
  pegarGastos,
}) {
  const [nomeRacao, setnomeRacao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [totalGasto, setTotalGasto] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState();
  const [DataParaInput, setDataParaInput] = useState("");

  const [DataParaOCalendario, setDataParaOCalendario] = useState("");

  const [open, setOpen] = useState(false); //DatePicker

  useEffect(() => {
    setnomeRacao(nomeRacaoEdit);
    setQuantidade(quantidadeEdit);
    setTotalGasto(totalGastoEdit);
    setDataParaInput(dataEdit);

    const dataCorrigidaParaObjeto = converterDataParaObjetoDate(dataEdit);

    console.log(dataCorrigidaParaObjeto);
    setDataParaOCalendario(dataCorrigidaParaObjeto);
    setDataSelecionada(dataCorrigidaParaObjeto);
  }, [modalVisible]);

  function converterDataParaObjetoDate(dataString) {
    // Divida a string da data em dia, mês e ano
    const partesData = dataString.split("/");

    // Certifique-se de que há três partes (dia, mês e ano)
    if (partesData.length === 3) {
      // Obtenha o ano, mês e dia das partes divididas
      const ano = partesData[2];
      const mes = partesData[1] - 1; // Os meses em JavaScript são baseados em zero, então subtraia 1.
      const dia = partesData[0];

      // Crie um objeto Date
      const objetoDate = new Date(ano, mes, dia);

      return objetoDate;
    } else {
      // Caso a string de data não esteja no formato esperado
      return null;
    }
  }

  const handleInputChangeTotalGasto = (text) => {
    // Remova os caracteres não numéricos, exceto números e vírgulas
    let valorFormatado = text.replace(/[^\d,]/g, "");

    // Substitua a vírgula por um ponto
    valorFormatado = valorFormatado.replace(",", ".");

    setTotalGasto(valorFormatado / 100); // Atualize o estado com o valor formatado

    console.log(valorFormatado / 100, "valor formatado");
  };

  const handleInputChangeNomeRacao = (text) => {
    setnomeRacao(text);
    console.log(text);
  };

  const showDateTimePicker = () => {
    setOpen(true);
  };

  const handleInputChangeQuantidade = (text) => {
    // Remova os caracteres não numéricos, exceto números e vírgulas
    let valorFormatado = text.replace(/[^\d,]/g, "");
    // Substitua a vírgula por um ponto
    valorFormatado = valorFormatado.replace(",", ".");

    setQuantidade(valorFormatado / 100);
    console.log(valorFormatado / 100, "Quantidade Formatado");
  };

  const handleSubmit = () => {
    console.log("data para enviar", DataParaOCalendario);

    // Crie um objeto Date a partir da data recebida
    const dataObj = new Date(DataParaOCalendario);

    // Defina a hora para meia-noite (00:00:00)
    dataObj.setUTCHours(0, 0, 0, 0);

    // Obtenha a representação da data no formato desejado "YYYY-MM-DDTHH:mm:ss.sss+00:00"
    const dataFormatada = dataObj.toISOString().replace("Z", "+00:00");

    console.log("dataformatada", dataFormatada); // Isso imprimirá "2023-10-01T00:00:00.000+00:00"

    const dataRecebida = dataFormatada;

    // Crie um objeto Date a partir da data recebida
    const dataObjNovo = new Date(dataRecebida);

    // Obtenha a representação da data no formato "aaaa-MM-dd"
    const dataFormatadaNova = `${dataObjNovo.getUTCFullYear()}-${(
      dataObj.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dataObjNovo.getUTCDate().toString().padStart(2, "0")}`;

    console.log("dataFormatadaNova",dataFormatadaNova); // Isso imprimirá "2023-10-01"

    // Converter a string de data para um objeto Date
    // const dataSemFusoHorario = new Date(Date.UTC(
    //     dataFormatoCerto.getUTCFullYear(),
    //     dataFormatoCerto.getUTCMonth(),
    //     dataFormatoCerto.getUTCDate()
    // ))

    // // Formate a data no formato desejado com 'Z' como fuso horário
    // const dataFormatada = dataSemFusoHorario.toISOString()

    try {
      console.log("entrou");
      if (nomeRacao !== "" || totalGasto !== "" || quantidade !== "") {
        api
          .patch(`/gastos/${id}`, {
            nomeRacao: nomeRacao,
            totalGasto: totalGasto,
            quantidade: quantidade,
            data: dataFormatadaNova,
          })
          .then(() => {
            pegarGastos(), handleCloseEditar();
          })
          .catch((err) => console.log(err.message));
      } else {
        alert("Preencha os campos ! ");
      }
    } catch (error) {}
  };

  function handleCloseEditar() {
    setModalVisible(false);

    Toast.show({
      text1: "Compra Editada com sucesso! ",
      type: "success",
    });

    setnomeRacao("");
    setQuantidade("");
    setTotalGasto("");
  }

  function formatarDataFormatoCerto(data) {
    // Divide a string da data em dia, mês e ano
    const partes = data.split("/");

    // Obtém o dia, mês e ano
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    // Formata a data no formato "yyyy-mm-dd"
    const dataFormatada = `${ano}-${mes}-${dia}`;

    return dataFormatada;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.centeredContent}>
          <View style={styles.containerPrincipal}>
            <Text style={styles.titulo}> Editar Compra </Text>
            <View style={styles.containerInput}>
              <TextInput
                placeholderTextColor={"#788794"}
                onChangeText={handleInputChangeNomeRacao}
                underlineColorAndroid="transparent"
                placeholder="Nome da ração"
                value={nomeRacao}
                style={styles.input}
                onPressOut={()=> { setOpen(false)}}
              />
              <Icon style={styles.icon} size={26} name="dog" />
            </View>

            <View style={styles.containerInput}>
              <TextInputMask
                placeholder="Quantidade em Kg"
                style={styles.input}
                type={"money"}
                options={{
                  precision: 2,
                  separator: ".",
                  delimiter: ".",
                  unit: "",
                  suffixUnit: "",
                }}
                value={quantidade}
                onChangeText={handleInputChangeQuantidade}
              />
              <Balance
                style={styles.iconBalance}
                size={22}
                name="balance-scale"
              />
            </View>

            <View style={styles.containerInput}>
              <TextInputMask
                placeholder="Digite o valor R$"
                style={styles.input}
                type={"money"}
                options={{
                  precision: 2,
                  separator: ".",
                  delimiter: ".",
                  unit: "R$",
                  suffixUnit: "",
                }}
                value={totalGasto}
                onChangeText={handleInputChangeTotalGasto}
              />
              <Money style={styles.iconMoney} size={32} name="attach-money" />
            </View>
            <View
              onTouchEnd={() => showDateTimePicker()}
              style={styles.datePickerInput}
            >
              <View style={styles.textContainer}>
                <Calendar
                  style={styles.iconCalendar}
                  size={26}
                  name="calendar-outline"
                />
                <TextInput
                  style={{ height: 45, fontSize: 16,marginLeft:10 }}
                  value={DataParaInput}
                  editable={false}
                  inputMode="none"
                />
              </View>

              {open &&
                (Platform.OS !== "ios" ? (
                  <DatePickerEditModal
                    setOpen={setOpen}
                    dataSelecionada={dataSelecionada}
                    open={open}
                    setDataSelecionada={setDataSelecionada}
                    showDateTimePicker={showDateTimePicker}
                  />
                ) : (
                  <View style={styles.iosDatePickerView}>
                    <DatePickerEditModal
                      display={"inline"}
                      styles={styles.iosDatePicker}
                      setOpen={setOpen}
                      setDataParaInput={setDataParaInput}
                      open={open}
                      setDataSelecionada={setDataSelecionada}
                      showDateTimePicker={showDateTimePicker}
                      setDataParaOCalendario={setDataParaOCalendario}
                      DataParaOCalendario={DataParaOCalendario}
                    />
                  </View>
                ))}
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.buttonEnviar}
            >
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  iosDatePicker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "44%",
    marginTop: 50,
    gap: 30,
  },
  buttonEnviar: {
    backgroundColor: "#809733",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    color: "red",
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
  },
  editText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#FFF",
  },
  datePickerInput: {
    zIndex: 10,
    position: "relative",
    paddingHorizontal: 16,

    display: "flex",
    gap: 4,
    flexDirection: "row",
    justifyContent: "flex-start",

    alignItems: "center",
    backgroundColor: "#FFF",
    color: "#000",
    borderRadius: 5,
    fontSize: 18,
    marginTop: 16,
    width: "98 %", // Defina a largura desejada aqui
  },
  input: {
    height: 40,
    flex: 1,
    backgroundColor: "#FFF",
    paddingLeft: 50,
    marginHorizontal: 40,
    borderRadius: 8,
    fontSize: 18,
    borderColor: "#809733",
    borderWidth: 1,
  },
  containerInput: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  icon: {
    color: "#BC6C25",
    position: "absolute",
    left: 50,
    top: 5,
  },
  iconBalance: {
    color: "#BC6C25",
    position: "absolute",
    left: 50,
    top: 7,
  },
  iconMoney: {
    color: "#BC6C25",
    position: "absolute",
    left: 50,
    top: 3,
  },
  iconCalendar: { color: "#BC6C25",},
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredContent: {
    backgroundColor: "white",
    padding: 15,
    width: "90%",
    borderRadius: 10,
    height: 410,
  },
  containerPrincipal: {
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  titulo: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#BC6C25",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  iosDatePickerView: {
    width: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 9,
    transform: [{ translateX: 20 }],
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    marginLeft: 22,
    borderColor: "#809733",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 132,
  },
});
