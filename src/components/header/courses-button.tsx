'use client'

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useCart2 } from "@/components/cart/cart-provider"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// Type definition based on your Prisma schema
type Course = {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: string;
  description?: string;
  classroom?: string;
  Lab?: string;
  Clinic?: string;
  WhoShouldAttend?: string;
  ProgramHighlights?: string;
  Note?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Helper function to determine course category based on name
function getCourseCategory(courseName: string): string {
  const name = courseName.toLowerCase();
  if (name.includes('bls') || name.includes('acls') || name.includes('pals') || 
      name.includes('life support') || name.includes('cpr')) {
    return 'life-support';
  }
  return 'certification';
}

// Enroll Now Button Component
function EnrollNowButton({ course }: { course: Course }) {
  const [isAdding, setIsAdding] = useState(false)
  const cartContext = useCart2()
  const router = useRouter()
  const { data: session } = useSession()
  
  const isLoggedIn = !!(session?.user?.email || session?.user?.name)
  
  // Debug: Log available cart context properties
  console.log('Cart context:', Object.keys(cartContext))
  
  // Use available cart context properties for cart items
  const cartItems = cartContext.items || []
  const addToCart2 = cartContext.addToCart2
  
  // Check if course is already in cart
  const isInCart = Array.isArray(cartItems) && cartItems.some(item => 
    item.courseId === course.id || item.id === course.id
  )

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent NavigationMenuLink default behavior
    e.stopPropagation()
    
    // If already in cart, do nothing
    if (isInCart) return
    
    setIsAdding(true)
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push(`/log-in`)
      setIsAdding(false)
      return
    }
    
    try {
      await addToCart2(course.id, course.name, course.price, course.duration || "")
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isAdding || isInCart}
      size="sm"
      className={`w-full mt-3 border-0 transition-all duration-300 ease-in-out font-medium
        ${isInCart 
          ? "bg-gray-100 hover:bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed" 
          : "bg-[#2db188] hover:bg-[#2db188]/90 text-white transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        }`}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {isAdding ? "Adding..." : isInCart ? "Already in Cart" : "Enroll Now"}
    </Button>
  )
}

function CourseListItem({ course }: { course: Course }) {
  const category = getCourseCategory(course.name);
  
  return (
    <div className="group">
      <div 
        className="block select-none space-y-3 rounded-lg p-4 leading-none no-underline outline-none 
                   transition-all duration-300 hover:bg-accent hover:text-accent-foreground 
                   focus:bg-accent focus:text-accent-foreground dark:hover:bg-accent 
                   dark:hover:text-accent-foreground border border-transparent 
                   hover:border-[#2db188]/20 hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="text-sm font-semibold leading-tight group-hover:text-[#2db188] 
                           dark:group-hover:text-[#2db188] transition-colors duration-300">
              {course.name}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#2db188]/10 px-2.5 py-1 
                               text-xs font-medium text-[#2db188] dark:bg-[#2db188]/20 dark:text-[#2db188]">
                  {category === 'certification' ? 'Certification' : 'Life Support'}
                </span>
                <div className="flex items-center text-xs text-muted-foreground dark:text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </div>
              </div>
              
              <div className="text-sm font-bold text-[#2db188] bg-[#2db188]/5 px-2 py-1 rounded-md">
                ${course.price.toFixed(2)}
              </div>
            </div>

            <EnrollNowButton course={course} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with API integration
export function CoursesDropdown() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await fetch('/api/front-courses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        console.log('Fetched courses:', data); // Debug log
        console.log('Course statuses:', data.map((c: Course) => ({ name: c.name, status: c.status }))); // Debug log
        
        // Filter by ACTIVE status to match your courses page
        const activeCourses = data.filter((course: Course) => course.status === 'ACTIVE');
        setCourses(activeCourses);
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Filter courses by category
  const certificationCourses = courses.filter(course => getCourseCategory(course.name) === 'certification');
  const lifeSupportCourses = courses.filter(course => getCourseCategory(course.name) === 'life-support');

  console.log('All courses:', courses.length); // Debug log
  console.log('Certification courses:', certificationCourses.length); // Debug log
  console.log('Life support courses:', lifeSupportCourses.length); // Debug log

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#2DB188] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 dark:data-[state=open]:bg-accent dark:data-[state=open]:text-accent-foreground">
            Courses
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[450px] p-6">
              <div className="mb-6">
                <Link
                  href="/courses"
                  className="text-lg font-semibold text-foreground dark:text-foreground hover:text-[#2db188] dark:hover:text-[#2db188] transition-colors"
                >
                  View All Courses →
                </Link>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">
                  Advance your healthcare career with our comprehensive training programs
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">Loading courses...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-red-500">{error}</div>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-6 pr-2">
                  {/* Certification Programs */}
                  {certificationCourses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-4 pb-2 border-b border-border dark:border-border">
                        Certification Programs ({certificationCourses.length})
                      </h3>
                      <ul className="space-y-3">
                        {certificationCourses.map((course) => (
                          <li key={course.id}>
                            <CourseListItem course={course} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Life Support Courses */}
                  {lifeSupportCourses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-4 pb-2 border-b border-border dark:border-border">
                        Life Support Courses ({lifeSupportCourses.length})
                      </h3>
                      <ul className="space-y-3">
                        {lifeSupportCourses.map((course) => (
                          <li key={course.id}>
                            <CourseListItem course={course} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {courses.length === 0 && !loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-sm text-muted-foreground">No courses available</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default CoursesDropdown