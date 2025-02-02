import { createContext, useState, useContext, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  const calculateTotal = () => {
    const total = cart.reduce(
      (acc, card) => acc + card.price * card.count,
      0
    )
    setTotal(total)
  }

  useEffect(() => {
    if (!cart) return
    calculateTotal()
  }, [cart])

  const addCard = (card) => {
    const toLowerId = (id) => id.toLowerCase()
    setCart((prevCart) => {
      const exist = prevCart.find((p) => toLowerId(p.id) === toLowerId(card.id))
      if (exist) {
        // aqui va un toast de shadcn

        return prevCart.map((p) =>
          toLowerId(p.id) === toLowerId(card.id)
            ? { ...p, count: p.count + 1 }
            : p
        )
      } else {
        // aqui va un toast de shadcn
        return [...prevCart, { ...card, count: 1 }]
      }
    })
  }

  const cleanCart = () => {
    setCart([])
    setTotal(0)
  }

  return (
    <CartContext.Provider value={{ cart, total, addCard, cleanCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
