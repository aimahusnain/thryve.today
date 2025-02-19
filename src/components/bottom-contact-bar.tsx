"use client";

import React, { useState, useEffect } from "react";
import { Phone, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import Goy from "./goy";

const BottomContactBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsVisible(!isBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-0 right-0 md:right-4
        transform transition-all duration-500 ease-in-out z-50
        ${isVisible ? "translate-y-0" : "translate-y-full"}
        bg-gradient-to-r from-white via-zinc-50 to-zinc-100
        dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900
        border-t border-zinc-200/50 dark:border-zinc-800/50 md:border
        md:rounded-t-3xl
        shadow-lg shadow-zinc-900/5 dark:shadow-black/20
        backdrop-blur-sm
        hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-zinc-700/50
        transition-all duration-300
        w-full md:w-auto
        min-w-[280px]
      `}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4">
        {/* Mobile Design */}
        <div className="flex md:hidden items-center justify-between gap-3">
          <Link
            href="tel:+19794847983"
            className="flex items-center justify-center p-2.5
                     text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50
                     hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white
                     transition-all duration-300
                     rounded-xl border border-zinc-200/50 dark:border-zinc-700/50"
          >
            <Phone className="w-5 h-5" />
          </Link>

          <Goy
            id="contact"
            className="flex-1 group flex items-center justify-center gap-2 px-4 py-2.5
                     bg-gradient-to-r from-[#2db188] to-[#35dba8]
                     hover:from-[#35dba8] hover:to-lime-700
                     text-white font-medium rounded-xl
                     transition-all duration-300 
                     shadow-md shadow-[#2db188]/20 dark:shadow-[#2db188]/10
                     border border-[#2db188]/50"
          >
            <span className="text-sm">Contact Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Goy>

          <Goy
            id="courses"
            className="flex items-center justify-center p-2.5
                     bg-zinc-800 text-zinc-100 dark:bg-zinc-700
                     hover:bg-zinc-900 dark:hover:bg-zinc-600
                     rounded-xl transition-all duration-300
                     border border-zinc-700 dark:border-zinc-600"
          >
            <BookOpen className="w-5 h-5" />
          </Goy>
        </div>

        {/* Desktop Design */}
        <div className="hidden md:flex items-center justify-end gap-6">
          <Link
            href="tel:+19794847983"
            className="group flex items-center gap-2 px-4 py-2.5 
                     text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50
                     hover:bg-white dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white
                     transition-all duration-300
                     rounded-xl border border-zinc-200/50 dark:border-zinc-700/50
                     hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md"
          >
            <Phone className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-medium">+1 (979) 484-7983</span>
          </Link>

          <Goy
            id="courses"
            className="group flex items-center gap-2 px-4 py-2.5 
                     bg-zinc-800 text-zinc-100 dark:bg-zinc-700
                     hover:bg-zinc-900 dark:hover:bg-zinc-600
                     rounded-xl transition-all duration-300
                     border border-zinc-700 dark:border-zinc-600
                     hover:shadow-lg hover:shadow-zinc-900/20 dark:hover:shadow-black/40"
          >
            <BookOpen className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-medium">View Courses</span>
          </Goy>

          <Goy
            id="contact"
            className="group flex items-center gap-2 px-6 py-2.5
                     bg-gradient-to-r from-[#2db188] to-[#35dba8]
                     hover:from-[#35dba8] hover:to-[#29a680]
                     text-white font-medium rounded-xl
                     transition-all duration-500 
                     shadow-lg shadow-[#2db188]/20 dark:shadow-[#2db188]/10
                     hover:shadow-xl hover:shadow-[#35dba8]/30 dark:hover:shadow-[#35dba8]/20
                     border border-[#2db188]/50"
          >
            <span className="text-sm">Contact Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Goy>
        </div>
      </div>
    </div>
  );
};

export default BottomContactBar;