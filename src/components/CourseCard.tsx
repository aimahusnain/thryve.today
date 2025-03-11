import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, Calendar, Users, CheckCircle, GraduationCap, ArrowRight, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function CourseCard({
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
    imageUrl
  }) {
    
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
  
        {imageUrl && variant !== "row" && (
          <div className="relative aspect-video -mx-8 -mt-8 mb-6 overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
  
        <div
          className={`relative space-y-6 h-full z-10 ${
            variant === "row" ? "md:col-span-4" : ""
          }`}
        >
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white group-hover:text-[#35dba8] dark:group-hover:text-[#2db188] transition-colors duration-300">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#35dba8] dark:text-[#2db188] bg-lime-50 dark:bg-[#2db188]/10 px-3 py-1.5 rounded-full">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">${price}</span>
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
            <p className="text-sm text-[#35dba8] dark:text-[#2db188] italic">
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
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188]" />
                    Who Should Enroll?
                  </h4>
                  <ul className="grid gap-2">
                    {whoFor.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                      >
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#35dba8] dark:text-[#2db188]" />
                  Program Highlights
                </h4>
                <ul className="grid gap-2">
                  {highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
                <Link href={link} className="flex justify-end">
                  <button
                    
                    className="flex items-center justify-center gap-2 px-6 py-3 md:py-4 
                    bg-zinc-900 dark:bg-[#2db188] dark:hover:bg-lime-300 
                    text-white dark:text-zinc-900 font-medium text-sm md:text-base rounded-xl
                    transition-all duration-300 group-hover:shadow-lg"
                    >
                  Enroll Now
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
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188]" />{" "}
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
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
  
            <div className="space-y-3 mt-6 mb-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#35dba8] dark:text-[#2db188]" />{" "}
                Program Highlights
              </h4>
              <ul className="grid gap-2 md:gap-3">
                {highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
  
            {additionalInfo && (
              <p className="text-sm text-[#35dba8] dark:text-[#2db188] italic mt-5">
                {additionalInfo}
              </p>
            )}
  
            <Link href={link} className="mt-auto pt-6">
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3 md:py-4 
                         bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 
                         text-white dark:text-zinc-900 font-medium text-sm md:text-base rounded-xl
                         transition-all duration-300 group-hover:shadow-lg"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </>
        )}
      </div>
    );
  };
