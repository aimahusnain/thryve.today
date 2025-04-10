"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart/cart-item"
import { ClearCartButton } from "@/components/cart/clear-cart-button"
import { CheckoutButton } from "@/components/cart/checkout-button"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define types for our data structures
interface Course {
  id: string
  name: string
  price: number
  duration?: string
}

interface Item {
  id: string
  courseId: string
  quantity: number
  course?: Course
}

interface Cart {
  items: Item[]
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({ items: [] })
  const [total, setTotal] = useState<number>(0)
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [allEnrolled, setAllEnrolled] = useState<boolean>(false)

  const loadCartData = async () => {
    setLoading(true)
    try {
      // Fetch cart data
      const cartResponse = await fetch("/api/cart")
      if (!cartResponse.ok) {
        if (cartResponse.status === 401) {
          // Redirect to login if unauthorized
          router.push("/log-in?callbackUrl=/cart")
          return
        }
        throw new Error("Failed to fetch cart")
      }
      const cartData = (await cartResponse.json()) as Cart
      setCart(cartData)

      // Calculate total
      const totalAmount = cartData.items.reduce(
        (sum, item) => sum + (item.course?.price || 0) * (item.quantity || 1),
        0,
      )
      setTotal(totalAmount)

      // Check enrollment status for each course
      if (cartData.items && cartData.items.length > 0) {
        const enrollmentStatusMap: Record<string, boolean> = {}
        let allCoursesEnrolled = true

        for (const item of cartData.items) {
          if (item.courseId) {
            const enrollmentResponse = await fetch(`/api/enrollment/status?courseId=${item.courseId}`)
            if (enrollmentResponse.ok) {
              const { completed } = (await enrollmentResponse.json()) as { completed: boolean }
              enrollmentStatusMap[item.courseId] = completed
              if (!completed) {
                allCoursesEnrolled = false
              }
            } else {
              // If we can't determine enrollment status, assume not enrolled
              enrollmentStatusMap[item.courseId] = false
              allCoursesEnrolled = false
            }
          }
        }

        setEnrollmentStatus(enrollmentStatusMap)
        setAllEnrolled(allCoursesEnrolled)
      } else {
        // Empty cart
        setEnrollmentStatus({})
        setAllEnrolled(false)
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
      toast.error("Failed to load cart data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCartData()
  }, [router])

  const handleCartItemRemoved = () => {
    loadCartData()
  }

  const handleCartCleared = () => {
    loadCartData()
  }

  const itemCount = cart.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0

  if (loading) {
    return (
      <div className="container pt-[100px] mx-auto py-10 px-4 sm:px-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container pt-[100px] mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center mb-8 gap-4">
        <Link
          href="/courses"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
        <div className="flex items-center sm:ml-auto">
          <ShoppingCart className="h-6 w-6 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {itemCount > 0 && (
            <Badge variant="secondary" className="ml-3">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
      </div>

      {!cart.items || cart.items.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="pt-16 pb-16">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-lg"></div>
                <div className="relative bg-background rounded-full p-6">
                  <ShoppingBag className="h-16 w-16 text-primary/80" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md">
                Looks like you haven&apos;t added any courses to your cart yet. Discover our top-rated courses and start
                learning today!
              </p>
              <Link href="/courses">
                <Button size="lg" className="mt-2 rounded-full px-8">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Your Courses</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Badge>
                </div>
                <ClearCartButton onClearCart={handleCartCleared} />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id} // Use the cart item ID here
                      courseId={item.courseId}
                      name={item.course?.name || "Course"}
                      price={item.course?.price || 0}
                      duration={item.course?.duration || ""}
                      isEnrolled={!!enrollmentStatus[item.courseId]}
                      onRemove={handleCartItemRemoved}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {!allEnrolled && (
              <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <AlertTitle>Enrollment Required</AlertTitle>
                <AlertDescription>
                  Please complete enrollment for all courses in your cart before proceeding to checkout.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center px-4">
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                Add more courses
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.course?.name || "Course"}</span>
                      <span>${(item.course?.price || 0).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-primary font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gradient-to-r from-primary/5 to-primary/10 flex flex-col gap-4 pt-6">
                <CheckoutButton total={total} disabled={!allEnrolled} />
                {!allEnrolled && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please complete enrollment for all courses to proceed to checkout
                  </p>
                )}
                <div className="flex items-center justify-center w-full gap-2 text-xs text-muted-foreground">
                  <span>Secure Checkout</span>
                  <span>•</span>
                  <span>SSL Encrypted</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
