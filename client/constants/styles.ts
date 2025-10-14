import { StyleSheet } from "react-native"
import Constants from "expo-constants"
import Colors from "./colors"

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        backgroundColor: Colors.primary,
        padding: 12,
        shadowRadius: 12,
        shadowColor: 'black',
        elevation: 4,
        borderRadius: 4
    },
}) 

export default GlobalStyles