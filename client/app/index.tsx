import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tanks } from '../types'
import TankService from '../services/tankService'
import TankCard from '../components/TankCard'
import TankStorage from '../services/tankStorage'
import { useRouter } from 'expo-router'

const Home = () => {
  const { navigate } = useRouter()
  const { isSignedIn, user, isLoaded: clerkIsLoaded } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tanks[]>([])
  const [error, setError] = useState<any>(undefined)

  const getAndSetTanks = async () => {
    setIsLoading(true)
    
    if (isSignedIn) {
      const jsonValue = await TankStorage.getAllTanks()

      if (jsonValue !== null) {
        setTanks(jsonValue)
      } else {
        TankService.getAllTanks(user.id)
          .then(async ({ data }) => {
            await TankStorage.storeAllTanks(data)
            setTanks(data)
          })
          .catch((err) => setError(err))
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (clerkIsLoaded) {
      ;(async () => await getAndSetTanks())()
    }
  }, [clerkIsLoaded, isSignedIn])

  if (isLoading || !clerkIsLoaded) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!isSignedIn) {
    return (
      <View style={GlobalStyles.container}>
        <SignInButton />
      </View>
    )
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.cards}>
        {tanks.map((tank, key) => (
          <View key={key}>
            <Pressable onPress={() => navigate(`/tank/${tank.ulid}`)}>
              <TankCard tank={tank} />
            </Pressable>
          </View>
        ))}
      </View> 
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