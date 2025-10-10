import { Button, StyleSheet } from 'react-native'
import React from 'react'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Link, Stack, useNavigation, useRouter } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import Colors from '../constants/colors'

const RootLayout = () => {
  const router = useRouter()

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
        <Stack.Screen 
          name="index" 
          options={{ 
            headerTitle: 'Aquarium Tracker',
            headerRight: () => (
              <Link href="/create">
                <Button title="New Tank" onPress={() => router.navigate('/create')} />
              </Link>
            )
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