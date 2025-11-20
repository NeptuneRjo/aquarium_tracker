import { Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalStyles, Colors } from '../../constants'
import { useUser } from '@clerk/clerk-expo'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Tank } from '../../types'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { Button, ParamView } from '../../components'
import { AppContext } from '../../context'
import { LocalStorage, ParamService, TankService } from '../../services'

interface Route {
  key: string,
  title: string
}

const TankPage = () => {  
  const layout = useWindowDimensions()
  const { user, isSignedIn, isLoaded } = useUser()
  const { id } = useLocalSearchParams()
  const navigation = useRouter()
  const { loading, setLoading, getAndSetTanks } = useContext(AppContext)
  
  const [tank, setTank] = useState<Tank>()
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
    setModalLoading(true)
    TankService.deleteTank(user!.id, tank!.ulid)
      .then(async ({ status, message }) => {
        if (status === 500) {
          setError(message)
          setModalLoading(false)
        }
        await LocalStorage.removeData(`@tank-${tank!.ulid}`)
        await LocalStorage.removeData('@tanks')

        setModalLoading(false)
        setModalVisible(false)
        setTank(undefined)

        await getAndSetTanks()    

        navigation.dismissAll()
        navigation.replace('/')
      })
  }

  const updateTank = async () => {
    if (tank !== undefined) { 
      const item = { name: tankName, description: tankDescription }
      TankService.updateTank(user!.id, tank.ulid, item)
        .then(async ({ data }) => {
          await LocalStorage.removeData('@tanks')
          await LocalStorage.setData(`@tank-${data.ulid}`, data) 
          setTank(data)
          setModalLoading(false)
          setModalVisible(false)
        })
    }
  }


  const handleUpdate = async () => {
    setModalLoading(true)

    updateTank()
      .then(async () => {
        await getAndSetTanks()
        setTankName(undefined)
        setTankDescription(undefined)
      })
  }

  const addValue = async (value: number, param_ulid: string) => {
    setLoading(true)
    ParamService.createParam(user!.id, param_ulid, value)
      .then(async ({ data, status }) => {
          await LocalStorage.setData(`@tank-${data.ulid}`, data) 
          setTank(data)
          setLoading(false)
      })
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
    return <ParamView param={param} addValue={addValue} />
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
        {!modalLoading ? (
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
              <Button variant="primary" onPress={() => handleUpdate()} disabled={ !tankDescription && !tankName ? true : false }>
                Confirm Changes
              </Button>
            </View>
          </View>
        ) : (
          <View style={GlobalStyles.container}>
            <Text>Loading...</Text>
          </View>
        )}
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

export default TankPage

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