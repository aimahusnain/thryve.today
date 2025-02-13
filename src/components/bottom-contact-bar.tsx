"use client";

import React, { useState, useEffect } from "react";
import { Phone, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

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
        border-t border-zinc-200/50 md:border
        md:rounded-t-3xl
        shadow-lg shadow-zinc-900/5
        backdrop-blur-sm
        hover:shadow-xl hover:border-zinc-300/50
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
                     text-zinc-700 bg-white/50
                     hover:bg-white hover:text-black
                     transition-all duration-300
                     rounded-xl border border-zinc-200/50"
          >
            <Phone className="w-5 h-5" />
          </Link>

          <Link
            href="#contact"
            className="flex-1 group flex items-center justify-center gap-2 px-4 py-2.5
                     bg-gradient-to-r from-lime-500 to-lime-600
                     hover:from-lime-600 hover:to-lime-700
                     text-white font-medium rounded-xl
                     transition-all duration-300 
                     shadow-md shadow-lime-500/20
                     border border-lime-400/50"
          >
            <span className="text-sm">Contact Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="#courses"
            className="flex items-center justify-center p-2.5
                     bg-zinc-800 text-zinc-100
                     hover:bg-zinc-900 hover:text-white
                     rounded-xl transition-all duration-300
                     border border-zinc-700"
          >
            <BookOpen className="w-5 h-5" />
          </Link>
        </div>

        {/* Desktop Design */}
        <div className="hidden md:flex items-center justify-end gap-6">
          <Link
            href="tel:+19794847983"
            className="group flex items-center gap-2 px-4 py-2.5 
                     text-zinc-700 bg-white/50
                     hover:bg-white hover:text-black
                     transition-all duration-300
                     rounded-xl border border-zinc-200/50
                     hover:border-zinc-300 hover:shadow-md"
          >
            <Phone className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-medium">+1 (979) 484-7983</span>
          </Link>

          <Link
            href="#courses"
            className="group flex items-center gap-2 px-4 py-2.5 
                     bg-zinc-800 text-zinc-100
                     hover:bg-zinc-900 hover:text-white
                     rounded-xl transition-all duration-300
                     border border-zinc-700
                     hover:shadow-lg hover:shadow-zinc-900/20"
          >
            <BookOpen className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm font-medium">View Courses</span>
          </Link>

          <Link
            href="#contact"
            className="group flex items-center gap-2 px-6 py-2.5
                     bg-gradient-to-r from-lime-500 to-lime-600
                     hover:from-lime-600 hover:to-lime-700
                     text-white font-medium rounded-xl
                     transition-all duration-300 
                     shadow-lg shadow-lime-500/20
                     hover:shadow-xl hover:shadow-lime-600/30
                     border border-lime-400/50"
          >
            <span className="text-sm">Contact Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomContactBar;