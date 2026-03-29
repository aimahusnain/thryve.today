import nodemailer from "nodemailer"
import { formatDistanceToNow } from "date-fns"

/**
 * Result interface for email operations
 */
interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Configuration for the email transporter
 */
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || 587),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  from: process.env.EMAIL_FROM || "noreply@healthcaretraining.com",
}

/**
 * Create a reusable transporter object using SMTP transport
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  })
}

/**
 * Send a purchase confirmation email
 * @param to Email address to send to
 * @param userName Name of the user
 * @param courseNames Array of course names
 * @returns Promise with success status and optional error
 */
export async function sendPurchaseConfirmationEmail(
  to: string,
  userName: string,
  courseNames: string[],
): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    // Format the course list
    const courseList = courseNames.map((course) => `• ${course}`).join("\n")

    // Create email content
    const mailOptions = {
      from: `Healthcare Training <${emailConfig.from}>`,
      to,
      subject: "Your Course Purchase Confirmation",
      text: `
Hello ${userName},

Thank you for your purchase! Your enrollment is now complete.

Courses purchased:
${courseList}

You can access your courses by logging into your account.

If you have any questions, please contact our support team.

Best regards,
The Healthcare Training Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #35dba8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
    .course-list { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .button { display: inline-block; background-color: #35dba8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Purchase Confirmation</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      <p>Thank you for your purchase! Your enrollment is now complete.</p>
      
      <div class="course-list">
        <h3>Courses purchased:</h3>
        <ul>
          ${courseNames.map((course) => `<li>${course}</li>`).join("")}
        </ul>
      </div>
      
      <p>You can access your courses by logging into your account.</p>
      <p>If you have any questions, please contact our support team.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View My Courses</a>
    </div>
    <div class="footer">
      <p>Best regards,<br>The Healthcare Training Team</p>
      <p>© ${new Date().getFullYear()} Healthcare Training. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log("Purchase confirmation email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

/**
 * Send a welcome email to a new user
 * @param to Email address to send to
 * @param userName Name of the user
 * @returns Promise with success status and optional error
 */
export async function sendWelcomeEmail(to: string, userName: string): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `Healthcare Training <${emailConfig.from}>`,
      to,
      subject: "Welcome to Healthcare Training",
      text: `
Hello ${userName},

Welcome to Healthcare Training! We're excited to have you join our community of healthcare professionals.

Here's what you can do now:
• Browse our catalog of healthcare courses
• Enroll in courses that interest you
• Track your progress in your personal dashboard

If you have any questions, our support team is here to help.

Best regards,
The Healthcare Training Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #35dba8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
    .features { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .button { display: inline-block; background-color: #35dba8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Healthcare Training</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      <p>Welcome to Healthcare Training! We're excited to have you join our community of healthcare professionals.</p>
      
      <div class="features">
        <h3>Here's what you can do now:</h3>
        <ul>
          <li>Browse our catalog of healthcare courses</li>
          <li>Enroll in courses that interest you</li>
          <li>Track your progress in your personal dashboard</li>
        </ul>
      </div>
      
      <p>If you have any questions, our support team is here to help.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" class="button">Explore Courses</a>
    </div>
    <div class="footer">
      <p>Best regards,<br>The Healthcare Training Team</p>
      <p>© ${new Date().getFullYear()} Healthcare Training. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Welcome email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

/**
 * Send a password reset email
 * @param to Email address to send to
 * @param userName Name of the user
 * @param resetToken Reset token
 * @param expiryTime Expiry time of the token
 * @returns Promise with success status and optional error
 */
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetToken: string,
  expiryTime: Date,
): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    const expiryTimeString = formatDistanceToNow(expiryTime, { addSuffix: true })

    const mailOptions = {
      from: `Healthcare Training <${emailConfig.from}>`,
      to,
      subject: "Reset Your Password",
      text: `
Hello ${userName},

We received a request to reset your password. If you didn't make this request, you can ignore this email.

To reset your password, click the link below:
${resetLink}

This link will expire ${expiryTimeString}.

Best regards,
The Healthcare Training Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #35dba8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
    .warning { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; color: #856404; }
    .button { display: inline-block; background-color: #35dba8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
      
      <div class="warning">
        <p>This link will expire ${expiryTimeString}.</p>
      </div>
      
      <p>To reset your password, click the button below:</p>
      
      <a href="${resetLink}" class="button">Reset Password</a>
      
      <p style="margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>The Healthcare Training Team</p>
      <p>© ${new Date().getFullYear()} Healthcare Training. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

/**
 * Send a course completion certificate email
 * @param to Email address to send to
 * @param userName Name of the user
 * @param courseName Name of the completed course
 * @param certificateUrl URL to download the certificate
 * @returns Promise with success status and optional error
 */
export async function sendCourseCompletionEmail(
  to: string,
  userName: string,
  courseName: string,
  certificateUrl: string,
): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `Healthcare Training <${emailConfig.from}>`,
      to,
      subject: `Congratulations on Completing ${courseName}`,
      text: `
Hello ${userName},

Congratulations on completing the "${courseName}" course! This is a significant achievement in your healthcare training journey.

You can download your certificate using the link below:
${certificateUrl}

We hope you found the course valuable and look forward to supporting your continued education.

Best regards,
The Healthcare Training Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #35dba8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
    .certificate { background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; color: #2e7d32; }
    .button { display: inline-block; background-color: #35dba8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Course Completion Certificate</h1>
    </div>
    <div class="content">
      <p>Hello ${userName},</p>
      <p>Congratulations on completing the <strong>"${courseName}"</strong> course! This is a significant achievement in your healthcare training journey.</p>
      
      <div class="certificate">
        <h3>Your Certificate is Ready!</h3>
        <p>You can download your certificate using the button below.</p>
      </div>
      
      <a href="${certificateUrl}" class="button">Download Certificate</a>
      
      <p style="margin-top: 20px;">We hope you found the course valuable and look forward to supporting your continued education.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>The Healthcare Training Team</p>
      <p>© ${new Date().getFullYear()} Healthcare Training. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Course completion email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending course completion email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

/**
 * Send a general notification email
 * @param to Email address to send to
 * @param subject Email subject
 * @param message Email message
 * @returns Promise with success status and optional error
 */
export async function sendNotificationEmail(to: string, subject: string, message: string): Promise<EmailResult> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `Healthcare Training <${emailConfig.from}>`,
      to,
      subject,
      text: message,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #35dba8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${subject}</h1>
    </div>
    <div class="content">
      ${message}
    </div>
    <div class="footer">
      <p>Best regards,<br>The Healthcare Training Team</p>
      <p>© ${new Date().getFullYear()} Healthcare Training. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Notification email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending notification email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error sending email",
    }
  }
}

/**
 * Verify email configuration is working
 * @returns Promise with success status and optional error
 */
export async function verifyEmailConfig(): Promise<EmailResult> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true }
  } catch (error) {
    console.error("Email configuration verification failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error verifying email configuration",
    }
  }
}
