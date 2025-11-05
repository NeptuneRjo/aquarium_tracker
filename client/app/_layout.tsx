import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Colors from '../constants/colors'
import { Providers } from '../context'

const RootLayout = () => {
  return (
    <Providers>
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
    </Providers>
  )
}

export default RootLayout

const styles = StyleSheet.create({})