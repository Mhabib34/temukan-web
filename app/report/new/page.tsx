"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, ChevronLeft, X, ImageIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCreateLaporan } from "@/hooks";
import { PROVINSI_INDONESIA } from "@/lib/province";
import {
    laporanStep1Schema, laporanStep2Schema, laporanStep3Schema,
    type LaporanStep1Values, type LaporanStep2Values, type LaporanStep3Values,
} from "@/schemas/reportSchema";
import { uploadFotoLaporan } from "@/api";
import type { CreateReportRequest } from "@/types";

const LocationPicker = dynamic(
    () => import("@/components/report/LocationPicker"),
    { ssr: false, loading: () => <div className="h-[280px] w-full animate-pulse rounded-2xl bg-stone-100" /> }
);

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { label: "Jenis & Identitas" },
    { label: "Lokasi" },
    { label: "Foto & Review" },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.map((step, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={[
                                "w-3 h-3 rounded-full transition-all",
                                done ? "bg-orange-500" : active ? "bg-orange-500" : "bg-stone-200",
                            ].join(" ")} />
                            <span className={[
                                "text-xs font-medium whitespace-nowrap",
                                active ? "text-orange-500 font-semibold" : done ? "text-stone-400" : "text-stone-300",
                            ].join(" ")}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={[
                                "w-20 sm:w-32 h-px mb-5 mx-1 transition-all",
                                done ? "bg-orange-400" : "bg-stone-200",
                            ].join(" ")} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1.5 text-xs text-red-500">{msg}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-orange-500 rounded-full" />
            <p className="text-sm font-semibold text-stone-700">{children}</p>
        </div>
    );
}

function inputCls(hasError?: boolean) {
    return [
        "w-full rounded-xl border px-4 py-3 text-sm text-stone-800 outline-none transition bg-white",
        "placeholder:text-stone-300",
        hasError
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-stone-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
    ].join(" ");
}

