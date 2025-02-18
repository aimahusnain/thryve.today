"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  dateOfBirth: z.date({ required_error: "A date of birth is required." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  cityStateZip: z.string().min(5, { message: "City, State, and ZIP must be at least 5 characters." }),
  phoneHome: z.string().min(10, { message: "Home phone must be at least 10 characters." }),
  phoneCell: z.string().min(10, { message: "Cell phone must be at least 10 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  socialSecurity: z.string().min(9, { message: "Social Security number must be at least 9 characters." }),
  studentStateId: z.string().optional(),
  emergencyContact: z.string().min(2, { message: "Emergency contact must be at least 2 characters." }),
  emergencyRelationship: z.string().min(2, { message: "Emergency relationship must be at least 2 characters." }),
  emergencyPhone: z.string().min(10, { message: "Emergency phone must be at least 10 characters." }),
  admissionDate: z.date({ required_error: "Admission date is required." }),
  programStartDate: z.date({ required_error: "Program start date is required." }),
  programEndDate: z.date({ required_error: "Program end date is required." }),
  classTime: z.string().min(5, { message: "Class time must be in HH:MM format." }),
  classEndTime: z.string().min(5, { message: "Class end time must be in HH:MM format." }),
  numberOfWeeks: z.number().min(1, { message: "Number of weeks must be at least 1." }),
  totalClockHours: z.number().min(1, { message: "Total clock hours must be at least 1." }),
  studentSignature: z.instanceof(File).optional().or(z.string()),
  studentSignatureDate: z.date({ required_error: "Student signature date is required." }),
  coordinatorSignature: z.instanceof(File).optional().or(z.string()),
  coordinatorSignatureDate: z.date({ required_error: "Coordinator signature date is required." }),
  parentGuardianSignature: z.instanceof(File).optional().or(z.string()),
  parentGuardianSignatureDate: z.date().optional(),
  studentSignatureLab: z.instanceof(File).optional().or(z.string()),
  studentSignatureLabDate: z.date({ required_error: "Student signature date for lab agreement is required." }),
})

