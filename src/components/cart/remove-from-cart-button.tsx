"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface RemoveFromCartButtonProps {
  id: string
  children: React.ReactNode
}

export function RemoveFromCartButton({ id, children }: RemoveFromCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function removeFromCart() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      router.refresh()
    } catch (error) {
      console.error("Error removing item from cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div onClick={removeFromCart} className={isLoading ? "opacity-50 pointer-events-none" : ""}>
      {children}
    </div>
  )
}

