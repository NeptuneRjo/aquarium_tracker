import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
        <Slot />
    </ClerkProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})