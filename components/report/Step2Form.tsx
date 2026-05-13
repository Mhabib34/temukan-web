import { laporanStep3Schema, LaporanStep3Values } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PROVINSI_INDONESIA } from "@/lib/province";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { SectionTitle } from "@/components/report/SectionTitle";
import { inputCls } from "@/components/report/InputCls";
import { FieldError } from "@/components/report/FieldError";

const LocationPicker = dynamic(
  () => import("@/components/report/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-70 w-full animate-pulse rounded-2xl bg-stone-100" />
    ),
  },
);

export function Step2Form({
  defaultValues,
  coords,
  onCoordsChange,
  onNext,
  onBack,
}: {
  defaultValues: Partial<LaporanStep3Values>;
  coords: { lat: number; lng: number } | null;
  onCoordsChange: (c: { lat: number; lng: number } | null) => void;
  onNext: (data: LaporanStep3Values) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LaporanStep3Values>({
    resolver: zodResolver(laporanStep3Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-1">
          Lokasi Terakhir
        </h2>
        <p className="text-sm text-stone-400 mb-5">
          Di mana orang tersebut terakhir terlihat?
        </p>
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
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
              Kota
            </label>
            <input
              {...register("city")}
              placeholder="Medan"
              className={inputCls(!!errors.city)}
            />
            <FieldError msg={errors.city?.message} />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
              Provinsi
            </label>
            <select
              {...register("province")}
              defaultValue=""
              className={inputCls(!!errors.province) + " cursor-pointer"}
            >
              <option value="" disabled>
                Pilih...
              </option>
              {PROVINSI_INDONESIA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <FieldError msg={errors.province?.message} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
            Tandai di Peta{" "}
            <span className="normal-case font-normal text-stone-300">
              (opsional)
            </span>
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

      <button
        type="button"
        onClick={onBack}
        className="w-full h-10 rounded-2xl border border-stone-200 text-stone-500 text-sm font-medium hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5"
      >
        <ChevronLeft size={14} /> Kembali
      </button>
      <p className="text-center text-xs text-stone-400">Langkah 2 dari 3</p>
    </form>
  );
}
