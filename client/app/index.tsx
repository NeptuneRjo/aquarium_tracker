import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tanks } from '../types'
import TankService from '../services/tankService'
import TankCard from '../components/TankCard'
import { Stack } from 'expo-router'


const Home = () => {
  const { isSignedIn, user, isLoaded: clerkIsLoaded } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tanks[]>([])
  const [error, setError] = useState<any>(undefined)

  const getAndSetTanks = async () => {
    if (!clerkIsLoaded) return

    if (isSignedIn) {
      TankService.getAllTanks(user.id)
        .then((res) => setTanks(res.data))
        .catch((err) => setError(err))
    }

    setIsLoading(false)
  }

  useEffect(() => {
      ;(async () => await getAndSetTanks())()
  }, [clerkIsLoaded, isSignedIn])

  if (!isSignedIn) {
      return (
        <View style={GlobalStyles.container}>
          <Stack.Screen options={{ headerTitle: "Aquarium Tracker" }} />
          <SignInButton />
        </View>
      )
  }

  return (
    <View style={GlobalStyles.container}>
      <Stack.Screen options={{ headerTitle: "Aquarium Tracker" }} />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.cards}>
          {tanks.map((tank, key) => (
            <TankCard tank={tank} key={key} />
          ))}
        </View> 
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  cards: {
    display: 'flex',
    gap: 16
  }
})