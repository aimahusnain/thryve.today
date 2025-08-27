import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { sendEmail } from "@/lib/email" // optional confirmation email

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json()

    if (!email || !token || !password) {
      return NextResponse.json({ error: "Email, token, and password are required" }, { status: 400 })
    }

    // Ensure global.passwordResets is initialized
    if (!global.passwordResets) {
      global.passwordResets = {}
    }

    const resetData = global.passwordResets[email]
    if (!resetData) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Token verification
    if (resetData.resetToken !== token) {
      return NextResponse.json({ error: "Invalid reset token" }, { status: 400 })
    }

    // Expiry check
    if (new Date() > resetData.expiresAt) {
      delete global.passwordResets[email]
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update in DB
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Clean up
    delete global.passwordResets[email]

    // ✅ Optional: Send confirmation email
    const html = `
      <div style="max-width: 600px; margin: 40px auto; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
        <div style="padding: 40px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: center;">
          <h2 style="color: #2DB188;">Password Reset Successful</h2>
          <p>Your password for <b>${email}</b> has been reset successfully.</p>
          <p>If you did not perform this action, please contact support immediately.</p>
        </div>
      </div>
    `
    await sendEmail(email, "Password Reset Confirmation - Thryve.Today", html)

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in reset-password:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
