import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Tanks } from '../types'
import { Link, useRouter } from 'expo-router'
import Colors from '../constants/colors'
import GlobalStyles from '../constants/styles'

interface Props {
  tank: Tanks
}

const TankCard = ({ tank }: Props) => {  
  const navigation = useRouter()
  const maxDescriptionLength = 124

  const [modalVisable, setModalVisable] = useState<boolean>(false)

  const truncateDescription = (description: string): string => {
    if (description.length > maxDescriptionLength) {
      return description.substring(0, maxDescriptionLength) + '...'
    }
    return description
  }

  return (
    <Pressable 
      onPress={() => navigation.navigate(`/tank/${tank.ulid}`)}
      onLongPress={() => setModalVisable(true)}
    >
      <Modal
        visible={modalVisable}
        animationType='fade'
        // transparent={true}
        backdropColor={Colors.transparent}
      >
        <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text style={[styles.text, { fontWeight: 500, fontSize: 18, textAlign: 'center' }]}>
                Are you sure you want to delete '{tank.name}'?
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
                  onPress={() => setModalVisable(false)}
                >
                  <Text 
                    style={[styles.text, { color: Colors.primary, fontWeight: 600 }]}
                  >
                    Comfirm
                  </Text>
                </Pressable>
              </View>
            </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.text, { fontWeight: 700, fontSize: 15 }]}>
            {tank.name}
          </Text>
          <Text style={styles.text}>
            {truncateDescription(tank.description)}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.text, { fontWeight: 600 }]}>
            Last Updated:
          </Text>
          <Text style={styles.text}>
            {new Date(tank.updated_at).toLocaleDateString('en-US')}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default TankCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    borderRadius: 4,
    width: 325,
    height: 145,
    gap: 12
  },
  content: {
    gap: 4,
    borderBottomWidth: 1,
    borderColor: Colors.secondary,
    flex: 1
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16
  },
  text: {
    color: Colors.secondary,
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
  }
})