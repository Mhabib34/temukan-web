"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLaporanList } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { ReportListParams, ReportType, ReportStatus, ReportGender } from "@/types";
import { ReportCard, ReportCardSkeleton } from "@/components/report/ReportCard";

// ─── Custom hook: debounce sebuah nilai ───────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFilters() {
    // Baca URL params langsung — TANPA debounce di sini
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

// ─── Debounced Search Input ───────────────────────────────────────────────────
// Komponen terpisah agar state lokal tidak bikin re-render parent

interface DebouncedSearchInputProps {
    initialValue: string | undefined;
    onCommit: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    iconSize?: number;
}

function DebouncedSearchInput({
                                  initialValue,
                                  onCommit,
                                  placeholder = "Cari...",
                                  className = "",
                                  iconSize = 14,
                              }: DebouncedSearchInputProps) {
    const [local, setLocal] = useState(initialValue ?? "");
    const debounced = useDebounce(local, 500);

    // Sinkronkan ke URL hanya setelah debounce selesai
    useEffect(() => {
        onCommit(debounced || undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    // Sinkronkan lokal jika URL berubah dari luar (mis. clearAll)
    useEffect(() => {
        setLocal(initialValue ?? "");
    }, [initialValue]);

    return (
        <div className="relative">
            <Search
                size={iconSize}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className={className}
            />
        </div>
    );
}

// ─── Sidebar Filter (Desktop) ─────────────────────────────────────────────────

interface SidebarFilterProps {
    params: ReportListParams;
    setParams: (updates: Partial<ReportListParams>) => void;
    clearAll: () => void;
    activeFilterCount: number;
}

function SidebarFilter({ params, setParams, clearAll, activeFilterCount }: SidebarFilterProps) {
    return (
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm self-start sticky top-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-stone-800">Filter Pencarian</h2>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors"
                    >
                        <X size={12} />
                        Hapus semua
                    </button>
                )}
            </div>

            {/* Nama / Deskripsi — debounced (q) */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Nama atau Deskripsi
                </label>
                <DebouncedSearchInput
                    initialValue={params.q}
                    onCommit={(v) => setParams({ q: v })}
                    placeholder="Cari nama, ciri-ciri..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    iconSize={14}
                />
            </div>

            {/* Kota — debounced (city) */}
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Kota
                </label>
                <DebouncedSearchInput
                    initialValue={params.city}
                    onCommit={(v) => setParams({ city: v })}
                    placeholder="Contoh: Medan, Surabaya..."
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    iconSize={14}
                />
            </div>

            {/* Tipe Laporan */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Tipe Laporan
                </label>
                <div className="space-y-2">
                    {[
                        { value: "missing", label: "Orang Hilang", icon: "🔍" },
                        { value: "found", label: "Temuan Identitas", icon: "👆" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    type:
                                        params.type === opt.value
                                            ? undefined
                                            : (opt.value as ReportType),
                                })
                            }
                            className={`w-full flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                params.type === opt.value
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                    : "border border-stone-200 text-stone-600 hover:border-orange-200 hover:bg-orange-50"
                            }`}
                        >
                            <span>{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Status
                </label>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: "active", label: "Aktif" },
                        { value: "resolved", label: "Selesai" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    status:
                                        params.status === opt.value
                                            ? undefined
                                            : (opt.value as ReportStatus),
                                })
                            }
                            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                                params.status === opt.value
                                    ? "bg-orange-500 text-white"
                                    : "border border-stone-200 text-stone-600 hover:border-orange-300"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Jenis Kelamin
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: "male", label: "Pria", icon: "♂" },
                        { value: "female", label: "Wanita", icon: "♀" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setParams({
                                    gender:
                                        params.gender === opt.value
                                            ? undefined
                                            : (opt.value as ReportGender),
                                })
                            }
                            className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-sm font-medium transition-all ${
                                params.gender === opt.value
                                    ? "border-orange-400 bg-orange-50 text-orange-600"
                                    : "border-stone-200 text-stone-500 hover:border-orange-200"
                            }`}
                        >
                            <span className="text-lg">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeFilterCount > 0 && (
                <button
                    onClick={clearAll}
                    className="w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white transition hover:bg-stone-700"
                >
                    Hapus Filter
                </button>
            )}
        </aside>
    );
}

// ─── Mobile Type Tabs ─────────────────────────────────────────────────────────

interface TypeTabsProps {
    value: ReportType | undefined;
    onChange: (v: ReportType | undefined) => void;
}

function TypeTabs({ value, onChange }: TypeTabsProps) {
    const tabs = [
        { value: undefined, label: "Semua" },
        { value: "missing" as ReportType, label: "Hilang" },
        { value: "found" as ReportType, label: "Ditemukan" },
    ];

    return (
        <div className="flex gap-2 lg:hidden">
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    onClick={() => onChange(tab.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        value === tab.value
                            ? "bg-orange-500 text-white shadow-sm"
                            : "border border-stone-200 bg-white text-stone-600"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────

interface MobileFilterDrawerProps {
    open: boolean;
    onClose: () => void;
    params: ReportListParams;
    setParams: (updates: Partial<ReportListParams>) => void;
    clearAll: () => void;
    activeFilterCount: number;
}

function MobileFilterDrawer({
                                open,
                                onClose,
                                params,
                                setParams,
                                clearAll,
                                activeFilterCount,
                            }: MobileFilterDrawerProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden mb-10">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 rounded-t-3xl bg-white p-5 pb-8 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-stone-800">Filter</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 hover:bg-stone-100">
                        <X size={18} className="text-stone-500" />
                    </button>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Status
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: "active" as ReportStatus, label: "Aktif" },
                            { value: "resolved" as ReportStatus, label: "Selesai" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() =>
                                    setParams({
                                        status:
                                            params.status === opt.value ? undefined : opt.value,
                                    })
                                }
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    params.status === opt.value
                                        ? "bg-orange-500 text-white"
                                        : "border border-stone-200 text-stone-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Jenis Kelamin
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: "male" as ReportGender, label: "Laki-laki" },
                            { value: "female" as ReportGender, label: "Perempuan" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() =>
                                    setParams({
                                        gender:
                                            params.gender === opt.value ? undefined : opt.value,
                                    })
                                }
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                    params.gender === opt.value
                                        ? "bg-orange-500 text-white"
                                        : "border border-stone-200 text-stone-600"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kota — debounced */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        Kota
                    </label>
                    <DebouncedSearchInput
                        initialValue={params.city}
                        onCommit={(v) => setParams({ city: v })}
                        placeholder="Cari kota..."
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        iconSize={14}
                    />
                </div>

                <div className="flex gap-2">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => {
                                clearAll();
                                onClose();
                            }}
                            className="flex-1 rounded-xl border border-stone-200 py-3 text-sm font-semibold text-stone-600"
                        >
                            Hapus Filter
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md shadow-orange-200"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
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

            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
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
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const { params, setParams, clearAll, activeFilterCount } = useFilters();

    const { data, isLoading, isError, error } = useLaporanList(params);

    const reports = data?.data.reports ?? [];
    const meta = data?.data.meta;

    // Search bar mobile — debounced terpisah
    const [mobileSearch, setMobileSearch] = useState(params.q ?? "");
    const debouncedMobileSearch = useDebounce(mobileSearch, 500);

    useEffect(() => {
        setParams({ q: debouncedMobileSearch || undefined });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedMobileSearch]);

    // Sinkronkan jika URL di-clear dari luar
    useEffect(() => {
        setMobileSearch(params.q ?? "");
    }, [params.q]);

    return (
        <PageWrapper>
            {/* Mobile: Header */}
            <div className="mb-4 lg:hidden">
                <h1 className="text-2xl font-extrabold text-stone-900">Laporan Terkini</h1>
                <p className="text-sm text-stone-400">Membantu mempertemukan yang terpisah</p>
            </div>

            {/* Mobile: Search */}
            <div className="mb-4 flex gap-2 lg:hidden">
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                    />
                    <input
                        type="search"
                        placeholder="Cari nama, lokasi, atau ciri-ciri..."
                        value={mobileSearch}
                        onChange={(e) => setMobileSearch(e.target.value)}
                        className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowMobileFilter(true)}
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors ${
                        activeFilterCount > 0
                            ? "border-orange-400 bg-orange-50 text-orange-500"
                            : "border-stone-200 bg-white text-stone-500"
                    }`}
                >
                    <SlidersHorizontal size={16} />
                    {activeFilterCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile: Type tabs */}
            <div className="mb-4 lg:hidden">
                <TypeTabs value={params.type} onChange={(v) => setParams({ type: v })} />
            </div>

            {/* Layout: sidebar + content */}
            <div className="flex gap-6 items-start">
                {/* Sidebar filter — desktop only */}
                <SidebarFilter
                    params={params}
                    setParams={setParams}
                    clearAll={clearAll}
                    activeFilterCount={activeFilterCount}
                />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Desktop header */}
                    <div className="mb-5 hidden lg:block">
                        <h1 className="text-3xl font-extrabold text-stone-900">Semua Laporan</h1>
                        {meta && (
                            <p className="mt-1 text-sm text-stone-400">
                                Menampilkan {meta.total} laporan aktif di sekitar Anda.
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
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
                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                                <Search size={28} className="text-stone-300" />
                            </div>
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
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
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
                </div>
            </div>

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
                open={showMobileFilter}
                onClose={() => setShowMobileFilter(false)}
                params={params}
                setParams={setParams}
                clearAll={clearAll}
                activeFilterCount={activeFilterCount}
            />
        </PageWrapper>
    );
}