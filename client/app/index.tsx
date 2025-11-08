import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { TankCard, SignInButton } from '../components'
import { Link, Stack, useRouter } from 'expo-router'
import Colors from '../constants/colors'
import { AppContext } from '../context'

const Home = () => {
  const { navigate } = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const { tanks, loading, error } = useContext(AppContext)

  if (loading || !isLoaded) {
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
    <>
      <Stack.Screen 
        options={{ 
          headerRight: (props) => (
            <Link {...props} href="/create" style={styles.btn}>
              New Tank
            </Link>
          ),
        }} 
      />
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
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  cards: {
    display: 'flex',
    gap: 16
  },
  btn: {
    color: Colors.secondary,
    fontWeight: 600,
    fontSize: 18,
    padding: 6,
    margin: 4,
  },
})