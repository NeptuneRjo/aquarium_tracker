import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyles from '../../constants/styles'
import TankService from '../../services/tankService'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'
import { Tank as TankType } from '../../types'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import ParamView from '../../components/ParamView'
import Colors from '../../constants/colors'

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
    ;(async() => await getAndSetTank(user!.id, id as string))()
  }, [])
  
  if (isLoading || tank === undefined) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const renderScene = ({ route }: { route: Route }) => {
    const param = tank!.params.find((item) => item.name === route.key)!
    return <ParamView param={param} />
  }
  
  const routes: Route[] = tank.params.map((param) => {
    return { key: param.name, title: param.name }
  })

  return (
    <TabView 
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
      renderTabBar={props => 
        <TabBar 
          {...props} 
          style={styles.tabBar}
          activeColor='#FFFFFF'
          inactiveColor={Colors.secondary}
          tabStyle={styles.tabBar}
          indicatorStyle={styles.tabBar}
        />
      }
      pagerStyle={styles.tabView}
    />
  )
}

export default Tank

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.accent,
    color: Colors.secondary,
  },
  tabView: {
    margin: 16,
    marginRight: 27
  }
})