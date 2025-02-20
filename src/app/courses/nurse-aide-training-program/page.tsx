"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  studentName: z
    .string()
    .min(2, { message: "Student name must be at least 2 characters." }),
  dateOfBirth: z
  .string()
  .min(5, { message: "Add your Birth Date" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  cityStateZip: z
    .string()
    .min(5, { message: "City, State, and ZIP must be at least 5 characters." }),
  phoneHome: z
    .string()
    .min(10, { message: "Home phone must be at least 10 characters." }),
  phoneCell: z
    .string()
    .min(10, { message: "Cell phone must be at least 10 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  socialSecurity: z.string().min(9, {
    message: "Social Security number must be at least 9 characters.",
  }),
  studentStateId: z.string().optional(),
  emergencyContact: z
    .string()
    .min(2, { message: "Emergency contact must be at least 2 characters." }),
  emergencyRelationship: z.string().min(2, {
    message: "Emergency relationship must be at least 2 characters.",
  }),
  emergencyPhone: z
    .string()
    .min(10, { message: "Emergency phone must be at least 10 characters." }),
  admissionDate: z.date({ required_error: "Admission date is required." }),
  programStartDate: z.date({
    required_error: "Program start date is required.",
  }),
  programEndDate: z.date({ required_error: "Program end date is required." }),
  classTime: z
    .string()
    .min(5, { message: "Class time must be in HH:MM format." }),
  classEndTime: z
    .string()
    .min(5, { message: "Class end time must be in HH:MM format." }),
  numberOfWeeks: z
    .number()
    .min(1, { message: "Number of weeks must be at least 1." }),
  totalClockHours: z
    .number()
    .min(1, { message: "Total clock hours must be at least 1." }),
  studentSignature: z.instanceof(File).optional().or(z.string()),
  studentSignatureDate: z.date({
    required_error: "Student signature date is required.",
  }),
  coordinatorSignature: z.instanceof(File).optional().or(z.string()),
  classDays: z.array(z.string()).optional(), // Days of the week
  programType: z.string().optional(), // Full-time/Part-time
  coordinatorSignatureDate: z.date({
    required_error: "Coordinator signature date is required.",
  }),
  parentGuardianSignature: z.instanceof(File).optional().or(z.string()),
  parentGuardianSignatureDate: z.date().optional(),
  studentSignatureLab: z.instanceof(File).optional().or(z.string()),
  studentSignatureLabDate: z.date({
    required_error: "Student signature date for lab agreement is required.",
  }),
});
export default function NurseAideTrainingProgram() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: undefined,
      address: "",
      cityStateZip: "",
      phoneHome: "",
      phoneCell: "",
      email: "",
      socialSecurity: "",
      studentStateId: "",
      emergencyContact: "",
      emergencyRelationship: "",
      emergencyPhone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const daysOfWeek = [
    { label: "M", value: "M" },
    { label: "T", value: "T" },
    { label: "W", value: "W" },
    { label: "Th", value: "Th" },
    { label: "F", value: "F" },
    { label: "Sa", value: "Sa" },
    { label: "Su", value: "Su" },
  ];

  return (
    <div className={cn("min-h-screen transition-colors duration-300")}>
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
              Email: infor@thryve.today 
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        Student Name <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
      <FormControl>
        <Input
          type="text"
          placeholder="Enter date of birth (DD/MM/YYYY)"
          className="w-full pl-3"
          {...field}
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
                        Address  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        City/State/ZIP  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        Phone (Home)  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        Phone (Cell)  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        Email Address  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        Social Security #  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
                          placeholder="123-45-6789"
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
                  name="studentStateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Student State ID #  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
                          placeholder="Optional"
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
                        Emergency Contact  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input  
                        required
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
                        Relationship
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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
                        Emergency Contact Phone  <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                        required
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

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  Program Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-5">
                  <h3 className="text-2xl font-bold text-primary mt-0">
                    Program / Course Name: Phlebotomy Technician Program
                  </h3>
                  <h4 className="text-xl font-semibold text-primary mt-6">
                    DESCRIPTION OF PROGRAM / COURSE:
                  </h4>
                  <p className="text-foreground leading-relaxed">
                    The nurse assistant training program is an entry-level
                    healthcare career for students who prefer direct patient
                    care. The course teaches students how to communicate with
                    patients effectively, recognize medical emergencies, and
                    provide hands-on daily care needs while respecting the
                    patient’s rights. This course is taught in English only. The
                    course consists of theory, lab, and clinical experiences.
                    Prerequisites for this course are satisfied during the
                    enrollment process. Students will learn to perform vital
                    signs, observe/report, provide ADL care, and follow
                    infection prevention measures. After successfully completing
                    this program, students will receive a certificate of
                    completion and be eligible to sit for the certified nursing
                    assistant exam.
                  </p>

                  <p className="text-foreground leading-relaxed">
                    Graduates of this program may find entry-level employment as
                    a nurse aide or certified nursing assistant working in
                    hospitals, home health, hospice, and long-term care
                    facilities, just to name a few.
                  </p>

                  <h4 className="text-xl font-semibold text-primary">
                    PREREQUISITE COURSES & OTHER REQUIREMENTS FOR ADMISSION TO
                    PROGRAM / COURSE:
                  </h4>
                  <ul className="list-disc list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">At least 16 years of age</li>
                    <li className="text-lg">Negative PPD or chest X-ray</li>
                    <li className="text-lg">
                      Two forms of government-issued identification
                    </li>
                    <li className="text-lg">Background check</li>
                    <li className="text-lg">Drug Screening</li>
                    <li className="text-lg">Immunization up to date</li>
                    <li className="text-lg">CPR</li>
                  </ul>
                  <h4 className="text-xl font-semibold text-primary">
                    PROGRAM / COURSE OBJECTIVES:
                  </h4>
                  <ul className="list-disc list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">
                      To provide high-quality, comprehensive healthcare training
                      programs that prepare students for successful careers in
                      the medical field, fostering excellence, integrity, and
                      compassion as healthcare professionals.&quot;
                    </li>
                  </ul>
                  <h4 className="text-xl font-semibold text-primary">
                    COURSE HOURS:
                  </h4>
                  <p className="text-foreground leading-relaxed">
                    138 Clock hours with the following breakdown. 84 hours of
                    classroom theory, 30 hours of lab, and 24 hours in clinical.
                  </p>
                  <h4 className="text-xl font-semibold text-primary">
                    PROGRAM INFORMATION (CONTINUED)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="admissionDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Date of Admission
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
                                  field.value.toLocaleDateString()
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
                              disabled={(date) => date < new Date()}
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
                    name="programStartDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">
                          Program Start Date
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
                                  field.value.toLocaleDateString()
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
                              disabled={(date) => date < new Date()}
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
                    name="programType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-foreground font-medium">
                          Program Type
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-6">
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="full-time" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Full-time
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="part-time" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Part-time
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="evening" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Evening
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="day" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Day
                                </FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="classDays"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Days/Evenings Class Meets
                        </FormLabel>
                        <div className="flex flex-wrap gap-4">
                          {daysOfWeek.map((day) => (
                            <FormField
                              key={day.value}
                              control={form.control}
                              name="classDays"
                              render={({ field: arrayField }) => (
                                <FormItem
                                  key={day.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={arrayField.value?.includes(
                                        day.value
                                      )}
                                      onCheckedChange={(checked) => {
                                        const currentValue =
                                          arrayField.value || [];
                                        if (checked) {
                                          arrayField.onChange([
                                            ...currentValue,
                                            day.value,
                                          ]);
                                        } else {
                                          arrayField.onChange(
                                            currentValue.filter(
                                              (value) => value !== day.value
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {day.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

            
     
             
                 
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  Tuition & Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground mb-2">
                  The application fee is separate and not included in tuition:
                  $150.
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 pl-4 mb-4">
                  <li className="text-lg">Lab: $60</li>
                  <li className="text-lg">Uniform tops: $25</li>
                  <li className="text-lg">Book: $40</li>
                  <li className="text-lg">Tuition: $999</li>
                  <li className="text-lg font-semibold">Total: $1,124</li>
                </ul>
                <p className="text-foreground mb-2">Replacement cost</p>
                <ul className="list-disc list-inside text-foreground space-y-2 pl-4 mb-4">
                  <li className="text-lg">Lost book $50</li>
                  <li className="text-lg">Uniform tops: $25</li>
                  <li className="text-lg">Uniform top: $38</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  CANCELLATION AND REFUND POLICIES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-5">
                  <p className="text-foreground leading-relaxed">
                    Any applicant who chooses to terminate their agreement with
                    Thryve.today by 3rd day of class will be given a full refund
                    of total minus a $150 administrative fee; Thryve.today must
                    receive notice of withdrawal from class in writing via email
                    to infor@thryve.today  or submit to the administrative office
                    personnel by close of business on the first day of class.
                    Thryve.today reserves the right to withhold an
                    administrative fee of $150 deposit and the listed fee for
                    textbooks, workbooks, and scrubs. In an emergency (such as
                    death or hospitalization), permission will be given to
                    transfer classes for a fee of $150. Official documentation
                    of said emergency must be submitted to the school
                    immediately. No refund will be given if a student decides to
                    withdraw after the first week of class.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">
                  Student Acknowledgments
                </CardTitle>
              </CardHeader>
              {/* <CardContent className="p-6"></CardHeader> */}
              <CardContent className="p-6">
                <p className="text-foreground mb-6 leading-relaxed">
                By submitting this form, I am providing my digital signature and agree to the terms and conditions outlined in this agreement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Student&apos;s Signature
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                            required
                              type="text"
                              id="student-signature-upload"
                              className="bg-background text-foreground"
                            />
                    
                          </div>
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
                                  field.value.toLocaleDateString()
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                    name="coordinatorSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                        Program Director/Director 
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                            required
                              type="file"
                              id="coordinator-signature-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                document
                                  .getElementById(
                                    "coordinator-signature-upload"
                                  )
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coordinatorSignatureDate"
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
                                  field.value.toLocaleDateString()
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
                    name="parentGuardianSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Parent/Guardian Signature (if applicable)
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                            required
                              type="file"
                              id="parent-guardian-signature-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                document
                                  .getElementById(
                                    "parent-guardian-signature-upload"
                                  )
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parentGuardianSignatureDate"
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
                                  field.value.toLocaleDateString()
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
            >
              Submit Enrollment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
