import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, telephone, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
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