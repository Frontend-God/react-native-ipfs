import React, { useEffect, useState, useContext } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
} from 'react-native'
import { Foundation, Entypo, FontAwesome5 } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import * as FileSystem from 'expo-file-system'
import { pinataApiKey, pinataSecretApiKey } from '@env'

import { Domain_Header } from '../../components/Header'
import { Text } from 'react-native-paper'
import { CartContext } from '../../hooks/useCart'
import EthereumQRPlugin from 'ethereum-qr-code'

export default function List({ navigation }) {
  const [cart, setCart] = useContext(CartContext)
  const [domain, setDomain] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalData, setModalData] = useState({})
  const [editName, setName] = useState(modalData.name)
  const [editPrice, setPrice] = useState(modalData.price)
  const [cid, setCid] = useState()

  const handleModal = (data) => {
    let size = 100
    let bgColor = 'black'
    let timestamp = new Date().toString()
    let len = e.id.toString().length
    let id = e.id
    let str = (e.price + '.').toString().replace('J ', '').replace(/,/g, '')

    if (len < 7) {
      for (var i = 0; i < 6 - len; i++) {
        id += '0'
      }
    }
    str += id
    const qr = new EthereumQRPlugin()
    var tmp = qr.toAddressString({
      to: jinAddress,
      value: parseFloat(str) * 1000000000000000000,
      gas: 42000,
    })
    var tmp_ = tmp.replace('&', '%26')
    console.log(tmp_)
    const source = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          </head>
          <body>
            <p class=MsoNormal>This domain is for sale.</p>
            <p class=MsoNormal><span class=GramE>Domain :</span>
          ${data.name}
          </p>
            <p class=MsoNormal><span class=GramE>Price :</span> 
          ${parseInt(editPrice.replace('J ', '').replace(/,/g, ''))}
          </p>
            <p class=MsoNormal>QR code</p>
            <img id='barcode'
              src=
              "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${tmp_}"
              " alt="@qrcode"
              title="QR Code"
              width="150"
              height="150" />
            <p class="MsoNormal"><span class="GramE">Updated on :</span>
          ${timestamp}</p>
          </body>
        </html>`

    let fileUri = FileSystem.documentDirectory + data.id + '.html'
    FileSystem.writeAsStringAsync(fileUri, source, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    request(fileUri, data)
    setIsModalVisible(() => !isModalVisible)
  }

  useEffect(() => {
    if (cart != undefined) setDomain(cart)
  }, [])

  const listDefault = (data) => {
    let temp = [data]
    domain
      .filter((e) => e != data)
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((v) => temp.push(v))
    setDomain(temp)
  }

  const request = async (uri, obj) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
    const formData = new FormData()
    formData.append('file', {
      uri: uri,
      name: obj.id,
      type: 'text/html',
    })
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
    const result = await response.json()
    let temp = {
      id: obj.id,
      name: editName,
      price: editPrice,
      cartState: obj.cartState,
      saleState: obj.saleState,
      Cid: result.IpfsHash,
      PinSize: result.PinSize,
      Timestamp: result.Timestamp,
    }
    setDomain(domain.filter((e) => e != obj))
    setDomain((prev) => [...prev, temp])
    console.log('_________________Changed CID____________________')

    console.log(
      'Changed cid is https://gateway.pinata.cloud/ipfs/' + result.IpfsHash
    )
  }

  return (
    <>
      <Domain_Header>My domains</Domain_Header>
      <ScrollView contentContainerStyle={[styles.main]}>
        {domain.map((data, index) => (
          <View style={styles.form} key={index}>
            <View style={styles.name}>
              <Text style={styles.nameTxt}>{data.name}</Text>
            </View>
            <Text style={styles.price}>{data.price}</Text>

            <View style={styles.priceBatch}>
              {index == 0 ? (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.btnSearch}
                    onPress={() => {
                      setIsModalVisible(() => !isModalVisible)
                      setModalData(data)
                      setName(data.name)
                      setPrice(data.price)
                      setCid(data.Cid)
                    }}
                  >
                    <Foundation
                      name="page-edit"
                      size={10}
                      color="#004af1"
                      style={{ paddingTop: 10, paddingRight: 5 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSearch}>
                    <Entypo name="user" size={24} color="#004af1" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={styles.btnSearch}
                    onPress={() => listDefault(data)}
                  >
                    <FontAwesome5
                      name="user-check"
                      size={8}
                      color="#0133a5"
                      style={{ paddingTop: 10, paddingRight: 5 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSearch}
                    onPress={() => {
                      setIsModalVisible(() => !isModalVisible)
                      setModalData(data)
                      setName(data.name)
                      setPrice(data.price)
                      setCid(data.Cid)
                    }}
                  >
                    <Foundation name="page-edit" size={24} color="#004af1" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal isVisible={isModalVisible}>
        <View style={{ backgroundColor: 'white' }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              marginTop: 20,
              fontWeight: 'bold',
            }}
          >
            Please edit in here
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              fontSize: 20,
            }}
          >
            {cid}
          </Text>
          <TextInput
            style={{ backgroundColor: 'white', height: 50, fontSize: 20 }}
            value={editPrice}
            onChangeText={(text) => setPrice(text)}
            label="Password"
            returnKeyType="done"
            mode="Flat"
            style={styles.modalInput}
          />
          <Button title="OK" onPress={() => handleModal(modalData)} />
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
    padding: 5,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
  },

  btnSearch: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  nameTxt: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  price: {
    width: '30%',
  },

  form: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#b3b2b2',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  btnCart: {
    width: '100%',
    borderRadius: 0,
    padding: 6,
    justifyContent: 'center',
    backgroundColor: '#0f88ff',
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  priceBatch: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  price: {
    color: '#004b95',
    fontWeight: 'bold',
  },
  subtotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  subText: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subValue: {
    padding: 10,
    color: '#0067b7',
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: 'white',
    marginBottom: 10,
    height: 50,
    fontSize: 20,
    paddingHorizontal: 20,
    borderColor: '#d4d4d5',
    borderWidth: 1,
    margin: 20,
  },
})
