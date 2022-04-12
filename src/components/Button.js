import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'none' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

export function Button1({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button1,
        mode === 'none' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    />
  )
}

export function Dash_Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        mode === 'none' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={dash_styles.text}
      {...props}
    />
  )
}

export function Domain_Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        domain_styles.button,
        mode === 'none' && { backgroundColor: theme.colors.surface },
        style,
      ]}
      labelStyle={domain_styles.text}
      {...props}
    />
  )
}

const domain_styles = StyleSheet.create({
  button: {
    width: '10%',
    color: 'white',
    backgroundColor: '#0a95ff',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
})

const dash_styles = StyleSheet.create({
  button: {
    borderRadius: 3,
    color: 'white',
    marginVertical: 5,
    paddingVertical: 1,
    backgroundColor: '#0a95ff',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 26,
    color: 'white',
  },
})

const styles = StyleSheet.create({
  button: {
    color: 'white',
    width: '100%',
    paddingVertical: 1,
    marginVertical: 10,
    borderRadius: 50,
    backgroundColor: '#1f10c3',
  },

  button1: {
    borderRadius: 3,
    color: 'white',
    marginVertical: 5,
    paddingVertical: 1,
    backgroundColor: '#0a95ff',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 26,
    color: 'white',
  },
  text1: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 'bold',
    fontSize: 9,
    lineHeight: 26,
    color: 'white',
  },
})
