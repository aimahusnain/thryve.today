"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  courseId: string
  className?: string
  isLoggedIn?: boolean // Add prop to check login status
}

export function AddToCartButton({ 
  courseId, 
  className,
  isLoggedIn = false // Default to not logged in
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsLoading(true)
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push(`/signup`)
      return
    }
    
    // If logged in, proceed to enrollment
    router.push(`/courses/${courseId}`)
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Enroll Now"}
    </Button>
  )
}