import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendOtpEmail } from "@/lib/email"
import crypto from "crypto"

const prisma = new PrismaClient()

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if this user has a Google account
    const hasGoogleAccount = user.accounts?.some((account) => account.provider === "google")

    // If user originally signed up with Google, they should use Google to sign in
    if (hasGoogleAccount && !user.password) {
      return NextResponse.json({ error: "Please sign in with Google for this account" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in database with expiration (10 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Create or update password reset record
    // Note: You would need to add a PasswordReset model to your Prisma schema
    // This is a temporary solution for the demo
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Store OTP and token in a global variable (in production, use Redis or database)
    global.passwordResets = global.passwordResets || {}
    global.passwordResets[email] = {
      otp,
      resetToken,
      expiresAt,
    }

    // Send OTP email
    await sendOtpEmail(email, otp)

    return NextResponse.json({ success: true, message: "OTP sent to email" }, { status: 200 })
  } catch (error) {
    console.error("Error in forgot-password:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

