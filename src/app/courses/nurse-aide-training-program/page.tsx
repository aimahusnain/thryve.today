'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, CheckCircle, CreditCard } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  studentName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  cityStateZip: z
    .string()
    .min(5, { message: "City/State/ZIP must be at least 5 characters." }),
  phoneHome: z
    .string()
    .min(10, { message: "Home phone must be at least 10 characters." }),
  phoneCell: z
    .string()
    .min(10, { message: "Cell phone must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  socialSecurity: z.string().min(9, {
    message: "Social Security number must be at least 9 characters.",
  }),
  stateId: z.string().min(1, { message: "State ID is required." }),
  emergencyContact: z
    .string()
    .min(2, { message: "Emergency contact name is required." }),
  emergencyRelationship: z
    .string()
    .min(2, { message: "Relationship is required." }),
  emergencyPhone: z.string().min(10, {
    message: "Emergency contact phone must be at least 10 characters.",
  }),
  studentSignature: z
    .string()
    .min(2, { message: "Student signature is required." }),
  studentSignatureDate: z.date({
    required_error: "Student signature date is required.",
  }),
  directorSignature: z
    .string()
    .min(2, { message: "Director signature is required." }),
  directorSignatureDate: z.date({
    required_error: "Director signature date is required.",
  }),
  guardianSignature: z.string().optional(),
  guardianSignatureDate: z.date().optional(),
});

export default function NursingEnrollment() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      address: "",
      cityStateZip: "",
      phoneHome: "",
      phoneCell: "",
      email: "",
      socialSecurity: "",
      stateId: "",
      emergencyContact: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      studentSignature: "",
      directorSignature: "",
      guardianSignature: "",
    },
  });
// In your NursingEnrollment.tsx component
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    toast.loading("Submitting enrollment form...");

    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth?.toISOString(),
      studentSignatureDate: values.studentSignatureDate?.toISOString(),
      directorSignatureDate: values.directorSignatureDate?.toISOString(),
      guardianSignatureDate: values.guardianSignatureDate?.toISOString(),
    };

    const response = await axios.post("/api/enroll", formattedValues, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast.dismiss();
      toast.success("Enrollment form submitted successfully!");
      setIsSubmitted(true);
      
      // Redirect to Stripe checkout
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Payment processing unavailable. Please try again later.");
      }
    }
  } catch (error) {
    toast.dismiss();
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 pt-32">
        <Toaster />
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Enrollment Submitted Successfully!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete your registration by proceeding with the payment
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Nursing Assistant Program</h2>
                  <p className="text-muted-foreground">Thryve.Today Training</p>
                </div>
                <CreditCard className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Program Fee</span>
                  <span className="font-semibold">$999.00</span>
                </div>
              </div>

              <Link
                href="https://buy.stripe.com/00g8z8a3K1AF0M08wD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-4 text-lg font-semibold transition-colors"
              >
                Proceed to Payment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="bg-muted/30 p-6 mt-4">
              <h3 className="font-semibold mb-2">Important Note:</h3>
              <p className="text-sm text-muted-foreground">
                Your enrollment will be finalized once the payment is processed. You&apos;ll receive a confirmation email with further instructions after successful payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-300")}>
      <Toaster />
      <div className="container mx-auto py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mt-20">
        <div className="flex justify-between items-center sm:flex-row flex-col mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            Nursing Assistant Student Enrollment
          </h1>
          <p className="text-muted-foreground">
            Fill out all required information below to enroll in our Nurse Aide
            Training Program.
          </p>
        </div>

        <Card className="mb-8 bg-card">
          <CardHeader className="p-6">
            <CardTitle className="text-3xl font-bold">
              Student Enrollment Agreement
            </CardTitle>
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
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  Student Information
                </CardTitle>
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
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground font-medium">
                        Date of Birth <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
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
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
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
                      <FormLabel className="text-foreground font-medium">
                        Phone (Cell) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe@example.com"
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
                  name="socialSecurity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Social Security # <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XXX-XX-XXXX"
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
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Student State ID # <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State ID"
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
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Emergency Contact <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
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
                  name="emergencyRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Relationship <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Spouse"
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
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Emergency Contact Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(123) 456-7890"
                          {...field}
                          className="bg-background text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-card mt-6">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  Student Acknowledgments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground mb-6 leading-relaxed">
                  By submitting this form, I am providing my digital signature
                  and agree to the terms and conditions outlined in this
                  agreement.
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
                          <Input
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
                    name="studentSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
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
                        <FormLabel className="text-foreground font-medium">
                          Program Director/Director <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
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
                    name="directorSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
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
                          <Input
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
                    name="guardianSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
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
            >
              Submit Enrollment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}