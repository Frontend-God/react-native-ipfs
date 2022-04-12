import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-paper'
import { theme } from '../core/theme'
import { LinearGradient } from 'expo-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'

export default function Header(props) {
  return <Text style={styles.header} {...props} />
}

export function Domain_Header(props) {
  return (
    <LinearGradient colors={['#17a0fe', '#156afb']} style={styles.view}>
      <Text style={styles.header} {...props} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-start',
    fontSize: 20,
    color: theme.colors.title,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: 'serif',
    textAlign: 'center',
  },
})
