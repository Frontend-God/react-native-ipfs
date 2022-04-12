import React, { useState } from 'react'
import { Trading_Dashbackground as Background } from '../../components/Background'
import { StyleSheet, View, Image } from 'react-native'
import { RadioButton } from 'react-native-paper'

import { Text } from 'react-native-paper'
import Button1 from '../../components/Button'
import BackButton from '../../components/BackButton'

export default function trading_dashboard({ navigation }) {
  const [checked, setChecked] = useState('first')

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.title}>Trading</Text>
      <View style={styles.view}>
        <Image
          source={require('../../assets/Trading_icon/NFT_BTC.png')}
          style={{ width: 100, height: 100, marginLeft: 0 }}
        />
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('first')}
        />
      </View>
      <View style={styles.view}>
        <Image
          source={require('../../assets/Trading_icon/JIN_BTC.png')}
          style={{ width: 100, height: 100, marginLeft: 0 }}
        />
        <RadioButton
          style={styles.radio}
          value="second"
          status={checked === 'second' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('second')}
        />
      </View>

      <Button1
        mode="contained"
        style={{ marginTop: 100 }}
        onPress={() =>
          checked == 'first'
            ? navigation.navigate('Nft_btc')
            : navigation.navigate('Nft_btc')
        }
      >
        Procced
      </Button1>
    </Background>
  )
}

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    alignSelf: 'flex-start',
    paddingTop: 40,
    paddingBottom: 20,
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  radio: {
    width: 100,
    height: 100,
  },
  view: {
    padding: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 20,
    height: '40%',
    color: 'black',
    justifyContent: 'center',
    borderRadius: 200,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'tomato',
  },
  button1: {
    marginLeft: 20,
    height: '40%',
    color: 'black',
    justifyContent: 'center',
    borderRadius: 200,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
  },
})
