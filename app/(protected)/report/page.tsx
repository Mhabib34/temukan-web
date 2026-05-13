"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLaporanList } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type {
  ReportListParams,
  ReportType,
  ReportStatus,
  ReportGender,
} from "@/types";
import { ReportCard, ReportCardSkeleton } from "@/components/card/ReportCard";
import { useDebouncedValue } from "@/utils/useDebounce";
import { TypeTabs } from "@/components/report/TypeTabs";
import { SidebarFilter } from "@/components/report/SidebarFilter";
import { Pagination } from "@/components/report/Pagination";
import { MobileFilterDrawer } from "@/components/report/MobileFilter";

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
    [searchParams, router],
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

export default function ReportPage() {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { params, setParams, clearAll, activeFilterCount } = useFilters();

  const { data, isLoading, isError, error } = useLaporanList(params);

  const reports = data?.data.reports ?? [];
  const meta = data?.data.meta;

  // Search bar mobile — debounced terpisah
  const [mobileSearch, setMobileSearch] = useState(params.q ?? "");
  const debouncedMobileSearch = useDebouncedValue(mobileSearch, 500);

  useEffect(() => {
    setParams({ q: debouncedMobileSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMobileSearch]);

  return (
    <PageWrapper>
      {/* Mobile: Header */}
      <div className="mb-4 lg:hidden">
        <h1 className="text-2xl font-extrabold text-stone-900">
          Laporan Terkini
        </h1>
        <p className="text-sm text-stone-400">
          Membantu mempertemukan yang terpisah
        </p>
      </div>

      {/* Mobile: Search */}
      <div className="mb-4 flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            key={params.q ?? ""}
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
        <TypeTabs
          value={params.type}
          onChange={(v) => setParams({ type: v })}
        />
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
            <h1 className="text-3xl font-extrabold text-stone-900">
              Semua Laporan
            </h1>
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
