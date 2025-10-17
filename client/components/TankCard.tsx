import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tanks } from '../types'
import Colors from '../constants/colors'

interface Props {
  tank: Tanks
}

const TankCard = ({ tank }: Props) => {  
  const maxDescriptionLength = 124

  const truncateDescription = (description: string): string => {
    if (description.length > maxDescriptionLength) {
      return description.substring(0, maxDescriptionLength) + '...'
    }
    return description
  }

  return (
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
})