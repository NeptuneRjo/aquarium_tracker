import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyles from '../../constants/styles'
import TankService from '../../services/tankService'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'
import { Tank as TankType } from '../../types'
import { SceneMap, TabView } from 'react-native-tab-view'
import Param from '../../components/Param'

interface Route {
  key: string,
  title: string
}

const Tank = () => {  
  const layout = useWindowDimensions()
  const { user, isSignedIn } = useUser()
  const { id } = useLocalSearchParams()
  
  const [tank, setTank] = useState<TankType>()
  const [error, setError] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const [index, setIndex] = React.useState(0)
  
  const getAndSetTank = async (clerk_id: string, tank_ulid: string) => {
    TankService.getTank(clerk_id, tank_ulid)
    .then((res) => {
      setTank(res.data)
      setIsLoading(false)
    })
    .catch((err) => setError(err))
  }
  
  useEffect(() => {
    ;(async() => getAndSetTank(user!.id, id as string))()
  }, [])
  
  const renderScene = ({ route }: { route: Route }) => {
    const param = tank!.params.find((item) => item.name === route.key)!
    return <Param param={param} />
  }
  
  let routes: Route[] = []
  const createRoutes = () => {
    if (tank !== undefined) {
      tank.params.map((param) => routes.push({ key: param.name, title: param.name }))
    }
  }
  createRoutes()

  if (isLoading || tank === undefined) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <TabView 
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
    />
  )
}

export default Tank

const styles = StyleSheet.create({})