import { Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import GlobalStyles from '../../constants/styles'
import TankService from '../../services/tankService'
import { useUser } from '@clerk/clerk-expo'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Tank as TankType } from '../../types'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import ParamView from '../../components/ParamView'
import Colors from '../../constants/colors'
import Button from '../../components/Button'
import { AppContext } from '../../context'
import { LocalStorage } from '../../services'

interface Route {
  key: string,
  title: string
}

const Tank = () => {  
  const layout = useWindowDimensions()
  const { user, isSignedIn, isLoaded } = useUser()
  const { id } = useLocalSearchParams()
  const navigation = useRouter()
  const { loading, setLoading } = useContext(AppContext)
  
  const [tank, setTank] = useState<TankType>()
  const [error, setError] = useState<any>()
  const [index, setIndex] = useState(0)
  
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [tankName, setTankName] = useState<string | undefined>()
  const [tankDescription, setTankDescription] = useState<string | undefined>()
  const [modalLoading, setModalLoading] = useState<boolean>(false)

  const getAndSetTank = async () => {
    setLoading(true)
    const storedValue = await LocalStorage.getData(`@tank-${id}`)

    if (storedValue !== null) {
      setTank(storedValue)
    } else {
      TankService.getTank(user!.id, `${id}`)
        .then(async ({ data }) => {
          await LocalStorage.setData(`@tank-${data.ulid}`, data)
          setTank(data)
        })
        .catch((err) => setError(err)) 
    }
    setLoading(false)
  }

  const deleteTank = async () => {
    if (tank !== undefined) {
      setModalLoading(true)
      TankService.deleteTank(user!.id, tank.ulid)
        .then(async () => {
          LocalStorage.removeData(`@tank-${tank.ulid}`)
            .then(async () => {
              await LocalStorage.removeData('@tanks')
              setModalVisible(false)
              navigation.dismissAll()
              navigation.replace('/')
            })
        }).catch((err) => console.log(err))
    }
  }

  const updateTank = async () => {
    if (isSignedIn && tank !== undefined) { 
      setModalLoading(true)
      const item = { name: tankName, description: tankDescription }
      console.log(item)
      TankService.updateTank(user.id, tank.ulid, item)
        .then(async ({ data }) => {
          await LocalStorage.removeData('@tanks')
          await LocalStorage.setData(`@tank-${data.ulid}`, data) 
          setModalVisible(false)
        })
    }
  }
  
  useEffect(() => {
    if (isLoaded) {
      ;(async() => await getAndSetTank())()
    }
  }, [isLoaded, isSignedIn])
  
  if (loading || tank === undefined) {
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
      <Stack.Screen 
        options={{ 
          headerTitle: tank.name,
          headerRight: (props) => (
            <Pressable {...props} onPress={() => setModalVisible(true)}>
              <Text>Edit</Text>
            </Pressable>
          ),
        }} 
      />
      <Modal 
        backdropColor={Colors.secondary} 
        visible={modalVisible} 
        animationType='fade'
      >
        <View style={{ padding: 12, gap: 16, display: 'flex', flex: 1 }}>
          <View style={styles.modalCtrls}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Editing {tank.name}</Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ fontWeight: 'semibold', fontSize: 16 }}>Back</Text>
            </Pressable>
          </View>
          <View style={{ padding: 0, margin: 0, flex: 3, gap: 22 }}>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>New Name:</Text>
              <TextInput 
                value={tankName}
                onChangeText={setTankName}
                style={styles.name}
                placeholder={tank.name}
                maxLength={64}
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>New Description:</Text>
              <TextInput 
                value={tankDescription}
                onChangeText={setTankDescription}
                style={styles.description}
                maxLength={256}
                editable
                multiline
                placeholder={tank.description}
              />
            </View>
          </View>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }]}>
            <Button variant='warn' onPress={() => deleteTank()}>
              Delete Tank
            </Button>
            <Button variant="primary" onPress={() => updateTank()} disabled={ !tankDescription && !tankName ? true : false }>
              Confirm Changes
            </Button>
          </View>
        </View>
      </Modal>
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
  },
  label: {
    // marginHorizontal: 12,
    color: Colors.primary,
    fontSize: 16,
    // marginTop: 12,
    fontWeight: 500
  },
  name: {
    height: 40,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.border
  },
  description: {
    height: 120,
    // margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.border
  },
  modalCtrls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  }
})