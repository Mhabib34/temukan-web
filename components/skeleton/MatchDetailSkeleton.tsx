import { PageWrapper } from "@/components/layout/PageWrapper";

export function MatchDetailSkeleton() {
  return (
    <PageWrapper contained padded>
      <div className="animate-pulse space-y-5">
        <div className="h-5 w-20 bg-stone-100 rounded-lg" />
        <div className="rounded-2xl border border-stone-100 bg-white p-6 flex flex-col items-center gap-4">
          <div className="w-36 h-36 rounded-full bg-stone-100" />
          <div className="w-full space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 bg-stone-100 rounded-full" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-100 bg-white overflow-hidden"
            >
              <div className="aspect-4/3 bg-stone-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-40 bg-stone-100 rounded" />
                <div className="h-3 w-32 bg-stone-100 rounded" />
                <div className="h-10 bg-stone-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
