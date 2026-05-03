"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { useMatchDetail } from "@/hooks/useMatch";
import {PageWrapper} from "@/components/layout/PageWrapper";
import type { Report } from "@/types";

// ── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f97316" : "#d4d4aa";

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
                <circle
                    cx="44"
                    cy="44"
                    r={radius}
                    fill="none"
                    stroke="#f5f5f4"
                    strokeWidth="8"
                />
                <circle
                    cx="44"
                    cy="44"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-stone-800">{score}</span>
                <span className="text-[10px] text-stone-400 font-medium">/ 100</span>
            </div>
        </div>
    );
}

// ── Score breakdown bars ─────────────────────────────────────────────────────
function BreakdownBars({ score }: { score: number }) {
    const ratio = score / 100;
    const breakdown = [
        { label: "Lokasi", max: 40, color: "bg-blue-400" },
        { label: "Gender", max: 30, color: "bg-violet-400" },
        { label: "Usia", max: 20, color: "bg-amber-400" },
        { label: "Fisik", max: 10, color: "bg-emerald-400" },
    ].map((b) => ({ ...b, est: Math.round(b.max * ratio) }));

    return (
        <div className="space-y-2.5">
            {breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-12 text-right flex-shrink-0">
                        {b.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${b.color}`}
                            style={{ width: `${(b.est / b.max) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-stone-600 w-10 tabular-nums">
                        {b.est}/{b.max}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Laporan detail card ──────────────────────────────────────────────────────
function LaporanDetailCard({ laporan, role }: { laporan: Report; role: "found" | "missing" }) {
    const isMissing = role === "missing";
    const badgeClass = isMissing
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white";
    const badgeLabel = isMissing ? "Hilang" : "Ditemukan";

    const genderLabel =
        laporan.gender === "male"
            ? "Laki-laki"
            : laporan.gender === "female"
                ? "Perempuan"
                : "Tidak diketahui";

    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden">
            {/* Foto */}
            <div className="aspect-[4/3] w-full bg-stone-100 relative">
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "foto"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
                        <svg
                            className="w-10 h-10"
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
                        <span className="text-xs">Tidak ada foto</span>
                    </div>
                )}
                <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}
                >
                    {badgeLabel}
                </span>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs text-stone-400 mb-0.5">Nama</p>
                    <p className="text-base font-semibold text-stone-800">
                        {laporan.name ?? "Nama tidak diketahui"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-stone-400 mb-0.5">Gender</p>
                        <p className="text-sm font-medium text-stone-700">{genderLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 mb-0.5">Usia</p>
                        <p className="text-sm font-medium text-stone-700">
                            {laporan.estimated_age ? `±${laporan.estimated_age} thn` : "-"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-stone-400 mb-0.5">Lokasi terakhir</p>
                    <p className="text-sm text-stone-700">{laporan.last_seen_location}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                        {laporan.city}, {laporan.province}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-stone-400 mb-0.5">Deskripsi</p>
                    <p className="text-sm text-stone-600 leading-relaxed">{laporan.description}</p>
                </div>

                {/* Tombol aksi */}
                <div className="flex gap-2 pt-1">
                    <Link
                        href={`/report/${laporan.id}`}
                        className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 text-center"
                    >
                        Lihat Laporan
                    </Link>
                    {laporan.whatsapp_share_url && (
                        <a
                            href={laporan.whatsapp_share_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 text-center"
                        >
                            Share WA
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function MatchDetailSkeleton() {
    return (
        <PageWrapper contained padded>
            <div className="animate-pulse space-y-5">
                <div className="h-6 w-32 bg-stone-100 rounded-lg" />
                <div className="rounded-2xl border border-stone-100 bg-white p-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-stone-100" />
                    <div className="h-4 w-48 bg-stone-100 rounded" />
                    <div className="w-full space-y-2">
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
                            <div className="aspect-[4/3] bg-stone-100" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-32 bg-stone-100 rounded" />
                                <div className="h-3 w-24 bg-stone-100 rounded" />
                                <div className="h-3 w-full bg-stone-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MatchDetailPage() {
    const router = useRouter();
    const params = useParams();
    const matchId = params.id as string;

    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const { data, isLoading, isError, error } = useMatchDetail(matchId);

    useEffect(() => {
        if (!isLoggedIn) router.replace("/masuk");
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;
    if (isLoading) return <MatchDetailSkeleton />;

    if (isError) {
        const msg =
            (error as { response?: { data?: { message?: string } } })?.response?.data
                ?.message ?? "Gagal memuat detail kecocokan";
        return (
            <PageWrapper contained padded>
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                    <p className="text-red-600 font-semibold">{msg}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-sm text-stone-500 hover:text-stone-700 underline"
                    >
                        Kembali
                    </button>
                </div>
            </PageWrapper>
        );
    }

    if (!data) return null;

    const match = data.data;
    const timeAgo = formatDistanceToNow(new Date(match.created_at), {
        addSuffix: true,
        locale: localeId,
    });

    return (
        <PageWrapper contained padded>
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-5 transition"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
                Kembali
            </button>

            {/* Skor card */}
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6 mb-5">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                    <ScoreRing score={match.score} />
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-base font-bold text-stone-800">
                                    Kecocokan Ditemukan
                                </h2>
                                <p className="text-xs text-stone-400">{timeAgo}</p>
                            </div>
                            {!match.notified && (
                                <span className="bg-orange-100 text-orange-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
                                    Baru
                                </span>
                            )}
                        </div>
                        <BreakdownBars score={match.score} />
                        <p className="text-xs text-stone-400 mt-3">
                            * Estimasi breakdown berdasarkan skor total. Skor aktual
                            dihitung oleh sistem.
                        </p>
                    </div>
                </div>
            </div>

            {/* Side by side laporan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 px-1">
                        Laporan Penemu
                    </p>
                    <LaporanDetailCard laporan={match.found_report} role="found" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 px-1">
                        Laporan Pencari
                    </p>
                    <LaporanDetailCard laporan={match.missing_report} role="missing" />
                </div>
            </div>
        </PageWrapper>
    );
}