export function NotifSkeleton() {
    return (
        <div className="animate-pulse divide-y divide-stone-100">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-4 py-4">
                    <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-stone-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-3/4 rounded bg-stone-200" />
                        <div className="h-3 w-1/3 rounded bg-stone-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}