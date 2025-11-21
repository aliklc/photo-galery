import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-50 p-4 md:p-8">
      <header className="mb-8 text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </header>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <Skeleton className="w-full rounded-xl h-[300px]" />
          </div>
        ))}
      </div>
    </main>
  )
}
