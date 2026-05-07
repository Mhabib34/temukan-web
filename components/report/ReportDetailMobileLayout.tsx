import Image from "next/image";
import {Calendar, CheckCircle2, ChevronLeft, Edit2, MapPin, Phone, Share2, Trash2, User} from "lucide-react";
import Link from "next/link";
import {Report} from "@/types";
import {format} from "date-fns";
import {id as localeId} from "date-fns/locale/id";
import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("@/components/report/MiniMap"), { ssr: false });
type Props = {
    laporan: Report
    isMissing: boolean
    isResolved: boolean
    GENDER_LABEL: Record<string, string>
    hasCoords: boolean
    ROLE_LABEL: Record<string, string>
    isOwner: boolean
    setShowDeleteDialog: (open: boolean) => void
}

function formatTanggalWaktu(iso: string) {
    return format(new Date(iso), "d MMMM yyyy • HH:mm 'WIB'", { locale: localeId });
}

export function ReportDetailMobileLayout({laporan, isMissing, isResolved, GENDER_LABEL, hasCoords, ROLE_LABEL, isOwner, setShowDeleteDialog}: Props) {
    const router = useRouter();
    return (
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
    )
}

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