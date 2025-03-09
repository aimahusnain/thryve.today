"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface CourseFiltersProps {
  categories: Category[]
}

export default function CourseFilters({ categories }: CourseFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
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
                   focus:outline-none focus:ring-2 focus:ring-[#2db188] dark:focus:ring-[#2db188]"
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
                    ? "bg-[#35dba8] dark:bg-[#2db188] text-white dark:text-zinc-900"
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
  )
}

