"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CartIcon() {
  const [itemCount, setItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/cart")

        if (!response.ok) {
          // If not authenticated or other error, just set count to 0
          setItemCount(0)
          return
        }

        const cart = await response.json()
        const count = cart.items?.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0) || 0;
        setItemCount(count)
      } catch (error) {
        console.log(error)
        // Silently fail and set count to 0
        setItemCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartCount()
  }, [])

  return (
    <Link href="/cart">
      <Button variant="ghost" className="relative p-2" disabled={isLoading}>
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

