"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, User, ImagePlus, X, Loader2, AlertCircle } from "lucide-react";
import { useLaporanDetail, useUpdateLaporan, useUploadFoto } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { updateLaporanSchema, type UpdateLaporanValues } from "@/schemas/reportSchema";
import { PROVINSI_INDONESIA } from "@/lib/province";
import { ReportDetailSkeleton } from "@/components/report/ReportDetailSkeleton";

const LocationPicker = dynamic(
    () => import("@/components/report/LocationPicker"),
    { ssr: false }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
            {children}
            {required && <span className="ml-0.5 text-red-400">*</span>}
        </label>
    );
}

const inputClass =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

const selectClass =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

// ─── Photo Upload Preview ─────────────────────────────────────────────────────

function PhotoUpload({
                         currentUrl,
                         file,
                         onChange,
                     }: {
    currentUrl: string | null;
    file: File | null;
    onChange: (f: File | null) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const preview = file ? URL.createObjectURL(file) : currentUrl;

    return (
        <div className="space-y-2">
            <Label>Foto</Label>
            <div
                onClick={() => inputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 transition hover:border-orange-300 hover:bg-orange-50"
                style={{ aspectRatio: "4/3" }}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview foto"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                            <p className="text-xs font-semibold text-white">Ganti Foto</p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                        <ImagePlus className="h-8 w-8 text-stone-300" />
                        <p className="text-xs text-stone-400">
                            Klik untuk upload foto
                            <br />
                            <span className="text-stone-300">JPG, PNG, WebP · Maks 5MB</span>
                        </p>
                    </div>
                )}
            </div>

            {file && (
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="flex items-center gap-1.5 text-xs text-stone-400 transition hover:text-red-500"
                >
                    <X className="h-3 w-3" />
                    Batalkan perubahan foto
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024) {
                        toast.error("Ukuran foto maksimal 5MB");
                        return;
                    }
                    onChange(f);
                    e.target.value = "";
                }}
            />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditReportPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, isLoggedIn } = useAuthStore();
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    useEffect(() => {
        if (!isLoggedIn) router.replace("/login");
    }, [isLoggedIn, router]);

    const { data, isLoading, isError } = useLaporanDetail(id);
    const updateMutation = useUpdateLaporan(id);
    const uploadMutation = useUploadFoto(id);

    const laporan = data?.data;

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<UpdateLaporanValues>({
        resolver: zodResolver(updateLaporanSchema),
    });

    useEffect(() => {
        if (!laporan) return;
        reset({
            name: laporan.name ?? "",
            gender: laporan.gender,
            estimated_age: laporan.estimated_age ?? undefined,
            description: laporan.description,
            last_seen_location: laporan.last_seen_location,
            city: laporan.city,
            province: laporan.province,
            latitude: laporan.latitude ?? null,
            longitude: laporan.longitude ?? null,
            status: laporan.status,
        });
    }, [laporan, reset]);

    useEffect(() => {
        if (laporan && user && laporan.reporter_id !== user.id) {
            toast.error("Kamu tidak punya akses untuk mengedit laporan ini");
            router.replace(`/report/${id}`);
        }
    }, [laporan, user, id, router]);

    const coordValue = watch(["latitude", "longitude"]);
    const currentCoords =
        coordValue[0] != null && coordValue[1] != null
            ? { lat: coordValue[0], lng: coordValue[1] }
            : null;

    async function onSubmit(values: UpdateLaporanValues) {
        try {
            await updateMutation.mutateAsync(values);

            if (photoFile) {
                try {
                    await uploadMutation.mutateAsync(photoFile);
                } catch {
                    toast.warning("Laporan diperbarui, tapi foto gagal diupload");
                }
            }

            toast.success("Laporan berhasil diperbarui");
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message ?? (err as Error).message;
            toast.error(msg ?? "Gagal memperbarui laporan");
        }
    }

    const isSaving = updateMutation.isPending || uploadMutation.isPending;
    const hasChanges = isDirty || photoFile !== null;

    if (!isLoggedIn) return null;

    if (isLoading) {
        return (
            <PageWrapper>
                <ReportDetailSkeleton />
            </PageWrapper>
        );
    }

    if (isError || !laporan) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                        <AlertCircle className="h-8 w-8 text-stone-400" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-stone-800">
                        Laporan Tidak Ditemukan
                    </h2>
                    <p className="mb-6 text-sm text-stone-500">
                        Laporan tidak ada atau kamu tidak punya akses.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
                    >
                        Kembali
                    </button>
                </div>
            </PageWrapper>
        );
    }

    return (
        // overflow-x-hidden di sini untuk backup, tapi fix utama ada di grid di bawah
        <PageWrapper>
            {/* ── Header ── */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-stone-600 transition hover:border-orange-300 hover:text-orange-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-stone-900">Edit Laporan</h1>
                    <p className="text-xs text-stone-400">
                        {laporan.type === "missing" ? "Orang Hilang" : "Orang Ditemukan"} ·{" "}
                        {laporan.name ?? "Nama tidak diketahui"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid w-full min-w-0 gap-5 md:grid-cols-2">

                    {/* ── Kolom Kiri: Info + Lokasi ── */}
                    <div className="min-w-0 space-y-5">
                        {/* Section: Info Orang */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">
                                <User className="h-4 w-4" />
                                Informasi Orang
                            </h2>

                            <div className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <Label>Nama</Label>
                                    <input
                                        {...register("name")}
                                        placeholder="Kosongkan jika tidak diketahui"
                                        className={inputClass}
                                    />
                                    <FieldError message={errors.name?.message} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Gender */}
                                    <div>
                                        <Label required>Jenis Kelamin</Label>
                                        <select {...register("gender")} className={selectClass}>
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                            <option value="unknown">Tidak Diketahui</option>
                                        </select>
                                        <FieldError message={errors.gender?.message} />
                                    </div>

                                    {/* Usia */}
                                    <div>
                                        <Label required>Perkiraan Usia</Label>
                                        <input
                                            {...register("estimated_age", { valueAsNumber: true })}
                                            type="number"
                                            min={0}
                                            max={120}
                                            placeholder="0–120"
                                            className={inputClass}
                                        />
                                        <FieldError message={errors.estimated_age?.message} />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label required>Status Laporan</Label>
                                    <select {...register("status")} className={selectClass}>
                                        <option value="active">Aktif — masih dicari</option>
                                        <option value="resolved">Selesai — sudah ditemukan</option>
                                    </select>
                                    <FieldError message={errors.status?.message} />
                                </div>

                                {/* Deskripsi */}
                                <div>
                                    <Label required>Deskripsi</Label>
                                    <textarea
                                        {...register("description")}
                                        rows={4}
                                        placeholder="Ciri fisik, pakaian, kondisi terakhir..."
                                        className={inputClass + " resize-none"}
                                    />
                                    <FieldError message={errors.description?.message} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Lokasi */}
                        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold text-stone-500 uppercase tracking-wide">
                                Lokasi
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Label required>Lokasi Terakhir Terlihat</Label>
                                    <input
                                        {...register("last_seen_location")}
                                        placeholder="Alamat atau deskripsi lokasi"
                                        className={inputClass}
                                    />
                                    <FieldError message={errors.last_seen_location?.message} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Kota */}
                                    <div>
                                        <Label required>Kota</Label>
                                        <input
                                            {...register("city")}
                                            placeholder="contoh: Medan"
                                            className={inputClass}
                                        />
                                        <FieldError message={errors.city?.message} />
                                    </div>

                                    {/* Provinsi */}
                                    <div>
                                        <Label required>Provinsi</Label>
                                        <select {...register("province")} className={selectClass}>
                                            <option value="">Pilih provinsi</option>
                                            {PROVINSI_INDONESIA.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldError message={errors.province?.message} />
                                    </div>
                                </div>

                                {/* Location Picker */}
                                <div>
                                    <Label>Titik di Peta (opsional)</Label>
                                    <p className="mb-2 text-xs text-stone-400">
                                        Klik peta untuk memperbarui koordinat
                                    </p>
                                    <div className="overflow-hidden rounded-xl border border-stone-200">
                                        <Controller
                                            control={control}
                                            name="latitude"
                                            render={({ field: latField }) => (
                                                <Controller
                                                    control={control}
                                                    name="longitude"
                                                    render={({ field: lngField }) => (
                                                        <LocationPicker
                                                            value={currentCoords}
                                                            onChange={(coords) => {
                                                                latField.onChange(coords?.lat ?? null);
                                                                lngField.onChange(coords?.lng ?? null);
                                                            }}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Kolom Kanan: Foto + Simpan ── */}
                    {/*
                        FIX: Kolom kanan pakai lebar fixed 280px (didefinisikan di grid-cols di atas).
                        min-w-0 + w-full memastikan tidak meluber keluar.
                    */}
                    <div className="min-w-0 w-full space-y-4">
                        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                            <PhotoUpload
                                currentUrl={laporan.photo_url}
                                file={photoFile}
                                onChange={setPhotoFile}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving || !hasChanges}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSaving}
                            className="w-full rounded-2xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <p className="text-center text-xs text-stone-400">
                            Jenis laporan ({laporan.type === "missing" ? "Orang Hilang" : "Orang Ditemukan"}) tidak dapat diubah.
                        </p>
                    </div>
                </div>
            </form>
        </PageWrapper>
    );
}