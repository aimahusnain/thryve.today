import nodemailer from "nodemailer"

// Setup transporter for Office365
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.office365.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Generic send email
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Thryve" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
      to,
      subject,
      html,
    })
    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

// Send OTP email with your old design
export async function sendOtpEmail(to: string, otp: string) {
  const subject = "Password Reset OTP - Thryve.Today"
  const html = `
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
    <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 48px 40px; position: relative;">
      <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">New Password Reset Request</div>
      <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.today</div>
    </div>

    <div style="padding: 48px 40px;">
      <p style="font-size: 16px; color: #444444; line-height: 1.6;">We received a request to reset your password. Use the verification code below to complete the process:</p>

      <div style="background-color: #f8f9fa; padding: 25px; text-align: center; margin: 30px 0; border-radius: 12px; border-left: 4px solid #2DB188; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
        <h2 style="font-size: 36px; color: #2DB188; margin: 0; letter-spacing: 10px; font-weight: 700;">${otp}</h2>
        <div style="width: 80px; height: 4px; background-color: #2DB188; margin: 15px auto; opacity: 0.5; border-radius: 2px;"></div>
        <p style="font-size: 14px; color: #666666; margin: 0; font-weight: 500;">This code will expire in 10 minutes</p>
      </div>

      <p style="font-size: 15px; color: #555555; line-height: 1.5;">If you didn't request a password reset, please ignore this email or contact our support team if you believe your account security may be at risk.</p>
    </div>

    <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0;">
      <p style="font-size: 14px; color: #777777; margin: 0;">&copy; ${new Date().getFullYear()} Thryve.Today. All rights reserved.</p>
    </div>
  </div>
  `
  return await sendEmail(to, subject, html)
}

// Send purchase confirmation email
export async function sendPurchaseConfirmationEmail(to: string, userName: string, courseNames: string[]) {
  const courseList = courseNames.map((course) => `<div style="margin-bottom: 8px;">• ${course}</div>`).join("")

  const subject = "Purchase Confirmation - Thryve.Today"
  const html = `
<div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 48px 40px; position: relative;">
    <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">Purchase Confirmed</div>
    <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.Today Medical Training</div>
  </div>
  <div style="padding: 48px 40px;">
    <div style="margin-bottom: 30px;">
      <div style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hello ${userName},</div>
      <div style="color: #475569; font-size: 16px; line-height: 1.6;">
        Thank you for your purchase! Your enrollment is now complete.
      </div>
    </div>

    <div style="background: #f0fdf4; border-radius: 16px; padding: 32px; margin-bottom: 30px;">
      <div style="color: #059669; font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Courses Purchased</div>
      <div style="color: #334155; font-size: 15px; line-height: 1.8;">
        ${courseList}
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://thryve.today'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View My Courses
      </a>
    </div>

    <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
      You can access your courses by logging into your account. If you have any questions, please contact our support team.
    </div>
  </div>
  <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Thryve.Today. All rights reserved.</p>
  </div>
</div>
  `
  return await sendEmail(to, subject, html)
}
