import React, { useState, createContext } from 'react'

// Create Context Object
export const CartContext = createContext()

// Create a provider for components to consume and subscribe to changes
export const CartContextProvider = (props) => {
  const [cart, setCart] = useState()

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {props.children}
    </CartContext.Provider>
  )
}
