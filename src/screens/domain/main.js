import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Domain_Header } from '../../components/Header'
import { Text } from 'react-native-paper'
import { FontAwesome } from '@expo/vector-icons'
import { CartContext } from '../../hooks/useCart'
import { searchValidator, domainValidator } from '../../helpers/domainValidator'
import 'intl'
import 'intl/locale-data/jsonp/en'
export default function Main({ navigation }) {
  const [cart, setCart] = useContext(CartContext)
  const [addButton, setAddbutton] = useState(false)
  const [domain, setDomain] = useState([
    {
      id: '1',
      name: 'kkm.com',
      price: 'J 8',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '2',
      name: 'ohk.com',
      price: 'J 10',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '3',
      name: 'oip.com',
      price: 'J 30',
      cartState: false,
      saleState: 'NotUse',
    },
    {
      id: '4',
      name: 'poi.com',
      price: 'J 100',
      cartState: false,
      saleState: 'Sale',
    },
    {
      id: '5',
      name: 'hover.com',
      price: 'J 102',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '6',
      name: 'freelancer.com',
      price: 'J 200',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '7',
      name: 'upwork.com',
      price: 'J 0',
      cartState: false,
      saleState: 'NotUse',
    },
    {
      id: '8',
      name: 'upwork1.com',
      price: 'J 83',
      cartState: false,
      saleState: 'Sale',
    },
    {
      id: '9',
      name: 'upwork2.com',
      price: 'J 20',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '10',
      name: 'upwork3.com',
      price: 'J 30',
      cartState: false,
      saleState: 'New',
    },
    {
      id: '11',
      name: 'upwork4.com',
      price: 'J 50',
      cartState: false,
      saleState: 'New',
    },
  ])
  const [tempDomain, setTempDomain] = useState([])
  const [searchDomain, setSearchDomain] = useState({ value: '', state: false })
  const [domainToCart, setDomainToCart] = useState([])
  const [jinCost, setJincost] = useState([
    { len: 1, Cost: 10000000000 },
    { len: 2, Cost: 100000000 },
    { len: 3, Cost: 1000000 },
    { len: 4, Cost: 100000 },
    { len: 5, Cost: 100 },
    { len: 6, Cost: 1 },
  ])
  const [maxLen, setLength] = useState(0)

  useEffect(() => {
    setTempDomain(domain)
    setLength(domain.length)
  }, [])

  const updateDomain = (id, state) => {
    let domains = [...domain]
    for (let i = 0; i < domains.length; i++) {
      if (domains[i].id == id) {
        state
          ? setDomainToCart(domainToCart.filter((data) => data.id !== id))
          : setDomainToCart((data) => [...data, domains[i]])
        domains[i].cartState = !domains[i].cartState
      }
    }
    setDomain(domains)
  }

  const onSearch = () => {
    const exitValidator = searchValidator(searchDomain.value)
    if (exitValidator) return alert(exitValidator)
    const Validator = domainValidator(searchDomain.value)
    if (Validator) return alert(Validator)

    if (searchDomain.value) {
      let searchDomains = []
      let domains = tempDomain
      searchDomains = domains.filter((domainItem) =>
        domainItem.name.includes(searchDomain.value)
      )

      let cost = 0
      searchDomain.value.length < 7
        ? (cost = jinCost.filter((e) => e.len === searchDomain.value.length)[0]
            .Cost)
        : (cost = 1)

      if (searchDomains.length == 0) {
        let newDomain = {
          id: (maxLen + 1).toString(),
          name: searchDomain.value,

          price:
            'J ' +
            new Intl.NumberFormat('en-US', { style: 'decimal' }).format(cost),
          cartState: false,
          saleState: 'New',
        }

        setDomain([newDomain])
        return newDomain
      } else {
        setDomain(searchDomains)
        return
      }
    }
  }

  const addCart = () => {
    if (!searchDomain.state) {
      alert('Please select the Domain')
      return
    }

    if (domainToCart[0]) {
      setCart(domainToCart)
      setAddbutton(true)
      alert('Successfully')
      return
    }
    alert('No Selected the Domain')
  }

  return (
    <>
      <Domain_Header>Domain Search</Domain_Header>
      <View style={styles.main}>
        <View style={styles.searchForm}>
          <TextInput
            style={styles.search}
            returnKeyType="done"
            onChangeText={(text) =>
              setSearchDomain({ value: text, state: false })
            }
            error={!!searchDomain.error}
            errorText={searchDomain.error}
            mode="Flat"
          />

          <TouchableOpacity
            style={styles.btnSearch}
            onPress={() => {
              setSearchDomain({ value: searchDomain.value, state: true })
              onSearch()
            }}
          >
            <FontAwesome name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.btnCart}
          disabled={addButton}
          onPress={() => addCart()}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>Add to Cart</Text>
        </TouchableOpacity>
        <View style={styles.listForm}>
          {searchDomain.value && searchDomain.state ? (
            domain
              .filter((filter) => filter.name.includes(searchDomain.value))
              .map((data) => (
                <View key={data.id} style={styles.list}>
                  <View style={styles.domain}>
                    <Text>{data.name}</Text>
                  </View>
                  <Text style={{ alignSelf: 'center' }}>{data.price}</Text>
                  <TouchableOpacity
                    style={styles.putCart}
                    onPress={() => updateDomain(data.id, data.cartState)}
                  >
                    {data.cartState && data.saleState != 'NotUse' ? (
                      <FontAwesome name="check" size={24} color="black" />
                    ) : data.saleState == 'NotUse' ? (
                      <Text style={{ fontSize: 10, textAlign: 'center' }}>
                        Not Available
                      </Text>
                    ) : (
                      <FontAwesome name="cart-plus" size={24} color="black" />
                    )}
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <></>
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  searchForm: {
    flexDirection: 'row',
    width: '100%',
  },
  search: {
    width: '80%',
    height: '70%',
    borderColor: '#d4dbe0',
    borderWidth: 1,
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
  },
  btnSearch: {
    width: '20%',
    height: '70%',
    borderRadius: 0,
    backgroundColor: 'black',
    padding: 6,
    alignItems: 'center',
  },
  btnCart: {
    justifyContent: 'center',
    marginLeft: '1%',
    width: '100%',
    borderRadius: 0,
    padding: 6,
    alignItems: 'center',
    backgroundColor: '#0f88ff',
    display: 'flex',
    flexDirection: 'row',
  },
  listForm: {
    display: 'flex',
  },
  list: {
    borderBottomColor: '#d4dbe0',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  domain: {
    alignItems: 'center',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
  },
  putCart: {
    marginLeft: 3,
    width: '20%',
    borderRadius: 0,
    padding: 6,
    alignItems: 'center',
    height: '100%',
    borderRadius: 0,
  },
  unique: {
    padding: 20,
    borderBottomColor: '#d4dbe0',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
})