// ─── Step 1: Jenis + Identitas ────────────────────────────────────────────────
function Step1Form({ defaultValues, onNext }: {
    defaultValues: Partial<LaporanStep1Values & LaporanStep2Values>;
    onNext: (s1: LaporanStep1Values, s2: LaporanStep2Values) => void;
}) {
    // Two forms merged into one step visually
    const form1 = useForm<LaporanStep1Values>({
        resolver: zodResolver(laporanStep1Schema),
        defaultValues: { type: (defaultValues as any).type },
    });
    const form2 = useForm<LaporanStep2Values>({
        resolver: zodResolver(laporanStep2Schema),
        defaultValues: defaultValues as any,
    });

    const selectedType = form1.watch("type");

    async function handleSubmit() {
        const v1 = await form1.trigger();
        const v2 = await form2.trigger();
        if (!v1 || !v2) return;
        const d1 = form1.getValues();
        const d2 = form2.getValues();
        onNext(d1, d2);
    }

    return (
        <div className="space-y-8">
            {/* Pilih Jenis */}
            <div>
                <h2 className="text-lg font-bold text-stone-900 mb-1">Pilih Jenis Laporan</h2>
                <p className="text-sm text-stone-400 mb-5">Bantu kami mengidentifikasi situasi yang Anda hadapi.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Found */}
                    <label className={[
                        "relative flex flex-col gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                        selectedType === "found"
                            ? "border-orange-500 bg-white shadow-md shadow-orange-100"
                            : "border-stone-200 bg-white hover:border-stone-300",
                    ].join(" ")}>
                        <input type="radio" value="found" {...form1.register("type")} className="sr-only" />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedType === "found" ? "bg-orange-50" : "bg-stone-100"}`}>
                            {/* hands/found icon */}
                            <svg className={`w-5 h-5 ${selectedType === "found" ? "text-orange-500" : "text-stone-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                            </svg>
                        </div>
                        <div>
                            <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${selectedType === "found" ? "text-stone-900" : "text-stone-400"}`}>Menemukan</p>
                            <p className={`text-xs leading-relaxed ${selectedType === "found" ? "text-stone-600" : "text-stone-400"}`}>
                                Saya menemukan orang yang terlihat hilang atau butuh bantuan.
                            </p>
                        </div>
                        {selectedType === "found" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        )}
                        {selectedType !== "found" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-stone-300" />
                        )}
                    </label>

                    {/* Missing */}
                    <label className={[
                        "relative flex flex-col gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all",
                        selectedType === "missing"
                            ? "border-orange-500 bg-white shadow-md shadow-orange-100"
                            : "border-stone-200 bg-white hover:border-stone-300",
                    ].join(" ")}>
                        <input type="radio" value="missing" {...form1.register("type")} className="sr-only" />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedType === "missing" ? "bg-orange-50" : "bg-stone-100"}`}>
                            <svg className={`w-5 h-5 ${selectedType === "missing" ? "text-orange-500" : "text-stone-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM13.5 10.5h-6" />
                            </svg>
                        </div>
                        <div>
                            <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${selectedType === "missing" ? "text-stone-900" : "text-stone-400"}`}>Mencari</p>
                            <p className={`text-xs leading-relaxed ${selectedType === "missing" ? "text-stone-600" : "text-stone-400"}`}>
                                Saya sedang mencari anggota keluarga atau kerabat yang hilang.
                            </p>
                        </div>
                        {selectedType === "missing" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        )}
                        {selectedType !== "missing" && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-stone-300" />
                        )}
                    </label>
                </div>
                <FieldError msg={form1.formState.errors.type?.message} />
            </div>

            {/* Identitas */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4">
                <SectionTitle>Identitas Orang</SectionTitle>

                {/* Nama */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                        Nama Lengkap (Jika Diketahui)
                    </label>
                    <input
                        {...form2.register("name")}
                        placeholder="Masukkan nama..."
                        className={inputCls(!!form2.formState.errors.name)}
                    />
                    <FieldError msg={form2.formState.errors.name?.message} />
                </div>

                {/* Gender + Usia */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                            Jenis Kelamin
                        </label>
                        <select
                            {...form2.register("gender")}
                            className={inputCls(!!form2.formState.errors.gender) + " cursor-pointer appearance-none"}
                            defaultValue=""
                        >
                            <option value="" disabled>Pilih...</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                            <option value="unknown">Tidak Tahu</option>
                        </select>
                        <FieldError msg={form2.formState.errors.gender?.message} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                            Estimasi Usia
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={120}
                            {...form2.register("estimated_age", { valueAsNumber: true })}
                            placeholder="Contoh: 25"
                            className={inputCls(!!form2.formState.errors.estimated_age)}
                        />
                        <FieldError msg={form2.formState.errors.estimated_age?.message} />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                        Ciri-ciri Fisik
                    </label>
                    <textarea
                        {...form2.register("description")}
                        rows={3}
                        placeholder="Tanda lahir, pakaian terakhir, kondisi kesehatan..."
                        className={inputCls(!!form2.formState.errors.description) + " resize-none"}
                    />
                    <FieldError msg={form2.formState.errors.description?.message} />
                </div>
            </div>

            {/* Lokasi preview — locked */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <SectionTitle>Lokasi Terakhir</SectionTitle>
                    <Lock size={14} className="text-stone-300 mb-4" />
                </div>
                <div className="h-28 rounded-xl bg-stone-100 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xs text-stone-400 font-medium">Buka pada Langkah 2</p>
                    </div>
                </div>
            </div>

            {/* Next button */}
            <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-md shadow-orange-200 flex items-center justify-center gap-2"
            >
                Lanjut ke Lokasi
                <ChevronRight size={16} />
            </button>
            <p className="text-center text-xs text-stone-400">Langkah 1 dari 3</p>
        </div>
    );
}

// ─── Step 2: Lokasi ───────────────────────────────────────────────────────────
function Step2Form({ defaultValues, coords, onCoordsChange, onNext, onBack }: {
    defaultValues: Partial<LaporanStep3Values>;
    coords: { lat: number; lng: number } | null;
    onCoordsChange: (c: { lat: number; lng: number } | null) => void;
    onNext: (data: LaporanStep3Values) => void;
    onBack: () => void;
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<LaporanStep3Values>({
        resolver: zodResolver(laporanStep3Schema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-stone-900 mb-1">Lokasi Terakhir</h2>
                <p className="text-sm text-stone-400 mb-5">Di mana orang tersebut terakhir terlihat?</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4">
                <SectionTitle>Detail Lokasi</SectionTitle>

                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                        Alamat / Deskripsi Lokasi
                    </label>
                    <input
                        {...register("last_seen_location")}
                        placeholder="Contoh: Depan Pasar Petisah, Jalan Pegadaian"
                        className={inputCls(!!errors.last_seen_location)}
                    />
                    <FieldError msg={errors.last_seen_location?.message} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">Kota</label>
                        <input
                            {...register("city")}
                            placeholder="Medan"
                            className={inputCls(!!errors.city)}
                        />
                        <FieldError msg={errors.city?.message} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">Provinsi</label>
                        <select
                            {...register("province")}
                            defaultValue=""
                            className={inputCls(!!errors.province) + " cursor-pointer"}
                        >
                            <option value="" disabled>Pilih...</option>
                            {PROVINSI_INDONESIA.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <FieldError msg={errors.province?.message} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                        Tandai di Peta <span className="normal-case font-normal text-stone-300">(opsional)</span>
                    </label>
                    <LocationPicker value={coords} onChange={onCoordsChange} />
                </div>
            </div>

            <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-md shadow-orange-200 flex items-center justify-center gap-2"
            >
                Lanjut ke Review
                <ChevronRight size={16} />
            </button>

            <button type="button" onClick={onBack}
                    className="w-full h-10 rounded-2xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5">
                <ChevronLeft size={14} /> Kembali
            </button>
            <p className="text-center text-xs text-stone-400">Langkah 2 dari 3</p>
        </form>
    );
}

// ─── Step 3: Foto + Review ────────────────────────────────────────────────────
function Step3Form({ step1, step2, step3, coords, fotoFile, onFotoChange, onSubmit, onBack, isLoading }: {
    step1: Partial<LaporanStep1Values>;
    step2: Partial<LaporanStep2Values>;
    step3: Partial<LaporanStep3Values>;
    coords: { lat: number; lng: number } | null;
    fotoFile: File | null;
    onFotoChange: (f: File | null) => void;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
}) {
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error("Ukuran foto maksimal 5MB"); return; }
        onFotoChange(file);
    }
    const fotoPreview = fotoFile ? URL.createObjectURL(fotoFile) : null;

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-stone-900 mb-1">Foto & Review</h2>
                <p className="text-sm text-stone-400 mb-5">Upload foto dan periksa kembali data laporan.</p>
            </div>

            {/* Upload foto */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                <SectionTitle>Foto Terbaru</SectionTitle>
                {fotoPreview ? (
                    <div className="relative w-full overflow-hidden rounded-xl border border-stone-200">
                        <img src={fotoPreview} alt="Preview" className="h-52 w-full object-cover" />
                        <button type="button" onClick={() => onFotoChange(null)}
                                className="absolute right-2 top-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                            <X size={13} />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center gap-2.5 w-full py-10 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center">
                            <ImageIcon size={22} className="text-stone-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-stone-600">Unggah Foto Terbaru</p>
                            <p className="text-xs text-stone-400 mt-0.5">Maks. 5MB (JPG, PNG)</p>
                        </div>
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleFileChange} />
                    </label>
                )}
            </div>

            {/* Review summary */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-3">
                <SectionTitle>Ringkasan Laporan</SectionTitle>
                {[
                    { label: "Jenis", value: step1.type === "found" ? "Menemukan" : "Mencari" },
                    { label: "Nama", value: step2.name || "Tidak diketahui" },
                    { label: "Jenis Kelamin", value: step2.gender === "male" ? "Laki-laki" : step2.gender === "female" ? "Perempuan" : "Tidak diketahui" },
                    { label: "Usia", value: step2.estimated_age ? `${step2.estimated_age} tahun` : "-" },
                    { label: "Lokasi", value: step3.last_seen_location || "-" },
                    { label: "Kota", value: step3.city ? `${step3.city}, ${step3.province}` : "-" },
                    { label: "Koordinat", value: coords ? `${coords.lat}, ${coords.lng}` : "Tidak ditandai" },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-stone-50 last:border-0">
                        <span className="text-xs text-stone-400 font-medium flex-shrink-0">{label}</span>
                        <span className="text-xs text-stone-700 font-semibold text-right">{value}</span>
                    </div>
                ))}
            </div>

            <button type="button" onClick={onSubmit} disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-md shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60">
                {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                ) : "Buat Laporan"}
            </button>

            <button type="button" onClick={onBack} disabled={isLoading}
                    className="w-full h-10 rounded-2xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                <ChevronLeft size={14} /> Kembali
            </button>
            <p className="text-center text-xs text-stone-400">Langkah 3 dari 3</p>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NewReportPage() {
    const [step, setStep] = useState(0);
    const [step1Data, setStep1Data] = useState<Partial<LaporanStep1Values>>({});
    const [step2Data, setStep2Data] = useState<Partial<LaporanStep2Values>>({});
    const [step3Data, setStep3Data] = useState<Partial<LaporanStep3Values>>({});
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    const createMutation = useCreateLaporan();

    function handleStep1(s1: LaporanStep1Values, s2: LaporanStep2Values) {
        setStep1Data(s1);
        setStep2Data(s2);
        setStep(1);
    }

    function handleStep2(data: LaporanStep3Values) {
        setStep3Data(data);
        setStep(2);
    }

    async function handleFinalSubmit() {
        const payload: CreateReportRequest = {
            type: step1Data.type!,
            name: step2Data.name || null,
            gender: step2Data.gender!,
            estimated_age: step2Data.estimated_age!,
            description: step2Data.description!,
            last_seen_location: step3Data.last_seen_location!,
            city: step3Data.city!,
            province: step3Data.province!,
            latitude: coords?.lat ?? null,
            longitude: coords?.lng ?? null,
        };

        createMutation.mutate(payload, {
            onSuccess: async (res) => {
                if (fotoFile) {
                    try {
                        await uploadFotoLaporan(res.data.id, fotoFile);
                    } catch {
                        toast.warning("Laporan dibuat, tapi foto gagal diupload.");
                    }
                }
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message ?? err.message ?? "Gagal membuat laporan");
            },
        });
    }

    return (
        <PageWrapper>
            <div className="mx-auto max-w-xl w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-stone-900">Buat Laporan</h1>
                    <p className="text-sm text-stone-400 mt-0.5">Langkah {step + 1} dari {STEPS.length}</p>
                </div>

                {/* Step indicator */}
                <StepIndicator current={step} />

                {/* Forms */}
                {step === 0 && (
                    <Step1Form
                        defaultValues={{ ...step1Data, ...step2Data }}
                        onNext={handleStep1}
                    />
                )}
                {step === 1 && (
                    <Step2Form
                        defaultValues={step3Data}
                        coords={coords}
                        onCoordsChange={setCoords}
                        onNext={handleStep2}
                        onBack={() => setStep(0)}
                    />
                )}
                {step === 2 && (
                    <Step3Form
                        step1={step1Data}
                        step2={step2Data}
                        step3={step3Data}
                        coords={coords}
                        fotoFile={fotoFile}
                        onFotoChange={setFotoFile}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setStep(1)}
                        isLoading={createMutation.isPending}
                    />
                )}
            </div>
        </PageWrapper>
    );
}