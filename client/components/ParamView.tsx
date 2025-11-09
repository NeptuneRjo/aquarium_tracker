import { StyleSheet, View, Text, FlatList } from 'react-native'
import React from 'react'
import { Param, ParamNode } from '../types'
import { LineChart } from 'react-native-gifted-charts'
import { Colors } from '../constants'

interface Props {
  param: Param
}

const ParamView = ({ param }: Props) => {
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

  interface RowProps {
   item: ParamNode 
  }

  const item = ({ item }: RowProps) => (
    <View style={styles.item}>
      <View style={styles.itemDate}>
        <Text style={{ fontWeight: 500 }}>{new Date(item.created_at).toLocaleDateString('en-US')}</Text>
      </View>
      <View style={styles.itemValue}>
        <Text style={{ fontWeight: 500 }}>{item.value}</Text>
      </View>
      <View style={styles.itemUnit}>
        <Text style={{ fontWeight: 700 }}>{param.unit}</Text>
      </View>
    </View>
  )

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
          <FlatList 
            data={param.values} 
            renderItem={item} 
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
  }
})