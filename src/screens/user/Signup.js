import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import Start_view from '../../components/Start_view'
import { hashString } from 'react-hash-string'
import '@ethersproject/shims'
import { v5 as uuidv5 } from 'uuid'
import { passwordValidator } from '../../helpers/passwordValidator'
import { rePasswordValidator } from '../../helpers/passwordValidator'
import bip39 from 'bip39'
import Orm from 'bigchaindb-orm'
import Checkphrase from './Checkphrase'

export default function Signup({ navigation }) {
  const [storedPhrase, setStoredPhrase] = useState()
  const [password, setPassword] = useState({ value: '', error: '' })
  const [rePassword, setRePassword] = useState({ value: '', error: '' })
  const [show_pass, Setshow] = useState(true)
  const [phraseFlag, setPhraseFlag] = useState(false)
  const [wallet, setWallet] = useState()
  const bdbOrm = new Orm('http://ox21.xyz/api/v1/', {
    app_id: '0x21app',
    app_key: '0x21key',
  })

  const Ox21_Model = new bdbOrm.driver.Ed25519Keypair()

  bdbOrm.define('Ox21_login', 'https://schema.org/v1/ox21/login')
  const mnemonic = bip39.generateMnemonic()
  useEffect(async () => {
    await setStoredPhrase(mnemonic)
    console.log(mnemonic)
  }, [])

  const next = async () => {
    const replacedMnemonic = storedPhrase.replace(/ /g, '-')
    const octets = []

    for (let i = 0; i < 16; i++) {
      octets[i] = parseInt(
        replacedMnemonic.substr(
          i * (replacedMnemonic.length / 16),
          replacedMnemonic.length / 16
        ),
        32
      )
    }
    setWallet(uuidv5('Privacy is the foundation of freedom!', octets))
    Setshow(false)
  }

  const onSignUpPressed = async () => {
    //Section wallet_____________________
    console.log(storedPhrase)

    const passwordError = passwordValidator(password.value)
    const rePasswordError = rePasswordValidator(rePassword.value)
    if (passwordError || rePasswordError) {
      setPassword({ ...password, error: passwordError })
      setRePassword({ ...rePassword, error: rePasswordError })
      return
    }
    if (password.value !== rePassword.value) {
      alert('The password confirmation does not match')
      setPassword({ ...password, error: '' })
      setRePassword({ value: '', error: '' })
      return
    }

    const pass = hashString(password.value).toString()

    console.log('________________Create an asset___________________')

    let pass_flag = false

    await bdbOrm.models.Ox21_login.retrieve().then((assets) => {
      // assets is an array of myModel

      if (assets[0] == undefined) {
        pass_flag = true
      }
      assets.map((asset) => {
        console.log(asset)

        if (asset.data.password != pass) {
          pass_flag = true
        }
      })
    })

    if (pass_flag) {
      try {
        bdbOrm.models.Ox21_login.create({
          keypair: Ox21_Model,
          data: { password: pass, phrase: wallet },
        }).then((asset) => {
          console.log('Succefully created Account => ', asset.data)
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        })
      } catch (err) {
        console.log(err)
      }
    } else {
      alert('Please input again.Already exit the password')
    }
  }

  return (
    <Background>
      {show_pass ? (
        <>
          <Header>Secret Mnemonic </Header>
          <Start_view>
            <Text style={styles.title1}>Please Write down</Text>

            <View style={styles.phrase}>
              <Text style={styles.mnemonic}>{storedPhrase}</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => next()}
                  style={styles.logInButton}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      width: '100%',
                    }}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Start_view>
        </>
      ) : phraseFlag ? (
        <>
          {/* <BackButton goBack={navigation.goBack} /> */}
          <Header>Welcome To 0X21</Header>
          <Start_view>
            <Text style={styles.title}>Create Wallet</Text>
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
            <TextInput
              label="Confirm password"
              returnKeyType="done"
              value={rePassword.value}
              onChangeText={(text) => setRePassword({ value: text, error: '' })}
              error={!!rePassword.error}
              errorText={rePassword.error}
              secureTextEntry
              style={styles.passtext}
              mode="Flat"
            />
            <Button
              mode="contained"
              onPress={onSignUpPressed}
              style={{ marginTop: 24 }}
            >
              CREATE
            </Button>
          </Start_view>
        </>
      ) : (
        <Checkphrase
          setPhraseFlag={setPhraseFlag}
          type={'regist'}
          wallet={wallet}
        />
      )}
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: '#655adb',
  },
  loading: {
    width: 20,
  },
  passtext: {
    borderBottomColor: '#d4d4d5',
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
    // alignItems: "flex-end",
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 6,
    marginTop: 10,
    backgroundColor: '#1f10c3',
  },
  hidden: {
    display: 'none',
  },
})
