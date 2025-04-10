"use client"

import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface CheckoutButtonProps {
  total: number
  disabled?: boolean
}

export function CheckoutButton({ total, disabled = false }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (disabled) return

    try {
      setIsLoading(true)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create checkout session")
      }

      const { checkoutUrl } = await response.json()

      if (checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = checkoutUrl
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      toast.error("Checkout Error", {
        description: error instanceof Error ? error.message : "Failed to process checkout",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || total <= 0 || disabled}
      className="w-full h-12 rounded-full font-bold text-base shadow-md flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all"
    >
      <CreditCard className="h-5 w-5" />
      {isLoading ? "Processing..." : `Proceed to Checkout ${total > 0 ? `($${total.toFixed(2)})` : ""}`}
    </Button>
  )
}
