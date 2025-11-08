import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import GlobalStyles from '../../constants/styles'
import Colors from '../../constants/colors'
import { useUser } from '@clerk/clerk-expo'
import TankService from '../../services/tankService'
import { Stack, useNavigation, useRouter } from 'expo-router'
import { LocalStorage } from '../../services'

const Create = () => {
  const { user, isSignedIn, isLoaded: clerkIsLoaded } = useUser()
  const navigation = useRouter()

  const [tankName, setTankName] = useState<string>('')
  const [tankDescription, setTankDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const submit = async () => {
    setError(null)

    if (!isSignedIn || !clerkIsLoaded) {
      return
    }

    setIsLoading(true)

    const item = {
      name: tankName,
      description: tankDescription
    }
    TankService.createTank(user.id, item)
      .then(async ({ status, data, message }) => {
        if (status !== 200 && message.length > 0) {
          setError(message)
          setIsLoading(false)
          return
        }

        await LocalStorage.removeData('@tanks')
        navigation.navigate('/')
      })

  }

  if (isLoading) {
    return (
      <View style={GlobalStyles.container}>
        <Stack.Screen options={{ headerTitle: 'Creating...' }} />
        <Text>Creating...</Text>
      </View>
    )
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Tank Name:</Text>
        <TextInput 
          value={tankName}
          onChangeText={setTankName}
          style={styles.name}
          placeholder="Ex. '65g Reef Tank'"
          maxLength={64}
        />
        <Text style={styles.label}>Tank Description:</Text>
        <TextInput 
          value={tankDescription}
          onChangeText={setTankDescription}
          style={styles.description}
          maxLength={256}
          editable
          multiline
          placeholder='Ex. 65g Reef tank. 2 Years old.'
        />
        <View style={styles.submit}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.btnText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Create

const styles = StyleSheet.create({
  name: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.border
  },
  description: {
    height: 120,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.border
  },
  form: {
    width: '100%',
    padding: 28,
  },
  submit: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 12,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  btnText: {
    color: Colors.secondary,
    fontWeight: 600,
    fontSize: 16
  },
  label: {
    marginHorizontal: 12,
    color: Colors.primary,
    fontSize: 16,
    marginTop: 12,
    fontWeight: 500
  },
  error: {
    color: 'red',
    fontWeight: 500,
    fontSize: 16,
  }
})