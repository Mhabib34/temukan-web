export function BreakdownBars({ score }: { score: number }) {
    const ratio = score / 100;
    const breakdown = [
        { label: "Lokasi", max: 40 },
        { label: "Gender", max: 30 },
        { label: "Usia", max: 20 },
        { label: "Fisik", max: 10 },
    ].map((b) => ({
        ...b,
        est: Math.round(b.max * ratio),
        pct: Math.round((b.max * ratio / b.max) * 100),
    }));

    return (
        <div className="space-y-3 mt-5">
            {breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                    <span className="text-sm text-stone-600 w-16 flex-shrink-0">{b.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-orange-500"
                            style={{ width: `${b.pct}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold text-stone-700 tabular-nums w-10 text-right">
                        {b.pct}%
                    </span>
                </div>
            ))}
        </div>
    );
}