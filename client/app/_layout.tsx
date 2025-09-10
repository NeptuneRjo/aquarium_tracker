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
      <SafeAreaProvider style={styles.container}>
        <Text style={styles.title}>Aquarium Tracker</Text>
        <Slot />
      </SafeAreaProvider>
    </ClerkProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  title: {
    backgroundColor: Colors.accent,
    padding: 16,
    paddingVertical: 18,
    paddingTop: Constants.statusBarHeight,
    color: Colors.secondary,
    fontWeight: 800,
    fontSize: 21,
    textShadowColor: Colors.primary,
    textShadowRadius: 14
  }
})