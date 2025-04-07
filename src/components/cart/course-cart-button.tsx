"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart2 } from "@/components/cart/cart-provider"

interface CourseCart2ButtonProps {
  courseId: string
  courseName: string
  coursePrice: number
  courseDuration: string
}

export function CourseCart2Button({ courseId, courseName, coursePrice, courseDuration }: CourseCart2ButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart2 } = useCart2()

  const handleAddToCart2 = async () => {
    setIsAdding(true)
    try {
      await addToCart2(courseId, courseName, coursePrice, courseDuration || "")
    } catch (error) {
      console.error("Failed to add to cart2:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart2}
      disabled={isAdding}
      variant="outline"
      className="w-full mt-3 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 
                text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700"
    >
      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  )
}

