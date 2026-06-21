export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#EBEBEB] rounded ${className}`} />;
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="divide-y divide-[#EBEBEB]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
