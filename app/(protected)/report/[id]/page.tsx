"use client";

import { format, formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
    MapPin,
    User,
    Calendar,
    Phone,
    Share2,
    Edit2,
    Trash2,
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
} from "lucide-react";
import { useLaporanDetail, useDeleteLaporan, useLaporanList } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import Link from "next/link";
import { ReportDetailSkeleton } from "@/components/report/ReportDetailSkeleton";
import Image from "next/image";

const MiniMap = dynamic(() => import("@/components/report/MiniMap"), { ssr: false });

// ─── Component: Laporan Terkait Card ──────────────────────────────────────────

function LaporanTerkaitCard({ laporan }: { laporan: any }) {
    const isMissing = laporan.type === "missing";
    const waktuLabel = formatDistanceToNow(new Date(laporan.created_at), {
        addSuffix: true,
        locale: localeId,
    });

    return (
        <Link
            href={`/report/${laporan.id}`}
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-stone-50"
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                {laporan.photo_url ? (
                    <img
                        src={laporan.photo_url}
                        alt={laporan.name ?? "Foto"}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-stone-300" />
                    </div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                    {laporan.city}
                </p>
                <p className="truncate text-sm font-semibold text-stone-800">
                    {laporan.name ?? "Nama tidak diketahui"}
                </p>
                <p className="text-xs text-stone-400">
                    {isMissing ? "Hilang" : "Ditemukan"} {waktuLabel}
                </p>
            </div>
        </Link>
    );
}

function LaporanTerkaitSkeleton() {
    return (
        <div className="space-y-2">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-stone-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-16 animate-pulse rounded bg-stone-100" />
                        <div className="h-3 w-32 animate-pulse rounded bg-stone-100" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-stone-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

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
    return format(new Date(iso), "d MMMM yyyy", { locale: localeId });
}

function formatTanggalWaktu(iso: string) {
    return format(new Date(iso), "d MMMM yyyy • HH:mm 'WIB'", { locale: localeId });
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

// ─── Info Row (mobile style) ──────────────────────────────────────────────────

function InfoRow({
                     icon,
                     label,
                     value,
                 }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    {label}
                </p>
                <p className="text-sm font-medium text-stone-800">{value}</p>
            </div>
        </div>
    );
}

// ─── Info Card (desktop grid) ─────────────────────────────────────────────────

function InfoGrid({ laporan }: { laporan: any }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Usia
                </p>
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                        <Calendar className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-stone-800">
                        {laporan.estimated_age !== null
                            ? `${laporan.estimated_age} Tahun`
                            : "Tidak Diketahui"}
                    </span>
                </div>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Kota
                </p>
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                        <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-stone-800">{laporan.city}</span>
                </div>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Jenis Kelamin
                </p>
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                        <User className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-stone-800">
                        {GENDER_LABEL[laporan.gender]}
                    </span>
                </div>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-white p-3.5 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Provinsi
                </p>
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                        <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-stone-800">{laporan.province}</span>
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

    // Hook dipanggil sebelum semua early return agar urutan hook konsisten.
    // city kosong saat data belum ada — useLaporanList punya enabled: !!params check sendiri.
    const {
        data: dataTerkait,
        isLoading: isLoadingTerkait,
    } = useLaporanList({
        city: data?.data?.city ?? "",
        status: "active",
        limit: 4,
    });
    const laporanTerkait = (dataTerkait?.data?.reports ?? [])
        .filter((r: any) => r.id !== (data?.data?.id ?? ""))
        .slice(0, 3);

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
            <div className="md:hidden flex flex-col justify-center">
                {/* Hero foto full-width dengan overlay gradient */}
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                    {laporan.photo_url ? (
                        <Image
                            src={laporan.photo_url}
                            alt={laporan.name ?? "Foto laporan"}
                            className="h-full w-full object-cover"
                            fill
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-stone-200">
                            <User className="h-24 w-24 text-stone-300" />
                        </div>
                    )}

                    {/* Gradient bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition hover:bg-white/30"
                    >
                        <ChevronLeft className="h-5 w-5 text-white" />
                    </button>

                    {/* Badge type — top right */}
                    <span
                        className={[
                            "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow",
                            isMissing ? "bg-red-500 text-white" : "bg-green-500 text-white",
                        ].join(" ")}
                    >
                        {isMissing ? "HILANG" : "DITEMUKAN"}
                    </span>

                    {/* Resolved overlay */}
                    {isResolved && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                            <span className="text-sm font-semibold text-white">✓ Sudah Ditemukan</span>
                        </div>
                    )}
                </div>

                {/* Card konten — rounded top, naik sedikit ke atas foto */}
                <div className="-mt-5 rounded-t-3xl bg-[#FAFAF8] px-5 pt-6 pb-6 relative z-10">

                    {/* Nama & gender badge */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                        <h1 className="text-2xl font-bold leading-tight text-stone-900">
                            {laporan.name ?? "Nama tidak diketahui"}
                        </h1>
                        <span className="mt-1 shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                            {GENDER_LABEL[laporan.gender]}
                        </span>
                    </div>

                    {/* Status pill */}
                    <div className="mb-5">
                        <span
                            className={[
                                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                                isResolved
                                    ? "bg-stone-100 text-stone-500"
                                    : "bg-orange-100 text-orange-700",
                            ].join(" ")}
                        >
                            {isResolved ? "Selesai" : "Aktif"}
                        </span>
                    </div>

                    {/* Info rows (usia, kota, provinsi) */}
                    <div className="mb-5 divide-y divide-stone-100 rounded-2xl border border-stone-100 bg-white px-4 shadow-sm">
                        <InfoRow
                            icon={<Calendar className="h-4 w-4" />}
                            label="Usia"
                            value={
                                laporan.estimated_age !== null
                                    ? `${laporan.estimated_age} Tahun`
                                    : "Tidak Diketahui"
                            }
                        />
                        <InfoRow
                            icon={<MapPin className="h-4 w-4" />}
                            label="Kota"
                            value={laporan.city}
                        />
                        <InfoRow
                            icon={<MapPin className="h-4 w-4" />}
                            label="Provinsi"
                            value={laporan.province}
                        />
                    </div>

                    {/* Terakhir Terlihat */}
                    <div className="mb-5 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                        <div className="mb-1.5 flex items-center gap-2 text-orange-500">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-semibold">Terakhir Terlihat</span>
                        </div>
                        <p className="text-sm leading-relaxed text-stone-700">
                            {laporan.last_seen_location}
                        </p>
                        <p className="mt-2 text-xs text-stone-400">
                            {formatTanggalWaktu(laporan.updated_at)}
                        </p>
                    </div>

                    {/* Deskripsi */}
                    <div className="mb-5 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                            Deskripsi Fisik &amp; Kronologi
                        </h2>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                            {laporan.description}
                        </p>
                    </div>

                    {/* Mini-map */}
                    {hasCoords && (
                        <div className="mb-5 overflow-hidden rounded-2xl border border-stone-100 shadow-sm">
                            <div className="flex items-center gap-2 bg-white px-4 py-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                                    Lokasi Kejadian
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

                    {/* Pelapor */}
                    <div className="mb-5 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                            Pelapor
                        </h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                    {laporan.reporter.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-stone-800">{laporan.reporter.name}</p>
                                    <p className="text-xs text-stone-400">
                                        {ROLE_LABEL[laporan.reporter.role] ?? laporan.reporter.role}
                                    </p>
                                </div>
                            </div>
                            {/* Verified icon placeholder */}
                            <CheckCircle2 className="h-5 w-5 text-orange-400" />
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

                    {/* Action buttons — inline, tidak fixed, agar tidak tertutup BottomNav */}
                    <div className="flex items-center gap-3">
                        <a
                            href={laporan.whatsapp_share_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#22c35d] active:scale-95"
                        >
                            <Share2 className="h-4 w-4" />
                            Hubungi via WhatsApp
                        </a>
                        {isOwner && (
                            <>
                                <Link
                                    href={`/report/${laporan.id}/edit`}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-600 transition hover:border-orange-300 hover:text-orange-500"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>


            </div>

            {/* ════════════════════════════════════════
                DESKTOP LAYOUT  (≥ md)
            ════════════════════════════════════════ */}
            <div className="hidden md:block bg-[#FAFAF8] min-h-screen">
                {/* Back link */}
                <div className="mx-auto max-w-6xl px-6 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm text-stone-500 transition hover:text-orange-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Pencarian
                    </button>
                </div>

                <div className="mx-auto max-w-6xl py-6">
                    <div className="grid grid-cols-3 gap-10 items-start">

                        {/* ── Kolom 1: Foto + Pelapor ── */}
                        <div className="space-y-4 sticky top-6">
                            {/* Foto */}
                            <div className="relative overflow-hidden rounded-3xl shadow-md" style={{ aspectRatio: "3/4" }}>
                                {laporan.photo_url ? (
                                    <img
                                        src={laporan.photo_url}
                                        alt={laporan.name ?? "Foto laporan"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-stone-100">
                                        <User className="h-24 w-24 text-stone-300" />
                                    </div>
                                )}

                                {/* Resolved overlay */}
                                {isResolved && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                                        <CheckCircle2 className="h-10 w-10 text-white" />
                                        <span className="text-sm font-semibold text-white">✓ Sudah Ditemukan</span>
                                    </div>
                                )}
                            </div>

                            {/* Pelapor card */}
                            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                                <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                                    Pelapor
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                        {laporan.reporter.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-stone-800">{laporan.reporter.name}</p>
                                        <p className="text-xs text-stone-400">
                                            {ROLE_LABEL[laporan.reporter.role] ?? laporan.reporter.role}
                                        </p>
                                    </div>
                                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-orange-400" />
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
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Dilaporkan {formatTanggal(laporan.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* ── Kolom 2: Info utama ── */}
                        <div className="space-y-5 min-w-0">
                            {/* Badges + Nama */}
                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={[
                                            "rounded-full px-3 py-1 text-xs font-bold tracking-wide",
                                            isMissing
                                                ? "bg-red-500 text-white"
                                                : "bg-green-500 text-white",
                                        ].join(" ")}
                                    >
                                        {isMissing ? "HILANG" : "DITEMUKAN"}
                                    </span>
                                    <span
                                        className={[
                                            "rounded-full border px-3 py-1 text-xs font-medium",
                                            isResolved
                                                ? "border-stone-200 bg-stone-50 text-stone-500"
                                                : "border-orange-200 bg-orange-50 text-orange-700",
                                        ].join(" ")}
                                    >
                                        {isResolved ? "Selesai" : "Aktif"}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold leading-tight text-stone-900">
                                    {laporan.name ?? "Nama tidak diketahui"}
                                </h1>
                                <p className="mt-1 text-sm text-stone-400">
                                    Diperbarui {formatTanggal(laporan.updated_at)}
                                </p>
                            </div>

                            {/* Grid info (usia, kota, gender, provinsi) */}
                            <InfoGrid laporan={laporan} />

                            {/* Terakhir Terlihat */}
                            <div className="rounded-2xl border-l-4 border-orange-400 bg-white px-5 py-4 shadow-sm">
                                <div className="mb-1.5 flex items-center gap-2 text-orange-500">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Terakhir Terlihat</span>
                                </div>
                                <p className="text-sm leading-relaxed text-stone-700">
                                    {laporan.last_seen_location}
                                </p>
                            </div>

                            {/* Deskripsi */}
                            <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                                <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                                    Ciri Fisik &amp; Deskripsi Tambahan
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

                            {/* WhatsApp button */}
                            <a
                                href={laporan.whatsapp_share_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#22c35d] active:scale-95"
                            >
                                <Share2 className="h-4 w-4" />
                                Hubungi via WhatsApp
                            </a>
                        </div>

                        {/* ── Kolom 3: Sidebar kanan ── */}
                        <div className="space-y-4 sticky top-6">
                            {/* Tanggal card */}
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

                            {/* Owner buttons */}
                            {isOwner && (
                                <div className="flex gap-2">
                                    <Link
                                        href={`/report/${laporan.id}/edit`}
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

                            {/* Laporan Terkait */}
                            <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                        Laporan Terkait
                                    </h2>
                                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-500">
                                        {laporan.city}
                                    </span>
                                </div>

                                {isLoadingTerkait ? (
                                    <LaporanTerkaitSkeleton />
                                ) : laporanTerkait && laporanTerkait.length > 0 ? (
                                    <div className="space-y-1">
                                        {laporanTerkait.map((item: any) => (
                                            <LaporanTerkaitCard key={item.id} laporan={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-xs text-stone-400">
                                        Tidak ada laporan lain di {laporan.city}
                                    </p>
                                )}

                                <Link
                                    href={`/search?city=${encodeURIComponent(laporan.city)}`}
                                    className="mt-3 block text-center text-xs font-medium text-orange-500 transition hover:text-orange-600"
                                >
                                    Lihat Semua Laporan →
                                </Link>
                            </div>
                        </div>
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