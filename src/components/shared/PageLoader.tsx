import { Skeleton } from "@/components/ui/skeleton";

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center bg-[#1e1b4b] px-8">
        <Skeleton className="h-8 w-32 bg-white/10" />
        <Skeleton className="ml-4 h-5 w-24 bg-white/10" />
      </div>
      <div className="flex-1 bg-[#f8f8fc] p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
