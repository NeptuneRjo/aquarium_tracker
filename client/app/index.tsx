import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'


const Home = () => {
  const { isSignedIn, user } = useUser()

  return (
    <View style={GlobalStyles.container}>
      {isSignedIn ? (
        <Text>{user.firstName}</Text>
      ) : (
        <SignInButton />
      )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})