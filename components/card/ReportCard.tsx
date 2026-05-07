"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight, Share2, User } from "lucide-react";
import type { Report } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
    missing: {
        label: "Hilang",
        className: "bg-red-500 text-white",
    },
    found: {
        label: "Ditemukan",
        className: "bg-emerald-500 text-white",
    },
};

const STATUS_CONFIG = {
    active: {
        label: "Aktif",
        className: "bg-orange-50 text-orange-500 border border-orange-100",
    },
    resolved: {
        label: "Selesai",
        className: "bg-stone-100 text-stone-400 border border-stone-200",
    },
};

const GENDER_LABEL: Record<string, string> = {
    male: "Laki-laki",
    female: "Perempuan",
    unknown: "Tidak diketahui",
};

function formatTimeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ReportCardProps {
    laporan: Report;
}

export function ReportCard({ laporan }: ReportCardProps) {
    const typeConfig = TYPE_CONFIG[laporan.type];

    return (
        <Link
            href={`/report/${laporan.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
            {/* Foto */}
            <div className="relative w-full overflow-hidden bg-stone-100" style={{ aspectRatio: "3/4" }}>
                {laporan.photo_url ? (
                    <Image
                        src={laporan.photo_url}
                        alt={laporan.name ?? "Foto laporan"}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <User size={48} className="text-stone-300" />
                    </div>
                )}

                {/* Gradient overlay bawah */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Type badge — atas kiri */}
                <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${typeConfig.className}`}
                >
                    {typeConfig.label}
                </span>

                {/* Share button — atas kanan */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (navigator.share) {
                            navigator.share({ title: laporan.name ?? "Laporan", url: `/report/${laporan.id}` });
                        }
                    }}
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-stone-600 backdrop-blur-sm transition hover:bg-white hover:text-orange-500"
                    aria-label="Bagikan"
                >
                    <Share2 size={13} />
                </button>

                {/* Resolved overlay */}
                {laporan.status === "resolved" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-stone-600">
                            ✓ Sudah Ditemukan
                        </span>
                    </div>
                )}

                {/* Nama & info — overlay bawah */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-sm font-bold text-white drop-shadow">
                        {laporan.name ?? "Nama tidak diketahui"}
                    </p>
                    <p className="text-xs text-white/80">
                        {GENDER_LABEL[laporan.gender]}
                        {laporan.estimated_age ? ` · ${laporan.estimated_age} Thn` : ""}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-3">
                {/* Lokasi */}
                <p className="flex items-center gap-1 text-xs text-stone-500">
                    <MapPin size={11} className="shrink-0 text-orange-400" />
                    <span className="line-clamp-1">
                        {laporan.last_seen_location}, {laporan.city}
                    </span>
                </p>

                {/* Footer: waktu + arrow */}
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs text-stone-400">
                        <Clock size={10} className="shrink-0" />
                        Update {formatTimeAgo(laporan.created_at)}
                    </p>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                        <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ReportCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
            <div className="w-full animate-pulse bg-stone-100" style={{ aspectRatio: "3/4" }} />
            <div className="flex flex-col gap-2 p-3">
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-stone-100" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-stone-100" />
            </div>
        </div>
    );
}