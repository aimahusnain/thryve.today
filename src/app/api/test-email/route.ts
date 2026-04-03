import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get("email") || "test@example.com" // Use query param or default

    const html = `
<div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 48px 40px; position: relative;">
    <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">Test Email</div>
    <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.Today Medical Training</div>
  </div>
  <div style="padding: 48px 40px;">
    <div style="margin-bottom: 30px;">
      <div style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hello Test User,</div>
      <div style="color: #475569; font-size: 16px; line-height: 1.6;">
        This is a test email to verify the email configuration is working correctly.
      </div>
    </div>
    <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
      If you received this email, the configuration is correct!
    </div>
  </div>
  <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Thryve.Today. All rights reserved.</p>
  </div>
</div>
    `

    await sendEmail(testEmail, "Test Email - Thryve.Today", html)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      sentTo: testEmail
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test email"
    }, { status: 500 })
  }
}
