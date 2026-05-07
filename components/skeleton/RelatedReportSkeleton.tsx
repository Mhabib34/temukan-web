export function RelatedReportSkeleton() {
    return (
        <div className="space-y-2">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-stone-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-16 animate-pulse rounded bg-stone-100" />
                        <div className="h-3 w-32 animate-pulse rounded bg-stone-100" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-stone-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}