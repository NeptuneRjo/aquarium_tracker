import { StyleSheet } from 'react-native'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Link, Stack } from 'expo-router'
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
            headerRight: (props) => (
              <Link {...props} href="/create" style={styles.btn}>
                New Tank
              </Link>
            ),
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

const styles = StyleSheet.create({
  btn: {
    color: Colors.secondary,
    fontWeight: 600,
    fontSize: 18,
    padding: 6,
    margin: 4,
  },
})