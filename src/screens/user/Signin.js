import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { passwordValidator } from '../../helpers/passwordValidator'
import Start_view from '../../components/Start_view'
import { hashString } from 'react-hash-string'
import Orm from 'bigchaindb-orm'

export default function Signin({ navigation }) {
  const bdbOrm = new Orm('https://test.ipdb.io/api/v1/', {
    app_id: '0x21app',
    app_key: '0x21key',
  })

  bdbOrm.define('Ox21_login', 'https://schema.org/v1/ox21/login')

  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = async () => {
    const passwordError = passwordValidator(password.value)
    if (passwordError) {
      setPassword({ ...password, error: passwordError })
      return
    }

    const pass = hashString(password.value).toString()

    let pass_flag = false

    await bdbOrm.models.Ox21_login.retrieve().then((assets) => {
      assets.map((asset) => {
        if (asset.data.password == pass) {
          pass_flag = true
        }
      })
    })

    if (pass_flag) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Domain_Regist' }],
      })
    } else {
      alert('Please check your Password')
    }
  }

  return (
    <Background>
      <Header>Welcome To 0X21</Header>
      <Start_view>
        <Text style={styles.title}>Login Account</Text>
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          style={styles.passtext}
          mode="Flat"
        />
        <></>
        <Button mode="contained" onPress={onLoginPressed}>
          UNLOCK
        </Button>
        <View style={styles.row}>
          <Text>Don’t have an wallet? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Signup')}>
            <Text style={styles.link}> Create wallet</Text>
          </TouchableOpacity>
        </View>
      </Start_view>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: '#655adb',
  },
  link: {
    fontWeight: 'bold',
    color: '#655adb',
  },
  passtext: {
    borderBottomColor: '#d4d4d5',
    borderBottomWidth: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
