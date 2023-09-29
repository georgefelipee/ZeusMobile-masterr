import { Button, StyleSheet, Text, View } from "react-native"
import { Header } from "../../components/header"
import { useNavigation } from '@react-navigation/native';



export const Home = ()=> {

    const navigation = useNavigation();

    const navegarParaAddTela = () => {
      console.log('apertou');
      navigation.navigate('AddTela'); // 'TelaDetalhes' é o nome da tela de destino
    };

    const navegarParaHistoryTela = () => {
      console.log('apertouHisstory');
      navigation.navigate('HistoryTela'); // 'TelaDetalhes' é o nome da tela de destino
    };
  
    return(
             <View style={styles.container}> 
                <Header navigation={navigation} navegarParaAddTela={navegarParaAddTela} navegarParaHistoryTela={navegarParaHistoryTela} />
             </View> 
           )

}

const styles = StyleSheet.create({
    container:{
      backgroundColor:'#fff',
      height:'100%'
    }
})