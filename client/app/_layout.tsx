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
        headerTintColor: Colors.secondary,
        headerShadowVisible: false
      }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerTitle: 'Aquarium Tracker',
          }}
        />
        <Stack.Screen 
          name="create/index" 
          options={{ headerTitle: 'Create A New Tank' }}
        />
        <Stack.Screen name="tank/[id]" />
      </Stack>
    </ClerkProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})