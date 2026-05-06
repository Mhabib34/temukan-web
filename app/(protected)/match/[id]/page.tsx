"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useAuthStore } from "@/store/authStore";
import { useMatchDetail } from "@/hooks/useMatch";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { Report } from "@/types";

// ── Circular donut score ring (besar, untuk hero) ────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
            {/* Track */}
            <svg className="w-36 h-36 -rotate-90 absolute inset-0" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#fed7aa" strokeWidth="10" />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
                <span className="text-4xl font-bold text-stone-800 leading-none">{score}%</span>
                <span className="text-sm text-stone-500 mt-1">Kecocokan</span>
            </div>
        </div>
    );
}

// ── Breakdown bars (horizontal, label kiri, persen kanan) ────────────────────
function BreakdownBars({ score }: { score: number }) {
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

// ── Chip/tag kecil ────────────────────────────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-block bg-stone-100 text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {children}
        </span>
    );
}

// ── Laporan card (sesuai desain mobile: foto besar, info, tombol WA) ──────────
function LaporanCard({
                         laporan,
                         role,
                     }: {
    laporan: Report;
    role: "found" | "missing";
}) {
    const isMissing = role === "missing";
    const badgeLabel = isMissing ? "Laporan Pencari" : "Laporan Penemu";
    const badgeClass = isMissing
        ? "bg-stone-800 text-white"
        : "bg-orange-500 text-white";

    const genderLabel =
        laporan.gender === "male"
            ? "Laki-laki"
            : laporan.gender === "female"
                ? "Perempuan"
                : "Tidak diketahui";

    const waLabel = isMissing ? "Hubungi Keluarga via WhatsApp" : "Hubungi Penemu via WhatsApp";

    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden">
            {/* Foto hero */}
            <div className="relative aspect-[4/3] w-full bg-stone-100">
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "foto"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="text-sm">Tidak ada foto</span>
                    </div>
                )}
                <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
                    {badgeLabel}
                </span>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-stone-800">
                        {laporan.name ?? "Nama tidak diketahui"}
                    </h3>
                    <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {laporan.last_seen_location
                            ? `${laporan.last_seen_location}, ${laporan.city}`
                            : `${laporan.city}, ${laporan.province}`}
                    </p>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5">
                    <Chip>{genderLabel}</Chip>
                    {laporan.estimated_age && <Chip>±{laporan.estimated_age} Tahun</Chip>}
                    {laporan.description && (
                        <Chip>
                            {laporan.description.length > 20
                                ? laporan.description.slice(0, 20) + "…"
                                : laporan.description}
                        </Chip>
                    )}
                </div>

                {/* Dilaporkan oleh (hanya pencari) */}
                {isMissing && laporan.reporter && (
                    <p className="text-xs text-stone-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                        </svg>
                        Dilaporkan oleh: {laporan.reporter.name}
                    </p>
                )}

                {/* Tombol WA */}
                {laporan.whatsapp_share_url ? (
                    <a
                        href={laporan.whatsapp_share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-500 hover:bg-green-600 transition py-3 text-sm font-semibold text-white"
                    >
                        {/* WhatsApp icon */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {waLabel}
                    </a>
                ) : (
                    <Link
                        href={`/report/${laporan.id}`}
                        className="flex items-center justify-center gap-2 w-full rounded-xl border border-stone-200 hover:bg-stone-50 transition py-3 text-sm font-medium text-stone-700"
                    >
                        Lihat Laporan
                    </Link>
                )}
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function MatchDetailSkeleton() {
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
                        <div key={i} className="rounded-2xl border border-stone-100 bg-white overflow-hidden">
                            <div className="aspect-[4/3] bg-stone-100" />
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

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MatchDetailPage() {
    const router = useRouter();
    const params = useParams();
    const matchId = params.id as string;

    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const { data, isLoading, isError, error } = useMatchDetail(matchId);

    useEffect(() => {
        if (!isLoggedIn) router.replace("/login");
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Detail Kecocokan
            </button>

            {/* Hero: Score ring + breakdown */}
            <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6 mb-5 text-center">
                <ScoreRing score={match.score} />
                <BreakdownBars score={match.score} />
                <p className="text-xs text-stone-400 mt-3">
                    Dianalisis {timeAgo}
                </p>
            </div>

            {/* Dua kartu laporan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <LaporanCard laporan={match.found_report} role="found" />
                <LaporanCard laporan={match.missing_report} role="missing" />
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                    onClick={() => router.back()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Bukan Dia
                </button>

                {match.found_report.whatsapp_share_url && (
                    <a
                        href={match.found_report.whatsapp_share_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-900 transition py-3 text-sm font-semibold text-white"
                    >
                        {/* chat icon */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        Hubungi Penemu
                    </a>
                )}

                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: "Hasil Kecocokan TemuKan",
                                url: window.location.href,
                            });
                        } else {
                            navigator.clipboard.writeText(window.location.href);
                        }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                    Bagikan Hasil
                </button>
            </div>
        </PageWrapper>
    );
}