import { StyleSheet, View, Text, FlatList, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Param, ParamNode } from '../types'
import { LineChart } from 'react-native-gifted-charts'
import { Colors } from '../constants'
import Button from './Button'

interface Props {
  param: Param,
  addValue: (value: number, param_ulid: string) => Promise<void>
}

const ParamView = ({ param, addValue }: Props) => {
  const [value, setValue] = useState<string | undefined>()
  
  const dateStringOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit'
  }

  const data = param.values.toReversed().map(({ created_at, value }) => {
    const nodeDate = new Date(created_at)
      .toLocaleDateString('en-US', dateStringOptions)
    return { 
      value: Number(value), 
      dataPointText: `${value}`,
      label: `${nodeDate}`
    }
  })

  const onChangeText = (text: string) => {
    // remove non-numeric characters
    const cleansedText = text.replace(/[^0-9]/g, '')
    setValue(cleansedText)
  }

  const row = ({ item }: { item: ParamNode }) => {
    const { created_at, value } = item
    const date = new Date(created_at).toLocaleDateString('en-US')

    return (
      <View style={styles.item}>
        <View style={styles.itemDate}>
          <Text style={{ fontWeight: 500 }}>
            {date}
          </Text>
        </View>
        <View style={styles.itemValue}>
          <Text style={{ fontWeight: 500 }}>{value}</Text>
        </View>
        <View style={styles.itemUnit}>
          <Text style={{ fontWeight: 700 }}>{param.unit}</Text>
        </View>
      </View>
    )}

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
        <View style={styles.table}>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 42, marginVertical: 18, gap: 18 }]}>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              onChangeText={onChangeText}
            />
            <Button onPress={async () => await addValue(Number(value), param.ulid)} disabled={value === undefined}>
              Add Value
            </Button>
          </View>
          <FlatList 
            data={param.values} 
            renderItem={row} 
            keyExtractor={node => node.ulid}
          />
        </View>
      </View>
  )
}

export default ParamView

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1
  },
  title: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 600
  },
  chartContainer: {
  },
  table: {
    flex: 1,
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Colors.border
  },
  item: {
    flexDirection: 'row', 
    gap: 16, 
    borderBottomWidth: 1,
    marginVertical: 4,
    paddingVertical: 6,
    borderColor: Colors.border
  },
  itemDate: {
    width: 75
  },
  itemValue: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  itemUnit: {
    width: 100
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1
  }
})