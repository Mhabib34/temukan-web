import {
  laporanStep1Schema,
  LaporanStep1Values,
  laporanStep2Schema,
  LaporanStep2Values,
} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Lock } from "lucide-react";

export function Step1Form({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<LaporanStep1Values & LaporanStep2Values>;
  onNext: (s1: LaporanStep1Values, s2: LaporanStep2Values) => void;
}) {
  // Two forms merged into one step visually
  const form1 = useForm<LaporanStep1Values>({
    resolver: zodResolver(laporanStep1Schema),
    //eslint-disable-next-line
    defaultValues: { type: (defaultValues as any).type },
  });
  const form2 = useForm<LaporanStep2Values>({
    resolver: zodResolver(laporanStep2Schema),
    //eslint-disable-next-line
    defaultValues: defaultValues as any,
  });

  //eslint-disable-next-line
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
        <h2 className="text-lg font-bold text-stone-900 mb-1">
          Pilih Jenis Laporan
        </h2>
        <p className="text-sm text-stone-400 mb-5">
          Bantu kami mengidentifikasi situasi yang Anda hadapi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Found */}
          <label
            className={[
              "relative flex flex-col gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all",
              selectedType === "found"
                ? "border-orange-500 bg-white shadow-md shadow-orange-100"
                : "border-stone-200 bg-white hover:border-stone-300",
            ].join(" ")}
          >
            <input
              type="radio"
              value="found"
              {...form1.register("type")}
              className="sr-only"
            />
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedType === "found" ? "bg-orange-50" : "bg-stone-100"}`}
            >
              {/* hands/found icon */}
              <svg
                className={`w-5 h-5 ${selectedType === "found" ? "text-orange-500" : "text-stone-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
            </div>
            <div>
              <p
                className={`text-xs font-bold tracking-widest uppercase mb-1 ${selectedType === "found" ? "text-stone-900" : "text-stone-400"}`}
              >
                Menemukan
              </p>
              <p
                className={`text-xs leading-relaxed ${selectedType === "found" ? "text-stone-600" : "text-stone-400"}`}
              >
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
          <label
            className={[
              "relative flex flex-col gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all",
              selectedType === "missing"
                ? "border-orange-500 bg-white shadow-md shadow-orange-100"
                : "border-stone-200 bg-white hover:border-stone-300",
            ].join(" ")}
          >
            <input
              type="radio"
              value="missing"
              {...form1.register("type")}
              className="sr-only"
            />
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedType === "missing" ? "bg-orange-50" : "bg-stone-100"}`}
            >
              <svg
                className={`w-5 h-5 ${selectedType === "missing" ? "text-orange-500" : "text-stone-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803zM13.5 10.5h-6"
                />
              </svg>
            </div>
            <div>
              <p
                className={`text-xs font-bold tracking-widest uppercase mb-1 ${selectedType === "missing" ? "text-stone-900" : "text-stone-400"}`}
              >
                Mencari
              </p>
              <p
                className={`text-xs leading-relaxed ${selectedType === "missing" ? "text-stone-600" : "text-stone-400"}`}
              >
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
              className={
                inputCls(!!form2.formState.errors.gender) +
                " cursor-pointer appearance-none"
              }
              defaultValue=""
            >
              <option value="" disabled>
                Pilih...
              </option>
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
            className={
              inputCls(!!form2.formState.errors.description) + " resize-none"
            }
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
            <p className="text-xs text-stone-400 font-medium">
              Buka pada Langkah 2
            </p>
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
