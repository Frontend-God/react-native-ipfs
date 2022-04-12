import React, { useEffect, useState, useContext } from 'react'

import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { Domain_Header } from '../../components/Header'
import { Text } from 'react-native-paper'
import { CartContext } from '../../hooks/useCart'
import * as FileSystem from 'expo-file-system'
import { pinataApiKey, pinataSecretApiKey, jinAddress } from '@env'
import EthereumQRPlugin from 'ethereum-qr-code'

export function ShoppingCart({ navigation }) {
  const [cart, setCart] = useContext(CartContext)
  const [domain, setDomain] = useState([])
  const [subTotal, setSubtotal] = useState(0)
  useEffect(() => {
    setCart([])
    if (cart != undefined) setDomain(cart)
  }, [])

  useEffect(() => {
    let sum = 0
    domain.map((data) => {
      let price = data.price
      sum += parseInt(price.replace('J ', '').replace(/,/g, ''))
    })
    setSubtotal(sum)
  }, [domain])

  const domanDelete = (id) => {
    setDomain(domain.filter((data) => data.id != id))
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
    console.log('_________________CID____________________')
    console.log(
      obj.name +
        "'" +
        's cid is https://gateway.pinata.cloud/ipfs/' +
        result.IpfsHash
    )
    await setCart((data) => [
      ...data,
      {
        cartState: obj.cartState,
        id: obj.id,
        name: obj.name,
        price: obj.price,
        saleState: obj.saleState,
        Cid: result.IpfsHash,
        PinSize: result.PinSize,
        Timestamp: result.Timestamp,
      },
    ])
  }

  const payment = async () => {
    let size = 100
    let bgColor = 'black'

    let timestamp = new Date().toString()

    for (let e of domain) {
      // let qr =
      let len = e.id.toString().length
      let id = '00'
      let str = (e.price + '.').toString().replace('J ', '').replace(/,/g, '')
      for (var i = 0; i < 6 - len; i++) {
        id += '0'
      }
      id += e.id
      str += id
      console.log(str)
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
            ${e.name}
            </p>
              <p class=MsoNormal><span class=GramE>Price :</span>
            ${parseInt(e.price.replace('J ', '').replace(/,/g, ''))}
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

      let fileUri = FileSystem.documentDirectory + e.id + '.html'
      FileSystem.writeAsStringAsync(fileUri, source, {
        encoding: FileSystem.EncodingType.UTF8,
      })
      const enc = encodeURIComponent(source)
      await request(fileUri, e)
    }
  }

  return (
    <>
      <Domain_Header>Domain Shopping Cart</Domain_Header>
      <ScrollView contentContainerStyle={[styles.main]}>
        {domain.map((data, index) => (
          <View style={styles.form} key={index}>
            <View style={styles.name}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: 'bold',
                  paddingVertical: 10,
                }}
              >
                {data.name}
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 10 }}>
                {data.saleState}
              </Text>
            </View>

            <View style={styles.priceBatch}>
              <Text style={{ color: '#0067b7' }}>{data.price}</Text>

              <TouchableOpacity
                style={styles.btnSearch}
                onPress={() => {
                  domanDelete(data.id)
                }}
              >
                <AntDesign name="delete" size={14} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.subtotal}>
        <Text style={styles.subText}>Subtotal(JIN)</Text>
        <Text style={styles.subValue}>
          JIN
          {new Intl.NumberFormat('en-US', { style: 'decimal' }).format(
            subTotal
          )}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btnCart}
        onPress={() => {
          Alert.alert(
            'Payment',
            'You have to pay ' + subTotal + 'JIN for this domain.',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  return
                },
                style: 'cancel',
              },
              { text: 'OK', onPress: () => payment() },
            ]
          )
        }}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>Payment</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    borderColor: '#b3b2b2',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '85%',
    marginBottom: 10,
    paddingVertical: 10,
  },

  btnSearch: {
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    width: '50%',
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
})
