import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SignInButton from '../components/SignInButton'
import { useUser } from '@clerk/clerk-expo'
import GlobalStyles from '../constants/styles'
import { Tanks } from '../types'
import TankService from '../services/tankService'
import TankCard from '../components/TankCard'
import TankStorage from '../services/tankStorage'
import { useRouter } from 'expo-router'
import Colors from '../constants/colors'

const Home = () => {
  const { navigate } = useRouter()
  const { isSignedIn, user, isLoaded: clerkIsLoaded } = useUser()
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tanks, setTanks] = useState<Tanks[]>([])
  const [error, setError] = useState<any>(undefined)

  const [modalVisable, setModalVisable] = useState<boolean>(false)
  const [modalLoading, setModalLoading] = useState<boolean>(false)
  const [selectedTank, setSelectedTank] = useState<Tanks>()

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

  const deleteTank = async () => {
    if (isSignedIn && selectedTank !== undefined) {
      setModalLoading(true)
      TankService.deleteTank(user?.id, selectedTank.ulid)
        .then(async (res) => {
          TankStorage.removeTank(selectedTank.ulid)
            .then(async () => {
              TankStorage.removeAllTanks()
              setModalVisable(false)
              await getAndSetTanks()
            })
        })
    }
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
      <Modal
          visible={modalVisable}
          animationType='fade'
          // transparent={true}
          backdropColor={Colors.transparent}
      >
          <View style={styles.modal}>
              {modalLoading ? (
                <View style={styles.modalContent}>
                  <Text>Deleting tank...</Text>
                </View>
              ) : (
              <View style={styles.modalContent}>
                <Text style={[styles.text, { fontWeight: 500, fontSize: 18, textAlign: 'center' }]}>
                    Are you sure you want to delete '{selectedTank?.name}'?
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable 
                    style={GlobalStyles.btn} 
                    onPress={() => setModalVisable(false)}
                  >
                    <Text style={[styles.text, { fontWeight: 600, width: 90, textAlign: 'center' }]}>Back</Text>
                  </Pressable>
                  <Pressable 
                    style={[GlobalStyles.btn, { backgroundColor: Colors.secondary }]}
                    onPress={() => deleteTank()}
                  >
                    <Text style={[styles.text, { color: Colors.primary, fontWeight: 600 }]}>
                        Confirm
                    </Text>
                  </Pressable>
                </View>
              </View>
              )}
          </View>
      </Modal>
      <View style={styles.cards}>
        {tanks.map((tank, key) => (
          <View key={key}>
            <Pressable 
              onPress={() => navigate(`/tank/${tank.ulid}`)}
              onLongPress={() => {
                setSelectedTank(tank)
                setModalVisable(true)
              }}
            >
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
  },
  modal: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 32
  },
  modalContent: {
      width: '100%',
      height: 125,
      backgroundColor: Colors.accent,
      borderRadius: 4,
      elevation: 3,
      shadowRadius: 8,
      padding: 16,
      justifyContent: 'space-around'
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 18
  },
  text: {
      color: Colors.secondary,
  },
})