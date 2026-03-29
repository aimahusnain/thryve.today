// lib/courses.ts
import { prisma } from '@/lib/prisma' // Adjust path to your Prisma instance

// Type definition based on your Prisma schema
export type Course = {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: string;
};

// Server function to fetch courses
export async function getCourses(): Promise<Course[]> {
  const courses = await prisma.courses.findMany({
    where: {
      status: 'ACTIVE'
    },
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      status: true,
    },
    orderBy: {
      name: 'asc'
    }
  })
  
  return courses
}