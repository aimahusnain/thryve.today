import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import Image from "next/image";

// Update both params and searchParams to be Promises
interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: PageProps) {
  // Await both params and searchParams
  await params;
  const resolvedSearchParams = await searchParams;

  const session = await getServerSession(authOptions);
  const session_id = resolvedSearchParams.session_id as string | undefined;

  if (!session?.user?.id) {
    redirect("/log-in?callbackUrl=/checkout/success");
  }

  if (!session_id) {
    redirect("/cart");
  }

  // Verify the Stripe session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  });

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
    if (stripeSession.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Get course IDs from metadata
    const courseIds = stripeSession.metadata?.courseIds
      ? JSON.parse(stripeSession.metadata.courseIds)
      : [];

    // Update enrollment records for each course
    for (const courseId of courseIds) {
      // Find the course to get its price
      const course = await prisma.courses.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        console.error(`Course with ID ${courseId} not found`);
        continue;
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
      });

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
        });
      } else {
        console.error(
          `No enrollment found for user ${session.user.id} and course ${courseId}`
        );
      }
    }

    // Clear the cart after successful payment
    await clearCart();
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    // We'll still show the success page, but log the error
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header image with responsive container */}
      <div className="relative w-full max-h-[300px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[450px] overflow-hidden sm:pb-0 pb-36">
        <Image
          src="/philibotomy.png"
          width={1200}
          height={1200}
          alt="Header image"
          className="w-full h-auto object-cover"
          priority
        />

        {/* Header content with better responsive positioning */}
        <div className="absolute inset-0 mt-10 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start md:p-8 lg:p-12">
          <div className="dark:bg-black/80 bg-white/80 p-3 md:p-5 rounded-lg flex flex-col md:flex-row items-center gap-3 md:gap-6">
            {/* Logo with responsive sizing */}
            <Image 
              src="/logo (2).png" 
              width={100} 
              height={100} 
              alt="Thryve.Today logo" 
              className="w-20 h-auto md:w-28 lg:w-32"
            />

            <div className="text-center md:text-start font-serif">
              <h1 className="text-xl md:text-2xl lg:text-3xl tracking-widest font-semibold">
                THRYVE.TODAY
              </h1>
              <p className="text-xs md:text-sm lg:text-base mt-1">1800 Roswell Road Ste 2100</p>
              <p className="text-xs md:text-sm lg:text-base">Marietta, Georgia 30062</p>
              <p className="text-xs md:text-sm lg:text-base">979-484-7983</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with container class for better spacing */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="prose prose-sm sm:prose md:prose-lg lg:prose-xl max-w-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Welcome to the Thryve.Today Training Center!
          </h1>
          <p>
            We are thrilled to have you embark on this unique journey to
            becoming a skilled and compassionate healthcare professional. Our
            program, unlike any other, will equip you with the knowledge and
            hands-on experience necessary to excel in the dynamic and rewarding
            field of healthcare.
          </p>
          <p>
            Throughout your studies, you will have the opportunity to work
            alongside experienced professionals, developing the skills that are
            essential for success in this field.
          </p>
          <p>
            At <span className="font-semibold">Thryve.Today</span>, your success
            is our top priority. Our instructors are dedicated to creating a
            nurturing learning environment that promotes growth, curiosity, and
            practical learning. We offer hands-on training to ensure you feel
            confident and well-prepared for your clinical experiences and
            certification exams.
          </p>

          <div className="my-6 md:my-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Here are a few important things to keep in mind as you start your
              program:
            </h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Training and Support:</strong> Our program combines
                classroom instruction with real-world, hands-on training. You
                will be fully supported throughout your journey by faculty and
                staff who are deeply committed to your success.
              </li>
              <li>
                <strong>Safety and Best Practices:</strong> We place a strong
                emphasis on the importance of safety and professionalism in the
                healthcare setting. You will be taught industry-standard
                protocols to ensure that both you and your patients are always
                protected.
              </li>
              <li>
                <strong>Collaboration:</strong> All of our programs involve
                working closely with others, so we encourage collaboration with
                your peers, instructors, and healthcare professionals. This will
                help you build strong communication skills and expand your
                network.
              </li>
              <li>
                <strong>Opportunities for Growth:</strong> Your time in our
                programs will open doors to a range of career opportunities in
                hospitals, laboratories, clinics, and other settings. Upon
                successful completion of the program, you will be
                well-positioned to begin your career with the confidence and
                experience needed to thrive.
              </li>
            </ul>
          </div>
          
          <p>
            We are so proud of the commitment you&apos;ve shown in choosing this
            career path, and we are here to guide and support you every step of
            the way. If you have any questions or need assistance, please don&apos;t
            hesitate to contact your instructor or our Program Coordinator.
          </p>
          
          <p>
            We eagerly anticipate witnessing your growth and success throughout
            this program. We are excited for you to become part of our community
            of healthcare professionals who make a profound difference in
            patients&apos; lives every day.
          </p>

          <div className="mt-8 border-t pt-6">
            <p className="font-semibold">Best regards,</p>
            <p className="mt-2">
              Keira L. Reid <br />
              RN, BSN Director @ Thryve.Today
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-6">
              <p>
                Office: <a href="tel:9794847983" className="text-blue-600 hover:text-blue-800 hover:underline">979-484-7983</a>
              </p>
              <p>
                Email: <a href="mailto:keira@thryve.today" className="text-blue-600 hover:text-blue-800 hover:underline">keira@thryve.today</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer image with responsive container */}
      <div className="w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] overflow-hidden">
        <Image
          src="/footer.png"
          width={1200}
          height={1200}
          alt="Footer image"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}