import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    // Get stored OTP data
    const passwordResets = global.passwordResets || {}
    const resetData = passwordResets[email]

    if (!resetData) {
      return NextResponse.json({ error: "No OTP request found for this email" }, { status: 404 })
    }

    // Check if OTP has expired
    if (new Date() > resetData.expiresAt) {
      delete passwordResets[email]
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // Verify OTP
    if (resetData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Return reset token for the next step
    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        resetToken: resetData.resetToken,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in verify-otp:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}

