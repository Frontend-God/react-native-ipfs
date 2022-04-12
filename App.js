import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import 'react-native-get-random-values'
import '@ethersproject/shims/dist/index'
import './global.js'
import 'react-native-gesture-handler'
import unorm from 'unorm'
import { registerRootComponent } from 'expo'

String.prototype.normalize = function (form) {
  var func = unorm[(form || 'NFC').toLowerCase()]
  if (!func) {
    throw new RangeError('invalid form - ' + form)
  }
  return func(this)
}

import { theme } from './src/core/theme'
import {
  StartScreen,
  Signin,
  Signup,
  Dashboard,
  Recover,
  Domain_Regist,
} from './src/screens'

import { Provider as ReduxProvider } from 'react-redux'
import store from './store'

const Stack = createStackNavigator()

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Recover" component={Recover} />

            <Stack.Screen name="Domain_Regist" component={Domain_Regist} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ReduxProvider>
  )
}
