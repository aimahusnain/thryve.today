// File: app/api/courses/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Error fetching courses' }, { status: 500 });
  }
}