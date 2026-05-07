import {PageWrapper} from "@/components/layout/PageWrapper";

export function ProfilSkeleton() {
    return (
        <PageWrapper contained padded>
            <div className="animate-pulse space-y-5 max-w-lg mx-auto">
                <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-stone-100" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-40 bg-stone-100 rounded-lg" />
                            <div className="h-4 w-28 bg-stone-100 rounded-lg" />
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex justify-between py-3.5 border-b border-stone-50"
                        >
                            <div className="h-4 w-24 bg-stone-100 rounded" />
                            <div className="h-4 w-32 bg-stone-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}