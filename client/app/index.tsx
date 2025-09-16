import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tanks } from '../types'
import TankService from '../services/tankService'
import TankCard from '../components/TankCard'


const Home = () => {
  const { isSignedIn, user, isLoaded: clerkIsLoaded } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tanks[]>([])
  const [error, setError] = useState<any>(undefined)

  useEffect(() => {
    if (!clerkIsLoaded) return;

    if (isSignedIn) {
      ;(async () => {
        try {
          const res = await TankService.getAllTanks(user.id)
          setTanks(res.data)
          setIsLoading(false)
        } catch (error) {
          setError(error)
        }
      })()
    }
  }, [])

  if (!isSignedIn) {
      return (
        <View style={GlobalStyles.container}>
          <SignInButton />
        </View>
      )
  }

  return (
    <View style={GlobalStyles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {tanks.map((tank, key) => (
            <TankCard tank={tank} key={key} />
          ))}
        </> 
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})