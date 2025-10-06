import { StyleSheet } from 'react-native'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Colors from '../constants/colors'

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.accent
        },
        headerTitleStyle: {
          color: Colors.secondary,
          fontWeight: 700,
          fontSize: 21,
        },
        headerTintColor: Colors.secondary
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tank" />
      </Stack>
    </ClerkProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})