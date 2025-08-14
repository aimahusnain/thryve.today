"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useCart } from "@/provider/cart-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { format } from "date-fns"
import { ArrowRight, CalendarIcon, CheckCircle, LogIn, UserPlus } from "lucide-react"
import type { Session } from "next-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import * as z from "zod"

// Form schema remains the same
const formSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dateOfBirth: z.string().min(5, { message: "Date of birth must be at least 5 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  cityStateZip: z.string().min(5, { message: "City/State/ZIP must be at least 5 characters." }),
  phoneHome: z.string().min(10, { message: "Home phone must be at least 10 characters." }),
  phoneCell: z.string().min(10, { message: "Cell phone must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  studentSignature: z.string().min(2, { message: "Student signature is required." }),
  studentSignatureDate: z.date({
    required_error: "Student signature date is required.",
  }),
  directorSignature: z.string().optional(),
  directorSignatureDate: z.date().optional(),
  guardianSignature: z.string().optional(),
  guardianSignatureDate: z.date().optional(),
  courseId: z.string(),
})

interface NursingEnrollmentFormProps {
  courseId: string
  courseName: string
  coursePrice: number
  courseDuration: string
  session: Session | null
}

export function NursingEnrollmentForm({
  courseId,
  courseName,
  coursePrice,
  courseDuration,
  session,
}: NursingEnrollmentFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  // Check authentication status as soon as component loads
  useEffect(() => {
    if (!session) {
      setShowAuthDialog(true)
    }
  }, [session])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      address: "",
      dateOfBirth: "",
      cityStateZip: "",
      phoneHome: "",
      phoneCell: "",
      email: "",
      studentSignature: "",
      directorSignature: "",
      guardianSignature: "",
      courseId: courseId,
    },
  })

  // Fixed onSubmit function to match React Hook Form's expected signature
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Double check authentication before submitting
    if (!session) {
      setShowAuthDialog(true)
      return
    }

    try {
      toast.loading("Submitting enrollment form...")

      const formattedValues = {
        ...values,
        studentSignatureDate: values.studentSignatureDate?.toISOString(),
        dateOfBirth: values.dateOfBirth?.toString(),
        directorSignatureDate: values.directorSignatureDate
          ? new Date(values.directorSignatureDate).toISOString()
          : undefined,
        guardianSignatureDate: values.guardianSignatureDate
          ? new Date(values.guardianSignatureDate).toISOString()
          : undefined,
      }

      const response = await axios.post("/api/enroll", formattedValues, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        toast.dismiss()
        toast.success("Enrollment form submitted successfully!")
        setIsSubmitted(true)

        // Check if course is already in cart before adding
        try {
          const cartResponse = await fetch("/api/cart")
          const cartData = await cartResponse.json()

          // Check if the course is already in the cart
          const courseAlreadyInCart = cartData.items?.some((item: { courseId: string }) => item.courseId === courseId)

          if (!courseAlreadyInCart) {
            // Only add to cart if not already there
            await addToCart(courseId, courseName, coursePrice, courseDuration)
          }

          // Wait a moment before redirecting to cart
          setTimeout(() => {
            router.push("/cart")
          }, 1500)
        } catch (error) {
          console.error("Error checking cart:", error)
          toast.error("Failed to update cart. Please try again.")
        }
      }
    } catch (error) {
      toast.dismiss()
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message
        toast.error(errorMessage || "An error occurred")
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    }
  }

  // Authentication Dialog Component
  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden shadow-xl rounded-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10 z-0 overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-primary/5 animate-pulse-slow"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-primary/10 animate-pulse-slower"></div>

          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 px-6 py-8">
          <DialogHeader className="text-center mb-2">
            {/* Custom icon container with subtle animation */}
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse-slow"></div>
              <div className="relative h-20 w-20 mx-auto rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm shadow-inner border border-primary/20">
                <LogIn className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title with gradient effect */}
            <DialogTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 pb-1">
              Authentication Required
            </DialogTitle>

            <DialogDescription className="text-foreground/80 text-base max-w-xs mx-auto">
              Sign in or create an account to complete your enrollment
            </DialogDescription>
          </DialogHeader>

          {/* Course information with custom styling */}
          <div className="mt-5 mb-7">
            <div className="bg-card/60 backdrop-blur-sm p-5 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{courseName}</h4>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-foreground">${coursePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{courseDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security notice with subtle hover effect */}
          <div className="flex items-center justify-center p-2 rounded-lg bg-muted/20 mb-6 hover:bg-muted/30 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary mr-2"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <p className="text-xs text-muted-foreground">Your enrollment information is secure</p>
          </div>

          {/* Action buttons with fixed height and responsive design */}
          <div className="space-y-3 pt-1">
            <Button
              asChild
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-primary-foreground border-none shadow-md"
            >
              <Link href="/log-in" className="flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span className="truncate">Sign In to Continue</span>
              </Link>
            </Button>

            {/* Divider with text */}
            <div className="relative w-full flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <span className="relative px-3 text-xs text-muted-foreground bg-background">or</span>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-11 bg-background/80 hover:bg-primary/5 border-primary/20"
            >
              <Link href="/signup" className="flex items-center justify-center">
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="truncate">Create New Account</span>
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 pt-32">
        <Toaster />

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Enrollment Submitted Successfully!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your course has been added to your cart. Redirecting to checkout...
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{courseName}</h2>
                  <p className="text-muted-foreground">Duration: {courseDuration}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Program Fee</span>
                  <span className="font-semibold">${coursePrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/cart")}
                className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-4 text-lg font-semibold transition-colors"
              >
                Go to Cart
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="bg-muted/30 p-6 mt-4">
              <h3 className="font-semibold mb-2">Important Note:</h3>
              <p className="text-sm text-muted-foreground">
                Your enrollment will be finalized once the payment is processed. You&apos;ll receive a confirmation
                email with further instructions after successful payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-300")}>
      <Toaster />

      {/* Authentication Dialog */}
      <AuthDialog />

      <div className="container mx-auto py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mt-20">
        <div className="flex justify-between items-center sm:flex-row flex-col mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">Enrollment Form: {courseName}</h1>
          <p className="text-muted-foreground">Fill out all required information below to enroll in this course.</p>
        </div>

        <Card className="mb-8 bg-card">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold">Student Enrollment Agreement</CardTitle>
            <CardDescription className="text-lg mt-2">
              Thryve.Today
              <br />
              1800 Roswell Road Suite 2100, Marietta, GA
              <br />
              Phone: (979) 4-Thryve (979-484-7983)
              <br />
              Email: info@thryve.today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg">{courseName}</h3>
                <p className="text-muted-foreground">Duration: {courseDuration}</p>
              </div>
              <div className="text-2xl font-bold">${coursePrice.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form fields remain the same but with disabled state based on session */}
            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Student Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="John Doe"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Date Of Birth <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="mm/dd/yyyy"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="123 Main St"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityStateZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        City/State/ZIP <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="Anytown, ST 12345"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone (Home) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="(123) 456-7890"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneCell"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black dark:text-foreground font-medium">
                        Phone (Cell) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="(123) 456-7890"
                          {...field}
                          className="bg-background text-black dark:text-foreground"
                        />
                      </FormControl>
                      <div className="text-sm text-black mt-1">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="johndoe@example.com"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="socialSecurity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Social Security # <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="XXX-XX-XXXX"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Student State ID # <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="State ID"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Emergency Contact </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="Jane Doe"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Relationship</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="Spouse"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Emergency Contact Phone </FormLabel>
                      <FormControl>
                        <Input
                          disabled={!session}
                          placeholder="(123) 456-7890"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </CardContent>
            </Card>

            <Card className="bg-card mt-6">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Student Acknowledgments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground mb-6 leading-relaxed">
                  By submitting this form, I am providing my digital signature and agree to the terms and conditions
                  outlined in this agreement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Student&apos;s Signature <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input disabled={!session} {...field} className="bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled={!session}>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  !session && "opacity-50 cursor-not-allowed",
                                )}
                                disabled={!session}
                                onClick={(e) => {
                                  if (!session) {
                                    e.preventDefault()
                                    setShowAuthDialog(true)
                                  }
                                }}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (session) field.onChange(date)
                                else setShowAuthDialog(true)
                              }}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01") || !session}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="directorSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Program Director/Director </FormLabel>
                        <FormControl>
                          <Input disabled={!session} {...field} className="bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="directorSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled={!session}>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  !session && "opacity-50 cursor-not-allowed",
                                )}
                                disabled={!session}
                                onClick={(e) => {
                                  if (!session) {
                                    e.preventDefault()
                                    setShowAuthDialog(true)
                                  }
                                }}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (session) field.onChange(date)
                                else setShowAuthDialog(true)
                              }}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01") || !session}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Parent/Guardian Signature (if applicable)
                        </FormLabel>
                        <FormControl>
                          <Input disabled={!session} {...field} className="bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled={!session}>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  !session && "opacity-50 cursor-not-allowed",
                                )}
                                disabled={!session}
                                onClick={(e) => {
                                  if (!session) {
                                    e.preventDefault()
                                    setShowAuthDialog(true)
                                  }
                                }}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (session) field.onChange(date)
                                else setShowAuthDialog(true)
                              }}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01") || !session}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 mt-6"
              disabled={!session}
              onClick={() => !session && setShowAuthDialog(true)}
            >
              Submit Enrollment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}