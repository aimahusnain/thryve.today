import React, { useState } from 'react';
import { Clock, DollarSign, Calendar, CheckCircle, GraduationCap, Users, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  price?: string;
  duration?: string;
  hours?: string[];
  highlights?: string[];
  whoFor?: string[];
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  price,
  duration,
  hours = [],
  highlights = [],
  whoFor = [],
  className = "",
}) => {
  return (
    <div
      className={`
        group relative overflow-hidden bg-white rounded-3xl p-6 lg:p-8
        shadow-lg hover:shadow-2xl transition-all duration-500
        border border-zinc-100 hover:border-zinc-200
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-lime-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-lime-600 transition-colors duration-300">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            {price && (
              <div className="flex items-center gap-1.5 text-lime-600 bg-lime-50 px-3 py-1.5 rounded-full">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">${price}</span>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-1.5 text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{duration}</span>
              </div>
            )}
          </div>
        </div>

        {hours.length > 0 && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {hours.map((hour, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-zinc-600 bg-zinc-50/50 px-4 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="font-medium">{hour}</span>
              </div>
            ))}
          </div>
        )}

        {whoFor.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-lime-500" /> Who Should Enroll?
            </h4>
            <div className="space-y-3">
              {whoFor.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-zinc-600 group/item">
                  <CheckCircle className="w-4 h-4 text-lime-500 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                  <span className="group-hover/item:text-zinc-900 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {highlights.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-lime-500" /> Program Highlights
            </h4>
            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-zinc-600 group/item">
                  <CheckCircle className="w-4 h-4 text-lime-500 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                  <span className="group-hover/item:text-zinc-900 transition-colors duration-300">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 
                           bg-zinc-900 hover:bg-lime-600 text-white font-medium rounded-xl
                           transition-all duration-300 group-hover:shadow-lg">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900">
            Healthcare Training Programs
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Comprehensive healthcare education designed to launch and advance your medical career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {/* Nurse Aide Training */}
    <CourseCard
            title="Nurse Aide Training Program"
            price="2,500"
            duration="3.5 weeks"
            hours={[
              "90 Classroom Hours",
              "24 Lab Hours",
              "24 Clinical Rotation Hours"
            ]}
            // whoFor={[s
            //   "Individuals seeking a rewarding career in healthcare",
            //   "Those looking to enter nursing or other medical fields",
            //   "Caregivers wanting to enhance their skills"
            // ]}
            highlights={[
              "Comprehensive Curriculum",
              "Expert Instructors",
              "Hands-On Training",
              "Flexible Scheduling",
              "Exam Preparation"
            ]}
          />

          {/* Phlebotomy Class */}
          <CourseCard
            title="Phlebotomy Class"
            price="1,300"
            duration="3.5 weeks"
            hours={[
              "50 Classroom Hours",
              "30 Lab Hours",
              "30 Clinical Hours"
            ]}
            highlights={[
              "Comprehensive Hands-On Training",
              "Flexible Scheduling",
              "Expert Instructors",
              "Certification Preparation",
              "Affordable Tuition"
            ]}
          />

          {/* ACLS */}
          <CourseCard
            title="ACLS Advanced Life Support"
            price="150"
            duration="4 hrs"
            highlights={[
              "Hands-On Training",
              "Experienced Instructors",
              "Interactive Simulations",
              "AHA-Compliant Certification",
              "Convenient Scheduling"
            ]}
          />

          {/* BLS */}
          <CourseCard
            title="Basic Life Support (BLS)"
            price="65"
            duration="4 hrs"
            highlights={[
              "CPR & AED Training",
              "Hands-On Instruction",
              "Expert Instructors",
              "AHA Certification Card",
              "Perfect for Healthcare Professionals"
            ]}
          />

          {/* PALS */}
          <CourseCard
            title="Pediatric Life Support (PALS)"
            price="165"
            duration="4 hrs"
            highlights={[
              "AHA-Certified Instructors",
              "Comprehensive Training",
              "Hands-On Practice",
              "Certification Upon Completion",
              "Flexible Class Options"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;