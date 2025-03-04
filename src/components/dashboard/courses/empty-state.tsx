import { BookOpen } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white/50 py-20 backdrop-blur-sm dark:bg-zinc-900/50">
      <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/20">
        <BookOpen className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">No courses found</h3>
      <p className="mt-1 text-zinc-500 dark:text-zinc-400">Try adjusting your search or filter criteria</p>
    </div>
  )
}

