import type {LaporanStep1Values, LaporanStep2Values, LaporanStep3Values} from "@/schemas";
import {toast} from "sonner";
import {ChevronLeft, ImageIcon, X} from "lucide-react";
import {SectionTitle} from "./SectionTitle";
import Image from "next/image";

export function Step3Form({ step1, step2, step3, coords, fotoFile, onFotoChange, onSubmit, onBack, isLoading }: {
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
                        <Image src={fotoPreview} alt="Preview" className="h-52 w-full object-cover" width={280}
                        height={280}/>
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
                        <span className="text-xs text-stone-400 font-medium shrink-0">{label}</span>
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