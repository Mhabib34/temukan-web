"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, MapPin, FileText, Check, ChevronRight, ChevronLeft, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCreateLaporan, useUploadFoto } from "@/hooks";
import { PROVINSI_INDONESIA } from "@/lib/province";
import {
    laporanStep1Schema,  laporanStep2Schema, laporanStep3Schema,
    type LaporanStep1Values, type LaporanStep2Values, type LaporanStep3Values,
} from "@/schemas/reportSchema";
import { uploadFotoLaporan } from "@/api";
import type { CreateReportRequest } from "@/types";

// LocationPicker — SSR disabled (Leaflet)
const LocationPicker = dynamic(
    () => import("@/components/report/LocationPicker"),
    { ssr: false, loading: () => <div className="h-[280px] w-full animate-pulse rounded-xl bg-stone-100" /> }
);

// ─── Konstanta ────────────────────────────────────────────────────────────────

const STEPS = [
    { label: "Jenis", icon: FileText },
    { label: "Detail", icon: User },
    { label: "Lokasi", icon: MapPin },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = i < current;
                const active = i === current;
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={[
                                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                                    done
                                        ? "border-orange-500 bg-orange-500 text-white"
                                        : active
                                            ? "border-orange-500 bg-white text-orange-500"
                                            : "border-stone-200 bg-white text-stone-400",
                                ].join(" ")}
                            >
                                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span
                                className={[
                                    "text-xs font-medium",
                                    active ? "text-orange-600" : done ? "text-orange-400" : "text-stone-400",
                                ].join(" ")}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                className={[
                                    "mb-5 h-0.5 w-12 transition-all sm:w-20",
                                    done ? "bg-orange-400" : "bg-stone-200",
                                ].join(" ")}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
            {children}
            {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
    );
}

function inputCls(hasError?: boolean) {
    return [
        "w-full rounded-xl border px-3.5 py-2.5 text-sm text-stone-800 outline-none transition",
        "placeholder:text-stone-300",
        hasError
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-stone-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
    ].join(" ");
}

// ─── Step 1: Pilih Tipe ───────────────────────────────────────────────────────

function Step1Form({
                       defaultValues,
                       onNext,
                   }: {
    defaultValues: Partial<LaporanStep1Values>;
    onNext: (data: LaporanStep1Values) => void;
}) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<LaporanStep1Values>({
        resolver: zodResolver(laporanStep1Schema),
        defaultValues,
    });
    const selected = watch("type");

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
            <div>
                <h2 className="mb-1 text-xl font-bold text-stone-900">Jenis Laporan</h2>
                <p className="text-sm text-stone-500">Apa yang ingin kamu laporkan?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Missing */}
                <label
                    className={[
                        "relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all",
                        selected === "missing"
                            ? "border-orange-500 bg-orange-50 shadow-sm"
                            : "border-stone-200 bg-white hover:border-stone-300",
                    ].join(" ")}
                >
                    <input
                        type="radio"
                        value="missing"
                        {...register("type")}
                        className="sr-only"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <User className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-stone-900">Orang Hilang</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                            Saya mencari seseorang yang hilang
                        </p>
                    </div>
                    {selected === "missing" && (
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    )}
                </label>

                {/* Found */}
                <label
                    className={[
                        "relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all",
                        selected === "found"
                            ? "border-orange-500 bg-orange-50 shadow-sm"
                            : "border-stone-200 bg-white hover:border-stone-300",
                    ].join(" ")}
                >
                    <input
                        type="radio"
                        value="found"
                        {...register("type")}
                        className="sr-only"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <MapPin className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-stone-900">Orang Ditemukan</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                            Saya menemukan seseorang yang tersesat
                        </p>
                    </div>
                    {selected === "found" && (
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    )}
                </label>
            </div>

            <FieldError msg={errors.type?.message} />

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                >
                    Lanjut
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}

// ─── Step 2: Detail Orang ─────────────────────────────────────────────────────

