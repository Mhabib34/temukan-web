"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Edit2,
    Trash2,
    CheckCircle2,
    CheckCheck,
    Plus,
    FileText,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useMyLaporan, useDeleteLaporan, useUpdateLaporan } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { Report } from "@/types";
import {ReportCard, ReportCardSkeleton} from "@/components/report/ReportCard";

// ─── Redirect if not logged in ────────────────────────────────────────────────
// Handled via middleware or layout — but we guard here too

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

type DialogType = "delete" | "resolve";

function ConfirmDialog({
                           type,
                           onConfirm,
                           onCancel,
                           isLoading,
                       }: {
    type: DialogType;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    const isDelete = type === "delete";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div
                    className={[
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                        isDelete ? "bg-red-100" : "bg-green-100",
                    ].join(" ")}
                >
                    {isDelete ? (
                        <Trash2 className="h-5 w-5 text-red-600" />
                    ) : (
                        <CheckCheck className="h-5 w-5 text-green-600" />
                    )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                    {isDelete ? "Hapus Laporan?" : "Tandai Selesai?"}
                </h3>
                <p className="mb-6 text-sm text-stone-500">
                    {isDelete
                        ? "Tindakan ini tidak dapat dibatalkan. Laporan beserta foto akan dihapus permanen."
                        : "Laporan akan ditandai sebagai sudah ditemukan dan tidak akan muncul di pencarian aktif."}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={[
                            "flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition disabled:opacity-60",
                            isDelete
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700",
                        ].join(" ")}
                    >
                        {isLoading
                            ? isDelete
                                ? "Menghapus..."
                                : "Menyimpan..."
                            : isDelete
                                ? "Ya, Hapus"
                                : "Ya, Tandai Selesai"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Report Action Card ───────────────────────────────────────────────────────
// Wraps LaporanCard with action buttons below

function ReportActionCard({ laporan }: { laporan: Report }) {
    const [dialog, setDialog] = useState<DialogType | null>(null);
    const deleteMutation = useDeleteLaporan();
    const updateMutation = useUpdateLaporan(laporan.id);
    const isResolved = laporan.status === "resolved";

    function handleDelete() {
        deleteMutation.mutate(laporan.id, {
            onSuccess: () => {
                setDialog(null);
                toast.success("Laporan berhasil dihapus");
            },
            onError: (err: unknown) => {
                const msg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data
                        ?.message ?? (err as Error).message;
                toast.error(msg ?? "Gagal menghapus laporan");
                setDialog(null);
            },
        });
    }

    function handleResolve() {
        updateMutation.mutate(
            { status: "resolved" },
            {
                onSuccess: () => {
                    setDialog(null);
                    toast.success("Laporan ditandai selesai");
                },
                onError: (err: unknown) => {
                    const msg =
                        (err as { response?: { data?: { message?: string } } })?.response?.data
                            ?.message ?? (err as Error).message;
                    toast.error(msg ?? "Gagal memperbarui laporan");
                    setDialog(null);
                },
            }
        );
    }

    const isDialogLoading = deleteMutation.isPending || updateMutation.isPending;

    return (
        <>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:shadow-md">
                {/* Reuse LaporanCard tanpa wrapper card-nya sendiri */}
                <div className="flex-1">
                    <ReportCard laporan={laporan} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 border-t border-stone-100 px-3 py-2.5">
                    {/* Edit */}
                    <Link
                        href={`/report/${laporan.id}/edit`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2 text-xs font-medium text-stone-600 transition hover:border-orange-300 hover:text-orange-600"
                    >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                    </Link>

                    {/* Tandai Selesai — hanya tampil kalau masih active */}
                    {!isResolved && (
                        <button
                            onClick={() => setDialog("resolve")}
                            disabled={isDialogLoading}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-green-100 py-2 text-xs font-medium text-green-600 transition hover:border-green-200 hover:bg-green-50 disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selesai
                        </button>
                    )}

                    {/* Hapus */}
                    <button
                        onClick={() => setDialog("delete")}
                        disabled={isDialogLoading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </button>
                </div>
            </div>

            {dialog && (
                <ConfirmDialog
                    type={dialog}
                    onConfirm={dialog === "delete" ? handleDelete : handleResolve}
                    onCancel={() => setDialog(null)}
                    isLoading={isDialogLoading}
                />
            )}
        </>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

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
                Halaman <span className="font-semibold text-stone-800">{page}</span> dari{" "}
                <span className="font-semibold text-stone-800">{totalPages}</span>
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
        isLoggedIn ? { page, limit: LIMIT } : undefined
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
                        {(error as { response?: { data?: { message?: string } } })?.response?.data
                            ?.message ?? "Terjadi kesalahan. Silakan coba lagi."}
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
                        Kamu belum membuat laporan apapun. Mulai laporkan orang yang hilang atau
                        yang kamu temukan.
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