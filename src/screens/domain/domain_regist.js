import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { BottomNavigation, Text } from 'react-native-paper'
import Main_domain from '../domain/main'
import { ShoppingCart as Shopping_cart_domain } from '../domain/shopping_cart'
import List_domain from '../domain/list'
import { CartContextProvider } from '../../hooks/useCart'

export default function domain_regist({ navigation }) {
  const main = () => <Main_domain />

  const shopping = () => <Shopping_cart_domain />

  const list = () => <List_domain />
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    {
      key: 'Main',
      title: 'Main',
      icon: require('../../assets/Domain_icon/main.png'),
      color: '#3F51B5',
    },
    {
      key: 'Shopping_cart',
      title: 'Shopping Cart',
      icon: require('../../assets/Domain_icon/shopping_cart.png'),
      color: '#009688',
    },
    {
      key: 'List',
      title: 'List',
      icon: require('../../assets/Domain_icon/list.png'),
      color: '#795548',
    },
  ])

  const renderScene = BottomNavigation.SceneMap({
    Main: main,
    Shopping_cart: shopping,
    List: list,
  })

  return (
    <CartContextProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </CartContextProvider>
  )
}
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  regist_part: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  navagate: {
    display: 'flex',
    width: '100%',
    alignSelf: 'flex-end',
  },
})
