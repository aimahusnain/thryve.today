import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { clearCart } from "@/lib/cart"
import { prisma } from "@/lib/prisma"
import { CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Stripe from "stripe"
import Image from "next/image"

// Update both params and searchParams to be Promises
interface PageProps {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CheckoutSuccessPage({ params, searchParams }: PageProps) {
  // Await both params and searchParams
  await params
  const resolvedSearchParams = await searchParams

  const session = await getServerSession(authOptions)
  const session_id = resolvedSearchParams.session_id as string | undefined

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/checkout/success")
  }

  if (!session_id) {
    redirect("/cart")
  }

  // Verify the Stripe session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  })

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id)
    if (stripeSession.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }

    // Get course IDs from metadata
    const courseIds = stripeSession.metadata?.courseIds ? JSON.parse(stripeSession.metadata.courseIds) : []

    // Update enrollment records for each course
    for (const courseId of courseIds) {
      // Find the course to get its price
      const course = await prisma.courses.findUnique({
        where: { id: courseId },
      })

      if (!course) {
        console.error(`Course with ID ${courseId} not found`)
        continue
      }

      // Find existing enrollment using user ID and course ID
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: session.user.id,
          courseId: courseId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (existingEnrollment) {
        // Update existing enrollment with the specific course price
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            paymentStatus: "COMPLETED",
            paymentId: stripeSession.id,
            paymentAmount: course.price, // Use the specific course price
            paymentDate: new Date(),
          },
        })
      } else {
        console.error(`No enrollment found for user ${session.user.id} and course ${courseId}`)
      }
    }

    // Clear the cart after successful payment
    await clearCart()
  } catch (error) {
    console.error("Error processing successful checkout:", error)
    // We'll still show the success page, but log the error
  }

  return (
      <div className='flex flex-col w-full justify-center items-center py-[800px] h-screen p-4 text-center'>
        <h1 className='text-5xl font-bold mb-6'>Welcome</h1>

<div className="flex flex-col max-w-4xl text-left  items-center justify-center w-full ">
<Image src="/philibotomy.jpg" width={800} height={800} alt={"fds"}/>
<div className="p-8 md:p-12">
            <div className="prose max-w-none">
              <p className="text-lg font-medium mb-6">Dear Keisha Thomas,</p>

              <p className="mb-4">
                Welcome to the Thryve.Today Training Center! We are excited to have you join us on this journey to
                becoming a skilled and compassionate healthcare professional. This program will equip you with the
                knowledge and hands-on experience necessary to succeed in the dynamic and rewarding field of phlebotomy.
              </p>

              <p className="mb-4">
                Throughout your studies, you will have the opportunity to work alongside experienced professionals,
                developing the skills that are essential for success in this field.
              </p>

              <p className="mb-4">
                At Thryve.Today, we are committed to your success. Our instructors are dedicated to providing you with a
                supportive learning environment that encourages growth, curiosity, and practical learning. We offer
                hands-on training to ensure you feel confident and well-prepared for your clinical experiences and
                certification exams.
              </p>

              <p className="mb-4">Here are a few important things to keep in mind as you start your program:</p>

              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Training and Support:</span> Our program combines classroom instruction
                  with real-world, hands-on training. You will be supported throughout your journey by faculty and staff
                  who are committed to your success
                </li>
                <li>
                  <span className="font-medium">Safety and Best Practices:</span> We emphasize the importance of safety
                  and professionalism in the healthcare setting. You will be taught industry-standard protocols to
                  ensure that both you and your patients are protected.
                </li>
                <li>
                  <span className="font-medium">Collaboration:</span> All of our programs involve working closely with
                  others, so we encourage collaboration with your peers, instructors, and healthcare professionals. This
                  will help you build strong communication skills and expand your network.
                </li>
                <li>
                  <span className="font-medium">Opportunities for Growth:</span> Your time in our programs will open
                  doors to a range of career opportunities in hospitals, laboratories, clinics, and other settings. Upon
                  successful completion of the program, you will be well-positioned to begin your career with the
                  confidence and experience needed to thrive.
                </li>
              </ul>

              <p className="mb-4">
                We are so proud of the commitment you've shown in choosing this career path, and we are here to guide
                and support you every step of the way. If you have any questions or need assistance, please don't
                hesitate to contact your instructor or our Program Coordinator.
              </p>

              <p className="mb-8">
                We look forward to seeing you grow and succeed throughout this program, and we are excited for you to
                join the ranks of healthcare professionals who make a difference in the lives of patients every day.
              </p>

              <div className="mt-12">
                <p className="mb-1">Best regards,</p>
                <p className="font-medium t">Keira L. Reid</p>
                <p className="">RN, BSN Director @ Thryve.Today</p>
                <p className="">Office Number: 979-484-7983 Email: keira@thryve.today</p>
              </div>
            </div>
          </div>
  </div>
  
    
      </div>
  )
}