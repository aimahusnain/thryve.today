"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  courseId: string
  className?: string
}

export function AddToCartButton({ courseId, className }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsLoading(true)
    // Redirect to the enrollment form for this course
    router.push(`/courses/${courseId}`)
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Enroll Now"}
    </Button>
  )
}