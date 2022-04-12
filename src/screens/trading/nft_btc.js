import React, { useState } from 'react'
import { NFT_Dashbackground as Background } from '../../components/Background'
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Button,
  Alert,
  Modal,
  Pressable,
} from 'react-native'
import { Text } from 'react-native-paper'
import { LinearGradient } from 'expo-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'

export default function Nft_btc({ navigation }) {
  const [nft_list, setNFT_List] = useState([
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/16.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/17.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
  ])

  const [buy_list, setBuy_list] = useState([
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/1.png'),
      title: 'Make1',
      price: 0.001,
      decription: 'black',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/2.png'),
      title: 'Make2',
      price: 0.001,
      decription: 'gray',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/3.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/4.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/5.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/6.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/7.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/8.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/9.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/11.png'),
      title: 'Make3',
      price: 0.001,
      decription:
        'purplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurplepurple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/12.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/13.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/14.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
    {
      country: '123',
      province: '',
      city: '',
      page_number: '',
      image: require('../../assets/NFT_IMG/15.png'),
      title: 'Make3',
      price: 0.001,
      decription: 'purple',
    },
  ])

  const show_modal = (decription) => {
    setModalVisible(true)
    setDescription(decription)
  }

  const [modalVisible, setModalVisible] = useState(false)
  const [description, setDescription] = useState('')
  const [value, setValue] = useState({
    country: false,
    province: false,
    city: false,
    channel: false,
    page_number: false,
  })
  const [filter, setFilter] = useState('country')
  const [flag, setFlag] = useState(true)
  const [modal_data, setModaldata] = useState({})
  const list = flag == true ? nft_list : buy_list

  const setSelect = (param) => {
    setValue({ param: true })
    setFilter(param)
  }

  const confirm_inform = (user) => {
    setModalVisible(true)
    setModaldata(user)
  }

  const confirmed_modal = (user) => {
    const data_remove = flag ? nft_list : buy_list
    const arr_remove = data_remove.filter((item) => item.image !== user)
    const move_item = data_remove.filter((item) => item.image === user)[0]
    if (flag) {
      setNFT_List(arr_remove)
      const temp_Buy_list = buy_list
      temp_Buy_list.push(move_item)
      setBuy_list(temp_Buy_list)
    } else {
      setBuy_list(arr_remove)
      const temp_NFT_list = nft_list
      temp_NFT_list.push(move_item)
      setNFT_List(temp_NFT_list)
    }
    setModalVisible(!modalVisible)
  }
  return (
    <Background>
      <View style={styles.main}>
        <Text style={styles.title}>BTC and NFT trading</Text>
        <LinearGradient colors={['#17a0fe', '#156afb']} style={styles.view}>
          <RNPickerSelect
            onValueChange={(value) => setSelect(value)}
            items={[
              { label: 'country', value: 'country' },
              { label: 'province', value: 'province' },
              { label: 'channel ', value: 'channel' },
              { label: 'page_number ', value: 'page_number' },
            ]}
          />
        </LinearGradient>

        <ScrollView style={styles.nft_list}>
          {list
            .filter((user) => user[filter] !== '' && user[filter] !== undefined)
            .map((user) => (
              <View style={styles.list} key={user.image}>
                <Image source={user.image} style={{ width: 40, height: 35 }} />
                <Text style={styles.item}>{user.price}</Text>
                <Text style={styles.item}>{user.title}</Text>
                {flag == true ? (
                  <Pressable
                    style={styles.button}
                    onPress={() => confirm_inform(user)}
                  >
                    <Text
                      style={{ marginTop: 8, fontSize: 12, color: 'white' }}
                    >
                      Sale
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.button}
                    onPress={() => confirm_inform(user)}
                  >
                    <Text
                      style={{ marginTop: 8, fontSize: 12, color: 'white' }}
                    >
                      Buy
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
        </ScrollView>
        <View style={styles.buy_more}>
          <LinearGradient
            // Button Linear Gradient
            colors={['#156afb', '#ffffff']}
          >
            {flag ? (
              <Button
                onPress={() => setFlag(false)}
                title="Buy More NFT"
                accessibilityLabel="Learn more about this purple button"
              />
            ) : (
              <Button
                onPress={() => setFlag(true)}
                title="My NFT list"
                accessibilityLabel="Learn more about this purple button"
              />
            )}
          </LinearGradient>
        </View>
      </View>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.')
            setModalVisible(!modalVisible)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modal_data.price}</Text>
              <Image
                source={modal_data.image}
                style={{ width: 100, height: 100 }}
              />
              <Text style={styles.modalText}>{modal_data.decription}</Text>
              <View style={styles.modal}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => confirmed_modal(modal_data.image)}
                >
                  <Text style={styles.textStyle}>O K</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 600,
  },
  title: {
    color: 'white',
    marginTop: 50,
    marginBottom: 30,
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
  },
  price: {
    display: 'flex',
    alignItems: 'center',
  },
  view: {
    height: 50,
    borderRadius: 7,
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
  },
  _view: {
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
  },
  price_text: {
    marginLeft: 20,
    alignSelf: 'center',
    fontSize: 30,
    color: 'white',
  },
  price_btc: {
    marginLeft: 20,
    alignSelf: 'center',
    fontSize: 30,
    color: 'white',
  },
  nft_title: {
    fontSize: 40,
  },
  nft_list: {
    display: 'flex',
    flexDirection: 'column',
    height: 400,
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    borderColor: 'white',
    borderBottomColor: '#dcd6cf',
    borderWidth: 2,
    height: 40,
  },
  item: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontWeight: 'bold',
    width: 100,
  },
  img: {
    width: 100,
    height: 100,
  },
  button: {
    margin: 2,
    paddingHorizontal: 15,
    marginBottom: 1,
    backgroundColor: '#0a95ff',
    borderWidth: 0.7,
    borderColor: '#6cbfff',
    borderRadius: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 200,
  },

  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modal: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
})
