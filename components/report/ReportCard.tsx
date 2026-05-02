"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, User } from "lucide-react";
import type { Report } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
    missing: {
        label: "Hilang",
        className: "bg-red-50 text-red-600 border border-red-100",
    },
    found: {
        label: "Ditemukan",
        className: "bg-emerald-50 text-emerald-600 border border-emerald-100",
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

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(iso));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ReportCardProps {
    laporan: Report;
}

export function ReportCard({ laporan }: ReportCardProps) {
    const typeConfig = TYPE_CONFIG[laporan.type];
    const statusConfig = STATUS_CONFIG[laporan.status];

    return (
        <Link
            href={`/report/${laporan.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
            {/* Foto */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                {laporan.photo_url ? (
                    <Image
                        src={laporan.photo_url}
                        alt={laporan.name ?? "Foto laporan"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <User size={40} className="text-stone-300" />
                    </div>
                )}

                {/* Type badge — overlay di foto */}
                <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeConfig.className}`}
                >
                    {typeConfig.label}
                </span>

                {/* Resolved overlay */}
                {laporan.status === "resolved" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-stone-600">
                            ✓ Sudah Ditemukan
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-3.5">
                {/* Nama */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 flex-1 text-sm font-semibold text-stone-800">
                        {laporan.name ?? "Nama tidak diketahui"}
                    </h3>
                    <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusConfig.className}`}
                    >
                        {statusConfig.label}
                    </span>
                </div>

                {/* Info singkat */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
                    <span>{GENDER_LABEL[laporan.gender]}</span>
                    {laporan.estimated_age && (
                        <span>~{laporan.estimated_age} tahun</span>
                    )}
                </div>

                {/* Lokasi */}
                <p className="flex items-center gap-1 text-xs text-stone-500">
                    <MapPin size={11} className="shrink-0 text-orange-400" />
                    <span className="line-clamp-1">
                        {laporan.last_seen_location}, {laporan.city}
                    </span>
                </p>

                {/* Tanggal */}
                <p className="mt-auto flex items-center gap-1 text-xs text-stone-400">
                    <Calendar size={11} className="shrink-0" />
                    {formatDate(laporan.created_at)}
                </p>
            </div>
        </Link>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function ReportCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="aspect-[4/3] w-full animate-pulse bg-stone-100" />
            <div className="flex flex-col gap-2.5 p-3.5">
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-stone-100" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-stone-100" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-stone-100" />
                <div className="h-3 w-1/3 animate-pulse rounded-full bg-stone-100" />
            </div>
        </div>
    );
}