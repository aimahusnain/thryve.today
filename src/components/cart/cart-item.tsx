"use client"

import { RemoveFromCartButton } from "@/components/cart/remove-from-cart-button"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CartItemProps {
  id: string
  name: string
  price: number
  duration: string
  isEnrolled?: boolean
}

export function CartItem({ id, name, price, duration, isEnrolled = false }: CartItemProps) {
  return (
    <div className="p-6 flex flex-col sm:flex-row gap-4 group hover:bg-muted/50 transition-colors">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-2xl line-clamp-2">{name}</h3>
          <div className="font-bold text-lg">${price.toFixed(2)}</div>
        </div>

        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 py-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Enrolled</span>
              </Badge>
            ) : (
              <Link href={`/courses/${id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Complete Enrollment</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Use the RemoveFromCartButton component */}
          <RemoveFromCartButton id={id}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Remove</span>
            </Button>
          </RemoveFromCartButton>
        </div>
      </div>
    </div>
  )
}
