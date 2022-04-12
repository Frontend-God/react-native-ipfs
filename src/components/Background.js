import React from 'react'
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Image,
} from 'react-native'

import { theme } from '../core/theme'

export default function Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/bg2.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export function Dashboard_Background({ children }) {
  return (
    <ImageBackground
      source={require('../assets/bg_dash.jpg')}
      resizeMode="cover"
      style={dash_styles.background}
    >
      <KeyboardAvoidingView style={dash_styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export function Trading_Dashbackground({ children }) {
  return (
    <ImageBackground
      source={require('../assets/3.jpg')}
      resizeMode="cover"
      style={dash_styles.background}
    >
      <KeyboardAvoidingView style={dash_styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export function NFT_Dashbackground({ children }) {
  return (
    <ImageBackground
      resizeMode="cover"
      style={dash_styles.background}
      source={require('../assets/Trading_icon/background.png')}
    >
      <KeyboardAvoidingView style={dash_styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const dash_styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
  },
  nft_dash: {
    height: '60%',
    backgroundColor: 'blue',
    borderRadius: 100,
  },
})
