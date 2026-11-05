function Loading({ label = 'Loading events...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/20" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{label}</p>
    </div>
  )
}

export default Loading
