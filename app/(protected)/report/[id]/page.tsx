"use client";


import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Trash2,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";
import { useLaporanDetail, useDeleteLaporan} from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ReportDetailSkeleton } from "@/components/skeleton/ReportDetailSkeleton";
import {ReportDetailMobileLayout} from "@/components/report/ReportDetailMobileLayout";
import {ReportDetailDesktopLayout} from "@/components/report/ReportDetailDesktopLayout";

const GENDER_LABEL: Record<string, string> = {
    male: "Laki-laki",
    female: "Perempuan",
    unknown: "Tidak Diketahui",
};

const ROLE_LABEL: Record<string, string> = {
    finder: "Penemu",
    seeker: "Pencari",
    volunteer: "Relawan",
};



// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteDialog({
                          onConfirm,
                          onCancel,
                          isLoading,
                      }: {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">Hapus Laporan?</h3>
                <p className="mb-6 text-sm text-stone-500">
                    Tindakan ini tidak dapat dibatalkan. Laporan beserta foto akan dihapus permanen.
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
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                        {isLoading ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { data, isLoading, isError, error } = useLaporanDetail(id);
    const deleteMutation = useDeleteLaporan();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // ── Loading ──
    if (isLoading) {
        return (
            <PageWrapper>
                <ReportDetailSkeleton />
            </PageWrapper>
        );
    }

    // ── Error / 404 ──
    if (isError || !data?.data) {
        // eslint-disable-next-line
        const is404 = (error as any)?.response?.status === 404;
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                        <AlertCircle className="h-8 w-8 text-stone-400" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-stone-800">
                        {is404 ? "Laporan Tidak Ditemukan" : "Terjadi Kesalahan"}
                    </h2>
                    <p className="mb-6 max-w-xs text-sm text-stone-500">
                        {is404
                            ? "Laporan yang kamu cari tidak ada atau sudah dihapus."
                            : "Gagal memuat laporan. Silakan coba lagi."}
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </button>
                </div>
            </PageWrapper>
        );
    }

    const laporan = data.data;
    const isOwner = !!user && user.id === laporan.reporter_id;
    const isMissing = laporan.type === "missing";
    const isResolved = laporan.status === "resolved";
    const hasCoords = laporan.latitude !== null && laporan.longitude !== null;


    function handleDelete() {
        deleteMutation.mutate(laporan.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    }

    return (
        <PageWrapper padded={false}>

            {/* ════════════════════════════════════════
                MOBILE LAYOUT  (< md)
            ════════════════════════════════════════ */}
            <ReportDetailMobileLayout laporan={laporan} isMissing={isMissing} isResolved={isResolved} GENDER_LABEL={GENDER_LABEL} hasCoords={hasCoords} ROLE_LABEL={ROLE_LABEL} isOwner={isOwner} setShowDeleteDialog={setShowDeleteDialog}/>

            {/* ════════════════════════════════════════
                DESKTOP LAYOUT  (≥ md)
            ════════════════════════════════════════ */}
            <ReportDetailDesktopLayout laporan={laporan} isMissing={isMissing} isResolved={isResolved} GENDER_LABEL={GENDER_LABEL} hasCoords={hasCoords} ROLE_LABEL={ROLE_LABEL} isOwner={isOwner} setShowDeleteDialog={setShowDeleteDialog} data={data}/>

            {/* ── Delete Dialog ── */}
            {showDeleteDialog && (
                <DeleteDialog
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteDialog(false)}
                    isLoading={deleteMutation.isPending}
                />
            )}
        </PageWrapper>
    );
}