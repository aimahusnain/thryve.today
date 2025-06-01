import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, content } = body

    // Validate the request
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ error: "Recipients are required" }, { status: 400 })
    }

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 })
    }

    // Create transporter using your Gmail credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // klreid0215@gmail.com
        pass: process.env.EMAIL_PASS, // ghyj uknt tmgz coky
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
      console.log("Gmail SMTP connection verified successfully")
    } catch (verifyError) {
      console.error("Gmail SMTP verification failed:", verifyError)
      return NextResponse.json(
        {
          error: "Gmail SMTP connection failed. Please check your email configuration.",
          details: typeof verifyError === "object" && verifyError !== null && "message" in verifyError ? (verifyError as { message?: string }).message : String(verifyError),
        },
        { status: 500 },
      )
    }

    // Convert markdown-style formatting to HTML
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/\n/g, "<br>")

    // Create professional email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${subject}
              </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="line-height: 1.7; color: #475569; font-size: 16px; margin-bottom: 30px;">
                ${htmlContent}
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 25px 30px; border-top: 1px solid #e2e8f0;">
              <div style="text-align: center; color: #64748b; font-size: 14px;">
                <p style="margin: 0 0 8px 0; font-weight: 500;">📧 Team Management Dashboard</p>
                <p style="margin: 0; opacity: 0.8;">This email was sent from your team management system</p>
              </div>
            </div>
          </div>
          
          <!-- Footer spacing -->
          <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">Powered by Thryve.Today1</p>
          </div>
        </body>
      </html>
    `

    // Send emails with detailed tracking
    const emailResults = []
    const failedEmails = []

    console.log(`Starting to send emails to ${to.length} recipients...`)

    for (let i = 0; i < to.length; i++) {
      const email = to[i]
      try {
        console.log(`Sending email ${i + 1}/${to.length} to: ${email}`)

        const result = await transporter.sendMail({
          from: `"Thryve.Today" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: emailTemplate,
          text: content, // Plain text fallback
        })

        emailResults.push({
          email,
          messageId: result.messageId,
          status: "sent",
          timestamp: new Date().toISOString(),
        })

        console.log(`✅ Email sent successfully to ${email} - Message ID: ${result.messageId}`)
      } catch (emailError) {
        const errorMsg =
          typeof emailError === "object" && emailError !== null && "message" in emailError
            ? (emailError as { message?: string }).message
            : String(emailError)
        console.error(`❌ Failed to send email to ${email}:`, errorMsg)
        failedEmails.push({
          email,
          error: errorMsg,
          timestamp: new Date().toISOString(),
        })
      }

      // Add small delay between emails to avoid rate limiting
      if (i < to.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    // Determine response based on results
    const successCount = emailResults.length
    const failureCount = failedEmails.length

    console.log(`Email sending completed: ${successCount} successful, ${failureCount} failed`)

    if (successCount === 0) {
      return NextResponse.json(
        {
          error: "Failed to send emails to all recipients",
          failedEmails,
          totalAttempted: to.length,
        },
        { status: 500 },
      )
    }

    if (failureCount > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Email sent to ${successCount} out of ${to.length} recipients`,
          recipients: successCount,
          totalAttempted: to.length,
          successfulEmails: emailResults,
          failedEmails,
          partialSuccess: true,
        },
        { status: 207 },
      ) // 207 Multi-Status
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to all ${successCount} recipients`,
      recipients: successCount,
      totalAttempted: to.length,
      emailResults,
    })
  } catch (error) {
    console.error("❌ Email sending error:", error)
    return NextResponse.json(
      {
        error: "Internal server error while sending email",
        details: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error),
      },
      { status: 500 },
    )
  }
}
