import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, GlobalStyles } from '../../constants'
import { useUser } from '@clerk/clerk-expo'
import { Stack, useRouter } from 'expo-router'
import { LocalStorage, TankService } from '../../services'
import { AppContext } from '../../context'

const Create = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const navigation = useRouter()
  const { loading, setLoading } = useContext(AppContext)

  const [tankName, setTankName] = useState<string>('')
  const [tankDescription, setTankDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)

    if (isSignedIn && isLoaded) {
      setLoading(true)
  
      const item = {
        name: tankName,
        description: tankDescription
      }
      TankService.createTank(user.id, item)
        .then(async ({ status, data, message }) => {
          if (status !== 200 && message.length > 0) {
            setError(message)
            setLoading(false)
            return
          }
  
          await LocalStorage.removeData('@tanks')
          navigation.navigate('/')
        })      
    }
  }

  if (loading) {
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