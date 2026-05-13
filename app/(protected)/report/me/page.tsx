"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMyLaporan } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ReportCardSkeleton } from "@/components/card/ReportCard";
import { ReportActionCard } from "@/components/card/ReportActionCard";

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="text-sm text-stone-500">
        Halaman <span className="font-semibold text-stone-800">{page}</span>{" "}
        dari <span className="font-semibold text-stone-800">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportMePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  // Guard: redirect jika belum login
  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const { data, isLoading, isError, error } = useMyLaporan(
    isLoggedIn ? { page, limit: LIMIT } : undefined,
  );

  const reports = data?.data.reports ?? [];
  const meta = data?.data.meta;
  const totalPages = meta?.total_pages ?? 1;
  const total = meta?.total ?? 0;

  if (!isLoggedIn) return null;

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Laporan Saya</h1>
          {!isLoading && meta && (
            <p className="mt-0.5 text-sm text-stone-500">
              {total > 0 ? `${total} laporan` : "Belum ada laporan"}
            </p>
          )}
        </div>
        <Link
          href="/report/new"
          className="flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Buat Laporan</span>
          <span className="sm:hidden">Buat</span>
        </Link>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <AlertCircle className="h-8 w-8 text-stone-400" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-stone-800">
            Gagal Memuat Laporan
          </h2>
          <p className="mb-6 max-w-xs text-sm text-stone-500">
            {(error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <FileText className="h-8 w-8 text-orange-300" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-stone-800">
            Belum Ada Laporan
          </h2>
          <p className="mb-6 max-w-xs text-sm text-stone-500">
            Kamu belum membuat laporan apapun. Mulai laporkan orang yang hilang
            atau yang kamu temukan.
          </p>
          <Link
            href="/report/new"
            className="flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Buat Laporan Pertama
          </Link>
        </div>
      )}

      {/* ── Grid laporan ── */}
      {!isLoading && !isError && reports.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {reports.map((laporan) => (
              <ReportActionCard key={laporan.id} laporan={laporan} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
