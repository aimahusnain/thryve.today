import nodemailer from "nodemailer"

// Create a transporter
const createTransporter = () => {
  console.log("Creating email transporter with user:", process.env.EMAIL_USER?.substring(0, 3) + "***")
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send purchase confirmation email
export async function sendPurchaseConfirmationEmail(email: string, name: string, courseNames: string[]) {
  console.log(`Attempting to send purchase confirmation email to: ${email}`)
  console.log(`Courses purchased: ${JSON.stringify(courseNames)}`)

  if (!email) {
    console.error("Cannot send email: No email address provided")
    return { success: false, error: "No email address provided" }
  }

  if (!courseNames || courseNames.length === 0) {
    console.warn("Sending email with empty course list")
  }

  try {
    const transporter = createTransporter()

    // Test transporter connection
    const verifyResult = await transporter.verify()
    console.log("Transporter verification result:", verifyResult)

    // Generate course list HTML
      courseNames.length > 0
        ? courseNames
            .map(
              (course) => `
          <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
            <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
              <span style="color: #2DB188; margin-right: 8px;">✓</span>${course}
            </p>
          </div>
        `,
            )
            .join("")
        : `<div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
           <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
             <span style="color: #2DB188; margin-right: 8px;">✓</span>Your course
           </p>
         </div>`

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to the Thryve.Today Training Center! ",
      html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 640px; margin: 30px auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #2DB188, #25a07a); padding: 40px 30px; text-align: center;">
    <h1 style="font-size: 30px; color: #ffffff; margin: 0; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">Welcome to Thryve.Today</h1>
    <p style="color: rgba(255, 255, 255, 0.95); margin: 12px 0 0; font-size: 16px; font-weight: 500;">Your Healthcare Training Journey Starts Now</p>
  </div>

  <!-- Body -->
  <div style="padding: 45px 35px; background-color: #ffffff;">
    <p style="font-size: 18px; color: #333333; line-height: 1.6; margin-top: 0; font-weight: 600;">Hello ${name || "there"},</p>

    <p style="font-size: 16px; color: #444444; line-height: 1.8; margin-bottom: 20px;">
      Welcome to the <strong>Thryve.Today Training Center!</strong> We are thrilled to have you embark on this unique journey to becoming a skilled and compassionate healthcare professional.
    </p>

    <p style="font-size: 16px; color: #444444; line-height: 1.8;">Our program, unlike any other, will equip you with the knowledge and hands-on experience necessary to excel in the dynamic and rewarding field of healthcare.</p>
    
    <p style="font-size: 16px; color: #444444; line-height: 1.8;">Throughout your studies, you will work alongside experienced professionals, developing the skills essential for success in this field.</p>

    <p style="font-size: 16px; color: #444444; line-height: 1.8;">At Thryve.Today, your success is our top priority. Our instructors are dedicated to creating a nurturing learning environment that promotes growth, curiosity, and practical learning.</p>

    <!-- List -->
    <div style="margin: 35px 0 25px;">
      <h2 style="font-size: 20px; color: #2DB188; margin-bottom: 15px; font-weight: 600;">Here are a few important things to keep in mind as you start your program:</h2>
      <ul style="font-size: 15px; color: #444444; line-height: 1.8; padding-left: 20px; margin: 0;">
        <li style="margin-bottom: 12px;"><strong>Training and Support:</strong> Real-world hands-on training backed by committed staff and faculty.</li>
        <li style="margin-bottom: 12px;"><strong>Safety and Best Practices:</strong> You’ll be taught industry-standard protocols to protect you and your patients.</li>
        <li style="margin-bottom: 12px;"><strong>Collaboration:</strong> We encourage peer-to-peer and instructor teamwork for strong communication and networking.</li>
        <li><strong>Opportunities for Growth:</strong> Our programs open doors to careers in hospitals, labs, clinics, and more.</li>
      </ul>
    </div>

    <p style="font-size: 16px; color: #444444; line-height: 1.8;">We are proud of your commitment and are here to guide you every step of the way. If you need help, feel free to contact your instructor or our Program Coordinator.</p>

    <p style="font-size: 16px; color: #444444; line-height: 1.8;">We can't wait to witness your success. Welcome to our community of healthcare professionals making a difference every day.</p>

    <!-- Signature -->
    <div style="margin-top: 35px;">
      <p style="font-size: 16px; color: #333333; line-height: 1.6;">
        <strong>Best regards,</strong><br/>
        Keira L. Reid<br/>
        RN, BSN Director @ Thryve.Today<br/>
        <span style="color: #777;">Office: 979-484-7983<br/>Email: <a href="mailto:keira@thryve.today" style="color: #2DB188; text-decoration: none;">keira@thryve.today</a></span>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0;">
    <img src="https://sjc.microlink.io/hdhQ_8dOk0vag0Ubm6UfE4b-52Gh2wB-svl9Wfeca7agKbrskZMBR3MJiNnsU3V66XFJJwiLwLzYH55gSVuInQ.jpeg" alt="Thryve Logo" style="height: 30px; width: auto; margin-bottom: 15px; display: none;">
    <p style="font-size: 14px; color: #777777; margin: 0;">&copy; ${new Date().getFullYear()} <span style="color: #2DB188; font-weight: 600;">Thryve.Today</span>. All rights reserved.</p>
    <p style="font-size: 13px; color: #999999; margin-top: 8px;">123 Wellness Street, Health City, HC 12345</p>
  </div>
</div>

      `,
    }

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Send welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  console.log(`Attempting to send welcome email to: ${email}`)

  if (!email) {
    console.error("Cannot send welcome email: No email address provided")
    return { success: false, error: "No email address provided" }
  }

  try {
    const transporter = createTransporter()

    // Test transporter connection
    const verifyResult = await transporter.verify()
    console.log("Transporter verification result:", verifyResult)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Thryve.Today Training Center!",
      html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);">
        <div style="background: linear-gradient(135deg, #2DB188 0%, #25a07a 100%); padding: 35px 20px; text-align: center;">
          <h1 style="font-size: 28px; color: #ffffff; margin: 0; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">Welcome to Thryve.Today</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 15px; font-weight: 500;">Your journey to healthcare excellence begins now</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <p style="font-size: 17px; color: #333333; line-height: 1.5; margin-top: 0; font-weight: 500;">Hello ${name || "there"},</p>
          
          <p style="font-size: 16px; color: #444444; line-height: 1.6;">Welcome to the Thryve.Today Training Center! We are thrilled to have you embark on this unique journey to becoming a skilled and compassionate healthcare professional. Our program, unlike any other, will equip you with the knowledge and hands-on experience necessary to excel in the dynamic and rewarding field of healthcare.</p>
          
          <p style="font-size: 16px; color: #444444; line-height: 1.6;">Throughout your studies, you will have the opportunity to work alongside experienced professionals, developing the skills that are essential for success in this field.</p>
          
          <p style="font-size: 16px; color: #444444; line-height: 1.6;">At Thryve.Today, your success is our top priority. Our instructors are dedicated to creating a nurturing learning environment that promotes growth, curiosity, and practical learning. We offer hands-on training to ensure you feel confident and well-prepared for your clinical experiences and certification exams.</p>
          
          <div style="margin: 30px 0;">
            <h2 style="font-size: 20px; color: #2DB188; margin-bottom: 15px; font-weight: 600;">Important Things to Keep in Mind:</h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
              <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
                <span style="color: #2DB188; margin-right: 8px;">•</span><strong>Training and Support:</strong> Our program combines classroom instruction with real-world, hands-on training. You will be fully supported throughout your journey by faculty and staff who are deeply committed to your success.
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
              <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
                <span style="color: #2DB188; margin-right: 8px;">•</span><strong>Safety and Best Practices:</strong> We place a strong emphasis on the importance of safety and professionalism in the healthcare setting. You will be taught industry-standard protocols to ensure that both you and your patients are always protected.
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
              <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
                <span style="color: #2DB188; margin-right: 8px;">•</span><strong>Collaboration:</strong> All of our programs involve working closely with others, so we encourage collaboration with your peers, instructors, and healthcare professionals. This will help you build strong communication skills and expand your network.
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #2DB188;">
              <p style="font-size: 16px; color: #333333; margin: 0; font-weight: 500;">
                <span style="color: #2DB188; margin-right: 8px;">•</span><strong>Opportunities for Growth:</strong> Your time in our programs will open doors to a range of career opportunities in hospitals, laboratories, clinics, and other settings. Upon successful completion of the program, you will be well-positioned to begin your career with the confidence and experience needed to thrive.
              </p>
            </div>
          </div>
          
          <p style="font-size: 16px; color: #444444; line-height: 1.6;">We are so proud of the commitment you've shown in choosing this career path, and we are here to guide and support you every step of the way. If you have any questions or need assistance, please don't hesitate to contact your instructor or our Program Coordinator.</p>
          
          <p style="font-size: 16px; color: #444444; line-height: 1.6;">We eagerly anticipate witnessing your growth and success throughout this program. We are excited for you to become part of our community of healthcare professionals who make a profound difference in patients' lives every day.</p>
          
          <div style="background-color: rgba(45, 177, 136, 0.08); border-radius: 8px; padding: 15px; margin: 25px 0;">
            <p style="font-size: 15px; color: #444444; margin: 0; line-height: 1.5;">
              <span style="color: #2DB188; font-weight: 600;">Best regards,</span><br>
              Keira L. Reid<br>
              RN, BSN Director @ Thryve.Today<br>
              Office Number: 979-484-7983<br>
              Email: keira@thryve.today
            </p>
          </div>
          
          <div style="margin-top: 35px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="display: inline-block; background-color: #2DB188; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 5px rgba(45, 177, 136, 0.3);">Explore Our Courses</a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0;">
          <img src="https://sjc.microlink.io/MPARN5Q2FJQDcS6fCydFeoNC72Obw-c33NYFTjZW8MYkuVb4LMqTLoYDtQA-5NLn99m4X-a8PecPRgo-paUpIQ.jpeg" alt="Thryve Logo" style="height: 60px; width: auto; margin-bottom: 15px;">
          <p style="font-size: 14px; color: #777777; margin: 0; line-height: 1.5;">&copy; ${new Date().getFullYear()} <span style="color: #2DB188; font-weight: 600;">Thryve.Today</span>. All rights reserved.</p>
          <p style="font-size: 13px; color: #999999; margin-top: 8px;">Transform Your Life with Quality Medical Training</p>
        </div>
      </div>
      `,
    }

    console.log("Sending welcome email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const result = await transporter.sendMail(mailOptions)
    console.log("Welcome email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
