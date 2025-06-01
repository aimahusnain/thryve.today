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

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        {
          error:
            "SMTP credentials not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.",
        },
        { status: 500 },
      )
    }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Additional options for better compatibility
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify SMTP connection
    try {
      await transporter.verify()
      console.log("SMTP connection verified successfully")
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError)
      return NextResponse.json(
        {
          error: "SMTP connection failed. Please check your email configuration.",
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

    // Create email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">${subject}</h1>
            </div>
            <div style="line-height: 1.6; color: #374151; font-size: 16px;">
              ${htmlContent}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This email was sent from your team management dashboard.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send emails with better error handling
    const emailResults = []
    const failedEmails = []

    for (const email of to) {
      try {
        const result = await transporter.sendMail({
          from: `"Team Dashboard" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
          to: email,
          subject: subject,
          html: emailTemplate,
          text: content, // Plain text fallback
        })

        emailResults.push({
          email,
          messageId: result.messageId,
          status: "sent",
        })

        console.log(`Email sent successfully to ${email}:`, result.messageId)
      } catch (emailError) {
        console.error(`Failed to send email to ${email}:`, emailError)
        failedEmails.push({
          email,
          error: (emailError instanceof Error ? emailError.message : String(emailError)),
        })
      }
    }

    // Determine response based on results
    const successCount = emailResults.length
    const failureCount = failedEmails.length

    if (successCount === 0) {
      return NextResponse.json(
        {
          error: "Failed to send emails to all recipients",
          failedEmails,
          details: failedEmails,
        },
        { status: 500 },
      )
    }

    if (failureCount > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Email sent to ${successCount} recipients, ${failureCount} failed`,
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
      emailResults,
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      {
        error: "Internal server error while sending email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
