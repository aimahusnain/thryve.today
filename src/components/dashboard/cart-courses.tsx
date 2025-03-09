"use client"

import { useState } from "react"
import Link from "next/link"
import type { CartItem, Courses } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface CartCoursesProps {
  cartItems: (CartItem & {
    course: Courses
  })[]
}

export default function CartCourses({ cartItems }: CartCoursesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </CardTitle>
          <CardDescription>Courses you&apos;ve added to your cart</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-muted p-3">
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">Browse our courses and add some to your cart</p>
          <Button asChild className="mt-4">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart
        </CardTitle>
        <CardDescription>Courses you&apos;ve added to your cart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative rounded-lg border p-4 transition-all hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{item.course.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{item.course.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  {item.quantity > 1 ? `${item.quantity}x` : "1x"}
                </Badge>
                <p className="font-bold">${item.course.price.toFixed(2)}</p>
              </div>
            </div>
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button variant="secondary" asChild>
                  <Link href={`/courses/${item.course.id}`}>View Details</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold">
            ${cartItems.reduce((total, item) => total + item.course.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>
        <Button asChild>
          <Link href="/checkout">
            Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

