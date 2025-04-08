"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

type Cart2Item = {
  id: string
  courseId: string
  name: string
  price: number
  quantity: number
  duration: string
}

type Cart2ContextType = {
  items: Cart2Item[]
  addToCart2: (courseId: string, name: string, price: number, duration: string) => Promise<void>
  removeFromCart2: (cart2ItemId: string) => Promise<void>
  updateQuantity: (cart2ItemId: string, quantity: number) => Promise<void>
  clearCart2: () => Promise<void>
  isLoading: boolean
  itemCount: number
}

const Cart2Context = createContext<Cart2ContextType | undefined>(undefined)

export function Cart2Provider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Cart2Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  // Fetch cart2 on initial load
  useEffect(() => {
    const fetchCart2 = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cart2")

        if (response.ok) {
          const cart2 = await response.json()
          setItems(cart2.items || [])
          setItemCount(
            cart2.items?.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0) || 0,
          )
        }
      } catch (error) {
        console.error("Error fetching cart2:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart2()
  }, [])

  const addToCart2 = async (courseId: string, name: string, price: number, duration: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add to cart2")
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

  const removeFromCart2 = async (cart2ItemId: string) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart2", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart2ItemId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove item")
      }

      // Update local state
      const itemToRemove = items.find((item) => item.id === cart2ItemId)
      if (itemToRemove) {
        setItemCount((prev) => prev - itemToRemove.quantity)
        setItems((prev) => prev.filter((item) => item.id !== cart2ItemId))
      }

      toast.success("Item removed", {
        description: "Item has been removed from your cart2",
      })
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to remove from cart2",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cart2ItemId: string, quantity: number) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart2ItemId, quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update cart2")
      }

      // Update local state
      const oldItem = items.find((item) => item.id === cart2ItemId)
      const oldQuantity = oldItem?.quantity || 0

      setItems((prev) => prev.map((item) => (item.id === cart2ItemId ? { ...item, quantity } : item)))

      setItemCount((prev) => prev - oldQuantity + quantity)
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to update cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart2 = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/cart2/clear", {
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
    <Cart2Context.Provider
      value={{
        items,
        addToCart2,
        removeFromCart2,
        updateQuantity,
        clearCart2,
        isLoading,
        itemCount,
      }}
    >
      {children}
    </Cart2Context.Provider>
  )
}

export function useCart2() {
  const context = useContext(Cart2Context)
  if (context === undefined) {
    throw new Error("useCart2 must be used within a Cart2Provider")
  }
  return context
}

