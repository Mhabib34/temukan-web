"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, User, Calendar, Phone, Share2, Edit2, Trash2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLaporanDetail, useDeleteLaporan } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Link from "next/link";
import {ReportDetailSkeleton} from "@/components/report/ReportDetailSkeleton";

// Mini-map Leaflet — SSR disabled
const MiniMap = dynamic(() => import("@/components/report/MiniMap"), { ssr: false });

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatTanggal(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

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

export default function LaporanDetailPage() {
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
        //eslint-disable-next-line
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
            {/* ── Hero Foto ── */}
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "Foto laporan"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-100">
                        <User className="h-20 w-20 text-stone-300" />
                    </div>
                )}

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:bg-white"
                >
                    <ArrowLeft className="h-4 w-4 text-stone-700" />
                </button>

                {/* Badge type */}
                <span
                    className={[
                        "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
                        isMissing
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white",
                    ].join(" ")}
                >
                    {isMissing ? "Hilang" : "Ditemukan"}
                </span>

                {/* Overlay resolved */}
                {isResolved && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                        <span className="text-sm font-semibold text-white">✓ Sudah Ditemukan</span>
                    </div>
                )}
            </div>

            {/* ── Konten ── */}
            <div className="mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* ── Kolom Kiri (info utama) ── */}
                    <div className="space-y-5 md:col-span-2">
                        {/* Nama & status */}
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900">
                                {laporan.name ?? "Nama tidak diketahui"}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span
                                    className={[
                                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        isResolved
                                            ? "bg-stone-100 text-stone-500"
                                            : "bg-orange-100 text-orange-700",
                                    ].join(" ")}
                                >
                                    {isResolved ? "Selesai" : "Aktif"}
                                </span>
                                <span className="text-sm text-stone-400">
                                    Dilaporkan {formatTanggal(laporan.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Info dasar */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Informasi Orang
                            </h2>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <div>
                                    <dt className="text-stone-400">Jenis Kelamin</dt>
                                    <dd className="font-medium text-stone-800">
                                        {GENDER_LABEL[laporan.gender]}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-stone-400">Perkiraan Usia</dt>
                                    <dd className="font-medium text-stone-800">
                                        {laporan.estimated_age !== null
                                            ? `${laporan.estimated_age} tahun`
                                            : "Tidak diketahui"}
                                    </dd>
                                </div>
                                <div className="col-span-2">
                                    <dt className="text-stone-400">Terakhir Terlihat</dt>
                                    <dd className="font-medium text-stone-800">
                                        {laporan.last_seen_location}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-stone-400">Kota</dt>
                                    <dd className="font-medium text-stone-800">{laporan.city}</dd>
                                </div>
                                <div>
                                    <dt className="text-stone-400">Provinsi</dt>
                                    <dd className="font-medium text-stone-800">{laporan.province}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Deskripsi */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Deskripsi
                            </h2>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                                {laporan.description}
                            </p>
                        </div>

                        {/* Mini-map */}
                        {hasCoords && (
                            <div className="overflow-hidden rounded-2xl border border-stone-100 shadow-sm">
                                <div className="flex items-center gap-2 bg-white px-4 py-3">
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium text-stone-700">
                                        Lokasi di Peta
                                    </span>
                                </div>
                                <MiniMap
                                    lat={laporan.latitude!}
                                    lng={laporan.longitude!}
                                    label={laporan.name ?? laporan.last_seen_location}
                                    type={laporan.type}
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Kolom Kanan (sidebar) ── */}
                    <div className="space-y-4">
                        {/* Reporter */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Dilaporkan Oleh
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                    {laporan.reporter.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-stone-800">
                                        {laporan.reporter.name}
                                    </p>
                                    <p className="text-xs text-stone-400">
                                        {ROLE_LABEL[laporan.reporter.role] ?? laporan.reporter.role}
                                    </p>
                                </div>
                            </div>
                            {laporan.reporter.phone && (
                                <a
                                    href={`tel:${laporan.reporter.phone}`}
                                    className="mt-3 flex items-center gap-2 text-sm text-stone-500 transition hover:text-orange-600"
                                >
                                    <Phone className="h-4 w-4" />
                                    {laporan.reporter.phone}
                                </a>
                            )}
                        </div>

                        {/* Tanggal */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                <Calendar className="h-4 w-4 shrink-0 text-stone-400" />
                                <span>
                                    Diperbarui{" "}
                                    <span className="font-medium text-stone-700">
                                        {formatTanggal(laporan.updated_at)}
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* Tombol Share WhatsApp */}
                        <a
                            href={laporan.whatsapp_share_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22c35d] active:scale-95"
                        >
                            <Share2 className="h-4 w-4" />
                            Bagikan via WhatsApp
                        </a>

                        {/* Tombol Owner */}
                        {isOwner && (
                            <div className="flex gap-2">
                                <Link
                                    href={`/laporan/${laporan.id}/edit`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-orange-300 hover:text-orange-600"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-medium text-red-500 transition hover:border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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