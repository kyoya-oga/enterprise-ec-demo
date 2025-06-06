export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
}

export interface CartActions {
  addItem: (productId: number, quantity?: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
}