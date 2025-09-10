import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SignInButton from '../components/SignInButton'
import Colors from '../constants/colors'
import Constants from 'expo-constants'

const Home = () => {
  return (
    <View style={styles.container}>
      <SignInButton />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -Constants.statusBarHeight
  }
})