import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { sendEmail } from "@/lib/email"

const prisma = new PrismaClient()

async function sendWelcomeEmail(to: string, userName: string) {
  const html = `
<div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 48px 40px; position: relative;">
    <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">Welcome Aboard</div>
    <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.Today Medical Training</div>
  </div>
  <div style="padding: 48px 40px;">
    <div style="margin-bottom: 30px;">
      <div style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hello ${userName},</div>
      <div style="color: #475569; font-size: 16px; line-height: 1.6;">
        Welcome to Thryve.Today! We're excited to have you join our community of healthcare professionals.
      </div>
    </div>

    <div style="background: #f0f9ff; border-radius: 16px; padding: 32px; margin-bottom: 30px;">
      <div style="color: #0369a1; font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Get Started</div>
      <div style="color: #334155; font-size: 15px; line-height: 1.8;">
        <div style="margin-bottom: 12px;">• Browse our catalog of healthcare courses</div>
        <div style="margin-bottom: 12px;">• Enroll in courses that interest you</div>
        <div style="margin-bottom: 12px;">• Track your progress in your personal dashboard</div>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://thryve.today'}/courses" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Explore Courses
      </a>
    </div>

    <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
      If you have any questions, our support team is here to help. Just reply to this email!
    </div>
  </div>
  <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Thryve.Today. All rights reserved.</p>
  </div>
</div>
  `
  await sendEmail(to, "Welcome to Thryve.Today!", html)
}

export async function POST(request: Request) {
  try {
    const { name, email, telephone, password } = await request.json()

    // Validate input
    if (!name || !email || !password || !telephone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Check if the user is permanently deleted
      if (existingUser.isDeleted === true) {
        return NextResponse.json({ message: "User with this account is permanently deleted" }, { status: 403 })
      }

      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        telephone,
        password: hashedPassword,
        role: "USER", // Default role for new users
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name)
      console.log(`Welcome email sent successfully to ${email}`)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Continue with registration even if email fails
    }

    // Return user without password
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}