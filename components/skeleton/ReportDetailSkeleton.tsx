export function ReportDetailSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Hero foto */}
            <div className="w-full bg-stone-200" style={{ aspectRatio: "16/9" }} />

            <div className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Kolom kiri */}
                    <div className="space-y-5 md:col-span-2">
                        {/* Judul */}
                        <div className="space-y-2">
                            <div className="h-8 w-2/3 rounded-lg bg-stone-200" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 rounded-full bg-stone-200" />
                                <div className="h-5 w-32 rounded-full bg-stone-200" />
                            </div>
                        </div>

                        {/* Info card */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <div className="mb-3 h-3 w-24 rounded bg-stone-200" />
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={i === 2 || i === 4 ? "col-span-2 space-y-1" : "space-y-1"}>
                                        <div className="h-3 w-20 rounded bg-stone-100" />
                                        <div className="h-4 w-28 rounded bg-stone-200" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deskripsi card */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm space-y-2">
                            <div className="h-3 w-20 rounded bg-stone-200" />
                            <div className="h-3 w-full rounded bg-stone-100" />
                            <div className="h-3 w-5/6 rounded bg-stone-100" />
                            <div className="h-3 w-4/6 rounded bg-stone-100" />
                        </div>
                    </div>

                    {/* Kolom kanan */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <div className="mb-3 h-3 w-24 rounded bg-stone-200" />
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-stone-200" />
                                <div className="space-y-1.5">
                                    <div className="h-4 w-28 rounded bg-stone-200" />
                                    <div className="h-3 w-16 rounded bg-stone-100" />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <div className="h-4 w-40 rounded bg-stone-200" />
                        </div>
                        <div className="h-12 w-full rounded-2xl bg-stone-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}