"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Moon, Sun, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  fullName: string
  email: string
  phone: string
  dob: string
  address: string
  city: string
  state: string
  zip: string
  startDate: string
  programType: "full-time" | "part-time"
  classSchedule: string[]
  agreeToTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function EnrollmentAgreement() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    startDate: "",
    programType: "part-time",
    classSchedule: [],
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    setProgress(currentStep * 25)
  }, [currentStep])

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = "Full name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.phone) newErrors.phone = "Phone number is required"
        if (!formData.dob) newErrors.dob = "Date of birth is required"
        break
      case 2:
        if (!formData.address) newErrors.address = "Address is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.state) newErrors.state = "State is required"
        if (!formData.zip) newErrors.zip = "ZIP code is required"
        break
      case 3:
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        if (formData.classSchedule.length === 0) newErrors.classSchedule = "Please select at least one day"
        break
      case 4:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleClassScheduleChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      classSchedule: prev.classSchedule.includes(day)
        ? prev.classSchedule.filter((d) => d !== day)
        : [...prev.classSchedule, day],
    }))
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black transition-colors duration-300 flex items-center justify-center ${darkMode ? "dark" : ""}`}
    >
      {/* Main Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-w-3xl p-8">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Nursing Assistant Enrollment</h2>
            <Progress value={progress} className="mb-8" />
            <div className="space-y-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="john@example.com"
                        className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        type="date"
                        className={`mt-1 ${errors.dob ? "border-red-500" : ""}`}
                      />
                      {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Anytown"
                        className={`mt-1 ${errors.city ? "border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="CA"
                        className={`mt-1 ${errors.state ? "border-red-500" : ""}`}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className={`mt-1 ${errors.zip ? "border-red-500" : ""}`}
                      />
                      {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">Program Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="startDate">Program Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        type="date"
                        className={`mt-1 ${errors.startDate ? "border-red-500" : ""}`}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                      <Label>Program Type</Label>
                      <RadioGroup
                        name="programType"
                        value={formData.programType}
                        onValueChange={(value: "full-time" | "part-time") =>
                          handleInputChange({
                            target: { name: "programType", value },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-time" id="full-time" />
                          <Label htmlFor="full-time">Full-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="part-time" id="part-time" />
                          <Label htmlFor="part-time">Part-time</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label>Class Schedule</Label>
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${day}`}
                              checked={formData.classSchedule.includes(day)}
                              onCheckedChange={() => handleClassScheduleChange(day)}
                            />
                            <Label htmlFor={`day-${day}`}>{day}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.classSchedule && <p className="text-red-500 text-sm mt-1">{errors.classSchedule}</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">Review & Submit</h3>
                  <div className="space-y-4">
                    <div className="bg-zinc-100 dark:bg-zinc-700 p-6 rounded-lg">
                      <h4 className="font-semibold text-zinc-800 dark:text-white mb-4">Tuition & Fees</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-300">Application Fee</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">$150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-300">Tuition</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">$999</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600 dark:text-zinc-300">Books & Materials</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">$125</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-600">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">Total</span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">$1,274</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked: boolean) =>
                          handleInputChange({
                            target: { name: "agreeToTerms", type: "checkbox", checked },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                      />
                      <Label htmlFor="terms">I agree to the terms and conditions</Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Please correct the errors before proceeding.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button onClick={prevStep} variant="outline">
                    Previous
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => validateStep(4)}
                    className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                    disabled={!formData.agreeToTerms}
                  >
                    Submit Enrollment
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
        </div>
    </div>
  )
}

