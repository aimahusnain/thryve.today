import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get a specific course by ID
      const course = await prisma.courses.findUnique({
        where: {
          id: id,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(course);
    } else {
      // Build the where clause for filtering
      
      const whereClause = {};

      // Get all courses with optional filtering
      const courses = await prisma.courses.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      });
      
      return NextResponse.json(courses);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const course = await prisma.courses.create({
      data: {
        name: body.name,
        duration: body.duration,
        price: body.price,
        description: body.description,
        classroom: body.classroom,
        Lab: body.Lab,
        Clinic: body.Clinic,
        WhoShouldAttend: body.WhoShouldAttend,
        ProgramHighlights: body.ProgramHighlights,
        status: body.status || "DRAFT",
        Note: body.Note,
      },
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const course = await prisma.courses.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        duration: body.duration,
        price: body.price,
        description: body.description,
        classroom: body.classroom,
        Lab: body.Lab,
        Clinic: body.Clinic,
        WhoShouldAttend: body.WhoShouldAttend,
        ProgramHighlights: body.ProgramHighlights,
        status: body.status,
        Note: body.Note,
      },
    });
    
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    
    await prisma.courses.delete({
      where: {
        id: id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

// Optional: Add a new endpoint for getting only published courses
// You can call this with: /api/courses?status=published
// This is already handled in the main GET endpoint above