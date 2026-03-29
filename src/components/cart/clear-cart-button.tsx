"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ClearCartButtonProps {
  onClearCart?: () => void
  disabled?: boolean
}

export function ClearCartButton({ onClearCart = () => {}, disabled = false }: ClearCartButtonProps) {
  const [isClearing, setIsClearing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleClearCart = async () => {
    try {
      setIsClearing(true)

      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      })
      
      // Handle authentication issues
      if (response.status === 401) {
        window.location.href = "/log-in?callbackUrl=/cart"
        return
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to clear cart")
      }

      toast.success("Cart cleared successfully")
      onClearCart()
      setIsOpen(false)
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Failed to clear cart")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500  hover:bg-red-50 hover:text-red-600"
          disabled={disabled || isClearing}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all items from your cart and delete all associated enrollment forms. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleClearCart()
            }}
            disabled={isClearing}
            className="bg-red-500 hover:bg-red-600"
          >
            {isClearing ? "Clearing..." : "Clear Cart"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}