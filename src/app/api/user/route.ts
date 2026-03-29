import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  try {
    const requestData = await req.json();
    const { name, email, role } = requestData;
    
    // Find the current user to check permissions
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 });
    }
    
    // Only admins can update roles
    const isAdmin = currentUser.role === "ADMIN";
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name,
        role: isAdmin ? role : undefined, // Only apply role change if current user is admin
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" }, 
      { status: 500 }
    );
  }
}