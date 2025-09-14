import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tank } from '../types'
import TankService from '../services/tankService'


const Home = () => {
  const { isSignedIn, user } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tank[]>([])
  const [error, setError] = useState<any>(undefined)

  useEffect(() => {
    if (isSignedIn) {
      ;(async () => {
        TankService.getAllTanks(user.id).then((res) => {
          setTanks(res.data)
          setIsLoading(false)
        }).catch((err) => setError(err))
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
            <Text key={key}>{tank.name}</Text>
          ))}
        </> 
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})