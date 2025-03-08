"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

type CartItem = {
  id: string
  courseId: string
  name: string
  price: number
  quantity: number
  duration: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (courseId: string, name: string, price: number, duration: string) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  // Fetch cart on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cart")

        if (response.ok) {
          const cart = await response.json()
          setItems(cart.items || [])
          setItemCount(cart.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0)
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (courseId: string, name: string, price: number, duration: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add to cart")
      }

      const newItem = await response.json()

      // Update local state
      setItems((prev) => {
        const existingItemIndex = prev.findIndex((item) => item.courseId === courseId)

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prev]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          }
          return updatedItems
        } else {
          // Add new item
          return [
            ...prev,
            {
              id: newItem.id,
              courseId,
              name,
              price,
              quantity: 1,
              duration,
            },
          ]
        }
      })

      setItemCount((prev) => prev + 1)

      toast.success("Added to cart", {
        description: "Course has been added to your cart",
      })
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to add to cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove item")
      }

      // Update local state
      const itemToRemove = items.find((item) => item.id === cartItemId)
      if (itemToRemove) {
        setItemCount((prev) => prev - itemToRemove.quantity)
        setItems((prev) => prev.filter((item) => item.id !== cartItemId))
      }

      toast.success("Item removed", {
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to remove item",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId, quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update cart")
      }

      // Update local state
      const oldItem = items.find((item) => item.id === cartItemId)
      const oldQuantity = oldItem?.quantity || 0

      setItems((prev) => prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item)))

      setItemCount((prev) => prev - oldQuantity + quantity)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart/clear", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to clear cart")
      }

      // Update local state
      setItems([])
      setItemCount(0)

      toast.success("Cart cleared", {
        description: "Your cart has been cleared",
      })
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to clear cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

