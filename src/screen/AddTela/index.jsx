import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { InputNew } from "../../components/Input/index.jsx";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const AddTela = () => {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView  style={{ flex: 1 }}>
        <View style={styles.containerButton}>
          <TouchableOpacity onPress={handleGoBack} style={styles.button}>
            <Icon name="left" size={32} color="#C97C37" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.TextCadastro}>Cadastrar Compra </Text>
          <View style={styles.containerCampos}>
            <SafeAreaView>
              <InputNew />
            </SafeAreaView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row", // Para colocar o ícone e o texto na mesma linha
    alignItems: "center", // Alinhar ícone e texto verticalmente
  },
  containerButton: {
    marginTop: 40,
    marginLeft: 10,
    width: "10%",
  },
  TextCadastro: {
    fontFamily: "Inter-ExtraBold",
    color: "#CC7E39",
    fontSize: 32,
    marginTop: "18%",
    alignSelf: "center",
  },
  container: {
    backgroundColor: "#FFF",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
});