export default function PhlebotomyEnrollment() {
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
      studentStateId: "",
      emergencyContact: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      classTime: "",
      classEndTime: "",
      numberOfWeeks: 0,
      totalClockHours: 0,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-300")}>
      <div className="container mx-auto py-12 px-6 sm:px-8 lg:px-12 max-w-6xl mt-20">
        <div className="flex justify-between items-center sm:flex-row flex-col mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">Phlebotomy Class Enrollment</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Complete the form below to enroll in our Phlebotomy Technician Program
          </p>
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
              Email: infor@thryve.today 
            </CardDescription>
          </CardHeader>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <FormLabel className="text-foreground font-medium">Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                      <FormLabel className="text-foreground font-medium">Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">City/State/ZIP</FormLabel>
                      <FormControl>
                        <Input placeholder="Anytown, ST 12345" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Phone (Home)</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Phone (Cell)</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Social Security #</FormLabel>
                      <FormControl>
                        <Input placeholder="123-45-6789" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Student State ID #</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Spouse" {...field} className="bg-background text-foreground" />
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
                      <FormLabel className="text-foreground font-medium">Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} className="bg-background text-foreground" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Program Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-5">
                  <h3 className="text-2xl font-bold text-primary mt-0">
                    Program / Course Name: Phlebotomy Technician Program
                  </h3>
                  <h4 className="text-xl font-semibold text-primary mt-6">Program Description:</h4>
                  <p className="text-foreground leading-relaxed">
                    This program is designed to provide students with the knowledge and skills that are required to
                    become a <span className="font-semibold text-primary">Phlebotomy Technician</span>. The Phlebotomy
                    Technician program educates students to collect, process, and properly transport laboratory
                    specimens, correctly label specimens, identify pre-analytical errors, and perform clinical
                    procedures under the supervision of a <span className="text-primary">Physician</span> or{" "}
                    <span className="text-primary">Nurse Practitioner</span>.
                  </p>

                  <p className="text-foreground leading-relaxed">
                    Phlebotomy technicians typically work in conjunction with clinical laboratory personnel and other
                    healthcare providers in clinics or other healthcare facilities. They also may work within the
                    hospital, private physician offices, etc. Through classroom work and skills lab training, students
                    learn to collect blood specimens by{" "}
                    <span className="font-semibold">venipuncture, finger sticks, and heel sticks</span>, as well as
                    perform vision and vital signs.
                  </p>

                  <p className="text-foreground leading-relaxed">
                    The end of the course includes a <span className="font-semibold">lab practicum</span>, which will
                    occur on-site during normal class hours. Upon successful completion, students are prepared to sit
                    for the <span className="font-semibold">NHA National Certification Exam</span>. This course is{" "}
                    <span className="font-semibold">110 hours</span> of instruction, which includes{" "}
                    <span className="font-semibold">6 modules</span> of learning (PH 100-PH 105).
                  </p>

                  <p className="text-foreground leading-relaxed">
                    Please see the modules below. Upon completion, all students will be given the opportunity to sit for
                    the Certification Exam with the{" "}
                    <span className="font-semibold">National Health Career Association (NHA)</span>. Certification is
                    not required for employment; however, it is highly recommended.
                  </p>

                  <h4 className="text-xl font-semibold text-primary">Prerequisites:</h4>
                  <ul className="list-disc list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">At least 16 years of age</li>
                    <li className="text-lg">Two forms of government-issued Identification</li>
                    <li className="text-lg">Proof of Hepatitis B vaccine</li>
                    <li className="text-lg">
                      If underage (16 – 17), parents must sign all enrollment documents and provide a high school
                      transcript.
                    </li>
                    <li className="text-lg">GED/ Diploma</li>
                    <li className="text-lg">A transcript is required for students without a GED/ Diploma</li>
                  </ul>
                  <h4 className="text-xl font-semibold text-primary">Program Outcomes:</h4>
                  <ul className="list-disc list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">
                      Prepare students for success in a healthcare career path leading to post-secondary programs that
                      certify healthcare professionals.
                    </li>
                    <li className="text-lg">
                      Uphold the honor and high principles of the profession and accept its disciplines.
                    </li>
                    <li className="text-lg">
                      Develop attitudes consistent with those expected of an individual working in the healthcare
                      industry and society in general.
                    </li>
                    <li className="text-lg">
                      Demonstrate the knowledge, skills, and professionalism required by employers and patients.
                    </li>
                    <li className="text-lg">Identify common clinical procedures performed in the medical office.</li>
                    <li className="text-lg">Demonstrate knowledge of the systematic examination of patients.</li>
                    <li className="text-lg">
                      Apply administrative principles in the medical office setting/ hospital.
                    </li>
                    <li className="text-lg">
                      Demonstrate knowledge of EMR, and medical law/ethics to work in an office or hospital.
                    </li>
                    <li className="text-lg">
                      Apply for and pass the Certification Exam through the National Health Career Association (NHA).
                    </li>
                  </ul>
                  <h4 className="text-xl font-semibold text-primary">Facility Description:</h4>
                  <p className="text-foreground leading-relaxed">
                    The classroom will consist of tables and chairs that will accommodate 14 students, central air to
                    control room temperature, ceiling lights, a restroom, a whiteboard, a projector for viewing visual
                    content and patient care scenarios, a designated area for a library with books to enhance learning,
                    and two computers for student use, a printer. The lab will consist of a state-approved hospital bed,
                    wheelchair with footrest, mannequin with interchangeable genital, bedpan, fracture pan, urinal,
                    bedside commode, bedside table, gloves, Patient care tools (i.e., toothbrushes, toothpaste, etc.),
                    linens (hospital gown, etc.,) pillows, and sink.
                  </p>
                  <h4 className="text-xl font-semibold text-primary">Career Services:</h4>
                  <p className="text-foreground leading-relaxed">
                    Thyrve.Today does provide students with the tools and resources needed to acquire a position in the
                    workforce as well as job referrals. We cannot guarantee job placement. Graduates of our program will
                    receive access to job opportunities in their area to which they can apply. This information is
                    provided upon graduation, and job opportunities are also listed on our school&apos;s job board.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Prior to the completion of the program of study, students will be provided with:
                  </p>
                  <ul className="list-disc list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">Instruction on resume preparation</li>
                    <li className="text-lg">How to conduct job searches</li>
                    <li className="text-lg">Understanding interviewing skills</li>
                    <li className="text-lg">Understanding how to accept and negotiate job offers</li>
                    <li className="text-lg">Access to employer contact list</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="admissionDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Date of Admission</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
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
                        <FormLabel className="text-foreground font-medium">Program Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
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
                    name="programEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Scheduled End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
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
                    name="classTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Time Class Begins</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classEndTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Time Class Ends</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-background text-foreground" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfWeeks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Number of Weeks</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            className="bg-background text-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalClockHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Total Clock Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            className="bg-background text-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Tuition & Fees</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-primary mb-4">Phlebotomy- 110 hrs.</h4>
                <ul className="list-disc list-inside text-foreground space-y-2 pl-4 mb-4">
                  <li className="text-lg">Tuition: $555</li>
                  <li className="text-lg">Book: $50</li>
                  <li className="text-lg">Scrub Tops: $25</li>
                  <li className="text-lg">Lab fee $70</li>
                  <li className="text-lg font-semibold">Total Tuition: $700</li>
                </ul>
                <p className="text-foreground mb-2">
                  Non- Refundable Application fee is separate and not included in tuition: $100.00
                </p>
                <p className="text-foreground font-semibold">
                  THRYVE.TODAY, ACCEPT CASH CHECKS, MONEY ORDERS, PAYMENT PLANS, CREDIT CARDS, AND FINANCING OPTIONS
                  AVAILABLE UPON REQUEST.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-5">
                  <h4 className="text-xl font-semibold text-primary">Attendance Policy</h4>
                  <p className="text-foreground leading-relaxed">
                    Students are expected to attend all lectures and labs as each courses have a required number of
                    hours that must be achieved. Instructors will maintain a daily record of attendance for each class
                    offering at the beginning of class and after each break. A tardy is defined as arriving in the
                    classroom 15 minutes after the start of class. Students are considered late from breaks when
                    returning more than 5 minutes late from the start of class. Any student who has been marked tardy 3
                    times must attend the make-up session designated at the beginning of the course. Students may only
                    attend the predesignated makeup day that must be completed as seen in the course catalog (Please see
                    the section Term Dates in the course catalog under Classroom makeup day). The makeup date will be
                    set by the student and the instructor; no additional make-up day will be arranged. Students who did
                    not attend the predesignated make-up day will be terminated from the course. Students whose
                    enrollments are terminated for violation of the attendance policy may not reenter the course until
                    the next course offering. Students will only have two additional attempts at the course. Any student
                    who withdraws after day three, a refund will be provided based on the number of days that the
                    student attends the course. The refund will be given based on the percentage of the program the
                    student attends the course.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    If a student misses a day of class (absence), the student must attend the pre-designated make-up
                    date as seen in the course schedule in the catalog. If the student has subsequent days missed ( 3or
                    more days) or exceeds three tardy occurrences, the student will be required to attend a make-up day
                    and will be placed on academic probation which the academic probation will take into effect after
                    the 3rd day that is missed. The student will not be allowed to miss any days while on probation and
                    must attend the make-up days to complete the course. If they do not adhere to the probation, the
                    student will be terminated from the session. Students who are terminated from the program due to
                    attendance issues are still subject to the refund policy. Students who fail the Phlebotomy
                    Technician program are terminated due to attendance, or who voluntarily withdraw only have two
                    attempts to re-take the course. After the second attempt, and if the student fails, they are unable
                    to re-enter the course for 30 days. After 30 days, the student will be able to re-enter the course
                    from the beginning.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    ALT: LOA will be granted to students who have a proven medical emergency that requires them to miss
                    more than 3 days of class as long as students&apos; academic status is satisfactory. Students who are
                    failing will not be granted a LOA. Please report to your school director for assistance if a medical
                    situation arises. LOA allows students to continue their education during the next course offering
                    with no additional fees or penalties.
                  </p>
                  <h4 className="text-xl font-semibold text-primary">Make-Up Work</h4>
                  <p className="text-foreground leading-relaxed">
                    No more than 5% of the total course time hours for a course may be made up. Make-up work shall:
                  </p>
                  <ol className="list-decimal list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">be supervised by an instructor approved for the class being made up.</li>
                    <li className="text-lg">
                      require the student to demonstrate substantially the same level of knowledge or competence
                      expected of a student who attended the scheduled class session.
                    </li>
                    <li className="text-lg">
                      be completed within two weeks of the end of the grading period during which the absence occurred.
                    </li>
                    <li className="text-lg">
                      be documented by the school as being completed, recording the date, time, duration of the make-up
                      session, and the name of the supervising instructor.
                    </li>
                    <li className="text-lg">be signed and dated by the student to acknowledge the make-up session.</li>
                  </ol>
                  <h4 className="text-xl font-semibold text-primary">Cancellation and Refund Policies</h4>
                  <p className="text-foreground leading-relaxed">
                    A full refund will be made to any student who cancels the enrollment contract within 72 hours (until
                    midnight of the third day excluding Saturdays, Sundays and legal holidays) after the enrollment
                    contract is signed or if no contract is signed and prior to the classes beginning the student
                    requests a refund within 72 business hours after making the payment. Any student who withdraws after
                    day three, a refund will be provided based on the number of days that the student attends the
                    course. The refund will be given based on the percentage of the program the student attends the
                    course.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    The enrollment fee will be refunded except for items that were special ordered for a particular
                    student and cannot be used or sold to another student and items that were returned in a condition
                    that prevents them from being used by or sold to new students. The school also will not refund fees
                    for goods and/or services provided by third-party vendors. Refunds will be calculated based on the
                    date on which the student has begun the formal withdrawal process. Refunds will be issued to the
                    student in full via US mail in the form of a check within 45 days of the date of withdrawal.
                  </p>
                  <h4 className="text-xl font-semibold text-primary">Phlebotomy Class Cancellation Policy</h4>
                  <ol className="list-decimal list-inside text-foreground space-y-2 pl-4">
                    <li className="text-lg">
                      <strong>Notice of Cancellation:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          Students wishing to cancel their enrollment in the Phlebotomy class must provide written
                          notice to the program coordinator. This notice can be sent via email or delivered in person.
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg">
                      <strong>Exceptions:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          Exceptions to the cancellation policy may be considered on a case-by-case basis in the event
                          of unforeseen circumstances such as medical emergencies, military deployment, or other
                          significant life events. Documentation may be required.
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg">
                      <strong>Program Cancellation:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          If the Phlebotomy class is canceled by the institution or program provider due to insufficient
                          enrollment, instructor availability, or other reasons such as inclement weather, emergency,
                          etc., students will receive a full refund of all tuition and fees paid if the class cannot be
                          rescheduled or made up on another scheduled day. If the scheduled class/day needs to be
                          canceled or rescheduled, the institution will notify the student/students. The
                          Administrator/Director can be contacted Keira Reid Email: keira@thryve.today  <br /> <br /> Number:
                          718-619-2379/ 979-484-7983 <br /> <br /> Shavonda Fields Email: shavonda@thryve.today <br /> <br /> Number: 817-487-7378/ <br /> <br />
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg">
                      <strong>Transfer to a Future Class:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          Students who are unable to attend their scheduled class but wish to transfer to a future class
                          may do so at least 7 days before the start of the class. The transfer request must be made in
                          writing. (INCIDENTS SUCH AS FAMILY EMERGENCIES, ILLNESSES, BEREAVEMENT, OR IF STUDENT IS NOT
                          SUCCESSFUL AFTER COMPLETING LESS THAN 50% OF THE CLASS.)
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg">
                      <strong>Non-Refundable Fees:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          Certain fees, such as application fees may be non-refundable. These fees will be clearly
                          stated at the time of enrollment.
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg">
                      <strong>Contact Information:</strong>
                      <ul className="list-disc list-inside pl-4">
                        <li className="text-lg">
                          For questions regarding the cancellation policy or to submit a cancellation request, please
                          contact the program director at 718-619-2379/979-487-7983.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Student Acknowledgments</CardTitle>
              </CardHeader>
              {/* <CardContent className="p-6"></CardHeader> */}
              <CardContent className="p-6">
                <p className="text-foreground mb-6 leading-relaxed">
                  The student acknowledges receiving a copy of this completed agreement and the school course catalog
                  prior to signing this agreement. By signing this agreement, the student acknowledges that he/she has
                  read this agreement, understands the terms and conditions, and agrees to the conditions outlined in
                  this agreement. The student and the school will retain a copy of this agreement.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Student&apos;s Signature</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              id="student-signature-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  field.onChange(file)
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => document.getElementById("student-signature-upload")?.click()}
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
                    name="studentSignatureDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                        <FormLabel className="text-foreground font-medium">Program Coordinator Signature</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              id="coordinator-signature-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  field.onChange(file)
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => document.getElementById("coordinator-signature-upload")?.click()}
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
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                              type="file"
                              id="parent-guardian-signature-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  field.onChange(file)
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => document.getElementById("parent-guardian-signature-upload")?.click()}
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
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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

            <Card className="bg-card">
              <CardHeader className="bg-muted p-6">
                <CardTitle className="text-2xl font-bold text-primary">Laboratory Procedures Agreement</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-foreground mb-6 leading-relaxed">
                  I, the undersigned, volunteer for venipuncture and micro-collection procedures to be performed on me
                  as part of the Phlebotomy Technician. I am aware that these are invasive procedures and there are
                  risks such as hepatitis, HIV, and other diseases. I have no knowledge of having any communicable
                  disease such as hepatitis, HIV, or other disease such as anemia, cancer, TB, etc. I understand that I
                  may only perform venipunctures and micro-collections within the lab/practicum setting and under the
                  supervision of the instructor(s) or practicum supervisor(s). I do not hold Thryve.Today, faculty, or
                  classmates responsible for any untoward effect from these procedures. If applicable, I will obtain a
                  physician&apos;s excuse, which will exempt me from either/or both venipuncture and/or micro-collection
                  procedures to be performed on me before the beginning of the phlebotomy technician program course. The
                  physician will need to specify which technique(s) I will be exempted from. My grade will not be
                  jeopardized by an exemption from these procedures. I agree to follow all lab rules and procedures as
                  explained in this catalog and the additional rules and procedures listed below for my protection and
                  the safety of others.
                </p>
                <ol className="list-decimal list-inside text-foreground space-y-2 pl-4 mb-6">
                  <li className="text-lg">
                    Wear PPE (Personal Protective Equipment) when handling any biohazard specimen or chemical
                  </li>
                  <li className="text-lg">
                    Disinfect the work area before and after procedures immediately if there is a spill
                  </li>
                  <li className="text-lg">
                    Discard all contaminated materials into an appropriately labeled biohazard container. A rigid
                    puncture-proof container (Sharps) must be used for disposal of any object that would puncture a
                    garbage bag, i.e. needles and lancets
                  </li>
                  <li className="text-lg">
                    Wear safety goggles when working with chemicals or when splashes are likely to occur
                  </li>
                  <li className="text-lg">Avoid testing, smelling, or breathing chemicals</li>
                  <li className="text-lg">Follow the manufacturer&apos;s instructions for operating equipment</li>
                  <li className="text-lg">Handle equipment with care and store chemicals properly</li>
                  <li className="text-lg">Report any broken or frayed electrical cord to your instructor</li>
                  <li className="text-lg">Discard any broken glassware into a &quot;Sharps&quot; container</li>
                  <li className="text-lg">Use appropriate chemical spill kits to clean up spills</li>
                  <li className="text-lg">Report any accident to your instructor</li>
                </ol>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentSignatureLab"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Student Signature</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              id="student-signature-lab-upload"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  field.onChange(file)
                                }
                              }}
                              className="bg-background text-foreground"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => document.getElementById("student-signature-lab-upload")?.click()}
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
                    name="studentSignatureLabDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? field.value.toLocaleDateString() : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
  )
}

