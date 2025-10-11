import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyles from '../../constants/styles'
import TankService from '../../services/tankService'
import { useUser } from '@clerk/clerk-expo'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Tank as TankType } from '../../types'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import ParamView from '../../components/ParamView'
import Colors from '../../constants/colors'
import TankStorage from '../../services/tankStorage'

interface Route {
  key: string,
  title: string
}

const Tank = () => {  
  const layout = useWindowDimensions()
  const { user, isSignedIn, isLoaded: clerkIsLoaded } = useUser()
  const { id } = useLocalSearchParams()
  
  const [tank, setTank] = useState<TankType>()
  const [error, setError] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const [index, setIndex] = React.useState(0)
  
  const getAndSetTank = async () => {
    if (isSignedIn) {
      const jsonValue = await TankStorage.getTank(id as string)

      if (jsonValue !== null) {
        setTank(JSON.parse(jsonValue))
      } else {
        TankService.getTank(user.id, id as string)
        .then(async ({ data }) => {
          await TankStorage.storeTank(data)
          setTank(data)
        })
        .catch((err) => setError(err)) 
      }
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    if (clerkIsLoaded) {
      ;(async() => await getAndSetTank())()
    }
  }, [clerkIsLoaded, isSignedIn])
  
  if (isLoading || tank === undefined) {
    return (
      <View style={GlobalStyles.container}>
        <Stack.Screen options={{ headerTitle: 'Loading...' }} />
        <Text>Loading...</Text>
      </View>
    )
  }

  const renderScene = ({ route }: { route: Route }) => {
    const param = tank.params.find((item) => item.name === route.key)!
    return <ParamView param={param} />
  }
  
  const routes: Route[] = tank.params.map((param) => {
    return { key: param.name, title: param.name }
  })

  return (
    <>
      <Stack.Screen options={{ headerTitle: tank.name }} />
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
    </>
  )
}

export default Tank

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.accent,
    color: Colors.secondary,
    width: 'auto',
    paddingVertical: 6,
    elevation: 0,
    borderTopWidth: 0,
    shadowOpacity: 0
  },
  tabView: {
    margin: 16,
    marginRight: 27,
  }
})