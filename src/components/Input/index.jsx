import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Balance from "react-native-vector-icons/FontAwesome5";
import Money from "react-native-vector-icons/MaterialIcons";
import Calendar from "react-native-vector-icons/Ionicons";
import { TextInputMask } from "react-native-masked-text";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-native-elements";
import { te } from "date-fns/locale";
import DatePicker from "../DatePickerApp/index.jsx";
import { setDate } from "date-fns";
import api from "../../../services/api.js";
import { format, set, addDays } from "date-fns";
import Toast from "react-native-toast-message";

export const InputNew = ({}) => {
  const [open, setOpen] = useState(false); //DatePicker
  const [dataSelecionada, setDataSelecionada] = useState();
  const [dataParaEnvio, setDataParaEnvio] = useState(new Date());
  const [modeData, setModeData] = useState("date");

  const [totalGasto, setTotalGasto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nomeRacao, setnomeRacao] = useState("");

  const [gastoObjeto, setGastoObjeto] = useState({});

  const moneyFieldRef = useRef(null);

  useEffect(() => {
    const dataAtual = new Date();

    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();

    var dataFormatada = `${dia}/${mes}/${ano}`;

    setDataSelecionada(dataFormatada);
  }, []);

  const mostrarSnackbar = () => {
    setSnackbarVisible(true);
  };

  const showDateTimePicker = () => {
    setOpen(true);
  };

  const hideDateTimePicker = () => {
    setOpen(false);
  };

  const handleDataChange = (date) => {
    setDataSelecionada(date);
  };

  const handleInputChangeNomeRacao = (text) => {
    setnomeRacao(text);
    console.log(text);
  };

  const handleInputChangeTotalGasto = (text) => {
    // Remova os caracteres não numéricos, exceto números e vírgulas
    let valorFormatado = text.replace(/[^\d,]/g, "");

    // Substitua a vírgula por um ponto
    valorFormatado = valorFormatado.replace(",", ".");

    setTotalGasto(valorFormatado / 100); // Atualize o estado com o valor formatado

    console.log(valorFormatado / 100, "valor formatado");
  };

  const handleInputChangeQuantidade = (text) => {
    // Remova os caracteres não numéricos, exceto números e vírgulas
    let valorFormatado = text.replace(/[^\d,]/g, "");
    // Substitua a vírgula por um ponto
    valorFormatado = valorFormatado.replace(",", ".");

    setQuantidade(valorFormatado / 100);
    console.log(valorFormatado / 100, "Quantidade Formatado");
  };

  function handleCloseCadastrar() {
    Toast.show({
      text1: "Compra cadastrada com sucesso! ",
      text2: "Volte para tela inicial ",
     
    });

    setnomeRacao("");
    setQuantidade();
    setTotalGasto();
  }

  const handleSubmit = () => {
    const dataFormatoCerto = new Date(
      formatarDataFormatoCerto(dataSelecionada)
    );

    const dataSemFusoHorario = new Date(
      Date.UTC(
        dataFormatoCerto.getUTCFullYear(),
        dataFormatoCerto.getUTCMonth(),
        dataFormatoCerto.getUTCDate()
      )
    );

    // Some 1 dia à data
    const dataAjustada = addDays(dataSemFusoHorario, 1);

    // Formate a data no formato desejado com 'Z' como fuso horário
    const dataFormatada = format(dataAjustada, "yyyy-MM-dd'T'00:00:00.000'Z'");

    try {
      console.log("entrou");
      if (nomeRacao !== "" || totalGasto !== "" || quantidade !== "") {
        api
          .post("/gastos", {
            nomeRacao: nomeRacao,
            totalGasto: totalGasto,
            quantidade: quantidade,
            data: dataFormatada,
          })
          .then(handleCloseCadastrar())
          .catch((err) => console.log(err));
      } else {
        alert("Preencha os campos ! ");
      
      }
    } catch (error) {
      alert("Preencha os campos ! ");
    }

    console.log("Data inserido:", dataFormatada);
  };

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
  
    <>  
      <View style={styles.formContainer}>
      
        <View style={styles.container}>
          <Icon style={styles.icon} size={26} name="dog" />
          <TextInput
            placeholderTextColor={"#788794"}
            onChangeText={handleInputChangeNomeRacao}
            underlineColorAndroid="transparent"
            placeholder="Nome da ração"
            value={nomeRacao}
            style={styles.input}
          />
        </View>
        <View style={styles.container}>
          <Balance style={styles.iconBalance} size={22} name="balance-scale" />
          <TextInputMask
            placeholderTextColor={"#788794"}
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
        </View>
        <View style={styles.container}>
          <Money style={styles.iconMoney} size={32} name="attach-money" />
          <TextInputMask
            placeholderTextColor={"#788794"}
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
            ref={(ref) => (this.moneyField = ref)}
          />
        </View>
        <View
          style={styles.datePickerInput}
          onTouchEnd={() => {
            showDateTimePicker()
            Keyboard.dismiss()
          }}
        >
          <Calendar
            style={styles.iconCalendar}
            size={26}
            name="calendar-outline"
          />
          <TextInput
            style={{ height: 50, fontSize: 18 }}
            value={dataSelecionada}
            editable={false}
            inputMode="none"
          />

          {open &&
            (Platform.OS !== "ios" ? (
              <DatePicker
                setDataParaEnvio={setDataParaEnvio}
                setOpen={setOpen}
                dataSelecionada={dataSelecionada}
                open={open}
                setDataSelecionada={setDataSelecionada}
                hideDateTimePicker={hideDateTimePicker}
                showDateTimePicker={showDateTimePicker}
              />
            ) : (
              <View style={styles.iosDatePickerView}>
                <DatePicker
                  display={"inline"}
                  styles={styles.iosDatePicker}
                  setDataParaEnvio={setDataParaEnvio}
                  setOpen={setOpen}
                  dataSelecionada={dataSelecionada}
                  open={open}
                  setDataSelecionada={setDataSelecionada}
                  hideDateTimePicker={hideDateTimePicker}
                  showDateTimePicker={showDateTimePicker}
                />
              </View>
            ))}
        </View>

        <View style={styles.containerButton}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  datePickerButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  button: {
    width: "50%", // Largura do botão
    backgroundColor: "#809733", // Cor de fundo do botão
    borderRadius: 8, // Cantos arredondados
    padding: 8,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Cor da sombra
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4, // Opacidade da sombra
    shadowRadius: 1, // Raio da sombra
    elevation: 3, // Elevação no Android para sombra
  },
  containerButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#fff", // Cor do texto
    fontFamily: "Inter-Bold",
    fontSize: 18,
  },
  datePickerInput: {
    zIndex: 10,
    position: "relative",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#809733",
    backgroundColor: "#FFF",
    color: "#000",
    borderRadius: 5,
    fontSize: 18,
    height: 50,
    width: "100%",
  },
  input: {
    height: 50,
    flex: 1,
    backgroundColor: "#FFF",
    fontSize: 18,
    borderRadius: 8,
    borderWidth: 0,
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    borderColor: "#809733",
    borderWidth: 1,
  },
  icon: {
    color: "#BC6C25",
  },
  iconMoney: {
    color: "#BC6C25",
  },
  iconCalendar: {
    color: "#BC6C25",
  },
  iconBalance: {
    color: "#BC6C25",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarInput: {
    backgroundColor: "red",
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
  iosDatePicker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
