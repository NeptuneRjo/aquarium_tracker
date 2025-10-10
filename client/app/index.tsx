import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tanks } from '../types'
import TankService from '../services/tankService'
import TankCard from '../components/TankCard'
import { Stack } from 'expo-router'
import StorageService from '../services/asyncStorageService'


const Home = () => {
  const { isSignedIn, user, isLoaded: clerkIsLoaded } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tanks[]>([])
  const [error, setError] = useState<any>(undefined)

  const getAndSetTanks = async () => {
    if (isSignedIn) {
      const jsonValue = await StorageService.getData('tanks')

      if (jsonValue !== null) {
        setTanks(jsonValue)
      } else {
        TankService.getAllTanks(user.id)
          .then(async ({ data }) => {
            await StorageService.setData('tanks', data)
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

  if (!isSignedIn) {
      return (
        <View style={GlobalStyles.container}>
          <SignInButton />
        </View>
      )
  }

  if (isLoading) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={GlobalStyles.container}>      
      <View style={styles.cards}>
        {tanks.map((tank, key) => (
          <TankCard tank={tank} key={key} />
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