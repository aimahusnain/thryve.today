import Image from "next/image"
import { Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RemoveFromCartButton } from "@/components/cart/remove-from-cart-button"

interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  duration: string
}

export function CartItem({ id, name, price, quantity, duration }: CartItemProps) {
  return (
    <div className="p-6 flex  flex-col sm:flex-row gap-4 group hover:bg-muted/50 transition-colors">


      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-2xl  line-clamp-2">{name}</h3>
          <div className="font-bold text-lg">${price.toFixed(2)}</div>
        </div>

        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
          </div>

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

