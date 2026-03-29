import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendOtpEmail } from "@/lib/email"
import crypto from "crypto"

const prisma = new PrismaClient()

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const hasGoogleAccount = user.accounts?.some(acc => acc.provider === "google")
    if (hasGoogleAccount && !user.password) {
      return NextResponse.json({ error: "Please sign in with Google for this account" }, { status: 400 })
    }

    const otp = generateOTP()
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    global.passwordResets = global.passwordResets || {}
    global.passwordResets[email] = { otp, resetToken, expiresAt }

    await sendOtpEmail(email, otp)

    return NextResponse.json({ success: true, message: "OTP sent to email" }, { status: 200 })
  } catch (error) {
    console.error("Error in forgot-password:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
