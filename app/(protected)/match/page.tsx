"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useMatchList } from "@/hooks/useMatch";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {MatchCardSkeleton} from "@/components/skeleton/MatchCardSkeleton";
import {MatchCard} from "@/components/card/MatchCard";

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
        if (!isLoggedIn) router.replace("/login");
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    const matches = data?.data.matches ?? [];
    const meta = data?.data.meta;

    return (
        <PageWrapper contained padded>
            {/* Header */}
            <div className="mb-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">Hasil Kecocokan</h1>
                        <p className="text-sm text-stone-500 mt-1">
                            {meta?.total != null
                                ? `Ditemukan ${meta.total} laporan yang memiliki kemiripan tinggi dengan data Anda.`
                                : "Laporan yang mungkin cocok berdasarkan kemiripan deskripsi dan lokasi."}
                        </p>
                    </div>

                    {/* Min score slider — compact, di pojok kanan */}
                    <div className="flex items-center gap-3 bg-white border border-stone-100 rounded-2xl px-4 py-2.5 shadow-sm flex-shrink-0">
                        <span className="text-xs text-stone-500 whitespace-nowrap">Min. Skor:</span>
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
                            className="w-24 accent-orange-500"
                        />
                        <span className="text-sm font-bold text-orange-500 tabular-nums w-8">
                            {minScore}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
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
                        <svg className="w-7 h-7 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <p className="text-stone-600 font-semibold">Belum ada kecocokan</p>
                    <p className="text-stone-400 text-sm mt-1">
                        Coba turunkan skor minimum atau buat laporan baru.
                    </p>
                </div>
            )}

            {/* Grid list */}
            {!isLoading && matches.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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