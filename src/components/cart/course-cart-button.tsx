"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart2 } from "@/components/cart/cart-provider"
import { useRouter } from "next/navigation"

interface CourseCart2ButtonProps {
  courseId: string
  courseName: string
  coursePrice: number
  courseDuration: string
  isLoggedIn?: boolean // Add prop to check login status
}

export function CourseCart2Button({ 
  courseId, 
  courseName, 
  coursePrice, 
  courseDuration,
  isLoggedIn = false // Default to not logged in
}: CourseCart2ButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart2 } = useCart2()
  const router = useRouter()

  console.log(isLoggedIn)

  const handleAddToCart2 = async () => {
    setIsAdding(true)
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push(`/log-in`)
      setIsAdding(false)
      return
    }
    
    try {
      await addToCart2(courseId, courseName, coursePrice, courseDuration || "")
    } catch (error) {
      console.error("Failed to add to cart:", error)
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