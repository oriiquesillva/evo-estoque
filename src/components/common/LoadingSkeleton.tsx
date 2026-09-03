interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 6 }: LoadingSkeletonProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      {/* Cabeçalho da tabela simulado */}
      <div className="h-12 bg-slate-100 border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-32 hidden md:block"></div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-4 bg-slate-200 rounded w-20 hidden sm:block"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>

      {/* Linhas da tabela simuladas */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-2/5"></div>
              <div className="h-3 bg-slate-100 rounded w-1/4 sm:hidden"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-24 hidden md:block"></div>
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-6 bg-slate-200 rounded-full w-16 hidden sm:block"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
