import React from 'react'
import { Dashboard_Background as Background } from '../components/Background'
import { StyleSheet, View, Image } from 'react-native'
import { Dash_Button as Button } from '../components/Button'
import { Text } from 'react-native-paper'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Text style={styles.title}>Desocial MEDIA</Text>
      <View style={styles.view}>
        <View style={styles.piece}>
          <Image
            source={require('../assets/trading_icon.jpg')}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('PlaceOrder')}
        >
          Trading
        </Button>
      </View>
      <View style={styles.view}>
        <View style={styles.piece}>
          <Image
            source={require('../assets/payment_icon.jpg')}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <Button mode="outlined" onPress={() => navigation.navigate('Signin')}>
          Domain Edit
        </Button>
      </View>
      <View style={styles.view}>
        <View style={styles.piece}>
          <Image
            source={require('../assets/domain_icon.png')}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <Button mode="outlined" onPress={() => navigation.navigate('Signin')}>
          Domain sell and Buy
        </Button>
      </View>
      <View style={styles.view}>
        <View style={styles.piece}>
          <Image
            source={require('../assets/withdraw_icon.png')}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <Button mode="outlined" onPress={() => navigation.navigate('Signin')}>
          Jin Payment
        </Button>
      </View>
      <View style={styles.view_bottom}>
        <View style={styles.piece}>
          <Image
            source={require('../assets/setting_icon.png')}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          Setting
        </Button>
        <Text style={styles.sper}>|</Text>
        <Button mode="outlined" onPress={() => navigation.navigate('Signin')}>
          Log out
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  view: {
    paddingVertical: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  view_bottom: {
    paddingTop: 130,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  piece: {
    backgroundColor: '#ffffff4d',
    borderRadius: 10,
  },
  title: {
    paddingLeft: 20,
    alignSelf: 'flex-start',
    paddingTop: 40,
    paddingBottom: 20,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  sper: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
  },
})
