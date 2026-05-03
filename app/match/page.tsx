"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { useMatchList } from "@/hooks/useMatch";
import type { Match } from "@/types";
import {PageWrapper} from "@/components/layout/PageWrapper";

// ── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
    const color =
        score >= 80 ? "bg-green-500" : score >= 60 ? "bg-orange-500" : "bg-stone-300";
    return (
        <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-stone-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${color}`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span
                className={`text-xs font-bold tabular-nums ${
                    score >= 80
                        ? "text-green-600"
                        : score >= 60
                            ? "text-orange-500"
                            : "text-stone-400"
                }`}
            >
                {score}
            </span>
        </div>
    );
}

// ── Score breakdown tooltip ──────────────────────────────────────────────────
function ScoreBreakdown({ score }: { score: number }) {
    // Estimasi breakdown: lokasi max 40, gender max 30, usia max 20, fisik max 10
    // Tampilkan sebagai proporsi dari total skor
    const ratio = score / 100;
    const breakdown = [
        { label: "Lokasi", max: 40, est: Math.round(40 * ratio) },
        { label: "Gender", max: 30, est: Math.round(30 * ratio) },
        { label: "Usia", max: 20, est: Math.round(20 * ratio) },
        { label: "Fisik", max: 10, est: Math.round(10 * ratio) },
    ];
    return (
        <div className="mt-3 grid grid-cols-4 gap-1.5">
            {breakdown.map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1">
                    <div className="relative h-10 w-full rounded-md bg-stone-100 overflow-hidden flex items-end">
                        <div
                            className="w-full bg-orange-400 rounded-md transition-all"
                            style={{ height: `${(b.est / b.max) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium">{b.label}</span>
                    <span className="text-[10px] text-stone-400">
                        {b.est}/{b.max}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Mini laporan preview ─────────────────────────────────────────────────────
function MiniLaporan({
                         laporan,
                         label,
                     }: {
    laporan: Match["found_report"] | Match["missing_report"];
    label: string;
}) {
    const typeColor =
        laporan.type === "missing"
            ? "bg-red-500 text-white"
            : "bg-green-500 text-white";
    const typeLabel = laporan.type === "missing" ? "Hilang" : "Ditemukan";

    return (
        <div className="flex gap-3 items-start">
            {/* Foto */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "foto"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}
                    >
                        {typeLabel}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">{label}</span>
                </div>
                <p className="text-sm font-semibold text-stone-800 truncate">
                    {laporan.name ?? "Nama tidak diketahui"}
                </p>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                    {laporan.city}, {laporan.province}
                </p>
                {laporan.estimated_age && (
                    <p className="text-xs text-stone-400">±{laporan.estimated_age} thn</p>
                )}
            </div>
        </div>
    );
}

// ── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const timeAgo = formatDistanceToNow(new Date(match.created_at), {
        addSuffix: true,
        locale: localeId,
    });

    return (
        <Link href={`/match/${match.id}`}>
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
                {/* Header: skor + waktu */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-stone-700">
                            Kecocokan Ditemukan
                        </span>
                        {!match.notified && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                        )}
                    </div>
                    <span className="text-xs text-stone-400">{timeAgo}</span>
                </div>

                {/* Score bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-stone-500">Skor Kecocokan</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowBreakdown((v) => !v);
                            }}
                            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                        >
                            {showBreakdown ? "Tutup" : "Rincian"}
                        </button>
                    </div>
                    <ScoreBar score={match.score} />
                    {showBreakdown && <ScoreBreakdown score={match.score} />}
                </div>

                {/* Side by side */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-4 pt-3 border-t border-stone-50">
                    <MiniLaporan laporan={match.found_report} label="Penemu" />
                    <MiniLaporan laporan={match.missing_report} label="Pencari" />
                </div>
            </div>
        </Link>
    );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function MatchCardSkeleton() {
    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-36 bg-stone-100 rounded-lg" />
                <div className="h-3 w-16 bg-stone-100 rounded-lg" />
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full mb-4" />
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-50">
                {[0, 1].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-14 h-14 rounded-xl bg-stone-100 flex-shrink-0" />
                        <div className="flex-1 space-y-2 pt-1">
                            <div className="h-3 w-20 bg-stone-100 rounded" />
                            <div className="h-3 w-24 bg-stone-100 rounded" />
                            <div className="h-3 w-16 bg-stone-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MatchPage() {
    const router = useRouter();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const [minScore, setMinScore] = useState(60);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useMatchList({
        min_score: minScore,
        page,
        limit: 10,
    });

    useEffect(() => {
        if (!isLoggedIn) router.replace("/masuk");
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    const matches = data?.data.matches ?? [];
    const meta = data?.data.meta;

    return (
        <PageWrapper contained padded>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-900">Hasil Kecocokan</h1>
                <p className="text-sm text-stone-500 mt-1">
                    Laporan yang mungkin cocok berdasarkan kemiripan deskripsi dan lokasi.
                </p>
            </div>

            {/* Filter skor minimum */}
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">
                        Skor minimum
                    </span>
                    <span className="text-sm font-bold text-orange-500">{minScore}</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={minScore}
                    onChange={(e) => {
                        setMinScore(Number(e.target.value));
                        setPage(1);
                    }}
                    className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <MatchCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
                    <p className="text-sm text-red-600 font-medium">
                        {(error as { response?: { data?: { message?: string } } })?.response
                            ?.data?.message ?? "Gagal memuat data kecocokan"}
                    </p>
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && matches.length === 0 && (
                <div className="rounded-2xl border border-stone-100 bg-white p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-7 h-7 text-stone-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </div>
                    <p className="text-stone-600 font-semibold">Belum ada kecocokan</p>
                    <p className="text-stone-400 text-sm mt-1">
                        Coba turunkan skor minimum atau buat laporan baru.
                    </p>
                </div>
            )}

            {/* List */}
            {!isLoading && matches.length > 0 && (
                <>
                    <div className="space-y-4">
                        {matches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.total_pages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Sebelumnya
                            </button>
                            <span className="text-sm text-stone-500">
                                {page} / {meta.total_pages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                                disabled={page === meta.total_pages}
                                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Berikutnya →
                            </button>
                        </div>
                    )}

                    <p className="text-center text-xs text-stone-400 mt-3">
                        {meta?.total ?? 0} total kecocokan
                    </p>
                </>
            )}
        </PageWrapper>
    );
}