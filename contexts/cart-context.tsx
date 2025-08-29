"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  salePrice?: number | null
  image: string
  quantity: number
  sku: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ITEMS": {
      const items = action.payload
      return {
        ...state,
        items,
        total: calculateTotal(items),
        itemCount: calculateItemCount(items),
        isLoading: false,
      }
    }

    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id)
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        }
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }

    default:
      return state
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.salePrice || item.price
    return total + price * item.quantity
  }, 0)
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: true,
  })

  useEffect(() => {
    refreshCart()
  }, [])

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        const cartItems = data.items.map((item: any) => ({
          id: item.product_id,
          name: item.products.name,
          brand: item.products.brands?.name || "",
          price: item.products.price,
          salePrice: item.products.sale_price,
          image:
            item.products.product_images?.find((img: any) => img.is_primary)?.url ||
            item.products.product_images?.[0]?.url ||
            "/placeholder.svg",
          quantity: item.quantity,
          sku: item.products.sku,
        }))
        dispatch({ type: "SET_ITEMS", payload: cartItems })
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, quantity: 1 }),
      })

      if (response.ok) {
        dispatch({ type: "ADD_ITEM", payload: item })
        toast({
          title: "Added to Cart",
          description: `${item.brand} ${item.name} has been added to your cart.`,
        })
      } else {
        throw new Error("Failed to add item to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: string) => {
    try {
      const item = state.items.find((item) => item.id === id)
      const response = await fetch(`/api/cart?itemId=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        dispatch({ type: "REMOVE_ITEM", payload: id })
        if (item) {
          toast({
            title: "Removed from Cart",
            description: `${item.brand} ${item.name} has been removed from your cart.`,
          })
        }
      } else {
        throw new Error("Failed to remove item from cart")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, quantity }),
      })

      if (response.ok) {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
      } else {
        throw new Error("Failed to update cart item")
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    try {
      // Clear all items from server
      const deletePromises = state.items.map((item) => fetch(`/api/cart?itemId=${item.id}`, { method: "DELETE" }))
      await Promise.all(deletePromises)

      dispatch({ type: "CLEAR_CART" })
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
