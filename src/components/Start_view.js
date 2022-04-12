import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

export default function Start_view(props) {
  return <View style={styles.view} {...props} />
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    padding: 30,
    paddingVertical: 50,
    borderRadius: 20,
    backgroundColor: 'white',
    width: '90%',
    color: 'white',
    marginHorizontal: 0,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
})
