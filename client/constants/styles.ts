import { StyleSheet } from "react-native"
import Constants from "expo-constants"

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -Constants.statusBarHeight - 16
    }
}) 

export default GlobalStyles