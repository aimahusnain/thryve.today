export function LoadingState() {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-white/50 py-20 backdrop-blur-sm dark:bg-zinc-900/50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-500"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">Loading your courses...</p>
      </div>
    )
  }
  
  