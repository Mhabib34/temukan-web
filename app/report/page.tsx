"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLaporanList } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { ReportListParams, ReportType, ReportStatus, ReportGender } from "@/types";
import {ReportCard, ReportCardSkeleton} from "@/components/report/ReportCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const params: ReportListParams = {
        type: (searchParams.get("type") as ReportType) || undefined,
        status: (searchParams.get("status") as ReportStatus) || undefined,
        gender: (searchParams.get("gender") as ReportGender) || undefined,
        city: searchParams.get("city") || undefined,
        q: searchParams.get("q") || undefined,
        page: Number(searchParams.get("page")) || 1,
        limit: 12,
    };

    const setParams = useCallback(
        (updates: Partial<ReportListParams>) => {
            const current = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([k, v]) => {
                if (v === undefined || v === "") {
                    current.delete(k);
                } else {
                    current.set(k, String(v));
                }
            });
            // Reset ke page 1 saat filter berubah
            if (!("page" in updates)) current.set("page", "1");
            router.push(`/report?${current.toString()}`);
        },
        [searchParams, router]
    );

    const clearAll = useCallback(() => {
        router.push("/report");
    }, [router]);

    const activeFilterCount = [
        params.type,
        params.status,
        params.gender,
        params.city,
    ].filter(Boolean).length;

    return { params, setParams, clearAll, activeFilterCount };
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
    params: ReportListParams;
    setParams: (updates: Partial<ReportListParams>) => void;
}

function FilterPanel({ params, setParams }: FilterPanelProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* Type */}
            <select
                value={params.type ?? ""}
                onChange={(e) =>
                    setParams({ type: (e.target.value as ReportType) || undefined })
                }
                className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
                <option value="">Semua Jenis</option>
                <option value="missing">Hilang</option>
                <option value="found">Ditemukan</option>
            </select>

            {/* Status */}
            <select
                value={params.status ?? ""}
                onChange={(e) =>
                    setParams({ status: (e.target.value as ReportStatus) || undefined })
                }
                className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="resolved">Selesai</option>
            </select>

            {/* Gender */}
            <select
                value={params.gender ?? ""}
                onChange={(e) =>
                    setParams({ gender: (e.target.value as ReportGender) || undefined })
                }
                className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
                <option value="">Semua Gender</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="unknown">Tidak diketahui</option>
            </select>

            {/* City */}
            <input
                type="text"
                placeholder="Kota..."
                value={params.city ?? ""}
                onChange={(e) => setParams({ city: e.target.value || undefined })}
                className="w-32 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-700 shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
}

function Pagination({ page, totalPages, onPage }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPage(page - 1)}
                disabled={page <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
                <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                    (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - page) <= 1
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                        acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                }, [])
                .map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-1 text-sm text-stone-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                p === page
                                    ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

            <button
                onClick={() => onPage(page + 1)}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 disabled:opacity-40"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportPage() {
    const [showFilter, setShowFilter] = useState(false);
    const { params, setParams, clearAll, activeFilterCount } = useFilters();

    const { data, isLoading, isError, error } = useLaporanList(params);

    const reports = data?.data.reports ?? [];
    const meta = data?.data.meta;

    // Search dengan debounce sederhana via controlled input
    const [searchInput, setSearchInput] = useState(params.q ?? "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setParams({ q: searchInput || undefined });
    };

    return (
        <PageWrapper>
            {/* Header */}
            <div className="mb-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-stone-900">Laporan</h1>
                        {meta && (
                            <p className="text-sm text-stone-500">
                                {meta.total} laporan ditemukan
                            </p>
                        )}
                    </div>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                        />
                        <input
                            type="search"
                            placeholder="Cari nama, deskripsi..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilter((f) => !f)}
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors ${
                            showFilter || activeFilterCount > 0
                                ? "border-orange-400 bg-orange-50 text-orange-500"
                                : "border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
                        }`}
                        aria-label="Filter"
                    >
                        <SlidersHorizontal size={16} />
                        {activeFilterCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </form>

                {/* Filter panel */}
                {showFilter && (
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-stone-700">
                                Filter
                            </span>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500"
                                >
                                    <X size={12} />
                                    Hapus semua
                                </button>
                            )}
                        </div>
                        <FilterPanel params={params} setParams={setParams} />
                    </div>
                )}

                {/* Active filter chips */}
                {activeFilterCount > 0 && !showFilter && (
                    <div className="flex flex-wrap gap-1.5">
                        {params.type && (
                            <Chip
                                label={params.type === "missing" ? "Hilang" : "Ditemukan"}
                                onRemove={() => setParams({ type: undefined })}
                            />
                        )}
                        {params.status && (
                            <Chip
                                label={params.status === "active" ? "Aktif" : "Selesai"}
                                onRemove={() => setParams({ status: undefined })}
                            />
                        )}
                        {params.gender && (
                            <Chip
                                label={
                                    { male: "Laki-laki", female: "Perempuan", unknown: "Tidak diketahui" }[
                                        params.gender
                                        ]
                                }
                                onRemove={() => setParams({ gender: undefined })}
                            />
                        )}
                        {params.city && (
                            <Chip
                                label={params.city}
                                onRemove={() => setParams({ city: undefined })}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ReportCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <p className="text-sm font-medium text-red-500">
                        {(error as Error)?.message ?? "Gagal memuat laporan"}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
                    >
                        Coba lagi
                    </button>
                </div>
            ) : reports.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                    <p className="text-base font-semibold text-stone-600">
                        Tidak ada laporan
                    </p>
                    <p className="text-sm text-stone-400">
                        Coba ubah filter atau kata kunci pencarian
                    </p>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="mt-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                        >
                            Hapus filter
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {reports.map((r) => (
                            <ReportCard key={r.id} laporan={r} />
                        ))}
                    </div>

                    {meta && (
                        <div className="mt-8">
                            <Pagination
                                page={meta.page}
                                totalPages={meta.total_pages}
                                onPage={(p) => setParams({ page: p })}
                            />
                        </div>
                    )}
                </>
            )}
        </PageWrapper>
    );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
            {label}
            <button onClick={onRemove} aria-label="Hapus filter">
                <X size={10} />
            </button>
        </span>
    );
}