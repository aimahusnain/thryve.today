"use client";

import type React from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  price: string;
  duration: string;
  link: string;
  hours?: { type: string; amount: string }[];
  whoFor?: string[];
  description: string;
  highlights: string[];
  className?: string;
  variant?: "default" | "wide" | "row"; // Added "row" option
  additionalInfo?: string;
  category: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  price,
  duration,
  link,
  hours = [],
  whoFor = [],
  description,
  highlights,
  className = "",
  variant = "default",
  additionalInfo,
}) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-3xl p-8 sm:p-6 md:p-8
        bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800
        transition-all duration-500 ease-in-out
        border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700
        flex flex-col
        ${
          variant === "wide"
            ? "col-span-full md:col-span-2"
            : variant === "row"
            ? "col-span-full"
            : "col-span-full sm:col-span-1"
        }
        ${variant === "row" ? "md:grid md:grid-cols-12 md:gap-8" : ""}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50/50 via-transparent to-transparent dark:from-lime-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div
        className={`relative space-y-6 h-full z-10 ${
          variant === "row" ? "md:col-span-4" : ""
        }`}
      >
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 bg-lime-50 dark:bg-lime-400/10 px-3 py-1.5 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">{price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-300/10 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{duration}</span>
            </div>
          </div>
        </div>

        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 line-clamp-3">
          {description}
        </p>

        {variant === "row" && additionalInfo && (
          <p className="text-sm text-lime-600 dark:text-lime-400 italic">
            {additionalInfo}
          </p>
        )}
      </div>

      {variant === "row" ? (
        <div className="md:col-span-8 space-y-6 mt-6 md:mt-0 relative z-10">
          {hours.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                >
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {hour.type}:
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 dark:text-zinc-500" />
                    <span className="font-semibold">{hour.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {whoFor.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm md:text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400" />
                  Who Should Enroll?
                </h4>
                <ul className="grid gap-2">
                  {whoFor.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                Program Highlights
              </h4>
              <ul className="grid gap-2">
                {highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link href={link} className="flex justify-end">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 
                       bg-zinc-900 dark:bg-lime-400 hover:bg-lime-600 dark:hover:bg-lime-300 
                       text-white dark:text-zinc-900 font-medium text-sm md:text-base rounded-xl
                       transition-all duration-300 group-hover:shadow-lg"
            >
              Learn More
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      ) : (
        <>
          {hours.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                >
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {hour.type}:
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 dark:text-zinc-500" />
                    <span className="font-semibold">{hour.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {whoFor.length > 0 && (
            <div className="space-y-3 md:space-y-4 mt-4">
              <h4 className="text-sm md:text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400" />{" "}
                Who Should Enroll?
              </h4>
              <ul
                className={`grid gap-3 md:gap-4 ${
                  whoFor.length === 5
                    ? "grid-cols-2 [&>li:last-child]:col-span-2"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {whoFor.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3 mt-6 mb-1">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-lime-600 dark:text-lime-400" />{" "}
              Program Highlights
            </h4>
            <ul className="grid gap-2 md:gap-3">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                >
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {additionalInfo && (
            <p className="text-sm text-lime-600 dark:text-lime-400 italic mt-5">
              {additionalInfo}
            </p>
          )}

          <Link href={link} className="mt-auto pt-6">
            <button
              className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 
                       bg-zinc-900 dark:bg-lime-400 hover:bg-lime-600 dark:hover:bg-lime-300 
                       text-white dark:text-zinc-900 font-medium text-sm md:text-base rounded-xl
                       transition-all duration-300 group-hover:shadow-lg"
            >
              Learn More
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const courses = [
    {
      title: "Nurse Aide Training Program",
      price: "999",
      link: "/courses/nurse-aide-training-program",
      duration: "3.5 weeks",
      category: "certification",
      hours: [
        { type: "Classroom", amount: "90 Hours" },
        { type: "Lab", amount: "24 Hours" },
        { type: "Clinical", amount: "24 Hours" },
      ],
      whoFor: [
        "Individuals seeking a rewarding career in healthcare",
        "Those looking to enter nursing or other medical fields",
        "Caregivers wanting to enhance their skills",
      ],
      description:
        "Our state-approved Nurse Aide Training Program is designed to equip students with the essential skills and knowledge necessary to provide quality care in long-term care facilities, hospitals, and home healthcare settings. This comprehensive course not only prepares students for the state competency exam but also opens doors to a rewarding career as a Certified Nursing Assistant (CNA), with opportunities for personal and professional growth.",
      highlights: [
        "Comprehensive Curriculum – Covers essential nursing skills, infection control, resident rights, communication, safety, and hands-on clinical training",
        "Expert Instructors – Learn from expert Healthcare Professionals committed to your success throughout the program",
        "Hands-On Training – Gain real-world experience through lab practice and clinical rotations",
        "Flexible Scheduling – Convenient class times to accommodate your busy lifestyle",
        "Exam Preparation – Thorough preparation for the State CNA Certification Exam",
      ],
      variant: "wide" as const,
      additionalInfo: "Ask about our bundle prices",
    },
    {
      title: "Phlebotomy Class",
      price: "555",
      duration: "3.5 weeks",
      link: "/courses/nurse-aide-training-program",
      category: "certification",
      hours: [
        { type: "Classroom", amount: "50 Hours" },
        { type: "Lab", amount: "30 Hours" },
        { type: "Clinical", amount: "30 Hours" },
      ],
      whoFor: [
        "Individuals seeking a career in healthcare",
        "Medical professionals looking to expand your skills",
        "Those interested in laboratory work",
        "Healthcare workers seeking certification",
        "Career changers entering healthcare",
      ],
      description:
        "Our Phlebotomy Training Program is designed to provide students with the hands-on skills and knowledge required to excel in the healthcare field. This course prepares you for national certification and employment in hospitals, labs, blood donation centers, and outpatient facilities.",
      highlights: [
        "Comprehensive Hands-On Training – Learn venipuncture techniques, proper specimen collection, safety protocols, and specific lab procedures",
        "Flexible Scheduling – Day and night classes are available to fit your schedule",
        // "Expert Instructors – Learn from experienced healthcare professionals",
        // "Certification Preparation – Get fully prepared for national certification exams",
        // "Career Support – Job placement assistance and resume writing support",
      ],
    },
    {
      title: "ACLS Advanced Life Support",
      price: "125",
      duration: "4 hrs",
      link: "/courses/nurse-aide-training-program",
      category: "life-support",
      description:
        "Our ACLS Certification Course is designed for healthcare professionals who manage cardiovascular emergencies and require advanced resuscitation skills. This American Heart Association (AHA) compliant course covers essential lifesaving techniques, including advanced airway management, pharmacology, and team dynamics in emergency scenarios.",
      highlights: [
        "Hands-On Training – Learn high-quality CPR, airway management, ECG interpretation, and emergency medication administration",
        "Experienced Instructors – Taught by certified professionals with real-world clinical experience",
        // "Interactive Simulations – Practice life-saving skills in a hands-on, scenario-based setting",
        // "AHA-Compliant Certification – Receive your official ACLS Provider Card upon successful completion",
        // "Convenient Scheduling – Flexible class times to accommodate healthcare professionals",
      ],
      whoFor: [
        "Nurses",
        "Paramedics",
        "Physicians",
        "Healthcare providers",
        "Medical Professionals who respond to cardiovascular emergencies",
      ],
    },
    {
      title: "Basic Life Support (BLS)",
      price: "65",
      link: "/courses/nurse-aide-training-program",
      duration: "4 hrs",
      category: "life-support",
      description:
        "Our American Heart Association (AHA) BLS Certification Class is designed for healthcare professionals and individuals who need to learn critical life-saving techniques. This course provides hands-on training in CPR, AED use, and emergency response for adults, children, and infants.",
      highlights: [
        "CPR & AED Training – Learn to perform high-quality CPR and properly use an Automated External Defibrillator (AED)",
        "Hands-On Instruction – Practice life-saving techniques with real-world scenarios",
        "Expert Instructors – Taught by certified professionals with real-life emergency experience",
        "AHA Certification Card – Receive your certification card, valid for 2 years upon completion",
        "Flexible Scheduling – Multiple class times available to fit your schedule",
      ],
      variant: "wide" as const,
      whoFor: [
        "Healthcare Professionals",
        "First Responders",
        "Medical Students",
        "Childcare Providers",
        "Workplace Safety Personnel",
      ],
    },
    {
      title: "Pediatric Life Support (PALS)",
      price: "150",
      duration: "4 hrs",
      link: "/courses/nurse-aide-training-program",
      category: "life-support",
      variant: "row" as const,
      description:
        "Our Pediatric Advanced Life Support (PALS) Course is designed for healthcare professionals who respond to Pediatric Emergencies, including Nurses, Paramedics, Physicians, and other Medical Personnel. This course follows American Heart Association (AHA) guidelines and provides the skills to recognize and manage pediatric respiratory and cardiovascular emergencies.",
      highlights: [
        "AHA-Certified Instructors – Learn from experienced professionals",
        "Comprehensive Training – Covers pediatric assessment, BLS, respiratory emergencies, shock, arrhythmias, and post-resuscitation care",
        "Hands-On Practice – Gain experience in simulated emergency scenarios",
        "Certification Upon Completion – Receive your PALS Provider Card, valid for two years",
        "Flexible Class Options – Day and evening schedules available",
      ],
      whoFor: [
        "Pediatric Healthcare Providers",
        "Emergency Department Staff",
        "Critical Care Professionals",
        "Paramedics and EMTs",
        "Medical Students",
      ],
    },
  ];

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "certification", name: "Certification Programs" },
    { id: "life-support", name: "Life Support" },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="courses" className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white">
              Healthcare Training Programs
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Discover our comprehensive range of healthcare courses designed to
              launch and advance your medical career
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 
                         bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-zinc-400 shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                      ${
                        selectedCategory === category.id
                          ? "bg-lime-600 dark:bg-lime-400 text-white dark:text-zinc-900"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }
                      border border-zinc-200 dark:border-zinc-800
                      transition-all duration-300
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-white">
              No courses found
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
