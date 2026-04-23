/* ============================================================
   Skeleton loading components — pulse shimmer placeholders
   ============================================================ */

export function EscuelaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-800 p-5 animate-fade-in">
      <div className="h-5 w-3/4 rounded-lg skeleton-shimmer mb-3" />
      <div className="h-4 w-full rounded-lg skeleton-shimmer mb-2" />
      <div className="h-4 w-1/2 rounded-lg skeleton-shimmer" />
    </div>
  );
}

export function CarreraBadgeSkeleton() {
  return (
    <div className="h-9 w-28 rounded-full skeleton-shimmer" />
  );
}

export function AutoridadCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface-800 p-5 animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full skeleton-shimmer shrink-0" />
        <div className="flex-1">
          <div className="h-5 w-2/3 rounded-lg skeleton-shimmer mb-2" />
          <div className="h-4 w-1/2 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded-lg skeleton-shimmer mb-2" />
      <div className="h-4 w-1/2 rounded-lg skeleton-shimmer" />
    </div>
  );
}

export function SkeletonGrid({ count = 3, type = 'escuela' }: { count?: number; type?: 'escuela' | 'autoridad' }) {
  const Skeleton = type === 'autoridad' ? AutoridadCardSkeleton : EscuelaCardSkeleton;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}

export function CarreraSelectorSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <CarreraBadgeSkeleton key={i} />
      ))}
    </div>
  );
}
