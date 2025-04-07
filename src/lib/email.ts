import nodemailer from "nodemailer"

// Create a transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send OTP email
export async function sendOtpEmail(email: string, otp: string) {
  const transporter = createTransporter()
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP - Thryve.Today",
    html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);">
      <div style="background: linear-gradient(135deg, #2DB188 0%, #25a07a 100%); padding: 35px 20px; text-align: center;">
        <h1 style="font-size: 28px; color: #ffffff; margin: 0; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">Password Reset</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 15px; font-weight: 500;">Secure your account</p>
      </div>
      
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <p style="font-size: 17px; color: #333333; line-height: 1.5; margin-top: 0; font-weight: 500;">Hello,</p>
        <p style="font-size: 16px; color: #444444; line-height: 1.6;">We received a request to reset your password. Use the verification code below to complete the process:</p>
        
        <div style="background-color: #f8f9fa; padding: 25px; text-align: center; margin: 30px 0; border-radius: 12px; border-left: 4px solid #2DB188; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
          <h2 style="font-size: 36px; color: #2DB188; margin: 0; letter-spacing: 10px; font-weight: 700;">${otp}</h2>
          <div style="width: 80px; height: 4px; background-color: #2DB188; margin: 15px auto; opacity: 0.5; border-radius: 2px;"></div>
          <p style="font-size: 14px; color: #666666; margin: 0; font-weight: 500;">This code will expire in 10 minutes</p>
        </div>
        
        <div style="background-color: rgba(45, 177, 136, 0.08); border-radius: 8px; padding: 15px; margin: 25px 0;">
          <p style="font-size: 15px; color: #444444; margin: 0; line-height: 1.5;">
            <span style="color: #2DB188; font-weight: 600;">Security Tip:</span> Never share this code with anyone, including Thryve.Today staff.
          </p>
        </div>
        
        <p style="font-size: 15px; color: #555555; line-height: 1.5;">If you didn't request a password reset, please ignore this email or contact our support team if you believe your account security may be at risk.</p>
        
        <div style="margin-top: 35px; text-align: center;">
          <a href="#" style="display: inline-block; background-color: #2DB188; color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 5px rgba(45, 177, 136, 0.3);">Contact Support</a>
        </div>
      </div>
      
      <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0;">
        <img src="https://sjc.microlink.io/hdhQ_8dOk0vag0Ubm6UfE4b-52Gh2wB-svl9Wfeca7agKbrskZMBR3MJiNnsU3V66XFJJwiLwLzYH55gSVuInQ.jpeg" alt="Thryve Logo" style="height: 30px; width: auto; margin-bottom: 15px; display: none;">
        <p style="font-size: 14px; color: #777777; margin: 0; line-height: 1.5;">&copy; ${new Date().getFullYear()} <span style="color: #2DB188; font-weight: 600;">Thryve.Today</span>. All rights reserved.</p>
        <p style="font-size: 13px; color: #999999; margin-top: 8px;">123 Wellness Street, Health City, HC 12345</p>
      </div>
    </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

