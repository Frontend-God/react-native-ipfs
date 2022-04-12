import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Start_view from '../../components/Start_view'
import BackButton from '../../components/BackButton'
import Orm from 'bigchaindb-orm'

import TextInput from '../../components/TextInput'

import { v5 as uuidv5 } from 'uuid'

// import bip39 from 'react-native-bip39'

export default function Checkphrase(props, { navigation }) {
  const bdbOrm = new Orm('https://test.ipdb.io/api/v1/', {
    app_id: '0x21app',
    app_key: '0x21key',
  })
  const [count, setCount] = useState(3)
  const Ox21_Model = new bdbOrm.driver.Ed25519Keypair()

  bdbOrm.define('Ox21_login', 'https://schema.org/v1/ox21/login')
  const [phrase, setPhrase] = useState({ value: '', error: '' })

  const next = async () => {
    console.log(props.wallet)
    if (!phrase.value) {
      alert('Input your authentication phrase to reset password')
      return
    }
    const temp = phrase.value.replace(/ /g, '-')
    const octets = []

    for (let i = 0; i < 16; i++) {
      octets[i] = parseInt(
        temp.substr(i * (temp.length / 16), temp.length / 16),
        32
      )
      console.log(
        i,
        '=>',
        temp.substr(i * (temp.length / 16), temp.length / 16)
      )
    }

    const wallet = uuidv5('Privacy is the foundation of freedom!', octets)
    console.log(wallet)

    if (props.wallet == wallet) {
      props.setPhraseFlag(true)
    } else {
      if (count < 0) {
        setCount(3)
        navigation.reset({
          index: 0,
          routes: [{ name: 'StartScreen' }],
        })
      } else {
        setCount(count - 1)
        alert('Please check again')
      }
    }

    // console.log('________________Retrieve assets___________________')
    // console.log('wallet == > ', wallet)

    // bdbOrm.models.Ox21_login.retrieve().then((assets) => {
    //   let flag = false
    //   assets.map((asset) => {
    //     if (asset.data.phrase === wallet) {
    //       flag = true
    //     }
    //     return flag
    //   })
    //   console.log(flag)

    // })
  }

  return (
    <>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Text style={styles.title}>Secret Mnemonic Phrase</Text>
      <Start_view>
        <Text style={styles.title1}>Please Input Phrase</Text>
        <TextInput
          mode="Flat"
          label="authentication phrase"
          returnKeyType="done"
          value={phrase.value}
          onChangeText={(text) => setPhrase({ value: text, error: '' })}
          error={!!phrase.error}
          errorText={phrase.error}
        />
        <TouchableOpacity onPress={() => next()} style={styles.logInButton}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              width: '100%',
            }}
          >
            NEXT
          </Text>
        </TouchableOpacity>
      </Start_view>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
  },
  title1: {
    textAlign: 'center',
    fontSize: 15,
    color: 'blue',
    marginBottom: 12,
  },
  logInButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 6,
    marginTop: 10,
    backgroundColor: '#1f10c3',
  },
})
