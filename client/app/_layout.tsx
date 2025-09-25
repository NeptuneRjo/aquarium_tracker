import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Colors from '../constants/colors'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Constants from 'expo-constants'

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <StatusBar style="light" />
      <SafeAreaProvider style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Aquarium Tracker
          </Text>
        </View>
        <Slot />
      </SafeAreaProvider>
    </ClerkProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.secondary,
    paddingTop: -Constants.statusBarHeight,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: Colors.accent,
    padding: 16,
    paddingVertical: 18,
    paddingTop: Constants.statusBarHeight,
  },
  title: {
    color: Colors.secondary,
    fontWeight: 700,
    fontSize: 21,
    textShadowColor: 'black',
    textShadowRadius: 6
  }
})