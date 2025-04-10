"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CartItemProps {
  id: string
  courseId: string
  name: string
  price: number
  // quantity: number
  duration?: string
  isEnrolled?: boolean
  onRemove: () => void
}

export function CartItem({
  id,
  courseId,
  name,
  price,
  // quantity,
  duration,
  isEnrolled = false,
  onRemove,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    try {
      setIsRemoving(true)

      const response = await fetch(`/api/cart/remove?cartItemId=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to remove item")
      }

      toast.success(`${name} removed from cart`)
      onRemove()
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item from cart")
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b">
      <div className="flex-1 mb-3 sm:mb-0">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="font-medium">{name}</h3>
            {duration && <p className="text-sm text-muted-foreground">Duration: {duration}</p>}
            <div className="flex items-center mt-2">
              <p className="text-sm text-muted-foreground mr-3">
                ${price.toFixed(2)}
              </p>
              {isEnrolled ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Enrolled
                </Badge>
              ) : (
                <Link href={`/courses/${courseId}`}>
                  <Button
                  size="sm"
                    variant="outline"
                  >
                    Enrollment Required
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        <p className="font-medium">${(price).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  )
}
