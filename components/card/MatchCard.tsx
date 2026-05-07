import type {Match} from "@/types";
import Link from "next/link";

export function MatchCard({ match }: { match: Match }) {
    const found = match.found_report;
    const missing = match.missing_report;

    return (
        <Link href={`/match/${match.id}`}>
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer h-full flex flex-col">
                {/* Score ring + breakdown */}
                <div className="flex items-start gap-3">
                    <ScoreRing score={match.score} />
                    <div className="flex-1 min-w-0">
                        <MiniBreakdown score={match.score} />
                    </div>
                </div>

                {/* Photos */}
                <PhotoPair match={match} />

                {/* Labels */}
                <div className="flex gap-2 mt-2">
                    <div className="flex-1 text-center">
                        <p className="text-[10px] text-stone-400">Data Anda</p>
                        <p className="text-xs font-semibold text-stone-700 truncate">
                            {found.name ?? "Tidak diketahui"}
                        </p>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-[10px] text-orange-500 font-medium">
                            Laporan #{match.id.slice(-3)}
                        </p>
                        <p className="text-xs font-semibold text-stone-700 truncate">
                            {missing.city}, {missing.province.slice(0, 4)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function ScoreRing({ score }: { score: number }) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={radius} fill="none" stroke="#f5f5f4" strokeWidth="7" />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-stone-800 leading-none">{score}%</span>
            </div>
        </div>
    );
}

// ── Mini score breakdown bars ─────────────────────────────────────────────────
function MiniBreakdown({ score }: { score: number }) {
    const ratio = score / 100;
    const items = [
        { label: "LOKASI", est: Math.round(40 * ratio), max: 40 },
        { label: "GENDER", est: Math.round(30 * ratio), max: 30 },
        { label: "USIA", est: Math.round(20 * ratio), max: 20 },
        { label: "CIRI FISIK", est: Math.round(10 * ratio), max: 10 },
    ];
    return (
        <div className="space-y-1.5 w-full">
            {items.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-stone-400 w-14 flex-shrink-0 tracking-wide">
                        {b.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-stone-700"
                            style={{ width: `${(b.est / b.max) * 100}%` }}
                        />
                    </div>
                    <span className="text-[9px] font-bold text-stone-500 tabular-nums w-6 text-right">
                        {Math.round((b.est / b.max) * 100)}%
                    </span>
                </div>
            ))}
        </div>
    );
}
function PhotoPair({ match }: { match: Match }) {
    const found = match.found_report;
    const missing = match.missing_report;

    return (
        <div className="flex gap-2 mt-3 relative">
            {/* Found photo */}
            <div className="flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 relative">
                {found.photo_url ? (
                    <img
                        src={found.photo_url}
                        alt={found.name ?? "penemu"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Link icon center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-stone-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </div>

            {/* Missing photo */}
            <div className="flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 relative">
                {missing.photo_url ? (
                    <img
                        src={missing.photo_url}
                        alt={missing.name ?? "pencari"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                )}
                {/* Badge AKTIF/ARSIP on top-right of missing photo */}
                <div className="absolute top-2 right-2">
                    <StatusBadge notified={match.notified} score={match.score} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ notified, score }: { notified: boolean; score: number }) {
    if (!notified) {
        return (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wide">
                Mendesak
            </span>
        );
    }
    if (score >= 80) {
        return (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white uppercase tracking-wide">
                Aktif
            </span>
        );
    }
    return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-300 text-stone-600 uppercase tracking-wide">
            Arsip
        </span>
    );
}