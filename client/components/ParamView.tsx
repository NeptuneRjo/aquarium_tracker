import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { Param } from '../types'
import { LineChart } from 'react-native-gifted-charts'
import Colors from '../constants/colors'

interface Props {
  param: Param
}

const ParamView = ({ param }: Props) => {
  const data = param.values.map((paramNode) => {
    const nodeDate = new Date(paramNode.created_at)
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
      })
    return { 
      value: Number(paramNode.value), 
      dataPointText: `${paramNode.value}`,
      label: `${nodeDate}`
    }
  })

  return (
      <View style={styles.container}>
        <Text style={styles.title}>{param.name}</Text>
        <View style={styles.chartContainer}>
          <LineChart 
            data={data}
            color={Colors.accent}
            thickness={3}
            dataPointsColor={Colors.accent}
            focusEnabled={true}
            showDataPointLabelOnFocus={true}
            showTextOnFocus={true}
            showStripOnFocus={true}
            showScrollIndicator={true}
            noOfSections={5}
            adjustToWidth={true}
        />
        </View>
      </View>
  )
}

export default ParamView

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  title: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 600
  },
  chartContainer: {
    // padding:
  }
})