import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Start_view from '../../components/Start_view'
import Orm from 'bigchaindb-orm'

import TextInput from '../../components/TextInput'

import { v5 as uuidv5 } from 'uuid'
import { passwordValidator } from '../../helpers/passwordValidator'
import { hashString } from 'react-hash-string'

export default function Recover({ navigation }) {
  const bdbOrm = new Orm('https://test.ipdb.io/api/v1/', {
    app_id: '0x21app',
    app_key: '0x21key',
  })
  const Ox21_Model = new bdbOrm.driver.Ed25519Keypair()

  bdbOrm.define('Ox21_login', 'https://schema.org/v1/ox21/login')
  const [phrase, setPhrase] = useState({ value: '', error: '' })
  const [show_pass, Setshow] = useState(true)
  const [password, setPassword] = useState({ value: '', error: '' })
  const [wallet, setWallet] = useState()

  const next = () => {
    if (!phrase.value) {
      alert('Input your authentication phrase to reset password')
      return
    }
    const temp = phrase.value.replace(/ /g, '-')
    // console.log(temp)
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
    console.log('________________Retrieve assets___________________')
    console.log('wallet == > ', wallet)

    bdbOrm.models.Ox21_login.retrieve().then((assets) => {
      let flag = false
      assets.map((asset) => {
        if (asset.data.phrase === wallet) {
          flag = true
        }
        return flag
      })
      console.log(flag)
      if (flag) {
        Setshow(false)
        setWallet(wallet)
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Signup' }],
        })
      }
    })
  }

  const onSignUpPressed = async () => {
    //Section wallet_____________________
    const passwordError = passwordValidator(password.value)
    console.log(passwordError)
    if (passwordError) {
      setPassword({ ...password, error: passwordError })
      return
    }

    const pass = hashString(password.value).toString()
    console.log('pass ==>', pass)
    let flag = false

    bdbOrm.models.Ox21_login.create({
      keypair: Ox21_Model,
      data: { password: pass, phrase: wallet },
    })
      .then((asset) => {
        return asset.append({
          toPublicKey: Ox21_Model.publicKey,
          keypair: Ox21_Model,
          data: { password: pass, phrase: wallet },
        })
      })
      .then((updatedAsset) => {
        console.log(updatedAsset.data)
        navigation.reset({
          index: 0,
          routes: [{ name: 'StartScreen' }],
        })
      })
  }

  return (
    <Background>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Text style={styles.title}>Secret Mnemonic Phrase</Text>
      <Start_view>
        {show_pass ? (
          <>
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
          </>
        ) : (
          <>
            <Text style={styles.rest_text}>Please Input Password</Text>
            <TextInput
              label="New password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              style={styles.passtext}
              mode="Flat"
            />
            <View style={styles.phrase}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => onSignUpPressed()}
                  style={styles.logInButton}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      width: '100%',
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Start_view>
    </Background>
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
    fontSize: 20,
    color: 'blue',
    marginBottom: 12,
  },
  warning: {
    color: 'blue',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  phrase: {
    marginTop: 12,
  },
  mnemonic: {
    textAlign: 'center',
    backgroundColor: '#0c1947',
    padding: 12,
    marginTop: 5,
    color: 'white',
  },
  copy_button: {
    marginTop: 18,
    borderWidth: 1,
    width: '80%',
    marginLeft: '10%',
    textAlign: 'center',
    padding: 5,
    borderRadius: 10,
  },
  copiedText: {
    textAlign: 'center',
    marginTop: 6,
  },
  copiedTextView: {
    width: '40%',
    // alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
    backgroundColor: '#404040',
    borderColor: '#404040',
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
  row: {
    flexDirection: 'column',
  },
  hidden: {
    display: 'none',
  },
})