function Step2Form({
                       defaultValues,
                       onNext,
                       onBack,
                   }: {
    defaultValues: Partial<LaporanStep2Values>;
    onNext: (data: LaporanStep2Values) => void;
    onBack: () => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LaporanStep2Values>({
        resolver: zodResolver(laporanStep2Schema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-5">
            <div>
                <h2 className="mb-1 text-xl font-bold text-stone-900">Detail Orang</h2>
                <p className="text-sm text-stone-500">Isi informasi sedetail mungkin</p>
            </div>

            {/* Nama */}
            <div>
                <Label>Nama</Label>
                <input
                    {...register("name")}
                    placeholder="Kosongkan jika tidak diketahui"
                    className={inputCls(!!errors.name)}
                />
                <FieldError msg={errors.name?.message} />
            </div>

            {/* Gender */}
            <div>
                <Label required>Jenis Kelamin</Label>
                <div className="grid grid-cols-3 gap-2">
                    {(["male", "female", "unknown"] as const).map((g) => (
                        <label key={g} className="relative cursor-pointer">
                            <input type="radio" value={g} {...register("gender")} className="peer sr-only" />
                            <div className="rounded-xl border-2 border-stone-200 bg-white p-3 text-center text-sm font-medium text-stone-600 transition peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 hover:border-stone-300">
                                {g === "male" ? "Laki-laki" : g === "female" ? "Perempuan" : "Tidak Tahu"}
                            </div>
                        </label>
                    ))}
                </div>
                <FieldError msg={errors.gender?.message} />
            </div>

            {/* Usia */}
            <div>
                <Label required>Perkiraan Usia</Label>
                <div className="relative">
                    <input
                        type="number"
                        min={0}
                        max={120}
                        {...register("estimated_age", { valueAsNumber: true })}
                        placeholder="Contoh: 65"
                        className={inputCls(!!errors.estimated_age)}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                        tahun
                    </span>
                </div>
                <FieldError msg={errors.estimated_age?.message} />
            </div>

            {/* Deskripsi */}
            <div>
                <Label required>Deskripsi</Label>
                <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Ciri fisik, pakaian terakhir, kondisi kesehatan, atau info penting lainnya..."
                    className={inputCls(!!errors.description) + " resize-none"}
                />
                <FieldError msg={errors.description?.message} />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali
                </button>
                <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                >
                    Lanjut
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}

// ─── Step 3: Lokasi + Foto ────────────────────────────────────────────────────

function Step3Form({
                       defaultValues,
                       coords,
                       onCoordsChange,
                       fotoFile,
                       onFotoChange,
                       onSubmit,
                       onBack,
                       isLoading,
                   }: {
    defaultValues: Partial<LaporanStep3Values>;
    coords: { lat: number; lng: number } | null;
    onCoordsChange: (c: { lat: number; lng: number } | null) => void;
    fotoFile: File | null;
    onFotoChange: (f: File | null) => void;
    onSubmit: (data: LaporanStep3Values) => void;
    onBack: () => void;
    isLoading: boolean;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LaporanStep3Values>({
        resolver: zodResolver(laporanStep3Schema),
        defaultValues,
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ukuran foto maksimal 5MB");
            return;
        }
        onFotoChange(file);
    }

    const fotoPreview = fotoFile ? URL.createObjectURL(fotoFile) : null;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <h2 className="mb-1 text-xl font-bold text-stone-900">Lokasi & Foto</h2>
                <p className="text-sm text-stone-500">Di mana terakhir terlihat?</p>
            </div>

            {/* Lokasi teks */}
            <div>
                <Label required>Lokasi Terakhir Terlihat</Label>
                <input
                    {...register("last_seen_location")}
                    placeholder="Contoh: Depan Pasar Petisah, Jalan Pegadaian"
                    className={inputCls(!!errors.last_seen_location)}
                />
                <FieldError msg={errors.last_seen_location?.message} />
            </div>

            {/* Kota & Provinsi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label required>Kota</Label>
                    <input
                        {...register("city")}
                        placeholder="Contoh: Medan"
                        className={inputCls(!!errors.city)}
                    />
                    <FieldError msg={errors.city?.message} />
                </div>
                <div>
                    <Label required>Provinsi</Label>
                    <select
                        {...register("province")}
                        className={inputCls(!!errors.province) + " cursor-pointer"}
                        defaultValue=""
                    >
                        <option value="" disabled>Pilih provinsi…</option>
                        {PROVINSI_INDONESIA.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <FieldError msg={errors.province?.message} />
                </div>
            </div>

            {/* Picker peta */}
            <div>
                <Label>Tandai di Peta <span className="text-xs font-normal text-stone-400">(opsional)</span></Label>
                <LocationPicker value={coords} onChange={onCoordsChange} />
            </div>

            {/* Upload foto */}
            <div>
                <Label>Foto <span className="text-xs font-normal text-stone-400">(opsional, maks 5MB)</span></Label>

                {fotoPreview ? (
                    <div className="relative w-full overflow-hidden rounded-xl border border-stone-200">
                        <img
                            src={fotoPreview}
                            alt="Preview foto"
                            className="h-48 w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onFotoChange(null)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-8 transition hover:border-orange-300 hover:bg-orange-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                            <ImageIcon className="h-5 w-5 text-stone-400" />
                        </div>
                        <span className="text-sm text-stone-500">
                            Klik untuk pilih foto
                        </span>
                        <span className="text-xs text-stone-400">JPG, PNG, WEBP</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95 disabled:opacity-60"
                >
                    {isLoading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Menyimpan…
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            Buat Laporan
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewReportPage() {
    const [step, setStep] = useState(0);

    // Kumpulkan data per step
    const [step1Data, setStep1Data] = useState<Partial<LaporanStep1Values>>({});
    const [step2Data, setStep2Data] = useState<Partial<LaporanStep2Values>>({});
    const [step3Data, setStep3Data] = useState<Partial<LaporanStep3Values>>({});

    // Koordinat & foto dikelola terpisah (tidak masuk RHF)
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    const createMutation = useCreateLaporan();

    // ── Handlers per step ──

    function handleStep1(data: LaporanStep1Values) {
        setStep1Data(data);
        setStep(1);
    }

    function handleStep2(data: LaporanStep2Values) {
        setStep2Data(data);
        setStep(2);
    }

    async function handleStep3(data: LaporanStep3Values) {
        const payload: CreateReportRequest = {
            type: step1Data.type!,
            name: step2Data.name || null,
            gender: step2Data.gender!,
            estimated_age: step2Data.estimated_age!,
            description: step2Data.description!,
            last_seen_location: data.last_seen_location,
            city: data.city,
            province: data.province,
            latitude: coords?.lat ?? null,
            longitude: coords?.lng ?? null,
        };

        createMutation.mutate(payload, {
            onSuccess: async (res) => {
                const reportId = res.data.id;
                if (fotoFile) {
                    try {
                        await uploadFotoLaporan(reportId, fotoFile); // ← langsung pakai reportId
                    } catch {
                        toast.warning("Laporan dibuat, tapi foto gagal diupload. Coba upload ulang dari halaman edit.");
                    }
                }
                // redirect tetap ditangani useCreateLaporan onSuccess
            },
            //eslint-disable-next-line
            onError: (err: any) => {
                toast.error(err?.response?.data?.message ?? err.message ?? "Gagal membuat laporan");
            },
        });
    }

    const isLoading = createMutation.isPending;

    return (
        <PageWrapper>
            <div className="mx-auto max-w-xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-stone-900">Buat Laporan</h1>
                    <p className="mt-1 text-sm text-stone-500">
                        Langkah {step + 1} dari {STEPS.length}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="mb-8">
                    <StepIndicator current={step} />
                </div>

                {/* Form card */}
                <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm md:p-6">
                    {step === 0 && (
                        <Step1Form
                            defaultValues={step1Data}
                            onNext={handleStep1}
                        />
                    )}
                    {step === 1 && (
                        <Step2Form
                            defaultValues={step2Data}
                            onNext={handleStep2}
                            onBack={() => setStep(0)}
                        />
                    )}
                    {step === 2 && (
                        <Step3Form
                            defaultValues={step3Data}
                            coords={coords}
                            onCoordsChange={setCoords}
                            fotoFile={fotoFile}
                            onFotoChange={setFotoFile}
                            onSubmit={handleStep3}
                            onBack={() => setStep(1)}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}