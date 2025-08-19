import React, { useState } from "react"
import Link from "next/link"
import { Clock, ChevronDown } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const courses = [
  {
    title: "Nurse Aide Training Program",
    price: "999",
    link: "/courses/nurse-aide-training-program",
    duration: "3.5 weeks",
    category: "certification",
    description:
      "Our state-approved Nurse Aide Training Program is designed to equip students with the essential skills and knowledge necessary to provide quality care in long-term care facilities, hospitals, and home healthcare settings. This comprehensive course not only prepares students for the state competency exam but also opens doors to a rewarding career as a Certified Nursing Assistant (CNA), with opportunities for personal and professional growth.",
    additionalInfo: "Ask about our bundle prices",
  },
  {
    title: "Phlebotomy Class",
    price: "555",
    duration: "3.5 weeks",
    link: "/courses/phlebotomy-class",
    category: "certification",
    description:
      "Our Phlebotomy Training Program is designed to provide students with the hands-on skills and knowledge required to excel in the healthcare field. This course prepares you for national certification and employment in hospitals, labs, blood donation centers, and outpatient facilities.",
  },
  {
    title: "ACLS Advanced Life Support",
    price: "125",
    duration: "4 hrs",
    link: "/courses/acls-advanced-life-support",
    category: "life-support",
    description:
      "Our ACLS Certification Course is designed for healthcare professionals who manage cardiovascular emergencies and require advanced resuscitation skills. This American Heart Association (AHA) compliant course covers essential lifesaving techniques, including advanced airway management, pharmacology, and team dynamics in emergency scenarios.",
  },
  {
    title: "Basic Life Support (BLS)",
    price: "65",
    link: "/courses/basic-life-support",
    duration: "4 hrs",
    category: "life-support",
    description:
      "Our American Heart Association (AHA) BLS Certification Class is designed for healthcare professionals and individuals who need to learn critical life-saving techniques. This course provides hands-on training in CPR, AED use, and emergency response for adults, children, and infants.",
  },
  {
    title: "Pediatric Life Support (PALS)",
    price: "150",
    duration: "4 hrs",
    link: "/courses/pediatric-life-support",
    category: "life-support",
    description:
      "Our Pediatric Advanced Life Support (PALS) Course is designed for healthcare professionals who respond to Pediatric Emergencies, including Nurses, Paramedics, Physicians, and other Medical Personnel. This course follows American Heart Association (AHA) guidelines and provides the skills to recognize and manage pediatric respiratory and cardiovascular emergencies.",
  },
];

function truncateText(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

type Course = {
  title: string;
  price: string;
  link: string;
  duration: string;
  category: string;
  description: string;
  additionalInfo?: string;
};

function CourseListItem({ course }: { course: Course }) {
  return (
    <NavigationMenuLink asChild>
      <Link 
        href={course.link}
        className="block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="text-sm font-medium leading-none group-hover:text-[#2db188] dark:group-hover:text-[#2db188] transition-colors mb-1">
              {course.title}
            </div>
            <p className="text-xs leading-snug text-muted-foreground dark:text-muted-foreground mb-2">
              {truncateText(course.description)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#2db188]/10 px-2 py-1 text-xs font-medium text-[#2db188] dark:bg-[#2db188]/20 dark:text-[#2db188]">
                  {course.category === 'certification' ? 'Certification' : 'Life Support'}
                </span>
                <div className="flex items-center text-xs text-muted-foreground dark:text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </div>
              </div>
              <div className="text-sm font-bold text-[#2db188]">
                ${course.price}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

// This is the component to replace your simple "Courses" link
export function CoursesDropdown() {
  const certificationCourses = courses.filter(course => course.category === 'certification')
  const lifeSupportCourses = courses.filter(course => course.category === 'life-support')

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#2DB188] after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 dark:data-[state=open]:bg-accent dark:data-[state=open]:text-accent-foreground">
            Courses
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[800px] p-4">
              <div className="mb-4">
                <Link
                  href="/courses"
                  className="text-lg font-semibold text-foreground dark:text-foreground hover:text-[#2db188] dark:hover:text-[#2db188] transition-colors"
                >
                  View All Courses →
                </Link>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                  Advance your healthcare career with our comprehensive training programs
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Certification Programs */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-3 pb-2 border-b border-border dark:border-border">
                    Certification Programs ({certificationCourses.length})
                  </h3>
                  <ul className="space-y-2">
                    {certificationCourses.map((course) => (
                      <li key={course.title}>
                        <CourseListItem course={course} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Life Support Courses */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground dark:text-foreground mb-3 pb-2 border-b border-border dark:border-border">
                    Life Support Courses ({lifeSupportCourses.length})
                  </h3>
                  <ul className="space-y-2">
                    {lifeSupportCourses.map((course) => (
                      <li key={course.title}>
                        <CourseListItem course={course} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// Mobile version for your existing mobile menu
export function MobileCourses({ onClick }: { onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  const [showCourses, setShowCourses] = useState(false)

  return (
    <div>
      <button
        onClick={() => setShowCourses(!showCourses)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex flex-col items-start">
          <span className="text-2xl font-medium text-foreground dark:text-foreground">Courses</span>
          <span className="text-sm text-muted-foreground dark:text-muted-foreground group-hover:text-[#2db188] transition-colors">
            Explore our courses
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#2db188] transition-transform ${showCourses ? 'rotate-180' : ''}`} />
      </button>
      
      {showCourses && (
        <div className="mt-3 ml-4 space-y-2 border-l border-border dark:border-border pl-4">
          {courses.map((course) => (
            <Link
              key={course.title}
              href={course.link}
              onClick={onClick}
              className="block p-2 rounded-md hover:bg-accent dark:hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground dark:text-foreground">
                  {course.title}
                </span>
                <span className="text-sm font-bold text-[#2db188]">
                  ${course.price}
                </span>
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground line-clamp-2">
                {truncateText(course.description, 80)}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="inline-flex items-center rounded-full bg-[#2db188]/10 dark:bg-[#2db188]/20 px-2 py-1 text-xs font-medium text-[#2db188]">
                  {course.category === 'certification' ? 'Certification' : 'Life Support'}
                </span>
                <div className="flex items-center text-xs text-muted-foreground dark:text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/courses"
            onClick={onClick}
            className="block p-2 text-center text-sm font-medium text-[#2db188] hover:bg-accent dark:hover:bg-accent rounded-md transition-colors"
          >
            View All Courses →
          </Link>
        </div>
      )}
    </div>
  )
}

export default CoursesDropdown