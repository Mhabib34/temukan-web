import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Edit2,
  MapPin,
  Phone,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Report } from "@/types";
import { useLaporanList } from "@/hooks";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { RelatedReportCard } from "@/components/card/RelatedReportCard";
import { RelatedReportSkeleton } from "@/components/skeleton/RelatedReportSkeleton";
import dynamic from "next/dynamic";
import Image from "next/image";

const MiniMap = dynamic(() => import("@/components/report/MiniMap"), {
  ssr: false,
});
type Props = {
  laporan: Report;
  isMissing: boolean;
  isResolved: boolean;
  GENDER_LABEL: Record<string, string>;
  hasCoords: boolean;
  ROLE_LABEL: Record<string, string>;
  isOwner: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  //eslint-disable-next-line
  data: any;
};

function formatTanggal(iso: string) {
  return format(new Date(iso), "d MMMM yyyy", { locale: localeId });
}

export function ReportDetailDesktopLayout({
  laporan,
  isMissing,
  data,
  isResolved,
  hasCoords,
  GENDER_LABEL,
  ROLE_LABEL,
  isOwner,
  setShowDeleteDialog,
}: Props) {
  const { data: dataTerkait, isLoading: isLoadingTerkait } = useLaporanList({
    city: data?.data?.city ?? "",
    status: "active",
    limit: 4,
  });
  const laporanTerkait = (dataTerkait?.data?.reports ?? [])
    //eslint-disable-next-line
    .filter((r: any) => r.id !== (data?.data?.id ?? ""))
    .slice(0, 3);
  const router = useRouter();
  return (
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
            <div
              className="relative overflow-hidden rounded-3xl shadow-md"
              style={{ aspectRatio: "3/4" }}
            >
              {laporan.photo_url ? (
                <Image
                  fill
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
                  <span className="text-sm font-semibold text-white">
                    ✓ Sudah Ditemukan
                  </span>
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
                  <p className="font-medium text-stone-800">
                    {laporan.reporter.name}
                  </p>
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
            <InfoGrid laporan={laporan} GENDER_LABEL={GENDER_LABEL} />

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
                <RelatedReportSkeleton />
              ) : laporanTerkait && laporanTerkait.length > 0 ? (
                <div className="space-y-1">
                  {/*eslint-disable-next-line*/}
                  {laporanTerkait.map((item: any) => (
                    <RelatedReportCard key={item.id} laporan={item} />
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
  );
}

type InfoGridProps = {
  laporan: Report;
  GENDER_LABEL: Record<string, string>;
};

function InfoGrid({ laporan, GENDER_LABEL }: InfoGridProps) {
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
          <span className="text-sm font-semibold text-stone-800">
            {laporan.city}
          </span>
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
          <span className="text-sm font-semibold text-stone-800">
            {laporan.province}
          </span>
        </div>
      </div>
    </div>
  );
}
