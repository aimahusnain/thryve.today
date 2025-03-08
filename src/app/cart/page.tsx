import { getUserCart, getCartTotal } from "@/lib/cart"
import { CartItem } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClearCartButton } from "@/components/cart/clear-cart-button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CheckoutButton } from "@/components/cart/checkout-button"

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/log-in?callbackUrl=/cart")
  }

  const cart = await getUserCart()
  const total = await getCartTotal()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="container pt-[100px]  mx-auto py-10 px-4 sm:px-6">
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

      {cart.items.length === 0 ? (
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
                <ClearCartButton />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.course.name}
                      price={item.course.price}
                      duration={item.course.duration}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      <span>{item.course.name}</span>
                      <span>${item.course.price.toFixed(2)}</span>
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
                <CheckoutButton total={total} />
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

