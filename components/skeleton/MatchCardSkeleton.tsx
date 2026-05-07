export function MatchCardSkeleton() {
    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-4 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-1.5 bg-stone-100 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <div className="flex-1 aspect-[3/4] rounded-xl bg-stone-100" />
                <div className="flex-1 aspect-[3/4] rounded-xl bg-stone-100" />
            </div>
            <div className="flex gap-2 mt-2">
                <div className="flex-1 h-3 bg-stone-100 rounded" />
                <div className="flex-1 h-3 bg-stone-100 rounded" />
            </div>
        </div>
    );
}